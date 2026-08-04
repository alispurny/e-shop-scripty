/**
 * MyBears — sjednocená grafická verze 2.0 (CZ)
 * Vizuální systém vychází z MyBears Product Guide v1.8.
 * Funkční logika původního nástroje zůstává zachována.
 */
(function () {
  'use strict';

  var MYBEARS_UNIFIED_DESIGN_CSS = String.raw`
/* MyBears unified design layer — based on Product Guide v1.8 */
#mb-protein-intake-calculator {
  --mb-green:#2dc26b !important;
  --mb-green-dark:#198d4b !important;
  --mb-green-soft:#f4f8f4 !important;
  --mb-border:#e5e3dc !important;
  --mb-text:#20221f !important;
  --mb-muted:#626760 !important;
  --mb-cream:#faf7ef;
  --mb-cream-2:#f7f3ea;
  --mb-gold:#DBC442;
  --mb-danger:#a63a36 !important;
  width:100%; max-width:1120px; margin:24px auto 40px !important;
  color:var(--mb-text); font-family:Arial,Helvetica,sans-serif; line-height:1.55;
}
#mb-protein-intake-calculator *, #mb-protein-intake-calculator *::before, #mb-protein-intake-calculator *::after { box-sizing:border-box; }
#mb-protein-intake-calculator .mb-pi { position:relative; overflow:hidden; border:1px solid var(--mb-border) !important; border-radius:18px !important; background:#fff !important; box-shadow:0 12px 32px rgba(27,35,29,.07) !important; }
#mb-protein-intake-calculator .mb-pi::before { content:""; position:absolute; z-index:3; top:0; left:0; right:0; height:4px; background:var(--mb-gold); }
#mb-protein-intake-calculator .mb-pi__head { padding:34px 38px 26px !important; background:var(--mb-cream) !important; border-bottom:1px solid var(--mb-border) !important; }
#mb-protein-intake-calculator .mb-pi__body { padding:30px 38px 36px !important; }
#mb-protein-intake-calculator .mb-pi__title, #mb-protein-intake-calculator .mb-pi__section-title, #mb-protein-intake-calculator .mb-pi__panel-title, #mb-protein-intake-calculator .mb-pi__subhead { color:var(--mb-green) !important; font-weight:700 !important; letter-spacing:-.01em; }
#mb-protein-intake-calculator .mb-pi__title { margin:0 0 10px !important; font-size:clamp(25px,3.2vw,30px) !important; line-height:1.16 !important; }
#mb-protein-intake-calculator .mb-pi__lead { max-width:820px; margin:0 !important; color:#454a45 !important; font-size:16px !important; line-height:1.58 !important; }
#mb-protein-intake-calculator .mb-pi__notice { margin:0 0 22px !important; padding:15px 17px !important; border:1px solid #eadfc8 !important; border-left:4px solid var(--mb-gold) !important; border-radius:12px !important; background:var(--mb-cream) !important; color:#4f4b43 !important; font-size:14px !important; line-height:1.55 !important; }
#mb-protein-intake-calculator .mb-pi__notice strong { color:#292b28; }
#mb-protein-intake-calculator .mb-pi__grid { gap:18px !important; }
#mb-protein-intake-calculator .mb-pi__field { min-width:0; }
#mb-protein-intake-calculator .mb-pi__label { margin-bottom:7px !important; color:#292b28 !important; font-size:15px !important; font-weight:700 !important; }
#mb-protein-intake-calculator .mb-pi__input, #mb-protein-intake-calculator .mb-pi__select { min-height:48px !important; border:1px solid #d4d6d1 !important; border-radius:8px !important; background:#fff !important; color:var(--mb-text) !important; box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }
#mb-protein-intake-calculator .mb-pi__input:hover, #mb-protein-intake-calculator .mb-pi__select:hover { border-color:#aeb8b0 !important; }
#mb-protein-intake-calculator .mb-pi__input:focus, #mb-protein-intake-calculator .mb-pi__select:focus { outline:3px solid rgba(219,196,66,.30) !important; outline-offset:1px; border-color:var(--mb-green-dark) !important; }
#mb-protein-intake-calculator .mb-pi__hint, #mb-protein-intake-calculator .mb-pi__privacy, #mb-protein-intake-calculator .mb-pi__formula, #mb-protein-intake-calculator .mb-pi__disclaimer { color:var(--mb-muted) !important; }
#mb-protein-intake-calculator .mb-pi__actions { gap:12px !important; margin-top:24px !important; }
#mb-protein-intake-calculator .mb-pi__button { display:inline-flex; align-items:center; justify-content:center; min-height:48px !important; padding:12px 24px !important; border:2px solid transparent !important; border-radius:8px !important; font-weight:700 !important; line-height:1.15; transition:background .15s ease,border-color .15s ease,transform .15s ease; }
#mb-protein-intake-calculator .mb-pi__button:hover { transform:translateY(-1px); }
#mb-protein-intake-calculator .mb-pi__button:focus-visible, #mb-protein-intake-calculator a:focus-visible, #mb-protein-intake-calculator summary:focus-visible { outline:3px solid rgba(219,196,66,.38) !important; outline-offset:2px !important; }
#mb-protein-intake-calculator .mb-pi__button--primary { min-width:210px; color:#fff !important; background:var(--mb-green) !important; border-color:var(--mb-green) !important; box-shadow:none !important; }
#mb-protein-intake-calculator .mb-pi__button--primary:hover { background:var(--mb-green-dark) !important; border-color:var(--mb-green-dark) !important; }
#mb-protein-intake-calculator .mb-pi__button--secondary { color:var(--mb-green-dark) !important; background:#fff !important; border-color:var(--mb-green) !important; }
#mb-protein-intake-calculator .mb-pi__advanced, #mb-protein-intake-calculator .mb-pi__panel, #mb-protein-intake-calculator .mb-pi__mode, #mb-protein-intake-calculator .mb-pi__tabs { border-color:var(--mb-border) !important; border-radius:12px !important; background:var(--mb-cream) !important; }
#mb-protein-intake-calculator .mb-pi__tab, #mb-protein-intake-calculator .mb-pi__mode-btn { border-radius:8px !important; color:var(--mb-green-dark) !important; }
#mb-protein-intake-calculator .mb-pi__tab[aria-selected="true"], #mb-protein-intake-calculator .mb-pi__mode-btn[aria-pressed="true"], #mb-protein-intake-calculator .mb-pi__tab.is-active, #mb-protein-intake-calculator .mb-pi__mode-btn.is-active { background:var(--mb-green) !important; color:#fff !important; border-color:var(--mb-green) !important; }
#mb-protein-intake-calculator .mb-pi__result { margin-top:28px !important; padding:24px !important; border:1px solid #cfe4d5 !important; border-radius:16px !important; background:var(--mb-green-soft) !important; }
#mb-protein-intake-calculator .mb-pi__score { color:#20221f !important; font-weight:800 !important; letter-spacing:-.035em; }
#mb-protein-intake-calculator .mb-pi__badge { border:1px solid #d7ceb8 !important; background:#fff8df !important; color:#75633d !important; font-weight:700 !important; }
#mb-protein-intake-calculator .mb-pi__summary { color:#454a45 !important; }
#mb-protein-intake-calculator .mb-pi__metric, #mb-protein-intake-calculator .mb-pi__card, #mb-protein-intake-calculator .mb-pi__macro, #mb-protein-intake-calculator .mb-pi__meal { border:1px solid var(--mb-border) !important; border-radius:12px !important; background:#fff !important; box-shadow:none !important; }
#mb-protein-intake-calculator .mb-pi__metric-label, #mb-protein-intake-calculator .mb-pi__card-label, #mb-protein-intake-calculator .mb-pi__result-label { color:var(--mb-muted) !important; }
#mb-protein-intake-calculator .mb-pi__metric-value, #mb-protein-intake-calculator .mb-pi__card-value, #mb-protein-intake-calculator .mb-pi__macro-value { color:var(--mb-green-dark) !important; }
#mb-protein-intake-calculator .mb-pi__warning, #mb-protein-intake-calculator .mb-pi__inline-warning { border-left:4px solid var(--mb-gold) !important; border-radius:8px !important; background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important; color:#5d4b1d !important; }
#mb-protein-intake-calculator .mb-pi__error { border-color:#e3b3af !important; border-radius:10px !important; background:#fff5f4 !important; color:var(--mb-danger) !important; }
#mb-protein-intake-calculator .mb-pi__scale { box-shadow:inset 0 0 0 1px rgba(32,34,31,.10); }
#mb-protein-intake-calculator .mb-pi__marker { background:#20231f !important; box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(32,35,31,.18) !important; }
#mb-protein-intake-calculator .mb-pi__table-wrap { overflow-x:auto; border:1px solid var(--mb-border) !important; border-radius:12px !important; }
#mb-protein-intake-calculator .mb-pi__table { width:100%; border-collapse:collapse; background:#fff; }
#mb-protein-intake-calculator .mb-pi__table thead th { border-bottom:2px solid var(--mb-gold) !important; background:#20231f !important; color:#fff !important; }
#mb-protein-intake-calculator .mb-pi__table tbody tr:nth-child(even) { background:var(--mb-green-soft) !important; }
@media(max-width:760px) {
  #mb-protein-intake-calculator { margin:18px auto 30px !important; }
  #mb-protein-intake-calculator .mb-pi__head { padding:28px 20px 22px !important; }
  #mb-protein-intake-calculator .mb-pi__body { padding:24px 20px 28px !important; }
  #mb-protein-intake-calculator .mb-pi__result { padding:20px !important; }
  #mb-protein-intake-calculator .mb-pi__actions { flex-direction:column; align-items:stretch; }
  #mb-protein-intake-calculator .mb-pi__button { width:100%; }
}
@media(prefers-reduced-motion:reduce) {
  #mb-protein-intake-calculator *, #mb-protein-intake-calculator *::before, #mb-protein-intake-calculator *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
`;


  var T = {"locale":"cs-CZ","version":"2.0.0-cz","root":"mb-protein-intake-calculator","style":"mb-protein-intake-calculator-styles","title":"Kalkulačka příjmu bílkovin","lead":"Odhadněte orientační denní rozmezí bílkovin podle hmotnosti, věku, pohybové aktivity a cíle.","notice":"<strong>Důležité:</strong> Výsledek je pracovní rozmezí pro zdravé dospělé. Není určen pro děti, těhotenství, onemocnění ledvin ani klinickou výživu.","weight":"Tělesná hmotnost","weight_hint":"Výpočet používá aktuální hmotnost. Při výrazně vyšším podílu tělesného tuku může být vhodná individuální výpočetní hmotnost od odborníka.","height":"Výška (volitelně)","height_hint":"Slouží pouze k orientačnímu upozornění při vyšším BMI; nemění samotný výpočet.","age":"Věk","activity":"Pohybová aktivita","goal":"Hlavní cíl","meals":"Počet hlavních jídel za den","activity_options":[["low","Nízká – bez pravidelného sportu"],["endurance","Vytrvalostní sport"],["mixed","Kombinovaný sport a pravidelný pohyb"],["strength","Silový trénink"]],"goal_options":[["maintain","Běžný příjem a udržení"],["muscle","Budování nebo udržení svalů"],["reduction","Redukce hmotnosti se zachováním svalů"]],"calculate":"Vypočítat příjem","reset":"Vymazat údaje","result_label":"Orientační denní příjem bílkovin","badge":"Pracovní rozmezí","summary_prefix":"Pro zvolený profil kalkulačka používá rozmezí","scale_title":"Použité rozmezí v gramech na kilogram hmotnosti","midpoint":"Střed rozpětí","per_meal":"Při rovnoměrném rozdělení na jedno jídlo","energy":"Energie ze středu rozpětí","profile":"Použitý profil","formula":"Výpočet","privacy":"Výpočet probíhá pouze ve vašem prohlížeči. Zadané údaje se tímto skriptem nikam neodesílají ani neukládají.","errors":{"weight":"Zadejte tělesnou hmotnost v rozmezí 30–250 kg.","height":"Výšku ponechte prázdnou nebo zadejte hodnotu 120–230 cm.","age":"Zadejte věk v rozmezí 18–100 let.","generic":"Výpočet se nepodařilo dokončit. Zkontrolujte zadané údaje."},"profiles":{"general":"běžný režim","older":"věk 65+","endurance":"vytrvalostní sport","mixed":"kombinovaný sport","strength":"silový trénink","muscle":"cíl budování svalů","reduction":"redukční režim"},"warnings":{"base":"Jde o orientační rozpětí, nikoliv o povinný cíl. Důležitá je také kvalita jídelníčku, celkový energetický příjem a dlouhodobý vývoj.","older":" Ve vyšším věku je vhodné posuzovat příjem společně se zdravotním stavem, chutí k jídlu a pohybem, zejména silovým tréninkem.","muscle_low":" Samotné zvýšení bílkovin bez odpovídajícího silového podnětu nezaručuje růst svalové hmoty.","reduction":" Při redukci pomáhá chránit svalovou hmotu také přiměřený energetický deficit a silový trénink.","bmi":" Při BMI 30 a více může výpočet z aktuální hmotnosti příjem nadhodnotit; individuální výpočetní hmotnost stanovuje odborník.","medical":" Při onemocnění ledvin, nařízeném omezení bílkovin, poruše příjmu potravy, těhotenství nebo závažném onemocnění postupujte podle doporučení zdravotníka."}};
  var ROOT_ID = T.root;
  var STYLE_ID = T.style;
  var VERSION = T.version;

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    var clean = value.trim();
    if (clean === '') return NaN;
    return Number(clean.replace(',', '.'));
  }

  function format(value, decimals) {
    return new Intl.NumberFormat(T.locale, { minimumFractionDigits:decimals, maximumFractionDigits:decimals }).format(value);
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function optionHtml(items) {
    return items.map(function (item) { return '<option value="' + item[0] + '">' + item[1] + '</option>'; }).join('');
  }

  function getRange(age, activity, goal) {
    var low, high, profile;
    if (activity === 'endurance') { low = 1.2; high = 1.6; profile = T.profiles.endurance; }
    else if (activity === 'mixed') { low = 1.4; high = 1.8; profile = T.profiles.mixed; }
    else if (activity === 'strength') { low = 1.6; high = 2.0; profile = T.profiles.strength; }
    else { low = 0.83; high = 1.0; profile = T.profiles.general; }

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
      if (activity === 'low' && goal === 'maintain') { low = 1.0; high = 1.2; }
      else { low = Math.max(low, 1.2); high = Math.max(high, 1.6); }
    }
    return { low:low, high:high, profile:profile };
  }

  function addStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = "\n#mb-protein-intake-calculator { --mb-green:#2dc26b; --mb-green-dark:#168947; --mb-green-soft:#f7fbf8; --mb-border:#d9e5dd; --mb-text:#1f2933; --mb-muted:#59636e; --mb-danger:#b42318; --mb-warning:#9a6700; --mb-warning-bg:#fff8e1; --mb-blue:#2674a8; font-family:Arial,Helvetica,sans-serif; color:var(--mb-text); margin:24px 0; }\n#mb-protein-intake-calculator * { box-sizing:border-box; }\n#mb-protein-intake-calculator .mb-pi { border:1px solid var(--mb-border); border-radius:14px; background:#fff; box-shadow:0 8px 28px rgba(31,41,51,.08); overflow:hidden; }\n#mb-protein-intake-calculator .mb-pi__head { padding:22px 22px 16px; background:var(--mb-green-soft); border-bottom:1px solid var(--mb-border); }\n#mb-protein-intake-calculator .mb-pi__title { margin:0 0 8px; font-size:22px; line-height:1.25; }\n#mb-protein-intake-calculator .mb-pi__lead { margin:0; color:var(--mb-muted); font-size:16px; line-height:1.55; }\n#mb-protein-intake-calculator .mb-pi__body { padding:22px; }\n#mb-protein-intake-calculator .mb-pi__notice { margin:0 0 18px; padding:12px 14px; border-left:4px solid var(--mb-green); border-radius:6px; background:#f8faf9; color:var(--mb-muted); font-size:14px; line-height:1.5; }\n#mb-protein-intake-calculator .mb-pi__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }\n#mb-protein-intake-calculator .mb-pi__field { min-width:0; }\n#mb-protein-intake-calculator .mb-pi__label { display:block; margin:0 0 7px; font-size:15px; font-weight:700; }\n#mb-protein-intake-calculator .mb-pi__input-wrap { position:relative; }\n#mb-protein-intake-calculator .mb-pi__input, #mb-protein-intake-calculator .mb-pi__select { width:100%; min-height:48px; padding:11px 12px; border:1px solid #b9c6be; border-radius:8px; background:#fff; color:var(--mb-text); font:inherit; font-size:16px; }\n#mb-protein-intake-calculator .mb-pi__input { padding-right:70px; }\n#mb-protein-intake-calculator .mb-pi__input:focus, #mb-protein-intake-calculator .mb-pi__select:focus { outline:3px solid rgba(45,194,107,.2); border-color:var(--mb-green-dark); }\n#mb-protein-intake-calculator .mb-pi__unit { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--mb-muted); font-size:14px; pointer-events:none; }\n#mb-protein-intake-calculator .mb-pi__hint { display:block; margin-top:6px; color:var(--mb-muted); font-size:13px; line-height:1.4; }\n#mb-protein-intake-calculator .mb-pi__actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }\n#mb-protein-intake-calculator .mb-pi__button { min-height:46px; padding:11px 20px; border-radius:8px; border:1px solid transparent; font:inherit; font-size:16px; font-weight:700; cursor:pointer; }\n#mb-protein-intake-calculator .mb-pi__button:focus-visible { outline:3px solid rgba(45,194,107,.28); outline-offset:2px; }\n#mb-protein-intake-calculator .mb-pi__button--primary { background:var(--mb-green); color:#0c2818; border-color:var(--mb-green); box-shadow:0 4px 12px rgba(45,194,107,.22); }\n#mb-protein-intake-calculator .mb-pi__button--secondary { background:#fff; color:var(--mb-text); border-color:#b9c6be; }\n#mb-protein-intake-calculator .mb-pi__error { display:none; margin:16px 0 0; padding:12px 14px; border:1px solid #f1b5b0; border-radius:8px; background:#fff6f5; color:var(--mb-danger); font-size:14px; line-height:1.45; }\n#mb-protein-intake-calculator .mb-pi__error.is-visible { display:block; }\n#mb-protein-intake-calculator .mb-pi__result { margin-top:22px; padding:20px; border:1px solid #b8e7ca; border-radius:12px; background:var(--mb-green-soft); }\n#mb-protein-intake-calculator .mb-pi__result[hidden] { display:none; }\n#mb-protein-intake-calculator .mb-pi__result-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }\n#mb-protein-intake-calculator .mb-pi__result-label { margin:0 0 5px; color:var(--mb-muted); font-size:14px; font-weight:700; }\n#mb-protein-intake-calculator .mb-pi__score { margin:0; font-size:38px; line-height:1.08; font-weight:800; letter-spacing:-.03em; }\n#mb-protein-intake-calculator .mb-pi__score-unit { font-size:17px; font-weight:700; letter-spacing:0; }\n#mb-protein-intake-calculator .mb-pi__badge { display:inline-flex; min-height:34px; align-items:center; padding:6px 11px; border:1px solid #b9c6be; border-radius:999px; background:#fff; font-size:14px; font-weight:700; }\n#mb-protein-intake-calculator .mb-pi__summary { margin:14px 0 0; font-size:15px; line-height:1.55; }\n#mb-protein-intake-calculator .mb-pi__scale-wrap { margin-top:18px; }\n#mb-protein-intake-calculator .mb-pi__scale-title { margin:0 0 8px; font-size:14px; font-weight:700; }\n#mb-protein-intake-calculator .mb-pi__scale { position:relative; height:18px; border-radius:999px; background:linear-gradient(90deg,#9fc8e6 0%,#79cc99 34%,#f3cf69 68%,#ee9a76 100%); overflow:visible; }\n#mb-protein-intake-calculator .mb-pi__range { position:absolute; top:-3px; height:24px; border:3px solid #173f2b; border-radius:999px; background:rgba(255,255,255,.28); box-shadow:0 0 0 2px #fff; }\n#mb-protein-intake-calculator .mb-pi__marker { position:absolute; top:-7px; width:4px; height:32px; border-radius:4px; background:#20313d; transform:translateX(-50%); box-shadow:0 0 0 2px #fff; }\n#mb-protein-intake-calculator .mb-pi__scale-labels { display:flex; justify-content:space-between; margin-top:8px; color:#3d4a54; font-size:12px; }\n#mb-protein-intake-calculator .mb-pi__metrics { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin-top:18px; }\n#mb-protein-intake-calculator .mb-pi__metric { padding:14px; border:1px solid var(--mb-border); border-radius:9px; background:#fff; }\n#mb-protein-intake-calculator .mb-pi__metric-label { margin:0 0 7px; color:var(--mb-muted); font-size:13px; font-weight:700; }\n#mb-protein-intake-calculator .mb-pi__metric-value { margin:0; font-size:18px; line-height:1.25; font-weight:800; }\n#mb-protein-intake-calculator .mb-pi__formula { margin:16px 0 0; padding:12px 14px; border:1px solid var(--mb-border); border-radius:8px; background:#fff; color:#44515b; font-size:14px; line-height:1.5; }\n#mb-protein-intake-calculator .mb-pi__warning { margin:16px 0 0; padding:12px 14px; border:1px solid #f0d27a; border-radius:8px; background:var(--mb-warning-bg); color:#6f4e00; font-size:14px; line-height:1.5; }\n#mb-protein-intake-calculator .mb-pi__privacy { margin:16px 0 0; color:var(--mb-muted); font-size:12px; line-height:1.45; }\n@media (max-width:900px) { #mb-protein-intake-calculator .mb-pi__metrics { grid-template-columns:repeat(2,minmax(0,1fr)); } }\n@media (max-width:760px) { #mb-protein-intake-calculator .mb-pi__grid, #mb-protein-intake-calculator .mb-pi__metrics { grid-template-columns:1fr; } #mb-protein-intake-calculator .mb-pi__body, #mb-protein-intake-calculator .mb-pi__head { padding-left:16px; padding-right:16px; } #mb-protein-intake-calculator .mb-pi__score { font-size:32px; } }\n@media (prefers-reduced-motion:reduce) { #mb-protein-intake-calculator * { scroll-behavior:auto !important; transition:none !important; } }\n";
    style.textContent += MYBEARS_UNIFIED_DESIGN_CSS;
    document.head.appendChild(style);
  }

  function init() {
    var root = document.getElementById(ROOT_ID);
    if (!root || root.getAttribute('data-mb-version') === VERSION) return;
    addStyles();
    root.setAttribute('data-mb-version', VERSION);
    root.innerHTML = [
      '<section class="mb-pi" aria-labelledby="mb-pi-title">',
      '  <div class="mb-pi__head"><h2 class="mb-pi__title" id="mb-pi-title">' + T.title + '</h2><p class="mb-pi__lead">' + T.lead + '</p></div>',
      '  <div class="mb-pi__body">',
      '    <p class="mb-pi__notice">' + T.notice + '</p>',
      '    <form id="mb-pi-form" novalidate>',
      '      <div class="mb-pi__grid">',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-weight">' + T.weight + '</label><div class="mb-pi__input-wrap"><input class="mb-pi__input" id="mb-pi-weight" inputmode="decimal" autocomplete="off" value="70"><span class="mb-pi__unit">kg</span></div><span class="mb-pi__hint">' + T.weight_hint + '</span></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-height">' + T.height + '</label><div class="mb-pi__input-wrap"><input class="mb-pi__input" id="mb-pi-height" inputmode="decimal" autocomplete="off" placeholder="175"><span class="mb-pi__unit">cm</span></div><span class="mb-pi__hint">' + T.height_hint + '</span></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-age">' + T.age + '</label><div class="mb-pi__input-wrap"><input class="mb-pi__input" id="mb-pi-age" inputmode="numeric" autocomplete="off" value="35"><span class="mb-pi__unit">' + (T.locale === 'sk-SK' ? 'rokov' : 'let') + '</span></div></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-activity">' + T.activity + '</label><select class="mb-pi__select" id="mb-pi-activity">' + optionHtml(T.activity_options) + '</select></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-goal">' + T.goal + '</label><select class="mb-pi__select" id="mb-pi-goal">' + optionHtml(T.goal_options) + '</select></div>',
      '        <div class="mb-pi__field"><label class="mb-pi__label" for="mb-pi-meals">' + T.meals + '</label><select class="mb-pi__select" id="mb-pi-meals"><option value="3">3</option><option value="4" selected>4</option><option value="5">5</option><option value="6">6</option></select></div>',
      '      </div>',
      '      <div class="mb-pi__actions"><button type="submit" class="mb-pi__button mb-pi__button--primary">' + T.calculate + '</button><button type="button" class="mb-pi__button mb-pi__button--secondary" id="mb-pi-reset">' + T.reset + '</button></div>',
      '      <div class="mb-pi__error" id="mb-pi-error" role="alert"></div>',
      '    </form>',
      '    <section class="mb-pi__result" id="mb-pi-result" aria-live="polite" hidden>',
      '      <div class="mb-pi__result-top"><div><p class="mb-pi__result-label">' + T.result_label + '</p><p class="mb-pi__score"><span id="mb-pi-score">–</span> <span class="mb-pi__score-unit">g/den</span></p></div><span class="mb-pi__badge">' + T.badge + '</span></div>',
      '      <p class="mb-pi__summary" id="mb-pi-summary"></p>',
      '      <div class="mb-pi__scale-wrap"><p class="mb-pi__scale-title">' + T.scale_title + '</p><div class="mb-pi__scale" aria-hidden="true"><span class="mb-pi__range" id="mb-pi-range"></span><i class="mb-pi__marker" id="mb-pi-marker"></i></div><div class="mb-pi__scale-labels"><span>0,8</span><span>1,2</span><span>1,6</span><span>2,0</span><span>2,2 g/kg</span></div></div>',
      '      <div class="mb-pi__metrics">',
      '        <div class="mb-pi__metric"><p class="mb-pi__metric-label">' + T.midpoint + '</p><p class="mb-pi__metric-value" id="mb-pi-mid">–</p></div>',
      '        <div class="mb-pi__metric"><p class="mb-pi__metric-label">' + T.per_meal + '</p><p class="mb-pi__metric-value" id="mb-pi-meal">–</p></div>',
      '        <div class="mb-pi__metric"><p class="mb-pi__metric-label">' + T.energy + '</p><p class="mb-pi__metric-value" id="mb-pi-energy">–</p></div>',
      '        <div class="mb-pi__metric"><p class="mb-pi__metric-label">' + T.profile + '</p><p class="mb-pi__metric-value" id="mb-pi-profile">–</p></div>',
      '      </div>',
      '      <p class="mb-pi__formula" id="mb-pi-formula"></p><p class="mb-pi__warning" id="mb-pi-warning"></p>',
      '    </section>',
      '    <p class="mb-pi__privacy">' + T.privacy + '</p>',
      '  </div>',
      '</section>'
    ].join('');

    var form = document.getElementById('mb-pi-form');
    var result = document.getElementById('mb-pi-result');
    var error = document.getElementById('mb-pi-error');

    function showError(message) { error.textContent = message; error.className = 'mb-pi__error is-visible'; result.hidden = true; }

    form.addEventListener('submit', function (event) {
      event.preventDefault(); error.className = 'mb-pi__error';
      var weight = parseNumber(document.getElementById('mb-pi-weight').value);
      var heightRaw = document.getElementById('mb-pi-height').value.trim();
      var height = heightRaw === '' ? NaN : parseNumber(heightRaw);
      var age = parseNumber(document.getElementById('mb-pi-age').value);
      var activity = document.getElementById('mb-pi-activity').value;
      var goal = document.getElementById('mb-pi-goal').value;
      var meals = parseNumber(document.getElementById('mb-pi-meals').value);
      if (!Number.isFinite(weight) || weight < 30 || weight > 250) return showError(T.errors.weight);
      if (heightRaw !== '' && (!Number.isFinite(height) || height < 120 || height > 230)) return showError(T.errors.height);
      if (!Number.isFinite(age) || age < 18 || age > 100) return showError(T.errors.age);

      var range = getRange(age, activity, goal);
      var lowTotal = weight * range.low;
      var highTotal = weight * range.high;
      var midFactor = (range.low + range.high) / 2;
      var midTotal = weight * midFactor;
      var perMealLow = lowTotal / meals;
      var perMealHigh = highTotal / meals;
      var energy = midTotal * 4;
      if (![lowTotal, highTotal, midTotal, energy].every(Number.isFinite)) return showError(T.errors.generic);

      var scaleMin = 0.8, scaleMax = 2.2;
      var left = Math.max(0, Math.min(100, ((range.low - scaleMin) / (scaleMax - scaleMin)) * 100));
      var right = Math.max(0, Math.min(100, ((range.high - scaleMin) / (scaleMax - scaleMin)) * 100));
      var marker = Math.max(0, Math.min(100, ((midFactor - scaleMin) / (scaleMax - scaleMin)) * 100));

      document.getElementById('mb-pi-score').textContent = format(round(lowTotal, 0), 0) + '–' + format(round(highTotal, 0), 0);
      document.getElementById('mb-pi-summary').innerHTML = T.summary_prefix + ' <strong>' + format(range.low, 2).replace(/0$/, '') + '–' + format(range.high, 1) + ' g/kg/den</strong>.';
      document.getElementById('mb-pi-range').style.left = left + '%';
      document.getElementById('mb-pi-range').style.width = Math.max(2, right - left) + '%';
      document.getElementById('mb-pi-marker').style.left = marker + '%';
      document.getElementById('mb-pi-mid').textContent = format(round(midTotal, 0), 0) + ' g/den';
      document.getElementById('mb-pi-meal').textContent = format(round(perMealLow, 0), 0) + '–' + format(round(perMealHigh, 0), 0) + ' g';
      document.getElementById('mb-pi-energy').textContent = format(round(energy, 0), 0) + ' kcal/den';
      document.getElementById('mb-pi-profile').textContent = range.profile;
      document.getElementById('mb-pi-formula').innerHTML = '<strong>' + T.formula + ':</strong> ' + format(weight, 1) + ' kg × ' + format(range.low, 2).replace(/0$/, '') + '–' + format(range.high, 1) + ' g/kg = ' + format(round(lowTotal, 0), 0) + '–' + format(round(highTotal, 0), 0) + ' g/den.';

      var warning = T.warnings.base;
      if (age >= 65) warning += T.warnings.older;
      if (goal === 'muscle' && activity === 'low') warning += T.warnings.muscle_low;
      if (goal === 'reduction') warning += T.warnings.reduction;
      if (Number.isFinite(height)) { var bmi = weight / Math.pow(height / 100, 2); if (bmi >= 30) warning += T.warnings.bmi; }
      warning += T.warnings.medical;
      document.getElementById('mb-pi-warning').textContent = warning;
      result.hidden = false;
      result.scrollIntoView({ behavior:'smooth', block:'nearest' });
    });

    document.getElementById('mb-pi-reset').addEventListener('click', function () {
      document.getElementById('mb-pi-weight').value = '70';
      document.getElementById('mb-pi-height').value = '';
      document.getElementById('mb-pi-age').value = '35';
      document.getElementById('mb-pi-activity').value = 'low';
      document.getElementById('mb-pi-goal').value = 'maintain';
      document.getElementById('mb-pi-meals').value = '4';
      error.className = 'mb-pi__error'; result.hidden = true;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
