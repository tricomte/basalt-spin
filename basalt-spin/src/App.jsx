import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AdminPanel } from './components/AdminPanel'
import { ParticleBackground } from './components/ParticleBackground'
import { RegistrationForm } from './components/RegistrationForm'
import { ResultOverlay } from './components/ResultOverlay'
import { Wheel } from './components/Wheel'
import { useParticipants } from './hooks/useParticipants'
import { useSound } from './hooks/useSound'
import { useWheel } from './hooks/useWheel'
import { MAC_MINI_SEGMENT, selectOutcomeByDirection } from './utils/probability'

export default function App() {
  const [screen, setScreen] = useState('register')
  const [formData, setFormData] = useState(null)
  const [adminOpen, setAdminOpen] = useState(false)
  const [resultOpen, setResultOpen] = useState(false)
  const [resultPrize, setResultPrize] = useState(null)
  const [highlightSeg, setHighlightSeg] = useState(null)
  const [pointerKick, setPointerKick] = useState(false)

  const pendingRef = useRef(null)
  const prevSpinningRef = useRef(false)
  const { unlock, play } = useSound()
  const { participants, addParticipant, exportCsv, clearAll } = useParticipants()

  const onSpinComplete = useCallback(() => {
    const p = pendingRef.current
    if (!p || !formData) return
    addParticipant({
      firstName: formData.firstName,
      lastName: formData.lastName,
      company: formData.company,
      email: formData.email,
      prize: p.prize,
      mode: p.mode,
    })
    setResultPrize(p.prize)
    setHighlightSeg(p.segmentIndex)
    setResultOpen(true)
  }, [formData, addParticipant])

  const { rotation, spinning, spinBlur, startSpin } = useWheel({
    onSegmentTick: () => {
    },
    onComplete: onSpinComplete,
  })

  useEffect(() => {
    if (prevSpinningRef.current && !spinning) {
      setPointerKick(true)
      const t = window.setTimeout(() => setPointerKick(false), 480)
      prevSpinningRef.current = spinning
      return () => window.clearTimeout(t)
    }
    prevSpinningRef.current = spinning
  }, [spinning])

  useEffect(() => {
    function onKey(e) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        setAdminOpen(true)
        return
      }
      if (screen === 'wheel' && !spinning && !resultOpen) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          handleSpin('ccw')
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          handleSpin('cw')
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen, spinning, resultOpen])

  function handleRegistered(data) {
    unlock()
    setFormData(data)
    setScreen('wheel')
  }

  function handleSpin(spinDir) {
    if (!formData || spinning || resultOpen) return
    unlock()
    const outcome =
      spinDir === 'cw'
        ? { prize: 'Mac Mini', segmentIndex: MAC_MINI_SEGMENT }
        : selectOutcomeByDirection(spinDir)
    pendingRef.current = {
      prize: outcome.prize,
      segmentIndex: outcome.segmentIndex,
      mode: spinDir === 'ccw' ? 'A' : 'B',
    }
    const nearMiss =
      spinDir === 'cw' &&
      outcome.prize === 'Mac Mini' &&
      outcome.segmentIndex === MAC_MINI_SEGMENT
    startSpin(outcome.segmentIndex, spinDir, {
      nearMissError: nearMiss,
    })
  }

  const handleNextAgent = useCallback(() => {
    setResultOpen(false)
    setScreen('register')
    setFormData(null)
    setHighlightSeg(null)
    setResultPrize(null)
    pendingRef.current = null
  }, [play])

  const handleSystemErrorDone = useCallback(() => {
    setResultOpen(false)
    setHighlightSeg(null)
    setResultPrize(null)
    pendingRef.current = null
  }, [])

  const isWheelScreen = screen === 'wheel'

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-basalt-bg text-white">
      <div className="cyber-grid" aria-hidden />
      <ParticleBackground />
      <div className="pointer-events-none fixed inset-0 scanlines z-[2]" />
      <div className="app-noise" aria-hidden />

      <main
        className={`relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center ${
          isWheelScreen
            ? 'min-h-screen px-4 py-6 md:px-6 md:py-8'
            : 'min-h-[calc(100vh-100px)] px-4 pb-10 pt-2 md:min-h-[calc(100vh-120px)] md:px-6 md:pb-12 md:pt-4'
        }`}
      >
        <AnimatePresence mode="wait">
          {!isWheelScreen ? (
            <motion.div
              key="reg"
              className="w-full"
              initial={{ opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(14px)', scale: 0.97 }}
              transition={{ duration: 0.28 }}
            >
              <RegistrationForm onSubmit={handleRegistered} />
            </motion.div>
          ) : (
            <motion.div
              key="wheel"
              className="relative flex w-full max-w-6xl flex-col items-center justify-center px-2"
              initial={{ opacity: 0, filter: 'blur(12px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.28 }}
            >
              <div className="relative flex w-full items-center justify-center gap-5 md:gap-12">
                <button
                  type="button"
                  aria-label="Spin counter-clockwise"
                  disabled={spinning || resultOpen}
                  onClick={() => handleSpin('ccw')}
                  className="grid h-[96px] w-[96px] place-items-center rounded-lg border-2 border-basalt-cyan bg-[#0a0a0fcc] text-4xl font-black leading-none text-basalt-cyan shadow-[0_0_14px_rgba(0,240,255,.28)] transition duration-150 hover:scale-105 hover:shadow-[0_0_24px_rgba(0,240,255,.45)] active:bg-[#0f1a24] active:shadow-[0_0_34px_rgba(0,240,255,.7)] disabled:cursor-not-allowed disabled:opacity-40 md:h-[112px] md:w-[112px] md:text-5xl"
                >
                  ←
                </button>

                <div className="min-w-0 flex-1">
                  <Wheel
                    rotation={rotation}
                    highlightIndex={resultOpen ? highlightSeg : null}
                    spinning={spinning}
                    spinBlur={spinBlur}
                    pointerKick={pointerKick}
                  />
                </div>

                <button
                  type="button"
                  aria-label="Spin clockwise"
                  disabled={spinning || resultOpen}
                  onClick={() => handleSpin('cw')}
                  className="grid h-[96px] w-[96px] place-items-center rounded-lg border-2 border-basalt-cyan bg-[#0a0a0fcc] text-4xl font-black leading-none text-basalt-cyan shadow-[0_0_14px_rgba(0,240,255,.28)] transition duration-150 hover:scale-105 hover:shadow-[0_0_24px_rgba(0,240,255,.45)] active:bg-[#0f1a24] active:shadow-[0_0_34px_rgba(0,240,255,.7)] disabled:cursor-not-allowed disabled:opacity-40 md:h-[112px] md:w-[112px] md:text-5xl"
                >
                  →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ResultOverlay
        open={resultOpen}
        prize={resultPrize}
        play={play}
        onNextAgent={handleNextAgent}
        onSystemErrorDone={handleSystemErrorDone}
      />

      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        participants={participants}
        onExportCsv={exportCsv}
        onClearAll={() => {
          clearAll()
        }}
      />
    </div>
  )
}
