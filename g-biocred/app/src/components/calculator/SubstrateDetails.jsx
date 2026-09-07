function Field({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-medium text-text">{value}</dd>
    </div>
  )
}

function regionalDefaultLine(regional) {
  if (regional.herdSize) return `${regional.herdSize} head`
  if (regional.flockSize) return `${regional.flockSize} birds`
  if (regional.processingKgPerDay) return `${regional.processingKgPerDay} kg/day processed`
  return 'This operation'
}

export default function SubstrateDetails({ substrate, onUseDefault }) {
  const regional = substrate.regionalDefaults?.nigeriaSmallholder

  return (
    <div className="panel-enter mt-4 space-y-4 rounded-xl border border-border bg-card p-4">
      <h3 className="font-semibold text-text">Substrate Details</h3>
      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Field label="Moisture content" value={`${(substrate.moistureContent * 100).toFixed(0)}%`} />
        <Field label="Total solids" value={`${(substrate.totalSolids * 100).toFixed(0)}%`} />
        <Field label="VS / TS ratio" value={`${(substrate.vsPctOfTS * 100).toFixed(0)}%`} />
        <Field
          label="Specific biogas yield"
          value={`${substrate.specificBiogasYield.toFixed(2)} m³/kg VS`}
        />
        <Field label="CH₄ content" value={`${(substrate.ch4Content * 100).toFixed(0)}%`} />
        <Field label="HRT" value={`${substrate.hrt} days`} />
      </dl>
      <p className="text-xs text-muted">
        <span className="font-semibold text-text">Source: </span>
        {substrate.source}
      </p>
      <p className="text-xs text-muted">
        <span className="font-semibold text-text">Notes: </span>
        {substrate.notes}
      </p>

      {regional && (
        <div className="rounded-lg border border-accent/40 bg-accent/10 p-3 text-sm text-text">
          <p>
            Regional default for Nigerian smallholder: {regionalDefaultLine(regional)} produces
            approximately {regional.daily_kg} kg/day
          </p>
          <button
            type="button"
            onClick={() => onUseDefault(regional.daily_kg)}
            className="mt-2 rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white"
          >
            Use this default
          </button>
        </div>
      )}
    </div>
  )
}
