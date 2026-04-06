import { motion } from 'framer-motion'

const glowByColor = {
  cyan: '0 0 12px rgba(0,240,255,.9), 0 0 28px rgba(0,240,255,.5), 0 0 48px rgba(0,240,255,.25)',
  purple: '0 0 12px rgba(176,0,255,.85), 0 0 32px rgba(176,0,255,.45), 0 0 56px rgba(176,0,255,.2)',
  magenta: '0 0 12px rgba(255,0,128,.85), 0 0 28px rgba(255,0,128,.45)',
  gold: '0 0 14px rgba(251,191,36,.95), 0 0 36px rgba(245,158,11,.5), 0 0 64px rgba(251,191,36,.25)',
}

export function NeonText({
  as: Tag = 'span',
  children,
  color = 'cyan',
  className = '',
  animate = false,
}) {
  const shadow = glowByColor[color] || glowByColor.cyan
  return (
    <Tag
      className={className}
      style={{
        textShadow: shadow,
        filter: color === 'gold' ? 'drop-shadow(0 0 8px rgba(251,191,36,.4))' : undefined,
      }}
    >
      {animate ? (
        <motion.span
          animate={{ opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {children}
        </motion.span>
      ) : (
        children
      )}
    </Tag>
  )
}
