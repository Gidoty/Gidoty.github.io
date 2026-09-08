const PURPOSES = [
  'Grant Application',
  'Investor Pitch',
  'Regulatory Submission',
  'Internal Feasibility Study',
  'Community Proposal',
  'Carbon Credit Pre-feasibility',
  'Other',
]

const inputClass =
  'w-full rounded-lg border border-border bg-input px-3 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-accent'

export default function ProjectDetailsForm({ meta, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-text">Project name</label>
        <input
          type="text"
          value={meta.projectName}
          onChange={(e) => onChange('projectName', e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-text">Applicant / Organisation name</label>
        <input
          type="text"
          value={meta.applicantName}
          onChange={(e) => onChange('applicantName', e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-text">Location</label>
        <input
          type="text"
          placeholder="e.g. Bayelsa State, Nigeria"
          value={meta.location}
          onChange={(e) => onChange('location', e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-text">Report date</label>
        <input
          type="date"
          value={meta.reportDate}
          onChange={(e) => onChange('reportDate', e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-text">Prepared by</label>
        <input
          type="text"
          value={meta.preparedBy}
          onChange={(e) => onChange('preparedBy', e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-text">Purpose</label>
        <select value={meta.purpose} onChange={(e) => onChange('purpose', e.target.value)} className={inputClass}>
          {PURPOSES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
