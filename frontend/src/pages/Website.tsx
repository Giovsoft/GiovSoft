import {
  ArrowRight,
  BadgeCheck,
  Braces,
  Clock3,
  Cloud,
  Code2,
  Cpu,
  Globe2,
  Layers3,
  Rocket,
  Server,
  ShieldCheck,
  Store,
} from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import heroImage from "../assets/hero.png";
import { serviceCategories, serviceItems } from "../data/services";
import { useSiteTheme } from "../hooks/useSiteTheme";

const metrics = [
  {
    value: "24/7",
    label: "tu negocio visible",
    detail: "Presencia digital activa todos los días.",
    icon: Clock3,
  },
  {
    value: "1",
    label: "marca con dominio propio",
    detail: "Web, correo y dominio trabajando juntos.",
    icon: BadgeCheck,
  },
  {
    value: "+",
    label: "canales para vender más",
    detail: "Sitio, tienda y herramientas para crecer.",
    icon: Store,
  },
];

const heroTags = ["Software", "Marketing digital", "Sitios web", "Infraestructura de red"];

const infrastructureStack = [
  {
    name: "Python para IA",
    copy: "Automatizaciones, procesamiento de datos y funciones inteligentes.",
    icon: Cpu,
  },
  {
    name: "React",
    copy: "Interfaces modernas, rápidas y preparadas para crecer.",
    icon: Layers3,
  },
  {
    name: "Node.js",
    copy: "Backend, APIs e integraciones para conectar servicios.",
    icon: Server,
  },
  {
    name: "Google Cloud",
    copy: "Infraestructura, despliegues y servicios cloud escalables.",
    icon: Cloud,
  },
  {
    name: "HTML",
    copy: "Estructura clara, semántica y compatible para la web.",
    icon: Code2,
  },
  {
    name: "CSS",
    copy: "Diseño responsive, animaciones y experiencia visual cuidada.",
    icon: Braces,
  },
];

export default function Website() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`site-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main>
        <section id="inicio" className="site-hero">
          <div className="site-hero-copy">
            <p className="site-kicker">Tu aliado tecnológico</p>
            <h1>Impulsa tu negocio con tecnología, presencia y estrategia digital.</h1>
            <p>
              Integramos software, sitios web, marketing e infraestructura para que
              tu empresa opere mejor, conecte con más clientes y avance con una
              estrategia digital coherente.
            </p>

            <div className="hero-tags" aria-label="Servicios principales">
              {heroTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <div className="site-hero-actions">
              <a className="site-primary-button" href="#contacto">
                Empezar proyecto
                <Rocket size={17} />
              </a>
              <a className="site-secondary-button" href="/servicios">
                Ver servicios
              </a>
            </div>
          </div>

          <div className="site-hero-visual" aria-hidden="true">
            <div className="tech-grid" />
            <div className="product-orbit">
              <span><Code2 size={18} /></span>
              <span><ShieldCheck size={18} /></span>
              <span><Globe2 size={18} /></span>
            </div>
            <img src={heroImage} alt="" />
            <div className="hero-signal-card">
              <Globe2 size={18} />
              <span>Dominio activo</span>
            </div>
            <div className="hero-console">
              <span className="console-status" />
              <strong>Marca en línea</strong>
              <small>Web, dominio y correo listos para vender</small>
            </div>
          </div>
        </section>

        <section className="site-metrics" aria-label="Indicadores">
          <div className="metrics-inner">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article key={metric.label}>
                  <div className="metric-icon">
                    <Icon size={20} />
                  </div>
                  <div>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                    <p>{metric.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="servicios" className="site-section home-capabilities">
          <div className="home-section-heading"><div><p className="site-kicker">Qué podemos conectar</p><h2>Cuatro capacidades, una misma estrategia.</h2></div><a href="/servicios">Ver todos los servicios <ArrowRight size={16} /></a></div>
          <div className="home-capability-grid">
            {serviceCategories.map((category, index) => {
              const examples = serviceItems.filter((service) => service.category === category.id).map((service) => service.title);
              return <a href={`/servicios#${category.id}`} key={category.id}><span>0{index + 1}</span><h3>{category.title}</h3><p>{category.copy}</p><small>{examples.slice(0, 3).join(" · ")}</small><ArrowRight size={18} /></a>;
            })}
          </div>
        </section>

        <section id="proceso" className="home-process-summary">
          <div><p className="site-kicker">Una forma clara de avanzar</p><h2>Primero entendemos. Después construimos.</h2><p>Convertimos necesidades de negocio en una ruta priorizada, una implementación verificable y una base preparada para seguir evolucionando.</p><a className="site-secondary-button" href="/proceso">Conocer nuestra metodología <ArrowRight size={16} /></a></div>
          <ol><li><span>01</span><strong>Entender</strong><small>Contexto, objetivos y prioridades.</small></li><li><span>02</span><strong>Definir</strong><small>Alcance, ruta y resultados.</small></li><li><span>03</span><strong>Implementar</strong><small>Construcción, validación y lanzamiento.</small></li></ol>
        </section>

        <section className="site-section infrastructure-section">
          <div className="section-intro">
            <p className="site-kicker">Infraestructura y desarrollo</p>
            <h2>Construimos con tecnologías modernas y una base preparada para crecer.</h2>
          </div>

          <div className="infrastructure-layout">
            <div className="infrastructure-map" aria-hidden="true">
              <div className="infra-core">
                <Globe2 size={28} />
                <strong>GiovSoft Stack</strong>
                <span>web, cloud e IA</span>
              </div>
              <span className="infra-node node-python">Python IA</span>
              <span className="infra-node node-react">React</span>
              <span className="infra-node node-node">Node.js</span>
              <span className="infra-node node-cloud">Google Cloud</span>
              <span className="infra-node node-html">HTML</span>
              <span className="infra-node node-css">CSS</span>
            </div>

            <div className="infrastructure-grid">
              {infrastructureStack.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.name}>
                    <Icon size={22} />
                    <h3>{item.name}</h3>
                    <p>{item.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
