(function() {
  const scroller = document.getElementById('about-gallery');
  if (!scroller) return;
  scroller.classList.add('tilted');
  const items = Array.from(scroller.querySelectorAll('.gallery-item'));
  const wrapper = scroller.closest('.gallery-wrap') || scroller.parentElement;
  let isAuto = false;

  const scrollToIndex = (idx, duration = 420) => {
    idx = Math.max(0, Math.min(items.length - 1, idx));
    const el = items[idx];
    const left = el.offsetLeft + el.offsetWidth/2 - scroller.clientWidth/2;
    const start = scroller.scrollLeft;
    const delta = left - start;
    if (Math.abs(delta) < 1) return;
    const ease = (t) => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
    const t0 = performance.now();
    isAuto = true;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      scroller.scrollLeft = start + delta * ease(p);
      if (p < 1) requestAnimationFrame(step); else setTimeout(() => isAuto = false, 50);
    };
    requestAnimationFrame(step);
  };

  const centeredIndex = () => {
    const rect = scroller.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    let bestI = 0, bestD = Infinity;
    items.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - centerX);
      if (d < bestD) { bestD = d; bestI = i; }
    });
    return bestI;
  };

  const setActive = () => {
    const rect = scroller.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const maxAngle = 20;      // side tilt
    const yAmp = 30;          // vertical sag for sides
    const zAmp = 60;          // small depth
    const minScale = 0.9;     // no upscaling beyond 1.0

    let best = null, bestDist = Infinity;
    for (const el of items) {
      const r = el.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - centerX);
      if (d < bestDist) { bestDist = d; best = el; }
    }

    for (const el of items) {
      const r = el.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const dx = (c - centerX) / r.width; // distance in item widths
      const dir = Math.sign(dx) || 0;
      const adx = Math.min(Math.abs(dx), 2);
      const closeness = Math.max(0, 1 - Math.min(Math.abs(dx), 1));
      const angle = -dir * Math.min(maxAngle, Math.abs(dx) * maxAngle);
      const y = Math.min(yAmp, Math.abs(dx) * yAmp);
      const z = -(1 - closeness) * zAmp;
      const scale = minScale + closeness * (1 - minScale);
      const t = `translateY(${y}px) translateZ(${z}px) rotateY(${angle}deg) scale(${scale})`;
      el.style.setProperty('--t', t);
      el.style.opacity = String(0.55 + (closeness * 0.45));
      el.style.zIndex = String(1000 - Math.round(adx * 10));
      el.classList.toggle('is-center', el === best);
    }
  };

  const goBy = (dir) => scrollToIndex(centeredIndex() + dir);

  const leftBtn = wrapper ? wrapper.querySelector('.gallery-arrow.left') : null;
  const rightBtn = wrapper ? wrapper.querySelector('.gallery-arrow.right') : null;
  if (leftBtn) leftBtn.addEventListener('click', () => goBy(-1));
  if (rightBtn) rightBtn.addEventListener('click', () => goBy(1));

  scroller.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goBy(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goBy(1); }
  });
  scroller.tabIndex = 0;

  const throttle = (fn, ms) => {
    let running = false;
    return (...args) => {
      if (running) return;
      running = true;
      requestAnimationFrame(() => { fn(...args); setTimeout(() => running = false, ms); });
    };
  };

  const onScroll = throttle(() => {
    setActive();
    if (!isAuto) {
      clearTimeout(scroller.__snapTimer);
      scroller.__snapTimer = setTimeout(() => scrollToIndex(centeredIndex(), 360), 140);
    }
  }, 16);

  setActive();
  window.addEventListener('load', setActive);
  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', throttle(setActive, 16));
})();
