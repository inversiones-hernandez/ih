// ===== Calculadora de préstamos — Inversiones Hernández =====
// Tasas por periodo (se aplican de forma acumulativa sobre el saldo, cada periodo)
const TASAS = { diario: 0.02, semanal: 0.12, quincenal: 0.15 };
const PLAZOS = {
  diario:    { min: 30, max: 120, label: 'día',      labelPlural: 'días' },
  semanal:   { min: 8,  max: 24,  label: 'semana',   labelPlural: 'semanas' },
  quincenal: { min: 4,  max: 12,  label: 'quincena', labelPlural: 'quincenas' }
};
const MONTO_MIN = 5000;
const MONTO_MAX = 15000;

let estado = { modalidad: 'quincenal', monto: 10000, plazo: 8 };

function formatRD(n) {
  return 'RD$' + Math.round(n).toLocaleString('es-DO');
}

function calcularFrances(P, i, n) {
  const cuota = P * i / (1 - Math.pow(1 + i, -n));
  const total = cuota * n;
  return { cuota, total, interes: total - P };
}

function actualizarPlazoRange() {
  const rango = PLAZOS[estado.modalidad];
  const input = document.getElementById('calcPlazo');
  if (!input) return;
  input.min = rango.min;
  input.max = rango.max;
  if (estado.plazo < rango.min) estado.plazo = rango.min;
  if (estado.plazo > rango.max) estado.plazo = rango.max;
  input.value = estado.plazo;
  document.getElementById('calcPlazoValor').textContent = `${estado.plazo} ${estado.plazo === 1 ? rango.label : rango.labelPlural}`;
}

function render() {
  const i = TASAS[estado.modalidad];
  const n = estado.plazo;
  const P = estado.monto;

  document.getElementById('calcMontoValor').textContent = formatRD(P);

  const freqLabel = { diario: 'Diario', semanal: 'Semanal', quincenal: 'Quincenal' }[estado.modalidad];
  const cuotaFreq = { diario: 'por día', semanal: 'por semana', quincenal: 'por quincena' }[estado.modalidad];

  let resultado = calcularFrances(P, i, n);
  let cuotaTexto = `${formatRD(resultado.cuota)} ${cuotaFreq}`;

  document.getElementById('resMonto').textContent = formatRD(P);
  document.getElementById('resInteres').textContent = formatRD(resultado.interes);
  document.getElementById('resCuotas').textContent = n;
  document.getElementById('resCuotaValor').textContent = cuotaTexto;
  document.getElementById('resFrecuencia').textContent = freqLabel;
  document.getElementById('resTotal').textContent = formatRD(resultado.total);
}

function initCalculadora() {
  const montoInput = document.getElementById('calcMonto');
  const plazoInput = document.getElementById('calcPlazo');
  if (!montoInput || !plazoInput) return;

  montoInput.min = MONTO_MIN;
  montoInput.max = MONTO_MAX;
  montoInput.step = 500;
  montoInput.value = estado.monto;

  actualizarPlazoRange();

  montoInput.addEventListener('input', () => {
    estado.monto = parseInt(montoInput.value, 10);
    render();
  });

  plazoInput.addEventListener('input', () => {
    estado.plazo = parseInt(plazoInput.value, 10);
    document.getElementById('calcPlazoValor').textContent = `${estado.plazo} ${estado.plazo === 1 ? PLAZOS[estado.modalidad].label : PLAZOS[estado.modalidad].labelPlural}`;
    render();
  });

  document.querySelectorAll('[data-modalidad]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-modalidad]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      estado.modalidad = btn.dataset.modalidad;
      actualizarPlazoRange();
      render();
    });
  });

  render();
}

document.addEventListener('DOMContentLoaded', initCalculadora);
