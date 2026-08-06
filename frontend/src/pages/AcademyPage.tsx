import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Braces,
  Code2,
  ExternalLink,
  GraduationCap,
  Palette,
  Sparkles,
  Target,
} from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const academyUrl = "https://academy.giovsoft.com";

const learningAreas = [
  { title: "Programación", copy: "Aprende a construir con código mediante ejercicios y proyectos.", icon: Code2 },
  { title: "Diseño", copy: "Desarrolla criterio visual y crea experiencias digitales más claras.", icon: Palette },
  { title: "Datos", copy: "Convierte información en análisis que ayuden a tomar decisiones.", icon: BarChart3 },
  { title: "Inteligencia artificial", copy: "Conoce herramientas y fundamentos para trabajar con IA.", icon: BrainCircuit },
];

const academySteps = [
  { number: "01", title: "Elige una ruta", copy: "Explora cursos y encuentra el siguiente conocimiento que quieres desarrollar." },
  { number: "02", title: "Aprende practicando", copy: "Avanza con explicaciones, actividades y herramientas integradas en la experiencia." },
  { number: "03", title: "Construye evidencia", copy: "Aplica lo aprendido mediante ejercicios, evaluaciones y proyectos concretos." },
];

export default function AcademyPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell academy-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="academy-page">
        <section className="academy-hero">
          <div className="academy-hero-copy">
            <div className="academy-product-label"><GraduationCap size={20} /><span>Un producto de GiovSoft</span></div>
            <p className="site-kicker">GiovSoft Academy</p>
            <h1>Aprende tecnología practicando.</h1>
            <p>
              Una plataforma educativa en español para desarrollar habilidades en
              tecnología, diseño, datos e inteligencia artificial mediante cursos,
              ejercicios y proyectos.
            </p>
            <div className="site-hero-actions">
              <a className="site-primary-button" href={`${academyUrl}/register`} target="_blank" rel="noreferrer">Empezar ahora <ArrowRight size={17} /></a>
              <a className="site-secondary-button" href={`${academyUrl}/cursos`} target="_blank" rel="noreferrer">Explorar cursos <ExternalLink size={16} /></a>
            </div>
          </div>

          <div className="academy-hero-visual" aria-hidden="true">
            <img className="academy-hero-screenshot" src="/img/academy/homepage.png" alt="" />
          </div>
        </section>

        <section className="academy-intro">
          <div><p className="site-kicker">Qué es Academy</p><h2>Una experiencia de aprendizaje creada para pasar de la teoría a la práctica.</h2></div>
          <div><p>GiovSoft Academy organiza el aprendizaje en rutas claras y actividades que ayudan a comprender haciendo. La plataforma reúne contenido, herramientas y seguimiento en un mismo espacio.</p><p>Está pensada para personas que quieren iniciar, actualizar conocimientos o desarrollar nuevas habilidades digitales a su propio ritmo.</p></div>
        </section>

        <section className="academy-real-experience">
          <div className="academy-real-copy">
            <div><p className="site-kicker">Una lección real</p><h2>Contenido y práctica conviven en el mismo espacio.</h2></div>
            <p>Cada lección puede combinar explicaciones, ejemplos ejecutables, editores de código y ejercicios para que el aprendizaje suceda mientras la persona experimenta y construye.</p>
          </div>
          <div className="academy-real-gallery">
            <a href={`${academyUrl}/cursos`} target="_blank" rel="noreferrer" className="academy-real-image">
              <img src="/img/academy/course-catalog.png" alt="Catálogo de cursos de GiovSoft Academy" />
              <span>Explorar cursos <ExternalLink size={16} /></span>
            </a>
            <a href={academyUrl} target="_blank" rel="noreferrer" className="academy-real-image">
              <img src="/img/academy/lesson-python.png" alt="Lección de Python en GiovSoft Academy con editores de código y ejercicios" />
              <span>Conocer una lección <ExternalLink size={16} /></span>
            </a>
          </div>
        </section>

        <section className="academy-pillars">
          <article><Target size={27} /><span>Aprendizaje guiado</span><h3>Una ruta clara para saber qué aprender después.</h3></article>
          <article><Braces size={27} /><span>Práctica integrada</span><h3>Actividades y herramientas para aplicar cada concepto.</h3></article>
          <article><Sparkles size={27} /><span>Proyectos reales</span><h3>Evidencia concreta que demuestra lo que puedes construir.</h3></article>
        </section>

        <section className="academy-areas">
          <div className="academy-section-heading"><div><p className="site-kicker">Áreas de aprendizaje</p><h2>Habilidades digitales para construir el futuro.</h2></div><a href={`${academyUrl}/cursos`} target="_blank" rel="noreferrer">Ver todos los cursos <ArrowRight size={17} /></a></div>
          <div className="academy-area-grid">
            {learningAreas.map((area) => { const Icon = area.icon; return <article key={area.title}><Icon size={25} /><h3>{area.title}</h3><p>{area.copy}</p></article>; })}
          </div>
        </section>

        <section className="academy-method">
          <div><p className="site-kicker">Cómo funciona</p><h2>Aprender, practicar y avanzar.</h2></div>
          <div className="academy-steps">
            {academySteps.map((step) => <article key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div></article>)}
          </div>
        </section>

        <section className="academy-cta">
          <GraduationCap size={37} />
          <div><p className="site-kicker">Empieza tu siguiente habilidad</p><h2>Tu ruta de aprendizaje comienza en GiovSoft Academy.</h2><p>Explora la plataforma, descubre los cursos disponibles y aprende construyendo.</p></div>
          <div><a className="site-primary-button" href={academyUrl} target="_blank" rel="noreferrer">Ir a Academy <ExternalLink size={17} /></a><a className="site-secondary-button" href={`${academyUrl}/register`} target="_blank" rel="noreferrer">Crear cuenta</a></div>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
