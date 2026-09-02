import { ArrowLeft, ArrowRight, BookOpen, Clock3, Share2 } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { articles } from "../data/articles";
import { useSiteTheme } from "../hooks/useSiteTheme";

export default function ArticlePage() {
  const { slug } = useParams();
  const { isDark, toggleTheme } = useSiteTheme();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return <Navigate to="/articulos" replace />;
  const related = articles.filter((item) => item.slug !== article.slug).slice(0, 2);
  return <div className={`service-page-shell ${isDark ? "is-dark" : ""}`}>
    <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />
    <main className="article-page" style={{ "--article-accent": article.accent } as React.CSSProperties}>
      <header className="article-header"><a href="/articulos"><ArrowLeft size={16} />Todos los artículos</a><span>{article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><div><strong>{article.author}</strong><small>{article.publishedAt}</small><small><Clock3 size={14} />{article.readTime} de lectura</small></div></header>
      <div className="article-reading-layout"><aside><BookOpen size={22} /><strong>En este artículo</strong>{article.sections.map((section) => <a href={`#${section.heading.toLocaleLowerCase("es").replace(/[^a-záéíóúñ0-9]+/g, "-")}`} key={section.heading}>{section.heading}</a>)}</aside><article className="article-content">{article.sections.map((section) => { const id = section.heading.toLocaleLowerCase("es").replace(/[^a-záéíóúñ0-9]+/g, "-"); return <section id={id} key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>; })}<div className="article-share"><Share2 size={20} /><div><strong>¿Te resultó útil?</strong><span>Compártelo con alguien que esté tomando una decisión similar.</span></div></div></article></div>
      <section className="article-related"><p className="site-kicker">Continúa aprendiendo</p><h2>Artículos relacionados</h2><div>{related.map((item) => <a href={`/articulos/${item.slug}`} key={item.slug}><span>{item.category}</span><strong>{item.title}</strong><ArrowRight size={17} /></a>)}</div></section>
    </main>
    <SiteFooter isDark={isDark} />
  </div>;
}
