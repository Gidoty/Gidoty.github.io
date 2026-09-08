import { Check, AlertTriangle } from 'lucide-react'
import { formatCO2e, formatDecimal, formatKwh, formatM3, formatNGN, formatUSD } from '../../utils/format.js'

function Row({ ok, children }) {
  return (
    <li className={`flex items-start gap-2 text-sm ${ok ? 'text-text' : 'text-amber'}`}>
      {ok ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber" />}
      <span>{children}</span>
    </li>
  )
}

export default function CalculationDataPanel({ data, hasCustomDetails }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 font-medium text-text">Available Calculation Data</p>
      <ul className="space-y-2">
        <Row ok={data.hasYield}>
          {data.hasYield
            ? `Substrate: ${data.substrate.name} at ${formatDecimal(data.dailyWasteKg, 1)} kg`
            : 'Substrate: run /calculator first'}
        </Row>
        <Row ok={data.hasYield}>
          {data.hasYield
            ? `Biogas yield: ${formatM3(data.yieldResults.biogasM3)} biogas, ${formatM3(data.yieldResults.ch4M3)} CH₄`
            : 'Biogas yield: not yet calculated'}
        </Row>
        <Row ok={data.hasYield}>
          {data.hasYield
            ? `Energy output: ${formatKwh(data.yieldResults.electricalKwh)} electrical, ${formatKwh(data.yieldResults.thermalKwh)} thermal`
            : 'Energy output: not yet calculated'}
        </Row>
        <Row ok={Boolean(data.digester)}>
          {data.digester
            ? `Digester sizing: ${formatM3(data.digester.chamberM3)} ${data.digester.type.label}`
            : 'Digester sizing: not yet calculated'}
        </Row>
        <Row ok={data.hasEmissions && data.emissionsChain.avoidedTonnes !== null}>
          {data.hasEmissions && data.emissionsChain.avoidedTonnes !== null
            ? `Emissions avoided: ${formatCO2e(data.emissionsChain.avoidedTonnes)}`
            : 'Emissions avoided: run /emissions first'}
        </Row>
        <Row ok={data.hasCarbon}>
          {data.hasCarbon ? `Carbon credit value: ${formatUSD(data.carbon.mid.annualUsd)}/year` : 'Carbon credit value: run /carbon first'}
        </Row>
        <Row ok={data.hasDigestate}>
          {data.hasDigestate ? `Digestate value: ${formatNGN(data.digestate.value.totalValue)}` : 'Digestate value: run /digestate first'}
        </Row>
        <Row ok={data.hasAudit}>{data.hasAudit ? `Audit trail: ${data.auditLog.length} entries logged` : 'Audit trail: no entries logged yet'}</Row>
        <Row ok={data.hasComparison}>
          {data.hasComparison ? `Feasibility comparison: ${data.scenarios.length} scenarios` : 'Feasibility comparison: no scenarios compared — run /compare for a richer report'}
        </Row>
        <Row ok={hasCustomDetails}>
          {hasCustomDetails ? 'Custom project details filled in' : 'Custom project details: fill the fields above for a personalised report'}
        </Row>
      </ul>
    </div>
  )
}
