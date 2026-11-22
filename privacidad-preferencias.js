(function(){
 'use strict';
 const KEY='ih-privacy-v2',OLD='ih-privacy-v1',THEME='ih-theme-preference',MAX_AGE=180*86400000;
 const rawConfig=window.IHPrivacyConfig||{};
 const config={
  analyticsId:/^G-[A-Z0-9]+$/.test(rawConfig.analyticsId||'')?rawConfig.analyticsId:'',
  tagManagerId:/^GTM-[A-Z0-9]+$/.test(rawConfig.tagManagerId||'')?rawConfig.tagManagerId:''
 };
 const hasAnalytics=!!(config.analyticsId||config.tagManagerId);
 const maps=Array.from(document.querySelectorAll('[data-map-src]'));
 let prefs=null,analyticsLoaded=false,lastFocus=null;
 function read(){try{const p=JSON.parse(localStorage.getItem(KEY));if(p&&p.version===2&&typeof p.rememberTheme==='boolean'&&typeof p.analytics==='boolean'&&typeof p.external==='boolean'&&p.expires>Date.now()&&p.expires<=Date.now()+MAX_AGE+60000)return p;}catch{}return null;}
 prefs=read();
 function consent(granted){
  window.dataLayer=window.dataLayer||[];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('consent','update',{analytics_storage:granted?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 }
 function clearAnalyticsCookies(){
  document.cookie.split(';').forEach(pair=>{
   const name=pair.trim().split('=')[0];
   if(!/^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name))return;
   const domains=['',location.hostname,'.'+location.hostname];
   for(const domain of domains)document.cookie=name+'=; Max-Age=0; path=/'+(domain?'; domain='+domain:'')+'; SameSite=Lax; Secure';
  });
 }
 function loadAnalytics(){
  if(!hasAnalytics||!prefs?.analytics||analyticsLoaded)return;
  analyticsLoaded=true;consent(true);
  const script=document.createElement('script');script.async=true;script.dataset.ihAnalytics='true';
  if(config.analyticsId){
   script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(config.analyticsId);
   const send=function(){window.dataLayer.push(arguments);};
   send('js',new Date());
   send('config',config.analyticsId,{page_location:location.origin+location.pathname,page_referrer:document.referrer?document.referrer.split('?')[0].split('#')[0]:'',allow_google_signals:false,allow_ad_personalization_signals:false,send_page_view:true});
  }else{
   window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
   script.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(config.tagManagerId);
  }
  document.head.append(script);
 }
 function apply(){
  for(const frame of maps){const enabled=!!prefs?.external;frame.hidden=!enabled;const placeholder=frame.nextElementSibling;if(placeholder?.classList.contains('map-consent'))placeholder.hidden=enabled;if(enabled)frame.src=frame.dataset.mapSrc;else frame.removeAttribute('src');}
  if(prefs&&!prefs.rememberTheme)try{localStorage.removeItem(THEME);}catch{}
  loadAnalytics();
 }
 const dialog=document.createElement('dialog');dialog.className='ih-privacy-dialog';dialog.setAttribute('aria-labelledby','privacy-title');
 dialog.innerHTML='<form method="dialog"><h2 id="privacy-title">Preferencias de privacidad</h2><p>El sitio funciona sin aceptar medición. Puedes cambiar tu elección desde el pie de cualquier página.</p><label><input type="checkbox" checked disabled> Funciones necesarias <span class="privacy-required">Siempre activas</span></label><label><input type="checkbox" id="privacy-theme"> Recordar mi elección de tema claro u oscuro</label>'+
 (hasAnalytics?'<label><input type="checkbox" id="privacy-analytics"> Permitir medición de visitas con Google</label><p>La medición solo se carga si la autorizas. No envíes datos personales mediante las direcciones de las páginas.</p>':'<p>La analítica y los anuncios de Google no están activos. Este panel no los habilita.</p>')+
 (maps.length?'<label><input type="checkbox" id="privacy-external"> Permitir el mapa integrado de Google</label>':'')+
 '<p>Las fuentes se sirven desde IH. <a href="/cookies.html">Cookies y almacenamiento</a> · <a href="/privacidad.html">Política de privacidad</a>. Este panel no es una CMP publicitaria de Google.</p><div class="ih-privacy-actions"><button class="btn btn-primary" type="button" data-save>Guardar preferencias</button><button class="btn btn-ghost" type="button" data-necessary>Solo necesarias</button><button class="btn btn-ghost" value="close">Cerrar</button></div><p data-privacy-message role="status"></p></form>';
 document.body.append(dialog);
 const themeBox=dialog.querySelector('#privacy-theme'),analyticsBox=dialog.querySelector('#privacy-analytics'),externalBox=dialog.querySelector('#privacy-external');
 const banner=document.createElement('section');banner.className='privacy-banner';banner.setAttribute('aria-label','Opciones de privacidad');banner.hidden=!hasAnalytics||!!prefs;
 banner.innerHTML='<div><strong>Tu privacidad</strong><p>Solo medimos visitas si lo autorizas. Puedes seguir navegando sin aceptar.</p></div><button class="btn btn-primary" type="button" data-accept>Aceptar medición</button><button class="btn btn-ghost" type="button" data-reject>Rechazar medición</button><button class="btn btn-ghost" type="button" data-options>Configurar</button>';
 document.body.append(banner);
 function open(){
  lastFocus=document.activeElement;
  themeBox.checked=prefs?.rememberTheme??true;
  if(analyticsBox)analyticsBox.checked=!!prefs?.analytics;
  if(externalBox)externalBox.checked=!!prefs?.external;
  if(typeof dialog.showModal==='function')dialog.showModal();else{dialog.setAttribute('open','');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');}
  themeBox.focus();
 }
 function close(){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');lastFocus?.focus();}
 function save(rememberTheme,analytics,external){
  const revoke=analyticsLoaded&&!analytics;
  prefs={version:2,rememberTheme:!!rememberTheme,analytics:hasAnalytics&&!!analytics,external:maps.length>0&&!!external,expires:Date.now()+MAX_AGE};
  try{localStorage.setItem(KEY,JSON.stringify(prefs));localStorage.removeItem(OLD);if(prefs.rememberTheme)localStorage.setItem(THEME,document.documentElement.dataset.theme||'light');}
  catch{dialog.querySelector('[data-privacy-message]').textContent='No se pudo recordar tu elección en este navegador. Se aplica a esta página.';}
  if(!prefs.analytics)clearAnalyticsCookies();
  if(revoke){consent(false);location.reload();return;}
  apply();banner.hidden=true;close();
 }
 document.querySelectorAll('[data-privacy-open]').forEach(b=>b.addEventListener('click',open));
 dialog.querySelector('[data-save]').addEventListener('click',()=>save(themeBox.checked,!!analyticsBox?.checked,!!externalBox?.checked));
 dialog.querySelector('[data-necessary]').addEventListener('click',()=>save(false,false,false));
 dialog.addEventListener('close',()=>lastFocus?.focus());
 banner.querySelector('[data-options]').addEventListener('click',open);
 banner.querySelector('[data-accept]').addEventListener('click',()=>save(true,true,false));
 banner.querySelector('[data-reject]').addEventListener('click',()=>save(true,false,false));
 apply();
})();
