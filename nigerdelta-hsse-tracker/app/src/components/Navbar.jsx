import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Droplet, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/report', label: 'Report Incident' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/tracker', label: 'Tracker' },
  { to: '/methane', label: 'Methane Calculator' },
  { to: '/data', label: 'Open Data' },
  { to: '/about', label: 'About' },
]

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/15 ring-1 ring-teal/40">
        <Droplet className="h-5 w-5 text-teal" fill="currentColor" fillOpacity={0.25} />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold text-text">NigerDelta HSSE Tracker</span>
        <span className="text-xs text-muted">Community Environmental Monitoring</span>
      </span>
    </NavLink>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-teal ${
      isActive ? 'text-teal' : 'text-muted'
    }`

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/95 backdrop-blur">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-text lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`ml-auto flex h-full w-72 max-w-[80vw] flex-col gap-1 bg-panel px-6 py-6 shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-bold text-text">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:text-text"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-teal/15 text-teal' : 'text-muted hover:bg-card hover:text-text'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}
