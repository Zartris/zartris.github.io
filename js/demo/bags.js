/* ─────────────────────────────────────
   DEMO — BAGS
   Bag lifecycle: WAITING → IN_TRANSIT → DELIVERED
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
    return 4000 + Math.random() * 2000; // 4–6 seconds
  }

  update(dt) {
    this._elapsed += dt;
    if (this._elapsed >= this._nextSpawn) {
      this._elapsed   = 0;
      this._nextSpawn = this._randomInterval();
      this._spawnBag();
    }
  }

  _spawnBag(forcedDropoff) {
    const available = Demo.pickupZones.filter(
      z => z.bags.length < Demo.BAG_MAX_PER_ZONE
    );
    if (available.length === 0) return null;

    const pickup  = available[Math.floor(Math.random() * available.length)];
    const dropoff = forcedDropoff ||
      Demo.dropoffZones[Math.floor(Math.random() * Demo.dropoffZones.length)];

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
      // Offset multiple waiting bags above the zone
      const bx = zone.x + (i - 1) * 12;
      const by = zone.y - Demo.ZONE_RADIUS - 10;

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
      ctx.restore();
    });
  });
};
