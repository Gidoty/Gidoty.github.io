const SECTION_LABELS = [
  ['executiveSummary', 'Executive Summary'],
  ['projectOverview', 'Project Overview and Objectives'],
  ['substrateAnalysis', 'Substrate Analysis and Yield Calculation (full 5-step chain)'],
  ['digesterSizing', 'Digester Sizing Recommendation'],
  ['emissionsAnalysis', 'Emissions-Avoided Analysis'],
  ['carbonCredits', 'Carbon Credit Assessment'],
  ['digestateValue', 'Digestate Economic Value'],
  ['combinedEconomics', 'Combined Economic Summary'],
  ['methodologyReferences', 'Methodology References'],
  ['auditSummary', 'Audit Trail Summary'],
  ['recommendations', 'Recommendations and Next Steps'],
  ['disclaimer', 'Disclaimer'],
]

export default function SectionsSelector({ included, onToggle }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 font-medium text-text">Include in Report</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SECTION_LABELS.map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-text">
            <input
              type="checkbox"
              checked={included[key] !== false}
              onChange={(e) => onToggle(key, e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  )
}
