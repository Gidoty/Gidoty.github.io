export default function Placeholder({ title, icon: Icon, accent = 'text-teal' }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-lg shadow-black/20">
        <span
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-bg ${accent}`}
        >
          <Icon className="h-8 w-8" />
        </span>
        <h1 className="text-2xl font-bold text-text">{title}</h1>
        <p className="mt-3 text-sm text-muted">Feature coming in next prompt — stand by</p>
      </div>
    </div>
  )
}
