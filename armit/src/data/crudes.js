const CRUDES = {
  bonnyLight: {
    name: 'Bonny Light (Nigeria)',
    api: 32.9,
    sulphur: 0.16,
    sg: 0.8602,
    yields: {
      lightEnds: 2.5, // C1-C4, vol%
      lightNaphtha: 8.0, // 35-100°C
      heavyNaphtha: 14.0, // 100-180°C
      kerosene: 13.0, // 180-260°C
      diesel: 18.0, // 260-360°C
      atmResidue: 44.5, // >360°C (AR)
      losses: 1.0,
    },
  },
  forcados: {
    name: 'Forcados (Nigeria)',
    api: 29.8,
    sulphur: 0.18,
    sg: 0.8771,
    yields: {
      lightEnds: 2.0,
      lightNaphtha: 6.5,
      heavyNaphtha: 12.0,
      kerosene: 12.5,
      diesel: 17.0,
      atmResidue: 48.0,
      losses: 2.0,
    },
  },
  brent: {
    name: 'Brent Blend (North Sea)',
    api: 38.3,
    sulphur: 0.37,
    sg: 0.8333,
    yields: {
      lightEnds: 3.0,
      lightNaphtha: 10.0,
      heavyNaphtha: 16.0,
      kerosene: 13.5,
      diesel: 18.5,
      atmResidue: 38.0,
      losses: 1.0,
    },
  },
  wti: {
    name: 'WTI (West Texas)',
    api: 39.6,
    sulphur: 0.24,
    sg: 0.827,
    yields: {
      lightEnds: 3.5,
      lightNaphtha: 11.0,
      heavyNaphtha: 17.0,
      kerosene: 14.0,
      diesel: 19.0,
      atmResidue: 34.5,
      losses: 1.0,
    },
  },
  arabian: {
    name: 'Arab Medium (Saudi)',
    api: 28.5,
    sulphur: 2.6,
    sg: 0.8845,
    yields: {
      lightEnds: 1.5,
      lightNaphtha: 5.0,
      heavyNaphtha: 10.0,
      kerosene: 11.0,
      diesel: 15.5,
      atmResidue: 55.0,
      losses: 2.0,
    },
  },
  dangoteBlend: {
    name: 'Dangote Blend (70% BL / 30% Forcados)',
    api: 31.8,
    sulphur: 0.165,
    sg: 0.8674,
    yields: {
      lightEnds: 2.25,
      lightNaphtha: 7.45,
      heavyNaphtha: 13.4,
      kerosene: 12.85,
      diesel: 17.7,
      atmResidue: 45.35,
      losses: 1.0,
    },
  },
}

export default CRUDES
