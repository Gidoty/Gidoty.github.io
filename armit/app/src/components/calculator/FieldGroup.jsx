export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-armit-text">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border border-white/10 bg-armit-bg px-3 py-2 text-sm text-armit-text outline-none transition focus:border-armit-teal focus:ring-1 focus:ring-armit-teal'
