/**
 * MyBears — kalkulačka glykemickej nálože (SK)
 * Vizuálny systém zjednotený podľa poslednej šablóny prevodníka krvných lipidov.
 * Funkčná logika, databáza, interné ID, URL a spôsob vloženia zostávajú zachované.
 *
 * Mount point:
 *   <div id="mb-glycemic-load-calculator"></div>
 *
 * Bez externých závislostí. Údaje sa neodosielajú ani neukladajú.
 */
/* MyBears – orientační kalkulačka glykemické nálože
 * Verze databáze: 3.1, revize 28. 7. 2026
 * Soubor: glycemic-load-calculator-v3.js
 * Umístění: Grafika → Editor kódu → Scripts
 * Neodesílá data, nepoužívá cookies ani localStorage.
 */
(function () {
  "use strict";


  function injectCalculatorStyles() {
    var old = document.getElementById("mb-glc-embedded-styles");
    if (old && old.parentNode) old.parentNode.removeChild(old);

    var style = document.createElement("style");
    style.id = "mb-glc-embedded-styles";
    style.type = "text/css";
    style.textContent = String.raw`
/* MyBears unified design layer — based on the latest lipid converter template */
#mb-glycemic-load-calculator {
  --mb-green:#2dc26b !important;
  --mb-green-dark:#198d4b !important;
  --mb-green-soft:#f4f8f4 !important;
  --mb-border:#e5e3dc !important;
  --mb-cream:#faf7ef !important;
  --mb-yellow:#DBC442 !important;
  --mb-yellow-soft:#fff8df !important;
  width:100% !important;
  max-width:1120px !important;
  margin:24px auto 40px !important;
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  font-size:16px !important;
  font-weight:400 !important;
  line-height:1.55 !important;
}
#mb-glycemic-load-calculator,
#mb-glycemic-load-calculator *,
#mb-glycemic-load-calculator *::before,
#mb-glycemic-load-calculator *::after {
  box-sizing:border-box !important;
  font-family:Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator *,
#mb-glycemic-load-calculator input,
#mb-glycemic-load-calculator select,
#mb-glycemic-load-calculator button,
#mb-glycemic-load-calculator a,
#mb-glycemic-load-calculator label,
#mb-glycemic-load-calculator span,
#mb-glycemic-load-calculator p,
#mb-glycemic-load-calculator h2,
#mb-glycemic-load-calculator h3,
#mb-glycemic-load-calculator strong {
  color:#000 !important;
  -webkit-text-fill-color:#000 !important;
}
#mb-glycemic-load-calculator strong,
#mb-glycemic-load-calculator b { font-weight:700 !important; }
#mb-glycemic-load-calculator .mb-glc {
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
#mb-glycemic-load-calculator .mb-glc::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#mb-glycemic-load-calculator .mb-glc__header {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
  text-align:center !important;
}
#mb-glycemic-load-calculator h2.mb-glc__title,
#mb-glycemic-load-calculator .mb-glc__title {
  display:block !important;
  max-width:920px !important;
  margin:0 auto 10px !important;
  padding:0 !important;
  border:0 !important;
  background:none !important;
  box-shadow:none !important;
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
#mb-glycemic-load-calculator .mb-glc__title::before,
#mb-glycemic-load-calculator .mb-glc__title::after { content:none !important; display:none !important; }
#mb-glycemic-load-calculator .mb-glc__header > p {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#mb-glycemic-load-calculator .mb-glc__formula {
  display:inline-block !important;
  margin:15px 5px 0 !important;
  padding:8px 12px !important;
  border:1px solid #eadfc8 !important;
  border-radius:9px !important;
  background:#fff !important;
  font:700 13px/1.35 Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator .mb-glc__tabs {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:8px !important;
  margin:24px 38px 0 !important;
  padding:5px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
}
#mb-glycemic-load-calculator .mb-glc__tab {
  flex:1 1 250px !important;
  min-height:46px !important;
  margin:0 !important;
  padding:11px 16px !important;
  border:1px solid transparent !important;
  border-radius:8px !important;
  background:transparent !important;
  box-shadow:none !important;
  font:700 15px/1.25 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-transform:none !important;
  cursor:pointer !important;
  transition:background .15s ease,border-color .15s ease,transform .15s ease !important;
}
#mb-glycemic-load-calculator .mb-glc__tab:hover {
  border-color:#b8d9c3 !important;
  background:#fff !important;
}
#mb-glycemic-load-calculator .mb-glc__tab[aria-selected="true"] {
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  box-shadow:none !important;
}
#mb-glycemic-load-calculator .mb-glc__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#mb-glycemic-load-calculator .mb-glc__panel[hidden] { display:none !important; }
#mb-glycemic-load-calculator .mb-glc__grid {
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:18px !important;
  margin:0 !important;
}
#mb-glycemic-load-calculator .mb-glc__field { min-width:0 !important; margin:0 !important; }
#mb-glycemic-load-calculator .mb-glc__field--full { grid-column:1/-1 !important; }
#mb-glycemic-load-calculator .mb-glc__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  font:700 15px/1.35 Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator .mb-glc__hint {
  display:block !important;
  margin:7px 0 0 !important;
  padding:0 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator input,
#mb-glycemic-load-calculator select {
  display:block !important;
  width:100% !important;
  min-width:0 !important;
  min-height:48px !important;
  margin:0 !important;
  padding:11px 12px !important;
  border:1px solid #d4d6d1 !important;
  border-radius:8px !important;
  background:#fff !important;
  box-shadow:none !important;
  font:400 16px/1.3 Arial,Helvetica,sans-serif !important;
  appearance:auto !important;
}
#mb-glycemic-load-calculator input[readonly] { background:#f6f6f3 !important; }
#mb-glycemic-load-calculator input:disabled,
#mb-glycemic-load-calculator select:disabled { opacity:.72 !important; cursor:not-allowed !important; }
#mb-glycemic-load-calculator input::placeholder { color:#000 !important; -webkit-text-fill-color:#000 !important; opacity:.55 !important; }
#mb-glycemic-load-calculator input:focus,
#mb-glycemic-load-calculator select:focus,
#mb-glycemic-load-calculator button:focus-visible,
#mb-glycemic-load-calculator a:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
  border-color:var(--mb-green-dark) !important;
}
#mb-glycemic-load-calculator .mb-glc__metrics {
  display:grid !important;
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:22px 0 0 !important;
}
#mb-glycemic-load-calculator .mb-glc__metric {
  min-width:0 !important;
  margin:0 !important;
  padding:15px 16px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
}
#mb-glycemic-load-calculator .mb-glc__metric span {
  display:block !important;
  margin:0 0 5px !important;
  font:400 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator .mb-glc__metric strong {
  display:block !important;
  overflow-wrap:anywhere !important;
  font:700 20px/1.25 Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator .mb-glc__result {
  margin:22px 0 0 !important;
  padding:22px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:16px !important;
  background:var(--mb-green-soft) !important;
}
#mb-glycemic-load-calculator .mb-glc__result-top {
  display:flex !important;
  align-items:center !important;
  justify-content:space-between !important;
  gap:18px !important;
  margin:0 !important;
}
#mb-glycemic-load-calculator .mb-glc__result-label {
  margin:0 0 5px !important;
  font:400 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator .mb-glc__result-value {
  margin:0 !important;
  padding:0 !important;
  font:700 clamp(38px,6vw,48px)/1 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.02em !important;
}
#mb-glycemic-load-calculator .mb-glc__badge {
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  min-height:38px !important;
  max-width:100% !important;
  padding:8px 12px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  font:700 14px/1.25 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#mb-glycemic-load-calculator .mb-glc__badge--low { background:#e8f7ed !important; border-color:#bcdcc6 !important; }
#mb-glycemic-load-calculator .mb-glc__badge--medium { background:#fff3bf !important; border-color:#e5d28d !important; }
#mb-glycemic-load-calculator .mb-glc__badge--high { background:#fde7e5 !important; border-color:#e4b9b4 !important; }
#mb-glycemic-load-calculator .mb-glc__interpretation {
  margin:15px 0 0 !important;
  font:400 15px/1.55 Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator .mb-glc__details {
  margin:16px 0 0 !important;
  padding:16px 0 0 !important;
  border-top:1px solid #cfe4d5 !important;
  font:400 14px/1.58 Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator .mb-glc__details p { margin:5px 0 !important; }
#mb-glycemic-load-calculator .mb-glc__details a { font-weight:700 !important; text-decoration:underline !important; }
#mb-glycemic-load-calculator .mb-glc__actions {
  display:flex !important;
  justify-content:flex-end !important;
  gap:10px !important;
  margin:18px 0 0 !important;
}
#mb-glycemic-load-calculator .mb-glc__button {
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  min-height:48px !important;
  margin:0 !important;
  padding:12px 24px !important;
  border:2px solid var(--mb-green) !important;
  border-radius:8px !important;
  background:#fff !important;
  box-shadow:none !important;
  font:700 15px/1.2 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-transform:none !important;
  cursor:pointer !important;
  transition:background .15s ease,border-color .15s ease,transform .15s ease !important;
}
#mb-glycemic-load-calculator .mb-glc__button:hover { border-color:var(--mb-green-dark) !important; background:var(--mb-green-soft) !important; }
#mb-glycemic-load-calculator .mb-glc__button:active { transform:translateY(1px) !important; }
#mb-glycemic-load-calculator .mb-glc__warning,
#mb-glycemic-load-calculator .mb-glc__empty {
  margin:24px 0 0 !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#mb-glycemic-load-calculator .mb-glc__privacy {
  margin:15px 0 0 !important;
  padding:0 !important;
  font:400 13px/1.5 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
.mb-glc-page { max-width:1120px !important; margin:0 auto !important; font-family:Arial,Helvetica,sans-serif !important; }
.mb-glc-page, .mb-glc-page *, .mb-glc-cta, .mb-glc-cta * { color:#000 !important; -webkit-text-fill-color:#000 !important; font-family:Arial,Helvetica,sans-serif !important; box-sizing:border-box !important; }
.mb-glc-page__notice { margin:24px 0 !important; padding:15px 17px !important; border:1px solid #eadfc8 !important; border-left:4px solid #DBC442 !important; border-radius:12px !important; background:#faf7ef !important; }
.mb-glc-cta { display:flex !important; align-items:center !important; justify-content:space-between !important; gap:20px !important; margin:30px 0 !important; padding:22px !important; border:2px solid #2dc26b !important; border-radius:12px !important; background:#faf7ef !important; }
.mb-glc-cta__button { display:inline-flex !important; align-items:center !important; justify-content:center !important; min-height:46px !important; padding:11px 18px !important; border-radius:8px !important; background:#2dc26b !important; font-weight:700 !important; text-decoration:none !important; }
@media (max-width:760px) {
  #mb-glycemic-load-calculator { margin:18px auto 30px !important; }
  #mb-glycemic-load-calculator .mb-glc { border-radius:14px !important; }
  #mb-glycemic-load-calculator .mb-glc__header { padding:28px 20px 22px !important; }
  #mb-glycemic-load-calculator .mb-glc__tabs { margin:20px 20px 0 !important; }
  #mb-glycemic-load-calculator .mb-glc__body { padding:24px 20px 28px !important; }
  #mb-glycemic-load-calculator .mb-glc__grid { grid-template-columns:1fr !important; }
  #mb-glycemic-load-calculator .mb-glc__field--full { grid-column:auto !important; }
  #mb-glycemic-load-calculator .mb-glc__metrics { grid-template-columns:1fr !important; }
  #mb-glycemic-load-calculator .mb-glc__result { padding:18px !important; }
  #mb-glycemic-load-calculator .mb-glc__result-top { align-items:flex-start !important; flex-direction:column !important; }
  #mb-glycemic-load-calculator .mb-glc__actions { flex-direction:column !important; align-items:stretch !important; }
  #mb-glycemic-load-calculator .mb-glc__button { width:100% !important; }
  .mb-glc-cta { align-items:stretch !important; flex-direction:column !important; }
  .mb-glc-cta__button { width:100% !important; }
}
@media (max-width:480px) {
  #mb-glycemic-load-calculator .mb-glc__tabs { flex-direction:column !important; }
  #mb-glycemic-load-calculator .mb-glc__tab { flex:1 1 auto !important; width:100% !important; }
}
@media (prefers-reduced-motion:reduce) {
  #mb-glycemic-load-calculator *,
  #mb-glycemic-load-calculator *::before,
  #mb-glycemic-load-calculator *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
@media print {
  #mb-glycemic-load-calculator { max-width:none !important; margin:0 !important; }
  #mb-glycemic-load-calculator .mb-glc { border:1px solid #bbb !important; box-shadow:none !important; }
  #mb-glycemic-load-calculator .mb-glc__tabs,
  #mb-glycemic-load-calculator .mb-glc__actions,
  #mb-glycemic-load-calculator .mb-glc__privacy { display:none !important; }
  #mb-glycemic-load-calculator .mb-glc__panel[hidden] { display:block !important; }
}
`;
    document.head.appendChild(style);
  }

  var CONTAINER_ID = "mb-glycemic-load-calculator";
  var SOURCE_TABLES_URL = "https://doi.org/10.1093/ajcn/nqab233";

  var FOODS = [
  {
    "id": "bily-psenicny-chleb",
    "foodName": "Biely pšeničný chlieb",
    "category": "Pečivo",
    "preparation": "bežný krájaný chlieb",
    "gi": 75,
    "giMin": 72,
    "giMax": 93,
    "carbsPer100g": 49.0,
    "defaultPortion": 50,
    "note": "Hodnoty sa výrazne mení podľa múky, struktury striedky, kynutí a výrobcu.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "veka-bila",
    "foodName": "Veka biela",
    "category": "Pečivo",
    "preparation": "česká testovaná veka; historická receptúra",
    "gi": 75,
    "giMin": 75,
    "giMax": 75,
    "carbsPer100g": 52.0,
    "defaultPortion": 50,
    "note": "GI 75 vychádza z konkrétneho výrobku testovaného v ČR. Dnešná receptúra môže byť iná.",
    "evidence": "Priame testovanie konkrétnej českej položky",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "rohlik-bily",
    "foodName": "Rohlík nebo žemľa",
    "category": "Pečivo",
    "preparation": "mäkké biele pečivo",
    "gi": 56,
    "giMin": 52,
    "giMax": 70,
    "carbsPer100g": 53.0,
    "defaultPortion": 43,
    "note": "Jde o priradenie k testovaným mäkkým bielym rolkám; konkrétny český nebo slovenský výrobok môže byť odlišný.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "toastovy-chleb-bily",
    "foodName": "Toastový chlieb",
    "category": "Pečivo",
    "preparation": "biely, balený",
    "gi": 75,
    "giMin": 70,
    "giMax": 85,
    "carbsPer100g": 47.0,
    "defaultPortion": 50,
    "note": "Použite sacharidy z etikety. Prídavok tuku, cukru, vlákniny a spôsob výroby mení GI.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "zitny-kvaskovy-chleb",
    "foodName": "Ražný kváskový chlieb",
    "category": "Pečivo",
    "preparation": "tradične kvašený",
    "gi": 59,
    "giMin": 48,
    "giMax": 65,
    "carbsPer100g": 42.0,
    "defaultPortion": 50,
    "note": "Delší fermentácia a vyšší podiel raže môžu GI znižovať; označenie „kváskový“ samo o sebe nízky GI nezaručuje.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "psenicno-zitny-kvaskovy",
    "foodName": "Pšenično-ražný kváskový chlieb",
    "category": "Pečivo",
    "preparation": "zmiešaný kváskový",
    "gi": 62,
    "giMin": 50,
    "giMax": 70,
    "carbsPer100g": 43.0,
    "defaultPortion": 50,
    "note": "Rozhoduje pomer múk, hrubosť mletia, fermentácia a podiel celých zŕn.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "zitny-celozrnny-chleb",
    "foodName": "Celozrnný ražný chlieb",
    "category": "Pečivo",
    "preparation": "hutný, celozrnný",
    "gi": 65,
    "giMin": 63,
    "giMax": 67,
    "carbsPer100g": 41.0,
    "defaultPortion": 50,
    "note": "Hutná štruktúra a celá zrná môžu spomaliť trávenie; jemne mletá múka pôsobí inak.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "celozrnny-psenicny-chleb",
    "foodName": "Celozrnný pšeničný chlieb",
    "category": "Pečivo",
    "preparation": "z jemne mleté celozrnné múky",
    "gi": 74,
    "giMin": 65,
    "giMax": 85,
    "carbsPer100g": 41.0,
    "defaultPortion": 50,
    "note": "Celozrnné označenie automaticky neznamená nízky GI, najmä pri jemném mletia.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "vicezrnny-chleb-cela-zrna",
    "foodName": "Vícezrnný chlieb",
    "category": "Pečivo",
    "preparation": "s viditelnými celými zrnami a semienkami",
    "gi": 43,
    "giMin": 34,
    "giMax": 55,
    "carbsPer100g": 40.0,
    "defaultPortion": 50,
    "note": "Nižší hodnoty sa týkajú výrobkov s vysokým podielom neporušených zŕn; bežný „vícezrnný“ chlieb môže byť vyššie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "krehky-zitny-chleb",
    "foodName": "Chrumkavý ražný chlieb",
    "category": "Pečivo",
    "preparation": "suchý chrumkavý plátok",
    "gi": 64,
    "giMin": 55,
    "giMax": 72,
    "carbsPer100g": 64.0,
    "defaultPortion": 20,
    "note": "GI môže byť stredná až vyššia, ale malá hmotnost porcie často udrží GL nižšie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bageta-bila",
    "foodName": "Biela bageta",
    "category": "Pečivo",
    "preparation": "francouzský typ",
    "gi": 75,
    "giMin": 57,
    "giMax": 83,
    "carbsPer100g": 56.0,
    "defaultPortion": 60,
    "note": "Pôvodná hodnota 95 bola príliš vysoká pre bežnú bagetu; testované bagety sa najčastejšie pohybovali približne 57–83.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pita-bila",
    "foodName": "Pita",
    "category": "Pečivo",
    "preparation": "biela pšeničná",
    "gi": 68,
    "giMin": 68,
    "giMax": 68,
    "carbsPer100g": 55.7,
    "defaultPortion": 60,
    "note": "Hodnota vychádza z priamo testovanej bielej pity; pri baleného výrobku použite sacharidy z etikety.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pita-celozrnna",
    "foodName": "Pita",
    "category": "Pečivo",
    "preparation": "celozrnná",
    "gi": 56,
    "giMin": 56,
    "giMax": 56,
    "carbsPer100g": 52.0,
    "defaultPortion": 60,
    "note": "Hodnota vychádza z priamo testované celozrnné pity.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "croissant-maslovy",
    "foodName": "Croissant",
    "category": "Pečivo",
    "preparation": "máslový",
    "gi": 55,
    "giMin": 45,
    "giMax": 67,
    "carbsPer100g": 45.0,
    "defaultPortion": 60,
    "note": "Tuk môže znížiť rýchlosť vyprázdňovanie žalúdka, ale porcie stále obsahuje významné množstvo sacharidov.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ovesne-vlocky-suche",
    "foodName": "Ovsené vločky",
    "category": "Obilniny a raňajky",
    "preparation": "tradiční vločky; porcie zadána v suchém stavu",
    "gi": 55,
    "giMin": 49,
    "giMax": 63,
    "carbsPer100g": 57.6,
    "defaultPortion": 60,
    "note": "GI zodpovedá tradičním vločkám po bežné príprave, zatiaľ čo sacharidy sa počítajú z odváženej suché porcie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ovesna-kase-huste-vlocky",
    "foodName": "Ovsená kaše",
    "category": "Obilniny a raňajky",
    "preparation": "z hrubých nebo silných vloček, varená",
    "gi": 55,
    "giMin": 49,
    "giMax": 63,
    "carbsPer100g": 10.1,
    "defaultPortion": 250,
    "note": "Hrubšie vločky a kratšie varenie mávajú nižší GI ako jemné nebo instantní variantovy.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ovesna-kase-jemne-vlocky",
    "foodName": "Ovsená kaše",
    "category": "Obilniny a raňajky",
    "preparation": "z jemných vloček, déle varená",
    "gi": 76,
    "giMin": 70,
    "giMax": 81,
    "carbsPer100g": 10.1,
    "defaultPortion": 250,
    "note": "Jemné vločky a dlhšie rozvarenie sprístupňujú škrob rýchloji.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ovesna-kase-instantni",
    "foodName": "Ovsená kaše",
    "category": "Obilniny a raňajky",
    "preparation": "instantní, pripravená ve vode",
    "gi": 82,
    "giMin": 76,
    "giMax": 87,
    "carbsPer100g": 12.0,
    "defaultPortion": 250,
    "note": "Instantní spracovanie zvyčajne zvyšuje rýchlosť trávenie. U ochucených zmesí použite etiketu.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "oves-steel-cut",
    "foodName": "Ovsená kaše",
    "category": "Obilniny a raňajky",
    "preparation": "z rezaného ovsa (steel-cut)",
    "gi": 50,
    "giMin": 48,
    "giMax": 53,
    "carbsPer100g": 10.5,
    "defaultPortion": 250,
    "note": "Menej narušená štruktúra zrná bývá spojena s nižším GI.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "muesli-prirodni",
    "foodName": "Müsli",
    "category": "Obilniny a raňajky",
    "preparation": "nepražené, bez pridaného cukru",
    "gi": 55,
    "giMin": 40,
    "giMax": 62,
    "carbsPer100g": 60.0,
    "defaultPortion": 60,
    "note": "Rozpätie je široké podľa podielu vloček, orechov, semen a sušeného ovocia.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "muesli-prazene",
    "foodName": "Müsli nebo granola",
    "category": "Obilniny a raňajky",
    "preparation": "pražené nebo chrumkavé",
    "gi": 65,
    "giMin": 62,
    "giMax": 86,
    "carbsPer100g": 64.0,
    "defaultPortion": 60,
    "note": "Pražení, jemnejší štruktúra a pridaná sladidlá môžu GI i množstvo sacharidov zvýšiť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cornflakes",
    "foodName": "Kukuričné lupínky",
    "category": "Obilniny a raňajky",
    "preparation": "bežné cornflakes",
    "gi": 77,
    "giMin": 66,
    "giMax": 93,
    "carbsPer100g": 81.0,
    "defaultPortion": 40,
    "note": "Testované výrobky sa výrazne líšia; väčšina je ve vysokém pásmu GI.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bran-flakes",
    "foodName": "Otrubové lupínky",
    "category": "Obilniny a raňajky",
    "preparation": "bran flakes",
    "gi": 65,
    "giMin": 50,
    "giMax": 74,
    "carbsPer100g": 67.0,
    "defaultPortion": 40,
    "note": "Obsah vlákniny sám o sebe nezaručuje nízky GI; dôležitá je štruktúra výrobku.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jecne-kroupy-varene",
    "foodName": "Jačmenné kroupy",
    "category": "Obilniny a raňajky",
    "preparation": "varené",
    "gi": 25,
    "giMin": 22,
    "giMax": 35,
    "carbsPer100g": 24.4,
    "defaultPortion": 180,
    "note": "Míra obroušení, odroda a dĺžka varenie môžu hodnotu posunúť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pohanka-kroupy-varena",
    "foodName": "Pohanka",
    "category": "Obilniny a raňajky",
    "preparation": "kroupy, varené",
    "gi": 50,
    "giMin": 46,
    "giMax": 51,
    "carbsPer100g": 17.0,
    "defaultPortion": 180,
    "note": "Hodnota platí pre varené kroupy; vločky nebo instantní kaše môžu mít vyšší GI.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pohankova-kase-vlocky",
    "foodName": "Pohanková kaše",
    "category": "Obilniny a raňajky",
    "preparation": "z vloček nebo instantnejšej úpravy",
    "gi": 71,
    "giMin": 65,
    "giMax": 76,
    "carbsPer100g": 15.0,
    "defaultPortion": 250,
    "note": "Výraznejšie technologické narušení zrná môže GI oproti celým kroupám zvýšiť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bulgur-vareny",
    "foodName": "Bulgur",
    "category": "Obilniny a raňajky",
    "preparation": "varený",
    "gi": 46,
    "giMin": 45,
    "giMax": 55,
    "carbsPer100g": 14.1,
    "defaultPortion": 180,
    "note": "Hrubšie bulgur a kratšie varenie zvyčajne spomaľujú trávenie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "kuskus-vareny",
    "foodName": "Kuskus",
    "category": "Obilniny a raňajky",
    "preparation": "zaliaty horúcou vodou",
    "gi": 65,
    "giMin": 65,
    "giMax": 65,
    "carbsPer100g": 21.8,
    "defaultPortion": 180,
    "note": "Priamo testovaná variantova; celozrnný nebo perlový kuskus sa môže líšiť.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "quinoa-bila-varena",
    "foodName": "Quinoa",
    "category": "Obilniny a raňajky",
    "preparation": "biela, varená",
    "gi": 50,
    "giMin": 50,
    "giMax": 53,
    "carbsPer100g": 18.5,
    "defaultPortion": 180,
    "note": "Rozpätie vychádza z niekoľkých testovaných varených variantov.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "proso-jahly-varene",
    "foodName": "Pšeno",
    "category": "Obilniny a raňajky",
    "preparation": "varené",
    "gi": 64,
    "giMin": 64,
    "giMax": 89,
    "carbsPer100g": 22.4,
    "defaultPortion": 180,
    "note": "Odroda a spôsob varenie mají veľký vliv; proto je rozpätie zámerne široké.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "polenta-varena",
    "foodName": "Polenta",
    "category": "Obilniny a raňajky",
    "preparation": "kukuričná kaše, varená",
    "gi": 68,
    "giMin": 68,
    "giMax": 68,
    "carbsPer100g": 12.5,
    "defaultPortion": 250,
    "note": "Priamo testovaná kukuričná kaša; instantní výrobky sa môžu líšiť.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-basmati-bila",
    "foodName": "Rýže basmati",
    "category": "Ryža",
    "preparation": "biela, varená",
    "gi": 62,
    "giMin": 57,
    "giMax": 67,
    "carbsPer100g": 25.2,
    "defaultPortion": 180,
    "note": "Pôvodná GI 50 byl príliš nízky jako všeobecná hodnota. Testované biele basmati sa často pohybovali približne 57–67.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-basmati-parboiled",
    "foodName": "Rýže basmati",
    "category": "Ryža",
    "preparation": "parboiled, varená",
    "gi": 52,
    "giMin": 52,
    "giMax": 54,
    "carbsPer100g": 25.0,
    "defaultPortion": 180,
    "note": "Predvarenie v pare môže pri niektorých výrobkov znížiť GI oproti bežné biele rýži.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-jasminova",
    "foodName": "Rýže jasmínová",
    "category": "Ryža",
    "preparation": "biela, varená",
    "gi": 89,
    "giMin": 80,
    "giMax": 96,
    "carbsPer100g": 27.3,
    "defaultPortion": 180,
    "note": "Pôvodná GI 80 zachytával dolnú hranicu; väčšina testovaných jasmínových ryží je vyššie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-dlouhozrnna-bila",
    "foodName": "Rýže dlhozrnná",
    "category": "Ryža",
    "preparation": "biela, varená",
    "gi": 60,
    "giMin": 47,
    "giMax": 76,
    "carbsPer100g": 26.3,
    "defaultPortion": 180,
    "note": "Odroda, obsah amylózy a doba varenie spôsobují veľmi široké rozpätie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-natural",
    "foodName": "Rýže natural",
    "category": "Ryža",
    "preparation": "hnedá, varená",
    "gi": 65,
    "giMin": 48,
    "giMax": 87,
    "carbsPer100g": 21.7,
    "defaultPortion": 180,
    "note": "Hnedá barva sama o sebe nezaručuje nízky GI; závisí na odrode a spracovanie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-parboiled",
    "foodName": "Rýže parboiled",
    "category": "Ryža",
    "preparation": "dlouhozrnná, varená",
    "gi": 57,
    "giMin": 48,
    "giMax": 74,
    "carbsPer100g": 25.0,
    "defaultPortion": 180,
    "note": "Jednotlivé značky a odrody sa líšia; pouraže je reprezentativní stredná hodnota.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-lepkava",
    "foodName": "Rýže lepkavá",
    "category": "Ryža",
    "preparation": "sticky rice, varená",
    "gi": 92,
    "giMin": 92,
    "giMax": 92,
    "carbsPer100g": 28.0,
    "defaultPortion": 180,
    "note": "Priamo testovaná lepkavá ryža mala vysoký GI.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-sushi",
    "foodName": "Rýže na sushi",
    "category": "Ryža",
    "preparation": "krátkozrnná, varená; bez započítania cukru v náleve",
    "gi": 89,
    "giMin": 80,
    "giMax": 92,
    "carbsPer100g": 28.0,
    "defaultPortion": 180,
    "note": "Krátkozrnná ryža bývá vysoko; ochucení cukrem množstvo sacharidov ďalej zvýši.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryzova-kase",
    "foodName": "Rýžová kaše",
    "category": "Ryža",
    "preparation": "rozvarená nebo instantnejšej",
    "gi": 78,
    "giMin": 70,
    "giMax": 90,
    "carbsPer100g": 14.0,
    "defaultPortion": 250,
    "note": "Rozvarenie a jemná štruktúra zvyčajne zvyšujú dostupnost škrobu.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryzove-chlebicky",
    "foodName": "Rýžové chlebíky",
    "category": "Ryža",
    "preparation": "pufované",
    "gi": 82,
    "giMin": 76,
    "giMax": 105,
    "carbsPer100g": 80.0,
    "defaultPortion": 20,
    "note": "Pufování výrazne narušuje strukturu škrobu; testované výrobky mají veľmi široké a často vysoké GI.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "spagety-al-dente",
    "foodName": "Špagety",
    "category": "Cestoviny a rezance",
    "preparation": "al dente",
    "gi": 45,
    "giMin": 32,
    "giMax": 52,
    "carbsPer100g": 28.0,
    "defaultPortion": 200,
    "note": "Pevnejšia štruktúra cestovín zpomaluje trávenie škrobu.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "spagety-mekke",
    "foodName": "Špagety",
    "category": "Cestoviny a rezance",
    "preparation": "domäkka uvarené",
    "gi": 58,
    "giMin": 52,
    "giMax": 64,
    "carbsPer100g": 28.0,
    "defaultPortion": 200,
    "note": "Delší varenie zvyšuje želatinizáciu škrobu a môže GI zvýšiť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "spagety-celozrnne",
    "foodName": "Špagety",
    "category": "Cestoviny a rezance",
    "preparation": "celozrnné, varené",
    "gi": 55,
    "giMin": 48,
    "giMax": 62,
    "carbsPer100g": 24.0,
    "defaultPortion": 200,
    "note": "Celozrnné variantovy sa líšia podľa hrubosti múky a doby varenie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "penne-varene",
    "foodName": "Penne",
    "category": "Cestoviny a rezance",
    "preparation": "varené na skus",
    "gi": 50,
    "giMin": 44,
    "giMax": 59,
    "carbsPer100g": 27.0,
    "defaultPortion": 200,
    "note": "Rozpätie vychádza z viacerých testovaných výrobkov a rôznych dob varenie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fusilli-varene",
    "foodName": "Fusilli",
    "category": "Cestoviny a rezance",
    "preparation": "varené na skus",
    "gi": 55,
    "giMin": 49,
    "giMax": 61,
    "carbsPer100g": 27.0,
    "defaultPortion": 200,
    "note": "Tvar, výrobcu a stupeň uvarenie ovlivňují výsledek.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "tagliatelle-vajecne",
    "foodName": "Vaječné rezance nebo tagliatelle",
    "category": "Cestoviny a rezance",
    "preparation": "varené",
    "gi": 55,
    "giMin": 47,
    "giMax": 62,
    "carbsPer100g": 25.0,
    "defaultPortion": 200,
    "note": "Pouraže je reprezentativní hodnota pre pšeničné vaječné cestoviny.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "lasagne-platy",
    "foodName": "Lasagne",
    "category": "Cestoviny a rezance",
    "preparation": "uvarené pláty bez omáčky",
    "gi": 53,
    "giMin": 45,
    "giMax": 60,
    "carbsPer100g": 25.0,
    "defaultPortion": 200,
    "note": "Kalkulace sa týka iba cestovinové složky, nie celého smíšeného jedla.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "gnocchi-bramborove",
    "foodName": "Gnocchi",
    "category": "Cestoviny a rezance",
    "preparation": "zemiakové, varené",
    "gi": 68,
    "giMin": 68,
    "giMax": 68,
    "carbsPer100g": 29.0,
    "defaultPortion": 200,
    "note": "Priamo testovaná variantova; receptúry s rôznym podielom zemiakov a múky sa môžu líšiť.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryzove-testoviny",
    "foodName": "Rýžové cestoviny",
    "category": "Cestoviny a rezance",
    "preparation": "bezlepkové, varené",
    "gi": 51,
    "giMin": 51,
    "giMax": 51,
    "carbsPer100g": 25.0,
    "defaultPortion": 200,
    "note": "Priamo testovaná bezlepková rýžová pasta.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "psenicne-nudle",
    "foodName": "Pšeničné rezance",
    "category": "Cestoviny a rezance",
    "preparation": "sušené, varené",
    "gi": 62,
    "giMin": 55,
    "giMax": 62,
    "carbsPer100g": 25.0,
    "defaultPortion": 200,
    "note": "Délka varenie a použitá múka môžu hodnotu zmeniť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "brambory-varny-typ-a",
    "foodName": "Zemiaky",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "voskové, varené; varný typ A",
    "gi": 63,
    "giMin": 53,
    "giMax": 69,
    "carbsPer100g": 15.4,
    "defaultPortion": 200,
    "note": "Nižší hodnoty sa týkajú konkrétnuch voskových odrôd, napríklad Nicola nebo Charlotte.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "brambory-varny-typ-c",
    "foodName": "Zemiaky",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "moučnaté, varené; varný typ C",
    "gi": 79,
    "giMin": 74,
    "giMax": 101,
    "carbsPer100g": 15.4,
    "defaultPortion": 200,
    "note": "Moučnaté odrody mávajú často vyšší GI; odroda je zásadní.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "brambory-ve-slupce",
    "foodName": "Zemiaky",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "varené ve slupce",
    "gi": 65,
    "giMin": 58,
    "giMax": 82,
    "carbsPer100g": 15.4,
    "defaultPortion": 200,
    "note": "Slupka sama nezaručuje nízky GI; dôležitá je odroda, rozvarenie a velikost kusov.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bramborova-kase-domaci",
    "foodName": "Zemiaková kaše",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "domácí z varených zemiakov",
    "gi": 76,
    "giMin": 68,
    "giMax": 81,
    "carbsPer100g": 14.0,
    "defaultPortion": 250,
    "note": "Pôvodná GI 87 byl príliš vysoký pre bežnú domácí kaši; instantní kaše je uvediena osobitne.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bramborova-kase-instantni",
    "foodName": "Zemiaková kaše",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "instantní",
    "gi": 88,
    "giMin": 69,
    "giMax": 97,
    "carbsPer100g": 13.0,
    "defaultPortion": 250,
    "note": "Technologické spracovanie a jemná štruktúra často vedú k vyššímu GI.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "brambory-pecene",
    "foodName": "Zemiaky",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "pečené",
    "gi": 90,
    "giMin": 69,
    "giMax": 103,
    "carbsPer100g": 18.0,
    "defaultPortion": 250,
    "note": "Pečené zemiakovy mají často vysoký GI, ale výsledek sa výrazne mení podľa odrody.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hranolky-trouba",
    "foodName": "Hranolčeky",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "pečené v rúre",
    "gi": 65,
    "giMin": 55,
    "giMax": 76,
    "carbsPer100g": 25.0,
    "defaultPortion": 150,
    "note": "Použite sacharidy z etikety konkrétneho výrobku.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hranolky-smazene",
    "foodName": "Hranolčeky",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "vyprážané",
    "gi": 63,
    "giMin": 42,
    "giMax": 76,
    "carbsPer100g": 35.0,
    "defaultPortion": 150,
    "note": "Tuk môže spomaliť vyprázdňovanie žalúdka, ale energetická hodnota a množstvo sacharidov zostávajú významné.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bataty-varene",
    "foodName": "Batáty",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "varené",
    "gi": 46,
    "giMin": 41,
    "giMax": 61,
    "carbsPer100g": 17.1,
    "defaultPortion": 200,
    "note": "Varenie vedie zvyčajne k nižším hodnotám ako pečenie; odrody sa líšia.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bataty-pecene",
    "foodName": "Batáty",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "pečené",
    "gi": 87,
    "giMin": 82,
    "giMax": 94,
    "carbsPer100g": 20.1,
    "defaultPortion": 200,
    "note": "Pečení môže výrazne zvýšiť dostupnost škrobu oproti varenie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "kukurice-sladka",
    "foodName": "Kukurica sladká",
    "category": "Zemiaky a ďalšie prílohy",
    "preparation": "varená nebo z mikrovlnnej rúry",
    "gi": 53,
    "giMin": 51,
    "giMax": 55,
    "carbsPer100g": 12.9,
    "defaultPortion": 150,
    "note": "Rozpätie vychádza z priamo testovaných variantov sladké kukurice.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cocka-cervena",
    "foodName": "Šošovica",
    "category": "Strukoviny",
    "preparation": "červená, varená",
    "gi": 26,
    "giMin": 14,
    "giMax": 42,
    "carbsPer100g": 12.0,
    "defaultPortion": 180,
    "note": "Odroda a míra rozvarenie spôsobují rozdiely; strukoviny bývají väčšinou v nízkem pásmu GI.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cocka-zelena-hneda",
    "foodName": "Šošovica",
    "category": "Strukoviny",
    "preparation": "zelená nebo hnedá, varená",
    "gi": 30,
    "giMin": 22,
    "giMax": 42,
    "carbsPer100g": 12.0,
    "defaultPortion": 180,
    "note": "Pevnejšia zrná zvyčajne spomaľujú trávenie oproti výrazne rozvarenej čočce.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cizrna-varena",
    "foodName": "Cícer",
    "category": "Strukoviny",
    "preparation": "varená",
    "gi": 28,
    "giMin": 10,
    "giMax": 36,
    "carbsPer100g": 19.0,
    "defaultPortion": 180,
    "note": "Rozpätie zahrnuje rôzne odrody a spôsoby varenie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fazole-cervene",
    "foodName": "Fazuľa",
    "category": "Strukoviny",
    "preparation": "červené kidney, varené",
    "gi": 24,
    "giMin": 19,
    "giMax": 35,
    "carbsPer100g": 16.0,
    "defaultPortion": 180,
    "note": "Hodnoty sa líšia medzi konzervovanými a doma varenými fazuľou.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fazole-bile",
    "foodName": "Fazuľa",
    "category": "Strukoviny",
    "preparation": "biele, varené",
    "gi": 31,
    "giMin": 24,
    "giMax": 40,
    "carbsPer100g": 18.0,
    "defaultPortion": 180,
    "note": "Pouraže je reprezentativní hodnota pre varené biele fazuľa.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fazole-v-tomatove-omacce",
    "foodName": "Fazuľa",
    "category": "Strukoviny",
    "preparation": "v rajčatové omáčce, konzervované",
    "gi": 40,
    "giMin": 35,
    "giMax": 48,
    "carbsPer100g": 12.9,
    "defaultPortion": 200,
    "note": "Pridaný cukr v omáčce môže zvýšiť množstvo sacharidov; použite etiketu.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hrasok-zeleny",
    "foodName": "Hrášok",
    "category": "Strukoviny",
    "preparation": "zelený, varený",
    "gi": 51,
    "giMin": 39,
    "giMax": 54,
    "carbsPer100g": 10.0,
    "defaultPortion": 150,
    "note": "Čerstvý, mrazený a konzervovaný hrášok sa môžu líšiť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hras-loupany",
    "foodName": "Hrách",
    "category": "Strukoviny",
    "preparation": "lúpaný, varený",
    "gi": 32,
    "giMin": 25,
    "giMax": 35,
    "carbsPer100g": 13.0,
    "defaultPortion": 180,
    "note": "Rozvarenie a odroda môžu hodnotu zmeniť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fazole-cerne",
    "foodName": "Fazuľa",
    "category": "Strukoviny",
    "preparation": "černé, varené",
    "gi": 30,
    "giMin": 20,
    "giMax": 35,
    "carbsPer100g": 16.0,
    "defaultPortion": 180,
    "note": "Zvyčajne nízky GI; presná hodnota závisí na odrode a príprave.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hummus",
    "foodName": "Hummus",
    "category": "Strukoviny",
    "preparation": "cícerová pomazánka",
    "gi": 15,
    "giMin": 6,
    "giMax": 15,
    "carbsPer100g": 14.0,
    "defaultPortion": 80,
    "note": "Receptury sa líšia množstvom cíceru, tahini a dalších surovin; použite etiketu, je-li dostupná.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jablko",
    "foodName": "Jablko",
    "category": "Ovocie",
    "preparation": "surové sa šupkou",
    "gi": 44,
    "giMin": 36,
    "giMax": 44,
    "carbsPer100g": 12.1,
    "defaultPortion": 150,
    "note": "Aktuálne priamo testovaná surová jablka mala GI 44; odroda a zrelosť môžu výsledek mierne posunout.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hruska",
    "foodName": "Hruška",
    "category": "Ovocie",
    "preparation": "surová, zrelá",
    "gi": 38,
    "giMin": 24,
    "giMax": 42,
    "carbsPer100g": 12.1,
    "defaultPortion": 160,
    "note": "Nezrelá hruška môže mít nižší GI ako veľmi zrelá.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "banan-stredne-zraly",
    "foodName": "Banán",
    "category": "Ovocie",
    "preparation": "stredne zrelý",
    "gi": 49,
    "giMin": 47,
    "giMax": 53,
    "carbsPer100g": 20.1,
    "defaultPortion": 120,
    "note": "Zralost významne mení složení škrobu a cukrov.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "banan-prezraly",
    "foodName": "Banán",
    "category": "Ovocie",
    "preparation": "prezretý",
    "gi": 57,
    "giMin": 57,
    "giMax": 57,
    "carbsPer100g": 20.1,
    "defaultPortion": 120,
    "note": "Priamo testovaný prezretý banán mal vyšší GI ako bežne zrelá variantova.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pomeranc",
    "foodName": "Pomaranč",
    "category": "Ovocie",
    "preparation": "surový",
    "gi": 45,
    "giMin": 40,
    "giMax": 45,
    "carbsPer100g": 9.1,
    "defaultPortion": 180,
    "note": "Celý plod obsahuje strukturu a vlákninu, které džús postrádá.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mandarinka",
    "foodName": "Mandarinka",
    "category": "Ovocie",
    "preparation": "surová",
    "gi": 47,
    "giMin": 42,
    "giMax": 50,
    "carbsPer100g": 10.0,
    "defaultPortion": 120,
    "note": "Reprezentativní hodnota pre citrusový plod; odrody sa líšia.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "grapefruit",
    "foodName": "Grapefruit",
    "category": "Ovocie",
    "preparation": "surový",
    "gi": 25,
    "giMin": 25,
    "giMax": 35,
    "carbsPer100g": 8.0,
    "defaultPortion": 200,
    "note": "Nízká hodnota je orientačná; velikost a sladkosť plodu sa líšia.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hrozny",
    "foodName": "Hrozno",
    "category": "Ovocie",
    "preparation": "čerstvé",
    "gi": 54,
    "giMin": 50,
    "giMax": 59,
    "carbsPer100g": 17.0,
    "defaultPortion": 150,
    "note": "Pôvodná GI 59 odpovídal hornú hranicu; reprezentativní hodnota je približne 54.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jahody",
    "foodName": "Jahody",
    "category": "Ovocie",
    "preparation": "čerstvé",
    "gi": 40,
    "giMin": 25,
    "giMax": 41,
    "carbsPer100g": 5.7,
    "defaultPortion": 150,
    "note": "Nízké množstvo sacharidov v bežné porcii zvyčajne vedie k nízke GL.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "boruvky",
    "foodName": "Čučoriedky",
    "category": "Ovocie",
    "preparation": "čerstvé",
    "gi": 53,
    "giMin": 50,
    "giMax": 53,
    "carbsPer100g": 12.1,
    "defaultPortion": 150,
    "note": "Hodnota vychádza mimo iné z priamo testovaných divokých čučoriedok.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "maliny",
    "foodName": "Maliny",
    "category": "Ovocie",
    "preparation": "čerstvé",
    "gi": 25,
    "giMin": 25,
    "giMax": 32,
    "carbsPer100g": 5.4,
    "defaultPortion": 150,
    "note": "GI je orientačná, ale nízke množstvo dostupných sacharidov udržiava GL porcie nízku.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "meloun-vodni",
    "foodName": "Vodní meloun",
    "category": "Ovocie",
    "preparation": "čerstvý",
    "gi": 51,
    "giMin": 47,
    "giMax": 55,
    "carbsPer100g": 7.1,
    "defaultPortion": 250,
    "note": "Novšie testované hodnoty sú približne 47–55; staršie tabulky často uvádzali vyšší čísla.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mango",
    "foodName": "Mango",
    "category": "Ovocie",
    "preparation": "čerstvé",
    "gi": 51,
    "giMin": 41,
    "giMax": 56,
    "carbsPer100g": 13.5,
    "defaultPortion": 150,
    "note": "Odroda a zrelosť mají vliv na GI i obsah cukrov.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ananas",
    "foodName": "Ananas",
    "category": "Ovocie",
    "preparation": "čerstvý",
    "gi": 59,
    "giMin": 51,
    "giMax": 66,
    "carbsPer100g": 11.7,
    "defaultPortion": 150,
    "note": "Čerstvý, konzervovaný a veľmi zrelý ananas sa môžu líšiť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "broskev",
    "foodName": "Broskyňa",
    "category": "Ovocie",
    "preparation": "čerstvá",
    "gi": 42,
    "giMin": 28,
    "giMax": 56,
    "carbsPer100g": 8.5,
    "defaultPortion": 150,
    "note": "Rozpätie je širší pre odrodám a stupni zrelosťi.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "nektarinka",
    "foodName": "Nektarinka",
    "category": "Ovocie",
    "preparation": "čerstvá",
    "gi": 43,
    "giMin": 43,
    "giMax": 43,
    "carbsPer100g": 9.0,
    "defaultPortion": 150,
    "note": "Priamo testovaná čerstvá nektarinka.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "kiwi",
    "foodName": "Kiwi",
    "category": "Ovocie",
    "preparation": "čerstvé",
    "gi": 47,
    "giMin": 47,
    "giMax": 47,
    "carbsPer100g": 11.0,
    "defaultPortion": 150,
    "note": "Priamo testovaná čerstvá variantova.",
    "evidence": "Priame testovanie konkrétnej varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "tresne",
    "foodName": "Čerešne",
    "category": "Ovocie",
    "preparation": "čerstvé",
    "gi": 22,
    "giMin": 22,
    "giMax": 29,
    "carbsPer100g": 13.8,
    "defaultPortion": 150,
    "note": "Odroda a zrelosť môžu hodnotu meniť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "svestky",
    "foodName": "Slivky",
    "category": "Ovocie",
    "preparation": "čerstvé",
    "gi": 35,
    "giMin": 24,
    "giMax": 40,
    "carbsPer100g": 10.2,
    "defaultPortion": 150,
    "note": "Pouraže je reprezentativní hodnota pre čerstvé slivky.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "merunky",
    "foodName": "Marhule",
    "category": "Ovocie",
    "preparation": "čerstvé",
    "gi": 38,
    "giMin": 34,
    "giMax": 42,
    "carbsPer100g": 9.1,
    "defaultPortion": 150,
    "note": "Priamo testované čerstvé marhule sa pohybovali približne 34–42.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "merunky-susene",
    "foodName": "Sušené marhule",
    "category": "Ovocie",
    "preparation": "nesladené",
    "gi": 42,
    "giMin": 32,
    "giMax": 56,
    "carbsPer100g": 55.0,
    "defaultPortion": 40,
    "note": "GI môže byť nízky až stredná, ale koncentrované sacharidy môžu zvýšiť GL porcie.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "rozinky",
    "foodName": "Rozinky",
    "category": "Ovocie",
    "preparation": "sušené",
    "gi": 64,
    "giMin": 54,
    "giMax": 66,
    "carbsPer100g": 75.0,
    "defaultPortion": 40,
    "note": "Malá hmotnost porcie je dôležitá, protože sacharidy sú koncentrované.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "datle",
    "foodName": "Datle",
    "category": "Ovocie",
    "preparation": "sušené, bežné odrody",
    "gi": 49,
    "giMin": 46,
    "giMax": 54,
    "carbsPer100g": 70.0,
    "defaultPortion": 40,
    "note": "Priamo testované odrody sa často pohybovali približne 46–54.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mleko-polotucne",
    "foodName": "Mlieko",
    "category": "Mliečne výrobky",
    "preparation": "polotučné",
    "gi": 29,
    "giMin": 25,
    "giMax": 31,
    "carbsPer100g": 4.8,
    "defaultPortion": 250,
    "note": "Mliečne výrobky môžu vyvolávať vyšší inzulinovou odpoveď, ako by samotný GI naznačoval.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mleko-plnotucne",
    "foodName": "Mlieko",
    "category": "Mliečne výrobky",
    "preparation": "plnotučné",
    "gi": 32,
    "giMin": 30,
    "giMax": 46,
    "carbsPer100g": 4.7,
    "defaultPortion": 250,
    "note": "Priamo testované výrobky sa líšili; pouraže je reprezentativní hodnota novšiech testov.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jogurt-bily",
    "foodName": "Biely jogurt",
    "category": "Mliečne výrobky",
    "preparation": "nesladený",
    "gi": 17,
    "giMin": 11,
    "giMax": 36,
    "carbsPer100g": 4.7,
    "defaultPortion": 150,
    "note": "Obsah sacharidov sa líšia podľa odkvapkania a kultury; použite etiketu.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jogurt-recky",
    "foodName": "Grécky jogurt",
    "category": "Mliečne výrobky",
    "preparation": "biely, nesladený",
    "gi": 12,
    "giMin": 11,
    "giMax": 19,
    "carbsPer100g": 3.8,
    "defaultPortion": 150,
    "note": "Nízké množstvo sacharidov vedie spravidla k veľmi nízke GL.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jogurt-ovocny",
    "foodName": "Ovocný jogurt",
    "category": "Mliečne výrobky",
    "preparation": "sladený",
    "gi": 41,
    "giMin": 33,
    "giMax": 50,
    "carbsPer100g": 13.0,
    "defaultPortion": 150,
    "note": "Receptury sa výrazne líšia množstvom pridaného cukru; etiketa má prednosť.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "kefir",
    "foodName": "Kefír",
    "category": "Mliečne výrobky",
    "preparation": "biely, neochutený",
    "gi": 18,
    "giMin": 11,
    "giMax": 36,
    "carbsPer100g": 4.5,
    "defaultPortion": 250,
    "note": "Fermentované mliečne výrobky mají často nízky GI; konkrétnu kultura a receptúra sa líšia.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mleko-cokoladove",
    "foodName": "Čokoládové mlieko",
    "category": "Mliečne výrobky",
    "preparation": "sladené",
    "gi": 32,
    "giMin": 24,
    "giMax": 37,
    "carbsPer100g": 10.5,
    "defaultPortion": 250,
    "note": "Použite sacharidy z etikety konkrétneho výrobku.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "zmrzlina",
    "foodName": "Zmrzlina",
    "category": "Mliečne výrobky",
    "preparation": "bežná mliečna",
    "gi": 50,
    "giMin": 39,
    "giMax": 62,
    "carbsPer100g": 23.0,
    "defaultPortion": 100,
    "note": "Tuk snižuje rýchlosť trávenie, ale množstvo cukrov a velikost porcie sú rozhodujúce.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryzovy-nakyp-puding",
    "foodName": "Rýžový pudink nebo mliečna ryža",
    "category": "Mliečne výrobky",
    "preparation": "hotový výrobok",
    "gi": 59,
    "giMin": 50,
    "giMax": 65,
    "carbsPer100g": 18.0,
    "defaultPortion": 200,
    "note": "Jde o zmiešaný výrobok; receptúry sa líšia množstvom ryža, mlieka a cukru.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "sacharoza",
    "foodName": "Kryštálový cukor",
    "category": "Sladkosti a nápoje",
    "preparation": "sacharóza",
    "gi": 65,
    "giMin": 60,
    "giMax": 65,
    "carbsPer100g": 100.0,
    "defaultPortion": 10,
    "note": "GI sacharózy je nižší ako pri čisté glukózy, ale jde prakticky o 100 % dostupných sacharidov.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "glukoza",
    "foodName": "Glukóza",
    "category": "Sladkosti a nápoje",
    "preparation": "dextróza",
    "gi": 100,
    "giMin": 100,
    "giMax": 100,
    "carbsPer100g": 100.0,
    "defaultPortion": 10,
    "note": "Glukóza je referenční potravina sa GI 100.",
    "evidence": "Referenčná hodnota",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "med-bezny",
    "foodName": "Med",
    "category": "Sladkosti a nápoje",
    "preparation": "bežný zmiešaný med",
    "gi": 58,
    "giMin": 35,
    "giMax": 77,
    "carbsPer100g": 82.0,
    "defaultPortion": 20,
    "note": "GI medu sa výrazne mení podľa pomeru glukózy a fruktózy a botanického pôvodu.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "med-lipovy-cz",
    "foodName": "Med",
    "category": "Sladkosti a nápoje",
    "preparation": "lipový; historicky testovaný český vzorek",
    "gi": 77,
    "giMin": 77,
    "giMax": 77,
    "carbsPer100g": 82.0,
    "defaultPortion": 20,
    "note": "Hodnota sa týka konkrétneho českého vzorku a nemožno ji automaticky preniesť na každý lipový med.",
    "evidence": "Priame testovanie konkrétnej českej položky",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cokolada-horka",
    "foodName": "Horká čokoláda",
    "category": "Sladkosti a nápoje",
    "preparation": "70–85 % kakaa",
    "gi": 29,
    "giMin": 18,
    "giMax": 44,
    "carbsPer100g": 35.0,
    "defaultPortion": 25,
    "note": "Pôvodná všeobecná hodnota 40 bola nahradená rozpätiem podľa podielu kakaa a receptúry.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cokolada-mlecna",
    "foodName": "Mléčná čokoláda",
    "category": "Sladkosti a nápoje",
    "preparation": "bežná",
    "gi": 45,
    "giMin": 39,
    "giMax": 54,
    "carbsPer100g": 57.0,
    "defaultPortion": 25,
    "note": "Jednotlivé značky sa líšia obsahem cukru, tuku a mliečne složky.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bebe-dobre-rano-4-cerealie",
    "foodName": "Sušienky BeBe Dobré ráno",
    "category": "Sladkosti a nápoje",
    "preparation": "4 cereálie; historicky testovaná receptúra",
    "gi": 51,
    "giMin": 51,
    "giMax": 51,
    "carbsPer100g": 65.0,
    "defaultPortion": 30,
    "note": "GI sa týka staršie testované receptúry. Aktuálne složení a etiketa môžu byť iné.",
    "evidence": "Priame testovanie konkrétneho českého výrobku",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bebe-dobre-rano-orechy-med",
    "foodName": "Sušienky BeBe Dobré ráno",
    "category": "Sladkosti a nápoje",
    "preparation": "orechy a med; historicky testovaná receptúra",
    "gi": 41,
    "giMin": 41,
    "giMax": 41,
    "carbsPer100g": 65.0,
    "defaultPortion": 30,
    "note": "GI sa týka staršie testované receptúry. Aktuálne složení a etiketa môžu byť iné.",
    "evidence": "Priame testovanie konkrétneho českého výrobku",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "susenk-y-cajove",
    "foodName": "Čajové keksy",
    "category": "Sladkosti a nápoje",
    "preparation": "bežné pšeničné",
    "gi": 55,
    "giMin": 50,
    "giMax": 67,
    "carbsPer100g": 68.0,
    "defaultPortion": 30,
    "note": "Receptury a velikosti porcie sa výrazne líšia; použite etiketu.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "marmelada-dzem",
    "foodName": "Džem nebo marmeláda",
    "category": "Sladkosti a nápoje",
    "preparation": "bežná slazená",
    "gi": 51,
    "giMin": 49,
    "giMax": 55,
    "carbsPer100g": 60.0,
    "defaultPortion": 30,
    "note": "Obsah cukru sa líšia; pri výrobku použite etiketu.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "zele-bonbony",
    "foodName": "Želé cukríky",
    "category": "Sladkosti a nápoje",
    "preparation": "sladené cukrem a glukózovým sirupom",
    "gi": 80,
    "giMin": 70,
    "giMax": 80,
    "carbsPer100g": 78.0,
    "defaultPortion": 25,
    "note": "Hodnota je priradená k priamo testovaným želé cukrovinkám; konkrétnu receptúry sa líšia.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cola",
    "foodName": "Colový nápoj",
    "category": "Sladkosti a nápoje",
    "preparation": "sladený cukrem",
    "gi": 63,
    "giMin": 53,
    "giMax": 65,
    "carbsPer100g": 10.6,
    "defaultPortion": 330,
    "note": "Použite sacharidy z etikety; receptúra sa medzi krajinami a značkami líšia.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pomerancovy-dzus",
    "foodName": "Pomarančový džús",
    "category": "Sladkosti a nápoje",
    "preparation": "100% džús",
    "gi": 50,
    "giMin": 46,
    "giMax": 54,
    "carbsPer100g": 9.5,
    "defaultPortion": 250,
    "note": "Džus nemá strukturu celého plodu a porcie sa ľahko vypije rýchlo.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jablecny-dzus",
    "foodName": "Jablkový džús",
    "category": "Sladkosti a nápoje",
    "preparation": "100% džús",
    "gi": 41,
    "giMin": 36,
    "giMax": 44,
    "carbsPer100g": 10.5,
    "defaultPortion": 250,
    "note": "Pouraže je reprezentativní hodnota pre číry nebo bežný jablkový džús.",
    "evidence": "Reprezentatívna hodnota z viacerých testovaných variantov",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; pri balenom výrobku použite etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  }
];

  var numberFormatter = new Intl.NumberFormat("sk-SK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  });

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function formatNumber(value) {
    return Number.isFinite(value) ? numberFormatter.format(value) : "–";
  }

  function parseNumber(value) {
    var parsed = Number(String(value).replace(",", "."));
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getCategory(gl) {
    if (gl <= 10) {
      return { key: "low", label: "Nízka GL", text: "Nízka glykemická nálož (10 a menej)." };
    }
    if (gl < 20) {
      return { key: "medium", label: "Stredná GL", text: "Stredná glykemická nálož (11–19)." };
    }
    return { key: "high", label: "Vysoká GL", text: "Vysoká glykemická nálož (20 a viac)." };
  }

  function formatRange(min, max) {
    if (!Number.isFinite(min) || !Number.isFinite(max)) return "–";
    if (Math.abs(max - min) < 0.05) return formatNumber(min);
    return formatNumber(min) + "–" + formatNumber(max);
  }

  function giDisplay(food) {
    if (!food) return "";
    if (food.giMin === food.giMax) return formatNumber(food.gi);
    return formatNumber(food.gi) + " (rozpätie " + formatNumber(food.giMin) + "–" + formatNumber(food.giMax) + ")";
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values)).sort(function (a, b) {
      return a.localeCompare(b, "cs");
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initCalculator(container) {
    if (!container || container.dataset.mbGlcInitialized === "true") return;
    container.dataset.mbGlcInitialized = "true";
    container.setAttribute("data-version", "4.0.0-sk");
    container.setAttribute("role", "region");
    container.setAttribute("aria-label", "Interaktívna kalkulačka glykemickej nálože");

    container.innerHTML = `
      <div class="mb-glc">
        <div class="mb-glc__header">
          <h2 class="mb-glc__title">Kalkulačka glykemickej nálože</h2>
          <p>Orientačný výpočet pre jednu potravinu alebo jej porciu. Pri bežných potravinách zobrazuje reprezentatívny GI aj rozpätie zistené pri testovaných variantoch.</p>
          <span class="mb-glc__formula">GL = GI × dostupné sacharidy v porcii ÷ 100</span>
          <span class="mb-glc__formula">Databáza 3.0 · 118 položiek · revízia 07/2026</span>
        </div>

        <div class="mb-glc__tabs" role="tablist" aria-label="Spôsob výpočtu">
          <button class="mb-glc__tab" id="mb-glc-tab-food" type="button" role="tab" aria-controls="mb-glc-panel-food" aria-selected="true">Výber potraviny</button>
          <button class="mb-glc__tab" id="mb-glc-tab-manual" type="button" role="tab" aria-controls="mb-glc-panel-manual" aria-selected="false" tabindex="-1">Ručný výpočet</button>
        </div>

        <div class="mb-glc__body">
          <section class="mb-glc__panel" id="mb-glc-panel-food" role="tabpanel" aria-labelledby="mb-glc-tab-food">
            <div class="mb-glc__grid">
              <div class="mb-glc__field mb-glc__field--full">
                <label class="mb-glc__label" for="mb-glc-search">Vyhľadať potravinu</label>
                <input id="mb-glc-search" type="search" autocomplete="off" placeholder="Napr. ovsené vločky, jablko alebo ryža">
                <span class="mb-glc__hint">Vyhľadávanie filtruje názov, kategóriu aj variant prípravy.</span>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-category">Kategória</label>
                <select id="mb-glc-category"></select>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-food">Potravina</label>
                <select id="mb-glc-food"></select>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-variant">Príprava alebo variant</label>
                <select id="mb-glc-variant"></select>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-portion">Veľkosť porcie (g)</label>
                <input id="mb-glc-portion" type="number" inputmode="decimal" min="1" max="2000" step="1">
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-gi">Reprezentatívny GI a testované rozpätie</label>
                <input id="mb-glc-gi" type="text" readonly>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-carbs100">Dostupné sacharidy na 100 g</label>
                <input id="mb-glc-carbs100" type="text" readonly>
              </div>
            </div>

            <div class="mb-glc__metrics" aria-label="Medzivýsledky">
              <div class="mb-glc__metric"><span>Dostupné sacharidy v porcii</span><strong id="mb-glc-portion-carbs">–</strong></div>
              <div class="mb-glc__metric"><span>Odhadované rozpätie GL</span><strong id="mb-glc-gl-range">–</strong></div>
              <div class="mb-glc__metric"><span>Zadaná porcia</span><strong id="mb-glc-portion-summary">–</strong></div>
            </div>

            <div class="mb-glc__result" id="mb-glc-food-result" aria-live="polite">
              <div class="mb-glc__result-top">
                <div>
                  <p class="mb-glc__result-label">Glykemická nálož porcie</p>
                  <p class="mb-glc__result-value" id="mb-glc-food-gl">–</p>
                </div>
                <span class="mb-glc__badge mb-glc__badge--low" id="mb-glc-food-badge">Vyberte potravinu</span>
              </div>
              <p class="mb-glc__interpretation" id="mb-glc-food-interpretation">Zvoľte potravinu, variant a veľkosť porcie.</p>
              <div class="mb-glc__details" id="mb-glc-food-details"></div>
            </div>

            <div class="mb-glc__actions">
              <button class="mb-glc__button" id="mb-glc-reset-food" type="button">Obnoviť predvolené hodnoty</button>
            </div>
          </section>

          <section class="mb-glc__panel" id="mb-glc-panel-manual" role="tabpanel" aria-labelledby="mb-glc-tab-manual" hidden>
            <div class="mb-glc__grid">
              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-manual-gi">Glykemický index (GI)</label>
                <input id="mb-glc-manual-gi" type="number" inputmode="decimal" min="0" max="150" step="0.1" placeholder="Napr. 55">
                <span class="mb-glc__hint">Použite hodnotu pre konkrétnu potravinu, výrobok a úpravu.</span>
              </div>
              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-manual-carbs">Dostupné sacharidy v celej porcii (g)</label>
                <input id="mb-glc-manual-carbs" type="number" inputmode="decimal" min="0" max="500" step="0.1" placeholder="Napr. 32">
                <span class="mb-glc__hint">Pri balených výrobkoch vychádzajte z údaja „sacharidy“ a skutočnej veľkosti porcie.</span>
              </div>
            </div>

            <div class="mb-glc__result" id="mb-glc-manual-result" aria-live="polite">
              <div class="mb-glc__result-top">
                <div>
                  <p class="mb-glc__result-label">Glykemická nálož porcie</p>
                  <p class="mb-glc__result-value" id="mb-glc-manual-gl">–</p>
                </div>
                <span class="mb-glc__badge mb-glc__badge--low" id="mb-glc-manual-badge">Zadajte hodnoty</span>
              </div>
              <p class="mb-glc__interpretation" id="mb-glc-manual-interpretation">Výsledok sa zobrazí automaticky.</p>
              <div class="mb-glc__details" id="mb-glc-manual-details"></div>
            </div>

            <div class="mb-glc__actions">
              <button class="mb-glc__button" id="mb-glc-reset-manual" type="button">Vymazať hodnoty</button>
            </div>
          </section>

          <div class="mb-glc__warning">
            <strong>Výsledok je orientačný.</strong> Pri všeobecných názvoch potravín nie je uvedený GI laboratórnym výsledkom každého výrobku, ale reprezentatívnou hodnotou z testovaných variantov. GI sa môže líšiť podľa odrody, značky, zrelosti, receptúry a prípravy. Tuky, bielkoviny, vláknina, kyslosť, poradie jedla, pohyb aj individuálna metabolická reakcia môžu priebeh glykémie zmeniť. Pri zmiešaných jedlách nemožno presnú reakciu určiť jednoduchým súčtom tabuľkových hodnôt.
          </div>
          <p class="mb-glc__privacy">Výpočet prebieha iba vo vašom prehliadači. Zadané údaje sa nikam neodosielajú ani neukladajú.</p>
        </div>
      </div>`;

    var els = {
      tabs: Array.prototype.slice.call(container.querySelectorAll("[role=tab]")),
      panels: Array.prototype.slice.call(container.querySelectorAll("[role=tabpanel]")),
      search: container.querySelector("#mb-glc-search"),
      category: container.querySelector("#mb-glc-category"),
      food: container.querySelector("#mb-glc-food"),
      variant: container.querySelector("#mb-glc-variant"),
      portion: container.querySelector("#mb-glc-portion"),
      gi: container.querySelector("#mb-glc-gi"),
      carbs100: container.querySelector("#mb-glc-carbs100"),
      portionCarbs: container.querySelector("#mb-glc-portion-carbs"),
      glRange: container.querySelector("#mb-glc-gl-range"),
      portionSummary: container.querySelector("#mb-glc-portion-summary"),
      foodGl: container.querySelector("#mb-glc-food-gl"),
      foodBadge: container.querySelector("#mb-glc-food-badge"),
      foodInterpretation: container.querySelector("#mb-glc-food-interpretation"),
      foodDetails: container.querySelector("#mb-glc-food-details"),
      resetFood: container.querySelector("#mb-glc-reset-food"),
      manualGi: container.querySelector("#mb-glc-manual-gi"),
      manualCarbs: container.querySelector("#mb-glc-manual-carbs"),
      manualGl: container.querySelector("#mb-glc-manual-gl"),
      manualBadge: container.querySelector("#mb-glc-manual-badge"),
      manualInterpretation: container.querySelector("#mb-glc-manual-interpretation"),
      manualDetails: container.querySelector("#mb-glc-manual-details"),
      resetManual: container.querySelector("#mb-glc-reset-manual")
    };

    var selectedId = "ovesne-vlocky-suche";

    function switchTab(tab) {
      els.tabs.forEach(function (button) {
        var active = button === tab;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
      });
      els.panels.forEach(function (panel) {
        panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      });
    }

    els.tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { switchTab(tab); });
      tab.addEventListener("keydown", function (event) {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        var next = index;
        if (event.key === "ArrowRight") next = (index + 1) % els.tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + els.tabs.length) % els.tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = els.tabs.length - 1;
        els.tabs[next].focus();
        switchTab(els.tabs[next]);
      });
    });

    function filteredFoods() {
      var query = normalize(els.search.value);
      var category = els.category.value;
      return FOODS.filter(function (food) {
        var matchesCategory = !category || food.category === category;
        var haystack = normalize(food.foodName + " " + food.category + " " + food.preparation);
        return matchesCategory && (!query || haystack.indexOf(query) !== -1);
      });
    }

    function populateCategories() {
      var current = els.category.value;
      var categories = uniqueSorted(FOODS.map(function (food) { return food.category; }));
      els.category.innerHTML = '<option value="">Všetky kategórie</option>' + categories.map(function (category) {
        return '<option value="' + escapeHtml(category) + '">' + escapeHtml(category) + '</option>';
      }).join("");
      if (categories.indexOf(current) !== -1) els.category.value = current;
    }

    function populateFoods(preferredId) {
      var matches = filteredFoods();
      var names = uniqueSorted(matches.map(function (food) { return food.foodName; }));
      var preferred = FOODS.find(function (food) { return food.id === preferredId; });
      var preferredName = preferred && names.indexOf(preferred.foodName) !== -1 ? preferred.foodName : "";
      var currentName = names.indexOf(els.food.value) !== -1 ? els.food.value : "";
      var nextName = preferredName || currentName || names[0] || "";

      if (!names.length) {
        els.food.innerHTML = '<option value="">Nenašla sa žiadna potravina</option>';
        els.food.disabled = true;
        els.variant.innerHTML = '<option value="">Upravte vyhľadávanie</option>';
        els.variant.disabled = true;
        clearFoodResult("Pre zadaný filter sme nenašli žiadnu položku. Skúste kratšie názov alebo ručný výpočet.");
        return;
      }

      els.food.disabled = false;
      els.food.innerHTML = names.map(function (name) {
        return '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + '</option>';
      }).join("");
      els.food.value = nextName;
      populateVariants(preferredId);
    }

    function populateVariants(preferredId) {
      var matches = filteredFoods().filter(function (food) { return food.foodName === els.food.value; });
      var preferred = matches.find(function (food) { return food.id === preferredId; });
      var current = matches.find(function (food) { return food.id === selectedId; });
      var next = preferred || current || matches[0];

      if (!next) {
        els.variant.innerHTML = '<option value="">Nie je dostupný variant</option>';
        els.variant.disabled = true;
        clearFoodResult("Vyberte inú potravinu alebo použite ručný výpočet.");
        return;
      }

      els.variant.disabled = matches.length <= 1;
      els.variant.innerHTML = matches.map(function (food) {
        return '<option value="' + escapeHtml(food.id) + '">' + escapeHtml(food.preparation) + '</option>';
      }).join("");
      els.variant.value = next.id;
      selectFood(next.id, true);
    }

    function getSelectedFood() {
      return FOODS.find(function (food) { return food.id === els.variant.value; }) || null;
    }

    function selectFood(id, resetPortion) {
      var food = FOODS.find(function (item) { return item.id === id; });
      if (!food) return;
      selectedId = food.id;
      els.gi.value = giDisplay(food);
      els.carbs100.value = formatNumber(food.carbsPer100g) + " g";
      if (resetPortion || !parseNumber(els.portion.value)) els.portion.value = food.defaultPortion;
      calculateFood();
    }

    function setBadge(element, category) {
      element.className = "mb-glc__badge mb-glc__badge--" + category.key;
      element.textContent = category.label;
    }

    function clearFoodResult(message) {
      els.gi.value = "";
      els.carbs100.value = "";
      els.portionCarbs.textContent = "–";
      els.glRange.textContent = "–";
      els.portionSummary.textContent = "–";
      els.foodGl.textContent = "–";
      els.foodBadge.className = "mb-glc__badge mb-glc__badge--low";
      els.foodBadge.textContent = "Bez výsledku";
      els.foodInterpretation.textContent = message;
      els.foodDetails.innerHTML = "";
    }

    function calculateFood() {
      var food = getSelectedFood();
      var portion = parseNumber(els.portion.value);
      if (!food || !Number.isFinite(portion) || portion <= 0) {
        clearFoodResult("Zadajte platnú veľkosť porcie väčšiu ako 0 g.");
        return;
      }

      portion = clamp(portion, 1, 2000);
      var carbs = food.carbsPer100g * portion / 100;
      var gl = food.gi * carbs / 100;
      var glMin = food.giMin * carbs / 100;
      var glMax = food.giMax * carbs / 100;
      var category = getCategory(gl);

      els.portionCarbs.textContent = formatNumber(carbs) + " g";
      els.glRange.textContent = formatRange(glMin, glMax);
      els.portionSummary.textContent = formatNumber(portion) + " g";
      els.foodGl.textContent = formatNumber(gl);
      setBadge(els.foodBadge, category);

      var rangeText = Math.abs(glMax - glMin) < 0.05
        ? ""
        : " Pri použití testovaného rozpätia GI vychádza GL približne " + formatRange(glMin, glMax) + ".";

      els.foodInterpretation.textContent =
        category.text + " Výsledok vychádza z " + formatNumber(carbs) +
        " g dostupných sacharidov v porcii." + rangeText;

      var giText = food.giMin === food.giMax
        ? formatNumber(food.gi)
        : formatNumber(food.gi) + " (testované rozpätie " + formatNumber(food.giMin) + "–" + formatNumber(food.giMax) + ")";

      els.foodDetails.innerHTML =
        '<p><strong>Výpočet reprezentatívnej GL:</strong> ' + formatNumber(food.gi) + ' × ' + formatNumber(carbs) + ' ÷ 100 = ' + formatNumber(gl) + '</p>' +
        '<p><strong>GI použitý v kalkulačke:</strong> ' + giText + '</p>' +
        '<p><strong>Variant:</strong> ' + escapeHtml(food.foodName) + ' – ' + escapeHtml(food.preparation) + '</p>' +
        '<p><strong>Podklad:</strong> ' + escapeHtml(food.evidence) + '</p>' +
        '<p><strong>Poznámka:</strong> ' + escapeHtml(food.note) + '</p>' +
        '<p><strong>Zdroje GI:</strong> <a href="' + escapeHtml(food.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(food.sourceTitle) + '</a> · <a href="' + SOURCE_TABLES_URL + '" target="_blank" rel="noopener noreferrer">systematický prehľad 2021</a></p>' +
        '<p><strong>Dostupné sacharidy:</strong> typická orientačná hodnota na 100 g. Pri balenom výrobku má prednosť jeho aktuálna etiketa; pri domácom jedle konkrétna receptúra.</p>';
    }

    function calculateManual() {
      var gi = parseNumber(els.manualGi.value);
      var carbs = parseNumber(els.manualCarbs.value);
      if (!Number.isFinite(gi) || !Number.isFinite(carbs) || gi < 0 || carbs < 0) {
        els.manualGl.textContent = "–";
        els.manualBadge.className = "mb-glc__badge mb-glc__badge--low";
        els.manualBadge.textContent = "Zadajte hodnoty";
        els.manualInterpretation.textContent = "Zadajte platný GI a dostupné sacharidy v celej porcii.";
        els.manualDetails.innerHTML = "";
        return;
      }

      gi = clamp(gi, 0, 150);
      carbs = clamp(carbs, 0, 500);
      var gl = gi * carbs / 100;
      var category = getCategory(gl);
      els.manualGl.textContent = formatNumber(gl);
      setBadge(els.manualBadge, category);
      els.manualInterpretation.textContent = category.text;
      els.manualDetails.innerHTML =
        '<p><strong>Výpočet:</strong> ' + formatNumber(gi) + ' × ' + formatNumber(carbs) + ' ÷ 100 = ' + formatNumber(gl) + '</p>' +
        '<p>Ručný režim je vhodný pre konkrétne výrobky, ktoré nie sú v databáze. Použite GI zodpovedajúci konkrétnemu variantu a sacharidy pre skutočne zjedenú porciu.</p>';
    }

    els.search.addEventListener("input", function () { populateFoods(selectedId); });
    els.category.addEventListener("change", function () { populateFoods(selectedId); });
    els.food.addEventListener("change", function () { populateVariants(); });
    els.variant.addEventListener("change", function () { selectFood(els.variant.value, true); });
    els.portion.addEventListener("input", calculateFood);
    els.manualGi.addEventListener("input", calculateManual);
    els.manualCarbs.addEventListener("input", calculateManual);

    els.resetFood.addEventListener("click", function () {
      els.search.value = "";
      els.category.value = "";
      populateFoods("ovesne-vlocky-suche");
    });

    els.resetManual.addEventListener("click", function () {
      els.manualGi.value = "";
      els.manualCarbs.value = "";
      calculateManual();
      els.manualGi.focus();
    });

    populateCategories();
    populateFoods("ovesne-vlocky-suche");
    calculateManual();
  }

  function boot() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container) return;
    injectCalculatorStyles();
    initCalculator(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
