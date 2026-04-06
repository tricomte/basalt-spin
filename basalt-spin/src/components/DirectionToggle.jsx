export function DirectionToggle({ value, onChange, disabled = false }) {
  const base =
    'flex-1 rounded-md border px-3 py-2 font-orbitron text-[11px] font-bold tracking-[0.16em] transition md:text-xs'
  const active =
    'border-basalt-cyan bg-basalt-cyan/15 text-basalt-cyan shadow-[0_0_18px_rgba(0,240,255,.35)]'
  const idle =
    'border-basalt-cyan/40 bg-[#0a0a12]/75 text-white/65 hover:border-basalt-cyan/70 hover:text-white'

  return (
    <div className="mx-auto mt-2 w-full max-w-md rounded-xl border border-basalt-cyan/40 bg-black/35 p-1.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('ccw')}
          className={`${base} ${value === 'ccw' ? active : idle} disabled:opacity-40`}
        >
          ← CCW
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('cw')}
          className={`${base} ${value === 'cw' ? active : idle} disabled:opacity-40`}
        >
          CW →
        </button>
      </div>
    </div>
  )
}
