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

