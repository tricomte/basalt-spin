import confetti from 'canvas-confetti'

const winColors = ['#00f0ff', '#b000ff', '#22d3ee', '#a78bfa', '#e879f9']
const goldColors = ['#fbbf24', '#f59e0b', '#fcd34d', '#fde68a', '#fff7ed', '#ffffff']
const hugColors = ['#e91e8e', '#ff5ba6', '#ff9fcf', '#ffc1df', '#ffffff']

export function burstStandard(originX, originY) {
  const defaults = {
    origin: { x: originX, y: originY },
    zIndex: 3000,
    disableForReducedMotion: true,
  }
  confetti({
    ...defaults,
    particleCount: 90,
    spread: 75,
    startVelocity: 32,
    colors: winColors,
    scalar: 1,
  })
  confetti({
    ...defaults,
    particleCount: 80,
    spread: 95,
    startVelocity: 26,
    colors: winColors,
    scalar: 0.95,
    ticks: 200,
  })
  confetti({
    ...defaults,
    particleCount: 70,
    spread: 110,
    startVelocity: 20,
    shapes: ['circle', 'square'],
    colors: winColors,
    scalar: 0.88,
  })
}

export function burstHug(originX, originY) {
  const defaults = {
    origin: { x: originX, y: originY },
    zIndex: 3000,
    disableForReducedMotion: true,
  }
  confetti({
    ...defaults,
    particleCount: 60,
    spread: 70,
    startVelocity: 22,
    colors: hugColors,
    scalar: 0.95,
  })
  confetti({
    ...defaults,
    particleCount: 46,
    spread: 92,
    startVelocity: 18,
    colors: hugColors,
    scalar: 0.85,
    ticks: 190,
    gravity: 0.8,
  })
}

let rainStop = null

export function stopJackpotRain() {
  if (rainStop) {
    rainStop()
    rainStop = null
  }
}

export function burstJackpot(originX, originY) {
  stopJackpotRain()

  const defaults = {
    origin: { x: originX, y: originY },
    zIndex: 3000,
    disableForReducedMotion: true,
  }

  confetti({
    ...defaults,
    particleCount: 320,
    spread: 180,
    startVelocity: 52,
    colors: goldColors,
    scalar: 1.25,
    ticks: 450,
  })
  confetti({
    ...defaults,
    particleCount: 260,
    spread: 200,
    startVelocity: 42,
    colors: goldColors,
    scalar: 1.1,
    ticks: 400,
  })
  confetti({
    ...defaults,
    particleCount: 200,
    angle: 90,
    spread: 100,
    startVelocity: 35,
    colors: goldColors,
    scalar: 1,
    ticks: 380,
    gravity: 0.9,
  })

  const end = Date.now() + 4500
  let raf = 0
  const tick = () => {
    confetti({
      ...defaults,
      particleCount: 4,
      angle: 60 + Math.random() * 60,
      spread: 55,
      startVelocity: 25 + Math.random() * 20,
      colors: goldColors,
      scalar: 0.9 + Math.random() * 0.4,
      ticks: 200,
    })
    confetti({
      ...defaults,
      particleCount: 3,
      angle: 120,
      spread: 70,
      startVelocity: 20,
      colors: ['#fffbeb', '#fde68a'],
      scalar: 0.6,
      gravity: 1.1,
    })
    if (Date.now() < end) raf = requestAnimationFrame(tick)
  }
  tick()

  rainStop = () => {
    cancelAnimationFrame(raf)
  }
}
