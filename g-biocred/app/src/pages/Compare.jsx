import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScenarioColumn from '../components/compare/ScenarioColumn.jsx'
import ComparisonTable from '../components/compare/ComparisonTable.jsx'
import ComparisonCharts from '../components/compare/ComparisonCharts.jsx'
import WinnerSummary from '../components/compare/WinnerSummary.jsx'
import CollapsibleSection from '../components/shared/CollapsibleSection.jsx'
import AuditSnapshot from '../components/calculator/AuditSnapshot.jsx'
import { DEFAULT_SCENARIO_INPUTS, isScenarioReady, calcScenarioResult } from '../utils/scenarioEngine.js'
import { sha256Hex, formatWATTimestamp } from '../utils/audit.js'
import { useBioCredStore } from '../store/BioCredStore.jsx'
import { fullYieldCalc } from '../utils/calcEngine.js'
import { SUBSTRATES } from '../data/substrates.js'

const KEYS = ['A', 'B', 'C']
const COLORS = { A: 'accent', B: 'amber', C: 'cyan' }

function makeDefaultInputs(key) {
  return { ...DEFAULT_SCENARIO_INPUTS, name: `Scenario ${key}` }
}

const EXAMPLE = {
  A: { ...DEFAULT_SCENARIO_INPUTS, name: 'Scenario A', substrateId: 'cowDung', dailyWasteKg: '50', baselineKey: 'openDumpDeep' },
  B: { ...DEFAULT_SCENARIO_INPUTS, name: 'Scenario B', substrateId: 'poultryLitter', dailyWasteKg: '50', baselineKey: 'uncoveredLagoonWarm' },
  C: {
    ...DEFAULT_SCENARIO_INPUTS,
    name: 'Scenario C',
    substrateId: 'poultryDungCoDigestion',
    dailyWasteKg: '50',
    baselineKey: 'uncoveredLagoonWarm',
  },
}

export default function Compare() {
  const navigate = useNavigate()
  const { setYieldResult, setComparisonResult, addAuditEntry } = useBioCredStore()

  const [inputs, setInputs] = useState(() => ({ A: makeDefaultInputs('A'), B: makeDefaultInputs('B'), C: makeDefaultInputs('C') }))
  const [results, setResults] = useState({ A: null, B: null, C: null })
  const [hasCompared, setHasCompared] = useState(false)
  const [mobileTab, setMobileTab] = useState(0)
  const [auditEntry, setAuditEntry] = useState(null)

  const handleChange = useCallback((key, field, value) => {
    setInputs((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
    setResults((prev) => ({ ...prev, [key]: null }))
  }, [])

  const handleClear = useCallback((key) => {
    setInputs((prev) => ({ ...prev, [key]: makeDefaultInputs(key) }))
    setResults((prev) => ({ ...prev, [key]: null }))
  }, [])

  const handleCalculateOne = useCallback(
    (key) => {
      if (!isScenarioReady(inputs[key])) return
      setResults((prev) => ({ ...prev, [key]: calcScenarioResult(inputs[key]) }))
    },
    [inputs],
  )

  const readyCount = KEYS.filter((k) => isScenarioReady(inputs[k])).length

  const handleCompareAll = useCallback(() => {
    const next = {}
    KEYS.forEach((k) => {
      next[k] = isScenarioReady(inputs[k]) ? calcScenarioResult(inputs[k]) : null
    })
    setResults(next)
    setHasCompared(true)
  }, [inputs])

  const handleLoadExample = useCallback(() => {
    setInputs(EXAMPLE)
    const next = {}
    KEYS.forEach((k) => {
      next[k] = calcScenarioResult(EXAMPLE[k])
    })
    setResults(next)
    setHasCompared(true)
  }, [])

  const scenarios = useMemo(
    () =>
      KEYS.filter((k) => results[k]).map((k) => ({
        key: k,
        name: inputs[k].name || `Scenario ${k}`,
        colorKey: COLORS[k],
        result: results[k],
      })),
    [inputs, results],
  )

  useEffect(() => {
    if (!hasCompared || scenarios.length < 2) return undefined
    let cancelled = false
    const timer = setTimeout(async () => {
      const payload = {
        inputs: KEYS.map((k) => inputs[k]),
        result: scenarios.map((s) => ({ key: s.key, name: s.name, avoidedTonnesPerYear: s.result.emissions.avoidedTonnesPerYear, totalNgn: s.result.combined.totalNgn })),
      }
      const hash = await sha256Hex(payload)
      if (cancelled) return
      const entry = {
        id: `${hash}-${Date.now()}`,
        type: 'comparison',
        hash,
        timestamp: formatWATTimestamp(),
        inputs: payload.inputs,
        result: payload.result,
      }
      setAuditEntry(entry)
      addAuditEntry(entry)
      setComparisonResult({ scenarios: payload.result, timestamp: entry.timestamp })
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCompared, scenarios])

  const handleSaveBest = useCallback(() => {
    if (!scenarios.length) return
    const winner = scenarios.reduce((best, s) => (s.result.combined.totalNgn > best.result.combined.totalNgn ? s : best))
    const substrate = SUBSTRATES[winner.result.substrate.id]
    const dailyWasteKg = Number(inputs[winner.key].dailyWasteKg) || 0
    const yieldResult = fullYieldCalc({ substrate, freshWeightKg: dailyWasteKg })
    setYieldResult({ substrateId: substrate.id, freshWeightKg: dailyWasteKg, dailyWasteKg, results: yieldResult })
    navigate('/calculator')
  }, [scenarios, inputs, setYieldResult, navigate])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="inline-block rounded-full border border-border bg-panel px-4 py-1.5 text-xs text-muted">
          All calculations use the same methodology as the core calculator · IPCC 2006/2019 · Gold
          Standard AWMS
        </span>
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">Feasibility Comparison Mode</h1>
        <p className="mt-2 text-muted">
          Compare up to 3 substrate or site scenarios side by side to identify the highest yield
          and carbon return before committing capital
        </p>
      </div>

      <div className="mb-6">
        <CollapsibleSection title="Load Example Comparison">
          <button
            type="button"
            onClick={handleLoadExample}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Load: Cow Dung vs Poultry vs Co-Digestion (Nigerian Smallholder, 50kg/day each)
          </button>
        </CollapsibleSection>
      </div>

      <div className="mb-3 flex rounded-lg border border-border bg-panel p-1 lg:hidden">
        {KEYS.map((k, i) => (
          <button
            key={k}
            type="button"
            onClick={() => setMobileTab(i)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mobileTab === i ? 'bg-accent text-white' : 'text-muted'
            }`}
          >
            Scenario {k}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {KEYS.map((k, i) => (
          <div key={k} className={mobileTab === i ? 'block' : 'hidden lg:block'}>
            <ScenarioColumn
              colorKey={COLORS[k]}
              inputs={inputs[k]}
              onChange={(field, value) => handleChange(k, field, value)}
              onClear={() => handleClear(k)}
              onCalculate={() => handleCalculateOne(k)}
              isCalculated={Boolean(results[k])}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleCompareAll}
        disabled={readyCount < 2}
        className="mt-6 h-14 w-full rounded-lg bg-accent text-lg font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Compare All →
      </button>

      {hasCompared && scenarios.length >= 2 ? (
        <div className="panel-enter mt-10 space-y-8">
          <ComparisonTable scenarios={scenarios} />
          <ComparisonCharts scenarios={scenarios} />
          <WinnerSummary scenarios={scenarios} />
          <AuditSnapshot entry={auditEntry} />

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => navigate('/report')}
              className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:scale-[1.02]"
            >
              Generate Comparison Report →
            </button>
            <button
              type="button"
              onClick={handleSaveBest}
              className="rounded-lg border border-accent px-5 py-3 text-center text-sm font-semibold text-text hover:bg-accent/10"
            >
              Save Best Scenario to Main Calculator →
            </button>
            <button
              type="button"
              onClick={() => navigate('/audit')}
              className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-text hover:bg-card"
            >
              View Audit Trail →
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-8 text-center text-sm text-muted">
          Enter at least 2 scenarios and click Compare All to see the full comparison.
        </p>
      )}
    </div>
  )
}
