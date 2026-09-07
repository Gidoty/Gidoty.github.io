import { Link } from 'react-router-dom'
import CreditProjectionCards from './CreditProjectionCards.jsx'
import MethodologyDetailsCard from './MethodologyDetailsCard.jsx'
import RevenueChart from './RevenueChart.jsx'
import NpvAndGwpTables from './NpvAndGwpTables.jsx'
import NigerianPolicyPanel from './NigerianPolicyPanel.jsx'
import PoaResultsCard from './PoaResultsCard.jsx'
import AuditSnapshot from '../calculator/AuditSnapshot.jsx'

export default function CarbonResultsPanel({
  annualTonnes,
  selectedPriceKey,
  methodology,
  classification,
  avoidedTonnesByGwp,
  gwpKey,
  isPoa,
  cpaCount,
  auditEntry,
}) {
  return (
    <div className="panel-enter space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text">Credit Projections</h2>
        <CreditProjectionCards annualTonnes={annualTonnes} selectedKey={selectedPriceKey} />
      </div>

      <MethodologyDetailsCard
        methodology={methodology}
        annualTonnes={annualTonnes}
        classification={classification}
      />

      <RevenueChart annualTonnes={annualTonnes} />

      <NpvAndGwpTables
        annualTonnes={annualTonnes}
        avoidedTonnesByGwp={avoidedTonnesByGwp}
        baseGwpKey={gwpKey}
      />

      <NigerianPolicyPanel />

      {isPoa && <PoaResultsCard singleAnnualTonnes={annualTonnes} cpaCount={cpaCount} />}

      <AuditSnapshot entry={auditEntry} />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          to="/digestate"
          className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:scale-[1.02]"
        >
          View Digestate Value →
        </Link>
        <Link
          to="/compare"
          className="rounded-lg border border-accent px-5 py-3 text-center text-sm font-semibold text-text hover:bg-accent/10"
        >
          Compare Scenarios →
        </Link>
        <Link
          to="/report"
          className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-text hover:bg-card"
        >
          Generate Full Report →
        </Link>
        <Link
          to="/audit"
          className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-text hover:bg-card"
        >
          View Audit Trail →
        </Link>
      </div>
    </div>
  )
}
