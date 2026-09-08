// Shared styling for every calculation-chain step across the app —
// background #0D1F0E, 3px green left border, monospace text in muted
// green, 12px/16px padding — so a formula reads identically whether it
// appears on the calculator, emissions, or digester page.
export default function FormulaBlock({ title, note, className = '', children }) {
  return (
    <div className={`rounded-md border-l-[3px] border-accent bg-bg px-4 py-3 ${className}`}>
      {title && <p className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>}
      <div className={`space-y-1 font-mono text-sm text-muted ${title ? 'mt-2' : ''}`}>{children}</div>
      {note && <p className="mt-1 font-sans text-xs text-cyan">{note}</p>}
    </div>
  )
}
