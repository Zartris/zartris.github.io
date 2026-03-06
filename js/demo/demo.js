/* ─────────────────────────────────────
   DEMO — MAIN LOOP
   Incrementally built.
   v1 — animated agents + zones
───────────────────────────────────── */
(function () {
  const canvas = document.getElementById('demoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const NUM_AGENTS = 12;
  let W = 0, H = 0;
  let agents = [];

  function init() {
    W = canvas.width  = canvas.offsetWidth  || 900;
    H = canvas.height = canvas.offsetHeight || 550;
    Demo.resolveZonePositions(W, H);
    agents = Array.from({ length: NUM_AGENTS }, () => new Demo.DemoAgent(W, H));
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    Demo.drawEdges(ctx, agents);
    agents.forEach(a => { a.update(agents); a.draw(ctx); });
    Demo.drawZones(ctx);
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
