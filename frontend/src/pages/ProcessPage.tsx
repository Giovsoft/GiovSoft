import { ArrowRight, CheckCircle2, ClipboardCheck, Compass, MessageCircle, Rocket, SearchCheck, Settings2 } from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const stages = [
  { number: "01", title: "Descubrimiento", copy: "Conversamos sobre la operación, el contexto y el resultado que necesitas alcanzar.", deliverable: "Resumen de necesidades y objetivos", icon: MessageCircle },
  { number: "02", title: "Diagnóstico", copy: "Revisamos procesos, canales, tecnología actual, dependencias y oportunidades de mejora.", deliverable: "Hallazgos, prioridades y alcance inicial", icon: SearchCheck },
  { number: "03", title: "Ruta de solución", copy: "Definimos qué construir, cómo conectarlo, qué requiere cada etapa y cómo mediremos el avance.", deliverable: "Propuesta, etapas y calendario", icon: Compass },
  { number: "04", title: "Implementación", copy: "Diseñamos, desarrollamos, configuramos y validamos la solución con revisiones periódicas.", deliverable: "Solución probada y documentada", icon: Settings2 },
  { number: "05", title: "Lanzamiento y evolución", copy: "Ponemos la solución en operación, acompañamos la adopción y trazamos las siguientes mejoras.", deliverable: "Salida a producción y plan de continuidad", icon: Rocket },
];

export default function ProcessPage() {
  const { isDark, toggleTheme } = useSiteTheme();
  return (
    <div className={`service-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
      <main className="process-page">
        <section className="process-page-hero">
          <div><p className="site-kicker">Cómo trabajamos</p><h1>Un proceso visible, ordenado y adaptable.</h1><p>Cada proyecto tiene necesidades distintas, pero todos requieren claridad. Nuestra metodología reduce incertidumbre, alinea decisiones y convierte objetivos en una solución operativa.</p><a className="site-primary-button" href="/contacto">Iniciar una conversación <ArrowRight size={17} /></a></div>
          <div className="process-principles">
            <article><strong>Claridad</strong><span>Alcance y prioridades comprensibles.</span></article>
            <article><strong>Colaboración</strong><span>Revisiones y decisiones compartidas.</span></article>
            <article><strong>Continuidad</strong><span>Una base preparada para evolucionar.</span></article>
          </div>
        </section>

        <section className="process-roadmap">
          <div className="process-roadmap-intro"><p className="site-kicker">La ruta de trabajo</p><h2>De la necesidad a una solución funcionando.</h2><p>Las etapas se ajustan al tamaño y complejidad del proyecto. Siempre sabrás qué estamos resolviendo, qué sigue y qué resultado esperamos.</p></div>
          <div className="process-stage-list">
            {stages.map((stage) => { const Icon = stage.icon; return <article key={stage.number}><div className="process-stage-number">{stage.number}</div><div className="process-stage-icon"><Icon size={22} /></div><div><h3>{stage.title}</h3><p>{stage.copy}</p><span><ClipboardCheck size={16} /><b>Entregable:</b> {stage.deliverable}</span></div></article>; })}
          </div>
        </section>

        <section className="process-collaboration">
          <div><p className="site-kicker">Trabajo en conjunto</p><h2>Qué puedes esperar durante el proyecto.</h2></div>
          <ul><li><CheckCircle2 />Un punto de contacto claro.</li><li><CheckCircle2 />Avances y decisiones documentadas.</li><li><CheckCircle2 />Validaciones antes de publicar.</li><li><CheckCircle2 />Acompañamiento después del lanzamiento.</li></ul>
        </section>
      </main>
      <SiteFooter isDark={isDark} />
    </div>
  );
}
