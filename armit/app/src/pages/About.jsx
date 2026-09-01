import { AlertTriangle, BookOpen, FlaskConical, GraduationCap, Layers, Target } from 'lucide-react'

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
            ARMIT Calculation Methodology
          </h2>
          <ul className="space-y-3">
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">Crude yield model — </span>
              yields are computed from published TBP assay data for each crude type. VDU recovery
              uses the correlation VGO% = 72.5 &minus; (0.71 &times; vacuum pressure, mmHg), derived
              from published petroleum engineering literature.
            </li>
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">FCC model — </span>
              FCC yields are computed using a simplified conversion model based on published yield
              structures for VGO cracking. Naphtha yield scales with conversion efficiency.
            </li>
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">Hydrocracker model — </span>
              HC diesel yield (default 68 wt%) is based on published performance data for VGO
              hydrocracking at 120&ndash;160 bar H2 partial pressure.
            </li>
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">EII proxy — </span>
              the Energy Intensity Index proxy uses a reference energy factor of 0.000887 Gcal/bbl
              (design) versus 0.00102 Gcal/bbl (typical, degraded). True Solomon EII requires
              proprietary benchmarking data; ARMIT provides an engineering proxy on the same
              underlying logic.
            </li>
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">Carbon model — </span>
              CO2 emissions from fired heaters are estimated using a natural-gas combustion factor
              of approximately 235 kg CO2 per Gcal of fuel gas — derived from the IPCC default of
              56.1 kg CO2/GJ (1 Gcal = 4.184 GJ). Carbon costs are overlaid using EU ETS/CBAM
              pricing as an external reference point (approximately EUR 75/tonne CO2, Q2 2026).
            </li>
            <li className="rounded-xl border border-white/5 bg-armit-card p-4">
              <span className="font-semibold text-armit-text">Shadow prices — </span>
              constraint shadow prices represent the marginal value of relaxing each unit
              constraint by one unit. They are computed analytically from the yield model rather
              than a full LP solver, consistent with simplified planning practice.
            </li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="mt-12 space-y-4 text-armit-muted">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-armit-text">
            <AlertTriangle size={20} className="text-armit-amber" />
            Important Disclaimer
          </h2>
          <p className="rounded-xl border border-armit-amber/20 bg-armit-amber/5 p-4">
            ARMIT is an educational and planning tool based on published engineering correlations
            and simplified models. Results are indicative and should not be used as the sole
            basis for commercial decisions. Actual refinery performance depends on site-specific
            conditions, equipment state, crude variability, and market dynamics not fully
            captured in this tool. True Solomon EII benchmarking requires participation in
            Solomon Associates&apos; proprietary study programme.
          </p>
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

        {/* Research context */}
        <section className="mt-12 space-y-4 text-armit-muted">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-armit-text">
            <BookOpen size={20} className="text-armit-teal" />
            Research Background
          </h2>
          <p>
            This tool draws on coursework and methodology from the NLNG Centre for Gas, Refining
            and Petrochemical Engineering, University of Port Harcourt. It is grounded in:
          </p>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>RPE 904 Advanced Refining Management methodology</li>
            <li>Published crude assay data (Bonny Light, Forcados)</li>
            <li>Academic LP optimisation frameworks</li>
            <li>IEA, EIA, and IOGP industry benchmarks</li>
          </ul>
          <p>
            The tool specifically addresses the gap between expensive commercial LP planning
            suites and oversimplified crack spread calculators — providing a rigorous, accessible
            alternative for African refinery operators and analysts.
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
