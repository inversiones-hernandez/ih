(function(){
'use strict';
function iniciar(){
 const datos=window.IHPrestamos,monto=document.getElementById('calcMonto'),plazo=document.getElementById('calcPlazo');
 if(!datos||!monto||!plazo)return;
 const dinero=v=>'RD$'+v.toLocaleString('es-DO',{minimumFractionDigits:2,maximumFractionDigits:2});
 const frecuencias={
   diario:{pagos:'diarios',ayuda:'Un pago cada día calendario.'},
   semanal:{pagos:'semanales',ayuda:'Un pago cada semana.'},
   quincenal:{pagos:'quincenales',ayuda:'Un pago cada quincena.'}
 };
 let modalidad='quincenal',previousResult='';
 function opciones(select,values,label){select.replaceChildren(...values.map(v=>{const o=document.createElement('option');o.value=String(v);o.textContent=label(v);return o;}));}
 function render(){
   const r=datos.calcular(modalidad,monto.value,plazo.value);if(!r)return;
   const frecuencia=frecuencias[modalidad];
   const textos={
     calcFrecuenciaAyuda:frecuencia.ayuda,
     resFrecuencia:r.plazo+' pagos '+frecuencia.pagos+' de',
     resCuotaValor:dinero(r.cuota),
     resTotal:dinero(r.total),
     resMonto:dinero(r.monto),
     resTasa:r.porcentajeTotal.toLocaleString('es-DO',{maximumFractionDigits:2})+'% del capital',
     resInteres:dinero(r.interes)
   };
   for(const [id,text] of Object.entries(textos)){
     const element=document.getElementById(id);
     if(element.textContent!==text)element.textContent=text;
   }
   const signature=[modalidad,r.monto,r.plazo].join(':');
   const result=document.getElementById('calcResumen');
   if(previousResult && previousResult!==signature && result?.animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
     result.getAnimations().forEach(animation=>animation.cancel());
     result.animate([{opacity:.8,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(.16,1,.3,1)'});
   }
   previousResult=signature;
   const params=new URLSearchParams({monto:String(r.monto),modalidad,plazo:String(r.plazo)});
   document.getElementById('calcSolicitud').href='solicitud.html?'+params;
   const mensaje='Hola, quiero información sobre un préstamo de '+dinero(r.monto)+', '+r.plazo+' pagos '+frecuencia.pagos+' de '+dinero(r.cuota)+'. Total: '+dinero(r.total)+'.';
   document.getElementById('calcAsesor').href='https://wa.me/18495942190?text='+encodeURIComponent(mensaje);
 }
 function seleccionar(mode,preferred){
   if(!Object.hasOwn(datos.planes,mode))return;
   modalidad=mode;const plan=datos.planes[mode],oldMonto=preferred?.monto??Number(monto.value),oldPlazo=preferred?.plazo??Number(plazo.value);
   opciones(monto,plan.capitales,dinero);monto.value=String(plan.capitales.includes(oldMonto)?oldMonto:5000);
   const disponibles=plan.plazos.filter(n=>datos.calcular(mode,monto.value,n));
   opciones(plazo,disponibles,n=>n+' pagos · '+n+' '+plan.unidad);plazo.value=String(disponibles.includes(oldPlazo)?oldPlazo:disponibles[0]);
   document.querySelectorAll('[data-modalidad]').forEach(b=>{const active=b.dataset.modalidad===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
   render();
 }
 const params=new URLSearchParams(location.search),previo=datos.desdeParametros(params);
 const aviso=document.getElementById('calcAviso');
 if(aviso&&datos.tieneSeleccion(params)&&!previo)aviso.hidden=false;
 if(previo)modalidad=previo.modalidad;
 document.querySelectorAll('[data-modalidad]').forEach(b=>b.addEventListener('click',()=>seleccionar(b.dataset.modalidad)));
 function elegir(){if(aviso)aviso.hidden=true;render();}
 monto.addEventListener('change',()=>{seleccionar(modalidad);if(aviso)aviso.hidden=true;});plazo.addEventListener('change',elegir);seleccionar(modalidad,previo);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
