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

## Tecnología NVIDIA prevista

Por indicación del propietario, la presentación incluye «Entrenamiento previsto con tecnología NVIDIA». Se identifica como integración por implementar, sin afirmar entrenamiento ya realizado, certificación, patrocinio ni respaldo. Se enlaza a la documentación oficial de NeMo Framework. No se incorpora el logo corporativo ni un badge de Inception: su uso requiere verificar la autorización y las condiciones correspondientes. Referencias revisadas el 26 de octubre de 2026:

- https://www.nvidia.com/en-gb/about-nvidia/legal-info/logo-brand-usage/
- https://www.nvidia.com/en-us/about-nvidia/legal-info.html
- https://www.nvidia.com/en-us/startups/

Registrar el producto en el portal no demuestra que un entrenamiento se haya efectuado ni autorización general de marca.
