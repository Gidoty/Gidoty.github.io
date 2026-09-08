import { CARBON_MARKET, IPCC_MANURE, ENERGY } from '../data/constants.js'
import { OPERATING_DAYS_PER_YEAR } from './calcEngine.js'
import { normalizeAuditEntry } from './auditDisplay.js'
import {
  formatCO2e,
  formatDecimal,
  formatKg,
  formatKwh,
  formatM3,
  formatNGN,
  formatUSD,
} from './format.js'

const NOT_AVAILABLE =
  'Data not available for this session — run the relevant calculator page first, then regenerate this report.'

// Builds the ordered content of the feasibility report as plain data
// (title + paragraphs + optional table per section), consumed identically
// by the on-screen preview (JSX) and the PDF generator (jsPDF text flow),
// so both always show the same numbers.
export function buildReportSections(data, meta, included) {
  const sections = []
  const push = (key, title, paragraphs, table = null) => {
    if (included[key] === false) return
    sections.push({ key, title, paragraphs, table })
  }

  // --- Executive Summary ---
  if (data.hasYield) {
    const y = data.yieldResults
    const s = data.substrate
    const summaryLines = [
      `This report presents the results of a biogas feasibility assessment conducted using G-BioCred for ${meta.projectName} located in ${meta.location || 'the specified site'}.`,
      `The assessment evaluates ${s.name} as the primary feedstock at a daily input of ${formatDecimal(data.dailyWasteKg, 1)} kg/day, yielding an estimated ${formatM3(y.biogasM3)} of biogas per day containing ${(y.ch4Content * 100).toFixed(0)}% methane (${formatM3(y.ch4M3)} CH₄/day).`,
    ]
    summaryLines.push('Key findings:')
    summaryLines.push(
      `Energy Potential — Daily electricity: ${formatKwh(y.electricalKwh)}/day. Daily thermal: ${formatKwh(y.thermalKwh)}/day. Annual electricity: ${formatKwh(y.electricalKwh * OPERATING_DAYS_PER_YEAR)}/year.`,
    )
    if (data.hasEmissions && data.emissionsChain.avoidedTonnes !== null) {
      summaryLines.push(
        `Emissions Reduction — Annual CO₂e avoided: ${formatCO2e(data.emissionsChain.annualTonnes)}/year. Baseline scenario: ${data.emissionsChain.scenario.label}. GWP standard: ${data.emissionsChain.gwpOption.label}.`,
      )
    }
    if (data.hasCarbon) {
      summaryLines.push(
        `Carbon Credit Potential — Annual credit volume: ${formatCO2e(data.carbon.annualTonnes)}. Applicable methodology: ${data.carbon.methodology.label}. Indicative revenue (mid-market): ${formatUSD(data.carbon.mid.annualUsd)}/year = ${formatNGN(data.carbon.mid.annualNgn)}/year.`,
      )
    }
    if (data.hasDigestate) {
      summaryLines.push(`Digestate Value — Annual fertiliser value: ${formatNGN(data.digestate.annualValue.totalValue)}/year.`)
    }
    if (data.combined) {
      summaryLines.push(
        `Combined Annual Project Value — ${formatUSD(data.combined.annualTotalUsd)}/year = ${formatNGN(data.combined.annualTotalNgn)}/year.`,
      )
    }
    if (data.digester) {
      summaryLines.push(
        `Recommended digester: ${formatM3(data.digester.chamberM3)} ${data.digester.type.label}. Estimated construction cost: ${formatUSD(data.digester.costUsd)} = ${formatNGN(data.digester.costUsd * CARBON_MARKET.ngnPerUsd)}.`,
      )
    }
    push('executiveSummary', 'Executive Summary', summaryLines)
  } else {
    push('executiveSummary', 'Executive Summary', [NOT_AVAILABLE])
  }

  // --- Project Overview ---
  push('projectOverview', 'Project Overview and Objectives', [
    `Project: ${meta.projectName}`,
    `Applicant / Organisation: ${meta.applicantName || 'Not specified'}`,
    `Location: ${meta.location || 'Not specified'}`,
    `Purpose: ${meta.purpose}`,
    'This assessment quantifies the biogas yield, methane emissions avoided, carbon credit potential, and digestate fertiliser value of an anaerobic digestion project, using peer-reviewed yield coefficients and IPCC Tier 1 methodology to give a defensible, auditable planning basis for investment and grant decisions.',
  ])

  // --- Substrate Analysis ---
  if (data.hasYield) {
    const s = data.substrate
    const y = data.yieldResults
    push(
      'substrateAnalysis',
      '1. Substrate Analysis and Yield Calculation',
      [
        `Feedstock: ${s.name} (${s.nameLocal})`,
        `Substrate Properties — Moisture content: ${(s.moistureContent * 100).toFixed(0)}%. Total solids: ${(s.totalSolids * 100).toFixed(0)}%. VS/TS ratio: ${(s.vsPctOfTS * 100).toFixed(0)}%. Specific biogas yield (SBY): ${s.specificBiogasYield.toFixed(2)} m³/kg VS. Methane content: ${(s.ch4Content * 100).toFixed(0)}%. HRT: ${s.hrt} days.`,
        `Source: ${s.source}`,
      ],
      {
        headers: ['Step', 'Calculation', 'Result'],
        rows: [
          ['1. Total Solids', `${formatKg(data.dailyWasteKg)} × ${y.tsFraction.toFixed(2)}`, formatKg(y.tsKg)],
          ['2. Volatile Solids', `${formatKg(y.tsKg)} × ${s.vsPctOfTS.toFixed(2)}`, formatKg(y.vsKg)],
          ['3. Biogas Volume', `${formatKg(y.vsKg)} × ${y.effectiveSBY.toFixed(2)} m³/kg VS`, formatM3(y.biogasM3)],
          ['4. Methane Volume', `${formatM3(y.biogasM3)} × ${y.ch4Content.toFixed(2)}`, formatM3(y.ch4M3)],
          [
            '5. Energy Output',
            `${formatM3(y.ch4M3)} × ${ENERGY.CH4_LHV_KWH_PER_M3} kWh/m³`,
            `${formatKwh(y.totalKwh)} (Elec ${formatKwh(y.electricalKwh)}, Thermal ${formatKwh(y.thermalKwh)})`,
          ],
        ],
      },
    )
  } else {
    push('substrateAnalysis', '1. Substrate Analysis and Yield Calculation', [NOT_AVAILABLE])
  }

  // --- Digester Sizing ---
  if (data.digester) {
    const d = data.digester
    push('digesterSizing', '2. Digester Sizing', [
      `Recommended Configuration — Type: ${d.type.label}. Digestion chamber: ${formatM3(d.chamberM3)}. Gas storage: ${formatM3(d.gasStorageM3)}. Total plant volume: ${formatM3(d.totalM3)}.`,
      `Calculation — Daily slurry input: ${formatM3(d.dailySlurryM3)}/day. HRT: ${d.hrtDays} days. Safety factor (${d.type.label}): ${d.type.safetyFactor.toFixed(2)}. Base volume = ${formatM3(d.dailySlurryM3)} × ${d.hrtDays} days = ${formatM3(d.baseVolumeM3)}. With safety factor: ${formatM3(d.baseVolumeM3)} × ${d.type.safetyFactor.toFixed(2)} = ${formatM3(d.chamberM3)}. Gas storage (30%): ${formatM3(d.gasStorageM3)}.`,
      `Estimated construction cost: ${formatM3(d.totalM3)} × ${formatUSD(d.type.cost_usd_per_m3)}/m³ = ${formatUSD(d.costUsd)} ≈ ${formatNGN(d.costUsd * CARBON_MARKET.ngnPerUsd)}.`,
      'Note: Cost estimate excludes piping, gas appliances, site preparation, and labour.',
    ])
  } else {
    push('digesterSizing', '2. Digester Sizing', [NOT_AVAILABLE])
  }

  // --- Emissions Analysis ---
  if (data.hasEmissions) {
    const e = data.emissionsChain
    const paragraphs = [
      'Methodology: IPCC 2006 Guidelines for National GHG Inventories, Volume 4 Chapter 10 (Livestock Manure Management) and Volume 5 Chapter 3 (Solid Waste Disposal).',
      `GWP Standard: ${e.gwpOption.label} (GWP₁₀₀ = ${e.gwpOption.gwp100.toFixed(1)}). Source: ${e.gwpOption.source}.`,
      `Baseline Scenario: ${e.scenario.label}. MCF: ${e.scenario.value ?? 'not applicable'}. Source: ${e.scenario.source}.`,
    ]
    if (e.baseline) {
      paragraphs.push(
        `Baseline CH₄ generation potential — Bo (${e.potential.boLabel}): ${e.potential.bo.toFixed(2)} m³ CH₄/kg VS. VS: ${formatKg(data.yieldResults.vsKg)}. CH₄ potential = ${formatKg(data.yieldResults.vsKg)} × ${e.potential.bo.toFixed(2)} = ${formatM3(e.potential.ch4M3)}. CH₄ mass = ${formatM3(e.potential.ch4M3)} × ${IPCC_MANURE.ch4DensityKgPerM3.value} kg/m³ = ${formatKg(e.baseline.ch4PotentialKg)}.`,
      )
      paragraphs.push(
        `Baseline CO₂e emissions: E_baseline = ${formatKg(e.baseline.ch4PotentialKg)} × ${e.scenario.value} × ${e.gwpOption.gwp100.toFixed(1)} ÷ 1000 = ${formatCO2e(e.baseline.tonnesCO2e)}.`,
      )
      paragraphs.push(
        `Project leakage (CDM Tool 14, ${(e.leakageFactor * 100).toFixed(0)}%): Fugitive CH₄ = ${formatM3(data.yieldResults.ch4M3)} × ${(e.leakageFactor * 100).toFixed(0)}% = ${formatM3(e.project.fugitiveM3)}. CH₄ mass = ${formatKg(e.project.fugitiveKg)}. E_project = ${formatKg(e.project.fugitiveKg)} × ${e.gwpOption.gwp100.toFixed(1)} ÷ 1000 = ${formatCO2e(e.project.tonnesCO2e)}.`,
      )
      paragraphs.push(
        `Net Emissions Avoided: ER = ${formatCO2e(e.baseline.tonnesCO2e)} − ${formatCO2e(e.project.tonnesCO2e)} = ${formatCO2e(e.avoidedTonnes)}. Reduction vs baseline: ${formatDecimal(e.reductionPct, 1)}%.`,
      )
    } else {
      paragraphs.push(
        'The selected baseline scenario (open burning) uses a combustion-factor formula (mass burnt × combustion factor × CH₄/N₂O emission factors) that this tool does not carry field-specific coefficients for, so a quantified baseline is not shown. Select a different baseline scenario for a quantified result.',
      )
    }
    push('emissionsAnalysis', '3. Emissions-Avoided Analysis', paragraphs)
  } else {
    push('emissionsAnalysis', '3. Emissions-Avoided Analysis', [NOT_AVAILABLE])
  }

  // --- Carbon Credits ---
  if (data.hasCarbon) {
    const c = data.carbon
    push(
      'carbonCredits',
      '4. Carbon Credit Assessment',
      [
        `Applicable Methodology: ${c.methodology.label}. Source: ${c.methodology.source}.`,
        `Annual credit volume (${OPERATING_DAYS_PER_YEAR} days): ${formatCO2e(c.annualTonnes)}/year. Scale classification: ${c.classification.label}.`,
        'Indicative market values shown below use a 10-year NPV at a 10% discount rate.',
        'Nigerian Regulatory Note: For Article 6.2 ITMO transfers, a National Council on Climate Change (NCCC) No-Objection is required. The Climate Change Act 2021 and 2025 Carbon Market Activation Policy (CMAP) provide the governance framework. Operational MRV rules are under development.',
        `Programme of Activities (PoA): For projects below ~12 t CO₂e/year, standalone verification is typically uneconomic. Aggregation via a PoA is recommended. Break-even: minimum ${c.breakevenN ? Math.ceil(c.breakevenN) : '—'} participating units at mid-market pricing.`,
      ],
      {
        headers: ['Scenario', 'Price', 'Annual', '10yr NPV'],
        rows: [
          ['Conservative', formatUSD(CARBON_MARKET.vcmConservative.usdPerTonne), formatUSD(c.conservative.annualUsd), formatUSD(c.conservative.npv)],
          ['Mid-market', formatUSD(CARBON_MARKET.vcmMid.usdPerTonne), formatUSD(c.mid.annualUsd), formatUSD(c.mid.npv)],
          ['Premium', formatUSD(CARBON_MARKET.vcmPremium.usdPerTonne), formatUSD(c.premium.annualUsd), formatUSD(c.premium.npv)],
        ],
      },
    )
  } else {
    push('carbonCredits', '4. Carbon Credit Assessment', [NOT_AVAILABLE])
  }

  // --- Digestate ---
  if (data.hasDigestate) {
    const dg = data.digestate
    const total = dg.digestateKg || 1
    push('digestateValue', '5. Digestate Economic Value', [
      `Estimated digestate: ${formatKg(dg.digestateKg)} per input batch. Annual: ${formatKg(dg.annualDigestateKg)}/year.`,
      `NPK Content — N: ${formatKg(dg.npk.nKg)} (${formatDecimal((dg.npk.nKg / total) * 100, 1)}%). P: ${formatKg(dg.npk.pKg)} (${formatDecimal((dg.npk.pKg / total) * 100, 1)}%). K: ${formatKg(dg.npk.kKg)} (${formatDecimal((dg.npk.kKg / total) * 100, 1)}%).`,
      `Fertiliser Replacement Value — Total: ${formatNGN(dg.value.totalValue)} = ${formatUSD(dg.value.totalValue / CARBON_MARKET.ngnPerUsd)}.`,
      `Annual fertiliser value (${OPERATING_DAYS_PER_YEAR} days): ${formatNGN(dg.annualValue.totalValue)} = ${formatUSD(dg.annualValue.totalValue / CARBON_MARKET.ngnPerUsd)}.`,
      'Source: NPK fractions from Tambone et al. (2010); Nkoa (2014); Nigerian fertiliser market prices 2025 (indicative).',
    ])
  } else {
    push('digestateValue', '5. Digestate Economic Value', [NOT_AVAILABLE])
  }

  // --- Feasibility Comparison ---
  if (data.hasComparison) {
    push(
      'comparison',
      'Feasibility Comparison',
      ['Scenarios compared in the Feasibility Comparison tool for this session:'],
      {
        headers: ['Scenario', 'Avoided (t CO₂e/yr)', 'Combined Value (₦/yr)'],
        rows: data.scenarios.map((s) => [s.name, formatCO2e(s.avoidedTonnesPerYear ?? 0), formatNGN(s.totalNgn ?? 0)]),
      },
    )
  }

  // --- Combined Economics ---
  if (data.combined) {
    const c = data.combined
    push(
      'combinedEconomics',
      '6. Combined Economic Summary',
      ['Component values combine expected energy self-consumption/sale, mid-market carbon credit revenue, and digestate fertiliser value.'],
      {
        headers: ['Component', 'Daily', `Annual (${OPERATING_DAYS_PER_YEAR}d)`],
        rows: [
          ['Energy value (₦80/kWh)*', formatNGN(c.dailyEnergyNgn), formatNGN(c.annualEnergyNgn)],
          ['Carbon credits (mid $8/t)', formatUSD(c.dailyCarbonUsd), formatUSD(c.annualCarbonUsd)],
          ['Digestate value', formatNGN(c.dailyDigestateNgn), formatNGN(c.annualDigestateNgn)],
          ['Total combined value (USD)', formatUSD(c.dailyTotalUsd), formatUSD(c.annualTotalUsd)],
          ['Total combined value (NGN)', formatNGN(c.dailyTotalNgn), formatNGN(c.annualTotalNgn)],
        ],
      },
    )
    if (sections[sections.length - 1]?.key === 'combinedEconomics') {
      sections[sections.length - 1].footnote = '*Indicative Nigerian grid buy-in rate 2025'
    }
  } else {
    push('combinedEconomics', '6. Combined Economic Summary', [NOT_AVAILABLE])
  }

  // --- Methodology References ---
  push('methodologyReferences', '7. Methodology and References', [
    'This assessment uses the following published methodologies and data.',
    'Biogas Yield Model: IPCC (2006). 2006 IPCC Guidelines for National GHG Inventories, Volume 4: Agriculture, Forestry and Other Land Use, Chapter 10. IGES, Japan. · Aisien, F.A. and Aisien, E.T. Biogas from cassava peels and cow dung. Detritus. · Adelekan, B.A. and Bamgboye, A.I. (2009). Comparison of biogas productivity of cassava peels mixed in selected ratios with major livestock waste types. African Journal of Agricultural Research. · Owhonda, G. (2024). Production and Analysis of Biogas from Cow Dung. MSc Dissertation, NLNG Centre for Gas, Refining and Petrochemical Engineering, University of Port Harcourt.',
    'Energy Conversion: Clarke Energy Technical Reference (methane LHV 9.97 kWh/m³). · FNR (2009). Biogas Basisdaten Deutschland. via energypedia.',
    'GHG Emissions: IPCC (2021). Climate Change 2021: The Physical Science Basis. Working Group I, Sixth Assessment Report (AR6). Table 7.SM.7. · IPCC (2006). 2006 IPCC Guidelines, Volume 5: Waste, Chapter 3.',
    'Carbon Credit Methodology: Gold Standard Foundation (2023). Animal Waste Management Systems (AWMS) Methodology v2.0. Geneva. · UNFCCC CDM Executive Board. AMS-III.D and AMS-III.R. · UNFCCC Article 6.4 Supervisory Body (2025). Paris Agreement Crediting Mechanism.',
    'Market Pricing: Ecosystem Marketplace (2025). State of the Voluntary Carbon Market 2025. Forest Trends. · MSCI (2025). State of Integrity in the Global Carbon-Credit Market. · Abatable (2025). Carbon Credit Pricing Analysis.',
    'Nigerian Regulatory Framework: Federal Republic of Nigeria (2021). Climate Change Act 2021. · NCCC (2023). Regulatory Guidance on Carbon Market Approach. · Federal Republic of Nigeria (2011). Nigerian Evidence Act 2011, Sections 84–87.',
    'Digestate Values: Tambone, F. et al. (2010). Assessing amendment properties of digestate. Bioresource Technology. · Nkoa, R. (2014). Agricultural benefits and environmental risks of soil fertilisation with anaerobic digestates. Agronomy for Sustainable Development.',
  ])

  // --- Audit Trail Summary ---
  if (data.hasAudit) {
    push(
      'auditSummary',
      '8. Calculation Audit Trail',
      [
        'Audit algorithm: SHA-256 (FIPS PUB 180-4). Implementation: Web Crypto API. Legal reference: Nigerian Evidence Act 2011 ss.84–87.',
        'Full audit log available in the G-BioCred application: /audit',
      ],
      {
        headers: ['Type', 'Key Result', 'Timestamp', 'Hash'],
        rows: data.auditLog
          .slice(0, 10)
          .map((e) => {
            const d = normalizeAuditEntry(e)
            return [d.label, d.keyResult, e.timestamp, `${e.hash.slice(0, 8)}…${e.hash.slice(-8)}`]
          }),
      },
    )
  } else {
    push('auditSummary', '8. Calculation Audit Trail', [NOT_AVAILABLE])
  }

  // --- Recommendations ---
  push('recommendations', '9. Recommendations and Next Steps', [
    'Based on this feasibility assessment, the following actions are recommended.',
    'Immediate (0–3 months): (1) Verify actual waste volumes through a 30-day measurement exercise. Laboratory BMP testing of your specific feedstock will improve yield accuracy. (2) Engage a qualified biogas engineer to confirm digester sizing and site assessment. (3) Contact the Development Bank of Nigeria (DBN) or Bank of Industry (BOI) regarding the Renewable Energy Fund for construction financing.',
    'Medium term (3–12 months): (4) For carbon credit access, contact an accredited Gold Standard Project Developer or Programme of Activities Coordinating/Managing Entity (PoA CME) operating in Nigeria. (5) Obtain environmental permits from your State Environmental Protection Agency (SEPA) and relevant state ministry. (6) Submit an NCCC No-Objection letter if pursuing Article 6.2 internationally transferred mitigation outcomes.',
    'Note: All figures in this report are planning-level estimates. Final investment decisions should be based on site-specific engineering assessment, laboratory substrate analysis, and professional carbon project development advice.',
  ])

  // --- Disclaimer ---
  push('disclaimer', 'Disclaimer', [
    'This report was generated using G-BioCred v1.0, an open-access planning tool developed at the NLNG Centre for Gas, Refining and Petrochemical Engineering, University of Port Harcourt. All calculations use published IPCC methodology and peer-reviewed substrate yield coefficients.',
    'Results are indicative planning estimates and do not constitute a certified carbon credit calculation, an engineering design, or investment advice. Independent verification by an accredited body is required before carbon credits can be issued or traded.',
    'Built by: Gideon Owhonda, NLNG Centre for Gas, Refining and Petrochemical Engineering, University of Port Harcourt. gideon.owhonda@cgrpng.org',
    'Tool: https://gidoty.github.io/g-biocred',
  ])

  return sections
}
