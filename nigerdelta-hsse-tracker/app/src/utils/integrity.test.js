import { describe, expect, it } from 'vitest'
import {
  canonicalize,
  sha256Hex,
  buildEvidencePayload,
  sealReport,
  appendEvent,
  verifyReport,
  markLegacy,
  CANONICALIZATION_VERSION,
  LEGACY_CANONICALIZATION,
} from './integrity.js'

function minimalReport(overrides = {}) {
  return {
    id: 'r1',
    submittedAt: '2026-01-01T00:00:00.000Z',
    incident: { type: 'gas_flare', subType: null, severity: 'serious', duration: 'ongoing', dateTime: '2026-01-01T00:00:00.000Z', description: 'Test incident description' },
    location: { gps: { lat: 4.5, lng: 6.5, accuracy: 10, capturedAt: 1 }, display: { lat: 4.5, lng: 6.5 }, state: 'Rivers', lga: 'Gokana', landmark: null },
    evidence: { photos: [], photoCount: 0 },
    health: { healthImpact: false, symptoms: [], affectedCount: null },
    audit: { consentVersion: 'NDPA-2023-v1', language: 'en', appVersion: 'test' },
    regulatory: { nosdraNotified: false, cleanupStatus: 'pending' },
    ...overrides,
  }
}

describe('canonicalize', () => {
  it('sorts object keys recursively regardless of insertion order', () => {
    const a = canonicalize({ b: 1, a: { d: 2, c: 3 } })
    const b = canonicalize({ a: { c: 3, d: 2 }, b: 1 })
    expect(a).toBe(b)
    expect(a).toBe('{"a":{"c":3,"d":2},"b":1}')
  })

  it('preserves array order (arrays are not sorted)', () => {
    expect(canonicalize([3, 1, 2])).toBe('[3,1,2]')
  })

  it('treats undefined and null the same way, as JSON null', () => {
    expect(canonicalize(undefined)).toBe('null')
    expect(canonicalize(null)).toBe('null')
  })

  it('throws on non-finite numbers rather than silently emitting NaN/Infinity', () => {
    expect(() => canonicalize(Number.NaN)).toThrow()
    expect(() => canonicalize(Number.POSITIVE_INFINITY)).toThrow()
  })

  it('produces stable output for -0 (no negative zero artifact)', () => {
    expect(canonicalize(-0)).toBe('0')
  })
})

describe('sha256Hex', () => {
  it('matches a known SHA-256 test vector', async () => {
    // SHA-256("abc") is a standard published test vector (FIPS 180-4).
    const hash = await sha256Hex('abc')
    expect(hash).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })
})

describe('buildEvidencePayload', () => {
  it('excludes contact details, user agent, and regulatory/corroboration state', () => {
    const report = minimalReport()
    const payload = buildEvidencePayload(report, [])
    const serialized = JSON.stringify(payload)
    expect(serialized).not.toContain('regulatory')
    expect(serialized).not.toContain('nosdraNotified')
    expect(payload).not.toHaveProperty('contact')
    expect(payload).not.toHaveProperty('userAgent')
  })

  it('includes the immutable evidence fields', () => {
    const report = minimalReport()
    const payload = buildEvidencePayload(report, ['photohash1'])
    expect(payload.incident.type).toBe('gas_flare')
    expect(payload.location.state).toBe('Rivers')
    expect(payload.photoHashes).toEqual(['photohash1'])
    expect(payload.consentVersion).toBe('NDPA-2023-v1')
    expect(payload.appVersion).toBe('test')
  })
})

describe('sealReport / verifyReport round trip', () => {
  it('a freshly sealed report verifies as valid with an empty event chain', async () => {
    const sealed = await sealReport(minimalReport())
    expect(sealed.integrity.canonicalization).toBe(CANONICALIZATION_VERSION)
    expect(sealed.integrity.payloadHash).toMatch(/^[0-9a-f]{64}$/)
    expect(sealed.events).toEqual([])

    const result = await verifyReport(sealed)
    expect(result.payloadValid).toBe(true)
    expect(result.eventChainValid).toBe(true)
  })

  it('detects a change to a hashed evidence field', async () => {
    const sealed = await sealReport(minimalReport())
    const tampered = { ...sealed, incident: { ...sealed.incident, description: 'A different description entirely' } }
    const result = await verifyReport(tampered)
    expect(result.payloadValid).toBe(false)
  })

  it('detects a change to a photo (photo hash mismatch)', async () => {
    const withPhoto = await sealReport(minimalReport({ evidence: { photos: ['data:image/jpeg;base64,AAAA'], photoCount: 1 } }))
    const tamperedPhoto = { ...withPhoto, evidence: { ...withPhoto.evidence, photos: ['data:image/jpeg;base64,BBBB'] } }
    const result = await verifyReport(tamperedPhoto)
    expect(result.payloadValid).toBe(false)
  })

  it('does not flag contact-field or regulatory-field changes as tampering', async () => {
    const sealed = await sealReport(minimalReport())
    const withRegulatoryChange = { ...sealed, regulatory: { ...sealed.regulatory, nosdraNotified: true } }
    const result = await verifyReport(withRegulatoryChange)
    expect(result.payloadValid).toBe(true)
  })
})

describe('event chain (appendEvent / verifyReport)', () => {
  it('builds a hash chain where each event links to the previous eventHash', async () => {
    let report = await sealReport(minimalReport())
    report = await appendEvent(report, 'nosdra_notified', { notifiedAt: '2026-01-02T00:00:00.000Z' })
    report = await appendEvent(report, 'cleanup_status_changed', { status: 'in_progress' })

    expect(report.events).toHaveLength(2)
    expect(report.events[0].prevEventHash).toBeNull()
    expect(report.events[1].prevEventHash).toBe(report.events[0].eventHash)

    const result = await verifyReport(report)
    expect(result.eventChainValid).toBe(true)
    expect(result.details.eventCount).toBe(2)
  })

  it('detects a broken chain when an event is altered after the fact', async () => {
    let report = await sealReport(minimalReport())
    report = await appendEvent(report, 'nosdra_notified', { notifiedAt: '2026-01-02T00:00:00.000Z' })
    const tampered = {
      ...report,
      events: [{ ...report.events[0], data: { notifiedAt: '2099-01-01T00:00:00.000Z' } }],
    }
    const result = await verifyReport(tampered)
    expect(result.eventChainValid).toBe(false)
  })

  it('detects an event chain with a broken link (wrong prevEventHash)', async () => {
    let report = await sealReport(minimalReport())
    report = await appendEvent(report, 'nosdra_notified', { notifiedAt: '2026-01-02T00:00:00.000Z' })
    report = await appendEvent(report, 'cleanup_status_changed', { status: 'in_progress' })
    const tampered = { ...report, events: [report.events[0], { ...report.events[1], prevEventHash: 'wrong-hash' }] }
    const result = await verifyReport(tampered)
    expect(result.eventChainValid).toBe(false)
  })
})

describe('legacy records', () => {
  it('markLegacy tags a record with no integrity block and does not compute a canonical hash', () => {
    const legacy = markLegacy({ ...minimalReport(), audit: { ...minimalReport().audit, reportHash: 'old-hash-123' } })
    expect(legacy.integrity.canonicalization).toBe(LEGACY_CANONICALIZATION)
    expect(legacy.integrity.payloadHash).toBe('old-hash-123')
  })

  it('markLegacy is a no-op for a record that already has an integrity block', async () => {
    const sealed = await sealReport(minimalReport())
    const result = markLegacy(sealed)
    expect(result).toBe(sealed)
  })

  it('verifyReport refuses to verify a legacy record instead of guessing', () => {
    const legacy = markLegacy(minimalReport())
    return verifyReport(legacy).then((result) => {
      expect(result.payloadValid).toBeNull()
      expect(result.eventChainValid).toBeNull()
    })
  })
})
