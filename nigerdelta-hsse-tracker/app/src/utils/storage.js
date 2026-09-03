const REPORTS_KEY = 'hsse_reports'
const PREFS_KEY = 'hsse_prefs'
const CONSENT_KEY = 'hsse_consent'
const LAST_PARAM_KEY = 'hsse_last_param'

export const storage = {
  getReports: () => {
    try {
      return JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]')
    } catch {
      return []
    }
  },

  saveReport: (report) => {
    const reports = storage.getReports()
    const existing = reports.findIndex((r) => r.id === report.id)
    if (existing >= 0) {
      reports[existing] = report
    } else {
      reports.push(report)
    }
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
    // Dispatch custom event so all panels update automatically
    window.dispatchEvent(new CustomEvent('hsse-data-updated', { detail: { reports } }))
    return reports
  },

  updateReport: (id, updates) => {
    const reports = storage.getReports()
    const idx = reports.findIndex((r) => r.id === id)
    if (idx >= 0) {
      reports[idx] = { ...reports[idx], ...updates }
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
      window.dispatchEvent(new CustomEvent('hsse-data-updated', { detail: { reports } }))
      return reports[idx]
    }
    return null
  },

  getPrefs: () => {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY))
    } catch {
      return null
    }
  },

  setPrefs: (data) => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(data))
  },

  getConsent: () => {
    try {
      return JSON.parse(localStorage.getItem(CONSENT_KEY))
    } catch {
      return null
    }
  },

  setConsent: (data) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data))
  },

  getLastParam: () => {
    try {
      return JSON.parse(localStorage.getItem(LAST_PARAM_KEY))
    } catch {
      return null
    }
  },

  setLastParam: (data) => {
    localStorage.setItem(LAST_PARAM_KEY, JSON.stringify(data))
  },
}
