export function SpinButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mx-auto mt-4 w-full max-w-md rounded-xl border-2 border-basalt-cyan bg-[#0a0a12]/90 px-6 py-5 font-orbitron text-xs font-black tracking-[0.35em] text-basalt-cyan shadow-[0_0_24px_rgba(0,240,255,.35)] transition-colors duration-150 hover:bg-[#0d1a24] active:bg-[#102131] disabled:cursor-not-allowed disabled:opacity-35 md:mt-5 md:py-6 md:text-sm"
    >
      INITIALIZE SPIN
    </button>
  )
}
