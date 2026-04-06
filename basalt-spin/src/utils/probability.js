/**
 * 12 segments — outcome selection driven by explicit spin direction.
 */

const SHIRT_SEGMENTS = [0, 2, 4, 7, 9]
const HUG_SEGMENTS = [1, 5, 8, 11]
const STICKERS_SEGMENTS = [3, 6]
export const MAC_MINI_SEGMENT = 10

function randomShirtSegment() {
  return SHIRT_SEGMENTS[Math.floor(Math.random() * SHIRT_SEGMENTS.length)]
}

function randomStickersSegment() {
  return STICKERS_SEGMENTS[Math.floor(Math.random() * STICKERS_SEGMENTS.length)]
}

function randomHugSegment() {
  return HUG_SEGMENTS[Math.floor(Math.random() * HUG_SEGMENTS.length)]
}

/**
 * @param {'cw'|'ccw'} direction
 * @returns {{ prize: string, segmentIndex: number }}
 */
export function selectOutcomeByDirection(direction) {
  const r = Math.random()
  if (direction === 'cw') {
    if (r < 0.14) return { prize: 'Mac Mini', segmentIndex: MAC_MINI_SEGMENT }
    if (r < 0.6) return { prize: 'T-Shirt', segmentIndex: randomShirtSegment() }
    if (r < 0.82) return { prize: 'Hug', segmentIndex: randomHugSegment() }
    return { prize: 'Stickers', segmentIndex: randomStickersSegment() }
  }
  if (r < 0.04) return { prize: 'Mac Mini', segmentIndex: MAC_MINI_SEGMENT }
  if (r < 0.54) return { prize: 'T-Shirt', segmentIndex: randomShirtSegment() }
  if (r < 0.82) return { prize: 'Hug', segmentIndex: randomHugSegment() }
  return { prize: 'Stickers', segmentIndex: randomStickersSegment() }
}
