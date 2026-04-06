const N = 24

export function ParticleBackground() {
  return (
    <div className="css-particles" aria-hidden>
      {Array.from({ length: N }, (_, i) => {
        const left = `${(i * 37 + 11) % 100}%`
        const dur = `${14 + (i % 9) * 2.2}s`
        const delay = `${(i * 0.31) % 8}s`
        return (
          <span
            key={i}
            style={{
              left,
              animationDuration: dur,
              animationDelay: `-${delay}`,
            }}
          />
        )
      })}
      {Array.from({ length: 4 }, (_, i) => (
        <i
          key={`stream-${i}`}
          className="data-stream-line"
          style={{
            top: `${18 + i * 16}%`,
            animationDelay: `${i * 1.7}s`,
            animationDuration: `${5.2 + i * 0.6}s`,
          }}
        />
      ))}
    </div>
  )
}
