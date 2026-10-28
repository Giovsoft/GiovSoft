import { ChevronRight, ArrowUpRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { serviceItems } from "../data/services";

const groups = {
  products: [["Akira", "/akira"], ["Academy", "/academy"], ["Studios", "/studios"], ["Payments", "/payments"]],
  portfolio: [["Visión general", "/portafolio"], ["Software", "/portafolio/software"], ["Aplicaciones", "/portafolio/aplicaciones"], ["Sitios web", "/portafolio/sitios-web"], ["Ecommerce", "/portafolio/ecommerce"]],
  company: [["Soluciones", "/servicios"], ["Nosotros", "/nosotros"], ["Proceso", "/proceso"], ["Artículos", "/articulos"], ["Contacto", "/contacto"]],
  legal: [["Privacidad", "/privacidad"], ["Términos", "/terminos"], ["Aviso legal", "/aviso-legal"], ["Cookies", "/cookies"]],
};

export default function ModuleNavigation() {
  const { pathname } = useLocation();
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/") return null;
  const group = groups.products.some(([, href]) => href === path) ? "products" : path.startsWith("/portafolio") ? "portfolio" : groups.legal.some(([, href]) => href === path) ? "legal" : "company";
  const label = { products: "Ecosistema GiovSoft", portfolio: "Soluciones y proyectos", company: "Inteligencia aplicada", legal: "Información y confianza" }[group];
  const service = serviceItems.find(item => path === `/servicios/${item.slug}`);
  return <div className="gs-module-navigation"><div className="gs-module-breadcrumb"><a href="/">GiovSoft</a><ChevronRight size={12} /><span>{label}</span></div><nav aria-label="Explorar módulos">{groups[group].map(([title, href]) => <a key={href} href={href} aria-current={path === href || (href === "/articulos" && path.startsWith("/articulos/")) || (href === "/servicios" && !!service) ? "page" : undefined}>{title}{path === href && <ArrowUpRight size={12}/>}</a>)}</nav></div>;
}
