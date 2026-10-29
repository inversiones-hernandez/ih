const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const loans=require('../prestamos.js');
const examples=[['diario',5000,30,195],['diario',6000,30,230],['diario',10000,45,275],['diario',25000,45,690],['semanal',1000,13,115],['semanal',5000,10,700],['semanal',25000,13,2885],['quincenal',5000,8,1025],['quincenal',10000,4,3300],['quincenal',25000,5,7000]];
for(const [mode,p,n,q] of examples){const r=loans.calcular(mode,p,n);assert.equal(r.cuota,q);assert.equal(r.total,q*n);assert.equal(r.interes,q*n-p);}
for(const args of [['diario',1000,30],['diario',5000,24],['semanal',5000,8],['quincenal',5000,10],['quincenal',5500,4],['otro',5000,4],['diario',Infinity,30]])assert.equal(loans.calcular(...args),null);
let count=0;for(const [mode,plan] of Object.entries(loans.planes))for(const p of plan.capitales)for(const n of plan.plazos){const r=loans.calcular(mode,p,n);assert(Number.isInteger(r.cuota));assert.equal(r.total,r.cuota*n);assert.equal(r.total-r.monto,r.interes);assert(r.interes>0);count++;}
// Run the actual browser controller against select semantics, including deep-link restoration.
class El{constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.attrs={};this._value='';this.dataset={};this.classList={toggle(){}};}set value(v){this._value=this.tag==='select'&&!this.children.some(o=>o.value===String(v))?'':String(v);}get value(){return this._value;}replaceChildren(...nodes){this.children=nodes;this._value=nodes[0]?.value||'';}setAttribute(k,v){this.attrs[k]=v;}addEventListener(name,fn){this.listeners[name]=fn;}}
function browser(search=''){
 const ids={};for(const id of ['calcMonto','calcPlazo','calcMontoValor','resMonto','resTasa','resInteres','resCuotas','resCuotaValor','resFrecuencia','resTotal','calcSolicitud','calcAsesor'])ids[id]=new El(['calcMonto','calcPlazo'].includes(id)?'select':'div');
 const modes=['diario','semanal','quincenal'].map(mode=>{const e=new El('button');e.dataset.modalidad=mode;return e;});
 const context={window:{IHPrestamos:loans},document:{readyState:'complete',getElementById:id=>ids[id],querySelectorAll:()=>modes,createElement:tag=>new El(tag)},location:{search},URLSearchParams};vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../calculadora.js'),'utf8'),context);return{ids,modes};
}
const b=browser('?modalidad=semanal&monto=25000&plazo=13');assert.equal(b.ids.calcMonto.value,'25000');assert.equal(b.ids.calcPlazo.value,'13');assert.equal(b.ids.calcSolicitud.href,'solicitud.html?monto=25000&modalidad=semanal&plazo=13');assert(b.ids.resTotal.textContent.includes('37,505'));b.modes[0].listeners.click();assert.equal(b.ids.calcPlazo.value,'30');assert.equal(b.ids.calcMonto.value,'25000');assert.equal(b.ids.calcPlazo.children.length,2);assert.equal(b.modes[0].attrs['aria-pressed'],'true');
const low=browser('?modalidad=semanal&monto=1000&plazo=5');low.modes[0].listeners.click();assert.equal(low.ids.calcMonto.value,'5000');
const invalid=browser('?modalidad=diario&monto=1&plazo=24');assert.equal(invalid.ids.calcMonto.value,'5000');assert.equal(invalid.ids.calcPlazo.value,'4');
console.log('PASS: '+count+' planes, cuotas aprobadas, total exacto, rechazo de combinaciones no autorizadas, enlaces y cambios de modalidad.');
