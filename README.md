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
- **User accounts** — register, log in, JWT sessions
- **Global leaderboard** — compete with other players worldwide
- **Works offline** as a Progressive Web App (login/leaderboard need the server)

## Quick start (Web)

```bash
cd "Space invaders"
npm install
npm run build:icons
npm start
```

Open **http://localhost:3000** — game, login API, and leaderboard all run together.

For static-only local preview (no accounts): `npm run start:static`

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
├── server/             # Express API (auth + scores)
└── package.json
```

## Accounts & leaderboard

1. **Log in / Sign up** from the welcome screen (username, email, password).
2. **Play** — when a run ends, your score is sent to the server (if logged in).
3. **Global leaderboard** shows each player’s best score and wave reached.
4. Your **global rank** appears on the welcome screen when logged in.

Guest play still works — local high scores are kept in the browser without an account.

## Deploy to the web

**Repo:** https://github.com/g00glisgayasf00k-web/space-invaders

### Render (recommended — includes login + leaderboard)

1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in.
2. **New +** → **Blueprint** → connect GitHub → select `space-invaders`.
3. Render deploys a **Node Web Service** (`render.yaml`). Click **Apply**.
4. `JWT_SECRET` is auto-generated. Open your `.onrender.com` URL.
5. **Sign up** in the game → play → scores sync to the **Global leaderboard**.

**Manual setup:** **New +** → **Web Service** → Node → Build: `npm install && npm run build:icons` → Start: `npm start`.

> Opening `index.html` directly or a static-only host will **not** enable accounts. Use the Node deploy.

### Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → `space-invaders`.
2. **Settings** → **Networking** → **Generate Domain**.

### Other hosts

Upload the entire folder to any static host (Netlify, GitHub Pages, Firebase Hosting, etc.). Ensure `index.html` is served over HTTPS for PWA install and service worker support.

## License

MIT — free to use and modify.
