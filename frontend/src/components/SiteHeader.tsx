import {
  ArrowRight,
  Boxes,
  ChevronDown,
  Code2,
  CreditCard,
  Globe2,
  Gamepad2,
  Menu,
  MonitorSmartphone,
  Moon,
  ShoppingCart,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { serviceCategories, serviceItems } from "../data/services";

const whatsappMessage = encodeURIComponent(
  "Hola GiovSoft, quiero información sobre sus servicios digitales."
);
const whatsappUrl = `https://wa.me/525566042994?text=${whatsappMessage}`;

const portfolioItems = [
  {
    title: "Software",
    copy: "Sistemas y herramientas para optimizar procesos.",
    href: "/portafolio/software",
    icon: Code2,
  },
  {
    title: "Aplicaciones",
    copy: "Aplicaciones web para clientes y equipos.",
    href: "/portafolio/aplicaciones",
    icon: MonitorSmartphone,
  },
  {
    title: "Sitios web",
    copy: "Experiencias digitales para marcas y negocios.",
    href: "/portafolio/sitios-web",
    icon: Globe2,
  },
  {
    title: "Ecommerce",
    copy: "Tiendas y canales digitales preparados para vender.",
    href: "/portafolio/ecommerce",
    icon: ShoppingCart,
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
    portfolio: false,
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
          </div>
        </div>
        <div className="nav-dropdown site-desktop-nav-link">
          <a href="/portafolio" className="nav-dropdown-trigger" onClick={closeMenu}>
            Soluciones
          </a>
          <div className="services-menu portfolio-menu">
            {portfolioItems.map((item) => {
              const Icon = item.icon;

              return (
                <a key={item.href} href={item.href} onClick={closeMenu}>
                  <Icon size={18} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.copy}</small>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
        <a className="site-desktop-nav-link" href="/nosotros" onClick={closeMenu}>Nosotros</a>
        <a className="site-desktop-nav-link" href="/proceso" onClick={closeMenu}>Proceso</a>
        <a className="site-desktop-nav-link" href="/articulos" onClick={closeMenu}>Artículos</a>
        <a className="site-studios-link site-desktop-nav-link" href="/studios" onClick={closeMenu}><Gamepad2 size={15} />Studios</a>
        <a className="site-payments-link site-desktop-nav-link" href="/payments" onClick={closeMenu}><CreditCard size={15} />Payments</a>
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
                <a className="site-studios-link" href="/studios" onClick={closeMenu}><Gamepad2 size={16} />Studios</a>
                <a className="site-payments-link" href="/payments" onClick={closeMenu}><CreditCard size={16} />Payments</a>
                <a href="/contacto" onClick={closeMenu}>Contacto</a>
                <a className="site-academy-link" href="/academy" onClick={closeMenu}>Academy</a>
              </div>
            )}
          </section>

          <section className="site-mobile-menu-section">
            <button className="site-mobile-section-button" onClick={() => toggleMobileSection("portfolio")} type="button" aria-expanded={mobileSections.portfolio}>
              Soluciones
              <ChevronDown size={18} />
            </button>
            {mobileSections.portfolio && (
              <div className="site-mobile-section-content is-services">
                <a href="/portafolio" onClick={closeMenu}>
                  <Boxes size={18} />
                  <span>
                    <strong>Ver soluciones</strong>
                    <small>Conoce nuestro enfoque y todas las categorías.</small>
                  </span>
                </a>
                {portfolioItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a key={item.href} href={item.href} onClick={closeMenu}>
                      <Icon size={18} />
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.copy}</small>
                      </span>
                    </a>
                  );
                })}
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
