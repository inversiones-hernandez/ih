// PRESENTACIÓN INICIAL: ejecutada antes de las funciones del sitio.
(() => {
  const layer = document.getElementById('welcomeIntro');
  const video = document.getElementById('welcomeIntroVideo');
  const skip = document.getElementById('welcomeIntroSkip');
  if (!layer || !video || !skip || layer.hidden) return;
  window.clearTimeout(window.ihIntroSafety);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const previousFocus = document.activeElement;
  const inertNodes = Array.from(document.body.children)
    .filter(el => el !== layer && !['SCRIPT', 'STYLE'].includes(el.tagName))
    .map(el => ({ el, inert: el.inert }));
  inertNodes.forEach(({el}) => { el.inert = true; });
  let closed = false;
  let started = false;
  let loadTimer;
  let stallTimer;
  let finalTimer;
  const finish = (immediate = false) => {
    if (closed) return;
    closed = true;
    [loadTimer, stallTimer, finalTimer].forEach(window.clearTimeout);
    video.pause();
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('pagehide', onPageHide);
    reduced.removeEventListener?.('change', onReduced);
    const reveal = () => {
      layer.hidden = true;
      document.documentElement.classList.remove('welcome-intro-active');
      inertNodes.forEach(({el, inert}) => { el.inert = inert; });
      if (previousFocus && previousFocus !== document.body && previousFocus.isConnected) {
        previousFocus.focus({preventScroll:true});
      } else {
        const target = document.querySelector('header a, main a, .hero a');
        target?.focus({preventScroll:true});
      }
    };
    if (immediate || reduced.matches) reveal();
    else {
      layer.classList.add('welcome-intro-leaving');
      window.setTimeout(reveal, 350);
    }
  };
  const onKey = event => {
    if (event.key === 'Escape') finish();
    // Mantener el teclado dentro del diálogo.
    if (event.key === 'Tab') { event.preventDefault(); skip.focus(); }
  };
  const onPageHide = () => finish(true);
  const onReduced = event => { if (event.matches) finish(true); };
  skip.addEventListener('click', () => finish());
  document.addEventListener('keydown', onKey);
  window.addEventListener('pagehide', onPageHide);
  reduced.addEventListener?.('change', onReduced);
  video.addEventListener('ended', () => finish());
  video.addEventListener('error', () => finish());
  video.querySelector('source')?.addEventListener('error', () => finish());
  video.addEventListener('playing', () => {
    if (closed) return;
    window.clearTimeout(loadTimer);
    window.clearTimeout(stallTimer);
    if (!started) {
      started = true;
      const remaining = Number.isFinite(video.duration) ? Math.max(0, video.duration - video.currentTime) : 60;
      finalTimer = window.setTimeout(() => finish(), Math.min(remaining + 5, 120) * 1000);
    }
  });
  const onStall = () => {
    window.clearTimeout(stallTimer);
    stallTimer = window.setTimeout(() => finish(), 6000);
  };
  video.addEventListener('waiting', onStall);
  video.addEventListener('stalled', onStall);
  skip.focus({preventScroll:true});
  loadTimer = window.setTimeout(() => finish(), 8000);
  video.muted = true;
  video.defaultMuted = true;
  try {
    const playback = video.play();
    playback?.catch(() => finish());
  } catch (error) { finish(); }
})();

// ===== Theme toggle (with persistence) =====
const toggle = document.getElementById('themeToggle');
const root = document.documentElement;
const THEME_KEY = 'ih-theme-preference';

function applyTheme(t) {
  root.setAttribute('data-theme', t);
  if (toggle) {
    const moon = toggle.querySelector('.icon-moon');
    const sun = toggle.querySelector('.icon-sun');
    if (moon && sun) {
      moon.style.display = t === 'dark' ? 'none' : 'block';
      sun.style.display = t === 'dark' ? 'block' : 'none';
    }
  }
}

let saved = null;
try { saved = window.localStorage.getItem(THEME_KEY); } catch (e) {}

if (!saved) {
  try {
    saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (e) {
    saved = 'light';
  }
}
applyTheme(saved);

if (toggle) {
  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { window.localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });
}

// ===== Scroll reveal =====
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ===== FAQ accordion =====
document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  if (!q) return;
  q.setAttribute('aria-expanded', 'false');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((i) => { i.classList.remove('open'); i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false'); });
    if (!isOpen) item.classList.add('open');
    q.setAttribute('aria-expanded', String(!isOpen));
  });
});

// ===== Menú móvil (hamburguesa) =====
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-is-open');
  };
  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-is-open', isOpen);
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Cerrar al elegir un enlace (navegación de una sola página con anclas)
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    if (navLinks.contains(e.target) || menuToggle.contains(e.target)) return;
    closeMenu();
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // Cerrar si la ventana vuelve a tamaño de escritorio
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });
}

// ===== Contact form: eliminado — la sección de Contacto ahora solo muestra
// información de contacto y el mapa (sin formulario). =====

// Resumen local: no envía valores al formulario externo ni implica aprobación.
const resumen = document.getElementById('solicitudResumen');
if (resumen) {
 const params = new URLSearchParams(location.search);
 const monto = Number(params.get('monto')), plazo = Number(params.get('plazo'));
 const modalidad = params.get('modalidad');
 const limites = {diario:[30,120], semanal:[8,24], quincenal:[4,12]};
 if (limites[modalidad] && monto >= 5000 && monto <= 15000 && monto % 500 === 0 && Number.isInteger(plazo) && plazo >= limites[modalidad][0] && plazo <= limites[modalidad][1]) {
  resumen.hidden = false;
  resumen.textContent = `Tu referencia: RD$${monto.toLocaleString('es-DO')} · modalidad ${modalidad} · ${plazo} cuotas. Indica estos valores al completar el formulario. Las condiciones finales están sujetas a evaluación.`;
 }
}

// INTRO: reproducción inicial, imagen fija y botón para repetir.

(() => {
  const video = document.getElementById("brandIntroVideo");
  const poster = document.getElementById("brandIntroPoster");
  const replay = document.getElementById("brandIntroReplay");

  if (!video || !poster || !replay) return;

  const reduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const showPoster = () => {
    video.pause();
    video.hidden = true;
    poster.hidden = false;
    replay.hidden = false;
  };

  const playIntro = () => {
    poster.hidden = false;
    video.hidden = true;
    replay.hidden = true;

    video.muted = true;
    video.currentTime = 0;

    const promise = video.play();

    if (promise && promise.catch) {
      promise.catch(showPoster);
    }
  };

  video.addEventListener("playing", () => {
    poster.hidden = true;
    video.hidden = false;
  });

  video.addEventListener("ended", showPoster);
  video.addEventListener("error", showPoster);

  replay.addEventListener("click", playIntro);

  // La presentación automática está en la pantalla inicial.
  // Esta sección queda disponible para repetirla manualmente.
  showPoster();

  reduced.addEventListener?.("change", (event) => {
    if (event.matches) {
      showPoster();
    }
  });
})();
