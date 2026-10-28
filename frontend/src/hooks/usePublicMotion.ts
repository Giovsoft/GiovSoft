import { useEffect } from "react";

const targets = [
  "main h2",
  ".gs-editorial-slide", ".gs-solution-card", ".gs-method-steps article", ".gs-ecosystem-grid>a",
  ".gs-akira-art", ".gs-module-signal", ".gs-flow", ".ak-brand-stage", ".ak-edition", ".ak-preview",
  ".services-category-cards>article", ".process-stage-list>article", ".about-purpose-cards>article", ".about-values-grid>article", ".about-timeline>article",
  ".portfolio-category-card", ".portfolio-client-grid>article", ".clinic-modules-grid>article", ".clinic-dashboard", ".app-preview",
  ".web-project-feature", ".web-project-gesove", ".academy-hero-visual", ".academy-real-image", ".academy-pillars>article", ".academy-area-grid>article", ".academy-steps>article",
  ".studios-game-scene", ".studios-disciplines article", ".studios-platforms article", ".studios-release-card", ".studios-production li",
  ".payments-console", ".payments-capability-grid>article", ".payments-flow li", ".payments-expansion-grid>article", ".payments-audiences article",
  ".article-featured", ".article-grid>article", ".article-related a", ".gs-ai-detail-features>article", ".gs-commerce-capabilities article",
  ".web-service-capabilities>article", ".web-service-process article", ".commerce-quality-grid>article", ".mail-quality-grid>article", ".hosting-quality-grid>article", ".domain-quality-grid>article", ".workspace-quality-grid>article", ".suite-quality-grid>article", ".mobile-app-capability-grid>article", ".growth-pillar-grid>article", ".network-pillar-grid>article",
].join(",");

// Content is visible by default; only offscreen elements opt in after observation is ready.
function observeMotion(header: HTMLElement, main: HTMLElement) {
  const marked = new Set<HTMLElement>();
  const seen = new WeakSet<HTMLElement>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      (entry.target as HTMLElement).dataset.gsRevealState = "entered";
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -4% 0px", threshold: 0 });

  const register = () => {
    for (const element of main.querySelectorAll<HTMLElement>(targets)) {
      if (seen.has(element)) continue;
      seen.add(element);
      // Nested reveals multiply opacity and make text unnecessarily slow to appear.
      if (element.parentElement?.closest("[data-gs-reveal]")) continue;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height || rect.top < window.innerHeight) continue;
      const isVisual = element.matches(".gs-akira-art,.gs-module-signal,.gs-flow,.ak-brand-stage,.ak-preview,.clinic-dashboard,.app-preview,.academy-hero-visual,.studios-game-scene,.payments-console");
      const isHeading = element.tagName === "H2";
      const order = isHeading || isVisual ? 0 : Math.max(0, Array.from(element.parentElement?.children || []).indexOf(element));
      element.dataset.gsReveal = isVisual ? "visual" : "rise";
      element.dataset.gsRevealState = "pending";
      element.style.setProperty("--gs-reveal-delay", `${Math.min(order, 3) * 75}ms`);
      marked.add(element);
      observer.observe(element);
    }
  };
  register();
  const mutations = new MutationObserver(register);
  mutations.observe(main, { subtree: true, childList: true });

  const revealFocused = (event: FocusEvent) => {
    const element = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-gs-reveal]") : null;
    if (!element) return;
    element.dataset.gsRevealState = "entered";
    observer.unobserve(element);
  };
  main.addEventListener("focusin", revealFocused);

  let frame = 0;
  const updateProgress = () => {
    frame = 0;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const progress = distance > 0 ? Math.max(0, Math.min(1, window.scrollY / distance)) : 0;
    header.style.setProperty("--gs-scroll-progress", String(progress));
  };
  const requestProgress = () => { if (!frame) frame = requestAnimationFrame(updateProgress); };
  window.addEventListener("scroll", requestProgress, { passive: true });
  window.addEventListener("resize", requestProgress);
  updateProgress();

  return () => {
    observer.disconnect();
    mutations.disconnect();
    main.removeEventListener("focusin", revealFocused);
    window.removeEventListener("scroll", requestProgress);
    window.removeEventListener("resize", requestProgress);
    cancelAnimationFrame(frame);
    header.style.removeProperty("--gs-scroll-progress");
    for (const element of marked) {
      delete element.dataset.gsReveal;
      delete element.dataset.gsRevealState;
      element.style.removeProperty("--gs-reveal-delay");
    }
  };
}

export function usePublicMotion(pathname: string) {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const header = document.querySelector<HTMLElement>(".site-header");
    const main = header?.parentElement?.querySelector<HTMLElement>("main");
    if (!header || !main) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cleanup = () => {};
    const configure = () => {
      cleanup();
      cleanup = preference.matches ? () => {} : observeMotion(header, main);
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      preference.removeEventListener("change", configure);
      cleanup();
    };
  }, [pathname]);
}
