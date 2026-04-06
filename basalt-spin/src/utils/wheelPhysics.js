/**
 * 12 equal segments (30°), clockwise from top pointer.
 * Segment i spans [270 + i*30, 270 + (i+1)*30) in wheel-local CW degrees.
 */

export const SEGMENT_COUNT = 12
export const SEGMENT_DEG = 30

/** Center angle (degrees, SVG CW from +X) for segment i */
export function segmentLabelAngleDeg(i) {
  return (270 + i * SEGMENT_DEG + SEGMENT_DEG / 2) % 360
}

export function rotationForSegment(segmentIndex) {
  const centerDeg = segmentLabelAngleDeg(segmentIndex)
  return (270 - centerDeg + 360) % 360
}

function alignDelta(currentRotation, segmentIndex, direction) {
  const targetMod = rotationForSegment(segmentIndex)
  const currentMod = ((currentRotation % 360) + 360) % 360
  let delta = targetMod - currentMod
  if (direction === 'cw') {
    if (delta <= 0) delta += 360
  } else {
    if (delta > 0) delta -= 360
    if (delta === 0) delta = -360
  }
  return delta
}

function cumulativeTarget(currentRotation, segmentIndex, direction, fullSpins) {
  const extraDeg = fullSpins * 360
  const d = alignDelta(currentRotation, segmentIndex, direction)
  if (direction === 'cw') return currentRotation + extraDeg + d
  return currentRotation - extraDeg + d
}

export function segmentAtPointer(rotDeg) {
  const R = ((rotDeg % 360) + 360) % 360
  const beta = (270 - R + 360) % 360
  const rel = (beta - 270 + 360) % 360
  return Math.min(SEGMENT_COUNT - 1, Math.floor(rel / SEGMENT_DEG))
}

/**
 * Monotonic spin progress over 10s:
 * - quick engagement at start
 * - then continuous deceleration until stop
 * No pause/restart or rebound near the end.
 */
export function spinProgress01(linearT) {
  const u = Math.min(1, Math.max(0, linearT))
  if (u <= 0.08) {
    const v = u / 0.08
    return 0.14 * Math.pow(v, 1.35)
  }
  const v = (u - 0.08) / 0.92
  return 0.14 + 0.86 * (1 - Math.pow(1 - v, 2.45))
}

/**
 * @param {boolean} opts.nearMissError - Mac Mini path: linger near segment 9 then settle on 7
 */
export function buildSpinPlan(currentRotation, segmentIndex, direction, opts = {}) {
  const { nearMissError = false } = opts
  const fullSpins = 7 + Math.floor(Math.random() * 4)

  const finalRotation = cumulativeTarget(currentRotation, segmentIndex, direction, fullSpins)
  const totalSpan = finalRotation - currentRotation
  const k = [
    { t: 0, rotation: currentRotation },
    { t: 1, rotation: finalRotation },
  ]

  return {
    finalRotation,
    durationMs: 10000,
    keyframes: k,
    startRotation: currentRotation,
    totalSpan,
    errorRotation: nearMissError ? finalRotation : null,
  }
}

export function sampleRotation(keyframes, easedT) {
  const t = easedT
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i]
    const b = keyframes[i + 1]
    if (t >= a.t && t <= b.t) {
      const span = b.t - a.t || 1e-6
      const u = (t - a.t) / span
      const smooth = u * u * (3 - 2 * u)
      return a.rotation + (b.rotation - a.rotation) * smooth
    }
  }
  return keyframes[keyframes.length - 1].rotation
}

/** Map linear time to eased position along spin curve (for audio / LED coupling) */
export function easedSpinT(linearT) {
  return spinProgress01(linearT)
}
