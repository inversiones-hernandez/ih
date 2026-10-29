(function(){
'use strict';
const root=document.documentElement,toggle=document.getElementById('themeToggle'),key='ih-theme-preference';
function tema(dark){root.dataset.theme=dark?'dark':'light';if(toggle){toggle.setAttribute('aria-label',dark?'Activar modo claro':'Activar modo oscuro');toggle.setAttribute('aria-pressed',String(dark));toggle.querySelector('.icon-moon')?.style.setProperty('display',dark?'none':'block');toggle.querySelector('.icon-sun')?.style.setProperty('display',dark?'block':'none');}}
let saved;try{saved=localStorage.getItem(key);}catch{}
tema(saved?saved==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches);
toggle?.addEventListener('click',()=>{tema(root.dataset.theme!=='dark');try{localStorage.setItem(key,root.dataset.theme);}catch{}});
const menu=document.getElementById('menuToggle'),nav=document.getElementById('navLinks');
function cerrar(){nav?.classList.remove('open');menu?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Abrir menú');document.body.classList.remove('menu-is-open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';if(!open){cerrar();return;}nav?.classList.add('open');menu.classList.add('open');menu.setAttribute('aria-expanded','true');menu.setAttribute('aria-label','Cerrar menú');document.body.classList.add('menu-is-open');});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',cerrar));
document.addEventListener('click',e=>{if(nav?.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target))cerrar();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){cerrar();menu.focus();}});
window.addEventListener('resize',()=>{if(innerWidth>980)cerrar();});
document.querySelectorAll('.faq-item').forEach((item,index)=>{const q=item.querySelector('.faq-q'),answer=item.querySelector('.faq-a');if(!q||!answer)return;answer.id='faq-respuesta-'+index;q.setAttribute('aria-controls',answer.id);q.setAttribute('aria-expanded',String(item.classList.contains('open')));q.addEventListener('click',()=>{const open=!item.classList.contains('open');item.classList.toggle('open',open);q.setAttribute('aria-expanded',String(open));});});
const resumen=document.getElementById('solicitudResumen');
if(resumen&&window.IHPrestamos){const r=window.IHPrestamos.desdeParametros(new URLSearchParams(location.search));if(r){const dinero=v=>'RD$'+v.toLocaleString('es-DO',{minimumFractionDigits:2,maximumFractionDigits:2});resumen.hidden=false;const text='Tu selección: '+dinero(r.monto)+' · '+r.plazo+' pagos '+({diario:'diarios',semanal:'semanales',quincenal:'quincenales'}[r.modalidad])+' de '+dinero(r.cuota)+'. Total: '+dinero(r.total)+'.';const p=document.createElement('p');p.textContent=text;const note=document.createElement('small');note.textContent='Referencia sujeta a evaluación. El formulario externo no se completa automáticamente.';const change=document.createElement('a');change.className='btn btn-ghost btn-sm';change.href='soluciones.html?'+new URLSearchParams({monto:r.monto,plazo:r.plazo,modalidad:r.modalidad})+'#calculadora';change.textContent='Cambiar selección';const copy=document.createElement('button');copy.type='button';copy.className='btn btn-primary btn-sm';copy.textContent='Copiar resumen';copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);copy.textContent='Resumen copiado';}catch{copy.textContent='Selecciona el texto para copiarlo';}});const actions=document.createElement('div');actions.className='summary-actions';actions.append(change,copy);resumen.replaceChildren(p,note,actions);}}
const play=document.getElementById('brandIntroReplay'),video=document.getElementById('brandIntroVideo'),poster=document.getElementById('brandIntroPoster');
if(play&&video){const restore=()=>{video.pause();video.hidden=true;if(poster)poster.hidden=false;play.hidden=false;};play.addEventListener('click',()=>{if(!video.src)video.src=video.dataset.src;video.hidden=false;if(poster)poster.hidden=true;video.controls=true;video.play().then(()=>{play.hidden=true;}).catch(restore);});video.addEventListener('ended',restore);video.addEventListener('error',restore);document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});}
// Acceso al inicio en todas las páginas, sin invadir WhatsApp.
const subir=document.createElement('button');
subir.type='button';subir.className='top-float';subir.hidden=true;
subir.setAttribute('aria-label','Volver arriba');subir.title='Volver arriba';
subir.innerHTML='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v13"/></svg>';
document.body.append(subir);
const actualizarSubir=()=>{const visible=window.scrollY>400;subir.hidden=!visible;subir.classList.toggle('visible',visible);};
window.addEventListener('scroll',actualizarSubir,{passive:true});actualizarSubir();
subir.addEventListener('click',()=>{const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});const destino=document.querySelector('main h1, main');if(destino){const previo=destino.getAttribute('tabindex');destino.setAttribute('tabindex','-1');destino.focus({preventScroll:true});destino.addEventListener('blur',()=>{if(previo===null)destino.removeAttribute('tabindex');else destino.setAttribute('tabindex',previo);},{once:true});}});
})();
