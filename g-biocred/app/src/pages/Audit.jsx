import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import LegalContextPanel from '../components/audit/LegalContextPanel.jsx'
import AuditSummaryBar from '../components/audit/AuditSummaryBar.jsx'
import AuditTable from '../components/audit/AuditTable.jsx'
import HashExplainer from '../components/audit/HashExplainer.jsx'
import { useBioCredStore } from '../store/BioCredStore.jsx'

export default function Audit() {
  const { state, removeAuditEntry, clearAuditLog } = useBioCredStore()
  const auditLog = state.auditLog

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="inline-block rounded-full border border-border bg-panel px-4 py-1.5 text-xs text-muted">
          SHA-256 via Web Crypto API · Nigerian Evidence Act 2011 ss.84–87 (Computer-generated
          evidence admissibility) · IPCC Methodology traceability
        </span>
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">Verification Audit Trail</h1>
        <p className="mt-2 text-muted">
          Every calculation logged with a tamper-evident SHA-256 hash — independently verifiable
        </p>
      </div>

      <div className="space-y-8">
        <LegalContextPanel />

        {auditLog.length > 0 && (
          <Link
            to="/report"
            className="inline-block rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:scale-[1.02]"
          >
            Generate Feasibility Report →
          </Link>
        )}

        {auditLog.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
            <ShieldX className="h-[60px] w-[60px] text-amber" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-semibold text-text">No calculations logged yet</p>
            <p className="mt-1 text-muted">Run a calculation to start your audit trail</p>
            <Link
              to="/calculator"
              className="mt-4 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white"
            >
              Go to Calculator →
            </Link>
          </div>
        ) : (
          <>
            <AuditSummaryBar auditLog={auditLog} onClearAll={clearAuditLog} />
            <AuditTable auditLog={auditLog} onDelete={removeAuditEntry} />
          </>
        )}

        <HashExplainer />
      </div>
    </div>
  )
}
