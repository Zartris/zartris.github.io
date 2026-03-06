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

  // Called by interaction.js when user clicks a gate.
  // Bypasses the auto-spawn capacity cap — picks the zone with the fewest
  // bags so a manual click almost always succeeds.
  spawnForGate(dropoffZone) {
    const zones = Demo.pickupZones.slice().sort((a, b) => a.bags.length - b.bags.length);
    if (!zones.length) return;
    const pickup = zones[0];
    const bag = new Demo.Bag(pickup, dropoffZone);
    pickup.bags.push(bag);
    Demo.stats.waiting++;
    Demo.dispatcher.tryAssign(bag);
  }
};

Demo.drawBags = function (ctx) {
  Demo.pickupZones.forEach(zone => {
    zone.bags.forEach((bag, i) => {
      // Show bag icon until the robot physically picks it up (AT_PICKUP dwell),
      // not just until it is assigned. DELIVERED bags are already removed from
      // the array by agent.js bags.shift(), so no need to check for that state.
      if (bag.state !== 'WAITING' && bag.state !== 'IN_TRANSIT') return;
      // Offset multiple waiting bags above the zone
      const bx = zone.x + (i - 1) * 12;
      const by = zone.y - Demo.ZONE_RADIUS - 10;

      // Dim the icon once a robot has been assigned (IN_TRANSIT)
      const assigned = bag.state === 'IN_TRANSIT';
      ctx.save();
      ctx.shadowBlur  = assigned ? 3 : 8;
      ctx.shadowColor = 'rgba(0,212,255,0.9)';
      ctx.fillStyle   = assigned ? 'rgba(0,212,255,0.35)' : 'rgba(0,212,255,0.85)';
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
