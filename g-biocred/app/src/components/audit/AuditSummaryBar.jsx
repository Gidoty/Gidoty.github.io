import { useState } from 'react'
import { buildAuditCsv, buildAuditJson, downloadFile } from '../../utils/auditExport.js'

export default function AuditSummaryBar({ auditLog, onClearAll }) {
  const [confirmingClear, setConfirmingClear] = useState(false)

  const first = auditLog[auditLog.length - 1]
  const latest = auditLog[0]

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text">
        {auditLog.length} calculations logged | First entry: {first?.timestamp} | Latest: {latest?.timestamp}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => downloadFile('gbiocred-audit-log.csv', buildAuditCsv(auditLog), 'text/csv')}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-panel"
        >
          Export Audit Log (CSV)
        </button>
        <button
          type="button"
          onClick={() => downloadFile('gbiocred-audit-log.json', buildAuditJson(auditLog), 'application/json')}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-panel"
        >
          Export Audit Log (JSON)
        </button>
        {confirmingClear ? (
          <div className="flex items-center gap-2 rounded-lg border border-danger px-2 py-1">
            <span className="text-xs text-danger">Clear all logs?</span>
            <button
              type="button"
              onClick={() => {
                onClearAll()
                setConfirmingClear(false)
              }}
              className="rounded bg-danger px-2 py-1 text-xs font-semibold text-white"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmingClear(false)}
              className="rounded border border-border px-2 py-1 text-xs text-muted"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingClear(true)}
            className="rounded-lg border border-danger px-3 py-1.5 text-xs font-semibold text-danger hover:bg-danger/10"
          >
            Clear All Logs
          </button>
        )}
      </div>
    </div>
  )
}
