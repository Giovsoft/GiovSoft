import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { openCookieSettingsEvent } from "../components/CookieConsent";
import { useSiteTheme } from "../hooks/useSiteTheme";

const sections = [["1","Qué son estas tecnologías"],["2","Qué utilizamos"],["3","Tecnologías necesarias"],["4","Preferencias"],["5","Analítica y publicidad"],["6","Duración"],["7","Administrar su decisión"],["8","Servicios de terceros"],["9","Cambios"],["10","Contacto"]] as const;

export default function CookiesPage() {
  const { isDark, toggleTheme } = useSiteTheme();
  const openSettings = () => window.dispatchEvent(new Event(openCookieSettingsEvent));

  return (
    <div className={`service-page-shell legal-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
      <main className="legal-page">
        <section className="legal-hero legal-cookies-hero"><div><p className="site-kicker">Privacidad en el navegador</p><h1>Política de Cookies y Almacenamiento Local</h1><p>Última actualización: 7 de agosto de 2026. Explicamos qué información técnica conserva giovsoft.com y cómo puede controlarla.</p></div></section>
        <section className="legal-layout">
          <aside className="legal-toc" aria-label="Contenido de la política de cookies"><strong>Contenido</strong><nav>{sections.map(([number,title])=><a key={number} href={`#cookie-${number}`}>{number}. {title}</a>)}</nav><button className="legal-cookie-settings" onClick={openSettings} type="button">Cambiar preferencias</button></aside>
          <article className="legal-document">
            <p>Esta Política complementa nuestro <a href="/privacidad">Aviso de Privacidad</a> y describe el uso de cookies, almacenamiento local y tecnologías equivalentes en <strong>giovsoft.com</strong>.</p>
            <div className="legal-highlight"><strong>Estado actual</strong><p>El sitio no utiliza publicidad. Puede activar voluntariamente preferencias y medición anónima; la analítica sólo se carga cuando existe una herramienta configurada y usted la autoriza.</p></div>
            <h2 id="cookie-1">1. Qué son estas tecnologías</h2><p>Las cookies son pequeños archivos que un sitio puede guardar mediante el navegador. El almacenamiento local cumple una función similar y permite conservar información en el dispositivo. Estas tecnologías pueden ser necesarias para operar una función o utilizarse, con permiso, para recordar preferencias.</p>
            <h2 id="cookie-2">2. Qué utilizamos</h2><p>GiovSoft utiliza almacenamiento local para conservar el consentimiento y las preferencias autorizadas. Si está configurada una herramienta de analítica, ésta sólo se carga después de recibir su consentimiento expreso.</p>
            <h2 id="cookie-3">3. Tecnologías necesarias</h2><p>Guardamos <strong>giovsoft-cookie-consent</strong> para recordar la versión de la política, su decisión y la fecha en que fue registrada. Este almacenamiento es necesario para evitar solicitar la misma elección en cada visita. El área administrativa utiliza además almacenamiento estrictamente necesario para mantener sesiones seguras y funciones operativas de usuarios autorizados.</p>
            <h2 id="cookie-4">4. Preferencias</h2><p>Con su autorización guardamos <strong>site-theme</strong>, que recuerda si eligió el modo claro u oscuro. Si selecciona “Solo necesarias”, esta preferencia no se conserva y cualquier valor almacenado previamente se elimina.</p>
            <h2 id="cookie-5">5. Analítica y publicidad</h2><p>Con su autorización podemos utilizar Google Analytics para conocer páginas consultadas y mejorar el sitio. La medición se configura para reducir la información identificable y no se activa si elige “Solo necesarias”. No utilizamos publicidad personalizada ni compartimos hábitos de navegación con anunciantes.</p>
            <h2 id="cookie-6">6. Duración</h2><p>La decisión permanece hasta que se elimina desde el navegador, se cambia mediante el panel de preferencias o publicamos una nueva versión que requiera solicitarla nuevamente. La preferencia visual permanece hasta que usted la modifique o retire su consentimiento.</p>
            <h2 id="cookie-7">7. Cómo administrar su decisión</h2><p>Puede aceptar las preferencias, utilizar únicamente tecnologías necesarias o cambiar su elección en cualquier momento. También puede borrar el almacenamiento desde la configuración de su navegador.</p><button className="legal-inline-button" onClick={openSettings} type="button">Abrir preferencias de cookies</button>
            <h2 id="cookie-8">8. Servicios de terceros</h2><p>Los enlaces a WhatsApp, redes sociales, tiendas de aplicaciones y sitios de clientes conducen a servicios externos. Al abrirlos, esos terceros pueden utilizar sus propias cookies conforme a sus políticas. GiovSoft no controla el almacenamiento aplicado fuera de giovsoft.com.</p>
            <h2 id="cookie-9">9. Cambios</h2><p>Podremos actualizar esta Política por cambios legales, técnicos o en las funciones del sitio. Cuando un cambio afecte tecnologías opcionales, renovaremos el consentimiento cuando corresponda.</p>
            <h2 id="cookie-10">10. Contacto</h2><p>Para preguntas sobre privacidad o estas tecnologías, escriba a <a href="mailto:privacidad@giovsoft.com">privacidad@giovsoft.com</a>.</p>
            <p className="legal-closing">Política vigente a partir del 7 de agosto de 2026.</p>
          </article>
        </section>
      </main>
      <SiteFooter isDark={isDark} />
    </div>
  );
}
