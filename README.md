# Basalt Spin

Cyberpunk-themed prize roulette wheel built for Basalt tech events.

## Quick Start

```bash
cd basalt-spin
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## How It Works

Players enter their name/company/email on the registration screen, then spin the wheel to win a prize.

### Prizes

| Segment | Count | Color |
|---------|-------|-------|
| T-Shirt | 5 | Cyan |
| Stickers | 2 | Purple |
| Hug | 4 | Red |
| Mac Mini | 1 | Gold (jackpot) |

### Controls

| Action | Trigger |
|--------|---------|
| Spin (random prize) | Left arrow button or `←` key |
| Spin (Mac Mini guaranteed) | Right arrow button or `→` key |
| Open admin panel | `Ctrl + Shift + A` |

The right arrow always lands on Mac Mini — use it when you want to guarantee the jackpot for someone.

### Data

Participant data is stored in two places:

- **`participants.csv`** — auto-generated file at project root (requires dev server)
- **localStorage** — browser-side backup

The admin panel (`Ctrl + Shift + A`) shows all entries and has an **Export CSV** button.

## Tech Stack

- React + Vite
- Framer Motion (animations)
- Tailwind CSS
- Web Audio API (jackpot sound)
- SVG wheel rendering
- No backend — fully client-side

## Project Structure

```
basalt-spin/
├── src/
│   ├── components/   # Wheel, ResultOverlay, RegistrationForm, AdminPanel...
│   ├── hooks/        # useWheel, useSound, useParticipants
│   ├── utils/        # probability, wheelPhysics, confetti, soundGenerator
│   └── index.css     # Global styles, animations
├── vite.config.js    # Dev server + CSV write plugin
└── participants.csv  # Auto-generated participant log
```
