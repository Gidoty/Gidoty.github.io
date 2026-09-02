import { AlertTriangle } from 'lucide-react'
import { DEFAULT_CARBON_PRICE } from '../../utils/methaneCalc.js'

function formatNumber(value, maxFractionDigits = 2) {
  return value.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits })
}

function ResultCard({ title, subtitle, children }) {
  return (
    <div className="rounded-xl border border-border bg-gradient-to-b from-card to-panel p-5 transition-colors hover:from-card hover:to-card">
      <h3 className="text-sm font-bold text-text">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs text-muted">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  )
}

export default function ResultsPanel({ results, carbonPrice, onCarbonPriceChange }) {
  const {
    V_flared_m3,
    ch4_unburned_kg,
    ch4_ipcc_kg,
    ch4_primary_tonnes,
    co2e_20yr,
    co2e_100yr,
    co2_combustion_kg,
    carbonCreditValue,
  } = results

  return (
    <div className="space-y-5">
      <ResultCard
        title="Estimated Gas Volume Flared"
        subtitle="Based on observed flame characteristics and estimated burn duration"
      >
        <p className="text-2xl font-bold text-teal">
          {formatNumber(V_flared_m3, 0)} m³{' '}
          <span className="text-base font-normal text-muted">
            ({formatNumber(V_flared_m3 / 1000, 1)} km³×10⁻³)
          </span>
        </p>
      </ResultCard>

      <ResultCard title="Methane (CH₄) Emissions">
        <p className="text-2xl font-bold text-danger">{formatNumber(ch4_primary_tonnes)} tonnes CH₄</p>
        <table className="mt-3 w-full text-xs">
          <thead>
            <tr className="text-left text-muted">
              <th className="pb-1 font-medium">Method</th>
              <th className="pb-1 text-right font-medium">Value</th>
            </tr>
          </thead>
          <tbody className="text-text">
            <tr className="border-t border-border">
              <td className="py-1.5">IPCC Tier 1 Factor</td>
              <td className="py-1.5 text-right font-mono">
                {formatNumber(ch4_ipcc_kg / 1000)} tonnes <span className="text-teal">(PRIMARY)</span>
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-1.5">Combustion Efficiency</td>
              <td className="py-1.5 text-right font-mono">
                {formatNumber(ch4_unburned_kg / 1000)} tonnes <span className="text-muted">(cross-check)</span>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 rounded-lg bg-amber/10 px-3 py-2 text-xs text-amber">
          IPCC Tier 1 factor used as primary value per IPCC 2006 Guidelines, Vol. 2, Chapter 4.
        </p>
      </ResultCard>

      <ResultCard title="Greenhouse Gas Impact">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-bg p-3">
            <p className="text-xs text-muted">GWP₂₀</p>
            <p className="text-lg font-bold text-text">{formatNumber(co2e_20yr, 0)} t CO₂e</p>
          </div>
          <div className="rounded-lg bg-bg p-3">
            <p className="text-xs text-muted">GWP₁₀₀</p>
            <p className="text-lg font-bold text-text">{formatNumber(co2e_100yr, 0)} t CO₂e</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">This is equivalent to:</p>
        <ul className="mt-1 space-y-1 text-xs text-text">
          <li>
            • {formatNumber(co2e_100yr / 2.3, 0)} car-years of driving (avg car: 2.3 tonnes CO₂/year,
            IEA 2023)
          </li>
          <li>
            • {formatNumber(co2e_100yr / 0.89, 0)} Nigerian household annual emissions (avg Nigerian:
            ~0.89 tCO₂/year, IEA 2023)
          </li>
        </ul>
      </ResultCard>

      <ResultCard title="CO₂ Released by Combustion">
        <p className="text-2xl font-bold text-text">{formatNumber(co2_combustion_kg / 1000)} tonnes CO₂</p>
        <p className="mt-2 text-xs text-muted">
          CO₂ produced when flared gas burns. Separate from the unburned CH₄ above.
        </p>
      </ResultCard>

      <ResultCard title="Carbon Credit Potential" subtitle="If this flare were eliminated">
        <label className="mb-1.5 block text-xs text-muted" htmlFor="carbon-price">
          Carbon price:{' '}
          <span className="font-bold text-text">${carbonPrice}/tonne</span>{' '}
          {carbonPrice === DEFAULT_CARBON_PRICE && <span className="text-teal">(Voluntary Carbon Market)</span>}
          {carbonPrice >= 75 && <span className="text-amber">(EU ETS CBAM reference, Q2 2026: €75.28/tonne)</span>}
        </label>
        <input
          id="carbon-price"
          type="range"
          min={5}
          max={50}
          step={1}
          value={carbonPrice}
          onChange={(e) => onCarbonPriceChange(Number(e.target.value))}
          className="w-full accent-amber"
        />
        <p className="mt-3 text-xl font-bold text-safe">
          USD {formatNumber(carbonCreditValue, 0)} potential carbon credit revenue
        </p>

        <div className="mt-4 flex gap-2 rounded-lg border border-danger/50 bg-danger/10 px-3 py-3 text-xs text-text">
          <AlertTriangle className="h-4 w-4 shrink-0 text-danger" />
          <p>
            Carbon credit revenue requires independent third-party verification by an accredited
            body (Gold Standard, Verra VCS) before any credits can be issued or traded. This
            estimate is for indicative planning purposes only, consistent with community-observed
            baseline data requirements under Paris Agreement Article 6.4.
          </p>
        </div>
      </ResultCard>
    </div>
  )
}
