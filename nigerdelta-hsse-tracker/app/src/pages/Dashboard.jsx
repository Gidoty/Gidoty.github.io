import { useEffect, useMemo, useState } from 'react'
import { Download, SlidersHorizontal, X } from 'lucide-react'
import StatsBar from '../components/dashboard/StatsBar.jsx'
import FilterPanel from '../components/dashboard/FilterPanel.jsx'
import IncidentFeed from '../components/dashboard/IncidentFeed.jsx'
import MapView from '../components/dashboard/MapView.jsx'
import CorroborationModal from '../components/dashboard/CorroborationModal.jsx'
import ChartsPanel from '../components/dashboard/ChartsPanel.jsx'
import { generateDemoReports } from '../data/demoReports.js'
import {
  loadRealReports,
  updateReportInStorage,
  defaultFilters,
  filterReports,
  sortReports,
  exportReportsToCsv,
} from '../utils/dashboardUtils.js'

const REFRESH_INTERVAL_MS = 30000
const DEMO_THRESHOLD = 3

export default function Dashboard() {
  const [realReports, setRealReports] = useState(() => loadRealReports())
  const [demoReports, setDemoReports] = useState(() => generateDemoReports())
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const [filters, setFilters] = useState(defaultFilters())
  const [sortBy, setSortBy] = useState('newest')
  const [selectedReportId, setSelectedReportId] = useState(null)
  const [corroborationReport, setCorroborationReport] = useState(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRealReports(loadRealReports())
      setLastUpdated(new Date())
    }, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  const usingDemoData = realReports.length < DEMO_THRESHOLD
  const combinedReports = useMemo(
    () => (usingDemoData ? [...realReports, ...demoReports] : realReports),
    [realReports, demoReports, usingDemoData],
  )

  const filteredReports = useMemo(() => filterReports(combinedReports, filters), [combinedReports, filters])
  const sortedReports = useMemo(() => sortReports(filteredReports, sortBy), [filteredReports, sortBy])

  const handleFilterChange = (patch) => setFilters((prev) => ({ ...prev, ...patch }))
  const handleResetFilters = () => setFilters(defaultFilters())

  const handleSelectReport = (id) => {
    setSelectedReportId(null)
    window.setTimeout(() => setSelectedReportId(id), 0)
    setMobileFiltersOpen(false)
  }

  const handleCorroborate = (report) => setCorroborationReport(report)

  const handleConfirmCorroboration = (entry) => {
    const report = corroborationReport
    if (!report) return

    if (report.incident?.isDemoData) {
      setDemoReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? {
                ...r,
                corroboration: {
                  count: r.corroboration.count + 1,
                  corroborators: [...r.corroboration.corroborators, entry],
                },
              }
            : r,
        ),
      )
    } else {
      const updated = updateReportInStorage(report.id, (r) => ({
        ...r,
        corroboration: {
          count: (r.corroboration?.count ?? 0) + 1,
          corroborators: [...(r.corroboration?.corroborators ?? []), entry],
        },
      }))
      setRealReports(updated)
    }
    setLastUpdated(new Date())
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 px-4 pt-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">Live Heatmap Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            Community-submitted incidents across the Niger Delta
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportReportsToCsv(sortedReports)}
          className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg border border-teal px-4 text-sm font-bold text-teal hover:bg-teal/10"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export Data (CSV)</span>
          <span className="sm:hidden">Export</span>
        </button>
      </div>
      <p className="px-4 pt-2 text-xs text-muted sm:px-6 lg:px-8">
        Exported data uses approximate locations only (±1km). Full coordinates are stored securely
        and only released under a formal data access agreement.
        {usingDemoData && ' Demo data shown on this dashboard is excluded from export.'}
      </p>

      <div className="mt-5">
        <StatsBar reports={realReports} lastUpdated={lastUpdated} />
      </div>

      <button
        type="button"
        onClick={() => setMobileFiltersOpen(true)}
        className="mx-4 mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-bold text-text lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      <div className="flex flex-col lg:h-[calc(100vh-140px)] lg:flex-row">
        <div className="order-2 border-border lg:order-1 lg:h-full lg:w-[30%] lg:overflow-y-auto lg:border-r">
          <div className="hidden lg:sticky lg:top-0 lg:z-10 lg:block">
            <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />
          </div>
          <IncidentFeed
            reports={sortedReports}
            totalCount={combinedReports.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onSelectReport={handleSelectReport}
          />
        </div>

        <div className="order-1 lg:order-2 lg:w-[70%]">
          <MapView
            reports={sortedReports}
            onCorroborate={handleCorroborate}
            selectedReportId={selectedReportId}
            showDemoBanner={usingDemoData && !demoBannerDismissed}
            onDismissDemoBanner={() => setDemoBannerDismissed(true)}
          />
        </div>
      </div>

      <ChartsPanel reports={sortedReports} />

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-2xl bg-panel">
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-panel px-4 py-3">
              <span className="text-sm font-bold text-text">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />
          </div>
        </div>
      )}

      {corroborationReport && (
        <CorroborationModal
          report={corroborationReport}
          onConfirm={handleConfirmCorroboration}
          onClose={() => setCorroborationReport(null)}
        />
      )}
    </div>
  )
}
