import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function InterventionCard({ title, description, icon: Icon, accentColor, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section
      className="rounded-xl border border-white/10 border-l-4 bg-armit-card p-5"
      style={{ borderLeftColor: accentColor }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
          >
            <Icon size={18} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-armit-text">{title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-armit-muted">{description}</p>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`mt-1 shrink-0 text-armit-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && <div className="mt-5">{children}</div>}
    </section>
  )
}
