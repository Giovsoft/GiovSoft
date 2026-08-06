import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const sections = [
  ["1", "Titular del sitio"],
  ["2", "Objeto del sitio"],
  ["3", "Condiciones de acceso y uso"],
  ["4", "Información y contenidos"],
  ["5", "Propiedad intelectual"],
  ["6", "Enlaces y servicios externos"],
  ["7", "Disponibilidad y seguridad"],
  ["8", "Exclusión de responsabilidad"],
  ["9", "Datos personales"],
  ["10", "Comunicaciones"],
  ["11", "Cambios al Aviso"],
  ["12", "Legislación aplicable"],
] as const;

export default function LegalNoticePage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell legal-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="legal-page">
        <section className="legal-hero legal-notice-hero">
          <div>
            <p className="site-kicker">Información del sitio</p>
            <h1>Aviso Legal</h1>
            <p>
              Última actualización: 6 de agosto de 2026. Este documento identifica al
              titular de giovsoft.com y establece las condiciones generales para navegar
              y utilizar sus contenidos.
            </p>
          </div>
        </section>

        <section className="legal-layout">
          <aside className="legal-toc" aria-label="Contenido del aviso legal">
            <strong>Contenido</strong>
            <nav>
              {sections.map(([number, title]) => (
                <a key={number} href={`#aviso-${number}`}>
                  {number}. {title}
                </a>
              ))}
            </nav>
            <div className="legal-related-links">
              <a href="/terminos">Términos y Condiciones</a>
              <a href="/privacidad">Aviso de Privacidad</a>
            </div>
          </aside>

          <article className="legal-document">
            <p>
              El acceso a <strong>giovsoft.com</strong> atribuye la condición de usuario
              del sitio e implica la aceptación de este Aviso Legal en lo relativo a la
              navegación. La contratación de servicios se rige además por nuestros
              <a href="/terminos"> Términos y Condiciones</a> y por la propuesta,
              cotización o contrato correspondiente.
            </p>

            <div className="legal-highlight">
              <strong>Alcance de este documento</strong>
              <p>
                El contenido del sitio presenta de forma general los servicios de GiovSoft.
                No constituye por sí mismo una oferta contractual ni sustituye una
                cotización personalizada.
              </p>
            </div>

            <h2 id="aviso-1">1. Titular del sitio</h2>
            <p>
              El titular y responsable de este sitio es <strong>GiovSoft Technologies,
              S.A.S.</strong>, con domicilio en Col. Alcalde Barranquitas, Guadalajara,
              Jalisco, México, C.P. 44270.
            </p>
            <ul>
              <li><strong>Sitio web:</strong> giovsoft.com</li>
              <li><strong>Correo general:</strong> <a href="mailto:contacto@giovsoft.com">contacto@giovsoft.com</a></li>
              <li><strong>Privacidad:</strong> <a href="mailto:privacidad@giovsoft.com">privacidad@giovsoft.com</a></li>
            </ul>

            <h2 id="aviso-2">2. Objeto del sitio</h2>
            <p>
              El sitio tiene como finalidad informar sobre GiovSoft y sus servicios de
              desarrollo web, ecommerce, dominios, correos corporativos, Google Workspace,
              integraciones, soporte y acompañamiento tecnológico, así como facilitar
              canales para solicitar información o iniciar una relación comercial.
            </p>

            <h2 id="aviso-3">3. Condiciones de acceso y uso</h2>
            <p>
              El usuario se compromete a utilizar el sitio de manera lícita, diligente y
              respetuosa. Queda prohibido intentar vulnerar su seguridad, introducir código
              malicioso, interferir con su funcionamiento, acceder sin autorización a
              sistemas o datos, suplantar identidades, enviar información falsa o utilizar
              los contenidos para infringir derechos de terceros.
            </p>
            <p>
              GiovSoft podrá restringir el acceso o adoptar medidas de protección cuando
              detecte actividad abusiva, automatizada, fraudulenta o que represente un
              riesgo para el sitio, sus usuarios o su infraestructura.
            </p>

            <h2 id="aviso-4">4. Información y contenidos</h2>
            <p>
              Procuramos que la información publicada sea clara, útil y actualizada. Sin
              embargo, las descripciones, imágenes, tecnologías, integraciones, precios
              orientativos y tiempos pueden cambiar. Las características definitivas de
              un servicio serán únicamente las establecidas en la propuesta aceptada por
              el Cliente.
            </p>
            <p>
              El contenido tiene fines informativos y no constituye asesoría jurídica,
              fiscal, financiera o de otra profesión regulada. El usuario debe consultar
              a un especialista para decisiones que requieran asesoramiento profesional.
            </p>

            <h2 id="aviso-5">5. Propiedad intelectual</h2>
            <p>
              Salvo que se indique lo contrario, el diseño, código, estructura, textos,
              gráficos, fotografías, logotipos, marcas, iconos y demás elementos del sitio
              son propiedad de GiovSoft o se utilizan bajo licencia. Están protegidos por
              la legislación nacional y los tratados aplicables en materia de propiedad
              intelectual e industrial.
            </p>
            <p>
              Se permite visualizar el sitio y compartir enlaces a sus páginas para fines
              legítimos. No se autoriza reproducir, modificar, distribuir, comercializar,
              extraer sistemáticamente o crear obras derivadas de sus contenidos sin
              autorización previa y escrita o sin una licencia que lo permita.
            </p>

            <h2 id="aviso-6">6. Enlaces y servicios externos</h2>
            <p>
              El sitio puede contener enlaces a páginas y servicios de terceros, como
              redes sociales, WhatsApp, Google, proveedores de pago, registradores de
              dominio o plataformas tecnológicas. Estos enlaces se ofrecen para facilitar
              el acceso y no implican que GiovSoft controle o respalde todo su contenido.
            </p>
            <p>
              Cada tercero es responsable de sus condiciones, disponibilidad, seguridad
              y prácticas de privacidad. El usuario debe revisar sus documentos antes de
              proporcionar información o contratar sus servicios.
            </p>

            <h2 id="aviso-7">7. Disponibilidad y seguridad</h2>
            <p>
              GiovSoft aplica medidas razonables para mantener el sitio disponible y
              seguro, pero no garantiza un funcionamiento ininterrumpido ni libre de
              errores. El acceso puede suspenderse por mantenimiento, actualizaciones,
              incidentes, causas técnicas, acciones de proveedores o eventos fuera de
              nuestro control.
            </p>
            <p>
              El usuario es responsable de proteger sus dispositivos, conexiones y
              credenciales, así como de mantener copias de la información que envíe o
              descargue cuando resulte necesario.
            </p>

            <h2 id="aviso-8">8. Exclusión de responsabilidad</h2>
            <p>
              En la medida permitida por la legislación aplicable, GiovSoft no será
              responsable por decisiones tomadas únicamente con base en información
              general del sitio, por daños derivados del uso indebido, por contenido de
              terceros ni por interrupciones ajenas a su control. Esta limitación no
              afecta los derechos irrenunciables reconocidos a consumidores y usuarios.
            </p>

            <h2 id="aviso-9">9. Datos personales</h2>
            <p>
              El tratamiento de datos personales obtenidos mediante formularios, correo,
              WhatsApp, cotizaciones y servicios se describe en nuestro
              <a href="/privacidad"> Aviso de Privacidad Integral</a>. Antes de enviar
              información personal, el usuario debe consultar dicho documento.
            </p>

            <h2 id="aviso-10">10. Comunicaciones</h2>
            <p>
              Las solicitudes enviadas mediante el sitio no crean por sí solas una
              relación contractual. GiovSoft podrá responder por correo, teléfono o
              WhatsApp utilizando los datos proporcionados. Las comunicaciones
              comerciales opcionales podrán rechazarse o cancelarse en cualquier momento.
            </p>

            <h2 id="aviso-11">11. Cambios al Aviso</h2>
            <p>
              GiovSoft podrá modificar este Aviso para reflejar cambios legales,
              tecnológicos, operativos o en el contenido del sitio. La versión vigente se
              publicará en esta dirección con la fecha de su última actualización. El uso
              del sitio después de la publicación estará sujeto al Aviso actualizado.
            </p>

            <h2 id="aviso-12">12. Legislación aplicable</h2>
            <p>
              Este Aviso se interpretará conforme a las leyes aplicables de México. Las
              controversias se atenderán de buena fe y, cuando proceda, ante las autoridades
              o tribunales competentes, sin perjuicio de los derechos irrenunciables y los
              mecanismos de protección al consumidor.
            </p>

            <p className="legal-closing">Aviso vigente a partir del 6 de agosto de 2026.</p>
          </article>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
