export default function Slider({ label, value, min, max, step = 1, unit = '', onChange, hint }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-sm font-medium text-armit-text">{label}</label>
        <span className="whitespace-nowrap text-sm font-semibold text-armit-teal">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-armit-teal"
      />
      <div className="mt-1 flex justify-between text-[11px] text-armit-muted">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
      {hint && <p className="mt-1 text-[11px] text-armit-muted">{hint}</p>}
    </div>
  )
}
