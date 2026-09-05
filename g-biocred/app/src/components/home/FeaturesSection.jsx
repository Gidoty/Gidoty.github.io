import {
  FlaskConical,
  Database,
  Wind,
  TrendingUp,
  SlidersHorizontal,
  Sprout,
  ShieldCheck,
  LayoutList,
  MapPin,
  FileDown,
} from 'lucide-react'

const COLOR_CLASSES = {
  green: 'text-accent bg-accent/10',
  cyan: 'text-cyan bg-cyan/10',
  amber: 'text-amber bg-amber/10',
}

const FEATURES = [
  {
    icon: FlaskConical,
    color: 'green',
    title: 'Multi-Substrate Yield Calculator',
    text: '9 substrates including cow dung, cassava peels, poultry litter, POME, and co-digestion mixes. Uses peer-reviewed specific biogas yield coefficients.',
  },
  {
    icon: Database,
    color: 'green',
    title: 'Digester Sizing Calculator',
    text: 'Recommends optimal digester volume from your waste input, hydraulic retention time, and digester type.',
  },
  {
    icon: Wind,
    color: 'cyan',
    title: 'Emissions-Avoided Estimator',
    text: 'IPCC 2006/2019 Tier 1 methodology. Three baseline scenarios: open dumping, open burning, and uncovered anaerobic lagoon.',
  },
  {
    icon: TrendingUp,
    color: 'amber',
    title: 'Carbon Credit Value Projector',
    text: 'Maps your project to Gold Standard AWMS, CDM AMS-III.R or AMS-III.D, and Article 6.4. Projects credit volume and indicative market value.',
  },
  {
    icon: SlidersHorizontal,
    color: 'cyan',
    title: 'GWP Registry Selector',
    text: 'Align your calculation to your target registry: AR6 biogenic (27.0), AR6 fossil (29.8), AR5 (28), or GWP₂₀ (80.8).',
  },
  {
    icon: Sprout,
    color: 'green',
    title: 'Digestate Nutrient Estimator',
    text: 'Calculates NPK content of digester effluent and its fertiliser replacement value in NGN and USD.',
  },
  {
    icon: ShieldCheck,
    color: 'cyan',
    title: 'Verification Audit Trail',
    text: 'Every input and calculation step logged with a SHA-256 hash. Compatible with Nigerian Evidence Act 2011 ss.84–87.',
  },
  {
    icon: LayoutList,
    color: 'amber',
    title: 'Feasibility Comparison Mode',
    text: 'Compare up to 3 substrate or site scenarios side by side to find the highest yield and carbon return.',
  },
  {
    icon: MapPin,
    color: 'green',
    title: 'Regional Data Layer',
    text: 'Pre-loaded Nigerian waste generation rates by herd size, flock count, and farm type. No lab data required.',
  },
  {
    icon: FileDown,
    color: 'amber',
    title: 'Exportable Feasibility Report',
    text: 'Download a complete PDF or CSV report suitable for grant applications, investor pitches, and regulatory submissions.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-panel px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-text sm:text-4xl">
          Ten Integrated Features
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          From waste volume to investment decision — in one tool
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, color, title, text }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <div className={`inline-flex rounded-lg p-2.5 ${COLOR_CLASSES[color]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-text">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
