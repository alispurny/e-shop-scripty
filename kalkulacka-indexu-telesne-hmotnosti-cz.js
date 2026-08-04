/**
 * MyBears — sjednocená grafická verze 2.0 (CZ)
 * Vizuální systém vychází z MyBears Product Guide v1.8.
 * Funkční logika, výpočty, interní ID, URL a veřejné API zůstávají zachované.
 */
(function () {
  'use strict';

  var ROOT_ID = 'mb-bmi-calculator';
  var STYLE_ID = 'mb-bmi-calculator-styles';
  var SCRIPT_VERSION = '4.1.0-cz';
  var SCALE_MIN_BMI = 14;
  var SCALE_MAX_BMI = 40;
  var SCALE_UNDERWEIGHT_END = 18.5;
  var SCALE_HEALTHY_END = 25;
  var SCALE_OVERWEIGHT_END = 30;
  var root = document.getElementById(ROOT_ID);

  if (!root || root.getAttribute('data-mb-version') === SCRIPT_VERSION) {
    return;
  }

  /*
   * V4 záměrně přepíše i starší instanci kalkulačky. Díky tomu nebude
   * původní skript s chybnou stupnicí vítězit, pokud jej stránka nebo cache
   * načte dříve než tento soubor.
   */
  root.setAttribute('data-mb-ready', 'true');
  root.setAttribute('data-mb-version', SCRIPT_VERSION);

  function addStyles() {
    var oldStyle = document.getElementById(STYLE_ID);
    if (oldStyle && oldStyle.parentNode) {
      oldStyle.parentNode.removeChild(oldStyle);
    }

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '#' + ROOT_ID + ' { --mb-green: #2dc26b; --mb-green-dark: #168947; --mb-green-soft: #f7fbf8; --mb-border: #d9e5dd; --mb-text: #1f2933; --mb-muted: #59636e; --mb-danger: #b42318; --mb-warning: #9a6700; font-family: Arial, Helvetica, sans-serif; color: var(--mb-text); margin: 24px 0; }',
      '#' + ROOT_ID + ' * { box-sizing: border-box; }',
      '#' + ROOT_ID + ' .mb-bmi { border: 1px solid var(--mb-border); border-radius: 14px; background: #ffffff; box-shadow: 0 8px 28px rgba(31, 41, 51, 0.08); overflow: hidden; }',
      '#' + ROOT_ID + ' .mb-bmi__head { padding: 22px 22px 16px; background: var(--mb-green-soft); border-bottom: 1px solid var(--mb-border); }',
      '#' + ROOT_ID + ' .mb-bmi__title { margin: 0 0 8px; font-size: 22px; line-height: 1.25; }',
      '#' + ROOT_ID + ' .mb-bmi__lead { margin: 0; color: var(--mb-muted); font-size: 16px; line-height: 1.55; }',
      '#' + ROOT_ID + ' .mb-bmi__body { padding: 22px; }',
      '#' + ROOT_ID + ' .mb-bmi__notice { margin: 0 0 18px; padding: 12px 14px; border-left: 4px solid var(--mb-green); border-radius: 6px; background: #f8faf9; color: var(--mb-muted); font-size: 14px; line-height: 1.5; }',
      '#' + ROOT_ID + ' .mb-bmi__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }',
      '#' + ROOT_ID + ' .mb-bmi__field { min-width: 0; }',
      '#' + ROOT_ID + ' .mb-bmi__label { display: block; margin: 0 0 7px; font-weight: 700; font-size: 15px; }',
      '#' + ROOT_ID + ' .mb-bmi__input-wrap { position: relative; }',
      '#' + ROOT_ID + ' .mb-bmi__input { width: 100%; min-height: 48px; padding: 11px 52px 11px 12px; border: 1px solid #b9c6be; border-radius: 8px; background: #ffffff; color: var(--mb-text); font: inherit; font-size: 16px; line-height: 1.3; }',
      '#' + ROOT_ID + ' .mb-bmi__input:focus { outline: 3px solid rgba(45, 194, 107, 0.2); border-color: var(--mb-green-dark); }',
      '#' + ROOT_ID + ' .mb-bmi__unit { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--mb-muted); font-size: 14px; pointer-events: none; }',
      '#' + ROOT_ID + ' .mb-bmi__hint { display: block; margin-top: 6px; color: var(--mb-muted); font-size: 13px; line-height: 1.4; }',
      '#' + ROOT_ID + ' .mb-bmi__error { display: none; margin: 16px 0 0; padding: 12px 14px; border: 1px solid #f1b5b0; border-radius: 8px; background: #fff6f5; color: var(--mb-danger); font-size: 14px; line-height: 1.45; }',
      '#' + ROOT_ID + ' .mb-bmi__error.is-visible { display: block; }',
      '#' + ROOT_ID + ' .mb-bmi__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }',
      '#' + ROOT_ID + ' .mb-bmi__button { min-height: 46px; padding: 11px 20px; border-radius: 8px; border: 1px solid transparent; font: inherit; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease; }',
      '#' + ROOT_ID + ' .mb-bmi__button:hover { transform: translateY(-1px); }',
      '#' + ROOT_ID + ' .mb-bmi__button:focus-visible { outline: 3px solid rgba(45, 194, 107, 0.28); outline-offset: 2px; }',
      '#' + ROOT_ID + ' .mb-bmi__button--primary { background: var(--mb-green); color: #0c2818; border-color: var(--mb-green); box-shadow: 0 4px 12px rgba(45, 194, 107, 0.22); }',
      '#' + ROOT_ID + ' .mb-bmi__button--primary:hover { background: #28b862; }',
      '#' + ROOT_ID + ' .mb-bmi__button--secondary { background: #ffffff; color: var(--mb-text); border-color: #b9c6be; }',
      '#' + ROOT_ID + ' .mb-bmi__result { margin-top: 22px; padding: 20px; border: 1px solid #b8e7ca; border-radius: 12px; background: var(--mb-green-soft); }',
      '#' + ROOT_ID + ' .mb-bmi__result[hidden] { display: none; }',
      '#' + ROOT_ID + ' .mb-bmi__result-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }',
      '#' + ROOT_ID + ' .mb-bmi__result-label { margin: 0 0 4px; color: var(--mb-muted); font-size: 14px; font-weight: 700; }',
      '#' + ROOT_ID + ' .mb-bmi__score { margin: 0; font-size: 42px; line-height: 1; font-weight: 800; letter-spacing: -0.03em; }',
      '#' + ROOT_ID + ' .mb-bmi__category { display: inline-flex; align-items: center; min-height: 34px; padding: 6px 11px; border-radius: 999px; background: #ffffff; border: 1px solid #b9c6be; font-size: 14px; font-weight: 700; }',
      '#' + ROOT_ID + ' .mb-bmi__summary { margin: 14px 0 0; font-size: 15px; line-height: 1.55; }',
      '#' + ROOT_ID + ' .mb-bmi__scale-wrap { margin-top: 20px; }',
      '#' + ROOT_ID + ' .mb-bmi__scale-title { margin: 0 0 9px; font-size: 14px; font-weight: 700; }',
      '#' + ROOT_ID + ' .mb-bmi__scale { position: relative; height: 16px; border-radius: 999px; overflow: visible; background: linear-gradient(to right, #9ec5e5 0%, #9ec5e5 17.307692%, #6fcf97 17.307692%, #6fcf97 42.307692%, #f1c75b 42.307692%, #f1c75b 61.538461%, #e58b82 61.538461%, #e58b82 100%); }',
      '#' + ROOT_ID + ' .mb-bmi__segment { display: none; }',
      '#' + ROOT_ID + ' .mb-bmi__marker { position: absolute; z-index: 2; top: -5px; width: 4px; height: 26px; border-radius: 4px; background: #111827; transform: translateX(-50%); box-shadow: 0 0 0 2px #ffffff; }',
      '#' + ROOT_ID + ' .mb-bmi__scale-labels { display: grid; grid-template-columns: 17.307692% 25% 19.230769% 38.461539%; gap: 0; margin-top: 8px; color: var(--mb-muted); font-size: 11px; line-height: 1.3; text-align: center; }',
      '#' + ROOT_ID + ' .mb-bmi__details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }',
      '#' + ROOT_ID + ' .mb-bmi__detail { padding: 14px; border-radius: 9px; background: #ffffff; border: 1px solid var(--mb-border); }',
      '#' + ROOT_ID + ' .mb-bmi__detail-label { margin: 0 0 6px; color: var(--mb-muted); font-size: 13px; font-weight: 700; }',
      '#' + ROOT_ID + ' .mb-bmi__detail-value { margin: 0; font-size: 17px; line-height: 1.35; font-weight: 700; }',
      '#' + ROOT_ID + ' .mb-bmi__formula { margin: 14px 0 0; color: var(--mb-muted); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }',
      '#' + ROOT_ID + ' .mb-bmi__result-note { margin: 16px 0 0; padding-top: 14px; border-top: 1px solid #cde8d6; color: var(--mb-muted); font-size: 13px; line-height: 1.5; }',
      '#' + ROOT_ID + ' .mb-bmi__privacy { margin: 16px 0 0; color: var(--mb-muted); font-size: 12px; line-height: 1.45; }',
      '@media (max-width: 640px) {',
      '  #' + ROOT_ID + ' .mb-bmi__head, #' + ROOT_ID + ' .mb-bmi__body { padding-left: 16px; padding-right: 16px; }',
      '  #' + ROOT_ID + ' .mb-bmi__grid, #' + ROOT_ID + ' .mb-bmi__details { grid-template-columns: 1fr; }',
      '  #' + ROOT_ID + ' .mb-bmi__button { width: 100%; }',
      '  #' + ROOT_ID + ' .mb-bmi__score { font-size: 38px; }',
      '  #' + ROOT_ID + ' .mb-bmi__scale-labels { font-size: 10px; }',
      '}',
      '@media (prefers-reduced-motion: reduce) {',
      '  #' + ROOT_ID + ' .mb-bmi__button { transition: none; }',
      '}'
    ].join('\n');

    document.head.appendChild(style);
  }

  function parseCzechNumber(value) {
    if (typeof value !== 'string') {
      return NaN;
    }

    return Number(value.trim().replace(/\s+/g, '').replace(',', '.'));
  }

  function formatNumber(value, digits) {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  }

  function getCategory(bmi) {
    if (bmi < 18.5) {
      return {
        label: 'Podváha',
        key: 'underweight',
        summary: 'Výsledek spadá do pásma podváhy. BMI samo neukazuje příčinu nižší hmotnosti ani stav výživy.'
      };
    }

    if (bmi < 25) {
      return {
        label: 'Běžné rozmezí',
        key: 'healthy',
        summary: 'Výsledek spadá do běžného referenčního rozmezí BMI pro dospělé. Celkový zdravotní stav ale nelze posoudit pouze podle BMI.'
      };
    }

    if (bmi < 30) {
      return {
        label: 'Nadváha',
        key: 'overweight',
        summary: 'Výsledek spadá do pásma nadváhy. Pro přesnější posouzení má smysl zohlednit také obvod pasu, tělesné složení a další zdravotní ukazatele.'
      };
    }

    if (bmi < 35) {
      return {
        label: 'Obezita I. stupně',
        key: 'obesity-1',
        summary: 'Výsledek spadá do pásma obezity I. stupně. BMI je orientační screeningový údaj, nikoliv samostatná diagnóza.'
      };
    }

    if (bmi < 40) {
      return {
        label: 'Obezita II. stupně',
        key: 'obesity-2',
        summary: 'Výsledek spadá do pásma obezity II. stupně. Individuální význam je vhodné posoudit společně s lékařem a dalšími zdravotními ukazateli.'
      };
    }

    return {
      label: 'Obezita III. stupně',
      key: 'obesity-3',
      summary: 'Výsledek spadá do pásma obezity III. stupně. Pro bezpečné posouzení zdravotního stavu a dalšího postupu je vhodná konzultace s lékařem.'
    };
  }

  function markerPosition(bmi) {
    var clamped = Math.min(Math.max(bmi, SCALE_MIN_BMI), SCALE_MAX_BMI);

    /* Přesné hranice barevných úseků na stupnici 14 až 40. */
    var underweightWidth = ((SCALE_UNDERWEIGHT_END - SCALE_MIN_BMI) / (SCALE_MAX_BMI - SCALE_MIN_BMI)) * 100;
    var healthyWidth = ((SCALE_HEALTHY_END - SCALE_UNDERWEIGHT_END) / (SCALE_MAX_BMI - SCALE_MIN_BMI)) * 100;
    var overweightWidth = ((SCALE_OVERWEIGHT_END - SCALE_HEALTHY_END) / (SCALE_MAX_BMI - SCALE_MIN_BMI)) * 100;
    var obesityStart = underweightWidth + healthyWidth + overweightWidth;

    if (clamped <= SCALE_UNDERWEIGHT_END) {
      return ((clamped - SCALE_MIN_BMI) / (SCALE_UNDERWEIGHT_END - SCALE_MIN_BMI)) * underweightWidth;
    }

    if (clamped <= SCALE_HEALTHY_END) {
      return underweightWidth + ((clamped - SCALE_UNDERWEIGHT_END) / (SCALE_HEALTHY_END - SCALE_UNDERWEIGHT_END)) * healthyWidth;
    }

    if (clamped <= SCALE_OVERWEIGHT_END) {
      return underweightWidth + healthyWidth + ((clamped - SCALE_HEALTHY_END) / (SCALE_OVERWEIGHT_END - SCALE_HEALTHY_END)) * overweightWidth;
    }

    return obesityStart + ((clamped - SCALE_OVERWEIGHT_END) / (SCALE_MAX_BMI - SCALE_OVERWEIGHT_END)) * (100 - obesityStart);
  }

  addStyles();

  root.innerHTML = [
    '<section class="mb-bmi" aria-labelledby="mb-bmi-title">',
    '  <div class="mb-bmi__head">',
    '    <h2 class="mb-bmi__title" id="mb-bmi-title">BMI kalkulačka pro dospělé</h2>',
    '    <p class="mb-bmi__lead">Zadejte svou výšku a hmotnost. Kalkulačka vypočítá BMI, orientační kategorii a hmotnostní rozmezí odpovídající BMI 18,5–24,9.</p>',
    '  </div>',
    '  <div class="mb-bmi__body">',
    '    <p class="mb-bmi__notice"><strong>Důležité:</strong> Kalkulačka je určena pro dospělé od 18 let. Není určena pro děti, dospívající ani pro hodnocení hmotnosti v těhotenství.</p>',
    '    <form id="mb-bmi-form" novalidate>',
    '      <div class="mb-bmi__grid">',
    '        <div class="mb-bmi__field">',
    '          <label class="mb-bmi__label" for="mb-bmi-height">Výška</label>',
    '          <div class="mb-bmi__input-wrap">',
    '            <input class="mb-bmi__input" id="mb-bmi-height" name="height" type="text" inputmode="decimal" autocomplete="off" placeholder="např. 172" aria-describedby="mb-bmi-height-hint">',
    '            <span class="mb-bmi__unit" aria-hidden="true">cm</span>',
    '          </div>',
    '          <span class="mb-bmi__hint" id="mb-bmi-height-hint">Povolené rozmezí: 100–250 cm</span>',
    '        </div>',
    '        <div class="mb-bmi__field">',
    '          <label class="mb-bmi__label" for="mb-bmi-weight">Hmotnost</label>',
    '          <div class="mb-bmi__input-wrap">',
    '            <input class="mb-bmi__input" id="mb-bmi-weight" name="weight" type="text" inputmode="decimal" autocomplete="off" placeholder="např. 74,5" aria-describedby="mb-bmi-weight-hint">',
    '            <span class="mb-bmi__unit" aria-hidden="true">kg</span>',
    '          </div>',
    '          <span class="mb-bmi__hint" id="mb-bmi-weight-hint">Povolené rozmezí: 20–400 kg</span>',
    '        </div>',
    '      </div>',
    '      <div class="mb-bmi__error" id="mb-bmi-error" role="alert" aria-live="assertive"></div>',
    '      <div class="mb-bmi__actions">',
    '        <button class="mb-bmi__button mb-bmi__button--primary" type="submit">Vypočítat BMI</button>',
    '        <button class="mb-bmi__button mb-bmi__button--secondary" type="reset">Vymazat údaje</button>',
    '      </div>',
    '    </form>',
    '    <section class="mb-bmi__result" id="mb-bmi-result" aria-live="polite" tabindex="-1" hidden>',
    '      <div class="mb-bmi__result-top">',
    '        <div>',
    '          <p class="mb-bmi__result-label">Vaše orientační BMI</p>',
    '          <p class="mb-bmi__score" id="mb-bmi-score">–</p>',
    '        </div>',
    '        <span class="mb-bmi__category" id="mb-bmi-category">–</span>',
    '      </div>',
    '      <p class="mb-bmi__summary" id="mb-bmi-summary"></p>',
    '      <div class="mb-bmi__scale-wrap" aria-hidden="true">',
    '        <p class="mb-bmi__scale-title">Orientační zařazení výsledku</p>',
    '        <div class="mb-bmi__scale">',
    '          <span class="mb-bmi__segment"></span>',
    '          <span class="mb-bmi__segment"></span>',
    '          <span class="mb-bmi__segment"></span>',
    '          <span class="mb-bmi__segment"></span>',
    '          <span class="mb-bmi__marker" id="mb-bmi-marker"></span>',
    '        </div>',
    '        <div class="mb-bmi__scale-labels">',
    '          <span>Podváha<br>&lt; 18,5</span>',
    '          <span>Běžné<br>18,5–24,9</span>',
    '          <span>Nadváha<br>25–29,9</span>',
    '          <span>Obezita<br>30 a více</span>',
    '        </div>',
    '      </div>',
    '      <div class="mb-bmi__details">',
    '        <div class="mb-bmi__detail">',
    '          <p class="mb-bmi__detail-label">Orientační hmotnostní rozmezí</p>',
    '          <p class="mb-bmi__detail-value" id="mb-bmi-range">–</p>',
    '        </div>',
    '        <div class="mb-bmi__detail">',
    '          <p class="mb-bmi__detail-label">Zadané údaje</p>',
    '          <p class="mb-bmi__detail-value" id="mb-bmi-inputs">–</p>',
    '        </div>',
    '      </div>',
    '      <p class="mb-bmi__formula" id="mb-bmi-formula"></p>',
    '      <p class="mb-bmi__result-note"><strong>Výsledek je orientační.</strong> BMI nerozlišuje tukovou, svalovou a kostní hmotu a samo o sobě neurčuje zdravotní stav. Při nechtěném úbytku či nárůstu hmotnosti nebo zdravotních potížích se obraťte na lékaře.</p>',
    '    </section>',
    '    <p class="mb-bmi__privacy">Výpočet probíhá pouze ve vašem prohlížeči. Zadaná výška ani hmotnost se tímto skriptem nikam neodesílají ani neukládají.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  var form = document.getElementById('mb-bmi-form');
  var heightInput = document.getElementById('mb-bmi-height');
  var weightInput = document.getElementById('mb-bmi-weight');
  var errorBox = document.getElementById('mb-bmi-error');
  var resultBox = document.getElementById('mb-bmi-result');
  var scoreEl = document.getElementById('mb-bmi-score');
  var categoryEl = document.getElementById('mb-bmi-category');
  var summaryEl = document.getElementById('mb-bmi-summary');
  var markerEl = document.getElementById('mb-bmi-marker');
  var rangeEl = document.getElementById('mb-bmi-range');
  var inputsEl = document.getElementById('mb-bmi-inputs');
  var formulaEl = document.getElementById('mb-bmi-formula');

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.add('is-visible');
    resultBox.hidden = true;
  }

  function clearError() {
    errorBox.textContent = '';
    errorBox.classList.remove('is-visible');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearError();

    var heightCm = parseCzechNumber(heightInput.value);
    var weightKg = parseCzechNumber(weightInput.value);

    if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) {
      showError('Vyplňte prosím výšku i hmotnost jako číslo. Můžete použít desetinnou čárku nebo tečku.');
      return;
    }

    if (heightCm < 100 || heightCm > 250) {
      showError('Zkontrolujte zadanou výšku. Kalkulačka přijímá hodnoty od 100 do 250 cm.');
      heightInput.focus();
      return;
    }

    if (weightKg < 20 || weightKg > 400) {
      showError('Zkontrolujte zadanou hmotnost. Kalkulačka přijímá hodnoty od 20 do 400 kg.');
      weightInput.focus();
      return;
    }

    var heightM = heightCm / 100;
    var rawBmi = weightKg / (heightM * heightM);
    var bmi = Math.round((rawBmi + Number.EPSILON) * 10) / 10;
    var category = getCategory(bmi);
    var lowerWeight = 18.5 * heightM * heightM;
    var upperWeight = 24.9 * heightM * heightM;

    scoreEl.textContent = formatNumber(bmi, 1);
    categoryEl.textContent = category.label;
    categoryEl.setAttribute('data-category', category.key);
    summaryEl.textContent = category.summary;
    var position = markerPosition(bmi);
    markerEl.style.left = position.toFixed(6) + '%';
    markerEl.setAttribute('title', 'BMI ' + formatNumber(bmi, 1) + ' – ' + category.label);
    markerEl.setAttribute('data-bmi', bmi.toFixed(1));
    markerEl.setAttribute('data-position', position.toFixed(6));
    rangeEl.textContent = formatNumber(lowerWeight, 1) + '–' + formatNumber(upperWeight, 1) + ' kg';
    inputsEl.textContent = formatNumber(heightCm, 1) + ' cm / ' + formatNumber(weightKg, 1) + ' kg';
    formulaEl.textContent = 'Výpočet: ' + formatNumber(weightKg, 1) + ' kg ÷ (' + formatNumber(heightM, 2) + ' m × ' + formatNumber(heightM, 2) + ' m) = BMI ' + formatNumber(bmi, 1) + '.';

    resultBox.hidden = false;
    resultBox.focus({ preventScroll: true });
  });

  form.addEventListener('reset', function () {
    window.setTimeout(function () {
      clearError();
      resultBox.hidden = true;
      scoreEl.textContent = '–';
      categoryEl.textContent = '–';
      summaryEl.textContent = '';
      rangeEl.textContent = '–';
      inputsEl.textContent = '–';
      formulaEl.textContent = '';
      markerEl.style.left = '0%';
      markerEl.removeAttribute('data-bmi');
      markerEl.removeAttribute('data-position');
      heightInput.focus();
    }, 0);
  });
}());

/* MyBears sjednocená grafická vrstva 2.0 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || document.getElementById('mb-unified-kalkulacka-indexu-telesne-hmotnosti-styles')) return;
  var style = document.createElement('style');
  style.id = 'mb-unified-kalkulacka-indexu-telesne-hmotnosti-styles';
  style.textContent = String.raw`/* MyBears unified design layer — Product Guide v1.8 */
#mb-bmi-calculator{--mb-green:#2dc26b!important;--mb-green-dark:#198d4b!important;--mb-green-soft:#f4f8f4!important;--mb-border:#e5e3dc!important;--mb-text:#20221f!important;--mb-muted:#626760!important;--mb-cream:#faf7ef;--mb-gold:#DBC442;--mb-danger:#a63a36!important;width:100%;max-width:1120px;margin:24px auto 40px!important;color:var(--mb-text);font-family:Arial,Helvetica,sans-serif;line-height:1.55}
#mb-bmi-calculator *,#mb-bmi-calculator *::before,#mb-bmi-calculator *::after{box-sizing:border-box}
#mb-bmi-calculator .mb-bmi{position:relative;overflow:hidden;border:1px solid var(--mb-border)!important;border-radius:18px!important;background:#fff!important;box-shadow:0 12px 32px rgba(27,35,29,.07)!important}
#mb-bmi-calculator .mb-bmi::before{content:"";position:absolute;z-index:3;top:0;left:0;right:0;height:4px;background:var(--mb-gold)}
#mb-bmi-calculator .mb-bmi__head{padding:34px 38px 26px!important;background:var(--mb-cream)!important;border-bottom:1px solid var(--mb-border)!important}
#mb-bmi-calculator .mb-bmi__body{padding:30px 38px 36px!important}
#mb-bmi-calculator .mb-bmi__title,#mb-bmi-calculator .mb-bmi__section-title,#mb-bmi-calculator .mb-bmi__panel-title{color:var(--mb-green)!important;font-weight:700!important;letter-spacing:-.01em}
#mb-bmi-calculator .mb-bmi__title{margin:0 0 10px!important;font-size:clamp(25px,3.2vw,30px)!important;line-height:1.16!important}
#mb-bmi-calculator .mb-bmi__lead{max-width:820px;margin:0!important;color:#454a45!important;font-size:16px!important;line-height:1.58!important}
#mb-bmi-calculator .mb-bmi__notice{margin:0 0 22px!important;padding:15px 17px!important;border:1px solid #eadfc8!important;border-left:4px solid var(--mb-gold)!important;border-radius:12px!important;background:var(--mb-cream)!important;color:#4f4b43!important}
#mb-bmi-calculator .mb-bmi__grid{gap:18px!important}
#mb-bmi-calculator .mb-bmi__label{margin-bottom:7px!important;color:#292b28!important;font-size:15px!important;font-weight:700!important}
#mb-bmi-calculator .mb-bmi__input,#mb-bmi-calculator .mb-bmi__select{min-height:48px!important;border:1px solid #d4d6d1!important;border-radius:8px!important;background:#fff!important;color:var(--mb-text)!important}
#mb-bmi-calculator .mb-bmi__input:hover,#mb-bmi-calculator .mb-bmi__select:hover{border-color:#aeb8b0!important}
#mb-bmi-calculator .mb-bmi__input:focus,#mb-bmi-calculator .mb-bmi__select:focus{outline:3px solid rgba(219,196,66,.30)!important;outline-offset:1px;border-color:var(--mb-green-dark)!important}
#mb-bmi-calculator .mb-bmi__hint,#mb-bmi-calculator .mb-bmi__privacy,#mb-bmi-calculator .mb-bmi__formula{color:var(--mb-muted)!important}
#mb-bmi-calculator .mb-bmi__actions{gap:12px!important;margin-top:24px!important}
#mb-bmi-calculator .mb-bmi__button{display:inline-flex;align-items:center;justify-content:center;min-height:48px!important;padding:12px 24px!important;border:2px solid transparent!important;border-radius:8px!important;font-weight:700!important;transition:background .15s ease,border-color .15s ease,transform .15s ease}
#mb-bmi-calculator .mb-bmi__button:hover{transform:translateY(-1px)}
#mb-bmi-calculator .mb-bmi__button:focus-visible,#mb-bmi-calculator a:focus-visible,#mb-bmi-calculator summary:focus-visible{outline:3px solid rgba(219,196,66,.38)!important;outline-offset:2px!important}
#mb-bmi-calculator .mb-bmi__button--primary{min-width:210px;color:#fff!important;background:var(--mb-green)!important;border-color:var(--mb-green)!important;box-shadow:none!important}
#mb-bmi-calculator .mb-bmi__button--primary:hover{background:var(--mb-green-dark)!important;border-color:var(--mb-green-dark)!important}
#mb-bmi-calculator .mb-bmi__button--secondary{color:var(--mb-green-dark)!important;background:#fff!important;border-color:var(--mb-green)!important}
#mb-bmi-calculator .mb-bmi__result{margin-top:28px!important;padding:24px!important;border:1px solid #cfe4d5!important;border-radius:16px!important;background:var(--mb-green-soft)!important}
#mb-bmi-calculator .mb-bmi__score{color:#20221f!important;font-weight:800!important;letter-spacing:-.035em}
#mb-bmi-calculator .mb-bmi__badge{border:1px solid #d7ceb8!important;background:#fff8df!important;color:#75633d!important;font-weight:700!important}
#mb-bmi-calculator .mb-bmi__detail,#mb-bmi-calculator .mb-bmi__metric,#mb-bmi-calculator .mb-bmi__stat,#mb-bmi-calculator .mb-bmi__row{border:1px solid var(--mb-border)!important;border-radius:12px!important;background:#fff!important;box-shadow:none!important}
#mb-bmi-calculator .mb-bmi__detail-label,#mb-bmi-calculator .mb-bmi__metric-label,#mb-bmi-calculator .mb-bmi__result-label{color:var(--mb-muted)!important}
#mb-bmi-calculator .mb-bmi__detail-value,#mb-bmi-calculator .mb-bmi__metric-value{color:var(--mb-green-dark)!important}
#mb-bmi-calculator .mb-bmi__warning{border-left:4px solid var(--mb-gold)!important;border-radius:8px!important;background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88))!important;color:#5d4b1d!important}
#mb-bmi-calculator .mb-bmi__error{border-color:#e3b3af!important;border-radius:10px!important;background:#fff5f4!important;color:var(--mb-danger)!important}
#mb-bmi-calculator .mb-bmi__table-wrap{overflow-x:auto;border:1px solid var(--mb-border)!important;border-radius:12px!important}
#mb-bmi-calculator table{width:100%;border-collapse:collapse;background:#fff}
#mb-bmi-calculator thead th{border-bottom:2px solid var(--mb-gold)!important;background:#20231f!important;color:#fff!important}
#mb-bmi-calculator tbody tr:nth-child(even){background:var(--mb-green-soft)!important}
@media(max-width:760px){#mb-bmi-calculator{margin:18px auto 30px!important}#mb-bmi-calculator .mb-bmi__head{padding:28px 20px 22px!important}#mb-bmi-calculator .mb-bmi__body{padding:24px 20px 28px!important}#mb-bmi-calculator .mb-bmi__result{padding:20px!important}#mb-bmi-calculator .mb-bmi__actions{flex-direction:column;align-items:stretch}#mb-bmi-calculator .mb-bmi__button{width:100%}}
@media(prefers-reduced-motion:reduce){#mb-bmi-calculator *,#mb-bmi-calculator *::before,#mb-bmi-calculator *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}`;
  document.head.appendChild(style);
})();
