import {
  Activity,
  AppWindow,
  ArrowRight,
  BarChart3,
  Cable,
  CalendarDays,
  CheckCircle2,
  CloudCog,
  Cloud,
  Code2,
  CreditCard,
  DatabaseZap,
  FolderOpen,
  Gauge,
  Globe2,
  HeartHandshake,
  Inbox,
  KeyRound,
  LockKeyhole,
  Map,
  MailCheck,
  Megaphone,
  MessageSquareText,
  MonitorSmartphone,
  Package,
  PanelsTopLeft,
  SearchCheck,
  ServerCog,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  Target,
  TestTube2,
  Truck,
  UsersRound,
  Video,
  Wifi,
  Workflow,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Navigate, useParams } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { serviceItems } from "../data/services";
import { useSiteTheme } from "../hooks/useSiteTheme";

const whatsappMessage = encodeURIComponent(
  "Hola GiovSoft, quiero información sobre sus servicios digitales."
);
const whatsappUrl = `https://wa.me/525566042994?text=${whatsappMessage}`;

const websiteQuality = [
  {
    title: "Desarrollo de calidad",
    copy: "Código ordenado, componentes reutilizables y una base preparada para crecer sin rehacer todo después.",
    icon: Code2,
  },
  {
    title: "SEO inicial",
    copy: "Estructura, contenido, títulos y rendimiento pensados para que Google entienda mejor tu sitio.",
    icon: SearchCheck,
  },
  {
    title: "Carga rápida",
    copy: "Optimizamos imágenes, estilos y estructura para que tus visitantes no esperen de más.",
    icon: Gauge,
  },
  {
    title: "Responsive real",
    copy: "Diseño cuidado para celular, tablet y escritorio, con textos y botones cómodos de usar.",
    icon: Smartphone,
  },
];

const ecommerceHighlights = [
  {
    title: "Catálogo ordenado",
    copy: "Productos, categorías, variantes e información clara para que el cliente encuentre rápido lo que busca.",
    icon: Package,
  },
  {
    title: "Compra simple",
    copy: "Flujo de carrito pensado para reducir fricción y llevar al cliente del interés al pedido.",
    icon: ShoppingBag,
  },
  {
    title: "Pagos integrados",
    copy: "Conectamos pasarelas como Stripe, Mercado Pago u opciones compatibles con tu operación.",
    icon: CreditCard,
  },
  {
    title: "Envíos conectados",
    copy: "Preparamos integraciones con Skydrop, Envia.com u operadores logísticos según el alcance.",
    icon: Truck,
  },
  {
    title: "Operación medible",
    copy: "Base lista para revisar pedidos, pagos, envíos y oportunidades de crecimiento con más claridad.",
    icon: BarChart3,
  },
];

const ecommerceIntegrations = [
  "Stripe",
  "Mercado Pago",
  "Skydrop",
  "Envia.com",
  "WhatsApp",
];

const mailHighlights = [
  {
    title: "Dominio propio",
    copy: "Cuentas con el nombre de tu empresa para que cada mensaje transmita confianza.",
    icon: Globe2,
  },
  {
    title: "Configuración segura",
    copy: "Ajustamos accesos, registros y buenas prácticas básicas para proteger la comunicación.",
    icon: ShieldCheck,
  },
  {
    title: "Uso en dispositivos",
    copy: "Dejamos el correo listo para trabajar desde computadora, celular o navegador.",
    icon: Smartphone,
  },
  {
    title: "Imagen profesional",
    copy: "Ordenamos la presentación de tu negocio desde el primer contacto con clientes.",
    icon: MailCheck,
  },
];

const hostingHighlights = [
  { title: "Entorno administrado", copy: "Configuramos y cuidamos la infraestructura necesaria para operar tu proyecto.", icon: ServerCog },
  { title: "Respaldos", copy: "Programamos copias de seguridad conforme a la frecuencia incluida en tu plan.", icon: DatabaseZap },
  { title: "Continuidad", copy: "Supervisamos disponibilidad y atendemos incidencias dentro del alcance contratado.", icon: Gauge },
  { title: "Buenas prácticas", copy: "Aplicamos actualizaciones y configuraciones técnicas para reducir riesgos operativos.", icon: ShieldCheck },
];

const domainHighlights = [
  {
    title: "Nombre de marca",
    copy: "Buscamos una dirección clara, fácil de recordar y alineada con tu negocio.",
    icon: Globe2,
  },
  {
    title: "DNS configurado",
    copy: "Conectamos registros para web, correo y servicios digitales sin dejar piezas sueltas.",
    icon: DatabaseZap,
  },
  {
    title: "Conexión completa",
    copy: "Tu dominio queda listo para sitio web, ecommerce, correos corporativos o Workspace.",
    icon: Wifi,
  },
  {
    title: "Continuidad",
    copy: "Te acompañamos para cuidar renovaciones, accesos y configuración básica del dominio.",
    icon: ShieldCheck,
  },
];

const workspaceHighlights = [
  {
    title: "Gmail empresarial",
    copy: "Correo profesional con dominio propio y configuración lista para tu equipo.",
    icon: MailCheck,
  },
  {
    title: "Drive organizado",
    copy: "Estructura inicial para documentos, carpetas y permisos de trabajo.",
    icon: FolderOpen,
  },
  {
    title: "Reuniones y agenda",
    copy: "Meet y Calendario preparados para coordinar citas, equipo y clientes.",
    icon: CalendarDays,
  },
  {
    title: "Usuarios y permisos",
    copy: "Alta de cuentas, accesos y administración básica para operar con control.",
    icon: UsersRound,
  },
];

const giovsoft360Highlights = [
  {
    title: "Ruta clara",
    copy: "Definimos qué necesita tu negocio, qué va primero y cómo construir sin perder tiempo.",
    icon: SearchCheck,
  },
  {
    title: "Base digital completa",
    copy: "Integramos sitio o tienda, dominio, correo y herramientas de trabajo en un mismo paquete.",
    icon: PanelsTopLeft,
  },
  {
    title: "Acompañamiento",
    copy: "Te guiamos durante la implementación y después del lanzamiento para seguir mejorando.",
    icon: UsersRound,
  },
  {
    title: "Evolución continua",
    copy: "Medimos, ajustamos y preparamos nuevas funciones conforme crece tu operación.",
    icon: Settings2,
  },
];

const marketingModules = {
  "videos-publicitarios": {
    kicker: "Producción audiovisual estratégica",
    title: "Videos pensados para comunicar, captar atención y mover a la acción.",
    intro: "Convertimos una idea comercial en una pieza lista para campañas y redes: definimos el mensaje, ordenamos la historia y adaptamos el resultado a cada formato digital.",
    accent: "video",
    metrics: [["9:16", "Reels, Stories y TikTok"], ["1:1", "Feeds y anuncios cuadrados"], ["16:9", "YouTube, web y presentaciones"]],
    pillars: [
      { title: "Concepto y guion", copy: "Objetivo, audiencia, argumento, llamada a la acción y estructura antes de editar.", icon: MessageSquareText },
      { title: "Edición profesional", copy: "Ritmo, selección de tomas, color, audio, música, gráficos y textos de apoyo.", icon: Video },
      { title: "Identidad de marca", copy: "Tipografía, colores, logotipo y tono visual aplicados con consistencia.", icon: PanelsTopLeft },
      { title: "Versiones por canal", copy: "Entregables adaptados para publicación orgánica, pauta, web o presentación.", icon: Smartphone },
    ],
    process: ["Brief y objetivo", "Guion y propuesta", "Producción y edición", "Revisión y entregables"],
    deliverables: ["Guion técnico", "Video maestro", "Versiones por formato", "Subtítulos", "Miniatura o portada", "Archivos listos para publicar"],
    note: "El alcance de grabación, locación, talento, locución y material de archivo se define en cada propuesta.",
  },
  "community-management": {
    kicker: "Gestión de comunidad y contenido",
    title: "Una presencia constante, organizada y alineada con la voz de tu marca.",
    intro: "Diseñamos una operación mensual para planear, producir, publicar y aprender. La comunidad recibe atención con criterios claros y el negocio obtiene visibilidad de lo que funciona.",
    accent: "community",
    metrics: [["Plan", "Calendario editorial mensual"], ["Voz", "Lineamientos de comunicación"], ["Datos", "Reporte y recomendaciones"]],
    pillars: [
      { title: "Estrategia editorial", copy: "Pilares, temas, formatos, frecuencia y objetivos por canal.", icon: CalendarDays },
      { title: "Contenido de marca", copy: "Copies y piezas visuales adaptadas al lenguaje de cada plataforma.", icon: PanelsTopLeft },
      { title: "Atención de comunidad", copy: "Comentarios y mensajes atendidos con protocolos, horarios y escalamiento acordados.", icon: HeartHandshake },
      { title: "Aprendizaje continuo", copy: "Lectura de alcance, interacción, crecimiento y oportunidades para ajustar el plan.", icon: BarChart3 },
    ],
    process: ["Diagnóstico de marca", "Plan editorial", "Producción y publicación", "Monitoreo y reporte"],
    deliverables: ["Calendario de contenido", "Copies", "Piezas gráficas", "Programación", "Protocolo de atención", "Reporte mensual"],
    note: "La cantidad de publicaciones, redes atendidas, sesiones de contenido y horario de moderación se determina en el plan contratado.",
  },
  "pautas-publicitarias": {
    kicker: "Publicidad digital medible",
    title: "Campañas con objetivos, audiencias y presupuesto bajo control.",
    intro: "Transformamos el presupuesto publicitario en un sistema de prueba y optimización: configuramos campañas, revisamos señales de desempeño y documentamos decisiones.",
    accent: "ads",
    metrics: [["Objetivo", "Alcance, prospectos o ventas"], ["Audiencia", "Segmentación y remarketing"], ["Control", "Seguimiento de inversión"]],
    pillars: [
      { title: "Planeación de campaña", copy: "Objetivo, oferta, embudo, presupuesto, duración y métricas de referencia.", icon: Target },
      { title: "Configuración técnica", copy: "Estructura de campañas, grupos, audiencias, ubicaciones y eventos disponibles.", icon: Settings2 },
      { title: "Creativos y mensajes", copy: "Variaciones de textos, formatos y llamadas a la acción para probar enfoques.", icon: Megaphone },
      { title: "Optimización", copy: "Seguimiento de costo, respuesta y conversiones para ajustar inversión y segmentación.", icon: BarChart3 },
    ],
    process: ["Objetivo y presupuesto", "Configuración y creativos", "Lanzamiento y pruebas", "Optimización y reporte"],
    deliverables: ["Plan de medios", "Configuración de campañas", "Audiencias", "Variaciones creativas", "Monitoreo", "Reporte de resultados"],
    note: "La inversión pagada directamente a las plataformas no está incluida en los honorarios de gestión. Los resultados dependen de la oferta, el mercado, el presupuesto y el proceso comercial del cliente.",
  },
} as const;

const networkPillars = [
  { title: "Diagnóstico técnico", copy: "Revisamos espacios, usuarios, dispositivos, cobertura, enlaces y necesidades de crecimiento.", icon: SearchCheck },
  { title: "Diseño de red", copy: "Proponemos topología, puntos de acceso, cableado, equipos, segmentación y capacidad.", icon: Map },
  { title: "Implementación", copy: "Instalamos, organizamos, identificamos y configuramos los componentes incluidos en el proyecto.", icon: Cable },
  { title: "Pruebas y documentación", copy: "Validamos conectividad y dejamos inventario, esquema y recomendaciones de continuidad.", icon: Activity },
];

const mobileAppCapabilities = [
  { title: "Producto y experiencia", copy: "Definimos usuarios, recorridos, prioridades y una interfaz coherente antes de desarrollar.", icon: AppWindow },
  { title: "Android y iOS", copy: "Creamos una experiencia consistente respetando patrones, permisos y comportamientos de cada plataforma.", icon: Smartphone },
  { title: "Backend e integraciones", copy: "Conectamos APIs, bases de datos, pagos, mapas, notificaciones y servicios de tu operación.", icon: CloudCog },
  { title: "Calidad y seguridad", copy: "Probamos flujos críticos, accesos, datos y funcionamiento en distintos tamaños de pantalla.", icon: ShieldCheck },
];

const mobileAppProcess = [
  ["01", "Descubrimiento", "Objetivos, usuarios, funciones y alcance inicial."],
  ["02", "UX/UI y prototipo", "Flujos, pantallas y validación de la experiencia."],
  ["03", "Desarrollo", "Aplicación, backend, integraciones y revisiones."],
  ["04", "Pruebas", "Dispositivos, rendimiento, seguridad y correcciones."],
  ["05", "Publicación", "Preparación de fichas y acompañamiento en tiendas."],
  ["06", "Evolución", "Métricas, mantenimiento y nuevas versiones."],
];

const codeLines = [
  "<head>",
  "  <title>Tu negocio</title>",
  "  <meta name=\"description\" />",
  "</head>",
];

export default function ServicePage() {
  const { slug } = useParams();
  const { isDark, toggleTheme } = useSiteTheme();
  const service = serviceItems.find((item) => item.slug === slug);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  const Icon = service.icon;
  const isWebsiteService = service.slug === "sitios-web";
  const isEcommerceService = service.slug === "ecommerce";
  const isMailService = service.slug === "correos-corporativos";
  const isHostingService = service.slug === "hosting-administrado";
  const isDomainService = service.slug === "dominios";
  const isWorkspaceService = service.slug === "google-workspace";
  const isGiovsoft360Service = service.slug === "giovsoft-360";
  const marketingModule = marketingModules[service.slug as keyof typeof marketingModules];
  const isNetworkService = service.slug === "infraestructura-de-red";
  const isMobileAppService = service.slug === "desarrollo-aplicaciones-moviles";

  return (
    <div className={`service-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="service-detail">
        <section className="service-detail-hero">
          <div>
            <p className="site-kicker">Servicio GiovSoft</p>
            <h1>{service.title}</h1>
            <p>{service.detail}</p>

            <div className="service-detail-actions">
              <a
                className="site-primary-button"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Enviar mensaje
                <ArrowRight size={17} />
              </a>
              <a className="site-secondary-button" href="mailto:hola@giovsoft.com">
                hola@giovsoft.com
                <LockKeyhole size={17} />
              </a>
            </div>
          </div>

          <div className="service-detail-card" aria-hidden="true">
            <Icon size={42} />
            <strong>{service.outcome}</strong>
          </div>
        </section>

        {isWebsiteService && (
          <section className="website-showcase">
            <div className="website-showcase-copy">
              <p className="site-kicker">Sitios web de calidad</p>
              <h2>Diseñamos para que tu negocio se vea bien y funcione mejor.</h2>
              <p>
                No se trata solo de publicar una página: cuidamos estructura,
                velocidad, claridad visual y SEO inicial para construir una presencia
                digital que genere confianza desde el primer clic.
              </p>
            </div>

            <div className="website-web-preview" aria-hidden="true">
              <div className="web-preview-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="web-preview-body">
                <div className="web-preview-sidebar">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="web-preview-content">
                  <span className="web-preview-title" />
                  <span />
                  <span />
                  <div className="web-preview-grid">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
              <div className="web-preview-badges">
                <strong>SEO</strong>
                <strong>98</strong>
                <strong>Mobile</strong>
              </div>
            </div>

            <div className="website-tech-panel" aria-hidden="true">
              <div className="browser-topbar">
                <span />
                <span />
                <span />
              </div>
              <div className="browser-content">
                <div className="browser-code">
                  {codeLines.map((line) => (
                    <span key={line} style={{ "--characters": line.length } as CSSProperties}>
                      {line}
                    </span>
                  ))}
                </div>
                <div className="quality-radar">
                  <Globe2 size={24} />
                  <strong>SEO + Performance</strong>
                </div>
              </div>
            </div>

            <div className="website-quality-grid">
              {websiteQuality.map((item) => {
                const QualityIcon = item.icon;

                return (
                  <article key={item.title}>
                    <QualityIcon size={22} />
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                );
              })}
            </div>

          </section>
        )}

        {isEcommerceService && (
          <section className="commerce-showcase">
            <div className="commerce-showcase-copy">
              <p className="site-kicker">Ecommerce para negocios en crecimiento</p>
              <h2>Convierte tus productos en una experiencia de compra clara.</h2>
              <p>
                Diseñamos tiendas en línea que ayudan a vender con orden:
                catálogo fácil de navegar, carrito claro, contacto rápido y una
                base lista para crecer conforme tu operación avance.
              </p>
            </div>

            <div className="commerce-dashboard" aria-hidden="true">
              <div className="commerce-dashboard-header">
                <span />
                <span />
                <strong>Tienda activa</strong>
              </div>

              <div className="commerce-storefront">
                <div className="commerce-product-card commerce-product-card-featured">
                  <Store size={22} />
                  <span>Producto destacado</span>
                  <strong>$ 899</strong>
                </div>
                <div className="commerce-product-card">
                  <span />
                  <strong>$ 349</strong>
                </div>
                <div className="commerce-product-card">
                  <span />
                  <strong>$ 520</strong>
                </div>
              </div>

              <div className="commerce-order-flow">
                <div>
                  <ShoppingBag size={20} />
                  <span>Carrito</span>
                </div>
                <i />
                <div>
                  <CreditCard size={20} />
                  <span>Pago</span>
                </div>
                <i />
                <div>
                  <Truck size={20} />
                  <span>Entrega</span>
                </div>
              </div>

              <div className="commerce-integrations">
                {ecommerceIntegrations.map((integration) => (
                  <span key={integration}>{integration}</span>
                ))}
              </div>
            </div>

            <div className="commerce-metrics" aria-hidden="true">
              <article>
                <strong>24/7</strong>
                <span>ventas disponibles</span>
              </article>
              <article>
                <strong>+ canales</strong>
                <span>web, redes y WhatsApp</span>
              </article>
              <article>
                <strong>Pedidos</strong>
                <span>más orden para operar</span>
              </article>
            </div>

            <div className="commerce-quality-grid">
              {ecommerceHighlights.map((item) => {
                const HighlightIcon = item.icon;

                return (
                  <article key={item.title}>
                    <HighlightIcon size={22} />
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {isMailService && (
          <section className="mail-showcase">
            <div className="mail-showcase-copy">
              <p className="site-kicker">Correos corporativos</p>
              <h2>Comunica tu negocio con una identidad profesional.</h2>
              <p>
                Configuramos correos con dominio propio para que tu empresa se
                vea confiable, mantenga conversaciones ordenadas y pueda operar
                desde los dispositivos que usa todos los días.
              </p>
            </div>

            <div className="mail-inbox-panel" aria-hidden="true">
              <div className="mail-inbox-top">
                <Inbox size={22} />
                <strong>contacto@tuempresa.com</strong>
                <span>Seguro</span>
              </div>

              <div className="mail-message-list">
                <article className="is-active">
                  <span />
                  <div>
                    <strong>Nuevo cliente</strong>
                    <small>Solicitud recibida desde tu sitio web</small>
                  </div>
                  <CheckCircle2 size={18} />
                </article>
                <article>
                  <span />
                  <div>
                    <strong>Proveedor</strong>
                    <small>Cotizacion y seguimiento</small>
                  </div>
                </article>
                <article>
                  <span />
                  <div>
                    <strong>Equipo interno</strong>
                    <small>Operación y pendientes</small>
                  </div>
                </article>
              </div>

              <div className="mail-domain-card">
                <Globe2 size={22} />
                <div>
                  <strong>@tuempresa.com</strong>
                  <span>Dominio conectado</span>
                </div>
              </div>
            </div>

            <div className="mail-security-stack" aria-hidden="true">
              <article>
                <ShieldCheck size={22} />
                <strong>SPF</strong>
                <span>Verificado</span>
              </article>
              <article>
                <LockKeyhole size={22} />
                <strong>DKIM</strong>
                <span>Activo</span>
              </article>
              <article>
                <MailCheck size={22} />
                <strong>MX</strong>
                <span>Configurado</span>
              </article>
            </div>

            <div className="mail-quality-grid">
              {mailHighlights.map((item) => {
                const HighlightIcon = item.icon;

                return (
                  <article key={item.title}>
                    <HighlightIcon size={22} />
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {isHostingService && (
          <section className="hosting-showcase">
            <div className="hosting-showcase-copy">
              <p className="site-kicker">Hosting administrado</p>
              <h2>La infraestructura de tu proyecto, acompañada por GiovSoft.</h2>
              <p>
                Nos encargamos de la operación técnica del alojamiento para que tu
                sitio o aplicación tenga una base estable, respaldada y preparada para
                evolucionar conforme cambien sus necesidades.
              </p>
            </div>

            <div className="hosting-server-visual" aria-hidden="true">
              <div className="hosting-status"><i /> Servicio activo</div>
              <div className="hosting-server-stack">
                <article><ServerCog size={21} /><span><strong>Aplicación</strong><small>Entorno administrado</small></span><i /></article>
                <article><DatabaseZap size={21} /><span><strong>Respaldos</strong><small>Copias programadas</small></span><i /></article>
                <article><Cloud size={21} /><span><strong>Infraestructura</strong><small>Recursos preparados</small></span><i /></article>
              </div>
              <div className="hosting-pulse"><span /><span /><span /><span /><span /><span /></div>
            </div>

            <div className="hosting-quality-grid">
              {hostingHighlights.map((item) => {
                const HighlightIcon = item.icon;
                return <article key={item.title}><HighlightIcon size={22} /><h3>{item.title}</h3><p>{item.copy}</p></article>;
              })}
            </div>
          </section>
        )}

        {isDomainService && (
          <section className="domain-showcase">
            <div className="domain-showcase-copy">
              <p className="site-kicker">Dominios para tu marca</p>
              <h2>El punto de partida para que tu negocio exista en internet.</h2>
              <p>
                Un buen dominio hace que tus clientes te encuentren, te recuerden
                y confíen más en tu marca. Lo registramos y configuramos para que
                funcione con tu web, correos y servicios digitales.
              </p>
            </div>

            <div className="domain-orbit-panel" aria-hidden="true">
              <div className="domain-search-bar">
                <Globe2 size={20} />
                <span>tunegocio.com</span>
                <strong>Disponible</strong>
              </div>

              <div className="domain-orbit">
                <div className="domain-core">
                  <strong>.com</strong>
                  <span>marca propia</span>
                </div>
                <i className="domain-node domain-node-web">Web</i>
                <i className="domain-node domain-node-mail">Mail</i>
                <i className="domain-node domain-node-store">Shop</i>
              </div>

              <div className="domain-records">
                <article>
                  <span>A</span>
                  <strong>Sitio web</strong>
                </article>
                <article>
                  <span>MX</span>
                  <strong>Correo</strong>
                </article>
                <article>
                  <span>TXT</span>
                  <strong>Verificacion</strong>
                </article>
              </div>
            </div>

            <div className="domain-timeline" aria-hidden="true">
              <article>
                <span>01</span>
                <strong>Buscamos</strong>
              </article>
              <article>
                <span>02</span>
                <strong>Registramos</strong>
              </article>
              <article>
                <span>03</span>
                <strong>Conectamos</strong>
              </article>
            </div>

            <div className="domain-quality-grid">
              {domainHighlights.map((item) => {
                const HighlightIcon = item.icon;

                return (
                  <article key={item.title}>
                    <HighlightIcon size={22} />
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {isWorkspaceService && (
          <section className="workspace-showcase">
            <div className="workspace-showcase-copy">
              <p className="site-kicker">Google Workspace</p>
              <h2>Un espacio digital para que tu equipo trabaje con orden.</h2>
              <p>
                Configuramos Gmail empresarial, Drive, Meet, Calendario y usuarios
                para que tu empresa pueda comunicarse, compartir archivos y coordinar
                actividades desde una base profesional.
              </p>
            </div>

            <div className="workspace-command-center" aria-hidden="true">
              <div className="workspace-app-rail">
                <span className="workspace-app-dot app-mail" />
                <span className="workspace-app-dot app-drive" />
                <span className="workspace-app-dot app-meet" />
                <span className="workspace-app-dot app-calendar" />
              </div>

              <div className="workspace-panel">
                <div className="workspace-panel-top">
                  <Cloud size={21} />
                  <strong>Equipo GiovSoft</strong>
                  <span>Activo</span>
                </div>

                <div className="workspace-board">
                  <article>
                    <MailCheck size={20} />
                    <strong>Gmail</strong>
                    <span>contacto@empresa.com</span>
                  </article>
                  <article>
                    <FolderOpen size={20} />
                    <strong>Drive</strong>
                    <span>Carpetas y permisos</span>
                  </article>
                  <article>
                    <Video size={20} />
                    <strong>Meet</strong>
                    <span>Reuniones listas</span>
                  </article>
                  <article>
                    <CalendarDays size={20} />
                    <strong>Calendario</strong>
                    <span>Agenda compartida</span>
                  </article>
                </div>
              </div>
            </div>

            <div className="workspace-admin-stack" aria-hidden="true">
              <article>
                <UsersRound size={22} />
                <strong>Usuarios</strong>
                <span>Alta y permisos</span>
              </article>
              <article>
                <ShieldCheck size={22} />
                <strong>Seguridad</strong>
                <span>Accesos cuidados</span>
              </article>
              <article>
                <Cloud size={22} />
                <strong>Colaboracion</strong>
                <span>Archivos y reuniones</span>
              </article>
            </div>

            <div className="workspace-quality-grid">
              {workspaceHighlights.map((item) => {
                const HighlightIcon = item.icon;

                return (
                  <article key={item.title}>
                    <HighlightIcon size={22} />
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {isGiovsoft360Service && (
          <section className="suite-showcase">
            <div className="suite-showcase-copy">
              <p className="site-kicker">GiovSoft 360</p>
              <h2>Todo tu ecosistema digital acompañado por un aliado.</h2>
              <p>
                Creamos el paquete digital que tu empresa necesita para iniciar
                o crecer: presencia web, ventas, dominio, correo, herramientas
                de trabajo y soporte para avanzar con orden.
              </p>
            </div>

            <div className="suite-hub-panel" aria-hidden="true">
              <div className="suite-hub-core">
                <strong>360</strong>
                <span>acompañamiento</span>
              </div>
              <article className="suite-hub-node node-web">
                <MonitorSmartphone size={20} />
                <span>Sitio web</span>
              </article>
              <article className="suite-hub-node node-shop">
                <ShoppingBag size={20} />
                <span>Ecommerce</span>
              </article>
              <article className="suite-hub-node node-domain">
                <Globe2 size={20} />
                <span>Dominio</span>
              </article>
              <article className="suite-hub-node node-mail">
                <MailCheck size={20} />
                <span>Correos</span>
              </article>
              <article className="suite-hub-node node-workspace">
                <Cloud size={20} />
                <span>Workspace</span>
              </article>
            </div>

            <div className="suite-roadmap" aria-hidden="true">
              <article>
                <span>01</span>
                <strong>Diagnóstico</strong>
              </article>
              <article>
                <span>02</span>
                <strong>Implementación</strong>
              </article>
              <article>
                <span>03</span>
                <strong>Lanzamiento</strong>
              </article>
              <article>
                <span>04</span>
                <strong>Mejora continua</strong>
              </article>
            </div>

            <div className="suite-quality-grid">
              {giovsoft360Highlights.map((item) => {
                const HighlightIcon = item.icon;

                return (
                  <article key={item.title}>
                    <HighlightIcon size={22} />
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {isMobileAppService && (
          <section className="mobile-app-showcase">
            <div className="mobile-app-intro">
              <div>
                <p className="site-kicker">Producto móvil de principio a fin</p>
                <h2>Una aplicación útil para tus usuarios y sostenible para tu negocio.</h2>
              </div>
              <p>No empezamos por las pantallas: comenzamos por el problema, los usuarios y la operación que existe detrás. Así construimos un producto con prioridades claras, una experiencia consistente y una arquitectura preparada para evolucionar.</p>
            </div>

            <div className="mobile-app-platform-stage" aria-hidden="true">
              <div className="mobile-device mobile-device-android">
                <div className="mobile-device-bar"><span /><span /></div>
                <div className="mobile-device-welcome"><i>G</i><small>Bienvenido</small><strong>Tu operación,<br />en movimiento.</strong></div>
                <div className="mobile-device-cards"><span /><span /><span /></div>
                <div className="mobile-device-nav"><i /><i /><i /></div>
              </div>
              <div className="mobile-device mobile-device-ios">
                <div className="mobile-device-island" />
                <div className="mobile-device-welcome"><i>G</i><small>Resumen</small><strong>Todo lo importante<br />en un solo lugar.</strong></div>
                <div className="mobile-device-chart"><span /><span /><span /><span /><span /></div>
                <div className="mobile-device-action">Nueva actividad <ArrowRight size={14} /></div>
              </div>
              <div className="mobile-platform-label label-android"><Smartphone size={17} /><span><strong>Android</strong>Google Play</span></div>
              <div className="mobile-platform-label label-ios"><AppWindow size={17} /><span><strong>iOS</strong>App Store</span></div>
              <div className="mobile-platform-cloud"><CloudCog size={22} /><span><strong>Servicios conectados</strong>API · Datos · Integraciones</span></div>
            </div>

            <div className="mobile-app-facts">
              <article><strong>2 plataformas</strong><span>Android y iOS</span></article>
              <article><strong>1 producto</strong><span>Experiencia coherente</span></article>
              <article><strong>Base escalable</strong><span>Preparada para nuevas versiones</span></article>
            </div>

            <div className="mobile-app-section-head"><span>01</span><div><p className="site-kicker">Capacidades</p><h2>Todo lo necesario para convertir una idea en producto.</h2></div></div>
            <div className="mobile-app-capability-grid">
              {mobileAppCapabilities.map((item) => { const CapabilityIcon = item.icon; return <article key={item.title}><CapabilityIcon size={24} /><h3>{item.title}</h3><p>{item.copy}</p></article>; })}
            </div>

            <div className="mobile-app-architecture">
              <div><p className="site-kicker">La tecnología detrás de la aplicación</p><h2>Lo que conecta y hace funcionar tu app.</h2><p>Además de diseñar las pantallas, construimos la parte técnica que guarda información, identifica usuarios y comunica la aplicación con pagos, mapas, mensajes y otros sistemas.</p></div>
              <div className="mobile-app-integration-list">
                <span><KeyRound size={18} /><b>Usuarios y accesos</b><small>Inicio de sesión, perfiles y permisos.</small></span>
                <span><DatabaseZap size={18} /><b>Información actualizada</b><small>Datos guardados y sincronizados.</small></span>
                <span><CreditCard size={18} /><b>Cobros dentro de la app</b><small>Pagos, planes o suscripciones.</small></span>
                <span><Map size={18} /><b>Ubicación y recorridos</b><small>Mapas, direcciones y geolocalización.</small></span>
                <span><MessageSquareText size={18} /><b>Comunicación</b><small>Notificaciones, avisos y mensajes.</small></span>
                <span><BarChart3 size={18} /><b>Medición de uso</b><small>Eventos, actividad y métricas.</small></span>
              </div>
            </div>

            <div className="mobile-app-delivery">
              <div><p className="site-kicker">Proceso especializado</p><h2>Seis etapas para diseñar, validar y lanzar.</h2></div>
              <ol>{mobileAppProcess.map(([number, title, copy]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><small>{copy}</small></div></li>)}</ol>
            </div>

            <div className="mobile-app-quality">
              <TestTube2 size={25} />
              <div><p className="site-kicker">Antes de publicar</p><h2>Probamos los recorridos que sostienen la experiencia.</h2></div>
              <ul><li><CheckCircle2 />Flujos y estados de error</li><li><CheckCircle2 />Tamaños de pantalla</li><li><CheckCircle2 />Permisos y accesos</li><li><CheckCircle2 />Rendimiento y estabilidad</li></ul>
            </div>
            <p className="growth-scope-note"><ShieldCheck size={18} />Las cuentas de desarrollador, costos de las tiendas, servicios externos y tiempos de revisión de Apple o Google se consideran por separado según el alcance del proyecto.</p>
          </section>
        )}

        {marketingModule && (
          <section className={`growth-showcase growth-${marketingModule.accent}`}>
            <div className="growth-intro">
              <p className="site-kicker">{marketingModule.kicker}</p>
              <h2>{marketingModule.title}</h2>
              <p>{marketingModule.intro}</p>
            </div>

            <div className="growth-command" aria-hidden="true">
              <div className="growth-command-head"><span>GiovSoft Growth Studio</span><strong>Proyecto activo</strong></div>
              <div className="growth-command-main">
                <div className="growth-signal"><i /><i /><i /><i /><i /><i /><i /></div>
                <div><small>Estrategia</small><strong>{service.title}</strong><span>Planeación · Producción · Medición</span></div>
                <BarChart3 size={35} />
              </div>
              <div className="growth-command-status"><span><i />Brief validado</span><span><i />Ejecución</span><span><i />Reporte</span></div>
            </div>

            <div className="growth-metrics">
              {marketingModule.metrics.map(([value, label]) => <article key={value}><strong>{value}</strong><span>{label}</span></article>)}
            </div>

            <div className="growth-section-heading"><span>01</span><div><p className="site-kicker">Qué trabajamos</p><h2>Un servicio con estrategia y entregables claros.</h2></div></div>
            <div className="growth-pillar-grid">
              {marketingModule.pillars.map((item) => { const PillarIcon = item.icon; return <article key={item.title}><PillarIcon size={24} /><h3>{item.title}</h3><p>{item.copy}</p></article>; })}
            </div>

            <div className="growth-process-panel">
              <div><p className="site-kicker">Proceso de trabajo</p><h2>De la intención a una ejecución medible.</h2></div>
              <ol>{marketingModule.process.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}</ol>
            </div>

            <div className="growth-deliverables">
              <div><p className="site-kicker">Entregables</p><h2>Qué recibe tu equipo.</h2></div>
              <div>{marketingModule.deliverables.map((item) => <span key={item}><CheckCircle2 size={16} />{item}</span>)}</div>
            </div>
            <p className="growth-scope-note"><ShieldCheck size={18} />{marketingModule.note}</p>
          </section>
        )}

        {isNetworkService && (
          <section className="network-showcase">
            <div className="network-intro">
              <p className="site-kicker">Conectividad para la operación</p>
              <h2>Una red no es sólo internet: es la base que conecta a tu equipo.</h2>
              <p>Diseñamos la infraestructura considerando el espacio, la cantidad de usuarios, los dispositivos críticos, la cobertura inalámbrica, la seguridad y el crecimiento esperado.</p>
            </div>

            <div className="network-map" aria-hidden="true">
              <div className="network-map-head"><Wifi size={20} /><strong>Red operativa</strong><span><i />En línea</span></div>
              <div className="network-topology">
                <div className="network-core"><Workflow size={28} /><strong>Núcleo</strong><small>Router / Firewall</small></div>
                <i className="network-line line-a" /><i className="network-line line-b" /><i className="network-line line-c" />
                <article className="network-node node-office"><MonitorSmartphone size={20} /><span>Oficina</span></article>
                <article className="network-node node-wifi"><Wifi size={20} /><span>Wi-Fi</span></article>
                <article className="network-node node-services"><Cloud size={20} /><span>Servicios</span></article>
              </div>
              <div className="network-health"><span><strong>Cobertura</strong><i><b style={{ width: "92%" }} /></i></span><span><strong>Organización</strong><i><b style={{ width: "86%" }} /></i></span><span><strong>Capacidad</strong><i><b style={{ width: "78%" }} /></i></span></div>
            </div>

            <div className="network-facts"><article><strong>LAN + Wi-Fi</strong><span>Conectividad cableada e inalámbrica</span></article><article><strong>VLAN</strong><span>Segmentación cuando el proyecto lo requiere</span></article><article><strong>Documentada</strong><span>Inventario y esquema de implementación</span></article></div>

            <div className="network-pillar-grid">{networkPillars.map((item) => { const PillarIcon = item.icon; return <article key={item.title}><PillarIcon size={24} /><h3>{item.title}</h3><p>{item.copy}</p></article>; })}</div>

            <div className="network-scope-grid">
              <div><p className="site-kicker">Alcance posible</p><h2>Componentes que podemos integrar.</h2><p>El proyecto se dimensiona después del levantamiento técnico. Trabajamos con equipos y materiales compatibles con las necesidades y presupuesto definidos.</p></div>
              <div>{["Cableado estructurado y organización", "Routers, switches y puntos de acceso", "Cobertura Wi-Fi y redes para invitados", "Segmentación de usuarios y dispositivos", "Etiquetado, pruebas e inventario", "Recomendaciones de respaldo y continuidad"].map((item) => <span key={item}><CheckCircle2 size={17} />{item}</span>)}</div>
            </div>
            <p className="growth-scope-note"><ShieldCheck size={18} />La obra civil, canalización, certificaciones especializadas y suministro de hardware se cotizan conforme al levantamiento y alcance autorizado.</p>
          </section>
        )}
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
