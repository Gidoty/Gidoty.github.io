import { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { t } from '../../data/translations.js'

const RELATIONSHIP_OPTIONS = [
  { id: 'resident', label: 'I am a resident of this community' },
  { id: 'passing_through', label: 'I was passing through this area' },
  { id: 'journalist', label: 'I am a journalist or researcher' },
  { id: 'ngo', label: 'I am an NGO or civil society worker' },
  { id: 'prefer_not_to_say', label: 'I prefer not to say' },
]

export default function CorroborationModal({ report, onConfirm, onClose }) {
  const [relationship, setRelationship] = useState('')
  const [observation, setObservation] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState('form')

  const typeLabel = t('en', 'incidentTypes')[report.incident.type] ?? report.incident.type
  const location = [report.location.state, report.location.lga].filter(Boolean).join(' · ')
  const description = report.incident.description ?? ''
  const excerpt = description.length > 140 ? `${description.slice(0, 140)}...` : description
  const willReachTwo = (report.corroboration?.count ?? 0) + 1 >= 2

  const handleConfirm = () => {
    if (!relationship) {
      setError('Please select your relationship to this incident.')
      return
    }
    onConfirm({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      relationship,
      observation: observation.trim() || null,
      anonymous: phone.trim().length === 0,
      phone: phone.trim() || null,
    })
    setStep('success')
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
        {step === 'form' ? (
          <>
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-text">Confirm You Witnessed This Incident</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-panel p-3 text-xs text-muted">
              <p className="font-bold text-text">{typeLabel}</p>
              {location && <p className="mt-1">{location}</p>}
              <p className="mt-1">{new Date(report.incident.dateTime).toLocaleString()}</p>
              {excerpt && <p className="mt-1 text-text">{excerpt}</p>}
            </div>

            <p className="mt-4 text-sm font-medium text-text">
              Did you personally witness or observe this incident?
            </p>

            <label className="mt-3 block text-sm font-medium text-text" htmlFor="observation">
              Describe what you saw (optional)
            </label>
            <textarea
              id="observation"
              rows={3}
              maxLength={300}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-text focus:border-teal focus:outline-none"
            />
            <p className="mt-1 text-right text-[11px] text-muted">{observation.length} / 300</p>

            <p className="mt-3 text-sm font-medium text-text">Your relationship to this incident</p>
            <div className="mt-2 space-y-1.5">
              {RELATIONSHIP_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex min-h-[40px] cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 text-sm text-text has-[:checked]:border-teal has-[:checked]:bg-teal/10"
                >
                  <input
                    type="radio"
                    name="relationship"
                    value={option.id}
                    checked={relationship === option.id}
                    onChange={(e) => {
                      setRelationship(e.target.value)
                      setError('')
                    }}
                    className="h-3.5 w-3.5 accent-teal"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}

            <label className="mt-4 block text-sm font-medium text-text" htmlFor="corrob-phone">
              Phone (optional)
            </label>
            <input
              id="corrob-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Leave blank to stay anonymous"
              className="mt-1.5 w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm text-text placeholder:text-muted focus:border-teal focus:outline-none"
            />

            <p className="mt-4 rounded-lg bg-amber/10 px-3 py-2.5 text-xs text-amber">
              Your corroboration is collected under the same privacy protections as the original
              report. You may remain anonymous.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-lg border border-border text-sm font-bold text-muted hover:text-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex min-h-[48px] flex-1 items-center justify-center rounded-lg bg-teal text-sm font-bold text-white hover:bg-teal/90"
              >
                Confirm Corroboration
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-safe/15 text-safe">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            {willReachTwo ? (
              <>
                <h2 className="mt-4 text-lg font-bold text-text">This report is now CORROBORATED</h2>
                <p className="mt-2 text-sm text-muted">
                  It carries stronger legal weight under the JIV process.
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-lg font-bold text-text">Thank you for confirming</h2>
                <p className="mt-2 text-sm text-muted">
                  Your corroboration has been added to this report.
                </p>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-lg bg-teal text-sm font-bold text-white hover:bg-teal/90"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
