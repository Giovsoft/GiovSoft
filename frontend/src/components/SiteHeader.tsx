import {
  ArrowRight,
  ChevronDown,
  CreditCard,
  Gamepad2,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { serviceCategories, serviceItems } from "../data/services";

const whatsappMessage = encodeURIComponent(
  "Hola GiovSoft, quiero información sobre sus servicios digitales."
);
const whatsappUrl = `https://wa.me/525566042994?text=${whatsappMessage}`;

const giovsoftProducts = [
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
  const [mobileSections, setMobileSections] = useState({
    main: true,
    services: false,
  });

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (target instanceof Node && headerRef.current?.contains(target)) {
        return;
      }

      setMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMobileSection(section: keyof typeof mobileSections) {
    setMobileSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  }

  return (
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

      <nav className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
        <a className="site-desktop-nav-link" href="/" onClick={closeMenu}>Inicio</a>
        <div className="nav-dropdown site-desktop-nav-link">
          <a href="/servicios" className="nav-dropdown-trigger" onClick={closeMenu}>
            Servicios
          </a>
          <div className="services-menu services-catalog-menu">
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
        <a className="site-desktop-nav-link" href="/nosotros" onClick={closeMenu}>Nosotros</a>
        <a className="site-desktop-nav-link" href="/proceso" onClick={closeMenu}>Proceso</a>
        <a className="site-desktop-nav-link" href="/articulos" onClick={closeMenu}>Artículos</a>
        <a className="site-desktop-nav-link" href="/contacto" onClick={closeMenu}>Contacto</a>
        <a className="site-academy-link site-desktop-nav-link" href="/academy" onClick={closeMenu}>Academy</a>

        <div className="site-mobile-menu-panel">
          <section className="site-mobile-menu-section">
            <button className="site-mobile-section-button" onClick={() => toggleMobileSection("main")} type="button" aria-expanded={mobileSections.main}>
              Navegación
              <ChevronDown size={18} />
            </button>
            {mobileSections.main && (
              <div className="site-mobile-section-content">
                <a href="/" onClick={closeMenu}>Inicio</a>
                <a href="/nosotros" onClick={closeMenu}>Nosotros</a>
                <a href="/proceso" onClick={closeMenu}>Proceso</a>
                <a href="/articulos" onClick={closeMenu}>Artículos</a>
                <a href="/contacto" onClick={closeMenu}>Contacto</a>
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
  );
}
