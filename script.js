const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
  if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 600);
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}

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

// Cierra el menú móvil si se hace clic fuera de él
document.addEventListener("click", (e) => {
  const clickedInsideNav = navLinks.contains(e.target) || menuBtn.contains(e.target);
  if (!clickedInsideNav && navLinks.classList.contains("active")) {
    navLinks.classList.remove("active");
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

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
  }, {
    threshold: 0.14
  });

  revealElements.forEach(element => revealOnScroll.observe(element));
}

// ACORDEÓN DE PREGUNTAS FRECUENTES
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    // Cierra los demás (acordeón de una sola pregunta abierta a la vez)
    faqItems.forEach(other => {
      other.classList.remove("open");
      other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

// CALCULADORA DE PRÉSTAMO — Método ALEMÁN / INSOLUTO (estimación ilustrativa)
// El sistema alemán amortiza capital fijo cada período; el interés se calcula
// sobre el saldo pendiente, así que la cuota baja en cada período.
//
// ⚠️ Tasas de ejemplo. Antes de publicar, confirma que cumplen con la normativa de
// tasas de interés vigente en República Dominicana (recomendado: revisión legal).
const FRECUENCIAS = {
  diario:    { nombre: "día",      nombrePlural: "días",      tasa: 0.025, min: 30, max: 120, step: 1, porDefecto: 30 },
  semanal:   { nombre: "semana",   nombrePlural: "semanas",   tasa: 0.10,  min: 8, max: 24, step: 1, porDefecto: 8  },
  quincenal: { nombre: "quincena", nombrePlural: "quincenas", tasa: 0.15,  min: 4, max: 12, step: 1, porDefecto: 4  }
};

const freqRadios = document.querySelectorAll('input[name="frecuencia"]');
const calcAmount = document.getElementById("calcAmount");
const calcPeriodos = document.getElementById("calcPeriodos");
const calcAmountValue = document.getElementById("calcAmountValue");
const calcPeriodosLabel = document.getElementById("calcPeriodosLabel");
const calcPeriodosValue = document.getElementById("calcPeriodosValue");
const calcPrimera = document.getElementById("calcPrimera");
const calcUltima = document.getElementById("calcUltima");
const calcTotal = document.getElementById("calcTotal");
const calcNote = document.getElementById("calcNote");

function formatRD(n) {
  return "RD$ " + n.toLocaleString("es-DO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function frecuenciaActual() {
  const seleccionado = document.querySelector('input[name="frecuencia"]:checked');
  return seleccionado ? seleccionado.value : "quincenal";
}

// Ajusta el rango del control de períodos según la frecuencia elegida
function ajustarRangoPeriodos(frecKey, resetearValor) {
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
  const TASA = cfg.tasa;

  const monto = Number(calcAmount.value);
  const periodos = Number(calcPeriodos.value);

  // Amortización de capital fija por período (sistema alemán)
  const amortizacionCapital = monto / periodos;

  // Primera cuota: interés sobre el monto completo + capital fijo
  const interesPrimera = monto * TASA;
  const primeraCuota = amortizacionCapital + interesPrimera;

  // Última cuota: interés solo sobre el saldo restante (una amortización) + capital fijo
  const saldoUltima = amortizacionCapital;
  const interesUltima = saldoUltima * TASA;
  const ultimaCuota = amortizacionCapital + interesUltima;

  // Total a pagar: recorre cada período sumando el interés sobre el saldo pendiente
  let totalIntereses = 0;
  let saldo = monto;
  for (let i = 0; i < periodos; i++) {
    totalIntereses += saldo * TASA;
    saldo -= amortizacionCapital;
  }
  const totalPagar = monto + totalIntereses;

  calcAmountValue.textContent = formatRD(monto);
  calcPeriodosValue.textContent = periodos + " " + (periodos === 1 ? cfg.nombre : cfg.nombrePlural);
  calcPrimera.textContent = formatRD(primeraCuota);
  calcUltima.textContent = formatRD(ultimaCuota);
  calcTotal.textContent = formatRD(totalPagar);
  calcNote.textContent = "Las cuotas bajan en cada " + cfg.nombre + ".";
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