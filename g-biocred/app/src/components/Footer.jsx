import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

const PAGE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/digester', label: 'Digester' },
  { to: '/emissions', label: 'Emissions' },
  { to: '/carbon', label: 'Carbon' },
  { to: '/digestate', label: 'Digestate' },
  { to: '/compare', label: 'Compare' },
  { to: '/audit', label: 'Audit' },
  { to: '/report', label: 'Report' },
  { to: '/about', label: 'About' },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-header">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-accent" />
            <span className="text-lg font-bold text-text">G-BioCred</span>
          </Link>

          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {PAGE_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-muted">© 2026 Gideon Owhonda · NLNG Centre · UNIPORT</p>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          IPCC Methodology · Gold Standard · CDM · Article 6.4 · Nigerian Evidence Act 2011
        </div>
      </div>
    </footer>
  )
}
