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

// ===== Contact form: validation + WhatsApp handoff =====
const form = document.getElementById('contactForm');
if (form) {
  const status = form.querySelector('.form-status');

  const setFieldState = (fieldEl, valid) => {
    if (!fieldEl) return;
    fieldEl.classList.toggle('invalid', !valid);
  };

  const validateField = (input) => {
    const fieldEl = input.closest('.field');
    const valid = input.checkValidity();
    setFieldState(fieldEl, valid);
    return valid;
  };

  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.field.invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    let allValid = true;
    form.querySelectorAll('.field input, .field textarea').forEach((input) => {
      if (!validateField(input)) allValid = false;
    });

    const consent = form.querySelector('input[name="consentimiento"]');
    if (consent && !consent.checked) {
      allValid = false;
      if (status) {
        status.textContent = 'Debes autorizar el uso de tus datos para continuar.';
        status.className = 'form-status error';
      }
    }

    if (!allValid) {
      if (status && (!consent || consent.checked)) {
        status.textContent = 'Revisa los campos marcados antes de enviar.';
        status.className = 'form-status error';
      }
      return;
    }

    const nombre = form.nombre.value.trim();
    const mensaje = form.mensaje.value.trim();
    const texto = `Hola, mi nombre es ${nombre}. ${mensaje}`;

    if (status) {
      status.textContent = 'Abriendo WhatsApp para enviar tu mensaje…';
      status.className = 'form-status success';
    }

    window.open('https://wa.me/18495942190?text=' + encodeURIComponent(texto), '_blank');
  });
}