import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { t } from '../data/translations.js'
import {
  getConsent,
  setConsent as persistConsent,
  saveDraft,
  loadDraft,
  clearDraft,
  generateReferenceNumber,
  hashReport,
  saveReport,
} from '../utils/reportStorage.js'
import ConsentScreen from '../components/report/ConsentScreen.jsx'
import LanguageToggle from '../components/report/LanguageToggle.jsx'
import StepProgress from '../components/report/StepProgress.jsx'
import LocationSection from '../components/report/LocationSection.jsx'
import IncidentSection from '../components/report/IncidentSection.jsx'
import EvidenceSection from '../components/report/EvidenceSection.jsx'
import HealthSection from '../components/report/HealthSection.jsx'
import ContactSection from '../components/report/ContactSection.jsx'
import ResultScreen from '../components/report/ResultScreen.jsx'
import LegalBasisBadge from '../components/appshell/panels/shared/LegalBasisBadge.jsx'

function nowParts() {
  const now = new Date()
  return {
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 5),
  }
}

function emptyLocation() {
  return { gps: null, display: null, state: '', lga: '', landmark: '', locationError: null }
}

function emptyIncident() {
  return { type: '', subType: '', severity: '', duration: '' }
}

function emptyEvidence() {
  const { date, time } = nowParts()
  return { description: '', photos: [], incidentDate: date, incidentTime: time }
}

function emptyHealth() {
  return { healthImpact: null, symptoms: [], affectedCount: '' }
}

function emptyContact() {
  return {
    name: '',
    phone: '',
    willingToContact: false,
    willingToWitness: false,
    wantsNotification: false,
  }
}

const STEP_ORDER = ['location', 'incident', 'evidence', 'health', 'contact']

export default function Report() {
  const [showConsent, setShowConsent] = useState(true)
  const [anonymousMode, setAnonymousMode] = useState(false)
  const [consentRecord, setConsentRecord] = useState(null)
  const [language, setLanguage] = useState('en')

  const draft = useMemo(() => loadDraft() ?? {}, [])

  const [location, setLocation] = useState(draft.location ?? emptyLocation())
  const [incident, setIncident] = useState(draft.incident ?? emptyIncident())
  const [evidenceData, setEvidenceData] = useState(draft.evidenceData ?? emptyEvidence())
  const [health, setHealth] = useState(draft.health ?? emptyHealth())
  const [contact, setContact] = useState(draft.contact ?? emptyContact())

  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [touchedFields, setTouchedFields] = useState({ description: false, landmark: false })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [activeStep, setActiveStep] = useState(1)

  const sectionRefs = {
    location: useRef(null),
    incident: useRef(null),
    evidence: useRef(null),
    health: useRef(null),
    contact: useRef(null),
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = STEP_ORDER.findIndex((key) => sectionRefs[key].current === entry.target)
            if (index !== -1) setActiveStep(index + 1)
          }
        })
      },
      { rootMargin: '-140px 0px -65% 0px', threshold: 0 },
    )
    STEP_ORDER.forEach((key) => {
      if (sectionRefs[key].current) observer.observe(sectionRefs[key].current)
    })
    return () => observer.disconnect()
    // Refs are only populated once the form (not the consent screen or
    // result screen) is the visible tree, so re-run when that visibility
    // changes rather than only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConsent, result])

  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft({ location, incident, evidenceData, health, contact })
    }, 30000)
    return () => clearInterval(interval)
  }, [location, incident, evidenceData, health, contact])

  const hasLocation = Boolean(location.display) || location.landmark.trim().length > 0
  const descriptionValid = evidenceData.description.trim().length >= 20

  const errors = useMemo(() => {
    const next = {}
    if (!incident.type) next.type = t(language, 'errorIncidentType')
    if (!incident.severity) next.severity = t(language, 'errorSeverity')
    if (!descriptionValid) next.description = t(language, 'errorDescription')
    if (!hasLocation) next.location = t(language, 'errorLocation')
    return next
  }, [incident.type, incident.severity, descriptionValid, hasLocation, language])

  const requiredChecks = [Boolean(incident.type), Boolean(incident.severity), descriptionValid, hasLocation]
  const percent = Math.round((requiredChecks.filter(Boolean).length / requiredChecks.length) * 100)

  const showError = (touchKey, errorKey) =>
    submitAttempted || touchedFields[touchKey] ? errors[errorKey] : undefined

  const handleAccept = () => {
    const record = persistConsent(false)
    setConsentRecord(record)
    setAnonymousMode(false)
    setShowConsent(false)
  }

  const handleAnonymous = () => {
    const record = persistConsent(true)
    setConsentRecord(record)
    setAnonymousMode(true)
    setShowConsent(false)
  }

  const scrollToFirstError = () => {
    if (errors.location) sectionRefs.location.current?.scrollIntoView({ behavior: 'smooth' })
    else if (errors.type || errors.severity) sectionRefs.incident.current?.scrollIntoView({ behavior: 'smooth' })
    else if (errors.description) sectionRefs.evidence.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitAttempted(true)
    if (Object.keys(errors).length > 0) {
      scrollToFirstError()
      return
    }

    setSubmitting(true)

    const online = navigator.onLine
    const referenceNumber = generateReferenceNumber()
    const dateTime = new Date(`${evidenceData.incidentDate}T${evidenceData.incidentTime}:00`).toISOString()
    const consent = consentRecord ?? getConsent()

    const report = {
      id: crypto.randomUUID(),
      referenceNumber,
      submittedAt: new Date().toISOString(),
      status: online ? 'submitted' : 'queued',
      location: {
        gps: location.gps
          ? {
              lat: location.gps.lat,
              lng: location.gps.lng,
              accuracy: location.gps.accuracy,
              capturedAt: location.gps.timestamp,
            }
          : null,
        display: location.display,
        state: location.state || null,
        lga: location.lga || null,
        landmark: location.landmark || null,
      },
      incident: {
        type: incident.type,
        subType: incident.subType || null,
        severity: incident.severity,
        duration: incident.duration || null,
        dateTime,
        description: evidenceData.description,
      },
      evidence: {
        photos: evidenceData.photos.map((photo) => photo.dataUrl),
        photoCount: evidenceData.photos.length,
      },
      health: {
        healthImpact: health.healthImpact === true,
        symptoms: health.symptoms,
        affectedCount: health.affectedCount || null,
      },
      contact: {
        anonymous: anonymousMode,
        name: anonymousMode ? null : contact.name || null,
        phone: anonymousMode ? null : contact.phone || null,
        willingToContact: anonymousMode ? false : contact.willingToContact,
        willingToWitness: anonymousMode ? false : contact.willingToWitness,
        wantsNotification: anonymousMode ? false : contact.wantsNotification,
      },
      corroboration: { count: 0, corroborators: [] },
      regulatory: {
        nosdraNotified: false,
        nosdraNotifiedAt: null,
        nuprcNotified: false,
        nuprcNotifiedAt: null,
        operatorResponse: null,
        jivScheduled: false,
        jivDate: null,
        jivCompleted: false,
        cleanupStatus: 'pending',
      },
      methane: { calculated: false, estimatedCH4: null, estimatedCO2e: null },
      audit: {
        consentVersion: 'NDPA-2023-v1',
        consentTimestamp: consent?.timestamp ?? null,
        language,
        userAgent: navigator.userAgent,
        reportHash: null,
      },
    }

    report.audit.reportHash = await hashReport(report)
    saveReport(report)
    clearDraft()

    if (!online && 'serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register('sync-reports')
      } catch {
        // Background Sync unsupported or registration failed — the queued
        // report still sits in localStorage and will resend on next visit.
      }
    }

    setSubmitting(false)
    setResult({ status: online ? 'success' : 'offline', referenceNumber })
  }

  const handleSubmitAnother = () => {
    setLocation(emptyLocation())
    setIncident(emptyIncident())
    setEvidenceData(emptyEvidence())
    setHealth(emptyHealth())
    setContact(emptyContact())
    setSubmitAttempted(false)
    setTouchedFields({ description: false, landmark: false })
    setResult(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (showConsent) {
    return <ConsentScreen language={language} onAccept={handleAccept} onAnonymous={handleAnonymous} />
  }

  if (result) {
    return (
      <ResultScreen
        language={language}
        status={result.status}
        referenceNumber={result.referenceNumber}
        onSubmitAnother={handleSubmitAnother}
      />
    )
  }

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text sm:text-3xl">{t(language, 'pageTitle')}</h1>
            <p className="mt-2 text-sm text-muted">{t(language, 'pageSubtitle')}</p>
          </div>
          <LanguageToggle language={language} onChange={setLanguage} />
        </div>
      </div>

      <StepProgress language={language} currentStep={activeStep} percent={percent} />

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-6">
        <LocationSection
          sectionRef={sectionRefs.location}
          language={language}
          value={location}
          onChange={setLocation}
          onLandmarkBlur={() => setTouchedFields((prev) => ({ ...prev, landmark: true }))}
          error={showError('landmark', 'location')}
        />

        <IncidentSection
          sectionRef={sectionRefs.incident}
          language={language}
          value={incident}
          onChange={setIncident}
          typeError={submitAttempted ? errors.type : undefined}
          severityError={submitAttempted ? errors.severity : undefined}
        />

        <EvidenceSection
          sectionRef={sectionRefs.evidence}
          language={language}
          value={evidenceData}
          onChange={setEvidenceData}
          onDescriptionBlur={() => setTouchedFields((prev) => ({ ...prev, description: true }))}
          descriptionError={showError('description', 'description')}
        />

        <HealthSection sectionRef={sectionRefs.health} language={language} value={health} onChange={setHealth} />

        <ContactSection
          sectionRef={sectionRefs.contact}
          language={language}
          value={contact}
          onChange={setContact}
          anonymousMode={anonymousMode}
          onChangeAnonymousMode={setAnonymousMode}
        />

        <button
          type="submit"
          disabled={submitting}
          className="flex min-h-[64px] w-full items-center justify-center gap-2 rounded-lg bg-teal text-base font-bold text-white shadow-lg shadow-teal/20 transition-colors hover:bg-teal/90 disabled:opacity-70"
        >
          {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
          {t(language, submitting ? 'submitting' : 'submitReport')}
        </button>

        <LegalBasisBadge text="NOSDRA Act 2006 · African Charter on Human and Peoples' Rights, Article 24" />
      </form>
    </div>
  )
}
