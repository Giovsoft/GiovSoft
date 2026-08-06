import {
  ArrowRight,
  Blocks,
  HandCoins,
  HeartHandshake,
  Lightbulb,
  MapPin,
  Puzzle,
  Rocket,
  Scale,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const values = [
  { title: "Tecnología accesible", copy: "Creamos alternativas que permiten avanzar sin exigir inversiones fuera del alcance del negocio.", icon: HandCoins },
  { title: "Cercanía", copy: "Escuchamos primero, hablamos con claridad y acompañamos cada etapa del proyecto.", icon: HeartHandshake },
  { title: "Adaptación", copy: "La solución se ajusta a la operación y a las necesidades reales, no al revés.", icon: Puzzle },
  { title: "Innovación práctica", copy: "Usamos tecnología con un propósito concreto: resolver, simplificar y generar valor.", icon: Lightbulb },
  { title: "Transparencia", copy: "Definimos alcances, prioridades y decisiones de forma clara desde el inicio.", icon: Scale },
  { title: "Evolución continua", copy: "Construimos bases que pueden crecer conforme cambian el negocio y sus clientes.", icon: TrendingUp },
];

const history = [
  { year: "2016", title: "Una idea nace en Guadalajara", copy: "GiovSoft comienza como un proyecto con la intención de acercar tecnología útil y accesible a los negocios." },
  { year: "Primeros proyectos", title: "Sitios web preparados para crecer", copy: "Comenzamos construyendo presencia digital escalable, pensada para conectarse en el futuro con nuevas soluciones." },
  { year: "Evolución", title: "Escuchar abrió nuevas posibilidades", copy: "Con cada cliente entendimos nuevas necesidades y ampliamos nuestros productos, servicios e integraciones." },
  { year: "2026", title: "Nos constituimos como empresa", copy: "El proyecto alcanza una nueva etapa y se constituye formalmente como GiovSoft Technologies, S.A.S." },
  { year: "Hoy", title: "Un ecosistema de soluciones", copy: "Desarrollamos sitios, aplicaciones y software que ayudan a administrar, vender, comunicar y operar mejor." },
];

export default function AboutPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell about-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="about-page">
        <section className="about-hero">
          <div className="about-hero-copy">
            <p className="site-kicker">Nosotros</p>
            <h1>Tecnología cercana para negocios que quieren avanzar.</h1>
            <p>
              Desde 2016 construimos soluciones digitales accesibles y adaptadas a la
              realidad de cada negocio. Creemos que la tecnología debe ayudar a crecer,
              no convertirse en una barrera.
            </p>
            <div className="about-origin"><MapPin size={17} /><span>Guadalajara, Jalisco · México</span></div>
          </div>
          <div className="about-hero-visual" aria-hidden="true">
            <div className="about-year"><small>Desde</small><strong>2016</strong></div>
            <div className="about-visual-card"><Blocks size={25} /><span>Soluciones que crecen contigo</span></div>
            <div className="about-visual-card"><UsersRound size={25} /><span>Negocios en el centro</span></div>
            <div className="about-visual-line" />
          </div>
        </section>

        <section className="about-purpose">
          <div className="about-purpose-intro">
            <p className="site-kicker">Nuestro propósito</p>
            <h2>Hacer que la tecnología sea una oportunidad para más negocios.</h2>
          </div>
          <div className="about-purpose-cards">
            <article>
              <Target size={29} />
              <span>Misión</span>
              <h3>Poner herramientas útiles al alcance de todos.</h3>
              <p>
                Acercar herramientas tecnológicas que mejoren la administración de los
                negocios sin requerir grandes desembolsos, creando soluciones accesibles
                y adaptadas a la operación de cada cliente.
              </p>
            </article>
            <article>
              <Rocket size={29} />
              <span>Visión</span>
              <h3>Ser el aliado tecnológico de negocios y organizaciones.</h3>
              <p>
                Construir un ecosistema de soluciones que permita a negocios y equipos
                digitalizarse, operar con mayor claridad y crecer a su propio ritmo.
              </p>
            </article>
          </div>
        </section>

        <section className="about-history">
          <div className="about-section-heading">
            <div><p className="site-kicker">Nuestra historia</p><h2>Empezamos con sitios web. Aprendimos escuchando.</h2></div>
            <p>
              Cada etapa de GiovSoft ha surgido de la misma pregunta: ¿qué tecnología
              puede hacer más simple y mejor el trabajo de nuestros clientes?
            </p>
          </div>
          <div className="about-timeline">
            {history.map((item, index) => (
              <article key={item.year}>
                <div className="about-timeline-marker"><span>0{index + 1}</span><i /></div>
                <div><small>{item.year}</small><h3>{item.title}</h3><p>{item.copy}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-values">
          <div className="about-section-heading">
            <div><p className="site-kicker">Nuestros valores</p><h2>La forma en que elegimos trabajar.</h2></div>
            <p>No son conceptos decorativos: son criterios que usamos para diseñar, decidir y colaborar.</p>
          </div>
          <div className="about-values-grid">
            {values.map((value, index) => {
              const Icon = value.icon;
              return <article key={value.title}><span>0{index + 1}</span><Icon size={25} /><h3>{value.title}</h3><p>{value.copy}</p></article>;
            })}
          </div>
        </section>

        <section className="about-belief">
          <Sparkles size={34} />
          <blockquote>“La tecnología funciona mejor cuando entiende primero al negocio y a las personas.”</blockquote>
          <p>Esta idea guía cada sitio, aplicación, sistema e integración que construimos.</p>
        </section>

        <section className="about-cta">
          <div><p className="site-kicker">Hablemos</p><h2>Conoce lo que podemos construir para tu negocio.</h2></div>
          <div><a className="site-primary-button" href="/portafolio">Ver portafolio <ArrowRight size={17} /></a><a className="site-secondary-button" href="/contacto">Contactar</a></div>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
