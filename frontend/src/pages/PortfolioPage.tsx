import {
  ArrowRight,
  Boxes,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Code2,
  Globe2,
  HeartHandshake,
  MonitorSmartphone,
  Rocket,
  ShoppingCart,
  Sparkles,
  Store,
  UsersRound,
} from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const portfolioCategories = [
  {
    title: "Software",
    copy: "Sistemas internos, paneles y herramientas que organizan procesos, información y equipos.",
    href: "/portafolio/software",
    label: "Sistemas y automatización",
    icon: Code2,
  },
  {
    title: "Aplicaciones",
    copy: "Productos web para conectar clientes, colaboradores y servicios desde cualquier dispositivo.",
    href: "/portafolio/aplicaciones",
    label: "Productos digitales",
    icon: MonitorSmartphone,
  },
  {
    title: "Sitios web",
    copy: "Experiencias digitales que presentan una marca, explican su valor y generan oportunidades.",
    href: "/portafolio/sitios-web",
    label: "Presencia digital",
    icon: Globe2,
  },
  {
    title: "Ecommerce",
    copy: "Tiendas y canales de venta que conectan catálogo, pagos, pedidos y operación comercial.",
    href: "/portafolio/ecommerce",
    label: "Comercio digital",
    icon: ShoppingCart,
  },
];

const clientProfiles = [
  { title: "Negocios en crecimiento", copy: "Una base digital profesional para avanzar y crecer con orden.", icon: Store },
  { title: "Equipos en expansión", copy: "Herramientas que reducen tareas manuales y conectan áreas.", icon: UsersRound },
  { title: "Servicios profesionales", copy: "Canales para presentar experiencia, captar y atender clientes.", icon: BriefcaseBusiness },
  { title: "Operaciones comerciales", copy: "Soluciones para vender, administrar y medir oportunidades.", icon: Building2 },
];

const principles = [
  "Entendemos primero el problema y el contexto del negocio.",
  "Diseñamos una experiencia clara para las personas que la usarán.",
  "Construimos con tecnología adecuada para el alcance y crecimiento esperado.",
  "Acompañamos el lanzamiento y dejamos una ruta para evolucionar.",
];

export default function PortfolioPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell portfolio-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="portfolio-page">
        <section className="portfolio-hero">
          <div className="portfolio-hero-copy">
            <p className="site-kicker">Portafolio de soluciones</p>
            <h1>Ideas que se convierten en herramientas para avanzar.</h1>
            <p>
              Nuestro portafolio reúne soluciones creadas para resolver necesidades
              reales: vender, organizar procesos, mejorar la atención y construir una
              presencia digital que genere confianza.
            </p>
            <div className="site-hero-actions">
              <a className="site-primary-button" href="#catalogos">
                Explorar catálogos
                <ArrowRight size={17} />
              </a>
              <a className="site-secondary-button" href="/contacto">
                Cuéntanos tu idea
              </a>
            </div>
          </div>

          <div className="portfolio-hero-visual" aria-hidden="true">
            <div className="portfolio-orbit portfolio-orbit-one" />
            <div className="portfolio-orbit portfolio-orbit-two" />
            <div className="portfolio-core">
              <Sparkles size={34} />
              <strong>Soluciones</strong>
              <span>pensadas para crecer</span>
            </div>
            <div className="portfolio-float-card card-code"><Code2 size={23} /><span>Software</span></div>
            <div className="portfolio-float-card card-app"><MonitorSmartphone size={23} /><span>Apps</span></div>
            <div className="portfolio-float-card card-web"><Globe2 size={23} /><span>Web</span></div>
            <div className="portfolio-float-card card-shop"><ShoppingCart size={23} /><span>Ecommerce</span></div>
          </div>
        </section>

        <section className="portfolio-definition">
          <div>
            <p className="site-kicker">De qué hablamos</p>
            <h2>No entregamos solo tecnología. Construimos una solución con propósito.</h2>
          </div>
          <div className="portfolio-definition-copy">
            <p>
              Una solución digital combina estrategia, diseño, desarrollo e integración
              para mejorar una parte concreta del negocio. Puede ser un sitio que genera
              contactos, una tienda que centraliza pedidos o un sistema que elimina tareas
              repetitivas.
            </p>
            <p>
              Cada proyecto parte de un objetivo claro y se adapta a las personas, los
              procesos y la etapa en la que se encuentra la empresa.
            </p>
          </div>
        </section>

        <section id="catalogos" className="portfolio-catalog-section">
          <div className="portfolio-section-heading">
            <div>
              <p className="site-kicker">Catálogos por categoría</p>
              <h2>Encuentra el tipo de solución que necesita tu proyecto.</h2>
            </div>
            <p>
              Explora cada categoría para conocer enfoques, capacidades y proyectos
              desarrollados por GiovSoft.
            </p>
          </div>

          <div className="portfolio-category-grid">
            {portfolioCategories.map((category, index) => {
              const Icon = category.icon;

              return (
                <a className={`portfolio-category-card category-${index + 1}`} href={category.href} key={category.title}>
                  <div className="portfolio-category-top">
                    <span>{category.label}</span>
                    <Icon size={25} />
                  </div>
                  <div>
                    <h3>{category.title}</h3>
                    <p>{category.copy}</p>
                  </div>
                  <strong>
                    Ver catálogo
                    <ArrowRight size={17} />
                  </strong>
                </a>
              );
            })}
          </div>
        </section>

        <section className="portfolio-clients-section">
          <div className="portfolio-section-heading">
            <div>
              <p className="site-kicker">Nuestros clientes</p>
              <h2>Trabajamos con negocios que quieren operar mejor.</h2>
            </div>
            <p>
              Adaptamos cada solución al tamaño, objetivos y ritmo de adopción de cada
              organización.
            </p>
          </div>

          <div className="portfolio-client-grid">
            {clientProfiles.map((client) => {
              const Icon = client.icon;
              return (
                <article key={client.title}>
                  <Icon size={24} />
                  <h3>{client.title}</h3>
                  <p>{client.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="portfolio-method-section">
          <div className="portfolio-method-visual">
            <Boxes size={42} />
            <span>Negocio</span>
            <ArrowRight size={22} />
            <span>Diseño</span>
            <ArrowRight size={22} />
            <span>Tecnología</span>
            <Rocket size={42} />
          </div>
          <div className="portfolio-method-copy">
            <p className="site-kicker">Cómo construimos</p>
            <h2>Una buena solución empieza antes de escribir código.</h2>
            <div className="portfolio-principles">
              {principles.map((principle) => (
                <p key={principle}><CheckCircle2 size={19} />{principle}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="portfolio-cta">
          <div>
            <HeartHandshake size={34} />
            <p className="site-kicker">Construyamos juntos</p>
            <h2>¿Tienes una necesidad que todavía no encaja en una categoría?</h2>
            <p>Cuéntanos cómo funciona tu negocio y diseñaremos una ruta clara para convertirla en una solución digital.</p>
          </div>
          <a className="site-primary-button" href="/contacto">
            Iniciar conversación
            <ArrowRight size={17} />
          </a>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
