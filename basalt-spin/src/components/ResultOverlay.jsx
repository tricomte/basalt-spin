import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { NeonText } from './NeonText'

function Typewriter({ text, active, className }) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    if (!active) {
      setShown('')
      return
    }
    let i = 0
    setShown('')
    const id = window.setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, 48)
    return () => window.clearInterval(id)
  }, [active, text])
  return <span className={className}>{shown}</span>
}

function clearTimerList(list) {
  list.forEach((id) => window.clearTimeout(id))
  list.length = 0
}

export function ResultOverlay({
  open,
  prize,
  onNextAgent,
  play,
  onSystemErrorDone,
}) {
  const [phase, setPhase] = useState('idle')
  const [showNext, setShowNext] = useState(false)
  const [blackout, setBlackout] = useState(false)
  const [glitchBurst, setGlitchBurst] = useState(false)
  const [flashAccess, setFlashAccess] = useState(false)
  const [hugPulse, setHugPulse] = useState(false)
  const [pageShake, setPageShake] = useState(false)

  const openRef = useRef(false)
  const timersRef = useRef([])
  const playRef = useRef(play)
  const onSystemErrorDoneRef = useRef(onSystemErrorDone)
  playRef.current = play
  onSystemErrorDoneRef.current = onSystemErrorDone

  const schedule = (fn, ms) => {
    const id = window.setTimeout(() => {
      if (!openRef.current) return
      fn()
    }, ms)
    timersRef.current.push(id)
    return id
  }

  useEffect(() => {
    clearTimerList(timersRef.current)
    openRef.current = open

    if (!open) {
      setPhase('idle')
      setShowNext(false)
      setBlackout(false)
      setGlitchBurst(false)
      setFlashAccess(false)
      setHugPulse(false)
      setPageShake(false)
      import('../utils/confetti').then((m) => m.stopJackpotRain())
      return
    }

    const origin = { x: 0.5, y: 0.4 }

    if (prize === 'Hug') {
      setPhase('hug')
      setHugPulse(true)
      schedule(() => {
        import('../utils/confetti').then((m) => {
          if (openRef.current) m.burstHug(origin.x, origin.y)
        })
      }, 140)
      schedule(() => {
        if (openRef.current) setShowNext(true)
      }, 2200)
      return () => {
        clearTimerList(timersRef.current)
        import('../utils/confetti').then((m) => m.stopJackpotRain())
      }
    }

    if (prize === 'Mac Mini') {
      setPhase('jackpotBurst')
      setGlitchBurst(true)
      playRef.current?.('jackpot')
      schedule(() => {
        if (!openRef.current) return
        setPageShake(true)
      }, 300)
      schedule(() => {
        if (!openRef.current) return
        setFlashAccess(true)
      }, 1000)
      schedule(() => {
        if (!openRef.current) return
        setFlashAccess(false)
        setPageShake(false)
      }, 1350)
      schedule(() => {
        if (!openRef.current) return
        setGlitchBurst(false)
        setBlackout(true)
        setPhase('jackpotBlack')
      }, 1200)
      schedule(() => {
        if (!openRef.current) return
        setBlackout(false)
        setPhase('jackpotReveal')
        import('../utils/confetti').then((m) => {
          if (!openRef.current) return
          m.burstJackpot(origin.x, origin.y)
          window.setTimeout(() => {
            if (openRef.current) m.burstJackpot(origin.x * 0.9, origin.y * 1.05)
          }, 180)
        })
      }, 1500)
      schedule(() => {
        if (openRef.current) setShowNext(true)
      }, 6400)
      return () => {
        clearTimerList(timersRef.current)
        import('../utils/confetti').then((m) => m.stopJackpotRain())
      }
    }

    setPhase('win')
    setFlashAccess(true)
    schedule(() => {
      if (openRef.current) setFlashAccess(false)
    }, 380)
    schedule(() => {
      import('../utils/confetti').then((m) => {
        if (openRef.current) m.burstStandard(origin.x, origin.y)
      })
    }, 140)
    schedule(() => {
      if (openRef.current) setShowNext(true)
    }, 2200)

    return () => {
      clearTimerList(timersRef.current)
      import('../utils/confetti').then((m) => m.stopJackpotRain())
    }
  }, [open, prize])

  const nextBtnClass =
    'group relative flex min-w-[240px] items-center justify-center gap-2 rounded-2xl border-2 border-basalt-cyan bg-[#0d0d14]/95 py-4 font-orbitron text-xs font-black tracking-[0.2em] text-basalt-cyan shadow-[0_0_28px_rgba(0,240,255,.45),inset_0_1px_0_rgba(255,255,255,.08)]'

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            x: pageShake ? [0, -4, 5, -3, 2, -2, 0] : 0,
            y: pageShake ? [0, 3, -4, 3, -2, 1, 0] : 0,
          }}
          transition={{
            x: pageShake ? { duration: 0.28, repeat: 3, ease: 'linear' } : undefined,
            y: pageShake ? { duration: 0.28, repeat: 3, ease: 'linear' } : undefined,
          }}
          exit={{ opacity: 0 }}
        >
          {blackout ? (
            <div className="absolute inset-0 z-[5] bg-black" />
          ) : null}

          {prize === 'Mac Mini' && glitchBurst ? (
            <motion.div
              className="absolute inset-0 z-[6]"
              animate={{
                backgroundColor: [
                  'rgba(0,0,0,0)',
                  'rgba(20,18,10,0.28)',
                  'rgba(0,0,0,0.42)',
                ],
              }}
              transition={{ duration: 0.55, repeat: 0 }}
            />
          ) : null}

          {prize === 'Mac Mini' && glitchBurst ? (
            <div className="pointer-events-none absolute inset-0 z-[9] overflow-hidden">
              {Array.from({ length: 72 }, (_, i) => {
                const dx = ((i * 37) % 380) - 190
                const dy = ((i * 53) % 200) - 100
                const driftX = dx * 1.08
                const driftY = dy * 1.18
                const big = i % 5 === 0
                return (
                  <motion.span
                    key={`jackpot-burst-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: '50%',
                      top: '24%',
                      width: big ? 5 : 2,
                      height: big ? 5 : 2,
                      background: big ? '#fff2bf' : '#ffd66a',
                      boxShadow: big
                        ? '0 0 16px rgba(255,215,64,.9)'
                        : '0 0 10px rgba(255,200,48,.7)',
                    }}
                    initial={{ x: 0, y: 0, opacity: 0, scale: 0.8 }}
                    animate={{ x: driftX, y: driftY, opacity: [0, 1, 0], scale: [0.8, 1, 0.5] }}
                    transition={{
                      duration: 0.45 + (i % 7) * 0.06,
                      ease: 'easeOut',
                      delay: (i % 9) * 0.01,
                    }}
                  />
                )
              })}
            </div>
          ) : null}

          {prize === 'Hug' ? (
            <>
              <motion.div
                className="pointer-events-none absolute inset-0 z-[8]"
                style={{
                  background:
                    'radial-gradient(circle at 50% 42%, rgba(233,30,142,0.36), rgba(255,182,213,0.08) 44%, transparent 70%)',
                }}
                animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.98, 1.02, 0.98] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="pointer-events-none absolute inset-0 z-[9] mix-blend-screen"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.08), transparent 36%, rgba(233,30,142,0.1))',
                }}
                animate={{ opacity: [0.2, 0.45, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {Array.from({ length: 10 }, (_, i) => (
                <motion.span
                  key={`heart-${i}`}
                  className="pointer-events-none absolute z-[10] text-xl"
                  style={{
                    left: `${12 + i * 8}%`,
                    bottom: `${12 + (i % 3) * 6}%`,
                    color: 'rgba(255, 182, 213, 0.85)',
                    textShadow: '0 0 10px rgba(233,30,142,0.7)',
                  }}
                  animate={{ y: [-6, -32, -58], opacity: [0, 1, 0], scale: [0.8, 1, 0.9] }}
                  transition={{
                    duration: 2 + (i % 4) * 0.35,
                    repeat: Infinity,
                    delay: i * 0.11,
                    ease: 'easeOut',
                  }}
                >
                  ♥
                </motion.span>
              ))}
            </>
          ) : (
            <motion.div
              className="absolute inset-0 z-[4] bg-black/82 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{
                opacity: blackout ? 0 : 1,
                x:
                  flashAccess
                    ? [0, -4, 4, -2, 0]
                    : 0,
              }}
              transition={{
                x: { duration: 0.06, repeat: flashAccess ? 5 : 0 },
              }}
            />
          )}

          {flashAccess && prize !== 'Hug' ? (
            <motion.div
              className="pointer-events-none absolute inset-0 z-[12] bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.35 }}
            />
          ) : null}

          <div className="relative z-20 mx-6 flex max-w-2xl flex-col items-center text-center">
            {prize === 'Hug' ? (
              <motion.h2
                className="font-orbitron text-lg font-black tracking-[0.22em] text-[#ffb6d5] md:text-3xl"
                style={{ textShadow: '0 0 24px rgba(233,30,142,0.7)' }}
                animate={hugPulse ? { scale: [1, 1.05, 1] } : undefined}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                HUG
              </motion.h2>
            ) : null}

            {prize === 'T-Shirt' || prize === 'Stickers' ? (
              <>
                <motion.div
                  animate={
                    flashAccess
                      ? {
                          opacity: [1, 0.15, 1, 0.35, 1],
                          skewX: [0, 5, -4, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 0.32 }}
                >
                  <NeonText
                    as="h2"
                    color="cyan"
                    className="font-orbitron text-2xl font-black tracking-[0.35em] text-white md:text-4xl"
                  >
                    YOU WON
                  </NeonText>
                </motion.div>
                {phase === 'win' ? (
                  <motion.p
                    initial={{ opacity: 0, y: 20, rotateX: -25, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                    transition={{
                      delay: 0.28,
                      type: 'spring',
                      stiffness: 220,
                      damping: 16,
                    }}
                    className="mt-10 font-orbitron text-2xl font-bold md:text-5xl"
                    style={{
                      color: '#00f0ff',
                      textShadow: '0 0 30px rgba(0,240,255,.65)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {prize === 'T-Shirt' ? 'T-SHIRT' : 'STICKERS'}
                  </motion.p>
                ) : null}
              </>
            ) : null}

            {prize === 'Mac Mini' && phase === 'jackpotReveal' ? (
              <>
                <motion.div
                  initial={{ scale: 0.15, opacity: 0, rotateX: -40, rotateY: 12 }}
                  animate={{
                    scale: [0.15, 1.22, 0.96, 1.05, 1],
                    opacity: 1,
                    rotateX: 0,
                    rotateY: 0,
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 13 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <NeonText
                    as="h2"
                    color="gold"
                    className="font-orbitron text-4xl font-black tracking-[0.28em] text-amber-200 md:text-6xl"
                  >
                    JACKPOT
                  </NeonText>
                </motion.div>
                <p
                  className="mt-10 min-h-[3.5rem] font-orbitron text-2xl font-bold text-amber-100 md:min-h-[4rem] md:text-4xl"
                  style={{
                    textShadow:
                      '0 0 28px rgba(251,191,36,.65), 0 0 60px rgba(245,158,11,.35)',
                  }}
                >
                  <Typewriter
                    active={phase === 'jackpotReveal'}
                    text="MAC MINI UNLOCKED"
                  />
                </p>
              </>
            ) : null}

            {showNext && prize !== 'Hug' ? (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${nextBtnClass} mt-14`}
                onClick={onNextAgent}
              >
                NEXT AGENT
                <span className="text-2xl leading-none">→</span>
                <span className="absolute bottom-2 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-basalt-cyan/50 to-transparent opacity-70" />
              </motion.button>
            ) : null}
            {showNext && prize === 'Hug' ? (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${nextBtnClass} mt-14 border-[#e91e8e] text-[#ffb6d5] shadow-[0_0_28px_rgba(233,30,142,.5),inset_0_1px_0_rgba(255,255,255,.08)]`}
                onClick={onNextAgent}
              >
                NEXT AGENT
                <span className="text-2xl leading-none">→</span>
                <span className="absolute bottom-2 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#e91e8e]/60 to-transparent opacity-70" />
              </motion.button>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
