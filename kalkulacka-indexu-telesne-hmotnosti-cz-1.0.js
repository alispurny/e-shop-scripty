/**
 * MyBears — BMI kalkulačka pro dospělé / BMI kalkulačka pre dospelých
 * Sjednocený vizuální systém podle poslední šablony převodníku krevních lipidů.
 * Výpočet, klasifikační hranice, interní ID a způsob vložení zůstávají zachované.
 *
 * Mount point:
 *   <div id="mb-bmi-calculator"></div>
 *
 * Bez externích závislostí. Data se neodesílají ani neukládají.
 */
(function () {
  'use strict';

  var T = {"locale":"cs-CZ","version":"5.0.0-cz","title":"BMI kalkulačka pro dospělé","lead":"Zadejte svou výšku a hmotnost. Kalkulačka vypočítá BMI, orientační kategorii a hmotnostní rozmezí odpovídající BMI 18,5–24,9.","notice":"<strong>Důležité:</strong> Kalkulačka je určena pro dospělé od 18 let. Není určena pro děti, dospívající ani pro hodnocení hmotnosti v těhotenství.","height":"Výška","height_ph":"např. 172","height_hint":"Povolené rozmezí: 100–250 cm","weight":"Hmotnost","weight_ph":"např. 74,5","weight_hint":"Povolené rozmezí: 20–400 kg","calculate":"Vypočítat BMI","reset":"Vymazat údaje","result_label":"Vaše orientační BMI","scale_title":"Orientační zařazení výsledku","underweight_scale":"Podváha<br>&lt; 18,5","healthy_scale":"Běžné<br>18,5–24,9","overweight_scale":"Nadváha<br>25–29,9","obesity_scale":"Obezita<br>30 a více","range_label":"Orientační hmotnostní rozmezí","inputs_label":"Zadané údaje","note":"<strong>Výsledek je orientační.</strong> BMI nerozlišuje tukovou, svalovou a kostní hmotu a samo o sobě neurčuje zdravotní stav. Při nechtěném úbytku či nárůstu hmotnosti nebo zdravotních potížích se obraťte na lékaře.","privacy":"Výpočet probíhá pouze ve vašem prohlížeči. Zadaná výška ani hmotnost se tímto skriptem nikam neodesílají ani neukládají.","region_label":"Interaktivní BMI kalkulačka pro dospělé","formula":"Výpočet: {{weight}} kg ÷ ({{height}} m × {{height}} m) = BMI {{bmi}}.","errors":{"number":"Vyplňte prosím výšku i hmotnost jako číslo. Můžete použít desetinnou čárku nebo tečku.","height":"Zkontrolujte zadanou výšku. Kalkulačka přijímá hodnoty od 100 do 250 cm.","weight":"Zkontrolujte zadanou hmotnost. Kalkulačka přijímá hodnoty od 20 do 400 kg."},"categories":[{"max":18.5,"label":"Podváha","key":"underweight","summary":"Výsledek spadá do pásma podváhy. BMI samo neukazuje příčinu nižší hmotnosti ani stav výživy."},{"max":25,"label":"Běžné rozmezí","key":"healthy","summary":"Výsledek spadá do běžného referenčního rozmezí BMI pro dospělé. Celkový zdravotní stav ale nelze posoudit pouze podle BMI."},{"max":30,"label":"Nadváha","key":"overweight","summary":"Výsledek spadá do pásma nadváhy. Pro přesnější posouzení má smysl zohlednit také obvod pasu, tělesné složení a další zdravotní ukazatele."},{"max":35,"label":"Obezita I. stupně","key":"obesity-1","summary":"Výsledek spadá do pásma obezity I. stupně. BMI je orientační screeningový údaj, nikoliv samostatná diagnóza."},{"max":40,"label":"Obezita II. stupně","key":"obesity-2","summary":"Výsledek spadá do pásma obezity II. stupně. Individuální význam je vhodné posoudit společně s lékařem a dalšími zdravotními ukazateli."},{"max":null,"label":"Obezita III. stupně","key":"obesity-3","summary":"Výsledek spadá do pásma obezity III. stupně. Pro bezpečné posouzení zdravotního stavu a dalšího postupu je vhodná konzultace s lékařem."}]};
  var ROOT_ID = 'mb-bmi-calculator';
  var STYLE_ID = 'mb-bmi-calculator-styles';
  var VERSION = T.version;
  var SCALE_MIN_BMI = 14;
  var SCALE_MAX_BMI = 40;
  var SCALE_UNDERWEIGHT_END = 18.5;
  var SCALE_HEALTHY_END = 25;
  var SCALE_OVERWEIGHT_END = 30;

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    var clean = value.trim().replace(/\s+/g, '');
    if (clean === '') return NaN;
    return Number(clean.replace(',', '.'));
  }

  function format(value, decimals) {
    return new Intl.NumberFormat(T.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function getCategory(bmi) {
    for (var i = 0; i < T.categories.length; i += 1) {
      if (T.categories[i].max === null || bmi < T.categories[i].max) return T.categories[i];
    }
    return T.categories[T.categories.length - 1];
  }

  function markerPosition(bmi) {
    var clamped = Math.min(Math.max(bmi, SCALE_MIN_BMI), SCALE_MAX_BMI);
    var underweightWidth = ((SCALE_UNDERWEIGHT_END - SCALE_MIN_BMI) / (SCALE_MAX_BMI - SCALE_MIN_BMI)) * 100;
    var healthyWidth = ((SCALE_HEALTHY_END - SCALE_UNDERWEIGHT_END) / (SCALE_MAX_BMI - SCALE_MIN_BMI)) * 100;
    var overweightWidth = ((SCALE_OVERWEIGHT_END - SCALE_HEALTHY_END) / (SCALE_MAX_BMI - SCALE_MIN_BMI)) * 100;
    var obesityStart = underweightWidth + healthyWidth + overweightWidth;

    if (clamped <= SCALE_UNDERWEIGHT_END) {
      return ((clamped - SCALE_MIN_BMI) / (SCALE_UNDERWEIGHT_END - SCALE_MIN_BMI)) * underweightWidth;
    }
    if (clamped <= SCALE_HEALTHY_END) {
      return underweightWidth + ((clamped - SCALE_UNDERWEIGHT_END) / (SCALE_HEALTHY_END - SCALE_UNDERWEIGHT_END)) * healthyWidth;
    }
    if (clamped <= SCALE_OVERWEIGHT_END) {
      return underweightWidth + healthyWidth + ((clamped - SCALE_HEALTHY_END) / (SCALE_OVERWEIGHT_END - SCALE_HEALTHY_END)) * overweightWidth;
    }
    return obesityStart + ((clamped - SCALE_OVERWEIGHT_END) / (SCALE_MAX_BMI - SCALE_OVERWEIGHT_END)) * (100 - obesityStart);
  }

  function addStyles() {
    var styleIds = [STYLE_ID, 'mb-unified-kalkulacka-indexu-telesne-hmotnosti-styles'];
    styleIds.forEach(function (id) {
      var old = document.getElementById(id);
      if (old && old.parentNode) old.parentNode.removeChild(old);
    });

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = String.raw`
/* MyBears unified design layer — based on the blood-lipid converter */
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
  line-height:1.55 !important;
}
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} *::before,
#${ROOT_ID} *::after {
  box-sizing:border-box !important;
}
#${ROOT_ID} *,
#${ROOT_ID} input,
#${ROOT_ID} button,
#${ROOT_ID} label,
#${ROOT_ID} span,
#${ROOT_ID} p,
#${ROOT_ID} h2,
#${ROOT_ID} strong {
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} strong,
#${ROOT_ID} b { font-weight:700 !important; }
#${ROOT_ID} .mb-bmi {
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
#${ROOT_ID} .mb-bmi::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-bmi__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-bmi__title,
#${ROOT_ID} .mb-bmi__title {
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
#${ROOT_ID} h2.mb-bmi__title::before,
#${ROOT_ID} h2.mb-bmi__title::after,
#${ROOT_ID} .mb-bmi__title::before,
#${ROOT_ID} .mb-bmi__title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-bmi__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-bmi__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-bmi__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmi__form-panel {
  margin:0 !important;
  padding:22px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} .mb-bmi__grid {
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:16px !important;
  align-items:start !important;
}
#${ROOT_ID} .mb-bmi__field {
  min-width:0 !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} label.mb-bmi__label,
#${ROOT_ID} .mb-bmi__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-bmi__input-wrap {
  position:relative !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} input.mb-bmi__input,
#${ROOT_ID} .mb-bmi__input {
  display:block !important;
  width:100% !important;
  min-width:0 !important;
  min-height:48px !important;
  margin:0 !important;
  padding:10px 52px 10px 12px !important;
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
#${ROOT_ID} input.mb-bmi__input::placeholder {
  color:#000 !important;
  opacity:.58 !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} input.mb-bmi__input:hover { border-color:#b9bdb7 !important; }
#${ROOT_ID} input.mb-bmi__input:focus,
#${ROOT_ID} input.mb-bmi__input:focus-visible {
  border-color:var(--mb-green-dark) !important;
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-bmi__unit {
  position:absolute !important;
  top:50% !important;
  right:12px !important;
  transform:translateY(-50%) !important;
  color:#000 !important;
  font:400 14px/1 Arial,Helvetica,sans-serif !important;
  pointer-events:none !important;
}
#${ROOT_ID} .mb-bmi__hint {
  display:block !important;
  margin:7px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmi__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} button.mb-bmi__button,
#${ROOT_ID} .mb-bmi__button {
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
#${ROOT_ID} .mb-bmi__button:hover { transform:translateY(-1px) !important; }
#${ROOT_ID} .mb-bmi__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-bmi__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-bmi__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-bmi__button--secondary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-bmi__button:focus-visible,
#${ROOT_ID} .mb-bmi__result:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-bmi__error {
  display:none !important;
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#000 !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmi__error.is-visible { display:block !important; }
#${ROOT_ID} .mb-bmi__result[hidden] { display:none !important; }
#${ROOT_ID} .mb-bmi__result {
  margin:24px 0 0 !important;
  padding:22px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:14px !important;
  background:var(--mb-green-soft) !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-bmi__result-top {
  display:flex !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  flex-wrap:wrap !important;
  gap:16px !important;
  margin:0 !important;
}
#${ROOT_ID} .mb-bmi__result-label {
  margin:0 0 5px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmi__score {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 clamp(32px,5vw,40px)/1.08 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.03em !important;
  text-shadow:none !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-bmi__category {
  display:inline-flex !important;
  align-items:center !important;
  min-height:36px !important;
  margin:0 !important;
  padding:7px 12px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:700 14px/1.25 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmi__summary {
  margin:15px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 15px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmi__scale-wrap { margin:20px 0 0 !important; }
#${ROOT_ID} .mb-bmi__scale-title {
  margin:0 0 9px !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmi__scale {
  position:relative !important;
  height:16px !important;
  overflow:visible !important;
  border-radius:999px !important;
  background:linear-gradient(to right,#9ec5e5 0%,#9ec5e5 17.307692%,#6fcf97 17.307692%,#6fcf97 42.307692%,#f1c75b 42.307692%,#f1c75b 61.538461%,#e58b82 61.538461%,#e58b82 100%) !important;
}
#${ROOT_ID} .mb-bmi__segment { display:none !important; }
#${ROOT_ID} .mb-bmi__marker {
  position:absolute !important;
  z-index:2 !important;
  top:-5px !important;
  width:4px !important;
  height:26px !important;
  border-radius:4px !important;
  background:#000 !important;
  transform:translateX(-50%) !important;
  box-shadow:0 0 0 2px #fff !important;
}
#${ROOT_ID} .mb-bmi__scale-labels {
  display:grid !important;
  grid-template-columns:17.307692% 25% 19.230769% 38.461539% !important;
  gap:0 !important;
  margin:8px 0 0 !important;
  color:#000 !important;
  font:400 11px/1.3 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#${ROOT_ID} .mb-bmi__details {
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:20px 0 0 !important;
}
#${ROOT_ID} .mb-bmi__detail {
  min-width:0 !important;
  margin:0 !important;
  padding:15px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-bmi__detail-label {
  margin:0 0 7px !important;
  color:#000 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmi__detail-value {
  margin:0 !important;
  color:#000 !important;
  font:800 19px/1.3 Arial,Helvetica,sans-serif !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-bmi__formula {
  margin:15px 0 0 !important;
  padding:12px 14px !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-bmi__result-note {
  margin:15px 0 0 !important;
  padding:13px 15px !important;
  border:0 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmi__privacy {
  margin:20px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 12px/1.5 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
@media (max-width:760px) {
  #${ROOT_ID} { margin:18px auto 30px !important; }
  #${ROOT_ID} .mb-bmi { border-radius:14px !important; }
  #${ROOT_ID} .mb-bmi__head { padding:28px 20px 22px !important; }
  #${ROOT_ID} .mb-bmi__body { padding:24px 20px 28px !important; }
  #${ROOT_ID} .mb-bmi__form-panel,
  #${ROOT_ID} .mb-bmi__result { padding:18px !important; }
  #${ROOT_ID} .mb-bmi__grid,
  #${ROOT_ID} .mb-bmi__details { grid-template-columns:1fr !important; }
  #${ROOT_ID} .mb-bmi__actions { flex-direction:column !important; align-items:stretch !important; }
  #${ROOT_ID} .mb-bmi__button { width:100% !important; }
}
@media (max-width:480px) {
  #${ROOT_ID} .mb-bmi__scale-labels { font-size:10px !important; }
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
  #${ROOT_ID} { max-width:none !important; margin:0 !important; }
  #${ROOT_ID} .mb-bmi { border:1px solid #bbb !important; box-shadow:none !important; }
  #${ROOT_ID} .mb-bmi__actions,
  #${ROOT_ID} .mb-bmi__privacy { display:none !important; }
  #${ROOT_ID} .mb-bmi__result[hidden] { display:block !important; }
}
`;
    document.head.appendChild(style);
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    if (root.getAttribute('data-mb-version') === VERSION) return;

    root.setAttribute('data-mb-ready', 'true');
    root.setAttribute('data-mb-version', VERSION);
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', T.region_label);
    addStyles();

    root.innerHTML =
      '<section class="mb-bmi" aria-labelledby="mb-bmi-title">' +
        '<header class="mb-bmi__head"><h2 class="mb-bmi__title" id="mb-bmi-title">' + T.title + '</h2><p class="mb-bmi__lead">' + T.lead + '</p></header>' +
        '<div class="mb-bmi__body">' +
          '<p class="mb-bmi__notice">' + T.notice + '</p>' +
          '<form class="mb-bmi__form-panel" id="mb-bmi-form" novalidate>' +
            '<div class="mb-bmi__grid">' +
              '<div class="mb-bmi__field"><label class="mb-bmi__label" for="mb-bmi-height">' + T.height + '</label><div class="mb-bmi__input-wrap"><input class="mb-bmi__input" id="mb-bmi-height" name="height" type="text" inputmode="decimal" autocomplete="off" placeholder="' + T.height_ph + '" aria-describedby="mb-bmi-height-hint"><span class="mb-bmi__unit" aria-hidden="true">cm</span></div><span class="mb-bmi__hint" id="mb-bmi-height-hint">' + T.height_hint + '</span></div>' +
              '<div class="mb-bmi__field"><label class="mb-bmi__label" for="mb-bmi-weight">' + T.weight + '</label><div class="mb-bmi__input-wrap"><input class="mb-bmi__input" id="mb-bmi-weight" name="weight" type="text" inputmode="decimal" autocomplete="off" placeholder="' + T.weight_ph + '" aria-describedby="mb-bmi-weight-hint"><span class="mb-bmi__unit" aria-hidden="true">kg</span></div><span class="mb-bmi__hint" id="mb-bmi-weight-hint">' + T.weight_hint + '</span></div>' +
            '</div>' +
            '<div class="mb-bmi__error" id="mb-bmi-error" role="alert" aria-live="assertive"></div>' +
            '<div class="mb-bmi__actions"><button class="mb-bmi__button mb-bmi__button--primary" type="submit">' + T.calculate + '</button><button class="mb-bmi__button mb-bmi__button--secondary" type="reset">' + T.reset + '</button></div>' +
          '</form>' +
          '<section class="mb-bmi__result" id="mb-bmi-result" aria-live="polite" tabindex="-1" hidden>' +
            '<div class="mb-bmi__result-top"><div><p class="mb-bmi__result-label">' + T.result_label + '</p><p class="mb-bmi__score" id="mb-bmi-score">–</p></div><span class="mb-bmi__category" id="mb-bmi-category">–</span></div>' +
            '<p class="mb-bmi__summary" id="mb-bmi-summary"></p>' +
            '<div class="mb-bmi__scale-wrap" aria-hidden="true"><p class="mb-bmi__scale-title">' + T.scale_title + '</p><div class="mb-bmi__scale"><span class="mb-bmi__marker" id="mb-bmi-marker"></span></div><div class="mb-bmi__scale-labels"><span>' + T.underweight_scale + '</span><span>' + T.healthy_scale + '</span><span>' + T.overweight_scale + '</span><span>' + T.obesity_scale + '</span></div></div>' +
            '<div class="mb-bmi__details"><div class="mb-bmi__detail"><p class="mb-bmi__detail-label">' + T.range_label + '</p><p class="mb-bmi__detail-value" id="mb-bmi-range">–</p></div><div class="mb-bmi__detail"><p class="mb-bmi__detail-label">' + T.inputs_label + '</p><p class="mb-bmi__detail-value" id="mb-bmi-inputs">–</p></div></div>' +
            '<p class="mb-bmi__formula" id="mb-bmi-formula"></p><p class="mb-bmi__result-note">' + T.note + '</p>' +
          '</section>' +
          '<p class="mb-bmi__privacy">' + T.privacy + '</p>' +
        '</div>' +
      '</section>';

    var form = root.querySelector('#mb-bmi-form');
    var heightInput = root.querySelector('#mb-bmi-height');
    var weightInput = root.querySelector('#mb-bmi-weight');
    var errorBox = root.querySelector('#mb-bmi-error');
    var resultBox = root.querySelector('#mb-bmi-result');
    var scoreEl = root.querySelector('#mb-bmi-score');
    var categoryEl = root.querySelector('#mb-bmi-category');
    var summaryEl = root.querySelector('#mb-bmi-summary');
    var markerEl = root.querySelector('#mb-bmi-marker');
    var rangeEl = root.querySelector('#mb-bmi-range');
    var inputsEl = root.querySelector('#mb-bmi-inputs');
    var formulaEl = root.querySelector('#mb-bmi-formula');

    function showError(message, field) {
      errorBox.textContent = message;
      errorBox.classList.add('is-visible');
      resultBox.hidden = true;
      if (field) field.focus();
    }

    function clearError() {
      errorBox.textContent = '';
      errorBox.classList.remove('is-visible');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError();

      var heightCm = parseNumber(heightInput.value);
      var weightKg = parseNumber(weightInput.value);

      if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) return showError(T.errors.number, !Number.isFinite(heightCm) ? heightInput : weightInput);
      if (heightCm < 100 || heightCm > 250) return showError(T.errors.height, heightInput);
      if (weightKg < 20 || weightKg > 400) return showError(T.errors.weight, weightInput);

      var heightM = heightCm / 100;
      var rawBmi = weightKg / (heightM * heightM);
      var bmi = Math.round((rawBmi + Number.EPSILON) * 10) / 10;
      var category = getCategory(bmi);
      var lowerWeight = 18.5 * heightM * heightM;
      var upperWeight = 24.9 * heightM * heightM;
      var position = markerPosition(bmi);

      scoreEl.textContent = format(bmi, 1);
      categoryEl.textContent = category.label;
      categoryEl.setAttribute('data-category', category.key);
      summaryEl.textContent = category.summary;
      markerEl.style.left = position.toFixed(6) + '%';
      markerEl.setAttribute('title', 'BMI ' + format(bmi, 1) + ' – ' + category.label);
      markerEl.setAttribute('data-bmi', bmi.toFixed(1));
      markerEl.setAttribute('data-position', position.toFixed(6));
      rangeEl.textContent = format(lowerWeight, 1) + '–' + format(upperWeight, 1) + ' kg';
      inputsEl.textContent = format(heightCm, 1) + ' cm / ' + format(weightKg, 1) + ' kg';
      formulaEl.textContent = T.formula.replace('{{weight}}', format(weightKg, 1)).replace(/\{\{height\}\}/g, format(heightM, 2)).replace('{{bmi}}', format(bmi, 1));

      resultBox.hidden = false;
      try { resultBox.focus({ preventScroll:true }); } catch (e) { resultBox.focus(); }
    });

    form.addEventListener('reset', function () {
      window.setTimeout(function () {
        clearError();
        resultBox.hidden = true;
        scoreEl.textContent = '–';
        categoryEl.textContent = '–';
        categoryEl.removeAttribute('data-category');
        summaryEl.textContent = '';
        rangeEl.textContent = '–';
        inputsEl.textContent = '–';
        formulaEl.textContent = '';
        markerEl.style.left = '0%';
        markerEl.removeAttribute('data-bmi');
        markerEl.removeAttribute('data-position');
        heightInput.focus();
      }, 0);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
