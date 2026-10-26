import { useState } from "react";
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronRight, FileText, GraduationCap, Layers3, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useSiteTheme } from "../hooks/useSiteTheme";
import "./AkiraPage.css";

type Edition = "students" | "business";
const editions = {
  students: {
    name: "Students", label: "PARA APRENDER", icon: GraduationCap,
    title: "Comprende. Practica. Avanza.",
    copy: "Un espacio pensado para hacer preguntas sin quedarte con dudas, conectar ideas y aprender a tu ritmo.",
    items: ["Explicaciones adaptadas a tu nivel", "Guía para estudiar tus documentos", "Ejercicios y práctica con retroalimentación"],
    prompt: "Explícame las fracciones con un ejemplo cotidiano.",
    answer: "Imagina una pizza dividida en 8 porciones iguales.",
    steps: ["Una porción representa 1/8 de la pizza.", "Si tomas 3 porciones, tienes 3/8.", "Ahora tú: ¿qué fracción queda en la caja?"],
    hint: "Acompañar el razonamiento, no solo entregar una respuesta.",
  },
  business: {
    name: "Business", label: "PARA HACER MÁS", icon: Workflow,
    title: "Menos tareas. Más posibilidades.",
    copy: "Una experiencia orientada a transformar la información de tu equipo en respuestas claras y procesos que avanzan.",
    items: ["Consulta de documentos de trabajo", "Creación de borradores y archivos", "Automatizaciones con revisión y permisos"],
    prompt: "Convierte estas notas de reunión en un plan de seguimiento.",
    answer: "Un borrador organizado para que tu equipo lo revise.",
    steps: ["Acuerdos y decisiones separados por tema.", "Tareas, responsables y fechas por confirmar.", "Siguiente paso: revisar antes de compartir o ejecutar."],
    hint: "Automatizar lo repetitivo, manteniendo a las personas al mando.",
  },
};
const faqs = [
  ["¿Ya puedo usar Akira?", "Akira está en desarrollo. Esta página presenta la visión del producto y sus dos ediciones. Puedes contactar a GiovSoft para conversar sobre tus necesidades y conocer el proyecto; todavía no anunciamos una fecha de lanzamiento ni acceso público."],
  ["¿Qué diferencia hay entre Students y Business?", "Students se orienta al aprendizaje: comprender, practicar y desarrollar habilidades. Business se enfoca en documentos y flujos de trabajo de equipos. Ambas ediciones comparten la visión de una asistencia contextual, con experiencias y permisos adecuados a cada uso."],
  ["¿Akira sustituirá a profesores o a mi equipo?", "El objetivo es acompañar a las personas: ayudar a estudiantes a razonar y ofrecer a equipos herramientas para reducir trabajo repetitivo. Las explicaciones y resultados deberán revisarse según su contexto, y las acciones sensibles requerirán supervisión."],
  ["¿Cómo se contempla el uso de datos?", "El diseño previsto contempla separar documentos y memoria por usuario u organización, y controlar qué acciones puede realizar cada integración. No se anuncia entrenamiento automático con datos de clientes. Las condiciones de privacidad del producto se definirán antes de su disponibilidad."],
];
function contact(edition?: string) {
  return `https://wa.me/525566042994?text=${encodeURIComponent(`Hola GiovSoft, quiero conocer el proyecto Akira${edition ? ` ${edition}` : ""} y conversar sobre sus posibilidades.`)}`;
}

export default function AkiraPage() {
  const { isDark, toggleTheme } = useSiteTheme();
  const [edition, setEdition] = useState<Edition>("students");
  const selected = editions[edition];
  return (
    <div className={`service-page-shell akira-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
      <main className="akira-page">
        <section className="ak-hero" aria-labelledby="akira-title">
          <div className="ak-hero-copy">
            <p className="ak-eyebrow"><span /> UN NUEVO PRODUCTO DE GIOVSOFT</p>
            <div className="ak-wordmark">akira<span>IA</span></div>
            <h1 id="akira-title">Tu curiosidad.<br />Tu siguiente idea.<br /><span>Más lejos con IA.</span></h1>
            <p className="ak-lead">Estamos creando una inteligencia artificial que transforma información en aprendizaje y acción. Para quienes quieren comprender más. Para equipos que quieren avanzar mejor.</p>
            <div className="ak-actions"><a className="ak-button" href="#ediciones">Descubre Akira <ArrowDown size={17} /></a><a className="ak-text-link" href={contact()} target="_blank" rel="noopener noreferrer">Hablemos del proyecto <ArrowRight size={17} /></a></div>
            <p className="ak-status"><span /> En desarrollo · Students & Business</p>
          </div>
          <div className="ak-brand-stage">
            <span className="ak-orbit ak-orbit-one" /><span className="ak-orbit ak-orbit-two" />
            <img src="/img/akira/logo.jpeg" width="1254" height="1254" alt="Akira: una A de cinta continua en un degradado cian, azul y violeta" fetchPriority="high" />
            <div className="ak-brand-caption"><span>APRENDER ↗</span><span>CREAR ↗</span><span>AVANZAR ↗</span></div>
          </div>
        </section>

        <div className="ak-manifesto"><span>INTELIGENCIA CON PROPÓSITO</span><p>Las mejores respuestas abren<br /><strong>nuevas posibilidades.</strong></p><span>01 / DOS FORMAS DE AVANZAR</span></div>

        <section id="ediciones" className="ak-editions" aria-labelledby="ak-editions-title">
          <div className="ak-section-heading"><p className="ak-eyebrow">DOS EDICIONES. UNA MISMA VISIÓN.</p><h2 id="ak-editions-title">Hecha para tu<br /><span>siguiente paso.</span></h2><p>Aprender algo que parecía difícil. Recuperar tiempo para lo importante. Estamos diseñando Akira alrededor de lo que quieres lograr.</p></div>
          <div className="ak-edition-grid">{(Object.keys(editions) as Edition[]).map(key => {
            const e = editions[key]; const Icon = e.icon;
            return <article key={key} className={`ak-edition ak-${key}`}><div className="ak-edition-top"><Icon size={27} /><span>{e.label}</span></div><p className="ak-edition-name">Akira <strong>{e.name}</strong></p><h3>{e.title}</h3><p>{e.copy}</p><ul>{e.items.map(item => <li key={item}><Check size={16} />{item}</li>)}</ul><a href={contact(e.name)} target="_blank" rel="noopener noreferrer">Conocer {e.name} <ArrowRight size={17} /></a></article>;
          })}</div><p className="ak-development-note">Estas son las capacidades previstas para cada edición. El alcance final se validará durante el desarrollo.</p>
        </section>

        <section className="ak-experience" aria-labelledby="ak-example-title">
          <div className="ak-experience-copy"><p className="ak-eyebrow">DE UNA PREGUNTA A UNA POSIBILIDAD</p><h2 id="ak-example-title">Así imaginamos<br />la experiencia.</h2><p>Una conversación que te ayuda a ordenar lo que sabes y descubrir qué hacer después.</p><div className="ak-tabs" role="tablist" aria-label="Edición del ejemplo">{(Object.keys(editions) as Edition[]).map(key => <button key={key} id={`ak-tab-${key}`} type="button" role="tab" aria-selected={edition === key} aria-controls="ak-example-panel" tabIndex={edition === key ? 0 : -1} onKeyDown={event => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); const next: Edition = event.key === "Home" ? "students" : event.key === "End" ? "business" : edition === "students" ? "business" : "students"; setEdition(next); document.getElementById(`ak-tab-${next}`)?.focus(); }} onClick={() => setEdition(key)}>{editions[key].name}<ChevronRight size={16} /></button>)}</div><p className="ak-example-disclaimer">Ejemplo ilustrativo, no una conversación con un modelo en tiempo real.</p></div>
          <div id="ak-example-panel" className="ak-preview" role="tabpanel" aria-labelledby={`ak-tab-${edition}`} tabIndex={0}><div className="ak-preview-header"><span><Sparkles size={16} /> akira</span><span>{selected.name}</span></div><div className="ak-preview-body"><p className="ak-user-question">{selected.prompt}</p><div className="ak-answer" aria-live="polite"><span className="ak-answer-label"><Sparkles size={15} /> UNA IDEA MÁS CLARA</span><p>{selected.answer}</p><ol>{selected.steps.map(step => <li key={step}>{step}</li>)}</ol><p className="ak-answer-hint">{selected.hint}</p></div></div><div className="ak-preview-composer"><span>Tu siguiente pregunta empieza aquí…</span><ArrowRight size={18} /></div></div>
        </section>

        <section className="ak-principles" aria-labelledby="ak-principles-title"><div className="ak-section-heading"><p className="ak-eyebrow">EL CRITERIO TAMBIÉN IMPORTA</p><h2 id="ak-principles-title">Más capacidad.<br /><span>Sin perder el control.</span></h2></div><div className="ak-principle-grid">{[
          { icon: BookOpen, title: "Contexto antes que respuestas sueltas", copy: "Documentos y objetivos para que la asistencia tenga sentido dentro de lo que estás haciendo." },
          { icon: ShieldCheck, title: "Personas al mando", copy: "Permisos y revisión humana como parte del diseño de acciones y automatizaciones." },
          { icon: Layers3, title: "Una experiencia propia", copy: "Personalización y separación de información previstas para cada usuario y organización." },
        ].map(({ icon: Icon, title, copy }) => <article key={title}><Icon size={24} /><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

        <section className="ak-technology" aria-labelledby="ak-technology-title">
          <div><p className="ak-eyebrow">NUESTRA RUTA TECNOLÓGICA</p><h2 id="ak-technology-title">Entrenamiento previsto<br /><span>con tecnología NVIDIA.</span></h2></div>
          <div><p>El plan de desarrollo de Akira contempla utilizar tecnología NVIDIA para entrenar y personalizar modelos que acompañen el aprendizaje y la automatización.</p><p className="ak-technology-status">Integración por implementar. Esta es una dirección de desarrollo; no significa que la versión actual ya esté entrenada o acelerada con NVIDIA.</p><a href="https://docs.nvidia.com/nemo-framework/index.html" target="_blank" rel="noopener noreferrer">Conocer NVIDIA NeMo Framework <ArrowRight size={16} /></a><p className="ak-technology-legal">La mención identifica tecnología prevista y no implica patrocinio, certificación ni respaldo de NVIDIA. NVIDIA es una marca de NVIDIA Corporation.</p></div>
        </section>

        <section className="ak-faq" aria-labelledby="ak-faq-title"><div><p className="ak-eyebrow">ANTES DE EMPEZAR</p><h2 id="ak-faq-title">Preguntas<br />con respuesta.</h2></div><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

        <section className="ak-contact"><div><p className="ak-eyebrow">ESTAMOS CONSTRUYENDO LO QUE SIGUE</p><h2>El futuro empieza<br />con una conversación.</h2><p>Cuéntanos qué te gustaría aprender o qué proceso necesita avanzar. Ayúdanos a dar forma a Akira.</p></div><div className="ak-contact-actions"><a className="ak-button" href={contact()} target="_blank" rel="noopener noreferrer">Hablar con GiovSoft <ArrowRight size={18} /></a><a href="/contacto"><FileText size={16} /> Prefiero el formulario de contacto</a><span>Proyecto en desarrollo · Sin fecha de lanzamiento anunciada</span></div></section>
      </main>
      <SiteFooter isDark={isDark} />
    </div>
  );
}
