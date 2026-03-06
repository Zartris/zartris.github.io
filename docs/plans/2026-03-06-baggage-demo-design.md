# Design: Interactive Baggage Handling Demo

Date: 2026-03-06
Status: Approved

---

## What we are building

A new interactive canvas section on the homepage that demonstrates MAPF / fleet
coordination in a context any industrial hiring manager understands: airport
baggage logistics. Robots are the same cyan dots as the hero background. They
have a job to do. The viewer can interact.

Placed between Expertise and Research in the page order.

---

## File structure

```
js/
  simulation.js          <- existing hero, untouched
  demo/
    zones.js             <- zone definitions and canvas drawing
    bags.js              <- Bag class, spawn logic, lifecycle
    agent.js             <- DemoAgent class, state machine
    dispatcher.js        <- greedy nearest-idle assignment
    hud.js               <- monospace stats overlay
    interaction.js       <- mouse hover and click handling
    demo.js              <- canvas init, resize, main loop (loads last)
```

HTML loads all seven files in the order above via plain `<script src="...">` tags.
Each file writes into a shared `window.Demo` namespace object. No build step,
no modules, no tooling required.

---

## Visual language

Identical to the hero simulation:
- Background: `#07080A`
- Agents: cyan dots `rgba(0,212,255,…)`, same size (~2.2–3.4px radius)
- Trails: fading cyan polylines behind each agent
- GNN edges: proximity lines between nearby agents (same distance threshold)
- Zones: monospace-labelled outlines in the cyan palette
  - Pickup zones: `»` chevron symbol, cyan outline, labelled "Arrival A/B/C"
  - Dropoff gates: numbered square, slightly brighter, labelled "Gate 1–4"
- Bags: small glowing diamond sitting at pickup zone while waiting
- Carried bag: small dot orbiting the assigned robot

---

## Section HTML

```html
<section id="demo">
  <div class="section-inner">
    <p class="section-label">Live Demo</p>
    <h2>Fleet coordination — watch it work.</h2>
    <p class="section-desc">
      Robots receive bag assignments and route themselves to pickup and dropoff zones.
      Click any gate to dispatch a bag directly.
    </p>
    <canvas id="demoCanvas"></canvas>
    <p class="demo-caption">
      Greedy baseline — nearest idle robot wins the assignment.
      The research replaces this dispatcher with GNN-based conflict-aware prediction.
    </p>
  </div>
</section>
```

Canvas: `100% width`, `550px` height. Nav link "Demo" added to `<ul class="nav-links">`.

---

## Agent state machine

```
IDLE -> TO_PICKUP -> AT_PICKUP (0.5s dwell) -> TO_DROPOFF -> AT_DROPOFF (0.5s dwell) -> IDLE
```

- **IDLE**: wanders like the hero simulation (random target, velocity smoothing, boundary bounce)
- **TO_PICKUP / TO_DROPOFF**: steers toward zone centre using same velocity-smoothing approach; no pathfinding, straight-line only
- **AT_PICKUP / AT_DROPOFF**: robot stops, brief dwell timer, then transitions

---

## Bag system

- 3 pickup zones positioned near canvas edges/corners
- Bags auto-spawn at a random pickup zone every 4–6 seconds (randomised interval)
- Max 3 bags queued per zone — new spawns skipped if zone is full
- Bag states: `WAITING` (at zone) → `IN_TRANSIT` (carried by robot) → `DELIVERED` (gone)

---

## Dispatcher

- Greedy: on each bag spawn, scan all agents for IDLE state, pick nearest, assign
- If no idle agents: bag stays WAITING until a robot frees up; dispatcher re-checks each frame
- No pre-emption — an assigned robot always completes its current task

---

## HUD overlay

Monospace text in one canvas corner (matching site font: Space Mono):

```
12 bags delivered · 3 in transit · 2 waiting
```

Counters update live each frame from agent and bag state.

---

## Interactivity

- 4 dropoff gates labelled Gate 1–4
- Hovering a gate: cursor changes to pointer, gate pulses with label "Click to route a bag"
- Clicking a gate: spawns a bag at a random pickup zone, assigns it to that specific gate (bypasses normal dispatcher)
- Hint text on canvas: "Click a gate to dispatch a bag"

---

## CSS additions

In `css/style.css`:
- `#demo` section follows existing section pattern (padding, background)
- `#demoCanvas` is `display: block; width: 100%; height: 550px;`
- `.demo-caption` matches `.paper-visual-caption` style (small, muted, monospace)

---

## Out of scope for v1

- Charging stations / energy depletion
- Burst events (plane arrivals)
- Multiple bag priorities
- Pathfinding around obstacles
- Dark/light mode adaptation

---

## Implementation order (one task at a time)

1. HTML section skeleton + CSS + nav link + canvas element (no JS yet)
2. `zones.js` — define and draw zones on the demo canvas
3. `agent.js` — DemoAgent with state machine (wander when idle, steer when assigned)
4. `bags.js` + `dispatcher.js` — spawn bags, assign to nearest idle agent
5. `hud.js` — live stats overlay
6. `interaction.js` — hover and click on gates
7. `demo.js` — main loop wiring everything together
8. Polish pass — transitions, hints, caption, verify visual consistency with hero
