import { useMemo, useState } from 'react'
import { Globe2, Download } from 'lucide-react'
import PanelHeader from './shared/PanelHeader.jsx'
import { loadRealReports } from '../../../utils/dashboardUtils.js'

function n(value, digits = 1) {
  return Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 })
}

function downloadBlob(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function csvEscape(value) {
  const str = String(value ?? '')
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

export default function CarbonCreditDataPackagePanel() {
  const [reports] = useState(() => loadRealReports().filter((r) => r.methane?.calculated && !r.incident?.isDemoData))

  const totals = useMemo(
    () =>
      reports.reduce(
        (acc, r) => ({
          co2e20: acc.co2e20 + (r.methane.results.co2e_20yr_tonnes ?? 0),
          co2e100: acc.co2e100 + (r.methane.results.co2e_100yr_tonnes ?? 0),
          volume: acc.volume + (r.methane.results.flaredVolume_m3 ?? 0),
        }),
        { co2e20: 0, co2e100: 0, volume: 0 },
      ),
    [reports],
  )

  const buildPackage = () => ({
    packageType: 'NigerDelta HSSE Tracker — Community-Observed Flare Baseline Data',
    generatedAt: new Date().toISOString(),
    methodology: {
      emissionFactors: 'IPCC 2006 Guidelines for National Greenhouse Gas Inventories, Vol. 2, Ch. 4',
      volumeEstimation: 'API Compendium of GHG Emissions Estimation Methodologies for the Oil and Gas Industry (2009)',
      gwpValues: 'IPCC AR6 WGI (2021), Table 7.SM.7 — GWP20 = 84, GWP100 = 29.8',
      dataQuality: 'Tier 1 default factors applied to community-observed flare characteristics; not operator-metered data.',
      transferFramework: 'Paris Agreement Article 6.4 — requires independent third-party verification and host-country authorisation before any credit issuance or transfer.',
    },
    summary: {
      recordCount: reports.length,
      totalFlaredVolume_m3: totals.volume,
      totalCo2e20yr_tonnes: totals.co2e20,
      totalCo2e100yr_tonnes: totals.co2e100,
    },
    records: reports.map((r) => ({
      referenceNumber: r.referenceNumber,
      observedAt: r.incident.dateTime,
      calculatedAt: r.methane.calculatedAt,
      location: {
        state: r.location.state ?? null,
        lga: r.location.lga ?? null,
        coarseCoordinates: r.location.display ?? null,
      },
      inputs: r.methane.inputs,
      results: r.methane.results,
      corroborationCount: r.corroboration?.count ?? 0,
    })),
  })

  const handleDownloadJson = () => {
    downloadBlob(JSON.stringify(buildPackage(), null, 2), 'application/json', `nigerdelta-carbon-credit-package-${new Date().toISOString().slice(0, 10)}.json`)
  }

  const handleDownloadCsv = () => {
    const headers = ['Reference', 'State', 'Calculated At', 'Flared Volume (m3)', 'CH4 Primary (t)', 'CO2e 20yr (t)', 'CO2e 100yr (t)', 'Corroborations']
    const rows = reports.map((r) => [
      r.referenceNumber,
      r.location.state ?? '',
      r.methane.calculatedAt,
      r.methane.results.flaredVolume_m3,
      r.methane.results.ch4_primary_tonnes,
      r.methane.results.co2e_20yr_tonnes,
      r.methane.results.co2e_100yr_tonnes,
      r.corroboration?.count ?? 0,
    ])
    const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n')
    downloadBlob(csv, 'text/csv;charset=utf-8;', `nigerdelta-carbon-credit-summary-${new Date().toISOString().slice(0, 10)}.csv`)
  }

  if (reports.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <PanelHeader icon={Globe2} color="#06B6D4" title="Carbon Credit Data Package" badges={['Paris Agreement Article 6.4']} />
        <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-border bg-card px-4 text-center text-sm text-muted">
          No saved methane calculations yet. Save a Methane Emissions calculation to a report under
          Calculate to include it in this package.
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PanelHeader icon={Globe2} color="#06B6D4" title="Carbon Credit Data Package" badges={['Paris Agreement Article 6.4', 'Gold Standard / Verra VCS format']} />

      <p className="rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-muted">
        Bundles every community-observed flare emission calculation into a structured export suitable for
        submission as supporting baseline evidence toward Gold Standard or Verra VCS project documentation.
        This is community-observed Tier 1 data, not operator-metered or third-party verified — it
        establishes an evidentiary starting point, not an issued credit.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-teal">{reports.length}</p>
          <p className="mt-1 text-xs text-muted">Calculations included</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-amber">{n(totals.co2e20)} t</p>
          <p className="mt-1 text-xs text-muted">Total CO₂e (20-yr)</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-2xl font-bold text-safe">{n(totals.co2e100)} t</p>
          <p className="mt-1 text-xs text-muted">Total CO₂e (100-yr)</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-text">Included Records</h3>
        <table className="mt-3 w-full min-w-[600px] text-left text-xs">
          <thead>
            <tr className="text-muted">
              <th className="pb-2 pr-4 font-medium">Reference</th>
              <th className="pb-2 pr-4 font-medium">State</th>
              <th className="pb-2 pr-4 font-medium">Flared Volume (m³)</th>
              <th className="pb-2 font-medium">CO₂e 100yr (t)</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="py-2 pr-4 text-text">{r.referenceNumber}</td>
                <td className="py-2 pr-4 text-muted">{r.location.state ?? '—'}</td>
                <td className="py-2 pr-4 text-muted">{n(r.methane.results.flaredVolume_m3, 0)}</td>
                <td className="py-2 text-muted">{n(r.methane.results.co2e_100yr_tonnes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 print:hidden">
        <button
          type="button"
          onClick={handleDownloadJson}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-cyan-400 text-sm font-bold text-bg hover:bg-cyan-400/90"
        >
          <Download className="h-4 w-4" />
          Download JSON Package
        </button>
        <button
          type="button"
          onClick={handleDownloadCsv}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-cyan-400 text-sm font-bold text-cyan-400 hover:bg-cyan-400/10"
        >
          <Download className="h-4 w-4" />
          Download CSV Summary
        </button>
      </div>

      <p className="mt-4 text-xs text-muted">
        Article 6.4 of the Paris Agreement requires host-country authorisation and independent
        verification before any internationally transferred mitigation outcome can be issued or sold.
        This package documents a community-observed baseline only.
      </p>
    </div>
  )
}
