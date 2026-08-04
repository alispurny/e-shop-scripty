/**
 * MyBears — sjednocená grafická verze 2.0 (CZ)
 * Vizuální systém vychází z MyBears Product Guide v1.8.
 * Funkční logika, výpočty, interní ID, URL a veřejné API zůstávají zachované.
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
    if (document.getElementById("mb-glc-embedded-styles")) return;

    var style = document.createElement("style");
    style.id = "mb-glc-embedded-styles";
    style.type = "text/css";
    style.textContent = '/* =========================================================\n   MyBears – kalkulačka glykemické nálože\n   Kompatibilní CSS verze pro Upgates\n   ========================================================= */\n\n.mb-glc-page {\n  max-width: 920px;\n  margin: 0 auto;\n}\n\n.mb-glc-page > h2 {\n  margin: 32px 0 10px;\n  line-height: 1.35;\n}\n\n.mb-glc-page > h2:first-child {\n  margin-top: 0;\n}\n\n.mb-glc-page__notice {\n  margin: 24px 0;\n  padding: 18px 20px;\n  background: #fff9df;\n  border: 1px solid #eadb86;\n  border-radius: 12px;\n  line-height: 1.6;\n}\n\n#mb-glycemic-load-calculator {\n  margin: 28px 0 36px;\n  color: #202521;\n  font: inherit;\n}\n\n#mb-glycemic-load-calculator *,\n#mb-glycemic-load-calculator *::before,\n#mb-glycemic-load-calculator *::after {\n  box-sizing: border-box;\n}\n\n#mb-glycemic-load-calculator button,\n#mb-glycemic-load-calculator input,\n#mb-glycemic-load-calculator select {\n  font: inherit;\n}\n\n.mb-glc {\n  overflow: hidden;\n  background: #ffffff;\n  border: 1px solid #dce5df;\n  border-radius: 18px;\n  box-shadow: 0 14px 38px rgba(24, 67, 43, 0.08);\n}\n\n.mb-glc__header {\n  padding: 24px;\n  background: #f7fbf8;\n  border-bottom: 1px solid #dce5df;\n}\n\n.mb-glc__header h3 {\n  margin: 0 0 8px;\n  font-size: 30px;\n  line-height: 1.25;\n}\n\n.mb-glc__header p {\n  max-width: 760px;\n  margin: 0;\n  color: #626b65;\n  line-height: 1.6;\n}\n\n.mb-glc__formula {\n  display: inline-block;\n  margin-top: 14px;\n  padding: 8px 12px;\n  background: #ffffff;\n  border: 1px solid #dce5df;\n  border-radius: 9px;\n  font-size: 14px;\n  font-weight: 700;\n}\n\n.mb-glc__tabs {\n  display: flex;\n  gap: 8px;\n  padding: 18px 24px 0;\n}\n\n.mb-glc__tab {\n  min-height: 44px;\n  padding: 10px 16px;\n  color: #202521;\n  background: #ffffff;\n  border: 1px solid #dce5df;\n  border-radius: 10px;\n  cursor: pointer;\n  font-weight: 700;\n}\n\n.mb-glc__tab:hover {\n  border-color: #2dc26b;\n}\n\n.mb-glc__tab[aria-selected="true"] {\n  color: #ffffff;\n  background: #177d45;\n  border-color: #177d45;\n}\n\n.mb-glc__tab:focus,\n.mb-glc__button:focus,\n.mb-glc input:focus,\n.mb-glc select:focus,\n.mb-glc a:focus {\n  outline: 3px solid rgba(45, 194, 107, 0.28);\n  outline-offset: 2px;\n}\n\n.mb-glc__body {\n  padding: 24px;\n}\n\n.mb-glc__panel[hidden] {\n  display: none !important;\n}\n\n.mb-glc__grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 18px;\n}\n\n.mb-glc__field--full {\n  grid-column: 1 / -1;\n}\n\n.mb-glc__label {\n  display: block;\n  margin: 0 0 7px;\n  font-size: 14px;\n  font-weight: 700;\n}\n\n.mb-glc__hint {\n  display: block;\n  margin-top: 6px;\n  color: #626b65;\n  font-size: 13px;\n  line-height: 1.45;\n}\n\n.mb-glc input,\n.mb-glc select {\n  width: 100%;\n  min-height: 48px;\n  padding: 10px 12px;\n  color: #202521;\n  background: #ffffff;\n  border: 1px solid #bfcac3;\n  border-radius: 10px;\n}\n\n.mb-glc input[readonly] {\n  background: #f5f7f6;\n  color: #4d5650;\n}\n\n.mb-glc__metrics {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 12px;\n  margin: 22px 0 0;\n}\n\n.mb-glc__metric {\n  padding: 14px 16px;\n  background: #f8faf9;\n  border: 1px solid #dce5df;\n  border-radius: 11px;\n}\n\n.mb-glc__metric span {\n  display: block;\n  margin-bottom: 4px;\n  color: #626b65;\n  font-size: 13px;\n}\n\n.mb-glc__metric strong {\n  font-size: 20px;\n  line-height: 1.2;\n}\n\n.mb-glc__result {\n  margin-top: 22px;\n  padding: 20px;\n  background: #f2fbf5;\n  border: 2px solid #2dc26b;\n  border-radius: 14px;\n}\n\n.mb-glc__result-top {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 18px;\n}\n\n.mb-glc__result-label {\n  margin: 0 0 4px;\n  color: #626b65;\n  font-size: 14px;\n}\n\n.mb-glc__result-value {\n  margin: 0;\n  font-size: 48px;\n  line-height: 1;\n}\n\n.mb-glc__badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 38px;\n  padding: 8px 12px;\n  border-radius: 999px;\n  font-size: 14px;\n  font-weight: 800;\n  text-align: center;\n}\n\n.mb-glc__badge--low {\n  color: #16784a;\n  background: #dff6e9;\n}\n\n.mb-glc__badge--medium {\n  color: #8a6500;\n  background: #fff0b8;\n}\n\n.mb-glc__badge--high {\n  color: #a63232;\n  background: #fde2e2;\n}\n\n.mb-glc__interpretation {\n  margin: 14px 0 0;\n  line-height: 1.55;\n}\n\n.mb-glc__details {\n  margin-top: 16px;\n  padding-top: 16px;\n  border-top: 1px solid rgba(45, 194, 107, 0.36);\n  color: #626b65;\n  font-size: 14px;\n  line-height: 1.6;\n}\n\n.mb-glc__details p {\n  margin: 4px 0;\n}\n\n.mb-glc__details a {\n  color: #177d45;\n  font-weight: 700;\n  text-decoration: underline;\n}\n\n.mb-glc__actions {\n  display: flex;\n  justify-content: flex-end;\n  margin-top: 16px;\n}\n\n.mb-glc__button {\n  min-height: 42px;\n  padding: 9px 14px;\n  color: #177d45;\n  background: #ffffff;\n  border: 1px solid #2dc26b;\n  border-radius: 9px;\n  cursor: pointer;\n  font-weight: 700;\n}\n\n.mb-glc__button:hover {\n  background: #f2fbf5;\n}\n\n.mb-glc__warning {\n  margin: 22px 0 0;\n  padding: 15px 16px;\n  background: #fff9df;\n  border: 1px solid #eadb86;\n  border-radius: 11px;\n  color: #554a20;\n  font-size: 14px;\n  line-height: 1.55;\n}\n\n.mb-glc__privacy {\n  margin: 14px 0 0;\n  color: #626b65;\n  font-size: 13px;\n  text-align: center;\n}\n\n.mb-glc__empty {\n  padding: 12px;\n  background: #fff9df;\n  border: 1px solid #eadb86;\n  border-radius: 9px;\n  color: #554a20;\n  font-size: 14px;\n}\n\n.mb-glc-cta {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 20px;\n  margin: 30px 0;\n  padding: 22px;\n  background: #f7fbf8;\n  border: 2px solid #2dc26b;\n  border-radius: 12px;\n}\n\n.mb-glc-cta h2 {\n  margin: 0 0 6px;\n  font-size: 22px;\n  line-height: 1.35;\n}\n\n.mb-glc-cta p {\n  margin: 0;\n  line-height: 1.55;\n}\n\n.mb-glc-cta__button {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 46px;\n  padding: 11px 18px;\n  color: #ffffff !important;\n  background: #177d45;\n  border-radius: 9px;\n  font-weight: 800;\n  text-decoration: none !important;\n}\n\n.mb-glc-cta__button:hover {\n  background: #12693a;\n}\n\n@media (max-width: 700px) {\n  .mb-glc__header,\n  .mb-glc__body {\n    padding: 20px;\n  }\n\n  .mb-glc__header h3 {\n    font-size: 24px;\n  }\n\n  .mb-glc__tabs {\n    padding: 16px 20px 0;\n  }\n\n  .mb-glc__tab {\n    flex: 1 1 0;\n    padding-right: 10px;\n    padding-left: 10px;\n  }\n\n  .mb-glc__grid,\n  .mb-glc__metrics {\n    grid-template-columns: 1fr;\n  }\n\n  .mb-glc__result-top {\n    align-items: flex-start;\n    flex-direction: column;\n  }\n\n  .mb-glc__result-value {\n    font-size: 36px;\n  }\n\n  .mb-glc-cta {\n    align-items: stretch;\n    flex-direction: column;\n  }\n\n  .mb-glc-cta__button {\n    width: 100%;\n  }\n}\n';
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

    container.innerHTML = `
      <div class="mb-glc">
        <div class="mb-glc__header">
          <h3>Kalkulačka glykemické nálože</h3>
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
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        var direction = event.key === "ArrowRight" ? 1 : -1;
        var next = (index + direction + els.tabs.length) % els.tabs.length;
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

/* MyBears sjednocená grafická vrstva 2.0 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || document.getElementById('mb-unified-kalkulacka-glykemicke-naloze-styles')) return;
  var style = document.createElement('style');
  style.id = 'mb-unified-kalkulacka-glykemicke-naloze-styles';
  style.textContent = String.raw`/* MyBears unified design layer — Product Guide v1.8 */
#mb-glycemic-load-calculator{--mb-green:#2dc26b;--mb-green-dark:#198d4b;--mb-green-soft:#f4f8f4;--mb-border:#e5e3dc;--mb-text:#20221f;--mb-muted:#626760;--mb-cream:#faf7ef;--mb-gold:#DBC442;width:100%;max-width:1120px;margin:24px auto 40px!important;color:var(--mb-text);font-family:Arial,Helvetica,sans-serif;line-height:1.55}
#mb-glycemic-load-calculator *{box-sizing:border-box}.mb-glc{position:relative;border:1px solid var(--mb-border)!important;border-radius:18px!important;background:#fff!important;box-shadow:0 12px 32px rgba(27,35,29,.07)!important}.mb-glc::before{content:"";position:absolute;z-index:5;top:0;left:0;right:0;height:4px;background:var(--mb-gold)}
.mb-glc__header{padding:34px 38px 26px!important;background:var(--mb-cream)!important;border-bottom:1px solid var(--mb-border)!important}.mb-glc__header h3{color:var(--mb-green)!important;font-size:clamp(25px,3.2vw,30px)!important}.mb-glc__header p{color:#454a45!important}.mb-glc__formula{border-color:#eadfc8!important;background:#fff!important}
.mb-glc__tabs{padding:22px 38px 0!important}.mb-glc__tab{border-radius:8px!important;border-color:var(--mb-border)!important;color:var(--mb-green-dark)!important}.mb-glc__tab[aria-selected="true"]{background:var(--mb-green)!important;border-color:var(--mb-green)!important;color:#fff!important}
.mb-glc__body{padding:30px 38px 36px!important}.mb-glc__label{color:#292b28!important;font-size:15px!important}.mb-glc input,.mb-glc select{border-color:#d4d6d1!important;border-radius:8px!important;color:var(--mb-text)!important}.mb-glc input:focus,.mb-glc select:focus,.mb-glc button:focus-visible,.mb-glc a:focus-visible{outline:3px solid rgba(219,196,66,.38)!important;outline-offset:2px!important;border-color:var(--mb-green-dark)!important}
.mb-glc__metric{border-color:var(--mb-border)!important;border-radius:12px!important;background:#fff!important}.mb-glc__result{border:1px solid #cfe4d5!important;border-radius:16px!important;background:var(--mb-green-soft)!important}.mb-glc__badge{border:1px solid #d7ceb8!important;background:#fff8df!important;color:#75633d!important}.mb-glc__button{min-height:48px!important;padding:12px 24px!important;border:2px solid var(--mb-green)!important;border-radius:8px!important;color:var(--mb-green-dark)!important;background:#fff!important}.mb-glc__warning,.mb-glc__empty{border-color:#eadfc8!important;border-left:4px solid var(--mb-gold)!important;background:var(--mb-cream)!important}
.mb-glc-cta{border-color:var(--mb-green)!important;background:var(--mb-cream)!important}.mb-glc-cta__button{background:var(--mb-green)!important}.mb-glc-cta__button:hover{background:var(--mb-green-dark)!important}
@media(max-width:700px){.mb-glc__header,.mb-glc__body{padding-left:20px!important;padding-right:20px!important}.mb-glc__tabs{padding-left:20px!important;padding-right:20px!important}}
@media(prefers-reduced-motion:reduce){.mb-glc *,.mb-glc *::before,.mb-glc *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}`;
  document.head.appendChild(style);
})();
