import { TrendingUp } from 'lucide-react'
import { formatUsd0 } from '../../lib/format.js'

export default function AnnualOpportunityCard({ annualOpportunity }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-armit-teal/30 bg-armit-teal/5 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-armit-teal/10 text-armit-teal">
        <TrendingUp size={22} />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-armit-muted">
          Total annual margin opportunity from constraint relief
        </div>
        <div className="mt-1 text-2xl font-bold text-armit-teal sm:text-[1.6rem]">
          Up to {formatUsd0(annualOpportunity)} per year available through constraint relief
        </div>
        <p className="mt-1 text-xs text-armit-muted">
          Based on current product prices and operating conditions.
        </p>
      </div>
    </div>
  )
}
