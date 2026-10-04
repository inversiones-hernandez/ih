// ===== Calculadora de préstamos — Inversiones Hernández =====
// Tasas por periodo (se aplican de forma acumulativa sobre el saldo, cada periodo)
const TASAS = { diario: 0.009, semanal: 0.6, quincenal: 0.14 };
const PLAZOS = {
  diario:    { min: 30, max: 90, label: 'día',      labelPlural: 'días' },
  semanal:   { min: 8,  max: 16,  label: 'semana',   labelPlural: 'semanas' },
  quincenal: { min: 4,  max: 12,  label: 'quincena', labelPlural: 'quincenas' }
};
const MONTO_MIN = 5000;
const MONTO_MAX = 15000;

let estado = { modalidad: 'quincenal', monto: 5000, plazo: 4 };

function formatRD(n) {
  return 'RD$' + n.toLocaleString('es-DO', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function calcularFrances(P, i, n) {
  const cuota = i === 0 ? P / n : P * i / (1 - Math.pow(1 + i, -n));
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

  document.getElementById('resTasa').textContent = `${(i * 100).toLocaleString('es-DO')}% ${cuotaFreq}`;
  const params = new URLSearchParams({monto:String(P),modalidad:estado.modalidad,plazo:String(n)});
  document.getElementById('calcSolicitud').href = `solicitud.html?${params}`;
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
      document.querySelectorAll('[data-modalidad]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      estado.modalidad = btn.dataset.modalidad;
      actualizarPlazoRange();
      render();
    });
  });

  document.querySelectorAll('[data-modalidad]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modalidad === estado.modalidad)));
  render();
}

document.addEventListener('DOMContentLoaded', initCalculadora);
