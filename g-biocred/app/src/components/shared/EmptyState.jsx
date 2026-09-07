import { Leaf } from 'lucide-react'

export default function EmptyState({ message }) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
      <Leaf className="h-[60px] w-[60px] text-accent" strokeWidth={1.5} />
      <p className="mt-4 max-w-sm text-muted">{message}</p>
    </div>
  )
}
