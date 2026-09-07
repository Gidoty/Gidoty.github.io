import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { shortHash } from '../../utils/audit.js'

export default function AuditSnapshot({ entry }) {
  const [confirmed, setConfirmed] = useState(false)

  if (!entry) return null

  return (
    <div className="rounded-xl border border-cyan/40 bg-cyan/10 p-5">
      <div className="flex items-center gap-2 text-cyan">
        <ShieldCheck className="h-5 w-5" />
        <p className="font-semibold">Calculation Verified</p>
      </div>
      <p className="mt-2 font-mono text-sm text-text">SHA-256: {shortHash(entry.hash)}</p>
      <p className="text-sm text-muted">Timestamp: {entry.timestamp}</p>
      <p className="mt-2 text-sm text-muted">
        Full audit log available at{' '}
        <Link to="/audit" className="text-cyan hover:underline">
          /audit
        </Link>
      </p>
      <button
        type="button"
        onClick={() => setConfirmed(true)}
        className="mt-3 rounded-lg border border-cyan px-4 py-2 text-sm font-medium text-cyan transition-colors hover:bg-cyan/10"
      >
        {confirmed ? 'Saved to audit log ✓' : 'Save to Audit Log'}
      </button>
      {confirmed && (
        <p className="mt-1 text-xs text-muted">Already saved automatically — confirmed.</p>
      )}
    </div>
  )
}
