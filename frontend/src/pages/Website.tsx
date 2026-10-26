import { useId, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, AudioLines, BrainCircuit, Check, ChevronRight, Code2, Database, GitBranch, Globe2, Layers3, ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";
import EditorialCarousel from "../components/EditorialCarousel";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const scenarios = [
  { label: "Conocimiento", icon: Database, title: "Tu información. Una respuesta útil.", copy: "Conecta documentos y fuentes internas para encontrar contexto, resumir información y ayudar a tu equipo a decidir.", input: "Documentos y conocimiento", prompt: "¿Qué necesitamos para preparar la propuesta?", output: "Resumen con fuentes y próximos pasos", steps: ["Consulta el contexto", "Organiza los hallazgos", "Prepara una respuesta"], href: "/servicios/inteligencia-artificial" },
  { label: "Operaciones", icon: Workflow, title: "Menos trabajo repetitivo. Más avance.", copy: "Diseñamos flujos que conectan tus herramientas, preparan información y llevan cada tarea al siguiente paso con revisión humana.", input: "Solicitud o evento de negocio", prompt: "Organiza esta solicitud y prepara el seguimiento.", output: "Borrador listo para revisar", steps: ["Clasifica la solicitud", "Conecta los sistemas", "Solicita aprobación"], href: "/servicios/automatizacion-ia" },
  { label: "Experiencias", icon: Globe2, title: "Software que entiende lo que necesitas.", copy: "Integra asistencia inteligente en una web, una aplicación o una herramienta de trabajo, alrededor de una experiencia clara para las personas.", input: "Una pregunta de tu usuario", prompt: "Ayúdame a encontrar la opción adecuada.", output: "Orientación dentro de tu aplicación", steps: ["Comprende la consulta", "Recupera información", "Guía el siguiente paso"], href: "/servicios/inteligencia-artificial" },
];

function IntelligenceField() {
  const id = useId().replace(/:/g, "");
  return <div className="gs-intelligence" aria-hidden="true">
    <div className="gs-field-grid" />
    <div className="gs-field-label"><span className="gs-status-dot" /> IDEAS CONECTADAS. POSIBILIDADES REALES.</div>
    <svg className="gs-neural-art" viewBox="0 0 600 600" fill="none">
      <defs><radialGradient id={`${id}-glow`}><stop stopColor="#237bff" stopOpacity=".3" /><stop offset="1" stopColor="#237bff" stopOpacity="0" /></radialGradient><linearGradient id={`${id}-line`} x1="100" y1="100" x2="500" y2="500" gradientUnits="userSpaceOnUse"><stop stopColor="#81efff" /><stop offset=".5" stopColor="#4189ff" /><stop offset="1" stopColor="#7076ff" /></linearGradient></defs>
      <circle cx="300" cy="300" r="288" fill={`url(#${id}-glow)`} />
      <g className="gs-neural-orbit" stroke={`url(#${id}-line)`} strokeWidth=".8">{Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx="300" cy="300" rx={90 + i * 5.5} ry="203" transform={`rotate(${i * 8.2} 300 300)`} opacity={.2 + (i % 5) * .12} />)}</g>
      <g className="gs-neural-latitude" stroke="#5cc8ff" strokeWidth=".65" opacity=".5">{Array.from({ length: 11 }, (_, i) => <ellipse key={i} cx="300" cy={160 + i * 28} rx={Math.sqrt(1 - Math.pow((i - 5) / 6, 2)) * 202} ry={18 + Math.sin(i) * 6} transform="rotate(-25 300 300)" />)}</g>
      <ellipse cx="300" cy="300" rx="263" ry="88" transform="rotate(-35 300 300)" stroke="#89e2ff" strokeOpacity=".4" strokeDasharray="2 7" />
      <g className="gs-signal-points" fill="#a4eeff"><circle cx="130" cy="190" r="4" /><circle cx="470" cy="410" r="3" /><circle cx="435" cy="142" r="3" /><circle cx="190" cy="457" r="4" /></g>
      <circle cx="300" cy="300" r="5" fill="#e0f8ff" /><circle cx="300" cy="300" r="11" stroke="#89e2ff" strokeOpacity=".5" />
    </svg>
    <div className="gs-field-note gs-note-one"><Database size={15} /><span>Contexto conectado</span></div>
    <div className="gs-field-note gs-note-two"><Sparkles size={15} /><span>Inteligencia aplicada</span></div>
    <div className="gs-field-foot"><span>INFORMACIÓN → INTELIGENCIA → ACCIÓN</span><span>G / 01</span></div>
  </div>;
}

export default function Website() {
  const { isDark, toggleTheme } = useSiteTheme();
  const [active, setActive] = useState(0);
  const scenario = scenarios[active];
  const ScenarioIcon = scenario.icon;
  return <div className={`site-shell gs-home ${isDark ? "is-dark" : ""}`}>
    <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
    <main>
      <section className="gs-hero" id="inicio">
        <div className="gs-hero-copy"><p className="gs-eyebrow"><span className="gs-status-dot" /> GIOVSOFT · INTELIGENCIA APLICADA</p><h1>El siguiente<br />paso de tu negocio<br /><span>es inteligente.</span></h1><p className="gs-lead">Convertimos inteligencia artificial, diseño y software en soluciones que trabajan contigo. Conecta tu información. Simplifica tu operación. Crea lo que sigue.</p><div className="gs-actions"><a className="site-primary-button" href="/contacto">Construyamos tu solución <ArrowUpRight size={18} /></a><a className="gs-text-link" href="#posibilidades">Explora las posibilidades <ArrowDown size={16} /></a></div><div className="gs-hero-signature"><span>ESTRATEGIA</span><i /><span>DISEÑO</span><i /><span>DESARROLLO</span><i /><span>IA</span></div></div>
        <IntelligenceField />
        <div className="gs-hero-bottom"><span>TECNOLOGÍA CON INTENCIÓN. IMPACTO EN TU DÍA A DÍA.</span><a href="#posibilidades">Desliza para descubrir <ArrowDown size={13} /></a></div>
      </section>
      <div className="gs-capability-strip" aria-label="Nuestras capacidades"><span><BrainCircuit /> Inteligencia artificial</span><span><Workflow /> Automatización</span><span><Code2 /> Software a la medida</span><span><Layers3 /> Diseño de experiencias</span><span><Globe2 /> Web & cloud</span></div>
      <EditorialCarousel />
      <section className="gs-section gs-possibilities" id="posibilidades">
        <header className="gs-section-heading"><div><p className="gs-eyebrow">01 / LO QUE PODEMOS HACER</p><h2>La IA cobra sentido<br />cuando <em>resuelve algo.</em></h2></div><p>Partimos de tu negocio, no de una herramienta. Diseñamos la solución alrededor de lo que tu equipo necesita lograr.</p></header>
        <div className="gs-scenario-tabs" role="tablist" aria-label="Explorar aplicaciones de IA">{scenarios.map((item, i) => { const Icon = item.icon; return <button key={item.label} id={`scenario-tab-${i}`} role="tab" aria-selected={active === i} aria-controls="scenario-panel" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={event => { let next = i; if (event.key === "ArrowRight") next = (i + 1) % scenarios.length; else if (event.key === "ArrowLeft") next = (i + scenarios.length - 1) % scenarios.length; else if (event.key === "Home") next = 0; else if (event.key === "End") next = scenarios.length - 1; else return; event.preventDefault(); setActive(next); document.getElementById(`scenario-tab-${next}`)?.focus(); }}><Icon size={18} />{item.label}<ArrowUpRight size={15} /></button>; })}</div>
        <div className="gs-scenario" id="scenario-panel" role="tabpanel" aria-labelledby={`scenario-tab-${active}`}>
          <div className="gs-scenario-copy"><span className="gs-small-label">POSIBILIDAD / 0{active + 1}</span><h3>{scenario.title}</h3><p>{scenario.copy}</p><a className="gs-text-link" href={scenario.href}>Explorar esta solución <ArrowRight size={17} /></a><small>Ejemplo conceptual. Cada implementación se define y valida para tu proyecto.</small></div>
          <div className="gs-flow" key={active}><div className="gs-flow-top"><span><span className="gs-status-dot" /> FLUJO ILUSTRATIVO</span><GitBranch size={16} /></div><div className="gs-flow-input"><ScenarioIcon size={19} /><span>{scenario.input}</span><span>01</span></div><div className="gs-flow-line" /><div className="gs-flow-core"><div><BrainCircuit size={21} /><strong>Inteligencia + contexto</strong><Sparkles size={15} /></div><p>“{scenario.prompt}”</p><ol>{scenario.steps.map(step => <li key={step}><Check size={12} />{step}</li>)}</ol></div><div className="gs-flow-line" /><div className="gs-flow-output"><Check size={17} /><span>{scenario.output}</span></div><div className="gs-flow-review"><ShieldCheck size={13} /> Personas al mando. Revisión antes de actuar.</div></div>
        </div>
      </section>
      <section className="gs-section gs-solutions" id="soluciones"><header className="gs-section-heading"><div><p className="gs-eyebrow">02 / CAPACIDADES QUE SE CONECTAN</p><h2>De la idea<br /><em>a lo que funciona.</em></h2></div><a className="gs-text-link" href="/servicios">Todos nuestros servicios <ArrowUpRight size={17} /></a></header>
        <div className="gs-solution-grid">{[
          { n: "01", icon: BrainCircuit, title: "Inteligencia artificial", copy: "Asistentes, consulta de documentos y funciones inteligentes integradas en tus herramientas.", tags: "ASISTENTES / CONOCIMIENTO / INTEGRACIONES", href: "/servicios/inteligencia-artificial" },
          { n: "02", icon: Workflow, title: "Automatización con criterio", copy: "Flujos que conectan sistemas, organizan información y reducen tareas repetitivas.", tags: "PROCESOS / APIS / REVISIÓN HUMANA", href: "/servicios/automatizacion-ia" },
          { n: "03", icon: Code2, title: "Software & experiencias", copy: "Sitios, aplicaciones y sistemas a la medida. Diseño cuidado y tecnología lista para evolucionar.", tags: "WEB / APPS / SOFTWARE", href: "/servicios#desarrollo" },
          { n: "04", icon: Layers3, title: "Un ecosistema conectado", copy: "Cloud, productividad, ecommerce y comunicación para acompañar tu operación digital.", tags: "CLOUD / COMERCIO / PRODUCTIVIDAD", href: "/servicios#infraestructura" },
        ].map(item => {const Icon = item.icon; return <a className="gs-solution-card" href={item.href} key={item.n}><div><Icon size={26} /><span>{item.n}</span></div><h3>{item.title}</h3><p>{item.copy}</p><footer><small>{item.tags}</small><ArrowUpRight size={21} /></footer></a>;})}</div>
      </section>
      <section className="gs-akira-feature"><div className="gs-akira-art" aria-hidden="true"><div className="gs-akira-rings" /><img src="/img/akira/logo.jpeg" alt="" /><span>APRENDER. CREAR. AVANZAR.</span></div><div className="gs-akira-copy"><p className="gs-eyebrow"><span className="gs-status-dot" /> UN PRODUCTO GIOVSOFT · EN DESARROLLO</p><h2>Hola, <span>Akira.</span></h2><p className="gs-akira-intro">Una nueva forma de convertir<br />información en posibilidades.</p><p>Estamos creando una experiencia de IA para acompañar el aprendizaje y el trabajo. Dos ediciones, una misma visión: ayudarte a dar el siguiente paso.</p><div className="gs-akira-editions"><span>Students <ArrowUpRight size={14} /></span><span>Business <ArrowUpRight size={14} /></span></div><a className="site-primary-button" href="/akira">Conoce el proyecto Akira <ArrowRight size={17} /></a></div></section>
      <section className="gs-section gs-method"><header className="gs-section-heading"><div><p className="gs-eyebrow">03 / LA FORMA DE CONSTRUIRLO</p><h2>Ambición para imaginar.<br /><em>Criterio para ejecutar.</em></h2></div><a className="gs-text-link" href="/proceso">Así trabajamos <ArrowUpRight size={17} /></a></header><div className="gs-method-steps">{[{title:"Entendemos tu contexto",copy:"Escuchamos a tu equipo e identificamos dónde la tecnología puede aportar valor real."},{title:"Diseñamos la solución",copy:"Definimos experiencia, datos, integraciones y una primera etapa con alcance claro."},{title:"Construimos y validamos",copy:"Probamos contigo, medimos lo que importa y ajustamos antes de ponerlo en operación."},{title:"Evolucionamos contigo",copy:"Acompañamos la adopción y damos forma a las siguientes mejoras."}].map((step,i)=><article key={step.title}><span>0{i+1}<i /></span><h3>{step.title}</h3><p>{step.copy}</p></article>)}</div><div className="gs-principle"><ShieldCheck size={21} /><p>Diseñamos con permisos claros, contexto y revisión humana. La inteligencia amplía tus capacidades; las decisiones siguen en tus manos.</p></div></section>
      <section className="gs-section gs-ecosystem"><header className="gs-section-heading"><div><p className="gs-eyebrow">04 / MÁS ALLÁ DE UN PROYECTO</p><h2>Ideas propias.<br /><em>Un mismo impulso.</em></h2></div><p>También construimos productos y experiencias para aprender, crear y operar mejor.</p></header><div className="gs-ecosystem-grid">{[{title:"Academy",label:"APRENDER HACIENDO",copy:"Formación en tecnología para desarrollar nuevas habilidades.",href:"/academy",icon:Code2},{title:"Studios",label:"CREAR NUEVOS MUNDOS",copy:"Videojuegos y experiencias originales de GiovSoft.",href:"/studios",icon:AudioLines},{title:"Payments",label:"CONECTAR TU OPERACIÓN",copy:"Pagos y facturación alrededor de tu negocio.",href:"/payments",icon:Zap}].map(item=>{const Icon=item.icon;return <a href={item.href} key={item.title}><Icon size={22}/><small>{item.label}</small><h3>GiovSoft <strong>{item.title}</strong></h3><p>{item.copy}</p><ArrowUpRight size={20}/></a>;})}</div></section>
      <section className="gs-final-cta"><p className="gs-eyebrow">TU SIGUIENTE POSIBILIDAD EMPIEZA AQUÍ</p><h2>¿Y si tu próxima gran idea<br /><span>empieza con una conversación?</span></h2><a className="site-primary-button" href="/contacto">Hablemos de tu proyecto <ArrowUpRight size={20}/></a><a className="gs-text-link" href="/portafolio">Explora nuestras soluciones <ChevronRight size={15}/></a></section>
    </main><SiteFooter isDark={isDark}/>
  </div>;
}
