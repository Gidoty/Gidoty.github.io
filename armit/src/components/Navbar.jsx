import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/crude-advisor', label: 'Crude Advisor' },
  { to: '/constraint-simulator', label: 'Constraint Simulator' },
  { to: '/stress-tester', label: 'Stress Tester' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // Close the mobile menu on route change / resize back to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-armit-teal ${
      isActive ? 'text-armit-teal' : 'text-armit-muted'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-armit-bg/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex flex-col leading-tight" onClick={() => setOpen(false)}>
          <span className="text-xl font-bold tracking-tight text-armit-teal">ARMIT</span>
          <span className="text-[10px] font-medium text-armit-muted sm:text-xs">
            African Refinery Margin Intelligence Tool
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          className="text-armit-text lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-armit-panel px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
