import { useEffect, useMemo, useState } from 'react'
import { generateDemoReports } from '../data/demoReports.js'
import { loadRealReports, updateReportInStorage } from '../utils/dashboardUtils.js'

const REFRESH_INTERVAL_MS = 30000
const DEMO_THRESHOLD = 3

export function useReportsWithDemo() {
  const [realReports, setRealReports] = useState(() => loadRealReports())
  const [demoReports, setDemoReports] = useState(() => generateDemoReports())
  const [demoBannerDismissed, setDemoBannerDismissed] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [corroborationReport, setCorroborationReport] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setRealReports(loadRealReports())
      setLastUpdated(new Date())
    }, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let debounceTimer = null
    const handleDataUpdated = (event) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        setRealReports(event.detail.reports)
        setLastUpdated(new Date())
      }, 300)
    }
    window.addEventListener('hsse-data-updated', handleDataUpdated)
    return () => {
      clearTimeout(debounceTimer)
      window.removeEventListener('hsse-data-updated', handleDataUpdated)
    }
  }, [])

  const usingDemoData = realReports.length < DEMO_THRESHOLD
  const combinedReports = useMemo(
    () => (usingDemoData ? [...realReports, ...demoReports] : realReports),
    [realReports, demoReports, usingDemoData],
  )

  const refresh = () => {
    setRealReports(loadRealReports())
    setLastUpdated(new Date())
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

  return {
    realReports,
    combinedReports,
    usingDemoData,
    demoBannerDismissed,
    dismissDemoBanner: () => setDemoBannerDismissed(true),
    lastUpdated,
    refresh,
    corroborationReport,
    handleCorroborate,
    handleConfirmCorroboration,
    closeCorroboration: () => setCorroborationReport(null),
  }
}
