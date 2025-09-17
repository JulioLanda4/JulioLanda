(function(){
  const OWNER = (document.body && document.body.dataset && document.body.dataset.githubOwner) || 'JulioLanda4';
  function hasSiteButton(container, repoName){
    if (container.querySelector('.site-link')) return true;
    const anchors = container.querySelectorAll('a');
    const ghPagesPattern = repoName ? new RegExp(`^https?://[^/]+\\.github\\.io/${repoName}/?`, 'i') : null;
    for (const a of anchors){
      const t = (a.textContent || '').trim().toLowerCase();
      const href = (a.getAttribute('href') || '').trim();
      if (t === 'sitio' || t === 'demo' || t === 'website') return true;
      if (ghPagesPattern && ghPagesPattern.test(href)) return true;
    }
    return false;
  }
  function addSiteButton(container, url){
    const a = document.createElement('a');
    a.className = 'btn btn-sm btn-success site-link';
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = 'Sitio';
    container.prepend(a);
  }
  async function enhance(el){
    const h3 = el.querySelector('h3');
    const links = el.querySelector('.links');
    if (!h3 || !links || el.classList.contains('private')) return;
    if (hasSiteButton(links)) return;
    const repoName = (h3.textContent || '').trim();
    if (!repoName) return;
    if (hasSiteButton(links, repoName)) return;
    const repo = OWNER + '/' + repoName;
    try {
      const res = await fetch('https://api.github.com/repos/' + repo, { headers: { 'Accept': 'application/vnd.github+json' }});
      if (!res.ok) return;
      const data = await res.json();
      let site = (data.homepage || '').trim();
      if (!site && data.has_pages) { site = `https://${OWNER}.github.io/${repoName}/`; }
      if (site) addSiteButton(links, site);
    } catch(e) { /* noop */ }
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.project-card').forEach(enhance);

    // Mini zoom popover for project images (positioned over the image)
    const imgs = Array.from(document.querySelectorAll('.project-media'));
    if (imgs.length) {
      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay mini';
      const closeBtn = document.createElement('button');
      closeBtn.className = 'lb-close';
      closeBtn.setAttribute('aria-label', 'Cerrar');
      closeBtn.textContent = '×';
      const big = document.createElement('img');
      big.style.position = 'fixed';
      overlay.appendChild(closeBtn);
      overlay.appendChild(big);
      document.body.appendChild(overlay);

      const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
      const showAt = (img) => {
        const r = img.getBoundingClientRect();
        const maxW = Math.min(520, Math.max(r.width * 1.5, 300));
        const maxH = 520;
        big.src = img.getAttribute('src');
        // Center popover over the thumbnail
        const left = clamp(r.left + r.width/2 - maxW/2, 12, innerWidth - maxW - 12);
        const top = clamp(r.top + r.height/2 - maxH/2, 12, innerHeight - maxH - 12);
        big.style.left = left + 'px';
        big.style.top = top + 'px';
        big.style.maxWidth = maxW + 'px';
        big.style.maxHeight = maxH + 'px';
        overlay.classList.add('show');
      };
      const hide = () => {
        overlay.classList.remove('show');
        setTimeout(() => { big.removeAttribute('src'); }, 150);
      };
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lb-close')) hide();
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
      imgs.forEach(img => img.addEventListener('click', () => showAt(img)));
    }
  });
})();
