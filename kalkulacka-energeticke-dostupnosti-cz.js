/**
 * MyBears — sjednocená grafická verze 2.0 (CZ)
 * Vizuální systém vychází z MyBears Product Guide v1.8.
 * Funkční logika původního nástroje zůstává zachována.
 */
(function () {
  'use strict';

  var MYBEARS_UNIFIED_DESIGN_CSS = String.raw`
/* MyBears unified design layer — based on Product Guide v1.8 */
#mb-energy-availability-calculator {
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
#mb-energy-availability-calculator *, #mb-energy-availability-calculator *::before, #mb-energy-availability-calculator *::after { box-sizing:border-box; }
#mb-energy-availability-calculator .mb-ea { position:relative; overflow:hidden; border:1px solid var(--mb-border) !important; border-radius:18px !important; background:#fff !important; box-shadow:0 12px 32px rgba(27,35,29,.07) !important; }
#mb-energy-availability-calculator .mb-ea::before { content:""; position:absolute; z-index:3; top:0; left:0; right:0; height:4px; background:var(--mb-gold); }
#mb-energy-availability-calculator .mb-ea__head { padding:34px 38px 26px !important; background:var(--mb-cream) !important; border-bottom:1px solid var(--mb-border) !important; }
#mb-energy-availability-calculator .mb-ea__body { padding:30px 38px 36px !important; }
#mb-energy-availability-calculator .mb-ea__title, #mb-energy-availability-calculator .mb-ea__section-title, #mb-energy-availability-calculator .mb-ea__panel-title, #mb-energy-availability-calculator .mb-ea__subhead { color:var(--mb-green) !important; font-weight:700 !important; letter-spacing:-.01em; }
#mb-energy-availability-calculator .mb-ea__title { margin:0 0 10px !important; font-size:clamp(25px,3.2vw,30px) !important; line-height:1.16 !important; }
#mb-energy-availability-calculator .mb-ea__lead { max-width:820px; margin:0 !important; color:#454a45 !important; font-size:16px !important; line-height:1.58 !important; }
#mb-energy-availability-calculator .mb-ea__notice { margin:0 0 22px !important; padding:15px 17px !important; border:1px solid #eadfc8 !important; border-left:4px solid var(--mb-gold) !important; border-radius:12px !important; background:var(--mb-cream) !important; color:#4f4b43 !important; font-size:14px !important; line-height:1.55 !important; }
#mb-energy-availability-calculator .mb-ea__notice strong { color:#292b28; }
#mb-energy-availability-calculator .mb-ea__grid { gap:18px !important; }
#mb-energy-availability-calculator .mb-ea__field { min-width:0; }
#mb-energy-availability-calculator .mb-ea__label { margin-bottom:7px !important; color:#292b28 !important; font-size:15px !important; font-weight:700 !important; }
#mb-energy-availability-calculator .mb-ea__input, #mb-energy-availability-calculator .mb-ea__select { min-height:48px !important; border:1px solid #d4d6d1 !important; border-radius:8px !important; background:#fff !important; color:var(--mb-text) !important; box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }
#mb-energy-availability-calculator .mb-ea__input:hover, #mb-energy-availability-calculator .mb-ea__select:hover { border-color:#aeb8b0 !important; }
#mb-energy-availability-calculator .mb-ea__input:focus, #mb-energy-availability-calculator .mb-ea__select:focus { outline:3px solid rgba(219,196,66,.30) !important; outline-offset:1px; border-color:var(--mb-green-dark) !important; }
#mb-energy-availability-calculator .mb-ea__hint, #mb-energy-availability-calculator .mb-ea__privacy, #mb-energy-availability-calculator .mb-ea__formula, #mb-energy-availability-calculator .mb-ea__disclaimer { color:var(--mb-muted) !important; }
#mb-energy-availability-calculator .mb-ea__actions { gap:12px !important; margin-top:24px !important; }
#mb-energy-availability-calculator .mb-ea__button { display:inline-flex; align-items:center; justify-content:center; min-height:48px !important; padding:12px 24px !important; border:2px solid transparent !important; border-radius:8px !important; font-weight:700 !important; line-height:1.15; transition:background .15s ease,border-color .15s ease,transform .15s ease; }
#mb-energy-availability-calculator .mb-ea__button:hover { transform:translateY(-1px); }
#mb-energy-availability-calculator .mb-ea__button:focus-visible, #mb-energy-availability-calculator a:focus-visible, #mb-energy-availability-calculator summary:focus-visible { outline:3px solid rgba(219,196,66,.38) !important; outline-offset:2px !important; }
#mb-energy-availability-calculator .mb-ea__button--primary { min-width:210px; color:#fff !important; background:var(--mb-green) !important; border-color:var(--mb-green) !important; box-shadow:none !important; }
#mb-energy-availability-calculator .mb-ea__button--primary:hover { background:var(--mb-green-dark) !important; border-color:var(--mb-green-dark) !important; }
#mb-energy-availability-calculator .mb-ea__button--secondary { color:var(--mb-green-dark) !important; background:#fff !important; border-color:var(--mb-green) !important; }
#mb-energy-availability-calculator .mb-ea__advanced, #mb-energy-availability-calculator .mb-ea__panel, #mb-energy-availability-calculator .mb-ea__mode, #mb-energy-availability-calculator .mb-ea__tabs { border-color:var(--mb-border) !important; border-radius:12px !important; background:var(--mb-cream) !important; }
#mb-energy-availability-calculator .mb-ea__tab, #mb-energy-availability-calculator .mb-ea__mode-btn { border-radius:8px !important; color:var(--mb-green-dark) !important; }
#mb-energy-availability-calculator .mb-ea__tab[aria-selected="true"], #mb-energy-availability-calculator .mb-ea__mode-btn[aria-pressed="true"], #mb-energy-availability-calculator .mb-ea__tab.is-active, #mb-energy-availability-calculator .mb-ea__mode-btn.is-active { background:var(--mb-green) !important; color:#fff !important; border-color:var(--mb-green) !important; }
#mb-energy-availability-calculator .mb-ea__result { margin-top:28px !important; padding:24px !important; border:1px solid #cfe4d5 !important; border-radius:16px !important; background:var(--mb-green-soft) !important; }
#mb-energy-availability-calculator .mb-ea__score { color:#20221f !important; font-weight:800 !important; letter-spacing:-.035em; }
#mb-energy-availability-calculator .mb-ea__badge { border:1px solid #d7ceb8 !important; background:#fff8df !important; color:#75633d !important; font-weight:700 !important; }
#mb-energy-availability-calculator .mb-ea__summary { color:#454a45 !important; }
#mb-energy-availability-calculator .mb-ea__metric, #mb-energy-availability-calculator .mb-ea__card, #mb-energy-availability-calculator .mb-ea__macro, #mb-energy-availability-calculator .mb-ea__meal { border:1px solid var(--mb-border) !important; border-radius:12px !important; background:#fff !important; box-shadow:none !important; }
#mb-energy-availability-calculator .mb-ea__metric-label, #mb-energy-availability-calculator .mb-ea__card-label, #mb-energy-availability-calculator .mb-ea__result-label { color:var(--mb-muted) !important; }
#mb-energy-availability-calculator .mb-ea__metric-value, #mb-energy-availability-calculator .mb-ea__card-value, #mb-energy-availability-calculator .mb-ea__macro-value { color:var(--mb-green-dark) !important; }
#mb-energy-availability-calculator .mb-ea__warning, #mb-energy-availability-calculator .mb-ea__inline-warning { border-left:4px solid var(--mb-gold) !important; border-radius:8px !important; background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important; color:#5d4b1d !important; }
#mb-energy-availability-calculator .mb-ea__error { border-color:#e3b3af !important; border-radius:10px !important; background:#fff5f4 !important; color:var(--mb-danger) !important; }
#mb-energy-availability-calculator .mb-ea__scale { box-shadow:inset 0 0 0 1px rgba(32,34,31,.10); }
#mb-energy-availability-calculator .mb-ea__marker { background:#20231f !important; box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(32,35,31,.18) !important; }
#mb-energy-availability-calculator .mb-ea__table-wrap { overflow-x:auto; border:1px solid var(--mb-border) !important; border-radius:12px !important; }
#mb-energy-availability-calculator .mb-ea__table { width:100%; border-collapse:collapse; background:#fff; }
#mb-energy-availability-calculator .mb-ea__table thead th { border-bottom:2px solid var(--mb-gold) !important; background:#20231f !important; color:#fff !important; }
#mb-energy-availability-calculator .mb-ea__table tbody tr:nth-child(even) { background:var(--mb-green-soft) !important; }
@media(max-width:760px) {
  #mb-energy-availability-calculator { margin:18px auto 30px !important; }
  #mb-energy-availability-calculator .mb-ea__head { padding:28px 20px 22px !important; }
  #mb-energy-availability-calculator .mb-ea__body { padding:24px 20px 28px !important; }
  #mb-energy-availability-calculator .mb-ea__result { padding:20px !important; }
  #mb-energy-availability-calculator .mb-ea__actions { flex-direction:column; align-items:stretch; }
  #mb-energy-availability-calculator .mb-ea__button { width:100%; }
}
@media(prefers-reduced-motion:reduce) {
  #mb-energy-availability-calculator *, #mb-energy-availability-calculator *::before, #mb-energy-availability-calculator *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
`;


  var ROOT_ID = 'mb-energy-availability-calculator';
  var STYLE_ID = 'mb-energy-availability-calculator-styles';
  var VERSION = '2.0.0-cz';

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    return Number(value.trim().replace(',', '.'));
  }

  function format(value, decimals) {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function addStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '#' + ROOT_ID + ' { --mb-green:#2dc26b; --mb-green-dark:#168947; --mb-green-soft:#f7fbf8; --mb-border:#d9e5dd; --mb-text:#1f2933; --mb-muted:#59636e; --mb-danger:#b42318; --mb-warning:#9a6700; --mb-warning-bg:#fff8e1; --mb-blue:#2674a8; font-family:Arial,Helvetica,sans-serif; color:var(--mb-text); margin:24px 0; }',
      '#' + ROOT_ID + ' * { box-sizing:border-box; }',
      '#' + ROOT_ID + ' .mb-ea { border:1px solid var(--mb-border); border-radius:14px; background:#fff; box-shadow:0 8px 28px rgba(31,41,51,.08); overflow:hidden; }',
      '#' + ROOT_ID + ' .mb-ea__head { padding:22px 22px 16px; background:var(--mb-green-soft); border-bottom:1px solid var(--mb-border); }',
      '#' + ROOT_ID + ' .mb-ea__title { margin:0 0 8px; font-size:22px; line-height:1.25; }',
      '#' + ROOT_ID + ' .mb-ea__lead { margin:0; color:var(--mb-muted); font-size:16px; line-height:1.55; }',
      '#' + ROOT_ID + ' .mb-ea__body { padding:22px; }',
      '#' + ROOT_ID + ' .mb-ea__notice { margin:0 0 18px; padding:12px 14px; border-left:4px solid var(--mb-green); border-radius:6px; background:#f8faf9; color:var(--mb-muted); font-size:14px; line-height:1.5; }',
      '#' + ROOT_ID + ' .mb-ea__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }',
      '#' + ROOT_ID + ' .mb-ea__field { min-width:0; }',
      '#' + ROOT_ID + ' .mb-ea__field--full { grid-column:1/-1; }',
      '#' + ROOT_ID + ' .mb-ea__label { display:block; margin:0 0 7px; font-size:15px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-ea__input-wrap { position:relative; }',
      '#' + ROOT_ID + ' .mb-ea__input, #' + ROOT_ID + ' .mb-ea__select { width:100%; min-height:48px; padding:11px 12px; border:1px solid #b9c6be; border-radius:8px; background:#fff; color:var(--mb-text); font:inherit; font-size:16px; }',
      '#' + ROOT_ID + ' .mb-ea__input { padding-right:78px; }',
      '#' + ROOT_ID + ' .mb-ea__input:focus, #' + ROOT_ID + ' .mb-ea__select:focus { outline:3px solid rgba(45,194,107,.2); border-color:var(--mb-green-dark); }',
      '#' + ROOT_ID + ' .mb-ea__unit { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--mb-muted); font-size:14px; pointer-events:none; }',
      '#' + ROOT_ID + ' .mb-ea__hint { display:block; margin-top:6px; color:var(--mb-muted); font-size:13px; line-height:1.4; }',
      '#' + ROOT_ID + ' .mb-ea__mode { display:flex; flex-wrap:wrap; gap:8px; margin:0 0 18px; }',
      '#' + ROOT_ID + ' .mb-ea__mode-btn { min-height:40px; padding:8px 13px; border:1px solid #b9c6be; border-radius:999px; background:#fff; font:inherit; font-weight:700; cursor:pointer; }',
      '#' + ROOT_ID + ' .mb-ea__mode-btn[aria-pressed="true"] { border-color:#86d9a7; background:#eaf8ef; color:#0f6f38; }',
      '#' + ROOT_ID + ' .mb-ea__conditional { grid-column:1/-1; }',
      '#' + ROOT_ID + ' .mb-ea__conditional[hidden] { display:none; }',
      '#' + ROOT_ID + ' .mb-ea__actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }',
      '#' + ROOT_ID + ' .mb-ea__button { min-height:46px; padding:11px 20px; border-radius:8px; border:1px solid transparent; font:inherit; font-size:16px; font-weight:700; cursor:pointer; }',
      '#' + ROOT_ID + ' .mb-ea__button:focus-visible, #' + ROOT_ID + ' .mb-ea__mode-btn:focus-visible { outline:3px solid rgba(45,194,107,.28); outline-offset:2px; }',
      '#' + ROOT_ID + ' .mb-ea__button--primary { background:var(--mb-green); color:#0c2818; border-color:var(--mb-green); box-shadow:0 4px 12px rgba(45,194,107,.22); }',
      '#' + ROOT_ID + ' .mb-ea__button--secondary { background:#fff; color:var(--mb-text); border-color:#b9c6be; }',
      '#' + ROOT_ID + ' .mb-ea__error { display:none; margin:16px 0 0; padding:12px 14px; border:1px solid #f1b5b0; border-radius:8px; background:#fff6f5; color:var(--mb-danger); font-size:14px; line-height:1.45; }',
      '#' + ROOT_ID + ' .mb-ea__error.is-visible { display:block; }',
      '#' + ROOT_ID + ' .mb-ea__result { margin-top:22px; padding:20px; border:1px solid #b8e7ca; border-radius:12px; background:var(--mb-green-soft); }',
      '#' + ROOT_ID + ' .mb-ea__result[hidden] { display:none; }',
      '#' + ROOT_ID + ' .mb-ea__result-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }',
      '#' + ROOT_ID + ' .mb-ea__result-label { margin:0 0 5px; color:var(--mb-muted); font-size:14px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-ea__score { margin:0; font-size:40px; line-height:1.05; font-weight:800; letter-spacing:-.03em; }',
      '#' + ROOT_ID + ' .mb-ea__score-unit { font-size:17px; font-weight:700; letter-spacing:0; }',
      '#' + ROOT_ID + ' .mb-ea__badge { display:inline-flex; min-height:34px; align-items:center; padding:6px 11px; border:1px solid #b9c6be; border-radius:999px; background:#fff; font-size:14px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-ea__summary { margin:14px 0 0; font-size:15px; line-height:1.55; }',
      '#' + ROOT_ID + ' .mb-ea__scale-wrap { margin-top:18px; }',
      '#' + ROOT_ID + ' .mb-ea__scale-title { margin:0 0 8px; font-size:14px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-ea__scale { position:relative; display:grid; grid-template-columns:30fr 15fr 25fr; height:18px; border-radius:999px; overflow:visible; background:#e7ece9; }',
      '#' + ROOT_ID + ' .mb-ea__scale > span:nth-child(1) { background:#e6a6a0; border-radius:999px 0 0 999px; }',
      '#' + ROOT_ID + ' .mb-ea__scale > span:nth-child(2) { background:#f3cf69; }',
      '#' + ROOT_ID + ' .mb-ea__scale > span:nth-child(3) { background:#79cc99; border-radius:0 999px 999px 0; }',
      '#' + ROOT_ID + ' .mb-ea__marker { position:absolute; top:-5px; width:4px; height:28px; border-radius:4px; background:#20313d; transform:translateX(-50%); box-shadow:0 0 0 2px #fff; }',
      '#' + ROOT_ID + ' .mb-ea__scale-labels { display:grid; grid-template-columns:30fr 15fr 25fr; gap:0; margin-top:7px; color:#3d4a54; font-size:12px; text-align:center; }',
      '#' + ROOT_ID + ' .mb-ea__metrics { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-top:18px; }',
      '#' + ROOT_ID + ' .mb-ea__metric { padding:14px; border:1px solid var(--mb-border); border-radius:9px; background:#fff; }',
      '#' + ROOT_ID + ' .mb-ea__metric-label { margin:0 0 7px; color:var(--mb-muted); font-size:13px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-ea__metric-value { margin:0; font-size:18px; line-height:1.25; font-weight:800; }',
      '#' + ROOT_ID + ' .mb-ea__formula { margin:16px 0 0; padding:12px 14px; border:1px solid var(--mb-border); border-radius:8px; background:#fff; color:#44515b; font-size:14px; line-height:1.5; }',
      '#' + ROOT_ID + ' .mb-ea__warning { margin:16px 0 0; padding:12px 14px; border:1px solid #f0d27a; border-radius:8px; background:var(--mb-warning-bg); color:#6f4e00; font-size:14px; line-height:1.5; }',
      '#' + ROOT_ID + ' .mb-ea__privacy { margin:16px 0 0; color:var(--mb-muted); font-size:12px; line-height:1.45; }',
      '@media (max-width:760px) { #' + ROOT_ID + ' .mb-ea__grid, #' + ROOT_ID + ' .mb-ea__metrics { grid-template-columns:1fr; } #' + ROOT_ID + ' .mb-ea__body, #' + ROOT_ID + ' .mb-ea__head { padding-left:16px; padding-right:16px; } #' + ROOT_ID + ' .mb-ea__score { font-size:33px; } #' + ROOT_ID + ' .mb-ea__scale-labels { font-size:11px; } }',
      '@media (prefers-reduced-motion:reduce) { #' + ROOT_ID + ' * { scroll-behavior:auto !important; transition:none !important; } }'
    ].join('\n');
    style.textContent += MYBEARS_UNIFIED_DESIGN_CSS;
    document.head.appendChild(style);
  }

  function init() {
    var root = document.getElementById(ROOT_ID);
    if (!root || root.getAttribute('data-mb-version') === VERSION) return;

    addStyles();
    root.setAttribute('data-mb-version', VERSION);
    root.innerHTML = [
      '<section class="mb-ea" aria-labelledby="mb-ea-title">',
      '  <div class="mb-ea__head">',
      '    <h2 class="mb-ea__title" id="mb-ea-title">Kalkulačka energetické dostupnosti</h2>',
      '    <p class="mb-ea__lead">Odhadněte, kolik energie zbývá organismu po odečtení energetického výdeje při cvičení ve vztahu k beztukové hmotě.</p>',
      '  </div>',
      '  <div class="mb-ea__body">',
      '    <p class="mb-ea__notice"><strong>Důležité:</strong> Kalkulačka není diagnostikou REDs. Výsledek výrazně ovlivňuje přesnost jídelního záznamu, odhadu aktivních kalorií a tělesného složení.</p>',
      '    <form id="mb-ea-form" novalidate>',
      '      <div class="mb-ea__mode" role="group" aria-label="Způsob zadání beztukové hmoty">',
      '        <button type="button" class="mb-ea__mode-btn" id="mb-ea-mode-fat" aria-pressed="true">Hmotnost a tělesný tuk</button>',
      '        <button type="button" class="mb-ea__mode-btn" id="mb-ea-mode-ffm" aria-pressed="false">Znám beztukovou hmotu</button>',
      '      </div>',
      '      <div class="mb-ea__grid">',
      '        <div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-sex">Referenční skupina</label><select class="mb-ea__select" id="mb-ea-sex"><option value="female">Žena</option><option value="male">Muž</option><option value="unspecified">Nechci uvést</option></select><span class="mb-ea__hint">Nemění vzorec, pouze vysvětlení výsledku.</span></div>',
      '        <div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-age">Věk</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-age" inputmode="numeric" autocomplete="off" value="30"><span class="mb-ea__unit">let</span></div><span class="mb-ea__hint">Určeno dospělým od 18 let.</span></div>',
      '        <div class="mb-ea__conditional" id="mb-ea-fat-fields">',
      '          <div class="mb-ea__grid">',
      '            <div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-weight">Tělesná hmotnost</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-weight" inputmode="decimal" autocomplete="off" value="65"><span class="mb-ea__unit">kg</span></div><span class="mb-ea__hint">Povolené rozmezí: 30–250 kg</span></div>',
      '            <div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-fat">Tělesný tuk</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-fat" inputmode="decimal" autocomplete="off" value="22"><span class="mb-ea__unit">%</span></div><span class="mb-ea__hint">Použijte hodnotu z co nejspolehlivějšího měření.</span></div>',
      '          </div>',
      '        </div>',
      '        <div class="mb-ea__conditional" id="mb-ea-ffm-fields" hidden>',
      '          <div class="mb-ea__field mb-ea__field--full"><label class="mb-ea__label" for="mb-ea-ffm">Beztuková hmota (FFM)</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-ffm" inputmode="decimal" autocomplete="off" value="50,7"><span class="mb-ea__unit">kg</span></div><span class="mb-ea__hint">Například z měření DXA nebo jiného vyšetření tělesného složení.</span></div>',
      '        </div>',
      '        <div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-intake">Průměrný denní energetický příjem</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-intake" inputmode="decimal" autocomplete="off" value="2400"><span class="mb-ea__unit">kcal</span></div><span class="mb-ea__hint">Ideálně průměr z několika reprezentativních dnů.</span></div>',
      '        <div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-exercise">Průměrný aktivní výdej při cvičení</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-exercise" inputmode="decimal" autocomplete="off" value="500"><span class="mb-ea__unit">kcal</span></div><span class="mb-ea__hint">Zadejte energii nad klidovou úroveň, nikoliv celý denní výdej.</span></div>',
      '      </div>',
      '      <div class="mb-ea__actions">',
      '        <button type="submit" class="mb-ea__button mb-ea__button--primary">Vypočítat dostupnost</button>',
      '        <button type="button" class="mb-ea__button mb-ea__button--secondary" id="mb-ea-reset">Vymazat údaje</button>',
      '      </div>',
      '      <div class="mb-ea__error" id="mb-ea-error" role="alert"></div>',
      '    </form>',
      '    <section class="mb-ea__result" id="mb-ea-result" aria-live="polite" hidden>',
      '      <div class="mb-ea__result-top">',
      '        <div><p class="mb-ea__result-label">Vaše orientační energetická dostupnost</p><p class="mb-ea__score"><span id="mb-ea-score">–</span> <span class="mb-ea__score-unit">kcal/kg FFM/den</span></p></div>',
      '        <span class="mb-ea__badge" id="mb-ea-badge">–</span>',
      '      </div>',
      '      <p class="mb-ea__summary" id="mb-ea-summary"></p>',
      '      <div class="mb-ea__scale-wrap">',
      '        <p class="mb-ea__scale-title">Orientační výzkumná pásma</p>',
      '        <div class="mb-ea__scale" aria-hidden="true"><span></span><span></span><span></span><i class="mb-ea__marker" id="mb-ea-marker"></i></div>',
      '        <div class="mb-ea__scale-labels"><span>Nízká<br>&lt; 30</span><span>Snížená<br>30–44,9</span><span>Vyšší<br>45 a více</span></div>',
      '      </div>',
      '      <div class="mb-ea__metrics">',
      '        <div class="mb-ea__metric"><p class="mb-ea__metric-label">Beztuková hmota</p><p class="mb-ea__metric-value" id="mb-ea-out-ffm">–</p></div>',
      '        <div class="mb-ea__metric"><p class="mb-ea__metric-label">Energie po odečtení cvičení</p><p class="mb-ea__metric-value" id="mb-ea-out-remaining">–</p></div>',
      '        <div class="mb-ea__metric"><p class="mb-ea__metric-label">Přepočet na kJ</p><p class="mb-ea__metric-value" id="mb-ea-out-kj">–</p></div>',
      '        <div class="mb-ea__metric"><p class="mb-ea__metric-label">Příjem odpovídající EA 30</p><p class="mb-ea__metric-value" id="mb-ea-out-30">–</p></div>',
      '        <div class="mb-ea__metric"><p class="mb-ea__metric-label">Příjem odpovídající EA 45</p><p class="mb-ea__metric-value" id="mb-ea-out-45">–</p></div>',
      '        <div class="mb-ea__metric"><p class="mb-ea__metric-label">Zadaný aktivní výdej</p><p class="mb-ea__metric-value" id="mb-ea-out-exercise">–</p></div>',
      '      </div>',
      '      <p class="mb-ea__formula" id="mb-ea-formula"></p>',
      '      <p class="mb-ea__warning" id="mb-ea-warning"></p>',
      '    </section>',
      '    <p class="mb-ea__privacy">Výpočet probíhá pouze ve vašem prohlížeči. Zadané údaje se tímto skriptem nikam neodesílají ani neukládají.</p>',
      '  </div>',
      '</section>'
    ].join('');

    var form = document.getElementById('mb-ea-form');
    var result = document.getElementById('mb-ea-result');
    var error = document.getElementById('mb-ea-error');
    var fatMode = document.getElementById('mb-ea-mode-fat');
    var ffmMode = document.getElementById('mb-ea-mode-ffm');
    var fatFields = document.getElementById('mb-ea-fat-fields');
    var ffmFields = document.getElementById('mb-ea-ffm-fields');
    var mode = 'fat';

    function setMode(next) {
      mode = next;
      fatMode.setAttribute('aria-pressed', next === 'fat' ? 'true' : 'false');
      ffmMode.setAttribute('aria-pressed', next === 'ffm' ? 'true' : 'false');
      fatFields.hidden = next !== 'fat';
      ffmFields.hidden = next !== 'ffm';
      result.hidden = true;
      error.className = 'mb-ea__error';
    }

    fatMode.addEventListener('click', function () { setMode('fat'); });
    ffmMode.addEventListener('click', function () { setMode('ffm'); });

    function showError(message) {
      error.textContent = message;
      error.className = 'mb-ea__error is-visible';
      result.hidden = true;
    }

    function classify(ea) {
      if (ea < 30) return { label: 'Nízká dostupnost', text: 'Výsledek spadá do pásma tradičně spojovaného s nízkou energetickou dostupností. Ověřte správnost vstupů a při dlouhodobém výskytu nebo příznacích vyhledejte sportovního lékaře či nutričního terapeuta.' };
      if (ea < 45) return { label: 'Snížená dostupnost', text: 'Výsledek leží v přechodném pásmu. Krátkodobě nemusí znamenat problém, ale opakovaná nebo dlouhodobá expozice může být relevantní pro zdraví, regeneraci a výkon.' };
      return { label: 'Vyšší dostupnost', text: 'Výsledek je v pásmu, které bylo v laboratorních studiích u žen často používáno jako referenční pro dostatečnou dostupnost. Samotné číslo však nevylučuje REDs ani jiné potíže.' };
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      error.className = 'mb-ea__error';

      var age = parseNumber(document.getElementById('mb-ea-age').value);
      var sex = document.getElementById('mb-ea-sex').value;
      var intake = parseNumber(document.getElementById('mb-ea-intake').value);
      var exercise = parseNumber(document.getElementById('mb-ea-exercise').value);
      var ffm;

      if (!Number.isFinite(age) || age < 18 || age > 100) return showError('Zadejte věk v rozmezí 18–100 let.');
      if (!Number.isFinite(intake) || intake < 500 || intake > 10000) return showError('Zadejte průměrný denní příjem v rozmezí 500–10 000 kcal.');
      if (!Number.isFinite(exercise) || exercise < 0 || exercise > 6000) return showError('Zadejte aktivní výdej při cvičení v rozmezí 0–6 000 kcal za den.');

      if (mode === 'fat') {
        var weight = parseNumber(document.getElementById('mb-ea-weight').value);
        var fat = parseNumber(document.getElementById('mb-ea-fat').value);
        if (!Number.isFinite(weight) || weight < 30 || weight > 250) return showError('Zadejte tělesnou hmotnost v rozmezí 30–250 kg.');
        if (!Number.isFinite(fat) || fat < 3 || fat > 60) return showError('Zadejte podíl tělesného tuku v rozmezí 3–60 %.');
        ffm = weight * (1 - fat / 100);
      } else {
        ffm = parseNumber(document.getElementById('mb-ea-ffm').value);
        if (!Number.isFinite(ffm) || ffm < 20 || ffm > 180) return showError('Zadejte beztukovou hmotu v rozmezí 20–180 kg.');
      }

      var remaining = intake - exercise;
      var ea = remaining / ffm;
      if (!Number.isFinite(ea)) return showError('Výpočet se nepodařilo dokončit. Zkontrolujte zadané údaje.');

      var category = classify(ea);
      var marker = Math.max(0, Math.min(100, (ea / 70) * 100));
      var target30 = exercise + 30 * ffm;
      var target45 = exercise + 45 * ffm;
      var eaKj = ea * 4.184;

      document.getElementById('mb-ea-score').textContent = format(round(ea, 1), 1);
      document.getElementById('mb-ea-badge').textContent = category.label;
      document.getElementById('mb-ea-summary').textContent = category.text;
      document.getElementById('mb-ea-marker').style.left = marker + '%';
      document.getElementById('mb-ea-out-ffm').textContent = format(round(ffm, 1), 1) + ' kg';
      document.getElementById('mb-ea-out-remaining').textContent = format(round(remaining, 0), 0) + ' kcal/den';
      document.getElementById('mb-ea-out-kj').textContent = format(round(eaKj, 0), 0) + ' kJ/kg FFM/den';
      document.getElementById('mb-ea-out-30').textContent = format(round(target30, 0), 0) + ' kcal/den';
      document.getElementById('mb-ea-out-45').textContent = format(round(target45, 0), 0) + ' kcal/den';
      document.getElementById('mb-ea-out-exercise').textContent = format(round(exercise, 0), 0) + ' kcal/den';
      document.getElementById('mb-ea-formula').innerHTML = '<strong>Výpočet:</strong> (' + format(round(intake, 0), 0) + ' − ' + format(round(exercise, 0), 0) + ') ÷ ' + format(round(ffm, 1), 1) + ' = ' + format(round(ea, 1), 1) + ' kcal/kg FFM/den.';

      var warning = 'Pásma 30 a 45 kcal/kg FFM/den jsou orientační výzkumné reference, nikoliv diagnostické hranice. Přepočtené příjmy nejsou osobním doporučením jídelníčku.';
      if (sex === 'male') warning += ' U mužů není potvrzena jedna univerzální hranice nízké energetické dostupnosti a odborná interpretace musí být obzvlášť opatrná.';
      if (sex === 'unspecified') warning += ' Výzkumná pásma byla odvozena hlavně ze studií žen a nelze je stejně přesně vztáhnout na každého člověka.';
      if (remaining <= 0) warning = 'Zadaný aktivní výdej je stejný nebo vyšší než energetický příjem. Nejprve ověřte, zda jste nezadali hrubý výdej včetně klidové energie místo aktivních kalorií. ' + warning;
      document.getElementById('mb-ea-warning').textContent = warning;

      result.hidden = false;
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    document.getElementById('mb-ea-reset').addEventListener('click', function () {
      document.getElementById('mb-ea-sex').value = 'female';
      document.getElementById('mb-ea-age').value = '30';
      document.getElementById('mb-ea-weight').value = '65';
      document.getElementById('mb-ea-fat').value = '22';
      document.getElementById('mb-ea-ffm').value = '50,7';
      document.getElementById('mb-ea-intake').value = '2400';
      document.getElementById('mb-ea-exercise').value = '500';
      setMode('fat');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
