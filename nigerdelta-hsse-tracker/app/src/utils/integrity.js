// Canonical JSON serialization and SHA-256 hashing for the evidentiary
// record. Mutable state (NOSDRA notification, corroboration, cleanup, etc.)
// lives in an append-only, hash-chained events array kept separate from the
// immutable evidence payload, so later mutations never require re-hashing
// the original evidence.
//
// This is a tamper-evidence mechanism only: it detects later changes to a
// saved record. It does not establish that a report is true, who made it,
// or its legal admissibility.

export const HASH_ALGORITHM = 'SHA-256'
export const CANONICALIZATION_VERSION = 'hsse-c14n-v1'
export const LEGACY_CANONICALIZATION = 'legacy-v0-noncanonical'

// Deterministic JSON: object keys sorted recursively, no whitespace, UTF-8
// via the caller's TextEncoder. Numbers use JS's native (shortest
// round-trip) string conversion — validation/verify_export.py mirrors this
// with Python's repr()-based float formatting for the numeric fields this
// app actually produces (coordinates, timestamps, counts); it does not
// attempt to match JS number formatting for arbitrary floats.
export function canonicalize(value) {
  if (value === undefined || value === null) return 'null'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new RangeError('Cannot canonicalize a non-finite number')
    return JSON.stringify(value)
  }
  if (typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`
  if (typeof value === 'object') {
    const keys = Object.keys(value).sort()
    return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize(value[k])}`).join(',')}}`
  }
  throw new TypeError(`Cannot canonicalize value of type ${typeof value}`)
}

export async function sha256Hex(text) {
  const buffer = await crypto.subtle.digest(HASH_ALGORITHM, new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function hashPhotos(photos = []) {
  return Promise.all(photos.map((photo) => sha256Hex(photo)))
}

// The immutable evidence payload: everything that must never change once a
// report is submitted. Explicitly excludes contact details (name, phone),
// user agent, and every field under `regulatory`/`corroboration`, since
// those are expected to change after submission and are tracked instead in
// the append-only events array.
export function buildEvidencePayload(report, photoHashes) {
  return {
    incident: {
      type: report.incident.type,
      subType: report.incident.subType ?? null,
      severity: report.incident.severity,
      duration: report.incident.duration ?? null,
      dateTime: report.incident.dateTime,
      description: report.incident.description ?? '',
    },
    location: {
      gps: report.location.gps ?? null,
      display: report.location.display ?? null,
      state: report.location.state ?? null,
      lga: report.location.lga ?? null,
      landmark: report.location.landmark ?? null,
    },
    submittedAt: report.submittedAt,
    photoHashes,
    health: {
      healthImpact: report.health?.healthImpact ?? null,
      symptoms: report.health?.symptoms ?? [],
      affectedCount: report.health?.affectedCount ?? null,
    },
    language: report.audit?.language ?? null,
    consentVersion: report.audit?.consentVersion ?? null,
    appVersion: report.audit?.appVersion ?? null,
  }
}

// Computes and attaches the integrity block to a freshly-submitted report.
// Call once, at submission time, before the report is ever saved.
export async function sealReport(report) {
  const photoHashes = await hashPhotos(report.evidence?.photos ?? [])
  const payload = buildEvidencePayload(report, photoHashes)
  const payloadHash = await sha256Hex(canonicalize(payload))
  return {
    ...report,
    integrity: {
      algorithm: HASH_ALGORITHM,
      canonicalization: CANONICALIZATION_VERSION,
      payloadHash,
      photoHashes,
      hashedAt: new Date().toISOString(),
    },
    events: [],
  }
}

function eventSigningPayload(event) {
  return { prevEventHash: event.prevEventHash, type: event.type, timestamp: event.timestamp, data: event.data }
}

// Appends a mutable-state event (NOSDRA notification, corroboration status
// change, cleanup update, etc.) to the report's hash-chained event log.
// Returns a new report object; does not mutate the input.
export async function appendEvent(report, type, data) {
  const events = report.events ?? []
  const prevEventHash = events.length > 0 ? events[events.length - 1].eventHash : null
  const timestamp = new Date().toISOString()
  const eventHash = await sha256Hex(canonicalize(eventSigningPayload({ prevEventHash, type, timestamp, data })))
  const event = { id: crypto.randomUUID(), type, timestamp, prevEventHash, eventHash, data }
  return { ...report, events: [...events, event] }
}

// Re-derives the payload hash and the event-chain hashes from a report's
// current content and compares them against the stored values. Read-only.
export async function verifyReport(report) {
  if (!report.integrity || report.integrity.canonicalization === LEGACY_CANONICALIZATION) {
    return {
      payloadValid: null,
      eventChainValid: null,
      details: { reason: 'Legacy record — predates canonical hashing and cannot be re-verified.' },
    }
  }

  const photoHashes = await hashPhotos(report.evidence?.photos ?? [])
  const payload = buildEvidencePayload(report, photoHashes)
  const recomputedPayloadHash = await sha256Hex(canonicalize(payload))
  const payloadValid = recomputedPayloadHash === report.integrity.payloadHash

  let eventChainValid = true
  let prevEventHash = null
  const events = report.events ?? []
  for (const event of events) {
    if (event.prevEventHash !== prevEventHash) {
      eventChainValid = false
      break
    }
    const recomputedEventHash = await sha256Hex(canonicalize(eventSigningPayload(event)))
    if (recomputedEventHash !== event.eventHash) {
      eventChainValid = false
      break
    }
    prevEventHash = event.eventHash
  }

  return {
    payloadValid,
    eventChainValid,
    details: {
      recomputedPayloadHash,
      storedPayloadHash: report.integrity.payloadHash,
      eventCount: events.length,
    },
  }
}

// Builds the single-file JSON export a reporter can hand to anyone else —
// the device-local architecture has no server to submit to, so getting a
// report to NOSDRA, a journalist, or anyone besides the reporter is always
// this explicit export/share action, never automatic.
export function buildSubmissionExport(report) {
  return {
    exportFormat: 'nigerdelta-hsse-tracker-report-v1',
    exportedAt: new Date().toISOString(),
    record: report,
    verification: {
      note: 'Recompute the payload hash from `record` using the canonicalization documented in this project’s validation/verify_export.py, and compare it to record.integrity.payloadHash.',
      algorithm: report.integrity?.algorithm ?? null,
      canonicalization: report.integrity?.canonicalization ?? null,
      payloadHash: report.integrity?.payloadHash ?? null,
    },
  }
}

export function downloadSubmissionExport(report) {
  const payload = buildSubmissionExport(report)
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${report.referenceNumber}-export.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Marks a pre-existing (pre-integrity-rework) record as legacy without
// attempting to compute a canonical hash for content never captured under
// this scheme. Idempotent — a report that already has an `integrity` block
// is returned unchanged.
export function markLegacy(report) {
  if (report.integrity) return report
  return {
    ...report,
    integrity: {
      algorithm: null,
      canonicalization: LEGACY_CANONICALIZATION,
      payloadHash: report.audit?.reportHash ?? null,
      photoHashes: [],
      hashedAt: null,
    },
    events: report.events ?? [],
  }
}
