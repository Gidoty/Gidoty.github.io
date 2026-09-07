// Reference content for the four carbon credit methodologies the Carbon
// Credit Value Projector maps a project to. This is descriptive copy (not a
// calculation input) — the only numbers it carries are the scale
// thresholds, which are display-only; classification itself is computed in
// calcEngine.js's recommendMethodologies().
export const METHODOLOGIES = {
  goldStandard: {
    id: 'goldStandard',
    icon: 'Star',
    label: 'Gold Standard — Animal Waste Management Systems',
    scale: 'Any scale',
    statusBadge: 'ICVCM CCP-APPROVED',
    bestFor: 'Manure-based biogas projects. Highest integrity. Highest market price.',
    keyRequirements: [
      'Deemed additionality for small projects.',
      'Baseline uses uncovered storage default.',
    ],
    nigerianNote: 'Requires NCCC No-Objection for Article 6.2 transfers',
    source: 'Gold Standard AWMS v2.0 (2023); Paris-aligned for 2026 vintage',
    pricePremium: '+25–50% above baseline',
  },
  amsIIIR: {
    id: 'amsIIIR',
    icon: 'Recycle',
    label: 'CDM AMS-III.R — Methane Recovery (Household Scale)',
    scale: '≤5 t CO₂e/system/year',
    statusBadge: 'HOUSEHOLD / SMALL FARM',
    bestFor: 'Individual family digesters. Simple monitoring requirements.',
    keyRequirements: [
      'Manure not discharged to natural waterways.',
      'Digestate managed to avoid re-emission.',
    ],
    source: 'CDM AMS-III.R v21 (UNFCCC CDM); transitioning to PACM',
    pricePremium: 'Standard VCM pricing',
  },
  amsIIID: {
    id: 'amsIIID',
    icon: 'Factory',
    label: 'CDM AMS-III.D — Methane Recovery in Manure Management',
    scale: '>5 t CO₂e/system/year',
    statusBadge: 'FARM / COOPERATIVE',
    bestFor: 'Larger farm or cooperative-scale digesters. More rigorous monitoring.',
    keyRequirements: ['<5 MW energy component.', 'Tool 14 leakage accounting required.'],
    source: 'CDM AMS-III.D v21/22 draft; consistent with ACM0010',
    pricePremium: 'Standard VCM pricing',
  },
  article64: {
    id: 'article64',
    icon: 'Globe',
    label: 'Paris Agreement Article 6.4 (Internationally Transferred Mitigation Outcomes)',
    scale: 'Any scale (via aggregation)',
    statusBadge: 'HIGHEST VALUE — EMERGING',
    bestFor:
      'Government-backed projects with corresponding adjustments. PoA/aggregation vehicle.',
    keyRequirements: [
      'NCCC No-Objection (Nigeria).',
      'Corresponding adjustment from host country.',
      'MRV rules still developing.',
    ],
    precedent:
      'Ghana: first African Article 6.2 ITMO transfer, July 2025 (11,733 ITMOs to Switzerland via Envirofit/KliK)',
    source: 'UNFCCC Article 6.4 Supervisory Body; PACM 2025',
    pricePremium: 'Potentially highest — $15–39/tonne for quality-certified',
  },
}

export const METHODOLOGY_LIST = Object.values(METHODOLOGIES)
