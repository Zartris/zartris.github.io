/* ─────────────────────────────────────
   DEMO — DISPATCHER
   Greedy: nearest idle agent gets
   the next unassigned waiting bag.
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.dispatcher = {
  agents: [], // populated by demo.js after agent init

  tryAssign(bag) {
    if (bag.state !== 'WAITING') return;

    const idle = this.agents.filter(a => a.isIdle);
    if (idle.length === 0) return;

    let chosen;
    const mode = Demo.Settings ? Demo.Settings.dispatchMode : 'greedy';
    if (mode === 'random') {
      chosen = idle[Math.floor(Math.random() * idle.length)];
    } else {
      // Greedy: nearest to pickup zone
      let bestDist = Infinity;
      for (const a of idle) {
        const d = Math.hypot(a.x - bag.pickup.x, a.y - bag.pickup.y);
        if (d < bestDist) { bestDist = d; chosen = a; }
      }
    }
    if (!chosen) return;

    bag.state = 'IN_TRANSIT';
    Demo.stats.waiting = Math.max(0, Demo.stats.waiting - 1);
    chosen.assignPickup(bag.pickup, bag.dropoff);
  },

  // Retry unassigned waiting bags each frame (agent may have freed up)
  tick() {
    Demo.pickupZones.forEach(zone => {
      zone.bags.forEach(bag => {
        if (bag.state === 'WAITING') this.tryAssign(bag);
      });
    });
  }
};
