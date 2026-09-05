export const SUBSTRATES = {
  cowDung: {
    id: "cowDung",
    name: "Cow / Cattle Dung",
    nameLocal: "Maalu/Nagge Shit (Hausa)",
    icon: "🐄",
    moistureContent: 0.82,
    totalSolids: 0.18,
    vsPctOfTS: 0.84,
    specificBiogasYield: 0.25,
    ch4Content: 0.65,
    hrt: 30,
    source: "Aisien & Aisien (Detritus); IPCC 2006 Vol.4 Ch.10 Table 10.16 " +
      "(Bo = 0.13 m³ CH₄/kg VS, African cattle)",
    notes: "Based on Nigerian Zebu/smallholder dung. Conservative mid-range value. " +
      "Peak CH₄ at 35°C per Owhonda (2024).",
    wasteGenRate_kg_per_head_per_day: 15,
    regionalDefaults: {
      nigeriaSmallholder: {
        herdSize: 5,
        daily_kg: 75
      }
    }
  },

  poultryLitter: {
    id: "poultryLitter",
    name: "Poultry Litter (Broiler/Layer)",
    nameLocal: "Chicken Mess",
    icon: "🐔",
    moistureContent: 0.75,
    totalSolids: 0.25,
    vsPctOfTS: 0.80,
    specificBiogasYield: 0.46,
    ch4Content: 0.62,
    hrt: 25,
    source: "MDPI Poultry (2025): 336.8 L biogas, 218.2 L CH₄/kg TS at 61.5% CH₄; " +
      "IPCC 2006 Table 10.16 Bo ≈ 0.36 m³ CH₄/kg VS",
    notes: "High ammonia risk; co-digestion with cow dung recommended at 25:75 ratio.",
    wasteGenRate_kg_per_head_per_day: 0.12,
    regionalDefaults: {
      nigeriaSmallholder: {
        flockSize: 50,
        daily_kg: 6
      }
    }
  },

  cassavaPeels: {
    id: "cassavaPeels",
    name: "Cassava Peels",
    nameLocal: "Garri/Cassava Waste",
    icon: "🌿",
    moistureContent: 0.65,
    totalSolids: 0.35,
    vsPctOfTS: 0.92,
    specificBiogasYield: 0.42,
    ch4Content: 0.58,
    hrt: 40,
    source: "Aisien & Aisien (Detritus, Nigeria): 62.3% CH₄, highest yield among " +
      "Nigerian substrates tested; Adelekan & Bamgboye (2009)",
    notes: "Peel = 10–13% of fresh tuber weight (mechanical), up to 35% (hand peeling). " +
      "Nigeria produces 62.69 Mt cassava/year (FAOSTAT 2023).",
    wasteGenRate_pctOfFreshTuber: 0.13,
    regionalDefaults: {
      nigeriaSmallholder: {
        processingKgPerDay: 50,
        daily_kg: 6.5
      }
    }
  },

  poultryDungCoDigestion: {
    id: "poultryDungCoDigestion",
    name: "Co-Digestion: Cow Dung + Poultry (25:75)",
    nameLocal: "Mixed Manure Blend",
    icon: "🔀",
    moistureContent: 0.80,
    totalSolids: 0.20,
    vsPctOfTS: 0.83,
    specificBiogasYield: 0.52,
    ch4Content: 0.73,
    hrt: 25,
    source: "Journal of Taibah University for Science: 0.469 L/g VS at 72.5% CH₄ " +
      "for 25:75 cow:poultry ratio",
    notes: "Best performing co-digestion mix in published literature. Significantly " +
      "outperforms mono-digestion of either.",
    wasteGenRate_kg_per_head_per_day: null,
    regionalDefaults: null
  },

  cassavaDungCoDigestion: {
    id: "cassavaDungCoDigestion",
    name: "Co-Digestion: Cassava Peels + Cow Dung",
    nameLocal: "Cassava-Cattle Blend",
    icon: "🔀",
    moistureContent: 0.75,
    totalSolids: 0.25,
    vsPctOfTS: 0.88,
    specificBiogasYield: 0.48,
    ch4Content: 0.62,
    hrt: 35,
    source: "Nigerian study (Aisien & Aisien): cumulative CH₄ 838.7 mL at 20:80 " +
      "cow:cassava ratio vs. 738.8 mL at 80:20. Adelekan & Bamgboye (2009, AJAR)",
    notes: "Cassava peels improve methane yield over cow dung alone. Cassava-dominant " +
      "mix (20:80) performs best.",
    wasteGenRate_kg_per_head_per_day: null,
    regionalDefaults: null
  },

  pome: {
    id: "pome",
    name: "Palm Oil Mill Effluent (POME)",
    nameLocal: "Palm Oil Waste Water",
    icon: "🌴",
    moistureContent: 0.95,
    totalSolids: 0.05,
    vsPctOfTS: 0.88,
    specificBiogasYield: 0.30,
    ch4Content: 0.65,
    hrt: 22,
    source: "Published range: 0.25–0.34 Nm³ CH₄/kg COD removed in covered lagoon; " +
      "COD 16,000–100,000 mg/L (literature)",
    notes: "Nigeria is Africa's leading palm oil producer. POME is high-strength; requires " +
      "covered lagoon or UASB reactor.",
    wasteGenRate_kg_per_head_per_day: null,
    regionalDefaults: null
  },

  riceStraw: {
    id: "riceStraw",
    name: "Rice Straw",
    nameLocal: "Rice Residue",
    icon: "🌾",
    moistureContent: 0.12,
    totalSolids: 0.88,
    vsPctOfTS: 0.78,
    specificBiogasYield: 0.33,
    ch4Content: 0.55,
    hrt: 40,
    source: "Published mesophilic range: 0.33–0.43 m³/kg VS, 75.9–78.2% CH₄; " +
      "methane potential ~195 L CH₄/kg VS untreated (literature)",
    notes: "High C/N ratio (50–70); requires co-digestion. Pretreatment improves " +
      "yield significantly (up to 384 L/kg VS).",
    wasteGenRate_kg_per_head_per_day: null,
    regionalDefaults: null
  },

  foodWaste: {
    id: "foodWaste",
    name: "Market / Food Waste (Wet Organic)",
    nameLocal: "Market Waste",
    icon: "🥬",
    moistureContent: 0.80,
    totalSolids: 0.20,
    vsPctOfTS: 0.92,
    specificBiogasYield: 0.46,
    ch4Content: 0.58,
    hrt: 20,
    source: "Bioresource Technology: tropical fruit & vegetable waste BMP = 360 L " +
      "CH₄/kg VS (79% biodegradability); semi-continuous 285 L CH₄/kg VS at " +
      "OLR 3.0 g VS/L/d",
    notes: "High biodegradability. Best for urban/peri-urban market waste streams.",
    wasteGenRate_kg_per_head_per_day: null,
    regionalDefaults: null
  },

  sugarcaneBagasse: {
    id: "sugarcaneBagasse",
    name: "Sugarcane Bagasse",
    nameLocal: "Sugarcane Waste",
    icon: "🎋",
    moistureContent: 0.50,
    totalSolids: 0.50,
    vsPctOfTS: 0.94,
    specificBiogasYield: 0.19,
    ch4Content: 0.53,
    hrt: 45,
    source: "Janke et al. / Griffith University: untreated BMP 187.9 N mL CH₄/g VS " +
      "(53.8% of theoretical); semi-continuous 148 mL/g VS fed",
    notes: "Lignocellulosic; lowest yield among supported substrates. Pretreatment " +
      "(steam explosion) raises to 236 mL/g VS.",
    wasteGenRate_kg_per_head_per_day: null,
    regionalDefaults: null
  }
};

export const SUBSTRATE_LIST = Object.values(SUBSTRATES);
