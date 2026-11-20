/* Matriz autorizada de cuotas IH. Mantener sincronizada con las tablas comerciales. */
(function (root) {
  'use strict';
  const planes={"diario":{"nombre":"Diario","unidad":"días","plazos":[30,45],"capitales":[3000,4000,5000,6000,7000,8000,9000,10000,15000,20000,25000,30000],"cuotas":[[115,null],[155,110],[190,135],[230,165],[270,190],[305,220],[345,245],[385,270],[575,410],[765,545],[960,680],[1150,815]]},"semanal":{"nombre":"Semanal","unidad":"semanas","plazos":[8,10,13],"capitales":[2000,3000,4000,5000,6000,7000,8000,9000,10000,15000,20000,25000,30000],"cuotas":[[325,null,null],[490,null,null],[650,550,460],[815,690,570],[975,825,685],[1140,965,800],[1300,1100,915],[1465,1240,1030],[1625,1375,1145],[2440,2065,1715],[3250,2750,2290],[4065,3440,2860],[4875,4125,3435]]},"quincenal":{"nombre":"Quincenal","unidad":"quincenas","plazos":[4,5,8,10],"capitales":[1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,15000,20000,25000,30000],"cuotas":[[325,null,null,null],[650,null,null,null],[975,825,600,null],[1300,1100,800,700],[1625,1375,1000,875],[1950,1650,1200,1050],[2275,1925,1400,1225],[2600,2200,1600,1400],[2925,2475,1800,1575],[3250,2750,2000,1750],[4875,4125,3000,2625],[6500,5500,4000,3500],[8125,6875,5000,4375],[9750,8250,6000,5250]]}};
  function calcular(modalidad,monto,plazo){
    const plan=Object.hasOwn(planes,modalidad)?planes[modalidad]:null;monto=Number(monto);plazo=Number(plazo);
    if(!plan||!Number.isSafeInteger(monto)||!Number.isSafeInteger(plazo))return null;
    const fila=plan.capitales.indexOf(monto),col=plan.plazos.indexOf(plazo);
    if(fila<0||col<0)return null;
    const cuota=plan.cuotas[fila][col];if(!Number.isFinite(cuota)||cuota<=0)return null;
    const total=cuota*plazo,interes=total-monto;
    return {modalidad,monto,plazo,cuota,total,interes,porcentajeTotal:interes/monto*100};
  }
  function desdeParametros(params){return calcular(params.get('modalidad'),params.get('monto'),params.get('plazo'));}
  function tieneSeleccion(params){return ['modalidad','monto','plazo'].some(k=>params.has(k));}
  const api={planes,calcular,desdeParametros,tieneSeleccion};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.IHPrestamos=api;
})(typeof window==='undefined'?globalThis:window);
