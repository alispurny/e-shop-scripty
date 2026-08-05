/**
 * MyBears — prevodník jednotiek krvných lipidov
 * Zjednotený vizuálny systém podľa MyBears interaktívnej poradne.
 * Funkčná logika, prevodné faktory, interné ID a spôsob vloženia zostávajú zachované.
 *
 * Mount point:
 *   <div id="mb-lipid-converter"></div>
 *
 * Bez externých závislostí. Údaje sa neodosielajú ani neukladajú.
 */
(function () {
  'use strict';

  var T = {"locale":"sk-SK","root":"mb-lipid-converter","style":"mb-lipid-converter-styles","version":"3.0.1-sk-black","title":"Prevodník cholesterolu a lipidových hodnôt","lead":"Prepočítajte celkový cholesterol, LDL, HDL, non-HDL a triglyceridy medzi mmol/l a mg/dl. Z lipidogramu môžete dopočítať aj non-HDL cholesterol a doplnkové pomery.","notice":"<strong>Dôležité:</strong> Prevody a dopočty sú matematické. Kalkulačka neurčuje diagnózu ani liečebný cieľ; cieľové hodnoty sa určujú podľa celkového kardiovaskulárneho rizika a zdravotného stavu.","tabs_label":"Režim prevodníka","tab_single":"Prevod jednej hodnoty","tab_panel":"Výpočet z lipidogramu","single_title":"Prevod mmol/l a mg/dl","analyte":"Ukazovateľ","value":"Hodnota","input_unit":"Zadaná jednotka","analytes":{"tc":"Celkový cholesterol","ldl":"LDL cholesterol","hdl":"HDL cholesterol","nonhdl":"Non-HDL cholesterol","remnant":"Remnant cholesterol","tg":"Triglyceridy"},"hint_chol":"Pre cholesterolové ukazovatele sa používa faktor 38,67.","hint_tg":"Pre triglyceridy sa používa odlišný faktor 88,57.","calculate_single":"Prepočítať hodnotu","reset":"Vymazať údaje","single_result":"Prepočítaná hodnota","factor_label":"Použitý prepočet","panel_title":"Výpočet z lipidového profilu","panel_intro":"Zadajte hodnoty z rovnakého laboratórneho výsledku a v rovnakej jednotke. LDL je voliteľný, ale je potrebný pre pomer LDL/HDL a odhad remnant cholesterolu.","panel_unit":"Jednotka lipidogramu","tc":"Celkový cholesterol","hdl":"HDL cholesterol","ldl":"LDL cholesterol (voliteľne)","tg":"Triglyceridy","panel_hint":"Zadajte laboratórne hodnoty bez textu jednotky. Desatinnú čiarku aj bodku kalkulačka rozpozná.","calculate_panel":"Vyhodnotiť lipidogram","derived_title":"Dopočítané ukazovatele","nonhdl":"Non-HDL cholesterol","tc_hdl":"Pomer celkový cholesterol / HDL","ldl_hdl":"Pomer LDL / HDL","tg_hdl":"Pomer triglyceridy / HDL","remnant":"Odhad remnant cholesterolu","converted_title":"Prevod zadaných hodnôt","indicator":"Ukazovateľ","mmol":"mmol/l","mg":"mg/dl","ratio_note":"Pomer triglyceridov k HDL je vypočítaný z hodnôt v mg/dl, pretože tento spôsob sa často používa v odbornej literatúre. Pomery nie sú samostatné diagnostické testy ani univerzálne liečebné ciele.","remnant_note":"Remnant cholesterol je tu iba aritmetický odhad: celkový cholesterol − LDL − HDL. Ak bol LDL v laboratóriu iba vypočítaný, nejde o úplne nezávislý údaj.","inconsistent":"Zadané hodnoty vedú k zápornému odhadu remnant cholesterolu. Skontrolujte jednotky a prepis laboratórneho výsledku; remnant cholesterol preto nebol zobrazený.","privacy":"Výpočet prebieha iba vo vašom prehliadači. Zadané laboratórne hodnoty sa týmto skriptom nikam neodosielajú ani neukladajú.","na":"Nedá sa vypočítať","errors":{"number":"Zadajte platnú číselnú hodnotu.","single_chol_mmol":"Zadajte hodnotu v rozmedzí 0,1–30,0 mmol/l.","single_chol_mg":"Zadajte hodnotu v rozmedzí 4–1160 mg/dl.","single_tg_mmol":"Zadajte triglyceridy v rozmedzí 0,1–50,0 mmol/l.","single_tg_mg":"Zadajte triglyceridy v rozmedzí 9–4430 mg/dl.","panel_required":"Vyplňte celkový cholesterol, HDL a triglyceridy.","panel_range":"Niektorá zadaná hodnota je mimo povoleného rozmedzia.","panel_relation":"Celkový cholesterol musí byť vyšší ako HDL cholesterol."},"formula_chol_mmol":"{{value}} mmol/l × 38,67 = {{result}} mg/dl.","formula_chol_mg":"{{value}} mg/dl ÷ 38,67 = {{result}} mmol/l.","formula_tg_mmol":"{{value}} mmol/l × 88,57 = {{result}} mg/dl.","formula_tg_mg":"{{value}} mg/dl ÷ 88,57 = {{result}} mmol/l.","region_label":"Interaktívny prevodník cholesterolu a krvných lipidov","table_caption":"Prevod laboratórnych hodnôt krvných lipidov medzi mmol/l a mg/dl"};
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
    style.textContent = String.raw`
/* MyBears unified design layer — based on Interaktivní poradna */
#${ROOT_ID} {
  --mb-green:#2dc26b !important;
  --mb-green-dark:#198d4b !important;
  --mb-green-soft:#f4f8f4 !important;
  --mb-text:#20221f !important;
  --mb-muted:#626760 !important;
  --mb-border:#e5e3dc !important;
  --mb-cream:#faf7ef !important;
  --mb-yellow:#DBC442 !important;
  --mb-yellow-soft:#fff8df !important;
  --mb-danger:#a63a36 !important;
  width:100% !important;
  max-width:1120px !important;
  margin:24px auto 40px !important;
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  font-size:16px !important;
  font-weight:400 !important;
  line-height:1.55 !important;
}
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} *::before,
#${ROOT_ID} *::after {
  box-sizing:border-box !important;
}
#${ROOT_ID} strong,
#${ROOT_ID} b {
  font-weight:700 !important;
}
#${ROOT_ID} button,
#${ROOT_ID} input,
#${ROOT_ID} select {
  font-family:Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid {
  position:relative !important;
  overflow:hidden !important;
  width:100% !important;
  margin:0 !important;
  padding:0 !important;
  border:1px solid var(--mb-border) !important;
  border-radius:18px !important;
  background:#fff !important;
  box-shadow:0 12px 32px rgba(27,35,29,.07) !important;
}
#${ROOT_ID} .mb-lipid::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-lipid__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-lipid__title,
#${ROOT_ID} .mb-lipid__title {
  display:block !important;
  max-width:920px !important;
  margin:0 auto 10px !important;
  padding:0 !important;
  border:0 !important;
  background:none !important;
  box-shadow:none !important;
  color:#000 !important;
  font:700 clamp(25px,3.2vw,30px)/1.16 Arial,Helvetica,sans-serif !important;
  font-style:normal !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-decoration:none !important;
  text-indent:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
  -webkit-text-stroke:0 transparent !important;
}
#${ROOT_ID} h2.mb-lipid__title::before,
#${ROOT_ID} h2.mb-lipid__title::after,
#${ROOT_ID} .mb-lipid__title::before,
#${ROOT_ID} .mb-lipid__title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-lipid__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-lipid__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-lipid__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid__notice strong {
  color:#000 !important;
}
#${ROOT_ID} .mb-lipid__tabs {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:8px !important;
  margin:0 0 22px !important;
  padding:5px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} .mb-lipid__tab {
  flex:1 1 250px !important;
  min-height:46px !important;
  margin:0 !important;
  padding:11px 16px !important;
  border:1px solid transparent !important;
  border-radius:8px !important;
  background:transparent !important;
  box-shadow:none !important;
  color:#000 !important;
  font:700 15px/1.25 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-transform:none !important;
  cursor:pointer !important;
  transition:background .15s ease,border-color .15s ease,color .15s ease,transform .15s ease !important;
}
#${ROOT_ID} .mb-lipid__tab:hover {
  border-color:#b8d9c3 !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-lipid__tab[aria-selected="true"] {
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  box-shadow:none !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-lipid__panel[hidden],
#${ROOT_ID} .mb-lipid__result[hidden],
#${ROOT_ID} .mb-lipid__inline-warning[hidden] {
  display:none !important;
}
#${ROOT_ID} .mb-lipid__panel {
  margin:0 !important;
  padding:22px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h3.mb-lipid__panel-title,
#${ROOT_ID} .mb-lipid__panel-title,
#${ROOT_ID} h4.mb-lipid__subhead,
#${ROOT_ID} .mb-lipid__subhead {
  margin:0 0 9px !important;
  padding:0 !important;
  border:0 !important;
  background:none !important;
  color:#000 !important;
  font:700 19px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} h3.mb-lipid__panel-title::before,
#${ROOT_ID} h3.mb-lipid__panel-title::after,
#${ROOT_ID} h4.mb-lipid__subhead::before,
#${ROOT_ID} h4.mb-lipid__subhead::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-lipid__panel-intro {
  margin:0 0 18px !important;
  padding:0 !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid__grid {
  display:grid !important;
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  gap:16px !important;
  align-items:start !important;
}
#${ROOT_ID} .mb-lipid__grid--panel {
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
}
#${ROOT_ID} .mb-lipid__field {
  min-width:0 !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} label.mb-lipid__label,
#${ROOT_ID} .mb-lipid__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} input.mb-lipid__input,
#${ROOT_ID} select.mb-lipid__select,
#${ROOT_ID} .mb-lipid__input,
#${ROOT_ID} .mb-lipid__select {
  display:block !important;
  width:100% !important;
  min-width:0 !important;
  min-height:48px !important;
  margin:0 !important;
  padding:10px 12px !important;
  border:1px solid #d4d6d1 !important;
  border-radius:8px !important;
  background:#fff !important;
  background-image:none !important;
  box-shadow:none !important;
  color:#000 !important;
  font:400 15px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:left !important;
  text-indent:0 !important;
  text-transform:none !important;
  outline:none !important;
  -webkit-appearance:auto !important;
  appearance:auto !important;
}
#${ROOT_ID} input.mb-lipid__input:hover,
#${ROOT_ID} select.mb-lipid__select:hover {
  border-color:#b9bdb7 !important;
}
#${ROOT_ID} input.mb-lipid__input:focus,
#${ROOT_ID} select.mb-lipid__select:focus,
#${ROOT_ID} input.mb-lipid__input:focus-visible,
#${ROOT_ID} select.mb-lipid__select:focus-visible {
  border-color:var(--mb-green-dark) !important;
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-lipid__hint {
  display:block !important;
  margin:7px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} button.mb-lipid__button,
#${ROOT_ID} .mb-lipid__button {
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  min-width:0 !important;
  min-height:48px !important;
  margin:0 !important;
  padding:12px 24px !important;
  border:2px solid transparent !important;
  border-radius:8px !important;
  box-shadow:none !important;
  font:700 16px/1.15 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-decoration:none !important;
  text-transform:none !important;
  text-shadow:none !important;
  cursor:pointer !important;
  transition:background .15s ease,border-color .15s ease,color .15s ease,transform .15s ease !important;
  -webkit-appearance:none !important;
  appearance:none !important;
}
#${ROOT_ID} .mb-lipid__button:hover {
  transform:translateY(-1px) !important;
}
#${ROOT_ID} .mb-lipid__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-lipid__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-lipid__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-lipid__button--secondary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-lipid__tab:focus-visible,
#${ROOT_ID} .mb-lipid__button:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-lipid__error {
  display:none !important;
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#000 !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid__error.is-visible {
  display:block !important;
}
#${ROOT_ID} .mb-lipid__result {
  margin:24px 0 0 !important;
  padding:22px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:14px !important;
  background:var(--mb-green-soft) !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-lipid__result-label {
  margin:0 0 5px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid__score {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 clamp(32px,5vw,40px)/1.08 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.03em !important;
  text-shadow:none !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-lipid__cards {
  display:grid !important;
  grid-template-columns:repeat(5,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:18px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-lipid__cards--two {
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
}
#${ROOT_ID} .mb-lipid__card {
  min-width:0 !important;
  margin:0 !important;
  padding:15px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-lipid__card-label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid__card-value {
  display:block !important;
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 19px/1.3 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} h4.mb-lipid__subhead,
#${ROOT_ID} .mb-lipid__subhead {
  margin:22px 0 11px !important;
  font-size:17px !important;
}
#${ROOT_ID} .mb-lipid__result > .mb-lipid__subhead:first-child {
  margin-top:0 !important;
}
#${ROOT_ID} .mb-lipid__table-wrap {
  overflow-x:auto !important;
  margin:0 !important;
  padding:0 !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  -webkit-overflow-scrolling:touch !important;
}
#${ROOT_ID} table.mb-lipid__table,
#${ROOT_ID} .mb-lipid__table {
  width:100% !important;
  min-width:540px !important;
  margin:0 !important;
  border:0 !important;
  border-collapse:collapse !important;
  border-spacing:0 !important;
  background:#fff !important;
  table-layout:auto !important;
}
#${ROOT_ID} .mb-lipid__table th,
#${ROOT_ID} .mb-lipid__table td {
  margin:0 !important;
  padding:12px 13px !important;
  border:0 !important;
  border-bottom:1px solid #e8e8e3 !important;
  color:#000 !important;
  font:400 14px/1.4 Arial,Helvetica,sans-serif !important;
  text-align:left !important;
  vertical-align:middle !important;
}
#${ROOT_ID} .mb-lipid__table thead th {
  border-bottom:2px solid var(--mb-yellow) !important;
  background:#20231f !important;
  color:#000 !important;
  font-weight:700 !important;
}
#${ROOT_ID} .mb-lipid__table tbody tr:nth-child(even) {
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} .mb-lipid__table tbody tr:last-child td {
  border-bottom:0 !important;
}
#${ROOT_ID} .mb-lipid__formula {
  margin:15px 0 0 !important;
  padding:12px 14px !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid__warning {
  margin:15px 0 0 !important;
  padding:13px 15px !important;
  border:0 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid__inline-warning {
  margin:15px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #ead6a0 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:400 13px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-lipid__privacy {
  margin:20px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 12px/1.5 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#${ROOT_ID} .mb-lipid__sr-only {
  position:absolute !important;
  width:1px !important;
  height:1px !important;
  padding:0 !important;
  margin:-1px !important;
  overflow:hidden !important;
  clip:rect(0,0,0,0) !important;
  white-space:nowrap !important;
  border:0 !important;
}
@media (max-width:900px) {
  #${ROOT_ID} .mb-lipid__cards {
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  }
}
@media (max-width:760px) {
  #${ROOT_ID} {
    margin:18px auto 30px !important;
  }
  #${ROOT_ID} .mb-lipid {
    border-radius:14px !important;
  }
  #${ROOT_ID} .mb-lipid__head {
    padding:28px 20px 22px !important;
  }
  #${ROOT_ID} .mb-lipid__body {
    padding:24px 20px 28px !important;
  }
  #${ROOT_ID} .mb-lipid__panel,
  #${ROOT_ID} .mb-lipid__result {
    padding:18px !important;
  }
  #${ROOT_ID} .mb-lipid__grid,
  #${ROOT_ID} .mb-lipid__grid--panel {
    grid-template-columns:1fr !important;
  }
  #${ROOT_ID} .mb-lipid__actions {
    flex-direction:column !important;
    align-items:stretch !important;
  }
  #${ROOT_ID} .mb-lipid__button {
    width:100% !important;
  }
}
@media (max-width:480px) {
  #${ROOT_ID} .mb-lipid__tabs {
    flex-direction:column !important;
  }
  #${ROOT_ID} .mb-lipid__tab {
    flex:1 1 auto !important;
    width:100% !important;
  }
  #${ROOT_ID} .mb-lipid__cards,
  #${ROOT_ID} .mb-lipid__cards--two {
    grid-template-columns:1fr !important;
  }
}
@media (prefers-reduced-motion:reduce) {
  #${ROOT_ID} *,
  #${ROOT_ID} *::before,
  #${ROOT_ID} *::after {
    scroll-behavior:auto !important;
    transition:none !important;
    animation:none !important;
  }
}
@media print {
  #${ROOT_ID} {
    max-width:none !important;
    margin:0 !important;
  }
  #${ROOT_ID} .mb-lipid {
    border:1px solid #bbb !important;
    box-shadow:none !important;
  }
  #${ROOT_ID} .mb-lipid__tabs,
  #${ROOT_ID} .mb-lipid__actions,
  #${ROOT_ID} .mb-lipid__privacy {
    display:none !important;
  }
  #${ROOT_ID} .mb-lipid__panel[hidden],
  #${ROOT_ID} .mb-lipid__result[hidden] {
    display:block !important;
  }
}

/* Finální přepis: každý textový prvek je vždy černý. */
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} *::before,
#${ROOT_ID} *::after {
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
  text-decoration-color:#000 !important;
  caret-color:#000 !important;
}
#${ROOT_ID} input::placeholder,
#${ROOT_ID} textarea::placeholder {
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
  opacity:.65 !important;
}
#${ROOT_ID} svg text,
#${ROOT_ID} svg tspan {
  fill:#000 !important;
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
}

`;
    document.head.appendChild(style);
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.setAttribute('data-version', VERSION);
    addStyles();
    var options = Object.keys(T.analytes).map(function (key) { return '<option value="' + key + '">' + T.analytes[key] + '</option>'; }).join('');
    root.innerHTML = '<section class="mb-lipid" role="region" aria-label="' + T.region_label + '">' +
      '<div class="mb-lipid__head"><h2 class="mb-lipid__title">' + T.title + '</h2><p class="mb-lipid__lead">' + T.lead + '</p></div>' +
      '<div class="mb-lipid__body"><p class="mb-lipid__notice">' + T.notice + '</p>' +
      '<div class="mb-lipid__tabs" role="tablist" aria-label="' + T.tabs_label + '">' +
        '<button class="mb-lipid__tab" id="mb-lipid-tab-single" type="button" role="tab" aria-selected="true" aria-controls="mb-lipid-panel-single" data-tab="single">' + T.tab_single + '</button>' +
        '<button class="mb-lipid__tab" id="mb-lipid-tab-panel" type="button" role="tab" aria-selected="false" aria-controls="mb-lipid-panel-panel" data-tab="panel">' + T.tab_panel + '</button>' +
      '</div>' +
      '<section class="mb-lipid__panel" id="mb-lipid-panel-single" role="tabpanel" aria-labelledby="mb-lipid-tab-single">' +
        '<h3 class="mb-lipid__panel-title">' + T.single_title + '</h3>' +
        '<form data-form="single" novalidate><div class="mb-lipid__grid">' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-lipid-analyte">' + T.analyte + '</label><select class="mb-lipid__select" id="mb-lipid-analyte" name="analyte" aria-describedby="mb-lipid-single-hint">' + options + '</select><span class="mb-lipid__hint" id="mb-lipid-single-hint" data-hint="single">' + T.hint_chol + '</span></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-lipid-value">' + T.value + '</label><input class="mb-lipid__input" id="mb-lipid-value" name="value" type="text" inputmode="decimal" autocomplete="off" placeholder="5,2"></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-lipid-unit">' + T.input_unit + '</label><select class="mb-lipid__select" id="mb-lipid-unit" name="unit"><option value="mmol">mmol/l</option><option value="mg">mg/dl</option></select></div>' +
        '</div><div class="mb-lipid__actions"><button class="mb-lipid__button mb-lipid__button--primary" type="submit">' + T.calculate_single + '</button><button class="mb-lipid__button mb-lipid__button--secondary" type="button" data-reset="single">' + T.reset + '</button></div><div class="mb-lipid__error" data-error="single" role="alert" aria-live="assertive"></div></form>' +
        '<div class="mb-lipid__result" data-result-box="single" aria-live="polite" role="status" hidden><p class="mb-lipid__result-label">' + T.single_result + '</p><p class="mb-lipid__score" data-result="single-main"></p><div class="mb-lipid__cards mb-lipid__cards--two"><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.mmol + '</span><strong class="mb-lipid__card-value" data-result="single-mmol"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.mg + '</span><strong class="mb-lipid__card-value" data-result="single-mg"></strong></div></div><p class="mb-lipid__formula" data-result="single-formula"></p></div>' +
      '</section>' +
      '<section class="mb-lipid__panel" id="mb-lipid-panel-panel" role="tabpanel" aria-labelledby="mb-lipid-tab-panel" hidden>' +
        '<h3 class="mb-lipid__panel-title">' + T.panel_title + '</h3><p class="mb-lipid__panel-intro">' + T.panel_intro + '</p>' +
        '<form data-form="panel" novalidate><div class="mb-lipid__grid mb-lipid__grid--panel">' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-unit">' + T.panel_unit + '</label><select class="mb-lipid__select" id="mb-panel-unit" name="unit" aria-describedby="mb-lipid-panel-hint"><option value="mmol">mmol/l</option><option value="mg">mg/dl</option></select><span class="mb-lipid__hint" id="mb-lipid-panel-hint">' + T.panel_hint + '</span></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-tc">' + T.tc + '</label><input class="mb-lipid__input" id="mb-panel-tc" type="text" inputmode="decimal" autocomplete="off" placeholder="5,2"></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-hdl">' + T.hdl + '</label><input class="mb-lipid__input" id="mb-panel-hdl" type="text" inputmode="decimal" autocomplete="off" placeholder="1,4"></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-ldl">' + T.ldl + '</label><input class="mb-lipid__input" id="mb-panel-ldl" type="text" inputmode="decimal" autocomplete="off" placeholder="3,1"></div>' +
          '<div class="mb-lipid__field"><label class="mb-lipid__label" for="mb-panel-tg">' + T.tg + '</label><input class="mb-lipid__input" id="mb-panel-tg" type="text" inputmode="decimal" autocomplete="off" placeholder="1,5"></div>' +
        '</div><div class="mb-lipid__actions"><button class="mb-lipid__button mb-lipid__button--primary" type="submit">' + T.calculate_panel + '</button><button class="mb-lipid__button mb-lipid__button--secondary" type="button" data-reset="panel">' + T.reset + '</button></div><div class="mb-lipid__error" data-error="panel" role="alert" aria-live="assertive"></div></form>' +
        '<div class="mb-lipid__result" data-result-box="panel" aria-live="polite" role="status" hidden><h4 class="mb-lipid__subhead">' + T.derived_title + '</h4><div class="mb-lipid__cards"><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.nonhdl + '</span><strong class="mb-lipid__card-value" data-result="nonhdl"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.tc_hdl + '</span><strong class="mb-lipid__card-value" data-result="tc-hdl"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.ldl_hdl + '</span><strong class="mb-lipid__card-value" data-result="ldl-hdl"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.tg_hdl + '</span><strong class="mb-lipid__card-value" data-result="tg-hdl"></strong></div><div class="mb-lipid__card"><span class="mb-lipid__card-label">' + T.remnant + '</span><strong class="mb-lipid__card-value" data-result="remnant"></strong></div></div>' +
          '<div class="mb-lipid__inline-warning" data-result="panel-warning" hidden></div><h4 class="mb-lipid__subhead">' + T.converted_title + '</h4><div class="mb-lipid__table-wrap"><table class="mb-lipid__table"><caption class="mb-lipid__sr-only">' + T.table_caption + '</caption><thead><tr><th scope="col">' + T.indicator + '</th><th scope="col">' + T.mmol + '</th><th scope="col">' + T.mg + '</th></tr></thead><tbody data-result="table-body"></tbody></table></div><p class="mb-lipid__warning">' + T.ratio_note + '</p><p class="mb-lipid__warning">' + T.remnant_note + '</p></div>' +
      '</section><p class="mb-lipid__privacy">' + T.privacy + '</p></div></section>';

    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-tab]'));
    tabs.forEach(function (tab) { tab.addEventListener('click', function () { var target = tab.getAttribute('data-tab'); tabs.forEach(function (item) { item.setAttribute('aria-selected', item === tab ? 'true' : 'false'); }); root.querySelector('#mb-lipid-panel-single').hidden = target !== 'single'; root.querySelector('#mb-lipid-panel-panel').hidden = target !== 'panel'; }); });

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
