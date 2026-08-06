import {
  ArrowRight,
  CalendarCheck2,
  ClipboardPlus,
  ContactRound,
  FileHeart,
  HeartPulse,
  LayoutDashboard,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

const clinicModules = [
  { title: "Administración", copy: "Una vista organizada de la operación diaria del consultorio.", icon: LayoutDashboard },
  { title: "Citas", copy: "Agenda y seguimiento de las consultas programadas.", icon: CalendarCheck2 },
  { title: "Pacientes", copy: "Información de contacto y seguimiento de cada paciente.", icon: UsersRound },
  { title: "Expedientes", copy: "Registro clínico organizado para apoyar la atención profesional.", icon: FileHeart },
];

export default function SoftwarePortfolioPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell software-catalog-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="software-catalog-page">
        <section className="software-catalog-hero">
          <div className="software-catalog-breadcrumb">
            <a href="/portafolio">Portafolio</a><span>/</span><strong>Software</strong>
          </div>
          <div className="software-catalog-hero-grid">
            <div>
              <p className="site-kicker">Catálogo de software</p>
              <h1>Sistemas que convierten procesos en una operación más clara.</h1>
            </div>
            <div>
              <p>
                Diseñamos software para centralizar información, reducir tareas manuales
                y ayudar a los equipos a trabajar con mayor orden y continuidad.
              </p>
              <span><ShieldCheck size={17} /> Productos en desarrollo y soluciones a la medida</span>
            </div>
          </div>
        </section>

        <section className="software-product">
          <div className="software-product-copy">
            <div className="software-product-meta">
              <span>Producto 01</span>
              <strong><i /> En desarrollo</strong>
            </div>
            <div className="software-product-brand">
              <div><HeartPulse size={30} /></div>
              <span><strong>GiovSoft</strong><b>Clinic</b></span>
            </div>
            <p className="site-kicker">CRM para consultorios</p>
            <h2>La operación del consultorio, conectada en un solo sistema.</h2>
            <p>
              Software CRM en desarrollo para consultorios, dentistas y profesionales
              de la salud. Su objetivo es apoyar la administración diaria, organizar
              citas y mantener el seguimiento de pacientes y expedientes.
            </p>
            <div className="software-audience">
              <span><Stethoscope size={17} /> Doctores</span>
              <span><ClipboardPlus size={17} /> Dentistas</span>
              <span><ContactRound size={17} /> Consultorios</span>
            </div>
            <a href="/contacto">Solicitar información <ArrowRight size={17} /></a>
          </div>

          <div className="clinic-dashboard" aria-hidden="true">
            <aside>
              <div className="clinic-mini-logo"><HeartPulse size={21} /></div>
              <i /><i /><i /><i />
            </aside>
            <div className="clinic-dashboard-main">
              <header><div><small>Resumen</small><strong>Buenos días, Doctor</strong></div><span /></header>
              <div className="clinic-stats"><article><small>Citas de hoy</small><strong>08</strong></article><article><small>Pacientes</small><strong>124</strong></article><article><small>Pendientes</small><strong>03</strong></article></div>
              <div className="clinic-dashboard-grid">
                <section><strong>Próximas citas</strong><p><i />09:30 <span>Consulta general</span></p><p><i />11:00 <span>Seguimiento</span></p><p><i />13:30 <span>Primera consulta</span></p></section>
                <section><strong>Actividad</strong><div className="clinic-chart"><i /><i /><i /><i /><i /><i /><i /></div></section>
              </div>
            </div>
          </div>
        </section>

        <section className="clinic-modules-section">
          <div>
            <p className="site-kicker">Módulos principales</p>
            <h2>Una base digital para acompañar la atención y la administración.</h2>
          </div>
          <div className="clinic-modules-grid">
            {clinicModules.map((module) => {
              const Icon = module.icon;
              return <article key={module.title}><Icon size={23} /><h3>{module.title}</h3><p>{module.copy}</p></article>;
            })}
          </div>
        </section>

        <section className="software-catalog-cta">
          <div><p className="site-kicker">Software para tu operación</p><h2>¿Tienes un proceso que necesita ordenarse?</h2><p>Analizamos el flujo de trabajo y diseñamos una solución alrededor de las necesidades reales del equipo.</p></div>
          <a className="site-primary-button" href="/contacto">Cuéntanos tu proyecto <ArrowRight size={17} /></a>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
