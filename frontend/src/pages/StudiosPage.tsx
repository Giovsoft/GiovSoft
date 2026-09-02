import {
  ArrowRight,
  Box,
  Code2,
  Gamepad2,
  Headphones,
  Joystick,
  Layers3,
  MonitorPlay,
  Palette,
  Rocket,
  Sparkles,
  UsersRound,
  Volume2,
} from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";
import "./StudiosPage.css";

const disciplines = [
  { title: "Diseño de juego", copy: "Mecánicas, reglas, progresión, economía y experiencias que mantienen al jugador involucrado.", icon: Gamepad2 },
  { title: "Arte y animación", copy: "Dirección visual, personajes, escenarios, interfaces, efectos y movimiento con una identidad coherente.", icon: Palette },
  { title: "Desarrollo", copy: "Sistemas de juego, inteligencia de enemigos, físicas, guardado, herramientas e integraciones.", icon: Code2 },
  { title: "Audio interactivo", copy: "Ambientes, efectos, música y respuestas sonoras que refuerzan cada acción dentro del juego.", icon: Volume2 },
];

const platforms = [
  { title: "PC", detail: "Experiencias para escritorio y distribución digital.", icon: MonitorPlay },
  { title: "Móvil", detail: "Juegos pensados para Android y iOS.", icon: Joystick },
  { title: "Web", detail: "Experiencias jugables directamente en navegador.", icon: Layers3 },
];

const productionSteps = [
  ["01", "Concepto", "Definimos la fantasía central, el público, la plataforma y la propuesta jugable."],
  ["02", "Prototipo", "Construimos una versión rápida para validar si la mecánica principal realmente funciona."],
  ["03", "Preproducción", "Establecemos arte, alcance, arquitectura, contenido, riesgos y plan de producción."],
  ["04", "Producción", "Desarrollamos sistemas, niveles, arte, audio e interfaz mediante entregas iterativas."],
  ["05", "Pruebas", "Evaluamos estabilidad, dificultad, rendimiento, accesibilidad y experiencia del jugador."],
  ["06", "Lanzamiento", "Preparamos publicación, materiales de tienda, analítica y una ruta de actualizaciones."],
];

export default function StudiosPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`studios-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
      <main className="studios-page">
        <section className="studios-hero">
          <div className="studios-hero-noise" aria-hidden="true" />
          <div className="studios-hero-copy">
            <div className="studios-brand-lockup"><Gamepad2 size={19} /><span>GiovSoft</span><strong>Studios</strong></div>
            <p className="studios-kicker">Videojuegos y experiencias interactivas</p>
            <h1>Creamos mundos que invitan a jugar.</h1>
            <p>GiovSoft Studios es el lugar donde imaginamos, desarrollamos y publicamos nuestros propios videojuegos para que puedas descubrirlos, adquirirlos y jugarlos.</p>
            <div className="studios-actions">
              <a className="studios-primary-button" href="#juegos">Ver nuestros juegos <ArrowRight size={17} /></a>
              <a className="studios-ghost-button" href="#universo">Conocer Studios</a>
            </div>
          </div>

          <div className="studios-game-scene" aria-hidden="true">
            <div className="studios-moon" />
            <div className="studios-stars"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="studios-orbit orbit-one" /><div className="studios-orbit orbit-two" />
            <div className="studios-floating-island"><span /><i /><b /></div>
            <div className="studios-player"><span /><i /></div>
            <div className="studios-crystal crystal-one" /><div className="studios-crystal crystal-two" />
            <div className="studios-hud"><span>PLAYER 01</span><div><i /><i /><i /></div></div>
            <div className="studios-level"><small>WORLD</small><strong>01</strong><span>Dreaming systems</span></div>
          </div>
          <div className="studios-scroll-cue"><span>Explora</span><i /></div>
        </section>

        <section className="studios-manifesto" id="universo">
          <span>PLAY / CREATE / ITERATE</span>
          <h2>Cada juego es una nueva forma de entrar al universo GiovSoft.</h2>
          <p>Creamos títulos propios con personalidad, mecánicas claras y mundos que vale la pena explorar. Cada lanzamiento nace de nuestra curiosidad por contar historias, diseñar retos y convertir tecnología en momentos memorables.</p>
        </section>

        <section className="studios-disciplines" id="capacidades">
          <header><div><p className="studios-kicker">Dentro del estudio</p><h2>Así construimos nuestros videojuegos.</h2></div><Sparkles size={34} /></header>
          <div>{disciplines.map((discipline, index) => { const Icon = discipline.icon; return <article key={discipline.title}><span>0{index + 1}</span><Icon size={26} /><h3>{discipline.title}</h3><p>{discipline.copy}</p></article>; })}</div>
        </section>

        <section className="studios-gameplay-loop">
          <div className="studios-loop-visual" aria-hidden="true">
            <div className="studios-loop-core"><Gamepad2 size={34} /><strong>GAMEPLAY</strong><span>El corazón del juego</span></div>
            <article className="loop-node node-discover"><Sparkles size={18} /><span>Descubrir</span></article>
            <article className="loop-node node-decide"><Joystick size={18} /><span>Decidir</span></article>
            <article className="loop-node node-master"><Rocket size={18} /><span>Dominar</span></article>
          </div>
          <div><p className="studios-kicker">Diseño centrado en el jugador</p><h2>Queremos que jugar se sienta bien desde el primer minuto.</h2><p>Cada mecánica de nuestros títulos debe ser fácil de comprender, interesante de dominar y significativa dentro de su mundo. Refinamos el ritmo, la progresión y la respuesta del juego hasta lograr una experiencia clara y satisfactoria.</p><ul><li><Box size={17} />Prototipos jugables desde etapas tempranas.</li><li><UsersRound size={17} />Pruebas con jugadores para mejorar cada versión.</li><li><Headphones size={17} />Imagen, movimiento y sonido como un solo lenguaje.</li></ul></div>
        </section>

        <section className="studios-platforms">
          <div><p className="studios-kicker">Dónde jugar</p><h2>Nuestros mundos estarán donde quieras jugarlos.</h2></div>
          <div>{platforms.map((platform) => { const Icon = platform.icon; return <article key={platform.title}><Icon size={28} /><h3>{platform.title}</h3><p>{platform.detail}</p><span>Explorar posibilidades <ArrowRight size={15} /></span></article>; })}</div>
        </section>

        <section className="studios-catalog" id="juegos">
          <header>
            <div><p className="studios-kicker">Juegos de GiovSoft Studios</p><h2>Nuestro catálogo está tomando forma.</h2></div>
            <p>Estamos trabajando en los primeros títulos de GiovSoft Studios. Aquí encontrarás sus avances, plataformas, fechas de lanzamiento y enlaces oficiales para adquirirlos.</p>
          </header>
          <article className="studios-release-card">
            <div className="studios-release-art" aria-hidden="true"><Gamepad2 size={58} /><span>NEW WORLD</span><i /><i /><i /></div>
            <div className="studios-release-copy">
              <span className="studios-status">En desarrollo</span>
              <h3>Primer lanzamiento de GiovSoft Studios</h3>
              <p>Una nueva experiencia original se encuentra en producción. Muy pronto revelaremos su nombre, universo, mecánicas y las plataformas donde podrás jugarla.</p>
              <div className="studios-release-tags"><span>Juego original</span><span>Próximamente</span><span>Actualizaciones aquí</span></div>
              <strong>PRESS START SOON</strong>
            </div>
          </article>
        </section>

        <section className="studios-production">
          <header><p className="studios-kicker">Detrás de cada lanzamiento</p><h2>De una idea emocionante a un mundo listo para jugar.</h2></header>
          <ol>{productionSteps.map(([number, title, copy]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{copy}</p></div></li>)}</ol>
        </section>

        <section className="studios-cta">
          <div className="studios-cta-controller" aria-hidden="true"><Gamepad2 size={76} /><i /><i /></div>
          <div><p className="studios-kicker">Press start</p><h2>El próximo mundo está en camino.</h2><p>Visita GiovSoft Studios para conocer anuncios, avances y nuevos lanzamientos. Este será el punto de partida para descubrir y adquirir todos nuestros videojuegos.</p></div>
          <a className="studios-primary-button" href="#juegos">Ver próximos lanzamientos <ArrowRight size={17} /></a>
        </section>
      </main>
      <SiteFooter isDark={isDark} />
    </div>
  );
}
