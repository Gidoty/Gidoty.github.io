import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function ChartCard({ title, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 font-medium text-text">{title}</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const axisProps = { stroke: '#a5c8a7', tick: { fill: '#a5c8a7', fontSize: 12 } }
const tooltipStyle = { background: '#1a3a1c', border: '1px solid #2e5931', borderRadius: 8, color: '#f1f8e9' }
const legendStyle = { fontSize: 12, color: '#a5c8a7' }

export default function ComparisonCharts({ scenarios }) {
  const data = scenarios.map((s) => ({
    name: s.name,
    biogasM3: Number(s.result.yield.biogasM3PerDay.toFixed(2)),
    ch4M3: Number(s.result.yield.ch4M3PerDay.toFixed(2)),
    baseline: s.result.emissions.baselineTonnesPerYear != null ? Number(s.result.emissions.baselineTonnesPerYear.toFixed(2)) : 0,
    avoided: s.result.emissions.avoidedTonnesPerYear != null ? Number(s.result.emissions.avoidedTonnesPerYear.toFixed(2)) : 0,
    conservative: Number(s.result.carbon.annualConservativeUsd.toFixed(0)),
    mid: Number(s.result.carbon.annualMidUsd.toFixed(0)),
    premium: Number(s.result.carbon.annualPremiumUsd.toFixed(0)),
    energy: Number(s.result.combined.energyValueNgn.toFixed(0)),
    carbon: Number(s.result.combined.carbonValueNgn.toFixed(0)),
    digestate: Number(s.result.combined.digestateValueNgn.toFixed(0)),
  }))

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartCard title="Daily Biogas Output (m³)">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e5931" />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          <Bar dataKey="biogasM3" name="Biogas (m³/day)" fill="#4caf50" radius={[4, 4, 0, 0]} />
          <Bar dataKey="ch4M3" name="CH₄ (m³/day)" fill="#00bcd4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Emissions Balance (tonnes CO₂e/year)">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e5931" />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          <Bar dataKey="baseline" name="Baseline" fill="#e63946" radius={[4, 4, 0, 0]} />
          <Bar dataKey="avoided" name="Avoided" fill="#4caf50" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Annual Carbon Revenue (USD) — Three Price Scenarios">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e5931" />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          <Bar dataKey="conservative" name="Conservative" fill="#f4a261" radius={[4, 4, 0, 0]} />
          <Bar dataKey="mid" name="Mid" fill="#4caf50" radius={[4, 4, 0, 0]} />
          <Bar dataKey="premium" name="Premium" fill="#00bcd4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Combined Annual Value Breakdown (₦)">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e5931" />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={legendStyle} />
          <Bar dataKey="energy" name="Energy" stackId="v" fill="#f4a261" />
          <Bar dataKey="carbon" name="Carbon" stackId="v" fill="#4caf50" />
          <Bar dataKey="digestate" name="Digestate" stackId="v" fill="#00bcd4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartCard>
    </div>
  )
}
