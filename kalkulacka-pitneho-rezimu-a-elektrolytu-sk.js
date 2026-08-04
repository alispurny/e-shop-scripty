/**
 * MyBears — zjednotená grafická verzia 2.0 (SK)
 * Vizuálny systém vychádza z MyBears Product Guide v1.8.
 * Funkčná logika pôvodného nástroja zostáva zachovaná.
 */
(function () {
  'use strict';

  var MYBEARS_UNIFIED_DESIGN_CSS = String.raw`
/* MyBears unified design layer — based on Product Guide v1.8 */
#mb-hydration-electrolyte-calculator {
  --mb-green:#2dc26b !important;
  --mb-green-dark:#198d4b !important;
  --mb-green-soft:#f4f8f4 !important;
  --mb-border:#e5e3dc !important;
  --mb-text:#20221f !important;
  --mb-muted:#626760 !important;
  --mb-cream:#faf7ef;
  --mb-cream-2:#f7f3ea;
  --mb-gold:#DBC442;
  --mb-danger:#a63a36 !important;
  width:100%; max-width:1120px; margin:24px auto 40px !important;
  color:var(--mb-text); font-family:Arial,Helvetica,sans-serif; line-height:1.55;
}
#mb-hydration-electrolyte-calculator *, #mb-hydration-electrolyte-calculator *::before, #mb-hydration-electrolyte-calculator *::after { box-sizing:border-box; }
#mb-hydration-electrolyte-calculator .mb-hy { position:relative; overflow:hidden; border:1px solid var(--mb-border) !important; border-radius:18px !important; background:#fff !important; box-shadow:0 12px 32px rgba(27,35,29,.07) !important; }
#mb-hydration-electrolyte-calculator .mb-hy::before { content:""; position:absolute; z-index:3; top:0; left:0; right:0; height:4px; background:var(--mb-gold); }
#mb-hydration-electrolyte-calculator .mb-hy__head { padding:34px 38px 26px !important; background:var(--mb-cream) !important; border-bottom:1px solid var(--mb-border) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__body { padding:30px 38px 36px !important; }
#mb-hydration-electrolyte-calculator .mb-hy__title, #mb-hydration-electrolyte-calculator .mb-hy__section-title, #mb-hydration-electrolyte-calculator .mb-hy__panel-title, #mb-hydration-electrolyte-calculator .mb-hy__subhead { color:var(--mb-green) !important; font-weight:700 !important; letter-spacing:-.01em; }
#mb-hydration-electrolyte-calculator .mb-hy__title { margin:0 0 10px !important; font-size:clamp(25px,3.2vw,30px) !important; line-height:1.16 !important; }
#mb-hydration-electrolyte-calculator .mb-hy__lead { max-width:820px; margin:0 !important; color:#454a45 !important; font-size:16px !important; line-height:1.58 !important; }
#mb-hydration-electrolyte-calculator .mb-hy__notice { margin:0 0 22px !important; padding:15px 17px !important; border:1px solid #eadfc8 !important; border-left:4px solid var(--mb-gold) !important; border-radius:12px !important; background:var(--mb-cream) !important; color:#4f4b43 !important; font-size:14px !important; line-height:1.55 !important; }
#mb-hydration-electrolyte-calculator .mb-hy__notice strong { color:#292b28; }
#mb-hydration-electrolyte-calculator .mb-hy__grid { gap:18px !important; }
#mb-hydration-electrolyte-calculator .mb-hy__field { min-width:0; }
#mb-hydration-electrolyte-calculator .mb-hy__label { margin-bottom:7px !important; color:#292b28 !important; font-size:15px !important; font-weight:700 !important; }
#mb-hydration-electrolyte-calculator .mb-hy__input, #mb-hydration-electrolyte-calculator .mb-hy__select { min-height:48px !important; border:1px solid #d4d6d1 !important; border-radius:8px !important; background:#fff !important; color:var(--mb-text) !important; box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }
#mb-hydration-electrolyte-calculator .mb-hy__input:hover, #mb-hydration-electrolyte-calculator .mb-hy__select:hover { border-color:#aeb8b0 !important; }
#mb-hydration-electrolyte-calculator .mb-hy__input:focus, #mb-hydration-electrolyte-calculator .mb-hy__select:focus { outline:3px solid rgba(219,196,66,.30) !important; outline-offset:1px; border-color:var(--mb-green-dark) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__hint, #mb-hydration-electrolyte-calculator .mb-hy__privacy, #mb-hydration-electrolyte-calculator .mb-hy__formula, #mb-hydration-electrolyte-calculator .mb-hy__disclaimer { color:var(--mb-muted) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__actions { gap:12px !important; margin-top:24px !important; }
#mb-hydration-electrolyte-calculator .mb-hy__button { display:inline-flex; align-items:center; justify-content:center; min-height:48px !important; padding:12px 24px !important; border:2px solid transparent !important; border-radius:8px !important; font-weight:700 !important; line-height:1.15; transition:background .15s ease,border-color .15s ease,transform .15s ease; }
#mb-hydration-electrolyte-calculator .mb-hy__button:hover { transform:translateY(-1px); }
#mb-hydration-electrolyte-calculator .mb-hy__button:focus-visible, #mb-hydration-electrolyte-calculator a:focus-visible, #mb-hydration-electrolyte-calculator summary:focus-visible { outline:3px solid rgba(219,196,66,.38) !important; outline-offset:2px !important; }
#mb-hydration-electrolyte-calculator .mb-hy__button--primary { min-width:210px; color:#fff !important; background:var(--mb-green) !important; border-color:var(--mb-green) !important; box-shadow:none !important; }
#mb-hydration-electrolyte-calculator .mb-hy__button--primary:hover { background:var(--mb-green-dark) !important; border-color:var(--mb-green-dark) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__button--secondary { color:var(--mb-green-dark) !important; background:#fff !important; border-color:var(--mb-green) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__advanced, #mb-hydration-electrolyte-calculator .mb-hy__panel, #mb-hydration-electrolyte-calculator .mb-hy__mode, #mb-hydration-electrolyte-calculator .mb-hy__tabs { border-color:var(--mb-border) !important; border-radius:12px !important; background:var(--mb-cream) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__tab, #mb-hydration-electrolyte-calculator .mb-hy__mode-btn { border-radius:8px !important; color:var(--mb-green-dark) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__tab[aria-selected="true"], #mb-hydration-electrolyte-calculator .mb-hy__mode-btn[aria-pressed="true"], #mb-hydration-electrolyte-calculator .mb-hy__tab.is-active, #mb-hydration-electrolyte-calculator .mb-hy__mode-btn.is-active { background:var(--mb-green) !important; color:#fff !important; border-color:var(--mb-green) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__result { margin-top:28px !important; padding:24px !important; border:1px solid #cfe4d5 !important; border-radius:16px !important; background:var(--mb-green-soft) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__score { color:#20221f !important; font-weight:800 !important; letter-spacing:-.035em; }
#mb-hydration-electrolyte-calculator .mb-hy__badge { border:1px solid #d7ceb8 !important; background:#fff8df !important; color:#75633d !important; font-weight:700 !important; }
#mb-hydration-electrolyte-calculator .mb-hy__summary { color:#454a45 !important; }
#mb-hydration-electrolyte-calculator .mb-hy__metric, #mb-hydration-electrolyte-calculator .mb-hy__card, #mb-hydration-electrolyte-calculator .mb-hy__macro, #mb-hydration-electrolyte-calculator .mb-hy__meal { border:1px solid var(--mb-border) !important; border-radius:12px !important; background:#fff !important; box-shadow:none !important; }
#mb-hydration-electrolyte-calculator .mb-hy__metric-label, #mb-hydration-electrolyte-calculator .mb-hy__card-label, #mb-hydration-electrolyte-calculator .mb-hy__result-label { color:var(--mb-muted) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__metric-value, #mb-hydration-electrolyte-calculator .mb-hy__card-value, #mb-hydration-electrolyte-calculator .mb-hy__macro-value { color:var(--mb-green-dark) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__warning, #mb-hydration-electrolyte-calculator .mb-hy__inline-warning { border-left:4px solid var(--mb-gold) !important; border-radius:8px !important; background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important; color:#5d4b1d !important; }
#mb-hydration-electrolyte-calculator .mb-hy__error { border-color:#e3b3af !important; border-radius:10px !important; background:#fff5f4 !important; color:var(--mb-danger) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__scale { box-shadow:inset 0 0 0 1px rgba(32,34,31,.10); }
#mb-hydration-electrolyte-calculator .mb-hy__marker { background:#20231f !important; box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(32,35,31,.18) !important; }
#mb-hydration-electrolyte-calculator .mb-hy__table-wrap { overflow-x:auto; border:1px solid var(--mb-border) !important; border-radius:12px !important; }
#mb-hydration-electrolyte-calculator .mb-hy__table { width:100%; border-collapse:collapse; background:#fff; }
#mb-hydration-electrolyte-calculator .mb-hy__table thead th { border-bottom:2px solid var(--mb-gold) !important; background:#20231f !important; color:#fff !important; }
#mb-hydration-electrolyte-calculator .mb-hy__table tbody tr:nth-child(even) { background:var(--mb-green-soft) !important; }
@media(max-width:760px) {
  #mb-hydration-electrolyte-calculator { margin:18px auto 30px !important; }
  #mb-hydration-electrolyte-calculator .mb-hy__head { padding:28px 20px 22px !important; }
  #mb-hydration-electrolyte-calculator .mb-hy__body { padding:24px 20px 28px !important; }
  #mb-hydration-electrolyte-calculator .mb-hy__result { padding:20px !important; }
  #mb-hydration-electrolyte-calculator .mb-hy__actions { flex-direction:column; align-items:stretch; }
  #mb-hydration-electrolyte-calculator .mb-hy__button { width:100%; }
}
@media(prefers-reduced-motion:reduce) {
  #mb-hydration-electrolyte-calculator *, #mb-hydration-electrolyte-calculator *::before, #mb-hydration-electrolyte-calculator *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
`;


  var ROOT_ID = 'mb-hydration-electrolyte-calculator';
  var STYLE_ID = 'mb-hydration-electrolyte-calculator-styles';
  var SCRIPT_VERSION = '2.0.0-sk';

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    return Number(value.trim().replace(',', '.'));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function formatNumber(value, decimals) {
    return new Intl.NumberFormat('sk-SK', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function addStyles() {
    var oldStyle = document.getElementById(STYLE_ID);
    if (oldStyle && oldStyle.parentNode) oldStyle.parentNode.removeChild(oldStyle);

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '#' + ROOT_ID + ' { --mb-green:#2dc26b; --mb-green-dark:#168947; --mb-green-soft:#f7fbf8; --mb-border:#d9e5dd; --mb-text:#1f2933; --mb-muted:#59636e; --mb-danger:#b42318; --mb-warning:#9a6700; --mb-warning-bg:#fff8e1; --mb-blue:#4d9ed1; font-family:Arial,Helvetica,sans-serif; color:var(--mb-text); margin:24px 0; }',
      '#' + ROOT_ID + ' * { box-sizing:border-box; }',
      '#' + ROOT_ID + ' .mb-hy { border:1px solid var(--mb-border); border-radius:14px; background:#fff; box-shadow:0 8px 28px rgba(31,41,51,.08); overflow:hidden; }',
      '#' + ROOT_ID + ' .mb-hy__head { padding:22px 22px 16px; background:var(--mb-green-soft); border-bottom:1px solid var(--mb-border); }',
      '#' + ROOT_ID + ' .mb-hy__title { margin:0 0 8px; font-size:22px; line-height:1.25; }',
      '#' + ROOT_ID + ' .mb-hy__lead { margin:0; color:var(--mb-muted); font-size:16px; line-height:1.55; }',
      '#' + ROOT_ID + ' .mb-hy__body { padding:22px; }',
      '#' + ROOT_ID + ' .mb-hy__notice { margin:0 0 18px; padding:12px 14px; border-left:4px solid var(--mb-green); border-radius:6px; background:#f8faf9; color:var(--mb-muted); font-size:14px; line-height:1.5; }',
      '#' + ROOT_ID + ' .mb-hy__tabs { display:flex; flex-wrap:wrap; gap:8px; margin:0 0 20px; padding:5px; border:1px solid var(--mb-border); border-radius:10px; background:#f7f9f8; }',
      '#' + ROOT_ID + ' .mb-hy__tab { flex:1 1 230px; min-height:44px; padding:9px 14px; border:1px solid transparent; border-radius:7px; background:transparent; color:var(--mb-text); font:inherit; font-weight:700; cursor:pointer; }',
      '#' + ROOT_ID + ' .mb-hy__tab[aria-selected="true"] { background:#fff; border-color:#b8e7ca; box-shadow:0 2px 8px rgba(31,41,51,.06); color:#0f6f38; }',
      '#' + ROOT_ID + ' .mb-hy__tab:focus-visible { outline:3px solid rgba(45,194,107,.25); outline-offset:2px; }',
      '#' + ROOT_ID + ' .mb-hy__panel[hidden] { display:none; }',
      '#' + ROOT_ID + ' .mb-hy__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }',
      '#' + ROOT_ID + ' .mb-hy__field { min-width:0; }',
      '#' + ROOT_ID + ' .mb-hy__field--full { grid-column:1/-1; }',
      '#' + ROOT_ID + ' .mb-hy__label { display:block; margin:0 0 7px; font-size:15px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-hy__input-wrap { position:relative; }',
      '#' + ROOT_ID + ' .mb-hy__input, #' + ROOT_ID + ' .mb-hy__select { width:100%; min-height:48px; padding:11px 12px; border:1px solid #b9c6be; border-radius:8px; background:#fff; color:var(--mb-text); font:inherit; font-size:16px; }',
      '#' + ROOT_ID + ' .mb-hy__input { padding-right:58px; }',
      '#' + ROOT_ID + ' .mb-hy__input:focus, #' + ROOT_ID + ' .mb-hy__select:focus { outline:3px solid rgba(45,194,107,.2); border-color:var(--mb-green-dark); }',
      '#' + ROOT_ID + ' .mb-hy__unit { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--mb-muted); font-size:14px; pointer-events:none; }',
      '#' + ROOT_ID + ' .mb-hy__hint { display:block; margin-top:6px; color:var(--mb-muted); font-size:13px; line-height:1.4; }',
      '#' + ROOT_ID + ' .mb-hy__actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }',
      '#' + ROOT_ID + ' .mb-hy__button { min-height:46px; padding:11px 20px; border-radius:8px; border:1px solid transparent; font:inherit; font-size:16px; font-weight:700; cursor:pointer; }',
      '#' + ROOT_ID + ' .mb-hy__button:focus-visible { outline:3px solid rgba(45,194,107,.28); outline-offset:2px; }',
      '#' + ROOT_ID + ' .mb-hy__button--primary { background:var(--mb-green); color:#0c2818; border-color:var(--mb-green); box-shadow:0 4px 12px rgba(45,194,107,.22); }',
      '#' + ROOT_ID + ' .mb-hy__button--secondary { background:#fff; color:var(--mb-text); border-color:#b9c6be; }',
      '#' + ROOT_ID + ' .mb-hy__error { display:none; margin:16px 0 0; padding:12px 14px; border:1px solid #f1b5b0; border-radius:8px; background:#fff6f5; color:var(--mb-danger); font-size:14px; line-height:1.45; }',
      '#' + ROOT_ID + ' .mb-hy__error.is-visible { display:block; }',
      '#' + ROOT_ID + ' .mb-hy__result { margin-top:22px; padding:20px; border:1px solid #b8e7ca; border-radius:12px; background:var(--mb-green-soft); }',
      '#' + ROOT_ID + ' .mb-hy__result[hidden] { display:none; }',
      '#' + ROOT_ID + ' .mb-hy__result-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }',
      '#' + ROOT_ID + ' .mb-hy__result-label { margin:0 0 5px; color:var(--mb-muted); font-size:14px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-hy__score { margin:0; font-size:38px; line-height:1.05; font-weight:800; letter-spacing:-.03em; }',
      '#' + ROOT_ID + ' .mb-hy__badge { display:inline-flex; min-height:34px; align-items:center; padding:6px 11px; border:1px solid #b9c6be; border-radius:999px; background:#fff; font-size:14px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-hy__summary { margin:14px 0 0; font-size:15px; line-height:1.55; }',
      '#' + ROOT_ID + ' .mb-hy__metrics { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-top:18px; }',
      '#' + ROOT_ID + ' .mb-hy__metric { padding:14px; border:1px solid var(--mb-border); border-radius:9px; background:#fff; }',
      '#' + ROOT_ID + ' .mb-hy__metric-label { margin:0 0 7px; color:var(--mb-muted); font-size:13px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-hy__metric-value { margin:0; font-size:18px; line-height:1.25; font-weight:800; }',
      '#' + ROOT_ID + ' .mb-hy__warning { margin:16px 0 0; padding:12px 14px; border:1px solid #f0d27a; border-radius:8px; background:var(--mb-warning-bg); color:#6f4e00; font-size:14px; line-height:1.5; }',
      '#' + ROOT_ID + ' .mb-hy__privacy { margin:16px 0 0; color:var(--mb-muted); font-size:12px; line-height:1.45; }',
      '#' + ROOT_ID + ' .mb-hy__custom[hidden] { display:none; }',
      '@media (max-width:760px) { #' + ROOT_ID + ' .mb-hy__grid, #' + ROOT_ID + ' .mb-hy__metrics { grid-template-columns:1fr; } #' + ROOT_ID + ' .mb-hy__body, #' + ROOT_ID + ' .mb-hy__head { padding-left:16px; padding-right:16px; } #' + ROOT_ID + ' .mb-hy__score { font-size:32px; } }',
      '@media (prefers-reduced-motion:reduce) { #' + ROOT_ID + ' * { scroll-behavior:auto !important; transition:none !important; } }'
    ].join('\n');
    style.textContent += MYBEARS_UNIFIED_DESIGN_CSS;
    document.head.appendChild(style);
  }

  function init() {
    var root = document.getElementById(ROOT_ID);
    if (!root || root.getAttribute('data-mb-version') === SCRIPT_VERSION) return;

    addStyles();
    root.setAttribute('data-mb-version', SCRIPT_VERSION);
    root.innerHTML = [
      '<section class="mb-hy" aria-labelledby="mb-hy-title">',
      '  <div class="mb-hy__head">',
      '    <h2 class="mb-hy__title" id="mb-hy-title">Kalkulačka pitného režimu a strát potením</h2>',
      '    <p class="mb-hy__lead">Vypočítajte orientačné denné rozmedzie tekutín alebo vykonajte vlastný test potenia a odhadnite stratu sodíka.</p>',
      '  </div>',
      '  <div class="mb-hy__body">',
      '    <p class="mb-hy__notice"><strong>Dôležité:</strong> Potreba tekutín aj koncentrácia sodíka v pote sú individuálne. Výsledky nie sú odporúčaním na automatické doplnenie rovnakého množstva vody alebo elektrolytov.</p>',
      '    <div class="mb-hy__tabs" role="tablist" aria-label="Režim kalkulačky">',
      '      <button type="button" class="mb-hy__tab" id="mb-hy-tab-daily" role="tab" aria-controls="mb-hy-panel-daily" aria-selected="true">Denný pitný režim</button>',
      '      <button type="button" class="mb-hy__tab" id="mb-hy-tab-sweat" role="tab" aria-controls="mb-hy-panel-sweat" aria-selected="false">Test potenia a sodíka</button>',
      '    </div>',
      '    <div class="mb-hy__panel" id="mb-hy-panel-daily" role="tabpanel" aria-labelledby="mb-hy-tab-daily">',
      '      <form id="mb-hy-daily-form" novalidate>',
      '        <div class="mb-hy__grid">',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-weight">Hmotnosť</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-weight" inputmode="decimal" autocomplete="off" value="70" aria-describedby="mb-hy-weight-hint"><span class="mb-hy__unit">kg</span></div><span class="mb-hy__hint" id="mb-hy-weight-hint">Povolené rozmedzie: 30–250 kg</span></div>',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-age">Vek</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-age" inputmode="numeric" autocomplete="off" value="35"><span class="mb-hy__unit">rokov</span></div><span class="mb-hy__hint">Kalkulačka je určená pre dospelých od 18 rokov.</span></div>',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-sex">Referenčná skupina</label><select class="mb-hy__select" id="mb-hy-sex"><option value="female">Žena</option><option value="male">Muž</option></select><span class="mb-hy__hint">Používa sa iba na porovnanie s referenčným príjmom celkovej vody podľa EFSA.</span></div>',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-glass">Veľkosť pohára</label><select class="mb-hy__select" id="mb-hy-glass"><option value="200">200 ml</option><option value="250" selected>250 ml</option><option value="300">300 ml</option></select><span class="mb-hy__hint">Prepočet slúži iba na jednoduchšiu predstavu.</span></div>',
      '        </div>',
      '        <div class="mb-hy__actions"><button class="mb-hy__button mb-hy__button--primary" type="submit">Vypočítať pitný režim</button><button class="mb-hy__button mb-hy__button--secondary" type="button" id="mb-hy-daily-reset">Vymazať údaje</button></div>',
      '        <div class="mb-hy__error" id="mb-hy-daily-error" role="alert"></div>',
      '      </form>',
      '      <div class="mb-hy__result" id="mb-hy-daily-result" hidden aria-live="polite"></div>',
      '    </div>',
      '    <div class="mb-hy__panel" id="mb-hy-panel-sweat" role="tabpanel" aria-labelledby="mb-hy-tab-sweat" hidden>',
      '      <form id="mb-hy-sweat-form" novalidate>',
      '        <div class="mb-hy__grid">',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-pre">Hmotnosť pred aktivitou</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-pre" inputmode="decimal" autocomplete="off" value="75"><span class="mb-hy__unit">kg</span></div></div>',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-post">Hmotnosť po aktivite</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-post" inputmode="decimal" autocomplete="off" value="74,4"><span class="mb-hy__unit">kg</span></div></div>',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-duration">Dĺžka aktivity</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-duration" inputmode="numeric" autocomplete="off" value="60"><span class="mb-hy__unit">min</span></div></div>',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-drink">Tekutiny vypité počas aktivity</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-drink" inputmode="decimal" autocomplete="off" value="500"><span class="mb-hy__unit">ml</span></div></div>',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-urine">Moč počas aktivity</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-urine" inputmode="decimal" autocomplete="off" value="0"><span class="mb-hy__unit">ml</span></div><span class="mb-hy__hint">Ak ste počas testu nemočili, ponechajte hodnotu 0.</span></div>',
      '          <div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-sodium-mode">Koncentrácia sodíka v pote</label><select class="mb-hy__select" id="mb-hy-sodium-mode"><option value="unknown">Neviem – zobraziť široké rozmedzie</option><option value="mg">Poznám hodnotu v mg/l</option><option value="mmol">Poznám hodnotu v mmol/l</option></select><span class="mb-hy__hint">Presnejšiu hodnotu poskytne validované vyšetrenie potu.</span></div>',
      '          <div class="mb-hy__field mb-hy__custom" id="mb-hy-sodium-custom" hidden><label class="mb-hy__label" for="mb-hy-sodium-value">Zadajte koncentráciu sodíka</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-sodium-value" inputmode="decimal" autocomplete="off" value="900"><span class="mb-hy__unit" id="mb-hy-sodium-unit">mg/l</span></div></div>',
      '        </div>',
      '        <div class="mb-hy__actions"><button class="mb-hy__button mb-hy__button--primary" type="submit">Vypočítať stratu potením</button><button class="mb-hy__button mb-hy__button--secondary" type="button" id="mb-hy-sweat-reset">Vymazať údaje</button></div>',
      '        <div class="mb-hy__error" id="mb-hy-sweat-error" role="alert"></div>',
      '      </form>',
      '      <div class="mb-hy__result" id="mb-hy-sweat-result" hidden aria-live="polite"></div>',
      '    </div>',
      '    <p class="mb-hy__privacy">Výpočty prebiehajú iba vo vašom prehliadači. Zadané údaje sa týmto skriptom nikam neodosielajú ani neukladajú.</p>',
      '  </div>',
      '</section>'
    ].join('');

    var dailyTab = root.querySelector('#mb-hy-tab-daily');
    var sweatTab = root.querySelector('#mb-hy-tab-sweat');
    var dailyPanel = root.querySelector('#mb-hy-panel-daily');
    var sweatPanel = root.querySelector('#mb-hy-panel-sweat');

    function setTab(mode) {
      var daily = mode === 'daily';
      dailyTab.setAttribute('aria-selected', daily ? 'true' : 'false');
      sweatTab.setAttribute('aria-selected', daily ? 'false' : 'true');
      dailyPanel.hidden = !daily;
      sweatPanel.hidden = daily;
    }

    dailyTab.addEventListener('click', function () { setTab('daily'); });
    sweatTab.addEventListener('click', function () { setTab('sweat'); });

    var dailyForm = root.querySelector('#mb-hy-daily-form');
    var dailyError = root.querySelector('#mb-hy-daily-error');
    var dailyResult = root.querySelector('#mb-hy-daily-result');

    function showError(el, message) {
      el.textContent = message;
      el.classList.add('is-visible');
    }

    function clearError(el) {
      el.textContent = '';
      el.classList.remove('is-visible');
    }

    dailyForm.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError(dailyError);

      var weight = parseNumber(root.querySelector('#mb-hy-weight').value);
      var age = parseNumber(root.querySelector('#mb-hy-age').value);
      var sex = root.querySelector('#mb-hy-sex').value;
      var glass = parseNumber(root.querySelector('#mb-hy-glass').value);

      if (!Number.isFinite(weight) || weight < 30 || weight > 250) return showError(dailyError, 'Zadajte hmotnosť v rozmedzí 30–250 kg.');
      if (!Number.isFinite(age) || age < 18 || age > 100) return showError(dailyError, 'Zadajte vek v rozmedzí 18–100 rokov.');

      var lowMlKg = age >= 60 ? 25 : 30;
      var highMlKg = age >= 60 ? 30 : 35;
      var lowMl = weight * lowMlKg;
      var highMl = weight * highMlKg;
      var efsaMl = sex === 'female' ? 2000 : 2500;
      var lowGlasses = lowMl / glass;
      var highGlasses = highMl / glass;
      var warning = '';

      if (weight >= 120) {
        warning = '<div class="mb-hy__warning"><strong>Pozor:</strong> Výpočet podľa aktuálnej hmotnosti môže pri vyššej telesnej hmotnosti poskytovať vysoké hodnoty. Výsledok preto vnímajte ako široké pracovné rozmedzie, nie ako povinný cieľ.</div>';
      }

      dailyResult.innerHTML = [
        '<div class="mb-hy__result-top"><div><p class="mb-hy__result-label">Orientačné denné rozmedzie tekutín</p><p class="mb-hy__score">' + formatNumber(lowMl / 1000, 1) + '–' + formatNumber(highMl / 1000, 1) + ' l</p></div><span class="mb-hy__badge">' + lowMlKg + '–' + highMlKg + ' ml/kg</span></div>',
        '<p class="mb-hy__summary">Ide o orientačné pracovné rozmedzie pre bežný deň. Potreba sa môže zvýšiť pri horúčave, dlhšej fyzickej aktivite, horúčke, hnačke alebo vracaní. Časť vody prijímate aj z potravín.</p>',
        '<div class="mb-hy__metrics">',
        '<div class="mb-hy__metric"><p class="mb-hy__metric-label">Prepočet na poháre</p><p class="mb-hy__metric-value">' + formatNumber(lowGlasses, 0) + '–' + formatNumber(highGlasses, 0) + ' × ' + glass + ' ml</p></div>',
        '<div class="mb-hy__metric"><p class="mb-hy__metric-label">Referenčný príjem celkovej vody podľa EFSA</p><p class="mb-hy__metric-value">' + formatNumber(efsaMl / 1000, 1) + ' l/deň</p></div>',
        '<div class="mb-hy__metric"><p class="mb-hy__metric-label">Pri športe a horúčave</p><p class="mb-hy__metric-value">Použite test potenia</p></div>',
        '</div>',
        '<div class="mb-hy__warning"><strong>Referenčná hodnota EFSA zahŕňa vodu z nápojov aj potravín.</strong> Nemožno ju chápať ako povinné množstvo čistej vody. Pri ochorení srdca alebo obličiek a pri obmedzení tekutín sa riaďte pokynmi lekára.</div>',
        warning
      ].join('');
      dailyResult.hidden = false;
    });

    root.querySelector('#mb-hy-daily-reset').addEventListener('click', function () {
      dailyForm.reset();
      root.querySelector('#mb-hy-weight').value = '';
      root.querySelector('#mb-hy-age').value = '';
      dailyResult.hidden = true;
      clearError(dailyError);
      root.querySelector('#mb-hy-weight').focus();
    });

    var sodiumMode = root.querySelector('#mb-hy-sodium-mode');
    var sodiumCustom = root.querySelector('#mb-hy-sodium-custom');
    var sodiumUnit = root.querySelector('#mb-hy-sodium-unit');

    function updateSodiumField() {
      var mode = sodiumMode.value;
      sodiumCustom.hidden = mode === 'unknown';
      sodiumUnit.textContent = mode === 'mmol' ? 'mmol/l' : 'mg/l';
    }
    sodiumMode.addEventListener('change', updateSodiumField);

    var sweatForm = root.querySelector('#mb-hy-sweat-form');
    var sweatError = root.querySelector('#mb-hy-sweat-error');
    var sweatResult = root.querySelector('#mb-hy-sweat-result');

    sweatForm.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError(sweatError);

      var pre = parseNumber(root.querySelector('#mb-hy-pre').value);
      var post = parseNumber(root.querySelector('#mb-hy-post').value);
      var duration = parseNumber(root.querySelector('#mb-hy-duration').value);
      var drinkMl = parseNumber(root.querySelector('#mb-hy-drink').value);
      var urineMl = parseNumber(root.querySelector('#mb-hy-urine').value);
      var mode = sodiumMode.value;
      var sodiumValue = parseNumber(root.querySelector('#mb-hy-sodium-value').value);

      if (!Number.isFinite(pre) || pre < 30 || pre > 250) return showError(sweatError, 'Zadajte hmotnosť pred aktivitou v rozmedzí 30–250 kg.');
      if (!Number.isFinite(post) || post < 30 || post > 250) return showError(sweatError, 'Zadajte hmotnosť po aktivite v rozmedzí 30–250 kg.');
      if (!Number.isFinite(duration) || duration < 15 || duration > 720) return showError(sweatError, 'Zadajte dĺžku aktivity v rozmedzí 15–720 minút.');
      if (!Number.isFinite(drinkMl) || drinkMl < 0 || drinkMl > 10000) return showError(sweatError, 'Zadajte množstvo vypitých tekutín od 0 do 10 000 ml.');
      if (!Number.isFinite(urineMl) || urineMl < 0 || urineMl > 5000) return showError(sweatError, 'Zadajte množstvo moču od 0 do 5 000 ml.');
      if (mode !== 'unknown' && (!Number.isFinite(sodiumValue) || sodiumValue <= 0)) return showError(sweatError, 'Zadajte platnú koncentráciu sodíka v pote.');

      var hours = duration / 60;
      var bodyMassChangeKg = pre - post;
      var sweatLossL = bodyMassChangeKg + (drinkMl / 1000) - (urineMl / 1000);
      if (sweatLossL <= 0) return showError(sweatError, 'Zadané hodnoty vedú k nulovej alebo zápornej strate potením. Skontrolujte hmotnosť, vypité tekutiny a moč.');

      var sweatRate = sweatLossL / hours;
      var massChangePct = ((post - pre) / pre) * 100;
      var rateLabel = sweatRate < 0.5 ? 'nižšie potenie' : sweatRate < 1.0 ? 'stredné potenie' : sweatRate < 1.5 ? 'vyššie potenie' : 'veľmi intenzívne potenie';
      var sodiumHtml = '';

      if (mode === 'unknown') {
        var sodiumLowMg = sweatLossL * 20 * 22.99;
        var sodiumHighMg = sweatLossL * 80 * 22.99;
        sodiumHtml = '<div class="mb-hy__metric"><p class="mb-hy__metric-label">Modelová strata sodíka</p><p class="mb-hy__metric-value">' + formatNumber(sodiumLowMg, 0) + '–' + formatNumber(sodiumHighMg, 0) + ' mg</p></div>';
      } else {
        var sodiumMgL = mode === 'mmol' ? sodiumValue * 22.99 : sodiumValue;
        var sodiumLossMg = sweatLossL * sodiumMgL;
        sodiumHtml = '<div class="mb-hy__metric"><p class="mb-hy__metric-label">Odhad straty sodíka</p><p class="mb-hy__metric-value">' + formatNumber(sodiumLossMg, 0) + ' mg</p></div>';
      }

      var overdrinkWarning = '';
      if (massChangePct > 0.2) {
        overdrinkWarning = '<div class="mb-hy__warning"><strong>Hmotnosť po aktivite je vyššia ako pred ňou.</strong> Môže to znamenať, že príjem tekutín prevýšil čistú stratu. Počas dlhšej aktivity nie je vhodné piť tak, aby hmotnosť rástla.</div>';
      } else if (massChangePct <= -2) {
        overdrinkWarning = '<div class="mb-hy__warning"><strong>Pokles hmotnosti dosiahol približne 2 % alebo viac.</strong> Výsledok je vhodné zohľadniť pri plánovaní pitia pre podobnú aktivitu a rovnaké podmienky.</div>';
      }

      sweatResult.innerHTML = [
        '<div class="mb-hy__result-top"><div><p class="mb-hy__result-label">Odhadovaná strata potením</p><p class="mb-hy__score">' + formatNumber(sweatLossL, 2) + ' l</p></div><span class="mb-hy__badge">' + rateLabel + '</span></div>',
        '<p class="mb-hy__summary">Výpočet vychádza zo zmeny hmotnosti upravenej o vypité tekutiny a prípadný moč. Test zopakujte pri rovnakom športe a podobnej teplote, pretože rýchlosť potenia sa medzi podmienkami výrazne mení.</p>',
        '<div class="mb-hy__metrics">',
        '<div class="mb-hy__metric"><p class="mb-hy__metric-label">Rýchlosť potenia</p><p class="mb-hy__metric-value">' + formatNumber(sweatRate, 2) + ' l/h</p></div>',
        '<div class="mb-hy__metric"><p class="mb-hy__metric-label">Zmena telesnej hmotnosti</p><p class="mb-hy__metric-value">' + formatNumber(massChangePct, 1) + ' %</p></div>',
        sodiumHtml,
        '</div>',
        '<div class="mb-hy__warning"><strong>Strata sodíka nie je automatickou dávkou na doplnenie.</strong> Potreba sodíka závisí aj od dĺžky aktivity, množstva vypitých tekutín, jedla a zdravotného stavu. Draslík, horčík a vápnik kalkulačka presne nepočíta, pretože ich nemožno spoľahlivo odvodiť iba z hmotnosti a dĺžky aktivity.</div>',
        overdrinkWarning
      ].join('');
      sweatResult.hidden = false;
    });

    root.querySelector('#mb-hy-sweat-reset').addEventListener('click', function () {
      sweatForm.reset();
      ['#mb-hy-pre','#mb-hy-post','#mb-hy-duration','#mb-hy-drink','#mb-hy-urine','#mb-hy-sodium-value'].forEach(function (selector) { root.querySelector(selector).value = ''; });
      sodiumMode.value = 'unknown';
      updateSodiumField();
      sweatResult.hidden = true;
      clearError(sweatError);
      root.querySelector('#mb-hy-pre').focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
