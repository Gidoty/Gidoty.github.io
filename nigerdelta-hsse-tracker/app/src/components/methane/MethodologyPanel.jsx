import { useState } from 'react'
import { ChevronDown, ChevronUp, FlaskConical } from 'lucide-react'

export default function MethodologyPanel() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-h-[56px] w-full items-center gap-3 px-4 text-left"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal">
          <FlaskConical className="h-5 w-5" />
        </span>
        <span className="flex-1 text-sm font-bold text-text">Calculation Methodology and Sources</span>
        {open ? <ChevronUp className="h-5 w-5 text-muted" /> : <ChevronDown className="h-5 w-5 text-muted" />}
      </button>

      {open && (
        <div className="space-y-4 border-t border-border px-4 py-4 text-sm leading-relaxed text-muted">
          <p>
            This calculator uses the IPCC 2006 Guidelines for National Greenhouse Gas Inventories,
            Volume 2 (Energy), Chapter 4 (Fugitive Emissions), Tier 1 methodology for gas flaring
            emission estimation.
          </p>

          <div>
            <p className="font-bold text-text">Nigerian Associated Gas Composition (NNPC/DPR published data):</p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-bg p-3 font-mono text-xs text-text">
{`Methane (CH₄):     88–92%  (default: 90%)
Ethane (C₂H₆):     3.9–5.3% (default: 4.5%)
Propane (C₃H₈):    1.2–3.4% (default: 2.0%)
CO₂:               1.5–2.0% (default: 1.8%)
N₂ and other:      balance`}
            </pre>
          </div>

          <div>
            <p className="font-bold text-text">Flare Combustion Efficiency:</p>
            <p className="mt-1">
              98% (API Compendium of Greenhouse Gas Emissions Estimation Methodologies for the Oil
              and Gas Industry, 2009). This means 2% of gas escapes unburned as raw methane.
            </p>
          </div>

          <div>
            <p className="font-bold text-text">IPCC Emission Factors (per 10⁶ m³ gas flared):</p>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-bg p-3 font-mono text-xs text-text">
{`CH₄:  2.0 Gg  (= 2,000 tonnes)
CO₂:  0.012 Gg × 10⁶ = 2,000 tonnes CO₂
N₂O:  0.000023 Gg`}
            </pre>
          </div>

          <pre className="overflow-x-auto rounded-lg bg-bg p-3 font-mono text-xs text-text">
{`CH₄ density: 0.67 kg/m³ at 20°C, 1 atm
GWP₂₀  (CH₄): 84  (IPCC AR6, 2021)
GWP₁₀₀ (CH₄): 29.8 (IPCC AR6, 2021)`}
          </pre>

          <div>
            <p className="font-bold text-text">Sources:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>IPCC (2006). 2006 IPCC Guidelines for National GHG Inventories. Vol. 2, Ch. 4.</li>
              <li>API (2009). Compendium of GHG Emissions Estimation Methodologies for O&amp;G Industry.</li>
              <li>IPCC AR6 WGI (2021). Table 7.SM.7.</li>
              <li>NNPC/DPR: Nigerian Associated Gas Composition Data.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
