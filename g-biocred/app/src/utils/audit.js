export async function sha256Hex(value) {
  const json = typeof value === 'string' ? value : JSON.stringify(value)
  const bytes = new TextEncoder().encode(json)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function shortHash(hash) {
  if (!hash) return ''
  return `${hash.slice(0, 16)}…${hash.slice(-8)}`
}

export function formatWATTimestamp(date = new Date()) {
  const formatted = new Intl.DateTimeFormat('en-NG', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
  return `${formatted} WAT`
}
