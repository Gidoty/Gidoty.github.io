import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="rounded-xl border border-white/10 bg-armit-card p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-armit-amber">{title}</h2>
        <ChevronDown
          size={18}
          className={`text-armit-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-4 space-y-4">{children}</div>}
    </section>
  )
}
