import { Link } from 'react-router-dom'
import { CheckCircle2, CloudOff } from 'lucide-react'
import { t } from '../../data/translations.js'

export default function ResultScreen({ language, status, referenceNumber, onSubmitAnother }) {
  const isSuccess = status === 'success'

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span
        className={`flex h-20 w-20 items-center justify-center rounded-full ${
          isSuccess ? 'bg-safe/15 text-safe' : 'bg-amber/15 text-amber'
        }`}
      >
        {isSuccess ? <CheckCircle2 className="h-10 w-10" /> : <CloudOff className="h-10 w-10" />}
      </span>

      <h1 className="mt-6 text-2xl font-bold text-text">
        {t(language, isSuccess ? 'successTitle' : 'offlineTitle')}
      </h1>

      <p className="mt-3 text-sm leading-normal text-muted">
        {t(language, isSuccess ? 'successText' : 'offlineText')}
      </p>

      <p className="mt-4 text-2xl font-bold tracking-wide text-teal">{referenceNumber}</p>

      {isSuccess && <p className="mt-4 text-xs text-muted">{t(language, 'shareWithNosdra')}</p>}

      <div className="mt-8 flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={onSubmitAnother}
          className="flex min-h-[56px] w-full items-center justify-center rounded-lg bg-teal px-6 text-sm font-bold text-white transition-colors hover:bg-teal/90"
        >
          {t(language, 'submitAnother')}
        </button>
        <Link
          to="/app"
          className="flex min-h-[56px] w-full items-center justify-center rounded-lg border border-teal px-6 text-sm font-bold text-text transition-colors hover:bg-teal/10"
        >
          {t(language, 'viewDashboard')}
        </Link>
      </div>
    </div>
  )
}
