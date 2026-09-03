import { useState } from 'react'
import { X, Fingerprint } from 'lucide-react'
import { t } from '../../data/translations.js'
import { deriveStatus, updateReportInStorage } from '../../utils/dashboardUtils.js'
import { hoursSince, formatElapsed, notificationTimerLevel } from '../../utils/trackerUtils.js'
import { SEVERITY_BADGE_CLASSES } from '../../data/markerColors.js'
import NosdraModal from '../tracker/NosdraModal.jsx'

const TABS = ['Details', 'Evidence', 'Health', 'Regulatory', 'Audit']

const STATUS_LABELS = {
  submitted: 'Submitted',
  corroborated: 'Corroborated',
  nosdra_notified: 'NOSDRA Notified',
  resolved: 'Resolved',
}

export default function ReportDetailModal({ report, onClose, onReportsChanged }) {
  const [tab, setTab] = useState('Details')
  const [notifyOpen, setNotifyOpen] = useState(false)
  const [current, setCurrent] = useState(report)

  const typeLabel = t('en', 'incidentTypes')[current.incident.type] ?? current.incident.type
  const severityInfo = t('en', 'severityLevels')[current.incident.severity]
  const isDemo = Boolean(current.incident.isDemoData)

  const handleMarkNotified = (reportId) => {
    if (isDemo) {
      setCurrent((prev) => ({
        ...prev,
        regulatory: { ...prev.regulatory, nosdraNotified: true, nosdraNotifiedAt: new Date().toISOString() },
      }))
      setNotifyOpen(false)
      return
    }
    const updated = updateReportInStorage(reportId, (r) => ({
      ...r,
      regulatory: { ...r.regulatory, nosdraNotified: true, nosdraNotifiedAt: new Date().toISOString() },
    }))
    setCurrent(updated.find((r) => r.id === reportId) ?? current)
    onReportsChanged?.(updated)
    setNotifyOpen(false)
  }

  const notifiedHours = hoursSince(current.regulatory?.nosdraNotifiedAt)
  const timerLevel = notifiedHours === null ? null : notificationTimerLevel(notifiedHours)

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between border-b border-border p-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  SEVERITY_BADGE_CLASSES[current.incident.severity]
                }`}
              >
                {severityInfo?.label ?? current.incident.severity}
              </span>
              <h2 className="text-base font-bold text-text">{typeLabel}</h2>
              <span className="text-xs text-teal">{current.referenceNumber}</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {[current.location.state, current.location.lga].filter(Boolean).join(' · ')}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:text-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-border px-3 pt-2">
          {TABS.map((tabName) => (
            <button
              key={tabName}
              type="button"
              onClick={() => setTab(tabName)}
              className={`min-h-[40px] shrink-0 rounded-t-lg px-4 text-sm font-bold transition-colors ${
                tab === tabName ? 'bg-panel text-teal' : 'text-muted hover:text-text'
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5 text-sm">
          {tab === 'Details' && (
            <div className="space-y-3">
              <Row label="Reference" value={current.referenceNumber} />
              <Row label="Type" value={typeLabel} />
              <Row label="Sub-type" value={current.incident.subType ? t('en', 'subTypes')[current.incident.subType] : '—'} />
              <Row label="Severity" value={severityInfo?.label ?? current.incident.severity} />
              <Row label="Duration" value={current.incident.duration ?? '—'} />
              <Row label="Date/Time" value={new Date(current.incident.dateTime).toLocaleString()} />
              <Row
                label="Location"
                value={
                  current.location.display
                    ? `${current.location.display.lat}°N, ${current.location.display.lng}°E`
                    : current.location.landmark ?? '—'
                }
              />
              <Row label="State / LGA" value={[current.location.state, current.location.lga].filter(Boolean).join(' · ') || '—'} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Description</p>
                <p className="mt-1 text-text">{current.incident.description}</p>
              </div>
            </div>
          )}

          {tab === 'Evidence' && (
            <div>
              {current.evidence?.photos?.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {current.evidence.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Evidence ${index + 1}`}
                      className="h-28 w-full rounded-lg border border-border object-cover"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted">No photos submitted.</p>
              )}
            </div>
          )}

          {tab === 'Health' && (
            <div className="space-y-3">
              <Row label="Health impact reported" value={current.health?.healthImpact ? 'Yes' : 'No'} />
              {current.health?.healthImpact && (
                <>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">Symptoms</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-text">
                      {(current.health.symptoms ?? []).map((symptom) => (
                        <li key={symptom}>{t('en', 'symptomsList')[symptom] ?? symptom}</li>
                      ))}
                      {(current.health.symptoms ?? []).length === 0 && <li>None specified</li>}
                    </ul>
                  </div>
                  <Row
                    label="Affected count"
                    value={current.health.affectedCount ? t('en', 'affectedCount')[current.health.affectedCount] : '—'}
                  />
                </>
              )}
            </div>
          )}

          {tab === 'Regulatory' && (
            <div className="space-y-4">
              <Row label="Lifecycle stage" value={STATUS_LABELS[deriveStatus(current)]} />
              <Row label="NOSDRA notified" value={current.regulatory?.nosdraNotified ? 'Yes' : 'No'} />
              {current.regulatory?.nosdraNotified && (
                <Row
                  label="Notified at"
                  value={new Date(current.regulatory.nosdraNotifiedAt).toLocaleString()}
                />
              )}
              <Row label="Cleanup status" value={(current.regulatory?.cleanupStatus ?? 'pending').replace('_', ' ')} />

              {current.regulatory?.nosdraNotified ? (
                <div
                  className={`rounded-lg border px-4 py-3 text-xs ${
                    timerLevel === 'ok'
                      ? 'border-safe/40 bg-safe/10 text-safe'
                      : timerLevel === 'warning'
                        ? 'border-amber/40 bg-amber/10 text-amber'
                        : 'border-danger bg-danger/10 text-danger'
                  }`}
                >
                  Time since NOSDRA notification: {formatElapsed(notifiedHours)}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setNotifyOpen(true)}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-lg bg-teal text-sm font-bold text-white hover:bg-teal/90"
                >
                  Notify NOSDRA
                </button>
              )}
            </div>
          )}

          {tab === 'Audit' && (
            <div className="space-y-3">
              <Row label="Report hash (SHA-256)" value={current.audit?.reportHash ?? 'not available'} mono />
              <Row label="Submission timestamp" value={new Date(current.submittedAt).toLocaleString()} />
              <Row label="Consent version" value={current.audit?.consentVersion ?? '—'} />
              <Row label="Language used" value={current.audit?.language ?? '—'} />
              <Row label="User agent" value={current.audit?.userAgent ?? '—'} mono />

              <div className="mt-4 flex gap-2 rounded-lg border border-teal/30 bg-teal/10 p-3 text-xs text-text">
                <Fingerprint className="h-4 w-4 shrink-0 text-teal" />
                <p>
                  This audit record meets Nigerian Evidence Act 2011 Sections 84–87 requirements
                  for computer-generated evidence admissibility.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {notifyOpen && (
        <NosdraModal report={current} onClose={() => setNotifyOpen(false)} onMarkNotified={handleMarkNotified} />
      )}
    </div>
  )
}

function Row({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-2">
      <span className="text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
      <span className={`text-right text-text ${mono ? 'break-all font-mono text-xs' : ''}`}>{value}</span>
    </div>
  )
}
