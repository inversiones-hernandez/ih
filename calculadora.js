(function(){
'use strict';
function iniciar(){
 const datos=window.IHPrestamos,monto=document.getElementById('calcMonto'),plazo=document.getElementById('calcPlazo');
 if(!datos||!monto||!plazo)return;
 const dinero=v=>'RD$'+v.toLocaleString('es-DO',{minimumFractionDigits:2,maximumFractionDigits:2});
 let modalidad='quincenal';
 function opciones(select,values,label){select.replaceChildren(...values.map(v=>{const o=document.createElement('option');o.value=String(v);o.textContent=label(v);return o;}));}
 function render(){
   const r=datos.calcular(modalidad,monto.value,plazo.value);if(!r)return;
   document.getElementById('calcMontoValor').textContent=dinero(r.monto);
   for(const [id,text] of Object.entries({resMonto:dinero(r.monto),resTasa:r.porcentajeTotal.toLocaleString('es-DO',{maximumFractionDigits:2})+'% del capital',resInteres:dinero(r.interes),resCuotas:String(r.plazo),resCuotaValor:dinero(r.cuota),resFrecuencia:datos.planes[modalidad].nombre,resTotal:dinero(r.total)}))document.getElementById(id).textContent=text;
   const params=new URLSearchParams({monto:String(r.monto),modalidad,plazo:String(r.plazo)});
   document.getElementById('calcSolicitud').href='solicitud.html?'+params;
   const mensaje='Hola, quiero información sobre un préstamo de '+dinero(r.monto)+', '+r.plazo+' pagos '+({diario:'diarios',semanal:'semanales',quincenal:'quincenales'}[modalidad])+' de '+dinero(r.cuota)+'. Total: '+dinero(r.total)+'.';
   document.getElementById('calcAsesor').href='https://wa.me/18495942190?text='+encodeURIComponent(mensaje);
 }
 function seleccionar(mode){
   if(!Object.hasOwn(datos.planes,mode))return;
   modalidad=mode;const plan=datos.planes[mode],oldMonto=Number(monto.value),oldPlazo=Number(plazo.value);
   opciones(monto,plan.capitales,dinero);monto.value=String(plan.capitales.includes(oldMonto)?oldMonto:5000);
   opciones(plazo,plan.plazos,n=>n+' pagos · '+n+' '+plan.unidad);plazo.value=String(plan.plazos.includes(oldPlazo)?oldPlazo:plan.plazos[0]);
   document.querySelectorAll('[data-modalidad]').forEach(b=>{const active=b.dataset.modalidad===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
   render();
 }
 const previo=datos.desdeParametros(new URLSearchParams(location.search));
 if(previo){modalidad=previo.modalidad;monto.value=String(previo.monto);plazo.value=String(previo.plazo);}
 document.querySelectorAll('[data-modalidad]').forEach(b=>b.addEventListener('click',()=>seleccionar(b.dataset.modalidad)));
 monto.addEventListener('change',render);plazo.addEventListener('change',render);seleccionar(modalidad);if(previo){monto.value=String(previo.monto);plazo.value=String(previo.plazo);render();}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
