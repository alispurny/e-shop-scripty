/**
 * MyBears — sjednocená grafická verze 2.0 (CZ)
 * Vizuální systém vychází z MyBears Product Guide v1.8.
 * Funkční logika, výpočty, interní ID, URL a veřejné API zůstávají zachované.
 */
(function () {
  'use strict';

  var ROOT_ID = 'mb-activity-calorie-calculator';
  var STYLE_ID = 'mb-activity-calorie-calculator-styles';
  var SCRIPT_VERSION = '2.0.0-cz';
  var MAX_ROWS = 4;
  var CATEGORIES = {"chuze":"Chůze a turistika","beh":"Běh","kolo":"Cyklistika","fitness":"Fitness a posilování","tanec":"Tanec","sport":"Sporty","voda":"Vodní aktivity","domacnost":"Domácnost a zahrada","zima":"Zimní aktivity"};
  var ACTIVITIES = [{"id":"walk-dog","cat":"chuze","code":"17165","met":3.0,"name":"Venčení psa"},{"id":"walk-slow","cat":"chuze","code":"17152","met":2.8,"name":"Chůze pomalá, 3,2–3,9 km/h"},{"id":"walk-4","cat":"chuze","code":"17170","met":3.0,"name":"Chůze 4,0 km/h, rovina"},{"id":"walk-moderate","cat":"chuze","code":"17190","met":3.8,"name":"Chůze středním tempem, 4,5–5,5 km/h"},{"id":"walk-brisk","cat":"chuze","code":"17200","met":4.8,"name":"Svižná chůze, 5,6–6,3 km/h"},{"id":"walk-very-brisk","cat":"chuze","code":"17220","met":5.5,"name":"Velmi svižná chůze, 6,4–7,0 km/h"},{"id":"hike-slow","cat":"chuze","code":"17081","met":3.8,"name":"Pomalá turistika v terénu"},{"id":"hike-normal","cat":"chuze","code":"17082","met":5.3,"name":"Turistika běžným tempem v terénu"},{"id":"hike-cross","cat":"chuze","code":"17080","met":6.0,"name":"Turistika členitým terénem"},{"id":"nordic-moderate","cat":"chuze","code":"17302","met":4.3,"name":"Nordic walking, 4,0–5,6 km/h"},{"id":"nordic-fast","cat":"chuze","code":"17304","met":5.3,"name":"Nordic walking, 5,8–7,1 km/h"},{"id":"stairs-slow","cat":"chuze","code":"17133","met":4.5,"name":"Chůze do schodů, pomalé tempo"},{"id":"stairs-general","cat":"chuze","code":"17131","met":6.8,"name":"Chůze do schodů, běžné tempo"},{"id":"stairs-fast","cat":"chuze","code":"17134","met":9.3,"name":"Chůze do schodů, rychlé tempo"},{"id":"jog-walk","cat":"beh","code":"12010","met":6.0,"name":"Střídání běhu a chůze"},{"id":"jog-general","cat":"beh","code":"12020","met":7.5,"name":"Lehký běh / jogging, vlastní tempo"},{"id":"run-6-5","cat":"beh","code":"12028","met":6.5,"name":"Běh 6,4–6,8 km/h"},{"id":"run-7-3","cat":"beh","code":"12029","met":7.8,"name":"Běh 6,9–7,7 km/h"},{"id":"run-8","cat":"beh","code":"12030","met":8.5,"name":"Běh přibližně 8 km/h"},{"id":"run-9","cat":"beh","code":"12045","met":9.0,"name":"Běh 8,9–9,3 km/h"},{"id":"run-10","cat":"beh","code":"12050","met":9.3,"name":"Běh přibližně 10 km/h"},{"id":"run-10-8","cat":"beh","code":"12060","met":10.5,"name":"Běh přibližně 10,8 km/h"},{"id":"run-11-3","cat":"beh","code":"12070","met":11.0,"name":"Běh přibližně 11,3 km/h"},{"id":"run-12-1","cat":"beh","code":"12080","met":11.8,"name":"Běh přibližně 12,1 km/h"},{"id":"run-12-9","cat":"beh","code":"12090","met":12.0,"name":"Běh přibližně 12,9 km/h"},{"id":"run-13-8","cat":"beh","code":"12100","met":12.5,"name":"Běh přibližně 13,8 km/h"},{"id":"run-14-5","cat":"beh","code":"12110","met":13.0,"name":"Běh přibližně 14,5 km/h"},{"id":"run-16","cat":"beh","code":"12120","met":14.8,"name":"Běh přibližně 16,1 km/h"},{"id":"run-trail","cat":"beh","code":"12140","met":9.3,"name":"Běh v terénu / cross-country"},{"id":"run-stairs","cat":"beh","code":"12170","met":15.0,"name":"Běh do schodů"},{"id":"bike-easy","cat":"kolo","code":"01015","met":4.3,"name":"Jízda na kole, lehké vlastní tempo"},{"id":"bike-moderate","cat":"kolo","code":"01016","met":7.0,"name":"Jízda na kole, střední vlastní tempo"},{"id":"bike-vigorous","cat":"kolo","code":"01017","met":9.0,"name":"Jízda na kole, intenzivní vlastní tempo"},{"id":"bike-16-19","cat":"kolo","code":"01020","met":6.8,"name":"Kolo 16–19 km/h, lehčí úsilí"},{"id":"bike-19-22","cat":"kolo","code":"01030","met":8.0,"name":"Kolo 19–22 km/h, střední úsilí"},{"id":"bike-23-26","cat":"kolo","code":"01040","met":10.0,"name":"Kolo 23–26 km/h, rychle"},{"id":"bike-26-31","cat":"kolo","code":"01050","met":12.0,"name":"Kolo 26–31 km/h, velmi rychle"},{"id":"bike-mtb","cat":"kolo","code":"01009","met":8.5,"name":"Horské kolo, obecně"},{"id":"ebike-light","cat":"kolo","code":"01084","met":6.0,"name":"Elektrokolo, lehká dopomoc"},{"id":"ebike-high","cat":"kolo","code":"01088","met":4.0,"name":"Elektrokolo, vysoká dopomoc"},{"id":"bike-stationary-light","cat":"kolo","code":"01214","met":4.0,"name":"Rotoped, lehká zátěž kolem 50 W"},{"id":"bike-stationary-moderate","cat":"kolo","code":"01220","met":6.0,"name":"Rotoped, střední zátěž 90–100 W"},{"id":"bike-stationary-vigorous","cat":"kolo","code":"01232","met":10.3,"name":"Rotoped, vysoká zátěž 151–199 W"},{"id":"spin","cat":"kolo","code":"01270","met":9.0,"name":"Spinning / indoor cycling lekce"},{"id":"stretch","cat":"fitness","code":"02101","met":2.3,"name":"Lehký strečink"},{"id":"pilates","cat":"fitness","code":"02105","met":2.8,"name":"Pilates, obecně"},{"id":"yoga-hatha","cat":"fitness","code":"02175","met":2.3,"name":"Jóga, obecně / Hatha"},{"id":"yoga-vinyasa","cat":"fitness","code":"02185","met":2.7,"name":"Vinyasa jóga"},{"id":"yoga-power","cat":"fitness","code":"02160","met":4.0,"name":"Power jóga"},{"id":"bodyweight","cat":"fitness","code":"02056","met":3.0,"name":"Cvičení s vlastní vahou, běžná intenzita"},{"id":"bodyweight-high","cat":"fitness","code":"02057","met":6.5,"name":"Cvičení s vlastní vahou, vysoká intenzita"},{"id":"weights-general","cat":"fitness","code":"02054","met":3.5,"name":"Posilování, více cviků, 8–15 opakování"},{"id":"weights-heavy","cat":"fitness","code":"02052","met":5.0,"name":"Silový trénink, dřepy / mrtvé tahy"},{"id":"weights-vigorous","cat":"fitness","code":"02050","met":6.0,"name":"Posilování, intenzivní úsilí"},{"id":"circuit-moderate","cat":"fitness","code":"02035","met":5.0,"name":"Kruhový trénink, střední intenzita"},{"id":"circuit-vigorous","cat":"fitness","code":"02040","met":7.5,"name":"Kruhový trénink, vysoká intenzita"},{"id":"elliptical-moderate","cat":"fitness","code":"02048","met":5.0,"name":"Eliptický trenažér, střední intenzita"},{"id":"elliptical-vigorous","cat":"fitness","code":"02049","met":9.0,"name":"Eliptický trenažér, vysoká intenzita"},{"id":"rowing-moderate","cat":"fitness","code":"02071","met":5.0,"name":"Veslovací trenažér, do 100 W"},{"id":"rowing-vigorous","cat":"fitness","code":"02072","met":7.5,"name":"Veslovací trenažér, 100–149 W"},{"id":"rowing-hard","cat":"fitness","code":"02073","met":11.0,"name":"Veslovací trenažér, 150–199 W"},{"id":"jump-rope","cat":"fitness","code":"02068","met":11.0,"name":"Skákání přes švihadlo, obecně"},{"id":"zumba","cat":"fitness","code":"02310","met":6.5,"name":"Zumba, skupinová lekce"},{"id":"hiit-moderate","cat":"fitness","code":"02210","met":7.0,"name":"HIIT, střední úsilí"},{"id":"hiit-vigorous","cat":"fitness","code":"02214","met":11.0,"name":"HIIT / Tabata, vysoké úsilí"},{"id":"kettlebell","cat":"fitness","code":"02058","met":9.8,"name":"Kettlebell swings"},{"id":"dance-slow","cat":"tanec","code":"03040","met":3.0,"name":"Pomalý společenský tanec"},{"id":"dance-recreational","cat":"tanec","code":"03042","met":6.0,"name":"Rekreační společenský tanec"},{"id":"dance-salsa","cat":"tanec","code":"03090","met":4.8,"name":"Salsa v páru"},{"id":"dance-fast","cat":"tanec","code":"03030","met":5.5,"name":"Rychlý společenský tanec"},{"id":"dance-vigorous","cat":"tanec","code":"03031","met":9.8,"name":"Intenzivní klubový nebo lidový tanec"},{"id":"badminton-social","cat":"sport","code":"15030","met":5.5,"name":"Badminton, rekreační"},{"id":"badminton-match","cat":"sport","code":"15025","met":9.0,"name":"Badminton, soutěžní zápas"},{"id":"basketball","cat":"sport","code":"15040","met":8.0,"name":"Basketbal, zápas"},{"id":"bowling","cat":"sport","code":"15092","met":3.8,"name":"Bowling"},{"id":"boxing-bag","cat":"sport","code":"15110","met":5.8,"name":"Box, údery do pytle"},{"id":"boxing-sparring","cat":"sport","code":"15120","met":7.8,"name":"Box, sparring"},{"id":"golf-walk","cat":"sport","code":"15265","met":4.3,"name":"Golf, chůze a nesení holí"},{"id":"handball","cat":"sport","code":"15330","met":8.0,"name":"Házená, týmová"},{"id":"hockey","cat":"sport","code":"15360","met":8.0,"name":"Lední hokej, obecně"},{"id":"horse","cat":"sport","code":"15370","met":5.5,"name":"Jízda na koni, obecně"},{"id":"judo","cat":"sport","code":"15433","met":11.3,"name":"Judo"},{"id":"kickboxing","cat":"sport","code":"15457","met":7.3,"name":"Kickbox"},{"id":"climbing","cat":"sport","code":"15537","met":5.8,"name":"Lezení na stěně, nižší až střední obtížnost"},{"id":"soccer-casual","cat":"sport","code":"15610","met":7.0,"name":"Fotbal, rekreační"},{"id":"soccer-competitive","cat":"sport","code":"15605","met":9.5,"name":"Fotbal, soutěžní"},{"id":"table-tennis","cat":"sport","code":"15660","met":4.0,"name":"Stolní tenis"},{"id":"tennis-moderate","cat":"sport","code":"15675","met":6.8,"name":"Tenis, střední úsilí"},{"id":"tennis-competitive","cat":"sport","code":"15676","met":8.0,"name":"Tenis, soutěžní"},{"id":"volleyball-recreation","cat":"sport","code":"15720","met":3.0,"name":"Volejbal, rekreační"},{"id":"volleyball-competitive","cat":"sport","code":"15711","met":6.0,"name":"Volejbal v hale, soutěžní"},{"id":"volleyball-beach","cat":"sport","code":"15725","met":8.0,"name":"Plážový volejbal"},{"id":"canoe-leisure","cat":"voda","code":"18070","met":3.5,"name":"Kanoe / veslování pro radost"},{"id":"kayak-moderate","cat":"voda","code":"18100","met":5.0,"name":"Kajak, střední úsilí"},{"id":"sup-general","cat":"voda","code":"18224","met":6.5,"name":"Paddleboard, obecně"},{"id":"swim-leisure","cat":"voda","code":"18310","met":6.0,"name":"Plavání volně, bez počítání délek"},{"id":"swim-freestyle-slow","cat":"voda","code":"18240","met":5.8,"name":"Plavání kraulem, pomalu / rekreačně"},{"id":"swim-freestyle-fast","cat":"voda","code":"18230","met":9.8,"name":"Plavání kraulem, rychle"},{"id":"swim-back","cat":"voda","code":"18255","met":4.8,"name":"Znak, rekreačně"},{"id":"swim-breast","cat":"voda","code":"18265","met":5.3,"name":"Prsa, rekreačně"},{"id":"water-aerobics","cat":"voda","code":"18355","met":5.5,"name":"Aqua aerobik, obecně"},{"id":"tread-water","cat":"voda","code":"18350","met":3.5,"name":"Šlapání vody, střední úsilí"},{"id":"cook","cat":"domacnost","code":"05050","met":2.0,"name":"Vaření a příprava jídla, lehká činnost"},{"id":"dishes","cat":"domacnost","code":"05041","met":2.0,"name":"Mytí nádobí"},{"id":"dusting","cat":"domacnost","code":"05032","met":2.5,"name":"Utírání prachu / leštění nábytku"},{"id":"vacuum","cat":"domacnost","code":"05043","met":3.0,"name":"Vysávání"},{"id":"sweeping","cat":"domacnost","code":"05010","met":3.3,"name":"Zametání podlahy"},{"id":"mopping","cat":"domacnost","code":"05021","met":3.5,"name":"Vytírání, střední úsilí"},{"id":"heavy-clean","cat":"domacnost","code":"05020","met":3.5,"name":"Velký úklid / mytí auta / garáže"},{"id":"shopping","cat":"domacnost","code":"05060","met":3.3,"name":"Nákup potravin s vozíkem nebo bez něj"},{"id":"groceries-upstairs","cat":"domacnost","code":"05056","met":5.3,"name":"Nošení nákupu do schodů"},{"id":"move-furniture","cat":"domacnost","code":"05120","met":5.8,"name":"Stěhování nábytku a krabic"},{"id":"garden-general","cat":"domacnost","code":"08245","met":3.8,"name":"Práce na zahradě, obecně"},{"id":"raking","cat":"domacnost","code":"08160","met":4.0,"name":"Hrabání listí / trávníku"},{"id":"weeding","cat":"domacnost","code":"08240","met":4.5,"name":"Pletí a kultivace záhonu"},{"id":"digging","cat":"domacnost","code":"08050","met":5.0,"name":"Rytí a kopání na zahradě"},{"id":"mowing","cat":"domacnost","code":"08095","met":5.5,"name":"Sekání trávy, chůze se sekačkou"},{"id":"skate-leisure","cat":"zima","code":"19020","met":5.5,"name":"Bruslení na ledě, volně"},{"id":"skate-general","cat":"zima","code":"19030","met":7.0,"name":"Bruslení na ledě, běžné tempo"},{"id":"ski-down-light","cat":"zima","code":"19150","met":4.3,"name":"Sjezdové lyžování / snowboard, lehké úsilí"},{"id":"ski-down-moderate","cat":"zima","code":"19160","met":6.3,"name":"Sjezdové lyžování / snowboard, střední úsilí"},{"id":"ski-down-vigorous","cat":"zima","code":"19170","met":8.0,"name":"Sjezdové lyžování / snowboard, vysoké úsilí"},{"id":"ski-xc-light","cat":"zima","code":"19080","met":6.8,"name":"Běžecké lyžování, pomalu"},{"id":"ski-xc-moderate","cat":"zima","code":"19090","met":8.5,"name":"Běžecké lyžování, střední tempo"},{"id":"ski-xc-vigorous","cat":"zima","code":"19100","met":11.3,"name":"Běžecké lyžování, rychle"},{"id":"snow-shovel","cat":"zima","code":"19252","met":5.3,"name":"Odklízení sněhu lopatou, střední úsilí"}];

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    return Number(value.trim().replace(',', '.'));
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function formatNumber(value, decimals) {
    return new Intl.NumberFormat('cs-CZ', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char];
    });
  }

  function findActivity(id) {
    for (var i = 0; i < ACTIVITIES.length; i += 1) {
      if (ACTIVITIES[i].id === id) return ACTIVITIES[i];
    }
    return null;
  }

  function activitiesByCategory(category) {
    return ACTIVITIES.filter(function (item) { return item.cat === category; });
  }

  function intensity(met) {
    if (met < 3) return {label:'Lehká intenzita', key:'light'};
    if (met < 6) return {label:'Střední intenzita', key:'moderate'};
    return {label:'Vysoká intenzita', key:'vigorous'};
  }

  function addStyles() {
    var oldStyle = document.getElementById(STYLE_ID);
    if (oldStyle && oldStyle.parentNode) oldStyle.parentNode.removeChild(oldStyle);
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '#' + ROOT_ID + ' { --mb-green:#2dc26b; --mb-green-dark:#168947; --mb-green-soft:#f7fbf8; --mb-border:#d9e5dd; --mb-text:#1f2933; --mb-muted:#59636e; --mb-danger:#b42318; --mb-blue:#4d9ed1; --mb-yellow:#e6b73b; font-family:Arial,Helvetica,sans-serif; color:var(--mb-text); margin:24px 0; }',
      '#' + ROOT_ID + ' * { box-sizing:border-box; }',
      '#' + ROOT_ID + ' .mb-ac { border:1px solid var(--mb-border); border-radius:14px; background:#fff; box-shadow:0 8px 28px rgba(31,41,51,.08); overflow:hidden; }',
      '#' + ROOT_ID + ' .mb-ac__head { padding:22px 22px 16px; background:var(--mb-green-soft); border-bottom:1px solid var(--mb-border); }',
      '#' + ROOT_ID + ' .mb-ac__title { margin:0 0 8px; font-size:22px; line-height:1.25; }',
      '#' + ROOT_ID + ' .mb-ac__lead { margin:0; color:var(--mb-muted); font-size:16px; line-height:1.55; }',
      '#' + ROOT_ID + ' .mb-ac__body { padding:22px; }',
      '#' + ROOT_ID + ' .mb-ac__notice { margin:0 0 18px; padding:12px 14px; border-left:4px solid var(--mb-green); border-radius:6px; background:#f8faf9; color:var(--mb-muted); font-size:14px; line-height:1.5; }',
      '#' + ROOT_ID + ' .mb-ac__weight { max-width:360px; margin-bottom:18px; }',
      '#' + ROOT_ID + ' .mb-ac__label { display:block; margin:0 0 7px; font-size:15px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-ac__input-wrap { position:relative; }',
      '#' + ROOT_ID + ' .mb-ac__input, #' + ROOT_ID + ' .mb-ac__select { width:100%; min-height:48px; padding:11px 12px; border:1px solid #b9c6be; border-radius:8px; background:#fff; color:var(--mb-text); font:inherit; font-size:16px; }',
      '#' + ROOT_ID + ' .mb-ac__input { padding-right:60px; }',
      '#' + ROOT_ID + ' .mb-ac__input:focus, #' + ROOT_ID + ' .mb-ac__select:focus { outline:3px solid rgba(45,194,107,.2); border-color:var(--mb-green-dark); }',
      '#' + ROOT_ID + ' .mb-ac__unit { position:absolute; right:12px; top:50%; transform:translateY(-50%); color:var(--mb-muted); font-size:14px; pointer-events:none; }',
      '#' + ROOT_ID + ' .mb-ac__hint { display:block; margin-top:6px; color:var(--mb-muted); font-size:13px; line-height:1.4; }',
      '#' + ROOT_ID + ' .mb-ac__rows { display:grid; gap:12px; }',
      '#' + ROOT_ID + ' .mb-ac__row { display:grid; grid-template-columns:minmax(160px,.8fr) minmax(250px,1.5fr) minmax(120px,.55fr) auto; gap:12px; align-items:end; padding:14px; border:1px solid var(--mb-border); border-radius:10px; background:#fbfcfb; }',
      '#' + ROOT_ID + ' .mb-ac__row-label { margin:0 0 8px; font-size:14px; font-weight:800; color:#0f6f38; }',
      '#' + ROOT_ID + ' .mb-ac__remove { min-width:44px; min-height:48px; padding:8px 11px; border:1px solid #c5d0c9; border-radius:8px; background:#fff; color:#6a3430; font:inherit; font-size:20px; cursor:pointer; }',
      '#' + ROOT_ID + ' .mb-ac__remove[hidden] { display:none; }',
      '#' + ROOT_ID + ' .mb-ac__actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:18px; }',
      '#' + ROOT_ID + ' .mb-ac__button { min-height:46px; padding:11px 20px; border-radius:8px; border:1px solid transparent; font:inherit; font-size:16px; font-weight:700; cursor:pointer; }',
      '#' + ROOT_ID + ' .mb-ac__button:focus-visible, #' + ROOT_ID + ' .mb-ac__remove:focus-visible { outline:3px solid rgba(45,194,107,.28); outline-offset:2px; }',
      '#' + ROOT_ID + ' .mb-ac__button--primary { background:var(--mb-green); color:#0c2818; border-color:var(--mb-green); box-shadow:0 4px 12px rgba(45,194,107,.22); }',
      '#' + ROOT_ID + ' .mb-ac__button--secondary { background:#fff; color:var(--mb-text); border-color:#b9c6be; }',
      '#' + ROOT_ID + ' .mb-ac__error { display:none; margin:16px 0 0; padding:12px 14px; border:1px solid #f1b5b0; border-radius:8px; background:#fff6f5; color:var(--mb-danger); font-size:14px; line-height:1.45; }',
      '#' + ROOT_ID + ' .mb-ac__error.is-visible { display:block; }',
      '#' + ROOT_ID + ' .mb-ac__result { margin-top:22px; padding:20px; border:1px solid #b8e7ca; border-radius:12px; background:var(--mb-green-soft); }',
      '#' + ROOT_ID + ' .mb-ac__result[hidden] { display:none; }',
      '#' + ROOT_ID + ' .mb-ac__result-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }',
      '#' + ROOT_ID + ' .mb-ac__result-label { margin:0 0 5px; color:var(--mb-muted); font-size:14px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-ac__score { margin:0; font-size:38px; line-height:1.05; font-weight:800; letter-spacing:-.03em; }',
      '#' + ROOT_ID + ' .mb-ac__badge { display:inline-flex; min-height:34px; align-items:center; padding:6px 11px; border:1px solid #b9c6be; border-radius:999px; background:#fff; font-size:14px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-ac__summary { margin:14px 0 0; font-size:15px; line-height:1.55; }',
      '#' + ROOT_ID + ' .mb-ac__metrics { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin-top:18px; }',
      '#' + ROOT_ID + ' .mb-ac__metric { padding:14px; border:1px solid var(--mb-border); border-radius:9px; background:#fff; }',
      '#' + ROOT_ID + ' .mb-ac__metric-label { margin:0 0 7px; color:var(--mb-muted); font-size:13px; font-weight:700; }',
      '#' + ROOT_ID + ' .mb-ac__metric-value { margin:0; font-size:18px; line-height:1.25; font-weight:800; }',
      '#' + ROOT_ID + ' .mb-ac__items { display:grid; gap:12px; margin-top:18px; }',
      '#' + ROOT_ID + ' .mb-ac__item { padding:15px; border:1px solid var(--mb-border); border-radius:10px; background:#fff; }',
      '#' + ROOT_ID + ' .mb-ac__item-head { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; flex-wrap:wrap; }',
      '#' + ROOT_ID + ' .mb-ac__item-title { margin:0; font-size:16px; line-height:1.35; }',
      '#' + ROOT_ID + ' .mb-ac__item-meta { margin:5px 0 0; color:var(--mb-muted); font-size:13px; }',
      '#' + ROOT_ID + ' .mb-ac__item-kcal { margin:0; font-size:22px; font-weight:800; white-space:nowrap; }',
      '#' + ROOT_ID + ' .mb-ac__bar { height:10px; margin:12px 0 7px; border-radius:999px; background:#e7ece9; overflow:hidden; }',
      '#' + ROOT_ID + ' .mb-ac__bar-fill { height:100%; min-width:2px; border-radius:999px; background:var(--mb-green); }',
      '#' + ROOT_ID + ' .mb-ac__item-details { display:flex; flex-wrap:wrap; gap:8px 16px; color:var(--mb-muted); font-size:13px; line-height:1.45; }',
      '#' + ROOT_ID + ' .mb-ac__formula { margin:16px 0 0; padding-top:14px; border-top:1px solid #cfe4d6; color:var(--mb-muted); font-size:13px; line-height:1.5; }',
      '#' + ROOT_ID + ' .mb-ac__privacy { margin:16px 0 0; color:var(--mb-muted); font-size:12px; line-height:1.45; }',
      '@media (max-width:850px) { #' + ROOT_ID + ' .mb-ac__row { grid-template-columns:1fr 1fr; } #' + ROOT_ID + ' .mb-ac__remove { grid-column:2; justify-self:end; } }',
      '@media (max-width:620px) { #' + ROOT_ID + ' .mb-ac__row, #' + ROOT_ID + ' .mb-ac__metrics { grid-template-columns:1fr; } #' + ROOT_ID + ' .mb-ac__remove { grid-column:auto; justify-self:stretch; } #' + ROOT_ID + ' .mb-ac__body, #' + ROOT_ID + ' .mb-ac__head { padding-left:16px; padding-right:16px; } #' + ROOT_ID + ' .mb-ac__score { font-size:32px; } }',
      '@media (prefers-reduced-motion:reduce) { #' + ROOT_ID + ' * { scroll-behavior:auto !important; transition:none !important; } }'
    ].join('\n');
    document.head.appendChild(style);
  }

  function categoryOptions(selected) {
    var html = '';
    Object.keys(CATEGORIES).forEach(function (key) {
      html += '<option value="' + key + '"' + (key === selected ? ' selected' : '') + '>' + escapeHtml(CATEGORIES[key]) + '</option>';
    });
    return html;
  }

  function activityOptions(category, selected) {
    var list = activitiesByCategory(category);
    var html = '';
    list.forEach(function (item) {
      html += '<option value="' + item.id + '"' + (item.id === selected ? ' selected' : '') + '>' + escapeHtml(item.name) + ' (' + formatNumber(item.met, 1) + ' MET)</option>';
    });
    return html;
  }

  function createRow(index, category, activityId, minutes) {
    var row = document.createElement('div');
    row.className = 'mb-ac__row';
    row.setAttribute('data-row-index', String(index));
    row.innerHTML = [
      '<div class="mb-ac__field"><p class="mb-ac__row-label">Aktivita ' + (index + 1) + '</p><label class="mb-ac__label" for="mb-ac-category-' + index + '">Kategorie</label><select class="mb-ac__select mb-ac__category" id="mb-ac-category-' + index + '">' + categoryOptions(category) + '</select></div>',
      '<div class="mb-ac__field"><label class="mb-ac__label" for="mb-ac-activity-' + index + '">Konkrétní aktivita</label><select class="mb-ac__select mb-ac__activity" id="mb-ac-activity-' + index + '">' + activityOptions(category, activityId) + '</select></div>',
      '<div class="mb-ac__field"><label class="mb-ac__label" for="mb-ac-minutes-' + index + '">Doba trvání</label><div class="mb-ac__input-wrap"><input class="mb-ac__input mb-ac__minutes" id="mb-ac-minutes-' + index + '" inputmode="decimal" autocomplete="off" value="' + minutes + '"><span class="mb-ac__unit">min</span></div><span class="mb-ac__hint">1–600 minut</span></div>',
      '<button class="mb-ac__remove" type="button" aria-label="Odebrat aktivitu ' + (index + 1) + '" title="Odebrat aktivitu">×</button>'
    ].join('');
    return row;
  }

  function updateRowNumbers(rowsContainer) {
    var rows = rowsContainer.querySelectorAll('.mb-ac__row');
    Array.prototype.forEach.call(rows, function (row, index) {
      row.setAttribute('data-row-index', String(index));
      var label = row.querySelector('.mb-ac__row-label');
      if (label) label.textContent = 'Aktivita ' + (index + 1);
      var remove = row.querySelector('.mb-ac__remove');
      if (remove) {
        remove.hidden = rows.length === 1;
        remove.setAttribute('aria-label', 'Odebrat aktivitu ' + (index + 1));
      }
    });
  }

  function init() {
    var root = document.getElementById(ROOT_ID);
    if (!root || root.getAttribute('data-mb-version') === SCRIPT_VERSION) return;
    addStyles();
    root.setAttribute('data-mb-version', SCRIPT_VERSION);
    root.innerHTML = [
      '<section class="mb-ac" aria-labelledby="mb-ac-title">',
      '  <div class="mb-ac__head">',
      '    <h2 class="mb-ac__title" id="mb-ac-title">Kalkulačka spálených kalorií při sportu a aktivitách</h2>',
      '    <p class="mb-ac__lead">Porovnejte orientační energetický výdej při sportu, chůzi, domácích pracích i dalších činnostech pomocí hodnot MET.</p>',
      '  </div>',
      '  <div class="mb-ac__body">',
      '    <p class="mb-ac__notice"><strong>Důležité:</strong> Výsledek je tabulkový odhad. Skutečný výdej ovlivňuje intenzita, kondice, technika, terén, teplota a individuální klidový metabolismus.</p>',
      '    <form id="mb-ac-form" novalidate>',
      '      <div class="mb-ac__weight"><label class="mb-ac__label" for="mb-ac-weight">Tělesná hmotnost</label><div class="mb-ac__input-wrap"><input class="mb-ac__input" id="mb-ac-weight" inputmode="decimal" autocomplete="off" value="70" aria-describedby="mb-ac-weight-hint"><span class="mb-ac__unit">kg</span></div><span class="mb-ac__hint" id="mb-ac-weight-hint">Povolené rozmezí: 30–300 kg</span></div>',
      '      <div class="mb-ac__rows" id="mb-ac-rows"></div>',
      '      <div class="mb-ac__actions">',
      '        <button class="mb-ac__button mb-ac__button--secondary" id="mb-ac-add" type="button">+ Přidat aktivitu</button>',
      '        <button class="mb-ac__button mb-ac__button--primary" type="submit">Vypočítat výdej</button>',
      '        <button class="mb-ac__button mb-ac__button--secondary" id="mb-ac-reset" type="button">Vymazat údaje</button>',
      '      </div>',
      '      <div class="mb-ac__error" id="mb-ac-error" role="alert" aria-live="assertive"></div>',
      '    </form>',
      '    <section class="mb-ac__result" id="mb-ac-result" aria-live="polite" hidden></section>',
      '    <p class="mb-ac__privacy">Výpočet probíhá pouze ve vašem prohlížeči. Zadaná hmotnost ani zvolené aktivity se tímto skriptem nikam neodesílají ani neukládají.</p>',
      '  </div>',
      '</section>'
    ].join('');

    var form = root.querySelector('#mb-ac-form');
    var rowsContainer = root.querySelector('#mb-ac-rows');
    var addButton = root.querySelector('#mb-ac-add');
    var resetButton = root.querySelector('#mb-ac-reset');
    var error = root.querySelector('#mb-ac-error');
    var result = root.querySelector('#mb-ac-result');
    var weightInput = root.querySelector('#mb-ac-weight');

    function appendRow(category, activityId, minutes) {
      var count = rowsContainer.querySelectorAll('.mb-ac__row').length;
      if (count >= MAX_ROWS) return;
      var defaults = activitiesByCategory(category);
      var selected = activityId || (defaults[0] ? defaults[0].id : '');
      rowsContainer.appendChild(createRow(count, category, selected, minutes || 30));
      updateRowNumbers(rowsContainer);
      addButton.disabled = rowsContainer.querySelectorAll('.mb-ac__row').length >= MAX_ROWS;
    }

    function showError(message) {
      error.textContent = message;
      error.classList.add('is-visible');
      result.hidden = true;
    }

    function clearError() {
      error.textContent = '';
      error.classList.remove('is-visible');
    }

    rowsContainer.addEventListener('change', function (event) {
      if (!event.target.classList.contains('mb-ac__category')) return;
      var row = event.target.closest('.mb-ac__row');
      var activitySelect = row.querySelector('.mb-ac__activity');
      activitySelect.innerHTML = activityOptions(event.target.value, '');
    });

    rowsContainer.addEventListener('click', function (event) {
      if (!event.target.classList.contains('mb-ac__remove')) return;
      var row = event.target.closest('.mb-ac__row');
      if (row) row.parentNode.removeChild(row);
      updateRowNumbers(rowsContainer);
      addButton.disabled = false;
    });

    addButton.addEventListener('click', function () {
      appendRow('fitness', 'weights-general', 45);
    });

    resetButton.addEventListener('click', function () {
      weightInput.value = '70';
      rowsContainer.innerHTML = '';
      appendRow('chuze', 'walk-moderate', 60);
      clearError();
      result.hidden = true;
      weightInput.focus();
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearError();
      var weight = parseNumber(weightInput.value);
      if (!Number.isFinite(weight) || weight < 30 || weight > 300) {
        showError('Zadejte hmotnost v rozmezí 30–300 kg.');
        weightInput.focus();
        return;
      }

      var rows = rowsContainer.querySelectorAll('.mb-ac__row');
      var values = [];
      var totalMinutes = 0;
      var totalGross = 0;
      var totalActive = 0;
      var totalKj = 0;
      var invalid = false;

      Array.prototype.forEach.call(rows, function (row, index) {
        if (invalid) return;
        var activity = findActivity(row.querySelector('.mb-ac__activity').value);
        var minutesInput = row.querySelector('.mb-ac__minutes');
        var minutes = parseNumber(minutesInput.value);
        if (!activity || !Number.isFinite(minutes) || minutes < 1 || minutes > 600) {
          invalid = true;
          showError('U aktivity ' + (index + 1) + ' zadejte dobu v rozmezí 1–600 minut.');
          minutesInput.focus();
          return;
        }
        var gross = activity.met * 3.5 * weight / 200 * minutes;
        var active = Math.max(0, (activity.met - 1) * 3.5 * weight / 200 * minutes);
        var kj = gross * 4.184;
        var perHour = activity.met * 3.5 * weight / 200 * 60;
        values.push({activity:activity, minutes:minutes, gross:gross, active:active, kj:kj, perHour:perHour, intensity:intensity(activity.met)});
        totalMinutes += minutes;
        totalGross += gross;
        totalActive += active;
        totalKj += kj;
      });
      if (invalid) return;
      if (totalMinutes > 1440) {
        showError('Celková doba všech aktivit nemůže překročit 1 440 minut.');
        return;
      }

      var maxGross = Math.max.apply(null, values.map(function (item) { return item.gross; }));
      var itemHtml = values.map(function (item) {
        var width = maxGross > 0 ? Math.max(2, item.gross / maxGross * 100) : 2;
        return [
          '<article class="mb-ac__item">',
          ' <div class="mb-ac__item-head"><div><h3 class="mb-ac__item-title">' + escapeHtml(item.activity.name) + '</h3><p class="mb-ac__item-meta">' + formatNumber(item.activity.met, 1) + ' MET · ' + item.intensity.label + ' · ' + formatNumber(item.minutes, item.minutes % 1 ? 1 : 0) + ' min</p></div><p class="mb-ac__item-kcal">' + formatNumber(round(item.gross, 0), 0) + ' kcal</p></div>',
          ' <div class="mb-ac__bar" aria-hidden="true"><div class="mb-ac__bar-fill" style="width:' + width.toFixed(1) + '%"></div></div>',
          ' <div class="mb-ac__item-details"><span><strong>Aktivní výdej:</strong> ' + formatNumber(round(item.active, 0), 0) + ' kcal</span><span><strong>Za hodinu:</strong> ' + formatNumber(round(item.perHour, 0), 0) + ' kcal</span><span><strong>Energie:</strong> ' + formatNumber(round(item.kj, 0), 0) + ' kJ</span><span><strong>Kód Compendia:</strong> ' + item.activity.code + '</span></div>',
          '</article>'
        ].join('');
      }).join('');

      var badge = values.length > 1 ? 'Součet ' + values.length + ' aktivit' : values[0].intensity.label;
      result.innerHTML = [
        '<div class="mb-ac__result-top"><div><p class="mb-ac__result-label">Orientační celkový výdej</p><p class="mb-ac__score">' + formatNumber(round(totalGross, 0), 0) + ' kcal</p></div><span class="mb-ac__badge">' + escapeHtml(badge) + '</span></div>',
        '<p class="mb-ac__summary">Hrubý výdej zahrnuje i energii, kterou by tělo za stejnou dobu spotřebovalo v klidu. Proto níže uvádíme také orientační <strong>aktivní výdej nad úroveň klidu</strong>.</p>',
        '<div class="mb-ac__metrics">',
        ' <div class="mb-ac__metric"><p class="mb-ac__metric-label">Aktivní výdej nad klid</p><p class="mb-ac__metric-value">' + formatNumber(round(totalActive, 0), 0) + ' kcal</p></div>',
        ' <div class="mb-ac__metric"><p class="mb-ac__metric-label">Přepočet energie</p><p class="mb-ac__metric-value">' + formatNumber(round(totalKj, 0), 0) + ' kJ</p></div>',
        ' <div class="mb-ac__metric"><p class="mb-ac__metric-label">Celkový čas</p><p class="mb-ac__metric-value">' + formatNumber(round(totalMinutes, totalMinutes % 1 ? 1 : 0), totalMinutes % 1 ? 1 : 0) + ' min</p></div>',
        '</div>',
        '<div class="mb-ac__items">' + itemHtml + '</div>',
        '<p class="mb-ac__formula"><strong>Použitý vztah:</strong> kcal = MET × 3,5 × hmotnost v kg ÷ 200 × čas v minutách. Aktivní výdej používá stejný vztah po odečtení 1 MET odpovídajícího klidu. Výsledky jsou zaokrouhlené a představují orientační odhad.</p>'
      ].join('');
      result.hidden = false;
      result.scrollIntoView({behavior:'smooth', block:'nearest'});
    });

    appendRow('chuze', 'walk-moderate', 60);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());

/* MyBears sjednocená grafická vrstva 2.0 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || document.getElementById('mb-unified-kalkulacka-vydeje-energie-pri-aktivite-styles')) return;
  var style = document.createElement('style');
  style.id = 'mb-unified-kalkulacka-vydeje-energie-pri-aktivite-styles';
  style.textContent = String.raw`/* MyBears unified design layer — Product Guide v1.8 */
#mb-activity-calorie-calculator{--mb-green:#2dc26b!important;--mb-green-dark:#198d4b!important;--mb-green-soft:#f4f8f4!important;--mb-border:#e5e3dc!important;--mb-text:#20221f!important;--mb-muted:#626760!important;--mb-cream:#faf7ef;--mb-gold:#DBC442;--mb-danger:#a63a36!important;width:100%;max-width:1120px;margin:24px auto 40px!important;color:var(--mb-text);font-family:Arial,Helvetica,sans-serif;line-height:1.55}
#mb-activity-calorie-calculator *,#mb-activity-calorie-calculator *::before,#mb-activity-calorie-calculator *::after{box-sizing:border-box}
#mb-activity-calorie-calculator .mb-ac{position:relative;overflow:hidden;border:1px solid var(--mb-border)!important;border-radius:18px!important;background:#fff!important;box-shadow:0 12px 32px rgba(27,35,29,.07)!important}
#mb-activity-calorie-calculator .mb-ac::before{content:"";position:absolute;z-index:3;top:0;left:0;right:0;height:4px;background:var(--mb-gold)}
#mb-activity-calorie-calculator .mb-ac__head{padding:34px 38px 26px!important;background:var(--mb-cream)!important;border-bottom:1px solid var(--mb-border)!important}
#mb-activity-calorie-calculator .mb-ac__body{padding:30px 38px 36px!important}
#mb-activity-calorie-calculator .mb-ac__title,#mb-activity-calorie-calculator .mb-ac__section-title,#mb-activity-calorie-calculator .mb-ac__panel-title{color:var(--mb-green)!important;font-weight:700!important;letter-spacing:-.01em}
#mb-activity-calorie-calculator .mb-ac__title{margin:0 0 10px!important;font-size:clamp(25px,3.2vw,30px)!important;line-height:1.16!important}
#mb-activity-calorie-calculator .mb-ac__lead{max-width:820px;margin:0!important;color:#454a45!important;font-size:16px!important;line-height:1.58!important}
#mb-activity-calorie-calculator .mb-ac__notice{margin:0 0 22px!important;padding:15px 17px!important;border:1px solid #eadfc8!important;border-left:4px solid var(--mb-gold)!important;border-radius:12px!important;background:var(--mb-cream)!important;color:#4f4b43!important}
#mb-activity-calorie-calculator .mb-ac__grid{gap:18px!important}
#mb-activity-calorie-calculator .mb-ac__label{margin-bottom:7px!important;color:#292b28!important;font-size:15px!important;font-weight:700!important}
#mb-activity-calorie-calculator .mb-ac__input,#mb-activity-calorie-calculator .mb-ac__select{min-height:48px!important;border:1px solid #d4d6d1!important;border-radius:8px!important;background:#fff!important;color:var(--mb-text)!important}
#mb-activity-calorie-calculator .mb-ac__input:hover,#mb-activity-calorie-calculator .mb-ac__select:hover{border-color:#aeb8b0!important}
#mb-activity-calorie-calculator .mb-ac__input:focus,#mb-activity-calorie-calculator .mb-ac__select:focus{outline:3px solid rgba(219,196,66,.30)!important;outline-offset:1px;border-color:var(--mb-green-dark)!important}
#mb-activity-calorie-calculator .mb-ac__hint,#mb-activity-calorie-calculator .mb-ac__privacy,#mb-activity-calorie-calculator .mb-ac__formula{color:var(--mb-muted)!important}
#mb-activity-calorie-calculator .mb-ac__actions{gap:12px!important;margin-top:24px!important}
#mb-activity-calorie-calculator .mb-ac__button{display:inline-flex;align-items:center;justify-content:center;min-height:48px!important;padding:12px 24px!important;border:2px solid transparent!important;border-radius:8px!important;font-weight:700!important;transition:background .15s ease,border-color .15s ease,transform .15s ease}
#mb-activity-calorie-calculator .mb-ac__button:hover{transform:translateY(-1px)}
#mb-activity-calorie-calculator .mb-ac__button:focus-visible,#mb-activity-calorie-calculator a:focus-visible,#mb-activity-calorie-calculator summary:focus-visible{outline:3px solid rgba(219,196,66,.38)!important;outline-offset:2px!important}
#mb-activity-calorie-calculator .mb-ac__button--primary{min-width:210px;color:#fff!important;background:var(--mb-green)!important;border-color:var(--mb-green)!important;box-shadow:none!important}
#mb-activity-calorie-calculator .mb-ac__button--primary:hover{background:var(--mb-green-dark)!important;border-color:var(--mb-green-dark)!important}
#mb-activity-calorie-calculator .mb-ac__button--secondary{color:var(--mb-green-dark)!important;background:#fff!important;border-color:var(--mb-green)!important}
#mb-activity-calorie-calculator .mb-ac__result{margin-top:28px!important;padding:24px!important;border:1px solid #cfe4d5!important;border-radius:16px!important;background:var(--mb-green-soft)!important}
#mb-activity-calorie-calculator .mb-ac__score{color:#20221f!important;font-weight:800!important;letter-spacing:-.035em}
#mb-activity-calorie-calculator .mb-ac__badge{border:1px solid #d7ceb8!important;background:#fff8df!important;color:#75633d!important;font-weight:700!important}
#mb-activity-calorie-calculator .mb-ac__detail,#mb-activity-calorie-calculator .mb-ac__metric,#mb-activity-calorie-calculator .mb-ac__stat,#mb-activity-calorie-calculator .mb-ac__row{border:1px solid var(--mb-border)!important;border-radius:12px!important;background:#fff!important;box-shadow:none!important}
#mb-activity-calorie-calculator .mb-ac__detail-label,#mb-activity-calorie-calculator .mb-ac__metric-label,#mb-activity-calorie-calculator .mb-ac__result-label{color:var(--mb-muted)!important}
#mb-activity-calorie-calculator .mb-ac__detail-value,#mb-activity-calorie-calculator .mb-ac__metric-value{color:var(--mb-green-dark)!important}
#mb-activity-calorie-calculator .mb-ac__warning{border-left:4px solid var(--mb-gold)!important;border-radius:8px!important;background:linear-gradient(90deg,rgba(219,196,66,.14),rgba(244,248,244,.88))!important;color:#5d4b1d!important}
#mb-activity-calorie-calculator .mb-ac__error{border-color:#e3b3af!important;border-radius:10px!important;background:#fff5f4!important;color:var(--mb-danger)!important}
#mb-activity-calorie-calculator .mb-ac__table-wrap{overflow-x:auto;border:1px solid var(--mb-border)!important;border-radius:12px!important}
#mb-activity-calorie-calculator table{width:100%;border-collapse:collapse;background:#fff}
#mb-activity-calorie-calculator thead th{border-bottom:2px solid var(--mb-gold)!important;background:#20231f!important;color:#fff!important}
#mb-activity-calorie-calculator tbody tr:nth-child(even){background:var(--mb-green-soft)!important}
@media(max-width:760px){#mb-activity-calorie-calculator{margin:18px auto 30px!important}#mb-activity-calorie-calculator .mb-ac__head{padding:28px 20px 22px!important}#mb-activity-calorie-calculator .mb-ac__body{padding:24px 20px 28px!important}#mb-activity-calorie-calculator .mb-ac__result{padding:20px!important}#mb-activity-calorie-calculator .mb-ac__actions{flex-direction:column;align-items:stretch}#mb-activity-calorie-calculator .mb-ac__button{width:100%}}
@media(prefers-reduced-motion:reduce){#mb-activity-calorie-calculator *,#mb-activity-calorie-calculator *::before,#mb-activity-calorie-calculator *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}`;
  document.head.appendChild(style);
})();
