import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { serviceItems } from "../data/services";
import { articles } from "../data/articles";

const origin = "https://giovsoft.com";
const defaultImage = `${origin}/img/og/giovsoft-social.png`;

type SeoData = { title: string; description: string; noindex?: boolean };

const pages: Record<string, SeoData> = {
  "/": { title: "GiovSoft | Soluciones digitales y software a la medida", description: "GiovSoft es tu aliado tecnológico en Guadalajara. Integramos software, sitios web, marketing digital, ecommerce e infraestructura de red para impulsar tu operación." },
  "/nosotros": { title: "Nosotros | GiovSoft Technologies", description: "Conoce la historia, misión y valores de GiovSoft Technologies, aliado tecnológico nacido en Guadalajara en 2016." },
  "/servicios": { title: "Servicios tecnológicos para empresas | GiovSoft", description: "Conoce los servicios de estrategia, desarrollo digital, infraestructura, productividad y marketing que GiovSoft integra para tu negocio." },
  "/proceso": { title: "Nuestro proceso de trabajo | GiovSoft", description: "Conoce cómo GiovSoft transforma una necesidad de negocio en una solución tecnológica implementada, validada y preparada para evolucionar." },
  "/articulos": { title: "Artículos de tecnología y estrategia digital | GiovSoft", description: "Guías y conocimiento sobre tecnología, desarrollo, infraestructura, marketing y decisiones digitales para negocios." },
  "/portafolio": { title: "Soluciones digitales | GiovSoft", description: "Explora nuestras soluciones de software, aplicaciones móviles, sitios web y ecommerce desarrolladas para resolver necesidades reales." },
  "/portafolio/software": { title: "Software empresarial y CRM | GiovSoft", description: "Conoce las soluciones de software empresarial de GiovSoft, incluyendo GiovSoft Clinic para la administración de consultorios y expedientes." },
  "/portafolio/aplicaciones": { title: "Aplicaciones móviles | GiovSoft", description: "Descubre GFin, GFit y GiovTrips: aplicaciones creadas para finanzas, entrenamiento, nutrición y agencias de viajes." },
  "/portafolio/sitios-web": { title: "Diseño y desarrollo de sitios web | GiovSoft", description: "Catálogo de sitios web profesionales, rápidos y responsivos desarrollados por GiovSoft para empresas y organizaciones." },
  "/portafolio/ecommerce": { title: "Desarrollo de ecommerce y tiendas en línea | GiovSoft", description: "Creamos tiendas en línea con catálogo, pagos, pedidos e integraciones para convertir tu presencia digital en un canal de ventas." },
  "/academy": { title: "GiovSoft Academy | Aprende tecnología practicando", description: "Conoce GiovSoft Academy, una plataforma educativa con cursos de programación, tecnología, diseño, datos e inteligencia artificial." },
  "/studios": { title: "GiovSoft Studios | Nuestros videojuegos", description: "Descubre los videojuegos originales de GiovSoft Studios, conoce los próximos lanzamientos y encuentra dónde adquirirlos y jugarlos." },
  "/payments": { title: "GiovSoft Payments | Pagos, Tap to Pay y facturación", description: "Recibe, organiza e integra pagos digitales y presenciales con Tap to Pay, facturación conectada y mayor control para tu negocio." },
  "/contacto": { title: "Contacto | GiovSoft", description: "Cuéntanos qué necesita tu negocio. Contacta a GiovSoft para desarrollar software, aplicaciones, sitios web y soluciones digitales." },
  "/terminos": { title: "Términos y condiciones | GiovSoft", description: "Consulta los términos y condiciones de uso de los sitios, servicios y plataformas digitales de GiovSoft." },
  "/privacidad": { title: "Aviso de privacidad | GiovSoft", description: "Conoce cómo GiovSoft recopila, utiliza, protege y trata tus datos personales." },
  "/cookies": { title: "Política de cookies | GiovSoft", description: "Consulta qué cookies y tecnologías de almacenamiento utiliza GiovSoft y cómo administrar tus preferencias." },
  "/aviso-legal": { title: "Aviso legal | GiovSoft", description: "Información legal y condiciones aplicables al sitio web de GiovSoft Technologies S.A.S." },
  "/login": { title: "Acceso administrativo | GiovSoft", description: "Acceso privado al sistema GiovSoft.", noindex: true },
};

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalizedPath = pathname !== "/" ? pathname.replace(/\/$/, "") : "/";
    const serviceSlug = normalizedPath.startsWith("/servicios/") ? normalizedPath.split("/").pop() : undefined;
    const service = serviceItems.find((item) => item.slug === serviceSlug);
    const articleSlug = normalizedPath.startsWith("/articulos/") ? normalizedPath.split("/").pop() : undefined;
    const article = articles.find((item) => item.slug === articleSlug);
    const isPrivate = normalizedPath.startsWith("/admin");
    const data = article
      ? { title: `${article.title} | GiovSoft`, description: article.excerpt }
      : service
      ? { title: `${service.title} | Servicios GiovSoft`, description: service.detail }
      : pages[normalizedPath] || { title: "Página no encontrada | GiovSoft", description: "La página solicitada no está disponible.", noindex: true };
    const canonicalPath = normalizedPath === "/" ? "/" : `${normalizedPath}/`;
    const canonical = `${origin}${canonicalPath}`;
    const robots = data.noindex || isPrivate ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

    document.documentElement.lang = "es-MX";
    document.title = data.title;
    setMeta('meta[name="description"]', "name", "description", data.description);
    setMeta('meta[name="robots"]', "name", "robots", robots);
    setMeta('meta[property="og:title"]', "property", "og:title", data.title);
    setMeta('meta[property="og:description"]', "property", "og:description", data.description);
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[property="og:image"]', "property", "og:image", defaultImage);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", data.title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", data.description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", defaultImage);

    let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonical;
  }, [pathname]);

  return null;
}
