import { STATUS_META } from '../../lib/constraints.js'

const TONE_CLASSES = {
  red: 'bg-armit-coral text-white',
  amber: 'bg-armit-amber text-armit-bg',
  green: 'bg-armit-emerald text-white',
}

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${TONE_CLASSES[meta.tone]}`}
    >
      {meta.label}
    </span>
  )
}
