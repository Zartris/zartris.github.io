/* ─────────────────────────────────────
   DEMO — INTERACTION
   Drag any zone to reposition it.
   Short click on a dropoff gate dispatches a bag.
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.initInteraction = function (canvas, spawner) {
  if (Demo.initInteraction._done) return;
  Demo.initInteraction._done = true;

  const DRAG_THRESHOLD = 5; // pixels — below this, treat as a click

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
    if (zone.radius) {
      // Circular zones (waiting zone)
      return Math.hypot(pos.x - zone.x, pos.y - zone.y) <= zone.radius;
    }
    // Square zones (pickup / dropoff)
    const r = Demo.ZONE_RADIUS;
    return Math.abs(pos.x - zone.x) <= r &&
           Math.abs(pos.y - zone.y) <= r;
  }

  function allZones() {
    const zones = [];
    if (Demo.pickupZones)  zones.push(...Demo.pickupZones);
    if (Demo.dropoffZones) zones.push(...Demo.dropoffZones);
    if (Demo.waitingZone && Demo.waitingZone.resolved) zones.push(Demo.waitingZone);
    return zones;
  }

  let dragZone      = null;
  let dragStartPos  = null;
  let hasDragged    = false;

  canvas.addEventListener('mousedown', function (e) {
    if (!Demo.dropoffZones) return;
    const pos = canvasPos(e);
    for (const z of allZones()) {
      if (hitZone(z, pos)) {
        dragZone     = z;
        dragStartPos = pos;
        hasDragged   = false;
        break;
      }
    }
  });

  canvas.addEventListener('mousemove', function (e) {
    if (!Demo.dropoffZones) return;
    const pos = canvasPos(e);

    if (dragZone) {
      const dx = pos.x - dragStartPos.x;
      const dy = pos.y - dragStartPos.y;
      if (!hasDragged && Math.hypot(dx, dy) >= DRAG_THRESHOLD) {
        hasDragged = true;
      }
      if (hasDragged) {
        dragZone.x = pos.x;
        dragZone.y = pos.y;
        canvas.style.cursor = 'grabbing';
        // Update fractional position so resize re-resolves correctly
        dragZone.xf = pos.x / canvas.width;
        dragZone.yf = pos.y / canvas.height;
        return;
      }
    }

    // Hover detection (only when not dragging)
    let anyHovered = false;
    Demo.dropoffZones.forEach(function (z) {
      z.hovered = hitZone(z, pos);
      if (z.hovered) anyHovered = true;
    });
    canvas.style.cursor = anyHovered ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseup', function (e) {
    if (!Demo.dropoffZones) return;
    const pos = canvasPos(e);

    if (dragZone && !hasDragged) {
      const isDropoff = Demo.dropoffZones.indexOf(dragZone) !== -1;
      if (isDropoff && typeof spawner.spawnForGate === 'function') {
        spawner.spawnForGate(dragZone);
      }
    }

    dragZone     = null;
    dragStartPos = null;
    hasDragged   = false;

    // Re-check hover so cursor doesn't flicker to default if still over a gate
    let anyHovered = false;
    Demo.dropoffZones.forEach(function (z) {
      z.hovered = hitZone(z, pos);
      if (z.hovered) anyHovered = true;
    });
    canvas.style.cursor = anyHovered ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', function () {
    if (!Demo.dropoffZones) return;
    Demo.dropoffZones.forEach(function (z) { z.hovered = false; });
    dragZone     = null;
    dragStartPos = null;
    hasDragged   = false;
    canvas.style.cursor = 'default';
  });
};
