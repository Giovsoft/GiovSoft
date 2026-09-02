import { ArrowRight, CheckCircle2, Layers3, MessageCircle } from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { serviceCategories, serviceItems } from "../data/services";
import { useSiteTheme } from "../hooks/useSiteTheme";

export default function ServicesPage() {
  const { isDark, toggleTheme } = useSiteTheme();

  return (
    <div className={`service-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
      <main className="services-catalog-page">
        <section className="services-catalog-hero">
          <div>
            <p className="site-kicker">Servicios GiovSoft</p>
            <h1>Capacidades conectadas alrededor de tu operación.</h1>
            <p>Integramos estrategia, desarrollo, infraestructura y marketing. Puedes iniciar con una necesidad puntual o construir una ruta completa con un solo aliado tecnológico.</p>
            <div className="contact-actions">
              <a className="site-primary-button" href="/contacto">Cuéntanos tu proyecto <ArrowRight size={17} /></a>
              <a className="site-secondary-button" href="/proceso">Conocer el proceso</a>
            </div>
          </div>
          <aside className="services-catalog-summary">
            <Layers3 size={25} />
            <strong>{serviceItems.length} servicios</strong>
            <span>{serviceCategories.length} áreas de especialidad</span>
            <p>Una estructura modular para implementar primero lo prioritario y ampliar la solución conforme evoluciona el negocio.</p>
          </aside>
        </section>

        <nav className="services-category-index" aria-label="Categorías de servicios">
          {serviceCategories.map((category, index) => <a href={`#${category.id}`} key={category.id}><span>0{index + 1}</span>{category.title}</a>)}
        </nav>

        <div className="services-category-list">
          {serviceCategories.map((category, categoryIndex) => {
            const categoryServices = serviceItems.filter((service) => service.category === category.id);
            return (
              <section className="services-category-block" id={category.id} key={category.id}>
                <header>
                  <span>0{categoryIndex + 1}</span>
                  <div><p className="site-kicker">Área de servicio</p><h2>{category.title}</h2><p>{category.copy}</p></div>
                </header>
                <div className="services-category-cards">
                  {categoryServices.map((service) => {
                    const Icon = service.icon;
                    return <article key={service.slug}><div className="service-icon"><Icon size={22} /></div><div><h3>{service.title}</h3><p>{service.copy}</p><ul>{service.features.slice(0, 2).map((feature) => <li key={feature}><CheckCircle2 size={15} />{feature}</li>)}</ul><a href={`/servicios/${service.slug}`}>Explorar servicio <ArrowRight size={15} /></a></div></article>;
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <section className="services-guidance-cta">
          <MessageCircle size={28} />
          <div><p className="site-kicker">¿No sabes por dónde empezar?</p><h2>Primero entendemos el reto; después definimos la tecnología.</h2></div>
          <a className="site-primary-button" href="/contacto">Solicitar orientación <ArrowRight size={17} /></a>
        </section>
      </main>
      <SiteFooter isDark={isDark} />
    </div>
  );
}
