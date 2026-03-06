/* ─────────────────────────────────────
   DEMO — MAIN LOOP
   Incrementally built. Currently:
   v0 — static zone render
   Future tasks will add agents, bags,
   HUD, and interaction.
───────────────────────────────────── */
(function () {
  const canvas = document.getElementById('demoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0;

  function init() {
    W = canvas.width  = canvas.offsetWidth  || 900;
    H = canvas.height = canvas.offsetHeight || 550;
    Demo.resolveZonePositions(W, H);
    render();
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    Demo.drawZones(ctx);
  }

  init();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 150);
  });
})();
