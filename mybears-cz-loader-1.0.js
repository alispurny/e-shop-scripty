/**
 * MyBears CZ — conditional script loader
 * Version: 1.0.1
 *
 * Goal: keep the current functionality of MyBears interactive tools while
 * avoiding downloading every tool on every page.
 *
 * Load globally with defer. The loader then downloads only the scripts that
 * are needed by the current page (detected by mount point / homepage / Advisor).
 */
(function () {
  'use strict';

  const VERSION = '1.0.1-cz';
  const HOST_SUFFIX = 'mybears.cz';
  const host = String(window.location.hostname || '').toLowerCase();
  if (!host.endsWith(HOST_SUFFIX)) return;

  const currentScript = document.currentScript;
  const fallbackBase = 'https://cdn.jsdelivr.net/gh/alispurny/e-shop-scripty@main/';
  const baseUrl = currentScript && currentScript.src
    ? currentScript.src.split('#')[0].split('?')[0].replace(/[^/]+$/, '')
    : fallbackBase;

  const loaded = new Map();

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
        console.error('[MyBears Loader CZ] Nepodařilo se načíst:', filename);
        reject(new Error('Failed to load ' + filename));
      };
      document.head.appendChild(script);
    });

    loaded.set(filename, promise);
    return promise;
  }

  function configureProductGuide() {
    mergeConfig('MBPG_CONFIG', {
      analytics: false,
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
      analytics: false,
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
      overlapCheckerUrl: '/kontrola-prekryvu-ucinnych-latek',
      productNote: 'Vlastní balíček MyBears',
      discountTiers: [],
      couponCode: '',
      analytics: false,
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
      analytics: false,
      debug: false
    });
  }

  const tools = [
    { selector: '#mb-glycemic-load-calculator', file: 'kalkulacka-glykemicke-naloze-cz-1.0.js' },
    { selector: '#mb-bmi-calculator', file: 'kalkulacka-indexu-telesne-hmotnosti-cz-1.0.js' },
    { selector: '#mb-bmr-calculator', file: 'kalkulacka-bazalniho-metabolismu-cz-1.0.js' },
    { selector: '#mb-calorie-macro-calculator', file: 'kalkulacka-kalorii-a-makrozivin-cz-1.0.js' },
    { selector: '#mb-hydration-electrolyte-calculator', file: 'kalkulacka-pitneho-rezimu-a-elektrolytu-cz-1.0.js' },
    { selector: '#mb-activity-calorie-calculator', file: 'kalkulacka-vydeje-energie-pri-aktivite-cz-1.0.js' },
    { selector: '#mb-energy-availability-calculator', file: 'kalkulacka-energeticke-dostupnosti-cz-1.0.js' },
    { selector: '#mb-protein-intake-calculator', file: 'kalkulacka-denniho-prijmu-bilkovin-cz-1.0.js' },
    { selector: '#mb-waist-height-calculator', file: 'kalkulacka-pomeru-pasu-k-vysce-cz-1.0.js' },
    { selector: '#mb-hba1c-converter', file: 'prevodnik-hba1c-a-prumerne-glykemie-cz-2.0.js' },
    { selector: '#mb-lipid-converter', file: 'prevodnik-jednotek-krevnich-lipidu-cz-3.0.js' },
    { selector: '#mb-caffeine-intake-calculator', file: 'kalkulacka-denniho-prijmu-kofeinu-cz-1.0.js' },
    { selector: '#mb-fiber-intake-calculator', file: 'kalkulacka-denniho-prijmu-vlakniny-cz-1.0.js' }
  ];

  async function boot() {
    const path = normalizePathname();
    const queue = [];

    // Homepage: only the lightweight guide shell + homepage tools + layout guard.
    if (path === '/') {
      configureProductGuide();
      queue.push('mybears-product-guide-2.0-cz.js');
      queue.push('homepage-nastroje-cz-1.0.js');
      queue.push('homepage-layout-fix-1.0.js');
    }

    // Calculators/converters: load only when their existing mount point is present.
    tools.forEach(function (tool) {
      if (has(tool.selector)) queue.push(tool.file);
    });

    // Product overlap checker.
    if (has('[data-mybears-overlap-checker], #mybears-overlap-checker')) {
      configureOverlapChecker();
      queue.push('kontrola-prekryvu-ucinnych-latek-cz-2.0.js');
    }

    // Product comparator.
    if (has('[data-mybears-product-comparison], #mybears-product-comparison')) {
      configureProductComparison();
      queue.push('porovnavac-produktu-cz-2.0.js');
    }

    // Custom bundle builder.
    if (has('[data-mybears-bundle-builder], #mybears-bundle-builder')) {
      configureBundleBuilder();
      queue.push('konfigurator-vlastniho-balicku-cz-1.0.js');
    }

    // Advisor hub + Advisor article enhancements.
    const advisorArticle = /^\/advisor\/[^/?#]+$/i.test(path);
    const advisorIndex = path === '/advisor';
    if (advisorArticle || advisorIndex || has('[data-mybears-interactive-advice], #mybears-interactive-advice')) {
      configureAdvisor();
      queue.push('interaktivni-poradna-cz-4.0.js');
    }

    // Keep deterministic execution order and avoid duplicates.
    const uniqueQueue = queue.filter(function (file, index) {
      return queue.indexOf(file) === index;
    });

    for (const file of uniqueQueue) {
      try { await loadScript(file); }
      catch (_) { /* one failed tool must not block the rest */ }
    }
  }

  // The loader itself should be loaded with defer, therefore the DOM is normally
  // already parsed here. This fallback also makes direct/non-defer use safe.
  if (document.readyState === 'loading' && !(currentScript && currentScript.defer)) {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
