// MarginIQ Core Margin Calculator — calculation engine.
// Pure functions only: given an inputs object, return the full result set.
// No API calls, no side effects — every figure here is derived client-side.

const L_PER_BBL = 158.987
const M3_PER_BBL = 0.15899

const FCC_DENSITY = { lpg: 0.58, naphtha: 0.74, lco: 0.92, clo: 0.95 }
const HC_DENSITY = { diesel: 0.84, naphtha: 0.74, gas: 0.58 }

function feedMassKgPerDay(feedBpd, crudeSg) {
  return feedBpd * M3_PER_BBL * crudeSg * 1000
}

function wtFractionToVolBpd(wtFraction, feedMassKgPerDay_, densityKgPerL) {
  return (wtFraction * feedMassKgPerDay_) / (densityKgPerL * L_PER_BBL)
}

/** Atmospheric CDU cuts, in bpd, from crude assay yield percentages. */
export function computeCduCuts(crude, throughputBpd) {
  const y = crude.yields
  return {
    lightEnds: (throughputBpd * y.lightEnds) / 100,
    lightNaphtha: (throughputBpd * y.lightNaphtha) / 100,
    heavyNaphtha: (throughputBpd * y.heavyNaphtha) / 100,
    kerosene: (throughputBpd * y.kerosene) / 100,
    diesel: (throughputBpd * y.diesel) / 100,
    atmResidue: (throughputBpd * y.atmResidue) / 100,
    losses: (throughputBpd * y.losses) / 100,
  }
}

/** Vacuum Distillation Unit: splits Atmospheric Residue into VGO and Vacuum Residue. */
export function computeVdu(arBpd, vacuumPressureMmHg) {
  const vgoYieldPct = 72.5 - 0.71 * vacuumPressureMmHg
  const vgoBpd = (arBpd * vgoYieldPct) / 100
  const vrBpd = arBpd - vgoBpd
  return { vgoYieldPct, vgoBpd, vrBpd }
}

/** Fluid Catalytic Cracker: converts VGO feed into cracked products. */
export function computeFcc(feedBpd, crudeSg, conversionPct) {
  const feedMass = feedMassKgPerDay(feedBpd, crudeSg)

  const dryGasWt = 0.04
  const lpgWt = 0.15
  const naphthaWt = 0.46 * (conversionPct / 55)
  const lcoWt = 0.19
  const cloWt = 0.07
  const cokeWt = 0.09

  return {
    feedBpd,
    lpgBpd: wtFractionToVolBpd(lpgWt, feedMass, FCC_DENSITY.lpg),
    naphthaBpd: wtFractionToVolBpd(naphthaWt, feedMass, FCC_DENSITY.naphtha),
    lcoBpd: wtFractionToVolBpd(lcoWt, feedMass, FCC_DENSITY.lco),
    cloBpd: wtFractionToVolBpd(cloWt, feedMass, FCC_DENSITY.clo),
    dryGasWt,
    cokeWt,
  }
}

/** Hydrocracker: converts VGO feed into diesel, naphtha, and gas. */
export function computeHydrocracker(feedBpd, crudeSg, dieselYieldPct) {
  const feedMass = feedMassKgPerDay(feedBpd, crudeSg)

  const dieselWt = dieselYieldPct / 100
  const naphthaWt = 0.22
  const gasWt = 0.1

  return {
    feedBpd,
    dieselBpd: wtFractionToVolBpd(dieselWt, feedMass, HC_DENSITY.diesel),
    naphthaBpd: wtFractionToVolBpd(naphthaWt, feedMass, HC_DENSITY.naphtha),
    gasBpd: wtFractionToVolBpd(gasWt, feedMass, HC_DENSITY.gas),
  }
}

/**
 * Runs the full CDU -> VDU -> FCC/Hydrocracker -> product slate -> margin
 * pipeline for a given set of user inputs. Everything here is deterministic
 * and re-derived on every call, so it's safe to run on every input change.
 */
export function computeArmitResult(inputs) {
  const {
    crude,
    throughputBpd,
    crudeCost,
    vacuumPressure,
    fccSplitPct,
    fccConversionPct,
    hcDieselYieldPct,
    prices,
    opexPerBbl,
  } = inputs

  const cdu = computeCduCuts(crude, throughputBpd)
  const vdu = computeVdu(cdu.atmResidue, vacuumPressure)

  const fccFeedBpd = (vdu.vgoBpd * fccSplitPct) / 100
  const hcFeedBpd = (vdu.vgoBpd * (100 - fccSplitPct)) / 100

  const fcc = computeFcc(fccFeedBpd, crude.sg, fccConversionPct)
  const hc = computeHydrocracker(hcFeedBpd, crude.sg, hcDieselYieldPct)

  // Light naphtha is straight-run and bypasses the CCR (catalyst poisons),
  // so it blends directly into the gasoline pool alongside CCR reformate
  // (heavy naphtha, treated here as a volume-neutral pass through the CCR).
  const slate = {
    lpg: { label: 'LPG', bpd: cdu.lightEnds + fcc.lpgBpd, price: prices.lpg },
    motorSpirit: {
      label: 'Motor Spirit (Gasoline)',
      bpd: cdu.lightNaphtha + cdu.heavyNaphtha + fcc.naphthaBpd + hc.naphthaBpd,
      price: prices.motorSpirit,
    },
    kerosene: { label: 'Kerosene / ATK', bpd: cdu.kerosene, price: prices.kerosene },
    diesel: { label: 'Diesel / AGO', bpd: cdu.diesel + hc.dieselBpd, price: prices.diesel },
    fuelOil: { label: 'Fuel Oil', bpd: vdu.vrBpd, price: prices.fuelOil },
    lcoClo: { label: 'LCO / CLO', bpd: fcc.lcoBpd + fcc.cloBpd, price: prices.lcoClo },
  }

  let totalRevenue = 0
  let totalSlateBpd = 0
  for (const product of Object.values(slate)) {
    product.revenuePerDay = product.bpd * product.price
    product.pctOfCrude = (product.bpd / throughputBpd) * 100
    totalRevenue += product.revenuePerDay
    totalSlateBpd += product.bpd
  }

  const crudeCostPerDay = throughputBpd * crudeCost
  const grossMarginPerDay = totalRevenue - crudeCostPerDay
  const grossMarginPerBbl = grossMarginPerDay / throughputBpd
  const netMarginPerBbl = grossMarginPerBbl - opexPerBbl
  const netMarginPerDay = netMarginPerBbl * throughputBpd

  // 3-2-1 crack spread (simplified benchmark): 2 bbl gasoline + 1 bbl diesel
  // vs. 3 bbl crude, all in $/bbl (the classic NYMEX version multiplies
  // gasoline/heating-oil by 42 because those futures are quoted in $/gal —
  // not applicable here since our product prices are already $/bbl).
  // Intentionally a rough external benchmark, not an assay-based figure —
  // that's what the MarginIQ true margin is for.
  const crack321 = (2 * prices.motorSpirit + 1 * prices.diesel - 3 * crudeCost) / 3

  // EII-style energy intensity index (Solomon EII-style proxy).
  const actualEnergyGcalPerDay = throughputBpd * 0.00102
  const referenceEnergyGcalPerDay = throughputBpd * 0.000887
  const eiiProxy = (actualEnergyGcalPerDay / referenceEnergyGcalPerDay) * 100
  const firedDutyGcalPerHr = actualEnergyGcalPerDay / 24

  return {
    cdu,
    vdu,
    fcc,
    hc,
    slate,
    totalRevenue,
    totalSlateBpd,
    crudeCostPerDay,
    grossMarginPerDay,
    grossMarginPerBbl,
    netMarginPerBbl,
    netMarginPerDay,
    crack321,
    eiiProxy,
    actualEnergyGcalPerDay,
    referenceEnergyGcalPerDay,
    firedDutyGcalPerHr,
  }
}
