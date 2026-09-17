import {
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  Gauge,
  Layers3,
  MonitorSmartphone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";
import "./WebsiteServicePage.css";

const whatsappMessage = encodeURIComponent(
  "Hola GiovSoft, quiero información para desarrollar un sitio web profesional."
);
const whatsappUrl = `https://wa.me/525566042994?text=${whatsappMessage}`;

const outcomes = [
  ["Claridad", "Una propuesta fácil de entender"],
  ["Confianza", "Una presencia visual consistente"],
  ["Conversión", "Rutas claras hacia el contacto"],
  ["Evolución", "Una base preparada para crecer"],
];

const capabilities = [
  { icon: Layers3, title: "Estructura estratégica", copy: "Ordenamos mensajes, servicios y recorridos para que cada página tenga una función clara." },
  { icon: MonitorSmartphone, title: "Diseño responsivo", copy: "La experiencia se adapta cuidadosamente a celular, tablet y escritorio." },
  { icon: Gauge, title: "Rendimiento", copy: "Optimizamos recursos, imágenes y componentes para reducir tiempos de carga." },
  { icon: SearchCheck, title: "SEO técnico inicial", copy: "Configuramos semántica, metadatos, indexación y una estructura comprensible para buscadores." },
  { icon: ShieldCheck, title: "Base confiable", copy: "Aplicamos buenas prácticas de seguridad, accesibilidad y mantenimiento." },
  { icon: BarChart3, title: "Medición", copy: "Preparamos eventos y objetivos para entender qué contenidos generan interés y contacto." },
];

const process = [
  ["01", "Entender", "Negocio, audiencia, objetivos y contenido disponible."],
  ["02", "Estructurar", "Arquitectura, mensajes y recorridos principales."],
  ["03", "Diseñar", "Sistema visual, componentes y experiencia responsiva."],
  ["04", "Construir", "Desarrollo, contenido, integraciones y optimización."],
  ["05", "Publicar", "Pruebas, analítica, indexación y puesta en línea."],
];

const deliverables = [
  "Diseño personalizado alineado con tu marca",
  "Páginas y secciones acordadas en el alcance",
  "Formulario y canales de contacto",
  "Optimización para dispositivos móviles",
  "SEO técnico y metadatos iniciales",
  "Configuración de dominio, analítica y publicación",
];

export default function WebsiteServicePage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell web-service-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
      <main className="web-service-page">
        <section className="web-service-hero">
          <div className="web-service-hero-copy">
            <span className="web-service-label"><Sparkles size={14} /> Diseño y desarrollo web</span>
            <p className="site-kicker">Sitios web GiovSoft</p>
            <h1>Tu sitio debe explicar, convencer y abrir la siguiente conversación.</h1>
            <p className="web-service-lead">Creamos experiencias web profesionales que presentan con claridad lo que haces, transmiten confianza y convierten visitas en oportunidades reales.</p>
            <div className="web-service-actions">
              <a className="web-service-primary" href={whatsappUrl} target="_blank" rel="noreferrer">Cuéntanos tu proyecto <ArrowRight size={17} /></a>
              <a className="web-service-secondary" href="/portafolio/sitios-web">Ver sitios publicados</a>
            </div>
            <div className="web-service-proof">
              <span><strong>Responsive</strong><small>Celular a escritorio</small></span>
              <span><strong>SEO inicial</strong><small>Base indexable</small></span>
              <span><strong>Escalable</strong><small>Lista para evolucionar</small></span>
            </div>
          </div>

          <div className="web-service-stage" aria-hidden="true">
            <div className="web-service-browser">
              <div className="web-service-browser-bar"><i /><i /><i /><span>tuempresa.com</span></div>
              <div className="web-service-browser-page">
                <nav><b>MARCA</b><span>Servicios&nbsp;&nbsp; Nosotros&nbsp;&nbsp; Contacto</span><i /></nav>
                <div className="web-service-browser-hero"><small>UNA PROPUESTA CLARA</small><strong>Diseñamos una presencia que inspira confianza.</strong><span /><span /><button>Conocer más</button></div>
                <div className="web-service-browser-cards"><i /><i /><i /></div>
              </div>
            </div>
            <div className="web-service-score"><Gauge size={18} /><span><strong>98</strong><small>Performance</small></span></div>
            <div className="web-service-device"><MonitorSmartphone size={19} /><span><strong>Responsive</strong><small>Experiencia consistente</small></span></div>
          </div>
        </section>

        <section className="web-service-outcomes" aria-label="Resultados de un sitio web profesional">
          {outcomes.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><div><strong>{title}</strong><p>{copy}</p></div></article>)}
        </section>

        <section className="web-service-intro">
          <div><p className="site-kicker">Una herramienta comercial</p><h2>Más que una página bonita.</h2></div>
          <p>Un sitio profesional conecta estrategia, contenido, diseño y tecnología. Cada decisión debe ayudar a tus visitantes a entender tu valor y saber qué hacer después.</p>
        </section>

        <section className="web-service-capabilities">
          {capabilities.map(({ icon: Icon, title, copy }, index) => <article key={title}><header><span>0{index + 1}</span><Icon size={22} /></header><h3>{title}</h3><p>{copy}</p></article>)}
        </section>

        <section className="web-service-delivery">
          <div className="web-service-delivery-copy">
            <p className="site-kicker">Alcance claro</p>
            <h2>Una entrega lista para operar.</h2>
            <p>Definimos el alcance antes de construir y documentamos lo necesario para que sepas qué recibes, cómo se publica y cómo puede continuar creciendo.</p>
            <ul>{deliverables.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul>
          </div>
          <div className="web-service-stack" aria-label="Capas de una solución web">
            <span><Code2 size={19} /><strong>Desarrollo</strong><small>Componentes y funcionalidad</small></span>
            <span><Layers3 size={19} /><strong>Contenido</strong><small>Jerarquía y mensajes</small></span>
            <span><MonitorSmartphone size={19} /><strong>Experiencia</strong><small>Diseño adaptable</small></span>
            <span><BarChart3 size={19} /><strong>Medición</strong><small>Objetivos y evolución</small></span>
          </div>
        </section>

        <section className="web-service-process">
          <header><p className="site-kicker">Cómo lo construimos</p><h2>Un proceso visible de principio a fin.</h2></header>
          <div>{process.map(([number, title, copy]) => <article key={number}><span>{number}</span><strong>{title}</strong><p>{copy}</p></article>)}</div>
        </section>

        <section className="web-service-cta">
          <div><p className="site-kicker">El siguiente paso</p><h2>Construyamos un sitio preparado para lo que sigue.</h2><p>Puede comenzar como una presencia institucional y evolucionar hacia catálogo, agenda, pagos, área privada o integraciones con tu operación.</p></div>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">Hablar con GiovSoft <ArrowRight size={18} /></a>
        </section>
      </main>
      <SiteFooter isDark={isDark} />
    </div>
  );
}
