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
  { id: 'A', label: 'Arrival A', xf: 0.10, yf: 0.20, bags: [] },
  { id: 'B', label: 'Arrival B', xf: 0.10, yf: 0.75, bags: [] },
  { id: 'C', label: 'Arrival C', xf: 0.88, yf: 0.50, bags: [] },
];

Demo.dropoffZones = [
  { id: 1, label: 'Gate 1', xf: 0.30, yf: 0.12, hovered: false },
  { id: 2, label: 'Gate 2', xf: 0.65, yf: 0.12, hovered: false },
  { id: 3, label: 'Gate 3', xf: 0.30, yf: 0.88, hovered: false },
  { id: 4, label: 'Gate 4', xf: 0.65, yf: 0.88, hovered: false },
];

// Central standby area — idle robots congregate here
Demo.waitingZone = { xf: 0.50, yf: 0.50, x: 0, y: 0, radius: 70, resolved: false };

Demo.buildZones = function () {
  const PICKUP_PRESETS = [
    { id: 'A', label: 'Arrival A', xf: 0.10, yf: 0.20 },
    { id: 'B', label: 'Arrival B', xf: 0.10, yf: 0.75 },
    { id: 'C', label: 'Arrival C', xf: 0.88, yf: 0.50 },
    { id: 'D', label: 'Arrival D', xf: 0.50, yf: 0.08 },
    { id: 'E', label: 'Arrival E', xf: 0.50, yf: 0.92 },
  ];
  const GATE_PRESETS = [
    { id: 1, label: 'Gate 1', xf: 0.30, yf: 0.12 },
    { id: 2, label: 'Gate 2', xf: 0.65, yf: 0.12 },
    { id: 3, label: 'Gate 3', xf: 0.30, yf: 0.88 },
    { id: 4, label: 'Gate 4', xf: 0.65, yf: 0.88 },
    { id: 5, label: 'Gate 5', xf: 0.48, yf: 0.50 },
    { id: 6, label: 'Gate 6', xf: 0.80, yf: 0.50 },
  ];

  const n = Demo.Settings ? Demo.Settings.arrivalCount : 3;
  const g = Demo.Settings ? Demo.Settings.gateCount    : 4;

  Demo.pickupZones = Array.from({ length: n }, function (_, i) {
    if (i < PICKUP_PRESETS.length) {
      const p = PICKUP_PRESETS[i];
      return { id: p.id, label: p.label, xf: p.xf, yf: p.yf, bags: [], hovered: false };
    }
    // Extra arrivals: evenly spaced on an outer ellipse
    const angle = (2 * Math.PI * i / n) - Math.PI / 2;
    const xf = Math.max(0.06, Math.min(0.94, 0.5 + 0.40 * Math.cos(angle)));
    const yf = Math.max(0.06, Math.min(0.94, 0.5 + 0.38 * Math.sin(angle)));
    const id  = String.fromCharCode(65 + i);
    return { id: id, label: 'Arrival ' + id, xf: xf, yf: yf, bags: [], hovered: false };
  });

  Demo.dropoffZones = Array.from({ length: g }, function (_, i) {
    if (i < GATE_PRESETS.length) {
      const p = GATE_PRESETS[i];
      return { id: p.id, label: p.label, xf: p.xf, yf: p.yf, hovered: false };
    }
    // Extra gates: evenly spaced on an inner ellipse
    const angle = (2 * Math.PI * i / g) - Math.PI / 2;
    const xf = Math.max(0.10, Math.min(0.90, 0.5 + 0.25 * Math.cos(angle)));
    const yf = Math.max(0.10, Math.min(0.90, 0.5 + 0.30 * Math.sin(angle)));
    const id  = i + 1;
    return { id: id, label: 'Gate ' + id, xf: xf, yf: yf, hovered: false };
  });
};

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
  const wz = Demo.waitingZone;
  wz.x = wz.xf * W;
  wz.y = wz.yf * H;
  wz.resolved = true;
};

Demo.drawZones = function (ctx) {
  const r = Demo.ZONE_RADIUS;

  // Pickup zones — dashed outline with chevron
  Demo.pickupZones.forEach(z => {
    ctx.save();
    ctx.shadowBlur = 0;
    ctx.textBaseline = 'alphabetic';
    ctx.strokeStyle = 'rgba(0,212,255,0.55)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.rect(z.x - r, z.y - r, r * 2, r * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (!Demo.Settings || Demo.Settings.showLabels) {
      // Chevron symbol
      ctx.fillStyle = 'rgba(0,212,255,0.7)';
      ctx.font = '11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('»', z.x, z.y - 4);

      // Label
      ctx.fillStyle = 'rgba(0,212,255,0.5)';
      ctx.font = '9px "Space Mono", monospace';
      ctx.fillText(z.label, z.x, z.y + 14);
    }
    ctx.restore();
  });

  // Dropoff gates — solid square, pulses on hover
  Demo.dropoffZones.forEach(z => {
    const glow = z.hovered ? 0.9 : 0.6;
    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.strokeStyle = `rgba(0,212,255,${glow})`;
    ctx.lineWidth = z.hovered ? 2 : 1.4;
    ctx.shadowBlur = z.hovered ? 18 : 0;
    ctx.shadowColor = 'rgba(0,212,255,0.8)';
    ctx.beginPath();
    ctx.rect(z.x - r, z.y - r, r * 2, r * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (!Demo.Settings || Demo.Settings.showLabels) {
      // Gate number
      ctx.fillStyle = `rgba(0,212,255,${glow})`;
      ctx.font = `bold 13px "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(z.id, z.x, z.y + 5);

      // Label
      ctx.fillStyle = `rgba(0,212,255,${glow * 0.75})`;
      ctx.font = '9px "Space Mono", monospace';
      ctx.fillText(z.label, z.x, z.y + 18);
    }
    ctx.restore();
  });
};

Demo.drawWaitingZone = function (ctx) {
  const wz = Demo.waitingZone;
  if (!wz.resolved) return;

  ctx.save();
  ctx.strokeStyle  = 'rgba(0,212,255,0.18)';
  ctx.lineWidth    = 1;
  ctx.setLineDash([3, 6]);
  ctx.shadowBlur   = 0;
  ctx.beginPath();
  ctx.arc(wz.x, wz.y, wz.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle    = 'rgba(0,212,255,0.18)';
  ctx.font         = '9px "Space Mono", monospace';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Standby', wz.x, wz.y);
  ctx.restore();
};
