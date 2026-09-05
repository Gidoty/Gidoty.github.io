import { Calculator, DollarSign, Leaf, X, Check } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Existing Biogas Calculators',
    icon: Calculator,
    accent: 'border-border',
    items: [
      'Yield estimation only',
      'No Nigerian substrate data',
      'No carbon credit output',
      'No audit trail',
      'No digestate valuation',
    ],
    good: false,
  },
  {
    title: 'Carbon Credit Platforms',
    icon: DollarSign,
    accent: 'border-border',
    items: [
      'Assume professional MRV data',
      'Not accessible to smallholders',
      'No biogas yield modeling',
      'High entry barrier',
      'No feasibility comparison',
    ],
    good: false,
  },
  {
    title: 'G-BioCred',
    icon: Leaf,
    accent: 'border-cyan',
    items: [
      'Integrated yield + carbon calculation',
      'Nigerian substrate library (9 types)',
      'IPCC Tier 1 emissions methodology',
      'Gold Standard / CDM / Article 6.4',
      'SHA-256 tamper-evident audit log',
      'Digestate fertiliser value',
      'Free and browser-based',
    ],
    good: true,
  },
]

export default function GapSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-text sm:text-4xl">
          The Gap G-BioCred Closes
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {COLUMNS.map(({ title, icon: Icon, accent, items, good }) => (
            <div
              key={title}
              className={`rounded-xl border ${accent} bg-card p-6 ${good ? 'ring-1 ring-cyan/40' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${good ? 'text-cyan' : 'text-muted'}`} />
                <h3 className="font-semibold text-text">{title}</h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted">
                    {good ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                    )}
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
