/* nav + footer are inlined in each page; this script handles interactivity */
(function(){
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
    const isEn = (document.documentElement.getAttribute('data-lang') === 'en');
    const locale = isEn ? 'en-GB' : 'sr-RS';
    const t = d.toLocaleTimeString(locale,{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:'Europe/Belgrade'});
    const tail = isEn ? 'cars active' : 'vozila aktivna';
    const el = document.getElementById('foot-time');
    if (el) el.textContent = `Kragujevac · ${t} · ${tail}`;
  }
  setInterval(tick, 1000); tick();
  document.addEventListener('langchange', tick);
})();

// global form handler (used on usluge + kontakt)
const WEB3FORMS_KEY = 'a05da62e-48c2-4a57-8558-95f5017f2129';

async function submitForm(e){
  e.preventDefault();
  const f = e.target;
  const thanks = f.querySelector('.form-thanks');
  const btn = f.querySelector('button[type="submit"]');
  const isEn = (document.documentElement.getAttribute('data-lang') === 'en');

  let subject = isEn ? 'New message — Cool Taxi site' : 'Nova poruka — Cool Taxi sajt';
  if (f.classList.contains('hire-form'))            subject = isEn ? 'Driver application — Cool Taxi'  : 'Aplikacija za vozača — Cool Taxi';
  else if (f.classList.contains('cm-form'))         subject = isEn ? 'Contact message — Cool Taxi'      : 'Kontakt poruka — Cool Taxi';
  else if (f.classList.contains('request-form'))    subject = isEn ? 'Ride booking — Cool Taxi'         : 'Rezervacija vožnje — Cool Taxi';

  const data = new FormData(f);
  data.append('access_key', WEB3FORMS_KEY);
  data.append('subject', subject);
  data.append('from_name', 'Cool Taxi sajt');

  const originalBtnHTML = btn ? btn.innerHTML : '';
  if (btn) { btn.disabled = true; btn.innerHTML = isEn ? 'Sending…' : 'Slanje…'; }

  try {
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
    const json = await res.json();
    if (json.success) {
      if (thanks) thanks.classList.add('show');
      f.querySelectorAll('input, select, textarea').forEach(i => { if (i.type !== 'checkbox') i.value = ''; });
    } else {
      const fallback = isEn ? 'please try again.' : 'pokušajte ponovo.';
      const prefix   = isEn ? 'Send error: '     : 'Greška pri slanju: ';
      alert(prefix + (json.message || fallback));
    }
  } catch (err) {
    alert(isEn ? 'Network error. Please try again or give us a call directly.' : 'Greška u mreži. Pokušajte ponovo ili nas pozovite direktno.');
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

  const isEn = (document.documentElement.getAttribute('data-lang') === 'en');
  const lbLabels = isEn
    ? { close: 'Close', prev: 'Previous', next: 'Next' }
    : { close: 'Zatvori', prev: 'Prethodna', next: 'Sledeća' };
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="${lbLabels.close}">×</button>
    <button class="lightbox-prev" aria-label="${lbLabels.prev}">‹</button>
    <button class="lightbox-next" aria-label="${lbLabels.next}">›</button>
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
