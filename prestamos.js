/* Matriz autorizada de cuotas IH. Mantener sincronizada con las tablas comerciales. */
(function (root) {
  'use strict';
  const capitales=[1000,2000,3000,4000,5000,6000,7000,8000,9000,10000,15000,20000,25000];
  const planes={
    diario:{nombre:'Diario',unidad:'días',plazos:[30,45],capitales:capitales.slice(4),cuotas:[[195,140],[230,165],[270,195],[310,220],[350,250],[390,275],[580,415],[775,550],[970,690]]},
    semanal:{nombre:'Semanal',unidad:'semanas',plazos:[5,10,13],capitales,cuotas:[[260,140,115],[520,280,230],[780,420,345],[1040,560,460],[1300,700,575],[1560,840,690],[1820,980,810],[2080,1120,925],[2340,1260,1040],[2600,1400,1155],[3900,2100,1730],[5200,2800,2310],[6500,3500,2885]]},
    quincenal:{nombre:'Quincenal',unidad:'quincenas',plazos:[4,5,8],capitales,cuotas:[[330,280,205],[660,560,410],[990,840,615],[1320,1120,820],[1650,1400,1025],[1980,1680,1230],[2310,1960,1435],[2640,2240,1640],[2970,2520,1845],[3300,2800,2050],[4950,4200,3075],[6600,5600,4100],[8250,7000,5125]]}
  };
  function calcular(modalidad,monto,plazo){
    const plan=planes[modalidad];monto=Number(monto);plazo=Number(plazo);
    if(!plan||!Number.isSafeInteger(monto)||!Number.isSafeInteger(plazo))return null;
    const fila=plan.capitales.indexOf(monto),col=plan.plazos.indexOf(plazo);
    if(fila<0||col<0)return null;
    const cuota=plan.cuotas[fila][col],total=cuota*plazo,interes=total-monto;
    return {modalidad,monto,plazo,cuota,total,interes,porcentajeTotal:interes/monto*100};
  }
  function desdeParametros(params){return calcular(params.get('modalidad'),params.get('monto'),params.get('plazo'));}
  const api={planes,calcular,desdeParametros};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.IHPrestamos=api;
})(typeof window==='undefined'?globalThis:window);
