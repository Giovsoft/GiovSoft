import { ArrowLeft, Home, SearchX } from "lucide-react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useSiteTheme } from "../hooks/useSiteTheme";

export default function NotFoundPage() {
  const { isDark, toggleTheme } = useSiteTheme();
  return (
    <div className={`site-shell not-found-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
      <main className="not-found-page">
        <SearchX aria-hidden="true" size={58} />
        <p className="site-kicker">Error 404</p>
        <h1>Esta página no está disponible.</h1>
        <p>La dirección puede haber cambiado o el contenido ya no existe. Puedes volver al inicio y continuar explorando nuestras soluciones.</p>
        <div><a className="site-primary-button" href="/"><Home size={18} />Ir al inicio</a><button onClick={() => history.back()} type="button"><ArrowLeft size={18} />Volver</button></div>
      </main>
      <SiteFooter isDark={isDark} />
    </div>
  );
}
