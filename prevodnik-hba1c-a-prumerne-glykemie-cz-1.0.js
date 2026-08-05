/**
 * MyBears — převodník HbA1c a průměrné glykémie (CZ/SK)
 * Vizuálně sjednoceno podle šablony MyBears; veškerý text je nuceně černý.
 * Výpočtová logika a převodní vztahy původního nástroje zůstávají zachovány.
 */
(function () {
  'use strict';

  var MYBEARS_UNIFIED_DESIGN_CSS = String.raw`
/* MyBears unified design layer — based on Product Guide v1.8 */
#mb-hba1c-converter {
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
#mb-hba1c-converter *, #mb-hba1c-converter *::before, #mb-hba1c-converter *::after { box-sizing:border-box; }
#mb-hba1c-converter .mb-a1c { position:relative; overflow:hidden; border:1px solid var(--mb-border) !important; border-radius:18px !important; background:#fff !important; box-shadow:0 12px 32px rgba(27,35,29,.07) !important; }
#mb-hba1c-converter .mb-a1c::before { content:""; position:absolute; z-index:3; top:0; left:0; right:0; height:4px; background:var(--mb-gold); }
#mb-hba1c-converter .mb-a1c__head { padding:34px 38px 26px !important; background:var(--mb-cream) !important; border-bottom:1px solid var(--mb-border) !important; }
#mb-hba1c-converter .mb-a1c__body { padding:30px 38px 36px !important; }
#mb-hba1c-converter .mb-a1c__title, #mb-hba1c-converter .mb-a1c__section-title, #mb-hba1c-converter .mb-a1c__panel-title, #mb-hba1c-converter .mb-a1c__subhead { color:var(--mb-green) !important; font-weight:700 !important; letter-spacing:-.01em; }
#mb-hba1c-converter .mb-a1c__title { margin:0 0 10px !important; font-size:clamp(25px,3.2vw,30px) !important; line-height:1.16 !important; }
#mb-hba1c-converter .mb-a1c__lead { max-width:820px; margin:0 !important; color:#454a45 !important; font-size:16px !important; line-height:1.58 !important; }
#mb-hba1c-converter .mb-a1c__notice { margin:0 0 22px !important; padding:15px 17px !important; border:1px solid #eadfc8 !important; border-left:4px solid var(--mb-gold) !important; border-radius:12px !important; background:var(--mb-cream) !important; color:#4f4b43 !important; font-size:14px !important; line-height:1.55 !important; }
#mb-hba1c-converter .mb-a1c__notice strong { color:#292b28; }
#mb-hba1c-converter .mb-a1c__grid { gap:18px !important; }
#mb-hba1c-converter .mb-a1c__field { min-width:0; }
#mb-hba1c-converter .mb-a1c__label { margin-bottom:7px !important; color:#292b28 !important; font-size:15px !important; font-weight:700 !important; }
#mb-hba1c-converter .mb-a1c__input, #mb-hba1c-converter .mb-a1c__select { min-height:48px !important; border:1px solid #d4d6d1 !important; border-radius:8px !important; background:#fff !important; color:var(--mb-text) !important; box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }
#mb-hba1c-converter .mb-a1c__input:hover, #mb-hba1c-converter .mb-a1c__select:hover { border-color:#aeb8b0 !important; }
#mb-hba1c-converter .mb-a1c__input:focus, #mb-hba1c-converter .mb-a1c__select:focus { outline:3px solid rgba(219,196,66,.30) !important; outline-offset:1px; border-color:var(--mb-green-dark) !important; }
#mb-hba1c-converter .mb-a1c__hint, #mb-hba1c-converter .mb-a1c__privacy, #mb-hba1c-converter .mb-a1c__formula, #mb-hba1c-converter .mb-a1c__disclaimer { color:var(--mb-muted) !important; }
#mb-hba1c-converter .mb-a1c__actions { gap:12px !important; margin-top:24px !important; }
#mb-hba1c-converter .mb-a1c__button { display:inline-flex; align-items:center; justify-content:center; min-height:48px !important; padding:12px 24px !important; border:2px solid transparent !important; border-radius:8px !important; font-weight:700 !important; line-height:1.15; transition:background .15s ease,border-color .15s ease,transform .15s ease; }
#mb-hba1c-converter .mb-a1c__button:hover { transform:translateY(-1px); }
#mb-hba1c-converter .mb-a1c__button:focus-visible, #mb-hba1c-converter a:focus-visible, #mb-hba1c-converter summary:focus-visible { outline:3px solid rgba(219,196,66,.38) !important; outline-offset:2px !important; }
#mb-hba1c-converter .mb-a1c__button--primary { min-width:210px; color:#fff !important; background:var(--mb-green) !important; border-color:var(--mb-green) !important; box-shadow:none !important; }
#mb-hba1c-converter .mb-a1c__button--primary:hover { background:var(--mb-green-dark) !important; border-color:var(--mb-green-dark) !important; }
#mb-hba1c-converter .mb-a1c__button--secondary { color:var(--mb-green-dark) !important; background:#fff !important; border-color:var(--mb-green) !important; }
#mb-hba1c-converter .mb-a1c__advanced, #mb-hba1c-converter .mb-a1c__panel, #mb-hba1c-converter .mb-a1c__mode, #mb-hba1c-converter .mb-a1c__tabs { border-color:var(--mb-border) !important; border-radius:12px !important; background:var(--mb-cream) !important; }
#mb-hba1c-converter .mb-a1c__tab, #mb-hba1c-converter .mb-a1c__mode-btn { border-radius:8px !important; color:var(--mb-green-dark) !important; }
#mb-hba1c-converter .mb-a1c__tab[aria-selected="true"], #mb-hba1c-converter .mb-a1c__mode-btn[aria-pressed="true"], #mb-hba1c-converter .mb-a1c__tab.is-active, #mb-hba1c-converter .mb-a1c__mode-btn.is-active { background:var(--mb-green) !important; color:#fff !important; border-color:var(--mb-green) !important; }
#mb-hba1c-converter .mb-a1c__result { margin-top:28px !important; padding:24px !important; border:1px solid #cfe4d5 !important; border-radius:16px !important; background:var(--mb-green-soft) !important; }
#mb-hba1c-converter .mb-a1c__score { color:#20221f !important; font-weight:800 !important; letter-spacing:-.035em; }
#mb-hba1c-converter .mb-a1c__badge { border:1px solid #d7ceb8 !important; background:#fff8df !important; color:#75633d !important; font-weight:700 !important; }
#mb-hba1c-converter .mb-a1c__summary { color:#454a45 !important; }
#mb-hba1c-converter .mb-a1c__metric, #mb-hba1c-converter .mb-a1c__card, #mb-hba1c-converter .mb-a1c__macro, #mb-hba1c-converter .mb-a1c__meal { border:1px solid var(--mb-border) !important; border-radius:12px !important; background:#fff !important; box-shadow:none !important; }
#mb-hba1c-converter .mb-a1c__metric-label, #mb-hba1c-converter .mb-a1c__card-label, #mb-hba1c-converter .mb-a1c__result-label { color:var(--mb-muted) !important; }
#mb-hba1c-converter .mb-a1c__metric-value, #mb-hba1c-converter .mb-a1c__card-value, #mb-hba1c-converter .mb-a1c__macro-value { color:var(--mb-green-dark) !important; }
#mb-hba1c-converter .mb-a1c__warning, #mb-hba1c-converter .mb-a1c__inline-warning { border-left:4px solid var(--mb-gold) !important; border-radius:8px !important; background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important; color:#5d4b1d !important; }
#mb-hba1c-converter .mb-a1c__error { border-color:#e3b3af !important; border-radius:10px !important; background:#fff5f4 !important; color:var(--mb-danger) !important; }
#mb-hba1c-converter .mb-a1c__scale { box-shadow:inset 0 0 0 1px rgba(32,34,31,.10); }
#mb-hba1c-converter .mb-a1c__marker { background:#20231f !important; box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(32,35,31,.18) !important; }
#mb-hba1c-converter .mb-a1c__table-wrap { overflow-x:auto; border:1px solid var(--mb-border) !important; border-radius:12px !important; }
#mb-hba1c-converter .mb-a1c__table { width:100%; border-collapse:collapse; background:#fff; }
#mb-hba1c-converter .mb-a1c__table thead th { border-bottom:2px solid var(--mb-gold) !important; background:#20231f !important; color:#fff !important; }
#mb-hba1c-converter .mb-a1c__table tbody tr:nth-child(even) { background:var(--mb-green-soft) !important; }
@media(max-width:760px) {
  #mb-hba1c-converter { margin:18px auto 30px !important; }
  #mb-hba1c-converter .mb-a1c__head { padding:28px 20px 22px !important; }
  #mb-hba1c-converter .mb-a1c__body { padding:24px 20px 28px !important; }
  #mb-hba1c-converter .mb-a1c__result { padding:20px !important; }
  #mb-hba1c-converter .mb-a1c__actions { flex-direction:column; align-items:stretch; }
  #mb-hba1c-converter .mb-a1c__button { width:100%; }
}
@media(prefers-reduced-motion:reduce) {
  #mb-hba1c-converter *, #mb-hba1c-converter *::before, #mb-hba1c-converter *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}


/* Finální přepis pro Upgates: každý textový prvek je vždy černý. */
#mb-hba1c-converter,
#mb-hba1c-converter *,
#mb-hba1c-converter *::before,
#mb-hba1c-converter *::after {
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
  text-decoration-color:#000 !important;
  caret-color:#000 !important;
}
#mb-hba1c-converter input::placeholder,
#mb-hba1c-converter textarea::placeholder {
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
  opacity:.65 !important;
}
#mb-hba1c-converter svg text,
#mb-hba1c-converter svg tspan {
  fill:#000 !important;
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
}
@media print {
  #mb-hba1c-converter {
    max-width:none !important;
    margin:0 !important;
  }
  #mb-hba1c-converter .mb-a1c {
    border:1px solid #bbb !important;
    box-shadow:none !important;
  }
  #mb-hba1c-converter .mb-a1c__tabs,
  #mb-hba1c-converter .mb-a1c__actions,
  #mb-hba1c-converter .mb-a1c__privacy {
    display:none !important;
  }
  #mb-hba1c-converter .mb-a1c__panel[hidden],
  #mb-hba1c-converter .mb-a1c__result[hidden] {
    display:block !important;
  }
}

`;

  var T = {"locale":"cs-CZ","root":"mb-hba1c-converter","style":"mb-hba1c-converter-styles","version":"3.0.0-cz-black","title":"Převodník HbA1c a průměrné glykémie","lead":"Převeďte HbA1c mezi mmol/mol a procenty, zobrazte odhadovanou průměrnou glykémii a převádějte glukózu mezi mmol/l a mg/dl.","notice":"<strong>Důležité:</strong> Výsledky jsou orientační převody. Kalkulačka nestanovuje diagnózu ani individuální léčebný cíl a odhad eAG nemusí odpovídat průměru ze senzoru nebo glukometru.","tabs_label":"Režim převodníku","tab_hba1c":"HbA1c a odhad průměrné glykémie","tab_glucose":"Převod jednotek glukózy","hba1c_panel_title":"Převod HbA1c a výpočet eAG","hba1c_value":"Hodnota HbA1c","input_unit":"Zadaná jednotka","hba1c_hint_ifcc":"Povolené rozmezí: 9–195 mmol/mol.","hba1c_hint_ngsp":"Povolené rozmezí: 3,0–20,0 %.","unit_hint":"Vyberte jednotku uvedenou v laboratorním výsledku.","calculate_hba1c":"Převést HbA1c","reset":"Vymazat údaje","result_main_label":"HbA1c v procentech","ifcc_label":"HbA1c – IFCC","ngsp_label":"HbA1c – NGSP/DCCT","eag_mmol_label":"Odhadovaná průměrná glykémie","eag_mg_label":"Odhadovaná průměrná glykémie","badge_below":"Pod hranicí pro prediabetes","badge_prediabetes":"Pásmo spojované s prediabetem","badge_diabetes":"Diagnostická hranice diabetu nebo vyšší","summary_below":"Hodnota je pod laboratorním rozmezím 5,7–6,4 %, které se používá pro označení prediabetu. Výsledek je nutné posuzovat podle důvodu vyšetření a zdravotního stavu.","summary_prediabetes":"Hodnota se nachází v rozmezí 5,7–6,4 %, které se používá pro prediabetes. Jediný výsledek sám o sobě neurčuje další postup; proberte jej s lékařem.","summary_diabetes":"Hodnota 6,5 % nebo vyšší odpovídá diagnostické hranici diabetu. Bez jednoznačných příznaků se diagnóza obvykle potvrzuje opakováním nebo jiným laboratorním testem. U již léčeného diabetu tato značka neposuzuje individuální cíl léčby.","formula_ifcc":"Převod: {{value}} mmol/mol × 0,09148 + 2,152 = {{percent}} %.","formula_ngsp":"Převod: ({{value}} % − 2,152) ÷ 0,09148 = přibližně {{ifcc}} mmol/mol.","hba1c_warning":"eAG je populační odhad vypočtený z HbA1c podle vztahu ADAG. Není to aktuální glykémie, průměr ze senzoru ani GMI. Výsledek může být méně spolehlivý při stavech ovlivňujících červené krvinky nebo hemoglobin.","glucose_panel_title":"Převod mmol/l a mg/dl","glucose_value":"Hodnota glukózy","glucose_hint_mmol":"Povolené rozmezí: 1,0–40,0 mmol/l.","glucose_hint_mg":"Povolené rozmezí: 18–720 mg/dl.","glucose_unit_hint":"Převod používá molární hmotnost glukózy 180,182 g/mol.","calculate_glucose":"Převést glukózu","glucose_result_label":"Převedená hodnota","glucose_mmol_label":"Glukóza","glucose_mg_label":"Glukóza","formula_mmol":"Převod: {{value}} mmol/l × 18,0182 = přibližně {{mg}} mg/dl.","formula_mg":"Převod: {{value}} mg/dl ÷ 18,0182 = přibližně {{mmol}} mmol/l.","glucose_warning":"Samotná hodnota glukózy se nedá interpretovat bez informace, zda byla změřena nalačno, po jídle, při OGTT, glukometrem, senzorem nebo laboratorně.","privacy":"Výpočet probíhá pouze ve vašem prohlížeči. Zadané hodnoty se tímto skriptem nikam neodesílají ani neukládají.","errors":{"number":"Zadejte platnou číselnou hodnotu.","ifcc":"Zadejte HbA1c v rozmezí 9–195 mmol/mol.","ngsp":"Zadejte HbA1c v rozmezí 3,0–20,0 %.","mmol":"Zadejte glukózu v rozmezí 1,0–40,0 mmol/l.","mg":"Zadejte glukózu v rozmezí 18–720 mg/dl."}};
  var ROOT_ID = T.root;
  var STYLE_ID = T.style;
  var VERSION = T.version;
  var MGDL_PER_MMOLL = 18.0182;

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

  function toNgsp(ifcc) { return 0.09148 * ifcc + 2.152; }
  function toIfcc(ngsp) { return (ngsp - 2.152) / 0.09148; }
  function toEagMg(ngsp) { return 28.7 * ngsp - 46.7; }

  function classify(ngsp) {
    if (ngsp < 5.7) return { key: 'below', badge: T.badge_below, summary: T.summary_below };
    if (ngsp < 6.5) return { key: 'prediabetes', badge: T.badge_prediabetes, summary: T.summary_prediabetes };
    return { key: 'diabetes', badge: T.badge_diabetes, summary: T.summary_diabetes };
  }

  function addStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${ROOT_ID} { --mb-green:#2dc26b; --mb-green-dark:#168947; --mb-green-soft:#f7fbf8; --mb-border:#d9e5dd; --mb-text:#1f2933; --mb-muted:#59636e; --mb-danger:#b42318; --mb-blue:#eaf4fb; --mb-yellow:#fff8dd; --mb-red:#fff0ee; font-family:Arial,Helvetica,sans-serif; color:var(--mb-text); margin:24px 0; }
#${ROOT_ID} * { box-sizing:border-box; }
#${ROOT_ID} .mb-a1c { border:1px solid var(--mb-border); border-radius:14px; background:#fff; box-shadow:0 8px 28px rgba(31,41,51,.08); overflow:hidden; }
#${ROOT_ID} .mb-a1c__head { padding:22px 22px 16px; background:var(--mb-green-soft); border-bottom:1px solid var(--mb-border); }
#${ROOT_ID} .mb-a1c__title { margin:0 0 8px; font-size:22px; line-height:1.25; }
#${ROOT_ID} .mb-a1c__lead { margin:0; color:var(--mb-muted); font-size:16px; line-height:1.55; }
#${ROOT_ID} .mb-a1c__body { padding:22px; }
#${ROOT_ID} .mb-a1c__notice { margin:0 0 18px; padding:12px 14px; border-left:4px solid var(--mb-green); border-radius:6px; background:#f8faf9; color:var(--mb-muted); font-size:14px; line-height:1.5; }
#${ROOT_ID} .mb-a1c__tabs { display:flex; flex-wrap:wrap; gap:8px; margin:0 0 18px; padding:4px; border:1px solid var(--mb-border); border-radius:10px; background:#f8faf9; }
#${ROOT_ID} .mb-a1c__tab { flex:1 1 240px; min-height:44px; padding:10px 14px; border:0; border-radius:7px; background:transparent; color:var(--mb-text); font:inherit; font-size:15px; font-weight:700; cursor:pointer; }
#${ROOT_ID} .mb-a1c__tab[aria-selected="true"] { background:#fff; color:#0b6d37; box-shadow:0 2px 9px rgba(31,41,51,.09); }
#${ROOT_ID} .mb-a1c__tab:focus-visible { outline:3px solid rgba(45,194,107,.28); outline-offset:2px; }
#${ROOT_ID} .mb-a1c__panel[hidden] { display:none; }
#${ROOT_ID} .mb-a1c__panel-title { margin:0 0 13px; font-size:18px; line-height:1.35; }
#${ROOT_ID} .mb-a1c__grid { display:grid; grid-template-columns:1.2fr .8fr; gap:16px; align-items:start; }
#${ROOT_ID} .mb-a1c__field { min-width:0; }
#${ROOT_ID} .mb-a1c__label { display:block; margin:0 0 7px; font-size:15px; font-weight:700; }
#${ROOT_ID} .mb-a1c__input, #${ROOT_ID} .mb-a1c__select { width:100%; min-height:48px; padding:11px 12px; border:1px solid #b9c6be; border-radius:8px; background:#fff; color:var(--mb-text); font:inherit; font-size:16px; }
#${ROOT_ID} .mb-a1c__input:focus, #${ROOT_ID} .mb-a1c__select:focus { outline:3px solid rgba(45,194,107,.2); border-color:var(--mb-green-dark); }
#${ROOT_ID} .mb-a1c__hint { display:block; margin-top:6px; color:var(--mb-muted); font-size:13px; line-height:1.4; }
#${ROOT_ID} .mb-a1c__actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }
#${ROOT_ID} .mb-a1c__button { min-height:46px; padding:11px 20px; border-radius:8px; border:1px solid transparent; font:inherit; font-size:16px; font-weight:700; cursor:pointer; }
#${ROOT_ID} .mb-a1c__button:focus-visible { outline:3px solid rgba(45,194,107,.28); outline-offset:2px; }
#${ROOT_ID} .mb-a1c__button--primary { background:var(--mb-green); color:#0c2818; border-color:var(--mb-green); box-shadow:0 4px 12px rgba(45,194,107,.22); }
#${ROOT_ID} .mb-a1c__button--secondary { background:#fff; color:var(--mb-text); border-color:#b9c6be; }
#${ROOT_ID} .mb-a1c__error { display:none; margin:16px 0 0; padding:12px 14px; border:1px solid #f1b5b0; border-radius:8px; background:#fff6f5; color:var(--mb-danger); font-size:14px; line-height:1.45; }
#${ROOT_ID} .mb-a1c__error.is-visible { display:block; }
#${ROOT_ID} .mb-a1c__result { margin-top:22px; padding:20px; border:1px solid #b8e7ca; border-radius:12px; background:var(--mb-green-soft); }
#${ROOT_ID} .mb-a1c__result[hidden] { display:none; }
#${ROOT_ID} .mb-a1c__result-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }
#${ROOT_ID} .mb-a1c__result-label { margin:0 0 5px; color:var(--mb-muted); font-size:14px; font-weight:700; }
#${ROOT_ID} .mb-a1c__score { margin:0; font-size:40px; line-height:1.05; font-weight:800; letter-spacing:-.03em; }
#${ROOT_ID} .mb-a1c__badge { display:inline-flex; min-height:34px; align-items:center; max-width:100%; padding:6px 11px; border:1px solid #b9c6be; border-radius:999px; background:#fff; font-size:14px; font-weight:700; text-align:center; }
#${ROOT_ID} .mb-a1c__summary { margin:14px 0 0; font-size:15px; line-height:1.55; }
#${ROOT_ID} .mb-a1c__cards { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-top:18px; }
#${ROOT_ID} .mb-a1c__cards--two { grid-template-columns:repeat(2,minmax(0,1fr)); }
#${ROOT_ID} .mb-a1c__card { min-width:0; padding:14px; border:1px solid #d4e1d8; border-radius:9px; background:#fff; }
#${ROOT_ID} .mb-a1c__card-label { display:block; margin-bottom:7px; color:var(--mb-muted); font-size:13px; font-weight:700; }
#${ROOT_ID} .mb-a1c__card-value { display:block; font-size:20px; font-weight:800; line-height:1.3; word-break:break-word; }
#${ROOT_ID} .mb-a1c__formula { margin:15px 0 0; color:var(--mb-muted); font-size:14px; line-height:1.55; }
#${ROOT_ID} .mb-a1c__warning { margin:15px 0 0; padding-top:15px; border-top:1px solid #cce3d4; color:#3f4f46; font-size:13px; line-height:1.55; }
#${ROOT_ID} .mb-a1c__privacy { margin:14px 0 0; color:var(--mb-muted); font-size:12px; line-height:1.45; }
@media (max-width:860px) {
  #${ROOT_ID} .mb-a1c__cards { grid-template-columns:repeat(2,minmax(0,1fr)); }
}
@media (max-width:640px) {
  #${ROOT_ID} .mb-a1c__grid, #${ROOT_ID} .mb-a1c__cards, #${ROOT_ID} .mb-a1c__cards--two { grid-template-columns:1fr; }
  #${ROOT_ID} .mb-a1c__head, #${ROOT_ID} .mb-a1c__body { padding-left:16px; padding-right:16px; }
  #${ROOT_ID} .mb-a1c__score { font-size:34px; }
}
`;
    style.textContent += MYBEARS_UNIFIED_DESIGN_CSS;
    document.head.appendChild(style);
  }

  function render(root) {
    root.setAttribute('data-version', VERSION);
    root.innerHTML = '' +
      '<section class="mb-a1c" aria-labelledby="mb-a1c-title">' +
        '<div class="mb-a1c__head">' +
          '<h2 class="mb-a1c__title" id="mb-a1c-title">' + T.title + '</h2>' +
          '<p class="mb-a1c__lead">' + T.lead + '</p>' +
        '</div>' +
        '<div class="mb-a1c__body">' +
          '<div class="mb-a1c__notice">' + T.notice + '</div>' +
          '<div class="mb-a1c__tabs" role="tablist" aria-label="' + T.tabs_label + '">' +
            '<button class="mb-a1c__tab" type="button" role="tab" id="mb-a1c-tab-hba1c" aria-controls="mb-a1c-panel-hba1c" aria-selected="true" tabindex="0" data-tab="hba1c">' + T.tab_hba1c + '</button>' +
            '<button class="mb-a1c__tab" type="button" role="tab" id="mb-a1c-tab-glucose" aria-controls="mb-a1c-panel-glucose" aria-selected="false" tabindex="-1" data-tab="glucose">' + T.tab_glucose + '</button>' +
          '</div>' +
          '<section class="mb-a1c__panel" id="mb-a1c-panel-hba1c" role="tabpanel" aria-labelledby="mb-a1c-tab-hba1c">' +
            '<h3 class="mb-a1c__panel-title">' + T.hba1c_panel_title + '</h3>' +
            '<form class="mb-a1c__form" data-form="hba1c" novalidate>' +
              '<div class="mb-a1c__grid">' +
                '<div class="mb-a1c__field"><label class="mb-a1c__label" for="mb-a1c-hba1c-value">' + T.hba1c_value + '</label><input class="mb-a1c__input" id="mb-a1c-hba1c-value" name="value" type="text" inputmode="decimal" autocomplete="off" placeholder="42"><span class="mb-a1c__hint" data-hint="hba1c">' + T.hba1c_hint_ifcc + '</span></div>' +
                '<div class="mb-a1c__field"><label class="mb-a1c__label" for="mb-a1c-hba1c-unit">' + T.input_unit + '</label><select class="mb-a1c__select" id="mb-a1c-hba1c-unit" name="unit"><option value="ifcc">mmol/mol (IFCC)</option><option value="ngsp">% (NGSP/DCCT)</option></select><span class="mb-a1c__hint">' + T.unit_hint + '</span></div>' +
              '</div>' +
              '<div class="mb-a1c__actions"><button class="mb-a1c__button mb-a1c__button--primary" type="submit">' + T.calculate_hba1c + '</button><button class="mb-a1c__button mb-a1c__button--secondary" type="button" data-reset="hba1c">' + T.reset + '</button></div>' +
              '<div class="mb-a1c__error" data-error="hba1c" role="alert" aria-live="assertive"></div>' +
            '</form>' +
            '<div class="mb-a1c__result" data-result-box="hba1c" aria-live="polite" hidden>' +
              '<div class="mb-a1c__result-top"><div><p class="mb-a1c__result-label">' + T.result_main_label + '</p><p class="mb-a1c__score" data-result="main"></p></div><span class="mb-a1c__badge" data-result="badge"></span></div>' +
              '<p class="mb-a1c__summary" data-result="summary"></p>' +
              '<div class="mb-a1c__cards">' +
                '<div class="mb-a1c__card"><span class="mb-a1c__card-label">' + T.ifcc_label + '</span><strong class="mb-a1c__card-value" data-result="ifcc"></strong></div>' +
                '<div class="mb-a1c__card"><span class="mb-a1c__card-label">' + T.ngsp_label + '</span><strong class="mb-a1c__card-value" data-result="ngsp"></strong></div>' +
                '<div class="mb-a1c__card"><span class="mb-a1c__card-label">' + T.eag_mmol_label + '</span><strong class="mb-a1c__card-value" data-result="eag-mmol"></strong></div>' +
                '<div class="mb-a1c__card"><span class="mb-a1c__card-label">' + T.eag_mg_label + '</span><strong class="mb-a1c__card-value" data-result="eag-mg"></strong></div>' +
              '</div>' +
              '<p class="mb-a1c__formula" data-result="hba1c-formula"></p>' +
              '<p class="mb-a1c__warning">' + T.hba1c_warning + '</p>' +
            '</div>' +
          '</section>' +
          '<section class="mb-a1c__panel" id="mb-a1c-panel-glucose" role="tabpanel" aria-labelledby="mb-a1c-tab-glucose" hidden>' +
            '<h3 class="mb-a1c__panel-title">' + T.glucose_panel_title + '</h3>' +
            '<form class="mb-a1c__form" data-form="glucose" novalidate>' +
              '<div class="mb-a1c__grid">' +
                '<div class="mb-a1c__field"><label class="mb-a1c__label" for="mb-a1c-glucose-value">' + T.glucose_value + '</label><input class="mb-a1c__input" id="mb-a1c-glucose-value" name="value" type="text" inputmode="decimal" autocomplete="off" placeholder="5,6"><span class="mb-a1c__hint" data-hint="glucose">' + T.glucose_hint_mmol + '</span></div>' +
                '<div class="mb-a1c__field"><label class="mb-a1c__label" for="mb-a1c-glucose-unit">' + T.input_unit + '</label><select class="mb-a1c__select" id="mb-a1c-glucose-unit" name="unit"><option value="mmol">mmol/l</option><option value="mg">mg/dl</option></select><span class="mb-a1c__hint">' + T.glucose_unit_hint + '</span></div>' +
              '</div>' +
              '<div class="mb-a1c__actions"><button class="mb-a1c__button mb-a1c__button--primary" type="submit">' + T.calculate_glucose + '</button><button class="mb-a1c__button mb-a1c__button--secondary" type="button" data-reset="glucose">' + T.reset + '</button></div>' +
              '<div class="mb-a1c__error" data-error="glucose" role="alert" aria-live="assertive"></div>' +
            '</form>' +
            '<div class="mb-a1c__result" data-result-box="glucose" aria-live="polite" hidden>' +
              '<div class="mb-a1c__result-top"><div><p class="mb-a1c__result-label">' + T.glucose_result_label + '</p><p class="mb-a1c__score" data-result="glucose-main"></p></div></div>' +
              '<div class="mb-a1c__cards mb-a1c__cards--two">' +
                '<div class="mb-a1c__card"><span class="mb-a1c__card-label">' + T.glucose_mmol_label + '</span><strong class="mb-a1c__card-value" data-result="glucose-mmol"></strong></div>' +
                '<div class="mb-a1c__card"><span class="mb-a1c__card-label">' + T.glucose_mg_label + '</span><strong class="mb-a1c__card-value" data-result="glucose-mg"></strong></div>' +
              '</div>' +
              '<p class="mb-a1c__formula" data-result="glucose-formula"></p>' +
              '<p class="mb-a1c__warning">' + T.glucose_warning + '</p>' +
            '</div>' +
          '</section>' +
          '<p class="mb-a1c__privacy">' + T.privacy + '</p>' +
        '</div>' +
      '</section>';

    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-tab]'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-tab');
        tabs.forEach(function (item) {
          var active = item === tab;
          item.setAttribute('aria-selected', active ? 'true' : 'false');
          item.setAttribute('tabindex', active ? '0' : '-1');
        });
        root.querySelector('#mb-a1c-panel-hba1c').hidden = target !== 'hba1c';
        root.querySelector('#mb-a1c-panel-glucose').hidden = target !== 'glucose';
      });
    });



    tabs.forEach(function (tab, index) {
      tab.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        var nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      });
    });

    var hba1cUnit = root.querySelector('#mb-a1c-hba1c-unit');
    var hba1cHint = root.querySelector('[data-hint="hba1c"]');
    hba1cUnit.addEventListener('change', function () {
      hba1cHint.textContent = hba1cUnit.value === 'ifcc' ? T.hba1c_hint_ifcc : T.hba1c_hint_ngsp;
      root.querySelector('#mb-a1c-hba1c-value').placeholder = hba1cUnit.value === 'ifcc' ? '42' : '6,0';
    });

    var glucoseUnit = root.querySelector('#mb-a1c-glucose-unit');
    var glucoseHint = root.querySelector('[data-hint="glucose"]');
    glucoseUnit.addEventListener('change', function () {
      glucoseHint.textContent = glucoseUnit.value === 'mmol' ? T.glucose_hint_mmol : T.glucose_hint_mg;
      root.querySelector('#mb-a1c-glucose-value').placeholder = glucoseUnit.value === 'mmol' ? '5,6' : '101';
    });

    function showError(kind, message, field) {
      var error = root.querySelector('[data-error="' + kind + '"]');
      error.textContent = message;
      error.classList.add('is-visible');
      root.querySelector('[data-result-box="' + kind + '"]').hidden = true;
      if (field) field.focus();
    }
    function clearError(kind) {
      var error = root.querySelector('[data-error="' + kind + '"]');
      error.textContent = '';
      error.classList.remove('is-visible');
    }

    root.querySelector('[data-form="hba1c"]').addEventListener('submit', function (event) {
      event.preventDefault();
      clearError('hba1c');
      var valueInput = root.querySelector('#mb-a1c-hba1c-value');
      var value = parseNumber(valueInput.value);
      var unit = hba1cUnit.value;
      if (!Number.isFinite(value)) return showError('hba1c', T.errors.number, valueInput);
      if (unit === 'ifcc' && (value < 9 || value > 195)) return showError('hba1c', T.errors.ifcc, valueInput);
      if (unit === 'ngsp' && (value < 3 || value > 20)) return showError('hba1c', T.errors.ngsp, valueInput);

      var ifcc = unit === 'ifcc' ? value : toIfcc(value);
      var ngsp = unit === 'ngsp' ? value : toNgsp(value);
      var eagMg = toEagMg(ngsp);
      var eagMmol = eagMg / MGDL_PER_MMOLL;
      var group = classify(ngsp);
      var result = root.querySelector('[data-result-box="hba1c"]');

      root.querySelector('[data-result="main"]').textContent = format(round(ngsp, 1), 1) + ' %';
      root.querySelector('[data-result="badge"]').textContent = group.badge;
      root.querySelector('[data-result="summary"]').textContent = group.summary;
      root.querySelector('[data-result="ifcc"]').textContent = format(Math.round(ifcc), 0) + ' mmol/mol';
      root.querySelector('[data-result="ngsp"]').textContent = format(round(ngsp, 1), 1) + ' %';
      root.querySelector('[data-result="eag-mmol"]').textContent = format(round(eagMmol, 1), 1) + ' mmol/l';
      root.querySelector('[data-result="eag-mg"]').textContent = format(Math.round(eagMg), 0) + ' mg/dl';
      root.querySelector('[data-result="hba1c-formula"]').textContent = unit === 'ifcc' ?
        T.formula_ifcc.replace(/\{\{value\}\}/g, format(value, value % 1 === 0 ? 0 : 1)).replace(/\{\{percent\}\}/g, format(round(ngsp, 1), 1)) :
        T.formula_ngsp.replace(/\{\{value\}\}/g, format(value, 1)).replace(/\{\{ifcc\}\}/g, format(Math.round(ifcc), 0));
      result.hidden = false;
      result.scrollIntoView({ behavior:window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'nearest' });
    });

    root.querySelector('[data-form="glucose"]').addEventListener('submit', function (event) {
      event.preventDefault();
      clearError('glucose');
      var valueInput = root.querySelector('#mb-a1c-glucose-value');
      var value = parseNumber(valueInput.value);
      var unit = glucoseUnit.value;
      if (!Number.isFinite(value)) return showError('glucose', T.errors.number, valueInput);
      if (unit === 'mmol' && (value < 1 || value > 40)) return showError('glucose', T.errors.mmol, valueInput);
      if (unit === 'mg' && (value < 18 || value > 720)) return showError('glucose', T.errors.mg, valueInput);
      var mmol = unit === 'mmol' ? value : value / MGDL_PER_MMOLL;
      var mg = unit === 'mg' ? value : value * MGDL_PER_MMOLL;
      var result = root.querySelector('[data-result-box="glucose"]');
      root.querySelector('[data-result="glucose-main"]').textContent = format(round(mmol, 1), 1) + ' mmol/l';
      root.querySelector('[data-result="glucose-mmol"]').textContent = format(round(mmol, 1), 1) + ' mmol/l';
      root.querySelector('[data-result="glucose-mg"]').textContent = format(Math.round(mg), 0) + ' mg/dl';
      root.querySelector('[data-result="glucose-formula"]').textContent = unit === 'mmol' ?
        T.formula_mmol.replace(/\{\{value\}\}/g, format(value, 1)).replace(/\{\{mg\}\}/g, format(Math.round(mg), 0)) :
        T.formula_mg.replace(/\{\{value\}\}/g, format(value, 0)).replace(/\{\{mmol\}\}/g, format(round(mmol, 1), 1));
      result.hidden = false;
      result.scrollIntoView({ behavior:window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'nearest' });
    });

    Array.prototype.slice.call(root.querySelectorAll('[data-reset]')).forEach(function (button) {
      button.addEventListener('click', function () {
        var kind = button.getAttribute('data-reset');
        var form = root.querySelector('[data-form="' + kind + '"]');
        form.reset();
        clearError(kind);
        root.querySelector('[data-result-box="' + kind + '"]').hidden = true;
        if (kind === 'hba1c') {
          hba1cHint.textContent = T.hba1c_hint_ifcc;
          root.querySelector('#mb-a1c-hba1c-value').placeholder = '42';
          root.querySelector('#mb-a1c-hba1c-value').focus();
        } else {
          glucoseHint.textContent = T.glucose_hint_mmol;
          root.querySelector('#mb-a1c-glucose-value').placeholder = '5,6';
          root.querySelector('#mb-a1c-glucose-value').focus();
        }
      });
    });
  }

  function init() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    addStyles();
    render(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
