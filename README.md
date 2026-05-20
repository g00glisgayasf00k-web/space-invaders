# Space Invaders

A classic Space Invaders arcade game built with HTML5 Canvas. Play in any modern browser, install as a PWA on your phone, or package as native Android and iOS apps with Capacitor.

## Features

- **Authentic pixel-art sprites** — green Type A (10 pts), blue Type B (20 pts), pink Type C (30 pts), yellow player, orange UFO, purple bunkers
- **Weapon upgrades** — Single, Double (slight spread), and Triple (wide spread) firing patterns
- **Destructible bunkers** — shields chip away when hit
- **Zigzag alien bullets** — pink squiggly projectiles
- **Mystery UFO** — random bonus points (50–300)
- **Touch + keyboard controls** — on-screen buttons for phones; arrow keys + space on desktop
- **High score** saved locally
- **Works offline** as a Progressive Web App

## Quick start (Web)

```bash
cd "Space invaders"
npm run build:icons
npm start
```

Open **http://localhost:3000** in your browser.

On iPhone/Android: open the same URL in Safari/Chrome, then **Add to Home Screen** to install.

## Controls

| Platform | Move | Fire | Pause |
|----------|------|------|-------|
| Desktop  | ← → or A D | Space or Z | P or Esc |
| Mobile   | ◀ ▶ buttons or drag on play area | FIRE button | — |

Weapon upgrades: survive each cleared level to gain Double, then Triple shot (expires after 20 seconds).

## Android app

**Requirements:** [Node.js](https://nodejs.org/), [Android Studio](https://developer.android.com/studio)

```bash
npm install
npm run build:icons
npx cap add android    # first time only
npm run android
```

Android Studio opens — click **Run** to deploy to a device or emulator.

## iPhone / iPad app

**Requirements:** Mac with [Xcode](https://developer.apple.com/xcode/)

```bash
npm install
npm run build:icons
npx cap add ios        # first time only
npm run ios
```

Open the project in Xcode, select your team for signing, then **Run** on a device or simulator.

## Project structure

```
Space invaders/
├── index.html          # Main page
├── css/style.css       # Layout + mobile controls
├── js/
│   ├── sprites.js      # Pixel-art definitions
│   ├── game.js         # Game logic
│   ├── input.js        # Keyboard + touch
│   ├── audio.js        # Retro sound effects
│   └── main.js         # Entry point
├── manifest.json       # PWA manifest
├── sw.js               # Offline service worker
├── capacitor.config.json
└── package.json
```

## Deploy to the web

Upload the entire folder to any static host (Netlify, GitHub Pages, Firebase Hosting, etc.). Ensure `index.html` is served over HTTPS for PWA install and service worker support.

## License

MIT — free to use and modify.
