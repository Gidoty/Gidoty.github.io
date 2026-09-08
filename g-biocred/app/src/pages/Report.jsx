import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import ProjectDetailsForm from '../components/report/ProjectDetailsForm.jsx'
import CalculationDataPanel from '../components/report/CalculationDataPanel.jsx'
import SectionsSelector from '../components/report/SectionsSelector.jsx'
import ReportPreview from '../components/report/ReportPreview.jsx'
import ProgressSteps from '../components/shared/ProgressSteps.jsx'
import { useBioCredStore } from '../store/BioCredStore.jsx'
import { buildReportData } from '../utils/reportData.js'
import { buildReportSections } from '../utils/reportSections.js'
import { generateReportPdf } from '../utils/reportPdf.js'
import { buildReportCsv } from '../utils/reportCsv.js'
import { downloadFile } from '../utils/auditExport.js'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function Report() {
  const { state, markStepComplete } = useBioCredStore()
  const data = useMemo(() => buildReportData(state), [state])

  const [meta, setMeta] = useState(() => ({
    projectName: data.hasYield ? `Biogas Feasibility Assessment — ${data.substrate.name}` : 'Biogas Feasibility Assessment',
    applicantName: '',
    location: '',
    reportDate: todayIso(),
    preparedBy: '',
    purpose: 'Grant Application',
  }))
  const [included, setIncluded] = useState({})

  const handleMetaChange = useCallback((field, value) => {
    setMeta((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleToggleSection = useCallback((key, value) => {
    setIncluded((prev) => ({ ...prev, [key]: value }))
  }, [])

  const hasCustomDetails = Boolean(meta.applicantName || meta.location || meta.preparedBy)

  const reportMeta = useMemo(() => {
    const latestHash = state.auditLog[0]?.hash
    return {
      ...meta,
      reportDateLabel: new Date(`${meta.reportDate}T00:00:00`).toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      refHash: latestHash ? latestHash.slice(0, 8) : 'DRAFT',
    }
  }, [meta, state.auditLog])

  const sections = useMemo(() => buildReportSections(data, reportMeta, included), [data, reportMeta, included])

  const handleDownloadPdf = useCallback(() => {
    generateReportPdf(sections, reportMeta)
    markStepComplete('report')
  }, [sections, reportMeta, markStepComplete])

  const handleDownloadCsv = useCallback(() => {
    downloadFile(`${meta.projectName.replace(/[^a-z0-9]+/gi, '-')}-data.csv`, buildReportCsv(data), 'text/csv')
    markStepComplete('report')
  }, [data, meta.projectName, markStepComplete])

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <ProgressSteps currentStep="report" />
        <span className="inline-block rounded-full border border-border bg-panel px-4 py-1.5 text-xs text-muted">
          IPCC 2006/2019 · Gold Standard AWMS · CDM AMS-III · Article 6.4 · Nigerian Evidence Act
          2011
        </span>
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">Feasibility Report Generator</h1>
        <p className="mt-2 text-muted">
          Generate a complete, shareable feasibility report suitable for grant applications,
          investor pitches, and regulatory submissions
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-text">Configure Your Report</h2>
          <ProjectDetailsForm meta={meta} onChange={handleMetaChange} />
        </section>

        <CalculationDataPanel data={data} hasCustomDetails={hasCustomDetails} />

        <SectionsSelector included={included} onToggle={handleToggleSection} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!data.hasYield}
            className="flex h-14 items-center justify-center gap-2 rounded-lg bg-accent text-lg font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileDown className="h-5 w-5" />
            Download PDF Report
          </button>
          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={!data.hasYield}
            className="flex h-14 items-center justify-center gap-2 rounded-lg border border-accent text-lg font-semibold text-text hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet className="h-5 w-5" />
            Download CSV Data
          </button>
        </div>
        {!data.hasYield && (
          <p className="text-center text-sm text-muted">
            Run the <Link to="/calculator" className="text-accent hover:underline">Yield Calculator</Link> first to unlock report
            generation.
          </p>
        )}

        <div>
          <h2 className="mb-3 text-lg font-semibold text-text">Report Preview</h2>
          <ReportPreview sections={sections} meta={reportMeta} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            to="/audit"
            className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:scale-[1.02]"
          >
            View Audit Trail →
          </Link>
          <Link
            to="/calculator"
            className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-text hover:bg-card"
          >
            Back to Yield Calculator →
          </Link>
        </div>
      </div>
    </div>
  )
}
