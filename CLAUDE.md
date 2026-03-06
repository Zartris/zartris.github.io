# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

NEVER ADD Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com> to your commit messages!
Dont credit anyone.

## Project Overview

Personal portfolio / academic homepage for a robotics researcher. Plain static site — no framework, no build tool, no bundler. Vanilla HTML, CSS, and ES6+ JavaScript, hosted on GitHub Pages.

## Development Commands

```bash
# Serve locally
python3 serve.py        # http://localhost:8000

# Docker sandbox (isolates node_modules, uses Claude Code CLI inside)
docker-compose -f docker-compose.dev.yml up
```

No build step, no linter, no test runner.

## Architecture

The entire site is a single `index.html`. Scripts are loaded in dependency order at the bottom of `<body>`:

```
simulation.js           # hero canvas animation (independent)
main.js                 # scroll-reveal, skill panels, video lightbox
demo/settings.js        # MUST load first — initialises window.Demo and Demo.Settings
demo/zones.js
demo/agent.js
demo/bags.js
demo/dispatcher.js
demo/hud.js
demo/interaction.js
demo/demo.js            # main requestAnimationFrame loop, wires everything
```

### Shared namespace pattern

All demo modules extend a shared `window.Demo` namespace:

```js
window.Demo = window.Demo || {};
Demo.MyThing = ...;
```

`demo/settings.js` initialises `Demo.Settings` (runtime-adjustable values like fleet size, speed, spawn rate). Every other demo module reads from it — changes to `Demo.Settings` propagate live.

### Two canvas simulations

| Canvas | Section | Purpose |
|---|---|---|
| `#agentCanvas` | Hero | Decorative; 28 agents with collision avoidance and GNN-style edges |
| `#demoCanvas` | Demo | Interactive baggage-handling fleet simulation |

The demo simulation has a full agent state machine (`IDLE → TO_PICKUP → AT_PICKUP → TO_DROPOFF → AT_DROPOFF`), a greedy nearest-idle dispatcher, a bag spawner, a live HUD, and click-to-dispatch interactivity.

### CSS

One file: `css/style.css`. Uses CSS custom properties for the design token system. Key tokens: dark background `#07080A`, cyan accent `#00d4ff`, variable font stack (Syne, Space Mono, IBM Plex Sans via Google CDN).

## Key Files

- `index.html` — entire site structure, all sections inline
- `js/demo/settings.js` — central config object; touch this when changing any tunable demo parameter
- `js/demo/demo.js` — main RAF loop entry point
- `todos.md` — project backlog and design notes (more useful than README.md)
- `docs/plans/` — design documents for major features
