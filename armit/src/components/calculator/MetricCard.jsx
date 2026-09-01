const ACCENTS = {
  teal: 'border-armit-teal/30',
  amber: 'border-armit-amber/30',
  neutral: 'border-white/10',
}

export default function MetricCard({ label, value, sub, accent = 'teal', valueClassName }) {
  return (
    <div className={`rounded-xl border bg-armit-card p-5 ${ACCENTS[accent]}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-armit-muted">{label}</div>
      <div className={`mt-2 text-2xl font-bold sm:text-[1.6rem] ${valueClassName || 'text-armit-text'}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-armit-muted">{sub}</div>}
    </div>
  )
}
