import { useEffect, useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import EscalationStats from '../components/tracker/EscalationStats.jsx'
import TimelineCard from '../components/tracker/TimelineCard.jsx'
import NosdraModal from '../components/tracker/NosdraModal.jsx'
import FoiGenerator from '../components/tracker/FoiGenerator.jsx'
import EscalationTable from '../components/tracker/EscalationTable.jsx'
import { loadRealReports, updateReportInStorage } from '../utils/dashboardUtils.js'

const REFRESH_INTERVAL_MS = 30000

export default function Tracker() {
  const [reports, setReports] = useState(() => loadRealReports())
  const [notifyReport, setNotifyReport] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => setReports(loadRealReports()), REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  const sortedReports = [...reports].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  const handleMarkNotified = (reportId) => {
    const updated = updateReportInStorage(reportId, (report) => ({
      ...report,
      regulatory: {
        ...report.regulatory,
        nosdraNotified: true,
        nosdraNotifiedAt: new Date().toISOString(),
      },
    }))
    setReports(updated)
    setNotifyReport(null)
  }

  const handleMarkJivCompleted = (reportId, dateStr) => {
    const updated = updateReportInStorage(reportId, (report) => ({
      ...report,
      regulatory: {
        ...report.regulatory,
        jivScheduled: true,
        jivDate: report.regulatory.jivDate ?? dateStr,
        jivCompleted: true,
        jivCompletedAt: new Date(dateStr).toISOString(),
      },
    }))
    setReports(updated)
  }

  const handleCleanupStatusChange = (reportId, status) => {
    const updated = updateReportInStorage(reportId, (report) => ({
      ...report,
      regulatory: { ...report.regulatory, cleanupStatus: status },
    }))
    setReports(updated)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-text sm:text-3xl">Regulatory Escalation Tracker</h1>
      <p className="mt-2 text-sm text-muted">
        Documenting operator obligations and regulatory response under NOSDRA Act 2006
      </p>

      <div className="mt-6 flex gap-3 rounded-xl border border-teal/30 bg-teal/10 p-4">
        <ShieldAlert className="h-5 w-5 shrink-0 text-teal" />
        <div>
          <p className="text-sm text-text">
            Under the NOSDRA Act 2006, operators must stop and contain oil spills within 24 hours
            of notification. Failure to respond creates legal liability. This tracker documents
            every report&apos;s notification history and operator response — or non-response.
          </p>
          <p className="mt-2 text-xs italic text-muted">
            Source: NOSDRA Act 2006 · Oil Spill Recovery, Clean-up, Remediation and Damage
            Assessment Regulations 2011, Section 5
          </p>
        </div>
      </div>

      <div className="mt-8">
        <EscalationStats reports={reports} />
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-bold text-text">Incident Response Timeline</h2>
        <div className="mt-4 space-y-4">
          {sortedReports.length === 0 && (
            <p className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted">
              No reports tracked yet.
            </p>
          )}
          {sortedReports.map((report) => (
            <TimelineCard
              key={report.id}
              report={report}
              onNotifyClick={setNotifyReport}
              onMarkJivCompleted={handleMarkJivCompleted}
              onCleanupStatusChange={handleCleanupStatusChange}
            />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <FoiGenerator />
      </div>

      <div className="mt-10">
        <EscalationTable reports={sortedReports} />
      </div>

      {notifyReport && (
        <NosdraModal report={notifyReport} onClose={() => setNotifyReport(null)} onMarkNotified={handleMarkNotified} />
      )}
    </div>
  )
}
