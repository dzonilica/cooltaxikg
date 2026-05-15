/* shared nav + footer injection (data-active="page-id") */
(function(){
  const active = document.body.dataset.page || '';
  const navHTML = `
  <header class="nav" id="nav">
    <a class="brand" href="/" aria-label="Cool Taxi">
      <img src="assets/logo.webp" alt="Cool Taxi" class="brand-logo" width="358" height="175" decoding="async">
    </a>
    <nav class="nav-links">
      <a href="/" data-p="home">Početna</a>
      <a href="/o-nama" data-p="about">O nama</a>
      <a href="/usluge" data-p="services">Usluge</a>
      <a href="/aplikacija" data-p="app">Aplikacija</a>
      <a href="/kontakt" data-p="contact">Kontakt</a>
    </nav>
    <a href="tel:034200555" class="nav-cta">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      034 200 555
    </a>
    <button class="nav-burger" id="burger" aria-label="Meni">
      <span></span><span></span><span></span>
    </button>
  </header>`;

  const footHTML = `
  <footer class="foot">
    <div class="foot-top">
      <div class="foot-brand">
        <img src="assets/logo.webp" alt="Cool Taxi" class="brand-logo big" width="358" height="175" loading="lazy" decoding="async">
        <p>Najveća taksi flota u Kragujevcu. Od 2016.</p>
      </div>
      <div class="foot-cols">
        <div>
          <h4 class="foot-col-h">Usluge</h4>
          <a href="/usluge">Gradske vožnje</a>
          <a href="/usluge">Međugradske</a>
          <a href="/usluge">Inostrane</a>
          <a href="/usluge">Ugovori sa firmama</a>
          <a href="/usluge">Reklamiranje</a>
        </div>
        <div>
          <h4 class="foot-col-h">Cool Taxi</h4>
          <a href="/o-nama">O nama</a>
          <a href="/aplikacija">Aplikacija</a>
          <a href="/kontakt">Kontakt</a>
          <a href="/usluge#zahtev">Pošalji upit</a>
        </div>
        <div>
          <h4 class="foot-col-h">Kontakt</h4>
          <a href="tel:034200555">034 200 555</a>
          <a href="https://wa.me/381695200555">069 5200 555</a>
          <a href="mailto:taxicool034@gmail.com">taxicool034@gmail.com</a>
        </div>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2016—2026 Cool Taxi · Sva prava zadržava Cool Taxi</span>
      <span class="foot-time" id="foot-time">— : —</span>
    </div>
    <div class="foot-watermark">COOLTAXI</div>
  </footer>
  <a href="tel:034200555" class="fab" aria-label="Pozovi 034 200 555">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    <span class="fab-pulse"></span>
  </a>`;

  const navMount = document.getElementById('site-nav');
  const footMount = document.getElementById('site-foot');
  if (navMount) navMount.outerHTML = navHTML;
  if (footMount) footMount.outerHTML = footHTML;

  // mark active nav
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.dataset.p === active) a.classList.add('active');
  });

  // nav scroll bg — IntersectionObserver avoids layout reads on scroll
  const nav = document.getElementById('nav');
  if (nav) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:20px;left:0;width:1px;height:1px;pointer-events:none';
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.prepend(sentinel);
    new IntersectionObserver(([e]) => {
      nav.classList.toggle('scrolled', !e.isIntersecting);
    }, { rootMargin: '0px', threshold: 0 }).observe(sentinel);
  }

  // burger
  const burger = document.getElementById('burger');
  const links = document.querySelector('.nav-links');
  if (burger) burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
  });

  // reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('h2, h3.reveal-h, .srv, .ccard, .value, .fleet-card, .qr-card, .terminal, .hero-stats, .app-feats > div, .timeline-step, .price-row, .team-card, .fleet-tile').forEach(el => {
    el.classList.add('reveal'); io.observe(el);
  });

  // footer time
  function tick(){
    const d = new Date();
    const t = d.toLocaleTimeString('sr-RS',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'Europe/Belgrade'});
    const el = document.getElementById('foot-time');
    if (el) el.textContent = `Kragujevac · ${t} · vozila aktivna`;
  }
  setInterval(tick, 1000); tick();
})();

// global form handler (used on usluge + kontakt)
const WEB3FORMS_KEY = 'a05da62e-48c2-4a57-8558-95f5017f2129';

async function submitForm(e){
  e.preventDefault();
  const f = e.target;
  const thanks = f.querySelector('.form-thanks');
  const btn = f.querySelector('button[type="submit"]');

  let subject = 'Nova poruka — Cool Taxi sajt';
  if (f.classList.contains('hire-form'))            subject = 'Aplikacija za vozača — Cool Taxi';
  else if (f.classList.contains('cm-form'))         subject = 'Kontakt poruka — Cool Taxi';
  else if (f.classList.contains('request-form'))    subject = 'Rezervacija vožnje — Cool Taxi';

  const data = new FormData(f);
  data.append('access_key', WEB3FORMS_KEY);
  data.append('subject', subject);
  data.append('from_name', 'Cool Taxi sajt');

  const originalBtnHTML = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = 'Slanje…'; }

  try {
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
    const json = await res.json();
    if (json.success) {
      if (thanks) thanks.classList.add('show');
      f.querySelectorAll('input, select, textarea').forEach(i => { if (i.type !== 'checkbox') i.value = ''; });
    } else {
      alert('Greška pri slanju: ' + (json.message || 'pokušajte ponovo.'));
    }
  } catch (err) {
    alert('Greška u mreži. Pokušajte ponovo ili nas pozovite direktno.');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = originalBtnHTML; }
  }

  return false;
}

/* Lightbox za galerije (o-nama .ag-tile, index .wcm-tile + .g-tile) */
(function(){
  const groupSelectors = ['.ag-tile', '.wcm-tile', '.g-tile'];
  const groups = groupSelectors
    .map(sel => Array.from(document.querySelectorAll(sel)))
    .filter(g => g.length);
  if (!groups.length) return;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Zatvori">×</button>
    <button class="lightbox-prev" aria-label="Prethodna">‹</button>
    <button class="lightbox-next" aria-label="Sledeća">›</button>
    <div class="lightbox-stage"><img class="lightbox-img" alt=""></div>
    <div class="lightbox-counter"></div>`;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('.lightbox-img');
  const lbCounter = lb.querySelector('.lightbox-counter');

  let activeImages = [];
  let idx = 0;

  function show(i){
    idx = (i + activeImages.length) % activeImages.length;
    lbImg.src = activeImages[idx].src;
    lbImg.alt = activeImages[idx].alt;
    lbCounter.textContent = `${idx + 1} / ${activeImages.length}`;
  }
  function open(images, i){
    activeImages = images;
    show(i);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  groups.forEach(tiles => {
    const images = tiles.map(t => {
      const img = t.querySelector('img');
      return { src: img ? img.src : '', alt: img ? img.alt : '' };
    });
    tiles.forEach((tile, i) => {
      tile.addEventListener('click', (e) => { e.preventDefault(); open(images, i); });
      tile.style.cursor = 'zoom-in';
    });
  });

  lb.querySelector('.lightbox-close').addEventListener('click', close);
  lb.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
  lb.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('lightbox-stage')) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

/* hero video — fade in when ready, drop on Data Saver to save bandwidth */
(function(){
  const v = document.querySelector('.hero-video-bg video');
  if (!v) return;

  const conn = navigator.connection || {};
  if (conn.saveData || (conn.effectiveType && /(^|-)2g$/.test(conn.effectiveType))) {
    v.removeAttribute('autoplay');
    v.removeAttribute('preload');
    const src = v.querySelector('source');
    if (src) src.removeAttribute('src');
    v.load();
    return;
  }

  if (v.readyState >= 3) {
    v.classList.add('is-ready');
  } else {
    v.addEventListener('canplay', () => v.classList.add('is-ready'), { once: true });
  }
  const tryPlay = () => v.play().catch(() => {});
  v.addEventListener('loadeddata', tryPlay, { once: true });
})();
