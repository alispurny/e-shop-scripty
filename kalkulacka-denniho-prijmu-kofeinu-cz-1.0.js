
/**
 * MyBears — kalkulačka denního příjmu kofeinu
 * Sjednocený vizuální systém podle MyBears interaktivní poradny.
 * Funkční logika, výpočty, interní ID a způsob vložení zůstávají zachované.
 *
 * Mount point:
 *   <div id="mb-caffeine-intake-calculator"></div>
 *
 * Bez externích závislostí. Data se neodesílají ani neukládají.
 */
(function () {
  'use strict';

  var T = {"locale":"cs-CZ","version":"3.0.0-cz","root":"mb-caffeine-intake-calculator","style":"mb-caffeine-intake-calculator-styles","title":"Kalkulačka příjmu kofeinu","lead":"Sečtěte kofein z kávy, čaje, energetických nápojů, koly, čokolády a vlastních produktů. Výsledek ukáže denní součet, množství na kilogram hmotnosti a volitelný odhad kofeinu zbývajícího před spaním.","notice":"<strong>Důležité:</strong> Kalkulačka je určená dospělým od 18 let. Hodnoty v předvolbách jsou orientační a konkrétní výrobek nebo způsob přípravy může obsahovat jiné množství kofeinu.","profile":"Referenční profil","profile_adult":"Zdravý dospělý","profile_preg":"Těhotenství nebo kojení","weight":"Tělesná hmotnost (volitelně)","weight_hint":"Slouží pouze k přepočtu příjmu na mg/kg. Neurčuje individuální toleranci kofeinu.","bedtime":"Plánovaný čas spánku (volitelně)","bedtime_hint":"Pokud u položek zadáte čas, kalkulačka modelově odhadne množství kofeinu zbývající před spaním.","sources_title":"Zdroje kofeinu během dne","sources_intro":"U každé položky můžete upravit počet porcí i množství kofeinu podle etikety nebo údajů výrobce.","source":"Zdroj","servings":"Počet porcí","mg_serving":"Kofein v 1 porci","time":"Čas příjmu","custom_name":"Název vlastního zdroje","add":"Přidat další zdroj","remove":"Odebrat","calculate":"Spočítat příjem","reset":"Vymazat údaje","result":"Váš orientační denní příjem kofeinu","daily_total":"Celkem za den","reference":"Srovnávací hodnota profilu","percent":"Podíl srovnávací hodnoty","per_kg":"Příjem podle hmotnosti","max_item":"Nejvyšší zadaná položka","items_count":"Počet zadaných zdrojů","scale":"Orientační srovnání denního součtu","sleep_title":"Modelový odhad kofeinu před spaním","sleep_average":"Odhad při průměrném poločasu 4 hodiny","sleep_range":"Možné rozpětí při poločasu 2–8 hodin","sleep_missing":"Pro výpočet před spaním zadejte čas spánku a čas alespoň u jedné položky.","single_title":"Nejvyšší příjem v jedné položce","details":"Rozpis započtených zdrojů","item":"Položka","subtotal":"Kofein celkem","privacy":"Výpočet probíhá pouze ve vašem prohlížeči. Zadané údaje se tímto skriptem nikam neodesílají ani neukládají.","preset_note":"Přednastavené hodnoty vycházejí z orientačních porcí EFSA. Obsah kofeinu se může výrazně lišit podle značky, velikosti porce a přípravy.","per_day":"mg/den","region_label":"Interaktivní kalkulačka denního příjmu kofeinu","result_table_caption":"Rozpis zdrojů kofeinu zahrnutých do výpočtu","profiles":{"adult":{"label":"zdravý dospělý","daily":400,"daily_note":"EFSA uvádí, že příjem do 400 mg za den rozložený během dne u zdravých dospělých obecně nevyvolává bezpečnostní obavy. Nejde o doporučený cíl ani o hranici vhodnou pro každého."},"preg":{"label":"těhotenství nebo kojení","daily":200,"daily_note":"EFSA uvádí pro těhotné a kojící ženy příjem ze všech zdrojů do 200 mg za den. Individuální postup je vhodné konzultovat se zdravotníkem."}},"presets":[["filter","Filtrovaná káva (200 ml)",90],["espresso","Espresso (60 ml)",80],["black_tea","Černý čaj (220 ml)",50],["cola","Kola (355 ml)",40],["energy","Energetický nápoj (250 ml)",80],["dark_choc","Hořká čokoláda (50 g)",25],["milk_choc","Mléčná čokoláda (50 g)",10],["custom","Vlastní produkt nebo doplněk",100]],"messages":{"within":"Denní součet nepřekračuje srovnávací hodnotu zvoleného profilu. To však neznamená, že je toto množství vhodné právě pro vás; citlivost se výrazně liší.","over":"Denní součet překračuje srovnávací hodnotu zvoleného profilu. Zkontrolujte zejména velikost porcí, etikety energetických nápojů a doplňků stravy.","single_ok":"Nejvyšší zadaná položka nepřesahuje 200 mg. EFSA tuto hodnotu uvádí pro jednorázový příjem u zdravých dospělých, nikoliv jako doporučenou dávku.","single_high":"Alespoň jedna zadaná položka obsahuje více než 200 mg kofeinu. U těhotenství, kojení, zdravotních potíží nebo užívání léků se tímto srovnáním neřiďte bez konzultace.","sleep":"I nižší množství kofeinu může u citlivého člověka ovlivnit spánek. EFSA uvádí, že už 100 mg přijatých blízko doby spánku může u některých dospělých změnit délku nebo průběh spánku.","symptoms":"Při bušení srdce, třesu, úzkosti, nespavosti, nevolnosti nebo jiných potížích další kofein nepřidávejte a podle závažnosti se poraďte se zdravotníkem.","preg_single":"V těhotenství ani při kojení nelze jednorázovou hranici 200 mg automaticky považovat za vhodnou dávku. Kalkulačka proto hodnotí především celkový denní součet."},"errors":{"weight":"Hmotnost ponechte prázdnou nebo zadejte hodnotu 30–250 kg.","rows":"Přidejte alespoň jeden zdroj kofeinu s platným počtem porcí a množstvím v mg.","servings":"Počet porcí musí být v rozmezí 0,1–20.","mg":"Množství kofeinu v porci musí být v rozmezí 0–1000 mg.","max_rows":"Lze přidat nejvýše 12 zdrojů.","generic":"Výpočet se nepodařilo dokončit. Zkontrolujte zadané údaje."}};
  var ROOT_ID = T.root;
  var STYLE_ID = T.style;
  var VERSION = T.version;
  var MAX_ROWS = 12;
  var rowCounter = 0;

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    var clean = value.trim().replace(/\s+/g, '');
    if (clean === '') return NaN;
    return Number(clean.replace(',', '.'));
  }

  function format(value, decimals) {
    return new Intl.NumberFormat(T.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch];
    });
  }

  function presetById(id) {
    for (var i = 0; i < T.presets.length; i++) {
      if (T.presets[i][0] === id) return T.presets[i];
    }
    return T.presets[0];
  }

  function presetOptions(selected) {
    return T.presets.map(function (preset) {
      return '<option value="' + esc(preset[0]) + '"' +
        (preset[0] === selected ? ' selected' : '') + '>' +
        esc(preset[1]) + '</option>';
    }).join('');
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = String.raw`
/* MyBears unified design layer — based on Interaktivní poradna */
#${ROOT_ID} {
  --mb-green:#2dc26b !important;
  --mb-green-dark:#198d4b !important;
  --mb-green-soft:#f4f8f4 !important;
  --mb-text:#20221f !important;
  --mb-muted:#626760 !important;
  --mb-border:#e5e3dc !important;
  --mb-cream:#faf7ef !important;
  --mb-yellow:#DBC442 !important;
  --mb-yellow-soft:#fff8df !important;
  --mb-danger:#a63a36 !important;
  width:100%;
  max-width:1120px !important;
  margin:24px auto 40px !important;
  color:var(--mb-text) !important;
  font-family:Arial,Helvetica,sans-serif !important;
  font-size:16px;
  font-weight:400;
  line-height:1.55;
}
#${ROOT_ID},
#${ROOT_ID} *,
#${ROOT_ID} *::before,
#${ROOT_ID} *::after {
  box-sizing:border-box;
}
#${ROOT_ID} strong,
#${ROOT_ID} b {
  font-weight:700 !important;
}
#${ROOT_ID} .mb-card {
  position:relative;
  overflow:hidden;
  padding:0 !important;
  border:1px solid var(--mb-border) !important;
  border-radius:18px !important;
  background:#fff !important;
  box-shadow:0 12px 32px rgba(27,35,29,.07) !important;
}
#${ROOT_ID} .mb-card::before {
  content:"";
  position:absolute;
  z-index:5;
  top:0;
  right:0;
  left:0;
  height:4px;
  background:var(--mb-yellow);
}
#${ROOT_ID} .mb-hero {
  padding:34px 38px 28px !important;
  border-bottom:1px solid var(--mb-border) !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} h2.mb-title,
#${ROOT_ID} .mb-title {
  display:block !important;
  max-width:900px;
  margin:0 auto 10px !important;
  padding:0 !important;
  border:0 !important;
  background:none !important;
  box-shadow:none !important;
  filter:none !important;
  color:#000 !important;
  font:700 clamp(25px,3.2vw,30px)/1.16 Arial,Helvetica,sans-serif !important;
  font-style:normal !important;
  font-variant:normal !important;
  font-stretch:normal !important;
  font-synthesis:none !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-indent:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
  -webkit-text-stroke:0 transparent !important;
  outline:none !important;
}
#${ROOT_ID} h2.mb-title::before,
#${ROOT_ID} h2.mb-title::after,
#${ROOT_ID} .mb-title::before,
#${ROOT_ID} .mb-title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-lead {
  max-width:820px;
  margin:0 auto !important;
  padding:0 !important;
  color:#454a45 !important;
  font:400 16px/1.58 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-align:center !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-body {
  padding:30px 38px 36px !important;
}
#${ROOT_ID} .mb-notice {
  margin:0 0 24px !important;
  padding:15px 17px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-cream) !important;
  color:#4f4b43 !important;
  font-size:14px !important;
  line-height:1.55 !important;
}
#${ROOT_ID} .mb-panel {
  padding:20px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
}
#${ROOT_ID} .mb-grid {
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:16px;
}
#${ROOT_ID} label {
  display:block !important;
  margin:0 0 7px !important;
  padding:0 !important;
  color:#292b28 !important;
  font:700 14px/1.4 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} input,
#${ROOT_ID} select {
  width:100% !important;
  min-height:48px !important;
  margin:0 !important;
  padding:10px 12px !important;
  border:1px solid #d4d6d1 !important;
  border-radius:8px !important;
  background:#fff !important;
  box-shadow:none !important;
  color:var(--mb-text) !important;
  font:400 15px/1.35 Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  outline:none !important;
}
#${ROOT_ID} input:hover,
#${ROOT_ID} select:hover {
  border-color:#b9bdb7 !important;
}
#${ROOT_ID} input:focus,
#${ROOT_ID} select:focus,
#${ROOT_ID} input:focus-visible,
#${ROOT_ID} select:focus-visible {
  border-color:var(--mb-green-dark) !important;
  outline:3px solid rgba(219,196,66,.30) !important;
  outline-offset:1px !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-hint {
  margin:6px 0 0 !important;
  color:var(--mb-muted) !important;
  font:400 12px/1.45 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} h3.mb-section-title,
#${ROOT_ID} .mb-section-title {
  display:block !important;
  margin:28px 0 8px !important;
  padding:0 !important;
  border:0 !important;
  background:none !important;
  box-shadow:none !important;
  filter:none !important;
  color:#000 !important;
  font:700 18px/1.3 Arial,Helvetica,sans-serif !important;
  font-style:normal !important;
  font-variant:normal !important;
  font-stretch:normal !important;
  font-synthesis:none !important;
  letter-spacing:0 !important;
  text-align:left !important;
  text-indent:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
  -webkit-text-stroke:0 transparent !important;
  outline:none !important;
}
#${ROOT_ID} h3.mb-section-title::before,
#${ROOT_ID} h3.mb-section-title::after,
#${ROOT_ID} .mb-section-title::before,
#${ROOT_ID} .mb-section-title::after {
  content:none !important;
  display:none !important;
}
#${ROOT_ID} .mb-section-intro {
  margin:0 0 14px !important;
  color:var(--mb-muted) !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-source {
  display:grid;
  grid-template-columns:minmax(190px,2.1fr) minmax(92px,.7fr) minmax(120px,.9fr) minmax(110px,.8fr) 46px;
  gap:12px;
  align-items:end;
  margin:0 0 12px !important;
  padding:16px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:14px !important;
  background:var(--mb-cream) !important;
  box-shadow:none !important;
}
#${ROOT_ID} .mb-custom {
  display:none;
  grid-column:1 / 5;
}
#${ROOT_ID} .mb-custom.is-visible {
  display:block;
}
#${ROOT_ID} button {
  appearance:none !important;
  -webkit-appearance:none !important;
  margin:0 !important;
  box-shadow:none !important;
  filter:none !important;
  font-family:Arial,Helvetica,sans-serif !important;
  letter-spacing:0 !important;
  text-transform:none !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-remove {
  display:inline-flex !important;
  align-items:center;
  justify-content:center;
  width:46px !important;
  min-width:46px !important;
  height:48px !important;
  min-height:48px !important;
  padding:0 !important;
  border:1px solid #d7d8d4 !important;
  border-radius:8px !important;
  background:#fff !important;
  color:#5e625e !important;
  font:400 24px/1 Arial,Helvetica,sans-serif !important;
  cursor:pointer;
  transition:background .15s ease,border-color .15s ease,color .15s ease,transform .15s ease;
}
#${ROOT_ID} .mb-remove:hover {
  border-color:#d6a09d !important;
  background:#fff7f6 !important;
  color:var(--mb-danger) !important;
  transform:translateY(-1px);
}
#${ROOT_ID} .mb-actions {
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin:16px 0 0 !important;
}
#${ROOT_ID} button.mb-primary,
#${ROOT_ID} button.mb-secondary,
#${ROOT_ID} button.mb-add {
  display:inline-flex !important;
  align-items:center;
  justify-content:center;
  min-height:46px !important;
  padding:11px 20px !important;
  border:2px solid transparent !important;
  border-radius:8px !important;
  font:700 15px/1.3 Arial,Helvetica,sans-serif !important;
  text-decoration:none !important;
  cursor:pointer;
  transition:background .15s ease,border-color .15s ease,color .15s ease,transform .15s ease;
}
#${ROOT_ID} button.mb-primary {
  order:1;
  border-color:var(--mb-green) !important;
  background:var(--mb-green) !important;
  color:#fff !important;
}
#${ROOT_ID} button.mb-primary:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-dark) !important;
  color:#fff !important;
  transform:translateY(-1px);
}
#${ROOT_ID} button.mb-add {
  order:2;
  border-color:var(--mb-green) !important;
  background:#fff !important;
  color:var(--mb-green-dark) !important;
}
#${ROOT_ID} button.mb-add:hover {
  border-color:var(--mb-green-dark) !important;
  background:var(--mb-green-soft) !important;
  color:var(--mb-green-dark) !important;
  transform:translateY(-1px);
}
#${ROOT_ID} button.mb-secondary {
  order:3;
  border-color:#d7d8d4 !important;
  background:#fff !important;
  color:#5e625e !important;
}
#${ROOT_ID} button.mb-secondary:hover {
  border-color:#bfc2bc !important;
  background:#f7f7f5 !important;
  color:#3f433f !important;
  transform:translateY(-1px);
}
#${ROOT_ID} button:focus-visible,
#${ROOT_ID} a:focus-visible {
  outline:3px solid rgba(219,196,66,.38) !important;
  outline-offset:2px !important;
}
#${ROOT_ID} .mb-error {
  display:none;
  margin:14px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid #e5b6b2 !important;
  border-left:4px solid var(--mb-danger) !important;
  border-radius:10px !important;
  background:#fff5f4 !important;
  color:#812d29 !important;
  font:400 14px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-error.is-visible {
  display:block;
}
#${ROOT_ID} .mb-preset-note {
  margin-top:12px !important;
}
#${ROOT_ID} .mb-result {
  margin:28px 0 0 !important;
  padding:24px !important;
  border:1px solid #cfe4d5 !important;
  border-radius:16px !important;
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} .mb-result[hidden] {
  display:none !important;
}
#${ROOT_ID} .mb-result-head {
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:18px;
}
#${ROOT_ID} .mb-kicker {
  margin:0 0 5px !important;
  color:#4f6258 !important;
  font:700 13px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-total {
  margin:0 !important;
  padding:0 !important;
  color:var(--mb-text) !important;
  font:800 clamp(38px,6vw,46px)/1 Arial,Helvetica,sans-serif !important;
  letter-spacing:-.02em !important;
  text-shadow:none !important;
}
#${ROOT_ID} .mb-total small {
  font-size:18px !important;
  font-weight:700 !important;
}
#${ROOT_ID} .mb-badge {
  display:inline-flex;
  align-items:center;
  min-height:34px;
  padding:7px 12px !important;
  border:1px solid #e5dfd1 !important;
  border-radius:999px !important;
  background:var(--mb-yellow-soft) !important;
  color:#6c5c36 !important;
  font:700 12px/1.3 Arial,Helvetica,sans-serif !important;
  white-space:nowrap;
}
#${ROOT_ID} .mb-summary {
  margin:14px 0 0 !important;
  color:#39423b !important;
  font:400 14px/1.58 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-scale-title {
  margin-top:18px !important;
}
#${ROOT_ID} .mb-meter {
  position:relative;
  overflow:hidden;
  height:16px;
  margin:10px 0 6px !important;
  border:1px solid rgba(32,34,31,.10);
  border-radius:999px;
  background:linear-gradient(90deg,#b8eacb 0 52%,#eadf86 52% 80%,#e4aaa6 80% 100%);
}
#${ROOT_ID} .mb-marker {
  position:absolute;
  top:-5px;
  width:4px;
  height:26px;
  border:1px solid #fff;
  border-radius:4px;
  background:var(--mb-text);
  transform:translateX(-50%);
}
#${ROOT_ID} .mb-meter-labels {
  display:flex;
  justify-content:space-between;
  gap:8px;
  margin:0 0 16px !important;
  color:#53675d !important;
  font:400 11px/1.35 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-stats {
  display:grid;
  grid-template-columns:repeat(5,minmax(0,1fr));
  gap:10px;
}
#${ROOT_ID} .mb-stat {
  min-width:0;
  padding:13px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
}
#${ROOT_ID} .mb-stat span {
  display:block;
  margin:0 0 5px !important;
  color:var(--mb-muted) !important;
  font:400 12px/1.4 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-stat strong {
  display:block;
  overflow-wrap:anywhere;
  color:var(--mb-text) !important;
  font:700 17px/1.3 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-info {
  margin:14px 0 0 !important;
  padding:13px 15px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:#fff !important;
  color:#4f4b43 !important;
  font:400 13px/1.58 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-info strong {
  color:var(--mb-text) !important;
}
#${ROOT_ID} .mb-sleep-block[hidden] {
  display:none !important;
}
#${ROOT_ID} .mb-sleep {
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:10px;
  margin:0 !important;
}
#${ROOT_ID} .mb-table-wrap {
  overflow-x:auto;
  margin:14px 0 0 !important;
  border:1px solid var(--mb-border) !important;
  border-radius:12px !important;
  background:#fff !important;
}
#${ROOT_ID} table {
  width:100% !important;
  min-width:650px;
  margin:0 !important;
  border:0 !important;
  border-collapse:collapse !important;
  background:#fff !important;
}
#${ROOT_ID} th,
#${ROOT_ID} td {
  padding:11px 12px !important;
  border:0 !important;
  border-bottom:1px solid var(--mb-border) !important;
  color:var(--mb-text) !important;
  font:400 13px/1.45 Arial,Helvetica,sans-serif !important;
  text-align:left !important;
  vertical-align:top !important;
}
#${ROOT_ID} thead th {
  border-bottom:2px solid var(--mb-yellow) !important;
  background:#20231f !important;
  color:#fff !important;
  font-weight:700 !important;
}
#${ROOT_ID} tbody tr:nth-child(even) {
  background:var(--mb-green-soft) !important;
}
#${ROOT_ID} tbody tr:last-child td {
  border-bottom:0 !important;
}
#${ROOT_ID} .mb-privacy {
  margin:16px 0 0 !important;
  color:var(--mb-muted) !important;
  font:400 12px/1.5 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-sr-only {
  position:absolute !important;
  width:1px !important;
  height:1px !important;
  padding:0 !important;
  margin:-1px !important;
  overflow:hidden !important;
  clip:rect(0,0,0,0) !important;
  white-space:nowrap !important;
  border:0 !important;
}
@media (max-width:980px) {
  #${ROOT_ID} .mb-grid {
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
  #${ROOT_ID} .mb-grid > div:last-child {
    grid-column:1 / -1;
  }
  #${ROOT_ID} .mb-stats {
    grid-template-columns:repeat(3,minmax(0,1fr));
  }
}
@media (max-width:820px) {
  #${ROOT_ID} .mb-source {
    grid-template-columns:1fr 1fr;
  }
  #${ROOT_ID} .mb-source > div:first-child {
    grid-column:1 / -1;
  }
  #${ROOT_ID} .mb-custom {
    grid-column:1 / -1;
  }
  #${ROOT_ID} .mb-remove {
    grid-column:2;
    justify-self:end;
  }
}
@media (max-width:650px) {
  #${ROOT_ID} {
    margin:18px auto 30px !important;
  }
  #${ROOT_ID} .mb-card {
    border-radius:15px !important;
  }
  #${ROOT_ID} .mb-hero {
    padding:28px 20px 22px !important;
  }
  #${ROOT_ID} h2.mb-title,
  #${ROOT_ID} .mb-title {
    font-size:25px !important;
  }
  #${ROOT_ID} .mb-lead {
    font-size:15px !important;
  }
  #${ROOT_ID} .mb-body {
    padding:24px 20px 28px !important;
  }
  #${ROOT_ID} .mb-panel {
    padding:16px !important;
  }
  #${ROOT_ID} .mb-grid,
  #${ROOT_ID} .mb-sleep,
  #${ROOT_ID} .mb-source,
  #${ROOT_ID} .mb-stats {
    grid-template-columns:1fr;
  }
  #${ROOT_ID} .mb-grid > div:last-child,
  #${ROOT_ID} .mb-source > div:first-child,
  #${ROOT_ID} .mb-custom,
  #${ROOT_ID} .mb-remove {
    grid-column:1;
  }
  #${ROOT_ID} .mb-remove {
    justify-self:start;
  }
  #${ROOT_ID} .mb-actions {
    flex-direction:column;
  }
  #${ROOT_ID} .mb-actions button {
    width:100% !important;
  }
  #${ROOT_ID} .mb-result {
    padding:20px 16px !important;
  }
  #${ROOT_ID} .mb-result-head {
    display:block;
  }
  #${ROOT_ID} .mb-badge {
    margin-top:12px !important;
  }
}
@media (prefers-reduced-motion:reduce) {
  #${ROOT_ID},
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
  #${ROOT_ID} .mb-card {
    border:0 !important;
    box-shadow:none !important;
  }
  #${ROOT_ID} .mb-actions,
  #${ROOT_ID} .mb-remove,
  #${ROOT_ID} .mb-error {
    display:none !important;
  }
}
`;
    document.head.appendChild(style);
  }

  function createRow(data) {
    data = data || {preset:'filter', servings:'1', mg:'90', time:''};
    rowCounter += 1;

    var rowId = ROOT_ID + '-source-' + rowCounter;
    var presetId = rowId + '-preset';
    var servingsId = rowId + '-servings';
    var mgId = rowId + '-mg';
    var timeId = rowId + '-time';
    var customId = rowId + '-custom';

    var row = document.createElement('div');
    row.className = 'mb-source';
    row.setAttribute('data-source-row', String(rowCounter));
    row.innerHTML =
      '<div><label for="' + presetId + '">' + esc(T.source) + '</label>' +
      '<select id="' + presetId + '" class="mb-preset">' + presetOptions(data.preset) + '</select></div>' +
      '<div><label for="' + servingsId + '">' + esc(T.servings) + '</label>' +
      '<input id="' + servingsId + '" class="mb-servings" type="text" inputmode="decimal" autocomplete="off" value="' + esc(data.servings) + '"></div>' +
      '<div><label for="' + mgId + '">' + esc(T.mg_serving) + ' (mg)</label>' +
      '<input id="' + mgId + '" class="mb-mg" type="text" inputmode="decimal" autocomplete="off" value="' + esc(data.mg) + '"></div>' +
      '<div><label for="' + timeId + '">' + esc(T.time) + '</label>' +
      '<input id="' + timeId + '" class="mb-time" type="time" value="' + esc(data.time || '') + '"></div>' +
      '<button type="button" class="mb-remove" aria-label="' + esc(T.remove) + '" title="' + esc(T.remove) + '">×</button>' +
      '<div class="mb-custom' + (data.preset === 'custom' ? ' is-visible' : '') + '">' +
      '<label for="' + customId + '">' + esc(T.custom_name) + '</label>' +
      '<input id="' + customId + '" class="mb-custom-name" type="text" autocomplete="off" value="' + esc(data.customName || '') + '"></div>';

    row.querySelector('.mb-preset').addEventListener('change', function () {
      var preset = presetById(this.value);
      row.querySelector('.mb-mg').value = preset[2];
      row.querySelector('.mb-custom').classList.toggle('is-visible', this.value === 'custom');
    });

    row.querySelector('.mb-remove').addEventListener('click', function () {
      var list = row.parentNode;
      if (list && list.children.length > 1) {
        row.remove();
      } else {
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
    var parts = value.split(':');
    return Number(parts[0]) * 60 + Number(parts[1]);
  }

  function hoursUntil(time, bedtime) {
    var intakeMinutes = timeToMinutes(time);
    var bedtimeMinutes = timeToMinutes(bedtime);
    if (intakeMinutes == null || bedtimeMinutes == null) return null;
    return ((bedtimeMinutes - intakeMinutes + 1440) % 1440) / 60;
  }

  function remainingAtBed(rows, bedtime, halfLife) {
    var total = 0;
    var count = 0;

    rows.forEach(function (row) {
      var hours = hoursUntil(row.time, bedtime);
      if (hours != null) {
        total += row.subtotal * Math.pow(0.5, hours / halfLife);
        count += 1;
      }
    });

    return count ? total : null;
  }

  function readRows(root) {
    var rows = [];
    var invalid = null;

    root.querySelectorAll('.mb-source').forEach(function (element) {
      var presetId = element.querySelector('.mb-preset').value;
      var preset = presetById(presetId);
      var servings = parseNumber(element.querySelector('.mb-servings').value);
      var mg = parseNumber(element.querySelector('.mb-mg').value);

      if (!isFinite(servings) || servings < 0.1 || servings > 20) {
        invalid = T.errors.servings;
        return;
      }
      if (!isFinite(mg) || mg < 0 || mg > 1000) {
        invalid = T.errors.mg;
        return;
      }
      if (mg === 0) return;

      var customName = element.querySelector('.mb-custom-name').value.trim();
      var label = presetId === 'custom' && customName ? customName : preset[1];

      rows.push({
        label:label,
        servings:servings,
        mg:mg,
        subtotal:servings * mg,
        time:element.querySelector('.mb-time').value
      });
    });

    if (invalid) throw new Error(invalid);
    if (!rows.length) throw new Error(T.errors.rows);
    return rows;
  }

  function showError(root, message) {
    var element = root.querySelector('.mb-error');
    element.textContent = message;
    element.classList.add('is-visible');
    element.focus();
  }

  function clearError(root) {
    var element = root.querySelector('.mb-error');
    element.textContent = '';
    element.classList.remove('is-visible');
  }

  function renderResult(root) {
    clearError(root);

    try {
      var profileId = root.querySelector('.mb-profile').value;
      var profile = T.profiles[profileId];
      var weightRaw = root.querySelector('.mb-weight').value.trim();
      var weight = weightRaw === '' ? null : parseNumber(weightRaw);

      if (weight != null && (!isFinite(weight) || weight < 30 || weight > 250)) {
        throw new Error(T.errors.weight);
      }

      var bedtime = root.querySelector('.mb-bedtime').value;
      var rows = readRows(root);
      var total = rows.reduce(function (sum, row) { return sum + row.subtotal; }, 0);
      var max = rows.reduce(function (first, second) {
        return first.subtotal >= second.subtotal ? first : second;
      });
      var percent = total / profile.daily * 100;
      var marker = Math.max(0, Math.min(100, percent / 1.25));
      var averageAtBed = bedtime ? remainingAtBed(rows, bedtime, 4) : null;
      var fastAtBed = bedtime ? remainingAtBed(rows, bedtime, 2) : null;
      var slowAtBed = bedtime ? remainingAtBed(rows, bedtime, 8) : null;
      var result = root.querySelector('.mb-result');

      result.hidden = false;
      result.querySelector('.mb-total').innerHTML = format(total, 0) + ' <small>mg</small>';
      result.querySelector('.mb-badge').textContent = profile.label;
      result.querySelector('.mb-summary').textContent =
        (total <= profile.daily ? T.messages.within : T.messages.over) + ' ' + profile.daily_note;
      result.querySelector('.mb-marker').style.left = marker + '%';
      result.querySelector('.mb-ref').textContent = format(profile.daily, 0) + ' ' + T.per_day;
      result.querySelector('.mb-pct').textContent = format(percent, 0) + ' %';
      result.querySelector('.mb-perkg').textContent =
        weight ? format(total / weight, 1) + ' mg/kg' : '—';
      result.querySelector('.mb-max').textContent = format(max.subtotal, 0) + ' mg';
      result.querySelector('.mb-count').textContent = String(rows.length);

      var singleText = profileId === 'preg'
        ? T.messages.preg_single
        : (max.subtotal <= 200 ? T.messages.single_ok : T.messages.single_high);

      result.querySelector('.mb-single').innerHTML =
        '<strong>' + esc(T.single_title) + ':</strong> ' +
        esc(max.label) + ' — ' + format(max.subtotal, 0) + ' mg. ' + esc(singleText);

      var sleep = result.querySelector('.mb-sleep-block');
      if (averageAtBed != null) {
        sleep.hidden = false;
        sleep.querySelector('.mb-sleep-avg').textContent = format(averageAtBed, 0) + ' mg';
        sleep.querySelector('.mb-sleep-range').textContent =
          format(fastAtBed, 0) + '–' + format(slowAtBed, 0) + ' mg';
      } else {
        sleep.hidden = true;
      }

      result.querySelector('.mb-sleep-note').textContent = T.messages.sleep;

      var tbody = result.querySelector('tbody');
      tbody.innerHTML = rows.map(function (row) {
        return '<tr>' +
          '<td>' + esc(row.label) + '</td>' +
          '<td>' + format(row.servings, row.servings % 1 ? 1 : 0) + '</td>' +
          '<td>' + format(row.mg, 0) + ' mg</td>' +
          '<td>' + (row.time ? esc(row.time) : '—') + '</td>' +
          '<td><strong>' + format(row.subtotal, 0) + ' mg</strong></td>' +
          '</tr>';
      }).join('');

      result.scrollIntoView({
        behavior:window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'nearest'
      });
    } catch (error) {
      showError(root, error && error.message ? error.message : T.errors.generic);
    }
  }

  function resetCalculator(root) {
    clearError(root);
    root.querySelector('.mb-profile').value = 'adult';
    root.querySelector('.mb-weight').value = '';
    root.querySelector('.mb-bedtime').value = '23:00';

    var list = root.querySelector('.mb-list');
    list.innerHTML = '';
    list.appendChild(createRow({preset:'filter', servings:'1', mg:'90', time:'08:00'}));
    list.appendChild(createRow({preset:'black_tea', servings:'1', mg:'50', time:'14:00'}));

    root.querySelector('.mb-result').hidden = true;
  }

  function build(root) {
    root.setAttribute('data-version', VERSION);
    root.setAttribute('data-locale', T.locale);
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', T.region_label);

    root.innerHTML =
      '<div class="mb-card">' +
        '<header class="mb-hero">' +
          '<h2 class="mb-title">' + esc(T.title) + '</h2>' +
          '<p class="mb-lead">' + esc(T.lead) + '</p>' +
        '</header>' +
        '<div class="mb-body">' +
          '<div class="mb-notice" role="note">' + T.notice + '</div>' +
          '<div class="mb-panel">' +
            '<div class="mb-grid">' +
              '<div>' +
                '<label for="' + ROOT_ID + '-profile">' + esc(T.profile) + '</label>' +
                '<select id="' + ROOT_ID + '-profile" class="mb-profile">' +
                  '<option value="adult">' + esc(T.profile_adult) + '</option>' +
                  '<option value="preg">' + esc(T.profile_preg) + '</option>' +
                '</select>' +
              '</div>' +
              '<div>' +
                '<label for="' + ROOT_ID + '-weight">' + esc(T.weight) + '</label>' +
                '<input id="' + ROOT_ID + '-weight" class="mb-weight" type="text" inputmode="decimal" autocomplete="off" placeholder="70" aria-describedby="' + ROOT_ID + '-weight-hint">' +
                '<div id="' + ROOT_ID + '-weight-hint" class="mb-hint">' + esc(T.weight_hint) + '</div>' +
              '</div>' +
              '<div>' +
                '<label for="' + ROOT_ID + '-bedtime">' + esc(T.bedtime) + '</label>' +
                '<input id="' + ROOT_ID + '-bedtime" class="mb-bedtime" type="time" value="23:00" aria-describedby="' + ROOT_ID + '-bedtime-hint">' +
                '<div id="' + ROOT_ID + '-bedtime-hint" class="mb-hint">' + esc(T.bedtime_hint) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<h3 class="mb-section-title">' + esc(T.sources_title) + '</h3>' +
          '<p class="mb-section-intro">' + esc(T.sources_intro) + '</p>' +
          '<div class="mb-list"></div>' +
          '<div class="mb-actions">' +
            '<button type="button" class="mb-primary">' + esc(T.calculate) + '</button>' +
            '<button type="button" class="mb-add">+ ' + esc(T.add) + '</button>' +
            '<button type="button" class="mb-secondary">' + esc(T.reset) + '</button>' +
          '</div>' +
          '<div class="mb-error" role="alert" aria-live="assertive" tabindex="-1"></div>' +
          '<div class="mb-hint mb-preset-note">' + esc(T.preset_note) + '</div>' +
          '<section class="mb-result" hidden aria-live="polite" aria-atomic="false">' +
            '<div class="mb-result-head">' +
              '<div>' +
                '<div class="mb-kicker">' + esc(T.result) + '</div>' +
                '<p class="mb-total"></p>' +
              '</div>' +
              '<div class="mb-badge"></div>' +
            '</div>' +
            '<p class="mb-summary"></p>' +
            '<div class="mb-section-intro mb-scale-title">' + esc(T.scale) + '</div>' +
            '<div class="mb-meter" aria-hidden="true"><span class="mb-marker"></span></div>' +
            '<div class="mb-meter-labels" aria-hidden="true"><span>0 %</span><span>50 %</span><span>100 %</span><span>125 %+</span></div>' +
            '<div class="mb-stats">' +
              '<div class="mb-stat"><span>' + esc(T.reference) + '</span><strong class="mb-ref"></strong></div>' +
              '<div class="mb-stat"><span>' + esc(T.percent) + '</span><strong class="mb-pct"></strong></div>' +
              '<div class="mb-stat"><span>' + esc(T.per_kg) + '</span><strong class="mb-perkg"></strong></div>' +
              '<div class="mb-stat"><span>' + esc(T.max_item) + '</span><strong class="mb-max"></strong></div>' +
              '<div class="mb-stat"><span>' + esc(T.items_count) + '</span><strong class="mb-count"></strong></div>' +
            '</div>' +
            '<div class="mb-info mb-single"></div>' +
            '<div class="mb-sleep-block" hidden>' +
              '<h3 class="mb-section-title">' + esc(T.sleep_title) + '</h3>' +
              '<div class="mb-sleep">' +
                '<div class="mb-stat"><span>' + esc(T.sleep_average) + '</span><strong class="mb-sleep-avg"></strong></div>' +
                '<div class="mb-stat"><span>' + esc(T.sleep_range) + '</span><strong class="mb-sleep-range"></strong></div>' +
              '</div>' +
            '</div>' +
            '<div class="mb-info mb-sleep-note"></div>' +
            '<h3 class="mb-section-title">' + esc(T.details) + '</h3>' +
            '<div class="mb-table-wrap">' +
              '<table>' +
                '<caption class="mb-sr-only">' + esc(T.result_table_caption) + '</caption>' +
                '<thead><tr>' +
                  '<th scope="col">' + esc(T.item) + '</th>' +
                  '<th scope="col">' + esc(T.servings) + '</th>' +
                  '<th scope="col">' + esc(T.mg_serving) + '</th>' +
                  '<th scope="col">' + esc(T.time) + '</th>' +
                  '<th scope="col">' + esc(T.subtotal) + '</th>' +
                '</tr></thead>' +
                '<tbody></tbody>' +
              '</table>' +
            '</div>' +
            '<div class="mb-info">' + esc(T.messages.symptoms) + '</div>' +
            '<p class="mb-privacy">' + esc(T.privacy) + '</p>' +
          '</section>' +
        '</div>' +
      '</div>';

    var list = root.querySelector('.mb-list');
    list.appendChild(createRow({preset:'filter', servings:'1', mg:'90', time:'08:00'}));
    list.appendChild(createRow({preset:'black_tea', servings:'1', mg:'50', time:'14:00'}));

    root.querySelector('.mb-add').addEventListener('click', function () {
      if (list.children.length >= MAX_ROWS) {
        showError(root, T.errors.max_rows);
        return;
      }
      clearError(root);
      list.appendChild(createRow({preset:'custom', servings:'1', mg:'100', time:''}));
    });

    root.querySelector('.mb-primary').addEventListener('click', function () {
      renderResult(root);
    });

    root.querySelector('.mb-secondary').addEventListener('click', function () {
      resetCalculator(root);
    });
  }

  function init() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    injectStyles();
    build(root);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
