/**
 * MyBears — sjednocená grafická verze 2.0 (CZ)
 * Vizuální systém vychází z MyBears Product Guide v1.8.
 * Funkční logika, výpočty, interní ID, URL a veřejné API zůstávají zachované.
 */
(function () {
  'use strict';
  var T = {"locale":"cs-CZ","version":"2.0.0-cz","root":"mb-caffeine-intake-calculator","style":"mb-caffeine-intake-calculator-styles","title":"Kalkulačka příjmu kofeinu","lead":"Sečtěte kofein z kávy, čaje, energetických nápojů, koly, čokolády a vlastních produktů. Výsledek ukáže denní součet, množství na kilogram hmotnosti a volitelný odhad kofeinu zbývajícího před spaním.","notice":"<strong>Důležité:</strong> Kalkulačka je určená dospělým od 18 let. Hodnoty v předvolbách jsou orientační a konkrétní výrobek nebo způsob přípravy může obsahovat jiné množství kofeinu.","profile":"Referenční profil","profile_adult":"Zdravý dospělý","profile_preg":"Těhotenství nebo kojení","weight":"Tělesná hmotnost (volitelně)","weight_hint":"Slouží pouze k přepočtu příjmu na mg/kg. Neurčuje individuální toleranci kofeinu.","bedtime":"Plánovaný čas spánku (volitelně)","bedtime_hint":"Pokud u položek zadáte čas, kalkulačka modelově odhadne množství kofeinu zbývající před spaním.","sources_title":"Zdroje kofeinu během dne","sources_intro":"U každé položky můžete upravit počet porcí i množství kofeinu podle etikety nebo údajů výrobce.","source":"Zdroj","servings":"Počet porcí","mg_serving":"Kofein v 1 porci","time":"Čas příjmu","custom_name":"Název vlastního zdroje","add":"Přidat další zdroj","remove":"Odebrat","calculate":"Spočítat příjem","reset":"Vymazat údaje","result":"Váš orientační denní příjem kofeinu","daily_total":"Celkem za den","reference":"Srovnávací hodnota profilu","percent":"Podíl srovnávací hodnoty","per_kg":"Příjem podle hmotnosti","max_item":"Nejvyšší zadaná položka","items_count":"Počet zadaných zdrojů","scale":"Orientační srovnání denního součtu","low":"nižší podíl","near":"blízko hodnotě","over":"nad hodnotou","sleep_title":"Modelový odhad kofeinu před spaním","sleep_average":"Odhad při průměrném poločasu 4 hodiny","sleep_range":"Možné rozpětí při poločasu 2–8 hodin","sleep_missing":"Pro výpočet před spaním zadejte čas spánku a čas alespoň u jedné položky.","single_title":"Nejvyšší příjem v jedné položce","details":"Rozpis započtených zdrojů","item":"Položka","subtotal":"Kofein celkem","privacy":"Výpočet probíhá pouze ve vašem prohlížeči. Zadané údaje se tímto skriptem nikam neodesílají ani neukládají.","preset_note":"Přednastavené hodnoty vycházejí z orientačních porcí EFSA. Obsah kofeinu se může výrazně lišit podle značky, velikosti porce a přípravy.","profiles":{"adult":{"label":"zdravý dospělý","daily":400,"daily_note":"EFSA uvádí, že příjem do 400 mg za den rozložený během dne u zdravých dospělých obecně nevyvolává bezpečnostní obavy. Nejde o doporučený cíl ani o hranici vhodnou pro každého."},"preg":{"label":"těhotenství nebo kojení","daily":200,"daily_note":"EFSA uvádí pro těhotné a kojící ženy příjem ze všech zdrojů do 200 mg za den. Individuální postup je vhodné konzultovat se zdravotníkem."}},"presets":[["filter","Filtrovaná káva (200 ml)",90],["espresso","Espresso (60 ml)",80],["black_tea","Černý čaj (220 ml)",50],["cola","Kola (355 ml)",40],["energy","Energetický nápoj (250 ml)",80],["dark_choc","Hořká čokoláda (50 g)",25],["milk_choc","Mléčná čokoláda (50 g)",10],["custom","Vlastní produkt nebo doplněk",100]],"messages":{"within":"Denní součet nepřekračuje srovnávací hodnotu zvoleného profilu. To však neznamená, že je toto množství vhodné právě pro vás; citlivost se výrazně liší.","over":"Denní součet překračuje srovnávací hodnotu zvoleného profilu. Zkontrolujte zejména velikost porcí, etikety energetických nápojů a doplňků stravy.","single_ok":"Nejvyšší zadaná položka nepřesahuje 200 mg. EFSA tuto hodnotu uvádí pro jednorázový příjem u zdravých dospělých, nikoliv jako doporučenou dávku.","single_high":"Alespoň jedna zadaná položka obsahuje více než 200 mg kofeinu. U těhotenství, kojení, zdravotních potíží nebo užívání léků se tímto srovnáním neřiďte bez konzultace.","sleep":"I nižší množství kofeinu může u citlivého člověka ovlivnit spánek. EFSA uvádí, že už 100 mg přijatých blízko doby spánku může u některých dospělých změnit délku nebo průběh spánku.","symptoms":"Při bušení srdce, třesu, úzkosti, nespavosti, nevolnosti nebo jiných potížích další kofein nepřidávejte a podle závažnosti se poraďte se zdravotníkem.","preg_single":"V těhotenství ani při kojení nelze jednorázovou hranici 200 mg automaticky považovat za vhodnou dávku. Kalkulačka proto hodnotí především celkový denní součet."},"errors":{"weight":"Hmotnost ponechte prázdnou nebo zadejte hodnotu 30–250 kg.","rows":"Přidejte alespoň jeden zdroj kofeinu s platným počtem porcí a množstvím v mg.","servings":"Počet porcí musí být v rozmezí 0,1–20.","mg":"Množství kofeinu v porci musí být v rozmezí 0–1000 mg.","max_rows":"Lze přidat nejvýše 12 zdrojů.","generic":"Výpočet se nepodařilo dokončit. Zkontrolujte zadané údaje."}};
  var ROOT_ID = T.root;
  var STYLE_ID = T.style;
  var VERSION = T.version;
  var MAX_ROWS = 12;

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    var clean = value.trim().replace(/\s+/g, '');
    if (clean === '') return NaN;
    return Number(clean.replace(',', '.'));
  }

  function format(value, decimals) {
    return new Intl.NumberFormat(T.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch];
    });
  }

  function presetById(id) {
    for (var i = 0; i < T.presets.length; i++) if (T.presets[i][0] === id) return T.presets[i];
    return T.presets[0];
  }

  function presetOptions(selected) {
    return T.presets.map(function (p) {
      return '<option value="' + esc(p[0]) + '"' + (p[0] === selected ? ' selected' : '') + '>' + esc(p[1]) + '</option>';
    }).join('');
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#${ROOT_ID}{font-family:Arial, Helvetica, sans-serif;font-weight:400;color:#10253a;margin:22px 0}
#${ROOT_ID} *{box-sizing:border-box}
#${ROOT_ID} strong,#${ROOT_ID} b{font-weight:700}
#${ROOT_ID} .mb-card{background:#fff;border:1px solid #dbe6df;border-radius:14px;padding:20px;box-shadow:0 8px 25px rgba(16,37,58,.045)}
#${ROOT_ID} .mb-title{font-size:25px;line-height:1.2;margin:0 0 8px;font-weight:700;color:#071c2f}
#${ROOT_ID} .mb-lead{font-size:15px;line-height:1.55;margin:0 0 16px;color:#34495e}
#${ROOT_ID} .mb-notice{background:#f6f8f7;border-left:4px solid #2dc26b;border-radius:7px;padding:11px 13px;margin:0 0 18px;font-size:13px;line-height:1.5;color:#34495e}
#${ROOT_ID} .mb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
#${ROOT_ID} label{font-size:14px;font-weight:700;display:block;margin:0 0 7px;color:#10253a}
#${ROOT_ID} input,#${ROOT_ID} select{width:100%;height:46px;border:1px solid #bdcbc4;border-radius:8px;background:#fff;padding:0 12px;font:inherit;color:#10253a;outline:none}
#${ROOT_ID} input:focus,#${ROOT_ID} select:focus{border-color:#2dc26b;box-shadow:0 0 0 3px rgba(45,194,107,.12)}
#${ROOT_ID} .mb-hint{font-size:12px;color:#607080;line-height:1.4;margin-top:5px}
#${ROOT_ID} .mb-section-title{font-size:18px;margin:22px 0 6px;font-weight:700;color:#071c2f}
#${ROOT_ID} .mb-section-intro{font-size:13px;color:#607080;margin:0 0 12px;line-height:1.5}
#${ROOT_ID} .mb-source{display:grid;grid-template-columns:minmax(190px,2.1fr) minmax(92px,.7fr) minmax(120px,.9fr) minmax(110px,.8fr) 42px;gap:10px;align-items:end;padding:13px;border:1px solid #dbe6df;border-radius:11px;background:#fbfdfc;margin-bottom:10px}
#${ROOT_ID} .mb-custom{grid-column:1/5;display:none}
#${ROOT_ID} .mb-custom.is-visible{display:block}
#${ROOT_ID} .mb-remove{height:42px;width:42px;border:1px solid #cad6d0;background:#fff;border-radius:8px;font-size:22px;cursor:pointer;color:#63766d}
#${ROOT_ID} .mb-remove:hover{border-color:#d9534f;color:#b62d28}
#${ROOT_ID} .mb-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
#${ROOT_ID} button.mb-primary,#${ROOT_ID} button.mb-secondary,#${ROOT_ID} button.mb-add{min-height:46px;border-radius:8px;padding:0 18px;font:inherit;font-size:15px;font-weight:700;cursor:pointer}
#${ROOT_ID} button.mb-primary{border:1px solid #2dc26b;background:#2dc26b;color:#06172a}
#${ROOT_ID} button.mb-secondary{border:1px solid #bdcbc4;background:#fff;color:#10253a}
#${ROOT_ID} button.mb-add{border:1px dashed #7fad92;background:#f7fbf8;color:#155d36}
#${ROOT_ID} .mb-error{display:none;background:#fff2f1;border:1px solid #f1b7b3;color:#8f211c;padding:10px 12px;border-radius:8px;margin:12px 0;font-size:13px;line-height:1.45}
#${ROOT_ID} .mb-error.is-visible{display:block}
#${ROOT_ID} .mb-result{margin-top:20px;border:1px solid #a9e4c0;background:#f7fcf9;border-radius:13px;padding:20px}
#${ROOT_ID} .mb-result[hidden]{display:none}
#${ROOT_ID} .mb-result-head{display:flex;align-items:flex-start;justify-content:space-between;gap:15px}
#${ROOT_ID} .mb-kicker{font-size:13px;font-weight:700;color:#4f6258;margin:0 0 5px}
#${ROOT_ID} .mb-total{font-size:44px;line-height:1;font-weight:800;color:#10253a;margin:0}
#${ROOT_ID} .mb-total small{font-size:18px;font-weight:700}
#${ROOT_ID} .mb-badge{border:1px solid #bfd0c7;background:#fff;border-radius:999px;padding:8px 12px;font-size:12px;font-weight:700;white-space:nowrap}
#${ROOT_ID} .mb-summary{font-size:14px;line-height:1.55;margin:12px 0;color:#10253a}
#${ROOT_ID} .mb-meter{height:16px;border-radius:999px;overflow:hidden;background:linear-gradient(90deg,#9bc9e8 0 35%,#79cc9b 35% 70%,#f4c75a 70% 100%);position:relative;margin:10px 0 5px}
#${ROOT_ID} .mb-marker{position:absolute;top:-4px;width:4px;height:24px;background:#10253a;border:1px solid #fff;border-radius:4px;transform:translateX(-50%)}
#${ROOT_ID} .mb-meter-labels{display:flex;justify-content:space-between;font-size:11px;color:#53675d;margin-bottom:15px}
#${ROOT_ID} .mb-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
#${ROOT_ID} .mb-stat{background:#fff;border:1px solid #d7e2dc;border-radius:9px;padding:12px}
#${ROOT_ID} .mb-stat span{display:block;font-size:12px;color:#607080;margin-bottom:5px}
#${ROOT_ID} .mb-stat strong{font-size:17px;color:#10253a}
#${ROOT_ID} .mb-info{margin-top:14px;padding:12px 14px;background:#fff;border:1px solid #d7e2dc;border-radius:9px;font-size:13px;line-height:1.55;color:#354b40}
#${ROOT_ID} .mb-info strong{color:#10253a}
#${ROOT_ID} .mb-sleep{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
#${ROOT_ID} .mb-table-wrap{overflow-x:auto;margin-top:15px}
#${ROOT_ID} table{border-collapse:collapse;width:100%;min-width:580px;background:#fff}
#${ROOT_ID} th,#${ROOT_ID} td{border:1px solid #dbe2de;padding:9px 10px;text-align:left;font-size:13px}
#${ROOT_ID} th{background:#f4f8f6;font-weight:700}
#${ROOT_ID} .mb-privacy{font-size:12px;color:#53675d;margin:14px 0 0}
@media(max-width:820px){#${ROOT_ID} .mb-source{grid-template-columns:1fr 1fr}#${ROOT_ID} .mb-source>div:first-child{grid-column:1/3}#${ROOT_ID} .mb-custom{grid-column:1/3}#${ROOT_ID} .mb-remove{grid-column:2;justify-self:end}#${ROOT_ID} .mb-stats{grid-template-columns:1fr 1fr}}
@media(max-width:560px){#${ROOT_ID} .mb-card{padding:15px}#${ROOT_ID} .mb-grid,#${ROOT_ID} .mb-sleep{grid-template-columns:1fr}#${ROOT_ID} .mb-source{grid-template-columns:1fr}#${ROOT_ID} .mb-source>div:first-child,#${ROOT_ID} .mb-custom{grid-column:1}#${ROOT_ID} .mb-remove{grid-column:1;justify-self:start}#${ROOT_ID} .mb-result-head{display:block}#${ROOT_ID} .mb-badge{display:inline-block;margin-top:10px}#${ROOT_ID} .mb-stats{grid-template-columns:1fr}#${ROOT_ID} .mb-total{font-size:38px}}
`;
    document.head.appendChild(style);
  }

  function createRow(data) {
    data = data || {preset:'filter', servings:'1', mg:'90', time:''};
    var row = document.createElement('div');
    row.className = 'mb-source';
    row.innerHTML = '<div><label>' + esc(T.source) + '</label><select class="mb-preset">' + presetOptions(data.preset) + '</select></div>' +
      '<div><label>' + esc(T.servings) + '</label><input class="mb-servings" inputmode="decimal" value="' + esc(data.servings) + '"></div>' +
      '<div><label>' + esc(T.mg_serving) + ' (mg)</label><input class="mb-mg" inputmode="decimal" value="' + esc(data.mg) + '"></div>' +
      '<div><label>' + esc(T.time) + '</label><input class="mb-time" type="time" value="' + esc(data.time || '') + '"></div>' +
      '<button type="button" class="mb-remove" aria-label="' + esc(T.remove) + '" title="' + esc(T.remove) + '">×</button>' +
      '<div class="mb-custom' + (data.preset === 'custom' ? ' is-visible' : '') + '"><label>' + esc(T.custom_name) + '</label><input class="mb-custom-name" value="' + esc(data.customName || '') + '"></div>';
    row.querySelector('.mb-preset').addEventListener('change', function () {
      var p = presetById(this.value);
      row.querySelector('.mb-mg').value = p[2];
      row.querySelector('.mb-custom').classList.toggle('is-visible', this.value === 'custom');
    });
    row.querySelector('.mb-remove').addEventListener('click', function () {
      var list = row.parentNode;
      if (list && list.children.length > 1) row.remove();
      else {
        row.querySelector('.mb-servings').value = '1';
        row.querySelector('.mb-preset').value = 'filter';
        row.querySelector('.mb-mg').value = '90';
        row.querySelector('.mb-time').value = '';
        row.querySelector('.mb-custom-name').value = '';
        row.querySelector('.mb-custom').classList.remove('is-visible');
      }
    });
    return row;
  }

  function timeToMinutes(value) {
    if (!/^\d{2}:\d{2}$/.test(value || '')) return null;
    var p = value.split(':');
    return Number(p[0]) * 60 + Number(p[1]);
  }

  function hoursUntil(time, bedtime) {
    var t = timeToMinutes(time), b = timeToMinutes(bedtime);
    if (t == null || b == null) return null;
    var diff = (b - t + 1440) % 1440;
    return diff / 60;
  }

  function remainingAtBed(rows, bedtime, halfLife) {
    var total = 0, count = 0;
    rows.forEach(function (r) {
      var h = hoursUntil(r.time, bedtime);
      if (h != null) {
        total += r.subtotal * Math.pow(0.5, h / halfLife);
        count++;
      }
    });
    return count ? total : null;
  }

  function readRows(root) {
    var rows = [], invalid = null;
    root.querySelectorAll('.mb-source').forEach(function (el) {
      var presetId = el.querySelector('.mb-preset').value;
      var preset = presetById(presetId);
      var servings = parseNumber(el.querySelector('.mb-servings').value);
      var mg = parseNumber(el.querySelector('.mb-mg').value);
      if (!isFinite(servings) || servings < 0.1 || servings > 20) { invalid = T.errors.servings; return; }
      if (!isFinite(mg) || mg < 0 || mg > 1000) { invalid = T.errors.mg; return; }
      if (mg === 0) return;
      var custom = el.querySelector('.mb-custom-name').value.trim();
      var label = presetId === 'custom' && custom ? custom : preset[1];
      rows.push({label:label, servings:servings, mg:mg, subtotal:servings * mg, time:el.querySelector('.mb-time').value});
    });
    if (invalid) throw new Error(invalid);
    if (!rows.length) throw new Error(T.errors.rows);
    return rows;
  }

  function showError(root, message) {
    var el = root.querySelector('.mb-error');
    el.textContent = message;
    el.classList.add('is-visible');
  }
  function clearError(root) { root.querySelector('.mb-error').classList.remove('is-visible'); }

  function renderResult(root) {
    clearError(root);
    try {
      var profileId = root.querySelector('.mb-profile').value;
      var profile = T.profiles[profileId];
      var weightRaw = root.querySelector('.mb-weight').value.trim();
      var weight = weightRaw === '' ? null : parseNumber(weightRaw);
      if (weight != null && (!isFinite(weight) || weight < 30 || weight > 250)) throw new Error(T.errors.weight);
      var bedtime = root.querySelector('.mb-bedtime').value;
      var rows = readRows(root);
      var total = rows.reduce(function (sum, r) { return sum + r.subtotal; }, 0);
      var max = rows.reduce(function (a, b) { return a.subtotal >= b.subtotal ? a : b; });
      var pct = total / profile.daily * 100;
      var marker = Math.max(0, Math.min(100, pct / 1.25));
      var avg = bedtime ? remainingAtBed(rows, bedtime, 4) : null;
      var fast = bedtime ? remainingAtBed(rows, bedtime, 2) : null;
      var slow = bedtime ? remainingAtBed(rows, bedtime, 8) : null;
      var result = root.querySelector('.mb-result');
      result.hidden = false;
      result.querySelector('.mb-total').innerHTML = format(total, 0) + ' <small>mg</small>';
      result.querySelector('.mb-badge').textContent = profile.label;
      result.querySelector('.mb-summary').textContent = (total <= profile.daily ? T.messages.within : T.messages.over) + ' ' + profile.daily_note;
      result.querySelector('.mb-marker').style.left = marker + '%';
      result.querySelector('.mb-ref').textContent = format(profile.daily, 0) + ' mg/den';
      result.querySelector('.mb-pct').textContent = format(pct, 0) + ' %';
      result.querySelector('.mb-perkg').textContent = weight ? format(total / weight, 1) + ' mg/kg' : '—';
      result.querySelector('.mb-max').textContent = format(max.subtotal, 0) + ' mg';
      result.querySelector('.mb-count').textContent = String(rows.length);
      var singleText = profileId === 'preg' ? T.messages.preg_single : (max.subtotal <= 200 ? T.messages.single_ok : T.messages.single_high);
      result.querySelector('.mb-single').innerHTML = '<strong>' + esc(T.single_title) + ':</strong> ' + esc(max.label) + ' — ' + format(max.subtotal, 0) + ' mg. ' + esc(singleText);
      var sleep = result.querySelector('.mb-sleep-block');
      if (avg != null) {
        sleep.hidden = false;
        sleep.querySelector('.mb-sleep-avg').textContent = format(avg, 0) + ' mg';
        sleep.querySelector('.mb-sleep-range').textContent = format(fast, 0) + '–' + format(slow, 0) + ' mg';
      } else sleep.hidden = true;
      result.querySelector('.mb-sleep-note').textContent = T.messages.sleep;
      var tbody = result.querySelector('tbody');
      tbody.innerHTML = rows.map(function (r) {
        return '<tr><td>' + esc(r.label) + '</td><td>' + format(r.servings, r.servings % 1 ? 1 : 0) + '</td><td>' + format(r.mg, 0) + ' mg</td><td>' + (r.time ? esc(r.time) : '—') + '</td><td><strong>' + format(r.subtotal, 0) + ' mg</strong></td></tr>';
      }).join('');
      result.scrollIntoView({behavior:'smooth', block:'nearest'});
    } catch (e) { showError(root, e && e.message ? e.message : T.errors.generic); }
  }

  function build(root) {
    root.setAttribute('data-version', VERSION);
    root.innerHTML = '<div class="mb-card">' +
      '<h2 class="mb-title">' + esc(T.title) + '</h2><p class="mb-lead">' + esc(T.lead) + '</p><div class="mb-notice">' + T.notice + '</div>' +
      '<div class="mb-grid"><div><label>' + esc(T.profile) + '</label><select class="mb-profile"><option value="adult">' + esc(T.profile_adult) + '</option><option value="preg">' + esc(T.profile_preg) + '</option></select></div>' +
      '<div><label>' + esc(T.weight) + '</label><input class="mb-weight" inputmode="decimal" placeholder="70"><div class="mb-hint">' + esc(T.weight_hint) + '</div></div>' +
      '<div><label>' + esc(T.bedtime) + '</label><input class="mb-bedtime" type="time" value="23:00"><div class="mb-hint">' + esc(T.bedtime_hint) + '</div></div></div>' +
      '<h3 class="mb-section-title">' + esc(T.sources_title) + '</h3><p class="mb-section-intro">' + esc(T.sources_intro) + '</p><div class="mb-list"></div>' +
      '<div class="mb-actions"><button type="button" class="mb-add">+ ' + esc(T.add) + '</button><button type="button" class="mb-primary">' + esc(T.calculate) + '</button><button type="button" class="mb-secondary">' + esc(T.reset) + '</button></div>' +
      '<div class="mb-error" role="alert"></div><div class="mb-hint" style="margin-top:12px">' + esc(T.preset_note) + '</div>' +
      '<div class="mb-result" hidden><div class="mb-result-head"><div><div class="mb-kicker">' + esc(T.result) + '</div><p class="mb-total"></p></div><div class="mb-badge"></div></div><p class="mb-summary"></p>' +
      '<div class="mb-section-intro" style="margin-top:12px">' + esc(T.scale) + '</div><div class="mb-meter"><span class="mb-marker"></span></div><div class="mb-meter-labels"><span>0 %</span><span>50 %</span><span>100 %</span><span>125 %+</span></div>' +
      '<div class="mb-stats"><div class="mb-stat"><span>' + esc(T.reference) + '</span><strong class="mb-ref"></strong></div><div class="mb-stat"><span>' + esc(T.percent) + '</span><strong class="mb-pct"></strong></div><div class="mb-stat"><span>' + esc(T.per_kg) + '</span><strong class="mb-perkg"></strong></div><div class="mb-stat"><span>' + esc(T.max_item) + '</span><strong class="mb-max"></strong></div><div class="mb-stat"><span>' + esc(T.items_count) + '</span><strong class="mb-count"></strong></div></div>' +
      '<div class="mb-info mb-single"></div><div class="mb-sleep-block" hidden><h3 class="mb-section-title">' + esc(T.sleep_title) + '</h3><div class="mb-sleep"><div class="mb-stat"><span>' + esc(T.sleep_average) + '</span><strong class="mb-sleep-avg"></strong></div><div class="mb-stat"><span>' + esc(T.sleep_range) + '</span><strong class="mb-sleep-range"></strong></div></div></div><div class="mb-info mb-sleep-note"></div>' +
      '<h3 class="mb-section-title">' + esc(T.details) + '</h3><div class="mb-table-wrap"><table><thead><tr><th>' + esc(T.item) + '</th><th>' + esc(T.servings) + '</th><th>' + esc(T.mg_serving) + '</th><th>' + esc(T.time) + '</th><th>' + esc(T.subtotal) + '</th></tr></thead><tbody></tbody></table></div>' +
      '<div class="mb-info">' + esc(T.messages.symptoms) + '</div><p class="mb-privacy">' + esc(T.privacy) + '</p></div></div>';
    var list = root.querySelector('.mb-list');
    list.appendChild(createRow({preset:'filter', servings:'1', mg:'90', time:'08:00'}));
    list.appendChild(createRow({preset:'black_tea', servings:'1', mg:'50', time:'14:00'}));
    root.querySelector('.mb-add').addEventListener('click', function () {
      if (list.children.length >= MAX_ROWS) return showError(root, T.errors.max_rows);
      clearError(root); list.appendChild(createRow({preset:'custom', servings:'1', mg:'100', time:''}));
    });
    root.querySelector('.mb-primary').addEventListener('click', function () { renderResult(root); });
    root.querySelector('.mb-secondary').addEventListener('click', function () {
      clearError(root); root.querySelector('.mb-profile').value='adult'; root.querySelector('.mb-weight').value=''; root.querySelector('.mb-bedtime').value='23:00';
      list.innerHTML=''; list.appendChild(createRow({preset:'filter', servings:'1', mg:'90', time:'08:00'})); list.appendChild(createRow({preset:'black_tea', servings:'1', mg:'50', time:'14:00'})); root.querySelector('.mb-result').hidden=true;
    });
  }

  function init() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    injectStyles(); build(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* MyBears sjednocená grafická vrstva 2.0 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || document.getElementById('mb-unified-kalkulacka-denniho-prijmu-kofeinu-styles')) return;
  var style = document.createElement('style');
  style.id = 'mb-unified-kalkulacka-denniho-prijmu-kofeinu-styles';
  style.textContent = String.raw`/* MyBears unified design layer — Product Guide v1.8 */
#mb-caffeine-intake-calculator{--mb-green:#2dc26b;--mb-green-dark:#198d4b;--mb-green-soft:#f4f8f4;--mb-border:#e5e3dc;--mb-text:#20221f;--mb-muted:#626760;--mb-cream:#faf7ef;--mb-gold:#DBC442;--mb-danger:#a63a36;width:100%;max-width:1120px;margin:24px auto 40px!important;color:var(--mb-text)!important;font-family:Arial,Helvetica,sans-serif!important;line-height:1.55}
#mb-caffeine-intake-calculator *,#mb-caffeine-intake-calculator *::before,#mb-caffeine-intake-calculator *::after{box-sizing:border-box}
#mb-caffeine-intake-calculator .mb-card{position:relative;overflow:hidden;padding:0!important;border:1px solid var(--mb-border)!important;border-radius:18px!important;background:#fff!important;box-shadow:0 12px 32px rgba(27,35,29,.07)!important}
#mb-caffeine-intake-calculator .mb-card::before{content:"";position:absolute;z-index:3;top:0;left:0;right:0;height:4px;background:var(--mb-gold)}
#mb-caffeine-intake-calculator .mb-title{margin:0!important;padding:34px 38px 8px!important;background:var(--mb-cream)!important;color:var(--mb-green)!important;font-size:clamp(25px,3.2vw,30px)!important;line-height:1.16!important}
#mb-caffeine-intake-calculator .mb-lead{margin:0!important;padding:0 38px 26px!important;background:var(--mb-cream)!important;border-bottom:1px solid var(--mb-border)!important;color:#454a45!important;font-size:16px!important}
#mb-caffeine-intake-calculator .mb-notice{margin:30px 38px 22px!important;padding:15px 17px!important;border:1px solid #eadfc8!important;border-left:4px solid var(--mb-gold)!important;border-radius:12px!important;background:var(--mb-cream)!important;color:#4f4b43!important}
#mb-caffeine-intake-calculator .mb-grid,#mb-caffeine-intake-calculator .mb-section-title,#mb-caffeine-intake-calculator .mb-section-intro,#mb-caffeine-intake-calculator .mb-list,#mb-caffeine-intake-calculator .mb-actions,#mb-caffeine-intake-calculator .mb-error,#mb-caffeine-intake-calculator .mb-result,#mb-caffeine-intake-calculator .mb-card>.mb-hint{margin-left:38px!important;margin-right:38px!important}
#mb-caffeine-intake-calculator .mb-section-title{color:var(--mb-green)!important}
#mb-caffeine-intake-calculator label{color:#292b28!important;font-weight:700!important}
#mb-caffeine-intake-calculator input,#mb-caffeine-intake-calculator select{min-height:48px!important;border:1px solid #d4d6d1!important;border-radius:8px!important;background:#fff!important;color:var(--mb-text)!important}
#mb-caffeine-intake-calculator input:focus,#mb-caffeine-intake-calculator select:focus{outline:3px solid rgba(219,196,66,.30)!important;border-color:var(--mb-green-dark)!important;box-shadow:none!important}
#mb-caffeine-intake-calculator .mb-source,#mb-caffeine-intake-calculator .mb-stat,#mb-caffeine-intake-calculator .mb-info{border:1px solid var(--mb-border)!important;border-radius:12px!important;background:#fff!important}
#mb-caffeine-intake-calculator .mb-source{background:var(--mb-cream)!important}
#mb-caffeine-intake-calculator button{border-radius:8px!important;font-weight:700!important}
#mb-caffeine-intake-calculator button.mb-primary{color:#fff!important;background:var(--mb-green)!important;border:2px solid var(--mb-green)!important}
#mb-caffeine-intake-calculator button.mb-primary:hover{background:var(--mb-green-dark)!important;border-color:var(--mb-green-dark)!important}
#mb-caffeine-intake-calculator button.mb-secondary,#mb-caffeine-intake-calculator button.mb-add{color:var(--mb-green-dark)!important;background:#fff!important;border:2px solid var(--mb-green)!important}
#mb-caffeine-intake-calculator button:focus-visible,#mb-caffeine-intake-calculator a:focus-visible{outline:3px solid rgba(219,196,66,.38)!important;outline-offset:2px!important}
#mb-caffeine-intake-calculator .mb-result{margin-top:28px!important;margin-bottom:36px!important;padding:24px!important;border:1px solid #cfe4d5!important;border-radius:16px!important;background:var(--mb-green-soft)!important}
#mb-caffeine-intake-calculator .mb-total{color:#20221f!important}
#mb-caffeine-intake-calculator .mb-badge{border:1px solid #d7ceb8!important;background:#fff8df!important;color:#75633d!important}
#mb-caffeine-intake-calculator .mb-table-wrap{overflow-x:auto;border:1px solid var(--mb-border)!important;border-radius:12px!important}
#mb-caffeine-intake-calculator thead th{border-bottom:2px solid var(--mb-gold)!important;background:#20231f!important;color:#fff!important}
#mb-caffeine-intake-calculator tbody tr:nth-child(even){background:var(--mb-green-soft)!important}
@media(max-width:760px){#mb-caffeine-intake-calculator .mb-title{padding:28px 20px 8px!important}#mb-caffeine-intake-calculator .mb-lead{padding:0 20px 22px!important}#mb-caffeine-intake-calculator .mb-notice,#mb-caffeine-intake-calculator .mb-grid,#mb-caffeine-intake-calculator .mb-section-title,#mb-caffeine-intake-calculator .mb-section-intro,#mb-caffeine-intake-calculator .mb-list,#mb-caffeine-intake-calculator .mb-actions,#mb-caffeine-intake-calculator .mb-error,#mb-caffeine-intake-calculator .mb-result,#mb-caffeine-intake-calculator .mb-card>.mb-hint{margin-left:20px!important;margin-right:20px!important}#mb-caffeine-intake-calculator .mb-actions{flex-direction:column}#mb-caffeine-intake-calculator .mb-actions button{width:100%}}
@media(prefers-reduced-motion:reduce){#mb-caffeine-intake-calculator *,#mb-caffeine-intake-calculator *::before,#mb-caffeine-intake-calculator *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}`;
  document.head.appendChild(style);
})();
