const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const loans=require('../prestamos.js');
const examples=[['diario',3000,30,115],['diario',10000,30,385],['diario',10000,45,270],['diario',30000,45,815],['semanal',2000,8,325],['semanal',10000,8,1625],['semanal',30000,13,3435],['quincenal',1000,4,325],['quincenal',10000,4,3250],['quincenal',30000,10,5250]];
for(const [mode,p,n,q] of examples){const r=loans.calcular(mode,p,n);assert.equal(r.cuota,q);assert.equal(r.total,q*n);assert.equal(r.interes,q*n-p);}
for(const args of [['diario',1000,30],['diario',3000,45],['semanal',2000,10],['semanal',3000,13],['semanal',5000,5],['quincenal',1000,5],['quincenal',3000,10],['quincenal',5500,4],['otro',5000,4],['diario',Infinity,30]])assert.equal(loans.calcular(...args),null);
let count=0;for(const [mode,plan] of Object.entries(loans.planes))for(const p of plan.capitales)for(const n of plan.plazos){const r=loans.calcular(mode,p,n);if(!r)continue;assert(Number.isInteger(r.cuota));assert.equal(r.cuota%5,0);assert.equal(r.total,r.cuota*n);assert.equal(r.total-r.monto,r.interes);assert(r.interes>0);count++;}
assert.equal(count,107);
// Run the actual browser controller against select semantics, including deep-link restoration.
class El{constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.attrs={};this._value='';this.dataset={};this.classList={toggle(){}};}set value(v){this._value=this.tag==='select'&&!this.children.some(o=>o.value===String(v))?'':String(v);}get value(){return this._value;}replaceChildren(...nodes){this.children=nodes;this._value=nodes[0]?.value||'';}setAttribute(k,v){this.attrs[k]=v;}addEventListener(name,fn){this.listeners[name]=fn;}}
function browser(search=''){
 const ids={};for(const id of ['calcMonto','calcPlazo','calcMontoValor','resMonto','resTasa','resInteres','resCuotas','resCuotaValor','resFrecuencia','resTotal','calcSolicitud','calcAsesor'])ids[id]=new El(['calcMonto','calcPlazo'].includes(id)?'select':'div');
 const modes=['diario','semanal','quincenal'].map(mode=>{const e=new El('button');e.dataset.modalidad=mode;return e;});
 const context={window:{IHPrestamos:loans},document:{readyState:'complete',getElementById:id=>ids[id],querySelectorAll:()=>modes,querySelector:()=>null,createElement:tag=>new El(tag)},location:{search},URLSearchParams};vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../calculadora.js'),'utf8'),context);return{ids,modes};
}
const b=browser('?modalidad=semanal&monto=25000&plazo=13');assert.equal(b.ids.calcMonto.value,'25000');assert.equal(b.ids.calcPlazo.value,'13');assert.equal(b.ids.calcSolicitud.href,'solicitud.html?monto=25000&modalidad=semanal&plazo=13');assert(b.ids.resTotal.textContent.includes('37,180'));
b.modes[0].listeners.click();assert.equal(b.ids.calcPlazo.value,'30');assert.equal(b.ids.calcMonto.value,'25000');
const low=browser('?modalidad=semanal&monto=2000&plazo=8');assert.equal(low.ids.calcPlazo.children.length,1);low.modes[0].listeners.click();assert.equal(low.ids.calcMonto.value,'5000');
const limited=browser('?modalidad=diario&monto=3000&plazo=30');assert.equal(limited.ids.calcPlazo.children.length,1);
const q=browser('?modalidad=quincenal&monto=5000&plazo=10');q.ids.calcMonto.value='1000';q.ids.calcMonto.listeners.change();assert.equal(q.ids.calcPlazo.value,'4');assert.equal(q.ids.calcPlazo.children.length,1);assert(q.ids.resTotal.textContent.includes('1,300'));
q.ids.calcMonto.value='3000';q.ids.calcMonto.listeners.change();assert.equal(q.ids.calcPlazo.children.length,3);assert(!q.ids.calcPlazo.children.some(o=>o.value==='10'));
const invalid=browser('?modalidad=diario&monto=3000&plazo=45');assert.equal(invalid.ids.calcMonto.value,'5000');assert.equal(invalid.ids.calcPlazo.value,'4');
for(const [capital,cuota] of [[3000,115],[10000,385],[30000,1150]]){const d=browser('?modalidad=diario&monto='+capital+'&plazo=30');assert.equal(d.ids.calcMonto.value,String(capital));assert(d.ids.resCuotaValor.textContent.includes(cuota.toLocaleString('es-DO')));}
console.log('PASS: '+count+' combinaciones autorizadas, redondeos, selección por monto, plazos excluidos y totales compartidos.');
