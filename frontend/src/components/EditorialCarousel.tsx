import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Clock3 } from "lucide-react";
import { articles } from "../data/articles";
import "./EditorialCarousel.css";

export default function EditorialCarousel() {
  const [index, setIndex] = useState(0);
  const selected = articles[index];
  if (!selected) return null;
  const move = (step: number) => setIndex(current => (current + step + articles.length) % articles.length);
  return <section className="gs-editorial" id="editorial" aria-label="Editoriales de GiovSoft" aria-roledescription="carrusel" tabIndex={0} onKeyDown={event => {
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key) && event.target instanceof HTMLAnchorElement) event.currentTarget.focus();
    if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    else if (event.key === "Home") { event.preventDefault(); setIndex(0); }
    else if (event.key === "End") { event.preventDefault(); setIndex(articles.length - 1); }
  }}>
    <header className="gs-editorial-heading"><div><p className="gs-eyebrow">EDITORIAL GIOVSOFT</p><h2>Ideas que merecen<br /><span>una conversación.</span></h2></div><a className="gs-text-link" href="/articulos">Explora la biblioteca <ArrowUpRight size={16}/></a></header>
    <article id="gs-editorial-slide" className="gs-editorial-slide" aria-roledescription="diapositiva" aria-label={`${index + 1} de ${articles.length}`}>
      <div className={`gs-editorial-art ${selected.coverImage ? "has-cover" : ""}`} aria-hidden="true" key={`${selected.slug}-art`}>
        <div className="gs-editorial-art-top"><span>GIOVSOFT / EDITORIAL</span><ArrowUpRight size={18}/></div>
        {selected.coverImage ? <img src={selected.coverImage} alt=""/> : <div className="gs-editorial-orbits"><i/><i/><i/><BookOpen size={42}/></div>}
        <div className="gs-editorial-art-bottom"><strong>{selected.coverLabel || "Ideas para avanzar"}</strong><span>{(selected.coverCaption || selected.category).toLocaleUpperCase("es")}</span></div>
      </div>
      <div className="gs-editorial-copy" key={selected.slug}><div className="gs-editorial-meta"><span>{selected.category}</span>{selected.status && <small>{selected.status}</small>}</div><h3>{selected.homeTitle || selected.title}</h3><p>{selected.excerpt}</p><div className="gs-editorial-reading"><span>{selected.publishedAt}</span><span><Clock3 size={12}/>{selected.readTime} de lectura</span></div><a className="site-primary-button" href={`/articulos/${selected.slug}`}>Leer editorial <ArrowRight size={17}/></a></div>
    </article>
    <div className="gs-editorial-controls"><p aria-live="polite" aria-atomic="true"><strong>{String(index+1).padStart(2,"0")}</strong><span> / {String(articles.length).padStart(2,"0")}</span><span className="gs-editorial-sr"> · {selected.title}</span></p>{articles.length > 1 && <><div className="gs-editorial-dots" aria-label="Seleccionar editorial">{articles.map((item,i)=><button type="button" key={item.slug} aria-label={`Ir a editorial ${i+1}: ${item.title}`} aria-current={i===index ? "true" : undefined} aria-controls="gs-editorial-slide" onClick={()=>setIndex(i)}><span/></button>)}</div><div className="gs-editorial-arrows"><button type="button" aria-label="Editorial anterior" aria-controls="gs-editorial-slide" onClick={()=>move(-1)}><ArrowLeft size={17}/></button><button type="button" aria-label="Editorial siguiente" aria-controls="gs-editorial-slide" onClick={()=>move(1)}><ArrowRight size={17}/></button></div></>}</div>
  </section>;
}
