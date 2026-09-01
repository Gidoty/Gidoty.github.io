import { Link } from 'react-router-dom'
import {
  Droplets,
  TrendingUp,
  Gauge,
  ArrowLeftRight,
  Wrench,
  LineChart,
  ArrowRight,
  GraduationCap,
  Fuel,
  Calculator as CalculatorIcon,
  CheckCircle2,
  Check,
  X,
  Link2,
  ExternalLink,
} from 'lucide-react'

const STATS = [
  { value: '6', label: 'Crude Types Supported' },
  { value: 'LP', label: 'Constraint Analysis' },
  { value: '3', label: 'Scenario Stress Testing' },
]

const FEATURES = [
  {
    icon: Droplets,
    title: 'Yield Calculator',
    description: 'Assay-driven yields across CDU, VDU, FCC, hydrocracker, and CCR.',
  },
  {
    icon: TrendingUp,
    title: 'Gross Margin',
    description: 'True Gross Refinery Margin computed from real product slates and prices.',
  },
  {
    icon: Gauge,
    title: 'EII Index',
    description: 'An EII-style energy intensity index benchmarked against unit configuration.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Crude Switching Advisor',
    description: 'Compares imported versus local crude economics in real time.',
  },
  {
    icon: Wrench,
    title: 'Constraint Relief Simulator',
    description: 'Shows the dollar value of fixing each active refinery bottleneck.',
  },
  {
    icon: LineChart,
    title: 'Margin Stress-Tester',
    description: 'Runs base, pessimistic, and optimistic scenarios simultaneously.',
  },
]

const STEPS = [
  {
    icon: Fuel,
    title: 'Select Your Crude',
    text: 'Choose from 6 crude types including Bonny Light, Forcados, and Dangote Blend. Enter your delivered cost and throughput.',
  },
  {
    icon: CalculatorIcon,
    title: 'Run the Analysis',
    text: 'MarginIQ computes true yields, gross margin, EII energy index, and identifies your binding constraints using LP shadow price logic.',
  },
  {
    icon: CheckCircle2,
    title: 'Make Better Decisions',
    text: 'Compare crude options, simulate constraint relief, and stress-test three scenarios — all in one tool.',
  },
]

const COMPARISON_ROWS = [
  { feature: 'Real crude assay yields', crack: false, armit: true },
  { feature: 'Energy intensity (EII)', crack: false, armit: true },
  { feature: 'Active constraint identification', crack: false, armit: true },
  { feature: 'Shadow price analysis', crack: false, armit: true },
  { feature: 'Crude switching comparison', crack: false, armit: true },
  { feature: 'Carbon-adjusted margin', crack: false, armit: true },
  { feature: 'Nigerian crude configurations', crack: false, armit: true },
  { feature: 'Free to use', crack: true, armit: true },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(0,180,216,0.18), transparent 60%)',
          }}
        />
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full border border-armit-teal/30 bg-armit-teal/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-armit-teal">
            Built for African refinery configurations
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-armit-text sm:text-5xl lg:text-6xl">
            The Refinery Margin Tool{' '}
            <span className="text-armit-teal">Built for Africa</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-armit-muted sm:text-lg">
            MarginIQ turns a real crude assay into unit-by-unit yields, true Gross Refinery Margin,
            and an EII-style energy intensity index — then uses LP shadow price logic to identify
            the constraints actually limiting your margin. Built specifically for Nigerian and
            African refinery configurations, including PHRC and Dangote.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 rounded-lg bg-armit-teal px-6 py-3 text-sm font-semibold text-armit-bg transition hover:bg-armit-teal/90"
            >
              Launch Calculator
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-armit-card px-6 py-3 text-sm font-semibold text-armit-text transition hover:border-armit-teal/40"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/5 bg-armit-card px-6 py-6 text-center"
            >
              <div className="text-3xl font-bold text-armit-teal">{stat.value}</div>
              <div className="mt-1 text-sm text-armit-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-armit-panel px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-armit-text sm:text-4xl">
              Everything a margin desk actually needs
            </h2>
            <p className="mt-4 text-armit-muted">
              Six integrated modules that go far beyond a single crack spread number.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-white/5 bg-armit-card p-6 transition hover:border-armit-teal/30 hover:shadow-lg hover:shadow-armit-teal/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-armit-teal/10 text-armit-teal transition group-hover:bg-armit-teal group-hover:text-armit-bg">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-armit-text">{feature.title}</h3>
                  <p className="mt-2 text-sm text-armit-muted">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-armit-text sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-armit-muted">Three steps from crude assay to decision.</p>
          </div>

          <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="relative flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-armit-teal/40 bg-armit-card text-armit-teal">
                    <Icon size={26} />
                  </div>
                  <div className="mt-4 text-xs font-bold uppercase tracking-wider text-armit-teal">
                    Step {index + 1}
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-armit-text">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm text-armit-muted">{step.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why MarginIQ */}
      <section className="bg-armit-panel px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-armit-text sm:text-4xl">
              Why MarginIQ over a crack spread calculator?
            </h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-white/5 bg-armit-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-wide text-armit-muted sm:text-xs">
                  <th className="py-3 pl-3 pr-2 font-medium sm:pl-6 sm:pr-4">Feature</th>
                  <th className="w-16 px-1 py-3 text-center font-medium sm:w-auto sm:px-4">
                    Crack Spread
                  </th>
                  <th className="w-16 py-3 pl-1 pr-3 text-center font-medium sm:w-auto sm:pl-4 sm:pr-6">
                    MarginIQ
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pl-3 pr-2 text-xs text-armit-text sm:pl-6 sm:pr-4 sm:text-sm">
                      {row.feature}
                    </td>
                    <td className="px-1 py-3 text-center sm:px-4">
                      {row.crack ? (
                        <Check size={18} className="mx-auto text-armit-teal" />
                      ) : (
                        <X size={18} className="mx-auto text-armit-muted/50" />
                      )}
                    </td>
                    <td className="py-3 pl-1 pr-3 text-center sm:pl-4 sm:pr-6">
                      {row.armit ? (
                        <Check size={18} className="mx-auto text-armit-teal" />
                      ) : (
                        <X size={18} className="mx-auto text-armit-muted/50" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Built by */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-white/5 bg-armit-card px-8 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-armit-amber/10 text-armit-amber">
            <GraduationCap size={28} />
          </div>
          <h2 className="text-xl font-semibold text-armit-text">Built by Gideon Owhonda</h2>
          <p className="text-sm text-armit-muted">
            PhD Candidate
            <br />
            NLNG Centre for Gas, Refining &amp; Petrochemical Engineering
            <br />
            University of Port Harcourt
          </p>
          <p className="max-w-xl text-sm text-armit-muted">
            MarginIQ is a portfolio project demonstrating the application of petroleum engineering
            principles, LP optimisation, and energy management to real-world African refinery
            challenges.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://gidoty.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-armit-teal px-5 py-2.5 text-sm font-semibold text-armit-bg transition hover:bg-armit-teal/90"
            >
              <ExternalLink size={15} />
              View Portfolio
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-armit-bg px-5 py-2.5 text-sm font-semibold text-armit-text transition hover:border-armit-teal/40 hover:text-armit-teal"
            >
              <Link2 size={15} />
              Connect on LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
