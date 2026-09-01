import { Construction } from 'lucide-react'

export default function PlaceholderPage({ title }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-white/5 bg-armit-card px-8 py-12 text-center shadow-lg">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-armit-teal/10 text-armit-teal">
          <Construction size={28} />
        </div>
        <h1 className="text-xl font-semibold text-armit-text">
          Coming in next prompt — {title}
        </h1>
        <p className="text-sm text-armit-muted">
          This module is under active development and will be built out in a following step.
        </p>
      </div>
    </div>
  )
}
