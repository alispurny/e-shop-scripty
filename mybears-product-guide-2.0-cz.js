/**
 * MyBears Product Guide 2.0 — lightweight homepage shell CZ
 * Version: 2.0.1-cz-lazy-shell
 *
 * The homepage initially renders only the visual intro.
 * Full catalog/questions/scoring code is loaded after the customer clicks Start.
 */
(function () {
  'use strict';

  const VERSION = '2.0.1-cz-lazy-shell';
  const ROOT_SELECTOR = '[data-mybears-product-guide], [data-mb-product-guide], #mybears-product-guide, #mybears-product-guide-homepage';
  const SHELL_STYLE_ID = 'mbpg-lazy-shell-styles';

  const cfg = Object.assign({
    coreUrl: '',
    homepageMountId: 'mybears-product-guide-homepage',
    homepageInsertBeforeSelector: '',
    homepageInsertAfterSelector: '',
    homepageMainSelector: 'main, [role="main"], #content, .content, .main'
  }, window.MBPG_LAZY_CONFIG || {});

  const currentScript = document.currentScript;
  const currentSrc = currentScript && currentScript.src
    ? currentScript.src.split('#')[0].split('?')[0]
    : '';

  function siblingUrl(filename) {
    return currentSrc ? currentSrc.replace(/[^/]+$/, filename) : '';
  }

  const CORE_URL = cfg.coreUrl || siblingUrl('mybears-product-guide-2.0-cz-core.js');

  function isHomepage() {
    if (window.upgates && upgates.pageType) return upgates.pageType === 'homepage';
    return (location.pathname.replace(/\/+$/, '') || '/') === '/';
  }

  function safeQuery(selector, scope) {
    if (!selector || typeof selector !== 'string') return null;
    try { return (scope || document).querySelector(selector); }
    catch (_) { return null; }
  }

  function injectShellStyles() {
    if (document.getElementById(SHELL_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = SHELL_STYLE_ID;
    style.textContent = `
.mbpg{--mbpg-green:#2dc26b;--mbpg-green-dark:#198d4b;--mbpg-ink:#20221f;--mbpg-muted:#626760;--mbpg-cream:#faf7ef;--mbpg-line:#e5e3dc;--mbpg-gold:#DBC442;--mbpg-white:#fff;color:var(--mbpg-ink);font:inherit;font-family:Arial,Helvetica,sans-serif;line-height:1.55;margin:24px 0 40px}.mbpg *{box-sizing:border-box;font-family:inherit}.mbpg__shell{max-width:1120px;margin:0 auto;overflow:hidden;border:1px solid var(--mbpg-line);border-radius:18px;background:#fff;box-shadow:0 12px 32px rgba(27,35,29,.07)}.mbpg__topline{height:4px;background:var(--mbpg-gold)}.mbpg__body{padding:34px 38px 36px}.mbpg__intro-head{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:26px;margin-bottom:26px}.mbpg__eyebrow{display:inline-flex;align-items:center;gap:7px;margin:0 0 9px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--mbpg-green-dark)}.mbpg__eyebrow:before{content:"";width:22px;height:3px;border-radius:999px;background:var(--mbpg-gold)}.mbpg__title{margin:0 0 10px;color:var(--mbpg-green);font-size:clamp(25px,3.2vw,30px);font-weight:700;line-height:1.16}.mbpg__lead{max-width:790px;margin:0;color:#454a45;font-size:16px;line-height:1.58}.mbpg__mini{min-width:190px;padding:13px 16px;border:1px solid #e5dfd1;border-radius:12px;background:var(--mbpg-cream);color:#5f5a4e;font-size:13px;line-height:1.45}.mbpg__mini strong{display:block;color:#292b28;font-size:14px}.mbpg__steps{margin:24px 0 28px;overflow:hidden;border:1px solid #e8e2d7;border-radius:14px;background:#fff}.mbpg__step-row{display:grid;grid-template-columns:54px 1fr;align-items:center;gap:16px;min-height:84px;padding:14px 17px;border-bottom:1px solid #e8e2d7;background:var(--mbpg-cream)}.mbpg__step-row:nth-child(even){background:#fff}.mbpg__step-row:last-child{border-bottom:0}.mbpg__icon{display:grid;width:58px;height:58px;place-items:center;overflow:hidden;border:1px solid var(--mbpg-icon-ring,#dde5df);border-radius:16px;background:linear-gradient(145deg,var(--mbpg-icon-bg,#f4f7f4),var(--mbpg-icon-bg2,#edf2ee));box-shadow:0 8px 20px rgba(36,39,35,.075)}.mbpg__svg-icon{display:block;width:39px;height:39px}.mbpg__art-fill{fill:var(--mbpg-icon-fill,#73a785);stroke:var(--mbpg-icon-line,#3c704d);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.mbpg__art-fill2{fill:var(--mbpg-icon-fill2,#c8ddce);stroke:var(--mbpg-icon-line,#3c704d);stroke-width:1.5}.mbpg__art-line{fill:none;stroke:var(--mbpg-icon-line,#3c704d);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}.mbpg__art-accent,.mbpg__art-accent-fill{fill:var(--mbpg-icon-accent,#DBC442)}.mbpg__art-accent-line{fill:none;stroke:var(--mbpg-icon-accent,#DBC442);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}.mbpg__art-paper{fill:#fff;opacity:.92}.mbpg__art-success-line{fill:none;stroke:#198d4b;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.mbpg__step-copy strong{display:block;font-size:15px;font-weight:700}.mbpg__step-copy span{color:#5f625e;font-size:14px}.mbpg__quality-strip{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 0}.mbpg__quality-strip span{display:inline-flex;align-items:center;min-height:30px;padding:6px 10px;border:1px solid #dce8df;border-radius:999px;background:#f5faf6;color:#285d3c;font-size:12px;font-weight:700;line-height:1.2}.mbpg__actions{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:24px}.mbpg__button{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 24px;border:2px solid var(--mbpg-green);border-radius:8px;color:#fff!important;background:var(--mbpg-green);font-weight:700;line-height:1.15;text-align:center;text-decoration:none!important;cursor:pointer}.mbpg__button:hover{background:var(--mbpg-green-dark);border-color:var(--mbpg-green-dark)}.mbpg__button[disabled]{opacity:.55;cursor:wait}.mbpg .tldr-box{margin:24px 0 0}.mbpg .tldr-box p{margin:0}.mbpg[data-mbpg-auto="homepage"]{width:100%;clear:both;margin:clamp(30px,5vw,58px) auto}@media(max-width:760px){.mbpg__body{padding:26px 20px}.mbpg__intro-head{grid-template-columns:1fr}.mbpg__mini{min-width:0}}@media(max-width:560px){.mbpg{margin:16px 0 28px}.mbpg__shell{border-radius:14px}.mbpg__body{padding:24px 14px 26px}.mbpg__title{font-size:24px}.mbpg__step-row{grid-template-columns:58px minmax(0,1fr);gap:13px;padding:13px}.mbpg__quality-strip{gap:6px}.mbpg__quality-strip span{font-size:11px}.mbpg__button{width:100%}}`;
    document.head.appendChild(style);
  }

  function normalizedText(element) {
    return (element?.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function findBenefitGroup(scope = document) {
    const root = scope?.querySelectorAll ? scope : document;
    const elements = Array.from(root.querySelectorAll('a,h1,h2,h3,h4,strong,p,span,div,li,section,article'));

    function findSmallest(predicate) {
      const found = elements.filter((element) => predicate(normalizedText(element)));
      found.sort((a, b) => normalizedText(a).length - normalizedText(b).length);
      return found[0] || null;
    }

    const quality = findSmallest((text) =>
      text.includes('kvalitní suroviny') || text.includes('kvalitni suroviny') ||
      (text.includes('bio') && text.includes('vegan') && text.includes('halal') && text.includes('gmp')) ||
      text.includes('kvalita bez kompromisů') || text.includes('kvalita a transparentní složení')
    );

    const transparency = findSmallest((text) =>
      text.includes('transparentní složení') || text.includes('transparentni slozeni') ||
      text.includes('transparentní účinné dávky') || text.includes('kvalita a transparentní složení')
    );

    const laboratory = findSmallest((text) =>
      text.includes('laboratorně ověřujeme') || text.includes('laboratorne overujeme') ||
      text.includes('laboratorně testováno') || text.includes('laboratorne testovano')
    );

    const anchors = [quality, transparency, laboratory].filter(Boolean);
    if (anchors.length < 2) return null;

    let node = anchors[0];
    while (node && node !== document.body) {
      if (anchors.every((anchor) => node.contains(anchor))) return node;
      node = node.parentElement;
    }
    return null;
  }

  function createHomepageRoot() {
    const existing = document.querySelector(ROOT_SELECTOR);
    if (existing) return existing;

    const root = document.createElement('section');
    root.id = cfg.homepageMountId || 'mybears-product-guide-homepage';
    root.setAttribute('data-mybears-product-guide', '');
    root.setAttribute('data-mbpg-auto', 'homepage');
    root.setAttribute('aria-label', 'Průvodce výběrem produktů MyBears');

    const customBefore = safeQuery(cfg.homepageInsertBeforeSelector);
    if (customBefore?.parentNode) {
      customBefore.parentNode.insertBefore(root, customBefore);
      return root;
    }

    const customAfter = safeQuery(cfg.homepageInsertAfterSelector);
    if (customAfter?.parentNode) {
      customAfter.parentNode.insertBefore(root, customAfter.nextSibling);
      return root;
    }

    const benefitGroup = findBenefitGroup(document);
    if (benefitGroup?.parentNode) {
      benefitGroup.parentNode.insertBefore(root, benefitGroup.nextSibling);
      return root;
    }

    const main = safeQuery(cfg.homepageMainSelector) || document.body;
    main.appendChild(root);
    return root;
  }

  const icons = {
    clipboard: '<rect class="mbpg__art-fill2" x="12" y="10" width="40" height="47" rx="8"/><rect class="mbpg__art-fill" x="22" y="5" width="20" height="12" rx="5"/><path class="mbpg__art-line" d="M22 27h20M22 36h12M22 45h9"/><path class="mbpg__art-accent-line" d="m38 43 5 5 10-12"/>',
    sliders: '<rect class="mbpg__art-fill2" x="8" y="13" width="48" height="8" rx="4"/><rect class="mbpg__art-fill" x="8" y="28" width="48" height="8" rx="4"/><rect class="mbpg__art-fill2" x="8" y="43" width="48" height="8" rx="4"/><circle class="mbpg__art-accent" cx="42" cy="17" r="8"/><circle class="mbpg__art-accent" cx="22" cy="32" r="8"/><circle class="mbpg__art-accent" cx="38" cy="47" r="8"/><circle class="mbpg__art-paper" cx="42" cy="17" r="3"/><circle class="mbpg__art-paper" cx="22" cy="32" r="3"/><circle class="mbpg__art-paper" cx="38" cy="47" r="3"/>',
    package: '<path class="mbpg__art-fill" d="m8 20 24-12 24 12-24 13z"/><path class="mbpg__art-fill2" d="M8 20v28l24 12V33z"/><path class="mbpg__art-accent-fill" d="M56 20v28L32 60V33z"/><circle class="mbpg__art-paper" cx="45" cy="42" r="11"/><path class="mbpg__art-success-line" d="m39 42 4 4 8-9"/>'
  };

  const themes = {
    clipboard: ['#F4F7FC','#EAF0FA','#3F64A3','#7FA2D8','#C8D8F0','#2DC26B','#D8E3F3'],
    sliders: ['#FFF9EC','#FFF1CF','#8A6A13','#EACB68','#F5E7B4','#DBC442','#EEE0B3'],
    package: ['#F1F8F3','#E6F3E9','#247B4D','#65B482','#BFE0C9','#DBC442','#D1E7D7']
  };

  function iconVars(name) {
    const t = themes[name];
    return `--mbpg-icon-bg:${t[0]};--mbpg-icon-bg2:${t[1]};--mbpg-icon-line:${t[2]};--mbpg-icon-fill:${t[3]};--mbpg-icon-fill2:${t[4]};--mbpg-icon-accent:${t[5]};--mbpg-icon-ring:${t[6]};`;
  }

  function iconSvg(name) {
    return `<svg class="mbpg__svg-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
  }

  function renderIntro(root) {
    root.classList.add('mbpg');
    root.setAttribute('data-mbpg-shell', VERSION);
    root.innerHTML = `
      <section class="mbpg__shell mbpg__intro" aria-labelledby="mbpg-shell-title">
        <div class="mbpg__topline"></div>
        <div class="mbpg__body">
          <div class="mbpg__intro-head">
            <div>
              <span class="mbpg__eyebrow">MyBears průvodce výběrem</span>
              <h2 class="mbpg__title" id="mbpg-shell-title">Pomůžeme vám vybrat vhodný produkt MyBears</h2>
              <p class="mbpg__lead">Každý hledá něco jiného. Řekněte nám, na co se chcete zaměřit a co je pro vás při výběru důležité. Během několika krátkých otázek vybereme nejvhodnější produkty z nabídky MyBears a vysvětlíme proč.</p>
            </div>
            <div class="mbpg__mini"><strong>Rychlý průvodce</strong>Pár krátkých otázek<br>Přibližně 1 minuta</div>
          </div>
          <div class="mbpg__steps" aria-label="Jak průvodce funguje">
            <div class="mbpg__step-row"><span class="mbpg__icon" style="${iconVars('clipboard')}" aria-hidden="true">${iconSvg('clipboard')}</span><span class="mbpg__step-copy"><strong>Řeknete nám, co hledáte</strong><span>Vyberete hlavní oblast, na kterou se chcete zaměřit.</span></span></div>
            <div class="mbpg__step-row"><span class="mbpg__icon" style="${iconVars('sliders')}" aria-hidden="true">${iconSvg('sliders')}</span><span class="mbpg__step-copy"><strong>Zohledníme vaše preference</strong><span>Forma, provedení a další důležité požadavky zpřesní výběr.</span></span></div>
            <div class="mbpg__step-row"><span class="mbpg__icon" style="${iconVars('package')}" aria-hidden="true">${iconSvg('package')}</span><span class="mbpg__step-copy"><strong>Ukážeme vhodné produkty a proč</strong><span>Uvidíte hlavní složky, dávkování, cenu i aktuální dostupnost.</span></span></div>
          </div>
          <div class="mbpg__quality-strip" aria-label="Principy MyBears"><span>Transparentní složení</span><span>Smysluplné dávky</span><span>U vybraných produktů laboratorní analýzy</span></div>
          <div class="mbpg__actions"><button class="mbpg__button" type="button" data-mbpg-shell-start>Najít vhodný produkt</button></div>
          <div class="tldr-box"><p><strong>Vaše odpovědi zůstávají pouze v tomto průvodci.</strong> Doporučení vychází z parametrů produktů a vašich preferencí. Nevyhodnocuje zdravotní stav ani nenahrazuje konzultaci s lékařem nebo lékárníkem.</p></div>
        </div>
      </section>`;
  }

  let corePromise = null;

  function loadCore() {
    if (window.MyBearsProductGuide?.boot) return Promise.resolve(window.MyBearsProductGuide);
    if (corePromise) return corePromise;

    corePromise = new Promise((resolve, reject) => {
      if (!CORE_URL) return reject(new Error('Nelze odvodit URL core souboru.'));
      const script = document.createElement('script');
      script.src = CORE_URL;
      script.async = true;
      script.setAttribute('data-mbpg-core', 'lazy');
      script.onload = () => window.MyBearsProductGuide?.boot
        ? resolve(window.MyBearsProductGuide)
        : reject(new Error('Core se načetl, ale API není dostupné.'));
      script.onerror = () => reject(new Error('Core JS se nepodařilo načíst.'));
      document.head.appendChild(script);
    });

    return corePromise;
  }

  async function activate(root, button) {
    if (button.dataset.loading === '1') return;
    button.dataset.loading = '1';
    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Načítám průvodce…';

    try {
      const api = await loadCore();
      const guides = api.boot(document);
      const guide = guides.find((item) => item?.root === root) || guides[0];
      if (!guide || typeof guide.start !== 'function') throw new Error('Průvodce se nepodařilo inicializovat.');
      guide.start();
    } catch (error) {
      console.error('[MyBears Product Guide]', error);
      button.dataset.loading = '0';
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  function bootShell() {
    if (!isHomepage()) return;
    injectShellStyles();
    const root = createHomepageRoot();
    if (!root) return;
    renderIntro(root);

    root.addEventListener('click', (event) => {
      const button = event.target.closest('[data-mbpg-shell-start]');
      if (!button || !root.contains(button)) return;
      activate(root, button);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootShell, { once: true });
  } else {
    bootShell();
  }
})();
