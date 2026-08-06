import {
  ArrowRight,
  ExternalLink,
  Globe2,
  LayoutTemplate,
  MonitorSmartphone,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const project = {
  client: "Colegio Iberoamericano",
  title: "Una experiencia digital para conocer, confiar y dar el siguiente paso.",
  description:
    "Sitio institucional para comunicar una propuesta educativa integral bilingüe, presentar cada nivel académico y facilitar el proceso de admisión para nuevas familias.",
  url: "https://colegioiberoamericano.com/",
  image: "https://colegioiberoamericano.com/assets/hero-colegio.jpeg",
  gallery: [
    "https://colegioiberoamericano.com/assets/optimized/foto-01.jpg",
    "https://colegioiberoamericano.com/assets/optimized/foto-02.jpg",
  ],
  tags: ["Educación", "Sitio institucional", "Admisiones", "Responsive"],
};

const capabilities = [
  { title: "Arquitectura clara", copy: "Información organizada para que cada audiencia encuentre rápidamente lo que necesita.", icon: LayoutTemplate },
  { title: "Diseño responsive", copy: "Una experiencia consistente en celular, tablet y escritorio.", icon: MonitorSmartphone },
  { title: "Presencia encontrable", copy: "Estructura y contenido preparados para buscadores y resultados compartidos.", icon: SearchCheck },
];

export default function WebsitePortfolioPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell web-catalog-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="web-catalog-page">
        <section className="web-catalog-hero">
          <div className="web-catalog-breadcrumb">
            <a href="/portafolio">Portafolio</a>
            <span>/</span>
            <strong>Sitios web</strong>
          </div>
          <div className="web-catalog-hero-grid">
            <div>
              <p className="site-kicker">Catálogo de sitios web</p>
              <h1>Sitios que cuentan una historia y mueven a la acción.</h1>
            </div>
            <div className="web-catalog-intro">
              <p>
                Diseñamos experiencias digitales que presentan el valor de una marca,
                ordenan su información y facilitan el siguiente paso: contactar,
                registrarse, solicitar una cotización o comprar.
              </p>
              <span><Globe2 size={17} /> Proyectos publicados y experiencias reales</span>
            </div>
          </div>
        </section>

        <section className="web-catalog-controls" aria-label="Categorías del catálogo">
          <strong>Explorar</strong>
          <div>
            <button className="is-active" type="button">Todos</button>
            <button type="button">Institucionales</button>
            <button type="button">Educación</button>
            <button type="button">Servicios</button>
          </div>
          <span>02 proyectos</span>
        </section>

        <section className="web-project-feature">
          <a className="web-project-image" href={project.url} target="_blank" rel="noreferrer" aria-label={`Visitar ${project.client}`}>
            <img src={project.image} alt={`Fachada del ${project.client}`} />
            <span>Ver sitio publicado <ExternalLink size={16} /></span>
          </a>

          <div className="web-project-content">
            <div className="web-project-number">Proyecto 01</div>
            <p className="site-kicker">{project.client}</p>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <div className="web-project-tags">
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <a className="web-project-link" href={project.url} target="_blank" rel="noreferrer">
              Visitar proyecto
              <ArrowRight size={17} />
            </a>
          </div>
        </section>

        <section className="web-project-gesove">
          <div className="gesove-project-copy">
            <div className="web-project-number">Proyecto 02</div>
            <p className="site-kicker">Gesove</p>
            <h2>Un producto digital para crear, compartir y vivir cada evento.</h2>
            <p>
              Plataforma de invitaciones digitales que permite elegir una plantilla,
              personalizar textos, colores, fotografías y música, compartir enlaces con
              invitados y recibir confirmaciones de asistencia en tiempo real.
            </p>
            <div className="web-project-tags">
              <span>Producto digital</span>
              <span>Eventos</span>
              <span>Editor visual</span>
              <span>RSVP</span>
              <span>Pagos</span>
            </div>
            <div className="gesove-project-features">
              <p><strong>Plantillas personalizables</strong><span>Para bodas, XV años, cumpleaños y celebraciones.</span></p>
              <p><strong>Confirmaciones integradas</strong><span>Invitados, pases y respuestas organizados en un panel.</span></p>
              <p><strong>Un enlace para compartir</strong><span>Una experiencia pensada para distribuirse fácilmente por WhatsApp.</span></p>
            </div>
            <a className="web-project-link" href="https://gesove.com/" target="_blank" rel="noreferrer">
              Visitar Gesove
              <ArrowRight size={17} />
            </a>
          </div>

          <a className="gesove-live-preview" href="https://gesove.com/" target="_blank" rel="noreferrer" aria-label="Visitar Gesove">
            <div className="gesove-browser-bar">
              <span /><span /><span />
              <strong>gesove.com</strong>
              <ExternalLink size={15} />
            </div>
            <div className="gesove-iframe-wrap">
              <iframe src="https://gesove.com/" title="Vista previa del sitio Gesove" loading="lazy" tabIndex={-1} />
            </div>
          </a>
        </section>

        <section className="web-project-story">
          <div className="web-story-copy">
            <p className="site-kicker">La solución</p>
            <h2>Una escuela completa, explicada con claridad.</h2>
            <p>
              La experiencia organiza la propuesta educativa, niveles, actividades,
              instalaciones, costos y admisiones dentro de un recorrido coherente. La
              identidad visual combina el carácter institucional con una comunicación
              cercana para madres, padres y futuros alumnos.
            </p>
            <div className="web-story-points">
              {capabilities.map((capability) => {
                const Icon = capability.icon;
                return (
                  <article key={capability.title}>
                    <Icon size={21} />
                    <div><strong>{capability.title}</strong><p>{capability.copy}</p></div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="web-story-gallery">
            {project.gallery.map((image, index) => (
              <img key={image} src={image} alt={`Actividad escolar del ${project.client} ${index + 1}`} />
            ))}
          </div>
        </section>

        <section className="web-catalog-next">
          <div>
            <Sparkles size={30} />
            <p className="site-kicker">Tu proyecto puede ser el siguiente</p>
            <h2>Construyamos un sitio que represente lo mejor de tu negocio.</h2>
          </div>
          <a className="site-primary-button" href="/contacto">
            Iniciar proyecto
            <ArrowRight size={17} />
          </a>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
