import Papa from 'papaparse'
import { CARBON_MARKET } from '../data/constants.js'

export function buildReportCsv(data) {
  const rows = []
  const add = (Category, Metric, Value, Unit) => rows.push({ Category, Metric, Value, Unit })

  if (data.hasYield) {
    const s = data.substrate
    const y = data.yieldResults
    add('Substrate', 'Moisture content', (s.moistureContent * 100).toFixed(1), '%')
    add('Substrate', 'Total solids', (s.totalSolids * 100).toFixed(1), '%')
    add('Substrate', 'VS/TS ratio', (s.vsPctOfTS * 100).toFixed(1), '%')
    add('Substrate', 'Specific biogas yield', s.specificBiogasYield.toFixed(2), 'm3/kg VS')
    add('Substrate', 'CH4 content', (s.ch4Content * 100).toFixed(1), '%')
    add('Substrate', 'HRT', s.hrt, 'days')
    add('Yield', 'Fresh weight', data.dailyWasteKg.toFixed(1), 'kg')
    add('Yield', 'Total solids', y.tsKg.toFixed(1), 'kg')
    add('Yield', 'Volatile solids', y.vsKg.toFixed(1), 'kg')
    add('Yield', 'Biogas volume', y.biogasM3.toFixed(2), 'm3')
    add('Yield', 'Methane volume', y.ch4M3.toFixed(2), 'm3')
    add('Energy', 'Total LHV energy', y.totalKwh.toFixed(1), 'kWh')
    add('Energy', 'Electrical energy', y.electricalKwh.toFixed(1), 'kWh')
    add('Energy', 'Thermal energy', y.thermalKwh.toFixed(1), 'kWh')
  }

  if (data.digester) {
    const d = data.digester
    add('Digester Sizing', 'Digestion chamber volume', d.chamberM3.toFixed(2), 'm3')
    add('Digester Sizing', 'Gas storage volume', d.gasStorageM3.toFixed(2), 'm3')
    add('Digester Sizing', 'Total plant volume', d.totalM3.toFixed(2), 'm3')
    add('Digester Sizing', 'Estimated construction cost', d.costUsd.toFixed(2), 'USD')
    add('Digester Sizing', 'Estimated construction cost', (d.costUsd * CARBON_MARKET.ngnPerUsd).toFixed(0), 'NGN')
  }

  if (data.hasEmissions) {
    const e = data.emissionsChain
    if (e.baseline) {
      add('Emissions', 'Baseline emissions', e.baseline.tonnesCO2e.toFixed(3), 't CO2e')
      add('Emissions', 'Project emissions (leakage)', e.project.tonnesCO2e.toFixed(3), 't CO2e')
      add('Emissions', 'Net emissions avoided', e.avoidedTonnes.toFixed(3), 't CO2e')
      add('Emissions', 'Reduction vs baseline', e.reductionPct.toFixed(1), '%')
      add('Emissions', 'Annual avoided emissions', e.annualTonnes.toFixed(3), 't CO2e/year')
    }
  }

  if (data.hasCarbon) {
    const c = data.carbon
    add('Carbon Credit', 'Annual value (conservative)', c.conservative.annualUsd.toFixed(2), 'USD')
    add('Carbon Credit', 'Annual value (mid)', c.mid.annualUsd.toFixed(2), 'USD')
    add('Carbon Credit', 'Annual value (premium)', c.premium.annualUsd.toFixed(2), 'USD')
    add('Carbon Credit', '10yr NPV (conservative)', c.conservative.npv.toFixed(2), 'USD')
    add('Carbon Credit', '10yr NPV (mid)', c.mid.npv.toFixed(2), 'USD')
    add('Carbon Credit', '10yr NPV (premium)', c.premium.npv.toFixed(2), 'USD')
  }

  if (data.hasDigestate) {
    const dg = data.digestate
    add('Digestate', 'N content', dg.npk.nKg.toFixed(2), 'kg')
    add('Digestate', 'P content', dg.npk.pKg.toFixed(2), 'kg')
    add('Digestate', 'K content', dg.npk.kKg.toFixed(2), 'kg')
    add('Digestate', 'Fertiliser replacement value', dg.value.totalValue.toFixed(0), 'NGN')
    add('Digestate', 'Annual fertiliser value', dg.annualValue.totalValue.toFixed(0), 'NGN')
  }

  if (data.combined) {
    const c = data.combined
    add('Combined Economics', 'Daily energy value', c.dailyEnergyNgn.toFixed(0), 'NGN')
    add('Combined Economics', 'Annual energy value', c.annualEnergyNgn.toFixed(0), 'NGN')
    add('Combined Economics', 'Annual carbon value', c.annualCarbonUsd.toFixed(2), 'USD')
    add('Combined Economics', 'Annual digestate value', c.annualDigestateNgn.toFixed(0), 'NGN')
    add('Combined Economics', 'Total combined annual value', c.annualTotalNgn.toFixed(0), 'NGN')
    add('Combined Economics', 'Total combined annual value', c.annualTotalUsd.toFixed(2), 'USD')
  }

  data.auditLog.forEach((entry, i) => {
    add('Audit', `Entry ${data.auditLog.length - i} hash`, entry.hash, entry.type)
  })

  return Papa.unparse({ fields: ['Category', 'Metric', 'Value', 'Unit'], data: rows })
}
