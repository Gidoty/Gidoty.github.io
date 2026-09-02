const REPORTS_KEY = 'hsse_reports'
const CONSENT_KEY = 'hsse_consent'
const DRAFT_KEY = 'hsse_report_draft'
const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const COMPRESS_TARGET_BYTES = 1 * 1024 * 1024

export function getConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY))
  } catch {
    return null
  }
}

export function setConsent(anonymousMode) {
  const consent = {
    consent: true,
    anonymousMode,
    timestamp: Date.now(),
    version: 'NDPA-2023-v1',
  }
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
  return consent
}

export function saveDraft(draft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  } catch {
    // sessionStorage unavailable or full — the draft is a convenience, not critical.
  }
}

export function loadDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY))
  } catch {
    return null
  }
}

export function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY)
}

export function generateReferenceNumber() {
  return `HSSE-${Date.now().toString(36).toUpperCase()}`
}

function fileToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
}

export async function compressImage(file) {
  if (file.size <= COMPRESS_TARGET_BYTES) {
    return fileToDataUrl(file)
  }

  const originalDataUrl = await fileToDataUrl(file)
  const img = await loadImage(originalDataUrl)

  const maxDimension = 1920
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

  let quality = 0.7
  let blob = await canvasToBlob(canvas, quality)
  while (blob && blob.size > COMPRESS_TARGET_BYTES && quality > 0.3) {
    quality -= 0.1
    blob = await canvasToBlob(canvas, quality)
  }

  return fileToDataUrl(blob ?? file)
}

export function isPhotoTooLarge(file) {
  return file.size > MAX_PHOTO_BYTES
}

export function dataUrlByteSize(dataUrl) {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0
  return Math.round((base64.length * 3) / 4) - padding
}

export async function hashReport(report) {
  const { audit, ...rest } = report
  const { reportHash: _unused, ...auditWithoutHash } = audit
  const hashable = { ...rest, audit: auditWithoutHash }
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(JSON.stringify(hashable)),
  )
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function saveReport(report) {
  let reports = []
  try {
    reports = JSON.parse(localStorage.getItem(REPORTS_KEY)) ?? []
  } catch {
    reports = []
  }
  reports.push(report)
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
}
