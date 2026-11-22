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

// Usa el historial para conservar la sección y la posición de lectura.
const backLink=document.querySelector('[data-ih-back]');
if(backLink){
  const label=backLink.querySelector('span');
  const fallback=label.textContent;
  const row=backLink.closest('[data-ih-back-home]');
  const navigation=window.navigation;
  function canReturnWithinSite(){
    if(navigation?.currentEntry){
      return navigation.canGoBack && navigation.entries().some(entry=>entry.index===navigation.currentEntry.index-1);
    }
    return history.length>1 && Boolean(document.referrer) && new URL(document.referrer).origin===location.origin;
  }
  function updateBackLink(){
    const canReturn=canReturnWithinSite();
    label.textContent=canReturn?'Volver':fallback;
    if(row)row.hidden=!canReturn;
  }
  backLink.addEventListener('click',event=>{
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)return;
    if(!canReturnWithinSite())return;
    event.preventDefault();
    history.back();
  });
  window.addEventListener('pageshow',updateBackLink);
  navigation?.addEventListener('currententrychange',updateBackLink);
  updateBackLink();
}

document.querySelectorAll('.faq-item').forEach((item,index)=>{const q=item.querySelector('.faq-q'),answer=item.querySelector('.faq-a');if(!q||!answer)return;answer.id='faq-respuesta-'+index;q.setAttribute('aria-controls',answer.id);q.setAttribute('aria-expanded',String(item.classList.contains('open')));q.addEventListener('click',()=>{const open=!item.classList.contains('open');item.classList.toggle('open',open);q.setAttribute('aria-expanded',String(open));});});
const resumen=document.getElementById('solicitudResumen');
if(resumen&&window.IHPrestamos){
  const params=new URLSearchParams(location.search);
  const plan=window.IHPrestamos.desdeParametros(params);
  const aviso=document.getElementById('solicitudAviso');
  if(aviso&&window.IHPrestamos.tieneSeleccion(params)&&!plan)aviso.hidden=false;
  if(plan){
    const dinero=value=>'RD$'+value.toLocaleString('es-DO',{minimumFractionDigits:2,maximumFractionDigits:2});
    const frecuencia={diario:'diarios',semanal:'semanales',quincenal:'quincenales'}[plan.modalidad];
    const monto=dinero(plan.monto),cuota=dinero(plan.cuota),total=dinero(plan.total);
    const pagos=`${plan.plazo} pagos ${frecuencia} de`;
    const texto=`Monto solicitado: ${monto}. ${pagos} ${cuota}. Total estimado: ${total}.`;
    document.getElementById('solicitudMonto').textContent=monto;
    document.getElementById('solicitudPagos').textContent=pagos;
    document.getElementById('solicitudCuota').textContent=cuota;
    document.getElementById('solicitudTotal').textContent=total;
    resumen.hidden=false;
    const whatsapp=document.getElementById('solicitudWhatsApp');
    const destino=new URL(whatsapp.href);
    destino.searchParams.set('text','Hola, quiero iniciar una solicitud con IH. '+texto);
    whatsapp.href=destino.href;
    const seleccion=new URLSearchParams({monto:plan.monto,plazo:plan.plazo,modalidad:plan.modalidad});
    document.getElementById('solicitudCambiar').href='soluciones.html?'+seleccion+'#calculadora';
    const estado=document.getElementById('solicitudCopiaEstado');
    document.getElementById('solicitudCopiar').addEventListener('click',async()=>{
      try{
        await navigator.clipboard.writeText(texto);
        estado.textContent='Resumen copiado.';
      }catch{
        estado.textContent='Puedes seleccionar el texto de la estimación y copiarlo.';
      }
    });
    document.getElementById('solicitudAcciones').hidden=false;
  }
}
const play=document.getElementById('brandIntroReplay'),video=document.getElementById('brandIntroVideo'),poster=document.getElementById('brandIntroPoster');
if(play&&video){const restore=()=>{video.pause();video.hidden=true;if(poster)poster.hidden=false;play.hidden=false;};play.addEventListener('click',()=>{if(!video.src){if(poster?.currentSrc)video.poster=poster.currentSrc;video.src=video.dataset.src;}video.hidden=false;if(poster)poster.hidden=true;video.controls=true;video.play().then(()=>{play.hidden=true;}).catch(restore);});video.addEventListener('ended',restore);video.addEventListener('error',restore);document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});}

// Entrada única para encabezados y grupos, con el contenido visible por defecto.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!motionPreference.matches && 'IntersectionObserver' in window){
  const groups='.solution-card, .why-card, .social-card, .learn-card, .step, .process-list > li, .req-item, .about-ih-identity article, .about-ih-values article, .about-ih-contact article, body > footer .foot-grid > div';
  const enterObserver=new IntersectionObserver(entries=>{
    for(const {isIntersecting,target} of entries){
      if(!isIntersecting)continue;
      enterObserver.unobserve(target);
      if(motionPreference.matches || target.contains(document.activeElement))continue;
      target.classList.add('ih-enter');
      const clear=event=>{
        if(event.type!=='focusin' && (event.target!==target || event.animationName!=='ih-enter'))return;
        target.classList.remove('ih-enter');
        target.removeEventListener('animationend',clear);
        target.removeEventListener('animationcancel',clear);
        target.removeEventListener('focusin',clear);
      };
      target.addEventListener('animationend',clear);
      target.addEventListener('animationcancel',clear);
      target.addEventListener('focusin',clear);
    }
  },{threshold:0.08});

  document.querySelectorAll(`main h2, main h3, ${groups}`).forEach(element=>{
    const isGroup=element.matches(groups);
    if(!isGroup && element.closest(`${groups}, .ih-home .hero`))return;
    if(element.closest('[hidden]') || !element.getClientRects().length)return;
    const {top,height}=element.getBoundingClientRect();
    if(top<window.innerHeight || height>window.innerHeight)return;
    if(isGroup){
      const siblings=Array.from(element.parentElement.children).filter(child=>child.matches(groups));
      const delay=Math.min(siblings.indexOf(element),3)*45;
      element.style.setProperty('--ih-enter-delay',`${delay}ms`);
    }
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

// Los fondos acompañan el scroll. La línea indica la etapa en lectura.
const processList=document.querySelector('.process-list');
const processRows=Array.from(processList?.children||[]);
const processScene=document.getElementById('como-funciona');
const footerScene=document.querySelector('body > footer');
const pageTitle=document.querySelector('main h1');
const headerScene=pageTitle?.closest('.page-hero, .legal-hero, .learn-hero, .printable-sheet');
if(headerScene){
  headerScene.classList.add('ih-depth');
  const layer=document.createElement('span');
  layer.className='ih-depth-layer';
  layer.setAttribute('aria-hidden','true');
  headerScene.prepend(layer);
}
const scenes=[processScene,footerScene,headerScene].filter(Boolean);
if(scenes.length && 'IntersectionObserver' in window){
  const visible=new Set();
  const clamp=value=>Math.max(0,Math.min(1,value));
  let frame=0;
  let active=-1;

  function paintScroll(){
    frame=0;
    if(motionPreference.matches)return;
    const viewport=window.innerHeight;
    for(const scene of visible){
      const rect=scene.getBoundingClientRect();
      const travel=clamp((viewport-rect.top)/(viewport+rect.height));
      const distance=scene===footerScene?112:scene===processScene?56:48;
      scene.style.setProperty('--ih-scroll-offset',Math.round((travel-.5)*distance)+'px');
      if(scene!==processScene||!processRows.length)continue;

      const positions=processRows.map(row=>row.offsetTop);
      const anchor=viewport*.54-processList.getBoundingClientRect().top;
      const length=positions.at(-1)-positions[0];
      const progress=clamp((anchor-positions[0])/(length||1));
      processList.style.setProperty('--ih-reading-length',length+'px');
      processList.style.setProperty('--ih-reading-progress',progress.toFixed(3));
      const next=positions.reduce((last,top,index)=>top<=anchor?index:last,-1);
      if(next!==active){
        processRows[active]?.classList.remove('is-reading');
        active=next;
        processRows[active]?.classList.add('is-reading');
      }
    }
  }

  function queueScroll(){
    if(!frame&&visible.size&&!motionPreference.matches)frame=window.requestAnimationFrame(paintScroll);
  }

  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.isIntersecting)visible.add(entry.target);
      else visible.delete(entry.target);
    }
    queueScroll();
  },{rootMargin:'64px'});
  scenes.forEach(scene=>observer.observe(scene));
  window.addEventListener('scroll',queueScroll,{passive:true});
  window.addEventListener('resize',queueScroll,{passive:true});
  window.addEventListener('pageshow',queueScroll);
  motionPreference.addEventListener('change',queueScroll);
}
})();
