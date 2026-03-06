/* ─────────────────────────────────────
   DEMO — INTERACTION
   Hover and click handling for
   dropoff gates on the demo canvas.
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.initInteraction = function (canvas, spawner) {
  const r = Demo.ZONE_RADIUS;

  function canvasPos(e) {
    const rect   = canvas.getBoundingClientRect();
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

  canvas.addEventListener('mousemove', function (e) {
    const pos       = canvasPos(e);
    let   anyHovered = false;
    Demo.dropoffZones.forEach(function (z) {
      z.hovered = hitZone(z, pos);
      if (z.hovered) anyHovered = true;
    });
    canvas.style.cursor = anyHovered ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', function () {
    Demo.dropoffZones.forEach(function (z) { z.hovered = false; });
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('click', function (e) {
    const pos = canvasPos(e);
    Demo.dropoffZones.forEach(function (z) {
      if (hitZone(z, pos)) spawner.spawnForGate(z);
    });
  });
};
