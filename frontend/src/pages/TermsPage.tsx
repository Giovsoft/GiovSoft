import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const sections = [
  ["1", "Identificación del prestador"],
  ["2", "Objeto y aceptación"],
  ["3", "Servicios"],
  ["4", "Cotizaciones y contratación"],
  ["5", "Obligaciones del cliente"],
  ["6", "Pagos, impuestos y facturación"],
  ["6.1", "GiovSoft Payments"],
  ["6.2", "Tap to Pay"],
  ["6.3", "Facturación conectada"],
  ["7", "Plazos, entregas y cambios"],
  ["8", "Servicios de terceros"],
  ["9", "Dominios y cuentas"],
  ["10", "Propiedad intelectual"],
  ["11", "Confidencialidad y datos"],
  ["12", "Garantías y soporte"],
  ["13", "Limitación de responsabilidad"],
  ["14", "Suspensión y terminación"],
  ["15", "Modificaciones"],
  ["16", "Legislación y jurisdicción"],
  ["17", "Contacto"],
] as const;

export default function TermsPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell legal-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="legal-page">
        <section className="legal-hero">
          <div>
            <p className="site-kicker">Documento legal</p>
            <h1>Términos y Condiciones de Uso</h1>
            <p>
              Última actualización: 2 de septiembre de 2026. Estos Términos regulan el
              acceso al sitio y la contratación de servicios de GiovSoft Technologies,
              S.A.S.
            </p>
          </div>
        </section>

        <section className="legal-layout">
          <aside className="legal-toc" aria-label="Contenido del documento">
            <strong>Contenido</strong>
            <nav>
              {sections.map(([number, title]) => (
                <a key={number} href={`#termino-${number}`}>
                  {number}. {title}
                </a>
              ))}
            </nav>
          </aside>

          <article className="legal-document">
            <p>
              Al navegar por <strong>giovsoft.com</strong>, solicitar información,
              aceptar una cotización o contratar un servicio, la persona física o
              moral correspondiente (el <strong>“Cliente”</strong>) reconoce haber
              leído y aceptado estos Términos. Las condiciones particulares de cada
              propuesta, orden de servicio o contrato complementan este documento y,
              en caso de diferencia, prevalecerán para el proyecto contratado.
            </p>

            <div className="legal-highlight">
              <strong>Importante</strong>
              <p>
                Cada proyecto se define mediante una cotización o propuesta que
                especifica alcance, entregables, precio y tiempos estimados. Cualquier
                trabajo que no aparezca en ese alcance se cotizará por separado.
              </p>
            </div>

            <h2 id="termino-1">1. Identificación del prestador</h2>
            <p>
              Los servicios son ofrecidos por <strong>GiovSoft Technologies, S.A.S.</strong>,
              en adelante <strong>“GiovSoft”</strong>. Para asuntos relacionados con
              estos Términos puede escribir a <a href="mailto:legal@giovsoft.com">legal@giovsoft.com</a>.
            </p>

            <h2 id="termino-2">2. Objeto y aceptación</h2>
            <p>
              Estos Términos establecen las reglas generales para el uso del sitio,
              el envío de solicitudes y la prestación de servicios tecnológicos. La
              aceptación podrá manifestarse por medios electrónicos, mediante el pago,
              la aprobación escrita de una propuesta o el inicio autorizado del trabajo.
            </p>

            <h2 id="termino-3">3. Servicios</h2>
            <p>
              GiovSoft ofrece, entre otros, diseño y desarrollo de sitios web y tiendas
              en línea, registro y configuración de dominios, correos corporativos,
              implementación de Google Workspace, integraciones, mantenimiento,
              soporte, acompañamiento tecnológico y soluciones de integración de pagos
              bajo la denominación GiovSoft Payments. La disponibilidad y características
              de cada servicio dependen de la propuesta aceptada, del territorio y de los
              proveedores tecnológicos o financieros involucrados.
            </p>

            <h2 id="termino-4">4. Cotizaciones y contratación</h2>
            <p>
              Las cotizaciones tienen la vigencia indicada en el documento y se basan
              en la información proporcionada por el Cliente. El servicio se considerará
              contratado cuando GiovSoft reciba la aceptación y, cuando corresponda,
              el anticipo acordado. Solicitudes adicionales o cambios de alcance podrán
              modificar el precio y el calendario.
            </p>

            <h2 id="termino-5">5. Obligaciones del cliente</h2>
            <p>El Cliente se compromete a:</p>
            <ul>
              <li>Proporcionar información, contenidos, accesos y aprobaciones de forma oportuna.</li>
              <li>Garantizar que cuenta con derechos para usar los textos, marcas, imágenes y materiales entregados.</li>
              <li>Revisar los avances y comunicar observaciones dentro de los plazos acordados.</li>
              <li>Mantener seguras sus credenciales y designar contactos autorizados para el proyecto.</li>
              <li>Usar los entregables y servicios de manera lícita y conforme a estos Términos.</li>
              <li>Cuando utilice Payments, ofrecer bienes y servicios lícitos e informar con claridad precios, impuestos, condiciones de venta, entrega, cancelación, devolución y reembolso.</li>
              <li>Atender contracargos, aclaraciones, devoluciones y obligaciones frente a sus clientes y autoridades.</li>
            </ul>

            <h2 id="termino-6">6. Pagos, impuestos y facturación</h2>
            <p>
              Los precios, moneda, impuestos, anticipos y fechas de pago se indican en
              la cotización. Salvo que se establezca lo contrario, los pagos realizados
              por etapas cubren el trabajo ejecutado y los recursos reservados. La
              facturación se realizará con los datos fiscales correctos proporcionados
              por el Cliente y conforme a la normativa aplicable.
            </p>

            <h2 id="termino-6.1">6.1. GiovSoft Payments</h2>
            <p>
              GiovSoft Payments es una solución tecnológica para integrar y administrar
              experiencias de cobro, links de pago, checkout, pagos recurrentes, Tap to Pay,
              reportes y facturación conectada. Salvo que una propuesta indique expresamente
              otra cosa, <strong>GiovSoft no es banco, institución de fondos de pago electrónico,
              adquirente, agregador, emisor de tarjetas ni cámara de compensación</strong>; el
              procesamiento, autorización, rechazo, liquidación y disponibilidad de fondos
              corresponde a los proveedores financieros contratados o integrados.
            </p>
            <p>
              El Cliente deberá aceptar los contratos, procesos de identificación, políticas,
              comisiones, reservas, límites y plazos del proveedor correspondiente. Las
              operaciones pueden ser rechazadas, retenidas, revisadas, canceladas o sujetas a
              contracargo por reglas de dichos terceros, redes de pago, emisores o autoridades.
              GiovSoft no garantiza la aprobación de una operación ni una fecha de liquidación.
            </p>

            <h2 id="termino-6.2">6.2. Tap to Pay</h2>
            <p>
              Tap to Pay permite habilitar cobros sin contacto mediante dispositivos y
              proveedores compatibles. Su funcionamiento depende, entre otros elementos, del
              modelo del dispositivo, sistema operativo, conectividad, tecnología NFC, país,
              moneda, tarjetas admitidas y disponibilidad del procesador. El Cliente es
              responsable de proteger el dispositivo, las cuentas asociadas, sus credenciales
              y el acceso de su personal, así como de verificar el resultado de cada cobro
              antes de entregar bienes o prestar servicios.
            </p>

            <h2 id="termino-6.3">6.3. Facturación conectada</h2>
            <p>
              Las funciones de facturación facilitan la captura, transmisión, consulta y
              relación de información fiscal con una operación. La certificación de
              comprobantes se realiza mediante el SAT o un proveedor autorizado integrado;
              <strong> GiovSoft no actúa como proveedor autorizado de certificación ni presta
              asesoría fiscal</strong>. El Cliente conserva la responsabilidad de proporcionar
              datos fiscales correctos, resguardar sus certificados y credenciales, determinar
              impuestos, revisar los comprobantes y cumplir sus obligaciones de emisión,
              cancelación, conservación y contabilidad.
            </p>

            <h2 id="termino-7">7. Plazos, entregas y cambios</h2>
            <p>
              Las fechas son estimaciones sujetas a la entrega puntual de información,
              accesos, pagos y aprobaciones. Una demora atribuible al Cliente o a un
              tercero podrá desplazar el calendario. Las rondas de revisión incluidas se
              especifican en la propuesta; las revisiones adicionales podrán generar un
              costo y plazo complementarios.
            </p>

            <h2 id="termino-8">8. Servicios de terceros</h2>
            <p>
              Algunos proyectos utilizan servicios de terceros, como alojamiento,
              dominios, Google Workspace, Stripe, Mercado Pago, plataformas logísticas,
              adquirentes, agregadores, redes de tarjetas, sistemas antifraude, proveedores
              autorizados de certificación, complementos o APIs. Dichos servicios se rigen por sus propios términos,
              precios y políticas. GiovSoft no controla sus interrupciones, cambios,
              restricciones o decisiones, pero apoyará al Cliente dentro del alcance
              contratado.
            </p>

            <h2 id="termino-9">9. Dominios y cuentas</h2>
            <p>
              El registro de un dominio depende de su disponibilidad al momento de la
              compra. Cuando el servicio lo permita, el dominio y las cuentas se
              registrarán a nombre del Cliente con datos proporcionados por este. El
              Cliente es responsable de mantener actualizada la información, proteger
              accesos y cubrir renovaciones antes de su vencimiento.
            </p>

            <h2 id="termino-10">10. Propiedad intelectual</h2>
            <p>
              Cada parte conserva los derechos sobre materiales, marcas, código,
              herramientas y conocimientos que poseía antes del proyecto. Una vez
              cubierto el precio total, el Cliente recibirá los derechos o la licencia
              de uso de los entregables finales en los términos de la propuesta. Las
              herramientas reutilizables, librerías, componentes generales y materiales
              de terceros conservarán sus licencias originales.
            </p>
            <p>
              Salvo pacto de confidencialidad o negativa escrita del Cliente, GiovSoft
              podrá mencionar el nombre del proyecto y mostrar sus elementos públicos
              como parte de su portafolio, sin revelar información confidencial.
            </p>

            <h2 id="termino-11">11. Confidencialidad y datos</h2>
            <p>
              Las partes protegerán la información identificada como confidencial y la
              utilizarán únicamente para ejecutar el proyecto. El tratamiento de datos
              personales se regirá por el aviso de privacidad aplicable. El Cliente no
              deberá compartir datos sensibles o credenciales que no sean necesarios
              para la prestación del servicio.
            </p>

            <h2 id="termino-12">12. Garantías y soporte</h2>
            <p>
              GiovSoft corregirá, durante el periodo indicado en la propuesta, errores
              reproducibles que impidan a los entregables cumplir el alcance aprobado.
              La garantía no cubre cambios realizados por terceros, uso indebido,
              contenido agregado después de la entrega, incompatibilidades sobrevenidas
              o fallas externas. El mantenimiento y soporte continuo requieren un plan
              vigente cuando no estén incluidos expresamente.
            </p>

            <h2 id="termino-13">13. Limitación de responsabilidad</h2>
            <p>
              GiovSoft no garantiza resultados comerciales, posicionamiento específico,
              ventas o disponibilidad ininterrumpida de plataformas externas. En la
              medida permitida por la legislación aplicable, ninguna parte responderá
              por daños indirectos, pérdida de beneficios o pérdida de información
              derivada de actos fuera de su control. Nada en esta cláusula limita los
              derechos irrenunciables que correspondan al consumidor.
            </p>

            <h2 id="termino-14">14. Suspensión y terminación</h2>
            <p>
              GiovSoft podrá suspender el trabajo o los servicios administrados ante
              falta de pago, uso ilícito, riesgo de seguridad o incumplimiento material,
              previa notificación cuando sea razonablemente posible. Cualquiera de las
              partes podrá terminar el servicio conforme a la propuesta; el Cliente
              deberá cubrir el trabajo realizado, gastos comprometidos y servicios de
              terceros adquiridos hasta la fecha de terminación.
            </p>

            <h2 id="termino-15">15. Modificaciones</h2>
            <p>
              GiovSoft podrá actualizar estos Términos para reflejar cambios operativos,
              legales o de los servicios. La versión vigente se publicará en esta página
              con su fecha de actualización. Los proyectos en curso conservarán las
              condiciones particulares aceptadas, salvo acuerdo escrito entre las partes.
            </p>

            <h2 id="termino-16">16. Legislación y jurisdicción</h2>
            <p>
              Estos Términos se interpretarán conforme a las leyes aplicables de México.
              Las partes procurarán resolver cualquier diferencia de buena fe y, cuando
              corresponda, podrán acudir a las autoridades de protección al consumidor.
              La jurisdicción específica podrá establecerse en la propuesta o contrato
              del servicio, sin perjuicio de los derechos irrenunciables del Cliente.
            </p>

            <h2 id="termino-17">17. Contacto</h2>
            <p>
              Para preguntas, aclaraciones o notificaciones relacionadas con estos
              Términos, escriba a <a href="mailto:legal@giovsoft.com">legal@giovsoft.com</a>.
            </p>

            <p className="legal-closing">Documento vigente a partir del 2 de septiembre de 2026.</p>
          </article>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
