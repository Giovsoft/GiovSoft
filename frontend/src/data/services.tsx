import {
  Clapperboard,
  Globe2,
  Mail,
  Megaphone,
  MonitorSmartphone,
  Network,
  PanelsTopLeft,
  ServerCog,
  ShoppingCart,
  Smartphone,
  UsersRound,
} from "lucide-react";

export const serviceCategories = [
  {
    id: "estrategia",
    title: "Estrategia integral",
    copy: "Acompañamiento para ordenar y conectar toda la operación digital.",
  },
  {
    id: "desarrollo",
    title: "Desarrollo digital",
    copy: "Canales digitales para presentar, vender y hacer crecer tu negocio.",
  },
  {
    id: "infraestructura",
    title: "Infraestructura y productividad",
    copy: "Servicios técnicos para operar con continuidad, seguridad y colaboración.",
  },
  {
    id: "marketing",
    title: "Marketing y comunicación",
    copy: "Contenido, comunidad y campañas para fortalecer la presencia de tu marca.",
  },
] as const;

export const serviceItems = [
  {
    slug: "giovsoft-360",
    category: "estrategia",
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
    category: "desarrollo",
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
    category: "desarrollo",
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
    slug: "desarrollo-aplicaciones-moviles",
    category: "desarrollo",
    title: "Desarrollo de aplicaciones móviles",
    copy: "Aplicaciones para Android y iOS diseñadas alrededor de tus usuarios, procesos y objetivos de negocio.",
    detail:
      "Diseñamos y desarrollamos aplicaciones móviles para Android y iOS, desde la definición de la experiencia hasta la integración con servicios, publicación y evolución del producto.",
    outcome: "Una aplicación móvil útil, estable y preparada para crecer junto con tu operación.",
    features: [
      "Definición funcional, flujos de usuario y alcance del producto.",
      "Diseño de experiencia e interfaz adaptable a Android y iOS.",
      "Desarrollo multiplataforma o nativo según las necesidades del proyecto.",
      "Integración con APIs, bases de datos, autenticación, pagos o servicios externos.",
      "Pruebas en dispositivos y preparación para Google Play y App Store.",
      "Acompañamiento posterior para mantenimiento, métricas y nuevas versiones.",
    ],
    icon: Smartphone,
  },
  {
    slug: "hosting-administrado",
    category: "infraestructura",
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
    category: "infraestructura",
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
    category: "infraestructura",
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
    category: "infraestructura",
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
  {
    slug: "videos-publicitarios",
    category: "marketing",
    title: "Videos publicitarios",
    copy: "Contenido audiovisual para presentar productos, servicios y campañas con una narrativa clara y profesional.",
    detail:
      "Planeamos y producimos videos publicitarios adaptados a redes sociales, anuncios y canales digitales, cuidando el mensaje, el formato y la identidad visual de tu marca.",
    outcome: "Piezas audiovisuales listas para captar atención y comunicar el valor de tu negocio.",
    features: [
      "Definición del objetivo, audiencia y mensaje principal.",
      "Guion, estructura narrativa y propuesta visual.",
      "Edición, musicalización, textos y adaptación de identidad de marca.",
      "Versiones verticales, cuadradas u horizontales según el canal.",
      "Entregables preparados para campañas y publicaciones orgánicas.",
    ],
    icon: Clapperboard,
  },
  {
    slug: "community-management",
    category: "marketing",
    title: "Community Management",
    copy: "Gestión profesional de redes sociales para mantener una comunicación constante, coherente y cercana.",
    detail:
      "Administramos la presencia de tu marca en redes sociales mediante planeación de contenido, publicaciones, seguimiento de comunidad y reportes que ayudan a tomar mejores decisiones.",
    outcome: "Una comunidad atendida y una comunicación digital alineada con los objetivos de tu marca.",
    features: [
      "Calendario editorial y definición de pilares de contenido.",
      "Redacción, diseño y programación de publicaciones.",
      "Atención inicial de comentarios y mensajes conforme al protocolo acordado.",
      "Seguimiento de alcance, interacción y crecimiento de comunidad.",
      "Reporte periódico con aprendizajes y recomendaciones.",
    ],
    icon: UsersRound,
  },
  {
    slug: "pautas-publicitarias",
    category: "marketing",
    title: "Pautas publicitarias",
    copy: "Campañas digitales segmentadas para generar alcance, prospectos, ventas o reconocimiento de marca.",
    detail:
      "Diseñamos, configuramos y optimizamos campañas de publicidad digital con objetivos medibles, audiencias definidas y seguimiento continuo del presupuesto.",
    outcome: "Inversión publicitaria acompañada por una estrategia, medición y optimización constante.",
    features: [
      "Definición de objetivos, audiencias, presupuesto y duración.",
      "Configuración de campañas en plataformas compatibles.",
      "Adaptación de anuncios, textos y piezas creativas.",
      "Seguimiento de resultados y optimización durante la campaña.",
      "Reporte de inversión, alcance, conversiones y oportunidades de mejora.",
    ],
    icon: Megaphone,
  },
  {
    slug: "infraestructura-de-red",
    category: "infraestructura",
    title: "Infraestructura de red",
    copy: "Diseño, instalación y organización de redes para conectar equipos, usuarios y servicios con estabilidad y seguridad.",
    detail:
      "Planeamos e implementamos infraestructura de red para oficinas y espacios operativos, considerando cobertura, cableado, conectividad, segmentación y capacidad de crecimiento.",
    outcome: "Una red organizada, documentada y preparada para sostener la operación de tu negocio.",
    features: [
      "Levantamiento de necesidades, espacios y dispositivos.",
      "Diseño de topología, cobertura y crecimiento previsto.",
      "Instalación y organización de cableado y equipos de red.",
      "Configuración inicial de routers, switches y puntos de acceso compatibles.",
      "Pruebas, documentación y recomendaciones de seguridad y mantenimiento.",
    ],
    icon: Network,
  },
];

export type ServiceItem = (typeof serviceItems)[number];
