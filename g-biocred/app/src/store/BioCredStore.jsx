import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'

const STORAGE_KEY = 'gbiocred:store:v1'

const initialState = {
  yieldResult: null,
  digesterPrefill: null,
  emissionsResult: null,
  gwpKey: 'AR6_BIOGENIC',
  leakageFactor: null,
  scenarios: [],
  auditLog: [],
}

function loadInitialState() {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    return { ...initialState, ...JSON.parse(raw) }
  } catch {
    return initialState
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_YIELD_RESULT':
      return { ...state, yieldResult: action.payload }
    case 'SET_DIGESTER_PREFILL':
      return { ...state, digesterPrefill: action.payload }
    case 'SET_EMISSIONS_RESULT':
      return { ...state, emissionsResult: action.payload }
    case 'SET_GWP_KEY':
      return { ...state, gwpKey: action.payload }
    case 'SET_LEAKAGE_FACTOR':
      return { ...state, leakageFactor: action.payload }
    case 'ADD_SCENARIO':
      return { ...state, scenarios: [...state.scenarios, action.payload] }
    case 'REMOVE_SCENARIO':
      return { ...state, scenarios: state.scenarios.filter((s) => s.id !== action.payload) }
    case 'ADD_AUDIT_ENTRY':
      return { ...state, auditLog: [action.payload, ...state.auditLog] }
    default:
      return state
  }
}

const BioCredStoreContext = createContext(null)

export function BioCredStoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // localStorage unavailable (private mode, quota) — state stays in-memory
    }
  }, [state])

  const actions = useMemo(
    () => ({
      setYieldResult: (payload) => dispatch({ type: 'SET_YIELD_RESULT', payload }),
      setDigesterPrefill: (payload) => dispatch({ type: 'SET_DIGESTER_PREFILL', payload }),
      setEmissionsResult: (payload) => dispatch({ type: 'SET_EMISSIONS_RESULT', payload }),
      setGwpKey: (payload) => dispatch({ type: 'SET_GWP_KEY', payload }),
      setLeakageFactor: (payload) => dispatch({ type: 'SET_LEAKAGE_FACTOR', payload }),
      addScenario: (payload) => dispatch({ type: 'ADD_SCENARIO', payload }),
      removeScenario: (id) => dispatch({ type: 'REMOVE_SCENARIO', payload: id }),
      addAuditEntry: (payload) => dispatch({ type: 'ADD_AUDIT_ENTRY', payload }),
    }),
    [],
  )

  const value = useMemo(() => ({ state, ...actions }), [state, actions])

  return <BioCredStoreContext.Provider value={value}>{children}</BioCredStoreContext.Provider>
}

export function useBioCredStore() {
  const ctx = useContext(BioCredStoreContext)
  if (!ctx) throw new Error('useBioCredStore must be used within BioCredStoreProvider')
  return ctx
}
