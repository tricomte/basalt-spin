import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

export function AdminPanel({ open, onClose, participants, onExportCsv, onClearAll }) {
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center bg-black/90 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="relative flex max-h-[85vh] w-full max-w-5xl flex-col rounded-xl border border-white/10 bg-[#0a0a12] shadow-[0_0_60px_rgba(0,240,255,.12)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="font-orbitron text-sm font-bold tracking-widest text-basalt-cyan">
                PARTICIPANT LOG
              </h2>
              <button
                type="button"
                aria-label="Close"
                className="rounded p-2 text-2xl leading-none text-white/50 hover:text-white"
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto px-3 py-3">
              <table className="w-full border-collapse text-left font-mono text-xs text-white/85">
                <thead className="sticky top-0 bg-[#0a0a12] text-[10px] uppercase tracking-wider text-basalt-cyan/80">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">First Name</th>
                    <th className="p-2">Last Name</th>
                    <th className="p-2">Company</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Prize Won</th>
                    <th className="p-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-white/35">
                        No entries yet.
                      </td>
                    </tr>
                  ) : (
                    participants.map((p, i) => (
                      <tr
                        key={p.id}
                        className="border-t border-white/5 odd:bg-white/[0.02]"
                      >
                        <td className="p-2 text-white/45">{i + 1}</td>
                        <td className="p-2">{p.firstName}</td>
                        <td className="p-2">{p.lastName}</td>
                        <td className="p-2">{p.company || '—'}</td>
                        <td className="p-2 break-all">{p.email}</td>
                        <td className="p-2 text-basalt-cyan/90">{p.prize}</td>
                        <td className="p-2 text-white/50">{p.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/10 p-4">
              <button
                type="button"
                className="rounded-lg border border-basalt-cyan/50 bg-basalt-cyan/10 px-4 py-2 font-orbitron text-[10px] font-bold tracking-widest text-basalt-cyan"
                onClick={onExportCsv}
              >
                EXPORT CSV
              </button>
              <button
                type="button"
                className="rounded-lg border border-basalt-magenta/50 bg-basalt-magenta/10 px-4 py-2 font-orbitron text-[10px] font-bold tracking-widest text-basalt-magenta"
                onClick={() => {
                  if (window.confirm('Are you sure? This removes all stored participants.')) {
                    onClearAll()
                  }
                }}
              >
                CLEAR ALL DATA
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
