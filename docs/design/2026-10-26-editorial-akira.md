# Editorial de inicio y presentación de Akira

La portada incorpora un carrusel editorial después de la introducción y antes de las capacidades. La primera lectura es «Conoce a Akira: inteligencia para aprender y avanzar»; el resto procede de las guías existentes. Sin reproducción automática, con anterior/siguiente, selección directa y teclas izquierda/derecha/Inicio/Fin. Se conserva el foco en la región al navegar desde su enlace y se respeta movimiento reducido.

El artículo explica la visión de Akira, Students, Business, contexto, revisión humana y estado de desarrollo. No anuncia disponibilidad, precios, lanzamiento, alianzas ni tecnologías de entrenamiento. Incluye portada original, índice y acceso a `/akira`. Está destacado en la biblioteca y dispone de metadatos e inclusión en sitemap.

## Incorporar publicaciones
La fuente compartida es `frontend/src/data/articles.ts`. Agregar las nuevas publicaciones al principio de `articles` las incorpora al carrusel y la biblioteca. `homeTitle` permite un titular más breve; `coverImage`, `coverAlt`, `coverLabel`, `coverCaption`, `status` y `project` son opcionales. Los artículos sin esos campos mantienen una composición editorial genérica. No se añade otro panel de publicación ni un CMS.

## Comprobaciones
TypeScript, bundle Vite y diff limpios. Navegador: primera tarjeta Akira, avance a ciberseguridad, retroceso circular a la última, retorno por Inicio, lectura completa, seis secciones, portada cargada, canonical y social image correctos, biblioteca con seis artículos y Akira destacada. Sin desbordamiento de documento en el ancho de navegador disponible (688px). Revisión independiente sin hallazgos importantes.

Trabajo únicamente en preview local y PR. Sin despliegue.

## Corrección del modo oscuro
Se sustituyen los usos de la marca por una versión PNG con transparencia, conservando el JPEG original. Editorial, página de Akira, destacado de inicio y portadas de lectura/biblioteca usan superficies del tema activo. Se elimina el fondo blanco del contenedor de Akira que aclaraba la navegación y el header semitransparente. El cambio de tema usa estado funcional y las transiciones CSS existentes para evitar que una capa global intercepte una segunda pulsación. Comprobado en navegador: claro/oscuro alternan correctamente; contenedor y navegación oscuros #070b14, portadas #0b111e; alpha verificado y compilación correcta.
