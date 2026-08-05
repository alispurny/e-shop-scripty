/**
 * MyBears — kalkulačka kalórií a makroživín (SK)
 * Zjednotený vizuálny systém podľa finálnej šablóny prevodníka krvných lipidov.
 * Funkčná logika, výpočtové vzťahy, interné ID a spôsob vloženia zostávajú zachované.
 *
 * Mount point:
 *   <div id="mb-calorie-macro-calculator"></div>
 *
 * Bez externých závislostí. Údaje sa neodosielajú ani neukladajú.
 */
(function () {
  'use strict';

  var ROOT_ID = 'mb-calorie-macro-calculator';
  var STYLE_ID = 'mb-calorie-macro-calculator-styles';
  var SCRIPT_VERSION = '3.0.0-sk';

  function init() {
    var root = document.getElementById(ROOT_ID);

    if (!root || root.getAttribute('data-mb-version') === SCRIPT_VERSION) {
      return;
    }

    root.setAttribute('data-mb-ready', 'true');
    root.setAttribute('data-mb-version', SCRIPT_VERSION);

    function addStyles() {
      var oldStyle = document.getElementById(STYLE_ID);
      if (oldStyle && oldStyle.parentNode) {
        oldStyle.parentNode.removeChild(oldStyle);
      }

      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = String.raw`
/* MyBears unified design layer — based on the final lipid converter template */
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
  --mb-protein:#5b8def !important;
  --mb-fat:#f0ad4e !important;
  --mb-carbs:#54b979 !important;
  width:100% !important;
  max-width:1120px !important;
  margin:24px auto 40px !important;
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  font-size:16px !important;
  font-weight:400 !important;
  line-height:1.55 !important;
}
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} *::before,
#${ROOT_ID} *::after {
  box-sizing:border-box !important;
}
#${ROOT_ID} button,
#${ROOT_ID} input,
#${ROOT_ID} select,
#${ROOT_ID} summary {
  font-family:Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} strong,
#${ROOT_ID} b {
  font-weight:700 !important;
}
#${ROOT_ID} .mb-cm {
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
#${ROOT_ID} .mb-cm::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-cm__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-cm__title,
#${ROOT_ID} .mb-cm__title {
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
#${ROOT_ID} h2.mb-cm__title::before,
#${ROOT_ID} h2.mb-cm__title::after,
#${ROOT_ID} .mb-cm__title::before,
#${ROOT_ID} .mb-cm__title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-cm__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-cm__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-cm__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__notice strong {
  color:#000 !important;
}
#${ROOT_ID} .mb-cm__grid {
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:16px !important;
  align-items:start !important;
}
#${ROOT_ID} .mb-cm__field {
  min-width:0 !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-cm__field--full {
  grid-column:1 / -1 !important;
}
#${ROOT_ID} label.mb-cm__label,
#${ROOT_ID} .mb-cm__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-cm__input-wrap {
  position:relative !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} input.mb-cm__input,
#${ROOT_ID} select.mb-cm__select,
#${ROOT_ID} .mb-cm__input,
#${ROOT_ID} .mb-cm__select {
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
#${ROOT_ID} input.mb-cm__input {
  padding-right:55px !important;
}
#${ROOT_ID} input.mb-cm__input:hover,
#${ROOT_ID} select.mb-cm__select:hover {
  border-color:#b9bdb7 !important;
}
#${ROOT_ID} input.mb-cm__input:focus,
#${ROOT_ID} select.mb-cm__select:focus,
#${ROOT_ID} input.mb-cm__input:focus-visible,
#${ROOT_ID} select.mb-cm__select:focus-visible {
  border-color:var(--mb-green-dark) !important;
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  box-shadow:none !important;
}
#${ROOT_ID} input.mb-cm__input::placeholder {
  color:#000 !important;
  opacity:.58 !important;
}
#${ROOT_ID} .mb-cm__unit {
  position:absolute !important;
  top:50% !important;
  right:12px !important;
  transform:translateY(-50%) !important;
  color:#000 !important;
  font:400 14px/1 Arial,Helvetica,sans-serif !important;
  pointer-events:none !important;
}
#${ROOT_ID} .mb-cm__hint {
  display:block !important;
  margin:7px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} details.mb-cm__advanced,
#${ROOT_ID} .mb-cm__advanced {
  margin:20px 0 0 !important;
  padding:0 !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} .mb-cm__advanced summary {
  display:list-item !important;
  margin:0 !important;
  padding:14px 16px !important;
  border:0 !important;
  background:transparent !important;
  color:#000 !important;
  font:700 15px/1.4 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  cursor:pointer !important;
}
#${ROOT_ID} .mb-cm__advanced[open] summary {
  border-bottom:1px solid var(--mb-border) !important;
}
#${ROOT_ID} .mb-cm__advanced-body {
  margin:0 !important;
  padding:18px 16px 17px !important;
}
#${ROOT_ID} .mb-cm__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} button.mb-cm__button,
#${ROOT_ID} .mb-cm__button {
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
  transition:background .15s ease,border-color .15s ease,color .15s ease,transform .15s ease !important;
  -webkit-appearance:none !important;
  appearance:none !important;
}
#${ROOT_ID} .mb-cm__button:hover {
  transform:translateY(-1px) !important;
}
#${ROOT_ID} .mb-cm__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-cm__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-cm__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-cm__button--secondary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-cm__button:focus-visible,
#${ROOT_ID} .mb-cm__advanced summary:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-cm__error {
  display:none !important;
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#000 !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__error.is-visible {
  display:block !important;
}
#${ROOT_ID} .mb-cm__result[hidden] {
  display:none !important;
}
#${ROOT_ID} .mb-cm__result {
  margin:24px 0 0 !important;
  padding:22px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:14px !important;
  background:var(--mb-green-soft) !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-cm__result-top {
  display:flex !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  flex-wrap:wrap !important;
  gap:16px !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-cm__result-label {
  margin:0 0 5px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__score-row {
  display:flex !important;
  align-items:baseline !important;
  flex-wrap:wrap !important;
  gap:8px !important;
}
#${ROOT_ID} .mb-cm__score {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 clamp(32px,5vw,40px)/1.08 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.03em !important;
  text-shadow:none !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} .mb-cm__score-unit {
  color:#000 !important;
  font:700 16px/1.25 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__method {
  display:inline-flex !important;
  align-items:center !important;
  min-height:34px !important;
  margin:0 !important;
  padding:6px 11px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:700 14px/1.3 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__summary {
  margin:14px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 15px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__metrics {
  display:grid !important;
  grid-template-columns:repeat(4,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:18px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-cm__metric,
#${ROOT_ID} .mb-cm__macro,
#${ROOT_ID} .mb-cm__meal {
  min-width:0 !important;
  margin:0 !important;
  padding:15px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-cm__metric-label {
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__metric-value {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:800 18px/1.3 Arial,Helvetica,sans-serif !important;
  overflow-wrap:anywhere !important;
}
#${ROOT_ID} h3.mb-cm__section-title,
#${ROOT_ID} .mb-cm__section-title {
  margin:22px 0 12px !important;
  padding:0 !important;
  border:0 !important;
  background:none !important;
  color:#000 !important;
  font:700 17px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} h3.mb-cm__section-title::before,
#${ROOT_ID} h3.mb-cm__section-title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-cm__macros {
  display:grid !important;
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-cm__macro-top {
  display:flex !important;
  align-items:center !important;
  gap:8px !important;
  margin:0 0 8px !important;
}
#${ROOT_ID} .mb-cm__dot {
  display:block !important;
  width:11px !important;
  height:11px !important;
  flex:0 0 11px !important;
  border-radius:50% !important;
}
#${ROOT_ID} .mb-cm__dot--protein {
  background:var(--mb-protein) !important;
}
#${ROOT_ID} .mb-cm__dot--fat {
  background:var(--mb-fat) !important;
}
#${ROOT_ID} .mb-cm__dot--carbs {
  background:var(--mb-carbs) !important;
}
#${ROOT_ID} .mb-cm__macro-name {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__macro-value {
  margin:0 0 5px !important;
  padding:0 !important;
  color:#000 !important;
  font:800 25px/1.2 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__macro-meta {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__bar {
  display:flex !important;
  overflow:hidden !important;
  width:100% !important;
  height:18px !important;
  margin:14px 0 0 !important;
  padding:0 !important;
  border-radius:999px !important;
  background:#e7ece9 !important;
  box-shadow:inset 0 0 0 1px rgba(32,34,31,.10) !important;
}
#${ROOT_ID} .mb-cm__bar-part {
  display:block !important;
  min-width:0 !important;
  height:100% !important;
}
#${ROOT_ID} .mb-cm__bar-protein {
  background:var(--mb-protein) !important;
}
#${ROOT_ID} .mb-cm__bar-fat {
  background:var(--mb-fat) !important;
}
#${ROOT_ID} .mb-cm__bar-carbs {
  background:var(--mb-carbs) !important;
}
#${ROOT_ID} .mb-cm__meal {
  margin-top:16px !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__formula {
  margin:16px 0 0 !important;
  padding:12px 14px !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__warnings {
  margin:16px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-cm__warning {
  margin:8px 0 0 !important;
  padding:13px 15px !important;
  border:0 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:8px !important;
  background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88)) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__disclaimer {
  margin:16px 0 0 !important;
  padding:14px 0 0 !important;
  border-top:1px solid #cfe4d7 !important;
  color:#000 !important;
  font:400 13px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-cm__privacy {
  margin:20px 0 0 !important;
  padding:0 !important;
  color:#000 !important;
  font:400 12px/1.5 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
/* Final Upgates protection: all textual content is black and uses the template font. */
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} button,
#${ROOT_ID} input,
#${ROOT_ID} select,
#${ROOT_ID} summary {
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  -webkit-text-fill-color:#000 !important;
}
@media (max-width:900px) {
  #${ROOT_ID} .mb-cm__metrics {
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  }
}
@media (max-width:760px) {
  #${ROOT_ID} {
    margin:18px auto 30px !important;
  }
  #${ROOT_ID} .mb-cm {
    border-radius:14px !important;
  }
  #${ROOT_ID} .mb-cm__head {
    padding:28px 20px 22px !important;
  }
  #${ROOT_ID} .mb-cm__body {
    padding:24px 20px 28px !important;
  }
  #${ROOT_ID} .mb-cm__grid,
  #${ROOT_ID} .mb-cm__macros {
    grid-template-columns:1fr !important;
  }
  #${ROOT_ID} .mb-cm__field--full {
    grid-column:auto !important;
  }
  #${ROOT_ID} .mb-cm__result {
    padding:18px !important;
  }
  #${ROOT_ID} .mb-cm__actions {
    flex-direction:column !important;
    align-items:stretch !important;
  }
  #${ROOT_ID} .mb-cm__button {
    width:100% !important;
  }
}
@media (max-width:480px) {
  #${ROOT_ID} .mb-cm__metrics {
    grid-template-columns:1fr !important;
  }
  #${ROOT_ID} .mb-cm__method {
    width:100% !important;
    justify-content:center !important;
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
  #${ROOT_ID} .mb-cm {
    border:1px solid #bbb !important;
    box-shadow:none !important;
  }
  #${ROOT_ID} .mb-cm__actions,
  #${ROOT_ID} .mb-cm__privacy {
    display:none !important;
  }
  #${ROOT_ID} .mb-cm__result[hidden] {
    display:block !important;
  }
}
`;
      document.head.appendChild(style);
    }

    function parseNumber(value) {
      if (typeof value !== 'string') {
        return NaN;
      }
      return Number(value.trim().replace(',', '.'));
    }

    function formatNumber(value, digits) {
      return new Intl.NumberFormat('sk-SK', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }).format(value);
    }

    function formatInteger(value) {
      return new Intl.NumberFormat('sk-SK', {
        maximumFractionDigits: 0
      }).format(Math.round(value));
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    addStyles();

    root.innerHTML = [
      '<section class="mb-cm" role="region" aria-labelledby="mb-cm-title">',
      '  <div class="mb-cm__head">',
      '    <h2 class="mb-cm__title" id="mb-cm-title">Kalkulačka kalórií a makroživín</h2>',
      '    <p class="mb-cm__lead">Odhadnite denný energetický príjem podľa cieľa a rozdeľte ho na bielkoviny, tuky a sacharidy.</p>',
      '  </div>',
      '  <div class="mb-cm__body">',
      '    <p class="mb-cm__notice"><strong>Dôležité:</strong> Výsledok je modelový odhad pre zdravých dospelých od 18 rokov. Nejde o liečebný jedálniček ani individuálne výživové odporúčanie.</p>',
      '    <form id="mb-cm-form" novalidate>',
      '      <div class="mb-cm__grid">',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-sex">Variant rovnice</label>',
      '          <select class="mb-cm__select" id="mb-cm-sex">',
      '            <option value="female">Žena</option>',
      '            <option value="male">Muž</option>',
      '          </select>',
      '          <span class="mb-cm__hint">Rovnica Mifflin–St Jeor používa dve rozdielne konštanty.</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-age">Vek</label>',
      '          <div class="mb-cm__input-wrap"><input class="mb-cm__input" id="mb-cm-age" inputmode="numeric" autocomplete="off" value="35" aria-describedby="mb-cm-age-hint"><span class="mb-cm__unit">rokov</span></div>',
      '          <span class="mb-cm__hint" id="mb-cm-age-hint">Povolený rozsah: 18–100 rokov</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-height">Výška</label>',
      '          <div class="mb-cm__input-wrap"><input class="mb-cm__input" id="mb-cm-height" inputmode="decimal" autocomplete="off" value="165" aria-describedby="mb-cm-height-hint"><span class="mb-cm__unit">cm</span></div>',
      '          <span class="mb-cm__hint" id="mb-cm-height-hint">Povolený rozsah: 100–250 cm</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-weight">Hmotnost</label>',
      '          <div class="mb-cm__input-wrap"><input class="mb-cm__input" id="mb-cm-weight" inputmode="decimal" autocomplete="off" value="65" aria-describedby="mb-cm-weight-hint"><span class="mb-cm__unit">kg</span></div>',
      '          <span class="mb-cm__hint" id="mb-cm-weight-hint">Povolený rozsah: 30–400 kg</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-activity">Úroveň aktivity (PAL)</label>',
      '          <select class="mb-cm__select" id="mb-cm-activity">',
      '            <option value="1.4">Nízka aktivita (PAL 1,4)</option>',
      '            <option value="1.6" selected>Stredná aktivita (PAL 1,6)</option>',
      '            <option value="1.8">Vysoká aktivita (PAL 1,8)</option>',
      '            <option value="2.0">Veľmi vysoká aktivita (PAL 2,0)</option>',
      '          </select>',
      '          <span class="mb-cm__hint">PAL je zjednodušený odhad celodennej pohybovej aktivity.</span>',
      '        </div>',
      '        <div class="mb-cm__field">',
      '          <label class="mb-cm__label" for="mb-cm-goal">Cieľ</label>',
      '          <select class="mb-cm__select" id="mb-cm-goal">',
      '            <option value="loss">Zníženie hmotnosti</option>',
      '            <option value="maintain" selected>Udržanie hmotnosti</option>',
      '            <option value="gain">Zvýšenie hmotnosti</option>',
      '          </select>',
      '          <span class="mb-cm__hint">Cieľ upravuje vypočítané TDEE o zvolené percento.</span>',
      '        </div>',
      '        <div class="mb-cm__field mb-cm__field--full">',
      '          <label class="mb-cm__label" for="mb-cm-rate">Modelová úprava oproti TDEE</label>',
      '          <select class="mb-cm__select" id="mb-cm-rate"></select>',
      '          <span class="mb-cm__hint">Percento je výpočtový scenár, nie záruka konkrétnej zmeny hmotnosti.</span>',
      '        </div>',
      '      </div>',
      '      <details class="mb-cm__advanced">',
      '        <summary>Pokročilé nastavenie makroživín</summary>',
      '        <div class="mb-cm__advanced-body">',
      '          <div class="mb-cm__grid">',
      '            <div class="mb-cm__field">',
      '              <label class="mb-cm__label" for="mb-cm-protein">Bielkoviny na kg hmotnosti</label>',
      '              <select class="mb-cm__select" id="mb-cm-protein">',
      '                <option value="0.83">0,83 g/kg – referenčný príjem EFSA</option>',
      '                <option value="1.2">1,2 g/kg – zvýšený príjem</option>',
      '                <option value="1.6" selected>1,6 g/kg – aktívny alebo redukčný režim</option>',
      '                <option value="2.0">2,0 g/kg – vysoký príjem</option>',
      '              </select>',
      '              <span class="mb-cm__hint">Výpočet používa aktuálnu hmotnosť, nie cieľovú hmotnosť.</span>',
      '            </div>',
      '            <div class="mb-cm__field">',
      '              <label class="mb-cm__label" for="mb-cm-fat">Podiel energie z tukov</label>',
      '              <select class="mb-cm__select" id="mb-cm-fat">',
      '                <option value="20">20 %</option>',
      '                <option value="25">25 %</option>',
      '                <option value="30" selected>30 %</option>',
      '                <option value="35">35 %</option>',
      '              </select>',
      '              <span class="mb-cm__hint">EFSA uvádza pre dospelých referenčný rozsah 20–35 % energie.</span>',
      '            </div>',
      '            <div class="mb-cm__field mb-cm__field--full">',
      '              <label class="mb-cm__label" for="mb-cm-meals">Počet jedál na orientačné rozdelenie</label>',
      '              <select class="mb-cm__select" id="mb-cm-meals">',
      '                <option value="3">3 jedlá</option>',
      '                <option value="4" selected>4 jedlá</option>',
      '                <option value="5">5 jedál</option>',
      '                <option value="6">6 jedál</option>',
      '              </select>',
      '            </div>',
      '          </div>',
      '        </div>',
      '      </details>',
      '      <div class="mb-cm__actions">',
      '        <button class="mb-cm__button mb-cm__button--primary" type="submit">Vypočítať príjem a makrá</button>',
      '        <button class="mb-cm__button mb-cm__button--secondary" type="button" id="mb-cm-reset">Vymazať údaje</button>',
      '      </div>',
      '      <div class="mb-cm__error" id="mb-cm-error" role="alert" aria-live="assertive"></div>',
      '    </form>',
      '    <section class="mb-cm__result" id="mb-cm-result" aria-live="polite" hidden>',
      '      <div class="mb-cm__result-top">',
      '        <div>',
      '          <p class="mb-cm__result-label">Orientačný denný energetický príjem podľa cieľa</p>',
      '          <div class="mb-cm__score-row"><p class="mb-cm__score" id="mb-cm-target">0</p><span class="mb-cm__score-unit">kcal / deň</span></div>',
      '        </div>',
      '        <span class="mb-cm__method" id="mb-cm-method">Udržanie hmotnosti</span>',
      '      </div>',
      '      <p class="mb-cm__summary" id="mb-cm-summary"></p>',
      '      <div class="mb-cm__metrics">',
      '        <div class="mb-cm__metric"><p class="mb-cm__metric-label">Pokojový výdaj (REE)</p><p class="mb-cm__metric-value" id="mb-cm-bmr">0 kcal</p></div>',
      '        <div class="mb-cm__metric"><p class="mb-cm__metric-label">Odhad TDEE</p><p class="mb-cm__metric-value" id="mb-cm-tdee">0 kcal</p></div>',
      '        <div class="mb-cm__metric"><p class="mb-cm__metric-label">Rozdiel oproti TDEE</p><p class="mb-cm__metric-value" id="mb-cm-difference">0 kcal</p></div>',
      '        <div class="mb-cm__metric"><p class="mb-cm__metric-label">Energie v kJ</p><p class="mb-cm__metric-value" id="mb-cm-kj">0 kJ</p></div>',
      '      </div>',
      '      <h3 class="mb-cm__section-title">Orientačné rozdelenie makroživín</h3>',
      '      <div class="mb-cm__macros">',
      '        <div class="mb-cm__macro"><div class="mb-cm__macro-top"><span class="mb-cm__dot mb-cm__dot--protein"></span><p class="mb-cm__macro-name">Bielkoviny</p></div><p class="mb-cm__macro-value" id="mb-cm-protein-value">0 g</p><p class="mb-cm__macro-meta" id="mb-cm-protein-meta"></p></div>',
      '        <div class="mb-cm__macro"><div class="mb-cm__macro-top"><span class="mb-cm__dot mb-cm__dot--fat"></span><p class="mb-cm__macro-name">Tuky</p></div><p class="mb-cm__macro-value" id="mb-cm-fat-value">0 g</p><p class="mb-cm__macro-meta" id="mb-cm-fat-meta"></p></div>',
      '        <div class="mb-cm__macro"><div class="mb-cm__macro-top"><span class="mb-cm__dot mb-cm__dot--carbs"></span><p class="mb-cm__macro-name">Sacharidy</p></div><p class="mb-cm__macro-value" id="mb-cm-carbs-value">0 g</p><p class="mb-cm__macro-meta" id="mb-cm-carbs-meta"></p></div>',
      '      </div>',
      '      <div class="mb-cm__bar" aria-label="Podiel energie z bielkovín, tukov a sacharidov">',
      '        <span class="mb-cm__bar-part mb-cm__bar-protein" id="mb-cm-bar-protein"></span>',
      '        <span class="mb-cm__bar-part mb-cm__bar-fat" id="mb-cm-bar-fat"></span>',
      '        <span class="mb-cm__bar-part mb-cm__bar-carbs" id="mb-cm-bar-carbs"></span>',
      '      </div>',
      '      <div class="mb-cm__meal" id="mb-cm-meal"></div>',
      '      <p class="mb-cm__formula" id="mb-cm-formula"></p>',
      '      <div class="mb-cm__warnings" id="mb-cm-warnings"></div>',
      '      <p class="mb-cm__disclaimer"><strong>Výsledok je orientačný.</strong> Skutočnú potrebu ovplyvňuje telesné zloženie, spontánny pohyb, intenzita tréningu, zdravotný stav, spánok, liečba aj dlhodobá adaptácia organizmu.</p>',
      '    </section>',
      '    <p class="mb-cm__privacy">Výpočet prebieha iba vo vašom prehliadači. Zadané údaje tento skript nikam neodosiela ani neukladá.</p>',
      '  </div>',
      '</section>'
    ].join('');

    var form = root.querySelector('#mb-cm-form');
    var goalInput = root.querySelector('#mb-cm-goal');
    var rateInput = root.querySelector('#mb-cm-rate');
    var errorBox = root.querySelector('#mb-cm-error');
    var resultBox = root.querySelector('#mb-cm-result');

    var rateOptions = {
      loss: [
        { value: '-0.10', label: 'Mierny deficit −10 %' },
        { value: '-0.15', label: 'Stredný deficit −15 %', selected: true },
        { value: '-0.20', label: 'Vyšší deficit −20 %' }
      ],
      maintain: [
        { value: '0', label: 'Bez úpravy – 100 % odhadovaného TDEE', selected: true }
      ],
      gain: [
        { value: '0.05', label: 'Mierny nadbytok +5 %', selected: true },
        { value: '0.10', label: 'Stredný nadbytok +10 %' },
        { value: '0.15', label: 'Vyšší nadbytok +15 %' }
      ]
    };

    function updateRateOptions() {
      var options = rateOptions[goalInput.value] || rateOptions.maintain;
      rateInput.innerHTML = options.map(function (item) {
        return '<option value="' + item.value + '"' + (item.selected ? ' selected' : '') + '>' + escapeHtml(item.label) + '</option>';
      }).join('');
    }

    function showError(messages) {
      errorBox.innerHTML = messages.map(function (message) {
        return '<div>' + escapeHtml(message) + '</div>';
      }).join('');
      errorBox.classList.add('is-visible');
      resultBox.hidden = true;
    }

    function clearError() {
      errorBox.textContent = '';
      errorBox.classList.remove('is-visible');
    }

    function getGoalLabel(goal, delta) {
      if (goal === 'loss') {
        return 'Zníženie hmotnosti ' + Math.abs(Math.round(delta * 100)) + ' % pod TDEE';
      }
      if (goal === 'gain') {
        return 'Zvýšenie hmotnosti ' + Math.round(delta * 100) + ' % nad TDEE';
      }
      return 'Udržanie hmotnosti';
    }

    function calculate(event) {
      if (event) {
        event.preventDefault();
      }

      clearError();

      var sex = root.querySelector('#mb-cm-sex').value;
      var age = parseNumber(root.querySelector('#mb-cm-age').value);
      var height = parseNumber(root.querySelector('#mb-cm-height').value);
      var weight = parseNumber(root.querySelector('#mb-cm-weight').value);
      var pal = parseNumber(root.querySelector('#mb-cm-activity').value);
      var goal = goalInput.value;
      var delta = parseNumber(rateInput.value);
      var proteinPerKg = parseNumber(root.querySelector('#mb-cm-protein').value);
      var fatPercent = parseNumber(root.querySelector('#mb-cm-fat').value);
      var meals = parseNumber(root.querySelector('#mb-cm-meals').value);
      var errors = [];

      if (!Number.isFinite(age) || age < 18 || age > 100) {
        errors.push('Zadajte vek v rozsahu 18 až 100 rokov.');
      }
      if (!Number.isFinite(height) || height < 100 || height > 250) {
        errors.push('Zadajte výšku v rozsahu 100 až 250 cm.');
      }
      if (!Number.isFinite(weight) || weight < 30 || weight > 400) {
        errors.push('Zadajte hmotnosť v rozsahu 30 až 400 kg.');
      }
      if (!Number.isFinite(pal) || pal < 1.2 || pal > 2.5) {
        errors.push('Vyberte platnú úroveň aktivity.');
      }
      if (!Number.isFinite(delta) || delta < -0.5 || delta > 0.5) {
        errors.push('Vyberte platnú modelovú úpravu príjmu.');
      }
      if (!Number.isFinite(proteinPerKg) || proteinPerKg < 0.5 || proteinPerKg > 3.0) {
        errors.push('Vyberte platné množstvo bielkovín.');
      }
      if (!Number.isFinite(fatPercent) || fatPercent < 15 || fatPercent > 45) {
        errors.push('Vyberte platný podiel tukov.');
      }

      if (errors.length) {
        showError(errors);
        return;
      }

      var constant = sex === 'male' ? 5 : -161;
      var ree = (10 * weight) + (6.25 * height) - (5 * age) + constant;
      var tdee = ree * pal;
      var target = tdee * (1 + delta);
      var proteinGrams = weight * proteinPerKg;
      var proteinCalories = proteinGrams * 4;
      var fatCalories = target * (fatPercent / 100);
      var fatGrams = fatCalories / 9;
      var carbsCalories = target - proteinCalories - fatCalories;

      if (carbsCalories <= 0) {
        showError(['Zvolená kombinácia energetického príjmu, bielkovín a tukov nenecháva priestor pre sacharidy. Znížte množstvo bielkovín alebo tukov, prípadne zvoľte vyšší energetický príjem.']);
        return;
      }

      var carbsGrams = carbsCalories / 4;
      var proteinPercent = (proteinCalories / target) * 100;
      var carbsPercent = (carbsCalories / target) * 100;
      var targetKj = target * 4.184;
      var difference = target - tdee;
      var bmi = weight / Math.pow(height / 100, 2);
      var warnings = [];

      if (target < ree) {
        warnings.push('Vypočítaný príjem je nižší než odhadovaný pokojový výdaj. BMR nie je pevná bezpečnostná hranica, ale takéto nastavenie je vhodné posudzovať individuálne s odborníkom.');
      }
      if (carbsPercent < 45 || carbsPercent > 60) {
        warnings.push('Sacharidy tvoria približne ' + formatNumber(carbsPercent, 0) + ' % energie. To je mimo referenčný rozsah EFSA 45–60 %; výsledok vznikol z vami zvoleného množstva bielkovín a tukov.');
      }
      if (bmi >= 30 && proteinPerKg > 1.2) {
        warnings.push('Pri vyššom BMI môže výpočet bielkovín z aktuálnej hmotnosti poskytovať vysokú hodnotu. Vhodný základ výpočtu je možné individualizovať podľa telesného zloženia a zdravotného stavu.');
      }
      if (carbsGrams < 50) {
        warnings.push('Výsledné množstvo sacharidov je veľmi nízke. Takéto rozdelenie nie je vhodné automaticky používať bez posúdenia celého jedálnička a zdravotného stavu.');
      }

      root.querySelector('#mb-cm-target').textContent = formatInteger(target);
      root.querySelector('#mb-cm-method').textContent = getGoalLabel(goal, delta);
      root.querySelector('#mb-cm-summary').textContent = goal === 'maintain'
        ? 'Modelový príjem zodpovedá vypočítanému TDEE. Skutočný udržiavací príjem sa môže od odhadu líšiť a overuje sa podľa dlhodobého vývoja hmotnosti a ďalších ukazovateľov.'
        : 'Modelový príjem je nastavený o ' + Math.abs(Math.round(delta * 100)) + ' % ' + (delta < 0 ? 'nižšie' : 'vyššie') + ' než vypočítané TDEE. Výsledok nezaručuje konkrétnu rýchlosť zmeny hmotnosti.';
      root.querySelector('#mb-cm-bmr').textContent = formatInteger(ree) + ' kcal';
      root.querySelector('#mb-cm-tdee').textContent = formatInteger(tdee) + ' kcal';
      root.querySelector('#mb-cm-difference').textContent = (difference > 0 ? '+' : '') + formatInteger(difference) + ' kcal';
      root.querySelector('#mb-cm-kj').textContent = formatInteger(targetKj) + ' kJ';

      root.querySelector('#mb-cm-protein-value').textContent = formatNumber(proteinGrams, 1) + ' g';
      root.querySelector('#mb-cm-protein-meta').textContent = formatInteger(proteinCalories) + ' kcal · ' + formatNumber(proteinPercent, 0) + ' % energie · ' + formatNumber(proteinPerKg, proteinPerKg === 0.83 ? 2 : 1) + ' g/kg';
      root.querySelector('#mb-cm-fat-value').textContent = formatNumber(fatGrams, 1) + ' g';
      root.querySelector('#mb-cm-fat-meta').textContent = formatInteger(fatCalories) + ' kcal · ' + formatNumber(fatPercent, 0) + ' % energie';
      root.querySelector('#mb-cm-carbs-value').textContent = formatNumber(carbsGrams, 1) + ' g';
      root.querySelector('#mb-cm-carbs-meta').textContent = formatInteger(carbsCalories) + ' kcal · ' + formatNumber(carbsPercent, 0) + ' % energie';

      root.querySelector('#mb-cm-bar-protein').style.width = Math.max(0, proteinPercent) + '%';
      root.querySelector('#mb-cm-bar-fat').style.width = Math.max(0, fatPercent) + '%';
      root.querySelector('#mb-cm-bar-carbs').style.width = Math.max(0, carbsPercent) + '%';

      root.querySelector('#mb-cm-meal').innerHTML = '<strong>Orientačný priemer na jedno zo ' + meals + ' jedál:</strong> ' +
        formatInteger(target / meals) + ' kcal, ' +
        formatNumber(proteinGrams / meals, 1) + ' g bielkovín, ' +
        formatNumber(fatGrams / meals, 1) + ' g tukov a ' +
        formatNumber(carbsGrams / meals, 1) + ' g sacharidov. Reálne jedlá nemusia byť rozdelené rovnomerne.';

      root.querySelector('#mb-cm-formula').textContent = 'Výpočet: REE ' + formatInteger(ree) + ' kcal × PAL ' + formatNumber(pal, 1) + ' = TDEE ' + formatInteger(tdee) + ' kcal; cieľ ' + (delta >= 0 ? '+' : '') + formatNumber(delta * 100, 0) + ' % = ' + formatInteger(target) + ' kcal. Bielkoviny majú 4 kcal/g, tuky 9 kcal/g a sacharidy 4 kcal/g.';

      root.querySelector('#mb-cm-warnings').innerHTML = warnings.map(function (warning) {
        return '<p class="mb-cm__warning"><strong>Upozornenie:</strong> ' + escapeHtml(warning) + '</p>';
      }).join('');

      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    }

    function resetForm() {
      form.reset();
      updateRateOptions();
      clearError();
      resultBox.hidden = true;
      root.querySelector('#mb-cm-age').focus();
    }

    goalInput.addEventListener('change', updateRateOptions);
    form.addEventListener('submit', calculate);
    root.querySelector('#mb-cm-reset').addEventListener('click', resetForm);

    updateRateOptions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
