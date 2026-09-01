import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function PageCta({ to, children, variant = 'primary' }) {
  const base = 'inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition'
  const styles =
    variant === 'primary'
      ? 'bg-armit-teal text-armit-bg hover:bg-armit-teal/90'
      : 'border border-white/10 bg-armit-card text-armit-text hover:border-armit-teal/40 hover:text-armit-teal'

  return (
    <Link to={to} className={`${base} ${styles}`}>
      {children}
      <ArrowRight size={16} />
    </Link>
  )
}
