/**
 * MyBears SK — conditional script loader
 * Version: 1.0.1
 *
 * Cieľ: zachovať súčasnú funkčnosť interaktívnych nástrojov MyBears a pritom
 * nesťahovať všetky skripty na každej stránke.
 *
 * Loader sa načíta globálne s defer a podľa mount pointu / homepage / Advisoru
 * stiahne iba skripty, ktoré aktuálna stránka skutočne potrebuje.
 */
(function () {
  'use strict';

  const VERSION = '1.0.1-sk';
  const HOST_SUFFIX = 'mybears.sk';
  const host = String(window.location.hostname || '').toLowerCase();
  if (!host.endsWith(HOST_SUFFIX)) return;

  const currentScript = document.currentScript;
  const fallbackBase = 'https://cdn.jsdelivr.net/gh/alispurny/e-shop-scripty@main/';
  const baseUrl = currentScript && currentScript.src
    ? currentScript.src.split('#')[0].split('?')[0].replace(/[^/]+$/, '')
    : fallbackBase;

  const loaded = new Map();

  const TOOL_NAMES = Object.freeze({
    '#mb-glycemic-load-calculator': "BMI kalkulačka",
    '#mb-bmi-calculator': "Kalkulačka glykemickej nálože",
    '#mb-bmr-calculator': "Kalkulačka bazálneho metabolizmu",
    '#mb-calorie-macro-calculator': "Kalkulačka kalórií a makroživín",
    '#mb-hydration-electrolyte-calculator': "Kalkulačka pitného režimu a elektrolytov",
    '#mb-activity-calorie-calculator': "Kalkulačka výdaja energie pri aktivite",
    '#mb-energy-availability-calculator': "Kalkulačka energetickej dostupnosti",
    '#mb-protein-intake-calculator': "Kalkulačka denného príjmu bielkovín",
    '#mb-waist-height-calculator': "Kalkulačka pomeru pásu k výške",
    '#mb-hba1c-converter': "Prevodník HbA1c a priemernej glykémie",
    '#mb-lipid-converter': "Prevodník krvných lipidov",
    '#mb-caffeine-intake-calculator': "Kalkulačka denného príjmu kofeínu",
    '#mb-fiber-intake-calculator': "Kalkulačka denného príjmu vlákniny"
  });

  // Anonymous tool usage only: never capture calculator values or user-entered text.
  // GTM must separately require analytics_storage consent before sending to GA4.
  function trackCalculator(tool) {
    const root = document.querySelector(tool.selector);
    if (!root || root.__mybearsAnalyticsTracked) return;
    root.__mybearsAnalyticsTracked = true;
    const toolId = tool.file.replace(/\.js$/, '');
    function track(eventName) {
      if (window.MYBEARS_TOOLS_ANALYTICS_ENABLED === false || !Array.isArray(window.dataLayer)) return;
      window.dataLayer.push({ event: eventName, component: 'mybears_calculator', tool_id: toolId, tool_name: TOOL_NAMES[tool.selector] || toolId });
    }
    track('kalkulacka_otevreni');
    root.addEventListener('submit', function () { track('kalkulacka_odeslani_pokus'); }, true);
  }


  function normalizePathname() {
    const path = String(window.location.pathname || '/').replace(/\/{2,}/g, '/');
    return path.length > 1 ? path.replace(/\/$/, '') : '/';
  }

  function has(selector) {
    try { return Boolean(document.querySelector(selector)); }
    catch (_) { return false; }
  }

  function mergeConfig(name, defaults) {
    window[name] = Object.assign({}, defaults, window[name] || {});
  }

  function scriptAlreadyPresent(filename) {
    return Array.from(document.scripts || []).some(function (script) {
      const src = String(script.src || '').split('#')[0].split('?')[0];
      return src.endsWith('/' + filename);
    });
  }

  function loadScript(filename) {
    if (loaded.has(filename)) return loaded.get(filename);
    if (scriptAlreadyPresent(filename)) {
      const ready = Promise.resolve();
      loaded.set(filename, ready);
      return ready;
    }

    const promise = new Promise(function (resolve, reject) {
      const script = document.createElement('script');
      script.src = baseUrl + filename;
      script.async = false;
      script.defer = false;
      script.setAttribute('data-mybears-loader', VERSION);
      script.onload = function () { resolve(); };
      script.onerror = function () {
        console.error('[MyBears Loader SK] Nepodarilo sa načítať:', filename);
        reject(new Error('Failed to load ' + filename));
      };
      document.head.appendChild(script);
    });

    loaded.set(filename, promise);
    return promise;
  }

  function configureProductGuide() {
    mergeConfig('MBPG_CONFIG', {
      analytics: true,
      maxResults: 3,
      minimumGoalScore: 30,
      enableLiveHydration: true,
      enableAddToCart: true,
      enableComparison: true,
      allProductsUrl: '/',
      autoMountHomepage: true,
      homepagePathnames: ['/']
    });
  }

  function configureOverlapChecker() {
    mergeConfig('MBOC_CONFIG', {
      analytics: true,
      siteOrigin: null,
      enableLiveProductData: true,
      initialProfile: 'adult',
      debug: false
    });
  }

  function configureProductComparison() {
    mergeConfig('MBPC_CONFIG', {
      siteOrigin: null,
      maxProducts: 4,
      enableLiveProductData: true,
      enableAddToCart: true,
      enableShareLink: true,
      analytics: true,
      initialProducts: [],
      debug: false
    });
  }

  function configureBundleBuilder() {
    mergeConfig('MBBB_CONFIG', {
      siteOrigin: null,
      minProducts: 2,
      maxProducts: 4,
      enableLiveProductData: true,
      enableAddAllToCart: true,
      enableShareLink: true,
      overlapCheckerUrl: '/kontrola-prekrytia-ucinnych-latok',
      productNote: 'Vlastní balíček MyBears',
      discountTiers: [],
      couponCode: '',
      analytics: true,
      debug: false
    });
  }

  function configureAdvisor() {
    mergeConfig('MBIA_CONFIG', {
      siteOrigin: null,
      advisorIndexUrl: '/advisor',
      articlesPerPage: 12,
      enableMetadataHydration: true,
      metadataConcurrency: 3,
      enableShareState: true,
      enableArticleEnhancements: true,
      enableReadingProgress: true,
      enableTableOfContents: true,
      enableRelatedArticles: true,
      enableReadingPosition: false,
      analytics: true,
      debug: false
    });
  }

  const tools = [
    { selector: '#mb-glycemic-load-calculator', file: 'kalkulacka-glykemicke-naloze-sk-1.0.js' },
    { selector: '#mb-bmi-calculator', file: 'kalkulacka-indexu-telesnej-hmotnosti-sk-1.0.js' },
    { selector: '#mb-bmr-calculator', file: 'kalkulacka-bazalneho-metabolizmu-sk-1.0.js' },
    { selector: '#mb-calorie-macro-calculator', file: 'kalkulacka-kalorii-a-makrozivin-sk-1.0.js' },
    { selector: '#mb-hydration-electrolyte-calculator', file: 'kalkulacka-pitneho-rezimu-a-elektrolytov-sk-1.0.js' },
    { selector: '#mb-activity-calorie-calculator', file: 'kalkulacka-vydaja-energie-pri-aktivite-sk-1.0.js' },
    { selector: '#mb-energy-availability-calculator', file: 'kalkulacka-energetickej-dostupnosti-sk-1.0.js' },
    { selector: '#mb-protein-intake-calculator', file: 'kalkulacka-denneho-prijmu-bielkovin-sk-1.0.js' },
    { selector: '#mb-waist-height-calculator', file: 'kalkulacka-pomeru-pasu-k-vyske-sk-1.0.js' },
    { selector: '#mb-hba1c-converter', file: 'prevodnik-hba1c-a-priemernej-glykemie-sk-2.0.js' },
    { selector: '#mb-lipid-converter', file: 'prevodnik-jednotiek-krvnych-lipidov-sk-3.0.js' },
    { selector: '#mb-caffeine-intake-calculator', file: 'kalkulacka-denneho-prijmu-kofeinu-sk-1.0.js' },
    { selector: '#mb-fiber-intake-calculator', file: 'kalkulacka-denneho-prijmu-vlakniny-sk-1.0.js' }
  ];

  async function boot() {
    const path = normalizePathname();
    const queue = [];

    // Homepage: lightweight guide shell + homepage nástroje + layout guard.
    if (path === '/') {
      configureProductGuide();
      queue.push('mybears-product-guide-2.0.3-sk.js');
      queue.push('homepage-nastroje-sk-1.1.js');
      queue.push('homepage-layout-fix-1.0.js');
    }

    // Kalkulačky a prevodníky: načítajú sa iba pri existujúcom mount pointe.
    tools.forEach(function (tool) {
      if (has(tool.selector)) {
        trackCalculator(tool);
        queue.push(tool.file);
      }
    });

    // Kontrola prekrytia účinných látok.
    if (has('[data-mybears-overlap-checker], #mybears-overlap-checker')) {
      configureOverlapChecker();
      queue.push('kontrola-prekryvu-ucinnych-latek-sk-3.0.js');
    }

    // Porovnávač produktov.
    if (has('[data-mybears-product-comparison], #mybears-product-comparison')) {
      configureProductComparison();
      queue.push('porovnavac-produktov-sk-2.0.js');
    }

    // Konfigurátor vlastného balíčka.
    if (has('[data-mybears-bundle-builder], #mybears-bundle-builder')) {
      configureBundleBuilder();
      queue.push('konfigurator-vlastneho-balicka-sk-1.0.js');
    }

    // Advisor hub + vylepšenia článkov v Advisore.
    const advisorArticle = /^\/advisor\/[^/?#]+$/i.test(path);
    const advisorIndex = path === '/advisor';
    if (advisorArticle || advisorIndex || has('[data-mybears-interactive-advice], #mybears-interactive-advice')) {
      configureAdvisor();
      queue.push('interaktivni-poradna-sk-4.0.js');
    }

    // Zachováme deterministické poradie a zabránime duplicitám.
    const uniqueQueue = queue.filter(function (file, index) {
      return queue.indexOf(file) === index;
    });

    for (const file of uniqueQueue) {
      try { await loadScript(file); }
      catch (_) { /* chyba jedného nástroja nesmie zablokovať ostatné */ }
    }
  }

  // Pri globálnom použití má byť loader načítaný s defer. Fallback nižšie
  // zachová bezpečné správanie aj pri prípadnom použití bez defer.
  if (document.readyState === 'loading' && !(currentScript && currentScript.defer)) {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
