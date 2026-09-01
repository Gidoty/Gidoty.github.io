import { useMemo, useState } from 'react'
import CRUDES from '../data/crudes.js'
import {
  computeArmitResult,
  computeVduRestoration,
  computeH2Restoration,
  computeFurnaceEfficiency,
  computeFccCatalyst,
  computeVguRouting,
} from '../utils/calcEngine.js'
import BaselinePanel from '../components/constraint-simulator/BaselinePanel.jsx'
import VduCard from '../components/constraint-simulator/VduCard.jsx'
import H2Card from '../components/constraint-simulator/H2Card.jsx'
import FurnaceCard from '../components/constraint-simulator/FurnaceCard.jsx'
import CatalystCard from '../components/constraint-simulator/CatalystCard.jsx'
import RoutingCard from '../components/constraint-simulator/RoutingCard.jsx'
import CombinedSummary from '../components/constraint-simulator/CombinedSummary.jsx'
import PageCta from '../components/shared/PageCta.jsx'

// Hydrocracker diesel yield isn't a baseline input on this page (mirrors the
// crude advisor) — held at the calculator's own default.
const HC_DIESEL_YIELD_PCT = 68

const DEFAULT_BASELINE = {
  crudeKey: 'bonnyLight',
  throughputBpd: 60000,
  deliveredCost: 72.65,
  opexPerBbl: 10.2,
  prices: {
    lpg: 85.0,
    motorSpirit: 95.0,
    kerosene: 98.0,
    diesel: 102.0,
    fuelOil: 55.0,
    lcoClo: 62.0,
  },
  currentVacuum: 15,
  currentFccConversion: 55,
  currentH2Supply: 32,
  currentHcThroughput: 4000,
  hcDesignCapacity: 5700,
  fccFeedBpd: 16600,
  fccDesignCapacity: 18000,
}

export default function ConstraintSimulator() {
  const [baselineState, setBaselineState] = useState(DEFAULT_BASELINE)

  // Shared FCC/HC VGO split: drives the baseline pipeline and doubles as
  // Card 5's "current" split (single source of truth for that value).
  const [fccSplitPct, setFccSplitPct] = useState(60)

  const [targetVacuum, setTargetVacuum] = useState(11)
  const [maintenanceCost, setMaintenanceCost] = useState(180000)

  const [targetH2, setTargetH2] = useState(40)
  const [interventionCostH2, setInterventionCostH2] = useState(22000)
  const [additionalH2OpexDaily, setAdditionalH2OpexDaily] = useState(8200)

  const [currentFurnaceEff, setCurrentFurnaceEff] = useState(82)
  const [targetFurnaceEff, setTargetFurnaceEff] = useState(87)
  const [fuelGasCost, setFuelGasCost] = useState(8.5)
  const [interventionCostFurnace, setInterventionCostFurnace] = useState(95000)

  const [targetFccConversion, setTargetFccConversion] = useState(58)
  const [additionalCatalystCost, setAdditionalCatalystCost] = useState(500)
  const [interventionCostCatalyst, setInterventionCostCatalyst] = useState(0)

  const [targetFccSplitPct, setTargetFccSplitPct] = useState(70)

  const crude = CRUDES[baselineState.crudeKey]

  const baseline = useMemo(
    () =>
      computeArmitResult({
        crude,
        throughputBpd: baselineState.throughputBpd,
        crudeCost: baselineState.deliveredCost,
        vacuumPressure: baselineState.currentVacuum,
        fccSplitPct,
        fccConversionPct: baselineState.currentFccConversion,
        hcDieselYieldPct: HC_DIESEL_YIELD_PCT,
        prices: baselineState.prices,
        opexPerBbl: baselineState.opexPerBbl,
      }),
    [crude, baselineState, fccSplitPct],
  )

  const vduResult = useMemo(
    () =>
      computeVduRestoration({
        arBpd: baseline.cdu.atmResidue,
        currentVacuum: baselineState.currentVacuum,
        targetVacuum,
        prices: baselineState.prices,
        maintenanceCost,
      }),
    [baseline, baselineState.currentVacuum, baselineState.prices, targetVacuum, maintenanceCost],
  )

  const h2Result = useMemo(
    () =>
      computeH2Restoration({
        currentH2: baselineState.currentH2Supply,
        targetH2,
        hcCapacity: baselineState.hcDesignCapacity,
        currentHc: baselineState.currentHcThroughput,
        prices: baselineState.prices,
        interventionCost: interventionCostH2,
        additionalH2OpexDaily,
      }),
    [baselineState, targetH2, interventionCostH2, additionalH2OpexDaily],
  )

  const furnaceResult = useMemo(
    () =>
      computeFurnaceEfficiency({
        throughputBpd: baselineState.throughputBpd,
        crudeSg: crude.sg,
        currentEfficiencyPct: currentFurnaceEff,
        targetEfficiencyPct: targetFurnaceEff,
        fuelGasCostPerGcal: fuelGasCost,
        interventionCost: interventionCostFurnace,
      }),
    [baselineState.throughputBpd, crude, currentFurnaceEff, targetFurnaceEff, fuelGasCost, interventionCostFurnace],
  )

  const catalystResult = useMemo(
    () =>
      computeFccCatalyst({
        fccFeedBpd: baselineState.fccFeedBpd,
        crudeSg: crude.sg,
        currentConversionPct: baselineState.currentFccConversion,
        targetConversionPct: targetFccConversion,
        msPrice: baselineState.prices.motorSpirit,
        additionalCatalystCostDaily: additionalCatalystCost,
        interventionCost: interventionCostCatalyst,
      }),
    [baselineState, crude, targetFccConversion, additionalCatalystCost, interventionCostCatalyst],
  )

  const routingResult = useMemo(
    () =>
      computeVguRouting({
        vgoBpd: baseline.vdu.vgoBpd,
        crudeSg: crude.sg,
        fccConversionPct: baselineState.currentFccConversion,
        hcDieselYieldPct: HC_DIESEL_YIELD_PCT,
        currentPctFcc: fccSplitPct,
        targetPctFcc: targetFccSplitPct,
        prices: baselineState.prices,
      }),
    [baseline, crude, baselineState.currentFccConversion, baselineState.prices, fccSplitPct, targetFccSplitPct],
  )

  const combinedInterventions = [
    { name: 'VDU Vacuum Restoration', dailyGain: vduResult.dailyMarginGain, annualGain: vduResult.annualGain, cost: vduResult.cost, paybackDays: vduResult.paybackDays, roi: vduResult.roi },
    { name: 'H2 Supply Stabilisation', dailyGain: h2Result.dailyMarginGain, annualGain: h2Result.annualGain, cost: h2Result.cost, paybackDays: h2Result.paybackDays, roi: h2Result.roi },
    { name: 'CDU Furnace Efficiency', dailyGain: furnaceResult.dailyMarginGain, annualGain: furnaceResult.annualGain, cost: furnaceResult.cost, paybackDays: furnaceResult.paybackDays, roi: furnaceResult.roi },
    { name: 'FCC Catalyst Activity', dailyGain: catalystResult.dailyMarginGain, annualGain: catalystResult.annualGain, cost: catalystResult.cost, paybackDays: catalystResult.paybackDays, roi: catalystResult.roi },
    { name: 'VGO Routing Optimisation', dailyGain: routingResult.dailyMarginGain, annualGain: routingResult.annualGain, cost: 0, paybackDays: 0, roi: null },
  ]

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-armit-text sm:text-4xl">
            Constraint Relief Simulator
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-armit-muted print:hidden">
            See the exact dollar value of fixing each bottleneck — before you spend a single
            dollar.
          </p>
        </div>

        <div className="print:hidden">
          <BaselinePanel state={baselineState} setState={setBaselineState} baseline={baseline} />
        </div>

        <div className="mt-10 space-y-6 print:hidden">
          <h2 className="text-2xl font-extrabold text-armit-text sm:text-3xl">
            Intervention Simulators
          </h2>

          <VduCard
            currentVacuum={baselineState.currentVacuum}
            targetVacuum={targetVacuum}
            onTargetVacuumChange={setTargetVacuum}
            maintenanceCost={maintenanceCost}
            onMaintenanceCostChange={setMaintenanceCost}
            result={vduResult}
            baselineDaily={baseline.grossMarginPerDay}
          />

          <H2Card
            currentH2={baselineState.currentH2Supply}
            targetH2={targetH2}
            onTargetH2Change={setTargetH2}
            interventionCost={interventionCostH2}
            onInterventionCostChange={setInterventionCostH2}
            additionalH2OpexDaily={additionalH2OpexDaily}
            onAdditionalH2OpexDailyChange={setAdditionalH2OpexDaily}
            result={h2Result}
            baselineDaily={baseline.grossMarginPerDay}
          />

          <FurnaceCard
            currentEfficiency={currentFurnaceEff}
            onCurrentEfficiencyChange={setCurrentFurnaceEff}
            targetEfficiency={targetFurnaceEff}
            onTargetEfficiencyChange={setTargetFurnaceEff}
            fuelGasCost={fuelGasCost}
            onFuelGasCostChange={setFuelGasCost}
            interventionCost={interventionCostFurnace}
            onInterventionCostChange={setInterventionCostFurnace}
            result={furnaceResult}
            baselineDaily={baseline.grossMarginPerDay}
          />

          <CatalystCard
            currentConversion={baselineState.currentFccConversion}
            targetConversion={targetFccConversion}
            onTargetConversionChange={setTargetFccConversion}
            additionalCatalystCost={additionalCatalystCost}
            onAdditionalCatalystCostChange={setAdditionalCatalystCost}
            interventionCost={interventionCostCatalyst}
            onInterventionCostChange={setInterventionCostCatalyst}
            result={catalystResult}
            baselineDaily={baseline.grossMarginPerDay}
          />

          <RoutingCard
            currentPctFcc={fccSplitPct}
            onCurrentPctFccChange={setFccSplitPct}
            targetPctFcc={targetFccSplitPct}
            onTargetPctFccChange={setTargetFccSplitPct}
            result={routingResult}
            baselineDaily={baseline.grossMarginPerDay}
          />
        </div>

        <div className="mt-10">
          <CombinedSummary interventions={combinedInterventions} />
        </div>

        <div className="mt-10 flex justify-center rounded-2xl border border-white/10 bg-armit-card p-8 print:hidden">
          <PageCta to="/stress-tester">Stress Test Your Interventions</PageCta>
        </div>
      </div>
    </div>
  )
}
