/* ─────────────────────────────────────
   DEMO — HUD
   Draws a live stats overlay on the
   canvas each frame.
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.drawHud = function (ctx, W) {
  const s    = Demo.stats;
  const text = `${s.delivered} delivered  ·  ${s.inTransit} in transit  ·  ${s.waiting} waiting`;

  ctx.save();
  ctx.font         = '11px "Space Mono", monospace';
  ctx.fillStyle    = 'rgba(0,212,255,0.45)';
  ctx.textAlign    = 'right';
  ctx.textBaseline = 'top';
  ctx.shadowBlur   = 0;
  ctx.fillText(text, W - 16, 14);
  ctx.restore();
};
