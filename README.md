# Inversiones Hernández RD — sitio público

Sitio estático de información y solicitudes. Dominio: https://inversioneshernandezrd.com.

## Condiciones del simulador

`prestamos.js` contiene la única matriz de cuotas. El controlador `calculadora.js` y el resumen de `solicitud.html` utilizan esa misma matriz. Los valores reproducen las tablas comerciales autorizadas; no se interpolan capitales ni se ofrecen plazos que no existan.

- Diario: 30 y 45 pagos; capitales 5,000 a 10,000 en pasos de 1,000, más 15,000, 20,000 y 25,000.
- Semanal: 5, 10 y 13 pagos; capitales 1,000 a 10,000 en pasos de 1,000, más 15,000, 20,000 y 25,000.
- Quincenal: 4, 5 y 8 pagos; los mismos capitales del semanal.
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

La prueba cubre los 96 planes, ejemplos de cuotas aprobadas, totales, opciones inválidas, conservación de selección y cambio de modalidad.

## Solicitud externa

El formulario se encuentra en Préstamos Cloud y se conserva embebido. La web muestra y permite copiar la simulación, pero no rellena ni altera campos del proveedor.

Cambios pendientes en la administración del proveedor: retirar los campos públicos de tasa y tipo de mora; revisar si el codeudor y los documentos adicionales deben ser obligatorios para cada producto. No se han cambiado desde este repositorio.

## Presentación

Inicio no bloquea la navegación con video. La presentación se carga únicamente cuando el visitante pulsa «Ver presentación». Se conservan marca, contactos, políticas y dominio. No se añade un bloque de cuentas o logos bancarios.
