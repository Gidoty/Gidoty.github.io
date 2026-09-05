import { Link } from 'react-router-dom'
import { Sprout, Wind, TrendingUp, ShieldCheck } from 'lucide-react'

const STATS = [
  {
    icon: Sprout,
    color: 'text-accent',
    stat: '9 Substrates',
    detail: 'Cow dung, cassava peels, poultry litter, POME and more',
  },
  {
    icon: Wind,
    color: 'text-cyan',
    stat: 'IPCC Tier 1',
    detail: 'Methane emissions methodology from 3 baseline scenarios',
  },
  {
    icon: TrendingUp,
    color: 'text-amber',
    stat: '$4–39/tonne',
    detail: 'Voluntary carbon market price range for biogas credits',
  },
  {
    icon: ShieldCheck,
    color: 'text-cyan',
    stat: 'SHA-256 Audit',
    detail: 'Tamper-evident calculation log for independent verification',
  },
]

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 20%, rgba(76,175,80,0.22), transparent 60%)',
      }}
    >
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-panel px-4 py-1.5 text-xs font-medium text-muted">
          IPCC 2006/2019 Methodology · Gold Standard · CDM AMS-III · Article 6.4
        </span>

        <h1 className="mt-6 text-4xl font-bold text-text sm:text-5xl md:text-6xl">
          What Is Your Agricultural Waste Worth?
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
          G-BioCred converts your agro-waste volume into three decision-relevant outputs:
          expected biogas and electricity yield, methane emissions avoided, and verifiable
          carbon credit value — in one free, auditable tool built for Nigerian and West
          African smallholders.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/calculator"
            className="w-full rounded-lg bg-accent px-6 py-3 text-center font-semibold text-white transition-transform hover:scale-[1.02] sm:w-auto"
          >
            Start Calculator
          </Link>
          <Link
            to="/compare"
            className="w-full rounded-lg border border-accent px-6 py-3 text-center font-semibold text-text transition-colors hover:bg-accent/10 sm:w-auto"
          >
            Compare Scenarios
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ icon: Icon, color, stat, detail }) => (
          <div
            key={stat}
            className="rounded-xl border border-border bg-card p-5 text-left shadow-sm"
          >
            <Icon className={`h-6 w-6 ${color}`} />
            <p className="mt-3 text-xl font-bold text-text">{stat}</p>
            <p className="mt-1 text-sm text-muted">{detail}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs italic text-muted">
        Sources: IPCC 2006/2019 Guidelines · Gold Standard AWMS · Verra VCS · Ecosystem
        Marketplace SOVCM 2025
      </p>
    </section>
  )
}
