import {
  Globe2,
  Mail,
  MonitorSmartphone,
  PanelsTopLeft,
  ServerCog,
  ShoppingCart,
} from "lucide-react";

export const serviceItems = [
  {
    slug: "giovsoft-360",
    title: "GiovSoft 360",
    copy: "Acompañamiento integral para crear, conectar y mantener la base digital de tu negocio en un solo paquete.",
    detail:
      "Unimos sitio web o ecommerce, dominio, correos corporativos, Google Workspace y acompañamiento continuo para que tu empresa avance con una estrategia digital ordenada.",
    outcome: "Un aliado tecnológico que acompaña tu crecimiento digital de punta a punta.",
    features: [
      "Diagnóstico inicial y ruta de implementación.",
      "Sitio web o tienda en línea según las necesidades del negocio.",
      "Dominio, correos corporativos y herramientas de trabajo conectadas.",
      "Acompañamiento para mejoras, soporte y evolución del paquete.",
    ],
    icon: PanelsTopLeft,
  },
  {
    slug: "sitios-web",
    title: "Sitios web",
    copy: "Páginas modernas, rápidas y claras para presentar tu negocio, captar clientes y transmitir confianza.",
    detail:
      "Creamos sitios web profesionales para negocios y organizaciones que necesitan verse confiables, explicar sus servicios y recibir nuevos contactos.",
    outcome: "Tu negocio disponible en internet con una imagen clara y profesional.",
    features: [
      "Diseño adaptable a celular, tablet y escritorio.",
      "Secciones para servicios, contacto, ubicación y propuesta de valor.",
      "Optimización inicial para buscadores y carga rápida.",
      "Base preparada para crecer hacia catálogo, agenda o panel administrativo.",
    ],
    icon: MonitorSmartphone,
  },
  {
    slug: "ecommerce",
    title: "Ecommerce",
    copy: "Tiendas en línea para vender productos, recibir pedidos e integrar pagos y envíos con plataformas externas.",
    detail:
      "Implementamos tiendas en línea para que puedas mostrar productos, recibir pedidos, conectar pagos con Stripe o Mercado Pago e integrar soluciones de envío como Skydrop o Envia.com según la etapa del negocio.",
    outcome: "Un canal de venta digital listo para cobrar, gestionar pedidos y coordinar envíos.",
    features: [
      "Catálogo de productos organizado por categorías.",
      "Carrito, flujo de compra y pedidos.",
      "Integraciones con Stripe, Mercado Pago u otros medios de pago.",
      "Conexiones con Skydrop, Envia.com u operadores logísticos compatibles.",
      "Panel o flujo operativo para administrar ventas, pagos y envíos.",
    ],
    icon: ShoppingCart,
  },
  {
    slug: "hosting-administrado",
    title: "Hosting administrado",
    copy: "Alojamiento supervisado para mantener tu sitio o aplicación disponible, actualizado y respaldado.",
    detail:
      "Administramos la infraestructura de tu sitio web o aplicación para que tu equipo pueda concentrarse en el negocio mientras cuidamos despliegues, actualizaciones, respaldos y operación técnica.",
    outcome: "Infraestructura administrada por un aliado tecnológico que acompaña la continuidad de tu proyecto.",
    features: [
      "Configuración y puesta en marcha del entorno de alojamiento.",
      "Despliegues y actualizaciones técnicas controladas.",
      "Respaldos periódicos conforme al plan contratado.",
      "Supervisión de disponibilidad y atención de incidencias.",
      "Acompañamiento para escalar recursos cuando el proyecto lo requiera.",
    ],
    icon: ServerCog,
  },
  {
    slug: "correos-corporativos",
    title: "Correos corporativos",
    copy: "Cuentas profesionales con tu dominio, configuración segura y una imagen más confiable ante tus clientes.",
    detail:
      "Configuramos correos con dominio propio para mejorar la presentación de tu empresa y ordenar la comunicación con clientes y proveedores.",
    outcome: "Correos profesionales que transmiten confianza desde el primer mensaje.",
    features: [
      "Alta y configuración de cuentas empresariales.",
      "Conexión con dominio propio.",
      "Configuración de seguridad básica y acceso en dispositivos.",
      "Acompañamiento para migrar o iniciar desde cero.",
    ],
    icon: Mail,
  },
  {
    slug: "dominios",
    title: "Dominios",
    copy: "Registro, configuración y conexión de dominios para que tu marca tenga una dirección profesional en internet.",
    detail:
      "Te ayudamos a elegir, registrar y configurar el dominio de tu negocio para conectarlo con tu sitio web, correos corporativos y servicios digitales.",
    outcome: "Tu marca con una dirección propia, clara y lista para operar en internet.",
    features: [
      "Búsqueda y selección de dominio disponible.",
      "Configuración de DNS para web, correo y servicios externos.",
      "Conexión con sitio web, tienda en línea o correos corporativos.",
      "Acompañamiento para renovaciones y administración básica.",
    ],
    icon: Globe2,
  },
  {
    slug: "google-workspace",
    title: "Google Workspace",
    copy: "Implementación de Gmail empresarial, Drive, Meet, Calendario y administración de usuarios para tu equipo.",
    detail:
      "Ayudamos a tu equipo a trabajar con herramientas de Google Workspace configuradas correctamente para colaborar, reunirse y administrar información.",
    outcome: "Un espacio de trabajo digital para operar con más orden y colaboración.",
    features: [
      "Configuración de Gmail empresarial.",
      "Administración de usuarios y permisos.",
      "Organización inicial de Drive, Calendario y Meet.",
      "Soporte para adopción y buenas prácticas de uso.",
    ],
    icon: PanelsTopLeft,
  },
];

export type ServiceItem = (typeof serviceItems)[number];
