import { Cookie, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

export const cookieConsentKey = "giovsoft-cookie-consent";
export const cookieConsentVersion = "2026-08-07";
export const openCookieSettingsEvent = "giovsoft-open-cookie-settings";
export const cookieConsentUpdatedEvent = "giovsoft-cookie-consent-updated";

interface CookieConsentValue {
  version: string;
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  updatedAt: string;
}

function readConsent(): CookieConsentValue | null {
  try {
    const raw = window.localStorage.getItem(cookieConsentKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentValue;
    return parsed.version === cookieConsentVersion ? parsed : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const consent = readConsent();
    if (consent) {
      setPreferences(consent.preferences);
      setAnalytics(consent.analytics);
    }
    else setVisible(true);

    const openSettings = () => {
      const current = readConsent();
      setPreferences(current?.preferences ?? false);
      setAnalytics(current?.analytics ?? false);
      setSettingsOpen(true);
      setVisible(true);
    };
    window.addEventListener(openCookieSettingsEvent, openSettings);
    return () => window.removeEventListener(openCookieSettingsEvent, openSettings);
  }, []);

  function saveConsent(allowPreferences: boolean, allowAnalytics = false) {
    const consent: CookieConsentValue = { version: cookieConsentVersion, necessary: true, preferences: allowPreferences, analytics: allowAnalytics, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(cookieConsentKey, JSON.stringify(consent));
    if (!allowPreferences) window.localStorage.removeItem("site-theme");
    window.dispatchEvent(new CustomEvent(cookieConsentUpdatedEvent, { detail: consent }));
    setPreferences(allowPreferences);
    setAnalytics(allowAnalytics);
    setSettingsOpen(false);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={`cookie-consent-layer ${settingsOpen ? "has-settings" : ""}`}>
      {settingsOpen && <button className="cookie-consent-backdrop" aria-label="Cerrar preferencias" onClick={() => setSettingsOpen(false)} type="button" />}
      {settingsOpen ? (
        <section className="cookie-settings" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
          <header><div><Cookie size={22} /><h2 id="cookie-settings-title">Preferencias de cookies</h2></div><button aria-label="Cerrar" onClick={() => setSettingsOpen(false)} type="button"><X size={20} /></button></header>
          <p>Elige qué tecnologías opcionales puede utilizar GiovSoft en este navegador.</p>
          <div className="cookie-setting-row"><div><strong>Necesarias</strong><p>Mantienen funciones básicas, seguridad y la decisión de consentimiento.</p></div><span>Siempre activas</span></div>
          <label className="cookie-setting-row"><div><strong>Preferencias</strong><p>Permiten recordar elecciones como el modo claro u oscuro.</p></div><input type="checkbox" checked={preferences} onChange={(event) => setPreferences(event.target.checked)} /><i aria-hidden="true" /></label>
          <label className="cookie-setting-row"><div><strong>Analítica</strong><p>Nos ayuda a conocer qué páginas se consultan y mejorar el sitio. Sólo se activa si configuramos una herramienta de medición y das tu autorización.</p></div><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /><i aria-hidden="true" /></label>
          <footer><a href="/cookies">Consultar política</a><button className="site-primary-button" onClick={() => saveConsent(preferences, analytics)} type="button">Guardar preferencias</button></footer>
        </section>
      ) : (
        <section className="cookie-banner" aria-label="Aviso de cookies">
          <div className="cookie-banner-icon"><Cookie size={23} /></div>
          <div><strong>Tu privacidad, tu decisión</strong><p>Usamos almacenamiento necesario y, con tu autorización, preferencias y medición anónima para mejorar el sitio. No utilizamos publicidad. <a href="/cookies">Conoce nuestra política.</a></p></div>
          <div className="cookie-banner-actions"><button className="cookie-settings-button" onClick={() => setSettingsOpen(true)} type="button"><Settings2 size={16} />Configurar</button><button className="cookie-necessary-button" onClick={() => saveConsent(false, false)} type="button">Solo necesarias</button><button className="site-primary-button" onClick={() => saveConsent(true, true)} type="button">Aceptar todas</button></div>
        </section>
      )}
    </div>
  );
}
