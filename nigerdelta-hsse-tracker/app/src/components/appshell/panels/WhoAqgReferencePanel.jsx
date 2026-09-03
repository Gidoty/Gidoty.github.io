import { ShieldCheck } from 'lucide-react'
import PanelHeader from './shared/PanelHeader.jsx'
import { WHO_AQG_POLLUTANTS, WHO_EXCEEDANCE_SUMMARY } from '../../../data/whoAqgData.js'

export default function WhoAqgReferencePanel() {
  return (
    <div className="mx-auto max-w-4xl">
      <PanelHeader icon={ShieldCheck} color="#00A8CC" title="WHO Air Quality Guidelines" badges={['WHO 2021 AQG', 'Global Update']} />

      <p className="rounded-lg border border-border bg-card p-4 text-sm leading-normal text-muted">
        The World Health Organization's 2021 Global Air Quality Guidelines set science-based limits for
        the pollutants most associated with gas flaring and oil industry activity. The reference cards
        below pair each guideline with documented findings from communities in the Niger Delta.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {WHO_AQG_POLLUTANTS.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-bold text-teal">{p.name}</h3>
              <span className="text-xs text-muted">{p.fullName}</span>
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">WHO Guideline</p>
            <p className="mt-1 text-sm text-text">{p.guideline}</p>

            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">Niger Delta Context</p>
            <p className="mt-1 text-sm text-text">{p.nigerDeltaContext}</p>
            <p className="mt-1 text-[11px] italic text-muted">{p.source}</p>

            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">Health Effects</p>
            <p className="mt-1 text-sm text-muted">{p.healthEffects}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-danger/40 bg-danger/5 p-4 text-sm leading-normal text-text">
        <strong className="text-danger">Exceedance summary:</strong> {WHO_EXCEEDANCE_SUMMARY.text}
        <p className="mt-2 text-[11px] italic text-muted">{WHO_EXCEEDANCE_SUMMARY.source}</p>
      </div>
    </div>
  )
}
