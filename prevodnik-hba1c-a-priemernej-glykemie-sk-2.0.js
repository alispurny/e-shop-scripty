/**
 * MyBears — prevodník HbA1c a priemernej glykémie (CZ/SK)
 * Vizuálne zjednotené podľa šablóny MyBears; všetok text je vynútene čierny.
 * Výpočtová logika a prevodné vzťahy pôvodného nástroja zostávajú zachované.
 */
(function () {
  'use strict';

  var T = {"locale":"sk-SK","root":"mb-hba1c-converter","style":"mb-hba1c-converter-styles","version":"3.1.0-sk-lipid-template","title":"Prevodník HbA1c a priemernej glykémie","lead":"Preveďte HbA1c medzi mmol/mol a percentami, zobrazte odhadovanú priemernú glykémiu a prevádzajte glukózu medzi mmol/l a mg/dl.","notice":"<strong>Dôležité:</strong> Výsledky sú orientačné prevody. Kalkulačka nestanovuje diagnózu ani individuálny liečebný cieľ a odhad eAG nemusí zodpovedať priemeru zo senzora alebo glukomera.","tabs_label":"Režim prevodníka","tab_hba1c":"HbA1c a odhad priemernej glykémie","tab_glucose":"Prevod jednotiek glukózy","hba1c_panel_title":"Prevod HbA1c a výpočet eAG","hba1c_value":"Hodnota HbA1c","input_unit":"Zadaná jednotka","hba1c_hint_ifcc":"Povolené rozpätie: 9–195 mmol/mol.","hba1c_hint_ngsp":"Povolené rozpätie: 3,0–20,0 %.","unit_hint":"Vyberte jednotku uvedenú v laboratórnom výsledku.","calculate_hba1c":"Previesť HbA1c","reset":"Vymazať údaje","result_main_label":"HbA1c v percentách","ifcc_label":"HbA1c – IFCC","ngsp_label":"HbA1c – NGSP/DCCT","eag_mmol_label":"Odhadovaná priemerná glykémia","eag_mg_label":"Odhadovaná priemerná glykémia","badge_below":"Pod hranicou pre prediabetes","badge_prediabetes":"Pásmo spájané s prediabetom","badge_diabetes":"Diagnostická hranica diabetu alebo vyššia","summary_below":"Hodnota je pod laboratórnym rozpätím 5,7–6,4 %, ktoré sa používa na označenie prediabetu. Výsledok je potrebné posudzovať podľa dôvodu vyšetrenia a zdravotného stavu.","summary_prediabetes":"Hodnota sa nachádza v rozpätí 5,7–6,4 %, ktoré sa používa pre prediabetes. Jediný výsledok sám osebe neurčuje ďalší postup; preberte ho s lekárom.","summary_diabetes":"Hodnota 6,5 % alebo vyššia zodpovedá diagnostickej hranici diabetu. Bez jednoznačných príznakov sa diagnóza zvyčajne potvrdzuje opakovaním alebo iným laboratórnym testom. Pri už liečenom diabete táto značka neposudzuje individuálny cieľ liečby.","formula_ifcc":"Prevod: {{value}} mmol/mol × 0,09148 + 2,152 = {{percent}} %.","formula_ngsp":"Prevod: ({{value}} % − 2,152) ÷ 0,09148 = približne {{ifcc}} mmol/mol.","hba1c_warning":"eAG je populačný odhad vypočítaný z HbA1c podľa vzťahu ADAG. Nie je to aktuálna glykémia, priemer zo senzora ani GMI. Výsledok môže byť menej spoľahlivý pri stavoch ovplyvňujúcich červené krvinky alebo hemoglobín.","glucose_panel_title":"Prevod mmol/l a mg/dl","glucose_value":"Hodnota glukózy","glucose_hint_mmol":"Povolené rozpätie: 1,0–40,0 mmol/l.","glucose_hint_mg":"Povolené rozpätie: 18–720 mg/dl.","glucose_unit_hint":"Prevod používa molárnu hmotnosť glukózy 180,182 g/mol.","calculate_glucose":"Previesť glukózu","glucose_result_label":"Prevedená hodnota","glucose_mmol_label":"Glukóza","glucose_mg_label":"Glukóza","formula_mmol":"Prevod: {{value}} mmol/l × 18,0182 = približne {{mg}} mg/dl.","formula_mg":"Prevod: {{value}} mg/dl ÷ 18,0182 = približne {{mmol}} mmol/l.","glucose_warning":"Samotnú hodnotu glukózy nemožno interpretovať bez informácie, či bola nameraná nalačno, po jedle, pri OGTT, glukomerom, senzorom alebo laboratórne.","privacy":"Výpočet prebieha iba vo vašom prehliadači. Zadané hodnoty sa týmto skriptom nikam neodosielajú ani neukladajú.","errors":{"number":"Zadajte platnú číselnú hodnotu.","ifcc":"Zadajte HbA1c v rozpätí 9–195 mmol/mol.","ngsp":"Zadajte HbA1c v rozpätí 3,0–20,0 %.","mmol":"Zadajte glukózu v rozpätí 1,0–40,0 mmol/l.","mg":"Zadajte glukózu v rozpätí 18–720 mg/dl."}};
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
    style.textContent = String.raw`
/* MyBears unified design layer — exact typography system from lipid converter */
#${ROOT_ID} {
  --mb-green:#2dc26b !important;
  --mb-green-dark:#198d4b !important;
  --mb-green-soft:#f4f8f4 !important;
  --mb-text:#000 !important;
  --mb-muted:#000 !important;
  --mb-border:#e5e3dc !important;
  --mb-cream:#faf7ef !important;
  --mb-yellow:#DBC442 !important;
  --mb-yellow-soft:#fff8df !important;
  --mb-danger:#000 !important;
  width:100% !important;
  max-width:1120px !important;
  margin:24px auto 40px !important;
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  font-size:16px !important;
  font-weight:400 !important;
  font-style:normal !important;
  line-height:1.55 !important;
  letter-spacing:0 !important;
}
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} *::before,
#${ROOT_ID} *::after {
  box-sizing:border-box !important;
  font-family:Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} strong,
#${ROOT_ID} b {
  font-weight:700 !important;
}
#${ROOT_ID} button,
#${ROOT_ID} input,
#${ROOT_ID} select,
#${ROOT_ID} textarea,
#${ROOT_ID} option {
  font-family:Arial,Helvetica,sans-serif !important;
  font-style:normal !important;
}
#${ROOT_ID} .mb-a1c {
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
#${ROOT_ID} .mb-a1c::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-a1c__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-a1c__title,
#${ROOT_ID} .mb-a1c__title {
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
#${ROOT_ID} h2.mb-a1c__title::before,
#${ROOT_ID} h2.mb-a1c__title::after,
#${ROOT_ID} .mb-a1c__title::before,
#${ROOT_ID} .mb-a1c__title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-a1c__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-a1c__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-a1c__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-a1c__notice strong {
  color:#000 !important;
}
#${ROOT_ID} .mb-a1c__tabs {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:8px !important;
  margin:0 0 22px !important;
  padding:5px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} .mb-a1c__tab {
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
  font-style:normal !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-transform:none !important;
  text-shadow:none !important;
  cursor:pointer !important;
  transition:background .15s ease,border-color .15s ease,color .15s ease,transform .15s ease !important;
}
#${ROOT_ID} .mb-a1c__tab:hover {
  border-color:#b8d9c3 !important;
  background:#fff !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-a1c__tab[aria-selected="true"] {
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  box-shadow:none !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-a1c__panel[hidden],
#${ROOT_ID} .mb-a1c__result[hidden] {
  display:none !important;
}
#${ROOT_ID} .mb-a1c__panel {
  margin:0 !important;
  padding:22px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h3.mb-a1c__panel-title,
#${ROOT_ID} .mb-a1c__panel-title {
  margin:0 0 13px !important;
  padding:0 !important;
  border:0 !important;
  background:none !important;
  color:#000 !important;
  font:700 19px/1.35 Arial,Helvetica,sans-serif !important;
  font-style:normal !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} h3.mb-a1c__panel-title::before,
#${ROOT_ID} h3.mb-a1c__panel-title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-a1c__grid {
  display:grid !important;
  grid-template-columns:1.2fr .8fr !important;
  gap:16px !important;
  align-items:start !important;
}
#${ROOT_ID} .mb-a1c__field {
  min-width:0 !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} label.mb-a1c__label,
#${ROOT_ID} .mb-a1c__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
  font-style:normal !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} input.mb-a1c__input,
#${ROOT_ID} select.mb-a1c__select,
#${ROOT_ID} .mb-a1c__input,
#${ROOT_ID} .mb-a1c__select {
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
  font-style:normal !important;
  letter-spacing:0 !important;
  text-align:left !important;
  text-indent:0 !important;
  text-transform:none !important;
  outline:none !important;
  -webkit-appearance:auto !important;
  appearance:auto !important;
}
#${ROOT_ID} input.mb-a1c__input:hover,
#${ROOT_ID} select.mb-a1c__select:hover {
  border-color:#b9bdb7 !important;
}
#${ROOT_ID} input.mb-a1c__input:focus,
#${ROOT_ID} select.mb-a1c__select:focus,
#${ROOT_ID} input.mb-a1c__input:focus-visible,
#${ROOT_ID} select.mb-a1c__select:focus-visible {
  border-color:var(--mb-green-dark) !important;
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-a1c__hint {
  display:block !important;
  margin:7px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-a1c__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} button.mb-a1c__button,
#${ROOT_ID} .mb-a1c__button {
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
  color:#000 !important;
  font:700 16px/1.15 Arial,Helvetica,sans-serif !important;
  font-style:normal !important;
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
#${ROOT_ID} .mb-a1c__button:hover {
  transform:translateY(-1px) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-a1c__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-a1c__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-a1c__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-a1c__button--secondary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-a1c__tab:focus-visible,
#${ROOT_ID} .mb-a1c__button:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-a1c__error {
  display:none !important;
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#000 !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-a1c__error.is-visible {
  display:block !important;
}
#${ROOT_ID} .mb-a1c__result {
  margin:24px 0 0 !important;
  padding:22px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:14px !important;
  background:var(--mb-green-soft) !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-a1c__result-top {
  display:flex !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  gap:16px !important;
  flex-wrap:wrap !important;
}
#${ROOT_ID} .mb-a1c__result-label {
  margin:0 0 5px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-a1c__score {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 clamp(32px,5vw,40px)/1.08 Arial,Helvetica,sans-serif !important;
  font-style:normal !important;
  letter-spacing:-.03em !important;
  text-shadow:none !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-a1c__badge {
  display:inline-flex !important;
  align-items:center !important;
  min-height:34px !important;
  max-width:100% !important;
  margin:0 !important;
  padding:6px 11px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#${ROOT_ID} .mb-a1c__summary {
  margin:14px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 15px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-a1c__cards {
  display:grid !important;
  grid-template-columns:repeat(4,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:18px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-a1c__cards--two {
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
}
#${ROOT_ID} .mb-a1c__card {
  min-width:0 !important;
  margin:0 !important;
  padding:15px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-a1c__card-label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-a1c__card-value {
  display:block !important;
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 19px/1.3 Arial,Helvetica,sans-serif !important;
  font-style:normal !important;
  letter-spacing:0 !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-a1c__formula {
  margin:15px 0 0 !important;
  padding:12px 14px !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-a1c__warning {
  margin:15px 0 0 !important;
  padding:13px 15px !important;
  border:0 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-a1c__privacy {
  margin:20px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 12px/1.5 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#${ROOT_ID} input::placeholder,
#${ROOT_ID} textarea::placeholder {
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
  opacity:.65 !important;
  font-family:Arial,Helvetica,sans-serif !important;
}
/* Final hard override: all text is black and all text uses the lipid-template font stack. */
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} *::before,
#${ROOT_ID} *::after {
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
  text-decoration-color:#000 !important;
  caret-color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} svg text,
#${ROOT_ID} svg tspan {
  fill:#000 !important;
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
}
@media (max-width:900px) {
  #${ROOT_ID} .mb-a1c__cards {
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  }
}
@media (max-width:760px) {
  #${ROOT_ID} {
    margin:18px auto 30px !important;
  }
  #${ROOT_ID} .mb-a1c {
    border-radius:14px !important;
  }
  #${ROOT_ID} .mb-a1c__head {
    padding:28px 20px 22px !important;
  }
  #${ROOT_ID} .mb-a1c__body {
    padding:24px 20px 28px !important;
  }
  #${ROOT_ID} .mb-a1c__panel,
  #${ROOT_ID} .mb-a1c__result {
    padding:18px !important;
  }
  #${ROOT_ID} .mb-a1c__grid {
    grid-template-columns:1fr !important;
  }
  #${ROOT_ID} .mb-a1c__actions {
    flex-direction:column !important;
    align-items:stretch !important;
  }
  #${ROOT_ID} .mb-a1c__button {
    width:100% !important;
  }
}
@media (max-width:480px) {
  #${ROOT_ID} .mb-a1c__tabs {
    flex-direction:column !important;
  }
  #${ROOT_ID} .mb-a1c__tab {
    flex:1 1 auto !important;
    width:100% !important;
  }
  #${ROOT_ID} .mb-a1c__cards,
  #${ROOT_ID} .mb-a1c__cards--two {
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
  #${ROOT_ID} .mb-a1c {
    border:1px solid #bbb !important;
    box-shadow:none !important;
  }
  #${ROOT_ID} .mb-a1c__tabs,
  #${ROOT_ID} .mb-a1c__actions,
  #${ROOT_ID} .mb-a1c__privacy {
    display:none !important;
  }
  #${ROOT_ID} .mb-a1c__panel[hidden],
  #${ROOT_ID} .mb-a1c__result[hidden] {
    display:block !important;
  }
}
`;
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
