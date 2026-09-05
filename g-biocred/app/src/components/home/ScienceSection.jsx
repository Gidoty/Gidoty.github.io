const REFERENCES = [
  'IPCC 2006 Guidelines Vol.4 Ch.10 — Manure MCF values',
  'IPCC 2006 Guidelines Vol.5 Ch.3 — Waste disposal emission factors',
  'IPCC AR6 WGI (2021) Table 7.SM.7 — GWP values: biogenic CH₄ GWP₁₀₀ = 27.0',
  'Gold Standard AWMS v2.0 — Animal Waste Management methodology',
  'CDM AMS-III.D / AMS-III.R — Methane recovery in manure systems',
  'Aisien & Aisien (Detritus) — Nigerian cassava peel biogas yields',
  'Adelekan & Bamgboye (2009, AJAR) — Nigerian co-digestion yield coefficients',
  'MSc Thesis: Owhonda, G. (2024) — Biogas from cow dung, UNIPORT',
]

export default function ScienceSection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold text-text sm:text-4xl">
          Scientific Foundation
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted">
          Every calculation is traceable to a published source
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {REFERENCES.map((ref) => (
            <div
              key={ref}
              className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted"
            >
              {ref}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
