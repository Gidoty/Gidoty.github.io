import { FlaskConical, Target, GraduationCap, Layers } from 'lucide-react'

export default function About() {
  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-armit-text sm:text-4xl">About ARMIT</h1>
        <p className="mt-4 text-armit-muted">
          African Refinery Margin Intelligence Tool
        </p>

        {/* What it is */}
        <section className="mt-12 space-y-4 text-armit-muted">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-armit-text">
            <Target size={20} className="text-armit-teal" />
            What ARMIT Solves
          </h2>
          <p>
            Every public refinery calculator today takes three price inputs — crude, gasoline,
            diesel — and returns a single crack spread number. That number tells you almost
            nothing about how a real refinery actually makes money: it ignores the crude assay,
            the unit configuration, the energy cost of running the plant, and the bottlenecks
            that are actually constraining throughput.
          </p>
          <p>
            ARMIT was built to close that gap. It takes a real crude oil assay (Bonny Light,
            Forcados, Brent, or WTI), computes actual unit yields across the CDU, VDU, FCC,
            hydrocracker, and CCR, and turns those yields into a true Gross Refinery Margin, an
            EII-style energy intensity index, and a constraint analysis that tells you exactly
            what is limiting your margin — and what fixing it is worth.
          </p>
        </section>

        {/* Methodology */}
        <section className="mt-12 space-y-4 text-armit-muted">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-armit-text">
            <FlaskConical size={20} className="text-armit-teal" />
            Methodology
          </h2>
          <ul className="space-y-3">
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">Assay-driven yields — </span>
              unit yields are derived from the actual distillation and conversion characteristics
              of each supported crude, not a fixed generic split.
            </li>
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">LP shadow price logic — </span>
              constraint identification borrows from Linear Programming theory: the binding
              constraints in the refinery's operating envelope carry a shadow price, which is the
              dollar value of relaxing that constraint by one unit.
            </li>
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">
                EII-style energy benchmarking —{' '}
              </span>
              an Energy Intensity Index is calculated in the spirit of the Solomon EII
              methodology, weighting each unit's throughput against its typical energy factor.
            </li>
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">Carbon overlay — </span>
              energy consumption is translated into an indicative carbon footprint, layered on
              top of the margin and constraint outputs rather than treated as a separate exercise.
            </li>
          </ul>
        </section>

        {/* Research gap */}
        <section className="mt-12 space-y-4 text-armit-muted">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-armit-text">
            <Layers size={20} className="text-armit-teal" />
            The Research Gap
          </h2>
          <p>
            No existing free tool integrates assay data, energy intensity, constraint economics,
            and a carbon overlay in a single, coherent workflow. Refinery economics tools either
            stop at a crack spread, or require commercial LP software (PIMS, RPMS, GRTMPS) that is
            priced far out of reach for academic use, independent analysis, or African refinery
            configurations that those tools were never calibrated for. ARMIT is built to make that
            level of analysis freely accessible, with a configuration set that reflects Nigerian
            and African refineries specifically — including PHRC and Dangote.
          </p>
        </section>

        {/* Credit */}
        <section className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-white/5 bg-armit-card px-8 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-armit-amber/10 text-armit-amber">
            <GraduationCap size={28} />
          </div>
          <h2 className="text-lg font-semibold text-armit-text">Gideon Owhonda</h2>
          <p className="max-w-md text-sm text-armit-muted">
            PhD Candidate, NLNG Centre for Gas, Refining and Petrochemical Engineering, University
            of Port Harcourt.
          </p>
        </section>
      </div>
    </div>
  )
}
