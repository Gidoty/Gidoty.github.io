import { Link } from 'react-router-dom'
import { Menu, ChevronRight } from 'lucide-react'
import NotificationBell from './NotificationBell.jsx'

export default function TopBar({ drawerOpen, onToggleDrawer, category, parameter, quickAction, overdueReports }) {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] flex h-14 items-center gap-3 border-b border-border bg-bg px-3 sm:px-4">
      <button
        type="button"
        onClick={onToggleDrawer}
        aria-label={drawerOpen ? 'Close parameter drawer' : 'Open parameter drawer'}
        aria-expanded={drawerOpen}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-teal hover:bg-card"
      >
        <Menu className="h-6 w-6" />
      </button>

      <span className="hidden h-6 w-px bg-border sm:block" />

      <nav className="hidden min-w-0 items-center gap-1.5 text-sm text-muted sm:flex" aria-label="Breadcrumb">
        <Link to="/" className="shrink-0 font-medium hover:text-text">
          HSSE Tracker
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="shrink-0">{category.label}</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate font-bold text-text">{parameter.label}</span>
      </nav>

      <h1 className="min-w-0 flex-1 truncate text-center text-base font-bold text-text sm:hidden">
        {parameter.label}
      </h1>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {quickAction && (
          <button
            type="button"
            onClick={quickAction.onClick}
            disabled={quickAction.disabled}
            className="hidden min-h-[40px] items-center rounded-lg bg-teal px-3 text-xs font-bold text-white hover:bg-teal/90 disabled:cursor-not-allowed disabled:opacity-40 sm:flex"
          >
            {quickAction.label}
          </button>
        )}
        <NotificationBell overdueReports={overdueReports} />
      </div>
    </header>
  )
}
