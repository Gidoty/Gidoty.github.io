export default function FormulaBlock({ lines }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-bg p-3 font-mono text-xs leading-relaxed text-teal">
      {lines.join('\n')}
    </pre>
  )
}
