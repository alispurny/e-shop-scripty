/**
 * MyBears — kalkulačka výdeje energie při aktivitě
 * Vizuální systém je sjednocen s převodníkem krevních lipidů.
 * Funkční logika MET, interní ID a kořenový prvek zůstávají zachované.
 */
(function () {
  'use strict';

  var T = {"locale":"sk-SK","root":"mb-activity-calorie-calculator","style":"mb-activity-calorie-calculator-styles","version":"3.0.0-sk","title":"Kalkulačka výdaja energie pri športe a aktivitách","lead":"Porovnajte orientačný energetický výdaj pri športe, chôdzi, domácich prácach a ďalších činnostiach pomocou hodnôt MET.","notice":"<strong>Dôležité:</strong> Výsledok je tabuľkový odhad. Skutočný výdaj ovplyvňuje intenzita, kondícia, technika, terén, teplota a individuálny pokojový metabolizmus.","weight":"Telesná hmotnosť","weight_hint":"Povolený rozsah: 30–300 kg","activity":"Aktivita","category":"Kategória","specific":"Konkrétna aktivita","duration":"Trvanie","minutes_hint":"1–600 minút","remove":"Odobrať aktivitu","add":"+ Pridať aktivitu","calculate":"Vypočítať výdaj","reset":"Vymazať údaje","privacy":"Výpočet prebieha iba vo vašom prehliadači. Zadaná hmotnosť ani zvolené aktivity sa týmto skriptom nikam neodosielajú ani neukladajú.","error_weight":"Zadajte hmotnosť v rozsahu 30–300 kg.","error_minutes":"Pri aktivite {{index}} zadajte trvanie v rozsahu 1–600 minút.","error_total":"Celkové trvanie všetkých aktivít nemôže prekročiť 1 440 minút.","intensity_light":"Ľahká intenzita","intensity_moderate":"Stredná intenzita","intensity_high":"Vysoká intenzita","total_label":"Orientačný celkový výdaj","sum":"Súčet {{count}} aktivít","summary":"Hrubý výdaj zahŕňa aj energiu, ktorú by telo za rovnaký čas spotrebovalo v pokoji. Preto nižšie uvádzame aj orientačný <strong>aktívny výdaj nad úroveň pokoja</strong>.","active_above_rest":"Aktívny výdaj nad pokoj","energy_conversion":"Prepočet energie","total_time":"Celkový čas","active":"Aktívny výdaj","per_hour":"Za hodinu","energy":"Energia","compendium":"Kód Compendia","formula":"<strong>Použitý vzťah:</strong> kcal = MET × 3,5 × hmotnosť v kg ÷ 200 × čas v minútach. Aktívny výdaj používa rovnaký vzťah po odpočítaní 1 MET zodpovedajúceho pokoju. Výsledky sú zaokrúhlené a predstavujú orientačný odhad.","region":"Interaktívna kalkulačka výdaja energie pri aktivite"};
  var ROOT_ID = T.root;
  var STYLE_ID = T.style;
  var SCRIPT_VERSION = T.version;
  var MAX_ROWS = 4;
  var CATEGORIES = {"chuze":"Chôdza a turistika","beh":"Beh","kolo":"Cyklistika","fitness":"Fitness a posilňovanie","tanec":"Tanec","sport":"Športy","voda":"Vodné aktivity","domacnost":"Domácnosť a záhrada","zima":"Zimné aktivity"};
  var ACTIVITIES = [{"id":"walk-dog","cat":"chuze","code":"17165","met":3.0,"name":"Venčenie psa"},{"id":"walk-slow","cat":"chuze","code":"17152","met":2.8,"name":"Chôdza pomalá, 3,2–3,9 km/h"},{"id":"walk-4","cat":"chuze","code":"17170","met":3.0,"name":"Chôdza 4,0 km/h, rovina"},{"id":"walk-moderate","cat":"chuze","code":"17190","met":3.8,"name":"Chôdza stredným tempom, 4,5–5,5 km/h"},{"id":"walk-brisk","cat":"chuze","code":"17200","met":4.8,"name":"Svižná chôdza, 5,6–6,3 km/h"},{"id":"walk-very-brisk","cat":"chuze","code":"17220","met":5.5,"name":"Veľmi svižná chôdza, 6,4–7,0 km/h"},{"id":"hike-slow","cat":"chuze","code":"17081","met":3.8,"name":"Pomalá turistika v teréne"},{"id":"hike-normal","cat":"chuze","code":"17082","met":5.3,"name":"Turistika bežným tempom v teréne"},{"id":"hike-cross","cat":"chuze","code":"17080","met":6.0,"name":"Turistika členitým terénom"},{"id":"nordic-moderate","cat":"chuze","code":"17302","met":4.3,"name":"Nordic walking, 4,0–5,6 km/h"},{"id":"nordic-fast","cat":"chuze","code":"17304","met":5.3,"name":"Nordic walking, 5,8–7,1 km/h"},{"id":"stairs-slow","cat":"chuze","code":"17133","met":4.5,"name":"Chôdza do schodov, pomalé tempo"},{"id":"stairs-general","cat":"chuze","code":"17131","met":6.8,"name":"Chôdza do schodov, bežné tempo"},{"id":"stairs-fast","cat":"chuze","code":"17134","met":9.3,"name":"Chôdza do schodov, rýchle tempo"},{"id":"jog-walk","cat":"beh","code":"12010","met":6.0,"name":"Striedanie behu a chôdze"},{"id":"jog-general","cat":"beh","code":"12020","met":7.5,"name":"Ľahký beh / jogging, vlastné tempo"},{"id":"run-6-5","cat":"beh","code":"12028","met":6.5,"name":"Beh 6,4–6,8 km/h"},{"id":"run-7-3","cat":"beh","code":"12029","met":7.8,"name":"Beh 6,9–7,7 km/h"},{"id":"run-8","cat":"beh","code":"12030","met":8.5,"name":"Beh približne 8 km/h"},{"id":"run-9","cat":"beh","code":"12045","met":9.0,"name":"Beh 8,9–9,3 km/h"},{"id":"run-10","cat":"beh","code":"12050","met":9.3,"name":"Beh približne 10 km/h"},{"id":"run-10-8","cat":"beh","code":"12060","met":10.5,"name":"Beh približne 10,8 km/h"},{"id":"run-11-3","cat":"beh","code":"12070","met":11.0,"name":"Beh približne 11,3 km/h"},{"id":"run-12-1","cat":"beh","code":"12080","met":11.8,"name":"Beh približne 12,1 km/h"},{"id":"run-12-9","cat":"beh","code":"12090","met":12.0,"name":"Beh približne 12,9 km/h"},{"id":"run-13-8","cat":"beh","code":"12100","met":12.5,"name":"Beh približne 13,8 km/h"},{"id":"run-14-5","cat":"beh","code":"12110","met":13.0,"name":"Beh približne 14,5 km/h"},{"id":"run-16","cat":"beh","code":"12120","met":14.8,"name":"Beh približne 16,1 km/h"},{"id":"run-trail","cat":"beh","code":"12140","met":9.3,"name":"Beh v teréne / cross-country"},{"id":"run-stairs","cat":"beh","code":"12170","met":15.0,"name":"Beh do schodov"},{"id":"bike-easy","cat":"kolo","code":"01015","met":4.3,"name":"Jazda na bicykli, ľahké vlastné tempo"},{"id":"bike-moderate","cat":"kolo","code":"01016","met":7.0,"name":"Jazda na bicykli, stredné vlastné tempo"},{"id":"bike-vigorous","cat":"kolo","code":"01017","met":9.0,"name":"Jazda na bicykli, intenzívne vlastné tempo"},{"id":"bike-16-19","cat":"kolo","code":"01020","met":6.8,"name":"Bicykel 16–19 km/h, ľahšie úsilie"},{"id":"bike-19-22","cat":"kolo","code":"01030","met":8.0,"name":"Bicykel 19–22 km/h, stredné úsilie"},{"id":"bike-23-26","cat":"kolo","code":"01040","met":10.0,"name":"Bicykel 23–26 km/h, rýchlo"},{"id":"bike-26-31","cat":"kolo","code":"01050","met":12.0,"name":"Bicykel 26–31 km/h, veľmi rýchlo"},{"id":"bike-mtb","cat":"kolo","code":"01009","met":8.5,"name":"Horský bicykel, všeobecne"},{"id":"ebike-light","cat":"kolo","code":"01084","met":6.0,"name":"Elektrobicykel, ľahká dopomoc"},{"id":"ebike-high","cat":"kolo","code":"01088","met":4.0,"name":"Elektrobicykel, vysoká dopomoc"},{"id":"bike-stationary-light","cat":"kolo","code":"01214","met":4.0,"name":"Rotoped, ľahká záťaž okolo 50 W"},{"id":"bike-stationary-moderate","cat":"kolo","code":"01220","met":6.0,"name":"Rotoped, stredná záťaž 90–100 W"},{"id":"bike-stationary-vigorous","cat":"kolo","code":"01232","met":10.3,"name":"Rotoped, vysoká záťaž 151–199 W"},{"id":"spin","cat":"kolo","code":"01270","met":9.0,"name":"Spinning / indoor cycling lekcia"},{"id":"stretch","cat":"fitness","code":"02101","met":2.3,"name":"Ľahký strečing"},{"id":"pilates","cat":"fitness","code":"02105","met":2.8,"name":"Pilates, všeobecne"},{"id":"yoga-hatha","cat":"fitness","code":"02175","met":2.3,"name":"Joga, všeobecne / Hatha"},{"id":"yoga-vinyasa","cat":"fitness","code":"02185","met":2.7,"name":"Vinyasa joga"},{"id":"yoga-power","cat":"fitness","code":"02160","met":4.0,"name":"Power joga"},{"id":"bodyweight","cat":"fitness","code":"02056","met":3.0,"name":"Cvičenie s vlastnou hmotnosťou, bežná intenzita"},{"id":"bodyweight-high","cat":"fitness","code":"02057","met":6.5,"name":"Cvičenie s vlastnou hmotnosťou, vysoká intenzita"},{"id":"weights-general","cat":"fitness","code":"02054","met":3.5,"name":"Posilňovanie, viac cvikov, 8–15 opakovaní"},{"id":"weights-heavy","cat":"fitness","code":"02052","met":5.0,"name":"Silový tréning, drepy / mŕtve ťahy"},{"id":"weights-vigorous","cat":"fitness","code":"02050","met":6.0,"name":"Posilňovanie, intenzívne úsilie"},{"id":"circuit-moderate","cat":"fitness","code":"02035","met":5.0,"name":"Kruhový tréning, stredná intenzita"},{"id":"circuit-vigorous","cat":"fitness","code":"02040","met":7.5,"name":"Kruhový tréning, vysoká intenzita"},{"id":"elliptical-moderate","cat":"fitness","code":"02048","met":5.0,"name":"Eliptický trenažér, stredná intenzita"},{"id":"elliptical-vigorous","cat":"fitness","code":"02049","met":9.0,"name":"Eliptický trenažér, vysoká intenzita"},{"id":"rowing-moderate","cat":"fitness","code":"02071","met":5.0,"name":"Veslovací trenažér, do 100 W"},{"id":"rowing-vigorous","cat":"fitness","code":"02072","met":7.5,"name":"Veslovací trenažér, 100–149 W"},{"id":"rowing-hard","cat":"fitness","code":"02073","met":11.0,"name":"Veslovací trenažér, 150–199 W"},{"id":"jump-rope","cat":"fitness","code":"02068","met":11.0,"name":"Skákanie cez švihadlo, všeobecne"},{"id":"zumba","cat":"fitness","code":"02310","met":6.5,"name":"Zumba, skupinová lekcia"},{"id":"hiit-moderate","cat":"fitness","code":"02210","met":7.0,"name":"HIIT, stredné úsilie"},{"id":"hiit-vigorous","cat":"fitness","code":"02214","met":11.0,"name":"HIIT / Tabata, vysoké úsilie"},{"id":"kettlebell","cat":"fitness","code":"02058","met":9.8,"name":"Kettlebell swings"},{"id":"dance-slow","cat":"tanec","code":"03040","met":3.0,"name":"Pomalý spoločenský tanec"},{"id":"dance-recreational","cat":"tanec","code":"03042","met":6.0,"name":"Rekreačný spoločenský tanec"},{"id":"dance-salsa","cat":"tanec","code":"03090","met":4.8,"name":"Salsa v páre"},{"id":"dance-fast","cat":"tanec","code":"03030","met":5.5,"name":"Rýchly spoločenský tanec"},{"id":"dance-vigorous","cat":"tanec","code":"03031","met":9.8,"name":"Intenzívny klubový alebo ľudový tanec"},{"id":"badminton-social","cat":"sport","code":"15030","met":5.5,"name":"Bedminton, rekreačný"},{"id":"badminton-match","cat":"sport","code":"15025","met":9.0,"name":"Bedminton, súťažný zápas"},{"id":"basketball","cat":"sport","code":"15040","met":8.0,"name":"Basketbal, zápas"},{"id":"bowling","cat":"sport","code":"15092","met":3.8,"name":"Bowling"},{"id":"boxing-bag","cat":"sport","code":"15110","met":5.8,"name":"Box, údery do vreca"},{"id":"boxing-sparring","cat":"sport","code":"15120","met":7.8,"name":"Box, sparring"},{"id":"golf-walk","cat":"sport","code":"15265","met":4.3,"name":"Golf, chôdza a nosenie palíc"},{"id":"handball","cat":"sport","code":"15330","met":8.0,"name":"Hádzaná, tímová"},{"id":"hockey","cat":"sport","code":"15360","met":8.0,"name":"Ľadový hokej, všeobecne"},{"id":"horse","cat":"sport","code":"15370","met":5.5,"name":"Jazda na koni, všeobecne"},{"id":"judo","cat":"sport","code":"15433","met":11.3,"name":"Judo"},{"id":"kickboxing","cat":"sport","code":"15457","met":7.3,"name":"Kickbox"},{"id":"climbing","cat":"sport","code":"15537","met":5.8,"name":"Lezenie na stene, nižšia až stredná obťažnosť"},{"id":"soccer-casual","cat":"sport","code":"15610","met":7.0,"name":"Futbal, rekreačný"},{"id":"soccer-competitive","cat":"sport","code":"15605","met":9.5,"name":"Futbal, súťažný"},{"id":"table-tennis","cat":"sport","code":"15660","met":4.0,"name":"Stolný tenis"},{"id":"tennis-moderate","cat":"sport","code":"15675","met":6.8,"name":"Tenis, stredné úsilie"},{"id":"tennis-competitive","cat":"sport","code":"15676","met":8.0,"name":"Tenis, súťažný"},{"id":"volleyball-recreation","cat":"sport","code":"15720","met":3.0,"name":"Volejbal, rekreačný"},{"id":"volleyball-competitive","cat":"sport","code":"15711","met":6.0,"name":"Volejbal v hale, súťažný"},{"id":"volleyball-beach","cat":"sport","code":"15725","met":8.0,"name":"Plážový volejbal"},{"id":"canoe-leisure","cat":"voda","code":"18070","met":3.5,"name":"Kanoe / veslovanie pre radosť"},{"id":"kayak-moderate","cat":"voda","code":"18100","met":5.0,"name":"Kajak, stredné úsilie"},{"id":"sup-general","cat":"voda","code":"18224","met":6.5,"name":"Paddleboard, všeobecne"},{"id":"swim-leisure","cat":"voda","code":"18310","met":6.0,"name":"Plávanie voľne, bez počítania dĺžok"},{"id":"swim-freestyle-slow","cat":"voda","code":"18240","met":5.8,"name":"Plávanie kraulom, pomaly / rekreačne"},{"id":"swim-freestyle-fast","cat":"voda","code":"18230","met":9.8,"name":"Plávanie kraulom, rýchlo"},{"id":"swim-back","cat":"voda","code":"18255","met":4.8,"name":"Znak, rekreačne"},{"id":"swim-breast","cat":"voda","code":"18265","met":5.3,"name":"Prsia, rekreačne"},{"id":"water-aerobics","cat":"voda","code":"18355","met":5.5,"name":"Aqua aerobik, všeobecne"},{"id":"tread-water","cat":"voda","code":"18350","met":3.5,"name":"Šliapanie vody, stredné úsilie"},{"id":"cook","cat":"domacnost","code":"05050","met":2.0,"name":"Varenie a príprava jedla, ľahká činnosť"},{"id":"dishes","cat":"domacnost","code":"05041","met":2.0,"name":"Umývanie riadu"},{"id":"dusting","cat":"domacnost","code":"05032","met":2.5,"name":"Utieranie prachu / leštenie nábytku"},{"id":"vacuum","cat":"domacnost","code":"05043","met":3.0,"name":"Vysávanie"},{"id":"sweeping","cat":"domacnost","code":"05010","met":3.3,"name":"Zametanie podlahy"},{"id":"mopping","cat":"domacnost","code":"05021","met":3.5,"name":"Umývanie podlahy, stredné úsilie"},{"id":"heavy-clean","cat":"domacnost","code":"05020","met":3.5,"name":"Veľké upratovanie / umývanie auta / garáže"},{"id":"shopping","cat":"domacnost","code":"05060","met":3.3,"name":"Nákup potravín s vozíkom alebo bez neho"},{"id":"groceries-upstairs","cat":"domacnost","code":"05056","met":5.3,"name":"Nosenie nákupu do schodov"},{"id":"move-furniture","cat":"domacnost","code":"05120","met":5.8,"name":"Sťahovanie nábytku a škatúľ"},{"id":"garden-general","cat":"domacnost","code":"08245","met":3.8,"name":"Práca v záhrade, všeobecne"},{"id":"raking","cat":"domacnost","code":"08160","met":4.0,"name":"Hrabanie lístia / trávnika"},{"id":"weeding","cat":"domacnost","code":"08240","met":4.5,"name":"Plenie a kultivácia záhona"},{"id":"digging","cat":"domacnost","code":"08050","met":5.0,"name":"Rýľovanie a kopanie v záhrade"},{"id":"mowing","cat":"domacnost","code":"08095","met":5.5,"name":"Kosenie trávy, chôdza s kosačkou"},{"id":"skate-leisure","cat":"zima","code":"19020","met":5.5,"name":"Korčuľovanie na ľade, voľne"},{"id":"skate-general","cat":"zima","code":"19030","met":7.0,"name":"Korčuľovanie na ľade, bežné tempo"},{"id":"ski-down-light","cat":"zima","code":"19150","met":4.3,"name":"Zjazdové lyžovanie / snowboard, ľahké úsilie"},{"id":"ski-down-moderate","cat":"zima","code":"19160","met":6.3,"name":"Zjazdové lyžovanie / snowboard, stredné úsilie"},{"id":"ski-down-vigorous","cat":"zima","code":"19170","met":8.0,"name":"Zjazdové lyžovanie / snowboard, vysoké úsilie"},{"id":"ski-xc-light","cat":"zima","code":"19080","met":6.8,"name":"Beh na lyžiach, pomaly"},{"id":"ski-xc-moderate","cat":"zima","code":"19090","met":8.5,"name":"Beh na lyžiach, stredné tempo"},{"id":"ski-xc-vigorous","cat":"zima","code":"19100","met":11.3,"name":"Beh na lyžiach, rýchlo"},{"id":"snow-shovel","cat":"zima","code":"19252","met":5.3,"name":"Odpratávanie snehu lopatou, stredné úsilie"}];

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    var clean = value.trim().replace(/\s+/g, '');
    if (clean === '') return NaN;
    return Number(clean.replace(',', '.'));
  }

  function round(value, decimals) {
    var factor = Math.pow(10, decimals || 0);
    return Math.round((value + Number.EPSILON) * factor) / factor;
  }

  function formatNumber(value, decimals) {
    return new Intl.NumberFormat(T.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[character];
    });
  }

  function findActivity(id) {
    for (var index = 0; index < ACTIVITIES.length; index += 1) {
      if (ACTIVITIES[index].id === id) return ACTIVITIES[index];
    }
    return null;
  }

  function activitiesByCategory(category) {
    return ACTIVITIES.filter(function (item) { return item.cat === category; });
  }

  function intensity(met) {
    if (met < 3) return {label:T.intensity_light};
    if (met < 6) return {label:T.intensity_moderate};
    return {label:T.intensity_high};
  }

  function addStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = String.raw`
/* MyBears unified design layer — aligned with the lipid converter */
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
#${ROOT_ID} *::after { box-sizing:border-box !important; }
#${ROOT_ID} *,
#${ROOT_ID} input,
#${ROOT_ID} select,
#${ROOT_ID} button {
  color:#000 !important;
  font-family:Arial,Helvetica,sans-serif !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} strong,
#${ROOT_ID} b { font-weight:700 !important; }
#${ROOT_ID} .mb-ac {
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
#${ROOT_ID} .mb-ac::before {
  content:"" !important;
  position:absolute !important;
  z-index:5 !important;
  top:0 !important;
  right:0 !important;
  left:0 !important;
  height:4px !important;
  background:var(--mb-yellow) !important;
}
#${ROOT_ID} .mb-ac__head {
  margin:0 !important;
  padding:34px 38px 28px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-ac__title,
#${ROOT_ID} .mb-ac__title {
  display:block !important;
  max-width:920px !important;
  margin:0 auto 10px !important;
  padding:0 !important;
  border:0 !important;
  background:none !important;
  box-shadow:none !important;
  color:#000 !important;
  font:700 clamp(25px,3.2vw,30px)/1.16 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-decoration:none !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-ac__title::before,
#${ROOT_ID} .mb-ac__title::after { content:none !important; display:none !important; }
#${ROOT_ID} .mb-ac__lead {
  max-width:840px !important;
  margin:0 auto !important;
  padding:0 !important;
  color:#000 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  text-align:center !important;
}
#${ROOT_ID} .mb-ac__body {
  margin:0 !important;
  padding:30px 38px 36px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-ac__notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#000 !important;
  font:400 14px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__weight {
  max-width:380px !important;
  margin:0 0 22px !important;
}
#${ROOT_ID} .mb-ac__rows {
  display:grid !important;
  gap:14px !important;
  margin:0 !important;
}
#${ROOT_ID} .mb-ac__row {
  display:grid !important;
  grid-template-columns:minmax(160px,.8fr) minmax(250px,1.5fr) minmax(130px,.55fr) auto !important;
  gap:14px !important;
  align-items:end !important;
  margin:0 !important;
  padding:18px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-ac__field { min-width:0 !important; margin:0 !important; padding:0 !important; }
#${ROOT_ID} .mb-ac__row-label {
  margin:0 0 10px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 16px/1.3 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#000 !important;
  font:700 15px/1.35 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__input-wrap { position:relative !important; margin:0 !important; padding:0 !important; }
#${ROOT_ID} .mb-ac__input,
#${ROOT_ID} .mb-ac__select {
  display:block !important;
  width:100% !important;
  min-height:48px !important;
  margin:0 !important;
  padding:11px 12px !important;
  border:1px solid #d4d6d1 !important;
  border-radius:8px !important;
  background:#fff !important;
  box-shadow:none !important;
  color:#000 !important;
  font:400 16px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
}
#${ROOT_ID} .mb-ac__input { padding-right:58px !important; }
#${ROOT_ID} .mb-ac__input:hover,
#${ROOT_ID} .mb-ac__select:hover { border-color:#aeb8b0 !important; }
#${ROOT_ID} .mb-ac__input:focus,
#${ROOT_ID} .mb-ac__select:focus {
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  border-color:var(--mb-green-dark) !important;
}
#${ROOT_ID} .mb-ac__input::placeholder {
  color:#000 !important;
  opacity:.55 !important;
  -webkit-text-fill-color:#000 !important;
}
#${ROOT_ID} .mb-ac__unit {
  position:absolute !important;
  top:50% !important;
  right:12px !important;
  transform:translateY(-50%) !important;
  color:#000 !important;
  font:400 14px/1 Arial,Helvetica,sans-serif !important;
  pointer-events:none !important;
}
#${ROOT_ID} .mb-ac__hint {
  display:block !important;
  margin:6px 0 0 !important;
  color:#000 !important;
  font:400 13px/1.42 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__remove {
  display:inline-flex !important;
  align-items:center !important;
  justify-content:center !important;
  min-width:48px !important;
  min-height:48px !important;
  margin:0 !important;
  padding:8px 12px !important;
  border:2px solid var(--mb-green) !important;
  border-radius:8px !important;
  background:#fff !important;
  box-shadow:none !important;
  color:#000 !important;
  font:700 22px/1 Arial,Helvetica,sans-serif !important;
  cursor:pointer !important;
}
#${ROOT_ID} .mb-ac__remove:hover { border-color:var(--mb-green-dark) !important; background:var(--mb-green-soft) !important; }
#${ROOT_ID} .mb-ac__remove[hidden] { display:none !important; }
#${ROOT_ID} .mb-ac__actions {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:12px !important;
  margin:24px 0 0 !important;
  padding:0 !important;
}
#${ROOT_ID} .mb-ac__button {
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
  font:700 16px/1.25 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-decoration:none !important;
  text-transform:none !important;
  cursor:pointer !important;
  transition:background .15s ease,border-color .15s ease,transform .15s ease !important;
}
#${ROOT_ID} .mb-ac__button:hover { transform:translateY(-1px) !important; }
#${ROOT_ID} .mb-ac__button--primary {
  min-width:210px !important;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-ac__button--primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-ac__button--secondary {
  border-color:var(--mb-green) !important;
  background:#fff !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-ac__button--secondary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
  color:#000 !important;
}
#${ROOT_ID} .mb-ac__button:disabled {
  opacity:.52 !important;
  transform:none !important;
  cursor:not-allowed !important;
}
#${ROOT_ID} .mb-ac__button:focus-visible,
#${ROOT_ID} .mb-ac__remove:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-ac__error {
  display:none !important;
  margin:18px 0 0 !important;
  padding:13px 15px !important;
  border:1px solid #e3b3af !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#000 !important;
  font:700 14px/1.48 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__error.is-visible { display:block !important; }
#${ROOT_ID} .mb-ac__result {
  margin:28px 0 0 !important;
  padding:24px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:16px !important;
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} .mb-ac__result[hidden] { display:none !important; }
#${ROOT_ID} .mb-ac__result-top {
  display:flex !important;
  flex-wrap:wrap !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  gap:16px !important;
}
#${ROOT_ID} .mb-ac__result-label {
  margin:0 0 5px !important;
  color:#000 !important;
  font:700 14px/1.35 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__score {
  margin:0 !important;
  color:#000 !important;
  font:800 clamp(32px,5vw,40px)/1.05 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.035em !important;
}
#${ROOT_ID} .mb-ac__badge {
  display:inline-flex !important;
  align-items:center !important;
  min-height:34px !important;
  padding:6px 11px !important;
  border:1px solid #d7ceb8 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:700 14px/1.3 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__summary {
  margin:14px 0 0 !important;
  color:#000 !important;
  font:400 15px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__metrics {
  display:grid !important;
  grid-template-columns:repeat(3,minmax(0,1fr)) !important;
  gap:12px !important;
  margin:18px 0 0 !important;
}
#${ROOT_ID} .mb-ac__metric {
  margin:0 !important;
  padding:15px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-ac__metric-label {
  margin:0 0 7px !important;
  color:#000 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__metric-value {
  margin:0 !important;
  color:#000 !important;
  font:800 19px/1.25 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__items {
  display:grid !important;
  gap:12px !important;
  margin:18px 0 0 !important;
}
#${ROOT_ID} .mb-ac__item {
  margin:0 !important;
  padding:16px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-ac__item-head {
  display:flex !important;
  flex-wrap:wrap !important;
  align-items:flex-start !important;
  justify-content:space-between !important;
  gap:12px !important;
}
#${ROOT_ID} h3.mb-ac__item-title,
#${ROOT_ID} .mb-ac__item-title {
  margin:0 !important;
  padding:0 !important;
  color:#000 !important;
  font:700 16px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
}
#${ROOT_ID} .mb-ac__item-meta {
  margin:5px 0 0 !important;
  color:#000 !important;
  font:400 13px/1.42 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__item-kcal {
  margin:0 !important;
  color:#000 !important;
  font:800 22px/1.2 Arial,Helvetica,sans-serif !important;
  white-space:nowrap !important;
}
#${ROOT_ID} .mb-ac__bar {
  overflow:hidden !important;
  height:10px !important;
  margin:12px 0 7px !important;
  border-radius:999px !important;
  background:#e7ece9 !important;
}
#${ROOT_ID} .mb-ac__bar-fill {
  height:100% !important;
  min-width:2px !important;
  border-radius:999px !important;
  background:var(--mb-green) !important;
}
#${ROOT_ID} .mb-ac__item-details {
  display:flex !important;
  flex-wrap:wrap !important;
  gap:8px 16px !important;
  color:#000 !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__formula {
  margin:18px 0 0 !important;
  padding:15px 0 0 !important;
  border-top:1px solid #cfe4d6 !important;
  color:#000 !important;
  font:400 13px/1.52 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-ac__privacy {
  margin:18px 0 0 !important;
  color:#000 !important;
  font:400 12px/1.48 Arial,Helvetica,sans-serif !important;
}
@media (max-width:850px) {
  #${ROOT_ID} .mb-ac__row { grid-template-columns:1fr 1fr !important; }
  #${ROOT_ID} .mb-ac__remove { grid-column:2 !important; justify-self:end !important; }
}
@media (max-width:620px) {
  #${ROOT_ID} { margin:18px auto 30px !important; }
  #${ROOT_ID} .mb-ac__head { padding:28px 20px 22px !important; }
  #${ROOT_ID} .mb-ac__body { padding:24px 20px 28px !important; }
  #${ROOT_ID} .mb-ac__row,
  #${ROOT_ID} .mb-ac__metrics { grid-template-columns:1fr !important; }
  #${ROOT_ID} .mb-ac__remove { grid-column:auto !important; width:100% !important; justify-self:stretch !important; }
  #${ROOT_ID} .mb-ac__actions { flex-direction:column !important; align-items:stretch !important; }
  #${ROOT_ID} .mb-ac__button { width:100% !important; }
  #${ROOT_ID} .mb-ac__result { padding:20px !important; }
}
@media print {
  #${ROOT_ID} { max-width:none !important; margin:0 !important; }
  #${ROOT_ID} .mb-ac { box-shadow:none !important; }
  #${ROOT_ID} .mb-ac__actions,
  #${ROOT_ID} .mb-ac__remove { display:none !important; }
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
`;
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
    return activitiesByCategory(category).map(function (item) {
      return '<option value="' + item.id + '"' + (item.id === selected ? ' selected' : '') + '>' + escapeHtml(item.name) + ' (' + formatNumber(item.met, 1) + ' MET)</option>';
    }).join('');
  }

  function createRow(index, category, activityId, minutes) {
    var row = document.createElement('div');
    row.className = 'mb-ac__row';
    row.setAttribute('data-row-index', String(index));
    row.innerHTML =
      '<div class="mb-ac__field"><p class="mb-ac__row-label">' + T.activity + ' ' + (index + 1) + '</p><label class="mb-ac__label" for="mb-ac-category-' + index + '">' + T.category + '</label><select class="mb-ac__select mb-ac__category" id="mb-ac-category-' + index + '">' + categoryOptions(category) + '</select></div>' +
      '<div class="mb-ac__field"><label class="mb-ac__label" for="mb-ac-activity-' + index + '">' + T.specific + '</label><select class="mb-ac__select mb-ac__activity" id="mb-ac-activity-' + index + '">' + activityOptions(category, activityId) + '</select></div>' +
      '<div class="mb-ac__field"><label class="mb-ac__label" for="mb-ac-minutes-' + index + '">' + T.duration + '</label><div class="mb-ac__input-wrap"><input class="mb-ac__input mb-ac__minutes" id="mb-ac-minutes-' + index + '" inputmode="decimal" autocomplete="off" value="' + minutes + '"><span class="mb-ac__unit">min</span></div><span class="mb-ac__hint">' + T.minutes_hint + '</span></div>' +
      '<button class="mb-ac__remove" type="button" aria-label="' + T.remove + ' ' + (index + 1) + '" title="' + T.remove + '">×</button>';
    return row;
  }

  function updateRowNumbers(rowsContainer) {
    var rows = rowsContainer.querySelectorAll('.mb-ac__row');
    Array.prototype.forEach.call(rows, function (row, index) {
      row.setAttribute('data-row-index', String(index));
      var label = row.querySelector('.mb-ac__row-label');
      if (label) label.textContent = T.activity + ' ' + (index + 1);
      var remove = row.querySelector('.mb-ac__remove');
      if (remove) {
        remove.hidden = rows.length === 1;
        remove.setAttribute('aria-label', T.remove + ' ' + (index + 1));
      }
    });
  }

  function render() {
    var root = document.getElementById(ROOT_ID);
    if (!root || root.getAttribute('data-mb-version') === SCRIPT_VERSION) return;
    addStyles();
    root.setAttribute('data-mb-version', SCRIPT_VERSION);
    root.innerHTML =
      '<section class="mb-ac" aria-labelledby="mb-ac-title" aria-label="' + T.region + '">' +
        '<div class="mb-ac__head"><h2 class="mb-ac__title" id="mb-ac-title">' + T.title + '</h2><p class="mb-ac__lead">' + T.lead + '</p></div>' +
        '<div class="mb-ac__body"><p class="mb-ac__notice">' + T.notice + '</p>' +
          '<form id="mb-ac-form" novalidate>' +
            '<div class="mb-ac__weight"><label class="mb-ac__label" for="mb-ac-weight">' + T.weight + '</label><div class="mb-ac__input-wrap"><input class="mb-ac__input" id="mb-ac-weight" inputmode="decimal" autocomplete="off" value="70" aria-describedby="mb-ac-weight-hint"><span class="mb-ac__unit">kg</span></div><span class="mb-ac__hint" id="mb-ac-weight-hint">' + T.weight_hint + '</span></div>' +
            '<div class="mb-ac__rows" id="mb-ac-rows"></div>' +
            '<div class="mb-ac__actions"><button class="mb-ac__button mb-ac__button--secondary" id="mb-ac-add" type="button">' + T.add + '</button><button class="mb-ac__button mb-ac__button--primary" type="submit">' + T.calculate + '</button><button class="mb-ac__button mb-ac__button--secondary" id="mb-ac-reset" type="button">' + T.reset + '</button></div>' +
            '<div class="mb-ac__error" id="mb-ac-error" role="alert" aria-live="assertive"></div>' +
          '</form>' +
          '<section class="mb-ac__result" id="mb-ac-result" aria-live="polite" role="status" hidden></section>' +
          '<p class="mb-ac__privacy">' + T.privacy + '</p>' +
        '</div>' +
      '</section>';

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

    rowsContainer.addEventListener('change', function (event) {
      if (!event.target.classList.contains('mb-ac__category')) return;
      var row = event.target.closest('.mb-ac__row');
      var activitySelect = row.querySelector('.mb-ac__activity');
      activitySelect.innerHTML = activityOptions(event.target.value, '');
    });

    rowsContainer.addEventListener('click', function (event) {
      if (!event.target.classList.contains('mb-ac__remove')) return;
      var row = event.target.closest('.mb-ac__row');
      if (row && row.parentNode) row.parentNode.removeChild(row);
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
        showError(T.error_weight, weightInput);
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
          showError(T.error_minutes.replace('{{index}}', String(index + 1)), minutesInput);
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
        showError(T.error_total);
        return;
      }

      var maxGross = Math.max.apply(null, values.map(function (item) { return item.gross; }));
      var itemHtml = values.map(function (item) {
        var width = maxGross > 0 ? Math.max(2, item.gross / maxGross * 100) : 2;
        var minuteDecimals = item.minutes % 1 ? 1 : 0;
        return '<article class="mb-ac__item">' +
          '<div class="mb-ac__item-head"><div><h3 class="mb-ac__item-title">' + escapeHtml(item.activity.name) + '</h3><p class="mb-ac__item-meta">' + formatNumber(item.activity.met, 1) + ' MET · ' + item.intensity.label + ' · ' + formatNumber(item.minutes, minuteDecimals) + ' min</p></div><p class="mb-ac__item-kcal">' + formatNumber(round(item.gross, 0), 0) + ' kcal</p></div>' +
          '<div class="mb-ac__bar" aria-hidden="true"><div class="mb-ac__bar-fill" style="width:' + width.toFixed(1) + '%"></div></div>' +
          '<div class="mb-ac__item-details"><span><strong>' + T.active + ':</strong> ' + formatNumber(round(item.active, 0), 0) + ' kcal</span><span><strong>' + T.per_hour + ':</strong> ' + formatNumber(round(item.perHour, 0), 0) + ' kcal</span><span><strong>' + T.energy + ':</strong> ' + formatNumber(round(item.kj, 0), 0) + ' kJ</span><span><strong>' + T.compendium + ':</strong> ' + item.activity.code + '</span></div>' +
        '</article>';
      }).join('');

      var badge = values.length > 1 ? T.sum.replace('{{count}}', String(values.length)) : values[0].intensity.label;
      var totalMinuteDecimals = totalMinutes % 1 ? 1 : 0;
      result.innerHTML =
        '<div class="mb-ac__result-top"><div><p class="mb-ac__result-label">' + T.total_label + '</p><p class="mb-ac__score">' + formatNumber(round(totalGross, 0), 0) + ' kcal</p></div><span class="mb-ac__badge">' + escapeHtml(badge) + '</span></div>' +
        '<p class="mb-ac__summary">' + T.summary + '</p>' +
        '<div class="mb-ac__metrics">' +
          '<div class="mb-ac__metric"><p class="mb-ac__metric-label">' + T.active_above_rest + '</p><p class="mb-ac__metric-value">' + formatNumber(round(totalActive, 0), 0) + ' kcal</p></div>' +
          '<div class="mb-ac__metric"><p class="mb-ac__metric-label">' + T.energy_conversion + '</p><p class="mb-ac__metric-value">' + formatNumber(round(totalKj, 0), 0) + ' kJ</p></div>' +
          '<div class="mb-ac__metric"><p class="mb-ac__metric-label">' + T.total_time + '</p><p class="mb-ac__metric-value">' + formatNumber(round(totalMinutes, totalMinuteDecimals), totalMinuteDecimals) + ' min</p></div>' +
        '</div>' +
        '<div class="mb-ac__items">' + itemHtml + '</div>' +
        '<p class="mb-ac__formula">' + T.formula + '</p>';
      result.hidden = false;
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      result.scrollIntoView({behavior:reduceMotion ? 'auto' : 'smooth', block:'nearest'});
    });

    appendRow('chuze', 'walk-moderate', 60);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
}());
