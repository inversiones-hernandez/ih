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
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
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
