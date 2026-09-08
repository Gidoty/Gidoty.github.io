import Papa from 'papaparse'
import { normalizeAuditEntry } from './auditDisplay.js'

const CSV_COLUMNS = [
  'Entry #',
  'Type',
  'Substrate',
  'Fresh Weight (kg)',
  'Key Result',
  'Timestamp ISO',
  'SHA-256 Hash Full',
  'GWP Used',
  'MCF Used',
  'Methodology',
  'Biogas (m3)',
  'CH4 (m3)',
  'Avoided CO2e (t)',
  'Carbon Value USD',
  'Digestate Value NGN',
]

export function buildAuditCsv(auditLog) {
  const rows = auditLog.map((entry, index) => {
    const display = normalizeAuditEntry(entry)
    return {
      'Entry #': auditLog.length - index,
      Type: display.label,
      Substrate: display.substrateName,
      'Fresh Weight (kg)': display.inputKg ?? '',
      'Key Result': display.keyResult,
      'Timestamp ISO': entry.timestamp,
      'SHA-256 Hash Full': entry.hash,
      'GWP Used': entry.inputs?.gwpKey ?? '',
      'MCF Used': entry.inputs?.scenarioKey ?? '',
      Methodology: entry.inputs?.methodologyId ?? '',
      'Biogas (m3)': entry.type === 'yield' ? entry.results.biogasM3.toFixed(2) : '',
      'CH4 (m3)': entry.type === 'yield' ? entry.results.ch4M3.toFixed(2) : '',
      'Avoided CO2e (t)': entry.type === 'emissions' && entry.result.avoidedTonnes != null ? entry.result.avoidedTonnes.toFixed(3) : '',
      'Carbon Value USD': entry.type === 'carbon' ? entry.result.annualUsd.toFixed(2) : '',
      'Digestate Value NGN': entry.type === 'digestate' ? entry.result.value.totalValue.toFixed(0) : '',
    }
  })
  return Papa.unparse({ fields: CSV_COLUMNS, data: rows })
}

export function buildAuditJson(auditLog) {
  return JSON.stringify(
    {
      export_generated: new Date().toISOString(),
      tool: 'G-BioCred v1.0',
      built_by: 'Gideon Owhonda, PhD',
      institution:
        'NLNG Centre for Gas, Refining and Petrochemical Engineering, University of Port Harcourt',
      methodology_references: [
        'IPCC 2006 Guidelines Vol.4 Ch.10',
        'IPCC 2006 Guidelines Vol.5 Ch.3',
        'IPCC AR6 WGI (2021) Table 7.SM.7',
        'Gold Standard AWMS v2.0',
        'CDM AMS-III.D / AMS-III.R',
      ],
      hash_algorithm: 'SHA-256 (FIPS 180-4)',
      evidence_act_ref: 'Nigerian Evidence Act 2011 ss.84-87',
      entries: auditLog.map((entry) => ({ ...entry, display: normalizeAuditEntry(entry) })),
    },
    null,
    2,
  )
}

export function downloadFile(filename, content, mimeType) {
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
