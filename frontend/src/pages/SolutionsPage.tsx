import ModuleSignal from "../components/ModuleSignal";
import { ArrowRight, Boxes, Code2, MonitorSmartphone } from "lucide-react";
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
    kicker: "Soluciones de sitios web",
    title: "Sitios creados para presentar, convencer y generar oportunidades.",
    copy: "Explora soluciones web diseñadas para comunicar con claridad, fortalecer marcas y conectar negocios con nuevos clientes.",
    icon: MonitorSmartphone,
  },
  ecommerce: {
    kicker: "Soluciones de ecommerce",
    title: "Experiencias de compra preparadas para convertir y crecer.",
    copy: "Conoce tiendas digitales y soluciones comerciales que conectan productos, pagos, pedidos y operación en un mismo canal.",
    icon: Boxes,
  },
};

export default function SolutionsPage({ type }: SolutionsPageProps) {
  const { isDark, toggleTheme } = useSiteTheme();
  const content = pageContent[type];

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
              <a className="site-secondary-button" href="/proceso">
                Conocer el proceso
              </a>
            </div>
          </div>

          <ModuleSignal label="COMERCIO CONECTADO" core="Tu negocio" nodes={["Catálogo", "Experiencia", "Operación"]} />
        </section>
        <section className="gs-commerce-capabilities"><header><p className="site-kicker">Una operación conectada</p><h2>Cada paso de compra forma parte de la experiencia.</h2><p>Definimos el alcance alrededor de tu catálogo, tus canales y la forma en que trabaja tu equipo.</p></header><div>{[{title:"Descubrir",copy:"Un catálogo claro para encontrar productos, comparar opciones y comprender su valor."},{title:"Comprar",copy:"Una experiencia adaptable con carrito, checkout y proveedores de pago compatibles."},{title:"Operar",copy:"Pedidos, estados y conexiones con inventario o envíos según el alcance acordado."},{title:"Evolucionar",copy:"Medición e integraciones que permiten identificar el siguiente paso de tu canal digital."}].map((item,i)=><article key={item.title}><span>0{i+1}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>
        <section className="gs-commerce-cta"><div><p className="site-kicker">Inteligencia donde aporta valor</p><h2>Tu canal de venta también puede evolucionar.</h2><p>Podemos explorar asistencia para consultar el catálogo y automatizaciones para organizar solicitudes. Primero validamos el caso de uso y las fuentes de información.</p></div><a className="site-primary-button" href="/contacto">Exploremos tu proyecto <ArrowRight size={17}/></a></section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
