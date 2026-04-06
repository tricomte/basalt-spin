import { useCallback, useRef } from 'react'
import { createSoundEngine } from '../utils/soundGenerator'

export function useSound() {
  const engineRef = useRef(null)
  const unlockedRef = useRef(false)

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      try {
        engineRef.current = createSoundEngine()
      } catch {
        return null
      }
    }
    return engineRef.current
  }, [])

  const unlock = useCallback(() => {
    if (unlockedRef.current) return
    try {
      const e = getEngine()
      e?.unlock()
      unlockedRef.current = true
    } catch {
      /* noop */
    }
  }, [getEngine])

  const play = useCallback(
    (name) => {
      if (!unlockedRef.current) return
      try {
        const e = getEngine()
        if (!e) return
        if (name === 'tick') e.playTick()
        else if (name === 'win') e.playWin()
        else if (name === 'jackpot') e.playJackpot()
        else if (name === 'whoosh') e.playWhoosh()
      } catch {
        /* noop */
      }
    },
    [getEngine]
  )

  const startAmbient = useCallback(() => {
    if (!unlockedRef.current) return
    try {
      getEngine()?.startAmbient()
    } catch {
      /* noop */
    }
  }, [getEngine])

  const stopAmbient = useCallback(() => {
    try {
      getEngine()?.stopAmbient()
    } catch {
      /* noop */
    }
  }, [getEngine])

  return { unlock, play, startAmbient, stopAmbient }
}
