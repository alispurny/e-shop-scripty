/**
 * MyBears — zjednotená grafická verzia 2.0 (SK)
 * Vizuálny systém vychádza z MyBears Product Guide v1.8.
 * Funkčná logika pôvodného nástroja zostáva zachovaná.
 */
(function () {
  'use strict';

  var MYBEARS_UNIFIED_DESIGN_CSS = String.raw`
/* MyBears unified design layer — based on Product Guide v1.8 */
#mb-calorie-macro-calculator {
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
#mb-calorie-macro-calculator *, #mb-calorie-macro-calculator *::before, #mb-calorie-macro-calculator *::after { box-sizing:border-box; }
#mb-calorie-macro-calculator .mb-cm { position:relative; overflow:hidden; border:1px solid var(--mb-border) !important; border-radius:18px !important; background:#fff !important; box-shadow:0 12px 32px rgba(27,35,29,.07) !important; }
#mb-calorie-macro-calculator .mb-cm::before { content:""; position:absolute; z-index:3; top:0; left:0; right:0; height:4px; background:var(--mb-gold); }
#mb-calorie-macro-calculator .mb-cm__head { padding:34px 38px 26px !important; background:var(--mb-cream) !important; border-bottom:1px solid var(--mb-border) !important; }
#mb-calorie-macro-calculator .mb-cm__body { padding:30px 38px 36px !important; }
#mb-calorie-macro-calculator .mb-cm__title, #mb-calorie-macro-calculator .mb-cm__section-title, #mb-calorie-macro-calculator .mb-cm__panel-title, #mb-calorie-macro-calculator .mb-cm__subhead { color:var(--mb-green) !important; font-weight:700 !important; letter-spacing:-.01em; }
#mb-calorie-macro-calculator .mb-cm__title { margin:0 0 10px !important; font-size:clamp(25px,3.2vw,30px) !important; line-height:1.16 !important; }
#mb-calorie-macro-calculator .mb-cm__lead { max-width:820px; margin:0 !important; color:#454a45 !important; font-size:16px !important; line-height:1.58 !important; }
#mb-calorie-macro-calculator .mb-cm__notice { margin:0 0 22px !important; padding:15px 17px !important; border:1px solid #eadfc8 !important; border-left:4px solid var(--mb-gold) !important; border-radius:12px !important; background:var(--mb-cream) !important; color:#4f4b43 !important; font-size:14px !important; line-height:1.55 !important; }
#mb-calorie-macro-calculator .mb-cm__notice strong { color:#292b28; }
#mb-calorie-macro-calculator .mb-cm__grid { gap:18px !important; }
#mb-calorie-macro-calculator .mb-cm__field { min-width:0; }
#mb-calorie-macro-calculator .mb-cm__label { margin-bottom:7px !important; color:#292b28 !important; font-size:15px !important; font-weight:700 !important; }
#mb-calorie-macro-calculator .mb-cm__input, #mb-calorie-macro-calculator .mb-cm__select { min-height:48px !important; border:1px solid #d4d6d1 !important; border-radius:8px !important; background:#fff !important; color:var(--mb-text) !important; box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }
#mb-calorie-macro-calculator .mb-cm__input:hover, #mb-calorie-macro-calculator .mb-cm__select:hover { border-color:#aeb8b0 !important; }
#mb-calorie-macro-calculator .mb-cm__input:focus, #mb-calorie-macro-calculator .mb-cm__select:focus { outline:3px solid rgba(219,196,66,.30) !important; outline-offset:1px; border-color:var(--mb-green-dark) !important; }
#mb-calorie-macro-calculator .mb-cm__hint, #mb-calorie-macro-calculator .mb-cm__privacy, #mb-calorie-macro-calculator .mb-cm__formula, #mb-calorie-macro-calculator .mb-cm__disclaimer { color:var(--mb-muted) !important; }
#mb-calorie-macro-calculator .mb-cm__actions { gap:12px !important; margin-top:24px !important; }
#mb-calorie-macro-calculator .mb-cm__button { display:inline-flex; align-items:center; justify-content:center; min-height:48px !important; padding:12px 24px !important; border:2px solid transparent !important; border-radius:8px !important; font-weight:700 !important; line-height:1.15; transition:background .15s ease,border-color .15s ease,transform .15s ease; }
#mb-calorie-macro-calculator .mb-cm__button:hover { transform:translateY(-1px); }
#mb-calorie-macro-calculator .mb-cm__button:focus-visible, #mb-calorie-macro-calculator a:focus-visible, #mb-calorie-macro-calculator summary:focus-visible { outline:3px solid rgba(219,196,66,.38) !important; outline-offset:2px !important; }
#mb-calorie-macro-calculator .mb-cm__button--primary { min-width:210px; color:#fff !important; background:var(--mb-green) !important; border-color:var(--mb-green) !important; box-shadow:none !important; }
#mb-calorie-macro-calculator .mb-cm__button--primary:hover { background:var(--mb-green-dark) !important; border-color:var(--mb-green-dark) !important; }
#mb-calorie-macro-calculator .mb-cm__button--secondary { color:var(--mb-green-dark) !important; background:#fff !important; border-color:var(--mb-green) !important; }
#mb-calorie-macro-calculator .mb-cm__advanced, #mb-calorie-macro-calculator .mb-cm__panel, #mb-calorie-macro-calculator .mb-cm__mode, #mb-calorie-macro-calculator .mb-cm__tabs { border-color:var(--mb-border) !important; border-radius:12px !important; background:var(--mb-cream) !important; }
#mb-calorie-macro-calculator .mb-cm__tab, #mb-calorie-macro-calculator .mb-cm__mode-btn { border-radius:8px !important; color:var(--mb-green-dark) !important; }
#mb-calorie-macro-calculator .mb-cm__tab[aria-selected="true"], #mb-calorie-macro-calculator .mb-cm__mode-btn[aria-pressed="true"], #mb-calorie-macro-calculator .mb-cm__tab.is-active, #mb-calorie-macro-calculator .mb-cm__mode-btn.is-active { background:var(--mb-green) !important; color:#fff !important; border-color:var(--mb-green) !important; }
#mb-calorie-macro-calculator .mb-cm__result { margin-top:28px !important; padding:24px !important; border:1px solid #cfe4d5 !important; border-radius:16px !important; background:var(--mb-green-soft) !important; }
#mb-calorie-macro-calculator .mb-cm__score { color:#20221f !important; font-weight:800 !important; letter-spacing:-.035em; }
#mb-calorie-macro-calculator .mb-cm__badge { border:1px solid #d7ceb8 !important; background:#fff8df !important; color:#75633d !important; font-weight:700 !important; }
#mb-calorie-macro-calculator .mb-cm__summary { color:#454a45 !important; }
#mb-calorie-macro-calculator .mb-cm__metric, #mb-calorie-macro-calculator .mb-cm__card, #mb-calorie-macro-calculator .mb-cm__macro, #mb-calorie-macro-calculator .mb-cm__meal { border:1px solid var(--mb-border) !important; border-radius:12px !important; background:#fff !important; box-shadow:none !important; }
#mb-calorie-macro-calculator .mb-cm__metric-label, #mb-calorie-macro-calculator .mb-cm__card-label, #mb-calorie-macro-calculator .mb-cm__result-label { color:var(--mb-muted) !important; }
#mb-calorie-macro-calculator .mb-cm__metric-value, #mb-calorie-macro-calculator .mb-cm__card-value, #mb-calorie-macro-calculator .mb-cm__macro-value { color:var(--mb-green-dark) !important; }
#mb-calorie-macro-calculator .mb-cm__warning, #mb-calorie-macro-calculator .mb-cm__inline-warning { border-left:4px solid var(--mb-gold) !important; border-radius:8px !important; background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important; color:#5d4b1d !important; }
#mb-calorie-macro-calculator .mb-cm__error { border-color:#e3b3af !important; border-radius:10px !important; background:#fff5f4 !important; color:var(--mb-danger) !important; }
#mb-calorie-macro-calculator .mb-cm__scale { box-shadow:inset 0 0 0 1px rgba(32,34,31,.10); }
#mb-calorie-macro-calculator .mb-cm__marker { background:#20231f !important; box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(32,35,31,.18) !important; }
#mb-calorie-macro-calculator .mb-cm__table-wrap { overflow-x:auto; border:1px solid var(--mb-border) !important; border-radius:12px !important; }
#mb-calorie-macro-calculator .mb-cm__table { width:100%; border-collapse:collapse; background:#fff; }
#mb-calorie-macro-calculator .mb-cm__table thead th { border-bottom:2px solid var(--mb-gold) !important; background:#20231f !important; color:#fff !important; }
#mb-calorie-macro-calculator .mb-cm__table tbody tr:nth-child(even) { background:var(--mb-green-soft) !important; }
@media(max-width:760px) {
  #mb-calorie-macro-calculator { margin:18px auto 30px !important; }
  #mb-calorie-macro-calculator .mb-cm__head { padding:28px 20px 22px !important; }
  #mb-calorie-macro-calculator .mb-cm__body { padding:24px 20px 28px !important; }
  #mb-calorie-macro-calculator .mb-cm__result { padding:20px !important; }
  #mb-calorie-macro-calculator .mb-cm__actions { flex-direction:column; align-items:stretch; }
  #mb-calorie-macro-calculator .mb-cm__button { width:100%; }
}
@media(prefers-reduced-motion:reduce) {
  #mb-calorie-macro-calculator *, #mb-calorie-macro-calculator *::before, #mb-calorie-macro-calculator *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
`;


  var ROOT_ID = 'mb-calorie-macro-calculator';
  var STYLE_ID = 'mb-calorie-macro-calculator-styles';
  var SCRIPT_VERSION = '2.0.0-sk';

  function init() {
    var root = document.getElementById(ROOT_ID);

    if (!root || root.getAttribute('data-mb-version') === SCRIPT_VERSION) {
      return;
    }

    root.setAttribute('data-mb-ready', 'true');
    root.setAttribute('data-mb-version', SCRIPT_VERSION);

    function addStyles() {
      var oldStyle = document.getElementById(STYLE_ID);
      if (oldStyle && oldStyle.parentNode) {
        oldStyle.parentNode.removeChild(oldStyle);
      }

      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = [
        '#' + ROOT_ID + ' { --mb-green: #2dc26b; --mb-green-dark: #168947; --mb-green-soft: #f7fbf8; --mb-border: #d9e5dd; --mb-text: #1f2933; --mb-muted: #59636e; --mb-danger: #b42318; --mb-warning: #9a6700; --mb-warning-bg: #fff9e8; --mb-protein: #5b8def; --mb-fat: #f0ad4e; --mb-carbs: #54b979; font-family: Arial, Helvetica, sans-serif; color: var(--mb-text); margin: 24px 0; }',
        '#' + ROOT_ID + ' * { box-sizing: border-box; }',
        '#' + ROOT_ID + ' .mb-cm { border: 1px solid var(--mb-border); border-radius: 14px; background: #ffffff; box-shadow: 0 8px 28px rgba(31, 41, 51, 0.08); overflow: hidden; }',
        '#' + ROOT_ID + ' .mb-cm__head { padding: 22px 22px 16px; background: var(--mb-green-soft); border-bottom: 1px solid var(--mb-border); }',
        '#' + ROOT_ID + ' .mb-cm__title { margin: 0 0 8px; font-size: 22px; line-height: 1.25; }',
        '#' + ROOT_ID + ' .mb-cm__lead { margin: 0; color: var(--mb-muted); font-size: 16px; line-height: 1.55; }',
        '#' + ROOT_ID + ' .mb-cm__body { padding: 22px; }',
        '#' + ROOT_ID + ' .mb-cm__notice { margin: 0 0 18px; padding: 12px 14px; border-left: 4px solid var(--mb-green); border-radius: 6px; background: #f8faf9; color: var(--mb-muted); font-size: 14px; line-height: 1.5; }',
        '#' + ROOT_ID + ' .mb-cm__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }',
        '#' + ROOT_ID + ' .mb-cm__field { min-width: 0; }',
        '#' + ROOT_ID + ' .mb-cm__field--full { grid-column: 1 / -1; }',
        '#' + ROOT_ID + ' .mb-cm__label { display: block; margin: 0 0 7px; font-weight: 700; font-size: 15px; }',
        '#' + ROOT_ID + ' .mb-cm__input-wrap { position: relative; }',
        '#' + ROOT_ID + ' .mb-cm__input, #' + ROOT_ID + ' .mb-cm__select { width: 100%; min-height: 48px; padding: 11px 12px; border: 1px solid #b9c6be; border-radius: 8px; background: #ffffff; color: var(--mb-text); font: inherit; font-size: 16px; line-height: 1.3; }',
        '#' + ROOT_ID + ' .mb-cm__input { padding-right: 52px; }',
        '#' + ROOT_ID + ' .mb-cm__input:focus, #' + ROOT_ID + ' .mb-cm__select:focus { outline: 3px solid rgba(45, 194, 107, 0.2); border-color: var(--mb-green-dark); }',
        '#' + ROOT_ID + ' .mb-cm__unit { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--mb-muted); font-size: 14px; pointer-events: none; }',
        '#' + ROOT_ID + ' .mb-cm__hint { display: block; margin-top: 6px; color: var(--mb-muted); font-size: 13px; line-height: 1.4; }',
        '#' + ROOT_ID + ' .mb-cm__advanced { margin-top: 18px; border: 1px solid var(--mb-border); border-radius: 10px; background: #fbfcfb; }',
        '#' + ROOT_ID + ' .mb-cm__advanced summary { padding: 13px 15px; cursor: pointer; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-cm__advanced-body { padding: 2px 15px 16px; }',
        '#' + ROOT_ID + ' .mb-cm__error { display: none; margin: 16px 0 0; padding: 12px 14px; border: 1px solid #f1b5b0; border-radius: 8px; background: #fff6f5; color: var(--mb-danger); font-size: 14px; line-height: 1.45; }',
        '#' + ROOT_ID + ' .mb-cm__error.is-visible { display: block; }',
        '#' + ROOT_ID + ' .mb-cm__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }',
        '#' + ROOT_ID + ' .mb-cm__button { min-height: 46px; padding: 11px 20px; border-radius: 8px; border: 1px solid transparent; font: inherit; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease; }',
        '#' + ROOT_ID + ' .mb-cm__button:hover { transform: translateY(-1px); }',
        '#' + ROOT_ID + ' .mb-cm__button:focus-visible { outline: 3px solid rgba(45, 194, 107, 0.28); outline-offset: 2px; }',
        '#' + ROOT_ID + ' .mb-cm__button--primary { background: var(--mb-green); color: #0c2818; border-color: var(--mb-green); box-shadow: 0 4px 12px rgba(45, 194, 107, 0.22); }',
        '#' + ROOT_ID + ' .mb-cm__button--primary:hover { background: #28b862; }',
        '#' + ROOT_ID + ' .mb-cm__button--secondary { background: #ffffff; color: var(--mb-text); border-color: #b9c6be; }',
        '#' + ROOT_ID + ' .mb-cm__result { margin-top: 22px; padding: 20px; border: 1px solid #b8e7ca; border-radius: 12px; background: var(--mb-green-soft); }',
        '#' + ROOT_ID + ' .mb-cm__result[hidden] { display: none; }',
        '#' + ROOT_ID + ' .mb-cm__result-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }',
        '#' + ROOT_ID + ' .mb-cm__result-label { margin: 0 0 4px; color: var(--mb-muted); font-size: 14px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-cm__score-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }',
        '#' + ROOT_ID + ' .mb-cm__score { margin: 0; font-size: 42px; line-height: 1; font-weight: 800; letter-spacing: -0.03em; }',
        '#' + ROOT_ID + ' .mb-cm__score-unit { color: var(--mb-muted); font-size: 16px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-cm__method { display: inline-flex; align-items: center; min-height: 34px; padding: 6px 11px; border-radius: 999px; background: #ffffff; border: 1px solid #b9c6be; font-size: 14px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-cm__summary { margin: 14px 0 0; font-size: 15px; line-height: 1.55; }',
        '#' + ROOT_ID + ' .mb-cm__metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 18px; }',
        '#' + ROOT_ID + ' .mb-cm__metric { padding: 14px; border: 1px solid var(--mb-border); border-radius: 9px; background: #ffffff; }',
        '#' + ROOT_ID + ' .mb-cm__metric-label { margin: 0 0 7px; color: var(--mb-muted); font-size: 13px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-cm__metric-value { margin: 0; font-size: 18px; line-height: 1.25; font-weight: 800; }',
        '#' + ROOT_ID + ' .mb-cm__section-title { margin: 22px 0 12px; font-size: 17px; line-height: 1.3; }',
        '#' + ROOT_ID + ' .mb-cm__macros { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }',
        '#' + ROOT_ID + ' .mb-cm__macro { padding: 15px; border: 1px solid var(--mb-border); border-radius: 10px; background: #ffffff; }',
        '#' + ROOT_ID + ' .mb-cm__macro-top { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }',
        '#' + ROOT_ID + ' .mb-cm__dot { width: 11px; height: 11px; border-radius: 50%; flex: 0 0 11px; }',
        '#' + ROOT_ID + ' .mb-cm__dot--protein { background: var(--mb-protein); }',
        '#' + ROOT_ID + ' .mb-cm__dot--fat { background: var(--mb-fat); }',
        '#' + ROOT_ID + ' .mb-cm__dot--carbs { background: var(--mb-carbs); }',
        '#' + ROOT_ID + ' .mb-cm__macro-name { margin: 0; font-size: 14px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-cm__macro-value { margin: 0 0 5px; font-size: 25px; font-weight: 800; }',
        '#' + ROOT_ID + ' .mb-cm__macro-meta { margin: 0; color: var(--mb-muted); font-size: 13px; line-height: 1.45; }',
        '#' + ROOT_ID + ' .mb-cm__bar { display: flex; width: 100%; height: 18px; margin-top: 14px; overflow: hidden; border-radius: 999px; background: #e7ece9; }',
        '#' + ROOT_ID + ' .mb-cm__bar-part { min-width: 0; }',
        '#' + ROOT_ID + ' .mb-cm__bar-protein { background: var(--mb-protein); }',
        '#' + ROOT_ID + ' .mb-cm__bar-fat { background: var(--mb-fat); }',
        '#' + ROOT_ID + ' .mb-cm__bar-carbs { background: var(--mb-carbs); }',
        '#' + ROOT_ID + ' .mb-cm__meal { margin-top: 16px; padding: 14px; border: 1px solid var(--mb-border); border-radius: 9px; background: #ffffff; font-size: 14px; line-height: 1.55; }',
        '#' + ROOT_ID + ' .mb-cm__formula { margin: 16px 0 0; color: var(--mb-muted); font-size: 13px; line-height: 1.55; }',
        '#' + ROOT_ID + ' .mb-cm__warnings { margin-top: 16px; }',
        '#' + ROOT_ID + ' .mb-cm__warning { margin: 8px 0 0; padding: 11px 13px; border-left: 4px solid #e7b545; border-radius: 6px; background: var(--mb-warning-bg); color: #674b00; font-size: 13px; line-height: 1.5; }',
        '#' + ROOT_ID + ' .mb-cm__disclaimer { margin: 16px 0 0; padding-top: 14px; border-top: 1px solid #cfe4d7; color: var(--mb-muted); font-size: 13px; line-height: 1.5; }',
        '#' + ROOT_ID + ' .mb-cm__privacy { margin: 14px 0 0; color: var(--mb-muted); font-size: 12px; line-height: 1.45; }',
        '@media (max-width: 900px) { #' + ROOT_ID + ' .mb-cm__metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } }',
        '@media (max-width: 700px) { #' + ROOT_ID + ' .mb-cm__grid, #' + ROOT_ID + ' .mb-cm__macros { grid-template-columns: 1fr; } #' + ROOT_ID + ' .mb-cm__field--full { grid-column: auto; } #' + ROOT_ID + ' .mb-cm__head, #' + ROOT_ID + ' .mb-cm__body { padding-left: 16px; padding-right: 16px; } #' + ROOT_ID + ' .mb-cm__score { font-size: 36px; } }',
        '@media (max-width: 460px) { #' + ROOT_ID + ' .mb-cm__metrics { grid-template-columns: 1fr; } #' + ROOT_ID + ' .mb-cm__button { width: 100%; } }'
      ].join('\n');
      style.textContent += MYBEARS_UNIFIED_DESIGN_CSS;
    document.head.appendChild(style);
    }

    function parseNumber(value) {
      if (typeof value !== 'string') {
        return NaN;
      }
      return Number(value.trim().replace(',', '.'));
    }

    function formatNumber(value, digits) {
      return new Intl.NumberFormat('sk-SK', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }).format(value);
    }

    function formatInteger(value) {
      return new Intl.NumberFormat('sk-SK', {
        maximumFractionDigits: 0
      }).format(Math.round(value));
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    addStyles();

    root.innerHTML = [
      '<section class="mb-cm" aria-labelledby="mb-cm-title">',
      '  <div class="mb-cm__head">',
      '    <h2 class="mb-cm__title" id="mb-cm-title">Kalkulačka kalórií a makroživín</h2>',
      '    <p class="mb-cm__lead">Odhadnite denný energetický príjem podľa cieľa a rozdeľte ho na bielkoviny, tuky a sacharidy.</p>',
      '  </div>',
      '  <div class="mb-cm__body">',
      '    <p class="mb-cm__notice"><strong>Dôležité:</strong> Výsledok je modelový odhad pre zdravých dospelých od 18 rokov. Nejde o liečebný jedálniček ani individuálne výživové odporúčanie.</p>',
      '    <form id="mb-cm-form" novalidate>',
      '      <div class="mb-cm__grid">',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-sex">Variant rovnice</label>',
      '          <select class="mb-cm__select" id="mb-cm-sex">',
      '            <option value="female">Žena</option>',
      '            <option value="male">Muž</option>',
      '          </select>',
      '          <span class="mb-cm__hint">Rovnica Mifflin–St Jeor používa dve rozdielne konštanty.</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-age">Vek</label>',
      '          <div class="mb-cm__input-wrap"><input class="mb-cm__input" id="mb-cm-age" inputmode="numeric" autocomplete="off" value="35" aria-describedby="mb-cm-age-hint"><span class="mb-cm__unit">rokov</span></div>',
      '          <span class="mb-cm__hint" id="mb-cm-age-hint">Povolené rozmedzie: 18–100 rokov</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-height">Výška</label>',
      '          <div class="mb-cm__input-wrap"><input class="mb-cm__input" id="mb-cm-height" inputmode="decimal" autocomplete="off" value="165" aria-describedby="mb-cm-height-hint"><span class="mb-cm__unit">cm</span></div>',
      '          <span class="mb-cm__hint" id="mb-cm-height-hint">Povolené rozmedzie: 100–250 cm</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-weight">Hmotnosť</label>',
      '          <div class="mb-cm__input-wrap"><input class="mb-cm__input" id="mb-cm-weight" inputmode="decimal" autocomplete="off" value="65" aria-describedby="mb-cm-weight-hint"><span class="mb-cm__unit">kg</span></div>',
      '          <span class="mb-cm__hint" id="mb-cm-weight-hint">Povolené rozmedzie: 30–400 kg</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-activity">Úroveň aktivity (PAL)</label>',
      '          <select class="mb-cm__select" id="mb-cm-activity">',
      '            <option value="1.4">Nízka aktivita (PAL 1,4)</option>',
      '            <option value="1.6" selected>Stredná aktivita (PAL 1,6)</option>',
      '            <option value="1.8">Vysoká aktivita (PAL 1,8)</option>',
      '            <option value="2.0">Veľmi vysoká aktivita (PAL 2,0)</option>',
      '          </select>',
      '          <span class="mb-cm__hint">PAL je zjednodušený odhad celodennej pohybovej aktivity.</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-goal">Cieľ</label>',
      '          <select class="mb-cm__select" id="mb-cm-goal">',
      '            <option value="loss">Znižšienie hmotnosti</option>',
      '            <option value="maintain" selected>Udržanie hmotnosti</option>',
      '            <option value="gain">Zvyššienie hmotnosti</option>',
      '          </select>',
      '          <span class="mb-cm__hint">Cieľ upravuje vypočítané TDEE o zvolené percento.</span>',
      '        </div>',
      '        <div class="mb-cm__field mb-cm__field--full">',
      '          <label class="mb-cm__label" for="mb-cm-rate">Modelová úprava oproti TDEE</label>',
      '          <select class="mb-cm__select" id="mb-cm-rate"></select>',
      '          <span class="mb-cm__hint">Percento je výpočtový scenár, nie záruka konkrétnej zmeny hmotnosti.</span>',
      '        </div>',
      '      </div>',
      '      <details class="mb-cm__advanced">',
      '        <summary>Pokročilé nastavenie makroživín</summary>',
      '        <div class="mb-cm__advanced-body">',
      '          <div class="mb-cm__grid">',
      '            <div class="mb-cm__field">',
      '              <label class="mb-cm__label" for="mb-cm-protein">Bielkoviny na kg hmotnosti</label>',
      '              <select class="mb-cm__select" id="mb-cm-protein">',
      '                <option value="0.83">0,83 g/kg – referenčný príjem EFSA</option>',
      '                <option value="1.2">1,2 g/kg – zvyššiený príjem</option>',
      '                <option value="1.6" selected>1,6 g/kg – aktívny alebo redukčný režim</option>',
      '                <option value="2.0">2,0 g/kg – vysoký príjem</option>',
      '              </select>',
      '              <span class="mb-cm__hint">Výpočet používa aktuálnu hmotnosť, nie cieľovú hmotnosť.</span>',
      '            </div>',
      '            <div class="mb-cm__field">',
      '              <label class="mb-cm__label" for="mb-cm-fat">Podiel energie z tukov</label>',
      '              <select class="mb-cm__select" id="mb-cm-fat">',
      '                <option value="20">20 %</option>',
      '                <option value="25">25 %</option>',
      '                <option value="30" selected>30 %</option>',
      '                <option value="35">35 %</option>',
      '              </select>',
      '              <span class="mb-cm__hint">EFSA uvádza pre dospelých referenčné rozmedzie 20–35 % energie.</span>',
      '            </div>',
      '            <div class="mb-cm__field mb-cm__field--full">',
      '              <label class="mb-cm__label" for="mb-cm-meals">Počet jedál na orientačné rozdelenie</label>',
      '              <select class="mb-cm__select" id="mb-cm-meals">',
      '                <option value="3">3 jedlá</option>',
      '                <option value="4" selected>4 jedlá</option>',
      '                <option value="5">5 jedál</option>',
      '                <option value="6">6 jedál</option>',
      '              </select>',
      '            </div>',
      '          </div>',
      '        </div>',
      '      </details>',
      '      <div class="mb-cm__actions">',
      '        <button class="mb-cm__button mb-cm__button--primary" type="submit">Vypočítať príjem a makroživiny</button>',
      '        <button class="mb-cm__button mb-cm__button--secondary" type="button" id="mb-cm-reset">Vymazať údaje</button>',
      '      </div>',
      '      <div class="mb-cm__error" id="mb-cm-error" role="alert"></div>',
      '    </form>',
      '    <section class="mb-cm__result" id="mb-cm-result" aria-live="polite" hidden>',
      '      <div class="mb-cm__result-top">',
      '        <div>',
      '          <p class="mb-cm__result-label">Orientačný denný energetický príjem podľa cieľa</p>',
      '          <div class="mb-cm__score-row"><p class="mb-cm__score" id="mb-cm-target">0</p><span class="mb-cm__score-unit">kcal / deň</span></div>',
      '        </div>',
      '        <span class="mb-cm__method" id="mb-cm-method">Udržanie hmotnosti</span>',
      '      </div>',
      '      <p class="mb-cm__summary" id="mb-cm-summary"></p>',
      '      <div class="mb-cm__metrics">',
      '        <div class="mb-cm__metric"><p class="mb-cm__metric-label">Pokojový výdaj (REE)</p><p class="mb-cm__metric-value" id="mb-cm-bmr">0 kcal</p></div>',
      '        <div class="mb-cm__metric"><p class="mb-cm__metric-label">Odhad TDEE</p><p class="mb-cm__metric-value" id="mb-cm-tdee">0 kcal</p></div>',
      '        <div class="mb-cm__metric"><p class="mb-cm__metric-label">Rozdiel oproti TDEE</p><p class="mb-cm__metric-value" id="mb-cm-difference">0 kcal</p></div>',
      '        <div class="mb-cm__metric"><p class="mb-cm__metric-label">Energia v kJ</p><p class="mb-cm__metric-value" id="mb-cm-kj">0 kJ</p></div>',
      '      </div>',
      '      <h3 class="mb-cm__section-title">Orientačné rozdelenie makroživín</h3>',
      '      <div class="mb-cm__macros">',
      '        <div class="mb-cm__macro"><div class="mb-cm__macro-top"><span class="mb-cm__dot mb-cm__dot--protein"></span><p class="mb-cm__macro-name">Bielkoviny</p></div><p class="mb-cm__macro-value" id="mb-cm-protein-value">0 g</p><p class="mb-cm__macro-meta" id="mb-cm-protein-meta"></p></div>',
      '        <div class="mb-cm__macro"><div class="mb-cm__macro-top"><span class="mb-cm__dot mb-cm__dot--fat"></span><p class="mb-cm__macro-name">Tuky</p></div><p class="mb-cm__macro-value" id="mb-cm-fat-value">0 g</p><p class="mb-cm__macro-meta" id="mb-cm-fat-meta"></p></div>',
      '        <div class="mb-cm__macro"><div class="mb-cm__macro-top"><span class="mb-cm__dot mb-cm__dot--carbs"></span><p class="mb-cm__macro-name">Sacharidy</p></div><p class="mb-cm__macro-value" id="mb-cm-carbs-value">0 g</p><p class="mb-cm__macro-meta" id="mb-cm-carbs-meta"></p></div>',
      '      </div>',
      '      <div class="mb-cm__bar" aria-label="Podiel energie z bielkovín, tukov a sacharidov">',
      '        <span class="mb-cm__bar-part mb-cm__bar-protein" id="mb-cm-bar-protein"></span>',
      '        <span class="mb-cm__bar-part mb-cm__bar-fat" id="mb-cm-bar-fat"></span>',
      '        <span class="mb-cm__bar-part mb-cm__bar-carbs" id="mb-cm-bar-carbs"></span>',
      '      </div>',
      '      <div class="mb-cm__meal" id="mb-cm-meal"></div>',
      '      <p class="mb-cm__formula" id="mb-cm-formula"></p>',
      '      <div class="mb-cm__warnings" id="mb-cm-warnings"></div>',
      '      <p class="mb-cm__disclaimer"><strong>Výsledok je orientačný.</strong> Skutočnú potrebu ovplyvňuje telesné zloženie, spontánny pohyb, intenzita tréningu, zdravotný stav, spánok, liečba aj dlhodobá adaptácia organizmu.</p>',
      '    </section>',
      '    <p class="mb-cm__privacy">Výpočet prebieha iba vo vašom prehliadači. Zadané údaje tento skript nikam neodosiela ani neukladá.</p>',
      '  </div>',
      '</section>'
    ].join('');

    var form = root.querySelector('#mb-cm-form');
    var goalInput = root.querySelector('#mb-cm-goal');
    var rateInput = root.querySelector('#mb-cm-rate');
    var errorBox = root.querySelector('#mb-cm-error');
    var resultBox = root.querySelector('#mb-cm-result');

    var rateOptions = {
      loss: [
        { value: '-0.10', label: 'Mierny deficit −10 %' },
        { value: '-0.15', label: 'Stredný deficit −15 %', selected: true },
        { value: '-0.20', label: 'Vyšší deficit −20 %' }
      ],
      maintain: [
        { value: '0', label: 'Bez úpravy – 100 % odhadovaného TDEE', selected: true }
      ],
      gain: [
        { value: '0.05', label: 'Mierny nadbytok +5 %', selected: true },
        { value: '0.10', label: 'Stredný nadbytok +10 %' },
        { value: '0.15', label: 'Vyšší nadbytok +15 %' }
      ]
    };

    function updateRateOptions() {
      var options = rateOptions[goalInput.value] || rateOptions.maintain;
      rateInput.innerHTML = options.map(function (item) {
        return '<option value="' + item.value + '"' + (item.selected ? ' selected' : '') + '>' + escapeHtml(item.label) + '</option>';
      }).join('');
    }

    function showError(messages) {
      errorBox.innerHTML = messages.map(function (message) {
        return '<div>' + escapeHtml(message) + '</div>';
      }).join('');
      errorBox.classList.add('is-visible');
      resultBox.hidden = true;
    }

    function clearError() {
      errorBox.textContent = '';
      errorBox.classList.remove('is-visible');
    }

    function getGoalLabel(goal, delta) {
      if (goal === 'loss') {
        return 'Znižšienie hmotnosti ' + Math.abs(Math.round(delta * 100)) + ' % pod TDEE';
      }
      if (goal === 'gain') {
        return 'Zvyššienie hmotnosti ' + Math.round(delta * 100) + ' % nad TDEE';
      }
      return 'Udržanie hmotnosti';
    }

    function calculate(event) {
      if (event) {
        event.preventDefault();
      }

      clearError();

      var sex = root.querySelector('#mb-cm-sex').value;
      var age = parseNumber(root.querySelector('#mb-cm-age').value);
      var height = parseNumber(root.querySelector('#mb-cm-height').value);
      var weight = parseNumber(root.querySelector('#mb-cm-weight').value);
      var pal = parseNumber(root.querySelector('#mb-cm-activity').value);
      var goal = goalInput.value;
      var delta = parseNumber(rateInput.value);
      var proteinPerKg = parseNumber(root.querySelector('#mb-cm-protein').value);
      var fatPercent = parseNumber(root.querySelector('#mb-cm-fat').value);
      var meals = parseNumber(root.querySelector('#mb-cm-meals').value);
      var errors = [];

      if (!Number.isFinite(age) || age < 18 || age > 100) {
        errors.push('Zadajte vek v rozmedzí 18 až 100 rokov.');
      }
      if (!Number.isFinite(height) || height < 100 || height > 250) {
        errors.push('Zadajte výšku v rozmedzí 100 až 250 cm.');
      }
      if (!Number.isFinite(weight) || weight < 30 || weight > 400) {
        errors.push('Zadajte hmotnosť v rozmedzí 30 až 400 kg.');
      }
      if (!Number.isFinite(pal) || pal < 1.2 || pal > 2.5) {
        errors.push('Vyberte platnú úroveň aktivity.');
      }
      if (!Number.isFinite(delta) || delta < -0.5 || delta > 0.5) {
        errors.push('Vyberte platnú modelovú úpravu príjmu.');
      }
      if (!Number.isFinite(proteinPerKg) || proteinPerKg < 0.5 || proteinPerKg > 3.0) {
        errors.push('Vyberte platné množstvo bielkovín.');
      }
      if (!Number.isFinite(fatPercent) || fatPercent < 15 || fatPercent > 45) {
        errors.push('Vyberte platný podiel tukov.');
      }

      if (errors.length) {
        showError(errors);
        return;
      }

      var constant = sex === 'male' ? 5 : -161;
      var ree = (10 * weight) + (6.25 * height) - (5 * age) + constant;
      var tdee = ree * pal;
      var target = tdee * (1 + delta);
      var proteinGrams = weight * proteinPerKg;
      var proteinCalories = proteinGrams * 4;
      var fatCalories = target * (fatPercent / 100);
      var fatGrams = fatCalories / 9;
      var carbsCalories = target - proteinCalories - fatCalories;

      if (carbsCalories <= 0) {
        showError(['Zvolená kombinácia energetického príjmu, bielkovín a tukov nenecháva priestor pre sacharidy. Znížte množstvo bielkovín alebo tukov, prípadne zvoľte vyšší energetický príjem.']);
        return;
      }

      var carbsGrams = carbsCalories / 4;
      var proteinPercent = (proteinCalories / target) * 100;
      var carbsPercent = (carbsCalories / target) * 100;
      var targetKj = target * 4.184;
      var difference = target - tdee;
      var bmi = weight / Math.pow(height / 100, 2);
      var warnings = [];

      if (target < ree) {
        warnings.push('Vypočítaný príjem je nižší ako odhadovaný pokojový výdaj. BMR nie je pevná bezpečnostná hranica, ale takéto nastavenie je vhodné posúdiť individuálne s odborníkom.');
      }
      if (carbsPercent < 45 || carbsPercent > 60) {
        warnings.push('Sacharidy tvoria približne ' + formatNumber(carbsPercent, 0) + ' % energie. To je mimo referenčného rozmedzia EFSA 45–60 %; výsledok vznikol z vami zvoleného množstva bielkovín a tukov.');
      }
      if (bmi >= 30 && proteinPerKg > 1.2) {
        warnings.push('Pri vyššom BMI môže výpočet bielkovín z aktuálnej hmotnosti poskytovať vysokú hodnotu. Vhodný základ výpočtu možno individualizovať podľa telesného zloženia a zdravotného stavu.');
      }
      if (carbsGrams < 50) {
        warnings.push('Výsledné množstvo sacharidov je veľmi nízke. Takéto rozdelenie nie je vhodné automaticky používať bez posúdenia celého jedálnička a zdravotného stavu.');
      }

      root.querySelector('#mb-cm-target').textContent = formatInteger(target);
      root.querySelector('#mb-cm-method').textContent = getGoalLabel(goal, delta);
      root.querySelector('#mb-cm-summary').textContent = goal === 'maintain'
        ? 'Modelový príjem zodpovedá vypočítanému TDEE. Skutočný udržiavací príjem sa môže od odhadu líšiť a overuje sa podľa dlhodobého vývoja hmotnosti a ďalších ukazovateľov.'
        : 'Modelový príjem je nastavený o ' + Math.abs(Math.round(delta * 100)) + ' % ' + (delta < 0 ? 'nižšie' : 'vyššie') + ' ako vypočítané TDEE. Výsledok nezaručuje konkrétnu rýchlosť zmeny hmotnosti.';
      root.querySelector('#mb-cm-bmr').textContent = formatInteger(ree) + ' kcal';
      root.querySelector('#mb-cm-tdee').textContent = formatInteger(tdee) + ' kcal';
      root.querySelector('#mb-cm-difference').textContent = (difference > 0 ? '+' : '') + formatInteger(difference) + ' kcal';
      root.querySelector('#mb-cm-kj').textContent = formatInteger(targetKj) + ' kJ';

      root.querySelector('#mb-cm-protein-value').textContent = formatNumber(proteinGrams, 1) + ' g';
      root.querySelector('#mb-cm-protein-meta').textContent = formatInteger(proteinCalories) + ' kcal · ' + formatNumber(proteinPercent, 0) + ' % energie · ' + formatNumber(proteinPerKg, proteinPerKg === 0.83 ? 2 : 1) + ' g/kg';
      root.querySelector('#mb-cm-fat-value').textContent = formatNumber(fatGrams, 1) + ' g';
      root.querySelector('#mb-cm-fat-meta').textContent = formatInteger(fatCalories) + ' kcal · ' + formatNumber(fatPercent, 0) + ' % energie';
      root.querySelector('#mb-cm-carbs-value').textContent = formatNumber(carbsGrams, 1) + ' g';
      root.querySelector('#mb-cm-carbs-meta').textContent = formatInteger(carbsCalories) + ' kcal · ' + formatNumber(carbsPercent, 0) + ' % energie';

      root.querySelector('#mb-cm-bar-protein').style.width = Math.max(0, proteinPercent) + '%';
      root.querySelector('#mb-cm-bar-fat').style.width = Math.max(0, fatPercent) + '%';
      root.querySelector('#mb-cm-bar-carbs').style.width = Math.max(0, carbsPercent) + '%';

      root.querySelector('#mb-cm-meal').innerHTML = '<strong>Orientačný priemer na jedno z ' + meals + ' jedál:</strong> ' +
        formatInteger(target / meals) + ' kcal, ' +
        formatNumber(proteinGrams / meals, 1) + ' g bielkovín, ' +
        formatNumber(fatGrams / meals, 1) + ' g tukov a ' +
        formatNumber(carbsGrams / meals, 1) + ' g sacharidov. Reálne jedlá nemusia byť rozdelené rovnomerne.';

      root.querySelector('#mb-cm-formula').textContent = 'Výpočet: REE ' + formatInteger(ree) + ' kcal × PAL ' + formatNumber(pal, 1) + ' = TDEE ' + formatInteger(tdee) + ' kcal; cieľ ' + (delta >= 0 ? '+' : '') + formatNumber(delta * 100, 0) + ' % = ' + formatInteger(target) + ' kcal. Bielkoviny majú 4 kcal/g, tuky 9 kcal/g a sacharidy 4 kcal/g.';

      root.querySelector('#mb-cm-warnings').innerHTML = warnings.map(function (warning) {
        return '<p class="mb-cm__warning"><strong>Upozornenie:</strong> ' + escapeHtml(warning) + '</p>';
      }).join('');

      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function resetForm() {
      form.reset();
      updateRateOptions();
      clearError();
      resultBox.hidden = true;
      root.querySelector('#mb-cm-age').focus();
    }

    goalInput.addEventListener('change', updateRateOptions);
    form.addEventListener('submit', calculate);
    root.querySelector('#mb-cm-reset').addEventListener('click', resetForm);

    updateRateOptions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
