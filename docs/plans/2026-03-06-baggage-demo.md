# Baggage Handling Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an interactive baggage-handling canvas demo section between Expertise and Research that shows fleet coordination using the same cyan-dot visual language as the hero.

**Architecture:** Seven plain JS files under `js/demo/` write into a shared `window.Demo` namespace and are loaded in order via `<script>` tags. A new `<section id="demo">` is added to `index.html`. No build tools, no modules.

**Tech Stack:** Vanilla JS, HTML5 Canvas, plain CSS. No dependencies.

---

## Reference files

Before starting any task, briefly skim these:
- `js/simulation.js` — the hero canvas (copy visual constants from here)
- `css/style.css` — existing section/label/caption patterns to match
- `index.html` — where to insert the section and script tags
- `docs/plans/2026-03-06-baggage-demo-design.md` — full design rationale

---

## Task 1: HTML section skeleton + CSS + nav link

**Files:**
- Modify: `index.html`
- Modify: `css/style.css`

**What to build:** The empty section with canvas, heading, caption, and nav link. No JS yet — just structure and styles. Verifiable by opening the page and seeing a dark empty block between Expertise and Research.

**Step 1: Add nav link**

In `index.html`, inside `<ul class="nav-links">`, add after the Expertise link:

```html
<li><a href="#demo">Demo</a></li>
```

**Step 2: Add section HTML**

In `index.html`, insert this block between `</section> <!-- /expertise -->` and `<!-- ─── RESEARCH ─── -->`:

```html
<!-- ─── DEMO ─── -->
<section id="demo">
  <div class="section-inner">
    <div class="demo-header reveal">
      <p class="section-label">Live Demo</p>
      <h2>Fleet coordination — watch it work.</h2>
      <p class="section-desc">Robots receive bag assignments and route themselves between pickup and dropoff zones. Click any gate to dispatch a bag directly.</p>
    </div>
    <div class="demo-canvas-wrap reveal">
      <canvas id="demoCanvas"></canvas>
      <p class="demo-hint">Click a gate to dispatch a bag</p>
    </div>
    <p class="demo-caption reveal">
      Greedy baseline — nearest idle robot wins the assignment.
      The research replaces this dispatcher with GNN-based conflict-aware prediction.
    </p>
  </div>
</section>
```

**Step 3: Add CSS**

At the bottom of `css/style.css`, add:

```css
/* ─── DEMO SECTION ─── */
#demo {
  background: var(--bg);
  padding: 120px 0;
}

.demo-canvas-wrap {
  position: relative;
  width: 100%;
  margin: 40px 0 16px;
  border: 1px solid rgba(0, 212, 255, 0.12);
  border-radius: 4px;
  overflow: hidden;
}

#demoCanvas {
  display: block;
  width: 100%;
  height: 550px;
  background: #07080a;
}

.demo-hint {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: rgba(0, 212, 255, 0.45);
  pointer-events: none;
}

.demo-caption {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.7;
  max-width: 620px;
}
```

**Step 4: Verify in browser**

Open `index.html` in a browser (or the dev server). You should see:
- "Demo" link in the nav
- A new dark section between Expertise and Research
- Empty dark canvas area with a thin cyan border
- Caption text below

**Step 5: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: add demo section skeleton with canvas, nav link, and styles"
```

---

## Task 2: zones.js — define and draw pickup and dropoff zones

**Files:**
- Create: `js/demo/zones.js`
- Modify: `index.html` (add script tag)

**What to build:** Defines zone positions and draws them on the canvas. Pickup zones are cyan chevron outlines. Dropoff gates are numbered squares. Verifiable by seeing labelled zones appear on the canvas.

**Step 1: Create `js/demo/zones.js`**

```js
/* ─────────────────────────────────────
   DEMO — ZONES
   Defines pickup and dropoff zones.
   Positions are expressed as fractions
   of canvas width/height so they scale
   on resize.
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.ZONE_RADIUS = 28;

// Fractions of W and H — set at init time
Demo.pickupZones = [
  { id: 'A', label: 'Arrival A', xf: 0.10, yf: 0.20 },
  { id: 'B', label: 'Arrival B', xf: 0.10, yf: 0.75 },
  { id: 'C', label: 'Arrival C', xf: 0.88, yf: 0.50 },
];

Demo.dropoffZones = [
  { id: 1, label: 'Gate 1', xf: 0.30, yf: 0.12 },
  { id: 2, label: 'Gate 2', xf: 0.65, yf: 0.12 },
  { id: 3, label: 'Gate 3', xf: 0.30, yf: 0.88 },
  { id: 4, label: 'Gate 4', xf: 0.65, yf: 0.88 },
];

// Call after canvas resize to convert fractions to pixels
Demo.resolveZonePositions = function (W, H) {
  Demo.pickupZones.forEach(z => {
    z.x = z.xf * W;
    z.y = z.yf * H;
    z.bags = z.bags || [];   // waiting bag queue
  });
  Demo.dropoffZones.forEach(z => {
    z.x = z.xf * W;
    z.y = z.yf * H;
    z.hovered = false;
  });
};

Demo.drawZones = function (ctx) {
  const r = Demo.ZONE_RADIUS;

  // Pickup zones — chevron outline
  Demo.pickupZones.forEach(z => {
    ctx.save();
    ctx.strokeStyle = 'rgba(0,212,255,0.55)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.rect(z.x - r, z.y - r, r * 2, r * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Chevron symbol
    ctx.fillStyle = 'rgba(0,212,255,0.7)';
    ctx.font = '11px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('»', z.x, z.y - 4);

    // Label
    ctx.fillStyle = 'rgba(0,212,255,0.5)';
    ctx.font = '9px "Space Mono", monospace';
    ctx.fillText(z.label, z.x, z.y + 14);
    ctx.restore();
  });

  // Dropoff gates — solid square
  Demo.dropoffZones.forEach(z => {
    const glow = z.hovered ? 0.9 : 0.6;
    ctx.save();
    ctx.strokeStyle = `rgba(0,212,255,${glow})`;
    ctx.lineWidth = z.hovered ? 2 : 1.4;
    ctx.shadowBlur = z.hovered ? 18 : 0;
    ctx.shadowColor = 'rgba(0,212,255,0.8)';
    ctx.beginPath();
    ctx.rect(z.x - r, z.y - r, r * 2, r * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Gate number
    ctx.fillStyle = `rgba(0,212,255,${glow})`;
    ctx.font = `bold 13px "Space Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(z.id, z.x, z.y + 5);

    // Label
    ctx.fillStyle = `rgba(0,212,255,${glow * 0.75})`;
    ctx.font = '9px "Space Mono", monospace';
    ctx.fillText(z.label, z.x, z.y + 18);
    ctx.restore();
  });
};
```

**Step 2: Add script tag to `index.html`**

Before the closing `</body>` tag, add after `simulation.js` and `main.js`:

```html
<script src="js/demo/zones.js"></script>
```

Also add a temporary inline test script right after it to verify zones draw:

```html
<script>
(function(){
  const canvas = document.getElementById('demoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth  || 800;
  canvas.height = canvas.offsetHeight || 550;
  Demo.resolveZonePositions(canvas.width, canvas.height);
  Demo.drawZones(ctx);
})();
</script>
```

**Step 3: Verify in browser**

Open the page. In the Demo section canvas you should see:
- Three dashed-outline pickup zones with `»` and labels "Arrival A/B/C"
- Four solid-outline dropoff gates numbered 1–4 with labels "Gate 1–4"
- All in cyan on the dark background

**Step 4: Remove the temporary inline test script**

Delete the `<script>` block added in Step 2 — it was only for visual verification.

**Step 5: Commit**

```bash
git add js/demo/zones.js index.html
git commit -m "feat: add demo zone definitions and canvas drawing"
```

---

## Task 3: agent.js — DemoAgent with state machine

**Files:**
- Create: `js/demo/agent.js`
- Modify: `index.html` (add script tag)

**What to build:** DemoAgent class using the same visual constants as `simulation.js`. When IDLE it wanders. When assigned it steers toward a zone. State machine transitions happen via simple timer/distance checks.

**Step 1: Create `js/demo/agent.js`**

```js
/* ─────────────────────────────────────
   DEMO — AGENT
   DemoAgent mirrors the hero simulation
   visually but adds a task state machine.
───────────────────────────────────── */
window.Demo = window.Demo || {};

// States
Demo.STATE = {
  IDLE:       'IDLE',
  TO_PICKUP:  'TO_PICKUP',
  AT_PICKUP:  'AT_PICKUP',
  TO_DROPOFF: 'TO_DROPOFF',
  AT_DROPOFF: 'AT_DROPOFF',
};

const EDGE_DIST = 175;
const TRAIL_LEN = 22;
const DWELL_MS  = 500;

Demo.DemoAgent = class {
  constructor(W, H) {
    this.W = W;
    this.H = H;
    this.trail = [];
    this.size  = 2.2 + Math.random() * 1.2;
    this.speed = 0.55 + Math.random() * 0.45;
    this.alpha = 0.55 + Math.random() * 0.4;
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * this.speed;
    this.vy = (Math.random() - 0.5) * this.speed;
    this.state      = Demo.STATE.IDLE;
    this.targetZone = null;   // zone object
    this.pickupZone = null;   // zone for current bag
    this.dwellStart = null;
    this._setWanderTarget();
  }

  _setWanderTarget() {
    this.tx = 60 + Math.random() * (this.W - 120);
    this.ty = 60 + Math.random() * (this.H - 120);
  }

  get isIdle() {
    return this.state === Demo.STATE.IDLE;
  }

  // Called by dispatcher to assign a task
  assignPickup(pickupZone, dropoffZone) {
    this.pickupZone  = pickupZone;
    this.targetZone  = pickupZone;
    this.state       = Demo.STATE.TO_PICKUP;
  }

  update(all) {
    const W = this.W, H = this.H;
    let tx = this.tx, ty = this.ty;

    if (this.state === Demo.STATE.IDLE) {
      // Wander — same as hero
      const dx = tx - this.x, dy = ty - this.y;
      const d  = Math.hypot(dx, dy);
      if (d < 10) this._setWanderTarget();
      this._applyForce(dx, dy, d, all);

    } else if (this.state === Demo.STATE.TO_PICKUP ||
               this.state === Demo.STATE.TO_DROPOFF) {
      const z  = this.targetZone;
      const dx = z.x - this.x, dy = z.y - this.y;
      const d  = Math.hypot(dx, dy);
      if (d < Demo.ZONE_RADIUS * 0.6) {
        // Arrived at zone
        this.dwellStart = performance.now();
        this.state = this.state === Demo.STATE.TO_PICKUP
          ? Demo.STATE.AT_PICKUP
          : Demo.STATE.AT_DROPOFF;
      } else {
        this._applyForce(dx, dy, d, all);
      }

    } else if (this.state === Demo.STATE.AT_PICKUP) {
      if (performance.now() - this.dwellStart > DWELL_MS) {
        // Pick up the bag — remove from zone queue
        if (this.pickupZone.bags.length > 0) {
          this.pickupZone.bags.shift();
        }
        Demo.stats.inTransit++;
        this.state      = Demo.STATE.TO_DROPOFF;
        this.targetZone = this._assignedDropoff;
      }

    } else if (this.state === Demo.STATE.AT_DROPOFF) {
      if (performance.now() - this.dwellStart > DWELL_MS) {
        Demo.stats.delivered++;
        Demo.stats.inTransit = Math.max(0, Demo.stats.inTransit - 1);
        this.state       = Demo.STATE.IDLE;
        this.targetZone  = null;
        this.pickupZone  = null;
        this._assignedDropoff = null;
        this._setWanderTarget();
      }
    }

    // Move
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > TRAIL_LEN) this.trail.shift();
    this.x += this.vx;
    this.y += this.vy;

    // Boundary bounce
    if (this.x < 10)     { this.x = 10;     this.vx =  Math.abs(this.vx); }
    if (this.x > W - 10) { this.x = W - 10; this.vx = -Math.abs(this.vx); }
    if (this.y < 10)     { this.y = 10;      this.vy =  Math.abs(this.vy); }
    if (this.y > H - 10) { this.y = H - 10;  this.vy = -Math.abs(this.vy); }
  }

  _applyForce(dx, dy, d, all) {
    let fx = d > 0 ? (dx / d) * this.speed : 0;
    let fy = d > 0 ? (dy / d) * this.speed : 0;

    // Repulsion from neighbours
    for (const o of all) {
      if (o === this) continue;
      const ox = this.x - o.x, oy = this.y - o.y;
      const od = Math.hypot(ox, oy);
      if (od < 55 && od > 0) {
        const f = ((55 - od) / 55) * 1.8;
        fx += (ox / od) * f;
        fy += (oy / od) * f;
      }
    }

    this.vx = this.vx * 0.82 + fx * 0.18;
    this.vy = this.vy * 0.82 + fy * 0.18;
    const sp = Math.hypot(this.vx, this.vy);
    if (sp > this.speed * 1.6) {
      this.vx = (this.vx / sp) * this.speed * 1.6;
      this.vy = (this.vy / sp) * this.speed * 1.6;
    }
  }

  draw(ctx) {
    // Trail
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = `rgba(0,212,255,${this.alpha * 0.18})`;
      ctx.lineWidth   = this.size * 0.55;
      ctx.stroke();
    }

    // Agent dot
    ctx.shadowBlur  = 14;
    ctx.shadowColor = `rgba(0,212,255,${this.alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Direction indicator
    const sp = Math.hypot(this.vx, this.vy);
    if (sp > 0.25) {
      const ang = Math.atan2(this.vy, this.vx);
      const len = this.size * 3.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + Math.cos(ang) * len, this.y + Math.sin(ang) * len);
      ctx.strokeStyle = `rgba(0,212,255,${this.alpha * 0.35})`;
      ctx.lineWidth   = 0.6;
      ctx.stroke();
    }

    // Carrying indicator — small orbiting dot
    if (this.state === Demo.STATE.TO_DROPOFF ||
        this.state === Demo.STATE.AT_PICKUP  ||
        this.state === Demo.STATE.AT_DROPOFF) {
      const t   = performance.now() / 400;
      const orb = this.size * 2.8;
      const bx  = this.x + Math.cos(t) * orb;
      const by  = this.y + Math.sin(t) * orb;
      ctx.beginPath();
      ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fill();
    }
  }
};

Demo.drawEdges = function (ctx, agents) {
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const a = agents[i], b = agents[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < EDGE_DIST) {
        const t = 1 - d / EDGE_DIST;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,212,255,${t * t * 0.28})`;
        ctx.lineWidth   = t * 0.9;
        ctx.stroke();
      }
    }
  }
};

// Shared stats object — written by agents, read by hud.js
Demo.stats = { delivered: 0, inTransit: 0, waiting: 0 };
```

**Step 2: Add script tag in `index.html`**

After `js/demo/zones.js`:

```html
<script src="js/demo/agent.js"></script>
```

**Step 3: Verify — no errors in browser console**

Open browser dev tools (F12 → Console). Load the page. There should be no JS errors. `window.Demo.DemoAgent` should exist (type it in the console to check).

**Step 4: Commit**

```bash
git add js/demo/agent.js index.html
git commit -m "feat: add DemoAgent class with state machine and visual rendering"
```

---

## Task 4: bags.js + dispatcher.js — spawn and assign bags

**Files:**
- Create: `js/demo/bags.js`
- Create: `js/demo/dispatcher.js`
- Modify: `index.html` (add two script tags)

**What to build:** Bag spawning on a timer (4–6s, max 3 per zone) and greedy nearest-idle-agent dispatcher. Bags are drawn as glowing diamonds at their pickup zone.

**Step 1: Create `js/demo/bags.js`**

```js
/* ─────────────────────────────────────
   DEMO — BAGS
   Bag lifecycle: WAITING -> IN_TRANSIT -> DELIVERED
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.BAG_MAX_PER_ZONE = 3;

Demo.Bag = class {
  constructor(pickupZone, dropoffZone) {
    this.pickup  = pickupZone;
    this.dropoff = dropoffZone;
    this.state   = 'WAITING';
  }
};

Demo.BagSpawner = class {
  constructor() {
    this._nextSpawn = this._randomInterval();
    this._elapsed   = 0;
  }

  _randomInterval() {
    return 4000 + Math.random() * 2000; // 4–6 seconds in ms
  }

  // dt: milliseconds since last frame
  update(dt) {
    this._elapsed += dt;
    if (this._elapsed >= this._nextSpawn) {
      this._elapsed   = 0;
      this._nextSpawn = this._randomInterval();
      this._spawnBag();
    }
  }

  _spawnBag(forcedDropoff) {
    // Pick a random pickup zone that has room
    const available = Demo.pickupZones.filter(z => z.bags.length < Demo.BAG_MAX_PER_ZONE);
    if (available.length === 0) return null;

    const pickup  = available[Math.floor(Math.random() * available.length)];
    const dropoff = forcedDropoff || Demo.dropoffZones[
      Math.floor(Math.random() * Demo.dropoffZones.length)
    ];

    const bag = new Demo.Bag(pickup, dropoff);
    pickup.bags.push(bag);
    Demo.stats.waiting++;
    Demo.dispatcher.tryAssign(bag);
    return bag;
  }

  // Called by interaction.js when user clicks a gate
  spawnForGate(dropoffZone) {
    this._spawnBag(dropoffZone);
  }
};

Demo.drawBags = function (ctx) {
  Demo.pickupZones.forEach(zone => {
    zone.bags.forEach((bag, i) => {
      if (bag.state !== 'WAITING') return;
      // Offset multiple waiting bags slightly
      const bx = zone.x + (i - 1) * 10;
      const by = zone.y - Demo.ZONE_RADIUS - 10;

      // Glowing diamond
      ctx.save();
      ctx.shadowBlur  = 8;
      ctx.shadowColor = 'rgba(0,212,255,0.9)';
      ctx.fillStyle   = 'rgba(0,212,255,0.85)';
      ctx.beginPath();
      ctx.moveTo(bx,     by - 5);
      ctx.lineTo(bx + 4, by);
      ctx.lineTo(bx,     by + 5);
      ctx.lineTo(bx - 4, by);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    });
  });
};
```

**Step 2: Create `js/demo/dispatcher.js`**

```js
/* ─────────────────────────────────────
   DEMO — DISPATCHER
   Greedy: assign nearest idle agent
   to an unassigned waiting bag.
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.dispatcher = {
  agents: [],   // set by demo.js after init

  // Try to assign a specific bag to the nearest idle agent
  tryAssign(bag) {
    if (bag.state !== 'WAITING') return;

    const idle = this.agents.filter(a => a.isIdle);
    if (idle.length === 0) return;   // all busy — bag waits

    // Find nearest idle agent to the pickup zone
    let nearest = null, bestDist = Infinity;
    for (const a of idle) {
      const d = Math.hypot(a.x - bag.pickup.x, a.y - bag.pickup.y);
      if (d < bestDist) { bestDist = d; nearest = a; }
    }

    if (!nearest) return;

    // Assign
    bag.state = 'IN_TRANSIT';
    Demo.stats.waiting   = Math.max(0, Demo.stats.waiting - 1);
    nearest._assignedDropoff = bag.dropoff;
    nearest.assignPickup(bag.pickup, bag.dropoff);
  },

  // Each frame: retry unassigned waiting bags (agent may have freed up)
  tick() {
    Demo.pickupZones.forEach(zone => {
      zone.bags.forEach(bag => {
        if (bag.state === 'WAITING') this.tryAssign(bag);
      });
    });
  }
};
```

**Step 3: Add script tags in `index.html`**

After `js/demo/agent.js`:

```html
<script src="js/demo/bags.js"></script>
<script src="js/demo/dispatcher.js"></script>
```

**Step 4: Commit**

```bash
git add js/demo/bags.js js/demo/dispatcher.js index.html
git commit -m "feat: add bag spawner and greedy dispatcher"
```

---

## Task 5: hud.js — live stats overlay

**Files:**
- Create: `js/demo/hud.js`
- Modify: `index.html` (add script tag)

**What to build:** Monospace counter drawn on the canvas each frame.

**Step 1: Create `js/demo/hud.js`**

```js
/* ─────────────────────────────────────
   DEMO — HUD
   Draws live stats in canvas corner.
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.drawHud = function (ctx, W) {
  const s = Demo.stats;
  const text = `${s.delivered} delivered · ${s.inTransit} in transit · ${s.waiting} waiting`;

  ctx.save();
  ctx.font      = '11px "Space Mono", monospace';
  ctx.fillStyle = 'rgba(0,212,255,0.45)';
  ctx.textAlign = 'right';
  ctx.fillText(text, W - 16, 22);
  ctx.restore();
};
```

**Step 2: Add script tag in `index.html`**

After `js/demo/dispatcher.js`:

```html
<script src="js/demo/hud.js"></script>
```

**Step 3: Commit**

```bash
git add js/demo/hud.js index.html
git commit -m "feat: add HUD stats overlay for demo canvas"
```

---

## Task 6: interaction.js — hover and click on gates

**Files:**
- Create: `js/demo/interaction.js`
- Modify: `index.html` (add script tag)

**What to build:** Mouse move detects hover on dropoff gates (sets `zone.hovered`, changes cursor). Mouse click on a gate spawns a bag for that gate.

**Step 1: Create `js/demo/interaction.js`**

```js
/* ─────────────────────────────────────
   DEMO — INTERACTION
   Hover and click on dropoff gates.
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.initInteraction = function (canvas, spawner) {
  const r = Demo.ZONE_RADIUS;

  function canvasPos(e) {
    const rect  = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    };
  }

  function hitZone(zone, pos) {
    return Math.abs(pos.x - zone.x) <= r &&
           Math.abs(pos.y - zone.y) <= r;
  }

  canvas.addEventListener('mousemove', e => {
    const pos = canvasPos(e);
    let anyHovered = false;
    Demo.dropoffZones.forEach(z => {
      z.hovered = hitZone(z, pos);
      if (z.hovered) anyHovered = true;
    });
    canvas.style.cursor = anyHovered ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', () => {
    Demo.dropoffZones.forEach(z => z.hovered = false);
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('click', e => {
    const pos = canvasPos(e);
    Demo.dropoffZones.forEach(z => {
      if (hitZone(z, pos)) spawner.spawnForGate(z);
    });
  });
};
```

**Step 2: Add script tag in `index.html`**

After `js/demo/hud.js`:

```html
<script src="js/demo/interaction.js"></script>
```

**Step 3: Commit**

```bash
git add js/demo/interaction.js index.html
git commit -m "feat: add gate hover and click interaction for bag dispatch"
```

---

## Task 7: demo.js — main loop, wire everything together

**Files:**
- Create: `js/demo/demo.js`
- Modify: `index.html` (add script tag — this one loads last)

**What to build:** Canvas init, resize handler, create agents, spawner, wire dispatcher, run the `requestAnimationFrame` loop calling all the draw/update functions.

**Step 1: Create `js/demo/demo.js`**

```js
/* ─────────────────────────────────────
   DEMO — MAIN LOOP
   Wires all demo modules together.
   Must load last.
───────────────────────────────────── */
(function () {
  const canvas = document.getElementById('demoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const NUM_AGENTS = 12;
  let W = 0, H = 0;
  let agents  = [];
  let spawner = null;
  let lastTs  = null;

  function init() {
    W = canvas.width  = canvas.offsetWidth  || 900;
    H = canvas.height = canvas.offsetHeight || 550;

    Demo.resolveZonePositions(W, H);

    agents = Array.from({ length: NUM_AGENTS }, () => new Demo.DemoAgent(W, H));
    Demo.dispatcher.agents = agents;

    if (!spawner) {
      spawner = new Demo.BagSpawner();
      Demo.initInteraction(canvas, spawner);
    }

    // Reset zone bag queues on resize
    Demo.pickupZones.forEach(z => z.bags = []);
    Demo.stats.delivered = 0;
    Demo.stats.inTransit = 0;
    Demo.stats.waiting   = 0;
  }

  function loop(ts) {
    const dt = lastTs ? ts - lastTs : 16;
    lastTs = ts;

    ctx.clearRect(0, 0, W, H);

    spawner.update(dt);
    Demo.dispatcher.tick();

    Demo.drawEdges(ctx, agents);
    agents.forEach(a => { a.update(agents); a.draw(ctx); });
    Demo.drawZones(ctx);
    Demo.drawBags(ctx);
    Demo.drawHud(ctx, W);

    requestAnimationFrame(loop);
  }

  init();
  requestAnimationFrame(loop);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });
})();
```

**Step 2: Add script tag in `index.html`** — this must be the last demo script:

```html
<script src="js/demo/demo.js"></script>
```

**Step 3: Verify end-to-end in browser**

Open the page and scroll to the Demo section. You should see:
- 12 cyan dots wandering with trails and GNN edges
- 3 pickup zones and 4 dropoff gates drawn
- Bags (diamonds) appearing at pickup zones every 4–6 seconds
- Robots picking up bags and heading to gates
- HUD counter updating in the top-right corner of canvas
- Hovering a gate highlights it
- Clicking a gate immediately spawns and assigns a bag

Check browser console — no errors.

**Step 4: Commit**

```bash
git add js/demo/demo.js index.html
git commit -m "feat: wire demo main loop — full baggage simulation running"
```

---

## Task 8: Polish pass

**Files:**
- Modify: `css/style.css`
- Modify: `index.html` (minor copy tweaks if needed)

**What to build:** Visual consistency check and small refinements. No new functionality.

**Checklist — verify each in browser:**

- [ ] Canvas background matches hero (`#07080A`) — no grey or white flash on load
- [ ] Zones are legible but not too bright — they should feel part of the canvas, not pasted on
- [ ] GNN edges visible between nearby agents
- [ ] Bag diamonds clearly visible against dark background
- [ ] HUD text is subtle (low alpha) — it informs without dominating
- [ ] Clicking a gate gives immediate visual feedback (zone already pulses via `hovered`)
- [ ] Section heading and caption font match the rest of the site (Space Mono / IBM Plex Sans)
- [ ] No layout overflow on narrow screens — canvas shrinks correctly
- [ ] Copyright year in footer: change `2025` to `2026` while you're in the file

**Fix copyright year in `index.html`:**

Find `© 2025 Jonas le Fevre Sejersen` and change to `© 2026 Jonas le Fevre Sejersen`.

**Step: Commit all polish changes**

```bash
git add index.html css/style.css
git commit -m "fix: polish demo section visuals and update copyright year to 2026"
```

---

## Script load order in index.html (final state)

```html
<script src="js/simulation.js"></script>
<script src="js/main.js"></script>
<script src="js/demo/zones.js"></script>
<script src="js/demo/agent.js"></script>
<script src="js/demo/bags.js"></script>
<script src="js/demo/dispatcher.js"></script>
<script src="js/demo/hud.js"></script>
<script src="js/demo/interaction.js"></script>
<script src="js/demo/demo.js"></script>
```
