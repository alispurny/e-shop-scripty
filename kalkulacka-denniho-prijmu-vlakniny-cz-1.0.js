/**
 * MyBears — kalkulačka denního příjmu vlákniny
 * Vizuální systém podle kalkulačky denního příjmu kofeinu.
 *
 * Mount point:
 *   <div id="mb-fiber-intake-calculator"></div>
 *
 * Bez externích závislostí. Data se neodesílají ani neukládají.
 */
(function () {
  'use strict';

  var T = {"locale":"cs-CZ","version":"1.0.0-cz","title":"Kalkulačka denního příjmu vlákniny","lead":"Zjistěte orientační denní cíl vlákniny pro dospělého nebo dítě. Volitelně zadejte svůj současný příjem a kalkulačka ukáže, kolik gramů do cíle zbývá.","notice":"<strong>Důležité:</strong> Výsledek je orientační referenční hodnota pro zdravou populaci. Nejde o individuální léčebný plán. Při onemocnění trávicího traktu, po operaci nebo při doporučené nízkovlákninové dietě se řiďte pokyny zdravotníka.","profile":"Referenční profil","adult":"Dospělý od 18 let","child":"Dítě od 1 do 17 let","age":"Věk dítěte","age_hint":"Kalkulačka není určená dětem mladším než 1 rok.","energy":"Denní energetický příjem dítěte","energy_unit":"kcal/den","energy_hint":"Pro dětský výpočet je potřeba zadat odhad energie v kcal za den. Kalkulačka jej převede na MJ.","current":"Současný denní příjem vlákniny (volitelně)","current_hint":"Zadejte odhad z jídelníčku nebo nutriční aplikace. Pokud ho neznáte, pole ponechte prázdné.","meals":"Počet jídel za den","meals_hint":"Slouží pouze k orientačnímu rozdělení vypočteného cíle mezi jídla.","calc":"Spočítat denní cíl","reset":"Vymazat údaje","result":"Váš orientační denní cíl vlákniny","target":"Denní cíl","basis":"Použitá metodika","permeal":"Při rovnoměrném rozdělení","current_label":"Zadaný současný příjem","difference":"Rozdíl do cíle","above_target":"nad cílem","fulfil":"Naplnění cíle","adult_basis":"EFSA: 25 g vlákniny za den pro normální funkci střev u dospělých.","child_basis":"EFSA: 2 g vlákniny na 1 MJ denního energetického příjmu u dětí od 1 roku.","adult_message":"Pro dospělé používá kalkulačka referenční hodnotu 25 g za den. Vyšší příjem může být v rámci pestré stravy běžný, ale neexistuje jedna univerzální hodnota vhodná pro každého.","child_message":"Dětský výsledek vychází z energetického příjmu. Pokud je zadaný odhad energie nepřesný, změní se i vypočtený cíl vlákniny.","below":"Zadaný současný příjem je pod orientačním cílem. Zvyšujte vlákninu postupně a současně dbejte na dostatek tekutin.","near":"Zadaný současný příjem je blízko vypočtenému orientačnímu cíli.","above":"Zadaný současný příjem je nad vypočteným orientačním cílem. Samotné překročení neznamená automaticky problém, důležitá je tolerance a celková skladba jídelníčku.","no_current":"Současný příjem jste nezadali, proto kalkulačka zobrazuje pouze orientační denní cíl.","gradual":"Pokud vlákninu navyšujete, přidávejte ji do jídelníčku postupně. Náhlé zvýšení může způsobit nadýmání nebo plynatost; dostatek tekutin pomáhá vláknině správně fungovat.","formula_adult":"Dospělí: 25 g/den.","formula_child":"Děti: 2 g × denní energie v MJ. Přepočet: 1 MJ = 239,006 kcal.","privacy":"Výpočet probíhá pouze ve vašem prohlížeči. Zadané údaje se nikam neodesílají ani neukládají.","perday":"g/den","permeal_unit":"g/jídlo","profile_adult":"dospělý","profile_child":"dítě","region":"Interaktivní kalkulačka denního příjmu vlákniny","errors":{"age":"Zadejte věk dítěte v rozmezí 1–17 let.","energy":"Zadejte denní energetický příjem dítěte v rozmezí 500–5000 kcal.","current":"Současný příjem ponechte prázdný nebo zadejte hodnotu 0–100 g za den.","meals":"Zvolte počet jídel v rozmezí 2–8.","generic":"Výpočet se nepodařilo dokončit. Zkontrolujte zadané údaje."}};
  var ROOT_ID = 'mb-fiber-intake-calculator';
  var STYLE_ID = 'mb-fiber-intake-calculator-styles';
  var VERSION = T.version;
  var KCAL_PER_MJ = 239.005736;

  function parseNumber(value) {
    if (typeof value !== 'string') return NaN;
    var clean = value.trim().replace(/\s+/g, '');
    if (clean === '') return NaN;
    return Number(clean.replace(',', '.'));
  }

  function format(value, decimals) {
    return new Intl.NumberFormat(T.locale, {
      minimumFractionDigits:decimals,
      maximumFractionDigits:decimals
    }).format(value);
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch];
    });
  }

  function injectStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);
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

#${ROOT_ID} .mb-profile-note {
  margin:12px 0 0 !important;
  padding:12px 14px !important;
  border:1px solid var(--mb-border) !important;
  border-radius:10px !important;
  background:#fff !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-child-fields[hidden],
#${ROOT_ID} .mb-current-block[hidden],
#${ROOT_ID} .mb-meter-block[hidden] {
  display:none !important;
}
#${ROOT_ID} .mb-formula {
  margin:16px 0 0 !important;
  padding:14px 16px !important;
  border:1px solid #eadfc8 !important;
  border-left:4px solid var(--mb-yellow) !important;
  border-radius:12px !important;
  background:var(--mb-yellow-soft) !important;
  color:#000 !important;
  font:400 13px/1.55 Arial,Helvetica,sans-serif !important;
}
#${ROOT_ID} .mb-formula code {
  color:#000 !important;
  font:700 13px/1.55 Arial,Helvetica,sans-serif !important;
  white-space:normal !important;
}
#${ROOT_ID} .mb-target-note {
  margin:14px 0 0 !important;
  color:#000 !important;
  font:400 14px/1.6 Arial,Helvetica,sans-serif !important;
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

  function showError(root, message) {
    var error = root.querySelector('.mb-error');
    error.textContent = message;
    error.classList.add('is-visible');
    error.focus();
  }

  function clearError(root) {
    var error = root.querySelector('.mb-error');
    error.textContent = '';
    error.classList.remove('is-visible');
  }

  function toggleProfile(root) {
    var child = root.querySelector('.mb-profile').value === 'child';
    root.querySelector('.mb-child-fields').hidden = !child;
    root.querySelector('.mb-profile-note').textContent = child ? T.child_basis : T.adult_basis;
    root.querySelector('.mb-result').hidden = true;
    clearError(root);
  }

  function calculate(root) {
    clearError(root);
    try {
      var profile = root.querySelector('.mb-profile').value;
      var meals = parseNumber(root.querySelector('.mb-meals').value);
      var currentRaw = root.querySelector('.mb-current').value.trim();
      var current = currentRaw === '' ? null : parseNumber(currentRaw);
      var target;
      var basis;

      if (!isFinite(meals) || meals < 2 || meals > 8) throw new Error(T.errors.meals);
      if (current != null && (!isFinite(current) || current < 0 || current > 100)) throw new Error(T.errors.current);

      if (profile === 'child') {
        var age = parseNumber(root.querySelector('.mb-age').value);
        var energy = parseNumber(root.querySelector('.mb-energy').value);
        if (!isFinite(age) || age < 1 || age > 17) throw new Error(T.errors.age);
        if (!isFinite(energy) || energy < 500 || energy > 5000) throw new Error(T.errors.energy);
        target = 2 * (energy / KCAL_PER_MJ);
        basis = T.child_basis;
      } else {
        target = 25;
        basis = T.adult_basis;
      }

      var result = root.querySelector('.mb-result');
      var perMeal = target / meals;
      var pct = current == null ? null : current / target * 100;
      var diff = current == null ? null : target - current;
      var profileLabel = profile === 'child' ? T.profile_child : T.profile_adult;
      var message = profile === 'child' ? T.child_message : T.adult_message;

      result.hidden = false;
      result.querySelector('.mb-total').innerHTML = format(target, 1) + ' <small>' + esc(T.perday) + '</small>';
      result.querySelector('.mb-badge').textContent = profileLabel;
      result.querySelector('.mb-summary').textContent = message;
      result.querySelector('.mb-basis').textContent = basis;
      result.querySelector('.mb-target-repeat').innerHTML = format(target, 1) + ' <small>' + esc(T.perday) + '</small>';
      result.querySelector('.mb-permeal').textContent = format(perMeal, 1) + ' ' + T.permeal_unit;
      result.querySelector('.mb-current-value').textContent = current == null ? '—' : format(current, 1) + ' ' + T.perday;
      result.querySelector('.mb-difference').textContent = diff == null ? '—' : (diff > 0 ? format(diff, 1) + ' ' + T.perday : (diff < 0 ? '+' + format(Math.abs(diff), 1) + ' ' + T.perday + ' ' + T.above_target : '0 ' + T.perday));
      result.querySelector('.mb-fulfil').textContent = pct == null ? '—' : format(pct, 0) + ' %';

      var currentBlock = result.querySelector('.mb-current-block');
      var meterBlock = result.querySelector('.mb-meter-block');
      if (current == null) {
        currentBlock.hidden = true;
        meterBlock.hidden = true;
        result.querySelector('.mb-status').textContent = T.no_current;
      } else {
        currentBlock.hidden = false;
        meterBlock.hidden = false;
        result.querySelector('.mb-marker').style.left = Math.max(0, Math.min(100, pct / 1.25)) + '%';
        if (pct < 90) result.querySelector('.mb-status').textContent = T.below;
        else if (pct <= 125) result.querySelector('.mb-status').textContent = T.near;
        else result.querySelector('.mb-status').textContent = T.above;
      }

      result.scrollIntoView({
        behavior:window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block:'nearest'
      });
    } catch (error) {
      showError(root, error && error.message ? error.message : T.errors.generic);
    }
  }

  function reset(root) {
    root.querySelector('.mb-profile').value = 'adult';
    root.querySelector('.mb-age').value = '8';
    root.querySelector('.mb-energy').value = '1600';
    root.querySelector('.mb-current').value = '';
    root.querySelector('.mb-meals').value = '4';
    root.querySelector('.mb-result').hidden = true;
    toggleProfile(root);
    clearError(root);
  }

  function build(root) {
    root.setAttribute('data-version', VERSION);
    root.setAttribute('data-locale', T.locale);
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', T.region);

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
              '<div><label for="' + ROOT_ID + '-profile">' + esc(T.profile) + '</label><select id="' + ROOT_ID + '-profile" class="mb-profile"><option value="adult">' + esc(T.adult) + '</option><option value="child">' + esc(T.child) + '</option></select></div>' +
              '<div><label for="' + ROOT_ID + '-current">' + esc(T.current) + '</label><input id="' + ROOT_ID + '-current" class="mb-current" type="text" inputmode="decimal" autocomplete="off" placeholder="18"><div class="mb-hint">' + esc(T.current_hint) + '</div></div>' +
              '<div><label for="' + ROOT_ID + '-meals">' + esc(T.meals) + '</label><select id="' + ROOT_ID + '-meals" class="mb-meals"><option value="2">2</option><option value="3">3</option><option value="4" selected>4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select><div class="mb-hint">' + esc(T.meals_hint) + '</div></div>' +
            '</div>' +
            '<div class="mb-child-fields" hidden>' +
              '<div class="mb-grid" style="margin-top:16px">' +
                '<div><label for="' + ROOT_ID + '-age">' + esc(T.age) + '</label><input id="' + ROOT_ID + '-age" class="mb-age" type="text" inputmode="numeric" autocomplete="off" value="8"><div class="mb-hint">' + esc(T.age_hint) + '</div></div>' +
                '<div><label for="' + ROOT_ID + '-energy">' + esc(T.energy) + ' (' + esc(T.energy_unit) + ')</label><input id="' + ROOT_ID + '-energy" class="mb-energy" type="text" inputmode="decimal" autocomplete="off" value="1600"><div class="mb-hint">' + esc(T.energy_hint) + '</div></div>' +
              '</div>' +
            '</div>' +
            '<div class="mb-profile-note">' + esc(T.adult_basis) + '</div>' +
            '<div class="mb-formula"><strong>' + esc(T.basis) + ':</strong><br><code>' + esc(T.formula_adult) + '<br>' + esc(T.formula_child) + '</code></div>' +
          '</div>' +
          '<div class="mb-actions">' +
            '<button type="button" class="mb-primary">' + esc(T.calc) + '</button>' +
            '<button type="button" class="mb-secondary">' + esc(T.reset) + '</button>' +
          '</div>' +
          '<div class="mb-error" role="alert" aria-live="assertive" tabindex="-1"></div>' +
          '<section class="mb-result" hidden aria-live="polite">' +
            '<div class="mb-result-head"><div><div class="mb-kicker">' + esc(T.result) + '</div><p class="mb-total"></p></div><div class="mb-badge"></div></div>' +
            '<p class="mb-summary"></p>' +
            '<div class="mb-stats">' +
              '<div class="mb-stat"><span>' + esc(T.target) + '</span><strong class="mb-target-repeat"></strong></div>' +
              '<div class="mb-stat"><span>' + esc(T.permeal) + '</span><strong class="mb-permeal"></strong></div>' +
              '<div class="mb-stat"><span>' + esc(T.basis) + '</span><strong class="mb-basis" style="font-size:13px;line-height:1.45"></strong></div>' +
            '</div>' +
            '<div class="mb-current-block" hidden>' +
              '<div class="mb-stats">' +
                '<div class="mb-stat"><span>' + esc(T.current_label) + '</span><strong class="mb-current-value"></strong></div>' +
                '<div class="mb-stat"><span>' + esc(T.difference) + '</span><strong class="mb-difference"></strong></div>' +
                '<div class="mb-stat"><span>' + esc(T.fulfil) + '</span><strong class="mb-fulfil"></strong></div>' +
              '</div>' +
            '</div>' +
            '<div class="mb-meter-block" hidden><div class="mb-section-intro">' + esc(T.fulfil) + '</div><div class="mb-meter" aria-hidden="true"><span class="mb-marker"></span></div><div class="mb-meter-labels" aria-hidden="true"><span>0 %</span><span>50 %</span><span>100 %</span><span>125 %+</span></div></div>' +
            '<div class="mb-info mb-status"></div>' +
            '<div class="mb-info">' + esc(T.gradual) + '</div>' +
            '<p class="mb-privacy">' + esc(T.privacy) + '</p>' +
          '</section>' +
        '</div>' +
      '</div>';

    root.querySelector('.mb-profile').addEventListener('change', function () { toggleProfile(root); });
    root.querySelector('.mb-primary').addEventListener('click', function () { calculate(root); });
    root.querySelector('.mb-secondary').addEventListener('click', function () { reset(root); });

  }

  function init() {
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    injectStyles();
    build(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
