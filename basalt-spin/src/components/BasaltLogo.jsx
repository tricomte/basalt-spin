import { useEffect, useState } from 'react'
import basaltLogoSvg from '../assets/basalt-logo.svg?raw'

function neonFilter(strength) {
  return [
    `drop-shadow(0 0 7px rgba(255,255,255,${strength}))`,
    `drop-shadow(0 0 21px rgba(255,255,255,${strength * 0.6}))`,
    `drop-shadow(0 0 42px rgba(0,240,255,${strength * 0.5}))`,
    `drop-shadow(0 0 82px rgba(0,240,255,${strength * 0.25}))`,
  ].join(' ')
}

function SiteUrl() {
  return (
    <a
      href="https://getbasalt.ai"
      className="font-mono text-[10px] font-semibold tracking-[0.28em] text-basalt-cyan/80 transition hover:text-basalt-cyan"
      style={{
        marginTop: 14,
        display: 'inline-block',
        textShadow:
          '0 0 10px rgba(0, 240, 255, 0.5), 0 0 30px rgba(0, 240, 255, 0.2)',
      }}
    >
      getbasalt.ai
    </a>
  )
}

export function BasaltLogo() {
  const [glowStrength, setGlowStrength] = useState(1)

  useEffect(() => {
    let cancelled = false
    let tid

    function flicker() {
      if (cancelled) return
      setGlowStrength(0.85 + Math.random() * 0.15)
      tid = setTimeout(flicker, 90 + Math.random() * 850)
    }

    flicker()
    return () => { cancelled = true; clearTimeout(tid) }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div
        role="img"
        aria-label="Basalt"
        className="text-white [&>svg]:block [&>svg]:h-[clamp(2.2rem,7vw,3rem)] [&>svg]:w-auto [&>svg]:max-w-[min(90vw,340px)]"
        style={{
          filter: neonFilter(glowStrength),
          transition: 'filter 0.1s ease-out',
        }}
        dangerouslySetInnerHTML={{ __html: basaltLogoSvg }}
      />
      <SiteUrl />
    </div>
  )
}
