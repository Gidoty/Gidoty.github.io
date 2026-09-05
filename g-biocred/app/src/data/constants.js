export const ENERGY = {
  CH4_LHV_KWH_PER_M3: 9.97,
  ELECTRICAL_EFFICIENCY: 0.30,
  THERMAL_EFFICIENCY: 0.60,
  BIOGAS_KWH_PER_M3_AT_60PCT_CH4: 6.0,
  source: "Clarke Energy / TU Delft tables; FNR 2009 via energypedia; " +
    "smallholder generator 25-35% range (30% default conservative)"
};

export const GWP_OPTIONS = {
  AR6_BIOGENIC: {
    label: "AR6 Biogenic CH₄ (recommended)",
    gwp100: 27.0,
    gwp20: 80.8,
    registries: ["Gold Standard AWMS v2", "Verra VCS (post-2022)"],
    source: "IPCC AR6 WGI (2021) Table 7.SM.7"
  },
  AR6_FOSSIL: {
    label: "AR6 Fossil CH₄",
    gwp100: 29.8,
    gwp20: 82.5,
    registries: ["EU ETS", "UK ETS"],
    source: "IPCC AR6 WGI (2021) Table 7.SM.7"
  },
  AR5: {
    label: "AR5 CH₄ (legacy CDM)",
    gwp100: 28.0,
    gwp20: 84.0,
    registries: ["CDM (pre-2023)", "Some national registries"],
    source: "IPCC AR5 (2013) Table 8.7"
  }
};

export const IPCC_MCF = {
  openDumpDeep: {
    label: "Open Dump (deep, >5m)",
    value: 0.8,
    source: "IPCC 2006 Vol.5 Ch.3 Table 5.1"
  },
  openDumpShallow: {
    label: "Open Dump (shallow, <5m)",
    value: 0.4,
    source: "IPCC 2006 Vol.5 Ch.3 Table 5.1"
  },
  uncoveredLagoonWarm: {
    label: "Uncovered Anaerobic Lagoon (warm climate >25°C)",
    value: 0.73,
    source: "IPCC 2006 Vol.4 Ch.10 Table 10.17 (66-80% range; 73% midpoint used)"
  },
  drylot: {
    label: "Drylot / Open Pasture",
    value: 0.015,
    source: "IPCC 2006 Vol.4 Ch.10 Table 10.17"
  },
  openBurning: {
    label: "Open Burning of Residue",
    value: null,
    note: "Uses separate burning formula; not a simple MCF",
    source: "IPCC 2006 Vol.4 Ch.2"
  }
};

export const IPCC_MANURE = {
  cattleBoAfrica: {
    label: "African Cattle Bo",
    value: 0.13,
    unit: "m³ CH₄/kg VS",
    source: "IPCC 2006 Vol.4 Ch.10 Table 10.16"
  },
  poultryBo: {
    label: "Poultry Bo",
    value: 0.36,
    unit: "m³ CH₄/kg VS",
    source: "IPCC 2006 Vol.4 Ch.10 Table 10.16"
  },
  ch4DensityKgPerM3: {
    label: "CH₄ density at 20°C, 1 atm",
    value: 0.67,
    unit: "kg/m³",
    source: "Standard thermodynamic reference"
  },
  digesterLeakage: {
    label: "Digester fugitive leakage (conservative default)",
    value: 0.10,
    source: "CDM Tool 14; AM0073 uses 15% — 10% used as conservative planning default"
  }
};

export const CARBON_MARKET = {
  vcmConservative: {
    label: "VCM Conservative (African baseline)",
    usdPerTonne: 4.0,
    source: "Ecosystem Marketplace SOVCM 2025; African market floor ~$3–4/t"
  },
  vcmMid: {
    label: "VCM Mid (quality certified)",
    usdPerTonne: 8.0,
    source: "MSCI Carbon Credit Price Index 2025: investment-grade avg $14.80/t; " +
      "African biogas ~$6–10/t"
  },
  vcmPremium: {
    label: "VCM Premium (metered, CCP-labelled, Art.6.2)",
    usdPerTonne: 25.0,
    source: "Gold Standard CCP-approved; Abatable 2025: $15–39 top-tier; " +
      "Ghana ITMO precedent July 2025"
  },
  ngnPerUsd: 1600
};

export const DIGESTER_TYPES = {
  fixedDome: {
    label: "Fixed Dome (Chinese model)",
    hydraulicRetentionFactor: 1.0,
    safetyFactor: 1.25,
    description: "Most common in Nigeria/Africa. No moving parts, underground, durable.",
    cost_usd_per_m3: 80
  },
  floatingDrum: {
    label: "Floating Drum (Indian model — KVIC)",
    hydraulicRetentionFactor: 1.0,
    safetyFactor: 1.20,
    description: "Constant pressure gas output. Drum can corrode in humid climates.",
    cost_usd_per_m3: 100
  },
  tubularBag: {
    label: "Tubular Plastic Bag",
    hydraulicRetentionFactor: 0.9,
    safetyFactor: 1.15,
    description: "Lowest cost. Vulnerable to physical damage. Common in Latin America " +
      "and increasingly West Africa.",
    cost_usd_per_m3: 40
  }
};

export const DIGESTATE_NPK = {
  cowDung: { N: 0.018, P: 0.009, K: 0.012 },
  poultryLitter: { N: 0.025, P: 0.015, K: 0.018 },
  cassavaPeels: { N: 0.008, P: 0.004, K: 0.022 },
  poultryDungCoDigestion: { N: 0.022, P: 0.012, K: 0.015 },
  cassavaDungCoDigestion: { N: 0.013, P: 0.007, K: 0.017 },
  pome: { N: 0.012, P: 0.008, K: 0.010 },
  riceStraw: { N: 0.006, P: 0.003, K: 0.014 },
  foodWaste: { N: 0.020, P: 0.010, K: 0.016 },
  sugarcaneBagasse: { N: 0.005, P: 0.002, K: 0.010 },
  source: "Published digestate NPK mass fractions (kg nutrient per kg fresh " +
    "digestate, wet basis) drawn from anaerobic digestate characterisation " +
    "studies for manure and agro-residue feedstocks, cross-checked against " +
    "FAO fertiliser replacement value guidance."
};
