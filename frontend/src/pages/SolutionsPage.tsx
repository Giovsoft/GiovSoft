import { ArrowRight, Boxes, Code2, MonitorSmartphone, Rocket } from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

interface SolutionsPageProps {
  type: "software" | "aplicaciones" | "sitios-web" | "ecommerce";
}

const pageContent = {
  software: {
    kicker: "Software a la medida",
    title: "Herramientas digitales construidas alrededor de tu operación.",
    copy: "Diseñamos software para ordenar procesos, centralizar información y darle a tu equipo una forma más simple de trabajar.",
    icon: Code2,
  },
  aplicaciones: {
    kicker: "Aplicaciones",
    title: "Experiencias digitales para conectar con clientes y equipos.",
    copy: "Creamos aplicaciones web modernas, adaptables y preparadas para crecer junto con las necesidades de tu negocio.",
    icon: MonitorSmartphone,
  },
  "sitios-web": {
    kicker: "Portafolio de sitios web",
    title: "Sitios creados para presentar, convencer y generar oportunidades.",
    copy: "Explora soluciones web diseñadas para comunicar con claridad, fortalecer marcas y conectar negocios con nuevos clientes.",
    icon: MonitorSmartphone,
  },
  ecommerce: {
    kicker: "Portafolio de ecommerce",
    title: "Experiencias de compra preparadas para convertir y crecer.",
    copy: "Conoce tiendas digitales y soluciones comerciales que conectan productos, pagos, pedidos y operación en un mismo canal.",
    icon: Boxes,
  },
};

export default function SolutionsPage({ type }: SolutionsPageProps) {
  const { isDark, toggleTheme } = useSiteTheme();
  const content = pageContent[type];
  const Icon = content.icon;

  return (
    <div className={`service-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="solutions-page">
        <section className="solutions-hero">
          <div className="solutions-copy">
            <p className="site-kicker">{content.kicker}</p>
            <h1>{content.title}</h1>
            <p>{content.copy}</p>
            <div className="site-hero-actions">
              <a className="site-primary-button" href="/contacto">
                Cuéntanos tu idea
                <ArrowRight size={17} />
              </a>
              <a className="site-secondary-button" href="/#proceso">
                Conocer el proceso
              </a>
            </div>
          </div>

          <div className="solutions-visual" aria-hidden="true">
            <div className="solutions-icon-main"><Icon size={52} /></div>
            <span><Boxes size={22} /></span>
            <span><Rocket size={22} /></span>
          </div>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
