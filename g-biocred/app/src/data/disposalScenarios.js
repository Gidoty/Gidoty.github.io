import { IPCC_MCF } from './constants.js'

// Presentation metadata (icon/colour/description/badge) layered on top of the
// MCF values and sources that already live in constants.js — no emission
// numbers are introduced here.
export const DISPOSAL_SCENARIOS = [
  {
    key: 'openDumpDeep',
    ...IPCC_MCF.openDumpDeep,
    icon: 'Trash2',
    color: 'danger',
    description:
      'Unmanaged deep waste disposal. Common in Nigerian urban and peri-urban areas.',
    badge: 'HIGHEST EMISSIONS',
  },
  {
    key: 'openDumpShallow',
    ...IPCC_MCF.openDumpShallow,
    icon: 'Trash',
    color: 'warning',
    description: 'Shallow unmanaged dump or roadside disposal.',
  },
  {
    key: 'uncoveredLagoonWarm',
    ...IPCC_MCF.uncoveredLagoonWarm,
    icon: 'Droplets',
    color: 'warning',
    description:
      'Open liquid manure storage in warm tropical climate (>25°C). Common on Nigerian livestock farms.',
    badge: 'MOST COMMON — LIVESTOCK',
  },
  {
    key: 'openBurning',
    ...IPCC_MCF.openBurning,
    icon: 'Flame',
    color: 'danger',
    description:
      'Agricultural residue burned in the field. Common for rice straw, sugarcane bagasse, cassava waste.',
    calcNote:
      'Open burning uses a different calculation path: E = mass_burnt × combustion_factor × CH₄_EF + N₂O_EF. This tool does not carry field-specific combustion emission factors, so a quantified baseline is not shown for this scenario — select a different baseline to see numbers.',
  },
  {
    key: 'drylot',
    ...IPCC_MCF.drylot,
    icon: 'Sun',
    color: 'accent',
    description: 'Manure deposited on dry open ground and left. Common in extensive pastoralism.',
    badge: 'LOWEST BASELINE',
  },
]
