/**
 * MyBears — kalkulačka energetické dostupnosti
 * Sjednocený vizuální systém podle poslední šablony převodníku krevních lipidů.
 * Funkční logika, interní ID a způsob vložení zůstávají zachované.
 *
 * Mount point:
 *   <div id="mb-energy-availability-calculator"></div>
 *
 * Bez externích závislostí. Data se neodesílají ani neukládají.
 */
(function () {
  'use strict';

  var T = {"locale":"cs-CZ","root":"mb-energy-availability-calculator","style":"mb-energy-availability-calculator-styles","version":"3.0.0-cz","title":"Kalkulačka energetické dostupnosti","lead":"Odhadněte, kolik energie zbývá organismu po odečtení energetického výdeje při cvičení ve vztahu k beztukové hmotě.","notice":"<strong>Důležité:</strong> Kalkulačka není diagnostikou REDs. Výsledek výrazně ovlivňuje přesnost jídelního záznamu, odhadu aktivních kalorií a tělesného složení.","region_label":"Interaktivní kalkulačka energetické dostupnosti","mode_label":"Způsob zadání beztukové hmoty","mode_fat":"Hmotnost a tělesný tuk","mode_ffm":"Znám beztukovou hmotu","reference_group":"Referenční skupina","female":"Žena","male":"Muž","unspecified":"Nechci uvést","reference_hint":"Nemění vzorec, pouze vysvětlení výsledku.","age":"Věk","years":"let","age_hint":"Určeno dospělým od 18 let.","weight":"Tělesná hmotnost","weight_hint":"Povolené rozmezí: 30–250 kg","fat":"Tělesný tuk","fat_hint":"Použijte hodnotu z co nejspolehlivějšího měření.","ffm":"Beztuková hmota (FFM)","ffm_hint":"Například z měření DXA nebo jiného vyšetření tělesného složení.","intake":"Průměrný denní energetický příjem","intake_hint":"Ideálně průměr z několika reprezentativních dnů.","exercise":"Průměrný aktivní výdej při cvičení","exercise_hint":"Zadejte energii nad klidovou úroveň, nikoliv celý denní výdej.","calculate":"Vypočítat dostupnost","reset":"Vymazat údaje","result_label":"Vaše orientační energetická dostupnost","score_unit":"kcal/kg FFM/den","scale_title":"Orientační výzkumná pásma","scale_low":"Nízká","scale_reduced":"Snížená","scale_higher":"Vyšší","scale_more":"45 a více","metric_ffm":"Beztuková hmota","metric_remaining":"Energie po odečtení cvičení","metric_kj":"Přepočet na kJ","metric_30":"Příjem odpovídající EA 30","metric_45":"Příjem odpovídající EA 45","metric_exercise":"Zadaný aktivní výdej","privacy":"Výpočet probíhá pouze ve vašem prohlížeči. Zadané údaje se tímto skriptem nikam neodesílají ani neukládají.","formula_label":"Výpočet:","errors":{"age":"Zadejte věk v rozmezí 18–100 let.","intake":"Zadejte průměrný denní příjem v rozmezí 500–10 000 kcal.","exercise":"Zadejte aktivní výdej při cvičení v rozmezí 0–6 000 kcal za den.","weight":"Zadejte tělesnou hmotnost v rozmezí 30–250 kg.","fat":"Zadejte podíl tělesného tuku v rozmezí 3–60 %.","ffm":"Zadejte beztukovou hmotu v rozmezí 20–180 kg.","calculation":"Výpočet se nepodařilo dokončit. Zkontrolujte zadané údaje."},"categories":{"low_label":"Nízká dostupnost","low_text":"Výsledek spadá do pásma tradičně spojovaného s nízkou energetickou dostupností. Ověřte správnost vstupů a při dlouhodobém výskytu nebo příznacích vyhledejte sportovního lékaře či nutričního terapeuta.","reduced_label":"Snížená dostupnost","reduced_text":"Výsledek leží v přechodném pásmu. Krátkodobě nemusí znamenat problém, ale opakovaná nebo dlouhodobá expozice může být relevantní pro zdraví, regeneraci a výkon.","higher_label":"Vyšší dostupnost","higher_text":"Výsledek je v pásmu, které bylo v laboratorních studiích u žen často používáno jako referenční pro dostatečnou dostupnost. Samotné číslo však nevylučuje REDs ani jiné potíže."},"warning_base":"Pásma 30 a 45 kcal/kg FFM/den jsou orientační výzkumné reference, nikoliv diagnostické hranice. Přepočtené příjmy nejsou osobním doporučením jídelníčku.","warning_male":" U mužů není potvrzena jedna univerzální hranice nízké energetické dostupnosti a odborná interpretace musí být obzvlášť opatrná.","warning_unspecified":" Výzkumná pásma byla odvozena hlavně ze studií žen a nelze je stejně přesně vztáhnout na každého člověka.","warning_remaining":"Zadaný aktivní výdej je stejný nebo vyšší než energetický příjem. Nejprve ověřte, zda jste nezadali hrubý výdej včetně klidové energie místo aktivních kalorií. "};
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

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function addStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = String.raw`
/* MyBears unified design layer — copied from the last lipid converter template */
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
  -webkit-text-fill-color:#000 !important;
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
#${ROOT_ID} .mb-ea {
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
#${ROOT_ID} .mb-ea::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-ea__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-ea__title,
#${ROOT_ID} .mb-ea__title {
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
#${ROOT_ID} h2.mb-ea__title::before,
#${ROOT_ID} h2.mb-ea__title::after,
#${ROOT_ID} .mb-ea__title::before,
#${ROOT_ID} .mb-ea__title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-ea__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-ea__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-ea__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ea__mode {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:8px !important;
  margin:0 0 22px !important;
  padding:5px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} button.mb-ea__mode-btn,
#${ROOT_ID} .mb-ea__mode-btn {
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
  transition:background .15s ease,border-color .15s ease,transform .15s ease !important;
  -webkit-appearance:none !important;
  appearance:none !important;
}
#${ROOT_ID} .mb-ea__mode-btn:hover {
  border-color:#b8d9c3 !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-ea__mode-btn[aria-pressed="true"] {
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-ea__conditional[hidden],
#${ROOT_ID} .mb-ea__result[hidden] {
  display:none !important;
}
#${ROOT_ID} .mb-ea__grid {
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:16px !important;
  align-items:start !important;
}
#${ROOT_ID} .mb-ea__conditional {
  grid-column:1 / -1 !important;
  min-width:0 !important;
}
#${ROOT_ID} .mb-ea__field {
  min-width:0 !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-ea__field--full {
  grid-column:1 / -1 !important;
}
#${ROOT_ID} label.mb-ea__label,
#${ROOT_ID} .mb-ea__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-ea__input-wrap {
  position:relative !important;
  min-width:0 !important;
}
#${ROOT_ID} input.mb-ea__input,
#${ROOT_ID} select.mb-ea__select,
#${ROOT_ID} .mb-ea__input,
#${ROOT_ID} .mb-ea__select {
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
#${ROOT_ID} .mb-ea__input-wrap .mb-ea__input {
  padding-right:76px !important;
}
#${ROOT_ID} .mb-ea__unit {
  position:absolute !important;
  top:50% !important;
  right:12px !important;
  transform:translateY(-50%) !important;
  color:#000 !important;
  font:700 13px/1 Arial,Helvetica,sans-serif !important;
  pointer-events:none !important;
}
#${ROOT_ID} input.mb-ea__input:hover,
#${ROOT_ID} select.mb-ea__select:hover {
  border-color:#b9bdb7 !important;
}
#${ROOT_ID} input.mb-ea__input:focus,
#${ROOT_ID} select.mb-ea__select:focus,
#${ROOT_ID} input.mb-ea__input:focus-visible,
#${ROOT_ID} select.mb-ea__select:focus-visible {
  border-color:var(--mb-green-dark) !important;
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-ea__hint {
  display:block !important;
  margin:7px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ea__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} button.mb-ea__button,
#${ROOT_ID} .mb-ea__button {
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
  transition:background .15s ease,border-color .15s ease,transform .15s ease !important;
  -webkit-appearance:none !important;
  appearance:none !important;
}
#${ROOT_ID} .mb-ea__button:hover {
  transform:translateY(-1px) !important;
}
#${ROOT_ID} .mb-ea__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-ea__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-ea__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-ea__button--secondary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-ea__mode-btn:focus-visible,
#${ROOT_ID} .mb-ea__button:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-ea__error {
  display:none !important;
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#000 !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ea__error.is-visible {
  display:block !important;
}
#${ROOT_ID} .mb-ea__result {
  margin:24px 0 0 !important;
  padding:22px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:14px !important;
  background:var(--mb-green-soft) !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-ea__result-top {
  display:flex !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  gap:16px !important;
}
#${ROOT_ID} .mb-ea__result-label {
  margin:0 0 5px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ea__score {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 clamp(32px,5vw,40px)/1.08 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.03em !important;
  text-shadow:none !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-ea__score-unit {
  color:#000 !important;
  font:700 16px/1.2 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
}
#${ROOT_ID} .mb-ea__badge {
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  min-height:34px !important;
  padding:6px 11px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:700 14px/1.25 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#${ROOT_ID} .mb-ea__summary {
  margin:14px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 15px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ea__scale-wrap {
  margin:18px 0 0 !important;
}
#${ROOT_ID} .mb-ea__scale-title {
  margin:0 0 8px !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ea__scale {
  position:relative !important;
  display:grid !important;
  grid-template-columns:30fr 15fr 25fr !important;
  height:18px !important;
  overflow:visible !important;
  border-radius:999px !important;
  background:#e7ece9 !important;
  box-shadow:inset 0 0 0 1px rgba(32,34,31,.10) !important;
}
#${ROOT_ID} .mb-ea__scale > span:nth-child(1) { background:#e6a6a0 !important; border-radius:999px 0 0 999px !important; }
#${ROOT_ID} .mb-ea__scale > span:nth-child(2) { background:#f3cf69 !important; }
#${ROOT_ID} .mb-ea__scale > span:nth-child(3) { background:#79cc99 !important; border-radius:0 999px 999px 0 !important; }
#${ROOT_ID} .mb-ea__marker {
  position:absolute !important;
  top:-5px !important;
  width:4px !important;
  height:28px !important;
  border-radius:4px !important;
  background:#20231f !important;
  transform:translateX(-50%) !important;
  box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(32,35,31,.18) !important;
}
#${ROOT_ID} .mb-ea__scale-labels {
  display:grid !important;
  grid-template-columns:30fr 15fr 25fr !important;
  margin:7px 0 0 !important;
  color:#000 !important;
  font:400 12px/1.35 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#${ROOT_ID} .mb-ea__metrics {
  display:grid !important;
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:18px 0 0 !important;
}
#${ROOT_ID} .mb-ea__metric {
  min-width:0 !important;
  margin:0 !important;
  padding:15px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-ea__metric-label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ea__metric-value {
  display:block !important;
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 19px/1.3 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-ea__formula {
  margin:15px 0 0 !important;
  padding:12px 14px !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ea__warning {
  margin:15px 0 0 !important;
  padding:13px 15px !important;
  border:0 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ea__privacy {
  margin:20px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 12px/1.5 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
/* Final hard override: Upgates must not reintroduce another font or green text. */
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} input,
#${ROOT_ID} select,
#${ROOT_ID} button,
#${ROOT_ID} option {
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  -webkit-text-fill-color:#000 !important;
}
@media (max-width:900px) {
  #${ROOT_ID} .mb-ea__metrics {
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  }
}
@media (max-width:760px) {
  #${ROOT_ID} {
    margin:18px auto 30px !important;
  }
  #${ROOT_ID} .mb-ea {
    border-radius:14px !important;
  }
  #${ROOT_ID} .mb-ea__head {
    padding:28px 20px 22px !important;
  }
  #${ROOT_ID} .mb-ea__body {
    padding:24px 20px 28px !important;
  }
  #${ROOT_ID} .mb-ea__grid,
  #${ROOT_ID} .mb-ea__metrics {
    grid-template-columns:1fr !important;
  }
  #${ROOT_ID} .mb-ea__conditional,
  #${ROOT_ID} .mb-ea__field--full {
    grid-column:auto !important;
  }
  #${ROOT_ID} .mb-ea__result-top {
    flex-direction:column !important;
  }
  #${ROOT_ID} .mb-ea__actions {
    flex-direction:column !important;
  }
  #${ROOT_ID} .mb-ea__button {
    width:100% !important;
  }
  #${ROOT_ID} .mb-ea__scale-labels {
    font-size:11px !important;
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
  #${ROOT_ID} .mb-ea {
    border:1px solid #bbb !important;
    box-shadow:none !important;
  }
  #${ROOT_ID} .mb-ea__mode,
  #${ROOT_ID} .mb-ea__actions,
  #${ROOT_ID} .mb-ea__privacy {
    display:none !important;
  }
  #${ROOT_ID} .mb-ea__result[hidden] {
    display:block !important;
  }
}
`;
    document.head.appendChild(style);
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    root.setAttribute('data-version', VERSION);
    addStyles();

    root.innerHTML = '<section class="mb-ea" role="region" aria-label="' + T.region_label + '">' +
      '<div class="mb-ea__head"><h2 class="mb-ea__title" id="mb-ea-title">' + T.title + '</h2><p class="mb-ea__lead">' + T.lead + '</p></div>' +
      '<div class="mb-ea__body"><p class="mb-ea__notice">' + T.notice + '</p>' +
      '<form id="mb-ea-form" novalidate>' +
        '<div class="mb-ea__mode" role="group" aria-label="' + T.mode_label + '">' +
          '<button type="button" class="mb-ea__mode-btn" id="mb-ea-mode-fat" aria-pressed="true">' + T.mode_fat + '</button>' +
          '<button type="button" class="mb-ea__mode-btn" id="mb-ea-mode-ffm" aria-pressed="false">' + T.mode_ffm + '</button>' +
        '</div>' +
        '<div class="mb-ea__grid">' +
          '<div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-sex">' + T.reference_group + '</label><select class="mb-ea__select" id="mb-ea-sex"><option value="female">' + T.female + '</option><option value="male">' + T.male + '</option><option value="unspecified">' + T.unspecified + '</option></select><span class="mb-ea__hint">' + T.reference_hint + '</span></div>' +
          '<div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-age">' + T.age + '</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-age" inputmode="numeric" autocomplete="off" value="30"><span class="mb-ea__unit">' + T.years + '</span></div><span class="mb-ea__hint">' + T.age_hint + '</span></div>' +
          '<div class="mb-ea__conditional" id="mb-ea-fat-fields"><div class="mb-ea__grid">' +
            '<div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-weight">' + T.weight + '</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-weight" inputmode="decimal" autocomplete="off" value="65"><span class="mb-ea__unit">kg</span></div><span class="mb-ea__hint">' + T.weight_hint + '</span></div>' +
            '<div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-fat">' + T.fat + '</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-fat" inputmode="decimal" autocomplete="off" value="22"><span class="mb-ea__unit">%</span></div><span class="mb-ea__hint">' + T.fat_hint + '</span></div>' +
          '</div></div>' +
          '<div class="mb-ea__conditional" id="mb-ea-ffm-fields" hidden><div class="mb-ea__field mb-ea__field--full"><label class="mb-ea__label" for="mb-ea-ffm">' + T.ffm + '</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-ffm" inputmode="decimal" autocomplete="off" value="50,7"><span class="mb-ea__unit">kg</span></div><span class="mb-ea__hint">' + T.ffm_hint + '</span></div></div>' +
          '<div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-intake">' + T.intake + '</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-intake" inputmode="decimal" autocomplete="off" value="2400"><span class="mb-ea__unit">kcal</span></div><span class="mb-ea__hint">' + T.intake_hint + '</span></div>' +
          '<div class="mb-ea__field"><label class="mb-ea__label" for="mb-ea-exercise">' + T.exercise + '</label><div class="mb-ea__input-wrap"><input class="mb-ea__input" id="mb-ea-exercise" inputmode="decimal" autocomplete="off" value="500"><span class="mb-ea__unit">kcal</span></div><span class="mb-ea__hint">' + T.exercise_hint + '</span></div>' +
        '</div>' +
        '<div class="mb-ea__actions"><button type="submit" class="mb-ea__button mb-ea__button--primary">' + T.calculate + '</button><button type="button" class="mb-ea__button mb-ea__button--secondary" id="mb-ea-reset">' + T.reset + '</button></div>' +
        '<div class="mb-ea__error" id="mb-ea-error" role="alert" aria-live="assertive"></div>' +
      '</form>' +
      '<section class="mb-ea__result" id="mb-ea-result" aria-live="polite" role="status" hidden>' +
        '<div class="mb-ea__result-top"><div><p class="mb-ea__result-label">' + T.result_label + '</p><p class="mb-ea__score"><span id="mb-ea-score">–</span> <span class="mb-ea__score-unit">' + T.score_unit + '</span></p></div><span class="mb-ea__badge" id="mb-ea-badge">–</span></div>' +
        '<p class="mb-ea__summary" id="mb-ea-summary"></p>' +
        '<div class="mb-ea__scale-wrap"><p class="mb-ea__scale-title">' + T.scale_title + '</p><div class="mb-ea__scale" aria-hidden="true"><span></span><span></span><span></span><i class="mb-ea__marker" id="mb-ea-marker"></i></div><div class="mb-ea__scale-labels"><span>' + T.scale_low + '<br>&lt; 30</span><span>' + T.scale_reduced + '<br>30–44,9</span><span>' + T.scale_higher + '<br>' + T.scale_more + '</span></div></div>' +
        '<div class="mb-ea__metrics">' +
          '<div class="mb-ea__metric"><p class="mb-ea__metric-label">' + T.metric_ffm + '</p><p class="mb-ea__metric-value" id="mb-ea-out-ffm">–</p></div>' +
          '<div class="mb-ea__metric"><p class="mb-ea__metric-label">' + T.metric_remaining + '</p><p class="mb-ea__metric-value" id="mb-ea-out-remaining">–</p></div>' +
          '<div class="mb-ea__metric"><p class="mb-ea__metric-label">' + T.metric_kj + '</p><p class="mb-ea__metric-value" id="mb-ea-out-kj">–</p></div>' +
          '<div class="mb-ea__metric"><p class="mb-ea__metric-label">' + T.metric_30 + '</p><p class="mb-ea__metric-value" id="mb-ea-out-30">–</p></div>' +
          '<div class="mb-ea__metric"><p class="mb-ea__metric-label">' + T.metric_45 + '</p><p class="mb-ea__metric-value" id="mb-ea-out-45">–</p></div>' +
          '<div class="mb-ea__metric"><p class="mb-ea__metric-label">' + T.metric_exercise + '</p><p class="mb-ea__metric-value" id="mb-ea-out-exercise">–</p></div>' +
        '</div>' +
        '<p class="mb-ea__formula" id="mb-ea-formula"></p><p class="mb-ea__warning" id="mb-ea-warning"></p>' +
      '</section><p class="mb-ea__privacy">' + T.privacy + '</p></div></section>';

    var form = root.querySelector('#mb-ea-form');
    var result = root.querySelector('#mb-ea-result');
    var error = root.querySelector('#mb-ea-error');
    var fatMode = root.querySelector('#mb-ea-mode-fat');
    var ffmMode = root.querySelector('#mb-ea-mode-ffm');
    var fatFields = root.querySelector('#mb-ea-fat-fields');
    var ffmFields = root.querySelector('#mb-ea-ffm-fields');
    var mode = 'fat';

    function setMode(next, focusField) {
      mode = next;
      fatMode.setAttribute('aria-pressed', next === 'fat' ? 'true' : 'false');
      ffmMode.setAttribute('aria-pressed', next === 'ffm' ? 'true' : 'false');
      fatFields.hidden = next !== 'fat';
      ffmFields.hidden = next !== 'ffm';
      result.hidden = true;
      error.textContent = '';
      error.classList.remove('is-visible');
      if (focusField) root.querySelector(next === 'fat' ? '#mb-ea-weight' : '#mb-ea-ffm').focus();
    }

    fatMode.addEventListener('click', function () { setMode('fat', true); });
    ffmMode.addEventListener('click', function () { setMode('ffm', true); });

    [fatMode, ffmMode].forEach(function (button, index, buttons) {
      button.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        var nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = buttons.length - 1;
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
      });
    });

    function showError(message, field) {
      error.textContent = message;
      error.classList.add('is-visible');
      result.hidden = true;
      if (field) field.focus();
    }

    function classify(ea) {
      if (ea < 30) return { label:T.categories.low_label, text:T.categories.low_text };
      if (ea < 45) return { label:T.categories.reduced_label, text:T.categories.reduced_text };
      return { label:T.categories.higher_label, text:T.categories.higher_text };
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      error.textContent = '';
      error.classList.remove('is-visible');

      var ageField = root.querySelector('#mb-ea-age');
      var intakeField = root.querySelector('#mb-ea-intake');
      var exerciseField = root.querySelector('#mb-ea-exercise');
      var age = parseNumber(ageField.value);
      var sex = root.querySelector('#mb-ea-sex').value;
      var intake = parseNumber(intakeField.value);
      var exercise = parseNumber(exerciseField.value);
      var ffm;

      if (!Number.isFinite(age) || age < 18 || age > 100) return showError(T.errors.age, ageField);
      if (!Number.isFinite(intake) || intake < 500 || intake > 10000) return showError(T.errors.intake, intakeField);
      if (!Number.isFinite(exercise) || exercise < 0 || exercise > 6000) return showError(T.errors.exercise, exerciseField);

      if (mode === 'fat') {
        var weightField = root.querySelector('#mb-ea-weight');
        var fatField = root.querySelector('#mb-ea-fat');
        var weight = parseNumber(weightField.value);
        var fat = parseNumber(fatField.value);
        if (!Number.isFinite(weight) || weight < 30 || weight > 250) return showError(T.errors.weight, weightField);
        if (!Number.isFinite(fat) || fat < 3 || fat > 60) return showError(T.errors.fat, fatField);
        ffm = weight * (1 - fat / 100);
      } else {
        var ffmField = root.querySelector('#mb-ea-ffm');
        ffm = parseNumber(ffmField.value);
        if (!Number.isFinite(ffm) || ffm < 20 || ffm > 180) return showError(T.errors.ffm, ffmField);
      }

      var remaining = intake - exercise;
      var ea = remaining / ffm;
      if (!Number.isFinite(ea)) return showError(T.errors.calculation);

      var category = classify(ea);
      var marker = Math.max(0, Math.min(100, (ea / 70) * 100));
      var target30 = exercise + 30 * ffm;
      var target45 = exercise + 45 * ffm;
      var eaKj = ea * 4.184;
      var perDay = T.locale === 'sk-SK' ? '/deň' : '/den';

      root.querySelector('#mb-ea-score').textContent = format(round(ea, 1), 1);
      root.querySelector('#mb-ea-badge').textContent = category.label;
      root.querySelector('#mb-ea-summary').textContent = category.text;
      root.querySelector('#mb-ea-marker').style.left = marker + '%';
      root.querySelector('#mb-ea-out-ffm').textContent = format(round(ffm, 1), 1) + ' kg';
      root.querySelector('#mb-ea-out-remaining').textContent = format(round(remaining, 0), 0) + ' kcal' + perDay;
      root.querySelector('#mb-ea-out-kj').textContent = format(round(eaKj, 0), 0) + ' kJ/kg FFM' + perDay;
      root.querySelector('#mb-ea-out-30').textContent = format(round(target30, 0), 0) + ' kcal' + perDay;
      root.querySelector('#mb-ea-out-45').textContent = format(round(target45, 0), 0) + ' kcal' + perDay;
      root.querySelector('#mb-ea-out-exercise').textContent = format(round(exercise, 0), 0) + ' kcal' + perDay;
      root.querySelector('#mb-ea-formula').innerHTML = '<strong>' + T.formula_label + '</strong> (' + format(round(intake, 0), 0) + ' − ' + format(round(exercise, 0), 0) + ') ÷ ' + format(round(ffm, 1), 1) + ' = ' + format(round(ea, 1), 1) + ' ' + T.score_unit + '.';

      var warning = T.warning_base;
      if (sex === 'male') warning += T.warning_male;
      if (sex === 'unspecified') warning += T.warning_unspecified;
      if (remaining <= 0) warning = T.warning_remaining + warning;
      root.querySelector('#mb-ea-warning').textContent = warning;

      result.hidden = false;
      if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        result.scrollIntoView({ behavior:'smooth', block:'nearest' });
      } else {
        result.scrollIntoView({ block:'nearest' });
      }
    });

    root.querySelector('#mb-ea-reset').addEventListener('click', function () {
      root.querySelector('#mb-ea-sex').value = 'female';
      root.querySelector('#mb-ea-age').value = '30';
      root.querySelector('#mb-ea-weight').value = '65';
      root.querySelector('#mb-ea-fat').value = '22';
      root.querySelector('#mb-ea-ffm').value = '50,7';
      root.querySelector('#mb-ea-intake').value = '2400';
      root.querySelector('#mb-ea-exercise').value = '500';
      setMode('fat', false);
      root.querySelector('#mb-ea-age').focus();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
