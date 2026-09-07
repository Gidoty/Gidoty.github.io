import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts'

export default function EmissionsChart({ project, avoidedTonnes }) {
  if (avoidedTonnes === null) return null

  const data = [
    {
      name: 'Emissions',
      project: Number(project.tonnesCO2e.toFixed(2)),
      avoided: Number(avoidedTonnes.toFixed(2)),
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 font-medium text-text">Emissions Balance (tonnes CO₂e)</p>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 12, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e5931" horizontal={false} />
            <XAxis type="number" stroke="#a5c8a7" tick={{ fill: '#a5c8a7', fontSize: 12 }} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              contentStyle={{
                background: '#1a3a1c',
                border: '1px solid #2e5931',
                borderRadius: 8,
                color: '#f1f8e9',
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#a5c8a7' }} />
            <Bar dataKey="project" name="Project emissions" stackId="a" fill="#ffb703" radius={[6, 0, 0, 6]} />
            <Bar dataKey="avoided" name="Avoided emissions" stackId="a" fill="#4caf50" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted">
        Baseline = project emissions + avoided emissions.
      </p>
    </div>
  )
}
