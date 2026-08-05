/**
 * MyBears — kalkulačka pitného režimu a elektrolytů (CZ)
 * Kompletně sjednoceno podle poslední šablony převodníku krevních lipidů.
 * Funkční logika původního nástroje zůstává zachována.
 */
(function () {
  'use strict';

  var T = {"locale":"cs-CZ","root":"mb-hydration-electrolyte-calculator","style":"mb-hydration-electrolyte-calculator-styles","version":"3.0.0-cz","region_label":"Interaktivní kalkulačka pitného režimu a ztrát potem","title":"Kalkulačka pitného režimu a ztrát potem","lead":"Spočítejte orientační denní rozmezí tekutin nebo proveďte vlastní test pocení a odhadněte ztrátu sodíku.","notice":"<strong>Důležité:</strong> Potřeba tekutin i koncentrace sodíku v potu jsou individuální. Výsledky nejsou doporučením k automatickému doplnění stejného množství vody nebo elektrolytů.","tabs_label":"Režim kalkulačky","tab_daily":"Denní pitný režim","tab_sweat":"Test pocení a sodíku","daily_title":"Orientační denní příjem tekutin","daily_intro":"Zadejte základní údaje. Výsledek představuje široké pracovní rozmezí pro běžný den, nikoli povinný cíl.","weight":"Hmotnost","weight_hint":"Povolené rozmezí: 30–250 kg","age":"Věk","age_unit":"let","age_hint":"Kalkulačka je určena dospělým od 18 let.","reference_group":"Referenční skupina","female":"Žena","male":"Muž","reference_hint":"Používá se pouze pro srovnání s referenčním příjmem celkové vody EFSA.","glass":"Velikost sklenice","glass_hint":"Přepočet je pouze pro snazší představu.","calculate_daily":"Vypočítat pitný režim","reset":"Vymazat údaje","sweat_title":"Test pocení a odhad ztráty sodíku","sweat_intro":"Pro co nejpřesnější odhad se zvažte bezprostředně před aktivitou a po ní, ideálně ve stejném suchém oblečení.","pre_weight":"Hmotnost před aktivitou","post_weight":"Hmotnost po aktivitě","duration":"Délka aktivity","duration_unit":"min","drink":"Tekutiny vypité během aktivity","urine":"Moč během aktivity","urine_hint":"Pokud jste během testu nemočili, ponechte 0.","sodium_mode":"Koncentrace sodíku v potu","sodium_unknown":"Nevím – zobrazit široké rozpětí","sodium_mg":"Znám hodnotu v mg/l","sodium_mmol":"Znám hodnotu v mmol/l","sodium_hint":"Přesnější hodnotu poskytne validované vyšetření potu.","sodium_value":"Zadejte koncentraci sodíku","calculate_sweat":"Vypočítat ztrátu potem","privacy":"Výpočty probíhají pouze ve vašem prohlížeči. Zadané údaje se tímto skriptem nikam neodesílají ani neukládají.","daily_result_label":"Orientační denní rozmezí tekutin","daily_summary":"Jde o orientační pracovní rozmezí pro běžný den. Potřeba se může zvýšit při horku, delší fyzické aktivitě, horečce, průjmu nebo zvracení. Část vody přijímáte také z potravin.","glasses_label":"Přepočet na sklenice","efsa_label":"Referenční celková voda EFSA","sport_label":"Při sportu a horku","sport_value":"Použijte test pocení","efsa_warning":"<strong>Referenční hodnota EFSA zahrnuje vodu z nápojů i potravin.</strong> Nelze ji chápat jako povinné množství čisté vody. Při onemocnění srdce nebo ledvin a při omezení tekutin se řiďte pokyny lékaře.","high_weight_warning":"<strong>Pozor:</strong> Výpočet podle aktuální hmotnosti může u vyšší tělesné hmotnosti poskytovat vysoké hodnoty. Výsledek proto berte jako široké pracovní rozmezí, nikoliv jako povinný cíl.","sweat_result_label":"Odhadovaná ztráta potem","sweat_summary":"Výpočet vychází ze změny hmotnosti upravené o vypité tekutiny a případnou moč. Opakujte test ve stejném sportu a podobné teplotě, protože rychlost pocení se mezi podmínkami výrazně mění.","sweat_rate":"Rychlost pocení","mass_change":"Změna tělesné hmotnosti","model_sodium":"Modelová ztráta sodíku","estimated_sodium":"Odhad ztráty sodíku","sodium_warning":"<strong>Ztráta sodíku není automatická dávka k doplnění.</strong> Potřeba sodíku závisí také na délce aktivity, množství vypitých tekutin, jídle a zdravotním stavu. Draslík, hořčík a vápník kalkulačka přesně nepočítá, protože je nelze spolehlivě odvodit jen z hmotnosti a délky aktivity.","overdrink_warning":"<strong>Hmotnost po aktivitě je vyšší než před ní.</strong> To může znamenat, že příjem tekutin převýšil čistou ztrátu. Během delší aktivity není vhodné pít tak, aby hmotnost rostla.","dehydration_warning":"<strong>Pokles hmotnosti dosáhl přibližně 2 % nebo více.</strong> Výsledek je vhodné zohlednit při plánování pití pro podobnou aktivitu a stejné podmínky.","rate_low":"nižší pocení","rate_medium":"střední pocení","rate_high":"vyšší pocení","rate_very_high":"velmi vysoké pocení","errors":{"weight":"Zadejte hmotnost v rozmezí 30–250 kg.","age":"Zadejte věk v rozmezí 18–100 let.","pre":"Zadejte hmotnost před aktivitou v rozmezí 30–250 kg.","post":"Zadejte hmotnost po aktivitě v rozmezí 30–250 kg.","duration":"Zadejte délku aktivity v rozmezí 15–720 minut.","drink":"Zadejte množství vypitých tekutin od 0 do 10 000 ml.","urine":"Zadejte množství moči od 0 do 5 000 ml.","sodium":"Zadejte platnou koncentraci sodíku v potu.","loss":"Zadané hodnoty vedou k nulové nebo záporné ztrátě potem. Zkontrolujte hmotnost, vypité tekutiny a moč."}};

  var ROOT_ID = T.root;
  var STYLE_ID = T.style;
  var VERSION = T.version;

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    var clean = value.trim().replace(/\s+/g, '');
    if (clean === '') return NaN;
    return Number(clean.replace(',', '.'));
  }

  function formatNumber(value, decimals) {
    return new Intl.NumberFormat(T.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function addStyles() {
    var oldStyle = document.getElementById(STYLE_ID);
    if (oldStyle && oldStyle.parentNode) oldStyle.parentNode.removeChild(oldStyle);

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = String.raw`
/* MyBears unified design layer — based on the final blood-lipid converter */
#${ROOT_ID} {
  --mb-green:#2dc26b !important;
  --mb-green-dark:#198d4b !important;
  --mb-green-soft:#f4f8f4 !important;
  --mb-border:#e5e3dc !important;
  --mb-cream:#faf7ef !important;
  --mb-yellow:#DBC442 !important;
  --mb-yellow-soft:#fff8df !important;
  --mb-danger:#a63a36 !important;
  width:100% !important;
  max-width:1120px !important;
  margin:24px auto 40px !important;
  padding:0 !important;
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  font-size:16px !important;
  font-weight:400 !important;
  line-height:1.55 !important;
  text-align:left !important;
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
#${ROOT_ID} b {
  font-weight:700 !important;
}
#${ROOT_ID} .mb-hy {
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
#${ROOT_ID} .mb-hy::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-hy__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-hy__title,
#${ROOT_ID} .mb-hy__title {
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
  -webkit-text-fill-color:#000 !important;
  -webkit-text-stroke:0 transparent !important;
}
#${ROOT_ID} h2.mb-hy__title::before,
#${ROOT_ID} h2.mb-hy__title::after,
#${ROOT_ID} .mb-hy__title::before,
#${ROOT_ID} .mb-hy__title::after,
#${ROOT_ID} h3.mb-hy__panel-title::before,
#${ROOT_ID} h3.mb-hy__panel-title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-hy__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-hy__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-hy__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-hy__tabs {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:8px !important;
  margin:0 0 22px !important;
  padding:5px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} .mb-hy__tab {
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
}
#${ROOT_ID} .mb-hy__tab:hover {
  border-color:#b8d9c3 !important;
  background:#fff !important;
  transform:translateY(-1px) !important;
}
#${ROOT_ID} .mb-hy__tab[aria-selected="true"] {
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  box-shadow:none !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-hy__tab:focus-visible,
#${ROOT_ID} .mb-hy__button:focus-visible,
#${ROOT_ID} .mb-hy__input:focus,
#${ROOT_ID} .mb-hy__select:focus {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-hy__panel[hidden],
#${ROOT_ID} .mb-hy__result[hidden],
#${ROOT_ID} .mb-hy__custom[hidden] {
  display:none !important;
}
#${ROOT_ID} .mb-hy__panel {
  margin:0 !important;
  padding:22px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h3.mb-hy__panel-title,
#${ROOT_ID} .mb-hy__panel-title {
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
#${ROOT_ID} .mb-hy__panel-intro {
  margin:0 0 18px !important;
  padding:0 !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-hy__grid {
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:18px !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-hy__field {
  min-width:0 !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-hy__field--full {
  grid-column:1/-1 !important;
}
#${ROOT_ID} .mb-hy__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 15px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
}
#${ROOT_ID} .mb-hy__input-wrap {
  position:relative !important;
  display:block !important;
  width:100% !important;
}
#${ROOT_ID} .mb-hy__input,
#${ROOT_ID} .mb-hy__select {
  display:block !important;
  width:100% !important;
  min-width:0 !important;
  min-height:48px !important;
  margin:0 !important;
  padding:11px 12px !important;
  border:1px solid #b9bdb7 !important;
  border-radius:8px !important;
  background:#fff !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.8) !important;
  color:#000 !important;
  font:400 16px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:left !important;
  text-transform:none !important;
  -webkit-appearance:none !important;
  appearance:none !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} .mb-hy__select {
  padding-right:38px !important;
  background-image:linear-gradient(45deg,transparent 50%,#000 50%),linear-gradient(135deg,#000 50%,transparent 50%) !important;
  background-position:calc(100% - 17px) 20px,calc(100% - 12px) 20px !important;
  background-size:5px 5px,5px 5px !important;
  background-repeat:no-repeat !important;
}
#${ROOT_ID} .mb-hy__input {
  padding-right:64px !important;
}
#${ROOT_ID} .mb-hy__input:hover,
#${ROOT_ID} .mb-hy__select:hover {
  border-color:#8f968e !important;
}
#${ROOT_ID} .mb-hy__input:focus,
#${ROOT_ID} .mb-hy__select:focus {
  border-color:var(--mb-green-dark) !important;
  background-color:#fff !important;
}
#${ROOT_ID} .mb-hy__input::placeholder {
  color:#000 !important;
  opacity:1 !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} .mb-hy__unit {
  position:absolute !important;
  top:50% !important;
  right:12px !important;
  transform:translateY(-50%) !important;
  color:#000 !important;
  font:400 14px/1 Arial,Helvetica,sans-serif !important;
  pointer-events:none !important;
}
#${ROOT_ID} .mb-hy__hint {
  display:block !important;
  margin:6px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-hy__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-hy__button {
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
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} .mb-hy__button:hover {
  transform:translateY(-1px) !important;
}
#${ROOT_ID} .mb-hy__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
}
#${ROOT_ID} .mb-hy__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
}
#${ROOT_ID} .mb-hy__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-hy__button--secondary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} .mb-hy__error {
  display:none !important;
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#000 !important;
  font:400 14px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-hy__error.is-visible {
  display:block !important;
}
#${ROOT_ID} .mb-hy__result {
  margin:24px 0 0 !important;
  padding:24px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:16px !important;
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} .mb-hy__result-top {
  display:flex !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  flex-wrap:wrap !important;
  gap:16px !important;
  margin:0 !important;
}
#${ROOT_ID} .mb-hy__result-label {
  margin:0 0 5px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.35 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-hy__score {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 clamp(32px,5vw,40px)/1.05 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.03em !important;
}
#${ROOT_ID} .mb-hy__badge {
  display:inline-flex !important;
  align-items:center !important;
  min-height:34px !important;
  margin:0 !important;
  padding:6px 11px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:700 14px/1.2 Arial,Helvetica,sans-serif !important;
  white-space:nowrap !important;
}
#${ROOT_ID} .mb-hy__summary {
  margin:14px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 15px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-hy__metrics {
  display:grid !important;
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:18px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-hy__metric {
  min-width:0 !important;
  margin:0 !important;
  padding:14px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-hy__metric-label {
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 13px/1.35 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-hy__metric-value {
  margin:0 !important;
  padding:0 !important;
  overflow-wrap:anywhere !important;
  color:#000 !important;
  font:800 18px/1.25 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-hy__warning {
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important;
  color:#000 !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-hy__privacy {
  margin:20px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 12px/1.5 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#${ROOT_ID} .mb-hy__sr-only {
  position:absolute !important;
  width:1px !important;
  height:1px !important;
  margin:-1px !important;
  padding:0 !important;
  overflow:hidden !important;
  clip:rect(0,0,0,0) !important;
  white-space:nowrap !important;
  border:0 !important;
}
@media (max-width:900px) {
  #${ROOT_ID} .mb-hy__metrics {
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  }
}
@media (max-width:760px) {
  #${ROOT_ID} {
    margin:18px auto 30px !important;
  }
  #${ROOT_ID} .mb-hy {
    border-radius:14px !important;
  }
  #${ROOT_ID} .mb-hy__head {
    padding:28px 20px 22px !important;
  }
  #${ROOT_ID} .mb-hy__body {
    padding:24px 20px 28px !important;
  }
  #${ROOT_ID} .mb-hy__panel,
  #${ROOT_ID} .mb-hy__result {
    padding:18px !important;
  }
  #${ROOT_ID} .mb-hy__grid,
  #${ROOT_ID} .mb-hy__metrics {
    grid-template-columns:1fr !important;
  }
  #${ROOT_ID} .mb-hy__actions {
    flex-direction:column !important;
    align-items:stretch !important;
  }
  #${ROOT_ID} .mb-hy__button {
    width:100% !important;
  }
}
@media (max-width:480px) {
  #${ROOT_ID} .mb-hy__tabs {
    flex-direction:column !important;
  }
  #${ROOT_ID} .mb-hy__tab {
    flex:1 1 auto !important;
    width:100% !important;
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
  #${ROOT_ID} .mb-hy {
    border:1px solid #bbb !important;
    box-shadow:none !important;
  }
  #${ROOT_ID} .mb-hy__tabs,
  #${ROOT_ID} .mb-hy__actions,
  #${ROOT_ID} .mb-hy__privacy {
    display:none !important;
  }
  #${ROOT_ID} .mb-hy__panel[hidden],
  #${ROOT_ID} .mb-hy__result[hidden] {
    display:block !important;
  }
}
`;
    document.head.appendChild(style);
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    if (root.getAttribute('data-mb-version') === VERSION) return;

    root.setAttribute('data-mb-version', VERSION);
    root.setAttribute('lang', T.locale.slice(0, 2));
    addStyles();

    root.innerHTML =
      '<section class="mb-hy" role="region" aria-label="' + T.region_label + '">' +
        '<div class="mb-hy__head">' +
          '<h2 class="mb-hy__title" id="mb-hy-title">' + T.title + '</h2>' +
          '<p class="mb-hy__lead">' + T.lead + '</p>' +
        '</div>' +
        '<div class="mb-hy__body">' +
          '<p class="mb-hy__notice">' + T.notice + '</p>' +
          '<div class="mb-hy__tabs" role="tablist" aria-label="' + T.tabs_label + '">' +
            '<button type="button" class="mb-hy__tab" id="mb-hy-tab-daily" role="tab" aria-controls="mb-hy-panel-daily" aria-selected="true" tabindex="0" data-mode="daily">' + T.tab_daily + '</button>' +
            '<button type="button" class="mb-hy__tab" id="mb-hy-tab-sweat" role="tab" aria-controls="mb-hy-panel-sweat" aria-selected="false" tabindex="-1" data-mode="sweat">' + T.tab_sweat + '</button>' +
          '</div>' +
          '<div class="mb-hy__panel" id="mb-hy-panel-daily" role="tabpanel" aria-labelledby="mb-hy-tab-daily">' +
            '<h3 class="mb-hy__panel-title">' + T.daily_title + '</h3>' +
            '<p class="mb-hy__panel-intro">' + T.daily_intro + '</p>' +
            '<form id="mb-hy-daily-form" novalidate>' +
              '<div class="mb-hy__grid">' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-weight">' + T.weight + '</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-weight" type="text" inputmode="decimal" autocomplete="off" value="70" aria-describedby="mb-hy-weight-hint"><span class="mb-hy__unit">kg</span></div><span class="mb-hy__hint" id="mb-hy-weight-hint">' + T.weight_hint + '</span></div>' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-age">' + T.age + '</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-age" type="text" inputmode="numeric" autocomplete="off" value="35" aria-describedby="mb-hy-age-hint"><span class="mb-hy__unit">' + T.age_unit + '</span></div><span class="mb-hy__hint" id="mb-hy-age-hint">' + T.age_hint + '</span></div>' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-sex">' + T.reference_group + '</label><select class="mb-hy__select" id="mb-hy-sex" aria-describedby="mb-hy-sex-hint"><option value="female">' + T.female + '</option><option value="male">' + T.male + '</option></select><span class="mb-hy__hint" id="mb-hy-sex-hint">' + T.reference_hint + '</span></div>' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-glass">' + T.glass + '</label><select class="mb-hy__select" id="mb-hy-glass" aria-describedby="mb-hy-glass-hint"><option value="200">200 ml</option><option value="250" selected>250 ml</option><option value="300">300 ml</option></select><span class="mb-hy__hint" id="mb-hy-glass-hint">' + T.glass_hint + '</span></div>' +
              '</div>' +
              '<div class="mb-hy__actions"><button class="mb-hy__button mb-hy__button--primary" type="submit">' + T.calculate_daily + '</button><button class="mb-hy__button mb-hy__button--secondary" type="button" id="mb-hy-daily-reset">' + T.reset + '</button></div>' +
              '<div class="mb-hy__error" id="mb-hy-daily-error" role="alert" aria-live="assertive"></div>' +
            '</form>' +
            '<div class="mb-hy__result" id="mb-hy-daily-result" hidden aria-live="polite"></div>' +
          '</div>' +
          '<div class="mb-hy__panel" id="mb-hy-panel-sweat" role="tabpanel" aria-labelledby="mb-hy-tab-sweat" hidden>' +
            '<h3 class="mb-hy__panel-title">' + T.sweat_title + '</h3>' +
            '<p class="mb-hy__panel-intro">' + T.sweat_intro + '</p>' +
            '<form id="mb-hy-sweat-form" novalidate>' +
              '<div class="mb-hy__grid">' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-pre">' + T.pre_weight + '</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-pre" type="text" inputmode="decimal" autocomplete="off" value="75"><span class="mb-hy__unit">kg</span></div></div>' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-post">' + T.post_weight + '</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-post" type="text" inputmode="decimal" autocomplete="off" value="74,4"><span class="mb-hy__unit">kg</span></div></div>' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-duration">' + T.duration + '</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-duration" type="text" inputmode="numeric" autocomplete="off" value="60"><span class="mb-hy__unit">' + T.duration_unit + '</span></div></div>' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-drink">' + T.drink + '</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-drink" type="text" inputmode="decimal" autocomplete="off" value="500"><span class="mb-hy__unit">ml</span></div></div>' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-urine">' + T.urine + '</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-urine" type="text" inputmode="decimal" autocomplete="off" value="0" aria-describedby="mb-hy-urine-hint"><span class="mb-hy__unit">ml</span></div><span class="mb-hy__hint" id="mb-hy-urine-hint">' + T.urine_hint + '</span></div>' +
                '<div class="mb-hy__field"><label class="mb-hy__label" for="mb-hy-sodium-mode">' + T.sodium_mode + '</label><select class="mb-hy__select" id="mb-hy-sodium-mode" aria-describedby="mb-hy-sodium-hint"><option value="unknown">' + T.sodium_unknown + '</option><option value="mg">' + T.sodium_mg + '</option><option value="mmol">' + T.sodium_mmol + '</option></select><span class="mb-hy__hint" id="mb-hy-sodium-hint">' + T.sodium_hint + '</span></div>' +
                '<div class="mb-hy__field mb-hy__custom" id="mb-hy-sodium-custom" hidden><label class="mb-hy__label" for="mb-hy-sodium-value">' + T.sodium_value + '</label><div class="mb-hy__input-wrap"><input class="mb-hy__input" id="mb-hy-sodium-value" type="text" inputmode="decimal" autocomplete="off" value="900"><span class="mb-hy__unit" id="mb-hy-sodium-unit">mg/l</span></div></div>' +
              '</div>' +
              '<div class="mb-hy__actions"><button class="mb-hy__button mb-hy__button--primary" type="submit">' + T.calculate_sweat + '</button><button class="mb-hy__button mb-hy__button--secondary" type="button" id="mb-hy-sweat-reset">' + T.reset + '</button></div>' +
              '<div class="mb-hy__error" id="mb-hy-sweat-error" role="alert" aria-live="assertive"></div>' +
            '</form>' +
            '<div class="mb-hy__result" id="mb-hy-sweat-result" hidden aria-live="polite"></div>' +
          '</div>' +
          '<p class="mb-hy__privacy">' + T.privacy + '</p>' +
        '</div>' +
      '</section>';

    var tabs = Array.prototype.slice.call(root.querySelectorAll('.mb-hy__tab'));
    var dailyPanel = root.querySelector('#mb-hy-panel-daily');
    var sweatPanel = root.querySelector('#mb-hy-panel-sweat');

    function setTab(mode, moveFocus) {
      var daily = mode === 'daily';
      tabs.forEach(function (tab) {
        var active = tab.getAttribute('data-mode') === mode;
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.setAttribute('tabindex', active ? '0' : '-1');
        if (active && moveFocus) tab.focus();
      });
      dailyPanel.hidden = !daily;
      sweatPanel.hidden = daily;
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { setTab(tab.getAttribute('data-mode'), false); });
      tab.addEventListener('keydown', function (event) {
        var nextIndex = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = tabs.length - 1;
        else return;
        event.preventDefault();
        setTab(tabs[nextIndex].getAttribute('data-mode'), true);
      });
    });

    function showError(el, message) {
      el.textContent = message;
      el.classList.add('is-visible');
    }

    function clearError(el) {
      el.textContent = '';
      el.classList.remove('is-visible');
    }

    var dailyForm = root.querySelector('#mb-hy-daily-form');
    var dailyError = root.querySelector('#mb-hy-daily-error');
    var dailyResult = root.querySelector('#mb-hy-daily-result');

    dailyForm.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError(dailyError);

      var weight = parseNumber(root.querySelector('#mb-hy-weight').value);
      var age = parseNumber(root.querySelector('#mb-hy-age').value);
      var sex = root.querySelector('#mb-hy-sex').value;
      var glass = parseNumber(root.querySelector('#mb-hy-glass').value);

      if (!Number.isFinite(weight) || weight < 30 || weight > 250) return showError(dailyError, T.errors.weight);
      if (!Number.isFinite(age) || age < 18 || age > 100) return showError(dailyError, T.errors.age);

      var lowMlKg = age >= 60 ? 25 : 30;
      var highMlKg = age >= 60 ? 30 : 35;
      var lowMl = weight * lowMlKg;
      var highMl = weight * highMlKg;
      var efsaMl = sex === 'female' ? 2000 : 2500;
      var lowGlasses = lowMl / glass;
      var highGlasses = highMl / glass;
      var warning = weight >= 120 ? '<div class="mb-hy__warning">' + T.high_weight_warning + '</div>' : '';

      dailyResult.innerHTML =
        '<div class="mb-hy__result-top"><div><p class="mb-hy__result-label">' + T.daily_result_label + '</p><p class="mb-hy__score">' + formatNumber(lowMl / 1000, 1) + '–' + formatNumber(highMl / 1000, 1) + ' l</p></div><span class="mb-hy__badge">' + lowMlKg + '–' + highMlKg + ' ml/kg</span></div>' +
        '<p class="mb-hy__summary">' + T.daily_summary + '</p>' +
        '<div class="mb-hy__metrics">' +
          '<div class="mb-hy__metric"><p class="mb-hy__metric-label">' + T.glasses_label + '</p><p class="mb-hy__metric-value">' + formatNumber(lowGlasses, 0) + '–' + formatNumber(highGlasses, 0) + ' × ' + formatNumber(glass, 0) + ' ml</p></div>' +
          '<div class="mb-hy__metric"><p class="mb-hy__metric-label">' + T.efsa_label + '</p><p class="mb-hy__metric-value">' + formatNumber(efsaMl / 1000, 1) + ' l/' + (T.locale === 'sk-SK' ? 'deň' : 'den') + '</p></div>' +
          '<div class="mb-hy__metric"><p class="mb-hy__metric-label">' + T.sport_label + '</p><p class="mb-hy__metric-value">' + T.sport_value + '</p></div>' +
        '</div>' +
        '<div class="mb-hy__warning">' + T.efsa_warning + '</div>' + warning;
      dailyResult.hidden = false;
    });

    root.querySelector('#mb-hy-daily-reset').addEventListener('click', function () {
      dailyForm.reset();
      root.querySelector('#mb-hy-weight').value = '';
      root.querySelector('#mb-hy-age').value = '';
      dailyResult.hidden = true;
      dailyResult.innerHTML = '';
      clearError(dailyError);
      root.querySelector('#mb-hy-weight').focus();
    });

    var sodiumMode = root.querySelector('#mb-hy-sodium-mode');
    var sodiumCustom = root.querySelector('#mb-hy-sodium-custom');
    var sodiumUnit = root.querySelector('#mb-hy-sodium-unit');

    function updateSodiumField() {
      var mode = sodiumMode.value;
      sodiumCustom.hidden = mode === 'unknown';
      sodiumUnit.textContent = mode === 'mmol' ? 'mmol/l' : 'mg/l';
    }
    sodiumMode.addEventListener('change', updateSodiumField);
    updateSodiumField();

    var sweatForm = root.querySelector('#mb-hy-sweat-form');
    var sweatError = root.querySelector('#mb-hy-sweat-error');
    var sweatResult = root.querySelector('#mb-hy-sweat-result');

    sweatForm.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError(sweatError);

      var pre = parseNumber(root.querySelector('#mb-hy-pre').value);
      var post = parseNumber(root.querySelector('#mb-hy-post').value);
      var duration = parseNumber(root.querySelector('#mb-hy-duration').value);
      var drinkMl = parseNumber(root.querySelector('#mb-hy-drink').value);
      var urineMl = parseNumber(root.querySelector('#mb-hy-urine').value);
      var mode = sodiumMode.value;
      var sodiumValue = parseNumber(root.querySelector('#mb-hy-sodium-value').value);

      if (!Number.isFinite(pre) || pre < 30 || pre > 250) return showError(sweatError, T.errors.pre);
      if (!Number.isFinite(post) || post < 30 || post > 250) return showError(sweatError, T.errors.post);
      if (!Number.isFinite(duration) || duration < 15 || duration > 720) return showError(sweatError, T.errors.duration);
      if (!Number.isFinite(drinkMl) || drinkMl < 0 || drinkMl > 10000) return showError(sweatError, T.errors.drink);
      if (!Number.isFinite(urineMl) || urineMl < 0 || urineMl > 5000) return showError(sweatError, T.errors.urine);
      if (mode !== 'unknown' && (!Number.isFinite(sodiumValue) || sodiumValue <= 0)) return showError(sweatError, T.errors.sodium);

      var hours = duration / 60;
      var sweatLossL = (pre - post) + (drinkMl / 1000) - (urineMl / 1000);
      if (sweatLossL <= 0) return showError(sweatError, T.errors.loss);

      var sweatRate = sweatLossL / hours;
      var massChangePct = ((post - pre) / pre) * 100;
      var rateLabel = sweatRate < 0.5 ? T.rate_low : sweatRate < 1.0 ? T.rate_medium : sweatRate < 1.5 ? T.rate_high : T.rate_very_high;
      var sodiumHtml;

      if (mode === 'unknown') {
        var sodiumLowMg = sweatLossL * 20 * 22.99;
        var sodiumHighMg = sweatLossL * 80 * 22.99;
        sodiumHtml = '<div class="mb-hy__metric"><p class="mb-hy__metric-label">' + T.model_sodium + '</p><p class="mb-hy__metric-value">' + formatNumber(sodiumLowMg, 0) + '–' + formatNumber(sodiumHighMg, 0) + ' mg</p></div>';
      } else {
        var sodiumMgL = mode === 'mmol' ? sodiumValue * 22.99 : sodiumValue;
        var sodiumLossMg = sweatLossL * sodiumMgL;
        sodiumHtml = '<div class="mb-hy__metric"><p class="mb-hy__metric-label">' + T.estimated_sodium + '</p><p class="mb-hy__metric-value">' + formatNumber(sodiumLossMg, 0) + ' mg</p></div>';
      }

      var massWarning = '';
      if (massChangePct > 0.2) massWarning = '<div class="mb-hy__warning">' + T.overdrink_warning + '</div>';
      else if (massChangePct <= -2) massWarning = '<div class="mb-hy__warning">' + T.dehydration_warning + '</div>';

      sweatResult.innerHTML =
        '<div class="mb-hy__result-top"><div><p class="mb-hy__result-label">' + T.sweat_result_label + '</p><p class="mb-hy__score">' + formatNumber(sweatLossL, 2) + ' l</p></div><span class="mb-hy__badge">' + rateLabel + '</span></div>' +
        '<p class="mb-hy__summary">' + T.sweat_summary + '</p>' +
        '<div class="mb-hy__metrics">' +
          '<div class="mb-hy__metric"><p class="mb-hy__metric-label">' + T.sweat_rate + '</p><p class="mb-hy__metric-value">' + formatNumber(sweatRate, 2) + ' l/h</p></div>' +
          '<div class="mb-hy__metric"><p class="mb-hy__metric-label">' + T.mass_change + '</p><p class="mb-hy__metric-value">' + formatNumber(massChangePct, 1) + ' %</p></div>' +
          sodiumHtml +
        '</div>' +
        '<div class="mb-hy__warning">' + T.sodium_warning + '</div>' + massWarning;
      sweatResult.hidden = false;
    });

    root.querySelector('#mb-hy-sweat-reset').addEventListener('click', function () {
      sweatForm.reset();
      ['#mb-hy-pre', '#mb-hy-post', '#mb-hy-duration', '#mb-hy-drink', '#mb-hy-urine', '#mb-hy-sodium-value'].forEach(function (selector) {
        root.querySelector(selector).value = '';
      });
      sodiumMode.value = 'unknown';
      updateSodiumField();
      sweatResult.hidden = true;
      sweatResult.innerHTML = '';
      clearError(sweatError);
      root.querySelector('#mb-hy-pre').focus();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render, { once:true });
  } else {
    render();
  }
})();
