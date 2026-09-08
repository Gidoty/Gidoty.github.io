import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useBioCredStore } from '../../store/BioCredStore.jsx'

const STEPS = [
  { key: 'calculator', label: 'Calculator', path: '/calculator' },
  { key: 'digester', label: 'Digester', path: '/digester' },
  { key: 'emissions', label: 'Emissions', path: '/emissions' },
  { key: 'carbon', label: 'Carbon', path: '/carbon' },
  { key: 'digestate', label: 'Digestate', path: '/digestate' },
  { key: 'compare', label: 'Compare', path: '/compare' },
  { key: 'report', label: 'Report', path: '/report' },
]

export default function ProgressSteps({ currentStep }) {
  const { state } = useBioCredStore()
  const completed = state.completedSteps

  return (
    <nav aria-label="Progress" className="mb-6 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-1">
        {STEPS.map((step, i) => {
          const isDone = completed.includes(step.key)
          const isCurrent = step.key === currentStep
          return (
            <li key={step.key} className="flex items-center gap-1">
              <Link
                to={step.path}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isCurrent
                    ? 'border-accent text-accent'
                    : isDone
                      ? 'border-accent bg-accent text-white'
                      : 'border-border text-muted'
                }`}
              >
                {isDone && !isCurrent && <Check className="h-3 w-3" />}
                {step.label}
              </Link>
              {i < STEPS.length - 1 && <span className="h-px w-4 bg-border" aria-hidden="true" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
