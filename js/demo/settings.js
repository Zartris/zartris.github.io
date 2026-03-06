/* ─────────────────────────────────────
   DEMO — SETTINGS
   Drawer UI + shared settings object.
   All demo modules read from Demo.Settings
   instead of using hardcoded constants.
───────────────────────────────────── */
window.Demo = window.Demo || {};

Demo.Settings = {
  // Fleet
  agentCount:      12,    // 4–24
  agentSpeed:      1.0,   // 0.5–2.0 multiplier
  trailLength:     22,    // 5–40 frames
  edgeDist:        175,   // 50–300 px

  // Zones
  arrivalCount:    3,     // 1–5
  gateCount:       4,     // 1–6
  showWaitingZone: true,
  showLabels:      true,

  // Bags
  spawnInterval:   5,     // 2–12 seconds
  maxBagsPerZone:  3,     // 1–8

  // Dispatcher
  dispatchMode:   'greedy',  // 'greedy' | 'random'

  // Internal — set to true to trigger a full re-init in demo.js
  _reinitNeeded:  false,
};

Demo.initSettings = function (containerEl) {
  // --- Build drawer HTML ---
  const drawer = document.createElement('div');
  drawer.className = 'demo-settings';
  drawer.id = 'demoSettings';
  drawer.innerHTML = `
    <button class="demo-settings-tab" id="demoSettingsTab" aria-label="Toggle settings">&gt;&gt;</button>
    <div class="demo-settings-panel">
      <p class="demo-settings-title">Settings</p>

      <div class="demo-settings-section">Fleet</div>

      <label class="demo-settings-row">
        <span class="demo-settings-label">Agents <span class="demo-settings-val" id="val-agentCount">12</span></span>
        <input type="range" id="set-agentCount" min="4" max="24" step="1" value="12">
      </label>

      <label class="demo-settings-row">
        <span class="demo-settings-label">Speed <span class="demo-settings-val" id="val-agentSpeed">1.0&#215;</span></span>
        <input type="range" id="set-agentSpeed" min="0.5" max="2.0" step="0.1" value="1.0">
      </label>

      <label class="demo-settings-row">
        <span class="demo-settings-label">Trail <span class="demo-settings-val" id="val-trailLength">22</span></span>
        <input type="range" id="set-trailLength" min="5" max="40" step="1" value="22">
      </label>

      <label class="demo-settings-row">
        <span class="demo-settings-label">Comm. range <span class="demo-settings-val" id="val-edgeDist">175</span></span>
        <input type="range" id="set-edgeDist" min="50" max="300" step="10" value="175">
      </label>

      <div class="demo-settings-section">Zones</div>

      <label class="demo-settings-row">
        <span class="demo-settings-label">Arrivals <span class="demo-settings-val" id="val-arrivalCount">3</span></span>
        <input type="range" id="set-arrivalCount" min="1" max="5" step="1" value="3">
      </label>

      <label class="demo-settings-row">
        <span class="demo-settings-label">Gates <span class="demo-settings-val" id="val-gateCount">4</span></span>
        <input type="range" id="set-gateCount" min="1" max="6" step="1" value="4">
      </label>

      <label class="demo-settings-row demo-settings-toggle-row">
        <span class="demo-settings-label">Waiting zone</span>
        <span class="demo-settings-toggle" id="set-showWaitingZone" data-on="true">ON</span>
      </label>

      <label class="demo-settings-row demo-settings-toggle-row">
        <span class="demo-settings-label">Labels</span>
        <span class="demo-settings-toggle" id="set-showLabels" data-on="true">ON</span>
      </label>

      <div class="demo-settings-section">Bags</div>

      <label class="demo-settings-row">
        <span class="demo-settings-label">Spawn every <span class="demo-settings-val" id="val-spawnInterval">5s</span></span>
        <input type="range" id="set-spawnInterval" min="2" max="12" step="1" value="5">
      </label>

      <label class="demo-settings-row">
        <span class="demo-settings-label">Max per zone <span class="demo-settings-val" id="val-maxBagsPerZone">3</span></span>
        <input type="range" id="set-maxBagsPerZone" min="1" max="8" step="1" value="3">
      </label>

      <div class="demo-settings-section">Dispatcher</div>

      <label class="demo-settings-row demo-settings-toggle-row">
        <span class="demo-settings-label">Mode</span>
        <span class="demo-settings-toggle" id="set-dispatchMode" data-on="true">Greedy</span>
      </label>

    </div>
  `;

  containerEl.appendChild(drawer);

  // --- Tab toggle ---
  const tab   = drawer.querySelector('#demoSettingsTab');
  const panel = drawer.querySelector('.demo-settings-panel');
  // Start closed — panel is inert so hidden inputs can't steal keyboard focus
  panel.inert = true;
  tab.addEventListener('click', function () {
    const isOpen = drawer.classList.toggle('open');
    tab.textContent = isOpen ? '<<' : '>>';
    panel.inert = !isOpen;
  });

  // --- Slider helpers ---
  function bindSlider(id, key, fmt, reinit) {
    const input = drawer.querySelector('#set-' + id);
    const val   = drawer.querySelector('#val-' + id);

    input.addEventListener('input', function () {
      Demo.Settings[key] = parseFloat(this.value);
      val.textContent = fmt(parseFloat(this.value));
      if (reinit) Demo.Settings._reinitNeeded = true;
    });

    // Click the value label to type any number (can exceed slider range)
    val.title = 'Click to type a custom value';
    val.addEventListener('click', function (e) {
      e.preventDefault();
      const ed = document.createElement('input');
      ed.type      = 'number';
      ed.value     = Demo.Settings[key];
      ed.className = 'demo-settings-val-edit';
      val.replaceWith(ed);
      ed.focus();
      ed.select();

      function commit() {
        const n = parseFloat(ed.value);
        if (!isNaN(n)) {
          Demo.Settings[key] = n;
          // Nudge slider to its nearest in-range position
          input.value = Math.min(Math.max(n, parseFloat(input.min)), parseFloat(input.max));
          val.textContent = fmt(n);
          if (reinit) Demo.Settings._reinitNeeded = true;
        } else {
          val.textContent = fmt(Demo.Settings[key]);
        }
        ed.replaceWith(val);
      }

      ed.addEventListener('blur', commit);
      ed.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter')  { ev.preventDefault(); commit(); }
        if (ev.key === 'Escape') { ed.replaceWith(val); }
      });
    });
  }

  function bindToggle(id, key, labels, reinit) {
    const el = drawer.querySelector('#set-' + id);
    el.addEventListener('click', function () {
      const on = this.dataset.on === 'true';
      this.dataset.on = String(!on);
      Demo.Settings[key] = !on;
      this.textContent = labels[on ? 1 : 0]; // toggled
      if (reinit) Demo.Settings._reinitNeeded = true;
    });
  }

  // Fleet
  bindSlider('agentCount',  'agentCount',  v => v,           true);
  bindSlider('agentSpeed',  'agentSpeed',  v => v.toFixed(1) + '\u00d7', false);
  bindSlider('trailLength', 'trailLength', v => v,           false);
  bindSlider('edgeDist',    'edgeDist',    v => v,           false);

  // Zones
  bindSlider('arrivalCount', 'arrivalCount', v => v, true);
  bindSlider('gateCount',    'gateCount',    v => v, true);
  bindToggle('showWaitingZone', 'showWaitingZone', ['ON', 'OFF'], false);
  bindToggle('showLabels',      'showLabels',      ['ON', 'OFF'], false);

  // Bags
  bindSlider('spawnInterval',   'spawnInterval',   v => v + 's', false);
  bindSlider('maxBagsPerZone',  'maxBagsPerZone',  v => v,       false);

  // Dispatcher — use a dedicated listener (not bindToggle) so the value stays a string
  const dm = drawer.querySelector('#set-dispatchMode');
  dm.addEventListener('click', function () {
    // Override: value is a string, not boolean
    const cur = Demo.Settings.dispatchMode;
    Demo.Settings.dispatchMode = cur === 'greedy' ? 'random' : 'greedy';
    this.dataset.on  = String(Demo.Settings.dispatchMode === 'greedy');
    this.textContent = Demo.Settings.dispatchMode === 'greedy' ? 'Greedy' : 'Random';
  }, true); // capture — fires before the bindToggle listener
};
