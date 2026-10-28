import { LockKeyhole } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa6";
import { serviceItems } from "../data/services";
import { openCookieSettingsEvent } from "./CookieConsent";

const footerSections = [
  {
    title: "Mapa del sitio",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Servicios", href: "/servicios" },
      { label: "Proceso", href: "/proceso" },
      { label: "Artículos", href: "/articulos" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    title: "Servicios",
    links: serviceItems.filter((service) => ["inteligencia-artificial", "automatizacion-ia", "sitios-web", "desarrollo-aplicaciones-moviles", "hosting-administrado"].includes(service.slug)).map((service) => ({
      label: service.title,
      href: `/servicios/${service.slug}`,
    })),
  },
  {
    title: "Productos",
    links: [
      { label: "Akira", href: "/akira" },
      { label: "Academy", href: "/academy" },
      { label: "Studios", href: "/studios" },
      { label: "Payments", href: "/payments" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos y condiciones", href: "/terminos" },
      { label: "Política de privacidad", href: "/privacidad" },
      { label: "Aviso legal", href: "/aviso-legal" },
      { label: "Política de cookies", href: "/cookies" },
    ],
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { label: "TikTok", href: "https://tiktok.com", icon: FaTiktok },
];

interface SiteFooterProps {
  isDark: boolean;
}

export default function SiteFooter({ isDark }: SiteFooterProps) {
  return (
    <footer id="contacto" className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <img
            src={isDark ? "/img/logo-black.svg" : "/img/logo-white.svg"}
            alt="GiovSoft"
          />
          <p>
            Inteligencia artificial, diseño y software para conectar ideas
            con posibilidades reales. Desde Guadalajara, México.
          </p>
          <a className="footer-contact" href="mailto:hola@giovsoft.com">
            hola@giovsoft.com
            <LockKeyhole size={15} />
          </a>
          <div className="footer-social" aria-label="Redes sociales">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="footer-links">
          {footerSections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h3>{section.title}</h3>
              {section.links.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 GiovSoft. Todos los derechos reservados.</span>
        <button onClick={() => window.dispatchEvent(new Event(openCookieSettingsEvent))} type="button">Preferencias de cookies</button>
      </div>
    </footer>
  );
}
