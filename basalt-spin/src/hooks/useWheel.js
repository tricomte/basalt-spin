import { useCallback, useRef, useState } from 'react'
import {
  buildSpinPlan,
  sampleRotation,
  segmentAtPointer,
  spinProgress01,
} from '../utils/wheelPhysics'

/**
 * @param {object} opts
 * @param {(seg: number, linearT: number) => void} opts.onSegmentTick
 * @param {() => void} opts.onComplete
 */
export function useWheel({ onSegmentTick, onComplete }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [spinBlur, setSpinBlur] = useState(0)
  const rafRef = useRef(null)
  const lastSegRef = useRef(null)
  const rotationRef = useRef(0)
  const spinningRef = useRef(false)

  rotationRef.current = rotation

  const cancelSpin = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const startSpin = useCallback(
    (segmentIndex, direction, spinOpts = {}) => {
      if (spinningRef.current) return
      cancelSpin()
      spinningRef.current = true
      setSpinning(true)
      lastSegRef.current = null

      const current = rotationRef.current
      const plan = buildSpinPlan(current, segmentIndex, direction, spinOpts)
      const { keyframes, durationMs, finalRotation } = plan
      const t0 = performance.now()

      const tick = (now) => {
        const elapsed = now - t0
        const linearT = Math.min(1, elapsed / durationMs)
        const pathT = spinProgress01(linearT)
        const rot = sampleRotation(keyframes, pathT)
        setRotation(rot)

        // Keep wheel visuals crisp at all speeds.
        setSpinBlur(0)

        const seg = segmentAtPointer(rot)
        if (lastSegRef.current !== seg) {
          lastSegRef.current = seg
          onSegmentTick?.(seg, linearT)
        }

        if (linearT < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          setRotation(finalRotation)
          rotationRef.current = finalRotation
          rafRef.current = null
          spinningRef.current = false
          setSpinning(false)
          setSpinBlur(0)
          onComplete?.()
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    },
    [cancelSpin, onSegmentTick, onComplete]
  )

  return {
    rotation,
    setRotation,
    spinning,
    spinBlur,
    startSpin,
    cancelSpin,
  }
}
