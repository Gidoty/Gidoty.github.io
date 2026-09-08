import { Link } from 'react-router-dom'
import NpkCards from './NpkCards.jsx'
import FertiliserValueCard from './FertiliserValueCard.jsx'
import CropCoveragePanel from './CropCoveragePanel.jsx'
import NpkPieChart from './NpkPieChart.jsx'
import AnnualDigestateValue from './AnnualDigestateValue.jsx'
import SubstrateComparisonTable from './SubstrateComparisonTable.jsx'
import CombinedEconomicsSummary from './CombinedEconomicsSummary.jsx'
import AuditSnapshot from '../calculator/AuditSnapshot.jsx'
import { FERTILIZER_PRICES } from '../../data/digestateEconomics.js'
import { CARBON_MARKET } from '../../data/constants.js'
import { calcCropCoverage } from '../../utils/calcEngine.js'
import { CROP_N_K_RATES } from '../../data/digestateEconomics.js'

export default function DigestateResultsPanel({
  substrate,
  freshWeightKg,
  digestateKg,
  npk,
  value,
  prices,
  priceBasis,
  showAnnual,
  dailyTotalValueNgn,
  showCombinedEconomics,
  electricalKwh,
  annualCarbonTonnes,
  digestateValueNgnForCombined,
  auditEntry,
}) {
  const isNgn = priceBasis === 'ngn'
  const currencyPrefix = isNgn ? '₦' : 'USD '
  const coverage = calcCropCoverage({ nKg: npk.nKg, kKg: npk.kKg, rates: CROP_N_K_RATES })

  return (
    <div className="panel-enter space-y-8">
      <NpkCards npk={npk} digestateKg={digestateKg} />

      <FertiliserValueCard
        npk={npk}
        value={value}
        prices={prices}
        currencyPrefix={currencyPrefix}
        digestateKg={digestateKg}
        isNgn={isNgn}
        ngnPerUsd={CARBON_MARKET.ngnPerUsd}
      />

      <CropCoveragePanel coverage={coverage} />

      <NpkPieChart value={value} currencyPrefix={currencyPrefix} />

      {showAnnual && (
        <AnnualDigestateValue dailyTotalValueNgn={dailyTotalValueNgn} ngnPerUsd={CARBON_MARKET.ngnPerUsd} />
      )}

      <SubstrateComparisonTable
        freshWeightKg={freshWeightKg}
        recoveryRate={digestateKg / freshWeightKg}
        prices={FERTILIZER_PRICES.ngn}
        selectedId={substrate.id}
      />

      {showCombinedEconomics && (
        <CombinedEconomicsSummary
          freshWeightKg={freshWeightKg}
          electricalKwh={electricalKwh}
          annualCarbonTonnes={annualCarbonTonnes}
          digestateValueNgn={digestateValueNgnForCombined}
        />
      )}

      <AuditSnapshot entry={auditEntry} />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          to="/compare"
          className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:scale-[1.02]"
        >
          Compare All Scenarios →
        </Link>
        <Link
          to="/report"
          className="rounded-lg border border-accent px-5 py-3 text-center text-sm font-semibold text-text hover:bg-accent/10"
        >
          Generate Full Report →
        </Link>
        <Link
          to="/carbon"
          className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-text hover:bg-card"
        >
          Back to Carbon Credits →
        </Link>
      </div>
    </div>
  )
}
