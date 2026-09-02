import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa6";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { serviceCategories, serviceItems } from "../data/services";
import { useSiteTheme } from "../hooks/useSiteTheme";
import { api } from "../lib/api";
import "./ContactPage.css";

const whatsappMessage = encodeURIComponent(
  "Hola GiovSoft, quiero información para iniciar un proyecto digital."
);
const whatsappUrl = `https://wa.me/525566042994?text=${whatsappMessage}`;

const contactChannels = [
  {
    label: "WhatsApp",
    value: "Enviar mensaje",
    href: whatsappUrl,
    icon: MessageCircle,
  },
  {
    label: "Correo",
    value: "hola@giovsoft.com",
    href: "mailto:hola@giovsoft.com",
    icon: Mail,
  },
  {
    label: "Teléfono",
    value: "Disponible por WhatsApp",
    href: whatsappUrl,
    icon: Phone,
  },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { label: "TikTok", href: "https://tiktok.com", icon: FaTiktok },
];

const contactServiceOptions = [
  { value: "GiovSoft Payments", copy: "Pagos digitales, Tap to Pay y facturación conectada.", category: "estrategia" },
  ...serviceItems.map((service) => ({ value: service.title, copy: service.copy, category: service.category })),
  { value: "Software a la medida", copy: "Desarrollo adaptado a procesos específicos.", category: "desarrollo" },
  { value: "Otro / Necesito orientación", copy: "Ayuda para identificar la solución adecuada.", category: "orientacion" },
];

export default function ContactPage() {
  const { isDark, toggleTheme } = useSiteTheme();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");
  const [serviceOpen, setServiceOpen] = useState(false);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const servicePickerRef = useRef<HTMLDivElement>(null);
  const normalizedServiceQuery = serviceQuery.trim().toLocaleLowerCase("es");
  const filteredServices = contactServiceOptions.filter((option) =>
    `${option.value} ${option.copy}`.toLocaleLowerCase("es").includes(normalizedServiceQuery)
  );

  const chooseService = (value: string) => {
    setServiceQuery(value);
    setServiceOpen(false);
    setActiveServiceIndex(0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setStatusMessage("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("nombre") || ""),
      company: String(formData.get("empresa") || ""),
      email: String(formData.get("correo") || ""),
      phone: String(formData.get("telefono") || ""),
      service: String(formData.get("servicio") || ""),
      message: String(formData.get("mensaje") || ""),
    };

    try {
      await api.post("/api/contact-requests", payload);
      form.reset();
      setServiceQuery("");
      setStatus("success");
      setStatusMessage("Solicitud enviada. Te contactaremos pronto.");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Error inesperado";
      setStatus("error");
      setStatusMessage(`No pudimos enviar la solicitud. ${message}`);
    }
  };

  return (
    <div className={`service-page-shell contact-page-shell ${isDark ? "is-dark" : ""}`}>
      <SiteHeader isDark={isDark} toggleTheme={toggleTheme} />

      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-copy">
            <span className="contact-intro-label"><Sparkles size={15} /> Empecemos una conversación</span>
            <p className="site-kicker">Contacto</p>
            <h1>Hablemos de lo que quieres lograr.</h1>
            <p>
              Cuéntanos el reto, la oportunidad o la idea. Te ayudaremos a identificar
              una ruta clara entre software, Payments, presencia digital, marketing e
              infraestructura.
            </p>

            <div className="contact-actions">
              <a
                className="site-primary-button"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Enviar WhatsApp
                <ArrowRight size={17} />
              </a>
              <a className="site-secondary-button" href="mailto:hola@giovsoft.com">
                hola@giovsoft.com
                <Mail size={17} />
              </a>
            </div>
            <div className="contact-expectation">
              <Clock3 size={19} />
              <span><strong>Respuesta personal</strong><small>Revisamos cada solicitud y te contactamos con contexto.</small></span>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <header className="contact-form-heading">
              <div><span>01</span><h2>Cuéntanos lo esencial</h2></div>
              <p>Con estos datos podemos entender mejor tu necesidad antes de contactarte.</p>
            </header>
            <label>
              Nombre
              <input name="nombre" type="text" placeholder="Tu nombre" required />
            </label>
            <label>
              Empresa
              <input name="empresa" type="text" placeholder="Nombre de tu negocio" />
            </label>
            <label>
              Correo
              <input name="correo" type="email" placeholder="correo@empresa.com" required />
            </label>
            <label>
              WhatsApp
              <input name="telefono" type="tel" placeholder="55 6604 2994" />
            </label>
            <div
              className="contact-service-field"
              ref={servicePickerRef}
              onBlur={() => window.setTimeout(() => {
                if (!servicePickerRef.current?.contains(document.activeElement)) setServiceOpen(false);
              }, 0)}
            >
              <label htmlFor="contact-service-search">Servicio de interés</label>
              <div
                className={`contact-service-combobox ${serviceOpen ? "is-open" : ""}`}
                role="combobox"
                aria-expanded={serviceOpen}
                aria-haspopup="listbox"
                aria-owns="contact-service-listbox"
              >
                <span className="contact-service-search">
                <Search aria-hidden="true" size={18} />
                <input
                  id="contact-service-search"
                  name="servicio"
                  type="search"
                  placeholder="Buscar un servicio..."
                  autoComplete="off"
                  required
                  value={serviceQuery}
                  aria-autocomplete="list"
                  aria-controls="contact-service-listbox"
                  onFocus={() => setServiceOpen(true)}
                  onChange={(event) => {
                    setServiceQuery(event.target.value);
                    setServiceOpen(true);
                    setActiveServiceIndex(0);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setServiceOpen(true);
                      setActiveServiceIndex((index) => Math.min(index + 1, filteredServices.length - 1));
                    } else if (event.key === "ArrowUp") {
                      event.preventDefault();
                      setActiveServiceIndex((index) => Math.max(index - 1, 0));
                    } else if (event.key === "Enter" && serviceOpen && filteredServices[activeServiceIndex]) {
                      event.preventDefault();
                      chooseService(filteredServices[activeServiceIndex].value);
                    } else if (event.key === "Escape") {
                      setServiceOpen(false);
                    }
                  }}
                />
                  <button aria-label={serviceOpen ? "Cerrar lista de servicios" : "Mostrar servicios"} onClick={() => setServiceOpen((open) => !open)} type="button"><ChevronDown size={17} /></button>
                </span>
                {serviceOpen && (
                  <div className="contact-service-options" id="contact-service-listbox" role="listbox">
                    {filteredServices.length ? filteredServices.map((option, index) => (
                      <div className="contact-service-option-wrap" key={option.value}>
                      {(index === 0 || filteredServices[index - 1]?.category !== option.category) && (
                        <p className="contact-service-category">{serviceCategories.find((category) => category.id === option.category)?.title ?? "Orientación"}</p>
                      )}
                      <button
                        className={`${index === activeServiceIndex ? "is-active" : ""} ${serviceQuery === option.value ? "is-selected" : ""}`}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setActiveServiceIndex(index)}
                        onClick={() => chooseService(option.value)}
                        role="option"
                        aria-selected={serviceQuery === option.value}
                        type="button"
                      >
                        <span><strong>{option.value}</strong><small>{option.copy}</small></span>
                        {serviceQuery === option.value && <Check size={17} />}
                      </button>
                      </div>
                    )) : <p>No encontramos coincidencias. Puedes escribir tu necesidad.</p>}
                  </div>
                )}
              </div>
              <small>Escribe para filtrar o selecciona una opción del catálogo.</small>
            </div>
            <label className="contact-form-wide">
              Mensaje
              <textarea
                name="mensaje"
                placeholder="Describe tu objetivo, el problema que quieres resolver o la solución que tienes en mente."
                rows={5}
                required
              />
            </label>
            <button
              className="site-primary-button contact-submit"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Enviando..." : "Enviar solicitud"}
              <Send size={17} />
            </button>
            {statusMessage && (
              <p className={`contact-status ${status === "success" ? "is-success" : "is-error"}`}>
                {statusMessage}
              </p>
            )}
          </form>
        </section>

        <section className="contact-grid" aria-label="Canales de contacto">
          {contactChannels.map((channel) => {
            const Icon = channel.icon;

            return (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              >
                <Icon size={22} />
                <span>{channel.label}</span>
                <strong>{channel.value}</strong>
              </a>
            );
          })}
        </section>

        <section className="contact-social">
          <div>
            <p className="site-kicker">Redes sociales</p>
            <h2>También puedes encontrarnos en redes.</h2>
          </div>
          <div className="contact-social-links">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                >
                  <Icon size={20} />
                  {social.label}
                </a>
              );
            })}
          </div>
        </section>
      </main>

      <SiteFooter isDark={isDark} />
    </div>
  );
}
