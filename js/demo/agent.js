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

const _EDGE_DIST = 175;
const _TRAIL_LEN = 22;
const _DWELL_MS  = 500;

Demo.DemoAgent = class {
  constructor(W, H) {
    this.W = W;
    this.H = H;
    this.trail = [];
    this.size  = 2.2 + Math.random() * 1.2;
    this.speed = 0.55 + Math.random() * 0.45;
    this.alpha = 0.55 + Math.random() * 0.4;
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * this.speed;
    this.vy = (Math.random() - 0.5) * this.speed;
    this.state           = Demo.STATE.IDLE;
    this.targetZone      = null;
    this.pickupZone      = null;
    this._assignedDropoff = null;
    this.dwellStart      = null;
    this._setWanderTarget();
  }

  _setWanderTarget() {
    this.tx = 60 + Math.random() * (this.W - 120);
    this.ty = 60 + Math.random() * (this.H - 120);
  }

  get isIdle() {
    return this.state === Demo.STATE.IDLE;
  }

  assignPickup(pickupZone, dropoffZone) {
    this.pickupZone       = pickupZone;
    this._assignedDropoff = dropoffZone;
    this.targetZone       = pickupZone;
    this.state            = Demo.STATE.TO_PICKUP;
  }

  update(all) {
    const W = this.W, H = this.H;

    if (this.state === Demo.STATE.IDLE) {
      const dx = this.tx - this.x, dy = this.ty - this.y;
      const d  = Math.hypot(dx, dy);
      if (d < 10) this._setWanderTarget();
      this._applyForce(dx, dy, d, all);

    } else if (this.state === Demo.STATE.TO_PICKUP ||
               this.state === Demo.STATE.TO_DROPOFF) {
      if (!this.targetZone) { this.state = Demo.STATE.IDLE; return; }
      const z  = this.targetZone;
      const dx = z.x - this.x, dy = z.y - this.y;
      const d  = Math.hypot(dx, dy);
      if (d < Demo.ZONE_RADIUS * 0.6) {
        this.vx = 0;
        this.vy = 0;
        this.dwellStart = performance.now();
        this.state = this.state === Demo.STATE.TO_PICKUP
          ? Demo.STATE.AT_PICKUP
          : Demo.STATE.AT_DROPOFF;
      } else {
        this._applyForce(dx, dy, d, all);
      }

    } else if (this.state === Demo.STATE.AT_PICKUP) {
      if (performance.now() - this.dwellStart > _DWELL_MS) {
        if (this.pickupZone.bags && this.pickupZone.bags.length > 0) {
          this.pickupZone.bags.shift();
        }
        if (Demo.stats) { Demo.stats.inTransit++; }
        this.state      = Demo.STATE.TO_DROPOFF;
        this.targetZone = this._assignedDropoff;
      }

    } else if (this.state === Demo.STATE.AT_DROPOFF) {
      if (performance.now() - this.dwellStart > _DWELL_MS) {
        if (Demo.stats) {
          Demo.stats.delivered++;
          Demo.stats.inTransit = Math.max(0, Demo.stats.inTransit - 1);
        }
        this.state            = Demo.STATE.IDLE;
        this.targetZone       = null;
        this.pickupZone       = null;
        this._assignedDropoff = null;
        this._setWanderTarget();
      }
    }

    // Record trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > _TRAIL_LEN) this.trail.shift();

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
    ctx.save();
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

    // Glow dot
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

    // Carrying indicator — small orbiting dot when transporting a bag
    if (this.state === Demo.STATE.TO_DROPOFF ||
        this.state === Demo.STATE.AT_PICKUP  ||
        this.state === Demo.STATE.AT_DROPOFF) {
      const t   = performance.now() / 400;
      const orb = this.size * 2.8;
      ctx.beginPath();
      ctx.arc(this.x + Math.cos(t) * orb, this.y + Math.sin(t) * orb, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fill();
    }
    ctx.restore();
  }
};

Demo.drawEdges = function (ctx, agents) {
  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const a = agents[i], b = agents[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < _EDGE_DIST) {
        const t = 1 - d / _EDGE_DIST;
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

// Shared stats — written by agents, read by hud.js later
Demo.stats = { delivered: 0, inTransit: 0, waiting: 0 };
