import { MapPin } from 'lucide-react'

export default function NigeriaContextBox() {
  return (
    <div className="rounded-xl border border-armit-amber/20 bg-armit-amber/5 p-6">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-armit-text">
        <MapPin size={16} className="text-armit-amber" />
        Nigerian Crude Context
      </h3>
      <p className="mt-3 text-sm text-armit-muted">
        Dangote Refinery (650,000 bpd) receives approximately 5 local crude cargoes per month
        against an operational need of 13-15 cargoes, relying heavily on imported crude at higher
        delivered cost. PHRC (210,000 bpd) processes primarily Bonny Light. Every USD 1.00/bbl
        reduction in delivered crude cost at Dangote&apos;s throughput equals USD 650,000/day in
        margin impact.
      </p>
      <p className="mt-3 text-[11px] text-armit-muted/70">
        Source: EIA, Kpler, NNPC operational reports 2025-2026
      </p>
    </div>
  )
}
