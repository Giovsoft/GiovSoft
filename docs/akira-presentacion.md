# Akira: presentación pública

Página: `https://giovsoft.com/akira`, también admite `/akira/`.

Se presenta como un producto de GiovSoft en desarrollo, con Students y Business, sus funciones previstas y ejemplos ilustrativos seleccionables. No es una aplicación operativa de Akira ni una lista de espera. No se anuncian fechas, precios, capacidades multimodales, clientes o alianzas no verificadas. El registro en un programa no se presenta como aprobación, patrocinio o certificación de NVIDIA.

El logotipo original aportado por el propietario se conserva en `frontend/public/img/akira/logo.jpeg`. La paleta usa #128BFA, #0730B5, #20E7E9 y violeta como acento. No se copian datos, identidad, conversaciones ni modelos de Juliette.

La navegación incorpora Akira entre los productos de GiovSoft, y en el pie. La ruta tiene título, descripción, imagen social y canonical; se incorpora a sitemap.xml. Nginx sirve index.html con estado 200 en `/akira` y `/akira/`; no basta con añadir la ruta en React, pues antes devolvía HTTP 404.

Los contactos utilizan el WhatsApp existente de GiovSoft con texto alusivo a Akira y el formulario `/contacto`. Abrir un enlace no envía un mensaje automáticamente. Los ejemplos Students/Business se identifican como ilustrativos y no se conectan a modelos ni recogen datos del visitante.

## Validación

- `cd frontend && npm ci && npm run build` (TypeScript y build de producción).
- Revisar `/akira`, acceso con recarga, navegación de productos y pie, alternancia Students/Business, FAQ, claro/oscuro y ancho móvil.
- Comprobar después del despliegue que `curl -I https://giovsoft.com/akira` devuelve 200; que el logo carga y los metadatos aparecen al navegar.
- No modificar despliegue, DNS o permisos del backend para publicar esta página. Desplegar únicamente el frontend con el procedimiento existente.

Esta rama no define un pipeline de producción: el repositorio no incluye un workflow de despliegue en GitHub Actions. No se presume que fusionar el PR publique el sitio.
