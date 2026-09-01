import { CartesianGrid, Legend, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatUsd2 } from '../../lib/format.js'

const COLORS = { BASE: '#00B4D8', BEAR: '#E76F51', BULL: '#2EC4B6' }
const NAMES = ['BASE', 'BEAR', 'BULL']

export default function CarbonStressChart({ curveData, breakevens }) {
  const inRangeBreakevens = Object.entries(breakevens).filter(([, price]) => price !== null && price >= 0 && price <= 200)
  const inRangeNames = new Set(inRangeBreakevens.map(([name]) => name))

  const first = curveData[0]
  const last = curveData[curveData.length - 1]

  // Per-scenario status: already loss-making before any carbon cost, stays
  // profitable across the whole range, or crosses zero somewhere in range
  // (that case already gets a marked dot on the chart).
  const statuses = NAMES.map((name) => {
    if (inRangeNames.has(name)) {
      return { name, text: `breaks even at USD ${breakevens[name].toFixed(0)}/tonne CO2.` }
    }
    if (first[name] < 0) {
      return { name, text: 'already in a loss position before any carbon cost is applied.' }
    }
    return { name, text: 'stays profitable across the full USD 0–200/tonne range.' }
  })

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">What if carbon pricing rises?</h3>
      <p className="mt-1 text-xs text-armit-muted">
        Carbon-adjusted margin (USD/bbl) as carbon price moves from USD 0 to USD 200/tonne CO2.
      </p>
      <div className="mt-3 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={curveData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="carbonPrice"
              tick={{ fill: '#A8B2C1', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              label={{ value: 'Carbon price (USD/tonne)', position: 'insideBottom', offset: -4, fill: '#A8B2C1', fontSize: 11 }}
            />
            <YAxis
              tick={{ fill: '#A8B2C1', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <ReferenceLine y={0} stroke="#A8B2C1" strokeDasharray="4 4" />
            <Tooltip
              contentStyle={{ background: '#1B2E3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFFFFF', fontSize: 12 }}
              formatter={(value) => `${formatUsd2(value)}/bbl`}
              labelFormatter={(v) => `Carbon price: $${v}/tonne`}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#A8B2C1' }} />
            <Line type="monotone" dataKey="BASE" stroke={COLORS.BASE} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="BEAR" stroke={COLORS.BEAR} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="BULL" stroke={COLORS.BULL} strokeWidth={2} dot={false} />
            {inRangeBreakevens.map(([name, price]) => (
              <ReferenceDot
                key={name}
                x={Math.round(price / 10) * 10}
                y={0}
                r={5}
                fill={COLORS[name]}
                stroke="#0D1B2A"
                strokeWidth={2}
                label={{ value: `${name} breakeven $${price.toFixed(0)}/t`, position: 'top', fill: COLORS[name], fontSize: 11 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 space-y-1 text-center text-xs text-armit-muted">
        {statuses.map((s) => (
          <li key={s.name}>
            <span className="font-semibold" style={{ color: COLORS[s.name] }}>
              {s.name}
            </span>{' '}
            {s.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
