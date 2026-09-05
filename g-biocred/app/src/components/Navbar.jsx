import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Leaf, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/calculator', label: 'Calculator' },
  { to: '/digester', label: 'Digester' },
  { to: '/emissions', label: 'Emissions' },
  { to: '/carbon', label: 'Carbon' },
  { to: '/digestate', label: 'Digestate' },
  { to: '/compare', label: 'Compare' },
  { to: '/audit', label: 'Audit' },
  { to: '/report', label: 'Report' },
]

function NavLinkItem({ to, label, onClick, className = '' }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `${className} text-sm font-medium transition-colors ${
          isActive ? 'text-accent' : 'text-muted hover:text-text'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-14 border-b border-border bg-header/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-accent" />
          <span className="flex flex-col leading-none">
            <span className="text-[20px] font-bold text-text">G-BioCred</span>
            <span className="text-[11px] text-muted">Agro-Waste · Energy · Carbon</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLinkItem key={link.to} to={link.to} label={link.label} />
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-text hover:bg-panel lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <Transition show={open}>
        <Dialog onClose={setOpen} className="relative z-50 lg:hidden">
          <TransitionChild
            enter="transition-opacity duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          </TransitionChild>

          <TransitionChild
            enter="transition duration-200"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition duration-150"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <DialogPanel className="fixed inset-y-0 right-0 flex w-72 flex-col gap-1 border-l border-border bg-panel p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-bold text-text">Menu</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md p-2 text-text hover:bg-card"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {NAV_LINKS.map((link) => (
                <NavLinkItem
                  key={link.to}
                  to={link.to}
                  label={link.label}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 hover:bg-card"
                />
              ))}
              <NavLinkItem
                to="/about"
                label="About"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 hover:bg-card"
              />
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>
    </header>
  )
}
