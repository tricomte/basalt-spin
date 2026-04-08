# Basalt Spin

Cyberpunk-themed prize roulette wheel for live tech events: attendees register, spin, and land weighted prizes with confetti, sound, and an optional admin override for the jackpot.

![Demo](./docs/demo.png)

## Motivation

I wanted a memorable, on-brand moment for booth and meetup giveaways—something faster than a spreadsheet and more fun than a random number generator. Building it was a chance to push **motion design** (Framer Motion), **SVG**, and **browser audio** without a backend.

## Quick Start

```bash
cd basalt-spin
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

_Add `docs/demo.png` (or swap the path above) with a screen recording or screenshot of the wheel._

## Live demo

If this repo is deployed to static hosting, add the URL here. Until then, run locally with `npm run dev`.

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
