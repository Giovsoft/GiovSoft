import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const sections = [
  ["1", "Responsable de los datos"],
  ["2", "Datos personales que recabamos"],
  ["3", "Datos sensibles"],
  ["4", "Finalidades primarias"],
  ["5", "Finalidades secundarias"],
  ["6", "Cookies y datos técnicos"],
  ["7", "Transferencias y encargados"],
  ["8", "Servicios y plataformas de terceros"],
  ["9", "Derechos ARCO"],
  ["10", "Revocación y limitación"],
  ["11", "Conservación de los datos"],
  ["12", "Medidas de seguridad"],
  ["13", "Cambios al Aviso"],
  ["14", "Contacto y consentimiento"],
] as const;

export default function PrivacyPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell legal-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="legal-page">
        <section className="legal-hero legal-privacy-hero">
          <div>
            <p className="site-kicker">Privacidad y datos personales</p>
            <h1>Aviso de Privacidad Integral</h1>
            <p>
              Última actualización: 6 de agosto de 2026. Aquí explicamos qué datos
              personales recabamos, para qué los utilizamos y cómo puede ejercer sus
              derechos sobre ellos.
            </p>
          </div>
        </section>

        <section className="legal-layout">
          <aside className="legal-toc" aria-label="Contenido del aviso de privacidad">
            <strong>Contenido</strong>
            <nav>
              {sections.map(([number, title]) => (
                <a key={number} href={`#privacidad-${number}`}>
                  {number}. {title}
                </a>
              ))}
            </nav>
            <a className="legal-related-link" href="/terminos">
              Ver Términos y Condiciones
            </a>
          </aside>

          <article className="legal-document">
            <p>
              En <strong>GiovSoft Technologies, S.A.S.</strong> respetamos la privacidad
              de visitantes, prospectos, clientes, proveedores y usuarios. Este Aviso
              describe el tratamiento de los datos obtenidos mediante <strong>giovsoft.com</strong>,
              formularios, correo electrónico, WhatsApp, cotizaciones, contratos y la
              prestación de nuestros servicios.
            </p>

            <div className="legal-highlight">
              <strong>Resumen</strong>
              <p>
                Utilizamos los datos necesarios para responder solicitudes, preparar
                propuestas, ejecutar proyectos, administrar pagos y brindar soporte.
                No vendemos datos personales ni los usamos para publicidad de terceros.
              </p>
            </div>

            <h2 id="privacidad-1">1. Responsable de los datos</h2>
            <p>
              El responsable del tratamiento es <strong>GiovSoft Technologies, S.A.S.</strong>
              (“GiovSoft”), con domicilio en Col. Alcalde Barranquitas, Guadalajara,
              Jalisco, México, C.P. 44270. El domicilio fiscal completo está disponible
              a solicitud de la persona titular y en el comprobante fiscal correspondiente.
            </p>
            <p>
              Para asuntos de privacidad puede contactar al Departamento de Datos
              Personales mediante <a href="mailto:privacidad@giovsoft.com">privacidad@giovsoft.com</a>.
            </p>

            <h2 id="privacidad-2">2. Datos personales que recabamos</h2>
            <p>Dependiendo de su relación con GiovSoft, podremos tratar:</p>
            <ul>
              <li><strong>Identificación y contacto:</strong> nombre, empresa, puesto, correo electrónico, teléfono y firma.</li>
              <li><strong>Información comercial:</strong> servicio de interés, necesidades, presupuesto, mensajes, cotizaciones, contratos e historial de atención.</li>
              <li><strong>Información fiscal y de pago:</strong> razón social, RFC, régimen fiscal, domicilio fiscal, uso de CFDI y referencias de pago.</li>
              <li><strong>Información del proyecto:</strong> contenidos, archivos, marca, dominio, cuentas, configuraciones, usuarios y accesos necesarios.</li>
              <li><strong>Datos técnicos:</strong> dirección IP, navegador, dispositivo, registros de acceso, fecha, hora y eventos de seguridad.</li>
            </ul>
            <p>
              Cuando recibimos datos de colaboradores o contactos del Cliente, este se
              compromete a contar con una base legítima para compartirlos y a informarles
              sobre este Aviso cuando corresponda.
            </p>

            <h2 id="privacidad-3">3. Datos sensibles</h2>
            <p>
              GiovSoft no solicita de forma habitual datos personales sensibles. Le
              pedimos no enviar información sobre salud, biometría, origen étnico,
              creencias, afiliación, orientación sexual u otros datos sensibles, salvo
              que resulte estrictamente necesario, exista una finalidad legítima y se
              haya establecido previamente el mecanismo de consentimiento aplicable.
            </p>

            <h2 id="privacidad-4">4. Finalidades primarias</h2>
            <p>Los datos serán utilizados para finalidades necesarias, entre ellas:</p>
            <ul>
              <li>Responder preguntas y solicitudes enviadas por el sitio, correo o WhatsApp.</li>
              <li>Identificar necesidades y preparar diagnósticos, propuestas y cotizaciones.</li>
              <li>Formalizar, administrar y cumplir la relación contractual.</li>
              <li>Diseñar, desarrollar, configurar, entregar y mantener los servicios contratados.</li>
              <li>Gestionar dominios, cuentas, licencias e integraciones solicitadas.</li>
              <li>Procesar pagos, emitir comprobantes y cumplir obligaciones fiscales y contables.</li>
              <li>Brindar soporte, seguimiento, seguridad y atención de incidentes.</li>
              <li>Prevenir fraude, uso indebido y accesos no autorizados.</li>
              <li>Cumplir obligaciones legales y atender requerimientos de autoridad competente.</li>
            </ul>

            <h2 id="privacidad-5">5. Finalidades secundarias</h2>
            <p>
              Con su consentimiento, podremos enviar novedades, recomendaciones,
              encuestas, invitaciones y promociones de servicios de GiovSoft. Estas
              finalidades no son necesarias para la relación principal. Puede oponerse
              o retirar su consentimiento en cualquier momento escribiendo a
              <a href="mailto:privacidad@giovsoft.com"> privacidad@giovsoft.com</a>, sin
              afectar los servicios ya contratados.
            </p>

            <h2 id="privacidad-6">6. Cookies y datos técnicos</h2>
            <p>
              El sitio puede utilizar cookies, almacenamiento local y tecnologías
              similares para recordar preferencias —por ejemplo, el modo visual—,
              mantener funciones esenciales, proteger sesiones, diagnosticar errores y
              conocer el desempeño general del sitio. Puede limitar estas tecnologías
              desde su navegador; algunas funciones podrían dejar de operar correctamente.
            </p>

            <h2 id="privacidad-7">7. Transferencias y encargados</h2>
            <p>
              Podemos compartir datos con proveedores que actúan por cuenta de GiovSoft
              para prestar alojamiento, correo, almacenamiento, soporte, facturación,
              comunicaciones, seguridad o procesamiento de pagos. Estos proveedores
              reciben únicamente la información necesaria y están sujetos a obligaciones
              contractuales, políticas propias y medidas de protección aplicables.
            </p>
            <p>
              También podremos comunicar información a autoridades cuando exista una
              obligación jurídica, mandato fundado o sea necesario para ejercer o
              defender derechos. No transferimos datos a terceros para que realicen su
              propia publicidad. Cuando una transferencia requiera consentimiento, este
              se solicitará conforme a la legislación aplicable.
            </p>

            <h2 id="privacidad-8">8. Servicios y plataformas de terceros</h2>
            <p>
              A petición del Cliente podemos configurar servicios como Google Workspace,
              registradores de dominio, proveedores de hosting, Stripe, Mercado Pago,
              plataformas logísticas u otras integraciones. En esos casos, el proveedor
              correspondiente puede actuar como responsable independiente y tratar datos
              conforme a su propio aviso de privacidad. Recomendamos revisar esos avisos
              antes de activar cada servicio.
            </p>

            <h2 id="privacidad-9">9. Derechos ARCO</h2>
            <p>
              La persona titular puede ejercer sus derechos de <strong>Acceso, Rectificación,
              Cancelación y Oposición</strong> (ARCO). Para presentar una solicitud debe
              escribir a <a href="mailto:privacidad@giovsoft.com">privacidad@giovsoft.com</a> e incluir:
            </p>
            <ul>
              <li>Nombre y medio para comunicar la respuesta.</li>
              <li>Documento o información suficiente para acreditar su identidad y, en su caso, representación.</li>
              <li>Descripción clara de los datos y del derecho que desea ejercer.</li>
              <li>Elementos que faciliten la localización de la información.</li>
              <li>En rectificación, la corrección solicitada y documentación que la sustente.</li>
            </ul>
            <p>
              GiovSoft atenderá la solicitud dentro de los plazos y condiciones previstos
              por la legislación vigente. Si la información resulta insuficiente, podremos
              pedir datos adicionales para verificar la identidad o localizar los registros.
            </p>

            <h2 id="privacidad-10">10. Revocación y limitación</h2>
            <p>
              Puede solicitar la revocación del consentimiento o limitar el uso y
              divulgación de sus datos mediante el mismo correo. La revocación no tendrá
              efectos retroactivos y podría no proceder cuando el tratamiento sea necesario
              para cumplir una relación jurídica, conservar evidencia, atender obligaciones
              legales o ejercer derechos.
            </p>

            <h2 id="privacidad-11">11. Conservación de los datos</h2>
            <p>
              Conservaremos los datos durante el tiempo necesario para las finalidades
              descritas y, posteriormente, durante los plazos legales, fiscales,
              contractuales o de prescripción aplicables. Al concluir esos periodos, los
              datos serán eliminados, anonimizados o bloqueados conforme corresponda.
            </p>

            <h2 id="privacidad-12">12. Medidas de seguridad</h2>
            <p>
              Mantenemos medidas administrativas, técnicas y físicas razonables para
              proteger la información contra daño, pérdida, alteración, destrucción,
              acceso o tratamiento no autorizado. Ningún sistema es completamente
              infalible; si detectamos una vulneración que afecte significativamente sus
              derechos, la comunicaremos conforme a la normativa aplicable.
            </p>

            <h2 id="privacidad-13">13. Cambios al Aviso</h2>
            <p>
              Este Aviso podrá actualizarse por cambios legales, operativos o en nuestros
              servicios. La versión vigente y su fecha de actualización estarán disponibles
              en esta página. Cuando un cambio requiera un nuevo consentimiento, se
              habilitará el mecanismo correspondiente.
            </p>

            <h2 id="privacidad-14">14. Contacto y consentimiento</h2>
            <p>
              Para consultas sobre este Aviso o sobre el tratamiento de sus datos escriba
              a <a href="mailto:privacidad@giovsoft.com">privacidad@giovsoft.com</a>. Al
              proporcionar voluntariamente sus datos después de tener disponible este
              Aviso, consiente su tratamiento para las finalidades primarias, salvo los
              casos en que la ley exija una manifestación expresa distinta.
            </p>

            <p className="legal-closing">Aviso vigente a partir del 6 de agosto de 2026.</p>
          </article>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
