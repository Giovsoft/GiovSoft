import {
  ArrowRight,
  Sparkles,
  ChevronDown,
  CreditCard,
  Gamepad2,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { usePublicMotion } from "../hooks/usePublicMotion";
import { useLocation } from "react-router-dom";
import ModuleNavigation from "./ModuleNavigation";
import { useEffect, useRef, useState } from "react";
import { serviceCategories, serviceItems } from "../data/services";

const whatsappMessage = encodeURIComponent(
  "Hola GiovSoft, quiero explorar una solución de IA, automatización o software para mi negocio."
);
const whatsappUrl = `https://wa.me/525566042994?text=${whatsappMessage}`;

const giovsoftProducts = [
  { title: "Akira", copy: "IA para aprender y automatizar. Students & Business · En desarrollo.", href: "/akira", icon: Sparkles },
  {
    title: "Studios",
    copy: "Videojuegos originales desarrollados y publicados por GiovSoft.",
    href: "/studios",
    icon: Gamepad2,
  },
  {
    title: "Payments",
    copy: "Soluciones de cobro, Tap to Pay y facturación para negocios.",
    href: "/payments",
    icon: CreditCard,
  },
];

interface SiteHeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function SiteHeader({ isDark, toggleTheme }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { pathname } = useLocation();
  usePublicMotion(pathname);
  const current = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const [mobileSections, setMobileSections] = useState({
    main: true,
    services: false,
  });

  useEffect(() => {
    if (!menuOpen && !servicesOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && headerRef.current?.contains(target)) {
        return;
      }

      setMenuOpen(false);
      setServicesOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setServicesOpen(false);
      headerRef.current?.querySelector<HTMLButtonElement>(menuOpen ? ".site-mobile-menu-button" : ".site-services-toggle")?.focus();
    }
    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, servicesOpen]);

  function closeMenu() {
    setMenuOpen(false);
    setServicesOpen(false);
  }

  function toggleMobileSection(section: keyof typeof mobileSections) {
    setMobileSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  return (
    <>
    <header ref={headerRef} className={`site-header ${menuOpen ? "is-menu-open" : ""}`}>
      <a className="site-brand" href="/" aria-label="GiovSoft inicio" onClick={closeMenu}>
        <img
          className="site-logo site-logo-light"
          src="/img/logo-white.svg"
          alt="GiovSoft"
        />
        <img
          className="site-logo site-logo-dark"
          src="/img/logo-black.svg"
          alt="GiovSoft"
          aria-hidden="true"
        />
      </a>

      <nav id="site-primary-navigation" className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
        <div className={`nav-dropdown site-desktop-nav-link ${servicesOpen ? "is-expanded" : ""}`}>
          <button type="button" className={`nav-dropdown-trigger site-services-toggle ${current("/servicios") ? "is-current" : ""}`} aria-expanded={servicesOpen} aria-controls="site-services-menu" onClick={() => setServicesOpen(open => !open)}>
            Soluciones <ChevronDown size={13} />
          </button>
          <div id="site-services-menu" className="services-menu services-catalog-menu">
            <a className="site-menu-overview" href="/servicios" onClick={closeMenu}><span><strong>Soluciones para tu siguiente paso</strong><small>IA, automatización, software y experiencias digitales.</small></span><ArrowRight size={19}/></a>
            {serviceCategories.map((category) => (
              <section className="services-menu-group" key={category.id}>
                <p>{category.title}</p>
                {serviceItems.filter((service) => service.category === category.id).map((service) => {
                  const Icon = service.icon;
                  return (
                    <a key={service.slug} href={`/servicios/${service.slug}`} onClick={closeMenu}>
                      <Icon size={18} />
                      <span><strong>{service.title}</strong><small>{service.copy}</small></span>
                    </a>
                  );
                })}
              </section>
            ))}
            <section className="services-menu-group">
              <p>Productos GiovSoft</p>
              {giovsoftProducts.map((product) => {
                const Icon = product.icon;
                return (
                  <a key={product.href} href={product.href} onClick={closeMenu}>
                    <Icon size={18} />
                    <span><strong>{product.title}</strong><small>{product.copy}</small></span>
                  </a>
                );
              })}
            </section>
          </div>
        </div>
        {[{label:"Proyectos",href:"/portafolio"},{label:"Nosotros",href:"/nosotros"},{label:"Recursos",href:"/articulos"},{label:"Akira",href:"/akira"},{label:"Academy",href:"/academy"}].map(link => <a className={`site-desktop-nav-link ${current(link.href) ? "is-current" : ""}`} href={link.href} key={link.href} aria-current={current(link.href) ? "page" : undefined} onClick={closeMenu}>{link.label}{link.href === "/akira" && <Sparkles size={12}/>}</a>)}

        <div className="site-mobile-menu-panel">
          <section className="site-mobile-menu-section">
            <button className="site-mobile-section-button" onClick={() => toggleMobileSection("main")} type="button" aria-expanded={mobileSections.main}>
              Navegación
              <ChevronDown size={18} />
            </button>
            {mobileSections.main && (
              <div className="site-mobile-section-content">
                <a href="/" onClick={closeMenu}>Inicio</a>
                <a href="/portafolio" onClick={closeMenu}>Proyectos</a>
                <a href="/servicios" onClick={closeMenu}>Todas las soluciones</a>
                <a href="/nosotros" onClick={closeMenu}>Nosotros</a>
                <a href="/proceso" onClick={closeMenu}>Proceso</a>
                <a href="/articulos" onClick={closeMenu}>Artículos</a>
                <a href="/contacto" onClick={closeMenu}>Contacto</a>
                <a href="/akira" onClick={closeMenu}>Akira</a>
                <a className="site-academy-link" href="/academy" onClick={closeMenu}>Academy</a>
              </div>
            )}
          </section>

          <section className="site-mobile-menu-section">
            <button className="site-mobile-section-button" onClick={() => toggleMobileSection("services")} type="button" aria-expanded={mobileSections.services}>
              Servicios
              <ChevronDown size={18} />
            </button>
            {mobileSections.services && (
              <div className="site-mobile-section-content is-services">
                {serviceCategories.map((category) => (
                  <section className="mobile-service-group" key={category.id}>
                    <p>{category.title}</p>
                    {serviceItems.filter((service) => service.category === category.id).map((service) => {
                      const Icon = service.icon;
                      return (
                        <a key={service.slug} href={`/servicios/${service.slug}`} onClick={closeMenu}>
                          <Icon size={18} />
                          <span><strong>{service.title}</strong><small>{service.copy}</small></span>
                        </a>
                      );
                    })}
                  </section>
                ))}
                <section className="mobile-service-group">
                  <p>Productos GiovSoft</p>
                  {giovsoftProducts.map((product) => {
                    const Icon = product.icon;
                    return (
                      <a key={product.href} href={product.href} onClick={closeMenu}>
                        <Icon size={18} />
                        <span><strong>{product.title}</strong><small>{product.copy}</small></span>
                      </a>
                    );
                  })}
                </section>
              </div>
            )}
          </section>
        </div>
      </nav>

      <div className="site-header-actions">
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
          title={isDark ? "Modo claro" : "Modo oscuro"}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          className="site-mobile-menu-button"
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="site-primary-navigation"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a
          className="site-nav-action"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
        >
          Hablemos
          <ArrowRight size={16} />
        </a>
      </div>
    </header>
    <ModuleNavigation />
    </>
  );
}
