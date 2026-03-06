/* ─────────────────────────────────────
   DEMO — MAIN LOOP
   Incrementally built.
   v2 — bags spawning + dispatcher
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
    // Clear zone queues so in-flight bags from dead agents don't linger
    if (Demo.pickupZones) {
      Demo.pickupZones.forEach(z => { z.bags = []; });
    }
    Demo.resolveZonePositions(W, H);

    agents = Array.from({ length: NUM_AGENTS }, () => new Demo.DemoAgent(W, H));
    Demo.dispatcher.agents = agents;

    // Reset stats and spawner on resize
    Demo.stats.delivered = 0;
    Demo.stats.inTransit = 0;
    Demo.stats.waiting   = 0;

    // Spawner is created once — preserving it across resizes keeps the
    // spawn cadence continuous rather than resetting to a fresh interval.
    if (!spawner) {
      spawner = new Demo.BagSpawner();
    }
  }

  function loop(ts) {
    const dt = lastTs ? ts - lastTs : 16;
    lastTs = ts;

    ctx.clearRect(0, 0, W, H);

    if (spawner) spawner.update(dt);
    Demo.dispatcher.tick();

    Demo.drawEdges(ctx, agents);
    agents.forEach(a => { a.update(agents); a.draw(ctx); });
    Demo.drawZones(ctx);
    Demo.drawBags(ctx);

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
