import { ArrowRight, BookOpen, Clock3, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { articles } from "../data/articles";
import { useSiteTheme } from "../hooks/useSiteTheme";
import "./ArticlesPage.css";

const categories = ["Todos", ...new Set(articles.map((article) => article.category))];

export default function ArticlesPage() {
  const { isDark, toggleTheme } = useSiteTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const filtered = useMemo(() => articles.filter((article) => {
    const matchesCategory = category === "Todos" || article.category === category;
    const haystack = `${article.title} ${article.excerpt} ${article.category}`.toLocaleLowerCase("es");
    return matchesCategory && haystack.includes(query.trim().toLocaleLowerCase("es"));
  }), [category, query]);

  return <div className={`service-page-shell articles-shell ${isDark ? "is-dark" : ""}`}>
    <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
    <main className="articles-page">
      <section className="articles-hero">
        <div className="articles-hero-copy">
          <span className="articles-edition"><Sparkles size={14} /> Biblioteca GiovSoft</span>
          <p className="site-kicker">Conocimiento aplicado</p>
          <h1>Ideas claras para construir mejores decisiones digitales.</h1>
          <p>Guías, criterios y aprendizajes para entender la tecnología y convertirla en una ventaja real para tu operación.</p>
        </div>
        <aside className="articles-hero-summary" aria-label="Resumen de la biblioteca">
          <BookOpen size={25} />
          <strong>{articles.length} artículos</strong>
          <span>{categories.length - 1} áreas de conocimiento</span>
          <small>Contenido práctico escrito por el equipo GiovSoft.</small>
        </aside>
      </section>

      <section className="article-featured" style={{ "--article-accent": featured.accent } as CSSProperties}>
        <div className="article-featured-visual" aria-hidden="true"><span>Lectura destacada</span><BookOpen size={54} /><strong>01</strong></div>
        <div className="article-featured-copy">
          <span>{featured.category}</span><h2>{featured.title}</h2><p>{featured.excerpt}</p>
          <div className="article-meta"><small>{featured.publishedAt}</small><small><Clock3 size={14} />{featured.readTime} de lectura</small><small>{featured.author}</small></div>
          <a href={`/articulos/${featured.slug}`}>Leer artículo completo <ArrowRight size={16} /></a>
        </div>
      </section>

      <section className="articles-library">
        <header className="articles-library-head">
          <div><p className="site-kicker">Biblioteca</p><h2>Explora por tema.</h2><p>Encuentra una guía para el reto que estás resolviendo hoy.</p></div>
          <label><Search size={18} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por tema o palabra..." aria-label="Buscar artículos" /></label>
        </header>
        <nav className="article-category-tabs" aria-label="Categorías de artículos">{categories.map((item) => <button className={category === item ? "is-active" : ""} key={item} onClick={() => setCategory(item)} type="button">{item}<span>{item === "Todos" ? articles.length : articles.filter((article) => article.category === item).length}</span></button>)}</nav>
        <div className="articles-result-count"><span>{filtered.length.toString().padStart(2, "0")}</span><p>{filtered.length === 1 ? "lectura encontrada" : "lecturas encontradas"}</p></div>
        <div className="article-grid">{filtered.map((article, index) => <article key={article.slug} style={{ "--article-accent": article.accent } as CSSProperties}>
          <div className="article-card-cover"><span>{article.category}</span><strong>{(index + 1).toString().padStart(2, "0")}</strong><BookOpen size={28} /></div>
          <div className="article-card-body"><div className="article-card-meta"><small>{article.publishedAt}</small><small><Clock3 size={13} />{article.readTime}</small></div><h3>{article.title}</h3><p>{article.excerpt}</p><a href={`/articulos/${article.slug}`}>Continuar leyendo <ArrowRight size={15} /></a></div>
        </article>)}</div>
        {!filtered.length && <div className="articles-empty"><Search size={28} /><strong>No encontramos coincidencias</strong><p>Prueba con otra palabra o selecciona una categoría diferente.</p></div>}
      </section>
    </main>
    <SiteFooter isDark={isDark} />
  </div>;
}
