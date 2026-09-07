import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function EnergyChart({ result }) {
  const data = [
    { name: 'Electrical', kwh: Number(result.electricalKwh.toFixed(1)), color: '#f4a261' },
    { name: 'Thermal', kwh: Number(result.thermalKwh.toFixed(1)), color: '#4caf50' },
    { name: 'Total LHV', kwh: Number(result.totalKwh.toFixed(1)), color: '#00bcd4' },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 font-medium text-text">Energy Output Breakdown</p>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 12, right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e5931" horizontal={false} />
            <XAxis type="number" stroke="#a5c8a7" tick={{ fill: '#a5c8a7', fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#a5c8a7"
              tick={{ fill: '#f1f8e9', fontSize: 12 }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: '#1a3a1c',
                border: '1px solid #2e5931',
                borderRadius: 8,
                color: '#f1f8e9',
              }}
              formatter={(value) => [`${value} kWh`, 'Energy']}
            />
            <Bar dataKey="kwh" radius={[0, 6, 6, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
