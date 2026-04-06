/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        basalt: {
          bg: '#0a0a0f',
          surface: '#1a1a2e',
          cyan: '#00f0ff',
          magenta: '#ff0080',
          gold: '#fbbf24',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        neonCyan: '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.2)',
        neonMagenta: '0 0 20px rgba(255, 0, 128, 0.45), 0 0 50px rgba(255, 0, 128, 0.15)',
      },
    },
  },
  plugins: [],
}
