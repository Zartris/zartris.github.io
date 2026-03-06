/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.13;
  ringY += (mouseY - ringY) * 0.13;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ─────────────────────────────────────────
   NAV — opacity on scroll
───────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ─────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─────────────────────────────────────────
   SKILL ROW BREAKOUT PANELS
───────────────────────────────────────── */
(function () {
  const PANELS = {
    mapf: {
      summary: 'Coordinating fleets of robots that need to reach goals without colliding — at scale, in real-time, without centralised control.',
      context: 'Core focus of my PhD. Three published papers, each tackling a different layer of the problem: predicting arrival times, planning paths probabilistically, and executing navigation without any communication between agents.',
      highlights: [
        '44% improvement in ETA prediction accuracy over A* baseline (CAMETA)',
        '28% reduction in path deviation with novel tracking factor (MAGIC)',
        'Communication-free collision avoidance outperforming ORCA, DRL-NAV and GA3C-CADRL (GIANT)',
      ],
      projects: [
        { name: 'GIANT', venue: 'IROS 2025', url: 'https://ieeexplore.ieee.org/abstract/document/11246312', desc: 'Attentive GNN + LiDAR fusion, fully decentralised, zero communication' },
        { name: 'MAGIC', venue: 'ICRA 2025', url: 'https://arxiv.org/abs/2502.20369', desc: 'Gaussian Belief Propagation with global path tracking factor' },
        { name: 'CAMETA', venue: 'IROS 2023', url: 'https://arxiv.org/abs/2503.00074', desc: 'Heterogeneous GNN for conflict-aware ETA prediction' },
      ],
      stack: ['Python', 'PyTorch', 'ROS2', 'C++', 'Graph Neural Networks', 'ORCA', 'Custom Gym Envs', 'NumPy'],
    },
    motion: {
      summary: 'Getting robots from A to B smoothly, safely, and in real-time — from factor-graph probabilistic inference to learned end-to-end policies.',
      context: "I've worked across the full spectrum: classical probabilistic planners, multi-agent RL policies, and model-predictive control for physical inspection tasks. Each approach has its domain — knowing which to reach for is half the work.",
      highlights: [
        'GBP planner with novel tracking factor — zero inter-robot collisions in structured environments',
        'MARL policy trained with noise injection for improved sim-to-real transfer',
        'Visual MPC for wind turbine blade inspection — improved surface coverage vs. traditional MPC',
      ],
      projects: [
        { name: 'MAGIC — GBP Planner', venue: 'ICRA 2025', url: 'https://arxiv.org/abs/2502.20369', desc: 'Gaussian Belief Propagation with global path integration' },
        { name: 'GIANT — MARL Policy', venue: 'IROS 2025', url: 'https://ieeexplore.ieee.org/abstract/document/11246312', desc: 'Decentralised multi-agent RL navigation' },
        { name: 'VT-NMPC', venue: 'ICAR 2023', url: 'https://arxiv.org/abs/2310.14030', desc: 'Visual tracking NMPC for autonomous wind turbine inspection' },
      ],
      stack: ['Python', 'PyTorch', 'ROS2', 'C++', 'Gaussian Belief Propagation', 'MARL', 'MPC', 'CasADi', 'Factor Graphs'],
    },
    simulation: {
      summary: 'Photorealistic simulation environments across domains — from underwater inspection to aerial robotics — that let algorithms train and validate before touching real hardware.',
      context: 'I build simulation environments from scratch: all geometry, lighting, sensor rigs, and robot models. UNav-Sim (underwater) is the most complete example, but the same approach applies across domains including aerial inspection of wind turbines.',
      highlights: [
        'Creator of UNav-Sim — photorealistic underwater simulator in UE5, adopted by labs worldwide',
        'Built all 4 environments and all robot models for the MIMIR-UW benchmark dataset',
        'Simulation environments span underwater, aerial, and multi-robot warehouse domains',
      ],
      projects: [
        { name: 'UNav-Sim', venue: 'ICAR 2023', url: 'https://arxiv.org/abs/2310.11927', desc: 'Open-source photorealistic underwater robotics simulator built in UE5' },
        { name: 'MIMIR-UW Dataset', venue: 'IROS 2023', url: 'https://ieeexplore.ieee.org/abstract/document/10341436', desc: 'Synthetic multi-purpose underwater navigation dataset' },
        { name: 'VT-NMPC Inspection', venue: 'ICAR 2023', url: 'https://arxiv.org/abs/2310.14030', desc: 'Simulation environment for autonomous wind turbine blade inspection' },
      ],
      stack: ['Unreal Engine 5', 'AirSim', 'ROS2', 'C++', 'Python', 'Docker', 'UE Blueprints'],
      youtube: '-yQBg-DsV8Q',
    },
    fusion: {
      summary: 'Combining noisy, asynchronous sensor streams into a coherent world model — fast enough for real-time decisions.',
      context: 'From 3D semantic exploration to vessel tracking from aerial footage, I have built perception and state-estimation pipelines across aerial, underwater, and surface robotics.',
      highlights: [
        'Real-time 3D volumetric-semantic mapping with uncertainty-aware sensor model (IROS 2021)',
        'Time-to-collision estimation from aerial images: ~0.36 s mean error, ~0.11 s std',
        'GPS + monocular visual fusion for harbour navigation assistance with UAVs',
      ],
      projects: [
        { name: 'Volumetric-Semantic Mapping', venue: 'IROS 2021', url: 'https://arxiv.org/abs/2109.01474', desc: '3D semantic exploration with uncertainty-aware next-best-view planning' },
        { name: 'Time-to-Collision from Aerial Images', venue: 'J. Imaging 2022', url: 'https://www.mdpi.com/2313-433X/8/3/62', desc: 'Real-time TTC estimation for vessel collision avoidance' },
        { name: 'Safe Vessel Navigation', venue: 'CASE 2021', url: 'https://ieeexplore.ieee.org/abstract/document/9551637', desc: 'UAV-assisted harbour navigation — GPS + vision fusion' },
      ],
      stack: ['Python', 'C++', 'ROS2', 'Kalman Filters', 'LiDAR', 'IMU', 'Stereo Vision', '3D Semantic Segmentation', 'PCL'],
      youtube: '5Li5iz0ZzcQ',
    },
    embedded: {
      summary: 'Hardware doesn\'t lie. Building systems that run on real chips, in real environments, with real constraints.',
      context: 'From student developer to production engineer — I have designed and deployed embedded systems throughout my career, from early HoloLens real-time visualisation to PX4 drone platforms and production robot hardware.',
      highlights: [
        'PX4-based UAV platforms configured and deployed for research inspection flights',
        'Custom STM32 firmware for real-time robot motor control',
        'HoloLens mixed-reality integration for 3D real-time system visualisation',
      ],
      projects: [
        { name: 'PX4 UAV Platforms', venue: 'Research', url: null, desc: 'Flight controller configurations for autonomous inspection drones' },
        { name: 'STM32 Motor Controllers', venue: 'Production', url: null, desc: 'Real-time embedded control firmware for robot hardware' },
        { name: 'HoloLens 3D Visualisation', venue: 'Production', url: null, desc: 'Mixed-reality real-time system visualisation for operations' },
      ],
      stack: ['C', 'C++', 'STM32', 'ESP32', 'PX4', 'FreeRTOS', 'ROS2', 'HoloLens', 'Unity', 'Python'],
    },
    vision: {
      summary: 'Perception pipelines that turn raw pixels into actionable information — detection, segmentation, tracking, and anomaly recognition.',
      context: 'Computer vision runs through most of my work. Published in IEEE Robotics and Automation Letters, two journals, and a book chapter. Applied across aerial, ground, and underwater domains.',
      highlights: [
        'GridNet published in IEEE Robotics and Automation Letters — image-agnostic anomaly detection',
        'Multi-vehicle tracking with rotated bounding boxes from monocular aerial footage',
        'Semantic segmentation pipelines for autonomous inspection and 3D mapping',
      ],
      projects: [
        { name: 'GridNet', venue: 'IEEE RA-L 2021', url: 'https://ieeexplore.ieee.org/abstract/document/9345954', desc: 'Image-agnostic anomaly detection for indoor surveillance' },
        { name: 'Vehicle Tracking', venue: 'J. Imaging 2021', url: 'https://www.mdpi.com/2313-433X/7/12/270', desc: 'Multi-vehicle localisation & tracking from monocular aerial images' },
        { name: 'Drone Racing Vision', venue: 'Book Chapter 2022', url: 'https://www.sciencedirect.com/science/chapter/edited-volume/abs/pii/B9780323857871000208', desc: 'Deep learning for vision-based autonomous drone racing' },
      ],
      stack: ['Python', 'PyTorch', 'OpenCV', 'CNNs', 'Semantic Segmentation', 'Object Detection', 'Rotated BBoxes', 'Feature Extraction'],
    },
  };

  function buildPanel(key) {
    const d = PANELS[key];
    if (!d) return null;

    const highlights = d.highlights.map(h => `<li>${h}</li>`).join('');
    const projects = d.projects.map(p => `
      <div class="sp-project">
        <div class="sp-venue">${p.venue}</div>
        <div class="sp-project-name">${p.url ? `<a href="${p.url}" target="_blank">${p.name} ↗</a>` : p.name}</div>
        <div class="sp-project-desc">${p.desc}</div>
      </div>`).join('');
    const stack = d.stack.map(t => `<span class="sp-stack-tag">${t}</span>`).join('');

    const mediaCol = d.youtube
      ? `<div class="sp-label">In action</div>
         <div class="sp-youtube">
           <iframe src="https://www.youtube.com/embed/${d.youtube}?autoplay=0&rel=0"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
             allowfullscreen loading="lazy"></iframe>
         </div>`
      : `<div class="sp-label">Tech Stack</div><div class="sp-stack">${stack}</div>`;

    const stackSection = d.youtube
      ? `<div class="sp-label" style="margin-top:20px;">Tech Stack</div><div class="sp-stack">${stack}</div>`
      : '';

    return `
      <div class="skill-panel-inner">
        <div class="sp-col">
          <div class="sp-label">Overview</div>
          <div class="sp-summary">${d.summary}</div>
          <div class="sp-context">${d.context}</div>
          <div class="sp-label">Key results</div>
          <ul class="sp-highlights">${highlights}</ul>
        </div>
        <div class="sp-col">
          <div class="sp-label">Work &amp; Publications</div>
          <div class="sp-projects">${projects}</div>
        </div>
        <div class="sp-col">
          ${mediaCol}
          ${stackSection}
        </div>
      </div>`;
  }

  const grid = document.getElementById('skillsGrid');
  if (!grid) return;

  const cards = [...grid.querySelectorAll('.skill-card')];

  // Insert panel placeholders after card index 2 and 5
  [2, 5].forEach(afterIdx => {
    const panel = document.createElement('div');
    panel.className = 'skill-panel';
    panel.dataset.row = afterIdx === 2 ? '0' : '1';
    cards[afterIdx].insertAdjacentElement('afterend', panel);
  });

  const panels = [...grid.querySelectorAll('.skill-panel')];
  let activeCard = null;

  function openPanel(panel, html) {
    panel.innerHTML = html;
    panel.classList.add('open');
    // Measure natural height with height:auto momentarily
    panel.style.height = 'auto';
    const h = panel.scrollHeight;
    panel.style.height = '0px';
    // Force reflow so browser registers the 0px before animating
    panel.offsetHeight;
    panel.style.height = h + 'px';
    setTimeout(() => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  }

  function closePanel(panel) {
    panel.style.height = panel.scrollHeight + 'px';
    panel.offsetHeight;
    panel.style.height = '0px';
    panel.classList.remove('open');
    panel.addEventListener('transitionend', () => {
      panel.innerHTML = '';
      panel.style.height = '';
    }, { once: true });
  }

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const row = idx < 3 ? 0 : 1;
      const panel = panels[row];
      const isSame = activeCard === card;

      if (activeCard) activeCard.classList.remove('active');
      activeCard = null;

      if (isSame) {
        closePanel(panel);
      } else {
        // Close other panel instantly if open, then open ours
        panels.forEach((p, i) => { if (i !== row && p.classList.contains('open')) closePanel(p); });
        openPanel(panel, buildPanel(card.dataset.skill));
        card.classList.add('active');
        activeCard = card;
      }
    });
  });
})();

/* ─────────────────────────────────────────
   VIDEO LIGHTBOX
───────────────────────────────────────── */
(function () {
  const modal      = document.getElementById('videoModal');
  const backdrop   = modal.querySelector('.modal-backdrop');
  const stage      = modal.querySelector('.modal-stage');
  const modalVideo = document.getElementById('modalVideo');
  const modalImg   = document.getElementById('modalImg');
  const captionEl  = document.getElementById('modalCaption');
  const closeBtn   = document.getElementById('modalClose');

  function getCaption(srcVideo) {
    // Giant grid: match label by video index
    const grid = srcVideo.closest('.giant-grid');
    if (grid) {
      const idx = [...grid.querySelectorAll('video')].indexOf(srcVideo);
      const labels = srcVideo.closest('.paper-visual')?.querySelectorAll('.giant-grid-labels span');
      if (labels?.[idx]) return labels[idx].textContent;
    }
    // AGBP: name by position
    const agbp = srcVideo.closest('.agbp-videos');
    if (agbp) {
      return agbp.querySelector('video:first-child') === srcVideo
        ? 'Baseline GBP — doorway'
        : 'Adaptive GBP with dynamic weights — doorway';
    }
    // Generic: nearest caption
    return srcVideo.closest('.paper-visual')?.querySelector('.paper-visual-caption')?.textContent ?? '';
  }

  function openModal(srcEl) {
    const isGif = srcEl.tagName === 'IMG';
    captionEl.textContent = isGif
      ? (srcEl.closest('.gif-cell')?.querySelector('.gif-label')?.textContent ?? srcEl.alt)
      : getCaption(srcEl);

    if (isGif) {
      modalImg.src = srcEl.src;
      modalImg.alt = srcEl.alt;
      modalImg.style.display = 'block';
      modalVideo.style.display = 'none';
    } else {
      const source = srcEl.querySelector('source');
      if (!source) return;
      modalVideo.src = source.src;
      modalVideo.currentTime = srcEl.currentTime || 0;
      modalVideo.style.display = 'block';
      modalImg.style.display = 'none';
    }

    // FLIP: start stage at source element's position & size
    const r   = srcEl.getBoundingClientRect();
    const sCX = r.left + r.width  / 2;
    const sCY = r.top  + r.height / 2;
    const dCX = window.innerWidth  / 2;
    const dCY = window.innerHeight / 2;
    const tx  = sCX - dCX;
    const ty  = sCY - dCY;
    const stageW = Math.min(window.innerWidth * 0.9, 1200);
    const sc  = r.width / stageW;

    // Snap to source position instantly
    stage.style.transition = 'none';
    stage.style.transform  = `translate(${tx}px, ${ty}px) scale(${sc})`;
    stage.style.opacity    = '0';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Force reflow, then animate to centre
    stage.offsetHeight;
    stage.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1), opacity .3s ease';
    stage.style.transform  = 'translate(0,0) scale(1)';
    stage.style.opacity    = '1';

    if (!isGif) modalVideo.play().catch(() => {});
  }

  function closeModal() {
    stage.style.transition = 'transform .28s ease, opacity .22s ease';
    stage.style.transform  = 'scale(0.92)';
    stage.style.opacity    = '0';
    backdrop.style.transition = 'opacity .28s ease';
    backdrop.style.opacity    = '0';

    setTimeout(() => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modalVideo.pause();
      modalVideo.src = '';
      modalImg.src = '';
      stage.style.cssText    = '';
      backdrop.style.cssText = '';
    }, 280);
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Attach to all videos
  document.querySelectorAll('video').forEach(v => {
    v.classList.add('video-clickable');
    v.addEventListener('click', () => openModal(v));
  });

  // Attach to GIF images in the MIMIR section
  document.querySelectorAll('.gif-cell img').forEach(img => {
    img.classList.add('video-clickable');
    img.addEventListener('click', () => openModal(img));
  });

  // Attach to figures in paper visuals
  document.querySelectorAll('.paper-visual img, .agbp-map img').forEach(img => {
    img.classList.add('video-clickable');
    img.addEventListener('click', () => openModal(img));
  });
})();

