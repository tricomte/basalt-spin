/**
 * Procedural cyberpunk SFX engine (no external assets).
 * Focus: cleaner mix, richer textures, less harsh highs.
 */

const NOTE = {
  C4: 261.63,
  E4: 329.63,
  G4: 392.0,
  B4: 493.88,
  C5: 523.25,
  E5: 659.25,
  G5: 783.99,
  C6: 1046.5,
}

function getCtx() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  return new AC()
}

function noiseBuffer(ctx, seconds = 0.2) {
  const samples = Math.max(1, Math.floor(ctx.sampleRate * seconds))
  const buf = ctx.createBuffer(1, samples, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < samples; i += 1) d[i] = Math.random() * 2 - 1
  return buf
}

function impulseResponse(ctx, seconds = 1.35, decay = 2.6) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const ir = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch += 1) {
    const data = ir.getChannelData(ch)
    for (let i = 0; i < len; i += 1) {
      const t = i / len
      const env = Math.pow(1 - t, decay)
      data[i] = (Math.random() * 2 - 1) * env
    }
  }
  return ir
}

function env(gain, t, attack, hold, release, peak = 1) {
  const endA = t + attack
  const endH = endA + hold
  const endR = endH + release
  gain.gain.cancelScheduledValues(t)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), endA)
  gain.gain.setValueAtTime(Math.max(0.0002, peak), endH)
  gain.gain.exponentialRampToValueAtTime(0.0001, endR)
  return endR
}

function createVoice(ctx, { type = 'triangle', freq = 440, t = ctx.currentTime, dur = 0.2, amp = 0.1, filter = 5000 }, out) {
  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(filter, t)
  lp.Q.value = 0.8

  const g = ctx.createGain()
  const end = env(g, t, 0.01, dur * 0.2, dur * 0.8, amp)

  osc.connect(lp)
  lp.connect(g)
  g.connect(out)
  osc.start(t)
  osc.stop(end + 0.02)
}

export function createSoundEngine() {
  let ctx = null
  let ambientState = null
  let buses = null
  let irBuffer = null

  function ensureCtx() {
    if (!ctx) ctx = getCtx()
    return ctx
  }

  function ensureBuses() {
    const c = ensureCtx()
    if (!c) return null
    if (buses) return buses

    const master = c.createGain()
    master.gain.value = 0.9

    const comp = c.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.knee.value = 16
    comp.ratio.value = 2.6
    comp.attack.value = 0.003
    comp.release.value = 0.2

    const limiter = c.createBiquadFilter()
    limiter.type = 'highshelf'
    limiter.frequency.value = 6800
    limiter.gain.value = -2.2

    const fxSend = c.createGain()
    fxSend.gain.value = 0.24

    const fxReturn = c.createGain()
    fxReturn.gain.value = 0.18

    const convolver = c.createConvolver()
    if (!irBuffer) irBuffer = impulseResponse(c)
    convolver.buffer = irBuffer

    master.connect(comp)
    comp.connect(limiter)
    limiter.connect(c.destination)

    fxSend.connect(convolver)
    convolver.connect(fxReturn)
    fxReturn.connect(master)

    buses = { master, fxSend }
    return buses
  }

  function playTick() {
    const c = ensureCtx()
    const b = ensureBuses()
    if (!c || !b) return

    const t = c.currentTime
    // Pure tonal tick (no noise layer): cleaner and non-stressful.
    createVoice(
      c,
      {
        type: 'sine',
        freq: 610 + Math.random() * 40,
        t,
        dur: 0.045,
        amp: 0.016,
        filter: 2600,
      },
      b.master
    )
    createVoice(
      c,
      {
        type: 'triangle',
        freq: 920 + Math.random() * 55,
        t: t + 0.003,
        dur: 0.04,
        amp: 0.005,
        filter: 3400,
      },
      b.master
    )
  }

  function playWhoosh() {
    const c = ensureCtx()
    const b = ensureBuses()
    if (!c || !b) return
    const t = c.currentTime
    createVoice(c, { type: 'sine', freq: 440, t, dur: 0.18, amp: 0.025, filter: 2800 }, b.master)
    createVoice(c, { type: 'sine', freq: 660, t: t + 0.06, dur: 0.16, amp: 0.018, filter: 3200 }, b.fxSend)
  }

  function playWin() {
    const c = ensureCtx()
    const b = ensureBuses()
    if (!c || !b) return

    const t0 = c.currentTime
    const notes = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6]
    const step = 0.11

    notes.forEach((freq, i) => {
      const t = t0 + i * step
      createVoice(c, {
        type: 'triangle',
        freq,
        t,
        dur: 0.24,
        amp: 0.08,
        filter: 5400,
      }, b.master)
      createVoice(c, {
        type: 'sine',
        freq: freq * 2,
        t: t + 0.015,
        dur: 0.2,
        amp: 0.028,
        filter: 7000,
      }, b.fxSend)
    })
  }

  function playJackpot() {
    const c = ensureCtx()
    const b = ensureBuses()
    if (!c || !b) return
    const t0 = c.currentTime

    // Sub impact.
    const sub = c.createOscillator()
    sub.type = 'sine'
    sub.frequency.setValueAtTime(62, t0)
    sub.frequency.exponentialRampToValueAtTime(42, t0 + 0.42)
    const subG = c.createGain()
    env(subG, t0, 0.004, 0.08, 0.55, 0.25)
    sub.connect(subG)
    subG.connect(b.master)
    sub.start(t0)
    sub.stop(t0 + 0.75)

    // Rising tonal shimmer (no noise).
    const riseNotes = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5]
    riseNotes.forEach((freq, i) => {
      createVoice(c, {
        type: 'sine',
        freq,
        t: t0 + 0.1 + i * 0.08,
        dur: 0.22,
        amp: 0.04,
        filter: 4800,
      }, b.fxSend)
    })

    // Harmonic fanfare.
    const seq = [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.B4, NOTE.C5, NOTE.E5, NOTE.G5]
    seq.forEach((freq, i) => {
      const t = t0 + 0.45 + i * 0.09
      createVoice(c, {
        type: 'sawtooth',
        freq,
        t,
        dur: 0.35,
        amp: 0.07,
        filter: 4200,
      }, b.master)
      createVoice(c, {
        type: 'triangle',
        freq: freq * 2,
        t: t + 0.015,
        dur: 0.28,
        amp: 0.028,
        filter: 6400,
      }, b.fxSend)
    })

    // Bright sparkles.
    for (let i = 0; i < 26; i += 1) {
      const t = t0 + 0.72 + i * 0.045
      createVoice(c, {
        type: 'sine',
        freq: 1800 + Math.random() * 2400,
        t,
        dur: 0.08,
        amp: 0.018,
        filter: 9000,
      }, b.fxSend)
    }
  }

  function startAmbient() {
    const c = ensureCtx()
    const b = ensureBuses()
    if (!c || !b || ambientState) return

    // Musical ambient only: sparse, short notes. No continuous wave/drone.
    const ambBus = c.createGain()
    ambBus.gain.value = 0.022
    ambBus.connect(b.master)
    ambBus.connect(b.fxSend)

    const progression = [
      [NOTE.C4, NOTE.G4, NOTE.C5],
      [NOTE.E4, NOTE.B4, NOTE.E5],
      [NOTE.G4, NOTE.C5, NOTE.G5],
      [NOTE.E4, NOTE.G4, NOTE.B4],
    ]
    let step = 0
    const pulse = window.setInterval(() => {
      try {
        const chord = progression[step % progression.length]
        const t = c.currentTime + 0.01
        chord.forEach((freq, i) => {
          createVoice(
            c,
            {
              type: i === 0 ? 'triangle' : 'sine',
              freq,
              t: t + i * 0.06,
              dur: 0.34,
              amp: i === 0 ? 0.012 : 0.009,
              filter: 3200 + i * 500,
            },
            ambBus
          )
        })
        step += 1
      } catch {
        /* noop */
      }
    }, 1850)

    ambientState = { ambBus, pulse }
  }

  function stopAmbient() {
    if (!ambientState) return
    try {
      window.clearInterval(ambientState.pulse)
      const c = ensureCtx()
      if (c && ambientState.ambBus) {
        ambientState.ambBus.gain.cancelScheduledValues(c.currentTime)
        ambientState.ambBus.gain.setTargetAtTime(0.0001, c.currentTime, 0.35)
      }
    } catch {
      /* noop */
    } finally {
      ambientState = null
    }
  }

  return {
    unlock() {
      const c = ensureCtx()
      if (!c) return
      if (c.state === 'suspended') c.resume().catch(() => {})
      ensureBuses()
    },
    playTick() {
      try {
        playTick()
      } catch {
        /* noop */
      }
    },
    playWin() {
      try {
        playWin()
      } catch {
        /* noop */
      }
    },
    playJackpot() {
      try {
        playJackpot()
      } catch {
        /* noop */
      }
    },
    playWhoosh() {
      try {
        playWhoosh()
      } catch {
        /* noop */
      }
    },
    startAmbient() {
      try {
        startAmbient()
      } catch {
        /* noop */
      }
    },
    stopAmbient() {
      try {
        stopAmbient()
      } catch {
        /* noop */
      }
    },
  }
}
