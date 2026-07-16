const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");

const WHATSAPP_NUMBER = "18495942190";
const FORM_URL = "https://solicitud.prestamoscloud.com/solicitudes/i/inversioneshernandez";
const REQUEST_EMAIL_ENDPOINT = "https://formsubmit.co/ajax/gestion.inversioneshernandez@gmail.com";

window.addEventListener("scroll", () => {
  if (header) header.classList.toggle("scrolled", window.scrollY > 40);
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 600);
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuBtn.classList.toggle("active", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    const clickedInsideNav = navLinks.contains(e.target) || menuBtn.contains(e.target);
    if (!clickedInsideNav && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
}

const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach(element => element.classList.add("show"));
} else {
  const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealOnScroll.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealElements.forEach(element => revealOnScroll.observe(element));
}

// ACORDEÓN DE PREGUNTAS FRECUENTES
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");
  if (!question) return;

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    faqItems.forEach(other => {
      other.classList.remove("open");
      const otherQuestion = other.querySelector(".faq-question");
      if (otherQuestion) otherQuestion.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

// CALCULADORA DE PRÉSTAMO — Método francés / cuota fija (estimación ilustrativa)
const FRECUENCIAS = {
  diario:    { nombre: "día",      nombrePlural: "días",      tasa: 0.025, min: 30, max: 120, step: 1, porDefecto: 30 },
  semanal:   { nombre: "semana",   nombrePlural: "semanas",   tasa: 0.10,  min: 8,  max: 24,  step: 1, porDefecto: 8  },
  quincenal: { nombre: "quincena", nombrePlural: "quincenas", tasa: 0.15,  min: 4,  max: 12,  step: 1, porDefecto: 4  }
};

const freqRadios = document.querySelectorAll('input[name="frecuencia"]');
const calcAmount = document.getElementById("calcAmount");
const calcPeriodos = document.getElementById("calcPeriodos");
const calcAmountValue = document.getElementById("calcAmountValue");
const calcPeriodosLabel = document.getElementById("calcPeriodosLabel");
const calcPeriodosValue = document.getElementById("calcPeriodosValue");
const calcPrimera = document.getElementById("calcPrimera");
const calcTotal = document.getElementById("calcTotal");
const calcNote = document.getElementById("calcNote");
const calcWhatsApp = document.getElementById("calcWhatsApp");
const calcEmailStatus = document.getElementById("calcEmailStatus");

let solicitudCalculada = null;

function formatRD(n) {
  return "RD$ " + n.toLocaleString("es-DO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function frecuenciaActual() {
  const sel = document.querySelector('input[name="frecuencia"]:checked');
  return sel ? sel.value : "quincenal";
}

function ajustarRangoPeriodos(frecKey, resetearValor) {
  if (!calcPeriodos || !calcPeriodosLabel) return;
  const cfg = FRECUENCIAS[frecKey];
  calcPeriodos.min = cfg.min;
  calcPeriodos.max = cfg.max;
  calcPeriodos.step = cfg.step;

  const valorActual = Number(calcPeriodos.value);
  if (resetearValor || valorActual < cfg.min || valorActual > cfg.max) {
    calcPeriodos.value = cfg.porDefecto;
  }

  calcPeriodosLabel.textContent = "Cantidad de " + cfg.nombrePlural;
}

function updateCalculator() {
  if (!calcAmount || !calcPeriodos) return;

  const frecKey = frecuenciaActual();
  const cfg = FRECUENCIAS[frecKey];
  const tasa = cfg.tasa;
  const monto = Number(calcAmount.value);
  const periodos = Number(calcPeriodos.value);

  let cuotaFija;
  if (tasa === 0) {
    cuotaFija = monto / periodos;
  } else {
    const factor = Math.pow(1 + tasa, periodos);
    cuotaFija = monto * (tasa * factor) / (factor - 1);
  }

  const totalPagar = cuotaFija * periodos;
  const cuotaTexto = formatRD(cuotaFija);
  const totalTexto = formatRD(totalPagar);
  const montoTexto = formatRD(monto);
  const plazoTexto = periodos + " " + (periodos === 1 ? cfg.nombre : cfg.nombrePlural);
  const frecuenciaTexto = frecKey.charAt(0).toUpperCase() + frecKey.slice(1);

  solicitudCalculada = {
    monto: montoTexto,
    frecuencia: frecuenciaTexto,
    plazo: plazoTexto,
    cuota: cuotaTexto,
    total: totalTexto
  };

  if (calcAmountValue) calcAmountValue.textContent = montoTexto;
  if (calcPeriodosValue) calcPeriodosValue.textContent = plazoTexto;
  if (calcPrimera) calcPrimera.textContent = cuotaTexto;
  if (calcTotal) calcTotal.textContent = totalTexto;
  if (calcNote) calcNote.textContent = "Todas las cuotas son iguales durante el plazo.";

  if (calcWhatsApp) {
    const message = [
      "Hola, quiero solicitar un préstamo con Inversiones Hernández.",
      "",
      "Monto: " + montoTexto,
        "Frecuencia: " + frecuenciaTexto,
      "Plazo: " + plazoTexto,
      "Cuota estimada: " + cuotaTexto,
      "Total estimado: " + totalTexto,
      "",
      "Quiero confirmar los requisitos y condiciones finales."
    ].join("\n");

    calcWhatsApp.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }
}

async function enviarAvisoSolicitudPorCorreo() {
  if (!solicitudCalculada) return;

  if (calcEmailStatus) {
    calcEmailStatus.hidden = false;
    calcEmailStatus.textContent = "Enviando también el aviso al correo de Inversiones Hernández…";
  }

  const datos = new FormData();
  datos.append("_subject", "[SOLICITUD WEB] Nuevo cálculo - " + solicitudCalculada.monto);
  datos.append("_template", "table");
  datos.append("_captcha", "false");
  datos.append("Tipo", "Solicitud de préstamo desde la calculadora");
  datos.append("Monto solicitado", solicitudCalculada.monto);
  datos.append("Frecuencia", solicitudCalculada.frecuencia);
  datos.append("Plazo", solicitudCalculada.plazo);
  datos.append("Cuota estimada", solicitudCalculada.cuota);
  datos.append("Total estimado", solicitudCalculada.total);
  datos.append("Canal de contacto", "WhatsApp: +1 849-594-2190");
  datos.append("Página de origen", window.location.href);
  datos.append("Fecha y hora", new Intl.DateTimeFormat("es-DO", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Santo_Domingo"
  }).format(new Date()));

  try {
    const respuesta = await fetch(REQUEST_EMAIL_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: datos,
      keepalive: true
    });

    if (!respuesta.ok) throw new Error("No se pudo enviar el aviso por correo.");

    if (calcEmailStatus) {
      calcEmailStatus.textContent = "Listo: WhatsApp abierto y aviso enviado al correo.";
    }
  } catch (error) {
    console.error("Error al enviar la solicitud por correo:", error);

    if (calcEmailStatus) {
      calcEmailStatus.textContent = "WhatsApp se abrió correctamente. El aviso por correo no pudo confirmarse.";
    }
  }
}

if (calcWhatsApp) {
  calcWhatsApp.addEventListener("click", () => {
    void enviarAvisoSolicitudPorCorreo();
  });
}

if (calcAmount && calcPeriodos && freqRadios.length) {
  freqRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      ajustarRangoPeriodos(radio.value, true);
      updateCalculator();
    });
  });

  calcAmount.addEventListener("input", updateCalculator);
  calcPeriodos.addEventListener("input", updateCalculator);

  ajustarRangoPeriodos(frecuenciaActual(), false);
  updateCalculator();
}

// CARRUSEL COVERFLOW 3D
(function () {
  const track = document.getElementById("coverflowTrack");
  const dotsContainer = document.getElementById("cfDots");
  const btnPrev = document.getElementById("cfPrev");
  const btnNext = document.getElementById("cfNext");

  if (!track || !dotsContainer) return;

  const slides = Array.from(track.querySelectorAll(".cf-slide"));
  const total = slides.length;
  let current = 0;
  let autoTimer = null;
  let isDragging = false;
  let dragStartX = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "cf-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Ir al flyer " + (i + 1));
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getSlideWidth() {
    const slide = track.querySelector(".cf-slide");
    return slide ? slide.offsetWidth : 260;
  }

  function applyPositions() {
    const dots = dotsContainer.querySelectorAll(".cf-dot");
    const slideW = getSlideWidth();
    const gap = slideW * 0.62;

    slides.forEach((slide, i) => {
      const offset = i - current;
      const absOffset = Math.abs(offset);
      const visible = absOffset <= 2;
      const zIndex = visible ? 10 - absOffset : 0;
      const x = offset * gap;
      const rotateY = offset === 0 ? 0 : offset > 0 ? -42 : 42;
      const scale = offset === 0 ? 1 : absOffset === 1 ? 0.82 : 0.66;
      const opacity = offset === 0 ? 1 : absOffset === 1 ? 0.75 : absOffset === 2 ? 0.45 : 0;

      slide.style.transform = `translateX(${x}px) rotateY(${rotateY}deg) scale(${scale})`;
      slide.style.opacity = opacity;
      slide.style.zIndex = zIndex;
      slide.style.visibility = visible ? "visible" : "hidden";
      slide.style.pointerEvents = offset === 0 ? "auto" : "none";
      slide.style.boxShadow = offset === 0
        ? "0 30px 80px rgba(0,0,0,0.55), 0 0 0 2px rgba(91,157,255,0.4)"
        : "0 20px 50px rgba(0,0,0,0.3)";
    });

    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    applyPositions();
    resetAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    if (prefersReducedMotion || total <= 1) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4200);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  slides.forEach((slide, i) => {
    slide.addEventListener("click", () => {
      if (i !== current) goTo(i);
    });
  });

  if (btnPrev) btnPrev.addEventListener("click", prev);
  if (btnNext) btnNext.addEventListener("click", next);

  document.addEventListener("keydown", (e) => {
    const section = document.getElementById("promociones");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
  });

  track.addEventListener("touchstart", (e) => {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    clearInterval(autoTimer);
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = dragStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    else resetAuto();
  });

  track.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    clearInterval(autoTimer);
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    else resetAuto();
  });

  track.addEventListener("mouseenter", () => clearInterval(autoTimer));
  track.addEventListener("mouseleave", startAuto);
  window.addEventListener("resize", applyPositions);

  applyPositions();
  startAuto();
})();
