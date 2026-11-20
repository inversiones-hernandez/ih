# Inversiones Hernández RD — sitio público

Sitio estático de información y solicitudes. Dominio: https://inversioneshernandezrd.com.

## Condiciones del simulador

`prestamos.js` contiene la única matriz de cuotas. El controlador `calculadora.js` y el resumen de `solicitud.html` utilizan esa misma matriz. Los valores reproducen las tablas comerciales autorizadas; no se interpolan capitales ni se ofrecen plazos que no existan.

- Diario: 30 y 45 pagos; capitales de 3,000 a 30,000. Para 3,000 solo se ofrecen 30 pagos.
- Semanal: 8, 10 y 13 pagos; capitales de 2,000 a 30,000. Para 2,000 y 3,000 solo se ofrecen 8 pagos.
- Quincenal: 4, 5, 8 y 10 pagos; capitales de 1,000 a 30,000. Para 1,000 y 2,000 solo se ofrecen 4 pagos; para 3,000, 4, 5 y 8 pagos.
- Total = cuota × número de pagos. Interés = total − capital.
- El porcentaje mostrado es el interés total del plazo, no una tasa mensual o efectiva anual. Las cuotas incorporan el redondeo comercial aprobado.

Para cambiar una condición, actualizar la matriz y comprobar que coincide con anuncios y documentos antes de publicar.

## Validación

Con Node.js 18 o posterior, sin instalar dependencias:

```
node --check prestamos.js
node --check calculadora.js
node --check script.js
node tests/prestamos.cjs
```

La prueba cubre los 107 planes, ejemplos de cuotas aprobadas, totales, opciones inválidas, conservación de selección y cambio de modalidad.

## Solicitud externa

La solicitud comienza por WhatsApp. Los documentos se coordinan en los canales oficiales y el Portal de clientes. Esta web pública no recibe formularios ni documentos.

## Presentación

Inicio no bloquea la navegación con video. La presentación se carga únicamente cuando el visitante pulsa «Ver presentación». Se conservan marca, contactos, políticas y dominio. No se añade un bloque de cuentas o logos bancarios.

## Publicidad

El archivo ads.txt y la etiqueta de cuenta identifican el editor declarado ca-pub-2272005848401303. No hay llamadas a adsbygoogle, Google Tag Manager ni analítica publicitaria en este código. El diálogo de privacidad administra únicamente el mapa, no constituye una CMP de Google. La configuración y verificación de la cuenta de AdSense se realizan fuera de este repositorio.
