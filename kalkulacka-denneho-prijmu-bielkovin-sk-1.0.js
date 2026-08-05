/**
 * MyBears — kalkulačka denního příjmu bílkovin
 * Sjednocená grafická verze podle šablony převodníku krevních lipidů.
 * Funkční logika výpočtu zůstává zachována.
 */
(function () {
  'use strict';

  var T = {"locale":"sk-SK","version":"3.0.0-sk","root":"mb-protein-intake-calculator","style":"mb-protein-intake-calculator-styles","region_label":"Interaktívna kalkulačka denného príjmu bielkovín","title":"Kalkulačka príjmu bielkovín","lead":"Odhadnite orientačné denné rozpätie bielkovín podľa hmotnosti, veku, pohybovej aktivity a cieľa.","notice":"<strong>Dôležité:</strong> Výsledok je pracovné rozpätie pre zdravých dospelých. Nie je určený pre deti, tehotenstvo, ochorenia obličiek ani klinickú výživu.","weight":"Telesná hmotnosť","weight_hint":"Výpočet používa aktuálnu hmotnosť. Pri výrazne vyššom podiele telesného tuku môže byť vhodná individuálna výpočtová hmotnosť od odborníka.","height":"Výška (voliteľne)","height_hint":"Slúži iba na orientačné upozornenie pri vyššom BMI; nemení samotný výpočet.","age":"Vek","activity":"Pohybová aktivita","goal":"Hlavný cieľ","meals":"Počet hlavných jedál za deň","activity_options":[["low","Nízka – bez pravidelného športu"],["endurance","Vytrvalostný šport"],["mixed","Kombinovaný šport a pravidelný pohyb"],["strength","Silový tréning"]],"goal_options":[["maintain","Bežný príjem a udržanie"],["muscle","Budovanie alebo udržanie svalov"],["reduction","Redukcia hmotnosti so zachovaním svalov"]],"calculate":"Vypočítať príjem","reset":"Vymazať údaje","result_label":"Orientačný denný príjem bielkovín","badge":"Pracovné rozpätie","summary_prefix":"Pre zvolený profil kalkulačka používa rozpätie","scale_title":"Použité rozpätie v gramoch na kilogram hmotnosti","midpoint":"Stred rozpätia","per_meal":"Pri rovnomernom rozdelení na jedno jedlo","energy":"Energia zo stredu rozpätia","profile":"Použitý profil","formula":"Výpočet","privacy":"Výpočet prebieha iba vo vašom prehliadači. Zadané údaje sa týmto skriptom nikam neodosielajú ani neukladajú.","units":{"years":"rokov","g_day":"g/deň","kcal_day":"kcal/deň","gkg_day":"g/kg/deň"},"errors":{"weight":"Zadajte telesnú hmotnosť v rozmedzí 30–250 kg.","height":"Výšku ponechajte prázdnu alebo zadajte hodnotu 120–230 cm.","age":"Zadajte vek v rozmedzí 18–100 rokov.","meals":"Vyberte počet hlavných jedál za deň.","generic":"Výpočet sa nepodarilo dokončiť. Skontrolujte zadané údaje."},"profiles":{"general":"bežný režim","older":"vek 65+","endurance":"vytrvalostný šport","mixed":"kombinovaný šport","strength":"silový tréning","muscle":"cieľ budovania svalov","reduction":"redukčný režim"},"warnings":{"base":"Ide o orientačné rozpätie, nie o povinný cieľ. Dôležitá je aj kvalita jedálnička, celkový energetický príjem a dlhodobý vývoj.","older":" Vo vyššom veku je vhodné posudzovať príjem spolu so zdravotným stavom, chuťou do jedla a pohybom, najmä silovým tréningom.","muscle_low":" Samotné zvýšenie bielkovín bez zodpovedajúceho silového podnetu nezaručuje rast svalovej hmoty.","reduction":" Pri redukcii pomáha chrániť svalovú hmotu aj primeraný energetický deficit a silový tréning.","bmi":" Pri BMI 30 a viac môže výpočet z aktuálnej hmotnosti príjem nadhodnotiť; individuálnu výpočtovú hmotnosť stanovuje odborník.","medical":" Pri ochorení obličiek, nariadenom obmedzení bielkovín, poruche príjmu potravy, tehotenstve alebo závažnom ochorení postupujte podľa odporúčania zdravotníka."}};
  var ROOT_ID = T.root;
  var STYLE_ID = T.style;
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

  function formatFlexible(value, maxDecimals) {
    return new Intl.NumberFormat(T.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDecimals
    }).format(value);
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function optionHtml(items) {
    return items.map(function (item) {
      return '<option value="' + item[0] + '">' + item[1] + '</option>';
    }).join('');
  }

  function getRange(age, activity, goal) {
    var low;
    var high;
    var profile;

    if (activity === 'endurance') {
      low = 1.2; high = 1.6; profile = T.profiles.endurance;
    } else if (activity === 'mixed') {
      low = 1.4; high = 1.8; profile = T.profiles.mixed;
    } else if (activity === 'strength') {
      low = 1.6; high = 2.0; profile = T.profiles.strength;
    } else {
      low = 0.83; high = 1.0; profile = T.profiles.general;
    }

    if (goal === 'muscle') {
      profile += ' + ' + T.profiles.muscle;
      if (activity === 'strength') { low = 1.6; high = 2.2; }
      else if (activity === 'mixed') { low = 1.6; high = 2.0; }
      else if (activity === 'endurance') { low = 1.4; high = 1.8; }
      else { low = 1.4; high = 1.8; }
    } else if (goal === 'reduction') {
      profile += ' + ' + T.profiles.reduction;
      if (activity === 'strength') { low = 1.8; high = 2.2; }
      else if (activity === 'mixed') { low = 1.6; high = 2.0; }
      else if (activity === 'endurance') { low = 1.4; high = 1.8; }
      else { low = 1.2; high = 1.6; }
    }

    if (age >= 65) {
      profile += ' + ' + T.profiles.older;
      if (activity === 'low' && goal === 'maintain') {
        low = 1.0; high = 1.2;
      } else {
        low = Math.max(low, 1.2);
        high = Math.max(high, 1.6);
      }
    }

    return { low: low, high: high, profile: profile };
  }

  function addStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = String.raw`
/* MyBears unified design layer — podle převodníku krevních lipidů */
#${ROOT_ID} {
  --mb-green:#2dc26b !important;
  --mb-green-dark:#198d4b !important;
  --mb-green-soft:#f4f8f4 !important;
  --mb-border:#e5e3dc !important;
  --mb-cream:#faf7ef !important;
  --mb-yellow:#DBC442 !important;
  --mb-yellow-soft:#fff8df !important;
  --mb-danger-soft:#fff5f4 !important;
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
#${ROOT_ID} *::placeholder {
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} *::placeholder {
  opacity:.58 !important;
}
#${ROOT_ID} strong,
#${ROOT_ID} b {
  font-weight:700 !important;
}
#${ROOT_ID} .mb-pi {
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
#${ROOT_ID} .mb-pi::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-pi__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-pi__title,
#${ROOT_ID} .mb-pi__title {
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
#${ROOT_ID} h2.mb-pi__title::before,
#${ROOT_ID} h2.mb-pi__title::after,
#${ROOT_ID} .mb-pi__title::before,
#${ROOT_ID} .mb-pi__title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-pi__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-pi__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-pi__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__grid {
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:18px !important;
  align-items:start !important;
  margin:0 !important;
  padding:22px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} .mb-pi__field {
  min-width:0 !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} label.mb-pi__label,
#${ROOT_ID} .mb-pi__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-pi__input-wrap {
  position:relative !important;
  display:block !important;
  width:100% !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} input.mb-pi__input,
#${ROOT_ID} select.mb-pi__select,
#${ROOT_ID} .mb-pi__input,
#${ROOT_ID} .mb-pi__select {
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
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} input.mb-pi__input {
  padding-right:72px !important;
}
#${ROOT_ID} input.mb-pi__input:hover,
#${ROOT_ID} select.mb-pi__select:hover {
  border-color:#b9bdb7 !important;
}
#${ROOT_ID} input.mb-pi__input:focus,
#${ROOT_ID} select.mb-pi__select:focus,
#${ROOT_ID} input.mb-pi__input:focus-visible,
#${ROOT_ID} select.mb-pi__select:focus-visible {
  border-color:var(--mb-green-dark) !important;
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-pi__unit {
  position:absolute !important;
  top:50% !important;
  right:12px !important;
  z-index:2 !important;
  margin:0 !important;
  padding:0 !important;
  transform:translateY(-50%) !important;
  color:#000 !important;
  font:400 13px/1 Arial,Helvetica,sans-serif !important;
  pointer-events:none !important;
}
#${ROOT_ID} .mb-pi__hint {
  display:block !important;
  margin:7px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} button.mb-pi__button,
#${ROOT_ID} .mb-pi__button {
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
  font:700 16px/1.15 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-decoration:none !important;
  text-transform:none !important;
  cursor:pointer !important;
  transition:background .15s ease,border-color .15s ease,transform .15s ease !important;
  -webkit-appearance:none !important;
  appearance:none !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} .mb-pi__button:hover {
  transform:translateY(-1px) !important;
}
#${ROOT_ID} .mb-pi__button:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-pi__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
}
#${ROOT_ID} .mb-pi__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
}
#${ROOT_ID} .mb-pi__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-pi__button--secondary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} .mb-pi__error {
  display:none !important;
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:var(--mb-danger-soft) !important;
  color:#000 !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__error.is-visible {
  display:block !important;
}
#${ROOT_ID} .mb-pi__result[hidden] {
  display:none !important;
}
#${ROOT_ID} .mb-pi__result {
  margin:28px 0 0 !important;
  padding:24px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:16px !important;
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} .mb-pi__result-top {
  display:flex !important;
  flex-wrap:wrap !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  gap:16px !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-pi__result-label {
  margin:0 0 5px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__score {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 clamp(32px,5vw,40px)/1.08 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.025em !important;
}
#${ROOT_ID} .mb-pi__score-unit {
  font-size:.5em !important;
  font-weight:700 !important;
  letter-spacing:0 !important;
}
#${ROOT_ID} .mb-pi__badge {
  display:inline-flex !important;
  align-items:center !important;
  min-height:34px !important;
  margin:0 !important;
  padding:7px 11px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:700 13px/1.2 Arial,Helvetica,sans-serif !important;
  white-space:nowrap !important;
}
#${ROOT_ID} .mb-pi__summary {
  margin:16px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 15px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__scale-wrap {
  margin:20px 0 0 !important;
  padding:16px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-pi__scale-title {
  margin:0 0 11px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__scale {
  position:relative !important;
  display:block !important;
  width:100% !important;
  height:12px !important;
  overflow:visible !important;
  border-radius:999px !important;
  background:linear-gradient(90deg,#edf3ef 0%,#dff0e5 45%,#f4ecd0 100%) !important;
  box-shadow:inset 0 0 0 1px rgba(32,34,31,.10) !important;
}
#${ROOT_ID} .mb-pi__range {
  position:absolute !important;
  top:0 !important;
  bottom:0 !important;
  min-width:2% !important;
  border-radius:999px !important;
  background:var(--mb-green) !important;
}
#${ROOT_ID} .mb-pi__marker {
  position:absolute !important;
  top:50% !important;
  display:block !important;
  width:14px !important;
  height:14px !important;
  margin:0 !important;
  padding:0 !important;
  border:0 !important;
  border-radius:50% !important;
  background:#000 !important;
  box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(0,0,0,.18) !important;
  transform:translate(-50%,-50%) !important;
}
#${ROOT_ID} .mb-pi__scale-labels {
  display:flex !important;
  justify-content:space-between !important;
  gap:8px !important;
  margin:8px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 11px/1.3 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__metrics {
  display:grid !important;
  grid-template-columns:repeat(4,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:18px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-pi__metric {
  min-width:0 !important;
  margin:0 !important;
  padding:15px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-pi__metric-label {
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__metric-value {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 18px/1.3 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-pi__formula {
  margin:15px 0 0 !important;
  padding:12px 14px !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__warning {
  margin:15px 0 0 !important;
  padding:13px 15px !important;
  border:0 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-pi__privacy {
  margin:20px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 12px/1.5 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
@media (max-width:900px) {
  #${ROOT_ID} .mb-pi__metrics {
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  }
}
@media (max-width:760px) {
  #${ROOT_ID} {
    margin:18px auto 30px !important;
  }
  #${ROOT_ID} .mb-pi {
    border-radius:14px !important;
  }
  #${ROOT_ID} .mb-pi__head {
    padding:28px 20px 22px !important;
  }
  #${ROOT_ID} .mb-pi__body {
    padding:24px 20px 28px !important;
  }
  #${ROOT_ID} .mb-pi__grid {
    grid-template-columns:1fr !important;
    padding:18px !important;
  }
  #${ROOT_ID} .mb-pi__result {
    padding:18px !important;
  }
  #${ROOT_ID} .mb-pi__actions {
    flex-direction:column !important;
    align-items:stretch !important;
  }
  #${ROOT_ID} .mb-pi__button {
    width:100% !important;
  }
}
@media (max-width:480px) {
  #${ROOT_ID} .mb-pi__metrics {
    grid-template-columns:1fr !important;
  }
  #${ROOT_ID} .mb-pi__result-top {
    flex-direction:column !important;
  }
  #${ROOT_ID} .mb-pi__scale-labels {
    font-size:10px !important;
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
  #${ROOT_ID} .mb-pi {
    border:1px solid #bbb !important;
    box-shadow:none !important;
  }
  #${ROOT_ID} .mb-pi__actions,
  #${ROOT_ID} .mb-pi__privacy {
    display:none !important;
  }
  #${ROOT_ID} .mb-pi__result[hidden] {
    display:block !important;
  }
}
`;
    document.head.appendChild(style);
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root || root.getAttribute('data-mb-version') === VERSION) return;

    addStyles();
    root.setAttribute('data-mb-version', VERSION);
    root.innerHTML = [
      '<section class="mb-pi" role="region" aria-label="' + T.region_label + '" aria-labelledby="mb-pi-title">',
      '  <div class="mb-pi__head">',
      '    <h2 class="mb-pi__title" id="mb-pi-title">' + T.title + '</h2>',
      '    <p class="mb-pi__lead">' + T.lead + '</p>',
      '  </div>',
      '  <div class="mb-pi__body">',
      '    <p class="mb-pi__notice">' + T.notice + '</p>',
      '    <form id="mb-pi-form" novalidate>',
      '      <div class="mb-pi__grid">',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-weight">' + T.weight + '</label><div class="mb-pi__input-wrap"><input class="mb-pi__input" id="mb-pi-weight" inputmode="decimal" autocomplete="off" value="70" aria-describedby="mb-pi-weight-hint"><span class="mb-pi__unit">kg</span></div><span class="mb-pi__hint" id="mb-pi-weight-hint">' + T.weight_hint + '</span></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-height">' + T.height + '</label><div class="mb-pi__input-wrap"><input class="mb-pi__input" id="mb-pi-height" inputmode="decimal" autocomplete="off" placeholder="175" aria-describedby="mb-pi-height-hint"><span class="mb-pi__unit">cm</span></div><span class="mb-pi__hint" id="mb-pi-height-hint">' + T.height_hint + '</span></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-age">' + T.age + '</label><div class="mb-pi__input-wrap"><input class="mb-pi__input" id="mb-pi-age" inputmode="numeric" autocomplete="off" value="35"><span class="mb-pi__unit">' + T.units.years + '</span></div></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-activity">' + T.activity + '</label><select class="mb-pi__select" id="mb-pi-activity">' + optionHtml(T.activity_options) + '</select></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-goal">' + T.goal + '</label><select class="mb-pi__select" id="mb-pi-goal">' + optionHtml(T.goal_options) + '</select></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-meals">' + T.meals + '</label><select class="mb-pi__select" id="mb-pi-meals"><option value="3">3</option><option value="4" selected>4</option><option value="5">5</option><option value="6">6</option></select></div>',
      '      </div>',
      '      <div class="mb-pi__actions"><button type="submit" class="mb-pi__button mb-pi__button--primary">' + T.calculate + '</button><button type="button" class="mb-pi__button mb-pi__button--secondary" id="mb-pi-reset">' + T.reset + '</button></div>',
      '      <div class="mb-pi__error" id="mb-pi-error" role="alert" aria-live="assertive"></div>',
      '    </form>',
      '    <section class="mb-pi__result" id="mb-pi-result" aria-live="polite" role="status" hidden>',
      '      <div class="mb-pi__result-top"><div><p class="mb-pi__result-label">' + T.result_label + '</p><p class="mb-pi__score"><span id="mb-pi-score">–</span> <span class="mb-pi__score-unit">' + T.units.g_day + '</span></p></div><span class="mb-pi__badge">' + T.badge + '</span></div>',
      '      <p class="mb-pi__summary" id="mb-pi-summary"></p>',
      '      <div class="mb-pi__scale-wrap"><p class="mb-pi__scale-title">' + T.scale_title + '</p><div class="mb-pi__scale" aria-hidden="true"><span class="mb-pi__range" id="mb-pi-range"></span><i class="mb-pi__marker" id="mb-pi-marker"></i></div><div class="mb-pi__scale-labels"><span>0,8</span><span>1,2</span><span>1,6</span><span>2,0</span><span>2,2 g/kg</span></div></div>',
      '      <div class="mb-pi__metrics">',
      '        <div class="mb-pi__metric"><p class="mb-pi__metric-label">' + T.midpoint + '</p><p class="mb-pi__metric-value" id="mb-pi-mid">–</p></div>',
      '        <div class="mb-pi__metric"><p class="mb-pi__metric-label">' + T.per_meal + '</p><p class="mb-pi__metric-value" id="mb-pi-meal">–</p></div>',
      '        <div class="mb-pi__metric"><p class="mb-pi__metric-label">' + T.energy + '</p><p class="mb-pi__metric-value" id="mb-pi-energy">–</p></div>',
      '        <div class="mb-pi__metric"><p class="mb-pi__metric-label">' + T.profile + '</p><p class="mb-pi__metric-value" id="mb-pi-profile">–</p></div>',
      '      </div>',
      '      <p class="mb-pi__formula" id="mb-pi-formula"></p>',
      '      <p class="mb-pi__warning" id="mb-pi-warning"></p>',
      '    </section>',
      '    <p class="mb-pi__privacy">' + T.privacy + '</p>',
      '  </div>',
      '</section>'
    ].join('');

    var form = root.querySelector('#mb-pi-form');
    var result = root.querySelector('#mb-pi-result');
    var error = root.querySelector('#mb-pi-error');
    var weightInput = root.querySelector('#mb-pi-weight');
    var heightInput = root.querySelector('#mb-pi-height');
    var ageInput = root.querySelector('#mb-pi-age');
    var activityInput = root.querySelector('#mb-pi-activity');
    var goalInput = root.querySelector('#mb-pi-goal');
    var mealsInput = root.querySelector('#mb-pi-meals');

    function clearError() {
      error.textContent = '';
      error.classList.remove('is-visible');
    }

    function showError(message, field) {
      error.textContent = message;
      error.classList.add('is-visible');
      result.hidden = true;
      if (field) field.focus();
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError();

      var weight = parseNumber(weightInput.value);
      var heightRaw = heightInput.value.trim();
      var height = heightRaw === '' ? NaN : parseNumber(heightRaw);
      var age = parseNumber(ageInput.value);
      var activity = activityInput.value;
      var goal = goalInput.value;
      var meals = parseNumber(mealsInput.value);

      if (!Number.isFinite(weight) || weight < 30 || weight > 250) return showError(T.errors.weight, weightInput);
      if (heightRaw !== '' && (!Number.isFinite(height) || height < 120 || height > 230)) return showError(T.errors.height, heightInput);
      if (!Number.isFinite(age) || age < 18 || age > 100) return showError(T.errors.age, ageInput);
      if (!Number.isFinite(meals) || meals < 3 || meals > 6) return showError(T.errors.meals, mealsInput);

      var range = getRange(age, activity, goal);
      var lowTotal = weight * range.low;
      var highTotal = weight * range.high;
      var midFactor = (range.low + range.high) / 2;
      var midTotal = weight * midFactor;
      var perMealLow = lowTotal / meals;
      var perMealHigh = highTotal / meals;
      var energy = midTotal * 4;

      if (![lowTotal, highTotal, midTotal, energy].every(Number.isFinite)) return showError(T.errors.generic);

      var scaleMin = 0.8;
      var scaleMax = 2.2;
      var left = Math.max(0, Math.min(100, ((range.low - scaleMin) / (scaleMax - scaleMin)) * 100));
      var right = Math.max(0, Math.min(100, ((range.high - scaleMin) / (scaleMax - scaleMin)) * 100));
      var marker = Math.max(0, Math.min(100, ((midFactor - scaleMin) / (scaleMax - scaleMin)) * 100));

      root.querySelector('#mb-pi-score').textContent = format(round(lowTotal, 0), 0) + '–' + format(round(highTotal, 0), 0);
      root.querySelector('#mb-pi-summary').innerHTML = T.summary_prefix + ' <strong>' + formatFlexible(range.low, 2) + '–' + formatFlexible(range.high, 2) + ' ' + T.units.gkg_day + '</strong>.';
      root.querySelector('#mb-pi-range').style.left = left + '%';
      root.querySelector('#mb-pi-range').style.width = Math.max(2, right - left) + '%';
      root.querySelector('#mb-pi-marker').style.left = marker + '%';
      root.querySelector('#mb-pi-mid').textContent = format(round(midTotal, 0), 0) + ' ' + T.units.g_day;
      root.querySelector('#mb-pi-meal').textContent = format(round(perMealLow, 0), 0) + '–' + format(round(perMealHigh, 0), 0) + ' g';
      root.querySelector('#mb-pi-energy').textContent = format(round(energy, 0), 0) + ' ' + T.units.kcal_day;
      root.querySelector('#mb-pi-profile').textContent = range.profile;
      root.querySelector('#mb-pi-formula').innerHTML = '<strong>' + T.formula + ':</strong> ' + formatFlexible(weight, 1) + ' kg × ' + formatFlexible(range.low, 2) + '–' + formatFlexible(range.high, 2) + ' g/kg = ' + format(round(lowTotal, 0), 0) + '–' + format(round(highTotal, 0), 0) + ' ' + T.units.g_day + '.';

      var warning = T.warnings.base;
      if (age >= 65) warning += T.warnings.older;
      if (goal === 'muscle' && activity === 'low') warning += T.warnings.muscle_low;
      if (goal === 'reduction') warning += T.warnings.reduction;
      if (Number.isFinite(height)) {
        var bmi = weight / Math.pow(height / 100, 2);
        if (bmi >= 30) warning += T.warnings.bmi;
      }
      warning += T.warnings.medical;
      root.querySelector('#mb-pi-warning').textContent = warning;
      result.hidden = false;

      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });

    root.querySelector('#mb-pi-reset').addEventListener('click', function () {
      weightInput.value = '70';
      heightInput.value = '';
      ageInput.value = '35';
      activityInput.value = 'low';
      goalInput.value = 'maintain';
      mealsInput.value = '4';
      clearError();
      result.hidden = true;
      weightInput.focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
