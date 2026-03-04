/* ─────────────────────────────────────────
   MULTI-AGENT CANVAS SIMULATION
   Visualises agents navigating with GNN-style
   edges — mirrors the GIANT research visually.
───────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('agentCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const NUM_AGENTS = 28;
  const EDGE_DIST  = 175;
  const TRAIL_LEN  = 22;

  let W = 0, H = 0;
  let agents = [];

  class Agent {
    constructor() {
      this.trail = [];
      this.size  = 2.2 + Math.random() * 1.2;
      this.speed = 0.55 + Math.random() * 0.45;
      this.alpha = 0.55 + Math.random() * 0.4;
      this.reset(true);
      this.vx = (Math.random() - 0.5) * this.speed;
      this.vy = (Math.random() - 0.5) * this.speed;
    }

    reset(init) {
      this.x = init ? Math.random() * W : (Math.random() < 0.5 ? -10 : W + 10);
      this.y = init ? Math.random() * H : Math.random() * H;
      this.setTarget();
    }

    setTarget() {
      this.tx = 60 + Math.random() * (W - 120);
      this.ty = 60 + Math.random() * (H - 120);
    }

    update(all) {
      const dx = this.tx - this.x;
      const dy = this.ty - this.y;
      const d  = Math.hypot(dx, dy);

      if (d < 10) { this.setTarget(); }

      // Drive toward target
      let fx = d > 0 ? (dx / d) * this.speed : 0;
      let fy = d > 0 ? (dy / d) * this.speed : 0;

      // Repulsion from neighbours (collision avoidance)
      for (const o of all) {
        if (o === this) continue;
        const ox = this.x - o.x;
        const oy = this.y - o.y;
        const od = Math.hypot(ox, oy);
        if (od < 55 && od > 0) {
          const f = ((55 - od) / 55) * 1.8;
          fx += (ox / od) * f;
          fy += (oy / od) * f;
        }
      }

      // Smooth velocity update
      this.vx = this.vx * 0.82 + fx * 0.18;
      this.vy = this.vy * 0.82 + fy * 0.18;

      // Clamp speed
      const sp = Math.hypot(this.vx, this.vy);
      if (sp > this.speed * 1.6) {
        this.vx = (this.vx / sp) * this.speed * 1.6;
        this.vy = (this.vy / sp) * this.speed * 1.6;
      }

      // Record trail
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > TRAIL_LEN) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;

      // Soft boundary bounce
      if (this.x < 10)     { this.x = 10;     this.vx =  Math.abs(this.vx); }
      if (this.x > W - 10) { this.x = W - 10; this.vx = -Math.abs(this.vx); }
      if (this.y < 10)     { this.y = 10;      this.vy =  Math.abs(this.vy); }
      if (this.y > H - 10) { this.y = H - 10;  this.vy = -Math.abs(this.vy); }
    }

    draw(ctx) {
      // Fading trail
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

      // Glowing agent dot
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
    }
  }

  function drawEdges() {
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
  }

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    agents = Array.from({ length: NUM_AGENTS }, () => new Agent());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawEdges();
    agents.forEach(a => { a.update(agents); a.draw(ctx); });
    requestAnimationFrame(loop);
  }

  init();
  loop();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });
})();
