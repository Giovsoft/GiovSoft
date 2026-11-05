# Revisión de módulos públicos: identidad IA

## Alcance
Aplicar la nueva dirección visual a todos los módulos públicos, incluidos 14 servicios, los cinco catálogos de soluciones, Akira, Academy, Studios, Payments, biblioteca y lectura de artículos, Nosotros, Proceso, Contacto, páginas legales y error 404. Se conserva la funcionalidad de los productos, sus capturas y los textos legales. No se atribuyen capacidades de IA a productos que no las hayan confirmado. Las pantallas administrativas quedan fuera del sitio público.

## Sistema
`ModuleNavigation` conecta páginas relacionadas y muestra la ubicación activa. `ModuleSignal` reúne nodos de contexto, diseño y evolución en las introducciones de servicios, empresa y soluciones. `module-design.css` desarrolla la misma tipografía, espaciado, paleta, bordes, superficies, botones y movimiento de la portada a lo largo de los módulos. Incluye alternativas clara/oscura, adaptación a móvil/tablet y movimiento reducido.

Cada módulo conserva su contenido propio: capturas de Academy y las aplicaciones, ilustración de Studios, operación conceptual de Payments y ejemplos de Akira. Se conserva el footer compacto.

## Correcciones funcionales
- Los filtros del catálogo web alternan los proyectos y su contador; la historia de la escuela acompaña únicamente sus filtros.
- Categorías de artículos exponen el estado seleccionado y los resultados se anuncian con aria-live.
- Los enlaces de metodología apuntan a `/proceso`, sin depender de un fragmento eliminado de la portada.
- El catálogo ecommerce incluye recorrido, capacidades y siguiente paso.
- Los paneles con datos de ejemplo se identifican como conceptuales y se retira el indicador de rendimiento 98 sin evidencia.

## Verificación
- TypeScript y bundle de Vite correctos. Se usa el cargador nativo de configuración por un bloqueo intermitente del cargador por defecto en esta máquina.
- 34 rutas abiertas en el navegador local: 18 módulos, 14 servicios, una lectura representativa y error 404. Título y contenido principal presentes; sin desbordamiento horizontal de documento en el ancho disponible (688 px). Los marcos embebidos conservan su recorte intencional.
- Filtros Servicios/Educación del portafolio comprobados con proyecto y contador correctos.
- Búsqueda de artículos: una coincidencia y estado vacío comprobados.
- Alternativa clara comprobada en Academy; el modo oscuro y las rutas de productos se revisaron visualmente.
- Revisión independiente de código sin regresiones funcionales confirmadas. Se ajusta el salto de héroes a una columna entre 768 y 900 px.
- No se envían formularios, no se despliega ni se fusiona la rama.

## Límites de la comprobación
La verificación visual usa el ancho disponible en el navegador de la aplicación. No sustituye una matriz completa de dispositivos físicos. Las llamadas externas y el envío de contacto conservan su implementación existente y no se ejecutan durante esta revisión.
