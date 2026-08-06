import {
  ArrowRight,
  Beef,
  CalendarDays,
  ChartNoAxesCombined,
  Dumbbell,
  Landmark,
  MapPinned,
  Plane,
  ShieldCheck,
  Sparkles,
  Utensils,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

interface ApplicationItem {
  name: string;
  category: string;
  title: string;
  copy: string;
  theme: "finance" | "fitness" | "travel";
  icon: LucideIcon;
  screenshot: string;
  logo?: string;
  features: Array<{ label: string; icon: LucideIcon }>;
}

const applications: ApplicationItem[] = [
  {
    name: "GFin",
    category: "Finanzas personales y de negocio",
    title: "Tus finanzas, organizadas en un solo lugar.",
    copy: "Aplicación para registrar y dar seguimiento a las finanzas personales y del negocio con una visión clara de cada movimiento.",
    theme: "finance",
    icon: WalletCards,
    screenshot: "/img/portfolio/apps/gfin.jpeg",
    logo: "/img/portfolio/apps/gfin-logo.png",
    features: [
      { label: "Seguimiento financiero", icon: ChartNoAxesCombined },
      { label: "Finanzas personales", icon: WalletCards },
      { label: "Control del negocio", icon: Landmark },
    ],
  },
  {
    name: "GFit",
    category: "Seguimiento deportivo y nutricional",
    title: "Entrenamiento y alimentación con continuidad.",
    copy: "Aplicación para registrar entrenamientos y alimentación, además de llevar un seguimiento deportivo y nutricional en el tiempo.",
    theme: "fitness",
    icon: Dumbbell,
    screenshot: "/img/portfolio/apps/gfit.jpeg",
    logo: "/img/portfolio/apps/gfit-logo.png",
    features: [
      { label: "Registro de entrenamientos", icon: Dumbbell },
      { label: "Alimentación", icon: Utensils },
      { label: "Progreso nutricional", icon: Beef },
    ],
  },
  {
    name: "GiovTrips",
    category: "Tecnología para agencias de viajes",
    title: "Cada itinerario, listo para acompañar el viaje.",
    copy: "Aplicación para agencias de viajes enfocada en crear y compartir itinerarios de manera rápida, clara y segura.",
    theme: "travel",
    icon: Plane,
    screenshot: "/img/portfolio/apps/giovtrips.jpeg",
    logo: "/img/portfolio/apps/giovtrips-logo.png",
    features: [
      { label: "Itinerarios de viaje", icon: MapPinned },
      { label: "Entrega rápida", icon: CalendarDays },
      { label: "Información segura", icon: ShieldCheck },
    ],
  },
];

function ApplicationPreview({ application }: { application: ApplicationItem }) {
  return (
    <div className={`app-preview app-preview-${application.theme}`} aria-hidden="true">
      <div className="app-preview-glow" />
      <div className="app-phone app-phone-screenshot">
        <img src={application.screenshot} alt="" />
      </div>
    </div>
  );
}

export default function ApplicationsPortfolioPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell apps-catalog-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="apps-catalog-page">
        <section className="apps-catalog-hero">
          <div className="apps-catalog-breadcrumb">
            <a href="/portafolio">Portafolio</a><span>/</span><strong>Aplicaciones</strong>
          </div>
          <div className="apps-catalog-hero-grid">
            <div>
              <p className="site-kicker">Catálogo de aplicaciones</p>
              <h1>Productos digitales para acompañar cada objetivo.</h1>
            </div>
            <div>
              <p>
                Creamos aplicaciones enfocadas en resolver tareas concretas, organizar
                información y ofrecer una experiencia simple en el día a día.
              </p>
              <span><Sparkles size={17} /> Finanzas, bienestar y viajes</span>
            </div>
          </div>
        </section>

        <section className="apps-catalog-index" aria-label="Aplicaciones del catálogo">
          <span>03 aplicaciones</span>
          <nav>
            {applications.map((application, index) => (
              <a href={`#aplicacion-${application.name.toLowerCase()}`} key={application.name}>
                <small>0{index + 1}</small>{application.name}
              </a>
            ))}
          </nav>
        </section>

        <section className="apps-product-list">
          {applications.map((application, index) => {
            const Icon = application.icon;
            return (
              <article className={`apps-product apps-product-${application.theme}`} id={`aplicacion-${application.name.toLowerCase()}`} key={application.name}>
                <div className="apps-product-copy">
                  <div className="apps-product-number">Aplicación 0{index + 1}</div>
                  <div className="apps-product-brand">
                    {application.logo ? <img src={application.logo} alt={`Logotipo de ${application.name}`} /> : <Icon size={25} />}
                    <strong>{application.name}</strong>
                  </div>
                  <p className="site-kicker">{application.category}</p>
                  <h2>{application.title}</h2>
                  <p className="apps-product-description">{application.copy}</p>
                  <div className="apps-product-features">
                    {application.features.map((feature) => {
                      const FeatureIcon = feature.icon;
                      return <span key={feature.label}><FeatureIcon size={17} />{feature.label}</span>;
                    })}
                  </div>
                  <div className="app-store-buttons" aria-label={`Descargas de ${application.name}`}>
                    <span className="app-store-button" aria-disabled="true">
                      <FaApple size={25} />
                      <span><small>Próximamente en</small><strong>App Store</strong></span>
                    </span>
                    <span className="app-store-button" aria-disabled="true">
                      <FaGooglePlay size={21} />
                      <span><small>Próximamente en</small><strong>Google Play</strong></span>
                    </span>
                  </div>
                  <a href="/contacto">Solicitar información <ArrowRight size={17} /></a>
                </div>
                <ApplicationPreview application={application} />
              </article>
            );
          })}
        </section>

        <section className="apps-catalog-cta">
          <div>
            <p className="site-kicker">Una aplicación para tu idea</p>
            <h2>¿Tu negocio necesita una solución diferente?</h2>
            <p>Cuéntanos el objetivo y diseñaremos una aplicación alrededor de las personas que la usarán.</p>
          </div>
          <a className="site-primary-button" href="/contacto">Iniciar conversación <ArrowRight size={17} /></a>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
