/**
 * MyBears — kalkulačka glykemické nálože (CZ)
 * Vizuální systém sjednocen podle poslední šablony převodníku krevních lipidů.
 * Funkční logika, databáze, interní ID, URL a způsob vložení zůstávají zachované.
 *
 * Mount point:
 *   <div id="mb-glycemic-load-calculator"></div>
 *
 * Bez externích závislostí. Data se neodesílají ani neukládají.
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
    "foodName": "Bílý pšeničný chléb",
    "category": "Pečivo",
    "preparation": "běžný krájený chléb",
    "gi": 75,
    "giMin": 72,
    "giMax": 93,
    "carbsPer100g": 49.0,
    "defaultPortion": 50,
    "note": "Hodnoty se výrazně mění podle mouky, struktury střídky, kynutí a výrobce.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "veka-bila",
    "foodName": "Veka bílá",
    "category": "Pečivo",
    "preparation": "česká testovaná veka; historická receptura",
    "gi": 75,
    "giMin": 75,
    "giMax": 75,
    "carbsPer100g": 52.0,
    "defaultPortion": 50,
    "note": "GI 75 vychází z konkrétního výrobku testovaného v ČR. Dnešní receptura může být jiná.",
    "evidence": "Přímé testování konkrétní české položky",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "rohlik-bily",
    "foodName": "Rohlík nebo houska",
    "category": "Pečivo",
    "preparation": "měkké bílé pečivo",
    "gi": 56,
    "giMin": 52,
    "giMax": 70,
    "carbsPer100g": 53.0,
    "defaultPortion": 43,
    "note": "Jde o přiřazení k testovaným měkkým bílým rolkám; konkrétní český nebo slovenský výrobek může být odlišný.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "toastovy-chleb-bily",
    "foodName": "Toastový chléb",
    "category": "Pečivo",
    "preparation": "bílý, balený",
    "gi": 75,
    "giMin": 70,
    "giMax": 85,
    "carbsPer100g": 47.0,
    "defaultPortion": 50,
    "note": "Použijte sacharidy z etikety. Přídavek tuku, cukru, vlákniny a způsob výroby mění GI.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "zitny-kvaskovy-chleb",
    "foodName": "Žitný kváskový chléb",
    "category": "Pečivo",
    "preparation": "tradičně kvašený",
    "gi": 59,
    "giMin": 48,
    "giMax": 65,
    "carbsPer100g": 42.0,
    "defaultPortion": 50,
    "note": "Delší fermentace a vyšší podíl žita mohou GI snižovat; označení „kváskový“ samo o sobě nízký GI nezaručuje.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "psenicno-zitny-kvaskovy",
    "foodName": "Pšenično-žitný kváskový chléb",
    "category": "Pečivo",
    "preparation": "směsný kváskový",
    "gi": 62,
    "giMin": 50,
    "giMax": 70,
    "carbsPer100g": 43.0,
    "defaultPortion": 50,
    "note": "Rozhoduje poměr mouk, hrubost mletí, fermentace a podíl celých zrn.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "zitny-celozrnny-chleb",
    "foodName": "Celozrnný žitný chléb",
    "category": "Pečivo",
    "preparation": "hutný, celozrnný",
    "gi": 65,
    "giMin": 63,
    "giMax": 67,
    "carbsPer100g": 41.0,
    "defaultPortion": 50,
    "note": "Hutná struktura a celá zrna mohou zpomalit trávení; jemně mletá mouka působí jinak.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "celozrnny-psenicny-chleb",
    "foodName": "Celozrnný pšeničný chléb",
    "category": "Pečivo",
    "preparation": "z jemně mleté celozrnné mouky",
    "gi": 74,
    "giMin": 65,
    "giMax": 85,
    "carbsPer100g": 41.0,
    "defaultPortion": 50,
    "note": "Celozrnné označení automaticky neznamená nízký GI, zejména při jemném mletí.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "vicezrnny-chleb-cela-zrna",
    "foodName": "Vícezrnný chléb",
    "category": "Pečivo",
    "preparation": "s viditelnými celými zrny a semínky",
    "gi": 43,
    "giMin": 34,
    "giMax": 55,
    "carbsPer100g": 40.0,
    "defaultPortion": 50,
    "note": "Nižší hodnoty se týkají výrobků s vysokým podílem neporušených zrn; běžný „vícezrnný“ chléb může být výše.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "krehky-zitny-chleb",
    "foodName": "Křehký žitný chléb",
    "category": "Pečivo",
    "preparation": "suchý křehký plátek",
    "gi": 64,
    "giMin": 55,
    "giMax": 72,
    "carbsPer100g": 64.0,
    "defaultPortion": 20,
    "note": "GI může být střední až vyšší, ale malá hmotnost porce často udrží GL níže.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bageta-bila",
    "foodName": "Bílá bageta",
    "category": "Pečivo",
    "preparation": "francouzský typ",
    "gi": 75,
    "giMin": 57,
    "giMax": 83,
    "carbsPer100g": 56.0,
    "defaultPortion": 60,
    "note": "Původní hodnota 95 byla příliš vysoká pro běžnou bagetu; testované bagety se nejčastěji pohybují přibližně 57–83.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pita-bila",
    "foodName": "Pita",
    "category": "Pečivo",
    "preparation": "bílá pšeničná",
    "gi": 68,
    "giMin": 68,
    "giMax": 68,
    "carbsPer100g": 55.7,
    "defaultPortion": 60,
    "note": "Hodnota vychází z přímo testované bílé pity; u baleného výrobku použijte sacharidy z etikety.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
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
    "note": "Hodnota vychází z přímo testované celozrnné pity.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
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
    "note": "Tuk může snížit rychlost vyprazdňování žaludku, ale porce stále obsahuje významné množství sacharidů.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ovesne-vlocky-suche",
    "foodName": "Ovesné vločky",
    "category": "Obiloviny a snídaně",
    "preparation": "tradiční vločky; porce zadána v suchém stavu",
    "gi": 55,
    "giMin": 49,
    "giMax": 63,
    "carbsPer100g": 57.6,
    "defaultPortion": 60,
    "note": "GI odpovídá tradičním vločkám po běžné přípravě, zatímco sacharidy se počítají z navážené suché porce.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ovesna-kase-huste-vlocky",
    "foodName": "Ovesná kaše",
    "category": "Obiloviny a snídaně",
    "preparation": "z hrubých nebo silných vloček, vařená",
    "gi": 55,
    "giMin": 49,
    "giMax": 63,
    "carbsPer100g": 10.1,
    "defaultPortion": 250,
    "note": "Hrubší vločky a kratší vaření mívají nižší GI než jemné nebo instantní varianty.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ovesna-kase-jemne-vlocky",
    "foodName": "Ovesná kaše",
    "category": "Obiloviny a snídaně",
    "preparation": "z jemných vloček, déle vařená",
    "gi": 76,
    "giMin": 70,
    "giMax": 81,
    "carbsPer100g": 10.1,
    "defaultPortion": 250,
    "note": "Jemné vločky a delší rozvaření zpřístupňují škrob rychleji.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ovesna-kase-instantni",
    "foodName": "Ovesná kaše",
    "category": "Obiloviny a snídaně",
    "preparation": "instantní, připravená ve vodě",
    "gi": 82,
    "giMin": 76,
    "giMax": 87,
    "carbsPer100g": 12.0,
    "defaultPortion": 250,
    "note": "Instantní zpracování obvykle zvyšuje rychlost trávení. U ochucených směsí použijte etiketu.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "oves-steel-cut",
    "foodName": "Ovesná kaše",
    "category": "Obiloviny a snídaně",
    "preparation": "z řezaného ovsa (steel-cut)",
    "gi": 50,
    "giMin": 48,
    "giMax": 53,
    "carbsPer100g": 10.5,
    "defaultPortion": 250,
    "note": "Méně narušená struktura zrna bývá spojena s nižším GI.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "muesli-prirodni",
    "foodName": "Müsli",
    "category": "Obiloviny a snídaně",
    "preparation": "nepražené, bez přidaného cukru",
    "gi": 55,
    "giMin": 40,
    "giMax": 62,
    "carbsPer100g": 60.0,
    "defaultPortion": 60,
    "note": "Rozpětí je široké podle podílu vloček, ořechů, semen a sušeného ovoce.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "muesli-prazene",
    "foodName": "Müsli nebo granola",
    "category": "Obiloviny a snídaně",
    "preparation": "pražené nebo křupavé",
    "gi": 65,
    "giMin": 62,
    "giMax": 86,
    "carbsPer100g": 64.0,
    "defaultPortion": 60,
    "note": "Pražení, jemnější struktura a přidaná sladidla mohou GI i množství sacharidů zvýšit.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cornflakes",
    "foodName": "Kukuřičné lupínky",
    "category": "Obiloviny a snídaně",
    "preparation": "běžné cornflakes",
    "gi": 77,
    "giMin": 66,
    "giMax": 93,
    "carbsPer100g": 81.0,
    "defaultPortion": 40,
    "note": "Testované výrobky se výrazně liší; většina je ve vysokém pásmu GI.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bran-flakes",
    "foodName": "Otrubové lupínky",
    "category": "Obiloviny a snídaně",
    "preparation": "bran flakes",
    "gi": 65,
    "giMin": 50,
    "giMax": 74,
    "carbsPer100g": 67.0,
    "defaultPortion": 40,
    "note": "Obsah vlákniny sám o sobě nezaručuje nízký GI; důležitá je struktura výrobku.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jecne-kroupy-varene",
    "foodName": "Ječné kroupy",
    "category": "Obiloviny a snídaně",
    "preparation": "vařené",
    "gi": 25,
    "giMin": 22,
    "giMax": 35,
    "carbsPer100g": 24.4,
    "defaultPortion": 180,
    "note": "Míra obroušení, odrůda a délka vaření mohou hodnotu posunout.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pohanka-kroupy-varena",
    "foodName": "Pohanka",
    "category": "Obiloviny a snídaně",
    "preparation": "kroupy, vařené",
    "gi": 50,
    "giMin": 46,
    "giMax": 51,
    "carbsPer100g": 17.0,
    "defaultPortion": 180,
    "note": "Hodnota platí pro vařené kroupy; vločky nebo instantní kaše mohou mít vyšší GI.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pohankova-kase-vlocky",
    "foodName": "Pohanková kaše",
    "category": "Obiloviny a snídaně",
    "preparation": "z vloček nebo instantnější úpravy",
    "gi": 71,
    "giMin": 65,
    "giMax": 76,
    "carbsPer100g": 15.0,
    "defaultPortion": 250,
    "note": "Silnější technologické narušení zrna může GI oproti celým kroupám zvýšit.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bulgur-vareny",
    "foodName": "Bulgur",
    "category": "Obiloviny a snídaně",
    "preparation": "vařený",
    "gi": 46,
    "giMin": 45,
    "giMax": 55,
    "carbsPer100g": 14.1,
    "defaultPortion": 180,
    "note": "Hrubší bulgur a kratší vaření obvykle zpomalují trávení.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "kuskus-vareny",
    "foodName": "Kuskus",
    "category": "Obiloviny a snídaně",
    "preparation": "zalitý horkou vodou",
    "gi": 65,
    "giMin": 65,
    "giMax": 65,
    "carbsPer100g": 21.8,
    "defaultPortion": 180,
    "note": "Přímo testovaná varianta; celozrnný nebo perlový kuskus se může lišit.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "quinoa-bila-varena",
    "foodName": "Quinoa",
    "category": "Obiloviny a snídaně",
    "preparation": "bílá, vařená",
    "gi": 50,
    "giMin": 50,
    "giMax": 53,
    "carbsPer100g": 18.5,
    "defaultPortion": 180,
    "note": "Rozpětí vychází z několika testovaných vařených variant.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "proso-jahly-varene",
    "foodName": "Jáhly",
    "category": "Obiloviny a snídaně",
    "preparation": "vařené",
    "gi": 64,
    "giMin": 64,
    "giMax": 89,
    "carbsPer100g": 22.4,
    "defaultPortion": 180,
    "note": "Odrůda a způsob vaření mají velký vliv; proto je rozpětí záměrně široké.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "polenta-varena",
    "foodName": "Polenta",
    "category": "Obiloviny a snídaně",
    "preparation": "kukuřičná kaše, vařená",
    "gi": 68,
    "giMin": 68,
    "giMax": 68,
    "carbsPer100g": 12.5,
    "defaultPortion": 250,
    "note": "Přímo testovaná kukuřičná kaše; instantní výrobky se mohou lišit.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-basmati-bila",
    "foodName": "Rýže basmati",
    "category": "Rýže",
    "preparation": "bílá, vařená",
    "gi": 62,
    "giMin": 57,
    "giMax": 67,
    "carbsPer100g": 25.2,
    "defaultPortion": 180,
    "note": "Původní GI 50 byl příliš nízký jako obecná hodnota. Testované bílé basmati se často pohybují přibližně 57–67.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-basmati-parboiled",
    "foodName": "Rýže basmati",
    "category": "Rýže",
    "preparation": "parboiled, vařená",
    "gi": 52,
    "giMin": 52,
    "giMax": 54,
    "carbsPer100g": 25.0,
    "defaultPortion": 180,
    "note": "Předvaření v páře může u některých výrobků snížit GI oproti běžné bílé rýži.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-jasminova",
    "foodName": "Rýže jasmínová",
    "category": "Rýže",
    "preparation": "bílá, vařená",
    "gi": 89,
    "giMin": 80,
    "giMax": 96,
    "carbsPer100g": 27.3,
    "defaultPortion": 180,
    "note": "Původní GI 80 zachycoval spodní hranici; většina testovaných jasmínových rýží je výše.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-dlouhozrnna-bila",
    "foodName": "Rýže dlouhozrnná",
    "category": "Rýže",
    "preparation": "bílá, vařená",
    "gi": 60,
    "giMin": 47,
    "giMax": 76,
    "carbsPer100g": 26.3,
    "defaultPortion": 180,
    "note": "Odrůda, obsah amylózy a doba vaření způsobují velmi široké rozpětí.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-natural",
    "foodName": "Rýže natural",
    "category": "Rýže",
    "preparation": "hnědá, vařená",
    "gi": 65,
    "giMin": 48,
    "giMax": 87,
    "carbsPer100g": 21.7,
    "defaultPortion": 180,
    "note": "Hnědá barva sama o sobě nezaručuje nízký GI; záleží na odrůdě a zpracování.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-parboiled",
    "foodName": "Rýže parboiled",
    "category": "Rýže",
    "preparation": "dlouhozrnná, vařená",
    "gi": 57,
    "giMin": 48,
    "giMax": 74,
    "carbsPer100g": 25.0,
    "defaultPortion": 180,
    "note": "Jednotlivé značky a odrůdy se liší; použita je reprezentativní střední hodnota.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-lepkava",
    "foodName": "Rýže lepkavá",
    "category": "Rýže",
    "preparation": "sticky rice, vařená",
    "gi": 92,
    "giMin": 92,
    "giMax": 92,
    "carbsPer100g": 28.0,
    "defaultPortion": 180,
    "note": "Přímo testovaná lepkavá rýže měla vysoký GI.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryze-sushi",
    "foodName": "Rýže na sushi",
    "category": "Rýže",
    "preparation": "krátkozrnná, vařená; bez započtení cukru v nálevu",
    "gi": 89,
    "giMin": 80,
    "giMax": 92,
    "carbsPer100g": 28.0,
    "defaultPortion": 180,
    "note": "Krátkozrnná rýže bývá vysoko; ochucení cukrem množství sacharidů dále zvýší.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryzova-kase",
    "foodName": "Rýžová kaše",
    "category": "Rýže",
    "preparation": "rozvařená nebo instantnější",
    "gi": 78,
    "giMin": 70,
    "giMax": 90,
    "carbsPer100g": 14.0,
    "defaultPortion": 250,
    "note": "Rozvaření a jemná struktura obvykle zvyšují dostupnost škrobu.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryzove-chlebicky",
    "foodName": "Rýžové chlebíčky",
    "category": "Rýže",
    "preparation": "pufované",
    "gi": 82,
    "giMin": 76,
    "giMax": 105,
    "carbsPer100g": 80.0,
    "defaultPortion": 20,
    "note": "Pufování výrazně narušuje strukturu škrobu; testované výrobky mají velmi široké a často vysoké GI.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "spagety-al-dente",
    "foodName": "Špagety",
    "category": "Těstoviny a nudle",
    "preparation": "al dente",
    "gi": 45,
    "giMin": 32,
    "giMax": 52,
    "carbsPer100g": 28.0,
    "defaultPortion": 200,
    "note": "Pevnější struktura těstovin zpomaluje trávení škrobu.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "spagety-mekke",
    "foodName": "Špagety",
    "category": "Těstoviny a nudle",
    "preparation": "měkce uvařené",
    "gi": 58,
    "giMin": 52,
    "giMax": 64,
    "carbsPer100g": 28.0,
    "defaultPortion": 200,
    "note": "Delší vaření zvyšuje želatinizaci škrobu a může GI zvýšit.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "spagety-celozrnne",
    "foodName": "Špagety",
    "category": "Těstoviny a nudle",
    "preparation": "celozrnné, vařené",
    "gi": 55,
    "giMin": 48,
    "giMax": 62,
    "carbsPer100g": 24.0,
    "defaultPortion": 200,
    "note": "Celozrnné varianty se liší podle hrubosti mouky a doby vaření.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "penne-varene",
    "foodName": "Penne",
    "category": "Těstoviny a nudle",
    "preparation": "vařené na skus",
    "gi": 50,
    "giMin": 44,
    "giMax": 59,
    "carbsPer100g": 27.0,
    "defaultPortion": 200,
    "note": "Rozpětí vychází z více testovaných výrobků a různých dob vaření.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fusilli-varene",
    "foodName": "Fusilli",
    "category": "Těstoviny a nudle",
    "preparation": "vařené na skus",
    "gi": 55,
    "giMin": 49,
    "giMax": 61,
    "carbsPer100g": 27.0,
    "defaultPortion": 200,
    "note": "Tvar, výrobce a stupeň uvaření ovlivňují výsledek.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "tagliatelle-vajecne",
    "foodName": "Vaječné nudle nebo tagliatelle",
    "category": "Těstoviny a nudle",
    "preparation": "vařené",
    "gi": 55,
    "giMin": 47,
    "giMax": 62,
    "carbsPer100g": 25.0,
    "defaultPortion": 200,
    "note": "Použita je reprezentativní hodnota pro pšeničné vaječné těstoviny.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "lasagne-platy",
    "foodName": "Lasagne",
    "category": "Těstoviny a nudle",
    "preparation": "uvařené pláty bez omáčky",
    "gi": 53,
    "giMin": 45,
    "giMax": 60,
    "carbsPer100g": 25.0,
    "defaultPortion": 200,
    "note": "Kalkulace se týká pouze těstovinové složky, nikoli celého smíšeného jídla.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "gnocchi-bramborove",
    "foodName": "Gnocchi",
    "category": "Těstoviny a nudle",
    "preparation": "bramborové, vařené",
    "gi": 68,
    "giMin": 68,
    "giMax": 68,
    "carbsPer100g": 29.0,
    "defaultPortion": 200,
    "note": "Přímo testovaná varianta; receptury s různým podílem brambor a mouky se mohou lišit.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryzove-testoviny",
    "foodName": "Rýžové těstoviny",
    "category": "Těstoviny a nudle",
    "preparation": "bezlepkové, vařené",
    "gi": 51,
    "giMin": 51,
    "giMax": 51,
    "carbsPer100g": 25.0,
    "defaultPortion": 200,
    "note": "Přímo testovaná bezlepková rýžová pasta.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "psenicne-nudle",
    "foodName": "Pšeničné nudle",
    "category": "Těstoviny a nudle",
    "preparation": "sušené, vařené",
    "gi": 62,
    "giMin": 55,
    "giMax": 62,
    "carbsPer100g": 25.0,
    "defaultPortion": 200,
    "note": "Délka vaření a použitá mouka mohou hodnotu změnit.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "brambory-varny-typ-a",
    "foodName": "Brambory",
    "category": "Brambory a další přílohy",
    "preparation": "voskové, vařené; varný typ A",
    "gi": 63,
    "giMin": 53,
    "giMax": 69,
    "carbsPer100g": 15.4,
    "defaultPortion": 200,
    "note": "Nižší hodnoty se týkají konkrétních voskových odrůd, například Nicola nebo Charlotte.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "brambory-varny-typ-c",
    "foodName": "Brambory",
    "category": "Brambory a další přílohy",
    "preparation": "moučnaté, vařené; varný typ C",
    "gi": 79,
    "giMin": 74,
    "giMax": 101,
    "carbsPer100g": 15.4,
    "defaultPortion": 200,
    "note": "Moučnaté odrůdy mívají často vyšší GI; odrůda je zásadní.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "brambory-ve-slupce",
    "foodName": "Brambory",
    "category": "Brambory a další přílohy",
    "preparation": "vařené ve slupce",
    "gi": 65,
    "giMin": 58,
    "giMax": 82,
    "carbsPer100g": 15.4,
    "defaultPortion": 200,
    "note": "Slupka sama nezaručuje nízký GI; důležitá je odrůda, rozvaření a velikost kusů.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bramborova-kase-domaci",
    "foodName": "Bramborová kaše",
    "category": "Brambory a další přílohy",
    "preparation": "domácí z vařených brambor",
    "gi": 76,
    "giMin": 68,
    "giMax": 81,
    "carbsPer100g": 14.0,
    "defaultPortion": 250,
    "note": "Původní GI 87 byl příliš vysoký pro běžnou domácí kaši; instantní kaše je uvedena zvlášť.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bramborova-kase-instantni",
    "foodName": "Bramborová kaše",
    "category": "Brambory a další přílohy",
    "preparation": "instantní",
    "gi": 88,
    "giMin": 69,
    "giMax": 97,
    "carbsPer100g": 13.0,
    "defaultPortion": 250,
    "note": "Technologické zpracování a jemná struktura často vedou k vyššímu GI.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "brambory-pecene",
    "foodName": "Brambory",
    "category": "Brambory a další přílohy",
    "preparation": "pečené",
    "gi": 90,
    "giMin": 69,
    "giMax": 103,
    "carbsPer100g": 18.0,
    "defaultPortion": 250,
    "note": "Pečené brambory mají často vysoký GI, ale výsledek se silně mění podle odrůdy.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hranolky-trouba",
    "foodName": "Hranolky",
    "category": "Brambory a další přílohy",
    "preparation": "pečené v troubě",
    "gi": 65,
    "giMin": 55,
    "giMax": 76,
    "carbsPer100g": 25.0,
    "defaultPortion": 150,
    "note": "Použijte sacharidy z etikety konkrétního výrobku.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hranolky-smazene",
    "foodName": "Hranolky",
    "category": "Brambory a další přílohy",
    "preparation": "smažené",
    "gi": 63,
    "giMin": 42,
    "giMax": 76,
    "carbsPer100g": 35.0,
    "defaultPortion": 150,
    "note": "Tuk může zpomalit vyprazdňování žaludku, ale energetická hodnota a množství sacharidů zůstávají významné.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bataty-varene",
    "foodName": "Batáty",
    "category": "Brambory a další přílohy",
    "preparation": "vařené",
    "gi": 46,
    "giMin": 41,
    "giMax": 61,
    "carbsPer100g": 17.1,
    "defaultPortion": 200,
    "note": "Vaření vede obvykle k nižším hodnotám než pečení; odrůdy se liší.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bataty-pecene",
    "foodName": "Batáty",
    "category": "Brambory a další přílohy",
    "preparation": "pečené",
    "gi": 87,
    "giMin": 82,
    "giMax": 94,
    "carbsPer100g": 20.1,
    "defaultPortion": 200,
    "note": "Pečení může výrazně zvýšit dostupnost škrobu oproti vaření.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "kukurice-sladka",
    "foodName": "Kukuřice sladká",
    "category": "Brambory a další přílohy",
    "preparation": "vařená nebo z mikrovlnné trouby",
    "gi": 53,
    "giMin": 51,
    "giMax": 55,
    "carbsPer100g": 12.9,
    "defaultPortion": 150,
    "note": "Rozpětí vychází z přímo testovaných variant sladké kukuřice.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cocka-cervena",
    "foodName": "Čočka",
    "category": "Luštěniny",
    "preparation": "červená, vařená",
    "gi": 26,
    "giMin": 14,
    "giMax": 42,
    "carbsPer100g": 12.0,
    "defaultPortion": 180,
    "note": "Odrůda a míra rozvaření způsobují rozdíly; luštěniny bývají většinou v nízkém pásmu GI.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cocka-zelena-hneda",
    "foodName": "Čočka",
    "category": "Luštěniny",
    "preparation": "zelená nebo hnědá, vařená",
    "gi": 30,
    "giMin": 22,
    "giMax": 42,
    "carbsPer100g": 12.0,
    "defaultPortion": 180,
    "note": "Pevnější zrna obvykle zpomalují trávení oproti silně rozvařené čočce.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cizrna-varena",
    "foodName": "Cizrna",
    "category": "Luštěniny",
    "preparation": "vařená",
    "gi": 28,
    "giMin": 10,
    "giMax": 36,
    "carbsPer100g": 19.0,
    "defaultPortion": 180,
    "note": "Rozpětí zahrnuje různé odrůdy a způsoby vaření.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fazole-cervene",
    "foodName": "Fazole",
    "category": "Luštěniny",
    "preparation": "červené kidney, vařené",
    "gi": 24,
    "giMin": 19,
    "giMax": 35,
    "carbsPer100g": 16.0,
    "defaultPortion": 180,
    "note": "Hodnoty se liší mezi konzervovanými a doma vařenými fazolemi.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fazole-bile",
    "foodName": "Fazole",
    "category": "Luštěniny",
    "preparation": "bílé, vařené",
    "gi": 31,
    "giMin": 24,
    "giMax": 40,
    "carbsPer100g": 18.0,
    "defaultPortion": 180,
    "note": "Použita je reprezentativní hodnota pro vařené bílé fazole.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fazole-v-tomatove-omacce",
    "foodName": "Fazole",
    "category": "Luštěniny",
    "preparation": "v rajčatové omáčce, konzervované",
    "gi": 40,
    "giMin": 35,
    "giMax": 48,
    "carbsPer100g": 12.9,
    "defaultPortion": 200,
    "note": "Přidaný cukr v omáčce může zvýšit množství sacharidů; použijte etiketu.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hrasok-zeleny",
    "foodName": "Hrášek",
    "category": "Luštěniny",
    "preparation": "zelený, vařený",
    "gi": 51,
    "giMin": 39,
    "giMax": 54,
    "carbsPer100g": 10.0,
    "defaultPortion": 150,
    "note": "Čerstvý, mražený a konzervovaný hrášek se mohou lišit.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hras-loupany",
    "foodName": "Hrách",
    "category": "Luštěniny",
    "preparation": "loupaný, vařený",
    "gi": 32,
    "giMin": 25,
    "giMax": 35,
    "carbsPer100g": 13.0,
    "defaultPortion": 180,
    "note": "Rozvaření a odrůda mohou hodnotu změnit.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "fazole-cerne",
    "foodName": "Fazole",
    "category": "Luštěniny",
    "preparation": "černé, vařené",
    "gi": 30,
    "giMin": 20,
    "giMax": 35,
    "carbsPer100g": 16.0,
    "defaultPortion": 180,
    "note": "Obvykle nízký GI; přesná hodnota závisí na odrůdě a přípravě.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hummus",
    "foodName": "Hummus",
    "category": "Luštěniny",
    "preparation": "cizrnová pomazánka",
    "gi": 15,
    "giMin": 6,
    "giMax": 15,
    "carbsPer100g": 14.0,
    "defaultPortion": 80,
    "note": "Receptury se liší množstvím cizrny, tahini a dalších surovin; použijte etiketu, je-li dostupná.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jablko",
    "foodName": "Jablko",
    "category": "Ovoce",
    "preparation": "syrové se slupkou",
    "gi": 44,
    "giMin": 36,
    "giMax": 44,
    "carbsPer100g": 12.1,
    "defaultPortion": 150,
    "note": "Aktuální přímo testovaná syrová jablka měla GI 44; odrůda a zralost mohou výsledek mírně posunout.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hruska",
    "foodName": "Hruška",
    "category": "Ovoce",
    "preparation": "syrová, zralá",
    "gi": 38,
    "giMin": 24,
    "giMax": 42,
    "carbsPer100g": 12.1,
    "defaultPortion": 160,
    "note": "Nezralá hruška může mít nižší GI než velmi zralá.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "banan-stredne-zraly",
    "foodName": "Banán",
    "category": "Ovoce",
    "preparation": "středně zralý",
    "gi": 49,
    "giMin": 47,
    "giMax": 53,
    "carbsPer100g": 20.1,
    "defaultPortion": 120,
    "note": "Zralost významně mění složení škrobu a cukrů.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "banan-prezraly",
    "foodName": "Banán",
    "category": "Ovoce",
    "preparation": "přezrálý",
    "gi": 57,
    "giMin": 57,
    "giMax": 57,
    "carbsPer100g": 20.1,
    "defaultPortion": 120,
    "note": "Přímo testovaný přezrálý banán měl vyšší GI než běžně zralá varianta.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pomeranc",
    "foodName": "Pomeranč",
    "category": "Ovoce",
    "preparation": "syrový",
    "gi": 45,
    "giMin": 40,
    "giMax": 45,
    "carbsPer100g": 9.1,
    "defaultPortion": 180,
    "note": "Celý plod obsahuje strukturu a vlákninu, které džus postrádá.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mandarinka",
    "foodName": "Mandarinka",
    "category": "Ovoce",
    "preparation": "syrová",
    "gi": 47,
    "giMin": 42,
    "giMax": 50,
    "carbsPer100g": 10.0,
    "defaultPortion": 120,
    "note": "Reprezentativní hodnota pro citrusový plod; odrůdy se liší.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "grapefruit",
    "foodName": "Grapefruit",
    "category": "Ovoce",
    "preparation": "syrový",
    "gi": 25,
    "giMin": 25,
    "giMax": 35,
    "carbsPer100g": 8.0,
    "defaultPortion": 200,
    "note": "Nízká hodnota je orientační; velikost a sladkost plodu se liší.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "hrozny",
    "foodName": "Hroznové víno",
    "category": "Ovoce",
    "preparation": "čerstvé",
    "gi": 54,
    "giMin": 50,
    "giMax": 59,
    "carbsPer100g": 17.0,
    "defaultPortion": 150,
    "note": "Původní GI 59 odpovídal horní hranici; reprezentativní hodnota je přibližně 54.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jahody",
    "foodName": "Jahody",
    "category": "Ovoce",
    "preparation": "čerstvé",
    "gi": 40,
    "giMin": 25,
    "giMax": 41,
    "carbsPer100g": 5.7,
    "defaultPortion": 150,
    "note": "Nízké množství sacharidů v běžné porci obvykle vede k nízké GL.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "boruvky",
    "foodName": "Borůvky",
    "category": "Ovoce",
    "preparation": "čerstvé",
    "gi": 53,
    "giMin": 50,
    "giMax": 53,
    "carbsPer100g": 12.1,
    "defaultPortion": 150,
    "note": "Hodnota vychází mimo jiné z přímo testovaných divokých borůvek.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "maliny",
    "foodName": "Maliny",
    "category": "Ovoce",
    "preparation": "čerstvé",
    "gi": 25,
    "giMin": 25,
    "giMax": 32,
    "carbsPer100g": 5.4,
    "defaultPortion": 150,
    "note": "GI je orientační, ale nízké množství dostupných sacharidů udržuje GL porce nízkou.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "meloun-vodni",
    "foodName": "Vodní meloun",
    "category": "Ovoce",
    "preparation": "čerstvý",
    "gi": 51,
    "giMin": 47,
    "giMax": 55,
    "carbsPer100g": 7.1,
    "defaultPortion": 250,
    "note": "Novější testované hodnoty jsou přibližně 47–55; starší tabulky často uváděly vyšší čísla.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mango",
    "foodName": "Mango",
    "category": "Ovoce",
    "preparation": "čerstvé",
    "gi": 51,
    "giMin": 41,
    "giMax": 56,
    "carbsPer100g": 13.5,
    "defaultPortion": 150,
    "note": "Odrůda a zralost mají vliv na GI i obsah cukrů.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ananas",
    "foodName": "Ananas",
    "category": "Ovoce",
    "preparation": "čerstvý",
    "gi": 59,
    "giMin": 51,
    "giMax": 66,
    "carbsPer100g": 11.7,
    "defaultPortion": 150,
    "note": "Čerstvý, konzervovaný a velmi zralý ananas se mohou lišit.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "broskev",
    "foodName": "Broskev",
    "category": "Ovoce",
    "preparation": "čerstvá",
    "gi": 42,
    "giMin": 28,
    "giMax": 56,
    "carbsPer100g": 8.5,
    "defaultPortion": 150,
    "note": "Rozpětí je širší kvůli odrůdám a stupni zralosti.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "nektarinka",
    "foodName": "Nektarinka",
    "category": "Ovoce",
    "preparation": "čerstvá",
    "gi": 43,
    "giMin": 43,
    "giMax": 43,
    "carbsPer100g": 9.0,
    "defaultPortion": 150,
    "note": "Přímo testovaná čerstvá nektarinka.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "kiwi",
    "foodName": "Kiwi",
    "category": "Ovoce",
    "preparation": "čerstvé",
    "gi": 47,
    "giMin": 47,
    "giMax": 47,
    "carbsPer100g": 11.0,
    "defaultPortion": 150,
    "note": "Přímo testovaná čerstvá varianta.",
    "evidence": "Přímé testování konkrétní varianty",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "tresne",
    "foodName": "Třešně",
    "category": "Ovoce",
    "preparation": "čerstvé",
    "gi": 22,
    "giMin": 22,
    "giMax": 29,
    "carbsPer100g": 13.8,
    "defaultPortion": 150,
    "note": "Odrůda a zralost mohou hodnotu měnit.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "svestky",
    "foodName": "Švestky",
    "category": "Ovoce",
    "preparation": "čerstvé",
    "gi": 35,
    "giMin": 24,
    "giMax": 40,
    "carbsPer100g": 10.2,
    "defaultPortion": 150,
    "note": "Použita je reprezentativní hodnota pro čerstvé švestky.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "merunky",
    "foodName": "Meruňky",
    "category": "Ovoce",
    "preparation": "čerstvé",
    "gi": 38,
    "giMin": 34,
    "giMax": 42,
    "carbsPer100g": 9.1,
    "defaultPortion": 150,
    "note": "Přímo testované čerstvé meruňky se pohybovaly přibližně 34–42.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "merunky-susene",
    "foodName": "Sušené meruňky",
    "category": "Ovoce",
    "preparation": "neslazené",
    "gi": 42,
    "giMin": 32,
    "giMax": 56,
    "carbsPer100g": 55.0,
    "defaultPortion": 40,
    "note": "GI může být nízký až střední, ale koncentrované sacharidy mohou zvýšit GL porce.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "rozinky",
    "foodName": "Rozinky",
    "category": "Ovoce",
    "preparation": "sušené",
    "gi": 64,
    "giMin": 54,
    "giMax": 66,
    "carbsPer100g": 75.0,
    "defaultPortion": 40,
    "note": "Malá hmotnost porce je důležitá, protože sacharidy jsou koncentrované.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "datle",
    "foodName": "Datle",
    "category": "Ovoce",
    "preparation": "sušené, běžné odrůdy",
    "gi": 49,
    "giMin": 46,
    "giMax": 54,
    "carbsPer100g": 70.0,
    "defaultPortion": 40,
    "note": "Přímo testované odrůdy se často pohybovaly přibližně 46–54.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mleko-polotucne",
    "foodName": "Mléko",
    "category": "Mléčné výrobky",
    "preparation": "polotučné",
    "gi": 29,
    "giMin": 25,
    "giMax": 31,
    "carbsPer100g": 4.8,
    "defaultPortion": 250,
    "note": "Mléčné výrobky mohou vyvolávat vyšší inzulinovou odpověď, než by samotný GI naznačoval.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mleko-plnotucne",
    "foodName": "Mléko",
    "category": "Mléčné výrobky",
    "preparation": "plnotučné",
    "gi": 32,
    "giMin": 30,
    "giMax": 46,
    "carbsPer100g": 4.7,
    "defaultPortion": 250,
    "note": "Přímo testované výrobky se lišily; použita je reprezentativní hodnota novějších testů.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jogurt-bily",
    "foodName": "Bílý jogurt",
    "category": "Mléčné výrobky",
    "preparation": "neslazený",
    "gi": 17,
    "giMin": 11,
    "giMax": 36,
    "carbsPer100g": 4.7,
    "defaultPortion": 150,
    "note": "Obsah sacharidů se liší podle odkapaní a kultury; použijte etiketu.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jogurt-recky",
    "foodName": "Řecký jogurt",
    "category": "Mléčné výrobky",
    "preparation": "bílý, neslazený",
    "gi": 12,
    "giMin": 11,
    "giMax": 19,
    "carbsPer100g": 3.8,
    "defaultPortion": 150,
    "note": "Nízké množství sacharidů vede zpravidla k velmi nízké GL.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jogurt-ovocny",
    "foodName": "Ovocný jogurt",
    "category": "Mléčné výrobky",
    "preparation": "slazený",
    "gi": 41,
    "giMin": 33,
    "giMax": 50,
    "carbsPer100g": 13.0,
    "defaultPortion": 150,
    "note": "Receptury se výrazně liší množstvím přidaného cukru; etiketa má přednost.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "kefir",
    "foodName": "Kefír",
    "category": "Mléčné výrobky",
    "preparation": "bílý, neochucený",
    "gi": 18,
    "giMin": 11,
    "giMax": 36,
    "carbsPer100g": 4.5,
    "defaultPortion": 250,
    "note": "Fermentované mléčné výrobky mají často nízký GI; konkrétní kultura a receptura se liší.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "mleko-cokoladove",
    "foodName": "Čokoládové mléko",
    "category": "Mléčné výrobky",
    "preparation": "slazené",
    "gi": 32,
    "giMin": 24,
    "giMax": 37,
    "carbsPer100g": 10.5,
    "defaultPortion": 250,
    "note": "Použijte sacharidy z etikety konkrétního výrobku.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "zmrzlina",
    "foodName": "Zmrzlina",
    "category": "Mléčné výrobky",
    "preparation": "běžná mléčná",
    "gi": 50,
    "giMin": 39,
    "giMax": 62,
    "carbsPer100g": 23.0,
    "defaultPortion": 100,
    "note": "Tuk snižuje rychlost trávení, ale množství cukrů a velikost porce jsou rozhodující.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "ryzovy-nakyp-puding",
    "foodName": "Rýžový pudink nebo mléčná rýže",
    "category": "Mléčné výrobky",
    "preparation": "hotový výrobek",
    "gi": 59,
    "giMin": 50,
    "giMax": 65,
    "carbsPer100g": 18.0,
    "defaultPortion": 200,
    "note": "Jde o smíšený výrobek; receptury se liší množstvím rýže, mléka a cukru.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "sacharoza",
    "foodName": "Cukr krystal",
    "category": "Sladkosti a nápoje",
    "preparation": "sacharóza",
    "gi": 65,
    "giMin": 60,
    "giMax": 65,
    "carbsPer100g": 100.0,
    "defaultPortion": 10,
    "note": "GI sacharózy je nižší než u čisté glukózy, ale jde prakticky o 100 % dostupných sacharidů.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
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
    "note": "Glukóza je referenční potravina se GI 100.",
    "evidence": "Referenční hodnota",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "med-bezny",
    "foodName": "Med",
    "category": "Sladkosti a nápoje",
    "preparation": "běžný směsný med",
    "gi": 58,
    "giMin": 35,
    "giMax": 77,
    "carbsPer100g": 82.0,
    "defaultPortion": 20,
    "note": "GI medu se výrazně mění podle poměru glukózy a fruktózy a botanického původu.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
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
    "note": "Hodnota se týká konkrétního českého vzorku a nelze ji automaticky přenést na každý lipový med.",
    "evidence": "Přímé testování konkrétní české položky",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cokolada-horka",
    "foodName": "Hořká čokoláda",
    "category": "Sladkosti a nápoje",
    "preparation": "70–85 % kakaa",
    "gi": 29,
    "giMin": 18,
    "giMax": 44,
    "carbsPer100g": 35.0,
    "defaultPortion": 25,
    "note": "Původní obecná hodnota 40 byla nahrazena rozpětím podle podílu kakaa a receptury.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cokolada-mlecna",
    "foodName": "Mléčná čokoláda",
    "category": "Sladkosti a nápoje",
    "preparation": "běžná",
    "gi": 45,
    "giMin": 39,
    "giMax": 54,
    "carbsPer100g": 57.0,
    "defaultPortion": 25,
    "note": "Jednotlivé značky se liší obsahem cukru, tuku a mléčné složky.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bebe-dobre-rano-4-cerealie",
    "foodName": "Sušenky BeBe Dobré ráno",
    "category": "Sladkosti a nápoje",
    "preparation": "4 cereálie; historicky testovaná receptura",
    "gi": 51,
    "giMin": 51,
    "giMax": 51,
    "carbsPer100g": 65.0,
    "defaultPortion": 30,
    "note": "GI se týká starší testované receptury. Aktuální složení a etiketa mohou být jiné.",
    "evidence": "Přímé testování konkrétního českého výrobku",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "bebe-dobre-rano-orechy-med",
    "foodName": "Sušenky BeBe Dobré ráno",
    "category": "Sladkosti a nápoje",
    "preparation": "ořechy a med; historicky testovaná receptura",
    "gi": 41,
    "giMin": 41,
    "giMax": 41,
    "carbsPer100g": 65.0,
    "defaultPortion": 30,
    "note": "GI se týká starší testované receptury. Aktuální složení a etiketa mohou být jiné.",
    "evidence": "Přímé testování konkrétního českého výrobku",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "susenk-y-cajove",
    "foodName": "Čajové sušenky",
    "category": "Sladkosti a nápoje",
    "preparation": "běžné pšeničné",
    "gi": 55,
    "giMin": 50,
    "giMax": 67,
    "carbsPer100g": 68.0,
    "defaultPortion": 30,
    "note": "Receptury a velikosti porce se výrazně liší; použijte etiketu.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "marmelada-dzem",
    "foodName": "Džem nebo marmeláda",
    "category": "Sladkosti a nápoje",
    "preparation": "běžná slazená",
    "gi": 51,
    "giMin": 49,
    "giMax": 55,
    "carbsPer100g": 60.0,
    "defaultPortion": 30,
    "note": "Obsah cukru se liší; u výrobku použijte etiketu.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "zele-bonbony",
    "foodName": "Želé bonbony",
    "category": "Sladkosti a nápoje",
    "preparation": "slazené cukrem a glukózovým sirupem",
    "gi": 80,
    "giMin": 70,
    "giMax": 80,
    "carbsPer100g": 78.0,
    "defaultPortion": 25,
    "note": "Hodnota je přiřazena k přímo testovaným želé cukrovinkám; konkrétní receptury se liší.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "cola",
    "foodName": "Colový nápoj",
    "category": "Sladkosti a nápoje",
    "preparation": "slazený cukrem",
    "gi": 63,
    "giMin": 53,
    "giMax": 65,
    "carbsPer100g": 10.6,
    "defaultPortion": 330,
    "note": "Použijte sacharidy z etikety; receptura se mezi zeměmi a značkami liší.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "pomerancovy-dzus",
    "foodName": "Pomerančový džus",
    "category": "Sladkosti a nápoje",
    "preparation": "100% džus",
    "gi": 50,
    "giMin": 46,
    "giMax": 54,
    "carbsPer100g": 9.5,
    "defaultPortion": 250,
    "note": "Džus nemá strukturu celého plodu a porce se snadno vypije rychle.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  },
  {
    "id": "jablecny-dzus",
    "foodName": "Jablečný džus",
    "category": "Sladkosti a nápoje",
    "preparation": "100% džus",
    "gi": 41,
    "giMin": 36,
    "giMax": 44,
    "carbsPer100g": 10.5,
    "defaultPortion": 250,
    "note": "Použita je reprezentativní hodnota pro čirý nebo běžný jablečný džus.",
    "evidence": "Reprezentativní hodnota z více testovaných variant",
    "sourceTitle": "University of Sydney GI Search / International Tables 2021",
    "sourceUrl": "https://glycemicindex.com/gi-search/",
    "carbsSourceTitle": "Typické dostupné sacharidy; u baleného výrobku použijte etiketu",
    "carbsSourceUrl": "https://www.nutridatabaze.cz/"
  }
];

  var numberFormatter = new Intl.NumberFormat("cs-CZ", {
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
      return { key: "low", label: "Nízká GL", text: "Nízká glykemická nálož (10 a méně)." };
    }
    if (gl < 20) {
      return { key: "medium", label: "Střední GL", text: "Střední glykemická nálož (11–19)." };
    }
    return { key: "high", label: "Vysoká GL", text: "Vysoká glykemická nálož (20 a více)." };
  }

  function formatRange(min, max) {
    if (!Number.isFinite(min) || !Number.isFinite(max)) return "–";
    if (Math.abs(max - min) < 0.05) return formatNumber(min);
    return formatNumber(min) + "–" + formatNumber(max);
  }

  function giDisplay(food) {
    if (!food) return "";
    if (food.giMin === food.giMax) return formatNumber(food.gi);
    return formatNumber(food.gi) + " (rozmezí " + formatNumber(food.giMin) + "–" + formatNumber(food.giMax) + ")";
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
    container.setAttribute("data-version", "4.0.0-cz");
    container.setAttribute("role", "region");
    container.setAttribute("aria-label", "Interaktivní kalkulačka glykemické nálože");

    container.innerHTML = `
      <div class="mb-glc">
        <div class="mb-glc__header">
          <h2 class="mb-glc__title">Kalkulačka glykemické nálože</h2>
          <p>Orientační výpočet pro jednu potravinu nebo její porci. U běžných potravin zobrazuje reprezentativní GI i rozpětí nalezené u testovaných variant.</p>
          <span class="mb-glc__formula">GL = GI × dostupné sacharidy v porci ÷ 100</span>
          <span class="mb-glc__formula">Databáze 3.0 · 118 položek · revize 07/2026</span>
        </div>

        <div class="mb-glc__tabs" role="tablist" aria-label="Způsob výpočtu">
          <button class="mb-glc__tab" id="mb-glc-tab-food" type="button" role="tab" aria-controls="mb-glc-panel-food" aria-selected="true">Výběr potraviny</button>
          <button class="mb-glc__tab" id="mb-glc-tab-manual" type="button" role="tab" aria-controls="mb-glc-panel-manual" aria-selected="false" tabindex="-1">Ruční výpočet</button>
        </div>

        <div class="mb-glc__body">
          <section class="mb-glc__panel" id="mb-glc-panel-food" role="tabpanel" aria-labelledby="mb-glc-tab-food">
            <div class="mb-glc__grid">
              <div class="mb-glc__field mb-glc__field--full">
                <label class="mb-glc__label" for="mb-glc-search">Vyhledat potravinu</label>
                <input id="mb-glc-search" type="search" autocomplete="off" placeholder="Např. ovesné vločky, jablko nebo rýže">
                <span class="mb-glc__hint">Vyhledávání filtruje název, kategorii i variantu přípravy.</span>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-category">Kategorie</label>
                <select id="mb-glc-category"></select>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-food">Potravina</label>
                <select id="mb-glc-food"></select>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-variant">Příprava nebo varianta</label>
                <select id="mb-glc-variant"></select>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-portion">Velikost porce (g)</label>
                <input id="mb-glc-portion" type="number" inputmode="decimal" min="1" max="2000" step="1">
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-gi">Reprezentativní GI a testované rozpětí</label>
                <input id="mb-glc-gi" type="text" readonly>
              </div>

              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-carbs100">Dostupné sacharidy na 100 g</label>
                <input id="mb-glc-carbs100" type="text" readonly>
              </div>
            </div>

            <div class="mb-glc__metrics" aria-label="Mezivýsledky">
              <div class="mb-glc__metric"><span>Dostupné sacharidy v porci</span><strong id="mb-glc-portion-carbs">–</strong></div>
              <div class="mb-glc__metric"><span>Odhadované rozpětí GL</span><strong id="mb-glc-gl-range">–</strong></div>
              <div class="mb-glc__metric"><span>Zadaná porce</span><strong id="mb-glc-portion-summary">–</strong></div>
            </div>

            <div class="mb-glc__result" id="mb-glc-food-result" aria-live="polite">
              <div class="mb-glc__result-top">
                <div>
                  <p class="mb-glc__result-label">Glykemická nálož porce</p>
                  <p class="mb-glc__result-value" id="mb-glc-food-gl">–</p>
                </div>
                <span class="mb-glc__badge mb-glc__badge--low" id="mb-glc-food-badge">Vyberte potravinu</span>
              </div>
              <p class="mb-glc__interpretation" id="mb-glc-food-interpretation">Zvolte potravinu, variantu a velikost porce.</p>
              <div class="mb-glc__details" id="mb-glc-food-details"></div>
            </div>

            <div class="mb-glc__actions">
              <button class="mb-glc__button" id="mb-glc-reset-food" type="button">Obnovit výchozí hodnoty</button>
            </div>
          </section>

          <section class="mb-glc__panel" id="mb-glc-panel-manual" role="tabpanel" aria-labelledby="mb-glc-tab-manual" hidden>
            <div class="mb-glc__grid">
              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-manual-gi">Glykemický index (GI)</label>
                <input id="mb-glc-manual-gi" type="number" inputmode="decimal" min="0" max="150" step="0.1" placeholder="Např. 55">
                <span class="mb-glc__hint">Použijte hodnotu pro konkrétní potravinu, výrobek a úpravu.</span>
              </div>
              <div class="mb-glc__field">
                <label class="mb-glc__label" for="mb-glc-manual-carbs">Dostupné sacharidy v celé porci (g)</label>
                <input id="mb-glc-manual-carbs" type="number" inputmode="decimal" min="0" max="500" step="0.1" placeholder="Např. 32">
                <span class="mb-glc__hint">U balených výrobků vycházejte z údaje „sacharidy“ a skutečné velikosti porce.</span>
              </div>
            </div>

            <div class="mb-glc__result" id="mb-glc-manual-result" aria-live="polite">
              <div class="mb-glc__result-top">
                <div>
                  <p class="mb-glc__result-label">Glykemická nálož porce</p>
                  <p class="mb-glc__result-value" id="mb-glc-manual-gl">–</p>
                </div>
                <span class="mb-glc__badge mb-glc__badge--low" id="mb-glc-manual-badge">Zadejte hodnoty</span>
              </div>
              <p class="mb-glc__interpretation" id="mb-glc-manual-interpretation">Výsledek se zobrazí automaticky.</p>
              <div class="mb-glc__details" id="mb-glc-manual-details"></div>
            </div>

            <div class="mb-glc__actions">
              <button class="mb-glc__button" id="mb-glc-reset-manual" type="button">Vymazat hodnoty</button>
            </div>
          </section>

          <div class="mb-glc__warning">
            <strong>Výsledek je orientační.</strong> U obecných názvů potravin není uvedené GI laboratorním výsledkem každého výrobku, ale reprezentativní hodnotou z testovaných variant. GI se může lišit podle odrůdy, značky, zralosti, receptury a přípravy. Tuky, bílkoviny, vláknina, kyselost, pořadí jídla, pohyb i individuální metabolická reakce mohou průběh glykémie změnit. U smíšených jídel nelze přesnou reakci určit pouhým součtem tabulkových hodnot.
          </div>
          <p class="mb-glc__privacy">Výpočet probíhá pouze ve vašem prohlížeči. Zadané údaje se nikam neodesílají ani neukládají.</p>
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
      els.category.innerHTML = '<option value="">Všechny kategorie</option>' + categories.map(function (category) {
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
        els.food.innerHTML = '<option value="">Nenalezena žádná potravina</option>';
        els.food.disabled = true;
        els.variant.innerHTML = '<option value="">Upravte vyhledávání</option>';
        els.variant.disabled = true;
        clearFoodResult("Pro zadaný filtr jsme nenašli žádnou položku. Zkuste kratší název nebo ruční výpočet.");
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
        els.variant.innerHTML = '<option value="">Není dostupná varianta</option>';
        els.variant.disabled = true;
        clearFoodResult("Vyberte jinou potravinu nebo použijte ruční výpočet.");
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
        clearFoodResult("Zadejte platnou velikost porce větší než 0 g.");
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
        : " Při použití testovaného rozpětí GI vychází GL přibližně " + formatRange(glMin, glMax) + ".";

      els.foodInterpretation.textContent =
        category.text + " Výsledek vychází z " + formatNumber(carbs) +
        " g dostupných sacharidů v porci." + rangeText;

      var giText = food.giMin === food.giMax
        ? formatNumber(food.gi)
        : formatNumber(food.gi) + " (testované rozpětí " + formatNumber(food.giMin) + "–" + formatNumber(food.giMax) + ")";

      els.foodDetails.innerHTML =
        '<p><strong>Výpočet reprezentativní GL:</strong> ' + formatNumber(food.gi) + ' × ' + formatNumber(carbs) + ' ÷ 100 = ' + formatNumber(gl) + '</p>' +
        '<p><strong>GI použité v kalkulačce:</strong> ' + giText + '</p>' +
        '<p><strong>Varianta:</strong> ' + escapeHtml(food.foodName) + ' – ' + escapeHtml(food.preparation) + '</p>' +
        '<p><strong>Podklad:</strong> ' + escapeHtml(food.evidence) + '</p>' +
        '<p><strong>Poznámka:</strong> ' + escapeHtml(food.note) + '</p>' +
        '<p><strong>Zdroje GI:</strong> <a href="' + escapeHtml(food.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(food.sourceTitle) + '</a> · <a href="' + SOURCE_TABLES_URL + '" target="_blank" rel="noopener noreferrer">systematický přehled 2021</a></p>' +
        '<p><strong>Dostupné sacharidy:</strong> typická orientační hodnota na 100 g. U baleného výrobku má přednost jeho aktuální etiketa; u domácího pokrmu konkrétní receptura.</p>';
    }

    function calculateManual() {
      var gi = parseNumber(els.manualGi.value);
      var carbs = parseNumber(els.manualCarbs.value);
      if (!Number.isFinite(gi) || !Number.isFinite(carbs) || gi < 0 || carbs < 0) {
        els.manualGl.textContent = "–";
        els.manualBadge.className = "mb-glc__badge mb-glc__badge--low";
        els.manualBadge.textContent = "Zadejte hodnoty";
        els.manualInterpretation.textContent = "Zadejte platný GI a dostupné sacharidy v celé porci.";
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
        '<p>Ruční režim je vhodný pro konkrétní výrobky, které nejsou v databázi. Použijte GI odpovídající konkrétní variantě a sacharidy pro skutečně snědenou porci.</p>';
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
