import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CARBON_MARKET } from '../../data/constants.js'

const LINES = [
  { key: 'vcmConservative', color: '#f4a261' },
  { key: 'vcmMid', color: '#4caf50' },
  { key: 'vcmPremium', color: '#00bcd4' },
]

export default function RevenueChart({ annualTonnes }) {
  const data = Array.from({ length: 11 }, (_, year) => {
    const row = { year }
    LINES.forEach(({ key }) => {
      row[key] = Number((annualTonnes * CARBON_MARKET[key].usdPerTonne * year).toFixed(0))
    })
    return row
  })

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 font-medium text-text">Cumulative Carbon Revenue Projection (10 Years, USD)</p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 8, right: 16, top: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e5931" />
            <XAxis
              dataKey="year"
              stroke="#a5c8a7"
              tick={{ fill: '#a5c8a7', fontSize: 12 }}
              label={{ value: 'Year', position: 'insideBottom', offset: -4, fill: '#a5c8a7', fontSize: 12 }}
            />
            <YAxis stroke="#a5c8a7" tick={{ fill: '#a5c8a7', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                background: '#1a3a1c',
                border: '1px solid #2e5931',
                borderRadius: 8,
                color: '#f1f8e9',
              }}
              formatter={(value) => `USD ${Number(value).toLocaleString('en-NG')}`}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#a5c8a7' }}
              formatter={(key) => CARBON_MARKET[key].label}
            />
            {LINES.map(({ key, color }) => (
              <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
