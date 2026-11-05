# Movimiento al hacer scroll

Entradas progresivas para los módulos públicos, integradas mediante el hook `usePublicMotion` del header compartido. Títulos y tarjetas suben suavemente; las ilustraciones añaden un acercamiento leve. Las tarjetas usan retrasos de 0, 75, 150 y hasta 225 ms. Cada elemento aparece una vez por visita y permanece visible después. Una línea bajo el header indica el avance de lectura.

## Comportamiento
- IntersectionObserver activa sólo elementos inicialmente fuera de pantalla; el contenido visible y el primer bloque permanecen presentes al cargar.
- No hay listeners por tarjeta, animaciones ligadas a cada píxel de scroll, timers ni dependencias nuevas. El progreso usa un listener pasivo y requestAnimationFrame.
- Se evitan revelados anidados y se registran tarjetas nuevas al cambiar contenido, como en filtros.
- Sin JavaScript o IntersectionObserver, el contenido permanece visible.
- Movimiento reducido desactiva la preparación y limpia los atributos existentes si cambia la preferencia. Impresión y foco de teclado fuerzan la visibilidad.
- Los formularios, navegación y párrafos de lectura no se ocultan ni se desplazan.
- Limpieza de observadores, eventos, estilos y frames al cambiar de ruta o desmontar.

## Verificación
TypeScript y producción Vite correctos. Revisión independiente sin hallazgos importantes. Navegador local: portada con 21 objetivos pendientes fuera de pantalla y contenido inicial visible; scroll real produce estados entered y valores intermedios de opacidad/translate; se comprueban retrasos escalonados, barra de progreso y enlace de Payments visible al recibir foco por teclado. Sin desbordamiento horizontal en el ancho disponible de 688 px. La preferencia de movimiento reducido se protege en JavaScript y CSS; no se altera la configuración del sistema durante la comprobación.

Preview local y PR actualizados, sin desplegar.
