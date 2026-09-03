import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/appshell/TopBar.jsx'
import Drawer from '../components/appshell/Drawer.jsx'
import PlaceholderPanel from '../components/appshell/PlaceholderPanel.jsx'
import MySubmittedReportsPanel from '../components/appshell/panels/MySubmittedReportsPanel.jsx'
import LiveHeatmapPanel from '../components/appshell/panels/LiveHeatmapPanel.jsx'
import IncidentFeedPanel from '../components/appshell/panels/IncidentFeedPanel.jsx'
import CleanupBoardPanel from '../components/appshell/panels/CleanupBoardPanel.jsx'
import ResponseTimeAnalyticsPanel from '../components/appshell/panels/ResponseTimeAnalyticsPanel.jsx'
import { DEFAULT_CATEGORY, DEFAULT_PARAMETER, findParameter, getCategory } from '../data/parameters.js'
import { loadRealReports, exportReportsToCsv } from '../utils/dashboardUtils.js'
import { exportEscalationCsv, isAwaitingOperatorResponse } from '../utils/trackerUtils.js'

const LAST_PARAM_KEY = 'hsse_last_param'
const MOBILE_BREAKPOINT = 768

const PANEL_COMPONENTS = {
  'my-submitted-reports': MySubmittedReportsPanel,
  'live-heatmap': LiveHeatmapPanel,
  'incident-feed': IncidentFeedPanel,
  'response-time-analytics': ResponseTimeAnalyticsPanel,
  'cleanup-status-board': CleanupBoardPanel,
}

const FULL_BLEED_PANELS = new Set(['live-heatmap', 'incident-feed'])

function loadLastParam() {
  try {
    const stored = JSON.parse(localStorage.getItem(LAST_PARAM_KEY))
    if (stored && findParameter(stored.parameter)) return stored
  } catch {
    // fall through to defaults
  }
  return { category: DEFAULT_CATEGORY, parameter: DEFAULT_PARAMETER }
}

export default function AppShell() {
  const navigate = useNavigate()
  const initial = useMemo(() => loadLastParam(), [])

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState(initial.category)
  const [activeParameterId, setActiveParameterId] = useState(initial.parameter)
  const [reports, setReports] = useState(() => loadRealReports())

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && drawerOpen) setDrawerOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawerOpen])

  useEffect(() => {
    const interval = setInterval(() => setReports(loadRealReports()), 30000)
    return () => clearInterval(interval)
  }, [])

  const activeCategory = getCategory(activeCategoryId) ?? getCategory(DEFAULT_CATEGORY)
  const activeParameterEntry = findParameter(activeParameterId)
  const activeParameter =
    activeParameterEntry?.parameter ?? findParameter(DEFAULT_PARAMETER).parameter

  const handleSelectParameter = (categoryId, parameterId) => {
    if (parameterId === 'submit-new-incident') {
      navigate('/report')
      setDrawerOpen(false)
      return
    }

    setActiveCategoryId(categoryId)
    setActiveParameterId(parameterId)
    localStorage.setItem(LAST_PARAM_KEY, JSON.stringify({ category: categoryId, parameter: parameterId }))

    if (window.innerWidth < MOBILE_BREAKPOINT) setDrawerOpen(false)
  }

  const overdueReports = reports.filter(isAwaitingOperatorResponse)
  const queuedCount = reports.filter((r) => r.status === 'queued').length

  const quickAction = useMemo(() => {
    const label = activeCategory.quickAction
    if (activeCategory.id === 'TRACK') {
      return { label, onClick: () => exportEscalationCsv(reports) }
    }
    if (activeCategory.id === 'DATA') {
      return { label, onClick: () => exportReportsToCsv(reports) }
    }
    if (activeCategory.id === 'REPORT' || activeCategory.id === 'MONITOR' || activeCategory.id === 'HEALTH') {
      return { label, onClick: () => navigate('/report') }
    }
    return { label, onClick: () => {}, disabled: true }
  }, [activeCategory, reports, navigate])

  const PanelComponent = PANEL_COMPONENTS[activeParameter.panel]

  return (
    <div className="fixed inset-0 flex flex-col bg-bg text-text">
      <TopBar
        drawerOpen={drawerOpen}
        onToggleDrawer={() => setDrawerOpen((prev) => !prev)}
        category={activeCategory}
        parameter={activeParameter}
        quickAction={quickAction}
        overdueReports={overdueReports}
      />

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeParameterId={activeParameterId}
        onSelectParameter={handleSelectParameter}
        reportsCount={reports.length}
        queuedCount={queuedCount}
      />

      {drawerOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 top-14 z-[150] bg-black/60 md:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`flex-1 overflow-hidden pt-14 transition-[margin] duration-300 ease-in-out ${
          drawerOpen ? 'md:ml-[300px]' : 'ml-0'
        }`}
      >
        <div
          key={activeParameterId}
          className={`panel-enter h-full ${
            FULL_BLEED_PANELS.has(activeParameter.panel) ? '' : 'overflow-y-auto p-4 sm:p-6'
          }`}
        >
          {PanelComponent ? (
            <PanelComponent />
          ) : (
            <PlaceholderPanel parameter={activeParameter} category={activeCategory} />
          )}
        </div>
      </div>
    </div>
  )
}
