/**
 * MyBears — zjednotená grafická verzia 2.0 (SK)
 * Vizuálny systém vychádza z MyBears Product Guide v1.8.
 * Funkčná logika, výpočty, interné ID, URL a verejné API zostávajú zachované.
 */
(function () {
  'use strict';

  var ROOT_ID = 'mb-bmr-calculator';
  var STYLE_ID = 'mb-bmr-calculator-styles';
  var SCRIPT_VERSION = '2.0.0-sk';

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
      style.textContent = [
        '#' + ROOT_ID + ' { --mb-green: #2dc26b; --mb-green-dark: #168947; --mb-green-soft: #f7fbf8; --mb-border: #d9e5dd; --mb-text: #1f2933; --mb-muted: #59636e; --mb-danger: #b42318; --mb-blue-soft: #f3f8fc; --mb-blue-border: #c9deec; font-family: Arial, Helvetica, sans-serif; color: var(--mb-text); margin: 24px 0; }',
        '#' + ROOT_ID + ' * { box-sizing: border-box; }',
        '#' + ROOT_ID + ' .mb-bmr { border: 1px solid var(--mb-border); border-radius: 14px; background: #ffffff; box-shadow: 0 8px 28px rgba(31, 41, 51, 0.08); overflow: hidden; }',
        '#' + ROOT_ID + ' .mb-bmr__head { padding: 22px 22px 16px; background: var(--mb-green-soft); border-bottom: 1px solid var(--mb-border); }',
        '#' + ROOT_ID + ' .mb-bmr__title { margin: 0 0 8px; font-size: 22px; line-height: 1.25; }',
        '#' + ROOT_ID + ' .mb-bmr__lead { margin: 0; color: var(--mb-muted); font-size: 16px; line-height: 1.55; }',
        '#' + ROOT_ID + ' .mb-bmr__body { padding: 22px; }',
        '#' + ROOT_ID + ' .mb-bmr__notice { margin: 0 0 18px; padding: 12px 14px; border-left: 4px solid var(--mb-green); border-radius: 6px; background: #f8faf9; color: var(--mb-muted); font-size: 14px; line-height: 1.5; }',
        '#' + ROOT_ID + ' .mb-bmr__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }',
        '#' + ROOT_ID + ' .mb-bmr__field { min-width: 0; }',
        '#' + ROOT_ID + ' .mb-bmr__field--full { grid-column: 1 / -1; }',
        '#' + ROOT_ID + ' .mb-bmr__label { display: block; margin: 0 0 7px; font-weight: 700; font-size: 15px; }',
        '#' + ROOT_ID + ' .mb-bmr__input-wrap { position: relative; }',
        '#' + ROOT_ID + ' .mb-bmr__input, #' + ROOT_ID + ' .mb-bmr__select { width: 100%; min-height: 48px; padding: 11px 12px; border: 1px solid #b9c6be; border-radius: 8px; background: #ffffff; color: var(--mb-text); font: inherit; font-size: 16px; line-height: 1.3; }',
        '#' + ROOT_ID + ' .mb-bmr__input { padding-right: 52px; }',
        '#' + ROOT_ID + ' .mb-bmr__input:focus, #' + ROOT_ID + ' .mb-bmr__select:focus { outline: 3px solid rgba(45, 194, 107, 0.2); border-color: var(--mb-green-dark); }',
        '#' + ROOT_ID + ' .mb-bmr__unit { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--mb-muted); font-size: 14px; pointer-events: none; }',
        '#' + ROOT_ID + ' .mb-bmr__hint { display: block; margin-top: 6px; color: var(--mb-muted); font-size: 13px; line-height: 1.4; }',
        '#' + ROOT_ID + ' .mb-bmr__error { display: none; margin: 16px 0 0; padding: 12px 14px; border: 1px solid #f1b5b0; border-radius: 8px; background: #fff6f5; color: var(--mb-danger); font-size: 14px; line-height: 1.45; }',
        '#' + ROOT_ID + ' .mb-bmr__error.is-visible { display: block; }',
        '#' + ROOT_ID + ' .mb-bmr__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }',
        '#' + ROOT_ID + ' .mb-bmr__button { min-height: 46px; padding: 11px 20px; border-radius: 8px; border: 1px solid transparent; font: inherit; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease; }',
        '#' + ROOT_ID + ' .mb-bmr__button:hover { transform: translateY(-1px); }',
        '#' + ROOT_ID + ' .mb-bmr__button:focus-visible { outline: 3px solid rgba(45, 194, 107, 0.28); outline-offset: 2px; }',
        '#' + ROOT_ID + ' .mb-bmr__button--primary { background: var(--mb-green); color: #0c2818; border-color: var(--mb-green); box-shadow: 0 4px 12px rgba(45, 194, 107, 0.22); }',
        '#' + ROOT_ID + ' .mb-bmr__button--primary:hover { background: #28b862; }',
        '#' + ROOT_ID + ' .mb-bmr__button--secondary { background: #ffffff; color: var(--mb-text); border-color: #b9c6be; }',
        '#' + ROOT_ID + ' .mb-bmr__result { margin-top: 22px; padding: 20px; border: 1px solid #b8e7ca; border-radius: 12px; background: var(--mb-green-soft); }',
        '#' + ROOT_ID + ' .mb-bmr__result[hidden] { display: none; }',
        '#' + ROOT_ID + ' .mb-bmr__result-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }',
        '#' + ROOT_ID + ' .mb-bmr__result-label { margin: 0 0 4px; color: var(--mb-muted); font-size: 14px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-bmr__score-row { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }',
        '#' + ROOT_ID + ' .mb-bmr__score { margin: 0; font-size: 42px; line-height: 1; font-weight: 800; letter-spacing: -0.03em; }',
        '#' + ROOT_ID + ' .mb-bmr__score-unit { color: var(--mb-muted); font-size: 16px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-bmr__method { display: inline-flex; align-items: center; min-height: 34px; padding: 6px 11px; border-radius: 999px; background: #ffffff; border: 1px solid #b9c6be; font-size: 14px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-bmr__summary { margin: 14px 0 0; font-size: 15px; line-height: 1.55; }',
        '#' + ROOT_ID + ' .mb-bmr__details { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }',
        '#' + ROOT_ID + ' .mb-bmr__detail { padding: 14px; border-radius: 9px; background: #ffffff; border: 1px solid var(--mb-border); }',
        '#' + ROOT_ID + ' .mb-bmr__detail-label { margin: 0 0 6px; color: var(--mb-muted); font-size: 13px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-bmr__detail-value { margin: 0; font-size: 17px; line-height: 1.35; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-bmr__tdee { margin-top: 16px; padding: 16px; border: 1px solid var(--mb-blue-border); border-radius: 10px; background: var(--mb-blue-soft); }',
        '#' + ROOT_ID + ' .mb-bmr__tdee[hidden] { display: none; }',
        '#' + ROOT_ID + ' .mb-bmr__tdee-label { margin: 0 0 5px; color: var(--mb-muted); font-size: 13px; font-weight: 700; }',
        '#' + ROOT_ID + ' .mb-bmr__tdee-value { margin: 0; font-size: 25px; line-height: 1.2; font-weight: 800; }',
        '#' + ROOT_ID + ' .mb-bmr__tdee-note { margin: 8px 0 0; color: var(--mb-muted); font-size: 13px; line-height: 1.5; }',
        '#' + ROOT_ID + ' .mb-bmr__formula { margin: 14px 0 0; color: var(--mb-muted); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; }',
        '#' + ROOT_ID + ' .mb-bmr__result-note { margin: 16px 0 0; padding-top: 14px; border-top: 1px solid #cde8d6; color: var(--mb-muted); font-size: 13px; line-height: 1.5; }',
        '#' + ROOT_ID + ' .mb-bmr__privacy { margin: 16px 0 0; color: var(--mb-muted); font-size: 12px; line-height: 1.45; }',
        '@media (max-width: 760px) {',
        '  #' + ROOT_ID + ' .mb-bmr__details { grid-template-columns: 1fr; }',
        '}',
        '@media (max-width: 640px) {',
        '  #' + ROOT_ID + ' .mb-bmr__head, #' + ROOT_ID + ' .mb-bmr__body { padding-left: 16px; padding-right: 16px; }',
        '  #' + ROOT_ID + ' .mb-bmr__grid { grid-template-columns: 1fr; }',
        '  #' + ROOT_ID + ' .mb-bmr__field--full { grid-column: auto; }',
        '  #' + ROOT_ID + ' .mb-bmr__button { width: 100%; }',
        '  #' + ROOT_ID + ' .mb-bmr__score { font-size: 38px; }',
        '}',
        '@media (prefers-reduced-motion: reduce) {',
        '  #' + ROOT_ID + ' .mb-bmr__button { transition: none; }',
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
      return new Intl.NumberFormat('sk-SK', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }).format(value);
    }

    function calculateRee(sex, age, height, weight) {
      var base = (10 * weight) + (6.25 * height) - (5 * age);
      return sex === 'male' ? base + 5 : base - 161;
    }

    function showError(message) {
      errorBox.textContent = message;
      errorBox.classList.add('is-visible');
      errorBox.focus();
    }

    function clearError() {
      errorBox.textContent = '';
      errorBox.classList.remove('is-visible');
    }

    addStyles();

    root.innerHTML = [
      '<section class="mb-bmr" aria-labelledby="mb-bmr-title">',
      '  <div class="mb-bmr__head">',
      '    <h2 class="mb-bmr__title" id="mb-bmr-title">BMR kalkulačka pre dospelých</h2>',
      '    <p class="mb-bmr__lead">Vypočítajte si orientačný pokojový energetický výdaj podľa veku, výšky, hmotnosti a variantu rovnice pre ženy alebo mužov.</p>',
      '  </div>',
      '  <div class="mb-bmr__body">',
      '    <p class="mb-bmr__notice"><strong>Dôležité:</strong> Výsledok je odhad podľa rovnice Mifflin–St Jeor. Neide o presné laboratórne meranie ani o odporúčaný minimálny príjem kalórií. Kalkulačka je určená pre dospelých od 18 rokov.</p>',
      '    <form class="mb-bmr__form" novalidate>',
      '      <div class="mb-bmr__grid">',
      '        <div class="mb-bmr__field">',
      '          <label class="mb-bmr__label" for="mb-bmr-sex">Variant rovnice</label>',
      '          <select class="mb-bmr__select" id="mb-bmr-sex" name="sex">',
      '            <option value="female">Žena</option>',
      '            <option value="male">Muž</option>',
      '          </select>',
      '          <span class="mb-bmr__hint">Rovnica používa dva varianty podľa pohlavia, pre ktoré bola pôvodne odvodená.</span>',
      '        </div>',
      '        <div class="mb-bmr__field">',
      '          <label class="mb-bmr__label" for="mb-bmr-age">Vek</label>',
      '          <div class="mb-bmr__input-wrap">',
      '            <input class="mb-bmr__input" id="mb-bmr-age" name="age" type="text" inputmode="decimal" autocomplete="off" placeholder="napr. 35" aria-describedby="mb-bmr-age-hint">',
      '            <span class="mb-bmr__unit">rokov</span>',
      '          </div>',
      '          <span class="mb-bmr__hint" id="mb-bmr-age-hint">Povolené rozmedzie: 18–100 rokov</span>',
      '        </div>',
      '        <div class="mb-bmr__field">',
      '          <label class="mb-bmr__label" for="mb-bmr-height">Výška</label>',
      '          <div class="mb-bmr__input-wrap">',
      '            <input class="mb-bmr__input" id="mb-bmr-height" name="height" type="text" inputmode="decimal" autocomplete="off" placeholder="napr. 172" aria-describedby="mb-bmr-height-hint">',
      '            <span class="mb-bmr__unit">cm</span>',
      '          </div>',
      '          <span class="mb-bmr__hint" id="mb-bmr-height-hint">Povolené rozmedzie: 100–250 cm</span>',
      '        </div>',
      '        <div class="mb-bmr__field">',
      '          <label class="mb-bmr__label" for="mb-bmr-weight">Hmotnosť</label>',
      '          <div class="mb-bmr__input-wrap">',
      '            <input class="mb-bmr__input" id="mb-bmr-weight" name="weight" type="text" inputmode="decimal" autocomplete="off" placeholder="napr. 74" aria-describedby="mb-bmr-weight-hint">',
      '            <span class="mb-bmr__unit">kg</span>',
      '          </div>',
      '          <span class="mb-bmr__hint" id="mb-bmr-weight-hint">Povolené rozmedzie: 20–400 kg</span>',
      '        </div>',
      '        <div class="mb-bmr__field mb-bmr__field--full">',
      '          <label class="mb-bmr__label" for="mb-bmr-activity">Úroveň aktivity – voliteľné</label>',
      '          <select class="mb-bmr__select" id="mb-bmr-activity" name="activity">',
      '            <option value="">Zobraziť iba pokojový výdaj</option>',
      '            <option value="1.4">Nízka aktivita (PAL 1,4)</option>',
      '            <option value="1.6">Stredná aktivita (PAL 1,6)</option>',
      '            <option value="1.8">Vysoká aktivita (PAL 1,8)</option>',
      '            <option value="2.0">Veľmi vysoká aktivita (PAL 2,0)</option>',
      '          </select>',
      '          <span class="mb-bmr__hint">Po výbere sa zobrazí aj hrubý odhad celkového denného energetického výdaja. Úroveň aktivity býva ťažké presne odhadnúť.</span>',
      '        </div>',
      '      </div>',
      '      <div class="mb-bmr__error" role="alert" tabindex="-1"></div>',
      '      <div class="mb-bmr__actions">',
      '        <button class="mb-bmr__button mb-bmr__button--primary" type="submit">Vypočítať BMR</button>',
      '        <button class="mb-bmr__button mb-bmr__button--secondary" type="reset">Vymazať údaje</button>',
      '      </div>',
      '    </form>',
      '    <div class="mb-bmr__result" aria-live="polite" hidden>',
      '      <div class="mb-bmr__result-top">',
      '        <div>',
      '          <p class="mb-bmr__result-label">Orientačný pokojový energetický výdaj</p>',
      '          <div class="mb-bmr__score-row"><p class="mb-bmr__score"></p><span class="mb-bmr__score-unit">kcal / deň</span></div>',
      '        </div>',
      '        <span class="mb-bmr__method">Mifflin–St Jeor</span>',
      '      </div>',
      '      <p class="mb-bmr__summary"></p>',
      '      <div class="mb-bmr__details">',
      '        <div class="mb-bmr__detail">',
      '          <p class="mb-bmr__detail-label">Prepočet na kilojouly</p>',
      '          <p class="mb-bmr__detail-value" data-output="kj"></p>',
      '        </div>',
      '        <div class="mb-bmr__detail">',
      '          <p class="mb-bmr__detail-label">Priemer za jednu hodinu</p>',
      '          <p class="mb-bmr__detail-value" data-output="hour"></p>',
      '        </div>',
      '        <div class="mb-bmr__detail">',
      '          <p class="mb-bmr__detail-label">Zadané údaje</p>',
      '          <p class="mb-bmr__detail-value" data-output="inputs"></p>',
      '        </div>',
      '      </div>',
      '      <div class="mb-bmr__tdee" hidden>',
      '        <p class="mb-bmr__tdee-label">Orientačný celkový denný energetický výdaj podľa zvoleného PAL</p>',
      '        <p class="mb-bmr__tdee-value" data-output="tdee"></p>',
      '        <p class="mb-bmr__tdee-note" data-output="tdee-note"></p>',
      '      </div>',
      '      <p class="mb-bmr__formula" data-output="formula"></p>',
      '      <p class="mb-bmr__result-note"><strong>Výsledok nie je automatický kalorický cieľ.</strong> Skutočný výdaj sa môže líšiť podľa telesného zloženia, zdravotného stavu, teploty, spánok, pohybu a ďalších faktorov. Na presnejšie meranie pokojového výdaja sa používa nepriama kalorimetria.</p>',
      '    </div>',
      '    <p class="mb-bmr__privacy">Výpočet prebieha iba vo vašom prehliadači. Zadaný vek, výška, hmotnosť ani zvolený variant rovnice sa týmto skriptom nikam neodosielajú ani neukladajú.</p>',
      '  </div>',
      '</section>'
    ].join('');

    var form = root.querySelector('.mb-bmr__form');
    var sexInput = root.querySelector('#mb-bmr-sex');
    var ageInput = root.querySelector('#mb-bmr-age');
    var heightInput = root.querySelector('#mb-bmr-height');
    var weightInput = root.querySelector('#mb-bmr-weight');
    var activityInput = root.querySelector('#mb-bmr-activity');
    var errorBox = root.querySelector('.mb-bmr__error');
    var resultBox = root.querySelector('.mb-bmr__result');
    var scoreOutput = root.querySelector('.mb-bmr__score');
    var summaryOutput = root.querySelector('.mb-bmr__summary');
    var kjOutput = root.querySelector('[data-output="kj"]');
    var hourOutput = root.querySelector('[data-output="hour"]');
    var inputsOutput = root.querySelector('[data-output="inputs"]');
    var formulaOutput = root.querySelector('[data-output="formula"]');
    var tdeeBox = root.querySelector('.mb-bmr__tdee');
    var tdeeOutput = root.querySelector('[data-output="tdee"]');
    var tdeeNoteOutput = root.querySelector('[data-output="tdee-note"]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError();

      var sex = sexInput.value;
      var age = parseCzechNumber(ageInput.value);
      var height = parseCzechNumber(heightInput.value);
      var weight = parseCzechNumber(weightInput.value);
      var pal = activityInput.value ? Number(activityInput.value) : null;

      if (sex !== 'female' && sex !== 'male') {
        showError('Vyberte variant rovnice pre ženu alebo muža.');
        return;
      }

      if (!Number.isFinite(age) || age < 18 || age > 100) {
        showError('Zadajte vek v rozmedzí 18 až 100 rokov.');
        ageInput.focus();
        return;
      }

      if (!Number.isFinite(height) || height < 100 || height > 250) {
        showError('Zadajte výšku v rozmedzí 100 až 250 cm.');
        heightInput.focus();
        return;
      }

      if (!Number.isFinite(weight) || weight < 20 || weight > 400) {
        showError('Zadajte hmotnosť v rozmedzí 20 až 400 kg.');
        weightInput.focus();
        return;
      }

      if (pal !== null && [1.4, 1.6, 1.8, 2.0].indexOf(pal) === -1) {
        showError('Vyberte platnú úroveň aktivity.');
        activityInput.focus();
        return;
      }

      var ree = calculateRee(sex, age, height, weight);
      var reeRounded = Math.round(ree);
      var kjRounded = Math.round(ree * 4.184);
      var hourly = ree / 24;
      var sexLabel = sex === 'male' ? 'muž' : 'žena';
      var constantText = sex === 'male' ? '+ 5' : '− 161';

      scoreOutput.textContent = formatNumber(reeRounded, 0);
      summaryOutput.textContent = 'Podľa zadaných údajov vychádza orientačný pokojový energetický výdaj približne ' + formatNumber(reeRounded, 0) + ' kcal za 24 hodín. Ide o odhad energie spotrebovanej v pokojových podmienkach, nie o presné laboratórne meranie.';
      kjOutput.textContent = formatNumber(kjRounded, 0) + ' kJ / deň';
      hourOutput.textContent = formatNumber(hourly, 1) + ' kcal / hod';
      inputsOutput.textContent = formatNumber(age, 0) + ' rokov · ' + formatNumber(height, 1) + ' cm · ' + formatNumber(weight, 1) + ' kg · ' + sexLabel;
      formulaOutput.textContent = 'Výpočet: 10 × ' + formatNumber(weight, 1) + ' kg + 6,25 × ' + formatNumber(height, 1) + ' cm − 5 × ' + formatNumber(age, 0) + ' rokov ' + constantText + ' = približne ' + formatNumber(reeRounded, 0) + ' kcal/deň.';

      if (pal !== null) {
        var tdee = Math.round(ree * pal);
        var selectedText = activityInput.options[activityInput.selectedIndex].text;
        tdeeOutput.textContent = formatNumber(tdee, 0) + ' kcal/deň (' + formatNumber(tdee * 4.184, 0) + ' kJ)';
        tdeeNoteOutput.textContent = selectedText + '. Výpočet je BMR/REE × PAL a slúži iba ako hrubý orientačný odhad udržiavacieho energetického výdaja.';
        tdeeBox.hidden = false;
      } else {
        tdeeBox.hidden = true;
        tdeeOutput.textContent = '';
        tdeeNoteOutput.textContent = '';
      }

      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    form.addEventListener('reset', function () {
      window.setTimeout(function () {
        clearError();
        resultBox.hidden = true;
        tdeeBox.hidden = true;
        scoreOutput.textContent = '';
        summaryOutput.textContent = '';
        kjOutput.textContent = '';
        hourOutput.textContent = '';
        inputsOutput.textContent = '';
        formulaOutput.textContent = '';
        tdeeOutput.textContent = '';
        tdeeNoteOutput.textContent = '';
        ageInput.focus();
      }, 0);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

/* MyBears sjednocená grafická vrstva 2.0 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || document.getElementById('mb-unified-kalkulacka-bazalniho-metabolismu-styles')) return;
  var style = document.createElement('style');
  style.id = 'mb-unified-kalkulacka-bazalniho-metabolismu-styles';
  style.textContent = String.raw`/* MyBears unified design layer — Product Guide v1.8 */
#mb-bmr-calculator{--mb-green:#2dc26b!important;--mb-green-dark:#198d4b!important;--mb-green-soft:#f4f8f4!important;--mb-border:#e5e3dc!important;--mb-text:#20221f!important;--mb-muted:#626760!important;--mb-cream:#faf7ef;--mb-gold:#DBC442;--mb-danger:#a63a36!important;width:100%;max-width:1120px;margin:24px auto 40px!important;color:var(--mb-text);font-family:Arial,Helvetica,sans-serif;line-height:1.55}
#mb-bmr-calculator *,#mb-bmr-calculator *::before,#mb-bmr-calculator *::after{box-sizing:border-box}
#mb-bmr-calculator .mb-bmr{position:relative;overflow:hidden;border:1px solid var(--mb-border)!important;border-radius:18px!important;background:#fff!important;box-shadow:0 12px 32px rgba(27,35,29,.07)!important}
#mb-bmr-calculator .mb-bmr::before{content:"";position:absolute;z-index:3;top:0;left:0;right:0;height:4px;background:var(--mb-gold)}
#mb-bmr-calculator .mb-bmr__head{padding:34px 38px 26px!important;background:var(--mb-cream)!important;border-bottom:1px solid var(--mb-border)!important}
#mb-bmr-calculator .mb-bmr__body{padding:30px 38px 36px!important}
#mb-bmr-calculator .mb-bmr__title,#mb-bmr-calculator .mb-bmr__section-title,#mb-bmr-calculator .mb-bmr__panel-title{color:var(--mb-green)!important;font-weight:700!important;letter-spacing:-.01em}
#mb-bmr-calculator .mb-bmr__title{margin:0 0 10px!important;font-size:clamp(25px,3.2vw,30px)!important;line-height:1.16!important}
#mb-bmr-calculator .mb-bmr__lead{max-width:820px;margin:0!important;color:#454a45!important;font-size:16px!important;line-height:1.58!important}
#mb-bmr-calculator .mb-bmr__notice{margin:0 0 22px!important;padding:15px 17px!important;border:1px solid #eadfc8!important;border-left:4px solid var(--mb-gold)!important;border-radius:12px!important;background:var(--mb-cream)!important;color:#4f4b43!important}
#mb-bmr-calculator .mb-bmr__grid{gap:18px!important}
#mb-bmr-calculator .mb-bmr__label{margin-bottom:7px!important;color:#292b28!important;font-size:15px!important;font-weight:700!important}
#mb-bmr-calculator .mb-bmr__input,#mb-bmr-calculator .mb-bmr__select{min-height:48px!important;border:1px solid #d4d6d1!important;border-radius:8px!important;background:#fff!important;color:var(--mb-text)!important}
#mb-bmr-calculator .mb-bmr__input:hover,#mb-bmr-calculator .mb-bmr__select:hover{border-color:#aeb8b0!important}
#mb-bmr-calculator .mb-bmr__input:focus,#mb-bmr-calculator .mb-bmr__select:focus{outline:3px solid rgba(219,196,66,.30)!important;outline-offset:1px;border-color:var(--mb-green-dark)!important}
#mb-bmr-calculator .mb-bmr__hint,#mb-bmr-calculator .mb-bmr__privacy,#mb-bmr-calculator .mb-bmr__formula{color:var(--mb-muted)!important}
#mb-bmr-calculator .mb-bmr__actions{gap:12px!important;margin-top:24px!important}
#mb-bmr-calculator .mb-bmr__button{display:inline-flex;align-items:center;justify-content:center;min-height:48px!important;padding:12px 24px!important;border:2px solid transparent!important;border-radius:8px!important;font-weight:700!important;transition:background .15s ease,border-color .15s ease,transform .15s ease}
#mb-bmr-calculator .mb-bmr__button:hover{transform:translateY(-1px)}
#mb-bmr-calculator .mb-bmr__button:focus-visible,#mb-bmr-calculator a:focus-visible,#mb-bmr-calculator summary:focus-visible{outline:3px solid rgba(219,196,66,.38)!important;outline-offset:2px!important}
#mb-bmr-calculator .mb-bmr__button--primary{min-width:210px;color:#fff!important;background:var(--mb-green)!important;border-color:var(--mb-green)!important;box-shadow:none!important}
#mb-bmr-calculator .mb-bmr__button--primary:hover{background:var(--mb-green-dark)!important;border-color:var(--mb-green-dark)!important}
#mb-bmr-calculator .mb-bmr__button--secondary{color:var(--mb-green-dark)!important;background:#fff!important;border-color:var(--mb-green)!important}
#mb-bmr-calculator .mb-bmr__result{margin-top:28px!important;padding:24px!important;border:1px solid #cfe4d5!important;border-radius:16px!important;background:var(--mb-green-soft)!important}
#mb-bmr-calculator .mb-bmr__score{color:#20221f!important;font-weight:800!important;letter-spacing:-.035em}
#mb-bmr-calculator .mb-bmr__badge{border:1px solid #d7ceb8!important;background:#fff8df!important;color:#75633d!important;font-weight:700!important}
#mb-bmr-calculator .mb-bmr__detail,#mb-bmr-calculator .mb-bmr__metric,#mb-bmr-calculator .mb-bmr__stat,#mb-bmr-calculator .mb-bmr__row{border:1px solid var(--mb-border)!important;border-radius:12px!important;background:#fff!important;box-shadow:none!important}
#mb-bmr-calculator .mb-bmr__detail-label,#mb-bmr-calculator .mb-bmr__metric-label,#mb-bmr-calculator .mb-bmr__result-label{color:var(--mb-muted)!important}
#mb-bmr-calculator .mb-bmr__detail-value,#mb-bmr-calculator .mb-bmr__metric-value{color:var(--mb-green-dark)!important}
#mb-bmr-calculator .mb-bmr__warning{border-left:4px solid var(--mb-gold)!important;border-radius:8px!important;background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88))!important;color:#5d4b1d!important}
#mb-bmr-calculator .mb-bmr__error{border-color:#e3b3af!important;border-radius:10px!important;background:#fff5f4!important;color:var(--mb-danger)!important}
#mb-bmr-calculator .mb-bmr__table-wrap{overflow-x:auto;border:1px solid var(--mb-border)!important;border-radius:12px!important}
#mb-bmr-calculator table{width:100%;border-collapse:collapse;background:#fff}
#mb-bmr-calculator thead th{border-bottom:2px solid var(--mb-gold)!important;background:#20231f!important;color:#fff!important}
#mb-bmr-calculator tbody tr:nth-child(even){background:var(--mb-green-soft)!important}
@media(max-width:760px){#mb-bmr-calculator{margin:18px auto 30px!important}#mb-bmr-calculator .mb-bmr__head{padding:28px 20px 22px!important}#mb-bmr-calculator .mb-bmr__body{padding:24px 20px 28px!important}#mb-bmr-calculator .mb-bmr__result{padding:20px!important}#mb-bmr-calculator .mb-bmr__actions{flex-direction:column;align-items:stretch}#mb-bmr-calculator .mb-bmr__button{width:100%}}
@media(prefers-reduced-motion:reduce){#mb-bmr-calculator *,#mb-bmr-calculator *::before,#mb-bmr-calculator *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}`;
  document.head.appendChild(style);
})();
