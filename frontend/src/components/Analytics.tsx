import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cookieConsentKey, cookieConsentUpdatedEvent } from "./CookieConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

function hasAnalyticsConsent() {
  try {
    return JSON.parse(localStorage.getItem(cookieConsentKey) || "null")?.analytics === true;
  } catch {
    return false;
  }
}

function loadAnalytics() {
  if (!measurementId || !hasAnalyticsConsent() || document.querySelector(`script[data-giovsoft-ga="${measurementId}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.giovsoftGa = measurementId;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { anonymize_ip: true, send_page_view: false });
}

export default function Analytics() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    loadAnalytics();
    const update = () => loadAnalytics();
    window.addEventListener(cookieConsentUpdatedEvent, update);
    return () => window.removeEventListener(cookieConsentUpdatedEvent, update);
  }, []);

  useEffect(() => {
    if (measurementId && hasAnalyticsConsent()) {
      loadAnalytics();
      window.gtag?.("event", "page_view", { page_location: window.location.href, page_path: `${pathname}${search}`, page_title: document.title });
    }
  }, [pathname, search]);

  return null;
}
