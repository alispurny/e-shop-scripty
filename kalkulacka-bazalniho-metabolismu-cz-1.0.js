/**
 * MyBears — kalkulačka bazálního metabolismu / bazálneho metabolizmu
 * Sjednocená grafická verze podle převodníku jednotek krevních lipidů.
 * Výpočet probíhá lokálně v prohlížeči.
 */
(function () {
  'use strict';

  var T = {"locale":"cs-CZ","lang":"cs","version":"3.0.0-cz","style_id":"mb-bmr-calculator-styles-cz-v3","region_label":"Interaktivní kalkulačka bazálního metabolismu","title":"Kalkulačka bazálního metabolismu (BMR)","lead":"Spočítejte si orientační klidový energetický výdej podle věku, výšky, hmotnosti a varianty rovnice pro ženy nebo muže.","notice":"<strong>Důležité:</strong> Výsledek je orientační odhad podle rovnice Mifflin–St Jeor. Nejde o přesné laboratorní měření ani o doporučený minimální příjem energie. Kalkulačka je určená pro dospělé od 18 let.","panel_title":"Zadejte své údaje","sex":"Varianta rovnice","female":"Žena","male":"Muž","sex_hint":"Rovnice používá dvě varianty podle pohlaví, pro které byla původně odvozena.","age":"Věk","age_unit":"let","age_placeholder":"např. 35","age_hint":"Povolené rozmezí: 18–100 let","height":"Výška","height_unit":"cm","height_placeholder":"např. 172","height_hint":"Povolené rozmezí: 100–250 cm","weight":"Hmotnost","weight_unit":"kg","weight_placeholder":"např. 74","weight_hint":"Povolené rozmezí: 20–400 kg","activity":"Úroveň aktivity – volitelné","activity_none":"Zobrazit pouze klidový výdej","activity_low":"Nízká aktivita (PAL 1,4)","activity_medium":"Střední aktivita (PAL 1,6)","activity_high":"Vysoká aktivita (PAL 1,8)","activity_very_high":"Velmi vysoká aktivita (PAL 2,0)","activity_hint":"Po výběru se zobrazí také hrubý odhad celkového denního energetického výdeje. Úroveň aktivity bývá obtížné přesně odhadnout.","calculate":"Vypočítat BMR","reset":"Vymazat údaje","result_label":"Orientační klidový energetický výdej","kcal_day":"kcal / den","method":"Mifflin–St Jeor","kj_label":"Přepočet na kilojouly","hour_label":"Průměr za jednu hodinu","inputs_label":"Zadané údaje","tdee_label":"Orientační celkový denní energetický výdej podle zvoleného PAL","result_note":"<strong>Výsledek není automatický kalorický cíl.</strong> Skutečný výdej se může lišit podle tělesného složení, zdravotního stavu, teploty, spánku, pohybu a dalších faktorů. Pro přesnější měření klidového výdeje se používá nepřímá kalorimetrie.","privacy":"Výpočet probíhá pouze ve vašem prohlížeči. Zadaný věk, výška, hmotnost ani zvolená varianta rovnice se tímto skriptem nikam neodesílají ani neukládají.","errors":{"sex":"Vyberte variantu rovnice pro ženu nebo muže.","age":"Zadejte věk v rozmezí 18 až 100 let.","height":"Zadejte výšku v rozmezí 100 až 250 cm.","weight":"Zadejte hmotnost v rozmezí 20 až 400 kg.","activity":"Vyberte platnou úroveň aktivity."},"sex_label":{"female":"žena","male":"muž"},"summary":"Podle zadaných údajů vychází orientační klidový energetický výdej přibližně {{value}} kcal za 24 hodin. Jde o odhad energie spotřebované v klidových podmínkách, nikoliv o přesné laboratorní měření.","formula":"Výpočet: 10 × {{weight}} kg + 6,25 × {{height}} cm − 5 × {{age}} let {{constant}} = přibližně {{result}} kcal / den.","tdee_note":"{{activity}}. Výpočet je BMR/REE × PAL a slouží pouze jako hrubý orientační odhad udržovacího energetického výdeje.","day":"den","hour":"hod"};
  var ROOT_ID = 'mb-bmr-calculator';
  var STYLE_ID = T.style_id;
  var VERSION = T.version;

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

  function replaceTokens(text, values) {
    return Object.keys(values).reduce(function (result, key) {
      return result.replace(new RegExp('\\{\\{' + key + '\\}\\}', 'g'), values[key]);
    }, text);
  }

  function calculateRee(sex, age, height, weight) {
    var base = (10 * weight) + (6.25 * height) - (5 * age);
    return sex === 'male' ? base + 5 : base - 161;
  }

  function addStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = String.raw`
/* MyBears unified design layer — based on the final lipid converter */
#${ROOT_ID} {
  --mb-green:#2dc26b !important;
  --mb-green-dark:#198d4b !important;
  --mb-green-soft:#f4f8f4 !important;
  --mb-border:#e5e3dc !important;
  --mb-cream:#faf7ef !important;
  --mb-yellow:#DBC442 !important;
  --mb-danger:#a63a36 !important;
  width:100% !important;
  max-width:1120px !important;
  margin:24px auto 40px !important;
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  font-size:16px !important;
  font-weight:400 !important;
  line-height:1.55 !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} *::before,
#${ROOT_ID} *::after {
  box-sizing:border-box !important;
  font-family:Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} *,
#${ROOT_ID} input,
#${ROOT_ID} select,
#${ROOT_ID} button,
#${ROOT_ID} option,
#${ROOT_ID} label,
#${ROOT_ID} p,
#${ROOT_ID} span,
#${ROOT_ID} strong,
#${ROOT_ID} h2,
#${ROOT_ID} h3 {
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} strong,
#${ROOT_ID} b { font-weight:700 !important; }
#${ROOT_ID} .mb-bmr {
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
#${ROOT_ID} .mb-bmr::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-bmr__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-bmr__title,
#${ROOT_ID} .mb-bmr__title {
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
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} h2.mb-bmr__title::before,
#${ROOT_ID} h2.mb-bmr__title::after,
#${ROOT_ID} .mb-bmr__title::before,
#${ROOT_ID} .mb-bmr__title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-bmr__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-bmr__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-bmr__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__panel {
  margin:0 !important;
  padding:22px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h3.mb-bmr__panel-title,
#${ROOT_ID} .mb-bmr__panel-title {
  margin:0 0 18px !important;
  padding:0 !important;
  border:0 !important;
  background:none !important;
  color:#000 !important;
  font:700 19px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} h3.mb-bmr__panel-title::before,
#${ROOT_ID} h3.mb-bmr__panel-title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-bmr__grid {
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:18px !important;
  align-items:start !important;
}
#${ROOT_ID} .mb-bmr__field {
  min-width:0 !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-bmr__field--full { grid-column:1 / -1 !important; }
#${ROOT_ID} label.mb-bmr__label,
#${ROOT_ID} .mb-bmr__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 15px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
}
#${ROOT_ID} .mb-bmr__input-wrap { position:relative !important; }
#${ROOT_ID} input.mb-bmr__input,
#${ROOT_ID} select.mb-bmr__select,
#${ROOT_ID} .mb-bmr__input,
#${ROOT_ID} .mb-bmr__select {
  display:block !important;
  width:100% !important;
  min-width:0 !important;
  min-height:48px !important;
  margin:0 !important;
  padding:11px 13px !important;
  border:1px solid #d4d6d1 !important;
  border-radius:8px !important;
  background:#fff !important;
  box-shadow:none !important;
  color:#000 !important;
  font:400 16px/1.3 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  -webkit-appearance:auto !important;
  appearance:auto !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} input.mb-bmr__input { padding-right:58px !important; }
#${ROOT_ID} .mb-bmr__input:hover,
#${ROOT_ID} .mb-bmr__select:hover { border-color:#aeb8b0 !important; }
#${ROOT_ID} .mb-bmr__input:focus,
#${ROOT_ID} .mb-bmr__select:focus {
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  border-color:var(--mb-green-dark) !important;
}
#${ROOT_ID} .mb-bmr__input::placeholder {
  color:#000 !important;
  opacity:.58 !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} .mb-bmr__unit {
  position:absolute !important;
  top:50% !important;
  right:13px !important;
  transform:translateY(-50%) !important;
  color:#000 !important;
  font:400 14px/1 Arial,Helvetica,sans-serif !important;
  pointer-events:none !important;
}
#${ROOT_ID} .mb-bmr__hint {
  display:block !important;
  margin:6px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} button.mb-bmr__button,
#${ROOT_ID} .mb-bmr__button {
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  min-height:48px !important;
  margin:0 !important;
  padding:12px 24px !important;
  border:2px solid transparent !important;
  border-radius:8px !important;
  box-shadow:none !important;
  color:#000 !important;
  font:700 16px/1.25 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-decoration:none !important;
  text-transform:none !important;
  cursor:pointer !important;
  transition:background .15s ease,border-color .15s ease,transform .15s ease !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} .mb-bmr__button:hover { transform:translateY(-1px) !important; }
#${ROOT_ID} .mb-bmr__button:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-bmr__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-bmr__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
}
#${ROOT_ID} .mb-bmr__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-bmr__error {
  display:none !important;
  margin:18px 0 0 !important;
  padding:13px 15px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#000 !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__error.is-visible { display:block !important; }
#${ROOT_ID} .mb-bmr__result[hidden],
#${ROOT_ID} .mb-bmr__tdee[hidden] { display:none !important; }
#${ROOT_ID} .mb-bmr__result {
  margin:28px 0 0 !important;
  padding:24px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:16px !important;
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} .mb-bmr__result-top {
  display:flex !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  flex-wrap:wrap !important;
  gap:16px !important;
}
#${ROOT_ID} .mb-bmr__result-label {
  margin:0 0 5px !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__score-row {
  display:flex !important;
  align-items:baseline !important;
  flex-wrap:wrap !important;
  gap:8px !important;
}
#${ROOT_ID} .mb-bmr__score {
  margin:0 !important;
  color:#000 !important;
  font:800 clamp(38px,6vw,46px)/1 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.035em !important;
}
#${ROOT_ID} .mb-bmr__score-unit {
  color:#000 !important;
  font:700 16px/1.3 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__method {
  display:inline-flex !important;
  align-items:center !important;
  min-height:34px !important;
  padding:6px 11px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft,#fff8df) !important;
  color:#000 !important;
  font:700 14px/1.25 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__summary {
  margin:15px 0 0 !important;
  color:#000 !important;
  font:400 15px/1.58 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__details {
  display:grid !important;
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:20px 0 0 !important;
}
#${ROOT_ID} .mb-bmr__detail {
  min-width:0 !important;
  margin:0 !important;
  padding:15px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-bmr__detail-label,
#${ROOT_ID} .mb-bmr__tdee-label {
  margin:0 0 6px !important;
  color:#000 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__detail-value {
  margin:0 !important;
  overflow-wrap:anywhere !important;
  color:#000 !important;
  font:700 17px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__tdee {
  margin:16px 0 0 !important;
  padding:16px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:12px !important;
  background:#fff8df !important;
}
#${ROOT_ID} .mb-bmr__tdee-value {
  margin:0 !important;
  color:#000 !important;
  font:800 25px/1.25 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__tdee-note,
#${ROOT_ID} .mb-bmr__formula,
#${ROOT_ID} .mb-bmr__result-note,
#${ROOT_ID} .mb-bmr__privacy {
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-bmr__tdee-note {
  margin:8px 0 0 !important;
  font-size:13px !important;
  line-height:1.5 !important;
}
#${ROOT_ID} .mb-bmr__formula {
  margin:15px 0 0 !important;
  font-size:13px !important;
  line-height:1.5 !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-bmr__result-note {
  margin:17px 0 0 !important;
  padding:15px 0 0 !important;
  border-top:1px solid #cfe0d4 !important;
  font-size:13px !important;
  line-height:1.55 !important;
}
#${ROOT_ID} .mb-bmr__privacy {
  margin:18px 0 0 !important;
  padding:0 !important;
  font-size:12px !important;
  line-height:1.5 !important;
}
@media (max-width:760px) {
  #${ROOT_ID} { margin:18px auto 30px !important; }
  #${ROOT_ID} .mb-bmr { border-radius:14px !important; }
  #${ROOT_ID} .mb-bmr__head { padding:28px 20px 22px !important; }
  #${ROOT_ID} .mb-bmr__body { padding:24px 20px 28px !important; }
  #${ROOT_ID} .mb-bmr__panel,
  #${ROOT_ID} .mb-bmr__result { padding:18px !important; }
  #${ROOT_ID} .mb-bmr__grid { grid-template-columns:1fr !important; }
  #${ROOT_ID} .mb-bmr__field--full { grid-column:auto !important; }
  #${ROOT_ID} .mb-bmr__details { grid-template-columns:1fr !important; }
  #${ROOT_ID} .mb-bmr__actions { flex-direction:column !important; align-items:stretch !important; }
  #${ROOT_ID} .mb-bmr__button { width:100% !important; }
}
@media (max-width:480px) {
  #${ROOT_ID} .mb-bmr__result-top { display:block !important; }
  #${ROOT_ID} .mb-bmr__method { margin-top:14px !important; }
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
  #${ROOT_ID} .mb-bmr { border:1px solid #bbb !important; box-shadow:none !important; }
  #${ROOT_ID} .mb-bmr__actions,
  #${ROOT_ID} .mb-bmr__privacy { display:none !important; }
  #${ROOT_ID} .mb-bmr__result[hidden],
  #${ROOT_ID} .mb-bmr__tdee[hidden] { display:block !important; }
}
`;
    document.head.appendChild(style);
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root || root.getAttribute('data-mb-version') === VERSION) return;

    root.setAttribute('data-mb-version', VERSION);
    root.setAttribute('lang', T.lang);
    addStyles();

    root.innerHTML =
      '<section class="mb-bmr" role="region" aria-label="' + T.region_label + '">' +
        '<div class="mb-bmr__head">' +
          '<h2 class="mb-bmr__title" id="mb-bmr-title">' + T.title + '</h2>' +
          '<p class="mb-bmr__lead">' + T.lead + '</p>' +
        '</div>' +
        '<div class="mb-bmr__body">' +
          '<p class="mb-bmr__notice">' + T.notice + '</p>' +
          '<div class="mb-bmr__panel">' +
            '<h3 class="mb-bmr__panel-title">' + T.panel_title + '</h3>' +
            '<form class="mb-bmr__form" novalidate>' +
              '<div class="mb-bmr__grid">' +
                '<div class="mb-bmr__field">' +
                  '<label class="mb-bmr__label" for="mb-bmr-sex">' + T.sex + '</label>' +
                  '<select class="mb-bmr__select" id="mb-bmr-sex" name="sex">' +
                    '<option value="female">' + T.female + '</option>' +
                    '<option value="male">' + T.male + '</option>' +
                  '</select>' +
                  '<span class="mb-bmr__hint">' + T.sex_hint + '</span>' +
                '</div>' +
                '<div class="mb-bmr__field">' +
                  '<label class="mb-bmr__label" for="mb-bmr-age">' + T.age + '</label>' +
                  '<div class="mb-bmr__input-wrap"><input class="mb-bmr__input" id="mb-bmr-age" name="age" type="text" inputmode="decimal" autocomplete="off" placeholder="' + T.age_placeholder + '" aria-describedby="mb-bmr-age-hint"><span class="mb-bmr__unit">' + T.age_unit + '</span></div>' +
                  '<span class="mb-bmr__hint" id="mb-bmr-age-hint">' + T.age_hint + '</span>' +
                '</div>' +
                '<div class="mb-bmr__field">' +
                  '<label class="mb-bmr__label" for="mb-bmr-height">' + T.height + '</label>' +
                  '<div class="mb-bmr__input-wrap"><input class="mb-bmr__input" id="mb-bmr-height" name="height" type="text" inputmode="decimal" autocomplete="off" placeholder="' + T.height_placeholder + '" aria-describedby="mb-bmr-height-hint"><span class="mb-bmr__unit">' + T.height_unit + '</span></div>' +
                  '<span class="mb-bmr__hint" id="mb-bmr-height-hint">' + T.height_hint + '</span>' +
                '</div>' +
                '<div class="mb-bmr__field">' +
                  '<label class="mb-bmr__label" for="mb-bmr-weight">' + T.weight + '</label>' +
                  '<div class="mb-bmr__input-wrap"><input class="mb-bmr__input" id="mb-bmr-weight" name="weight" type="text" inputmode="decimal" autocomplete="off" placeholder="' + T.weight_placeholder + '" aria-describedby="mb-bmr-weight-hint"><span class="mb-bmr__unit">' + T.weight_unit + '</span></div>' +
                  '<span class="mb-bmr__hint" id="mb-bmr-weight-hint">' + T.weight_hint + '</span>' +
                '</div>' +
                '<div class="mb-bmr__field mb-bmr__field--full">' +
                  '<label class="mb-bmr__label" for="mb-bmr-activity">' + T.activity + '</label>' +
                  '<select class="mb-bmr__select" id="mb-bmr-activity" name="activity">' +
                    '<option value="">' + T.activity_none + '</option>' +
                    '<option value="1.4">' + T.activity_low + '</option>' +
                    '<option value="1.6">' + T.activity_medium + '</option>' +
                    '<option value="1.8">' + T.activity_high + '</option>' +
                    '<option value="2.0">' + T.activity_very_high + '</option>' +
                  '</select>' +
                  '<span class="mb-bmr__hint">' + T.activity_hint + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="mb-bmr__error" role="alert" aria-live="assertive" tabindex="-1"></div>' +
              '<div class="mb-bmr__actions">' +
                '<button class="mb-bmr__button mb-bmr__button--primary" type="submit">' + T.calculate + '</button>' +
                '<button class="mb-bmr__button mb-bmr__button--secondary" type="reset">' + T.reset + '</button>' +
              '</div>' +
            '</form>' +
          '</div>' +
          '<div class="mb-bmr__result" aria-live="polite" role="status" hidden>' +
            '<div class="mb-bmr__result-top"><div><p class="mb-bmr__result-label">' + T.result_label + '</p><div class="mb-bmr__score-row"><p class="mb-bmr__score"></p><span class="mb-bmr__score-unit">' + T.kcal_day + '</span></div></div><span class="mb-bmr__method">' + T.method + '</span></div>' +
            '<p class="mb-bmr__summary"></p>' +
            '<div class="mb-bmr__details">' +
              '<div class="mb-bmr__detail"><p class="mb-bmr__detail-label">' + T.kj_label + '</p><p class="mb-bmr__detail-value" data-output="kj"></p></div>' +
              '<div class="mb-bmr__detail"><p class="mb-bmr__detail-label">' + T.hour_label + '</p><p class="mb-bmr__detail-value" data-output="hour"></p></div>' +
              '<div class="mb-bmr__detail"><p class="mb-bmr__detail-label">' + T.inputs_label + '</p><p class="mb-bmr__detail-value" data-output="inputs"></p></div>' +
            '</div>' +
            '<div class="mb-bmr__tdee" hidden><p class="mb-bmr__tdee-label">' + T.tdee_label + '</p><p class="mb-bmr__tdee-value" data-output="tdee"></p><p class="mb-bmr__tdee-note" data-output="tdee-note"></p></div>' +
            '<p class="mb-bmr__formula" data-output="formula"></p>' +
            '<p class="mb-bmr__result-note">' + T.result_note + '</p>' +
          '</div>' +
          '<p class="mb-bmr__privacy">' + T.privacy + '</p>' +
        '</div>' +
      '</section>';

    var form = root.querySelector('.mb-bmr__form');
    var sexInput = root.querySelector('#mb-bmr-sex');
    var ageInput = root.querySelector('#mb-bmr-age');
    var heightInput = root.querySelector('#mb-bmr-height');
    var weightInput = root.querySelector('#mb-bmr-weight');
    var activityInput = root.querySelector('#mb-bmr-activity');
    var errorBox = root.querySelector('.mb-bmr__error');
    var resultBox = root.querySelector('.mb-bmr__result');
    var scoreOutput = root.querySelector('.mb-bmr__score');
    var summaryOutput = root.querySelector('.mb-bmr__summary');
    var kjOutput = root.querySelector('[data-output="kj"]');
    var hourOutput = root.querySelector('[data-output="hour"]');
    var inputsOutput = root.querySelector('[data-output="inputs"]');
    var formulaOutput = root.querySelector('[data-output="formula"]');
    var tdeeBox = root.querySelector('.mb-bmr__tdee');
    var tdeeOutput = root.querySelector('[data-output="tdee"]');
    var tdeeNoteOutput = root.querySelector('[data-output="tdee-note"]');

    function showError(message, field) {
      errorBox.textContent = message;
      errorBox.classList.add('is-visible');
      resultBox.hidden = true;
      if (field) field.focus(); else errorBox.focus();
    }

    function clearError() {
      errorBox.textContent = '';
      errorBox.classList.remove('is-visible');
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError();

      var sex = sexInput.value;
      var age = parseNumber(ageInput.value);
      var height = parseNumber(heightInput.value);
      var weight = parseNumber(weightInput.value);
      var pal = activityInput.value ? Number(activityInput.value) : null;

      if (sex !== 'female' && sex !== 'male') return showError(T.errors.sex, sexInput);
      if (!Number.isFinite(age) || age < 18 || age > 100) return showError(T.errors.age, ageInput);
      if (!Number.isFinite(height) || height < 100 || height > 250) return showError(T.errors.height, heightInput);
      if (!Number.isFinite(weight) || weight < 20 || weight > 400) return showError(T.errors.weight, weightInput);
      if (pal !== null && [1.4, 1.6, 1.8, 2.0].indexOf(pal) === -1) return showError(T.errors.activity, activityInput);

      var ree = calculateRee(sex, age, height, weight);
      var reeRounded = Math.round(ree);
      var kjRounded = Math.round(ree * 4.184);
      var hourly = ree / 24;
      var constantText = sex === 'male' ? '+ 5' : '− 161';

      scoreOutput.textContent = format(reeRounded, 0);
      summaryOutput.textContent = replaceTokens(T.summary, { value: format(reeRounded, 0) });
      kjOutput.textContent = format(kjRounded, 0) + ' kJ / ' + T.day;
      hourOutput.textContent = format(hourly, 1) + ' kcal / ' + T.hour;
      inputsOutput.textContent = format(age, 0) + ' ' + T.age_unit + ' · ' + format(height, 1) + ' cm · ' + format(weight, 1) + ' kg · ' + T.sex_label[sex];
      formulaOutput.textContent = replaceTokens(T.formula, {
        weight: format(weight, 1),
        height: format(height, 1),
        age: format(age, 0),
        constant: constantText,
        result: format(reeRounded, 0)
      });

      if (pal !== null) {
        var tdee = Math.round(ree * pal);
        var selectedText = activityInput.options[activityInput.selectedIndex].text;
        tdeeOutput.textContent = format(tdee, 0) + ' kcal / ' + T.day + ' (' + format(tdee * 4.184, 0) + ' kJ)';
        tdeeNoteOutput.textContent = replaceTokens(T.tdee_note, { activity: selectedText });
        tdeeBox.hidden = false;
      } else {
        tdeeBox.hidden = true;
        tdeeOutput.textContent = '';
        tdeeNoteOutput.textContent = '';
      }

      resultBox.hidden = false;
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      resultBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });

    form.addEventListener('reset', function () {
      window.setTimeout(function () {
        clearError();
        resultBox.hidden = true;
        tdeeBox.hidden = true;
        scoreOutput.textContent = '';
        summaryOutput.textContent = '';
        kjOutput.textContent = '';
        hourOutput.textContent = '';
        inputsOutput.textContent = '';
        formulaOutput.textContent = '';
        tdeeOutput.textContent = '';
        tdeeNoteOutput.textContent = '';
        ageInput.focus();
      }, 0);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once:true });
  } else {
    render();
  }
})();
