import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Code2,
  CreditCard,
  FileCheck2,
  Link2,
  LockKeyhole,
  Nfc,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Store,
  WalletCards,
  Zap,
} from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";
import "./PaymentsPage.css";

const capabilities = [
  { icon: Link2, title: "Links de pago", copy: "Genera enlaces claros para cobrar por mensaje, redes sociales o cualquier canal digital." },
  { icon: Store, title: "Checkout para tu negocio", copy: "Integra una experiencia de pago coherente con tu marca, productos y proceso de venta." },
  { icon: RefreshCw, title: "Pagos recurrentes", copy: "Automatiza cobros periódicos para membresías, planes, servicios y suscripciones." },
  { icon: ReceiptText, title: "Control de operaciones", copy: "Consulta el estado de tus cobros y conserva una trazabilidad ordenada de cada movimiento." },
  { icon: Code2, title: "Integración por API", copy: "Conecta pagos con tu sitio, ecommerce, aplicación o sistema administrativo." },
  { icon: BarChart3, title: "Información para decidir", copy: "Visualiza indicadores de cobro y comportamiento comercial desde un mismo lugar." },
  { icon: Nfc, title: "Tap to Pay", copy: "Acepta pagos presenciales sin contacto desde un dispositivo compatible, sin depender de una terminal adicional." },
  { icon: FileCheck2, title: "Facturación conectada", copy: "Relaciona cobros con la solicitud, generación y seguimiento de comprobantes fiscales mediante servicios integrados." },
];

const flow = [
  ["01", "Configura", "Definimos el flujo, los conceptos de cobro y la experiencia que necesita tu operación."],
  ["02", "Comparte o integra", "Publica un link de pago o conecta el checkout con tu canal digital."],
  ["03", "Recibe el pago", "El cliente completa una experiencia sencilla, clara y adaptada a cualquier pantalla."],
  ["04", "Consulta", "Da seguimiento a cada operación desde un panel centralizado."],
];

const audiences = [
  { icon: Store, title: "Comercio digital", copy: "Para vender productos y servicios desde un sitio web o tienda en línea." },
  { icon: Smartphone, title: "Aplicaciones", copy: "Para incorporar cobros dentro de experiencias móviles y plataformas digitales." },
  { icon: WalletCards, title: "Servicios y membresías", copy: "Para administrar pagos únicos o recurrentes con mayor orden." },
];

export default function PaymentsPage() {
  const { isDark, toggleTheme } = useSiteTheme();
  const contactMessage = encodeURIComponent("Hola GiovSoft, quiero conocer la solución Payments para recibir pagos en mi negocio.");

  return (
    <div className={`payments-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
      <main className="payments-page">
        <section className="payments-hero">
          <div className="payments-hero-copy">
            <div className="payments-brand"><span><CreditCard size={19} /></span><strong>GiovSoft</strong> Payments</div>
            <p className="payments-kicker">Pagos conectados a tu operación</p>
            <h1>Cobrar debería sentirse así de simple.</h1>
            <p className="payments-lead">Una solución para recibir, organizar e integrar pagos digitales sin perder de vista la experiencia de tus clientes ni el control de tu negocio.</p>
            <div className="payments-actions">
              <a className="payments-primary-button" href={`https://wa.me/525566042994?text=${contactMessage}`} target="_blank" rel="noreferrer">Solicitar información <ArrowRight size={17} /></a>
              <a className="payments-secondary-button" href="#capacidades">Conocer la solución</a>
            </div>
            <div className="payments-trust-row">
              <span><ShieldCheck size={16} /> Integración protegida</span>
              <span><Zap size={16} /> Experiencia ágil</span>
              <span><BadgeCheck size={16} /> Operación trazable</span>
            </div>
          </div>

          <div className="payments-console" aria-label="Vista conceptual del panel de pagos">
            <header><span><i /> Payments</span><small>OPERACIÓN EN LÍNEA</small></header>
            <div className="payments-balance"><small>Pagos recibidos</small><strong>$24,850.00</strong><span>MXN</span><b><BarChart3 size={14} /> +18.4% este mes</b></div>
            <div className="payments-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            <div className="payments-activity">
              <p><span><CheckCircle2 size={15} /></span><b>Pago completado<small>Pedido #2048</small></b><strong>+$1,250</strong></p>
              <p><span><Link2 size={15} /></span><b>Link compartido<small>Servicio mensual</small></b><strong>Pendiente</strong></p>
              <p><span><RefreshCw size={15} /></span><b>Suscripción renovada<small>Plan profesional</small></b><strong>+$899</strong></p>
            </div>
            <div className="payments-card-float"><CreditCard size={22} /><span>•••• 2048</span><i /></div>
          </div>
        </section>

        <section className="payments-statement">
          <p className="payments-kicker">Una experiencia, todos tus canales</p>
          <h2>Del primer clic al pago confirmado.</h2>
          <p>Payments reúne las herramientas necesarias para que el cobro sea una parte natural de tu experiencia digital y no un proceso aislado.</p>
        </section>

        <section className="payments-capabilities" id="capacidades">
          <header><div><p className="payments-kicker">Capacidades</p><h2>Más formas de cobrar. Un solo lugar para administrarlas.</h2></div><CircleDollarSign size={42} /></header>
          <div className="payments-capability-grid">
            {capabilities.map(({ icon: Icon, title, copy }, index) => (
              <article key={title}><span>0{index + 1}</span><Icon size={25} /><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
        </section>

        <section className="payments-flow">
          <div className="payments-flow-copy"><p className="payments-kicker">Cómo funciona</p><h2>Un recorrido claro para tu negocio y tus clientes.</h2><p>Diseñamos el flujo alrededor de tu forma de vender, para reducir pasos innecesarios y mantener visible cada operación.</p></div>
          <ol>{flow.map(([number, title, copy]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{copy}</p></div><Check size={18} /></li>)}</ol>
        </section>

        <section className="payments-expansion" id="tap-to-pay-facturacion">
          <header><p className="payments-kicker">Más posibilidades para cobrar</p><h2>Del mostrador a la factura, todo permanece conectado.</h2></header>
          <div className="payments-expansion-grid">
            <article className="payments-tap-card">
              <div className="payments-phone" aria-hidden="true">
                <span><Nfc size={39} /></span>
                <small>Acerca la tarjeta</small>
                <strong>$750.00</strong>
                <i>Listo para cobrar</i>
              </div>
              <div className="payments-expansion-copy">
                <span className="payments-feature-label">COBRO PRESENCIAL</span>
                <h3>Tap to Pay</h3>
                <p>Convierte un dispositivo compatible en un punto de cobro para aceptar pagos sin contacto de manera práctica, ideal para atención en mostrador, entregas, eventos y equipos en movimiento.</p>
                <ul><li><Check size={16} />Sin una terminal adicional.</li><li><Check size={16} />Confirmación inmediata de la operación.</li><li><Check size={16} />Movimientos visibles en el mismo panel.</li></ul>
                <small>Disponibilidad sujeta al dispositivo, sistema operativo, país y proveedor de procesamiento conectado.</small>
              </div>
            </article>

            <article className="payments-invoice-card">
              <div className="payments-invoice-preview" aria-hidden="true">
                <header><span><FileCheck2 size={20} /> Factura</span><b>EMITIDA</b></header>
                <div><small>OPERACIÓN</small><strong>#PAY-2048</strong></div>
                <p><span>Subtotal</span><b>$1,077.59</b></p><p><span>Impuestos</span><b>$172.41</b></p><p><span>Total</span><strong>$1,250.00</strong></p>
                <footer><CheckCircle2 size={17} /> Pago y comprobante relacionados</footer>
              </div>
              <div className="payments-expansion-copy">
                <span className="payments-feature-label">ADMINISTRACIÓN FISCAL</span>
                <h3>Facturación</h3>
                <p>Conecta cada pago con un flujo ordenado de facturación para reducir capturas repetidas y facilitar el seguimiento entre ventas, comprobantes y conciliación.</p>
                <ul><li><Check size={16} />Solicitud de datos de facturación.</li><li><Check size={16} />Generación mediante un proveedor fiscal integrado.</li><li><Check size={16} />Consulta y envío del comprobante al cliente.</li></ul>
                <small>La emisión fiscal depende de la configuración del negocio y de los proveedores autorizados que se integren.</small>
              </div>
            </article>
          </div>
        </section>

        <section className="payments-security">
          <div className="payments-security-visual" aria-hidden="true"><div><LockKeyhole size={42} /><span>PAYMENT</span><strong>PROTECTED</strong></div><i /><i /><i /></div>
          <div><p className="payments-kicker">Seguridad desde el diseño</p><h2>Confianza en cada paso del pago.</h2><p>La solución se implementa con controles técnicos, trazabilidad y buenas prácticas para proteger la experiencia, reducir exposición de datos y conectar proveedores especializados de manera responsable.</p><ul><li><ShieldCheck size={18} />Conexiones cifradas y configuración segura.</li><li><BadgeCheck size={18} />Validación de estados y confirmaciones de pago.</li><li><ReceiptText size={18} />Registro claro para conciliación y seguimiento.</li></ul></div>
        </section>

        <section className="payments-audiences">
          <header><p className="payments-kicker">Diseñado para crecer contigo</p><h2>Una base de pagos para distintos modelos de negocio.</h2></header>
          <div>{audiences.map(({ icon: Icon, title, copy }) => <article key={title}><Icon size={28} /><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className="payments-cta">
          <div><p className="payments-kicker">Activa una mejor experiencia de cobro</p><h2>Conecta tus pagos con el resto de tu negocio.</h2><p>Cuéntanos cómo cobras hoy y qué necesitas integrar. Te ayudaremos a definir la solución adecuada para tu operación.</p></div>
          <a className="payments-primary-button" href={`https://wa.me/525566042994?text=${contactMessage}`} target="_blank" rel="noreferrer">Hablar con GiovSoft <ArrowRight size={17} /></a>
        </section>
      </main>
      <SiteFooter isDark={isDark} />
    </div>
  );
}
