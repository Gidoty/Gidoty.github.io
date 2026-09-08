import { useState } from 'react'
import { Copy, Check, X } from 'lucide-react'
import { normalizeAuditEntry, verifyAuditEntry } from '../../utils/auditDisplay.js'
import { shortHash } from '../../utils/audit.js'
import { formatDecimal } from '../../utils/format.js'

function humanizeKey(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function formatValue(value) {
  if (value == null) return '—'
  if (typeof value === 'number') return formatDecimal(value, Number.isInteger(value) ? 0 : 3)
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}

function KeyValueGrid({ data, depth = 0 }) {
  if (data == null || typeof data !== 'object') return <p className="text-sm text-muted">{formatValue(data)}</p>
  return (
    <dl className={`grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3 ${depth > 0 ? 'mt-1 border-l border-border pl-3' : ''}`}>
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="contents">
          <dt className="text-xs text-muted">{humanizeKey(key)}</dt>
          <dd className="col-span-1 text-text sm:col-span-2">
            {value != null && typeof value === 'object' && !Array.isArray(value) ? (
              <KeyValueGrid data={value} depth={depth + 1} />
            ) : Array.isArray(value) ? (
              `${value.length} item(s)`
            ) : (
              formatValue(value)
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function AuditRow({ entry, index, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [verifyState, setVerifyState] = useState(null)
  const [copied, setCopied] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const display = normalizeAuditEntry(entry)

  const handleVerify = async () => {
    setVerifyState('checking')
    const ok = await verifyAuditEntry(entry)
    setVerifyState(ok ? 'match' : 'mismatch')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entry.hash)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <>
      <tr className="border-t border-border">
        <td className="sticky left-0 z-10 bg-card py-2 pl-4 pr-4 text-muted">{index}</td>
        <td className="py-2 px-4">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${display.badgeClass}`}>{display.label}</span>
        </td>
        <td className="py-2 px-4 text-text">{display.substrateName}</td>
        <td className="py-2 px-4 text-muted">{display.inputKg != null ? formatDecimal(display.inputKg, 1) : '—'}</td>
        <td className="py-2 px-4 text-text">{display.keyResult}</td>
        <td className="py-2 px-4 text-muted">{entry.timestamp}</td>
        <td className="py-2 px-4">
          <div className="flex items-center gap-1 font-mono text-xs text-muted" title={entry.hash}>
            {shortHash(entry.hash)}
            <button type="button" onClick={handleCopy} className="rounded p-1 hover:text-text" aria-label="Copy hash">
              {copied ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
            </button>
          </div>
        </td>
        <td className="py-2 px-4">
          <button
            type="button"
            onClick={handleVerify}
            className="rounded-lg border border-cyan px-2 py-1 text-xs font-semibold text-cyan hover:bg-cyan/10"
          >
            Verify
          </button>
          {verifyState === 'checking' && <p className="mt-1 text-[11px] text-muted">Checking…</p>}
          {verifyState === 'match' && (
            <p className="mt-1 text-[11px] text-accent">✓ Verified — hash matches. Calculation has not been modified.</p>
          )}
          {verifyState === 'mismatch' && (
            <p className="mt-1 text-[11px] text-danger">✗ Hash mismatch — data may have been altered.</p>
          )}
        </td>
        <td className="py-2 px-4">
          <div className="flex flex-col gap-1">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="text-xs font-semibold text-accent hover:underline">
              {expanded ? 'Hide' : 'View'}
            </button>
            {confirmingDelete ? (
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => onDelete(entry.id)} className="text-xs font-semibold text-danger hover:underline">
                  Confirm
                </button>
                <button type="button" onClick={() => setConfirmingDelete(false)} className="text-muted">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="text-xs font-semibold text-muted hover:text-danger"
              >
                Delete
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t border-border bg-panel/50">
          <td colSpan={9} className="p-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Inputs</p>
                <KeyValueGrid data={entry.inputs} />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Results</p>
                <KeyValueGrid data={entry.results ?? entry.result} />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Audit</p>
                <dl className="space-y-1 text-sm">
                  <div>
                    <dt className="text-xs text-muted">Hash algorithm</dt>
                    <dd className="text-text">SHA-256 (FIPS 180-4)</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Full hash</dt>
                    <dd className="break-all font-mono text-xs text-text">{entry.hash}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Generated at</dt>
                    <dd className="text-text">{entry.timestamp}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">G-BioCred version</dt>
                    <dd className="text-text">1.0</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Methodology references</dt>
                    <dd className="text-text">
                      IPCC 2006 Vol.4 Ch.10 · IPCC 2006 Vol.5 Ch.3 · IPCC AR6 WGI (2021) Table
                      7.SM.7
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AuditTable({ auditLog, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <th className="sticky left-0 z-10 bg-card py-3 pl-4 pr-4">#</th>
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4">Substrate</th>
            <th className="py-3 px-4">Input (kg)</th>
            <th className="py-3 px-4">Key Result</th>
            <th className="py-3 px-4">Timestamp (WAT)</th>
            <th className="py-3 px-4">SHA-256 Hash</th>
            <th className="py-3 px-4">Verify</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {auditLog.map((entry, i) => (
            <AuditRow key={entry.id} entry={entry} index={auditLog.length - i} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
