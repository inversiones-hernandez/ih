(function(){
'use strict';
const mobile=window.matchMedia('(max-width: 980px)');
const root=document.documentElement,toggle=document.getElementById('themeToggle'),key='ih-theme-preference';
function tema(dark){root.dataset.theme=dark?'dark':'light';if(toggle){toggle.setAttribute('aria-label',dark?'Activar modo claro':'Activar modo oscuro');toggle.setAttribute('aria-pressed',String(dark));toggle.querySelector('.icon-moon')?.style.setProperty('display',dark?'none':'block');toggle.querySelector('.icon-sun')?.style.setProperty('display',dark?'block':'none');}}
let saved;try{saved=localStorage.getItem(key);}catch{}
tema(saved?saved==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches);
toggle?.addEventListener('click',()=>{tema(root.dataset.theme!=='dark');try{const preference=JSON.parse(localStorage.getItem('ih-privacy-v2')||'null');if(preference?.version===2&&preference.expires>Date.now()&&preference.rememberTheme===false)localStorage.removeItem(key);else localStorage.setItem(key,root.dataset.theme);}catch{}});
const menu=document.getElementById('menuToggle'),nav=document.getElementById('navLinks');
function cerrar(){nav?.classList.remove('open');menu?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Abrir menú');document.body.classList.remove('menu-is-open');if(nav)nav.inert=mobile.matches;}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';if(!open){cerrar();return;}if(nav)nav.inert=false;nav?.classList.add('open');menu.classList.add('open');menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Cerrar menú');document.body.classList.add('menu-is-open');});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',cerrar));
document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target))cerrar();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){cerrar();menu.focus();}});
mobile.addEventListener('change',cerrar);
if(nav)nav.inert=mobile.matches;
document.querySelectorAll('.faq-item').forEach((item,index)=>{const q=item.querySelector('.faq-q'),answer=item.querySelector('.faq-a');if(!q||!answer)return;answer.id='faq-respuesta-'+index;q.setAttribute('aria-controls',answer.id);q.setAttribute('aria-expanded',String(item.classList.contains('open')));q.addEventListener('click',()=>{const open=!item.classList.contains('open');item.classList.toggle('open',open);q.setAttribute('aria-expanded',String(open));});});
const resumen=document.getElementById('solicitudResumen');
if(resumen&&window.IHPrestamos){const params=new URLSearchParams(location.search),r=window.IHPrestamos.desdeParametros(params),aviso=document.getElementById('solicitudAviso');if(aviso&&window.IHPrestamos.tieneSeleccion(params)&&!r)aviso.hidden=false;if(r){const dinero=v=>'RD$'+v.toLocaleString('es-DO',{minimumFractionDigits:2,maximumFractionDigits:2});resumen.hidden=false;const text='Tu selección: '+dinero(r.monto)+' · '+r.plazo+' pagos '+({diario:'diarios',semanal:'semanales',quincenal:'quincenales'}[r.modalidad])+' de '+dinero(r.cuota)+'. Total: '+dinero(r.total)+'.';const wa=document.getElementById('solicitudWhatsApp');if(wa)wa.href='https://wa.me/18495942190?text='+encodeURIComponent('Hola, quiero iniciar una solicitud con IH. '+text);const p=document.createElement('p');p.textContent=text;const note=document.createElement('small');note.textContent='Referencia sujeta a evaluación. Puedes editar el mensaje antes de enviarlo por WhatsApp.';const change=document.createElement('a');change.className='btn btn-ghost btn-sm';change.href='soluciones.html?'+new URLSearchParams({monto:r.monto,plazo:r.plazo,modalidad:r.modalidad})+'#calculadora';change.textContent='Cambiar selección';const copy=document.createElement('button');copy.type='button';copy.className='btn btn-primary btn-sm';copy.textContent='Copiar resumen';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);copy.textContent='✓ Resumen copiado';copy.classList.add('is-confirmed');}catch{copy.textContent='Selecciona el texto para copiarlo';}});const actions=document.createElement('div');actions.className='summary-actions';actions.append(change,copy);resumen.replaceChildren(p,note,actions);}}
const play=document.getElementById('brandIntroReplay'),video=document.getElementById('brandIntroVideo'),poster=document.getElementById('brandIntroPoster');
if(play&&video){const restore=()=>{video.pause();video.hidden=true;if(poster)poster.hidden=false;play.hidden=false;};play.addEventListener('click',()=>{if(!video.src){if(poster?.currentSrc)video.poster=poster.currentSrc;video.src=video.dataset.src;}video.hidden=false;if(poster)poster.hidden=true;video.controls=true;video.play().then(()=>{play.hidden=true;}).catch(restore);});video.addEventListener('ended',restore);video.addEventListener('error',restore);document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});}

// Entradas breves, solo para contenido que comienza fuera de pantalla.
// El contenido permanece visible si no hay observador o se reduce movimiento.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!motionPreference.matches && 'IntersectionObserver' in window){
  const enterObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      enterObserver.unobserve(entry.target);
      if(motionPreference.matches || entry.target.contains(document.activeElement))continue;
      entry.target.classList.add('ih-enter');
      entry.target.addEventListener('animationend',()=>entry.target.classList.remove('ih-enter'),{once:true});
    }
  },{threshold:0.12});
  const selector='.solution-card, .why-card, .social-card, .learn-card, .step, .about-ih-values article, .about-ih-contact article';
  document.querySelectorAll(selector).forEach(element=>{
    const rect=element.getBoundingClientRect();
    if(rect.top < window.innerHeight || rect.height > window.innerHeight)return;
    const siblings=Array.from(element.parentElement.children).filter(child=>child.matches(selector));
    element.style.setProperty('--ih-enter-delay',Math.min(siblings.indexOf(element),3)*50+'ms');
    enterObserver.observe(element);
  });
}

// Acceso al inicio en todas las páginas, sin invadir WhatsApp.
const subir=document.createElement('button');
subir.type='button';subir.className='top-float';subir.hidden=true;
subir.setAttribute('aria-label','Volver arriba');subir.title='Volver arriba';
subir.innerHTML='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v13"/></svg>';
const marker=document.createElement('span');
marker.className='page-top-marker';
marker.setAttribute('aria-hidden','true');
document.body.append(marker,subir);
const mostrarSubir=visible=>{
  if(subir.hidden===!visible)return;
  subir.hidden=!visible;
  subir.classList.toggle('visible',visible);
};
if('IntersectionObserver' in window){
  new IntersectionObserver(([entry])=>mostrarSubir(entry.boundingClientRect.bottom < 0 && !entry.isIntersecting),
    {rootMargin:'400px 0px 0px 0px'}).observe(marker);
}else{
  const actualizar=()=>mostrarSubir(window.scrollY>400);
  window.addEventListener('scroll',actualizar,{passive:true});
  window.requestAnimationFrame(actualizar);
}
subir.addEventListener('click',()=>{const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});const destino=document.querySelector('main h1, main');if(destino){const previo=destino.getAttribute('tabindex');destino.setAttribute('tabindex','-1');destino.focus({preventScroll:true});destino.addEventListener('blur',()=>{if(previo===null)destino.removeAttribute('tabindex');else destino.setAttribute('tabindex',previo);},{once:true});}});

// Recorrido de solicitud: el scroll cambia el énfasis, no el estado de un crédito.
const journey=document.querySelector('.loan-journey');
if(journey){
 const cards=Array.from(journey.querySelectorAll('.journey-step'));
 const guideTitle=journey.querySelector('[data-journey-title]');
 const guideCount=journey.querySelector('[data-journey-count]');
 const dots=journey.querySelectorAll('.journey-dots span');
 let queued=false,active=-1,inView=true;
 function updateJourney(){
  queued=false;
  if(!inView||!cards.length)return;
  const positions=cards.map(card=>card.getBoundingClientRect().top+30);
  const anchor=window.innerHeight*.54;
  const progress=Math.max(0,Math.min(1,(anchor-positions[0])/(positions.at(-1)-positions[0]||1)));
  const current=positions.reduce((best,value,index)=>Math.abs(value-anchor)<Math.abs(positions[best]-anchor)?index:best,0);
  journey.style.setProperty('--journey-progress',String(progress));
  journey.style.setProperty('--journey-length',Math.max(0,positions.at(-1)-positions[0])+'px');
  journey.style.setProperty('--journey-ring',String((current+1)/cards.length));
  if(current===active)return;
  active=current;
  cards.forEach((card,index)=>{
   card.classList.toggle('is-current',index===current);
   if(index===current)card.setAttribute('aria-current','step');else card.removeAttribute('aria-current');
  });
  dots.forEach((dot,index)=>dot.classList.toggle('is-current',index<=current));
  guideTitle.textContent=cards[current].dataset.journeyLabel;
  guideCount.textContent=String(current+1).padStart(2,'0');
 }
 function queueJourney(){if(!queued&&inView){queued=true;window.requestAnimationFrame(updateJourney);}}
 window.addEventListener('scroll',queueJourney,{passive:true});
 window.addEventListener('resize',queueJourney,{passive:true});
 if('IntersectionObserver' in window){
  new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;if(inView)queueJourney();},{rootMargin:'150px'}).observe(journey);
 }
 window.addEventListener('pageshow',queueJourney);
 document.fonts?.ready.then(queueJourney);
 queueJourney();
}
})();
