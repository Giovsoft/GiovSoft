# GiovSoft: inteligencia aplicada

## Dirección
Renovar la presentación pública de GiovSoft para expresar la oferta de soluciones con IA, automatización, diseño y software. La portada muestra usos concretos y conduce a una conversación de proyecto. Akira conserva su condición de producto en desarrollo. Se retira la referencia a NVIDIA por indicación del propietario.

## Diseño implementado
Sistema oscuro predeterminado con alternativa clara, azul eléctrico, cian y superficies de alto contraste. Se conserva el logo original. La nueva portada presenta una esfera de conexiones animada en SVG, tres escenarios ilustrativos seleccionables con teclado, soluciones, Akira, metodología y ecosistema de productos. No utiliza vídeo, librerías de animación ni llamadas a modelos para la demostración.

La hoja compartida `frontend/src/styles/public-design.css` renueva navegación, botones, superficies, tipografía, contacto y pie de página en las rutas públicas. El catálogo incorpora dos servicios de IA con páginas propias; Nosotros y Proceso reflejan la nueva dirección. Los productos conservan sus contenidos y particularidades visuales. Las pantallas administrativas quedan fuera del rediseño.

## Movimiento y accesibilidad
Rotación lenta de conexiones, señales que recorren flujos, desplazamientos ligeros y entradas vinculadas al desplazamiento donde el navegador lo permite. Todos los movimientos se desactivan con `prefers-reduced-motion`. Pestañas con flechas, Inicio/Fin y foco visible. Las demostraciones se identifican como conceptuales. La página mantiene enlaces y contenidos accesibles sin depender de animaciones.

## Alcance y continuidad
Se mantienen rutas, formulario de contacto, canales públicos y contenido legal. No se envían formularios durante la revisión. No se despliega ni se fusiona la rama. Preview local en `http://127.0.0.1:4175/`.

## Verificación
Compilación TypeScript/Vite, revisión del diff, apertura de rutas representativas en navegador y comprobación del selector de escenarios con clic y teclado. Las validaciones de envío del formulario requieren su backend y no forman parte de esta revisión visual.
