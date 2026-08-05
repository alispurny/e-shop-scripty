/**
 * MyBears — kalkulačka pomeru pásu k výške
 * Vizuální systém: finální šablona převodníku krevních lipidů
 * Jazyk: slovenština
 */
(function () {
  'use strict';

  var T = {"locale":"sk-SK","root":"mb-waist-height-calculator","style":"mb-waist-height-calculator-styles","version":"3.0.0-sk","title":"Kalkulačka pomeru pásu k výške","lead":"Zistite, akú časť vašej výšky tvorí obvod pásu a do akého orientačného pásma výsledok patrí.","notice":"<strong>Dôležité:</strong> Kalkulačka je určená pre dospelých. Výsledok je skríningový údaj, nie diagnóza. V tehotenstve ani pri výraznom zväčšení brucha z inej príčiny nemusí byť použiteľný.","height":"Výška","waist":"Obvod pásu","height_hint":"Merajte bez obuvi, vo vzpriamenom postoji.","waist_hint":"Merajte po bežnom výdychu, vodorovne v polovici medzi posledným hmatným rebrom a horným okrajom bedrovej kosti.","calculate":"Vypočítať pomer","reset":"Vymazať údaje","result_label":"Váš pomer pásu k výške","badge_low":"Nízky pomer","badge_healthy":"Bez zvýšenej centrálnej adipozity","badge_increased":"Zvýšená centrálna adipozita","badge_high":"Vysoká centrálna adipozita","summary_low":"Výsledok je pod hlavným klasifikačným rozmedzím NICE. Samotný nízky pomer neurčuje podváhu ani zdravotný stav; posudzujte ho spolu s BMI, vývojom hmotnosti a ďalšími údajmi.","summary_healthy":"Výsledok patrí do pásma 0,40–0,49, ktoré NICE označuje ako zdravú centrálnu adipozitu bez zvýšeného zdravotného rizika podľa tohto ukazovateľa.","summary_increased":"Výsledok patrí do pásma 0,50–0,59. NICE ho označuje ako zvýšenú centrálnu adipozitu a zvýšené zdravotné riziko.","summary_high":"Výsledok je 0,60 alebo vyšší. NICE ho označuje ako vysokú centrálnu adipozitu a ďalej zvýšené zdravotné riziko.","scale_title":"Orientačná klasifikácia pomeru pásu k výške","scale_low":"Pod 0,40","scale_healthy":"0,40–0,49","scale_increased":"0,50–0,59","scale_high":"0,60 a viac","waist_percent":"Pás tvorí z výšky","half_height":"Polovica vašej výšky","difference":"Rozdiel voči polovici výšky","formula":"Výpočet","privacy":"Výpočet prebieha iba vo vašom prehliadači. Zadaná výška ani obvod pásu sa týmto skriptom nikam neodosielajú ani neukladajú.","below":"pod hranicou","above":"nad hranicou","equal":"presne na hranici","cm":"cm","percent":"%","errors":{"height":"Zadajte výšku v rozmedzí 100–250 cm.","waist":"Zadajte obvod pásu v rozmedzí 30–200 cm.","generic":"Výpočet sa nepodarilo dokončiť. Skontrolujte zadané údaje."},"warning":"Pomer pásu k výške dopĺňa BMI, krvný tlak, glykémiu a krvné tuky. Ak máte BMI 35 a viac, rýchlo sa meniaci obvod brucha alebo zdravotné ťažkosti, nespoliehajte sa iba na tento výpočet.","region_label":"Interaktívna kalkulačka pomeru pásu k výške"};
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
    return new Intl.NumberFormat(T.locale, {
      minimumFractionDigits:decimals,
      maximumFractionDigits:decimals
    }).format(value);
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function classify(ratio) {
    if (ratio < 0.40) return { badge:T.badge_low, summary:T.summary_low };
    if (ratio < 0.50) return { badge:T.badge_healthy, summary:T.summary_healthy };
    if (ratio < 0.60) return { badge:T.badge_increased, summary:T.summary_increased };
    return { badge:T.badge_high, summary:T.summary_high };
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
    style.textContent = String.raw`
/* MyBears unified design layer — based on the final lipid converter */
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
  --mb-blue:#8fc0df !important;
  --mb-orange:#ef9a45 !important;
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
#${ROOT_ID} *,
#${ROOT_ID} input,
#${ROOT_ID} button,
#${ROOT_ID} select,
#${ROOT_ID} textarea,
#${ROOT_ID} label,
#${ROOT_ID} span,
#${ROOT_ID} p,
#${ROOT_ID} strong,
#${ROOT_ID} h2,
#${ROOT_ID} h3,
#${ROOT_ID} h4 {
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  -webkit-text-fill-color:#000 !important;
  text-shadow:none !important;
}
#${ROOT_ID} strong,
#${ROOT_ID} b { font-weight:700 !important; }
#${ROOT_ID} .mb-wh {
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
#${ROOT_ID} .mb-wh::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-wh__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-wh__title,
#${ROOT_ID} .mb-wh__title {
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
#${ROOT_ID} h2.mb-wh__title::before,
#${ROOT_ID} h2.mb-wh__title::after,
#${ROOT_ID} .mb-wh__title::before,
#${ROOT_ID} .mb-wh__title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-wh__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-wh__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-wh__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__panel {
  margin:0 !important;
  padding:22px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} .mb-wh__form { margin:0 !important; padding:0 !important; }
#${ROOT_ID} .mb-wh__grid {
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:18px !important;
  margin:0 !important;
}
#${ROOT_ID} .mb-wh__field { min-width:0 !important; margin:0 !important; }
#${ROOT_ID} .mb-wh__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 15px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
}
#${ROOT_ID} .mb-wh__input-wrap { position:relative !important; margin:0 !important; }
#${ROOT_ID} input.mb-wh__input,
#${ROOT_ID} .mb-wh__input {
  display:block !important;
  width:100% !important;
  min-width:0 !important;
  min-height:48px !important;
  margin:0 !important;
  padding:11px 58px 11px 12px !important;
  border:1px solid #d4d6d1 !important;
  border-radius:8px !important;
  background:#fff !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.8) !important;
  color:#000 !important;
  font:400 16px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:left !important;
  -webkit-appearance:none !important;
  appearance:none !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} .mb-wh__input:hover { border-color:#aeb8b0 !important; }
#${ROOT_ID} .mb-wh__input:focus {
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  border-color:var(--mb-green-dark) !important;
}
#${ROOT_ID} .mb-wh__input::placeholder {
  color:#707070 !important;
  opacity:1 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  -webkit-text-fill-color:#707070 !important;
}
#${ROOT_ID} .mb-wh__unit {
  position:absolute !important;
  right:12px !important;
  top:50% !important;
  transform:translateY(-50%) !important;
  color:#000 !important;
  font:400 14px/1 Arial,Helvetica,sans-serif !important;
  pointer-events:none !important;
}
#${ROOT_ID} .mb-wh__hint {
  display:block !important;
  margin:7px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} button.mb-wh__button,
#${ROOT_ID} .mb-wh__button {
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
  -webkit-appearance:none !important;
  appearance:none !important;
  -webkit-text-fill-color:#000 !important;
  transition:background .15s ease,border-color .15s ease,transform .15s ease !important;
}
#${ROOT_ID} .mb-wh__button:hover { transform:translateY(-1px) !important; }
#${ROOT_ID} .mb-wh__button:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-wh__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-wh__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-wh__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-wh__button--secondary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-wh__error {
  display:none !important;
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#000 !important;
  font:400 14px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__error.is-visible { display:block !important; }
#${ROOT_ID} .mb-wh__result {
  margin:28px 0 0 !important;
  padding:24px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:16px !important;
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} .mb-wh__result[hidden] { display:none !important; }
#${ROOT_ID} .mb-wh__result-top {
  display:flex !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  gap:16px !important;
  flex-wrap:wrap !important;
}
#${ROOT_ID} .mb-wh__result-label {
  margin:0 0 5px !important;
  color:#000 !important;
  font:700 14px/1.35 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__score {
  margin:0 !important;
  color:#000 !important;
  font:800 42px/1.05 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.03em !important;
}
#${ROOT_ID} .mb-wh__badge {
  display:inline-flex !important;
  align-items:center !important;
  min-height:34px !important;
  margin:0 !important;
  padding:6px 11px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:700 14px/1.25 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__summary {
  margin:14px 0 0 !important;
  color:#000 !important;
  font:400 15px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__scale-wrap { margin:20px 0 0 !important; }
#${ROOT_ID} .mb-wh__scale-title {
  margin:0 0 9px !important;
  color:#000 !important;
  font:700 14px/1.35 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__scale {
  position:relative !important;
  height:18px !important;
  overflow:visible !important;
  border-radius:999px !important;
  background:linear-gradient(to right,var(--mb-blue) 0 25%,#6ecb8f 25% 50%,var(--mb-yellow) 50% 75%,var(--mb-orange) 75% 100%) !important;
  box-shadow:inset 0 0 0 1px rgba(32,34,31,.10) !important;
}
#${ROOT_ID} .mb-wh__marker {
  position:absolute !important;
  top:-5px !important;
  width:4px !important;
  height:28px !important;
  border-radius:3px !important;
  background:#20231f !important;
  box-shadow:0 0 0 2px #fff,0 0 0 3px rgba(32,35,31,.18) !important;
  transform:translateX(-50%) !important;
}
#${ROOT_ID} .mb-wh__scale-labels {
  display:grid !important;
  grid-template-columns:repeat(4,minmax(0,1fr)) !important;
  gap:0 !important;
  margin:9px 0 0 !important;
  color:#000 !important;
  font:400 11px/1.35 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#${ROOT_ID} .mb-wh__cards {
  display:grid !important;
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:20px 0 0 !important;
}
#${ROOT_ID} .mb-wh__card {
  min-width:0 !important;
  margin:0 !important;
  padding:14px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-wh__card-label {
  display:block !important;
  margin:0 0 7px !important;
  color:#000 !important;
  font:700 13px/1.35 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__card-value {
  display:block !important;
  margin:0 !important;
  color:#000 !important;
  font:800 18px/1.3 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__formula {
  margin:15px 0 0 !important;
  padding:12px 14px !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__warning {
  margin:15px 0 0 !important;
  padding:13px 15px !important;
  border:0 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-wh__privacy {
  margin:20px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 12px/1.5 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
@media (max-width:760px) {
  #${ROOT_ID} { margin:18px auto 30px !important; }
  #${ROOT_ID} .mb-wh { border-radius:14px !important; }
  #${ROOT_ID} .mb-wh__head { padding:28px 20px 22px !important; }
  #${ROOT_ID} .mb-wh__body { padding:24px 20px 28px !important; }
  #${ROOT_ID} .mb-wh__panel,
  #${ROOT_ID} .mb-wh__result { padding:18px !important; }
  #${ROOT_ID} .mb-wh__grid,
  #${ROOT_ID} .mb-wh__cards { grid-template-columns:1fr !important; }
  #${ROOT_ID} .mb-wh__actions {
    flex-direction:column !important;
    align-items:stretch !important;
  }
  #${ROOT_ID} .mb-wh__button { width:100% !important; }
  #${ROOT_ID} .mb-wh__score { font-size:36px !important; }
  #${ROOT_ID} .mb-wh__scale-labels { font-size:10px !important; }
}
@media (max-width:480px) {
  #${ROOT_ID} .mb-wh__scale-labels { font-size:9px !important; }
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
  #${ROOT_ID} .mb-wh { border:1px solid #bbb !important; box-shadow:none !important; }
  #${ROOT_ID} .mb-wh__actions,
  #${ROOT_ID} .mb-wh__privacy { display:none !important; }
  #${ROOT_ID} .mb-wh__result[hidden] { display:block !important; }
}
`;
    document.head.appendChild(style);
  }

  function render(root) {
    root.setAttribute('data-version', VERSION);
    root.innerHTML = '' +
      '<section class="mb-wh" role="region" aria-label="' + T.region_label + '" aria-labelledby="mb-wh-title">' +
        '<div class="mb-wh__head">' +
          '<h2 class="mb-wh__title" id="mb-wh-title">' + T.title + '</h2>' +
          '<p class="mb-wh__lead">' + T.lead + '</p>' +
        '</div>' +
        '<div class="mb-wh__body">' +
          '<div class="mb-wh__notice">' + T.notice + '</div>' +
          '<section class="mb-wh__panel">' +
            '<form class="mb-wh__form" novalidate>' +
              '<div class="mb-wh__grid">' +
                '<div class="mb-wh__field">' +
                  '<label class="mb-wh__label" for="mb-wh-height">' + T.height + '</label>' +
                  '<div class="mb-wh__input-wrap"><input class="mb-wh__input" id="mb-wh-height" name="height" type="text" inputmode="decimal" autocomplete="off" placeholder="175" aria-describedby="mb-wh-height-hint"><span class="mb-wh__unit" aria-hidden="true">cm</span></div>' +
                  '<span class="mb-wh__hint" id="mb-wh-height-hint">' + T.height_hint + '</span>' +
                '</div>' +
                '<div class="mb-wh__field">' +
                  '<label class="mb-wh__label" for="mb-wh-waist">' + T.waist + '</label>' +
                  '<div class="mb-wh__input-wrap"><input class="mb-wh__input" id="mb-wh-waist" name="waist" type="text" inputmode="decimal" autocomplete="off" placeholder="85" aria-describedby="mb-wh-waist-hint"><span class="mb-wh__unit" aria-hidden="true">cm</span></div>' +
                  '<span class="mb-wh__hint" id="mb-wh-waist-hint">' + T.waist_hint + '</span>' +
                '</div>' +
              '</div>' +
              '<div class="mb-wh__actions">' +
                '<button class="mb-wh__button mb-wh__button--primary" type="submit">' + T.calculate + '</button>' +
                '<button class="mb-wh__button mb-wh__button--secondary" type="button" data-action="reset">' + T.reset + '</button>' +
              '</div>' +
              '<div class="mb-wh__error" role="alert" aria-live="assertive"></div>' +
            '</form>' +
          '</section>' +
          '<div class="mb-wh__result" aria-live="polite" role="status" hidden>' +
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

      if (!Number.isFinite(height) || height < 100 || height > 250) {
        showError(T.errors.height, heightInput);
        return;
      }
      if (!Number.isFinite(waist) || waist < 30 || waist > 200) {
        showError(T.errors.waist, waistInput);
        return;
      }

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

      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      result.scrollIntoView({ behavior:reduceMotion ? 'auto' : 'smooth', block:'nearest' });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      calculate();
    });

    root.querySelector('[data-action="reset"]').addEventListener('click', function () {
      form.reset();
      clearError();
      result.hidden = true;
      root.querySelector('#mb-wh-height').focus();
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
