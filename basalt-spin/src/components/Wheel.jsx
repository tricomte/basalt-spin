import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { segmentLabelAngleDeg } from '../utils/wheelPhysics'

const GAP = 0.45

const SEGMENTS = [
  { label: 'T-SHIRT', prize: 'shirt', fill: '#0891b2', stroke: '#00f0ff' },
  { label: 'HUG', prize: 'hug', fill: '#450a0a', stroke: '#b91c1c' },
  { label: 'T-SHIRT', prize: 'shirt', fill: '#0891b2', stroke: '#00f0ff' },
  { label: 'STICKERS', prize: 'stickers', fill: '#6b21a8', stroke: '#b000ff' },
  { label: 'T-SHIRT', prize: 'shirt', fill: '#0891b2', stroke: '#00f0ff' },
  { label: 'HUG', prize: 'hug', fill: '#450a0a', stroke: '#b91c1c' },
  { label: 'STICKERS', prize: 'stickers', fill: '#6b21a8', stroke: '#b000ff' },
  { label: 'T-SHIRT', prize: 'shirt', fill: '#0891b2', stroke: '#00f0ff' },
  { label: 'HUG', prize: 'hug', fill: '#450a0a', stroke: '#b91c1c' },
  { label: 'T-SHIRT', prize: 'shirt', fill: '#0891b2', stroke: '#00f0ff' },
  {
    label: 'MAC MINI',
    prize: 'trophy',
    fill: 'url(#macMiniFill)',
    stroke: '#fbbf24',
    jackpot: true,
  },
  { label: 'HUG', prize: 'hug', fill: '#450a0a', stroke: '#b91c1c' },
]

function degToXY(deg, r) {
  const rad = (deg * Math.PI) / 180
  return { x: r * Math.cos(rad), y: r * Math.sin(rad) }
}

function wedgePath(innerR, outerR, a0, a1) {
  const p0o = degToXY(a0, outerR)
  const p1o = degToXY(a1, outerR)
  const p0i = degToXY(a1, innerR)
  const p1i = degToXY(a0, innerR)
  return [
    `M ${p0o.x} ${p0o.y}`,
    `A ${outerR} ${outerR} 0 0 1 ${p1o.x} ${p1o.y}`,
    `L ${p0i.x} ${p0i.y}`,
    `A ${innerR} ${innerR} 0 0 0 ${p1i.x} ${p1i.y}`,
    'Z',
  ].join(' ')
}

function BasaltHubIcon() {
  return (
    <g
      transform="scale(0.22)"
      style={{
        color: '#fff',
        filter:
          'drop-shadow(0 0 10px rgba(0,240,255,0.75)) drop-shadow(0 0 24px rgba(0,240,255,0.35))',
      }}
    >
      <g transform="translate(-100 -100)">
        <path d="M120.037 192H174.034C176.58 192 177.853 192 178.852 191.344C179.852 190.689 180.359 189.521 181.372 187.185L198.677 147.308C199.33 145.805 199.656 145.053 199.669 144.256C199.681 143.458 199.379 142.696 198.774 141.173L185.799 108.472C184.59 105.427 183.986 103.905 182.676 103.216C181.365 102.527 179.768 102.893 176.576 103.625L95.3612 122.237C91.0462 123.226 88.8887 123.72 88.0396 125.383C87.1905 127.045 88.0548 129.083 89.7834 133.159L112.673 187.124C113.675 189.488 114.177 190.67 115.181 191.335C116.185 192 117.469 192 120.037 192Z" fill="currentColor" />
        <path d="M0.796631 169.103V186C0.796631 188.828 0.796631 190.243 1.67531 191.121C2.55399 192 3.9682 192 6.79662 192H86.6019C90.6785 192 92.7167 192 93.6071 190.662C94.4975 189.324 93.7106 187.444 92.1368 183.684L74.8482 142.375C74.1009 140.589 73.7272 139.696 72.9721 139.194C72.217 138.691 71.2492 138.691 69.3134 138.691H25.9712C24.5638 138.691 23.86 138.691 23.247 138.984C22.634 139.276 22.1915 139.824 21.3063 140.918L2.57678 164.072C1.69545 165.162 1.25479 165.706 1.02571 166.354C0.796631 167.001 0.796631 167.702 0.796631 169.103Z" fill="currentColor" />
        <path d="M98.7907 93.1999L83.9694 18.5582C83.0912 14.1353 82.6521 11.9239 83.8523 10.462C85.0524 9.00006 87.307 9.00006 91.8162 9.00006H162.256C164.35 9.00006 165.397 9.00006 166.281 9.47273C167.165 9.94539 167.746 10.8163 168.909 12.558L186.733 39.2543C187.771 40.809 188.29 41.5864 188.42 42.4794C188.55 43.3724 188.275 44.2657 187.724 46.0522L177.452 79.3904C176.79 81.5385 176.459 82.6125 175.676 83.3409C174.894 84.0693 173.799 84.3225 171.609 84.8289L108.44 99.4362C104.659 100.31 102.769 100.747 101.347 99.8282C99.9243 98.909 99.5464 97.006 98.7907 93.1999Z" fill="currentColor" />
        <path d="M0.796631 84.0121V17C0.796631 13.2288 0.796631 11.3431 1.9682 10.1716C3.13978 9 5.0254 9 8.79663 9H57.8454C61.0462 9 62.6467 9 63.7609 9.9327C64.8752 10.8654 65.157 12.4408 65.7205 15.5917L79.5721 93.0479C80.012 95.5076 80.2319 96.7374 79.7801 97.8224C79.3282 98.9074 78.3004 99.6176 76.2446 101.038L46.3585 121.688L46.3584 121.688C43.8081 123.45 42.5329 124.331 41.1219 124.224C39.7109 124.118 38.5826 123.055 36.3259 120.929L3.31171 89.8359C2.07208 88.6683 1.45227 88.0846 1.12445 87.3255C0.796631 86.5664 0.796631 85.715 0.796631 84.0121Z" fill="currentColor" />
      </g>
    </g>
  )
}

const SPARKLE_OFFSETS = [0.22, 0.5, 0.78].flatMap((t, j) =>
  [0.35, 0.55, 0.75].map((rr, k) => ({
    t,
    rr,
    phase: (j * 2 + k) * 1.7,
  }))
)

export function Wheel({
  rotation,
  highlightIndex = null,
  spinning = false,
  spinBlur = 0,
  pointerKick = false,
}) {
  const outerR = 172
  const innerR = 30
  const [isMobile, setIsMobile] = useState(false)

  const idleAcc = useRef(0)
  const [idleDeg, setIdleDeg] = useState(0)

  useEffect(() => {
    if (spinning) {
      idleAcc.current = 0
      setIdleDeg(0)
      return undefined
    }
    const id = window.setInterval(() => {
      idleAcc.current += 0.045
      setIdleDeg(idleAcc.current + Math.sin(idleAcc.current * 0.11) * 1.1)
    }, 72)
    return () => window.clearInterval(id)
  }, [spinning])

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const totalRotation = rotation + (spinning ? 0 : idleDeg)

  const macAngles = useMemo(() => {
    const i = SEGMENTS.findIndex((seg) => seg.jackpot)
    const a0 = 270 + i * 30 + GAP
    const a1 = 270 + (i + 1) * 30 - GAP
    const mid = (a0 + a1) / 2
    return { a0, a1, mid }
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-[1160px]" style={{ perspective: '920px' }}>
      <motion.div className="relative mx-auto flex w-full items-center justify-center" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(9deg)' }}>
        <svg
          width="100%"
          viewBox="-210 -210 420 420"
          className="w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Prize wheel"
          style={{ height: 'min(84vh, 96vw)' }}
        >
          <defs>
            <linearGradient id="macMiniFill" x1="0%" y1="100%" x2="0%" y2="0%" gradientTransform="rotate(0)">
              <stop offset="0%" stopColor="#B8860B" />
              <stop offset="55%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#FFD700" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="9s"
                repeatCount="indefinite"
              />
            </linearGradient>
            <radialGradient
              id="macMiniDepth"
              gradientUnits="userSpaceOnUse"
              cx={degToXY(macAngles.mid, outerR).x}
              cy={degToXY(macAngles.mid, outerR).y}
              r={outerR - innerR}
            >
              <stop offset="0%" stopColor="rgba(255,215,0,0.42)" />
              <stop offset="55%" stopColor="rgba(214,175,55,0.2)" />
              <stop offset="100%" stopColor="rgba(184,134,11,0.52)" />
            </radialGradient>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="goldArcGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4.5" result="bg" />
              <feColorMatrix
                in="bg"
                type="matrix"
                values="1 0 0 0 0
                        0 0.86 0 0 0
                        0 0 0.22 0 0
                        0 0 0 1 0"
              />
              <feMerge>
                <feMergeNode in="bg" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cyanRingGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="wheel-label-clip">
              <circle r={outerR - 8} />
            </clipPath>
          </defs>

          <circle
            r={outerR + 18}
            fill="none"
            stroke="rgba(0,240,255,0.2)"
            strokeWidth="2.4"
          />

          <g style={{ filter: spinBlur > 0 ? `blur(${spinBlur}px)` : undefined, transition: 'filter 0.15s ease-out' }}>
            <g transform={`rotate(${totalRotation})`} style={{ transformOrigin: '0 0', willChange: 'transform' }}>
              {SEGMENTS.map((seg, i) => {
                const a0 = 270 + i * 30 + GAP
                const a1 = 270 + (i + 1) * 30 - GAP
                const d = wedgePath(innerR, outerR, a0, a1)
                const mid = segmentLabelAngleDeg(i)
                const dim = highlightIndex !== null && highlightIndex !== i ? 0.42 : 1
                const filterId = highlightIndex === i ? 'url(#neonGlow)' : undefined
                const isHug = seg.label === 'HUG'
                const bottomHalf = mid > 90 && mid < 270
                const textR = isMobile ? 101 : 106
                const outerStart = degToXY(a0, outerR)
                const outerEnd = degToXY(a1, outerR)
                const arcGlowPath = `M ${outerStart.x} ${outerStart.y} A ${outerR} ${outerR} 0 0 1 ${outerEnd.x} ${outerEnd.y}`

                return (
                  <g key={i} filter={filterId}>
                    <motion.path
                      d={d}
                      fill={seg.fill}
                      stroke={seg.stroke}
                      strokeWidth={seg.jackpot ? 2.4 : 1.1}
                      opacity={dim}
                      animate={
                        seg.jackpot
                          ? { opacity: [dim * 0.92, dim, dim * 0.88, dim], strokeWidth: [2.4, 3.2, 2.4] }
                          : highlightIndex === i
                          ? { opacity: [dim, Math.min(1, dim + 0.4), dim], strokeWidth: [1.1, 2.2, 1.1] }
                          : { opacity: dim }
                      }
                      transition={{
                        duration: seg.jackpot ? 2.2 : 0.85,
                        repeat: seg.jackpot || highlightIndex === i ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                    />
                    {seg.jackpot ? (
                      <>
                        <path d={d} fill="url(#macMiniDepth)" opacity={0.75} />
                        <path
                          d={arcGlowPath}
                          fill="none"
                          stroke="#FFD700"
                          strokeOpacity={0.8}
                          strokeWidth={1.8}
                          filter="url(#goldArcGlow)"
                        />
                      </>
                    ) : null}

                    <g clipPath="url(#wheel-label-clip)">
                      <g transform={`rotate(${mid}) translate(${textR} 0)`}>
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill={isHug ? '#ffd1e2' : '#ffffff'}
                          fontFamily="Orbitron, sans-serif"
                          fontWeight={800}
                          fontSize={isMobile ? 11.5 : 14}
                          paintOrder="stroke fill"
                          stroke={seg.jackpot ? 'rgba(48,34,4,0.85)' : seg.stroke}
                          strokeWidth={seg.jackpot ? 0.65 : 1}
                          strokeOpacity={0.95}
                          letterSpacing="0.02em"
                          lengthAdjust="spacingAndGlyphs"
                          textLength={isMobile ? 72 : 82}
                          transform={bottomHalf ? 'rotate(180)' : undefined}
                          style={{
                            textShadow: seg.jackpot
                              ? '0 0 6px #FFD700, 0 0 12px #FFD700, 0 0 24px rgba(184, 134, 11, 0.5)'
                              : '0 1px 2px rgba(0,0,0,0.7)',
                          }}
                        >
                          {seg.label}
                        </text>
                      </g>
                    </g>

                    {seg.jackpot
                      ? SPARKLE_OFFSETS.map((sp, si) => {
                          const ang = macAngles.a0 + (macAngles.a1 - macAngles.a0) * sp.t
                          const rr = innerR + (outerR - innerR) * sp.rr
                          const p = degToXY(ang, rr)
                          return (
                            <circle key={si} cx={p.x} cy={p.y} r={1.8} fill="#fff" opacity={0.35}>
                              <animate attributeName="opacity" values="0.2;0.95;0.2" dur={`${1.2 + (si % 3) * 0.3}s`} repeatCount="indefinite" />
                            </circle>
                          )
                        })
                      : null}

                    {seg.jackpot
                      ? Array.from({ length: 22 }, (_, pi) => {
                          const fromLeftCorner = pi % 3 === 0
                          const fromRightCorner = pi % 3 === 1
                          const arcT = ((pi * 0.47) % 1)
                          const startA = fromLeftCorner
                            ? a0
                            : fromRightCorner
                            ? a1
                            : a0 + (a1 - a0) * arcT
                          const p0 = degToXY(startA, outerR)
                          const radial = degToXY(startA, 1)
                          const tangent = { x: -radial.y, y: radial.x }
                          const driftScale = 42 + (pi % 5) * 9
                          const sideScale = ((pi % 7) - 3) * 2.8
                          const p1 = {
                            x: p0.x + radial.x * driftScale + tangent.x * sideScale,
                            y: p0.y + radial.y * driftScale + tangent.y * sideScale,
                          }
                          const big = pi % 5 === 0
                          const begin = `${(pi * 0.11) % 1.7}s`
                          const dur = `${1.45 + (pi % 4) * 0.12}s`
                          return (
                            <circle
                              key={`dust-${pi}`}
                              cx={p0.x}
                              cy={p0.y}
                              r={big ? 2.6 : 1.4}
                              fill="#FFD700"
                              opacity="0"
                            >
                              <animate attributeName="cx" values={`${p0.x};${p1.x}`} dur={dur} begin={begin} repeatCount="indefinite" />
                              <animate attributeName="cy" values={`${p0.y};${p1.y}`} dur={dur} begin={begin} repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0;0.95;0" dur={dur} begin={begin} repeatCount="indefinite" />
                            </circle>
                          )
                        })
                      : null}
                  </g>
                )
              })}

              {Array.from({ length: 13 }, (_, i) => {
                const ang = 270 + i * 30
                const p0 = degToXY(ang, innerR - 2)
                const p1 = degToXY(ang, outerR + 4)
                return (
                  <line
                    key={`div-${i}`}
                    x1={p0.x}
                    y1={p0.y}
                    x2={p1.x}
                    y2={p1.y}
                    stroke="rgba(0,240,255,0.24)"
                    strokeWidth={2}
                    opacity={0.9}
                  />
                )
              })}

              <circle r={innerR + 1.4} fill="#1a1a2e" stroke="rgba(0,240,255,0.6)" strokeWidth="1.3" />
              <circle r={innerR - 9} fill="#161625" />
            </g>
            <g>
              <circle r={innerR + 2.2} fill="#1a1a2e" stroke="rgba(0,240,255,0.6)" strokeWidth="1.2" filter="url(#cyanRingGlow)" />
              <circle r={innerR - 6.5} fill="#171726" />
              <BasaltHubIcon />
            </g>
          </g>
        </svg>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center -translate-y-1 md:-translate-y-2"
          animate={pointerKick ? { y: [0, 8, -3, 0], scaleY: [1, 0.85, 1.08, 1] } : { scale: [1, 1.05, 1] }}
          transition={pointerKick ? { duration: 0.45, ease: 'easeOut' } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            filter:
              'drop-shadow(0 0 14px #00f0ff) drop-shadow(0 0 28px rgba(0,240,255,.55)) drop-shadow(0 0 6px #ff0080)',
          }}
        >
          <div className="h-0 w-0 border-x-[18px] border-x-transparent border-t-[40px] border-t-basalt-cyan md:border-x-[22px] md:border-t-[48px]" />
        </motion.div>
      </motion.div>
    </div>
  )
}
