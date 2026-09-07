import { formatDecimal } from '../../utils/format.js'

export default function MethodologyDetailsCard({ methodology, annualTonnes, classification }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-text">
        Your project maps to: <span className="font-semibold">{methodology.label}</span>
      </p>
      <p className="mt-2 text-sm text-muted">
        Credit volume: {formatDecimal(annualTonnes, 2)} tonnes CO₂e/year
      </p>
      {classification && (
        <p className="mt-1 text-sm text-muted">
          Eligibility: <span className="text-text">{classification.label}</span>
        </p>
      )}

      <p className="mt-3 text-sm font-medium text-text">Key requirements:</p>
      <ul className="mt-1 space-y-1 text-sm text-muted">
        {methodology.keyRequirements.map((req) => (
          <li key={req}>• {req}</li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted">
        <p>Estimated verification timeline: 12–18 months for first issuance</p>
        <p>
          Transaction costs: Validation $5,000–15,000 USD; Verification $3,000–8,000 USD annually
          (estimate, project-specific)
        </p>
        <p>For projects &lt;5 t CO₂e/year: standalone verification is uneconomic. Consider PoA aggregation.</p>
      </div>
    </div>
  )
}
