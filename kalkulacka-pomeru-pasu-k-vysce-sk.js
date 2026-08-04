/**
 * MyBears — zjednotená grafická verzia 2.0 (SK)
 * Vizuálny systém vychádza z MyBears Product Guide v1.8.
 * Funkčná logika pôvodného nástroja zostáva zachovaná.
 */
(function () {
  'use strict';

  var MYBEARS_UNIFIED_DESIGN_CSS = String.raw`
/* MyBears unified design layer — based on Product Guide v1.8 */
#mb-waist-height-calculator {
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
#mb-waist-height-calculator *, #mb-waist-height-calculator *::before, #mb-waist-height-calculator *::after { box-sizing:border-box; }
#mb-waist-height-calculator .mb-wh { position:relative; overflow:hidden; border:1px solid var(--mb-border) !important; border-radius:18px !important; background:#fff !important; box-shadow:0 12px 32px rgba(27,35,29,.07) !important; }
#mb-waist-height-calculator .mb-wh::before { content:""; position:absolute; z-index:3; top:0; left:0; right:0; height:4px; background:var(--mb-gold); }
#mb-waist-height-calculator .mb-wh__head { padding:34px 38px 26px !important; background:var(--mb-cream) !important; border-bottom:1px solid var(--mb-border) !important; }
#mb-waist-height-calculator .mb-wh__body { padding:30px 38px 36px !important; }
#mb-waist-height-calculator .mb-wh__title, #mb-waist-height-calculator .mb-wh__section-title, #mb-waist-height-calculator .mb-wh__panel-title, #mb-waist-height-calculator .mb-wh__subhead { color:var(--mb-green) !important; font-weight:700 !important; letter-spacing:-.01em; }
#mb-waist-height-calculator .mb-wh__title { margin:0 0 10px !important; font-size:clamp(25px,3.2vw,30px) !important; line-height:1.16 !important; }
#mb-waist-height-calculator .mb-wh__lead { max-width:820px; margin:0 !important; color:#454a45 !important; font-size:16px !important; line-height:1.58 !important; }
#mb-waist-height-calculator .mb-wh__notice { margin:0 0 22px !important; padding:15px 17px !important; border:1px solid #eadfc8 !important; border-left:4px solid var(--mb-gold) !important; border-radius:12px !important; background:var(--mb-cream) !important; color:#4f4b43 !important; font-size:14px !important; line-height:1.55 !important; }
#mb-waist-height-calculator .mb-wh__notice strong { color:#292b28; }
#mb-waist-height-calculator .mb-wh__grid { gap:18px !important; }
#mb-waist-height-calculator .mb-wh__field { min-width:0; }
#mb-waist-height-calculator .mb-wh__label { margin-bottom:7px !important; color:#292b28 !important; font-size:15px !important; font-weight:700 !important; }
#mb-waist-height-calculator .mb-wh__input, #mb-waist-height-calculator .mb-wh__select { min-height:48px !important; border:1px solid #d4d6d1 !important; border-radius:8px !important; background:#fff !important; color:var(--mb-text) !important; box-shadow:inset 0 1px 0 rgba(255,255,255,.8); }
#mb-waist-height-calculator .mb-wh__input:hover, #mb-waist-height-calculator .mb-wh__select:hover { border-color:#aeb8b0 !important; }
#mb-waist-height-calculator .mb-wh__input:focus, #mb-waist-height-calculator .mb-wh__select:focus { outline:3px solid rgba(219,196,66,.30) !important; outline-offset:1px; border-color:var(--mb-green-dark) !important; }
#mb-waist-height-calculator .mb-wh__hint, #mb-waist-height-calculator .mb-wh__privacy, #mb-waist-height-calculator .mb-wh__formula, #mb-waist-height-calculator .mb-wh__disclaimer { color:var(--mb-muted) !important; }
#mb-waist-height-calculator .mb-wh__actions { gap:12px !important; margin-top:24px !important; }
#mb-waist-height-calculator .mb-wh__button { display:inline-flex; align-items:center; justify-content:center; min-height:48px !important; padding:12px 24px !important; border:2px solid transparent !important; border-radius:8px !important; font-weight:700 !important; line-height:1.15; transition:background .15s ease,border-color .15s ease,transform .15s ease; }
#mb-waist-height-calculator .mb-wh__button:hover { transform:translateY(-1px); }
#mb-waist-height-calculator .mb-wh__button:focus-visible, #mb-waist-height-calculator a:focus-visible, #mb-waist-height-calculator summary:focus-visible { outline:3px solid rgba(219,196,66,.38) !important; outline-offset:2px !important; }
#mb-waist-height-calculator .mb-wh__button--primary { min-width:210px; color:#fff !important; background:var(--mb-green) !important; border-color:var(--mb-green) !important; box-shadow:none !important; }
#mb-waist-height-calculator .mb-wh__button--primary:hover { background:var(--mb-green-dark) !important; border-color:var(--mb-green-dark) !important; }
#mb-waist-height-calculator .mb-wh__button--secondary { color:var(--mb-green-dark) !important; background:#fff !important; border-color:var(--mb-green) !important; }
#mb-waist-height-calculator .mb-wh__advanced, #mb-waist-height-calculator .mb-wh__panel, #mb-waist-height-calculator .mb-wh__mode, #mb-waist-height-calculator .mb-wh__tabs { border-color:var(--mb-border) !important; border-radius:12px !important; background:var(--mb-cream) !important; }
#mb-waist-height-calculator .mb-wh__tab, #mb-waist-height-calculator .mb-wh__mode-btn { border-radius:8px !important; color:var(--mb-green-dark) !important; }
#mb-waist-height-calculator .mb-wh__tab[aria-selected="true"], #mb-waist-height-calculator .mb-wh__mode-btn[aria-pressed="true"], #mb-waist-height-calculator .mb-wh__tab.is-active, #mb-waist-height-calculator .mb-wh__mode-btn.is-active { background:var(--mb-green) !important; color:#fff !important; border-color:var(--mb-green) !important; }
#mb-waist-height-calculator .mb-wh__result { margin-top:28px !important; padding:24px !important; border:1px solid #cfe4d5 !important; border-radius:16px !important; background:var(--mb-green-soft) !important; }
#mb-waist-height-calculator .mb-wh__score { color:#20221f !important; font-weight:800 !important; letter-spacing:-.035em; }
#mb-waist-height-calculator .mb-wh__badge { border:1px solid #d7ceb8 !important; background:#fff8df !important; color:#75633d !important; font-weight:700 !important; }
#mb-waist-height-calculator .mb-wh__summary { color:#454a45 !important; }
#mb-waist-height-calculator .mb-wh__metric, #mb-waist-height-calculator .mb-wh__card, #mb-waist-height-calculator .mb-wh__macro, #mb-waist-height-calculator .mb-wh__meal { border:1px solid var(--mb-border) !important; border-radius:12px !important; background:#fff !important; box-shadow:none !important; }
#mb-waist-height-calculator .mb-wh__metric-label, #mb-waist-height-calculator .mb-wh__card-label, #mb-waist-height-calculator .mb-wh__result-label { color:var(--mb-muted) !important; }
#mb-waist-height-calculator .mb-wh__metric-value, #mb-waist-height-calculator .mb-wh__card-value, #mb-waist-height-calculator .mb-wh__macro-value { color:var(--mb-green-dark) !important; }
#mb-waist-height-calculator .mb-wh__warning, #mb-waist-height-calculator .mb-wh__inline-warning { border-left:4px solid var(--mb-gold) !important; border-radius:8px !important; background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important; color:#5d4b1d !important; }
#mb-waist-height-calculator .mb-wh__error { border-color:#e3b3af !important; border-radius:10px !important; background:#fff5f4 !important; color:var(--mb-danger) !important; }
#mb-waist-height-calculator .mb-wh__scale { box-shadow:inset 0 0 0 1px rgba(32,34,31,.10); }
#mb-waist-height-calculator .mb-wh__marker { background:#20231f !important; box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(32,35,31,.18) !important; }
#mb-waist-height-calculator .mb-wh__table-wrap { overflow-x:auto; border:1px solid var(--mb-border) !important; border-radius:12px !important; }
#mb-waist-height-calculator .mb-wh__table { width:100%; border-collapse:collapse; background:#fff; }
#mb-waist-height-calculator .mb-wh__table thead th { border-bottom:2px solid var(--mb-gold) !important; background:#20231f !important; color:#fff !important; }
#mb-waist-height-calculator .mb-wh__table tbody tr:nth-child(even) { background:var(--mb-green-soft) !important; }
@media(max-width:760px) {
  #mb-waist-height-calculator { margin:18px auto 30px !important; }
  #mb-waist-height-calculator .mb-wh__head { padding:28px 20px 22px !important; }
  #mb-waist-height-calculator .mb-wh__body { padding:24px 20px 28px !important; }
  #mb-waist-height-calculator .mb-wh__result { padding:20px !important; }
  #mb-waist-height-calculator .mb-wh__actions { flex-direction:column; align-items:stretch; }
  #mb-waist-height-calculator .mb-wh__button { width:100%; }
}
@media(prefers-reduced-motion:reduce) {
  #mb-waist-height-calculator *, #mb-waist-height-calculator *::before, #mb-waist-height-calculator *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
`;

  var T = {"locale":"sk-SK","slug":"kalkulacka-pomeru-pasu-k-vysce","domain":"https://www.mybears.cz","root":"mb-waist-height-calculator","style":"mb-waist-height-calculator-styles","version":"2.0.0-sk","title":"Kalkulačka pomeru pásu k výške","lead":"Zistite, akú časť vašej výšky tvorí obvod pásu a do akého orientačného pásma výsledok patrí.","notice":"<strong>Dôležité:</strong> Kalkulačka je určená pre dospelých. Výsledok je skríningový údaj, nie diagnóza. V tehotenstve ani pri výraznom zväčšení brucha z inej príčiny nemusí byť použiteľný.","height":"Výška","waist":"Obvod pásu","height_hint":"Merajte bez obuvi vo vzpriamenom postoji.","waist_hint":"Merajte po bežnom výdychu, vodorovne v polovici medzi posledným hmatateľným rebrom a horným okrajom bedrovej kosti.","calculate":"Vypočítať pomer","reset":"Vymazať údaje","result_label":"Váš pomer pásu k výške","badge_low":"Nízky pomer","badge_healthy":"Bez zvýšenej centrálnej adipozity","badge_increased":"Zvýšená centrálna adipozita","badge_high":"Vysoká centrálna adipozita","summary_low":"Výsledok je pod hlavným klasifikačným rozmedzím NICE. Samotný nízky pomer neurčuje podváhu ani zdravotný stav; posudzujte ho spolu s BMI, vývojom hmotnosti a ďalšími údajmi.","summary_healthy":"Výsledok patrí do pásma 0,40–0,49, ktoré NICE označuje ako zdravú centrálnu adipozitu bez zvýšeného zdravotného rizika podľa tohto ukazovateľa.","summary_increased":"Výsledok patrí do pásma 0,50–0,59. NICE ho označuje ako zvýšenú centrálnu adipozitu a zvýšené zdravotné riziko.","summary_high":"Výsledok je 0,60 alebo vyšší. NICE ho označuje ako vysokú centrálnu adipozitu a ďalej zvýšené zdravotné riziko.","scale_title":"Orientačná klasifikácia pomeru pásu k výške","scale_low":"Pod 0,40","scale_healthy":"0,40–0,49","scale_increased":"0,50–0,59","scale_high":"0,60 a viac","waist_percent":"Pás tvorí z výšky","half_height":"Polovica vašej výšky","difference":"Rozdiel oproti polovici výšky","formula":"Výpočet","privacy":"Výpočet prebieha iba vo vašom prehliadači. Zadaná výška ani obvod pásu sa týmto skriptom nikam neodosielajú ani neukladajú.","below":"pod hranicou","above":"nad hranicou","equal":"presne na hranici","cm":"cm","percent":"%","errors":{"height":"Zadajte výšku v rozmedzí 100–250 cm.","waist":"Zadajte obvod pásu v rozmedzí 30–200 cm.","generic":"Výpočet sa nepodarilo dokončiť. Skontrolujte zadané údaje."},"warning":"Pomer pásu k výške dopĺňa BMI, krvný tlak, glykémiu a krvné tuky. Ak máte BMI 35 a viac, rýchlo sa meniaci obvod brucha alebo zdravotné ťažkosti, nespoliehajte sa iba na tento výpočet."};
  var ROOT_ID = T.root;
  var STYLE_ID = T.style;
  var VERSION = T.version;
  var MIN_SCALE = 0.30;
  var MAX_SCALE = 0.70;

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

  function classify(ratio) {
    if (ratio < 0.40) return { key:'low', badge:T.badge_low, summary:T.summary_low };
    if (ratio < 0.50) return { key:'healthy', badge:T.badge_healthy, summary:T.summary_healthy };
    if (ratio < 0.60) return { key:'increased', badge:T.badge_increased, summary:T.summary_increased };
    return { key:'high', badge:T.badge_high, summary:T.summary_high };
  }

  function markerPosition(ratio) {
    var clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, ratio));
    return ((clamped - MIN_SCALE) / (MAX_SCALE - MIN_SCALE)) * 100;
  }

  function addStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = "\n#mb-waist-height-calculator { --mb-green:#2dc26b; --mb-green-dark:#168947; --mb-green-soft:#f7fbf8; --mb-border:#d9e5dd; --mb-text:#1f2933; --mb-muted:#59636e; --mb-danger:#b42318; --mb-blue:#8fc0df; --mb-yellow:#f3c756; --mb-orange:#ef9a45; font-family:Arial,Helvetica,sans-serif; color:var(--mb-text); margin:24px 0; }\n#mb-waist-height-calculator * { box-sizing:border-box; }\n#mb-waist-height-calculator .mb-wh { border:1px solid var(--mb-border); border-radius:14px; background:#fff; box-shadow:0 8px 28px rgba(31,41,51,.08); overflow:hidden; }\n#mb-waist-height-calculator .mb-wh__head { padding:22px 22px 16px; background:var(--mb-green-soft); border-bottom:1px solid var(--mb-border); }\n#mb-waist-height-calculator .mb-wh__title { margin:0 0 8px; font-size:22px; line-height:1.25; }\n#mb-waist-height-calculator .mb-wh__lead { margin:0; color:var(--mb-muted); font-size:16px; line-height:1.55; }\n#mb-waist-height-calculator .mb-wh__body { padding:22px; }\n#mb-waist-height-calculator .mb-wh__notice { margin:0 0 18px; padding:12px 14px; border-left:4px solid var(--mb-green); border-radius:6px; background:#f8faf9; color:var(--mb-muted); font-size:14px; line-height:1.5; }\n#mb-waist-height-calculator .mb-wh__grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }\n#mb-waist-height-calculator .mb-wh__label { display:block; margin:0 0 7px; font-size:15px; font-weight:700; }\n#mb-waist-height-calculator .mb-wh__input-wrap { position:relative; }\n#mb-waist-height-calculator .mb-wh__input { width:100%; min-height:48px; padding:11px 58px 11px 12px; border:1px solid #b9c6be; border-radius:8px; background:#fff; color:var(--mb-text); font:inherit; font-size:16px; }\n#mb-waist-height-calculator .mb-wh__input:focus { outline:3px solid rgba(45,194,107,.2); border-color:var(--mb-green-dark); }\n#mb-waist-height-calculator .mb-wh__unit { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--mb-muted); font-size:14px; pointer-events:none; }\n#mb-waist-height-calculator .mb-wh__hint { display:block; margin-top:6px; color:var(--mb-muted); font-size:13px; line-height:1.4; }\n#mb-waist-height-calculator .mb-wh__actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }\n#mb-waist-height-calculator .mb-wh__button { min-height:46px; padding:11px 20px; border-radius:8px; border:1px solid transparent; font:inherit; font-size:16px; font-weight:700; cursor:pointer; }\n#mb-waist-height-calculator .mb-wh__button:focus-visible { outline:3px solid rgba(45,194,107,.28); outline-offset:2px; }\n#mb-waist-height-calculator .mb-wh__button--primary { background:var(--mb-green); color:#0c2818; border-color:var(--mb-green); box-shadow:0 4px 12px rgba(45,194,107,.22); }\n#mb-waist-height-calculator .mb-wh__button--secondary { background:#fff; color:var(--mb-text); border-color:#b9c6be; }\n#mb-waist-height-calculator .mb-wh__error { display:none; margin:16px 0 0; padding:12px 14px; border:1px solid #f1b5b0; border-radius:8px; background:#fff6f5; color:var(--mb-danger); font-size:14px; line-height:1.45; }\n#mb-waist-height-calculator .mb-wh__error.is-visible { display:block; }\n#mb-waist-height-calculator .mb-wh__result { margin-top:22px; padding:20px; border:1px solid #b8e7ca; border-radius:12px; background:var(--mb-green-soft); }\n#mb-waist-height-calculator .mb-wh__result[hidden] { display:none; }\n#mb-waist-height-calculator .mb-wh__result-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }\n#mb-waist-height-calculator .mb-wh__result-label { margin:0 0 5px; color:var(--mb-muted); font-size:14px; font-weight:700; }\n#mb-waist-height-calculator .mb-wh__score { margin:0; font-size:42px; line-height:1.05; font-weight:800; letter-spacing:-.03em; }\n#mb-waist-height-calculator .mb-wh__badge { display:inline-flex; min-height:34px; align-items:center; padding:6px 11px; border:1px solid #b9c6be; border-radius:999px; background:#fff; font-size:14px; font-weight:700; }\n#mb-waist-height-calculator .mb-wh__summary { margin:14px 0 0; font-size:15px; line-height:1.55; }\n#mb-waist-height-calculator .mb-wh__scale-wrap { margin-top:18px; }\n#mb-waist-height-calculator .mb-wh__scale-title { margin:0 0 8px; font-size:14px; font-weight:700; }\n#mb-waist-height-calculator .mb-wh__scale { position:relative; height:18px; border-radius:999px; background:linear-gradient(to right,var(--mb-blue) 0 25%,#6ecb8f 25% 50%,var(--mb-yellow) 50% 75%,var(--mb-orange) 75% 100%); overflow:visible; }\n#mb-waist-height-calculator .mb-wh__marker { position:absolute; top:-5px; width:4px; height:28px; border-radius:3px; background:#18324a; transform:translateX(-50%); box-shadow:0 0 0 2px #fff; }\n#mb-waist-height-calculator .mb-wh__scale-labels { display:grid; grid-template-columns:repeat(4,1fr); gap:0; margin-top:8px; text-align:center; color:#334155; font-size:11px; line-height:1.35; }\n#mb-waist-height-calculator .mb-wh__cards { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-top:18px; }\n#mb-waist-height-calculator .mb-wh__card { min-width:0; padding:14px; border:1px solid #d4e1d8; border-radius:9px; background:#fff; }\n#mb-waist-height-calculator .mb-wh__card-label { display:block; margin-bottom:7px; color:var(--mb-muted); font-size:13px; font-weight:700; }\n#mb-waist-height-calculator .mb-wh__card-value { display:block; font-size:18px; font-weight:800; line-height:1.3; }\n#mb-waist-height-calculator .mb-wh__formula { margin:15px 0 0; color:var(--mb-muted); font-size:14px; line-height:1.5; }\n#mb-waist-height-calculator .mb-wh__warning { margin:15px 0 0; padding-top:15px; border-top:1px solid #cce3d4; color:#3f4f46; font-size:13px; line-height:1.55; }\n#mb-waist-height-calculator .mb-wh__privacy { margin:14px 0 0; color:var(--mb-muted); font-size:12px; line-height:1.45; }\n@media (max-width:760px) {\n  #mb-waist-height-calculator .mb-wh__grid, #mb-waist-height-calculator .mb-wh__cards { grid-template-columns:1fr; }\n  #mb-waist-height-calculator .mb-wh__head, #mb-waist-height-calculator .mb-wh__body { padding-left:16px; padding-right:16px; }\n  #mb-waist-height-calculator .mb-wh__score { font-size:36px; }\n  #mb-waist-height-calculator .mb-wh__scale-labels { font-size:10px; }\n}\n";
    style.textContent += MYBEARS_UNIFIED_DESIGN_CSS;
    document.head.appendChild(style);
  }

  function render(root) {
    root.setAttribute('data-version', VERSION);
    root.innerHTML = '' +
      '<section class="mb-wh" aria-labelledby="mb-wh-title">' +
        '<div class="mb-wh__head">' +
          '<h2 class="mb-wh__title" id="mb-wh-title">' + T.title + '</h2>' +
          '<p class="mb-wh__lead">' + T.lead + '</p>' +
        '</div>' +
        '<div class="mb-wh__body">' +
          '<div class="mb-wh__notice">' + T.notice + '</div>' +
          '<form class="mb-wh__form" novalidate>' +
            '<div class="mb-wh__grid">' +
              '<div class="mb-wh__field">' +
                '<label class="mb-wh__label" for="mb-wh-height">' + T.height + '</label>' +
                '<div class="mb-wh__input-wrap"><input class="mb-wh__input" id="mb-wh-height" name="height" type="text" inputmode="decimal" autocomplete="off" placeholder="175"><span class="mb-wh__unit">cm</span></div>' +
                '<span class="mb-wh__hint">' + T.height_hint + '</span>' +
              '</div>' +
              '<div class="mb-wh__field">' +
                '<label class="mb-wh__label" for="mb-wh-waist">' + T.waist + '</label>' +
                '<div class="mb-wh__input-wrap"><input class="mb-wh__input" id="mb-wh-waist" name="waist" type="text" inputmode="decimal" autocomplete="off" placeholder="85"><span class="mb-wh__unit">cm</span></div>' +
                '<span class="mb-wh__hint">' + T.waist_hint + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="mb-wh__actions">' +
              '<button class="mb-wh__button mb-wh__button--primary" type="submit">' + T.calculate + '</button>' +
              '<button class="mb-wh__button mb-wh__button--secondary" type="button" data-action="reset">' + T.reset + '</button>' +
            '</div>' +
            '<div class="mb-wh__error" role="alert" aria-live="assertive"></div>' +
          '</form>' +
          '<div class="mb-wh__result" aria-live="polite" hidden>' +
            '<div class="mb-wh__result-top"><div><p class="mb-wh__result-label">' + T.result_label + '</p><p class="mb-wh__score" data-result="ratio">0,00</p></div><span class="mb-wh__badge" data-result="badge"></span></div>' +
            '<p class="mb-wh__summary" data-result="summary"></p>' +
            '<div class="mb-wh__scale-wrap"><p class="mb-wh__scale-title">' + T.scale_title + '</p><div class="mb-wh__scale"><span class="mb-wh__marker" data-result="marker"></span></div>' +
              '<div class="mb-wh__scale-labels"><span>' + T.scale_low + '</span><span>' + T.scale_healthy + '</span><span>' + T.scale_increased + '</span><span>' + T.scale_high + '</span></div>' +
            '</div>' +
            '<div class="mb-wh__cards">' +
              '<div class="mb-wh__card"><span class="mb-wh__card-label">' + T.waist_percent + '</span><strong class="mb-wh__card-value" data-result="percent"></strong></div>' +
              '<div class="mb-wh__card"><span class="mb-wh__card-label">' + T.half_height + '</span><strong class="mb-wh__card-value" data-result="half"></strong></div>' +
              '<div class="mb-wh__card"><span class="mb-wh__card-label">' + T.difference + '</span><strong class="mb-wh__card-value" data-result="difference"></strong></div>' +
            '</div>' +
            '<p class="mb-wh__formula" data-result="formula"></p>' +
            '<p class="mb-wh__warning">' + T.warning + '</p>' +
          '</div>' +
          '<p class="mb-wh__privacy">' + T.privacy + '</p>' +
        '</div>' +
      '</section>';

    var form = root.querySelector('.mb-wh__form');
    var error = root.querySelector('.mb-wh__error');
    var result = root.querySelector('.mb-wh__result');

    function showError(message, field) {
      error.textContent = message;
      error.classList.add('is-visible');
      result.hidden = true;
      if (field) field.focus();
    }

    function clearError() {
      error.textContent = '';
      error.classList.remove('is-visible');
    }

    function calculate() {
      clearError();
      var heightInput = root.querySelector('#mb-wh-height');
      var waistInput = root.querySelector('#mb-wh-waist');
      var height = parseNumber(heightInput.value);
      var waist = parseNumber(waistInput.value);
      if (!Number.isFinite(height) || height < 100 || height > 250) return showError(T.errors.height, heightInput);
      if (!Number.isFinite(waist) || waist < 30 || waist > 200) return showError(T.errors.waist, waistInput);

      var rawRatio = waist / height;
      var ratio = round(rawRatio, 2);
      var pct = round(rawRatio * 100, 1);
      var half = round(height * 0.5, 1);
      var diff = round(waist - half, 1);
      var group = classify(ratio);

      root.querySelector('[data-result="ratio"]').textContent = format(ratio, 2);
      root.querySelector('[data-result="badge"]').textContent = group.badge;
      root.querySelector('[data-result="summary"]').textContent = group.summary;
      root.querySelector('[data-result="marker"]').style.left = markerPosition(ratio) + '%';
      root.querySelector('[data-result="percent"]').textContent = format(pct, 1) + ' ' + T.percent;
      root.querySelector('[data-result="half"]').textContent = format(half, 1) + ' ' + T.cm;
      var diffText;
      if (Math.abs(diff) < 0.05) diffText = T.equal;
      else if (diff < 0) diffText = format(Math.abs(diff), 1) + ' ' + T.cm + ' ' + T.below;
      else diffText = format(diff, 1) + ' ' + T.cm + ' ' + T.above;
      root.querySelector('[data-result="difference"]').textContent = diffText;
      root.querySelector('[data-result="formula"]').textContent = T.formula + ': ' + format(waist, 1) + ' cm ÷ ' + format(height, 1) + ' cm = ' + format(ratio, 2) + '.';
      result.hidden = false;
      result.scrollIntoView({ behavior:'smooth', block:'nearest' });
    }

    form.addEventListener('submit', function (event) { event.preventDefault(); calculate(); });
    root.querySelector('[data-action="reset"]').addEventListener('click', function () {
      form.reset(); clearError(); result.hidden = true; root.querySelector('#mb-wh-height').focus();
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
