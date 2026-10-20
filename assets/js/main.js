/* 나우리해운항공 랜딩페이지 — 애니메이션·스크롤 효과 (시안 v3과 동일) */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.getElementById('site-header');
  const bar = document.getElementById('progress-bar');
  let ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
      header.classList.toggle('scrolled', y > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // 현재 섹션 메뉴 표시
  const links = [...document.querySelectorAll('.nav a.nav-link')];
  if ('IntersectionObserver' in window) {
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'services', 'strengths', 'regions', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) so.observe(el); });
  }

  // CBM 카운터 (도식 루프에 맞춰 6초마다)
  const cbm = document.getElementById('cbm-count');
  if (cbm && !reduce) {
    const run = () => {
      const t0 = performance.now(), dur = 1600;
      const step = t => { const k = Math.min(1, (t - t0) / dur); cbm.textContent = (12.5 * (1 - Math.pow(1 - k, 3))).toFixed(1); if (k < 1) requestAnimationFrame(step); };
      setTimeout(() => requestAnimationFrame(step), 2100);
    };
    run(); setInterval(run, 6000);
  }

  // 스크롤 등장: 첫 화면 아래 요소에만 적용 (첫 화면은 그대로 보임)
  if (reduce || !('IntersectionObserver' in window)) return;
  const groups = ['.section-head', '.about .copy', '.facts .fact', '.svc', '.addons', '.strength', '.region', '.note', '.office', '#inquiry'];
  const vh = window.innerHeight;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  groups.forEach(sel => document.querySelectorAll(sel).forEach(el => {
    if (el.getBoundingClientRect().top < vh) return;
    const sibs = [...el.parentElement.children].filter(c => c.matches(sel));
    el.style.setProperty('--i', Math.max(0, sibs.indexOf(el)) % 6);
    el.classList.add('rv'); io.observe(el);
  }));
})();
