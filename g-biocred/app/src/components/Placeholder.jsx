export default function Placeholder({ icon: Icon, title, description }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <Icon className="h-20 w-20 text-accent" strokeWidth={1.5} />
      <h1 className="mt-6 text-2xl font-bold text-text sm:text-3xl">{title}</h1>
      <p className="mt-3 text-sm font-medium uppercase tracking-wide text-amber">
        Building in next prompt — stand by
      </p>
      <p className="mt-4 text-muted">{description}</p>
    </div>
  )
}
