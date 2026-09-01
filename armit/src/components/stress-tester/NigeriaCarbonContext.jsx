import { Globe2 } from 'lucide-react'

export default function NigeriaCarbonContext() {
  return (
    <div className="rounded-xl border border-armit-amber/20 bg-armit-amber/5 p-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-armit-text">
        <Globe2 size={16} className="text-armit-amber" />
        Carbon Cost Context for Nigerian Refiners
      </h3>
      <p className="mt-3 text-sm text-armit-muted">
        The EU Carbon Border Adjustment Mechanism (CBAM) is priced at approximately EUR 75/tonne
        CO2 as of Q2 2026. While Nigerian refiners are not yet directly subject to CBAM, products
        exported to EU markets will face carbon-cost adjustments from 2026 onward. Nigeria&apos;s
        domestic carbon market is at early-stage development under the Climate Change Act 2021.
        Planning for carbon costs of USD 50-100/tonne in scenario analysis is considered prudent
        by international energy consultants.
      </p>
      <p className="mt-3 text-[11px] text-armit-muted/70">
        Source: European Commission CBAM Q2 2026 | Nigeria Climate Change Act 2021 | IEA World
        Energy Outlook 2025
      </p>
    </div>
  )
}
