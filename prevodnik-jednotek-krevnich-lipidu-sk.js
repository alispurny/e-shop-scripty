/**
 * MyBears — zjednotená grafická verzia 2.0 (SK)
 * Vizuálny systém vychádza z MyBears Product Guide v1.8.
 * Funkčná logika pôvodného nástroja zostáva zachovaná.
 */
(function () {
  'use strict';

  var MYBEARS_UNIFIED_DESIGN_CSS = String.raw`
/* MyBears unified design layer — based on Product Guide v1.8 */
#mb-lipid-converter {
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
#mb-lipid-converter *, #mb-lipid-converter *::before, #mb-lipid-converter *::after { box-sizing:border-box; }
#mb-lipid-converter .mb-lipid { position:relative; overflow:hidden; border:1px solid var(--mb-border) !important; border-radius:18px !important; background:#fff !important; box-shadow:0 12px 32px rgba(27,35,29,.07) !important; }
#mb-lipid-converter .mb-lipid::before { content:""; position:absolute; z-index:3; top:0; left:0; right:0; height:4px; background:var(--mb-gold); }
#mb-lipid-converter .mb-lipid__head { padding:34px 38px 26px !important; background:var(--mb-cream) !important; border-bottom:1px solid var(--mb-border) !important; }
#mb-lipid-converter .mb-lipid__body { padding:30px 38px 36px !important; }
#mb-lipid-converter .mb-lipid__title, #mb-lipid-converter .mb-lipid__section-title, #mb-lipid-converter .mb-lipid__panel-title, #mb-lipid-converter .mb-lipid__subhead { color:var(--mb-green) !important; font-weight:700 !important; letter-spacing:-.01em; }
#mb-lipid-converter .mb-lipid__title { margin:0 0 10px !important; font-size:clamp(25px,3.2vw,30px) !important; line-height:1.16 !important; }
#mb-lipid-converter .mb-lipid__lead { max-width:820px; margin:0 !important; color:#454a45 !important; font-size:16px !important; line-height:1.58 !important; }
#mb-lipid-converter .mb-lipid__notice { margin:0 0 22px !important; padding:15px 17px !important; border:1px solid #eadfc8 !important; border-left:4px solid var(--mb-gold) !important; border-radius:12px !important; background:var(--mb-cream) !important; color:#4f4b43 !important; font-size:14px !important; line-height:1.55 !important; }
#mb-lipid-converter .mb-lipid__notice strong { color:#292b28; }
#mb-lipid-converter .mb-lipid__grid { gap:18px !important; }
#mb-lipid-converter .mb-lipid__field { min-width:0; }
#mb-lipid-converter .mb-lipid__label { margin-bottom:7px !important; color:#292b28 !important; font-size:15px !important; font-weight:700 !important; }
#mb-lipid-converter .mb-lipid__input, #mb-lipid-converter .mb-lipid__select { min-height:48px !important; border:1px solid #d4d6d1 !important; border-radius:8px !important; background:#fff !important; color:var(--mb-text) !important; box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }
#mb-lipid-converter .mb-lipid__input:hover, #mb-lipid-converter .mb-lipid__select:hover { border-color:#aeb8b0 !important; }
#mb-lipid-converter .mb-lipid__input:focus, #mb-lipid-converter .mb-lipid__select:focus { outline:3px solid rgba(219,196,66,.30) !important; outline-offset:1px; border-color:var(--mb-green-dark) !important; }
#mb-lipid-converter .mb-lipid__hint, #mb-lipid-converter .mb-lipid__privacy, #mb-lipid-converter .mb-lipid__formula, #mb-lipid-converter .mb-lipid__disclaimer { color:var(--mb-muted) !important; }
#mb-lipid-converter .mb-lipid__actions { gap:12px !important; margin-top:24px !important; }
#mb-lipid-converter .mb-lipid__button { display:inline-flex; align-items:center; justify-content:center; min-height:48px !important; padding:12px 24px !important; border:2px solid transparent !important; border-radius:8px !important; font-weight:700 !important; line-height:1.15; transition:background .15s ease,border-color .15s ease,transform .15s ease; }
#mb-lipid-converter .mb-lipid__button:hover { transform:translateY(-1px); }
#mb-lipid-converter .mb-lipid__button:focus-visible, #mb-lipid-converter a:focus-visible, #mb-lipid-converter summary:focus-visible { outline:3px solid rgba(219,196,66,.38) !important; outline-offset:2px !important; }
#mb-lipid-converter .mb-lipid__button--primary { min-width:210px; color:#fff !important; background:var(--mb-green) !important; border-color:var(--mb-green) !important; box-shadow:none !important; }
#mb-lipid-converter .mb-lipid__button--primary:hover { background:var(--mb-green-dark) !important; border-color:var(--mb-green-dark) !important; }
#mb-lipid-converter .mb-lipid__button--secondary { color:var(--mb-green-dark) !important; background:#fff !important; border-color:var(--mb-green) !important; }
#mb-lipid-converter .mb-lipid__advanced, #mb-lipid-converter .mb-lipid__panel, #mb-lipid-converter .mb-lipid__mode, #mb-lipid-converter .mb-lipid__tabs { border-color:var(--mb-border) !important; border-radius:12px !important; background:var(--mb-cream) !important; }
#mb-lipid-converter .mb-lipid__tab, #mb-lipid-converter .mb-lipid__mode-btn { border-radius:8px !important; color:var(--mb-green-dark) !important; }
#mb-lipid-converter .mb-lipid__tab[aria-selected="true"], #mb-lipid-converter .mb-lipid__mode-btn[aria-pressed="true"], #mb-lipid-converter .mb-lipid__tab.is-active, #mb-lipid-converter .mb-lipid__mode-btn.is-active { background:var(--mb-green) !important; color:#fff !important; border-color:var(--mb-green) !important; }
#mb-lipid-converter .mb-lipid__result { margin-top:28px !important; padding:24px !important; border:1px solid #cfe4d5 !important; border-radius:16px !important; background:var(--mb-green-soft) !important; }
#mb-lipid-converter .mb-lipid__score { color:#20221f !important; font-weight:800 !important; letter-spacing:-.035em; }
#mb-lipid-converter .mb-lipid__badge { border:1px solid #d7ceb8 !important; background:#fff8df !important; color:#75633d !important; font-weight:700 !important; }
#mb-lipid-converter .mb-lipid__summary { color:#454a45 !important; }
#mb-lipid-converter .mb-lipid__metric, #mb-lipid-converter .mb-lipid__card, #mb-lipid-converter .mb-lipid__macro, #mb-lipid-converter .mb-lipid__meal { border:1px solid var(--mb-border) !important; border-radius:12px !important; background:#fff !important; box-shadow:none !important; }
#mb-lipid-converter .mb-lipid__metric-label, #mb-lipid-converter .mb-lipid__card-label, #mb-lipid-converter .mb-lipid__result-label { color:var(--mb-muted) !important; }
#mb-lipid-converter .mb-lipid__metric-value, #mb-lipid-converter .mb-lipid__card-value, #mb-lipid-converter .mb-lipid__macro-value { color:var(--mb-green-dark) !important; }
#mb-lipid-converter .mb-lipid__warning, #mb-lipid-converter .mb-lipid__inline-warning { border-left:4px solid var(--mb-gold) !important; border-radius:8px !important; background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important; color:#5d4b1d !important; }
#mb-lipid-converter .mb-lipid__error { border-color:#e3b3af !important; border-radius:10px !important; background:#fff5f4 !important; color:var(--mb-danger) !important; }
#mb-lipid-converter .mb-lipid__scale { box-shadow:inset 0 0 0 1px rgba(32,34,31,.10); }
#mb-lipid-converter .mb-lipid__marker { background:#20231f !important; box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(32,35,31,.18) !important; }
#mb-lipid-converter .mb-lipid__table-wrap { overflow-x:auto; border:1px solid var(--mb-border) !important; border-radius:12px !important; }
#mb-lipid-converter .mb-lipid__table { width:100%; border-collapse:collapse; background:#fff; }
#mb-lipid-converter .mb-lipid__table thead th { border-bottom:2px solid var(--mb-gold) !important; background:#20231f !important; color:#fff !important; }
#mb-lipid-converter .mb-lipid__table tbody tr:nth-child(even) { background:var(--mb-green-soft) !important; }
@media(max-width:760px) {
  #mb-lipid-converter { margin:18px auto 30px !important; }
  #mb-lipid-converter .mb-lipid__head { padding:28px 20px 22px !important; }
  #mb-lipid-converter .mb-lipid__body { padding:24px 20px 28px !important; }
  #mb-lipid-converter .mb-lipid__result { padding:20px !important; }
  #mb-lipid-converter .mb-lipid__actions { flex-direction:column; align-items:stretch; }
  #mb-lipid-converter .mb-lipid__button { width:100%; }
}
@media(prefers-reduced-motion:reduce) {
  #mb-lipid-converter *, #mb-lipid-converter *::before, #mb-lipid-converter *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
`;

  var T = {"locale":"sk-SK","root":"mb-lipid-converter","style":"mb-lipid-converter-styles","version":"2.0.0-sk","title":"Prevodník cholesterolu a lipidových hodnôt","lead":"Prevádzajte celkový cholesterol, LDL, HDL, non-HDL a triglyceridy medzi mmol/l a mg/dl. Z lipidogramu môžete dopočítať aj non-HDL cholesterol a doplnkové pomery.","notice":"<strong>Dôležité:</strong> Prevody a výpočty sú matematické. Kalkulačka nestanovuje diagnózu ani liečebný cieľ; cieľové hodnoty sa určujú podľa celkového kardiovaskulárneho rizika a zdravotného stavu.","tabs_label":"Režim prevodníka","tab_single":"Prevod jednej hodnoty","tab_panel":"Výpočet z lipidogramu","single_title":"Prevod mmol/l a mg/dl","analyte":"Ukazovateľ","value":"Hodnota","input_unit":"Zadaná jednotka","analytes":{"tc":"Celkový cholesterol","ldl":"LDL cholesterol","hdl":"HDL cholesterol","nonhdl":"Non-HDL cholesterol","remnant":"Remnant cholesterol","tg":"Triglyceridy"},"hint_chol":"Pre cholesterolové ukazovatele sa používa faktor 38,67.","hint_tg":"Pre triglyceridy sa používa odlišný faktor 88,57.","calculate_single":"Previesť hodnotu","reset":"Vymazať údaje","single_result":"Prevedená hodnota","factor_label":"Použitý prevod","panel_title":"Výpočet z lipidového profilu","panel_intro":"Zadajte hodnoty z rovnakého laboratórneho výsledku a v rovnakej jednotke. LDL je voliteľné, ale je potrebné na pomer LDL/HDL a odhad remnant cholesterolu.","panel_unit":"Jednotka lipidogramu","tc":"Celkový cholesterol","hdl":"HDL cholesterol","ldl":"LDL cholesterol (voliteľne)","tg":"Triglyceridy","panel_hint":"Zadajte laboratórne hodnoty bez textu jednotky. Kalkulačka rozpozná desatinnú čiarku aj bodku.","calculate_panel":"Vyhodnotiť lipidogram","derived_title":"Dopočítané ukazovatele","nonhdl":"Non-HDL cholesterol","tc_hdl":"Pomer celkový cholesterol / HDL","ldl_hdl":"Pomer LDL / HDL","tg_hdl":"Pomer triglyceridy / HDL","remnant":"Odhad remnant cholesterolu","converted_title":"Prevod zadaných hodnôt","indicator":"Ukazovateľ","mmol":"mmol/l","mg":"mg/dl","ratio_note":"Pomer triglyceridov k HDL je vypočítaný z hodnôt v mg/dl, pretože tento spôsob sa často používa v odbornej literatúre. Pomery nie sú samostatné diagnostické testy ani univerzálne liečebné ciele.","remnant_note":"Remnant cholesterol je tu iba aritmetický odhad: celkový cholesterol − LDL − HDL. Ak bol LDL v laboratóriu iba vypočítaný, nejde o úplne nezávislý údaj.","inconsistent":"Zadané hodnoty vedú k zápornému odhadu remnant cholesterolu. Skontrolujte jednotky a prepis laboratórneho výsledku; remnant cholesterol preto nebol zobrazený.","privacy":"Výpočet prebieha iba vo vašom prehliadači. Zadané laboratórne hodnoty sa týmto skriptom nikam neodosielajú ani neukladajú.","na":"Nedá sa vypočítať","errors":{"number":"Zadajte platnú číselnú hodnotu.","single_chol_mmol":"Zadajte hodnotu v rozmedzí 0,1–30,0 mmol/l.","single_chol_mg":"Zadajte hodnotu v rozmedzí 4–1160 mg/dl.","single_tg_mmol":"Zadajte triglyceridy v rozmedzí 0,1–50,0 mmol/l.","single_tg_mg":"Zadajte triglyceridy v rozmedzí 9–4430 mg/dl.","panel_required":"Vyplňte celkový cholesterol, HDL a triglyceridy.","panel_range":"Niektorá zadaná hodnota je mimo povoleného rozmedzia.","panel_relation":"Celkový cholesterol musí byť vyšší ako HDL cholesterol."},"formula_chol_mmol":"{{value}} mmol/l × 38,67 = {{result}} mg/dl.","formula_chol_mg":"{{value}} mg/dl ÷ 38,67 = {{result}} mmol/l.","formula_tg_mmol":"{{value}} mmol/l × 88,57 = {{result}} mg/dl.","formula_tg_mg":"{{value}} mg/dl ÷ 88,57 = {{result}} mmol/l."};
  var ROOT_ID = T.root;
  var STYLE_ID = T.style;
  var VERSION = T.version;
  var CHOL_FACTOR = 38.67;
  var TG_FACTOR = 88.57;

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    var clean = value.trim().replace(/\s+/g, '');
    if (clean === '') return NaN;
    return Number(clean.replace(',', '.'));
  }

  function format(value, decimals) {
    return new Intl.NumberFormat(T.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function factorFor(analyte) { return analyte === 'tg' ? TG_FACTOR : CHOL_FACTOR; }
  function toMg(value, analyte) { return value * factorFor(analyte); }
  function toMmol(value, analyte) { return value / factorFor(analyte); }

  function addStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${ROOT_ID} { --mb-green:#2dc26b; --mb-green-dark:#168947; --mb-green-soft:#f7fbf8; --mb-border:#d9e5dd; --mb-text:#1f2933; --mb-muted:#59636e; --mb-danger:#b42318; font-family:Arial, Helvetica, sans-serif; font-weight:400; color:var(--mb-text); margin:24px 0; }
#${ROOT_ID} * { box-sizing:border-box; }
#${ROOT_ID} strong, #${ROOT_ID} b { font-weight:700; }
#${ROOT_ID} .mb-lipid { border:1px solid var(--mb-border); border-radius:14px; background:#fff; box-shadow:0 8px 28px rgba(31,41,51,.08); overflow:hidden; }
#${ROOT_ID} .mb-lipid__head { padding:22px 22px 16px; background:var(--mb-green-soft); border-bottom:1px solid var(--mb-border); }
#${ROOT_ID} .mb-lipid__title { margin:0 0 8px; font-size:22px; line-height:1.25; font-weight:700; }
#${ROOT_ID} .mb-lipid__lead { margin:0; color:var(--mb-muted); font-size:16px; line-height:1.55; }
#${ROOT_ID} .mb-lipid__body { padding:22px; }
#${ROOT_ID} .mb-lipid__notice { margin:0 0 18px; padding:12px 14px; border-left:4px solid var(--mb-green); border-radius:6px; background:#f8faf9; color:var(--mb-muted); font-size:14px; line-height:1.5; }
#${ROOT_ID} .mb-lipid__tabs { display:flex; flex-wrap:wrap; gap:8px; margin:0 0 18px; padding:4px; border:1px solid var(--mb-border); border-radius:10px; background:#f8faf9; }
#${ROOT_ID} .mb-lipid__tab { flex:1 1 240px; min-height:44px; padding:10px 14px; border:0; border-radius:7px; background:transparent; color:var(--mb-text); font:inherit; font-size:15px; font-weight:700; cursor:pointer; }
#${ROOT_ID} .mb-lipid__tab[aria-selected="true"] { background:#fff; color:#0b6d37; box-shadow:0 2px 9px rgba(31,41,51,.09); }
#${ROOT_ID} .mb-lipid__tab:focus-visible, #${ROOT_ID} .mb-lipid__button:focus-visible { outline:3px solid rgba(45,194,107,.28); outline-offset:2px; }
#${ROOT_ID} .mb-lipid__panel[hidden], #${ROOT_ID} .mb-lipid__result[hidden] { display:none; }
#${ROOT_ID} .mb-lipid__panel-title { margin:0 0 8px; font-size:18px; line-height:1.35; font-weight:700; }
#${ROOT_ID} .mb-lipid__panel-intro { margin:0 0 15px; color:var(--mb-muted); font-size:14px; line-height:1.5; }
#${ROOT_ID} .mb-lipid__grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; align-items:start; }
#${ROOT_ID} .mb-lipid__grid--panel { grid-template-columns:repeat(2,minmax(0,1fr)); }
#${ROOT_ID} .mb-lipid__field { min-width:0; }
#${ROOT_ID} .mb-lipid__label { display:block; margin:0 0 7px; font-size:15px; font-weight:700; }
#${ROOT_ID} .mb-lipid__input, #${ROOT_ID} .mb-lipid__select { width:100%; min-height:48px; padding:11px 12px; border:1px solid #b9c6be; border-radius:8px; background:#fff; color:var(--mb-text); font:inherit; font-size:16px; }
#${ROOT_ID} .mb-lipid__input:focus, #${ROOT_ID} .mb-lipid__select:focus { outline:3px solid rgba(45,194,107,.2); border-color:var(--mb-green-dark); }
#${ROOT_ID} .mb-lipid__hint { display:block; margin-top:6px; color:var(--mb-muted); font-size:13px; line-height:1.4; }
#${ROOT_ID} .mb-lipid__actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
#${ROOT_ID} .mb-lipid__button { min-height:46px; padding:11px 20px; border-radius:8px; border:1px solid transparent; font:inherit; font-size:16px; font-weight:700; cursor:pointer; }
#${ROOT_ID} .mb-lipid__button--primary { background:var(--mb-green); color:#0c2818; border-color:var(--mb-green); box-shadow:0 4px 12px rgba(45,194,107,.22); }
#${ROOT_ID} .mb-lipid__button--secondary { background:#fff; color:var(--mb-text); border-color:#b9c6be; }
#${ROOT_ID} .mb-lipid__error { display:none; margin:16px 0 0; padding:12px 14px; border:1px solid #f1b5b0; border-radius:8px; background:#fff6f5; color:var(--mb-danger); font-size:14px; line-height:1.45; }
#${ROOT_ID} .mb-lipid__error.is-visible { display:block; }
#${ROOT_ID} .mb-lipid__result { margin-top:22px; padding:20px; border:1px solid #b8e7ca; border-radius:12px; background:var(--mb-green-soft); }
#${ROOT_ID} .mb-lipid__result-label { margin:0 0 5px; color:var(--mb-muted); font-size:14px; font-weight:700; }
#${ROOT_ID} .mb-lipid__score { margin:0; font-size:38px; line-height:1.08; font-weight:800; letter-spacing:-.03em; }
#${ROOT_ID} .mb-lipid__cards { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:12px; margin-top:18px; }
#${ROOT_ID} .mb-lipid__cards--two { grid-template-columns:repeat(2,minmax(0,1fr)); }
#${ROOT_ID} .mb-lipid__card { min-width:0; padding:14px; border:1px solid #d4e1d8; border-radius:9px; background:#fff; }
#${ROOT_ID} .mb-lipid__card-label { display:block; margin-bottom:7px; color:var(--mb-muted); font-size:13px; font-weight:700; }
#${ROOT_ID} .mb-lipid__card-value { display:block; font-size:19px; font-weight:800; line-height:1.3; word-break:break-word; }
#${ROOT_ID} .mb-lipid__subhead { margin:20px 0 10px; font-size:16px; font-weight:700; }
#${ROOT_ID} .mb-lipid__table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; border:1px solid #d4e1d8; border-radius:9px; background:#fff; }
#${ROOT_ID} .mb-lipid__table { width:100%; min-width:540px; border-collapse:collapse; }
#${ROOT_ID} .mb-lipid__table th, #${ROOT_ID} .mb-lipid__table td { padding:11px 12px; border-bottom:1px solid #e4ebe6; text-align:left; font-size:14px; }
#${ROOT_ID} .mb-lipid__table th { background:#f7fbf8; font-weight:700; }
#${ROOT_ID} .mb-lipid__table tr:last-child td { border-bottom:0; }
#${ROOT_ID} .mb-lipid__formula, #${ROOT_ID} .mb-lipid__warning, #${ROOT_ID} .mb-lipid__privacy { margin:15px 0 0; color:var(--mb-muted); font-size:13px; line-height:1.55; }
#${ROOT_ID} .mb-lipid__warning { padding-top:15px; border-top:1px solid #cce3d4; color:#3f4f46; }
#${ROOT_ID} .mb-lipid__inline-warning { margin:15px 0 0; padding:11px 13px; border:1px solid #efc97d; border-radius:8px; background:#fff9e9; color:#6c4b08; font-size:13px; line-height:1.5; }
@media (max-width:900px) { #${ROOT_ID} .mb-lipid__cards { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:720px) { #${ROOT_ID} .mb-lipid__grid, #${ROOT_ID} .mb-lipid__grid--panel { grid-template-columns:1fr; } #${ROOT_ID} .mb-lipid__body, #${ROOT_ID} .mb-lipid__head { padding-left:16px; padding-right:16px; } #${ROOT_ID} .mb-lipid__score { font-size:34px; } }
@media (max-width:470px) { #${ROOT_ID} .mb-lipid__cards, #${ROOT_ID} .mb-lipid__cards--two { grid-template-columns:1fr; } #${ROOT_ID} .mb-lipid__button { width:100%; } }
`;
    style.textContent += MYBEARS_UNIFIED_DESIGN_CSS;
    document.head.appendChild(style);
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.setAttribute('data-version', VERSION);
    addStyles();
    var options = Object.keys(T.analytes).map(function (key) { return '<option value="' + key + '">' + T.analytes[key] + '</option>'; }).join('');
    root.innerHTML = '<section class="mb-lipid">' +
      '<div class="mb-lipid__head"><h2 class="mb-lipid__title">' + T.title + '</h2><p class="mb-lipid__lead">' + T.lead + '</p></div>' +
      '<div class="mb-lipid__body"><p class="mb-lipid__notice">' + T.notice + '</p>' +
      '<div class="mb-lipid__tabs" role="tablist" aria-label="' + T.tabs_label + '">' +
        '<button class="mb-lipid__tab" id="mb-lipid-tab-single" type="button" role="tab" aria-selected="true" aria-controls="mb-lipid-panel-single" data-tab="single">' + T.tab_single + '</button>' +
        '<button class="mb-lipid__tab" id="mb-lipid-tab-panel" type="button" role="tab" aria-selected="false" aria-controls="mb-lipid-panel-panel" data-tab="panel">' + T.tab_panel + '</button>' +
      '</div>' +
      '<section class="mb-lipid__panel" id="mb-lipid-panel-single" role="tabpanel" aria-labelledby="mb-lipid-tab-single">' +
        '<h3 class="mb-lipid__panel-title">' + T.single_title + '</h3>' +
        '<form data-form="single" novalidate><div class="mb-lipid__grid">' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-lipid-analyte">' + T.analyte + '</label><select class="mb-lipid__select" id="mb-lipid-analyte" name="analyte">' + options + '</select><span class="mb-lipid__hint" data-hint="single">' + T.hint_chol + '</span></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-lipid-value">' + T.value + '</label><input class="mb-lipid__input" id="mb-lipid-value" name="value" type="text" inputmode="decimal" autocomplete="off" placeholder="5,2"></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-lipid-unit">' + T.input_unit + '</label><select class="mb-lipid__select" id="mb-lipid-unit" name="unit"><option value="mmol">mmol/l</option><option value="mg">mg/dl</option></select></div>' +
        '</div><div class="mb-lipid__actions"><button class="mb-lipid__button mb-lipid__button--primary" type="submit">' + T.calculate_single + '</button><button class="mb-lipid__button mb-lipid__button--secondary" type="button" data-reset="single">' + T.reset + '</button></div><div class="mb-lipid__error" data-error="single" role="alert" aria-live="assertive"></div></form>' +
        '<div class="mb-lipid__result" data-result-box="single" aria-live="polite" hidden><p class="mb-lipid__result-label">' + T.single_result + '</p><p class="mb-lipid__score" data-result="single-main"></p><div class="mb-lipid__cards mb-lipid__cards--two"><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.mmol + '</span><strong class="mb-lipid__card-value" data-result="single-mmol"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.mg + '</span><strong class="mb-lipid__card-value" data-result="single-mg"></strong></div></div><p class="mb-lipid__formula" data-result="single-formula"></p></div>' +
      '</section>' +
      '<section class="mb-lipid__panel" id="mb-lipid-panel-panel" role="tabpanel" aria-labelledby="mb-lipid-tab-panel" hidden>' +
        '<h3 class="mb-lipid__panel-title">' + T.panel_title + '</h3><p class="mb-lipid__panel-intro">' + T.panel_intro + '</p>' +
        '<form data-form="panel" novalidate><div class="mb-lipid__grid mb-lipid__grid--panel">' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-unit">' + T.panel_unit + '</label><select class="mb-lipid__select" id="mb-panel-unit" name="unit"><option value="mmol">mmol/l</option><option value="mg">mg/dl</option></select><span class="mb-lipid__hint">' + T.panel_hint + '</span></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-tc">' + T.tc + '</label><input class="mb-lipid__input" id="mb-panel-tc" type="text" inputmode="decimal" autocomplete="off" placeholder="5,2"></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-hdl">' + T.hdl + '</label><input class="mb-lipid__input" id="mb-panel-hdl" type="text" inputmode="decimal" autocomplete="off" placeholder="1,4"></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-ldl">' + T.ldl + '</label><input class="mb-lipid__input" id="mb-panel-ldl" type="text" inputmode="decimal" autocomplete="off" placeholder="3,1"></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-tg">' + T.tg + '</label><input class="mb-lipid__input" id="mb-panel-tg" type="text" inputmode="decimal" autocomplete="off" placeholder="1,5"></div>' +
        '</div><div class="mb-lipid__actions"><button class="mb-lipid__button mb-lipid__button--primary" type="submit">' + T.calculate_panel + '</button><button class="mb-lipid__button mb-lipid__button--secondary" type="button" data-reset="panel">' + T.reset + '</button></div><div class="mb-lipid__error" data-error="panel" role="alert" aria-live="assertive"></div></form>' +
        '<div class="mb-lipid__result" data-result-box="panel" aria-live="polite" hidden><h4 class="mb-lipid__subhead">' + T.derived_title + '</h4><div class="mb-lipid__cards"><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.nonhdl + '</span><strong class="mb-lipid__card-value" data-result="nonhdl"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.tc_hdl + '</span><strong class="mb-lipid__card-value" data-result="tc-hdl"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.ldl_hdl + '</span><strong class="mb-lipid__card-value" data-result="ldl-hdl"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.tg_hdl + '</span><strong class="mb-lipid__card-value" data-result="tg-hdl"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.remnant + '</span><strong class="mb-lipid__card-value" data-result="remnant"></strong></div></div>' +
          '<div class="mb-lipid__inline-warning" data-result="panel-warning" hidden></div><h4 class="mb-lipid__subhead">' + T.converted_title + '</h4><div class="mb-lipid__table-wrap"><table class="mb-lipid__table"><thead><tr><th>' + T.indicator + '</th><th>' + T.mmol + '</th><th>' + T.mg + '</th></tr></thead><tbody data-result="table-body"></tbody></table></div><p class="mb-lipid__warning">' + T.ratio_note + '</p><p class="mb-lipid__warning">' + T.remnant_note + '</p></div>' +
      '</section><p class="mb-lipid__privacy">' + T.privacy + '</p></div></section>';

    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-tab]'));
    tabs.forEach(function (tab) { tab.addEventListener('click', function () { var target = tab.getAttribute('data-tab'); tabs.forEach(function (item) { item.setAttribute('aria-selected', item === tab ? 'true' : 'false'); }); root.querySelector('#mb-lipid-panel-single').hidden = target !== 'single'; root.querySelector('#mb-lipid-panel-panel').hidden = target !== 'panel'; }); });

    var analyteSelect = root.querySelector('#mb-lipid-analyte');
    var singleHint = root.querySelector('[data-hint="single"]');
    analyteSelect.addEventListener('change', function () { singleHint.textContent = analyteSelect.value === 'tg' ? T.hint_tg : T.hint_chol; });

    function showError(kind, message, field) { var error = root.querySelector('[data-error="' + kind + '"]'); error.textContent = message; error.classList.add('is-visible'); root.querySelector('[data-result-box="' + kind + '"]').hidden = true; if (field) field.focus(); }
    function clearError(kind) { var error = root.querySelector('[data-error="' + kind + '"]'); error.textContent = ''; error.classList.remove('is-visible'); }

    root.querySelector('[data-form="single"]').addEventListener('submit', function (event) {
      event.preventDefault(); clearError('single');
      var input = root.querySelector('#mb-lipid-value'); var value = parseNumber(input.value); var analyte = analyteSelect.value; var unit = root.querySelector('#mb-lipid-unit').value;
      if (!Number.isFinite(value)) return showError('single', T.errors.number, input);
      var isTg = analyte === 'tg';
      if (unit === 'mmol' && (value < 0.1 || value > (isTg ? 50 : 30))) return showError('single', isTg ? T.errors.single_tg_mmol : T.errors.single_chol_mmol, input);
      if (unit === 'mg' && (value < (isTg ? 9 : 4) || value > (isTg ? 4430 : 1160))) return showError('single', isTg ? T.errors.single_tg_mg : T.errors.single_chol_mg, input);
      var mmol = unit === 'mmol' ? value : toMmol(value, analyte); var mg = unit === 'mg' ? value : toMg(value, analyte);
      root.querySelector('[data-result="single-main"]').textContent = unit === 'mmol' ? format(Math.round(mg), 0) + ' mg/dl' : format(round(mmol, 2), 2) + ' mmol/l';
      root.querySelector('[data-result="single-mmol"]').textContent = format(round(mmol, 2), 2) + ' mmol/l';
      root.querySelector('[data-result="single-mg"]').textContent = format(Math.round(mg), 0) + ' mg/dl';
      var formula = isTg ? (unit === 'mmol' ? T.formula_tg_mmol : T.formula_tg_mg) : (unit === 'mmol' ? T.formula_chol_mmol : T.formula_chol_mg);
      root.querySelector('[data-result="single-formula"]').textContent = formula.replace(/\{\{value\}\}/g, format(value, unit === 'mmol' ? 2 : 0)).replace(/\{\{result\}\}/g, unit === 'mmol' ? format(Math.round(mg),0) : format(round(mmol,2),2));
      root.querySelector('[data-result-box="single"]').hidden = false;
    });

    root.querySelector('[data-form="panel"]').addEventListener('submit', function (event) {
      event.preventDefault(); clearError('panel');
      var unit = root.querySelector('#mb-panel-unit').value;
      var inputs = { tc:root.querySelector('#mb-panel-tc'), hdl:root.querySelector('#mb-panel-hdl'), ldl:root.querySelector('#mb-panel-ldl'), tg:root.querySelector('#mb-panel-tg') };
      var values = { tc:parseNumber(inputs.tc.value), hdl:parseNumber(inputs.hdl.value), ldl:parseNumber(inputs.ldl.value), tg:parseNumber(inputs.tg.value) };
      if (![values.tc, values.hdl, values.tg].every(Number.isFinite)) return showError('panel', T.errors.panel_required, !Number.isFinite(values.tc) ? inputs.tc : (!Number.isFinite(values.hdl) ? inputs.hdl : inputs.tg));
      var cholMax = unit === 'mmol' ? 30 : 1160; var tgMax = unit === 'mmol' ? 50 : 4430; var cholMin = unit === 'mmol' ? 0.1 : 4; var tgMin = unit === 'mmol' ? 0.1 : 9;
      if (values.tc < cholMin || values.tc > cholMax || values.hdl < cholMin || values.hdl > cholMax || values.tg < tgMin || values.tg > tgMax || (Number.isFinite(values.ldl) && (values.ldl < cholMin || values.ldl > cholMax))) return showError('panel', T.errors.panel_range);
      if (values.tc <= values.hdl) return showError('panel', T.errors.panel_relation, inputs.tc);
      var mmol = { tc: unit === 'mmol' ? values.tc : toMmol(values.tc,'tc'), hdl: unit === 'mmol' ? values.hdl : toMmol(values.hdl,'hdl'), tg: unit === 'mmol' ? values.tg : toMmol(values.tg,'tg') };
      var mg = { tc: unit === 'mg' ? values.tc : toMg(values.tc,'tc'), hdl: unit === 'mg' ? values.hdl : toMg(values.hdl,'hdl'), tg: unit === 'mg' ? values.tg : toMg(values.tg,'tg') };
      if (Number.isFinite(values.ldl)) { mmol.ldl = unit === 'mmol' ? values.ldl : toMmol(values.ldl,'ldl'); mg.ldl = unit === 'mg' ? values.ldl : toMg(values.ldl,'ldl'); }
      mmol.nonhdl = mmol.tc - mmol.hdl; mg.nonhdl = mg.tc - mg.hdl;
      var tcHdl = mg.tc / mg.hdl; var ldlHdl = Number.isFinite(mg.ldl) ? mg.ldl / mg.hdl : NaN; var tgHdl = mg.tg / mg.hdl;
      var remnantMmol = Number.isFinite(mmol.ldl) ? mmol.tc - mmol.hdl - mmol.ldl : NaN; var remnantMg = Number.isFinite(mg.ldl) ? mg.tc - mg.hdl - mg.ldl : NaN;
      root.querySelector('[data-result="nonhdl"]').textContent = format(round(mmol.nonhdl,2),2) + ' mmol/l · ' + format(Math.round(mg.nonhdl),0) + ' mg/dl';
      root.querySelector('[data-result="tc-hdl"]').textContent = format(round(tcHdl,2),2);
      root.querySelector('[data-result="ldl-hdl"]').textContent = Number.isFinite(ldlHdl) ? format(round(ldlHdl,2),2) : T.na;
      root.querySelector('[data-result="tg-hdl"]').textContent = format(round(tgHdl,2),2);
      var warning = root.querySelector('[data-result="panel-warning"]');
      if (Number.isFinite(remnantMmol) && remnantMmol >= 0) { root.querySelector('[data-result="remnant"]').textContent = format(round(remnantMmol,2),2) + ' mmol/l · ' + format(Math.round(remnantMg),0) + ' mg/dl'; warning.hidden = true; warning.textContent = ''; }
      else { root.querySelector('[data-result="remnant"]').textContent = T.na; if (Number.isFinite(remnantMmol) && remnantMmol < 0) { warning.textContent = T.inconsistent; warning.hidden = false; } else { warning.hidden = true; } }
      var rows = [ ['tc', T.tc], ['hdl', T.hdl], ['ldl', T.ldl.replace(/ \(.+?\)/,'')], ['tg', T.tg], ['nonhdl', T.nonhdl] ];
      root.querySelector('[data-result="table-body"]').innerHTML = rows.filter(function (r) { return Number.isFinite(mmol[r[0]]); }).map(function (r) { return '<tr><td>' + r[1] + '</td><td>' + format(round(mmol[r[0]],2),2) + '</td><td>' + format(Math.round(mg[r[0]]),0) + '</td></tr>'; }).join('');
      root.querySelector('[data-result-box="panel"]').hidden = false;
    });

    Array.prototype.slice.call(root.querySelectorAll('[data-reset]')).forEach(function (button) { button.addEventListener('click', function () { var kind = button.getAttribute('data-reset'); root.querySelector('[data-form="' + kind + '"]').reset(); clearError(kind); root.querySelector('[data-result-box="' + kind + '"]').hidden = true; if (kind === 'single') { analyteSelect.value = 'tc'; singleHint.textContent = T.hint_chol; root.querySelector('#mb-lipid-value').focus(); } else { root.querySelector('#mb-panel-tc').focus(); } }); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
