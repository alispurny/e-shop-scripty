/**
 * MyBears — zjednotená grafická verzia 2.0 (SK)
 * Vizuálny systém vychádza z MyBears Product Guide v1.8.
 * Funkčná logika pôvodného nástroja zostáva zachovaná.
 */
/**
 * MyBears – Interaktivní porovnání produktov
 * Version: 2.0.0-sk
 * Product catalogue verified: 2026-08-01
 *
 * Mount point:
 *   <div id="mybears-product-comparison" data-mybears-product-comparison></div>
 *
 * Optional configuration before loading:
 * window.MBPC_CONFIG = {
 *   siteOrigin: null,
 *   maxProducts: 4,
 *   enableLiveProductData: true,
 *   enableAddToCart: true,
 *   enableShareLink: true,
 *   initialProducts: [],
 *   debug: false
 * };
 *
 * No external dependencies. No cookies. No localStorage.
 */
(function () {
  'use strict';

  var MYBEARS_UNIFIED_DESIGN_CSS = String.raw`
/* MyBears unified design layer — based on Product Guide v1.8 */
.mbpc__shell {
  --green:#2dc26b !important; --green-dark:#198d4b !important; --green-soft:#f4f8f4 !important;
  --mb-green:#2dc26b !important; --mb-green-dark:#198d4b !important; --mb-green-soft:#f4f8f4 !important;
  --primary:#2dc26b !important; --ink:#20221f !important; --text:#20221f !important; --mb-text:#20221f !important;
  --muted:#626760 !important; --mb-muted:#626760 !important; --line:#e5e3dc !important; --mb-border:#e5e3dc !important;
  --soft:#faf7ef !important; --mb-green-pale:#f4f8f4 !important; --yellow:#DBC442 !important; --mb-yellow:#DBC442 !important;
  --yellow-soft:#fff8df !important; --mb-yellow-soft:#fff8df !important; --danger:#a63a36 !important; --mb-danger:#a63a36 !important;
  position:relative; max-width:1120px !important; margin:24px auto 40px !important; overflow:hidden;
  border:1px solid #e5e3dc !important; border-radius:18px !important; background:#fff !important;
  box-shadow:0 12px 32px rgba(27,35,29,.07) !important; color:#20221f; font-family:Arial,Helvetica,sans-serif; line-height:1.55;
}
.mbpc__shell::before { content:""; position:absolute; z-index:5; top:0; left:0; right:0; height:4px; background:#DBC442; }
.mbpc__shell *, .mbpc__shell *::before, .mbpc__shell *::after { box-sizing:border-box; }
.mbpc__hero { padding:34px 38px 28px !important; border-bottom:1px solid #e5e3dc !important; background:#faf7ef !important; }
.mbpc__body { padding:30px 38px 36px !important; }
.mbpc__title, .mbpc__section-title, .mbpc__card-title, .mbpc__panel-head h2, .mbpc__panel-head h3, .mbpc__ingredient-title { color:#2dc26b !important; font-weight:700 !important; letter-spacing:-.01em; }
.mbpc__title { margin:0 0 10px !important; font-size:clamp(25px,3.2vw,30px) !important; line-height:1.16 !important; }
.mbpc__lead { max-width:820px; color:#454a45 !important; font-size:16px !important; line-height:1.58 !important; }
.mbpc__privacy, .mbpc__meta, .mbpc__section-intro, .mbpc__section-note, .mbpc__section-help, .mbpc__description, .mbpc__footnotes, .mbpc__note { color:#626760 !important; }
.mbpc__button, .mbpc__btn { min-height:46px !important; padding:11px 20px !important; border:2px solid transparent !important; border-radius:8px !important; font-weight:700 !important; text-decoration:none !important; transition:background .15s ease,border-color .15s ease,transform .15s ease; }
.mbpc__button:hover, .mbpc__btn:hover { transform:translateY(-1px); }
.mbpc__button:focus-visible, .mbpc__btn:focus-visible, .mbpc__shell a:focus-visible, .mbpc__shell input:focus-visible, .mbpc__shell select:focus-visible { outline:3px solid rgba(219,196,66,.38) !important; outline-offset:2px !important; }
.mbpc__button--primary, .mbpc__btn--primary { color:#fff !important; background:#2dc26b !important; border-color:#2dc26b !important; }
.mbpc__button--primary:hover, .mbpc__btn--primary:hover { background:#198d4b !important; border-color:#198d4b !important; }
.mbpc__button--secondary, .mbpc__btn--secondary { color:#198d4b !important; background:#fff !important; border-color:#2dc26b !important; }
.mbpc__button--ghost { color:#5e625e !important; background:#fff !important; border-color:#d7d8d4 !important; }
.mbpc__input, .mbpc__select { min-height:48px !important; border:1px solid #d4d6d1 !important; border-radius:8px !important; background:#fff !important; color:#20221f !important; }
.mbpc__input:focus, .mbpc__select:focus { outline:3px solid rgba(219,196,66,.30) !important; border-color:#198d4b !important; }
.mbpc__search-panel, .mbpc__filters, .mbpc__profile, .mbpc__panel, .mbpc__catalog-head { border-color:#e5e3dc !important; border-radius:14px !important; background:#faf7ef !important; box-shadow:none !important; }
.mbpc__card, .mbpc__analysis-card, .mbpc__preset, .mbpc__series-btn, .mbpc__tray-item, .mbpc__selected { border:1px solid #e5e3dc !important; border-radius:14px !important; background:#fff !important; box-shadow:0 4px 14px rgba(31,34,31,.04) !important; }
.mbpc__card:hover, .mbpc__preset:hover, .mbpc__series-btn:hover { border-color:#b8d8c2 !important; box-shadow:0 7px 20px rgba(31,34,31,.06) !important; }
.mbpc__card.is-selected, .mbpc__preset.is-active, .mbpc__topic[aria-pressed="true"] { border-color:#198d4b !important; box-shadow:0 0 0 3px rgba(45,194,107,.075) !important; }
.mbpc__tag, .mbpc__chip, .mbpc__hero-chip { border:1px solid #e5dfd1 !important; background:#faf7ef !important; color:#5f5a4e !important; }
.mbpc__notice, .mbpc__insight, .mbpc__discount-note { border:1px solid #eadfc8 !important; border-left:4px solid #DBC442 !important; border-radius:12px !important; background:#faf7ef !important; color:#4f4b43 !important; }
.mbpc__table-wrap { overflow-x:auto; border:1px solid #e5e3dc !important; border-radius:12px !important; }
.mbpc__table { width:100%; border-collapse:collapse; background:#fff; }
.mbpc__table thead th { border-bottom:2px solid #DBC442 !important; background:#20231f !important; color:#fff !important; }
.mbpc__table tbody tr:nth-child(even) { background:#f4f8f4 !important; }
.mbpc__difference { background:#fff8df !important; }
.mbpc__price, .mbpc__product-price, .mbpc__selected-price, .mbpc__total-row--main strong { color:#198d4b !important; }
.mbpc__empty, .mbpc__error { border:1px solid #e5e3dc !important; border-radius:14px !important; background:#faf7ef !important; }
@media(max-width:760px) {
  .mbpc__shell { margin:18px auto 30px !important; border-radius:15px !important; }
  .mbpc__hero { padding:28px 20px 22px !important; }
  .mbpc__body { padding:24px 20px 28px !important; }
  .mbpc__button, .mbpc__btn { max-width:100%; }
}
@media(prefers-reduced-motion:reduce) {
  .mbpc__shell *, .mbpc__shell *::before, .mbpc__shell *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
`;


  const VERSION = '2.0.0-sk';
  const DATA_VERIFIED_AT = '2026-08-01';
  const ROOT_SELECTOR = '[data-mybears-product-comparison], #mybears-product-comparison';
  const STYLE_ID = 'mbpc-styles-v1';
  const PRODUCTS = [{"id":"sleep-gummies","name":"Gumené medvedíky Kvalitný spánok","url":"/p/gumovi-medvidci-kvalitni-spanek","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"sleep":100,"calm":35},"priority":95,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"lesné ovocie","package":"60 gumených medvedíkov","dose":"1–2 medvedíky približne 60 minút pred spaním","supply":"30–60 dní","summary":"Bezcukrové vegánske gummies na večernú rutinu bez melatonínu.","keyIngredients":["griffonie 25:1 (zdroj 5-HTP)","medovka 10:1","harmanček 5:1","zinok","vitamín B6"],"warnings":["Nekombinujte bez konzultácie s liekmi alebo doplnkami ovplyvňujúcimi serotonín.","Pri užívaní sedatív alebo počas liečby sa poraďte s lekárom alebo lekárnikom."],"facts":["bez melatonínu","večerné užívanie"],"category":"Gummies","goalLabels":["spánok a večerná rutina","pokoj a psychická pohoda"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 medvedíky","dailyAmounts":{"griffonia":40.0,"zinc":10.0,"lemon_balm":30.0,"chamomile":30.0,"b6":0.7},"compositionWarnings":["Pri užívaní antidepresív, liekov ovplyvňujúcich serotonín alebo sedatív konzultujte kombináciu s lekárom alebo lekárnikom."],"detailTags":["bez cukru","vegan"]},{"id":"skin-30-gummies","name":"Gumené medvedíky Krásna a zdravá pleť 30+","url":"/p/gumovi-medvidci-krasna-a-zdrava-plet-30","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"mature_skin":100,"beauty":68,"daily":12},"priority":80,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"lesné ovocie","package":"60 gumených medvedíkov","dose":"1–2 medvedíky denne","supply":"30–60 dní","summary":"Antioxidačne zamerané gummies na starostlivosť o pleť po tridsiatke.","keyIngredients":["extrakt z borovicovej kôry 30:1","extrakt z hroznových jadierok 20:1","koenzým Q10","vitamín C","selén","vitamín B5"],"warnings":[],"facts":["zameranie na pleť 30+","antioxidačné zložky"],"category":"Gummies","goalLabels":["starostlivosť o pleť 30+","vlasy, pokožka a nechty","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 medvedíky","dailyAmounts":{"pine_bark":1500.0,"grape_seed":1300.0,"vitamin_c":80.0,"coq10":10.0,"b5":6.0,"selenium":55.0,"vitamin_d":10.0},"compositionWarnings":[],"detailTags":["vegan"]},{"id":"hsn-gummies","name":"Gumené medvedíky Zdravé vlasy, pokožka a nechty","url":"/p/gumovi-medvidci-zdrave-vlasy-kuze-a-nehty","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"beauty":100,"mature_skin":45,"daily":18},"priority":92,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"jahoda","package":"60 gumených medvedíkov","dose":"1–2 medvedíky denne","supply":"30–60 dní","summary":"Komplex vitamínov a minerálov zameraný na vlasy, pokožku a nechty.","keyIngredients":["biotín","zinok","selén","vitamíny C a E","vitamín A","vitamín D3","vitamín B6"],"warnings":[],"facts":["komplex pre vlasy, pokožku a nechty"],"category":"Gummies","goalLabels":["vlasy, pokožka a nechty","starostlivosť o pleť 30+","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 medvedíky","dailyAmounts":{"vitamin_c":80.0,"zinc":10.0,"selenium":55.0,"vitamin_e":12.0,"vitamin_d":5.0,"vitamin_a":800.0,"b6":1.4,"biotin":150.0},"compositionWarnings":[],"detailTags":["vegan"]},{"id":"kids-omega-multi","name":"Gumené medvedíky Omega 3 & Multivitamín pre deti","url":"/p/gumovi-medvidci-omega-3-multivitamin-pro-deti","kind":"single","audiences":["child"],"forms":["gummies"],"goals":{"child_daily":100,"immunity":56,"daily":55},"priority":100,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"pomaranč","package":"30 gumených medvedíkov","dose":"1–2 medvedíky denne pre deti od 3 rokov","supply":"15–30 dní","summary":"Detské multivitamínové gummies s rastlinným omega-3 z ľanového oleja.","keyIngredients":["omega-3 z ľanového oleja","vitamíny A, C, D3 a E","vitamíny B3, B5, B6 a B12"],"warnings":["Určené pre deti od 3 rokov.","Obsahuje želatínu, preto nie je vhodný pre vegánov ani vegetariánov.","Rastlinné omega-3 nie je zdrojom EPA a DHA ako rybí olej."],"facts":["pre deti od 3 rokov","rastlinný zdroj omega-3"],"category":"Gummies","goalLabels":["vitamíny a omega-3 pre dieťa","imunita","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["deti od 3 rokov"],"components":[],"defaultDoseLabel":"1 medvedík","dailyAmounts":{"omega3_plant":100.0,"vitamin_c":60.0,"niacin":8.0,"vitamin_e":6.0,"b5":6.0,"b12":2.5,"b6":1.4,"vitamin_a":400.0,"vitamin_d":2.5},"compositionWarnings":["Pri dieťati vždy rešpektujte dávkovanie podľa veku a ďalšie doplnky konzultujte s pediatrom."],"detailTags":["pre deti","bez cukru"]},{"id":"active-brain-gummies","name":"Gumené medvedíky Aktívny mozog","url":"/p/gumovi-medvidci-aktivni-mozek","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"focus":100,"energy":62,"daily":18},"priority":88,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"krvavý pomaranč","package":"60 gumených medvedíkov","dose":"1–2 medvedíky denne, ideálne ráno","supply":"30–60 dní","summary":"Ranné gummies zamerané na sústredenie a mentálny výkon.","keyIngredients":["Lion’s Mane 5:1","Cordyceps 1:1","ženšen 4:1","zelený čaj 10:1","vitamíny B1, B5, B6 a B12","železo"],"warnings":["Obsahuje extrakt zo zeleného čaju; pri citlivosti na stimulačné látky zvoľte iný produkt."],"facts":["odporúčané ranné užívanie","obsahuje zelený čaj"],"category":"Gummies","goalLabels":["sústredenie a mentálny výkon","energia a aktívny režim","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 medvedíky","dailyAmounts":{"b1":1.1,"b5":5.0,"b6":1.4,"b12":2.5,"iron":6.0,"lions_mane":250.0,"cordyceps":100.0,"ginseng":80.0,"green_tea":50.0},"compositionWarnings":["Obsahuje extrakt zo zeleného čaju a ženšen; pri citlivosti na stimulanty alebo užívaní liekov skontrolujte vhodnosť kombinácie."],"detailTags":["vegan"]},{"id":"preworkout-gummies","name":"Gumené medvedíky Nakopávač – pre-workout","url":"/p/gumovi-medvidci-nakopavac-preworkout","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"sport":100,"energy":78},"priority":89,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"čučoriedka","package":"60 gumených medvedíkov","dose":"1–3 medvedíky 20–30 minút pred fyzickou aktivitou","supply":"20–60 dávok","summary":"Pre-workout gummies na užitie pred fyzickou aktivitou.","keyIngredients":["L-citrulin","taurin","kofeín zo zeleného čaju","vitamín B6","niacin"],"warnings":["Obsahuje kofeín; nie je vhodné pre deti, tehotné a dojčiace ženy ani osoby citlivé na kofeín.","Obsahuje želatínu, preto nie je vegánsky."],"facts":["3 gummies obsahujú 15 mg kofeínu","užitie pred aktivitou"],"category":"Gummies","goalLabels":["šport a fyzická výkonnosť","energia a aktívny režim"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"3 medvedíky","dailyAmounts":{"l_citrulline":600.0,"taurine":300.0,"green_tea":60.0,"caffeine":15.0,"niacin":2.25,"b6":1.0499999999999998},"compositionWarnings":["Obsahuje kofeín. Započítajte aj kávu, energetické nápoje, čaj a ďalšie zdroje kofeínu."],"detailTags":["obsahuje kofeín"]},{"id":"acv-gummies","name":"Gumené medvedíky Jablčný ocot + chróm + vitamín C","url":"/p/gumovi-medvidci-na-hubnuti-traveni-detox","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"digestion":82,"daily":25,"energy":12},"priority":70,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"jablko","package":"60 gumených medvedíkov","dose":"1 medvedík denne","supply":"60 dní","summary":"Gummies s jablčným octom, chrómom a vitamínom C na každodennú rutinu.","keyIngredients":["500 mg prášku z jablčného octu","vitamín C","chróm"],"warnings":["Sprievodca nepripisuje produktu účinok na chudnutie; odporúčanie vychádza iba zo zloženia a preferovanej oblasti."],"facts":["1 medvedík denne"],"category":"Gummies","goalLabels":["trávenie a mikroflóra","každodenný základ","energia a aktívny režim"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"1 medvedík","dailyAmounts":{"apple_cider_vinegar":500.0,"vitamin_c":20.0,"chromium":6.0},"compositionWarnings":["Pri diabete alebo užívaní liekov ovplyvňujúcich glykémiu konzultujte kombináciu s lekárom."],"detailTags":["vegan"]},{"id":"relax-gummies","name":"Gumené medvedíky Pohodička & Relax","url":"/p/gumovi-medvidci-pohodicka-relax","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"calm":100,"sleep":30,"daily":10},"priority":91,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"čierne ríbezle a lesné ovocie","package":"60 gumených medvedíkov","dose":"1–2 medvedíky denne","supply":"30–60 dní","summary":"Gummies na pokojnejšiu dennú alebo večernú rutinu.","keyIngredients":["medovka","L-theanin","harmanček","vitamín E","vitamín B6"],"warnings":[],"facts":["bez kofeínu"],"category":"Gummies","goalLabels":["pokoj a psychická pohoda","spánok a večerná rutina","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 medvedíky","dailyAmounts":{"lemon_balm":45.0,"l_theanine":30.0,"vitamin_e":12.0,"chamomile":10.0,"b6":1.4},"compositionWarnings":["Pri súčasnom užívaní sedatív alebo liekov na spánok konzultujte kombináciu s odborníkom."],"detailTags":["vegan"]},{"id":"mood-gummies","name":"Gumené medvedíky Dobrá náladička","url":"/p/gumovi-medvidci-dobra-naladicka","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"calm":88,"energy":28,"daily":15},"priority":84,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"pomaranč","package":"60 gumených medvedíkov","dose":"1–2 medvedíky denne","supply":"30–60 dní","summary":"Adaptogénne zamerané gummies s L-theanínom a vitamínmi skupiny B.","keyIngredients":["L-theanin","ashwagandha 10:1","rozchodnica ružová 6:1","vitamíny skupiny B"],"warnings":["Pri liečbe, v tehotenstve alebo počas dojčenia konzultujte užívanie adaptogénov s lekárom."],"facts":["adaptogénne rastlinné extrakty"],"category":"Gummies","goalLabels":["pokoj a psychická pohoda","energia a aktívny režim","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 medvedíky","dailyAmounts":{"l_theanine":88.0,"ashwagandha":100.0,"rhodiola":50.0,"niacin":8.0,"b6":0.86,"b2":0.74,"b1":0.6,"b12":0.6},"compositionWarnings":["Ašvagandu a rozchodnicu konzultujte pri ochorení štítnej žľazy, autoimunitnom ochorení, pečeňových ťažkostiach, v tehotenstve, počas dojčenia alebo pri užívaní liekov."],"detailTags":["vegan"]},{"id":"probiotic-gummies","name":"Gumené medvedíky Zdravá črevná mikroflóra – probiotiká","url":"/p/gumovi-medvidci-zdrava-strevni-mikroflora","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"digestion":100,"immunity":28,"daily":18},"priority":96,"vegan":false,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"jahoda","package":"60 gumených medvedíkov","dose":"1 medvedík denne","supply":"60 dní","summary":"Bezcukrové probiotické gummies s jednou miliardou kultúr v dennej dávke.","keyIngredients":["Bacillus coagulans MTCC 5856","1 miliarda CFU v dennej dávke","vitamín C"],"warnings":["Obsahuje želatínu, preto nie je vegánsky."],"facts":["bez cukru","1 medvedík denne"],"category":"Gummies","goalLabels":["trávenie a mikroflóra","imunita","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"1 medvedík","dailyAmounts":{"bacillus_coagulans":1.0,"vitamin_c":40.0},"compositionWarnings":[],"detailTags":["probiotiká"]},{"id":"immunity-gummies","name":"Gumené medvedíky Silná imunita","url":"/p/gumovi-medvidci-silna-imunita","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"immunity":100,"daily":28},"priority":94,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"malina","package":"60 gumených medvedíkov","dose":"1–2 medvedíky denne","supply":"30–60 dní","summary":"Gummies s vitamínom C, zinkom, selénom a vitamínom B6.","keyIngredients":["vitamín C","zinok","selén","vitamín B6"],"warnings":[],"facts":["2 gummies obsahujú 160 mg vitamínu C"],"category":"Gummies","goalLabels":["imunita","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 medvedíky","dailyAmounts":{"vitamin_c":160.0,"zinc":4.0,"selenium":22.0,"b6":0.6},"compositionWarnings":[],"detailTags":["vegan"]},{"id":"multivitamin-gummies","name":"Gumené medvedíky Multivitamín","url":"/p/gumovi-medvidci-multivitamin","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"daily":100,"immunity":42,"energy":32,"beauty":20},"priority":86,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"jahoda","package":"60 gumených medvedíkov","dose":"1–2 medvedíky denne","supply":"30–60 dní","summary":"Multivitamínové gummies na jednoduchú každodennú rutinu.","keyIngredients":["vitamíny A, C, D3 a E","vitamíny B5, B6, B7, B9 a B12","jód","inositol","zinok v zložení"],"warnings":["Obsahuje želatínu, preto nie je vegánsky.","Pri ochorení štítnej žľazy alebo užívaní liekov ovplyvňujúcich jej funkciu konzultujte obsah jódu s lekárom alebo lekárnikom.","Pri kombinácii s ďalšími multivitamínmi skontrolujte celkový príjem vitamínov A a D."],"facts":["9 vitamínov a jód","1–2 medvedíky denne"],"category":"Gummies","goalLabels":["každodenný základ","imunita","energia a aktívny režim","vlasy, pokožka a nechty"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 medvedíky","dailyAmounts":{"vitamin_c":80.0,"vitamin_e":13.4,"b12":4.0,"b5":3.0,"b6":1.0,"vitamin_a":600.0,"folate":240.0,"biotin":60.0,"iodine":40.0,"inositol":20.0,"vitamin_d":10.0},"compositionWarnings":[],"detailTags":["vegan"]},{"id":"biotin-gummies","name":"Gumené medvedíky Biotin 5 mg","url":"/p/gumovi-medvidci-biotin","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"beauty":100,"mature_skin":38},"priority":89,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"vodný melón","package":"60 gumených medvedíkov","dose":"1 medvedík denne","supply":"60 dní","summary":"Vysokodávkový biotín v jednej dennej gummy.","keyIngredients":["biotín 5 mg (5 000 µg)"],"warnings":["Vysoké dávky biotínu môžu skresliť niektoré laboratórne vyšetrenia; pred odberom informujte zdravotníkov."],"facts":["1 medvedík denne","5 000 µg biotínu"],"category":"Gummies","goalLabels":["vlasy, pokožka a nechty","starostlivosť o pleť 30+"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"1 medvedík","dailyAmounts":{"biotin":5000.0},"compositionWarnings":["Vysoké dávky biotínu môžu skresliť niektoré laboratórne testy. Pred odberom informujte lekára a laboratórium."],"detailTags":["5 mg biotínu","obsahuje cukor"]},{"id":"magnesium-bisglycinate","name":"Horčík chelát 100 mg (bisglycinát) + B6 P5P","url":"/p/horcik-chelat-bisglycinat-vitamin-b6-p5p-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"calm":70,"sleep":58,"daily":48,"sport":38,"energy":30},"priority":99,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"bez príchute","package":"90 vegánskych kapsúl","dose":"2–3 kapsuly denne","supply":"30–45 dní","summary":"Chelátová forma horčíka s aktívnou formou vitamínu B6 P5P.","keyIngredients":["100 mg horčíku v 1 kapsule","1,4 mg vitamínu B6 P5P v 1 kapsule"],"warnings":["Doplnky s horčíkom môžu ovplyvniť vstrebávanie niektorých liekov; dodržujte odporúčaný odstup podľa lekára alebo lekárnika."],"facts":["bisglycinát horečnatý","aktívny vitamín B6 P5P"],"category":"Kapsuly a softgély","goalLabels":["pokoj a psychická pohoda","spánok a večerná rutina","každodenný základ","šport a fyzická výkonnosť","energia a aktívny režim"],"formLabels":["kapsuly"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 kapsuly","dailyAmounts":{"magnesium":200.0,"b6":2.8,"acacia_fiber":190.0},"compositionWarnings":[],"detailTags":["vegan"]},{"id":"iron-c-b12-b9","name":"Vitamín C + Železo + B12 + B9","url":"/p/vitamin-c-zelezo-b12-b9-kyselina-listova-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"energy":82,"daily":48,"immunity":32},"priority":72,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"bez príchute","package":"60 vegánskych kapsúl","dose":"1 kapsula denne","supply":"60 dní","summary":"Komplex železa, vitamínu C, B12 a kyseliny listovej v jednej kapsule.","keyIngredients":["vitamín C z aceroly 100 mg","železo AB Fortis® 20 mg","vitamín B12 50 µg (metylkobalamín)","folát 200 µg (L-metylfolát vápenatý)"],"warnings":["Železo nie je vhodné užívať preventívne bez znalosti potreby; pri liečbe alebo zdravotných ťažkostiach sa poraďte s lekárom."],"facts":["1 kapsula denne","železo AB Fortis®"],"category":"Kapsuly a softgély","goalLabels":["energia a aktívny režim","každodenný základ","imunita"],"formLabels":["kapsuly"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"1 kapsula","dailyAmounts":{"vitamin_c":100.0,"iron":20.0,"b12":50.0,"folate":200.0,"acacia_fiber":130.0},"compositionWarnings":["Železo neužívajte dlhodobo bez znalosti potreby alebo laboratórnych hodnôt. Pri liečbe a v tehotenstve konzultujte dávku s lekárom."],"detailTags":["vegan"]},{"id":"zinc-bisglycinate","name":"Zinok chelát 25 mg (bisglycinát)","url":"/p/zinek-chelat-15-mg-bisglycinat-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"immunity":82,"beauty":55,"daily":40},"priority":90,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"bez príchute","package":"60 vegánskych kapsúl","dose":"1 kapsula denne","supply":"60 dní","summary":"Chelátová forma zinku v dennej dávke 25 mg.","keyIngredients":["zinok bisglycinát 25 mg"],"warnings":["Dlhodobé užívanie vysokej dávky zinku konzultujte s odborníkom, najmä pre rovnováhu medi."],"facts":["1 kapsula denne","chelátová forma"],"category":"Kapsuly a softgély","goalLabels":["imunita","vlasy, pokožka a nechty","každodenný základ"],"formLabels":["kapsuly"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"1 kapsula","dailyAmounts":{"zinc":25.0,"acacia_fiber":240.0},"compositionWarnings":["Pri kombinovaní s ďalšími zdrojmi zinku alebo pri dlhodobom užívaní skontrolujte celkový príjem s odborníkom."],"detailTags":["vegan","25 mg zinku"]},{"id":"vitamin-d3-k2","name":"Vitamín D3 2000 IU + K2 MK-7","url":"/p/vitamin-d3-2000-iu-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"daily":78,"immunity":75,"joints":18},"priority":91,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"bez príchute","package":"60 vegánskych kapsúl","dose":"1 kapsula denne","supply":"60 dní","summary":"Kombinácia vitamínu D3 2000 IU a vitamínu K2 vo forme MK-7.","keyIngredients":["vitamín D3 50 µg / 2 000 IU","vitamín K2 MK-7"],"warnings":["Vitamín K môže ovplyvniť liečbu warfarínom a ďalšími antikoagulanciami; užívanie konzultujte s lekárom."],"facts":["D3 + K2 MK-7","vegánska kapsula"],"category":"Kapsuly a softgély","goalLabels":["každodenný základ","imunita","kĺby a pohybový aparát"],"formLabels":["kapsuly"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"1 kapsula","dailyAmounts":{"vitamin_d":50.0,"vitamin_k2":75.0,"acacia_fiber":260.0},"compositionWarnings":["Vitamín K môže interagovať s warfarínom a ďalšími antagonistami vitamínu K. Zmenu príjmu konzultujte s ošetrujúcim lekárom."],"detailTags":["vegan","2000 IU D3"]},{"id":"green-mix","name":"Zelený Mix BIO 450 mg","url":"/p/zeleny-mix-450-mg-bio","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"daily":65,"energy":45,"digestion":28},"priority":75,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"bez príchute","package":"60 vegánskych kapsúl","dose":"2–3 kapsuly denne","supply":"20–30 dní","summary":"BIO zmes štyroch zelených superpotravín v kapsulách.","keyIngredients":["spirulina 25 %","chlorella 25 %","zelený jačmeň 25 %","moringa 25 %","450 mg zmesi v kapsule"],"warnings":[],"facts":["BIO zmes","4 zelené zložky"],"category":"Kapsuly a softgély","goalLabels":["každodenný základ","energia a aktívny režim","trávenie a mikroflóra"],"formLabels":["kapsuly"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 kapsuly","dailyAmounts":{"spirulina":225.0,"chlorella":225.0,"green_barley":225.0,"moringa":225.0,"acacia_fiber":300.0},"compositionWarnings":[],"detailTags":["BIO","vegan"]},{"id":"omega3-softgels","name":"Omega 3 – 330 mg EPA + 220 mg DHA","url":"/p/omega-3-mastne-kyseliny-300-mg-epa-220-mg-dha-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["softgels"],"goals":{"daily":84,"focus":55,"immunity":20},"priority":93,"vegan":false,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"bez príchute","package":"60 softgélových kapsúl","dose":"1–2 kapsuly denne s jedlom","supply":"30–60 dní","summary":"Koncentrovaný rybí olej s EPA a DHA v softgélovej kapsule.","keyIngredients":["omega-3 celkovo 550 mg","EPA 330 mg","DHA 220 mg"],"warnings":["Pri užívaní liekov na zrážanlivosť krvi alebo pred zákrokom konzultujte omega-3 s lekárom."],"facts":["rybí olej","EPA + DHA"],"category":"Kapsuly a softgély","goalLabels":["každodenný základ","sústredenie a mentálny výkon","imunita"],"formLabels":["softgely"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 softgély","dailyAmounts":{"fish_oil":2000.0,"omega3":1100.0,"epa":660.0,"dha":440.0},"compositionWarnings":["Pri liečbe ovplyvňujúcej zrážanlivosť krvi, pred operáciou alebo pri poruche zrážanlivosti konzultujte omega-3 s lekárom."],"detailTags":["rybí olej"]},{"id":"magnesium-malate-potassium","name":"Horčík malát 170 mg + draslík 200 mg","url":"/p/horcik-malat-draslik","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"energy":94,"sport":76,"daily":44},"priority":97,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"bez príchute","package":"90 vegánskych kapsúl","dose":"2 kapsuly denne","supply":"45 dní","summary":"Kombinácia horčíka vo forme malátu a draslíka na dennú a športovú rutinu.","keyIngredients":["horčík 170 mg v dennej dávke","draslík 200 mg v dennej dávke"],"warnings":["Pri ochorení obličiek alebo užívaní liekov ovplyvňujúcich draslík konzultujte užívanie s lekárom."],"facts":["2 kapsuly denne","45 denných dávok"],"category":"Kapsuly a softgély","goalLabels":["energia a aktívny režim","šport a fyzická výkonnosť","každodenný základ"],"formLabels":["kapsuly"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"2 kapsuly","dailyAmounts":{"magnesium":170.0,"potassium":200.0},"compositionWarnings":["Pri ochorení obličiek alebo pri užívaní liekov zvyšujúcich draslík konzultujte kombináciu s lekárom."],"detailTags":["vegan"]},{"id":"joint-collagen","name":"Kolagén na kĺby","url":"/p/kolagen-na-klouby","kind":"single","audiences":["adult"],"forms":["powder"],"goals":{"joints":100,"sport":45,"daily":12},"priority":100,"vegan":false,"sugarFree":null,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"broskyňa","package":"423 g (30 dávok)","dose":"14,10 g (1 kopcovitá odmerka) denne","supply":"30 dní","summary":"Komplexná prášková zmes s hovädzím kolagénom na kĺbovú rutinu.","keyIngredients":["hovädzie kolagénové peptidy 8 000 mg","glukozamín 1 500 mg","MSM 1 500 mg","chondroitín 1 000 mg","kyselina hyaluronová 100 mg","boswellia 300 mg","vitamíny C, D3 a K2","kurkuma a BioPerine®"],"warnings":["Pri užívaní antikoagulancií, alergii na kôrovce, v tehotenstve, počas dojčenia alebo pred zákrokom konzultujte zloženie s lekárom."],"facts":["30 dávok","hovädzí kolagén"],"category":"Kolagény","goalLabels":["kĺby a pohybový aparát","šport a fyzická výkonnosť","každodenný základ"],"formLabels":["prášok"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"1 denná dávka","dailyAmounts":{"bovine_collagen":8000.0,"glucosamine":1500.0,"msm":1500.0,"chondroitin":1000.0,"acerola_extract":589.0,"vitamin_c":100.0,"boswellia":300.0,"boswellic_acids":210.0,"hyaluronic_acid":100.0,"turmeric":50.0,"vitamin_k2":75.0,"vitamin_d":50.0,"manganese":1.0,"copper":500.0,"bioperine":1.06,"piperine":1.0},"compositionWarnings":["Obsahuje vitamín K2, glukozamín, chondroitín, kurkumu a piperín. Pri užívaní liekov, najmä na zrážanlivosť krvi, konzultujte kombináciu s lekárom."],"detailTags":["hovädzí kolagén"]},{"id":"beauty-collagen","name":"Beauty kolagén","url":"/p/beauty-kolagen","kind":"single","audiences":["adult"],"forms":["powder"],"goals":{"beauty":100,"mature_skin":82,"daily":20},"priority":99,"vegan":false,"sugarFree":null,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"mango","package":"265 g (30 dávok)","dose":"8,84 g (3/4 odmerky) denne","supply":"30 dní","summary":"Práškový rybí kolagén s beauty komplexom a lyofilizovaným mangom.","keyIngredients":["rybie kolagénové peptidy 5 000 mg","vitamín C z aceroly","keratín","MSM","kyselina hyaluronová","koenzým Q10","zinok, selén a biotín","lyofilizované mango"],"warnings":["Nevhodné pri alergii na ryby."],"facts":["30 dávok","rybí kolagén"],"category":"Kolagény","goalLabels":["vlasy, pokožka a nechty","starostlivosť o pleť 30+","každodenný základ"],"formLabels":["prášok"],"audienceLabels":["dospelí"],"components":[],"defaultDoseLabel":"1 denná dávka","dailyAmounts":{"fish_collagen":5000.0,"msm":1000.0,"acerola_extract":589.0,"vitamin_c":100.0,"keratin":500.0,"hyaluronic_acid":200.0,"coq10":50.0,"zinc":10.0,"vitamin_e":12.0,"selenium":30.0,"biotin":150.0},"compositionWarnings":["Obsahuje rybí kolagén. Pri alergii na ryby výrobok neužívajte."],"detailTags":["rybí kolagén"]},{"id":"bundle-hsn-gummies","name":"Výhodný balíček Zdravé vlasy, nechty a pokožka – gummies","url":"/p/vyhodny-balicek-zdrave-vlasy-nehty-a-pokozka-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["gummies"],"goals":{"beauty":100,"mature_skin":48},"priority":94,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Dvojica beauty gummies na komplexnú starostlivosť o vlasy, pokožku a nechty.","keyIngredients":["Gummies Zdravé vlasy, pokožka a nechty","Gummies Biotin 5 mg"],"warnings":["Vysoké dávky biotínu môžu ovplyvniť laboratórne testy."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["vlasy, pokožka a nechty","starostlivosť o pleť 30+"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":["hsn-gummies","biotin-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-digestion","name":"Výhodný balíček Trávenie & črevná mikroflóra","url":"/p/vyhodny-balicek-traveni-strevni-mikroflora-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["gummies"],"goals":{"digestion":100,"daily":22},"priority":90,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Kombinácia gummies s jablčným octom a probiotickými kultúrami.","keyIngredients":["Gummies Jablčný ocot + chróm + vitamín C","Probiotické gummies Zdravá črevná mikroflóra"],"warnings":["Probiotické gummies obsahujú želatínu; celý balíček preto nie je vegánsky."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["trávenie a mikroflóra","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["dospelí"],"components":["acv-gummies","probiotic-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-sleep","name":"Výhodný balíček Kvalitný spánok","url":"/p/vyhodny-balicek-kvalitni-spanek-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"sleep":100,"calm":72,"daily":25},"priority":100,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Večerná kombinácia horčíka a bezcukrových gummies bez melatonínu.","keyIngredients":["Horčík bisglycinát + B6 P5P","Bezcukrové gummies Kvalitný spánok"],"warnings":["Pri užívaní liekov ovplyvňujúcich serotonín alebo sedatív konzultujte gummies s odborníkom."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["spánok a večerná rutina","pokoj a psychická pohoda","každodenný základ"],"formLabels":["kapsuly","gummies"],"audienceLabels":["dospelí"],"components":["magnesium-bisglycinate","sleep-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-zinc-biotin","name":"Výhodný balíček Zinok + Biotin gummies","url":"/p/vyhodny-balicek-zdrave-vlasy-nehty-a-pokozka-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"beauty":100,"immunity":45},"priority":93,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Kombinácia zinku a vysokodávkového biotínu na beauty rutinu.","keyIngredients":["Zinok chelát 25 mg","Gummies Biotin 5 mg"],"warnings":["Vysoké dávky biotínu môžu ovplyvniť laboratórne testy.","Dlhodobé užívanie 25 mg zinku konzultujte s odborníkom."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["vlasy, pokožka a nechty","imunita"],"formLabels":["kapsuly","gummies"],"audienceLabels":["dospelí"],"components":["zinc-bisglycinate","biotin-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-good-mood","name":"Výhodný balíček Dobrá náladička","url":"/p/vyhodny-balicek-dobra-naladicka-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"calm":100,"sleep":42,"daily":25},"priority":91,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Kombinácia horčíka, adaptogénov a L-theanínu na pokojnejšiu rutinu.","keyIngredients":["Horčík bisglycinát + B6 P5P","Gummies Dobrá náladička"],"warnings":["Pri liečbe, v tehotenstve alebo počas dojčenia konzultujte adaptogény s lekárom."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["pokoj a psychická pohoda","spánok a večerná rutina","každodenný základ"],"formLabels":["kapsuly","gummies"],"audienceLabels":["dospelí"],"components":["magnesium-bisglycinate","mood-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-mental-2","name":"Výhodný balíček Mentálny výkon 2.0","url":"/p/vyhodny-balicek-uspesne-uceni-mentalni-vykon-pri-narocnem-povolani-2-0-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"focus":100,"sleep":72,"energy":68,"calm":45},"priority":96,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"kombinácia produktov","package":"3 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Trojproduktová denná a večerná rutina na sústredenie a regeneráciu.","keyIngredients":["Gummies Aktívny mozog","Bezcukrové gummies Kvalitný spánok","Horčík bisglycinát + B6 P5P"],"warnings":["Obsahuje zelený čaj.","Pri liečbe ovplyvňujúcej serotonín konzultujte večerné gummies s odborníkom."],"facts":["zvýhodnený balíček","3 produkty"],"category":"Balíčky","goalLabels":["sústredenie a mentálny výkon","spánok a večerná rutina","energia a aktívny režim","pokoj a psychická pohoda"],"formLabels":["kapsuly","gummies"],"audienceLabels":["dospelí"],"components":["active-brain-gummies","sleep-gummies","magnesium-bisglycinate"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-beauty-iron","name":"Výhodný balíček Krása – železo + biotín","url":"/p/vyhodny-balicek-krasa-veganske-kapsle-a-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"beauty":94,"energy":70,"daily":35},"priority":82,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Beauty balíček spájajúci biotín s komplexom obsahujúcim železo.","keyIngredients":["Vitamín C + Železo + B12 + B9","Gummies Biotin 5 mg"],"warnings":["Železo užívajte iba pri odôvodnenej potrebe.","Biotín môže ovplyvniť laboratórne testy."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["vlasy, pokožka a nechty","energia a aktívny režim","každodenný základ"],"formLabels":["kapsuly","gummies"],"audienceLabels":["dospelí"],"components":["iron-c-b12-b9","biotin-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-detox-energy","name":"Výhodný balíček Zelený reštart & energie","url":"/p/vyhodny-balicek-detox-energie-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules"],"goals":{"energy":85,"daily":72,"digestion":30},"priority":88,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Vegánska kapsulová kombinácia horčíka a zeleného BIO mixu.","keyIngredients":["Horčík bisglycinát + B6 P5P","Zelený Mix BIO"],"warnings":[],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["energia a aktívny režim","každodenný základ","trávenie a mikroflóra"],"formLabels":["kapsuly"],"audienceLabels":["dospelí"],"components":["magnesium-bisglycinate","green-mix"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-harmony","name":"Výhodný balíček Harmonie","url":"/p/vyhodny-balicek-harmonie-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules"],"goals":{"daily":82,"immunity":67,"calm":42},"priority":76,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Kombinácia horčíka a vitamínov D3 + K2 na každodennú rutinu.","keyIngredients":["Horčík bisglycinát + B6 P5P","Vitamín D3 + K2 MK-7"],"warnings":["Vitamín K môže ovplyvniť liečbu warfarínom."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["každodenný základ","imunita","pokoj a psychická pohoda"],"formLabels":["kapsuly"],"audienceLabels":["dospelí"],"components":["magnesium-bisglycinate","vitamin-d3-k2"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-energy","name":"Výhodný balíček Energie","url":"/p/vyhodny-balicek-energii-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules"],"goals":{"energy":88,"daily":65,"immunity":45},"priority":91,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Vegánska kapsulová kombinácia horčíka a zinku.","keyIngredients":["Horčík bisglycinát + B6 P5P","Zinok chelát 25 mg"],"warnings":["Dlhodobé užívanie 25 mg zinku konzultujte s odborníkom."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["energia a aktívny režim","každodenný základ","imunita"],"formLabels":["kapsuly"],"audienceLabels":["dospelí"],"components":["magnesium-bisglycinate","zinc-bisglycinate"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-performance","name":"Výhodný balíček Fyzická výkonnosť","url":"/p/vyhodny-balicek-fyzicka-vykonnost-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"sport":100,"energy":92},"priority":93,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Kombinácia horčíka a pre-workout gummies na športovú rutinu.","keyIngredients":["Horčík bisglycinát + B6 P5P","Gummies Nakopávač – pre-workout"],"warnings":["Obsahuje kofeín.","Pre-workout gummies obsahujú želatínu, preto celý balíček nie je vegánsky."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["šport a fyzická výkonnosť","energia a aktívny režim"],"formLabels":["kapsuly","gummies"],"audienceLabels":["dospelí"],"components":["magnesium-bisglycinate","preworkout-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-mental","name":"Výhodný balíček Úspešné učenie & mentálny výkon","url":"/p/vyhodny-balicek-uspesne-uceni-mentalni-vykon-pri-narocnem-povolani-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"focus":100,"calm":74,"energy":70},"priority":92,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"kombinácia produktov","package":"3 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Denná kombinácia na sústredenie doplnená relaxačnou rutinou.","keyIngredients":["Gummies Aktívny mozog","Gummies Pohodička & Relax","Horčík bisglycinát + B6 P5P"],"warnings":["Obsahuje zelený čaj."],"facts":["zvýhodnený balíček","3 produkty"],"category":"Balíčky","goalLabels":["sústredenie a mentálny výkon","pokoj a psychická pohoda","energia a aktívny režim"],"formLabels":["kapsuly","gummies"],"audienceLabels":["dospelí"],"components":["active-brain-gummies","relax-gummies","magnesium-bisglycinate"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-family-immunity","name":"Výhodný balíček Silná imunita pre celú rodinu","url":"/p/vyhodny-balicek-silna-imunita-pro-celou-rodinu","kind":"bundle","audiences":["family","adult","child"],"forms":["gummies"],"goals":{"immunity":100,"child_daily":68,"daily":40},"priority":96,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"2 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Rodinný balíček s oddelenými gummies pre dospelých a deti od 3 rokov.","keyIngredients":["Gummies Silná imunita pre dospelých","Gummies Omega 3 & Multivitamín pre deti"],"warnings":["Detský produkt je určený od 3 rokov.","Vegánsky status celého balíčka nie je jednoznačne potvrdený."],"facts":["zvýhodnený balíček","2 produkty"],"category":"Balíčky","goalLabels":["imunita","vitamíny a omega-3 pre dieťa","každodenný základ"],"formLabels":["gummies"],"audienceLabels":["rodina","dospelí","deti od 3 rokov"],"components":["immunity-gummies","kids-omega-multi"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-sport","name":"Výhodný balíček Šport","url":"/p/vyhodny-balicek-sport-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","softgels","gummies"],"goals":{"sport":100,"energy":86,"daily":42,"immunity":30},"priority":98,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"kombinácia produktov","package":"4 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Štvorproduktový športový balíček s horčíkom, zinkom, omega-3 a pre-workout gummies.","keyIngredients":["Horčík bisglycinát + B6 P5P","Zinok chelát 25 mg","Omega 3 EPA + DHA","Gummies Nakopávač – pre-workout"],"warnings":["Obsahuje kofeín a rybí olej; balíček nie je vegánsky.","Pri antikoagulačnej liečbe konzultujte omega-3 s lekárom."],"facts":["zvýhodnený balíček","4 produkty"],"category":"Balíčky","goalLabels":["šport a fyzická výkonnosť","energia a aktívny režim","každodenný základ","imunita"],"formLabels":["kapsuly","softgely","gummies"],"audienceLabels":["dospelí"],"components":["magnesium-bisglycinate","zinc-bisglycinate","omega3-softgels","preworkout-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-immunity-capsules","name":"Výhodný balíček Imunita – kapsuly","url":"/p/vyhodny-balicek-imunita-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules","softgels"],"goals":{"immunity":100,"daily":72},"priority":96,"vegan":false,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"4 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Komplexný kapsulový balíček na každodennú rutinu a podporu imunity.","keyIngredients":["Vitamín D3 + K2 MK-7","Zinok chelát 25 mg","Horčík bisglycinát + B6 P5P","Omega 3 EPA + DHA"],"warnings":["Obsahuje rybí olej, preto nie je vegánsky.","Vitamín K a omega-3 konzultujte pri liečbe ovplyvňujúcej zrážanlivosť krvi."],"facts":["zvýhodnený balíček","4 produkty"],"category":"Balíčky","goalLabels":["imunita","každodenný základ"],"formLabels":["kapsuly","softgely"],"audienceLabels":["dospelí"],"components":["vitamin-d3-k2","zinc-bisglycinate","magnesium-bisglycinate","omega3-softgels"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-vitality","name":"Výhodný balíček Vitalita","url":"/p/vyhodny-balicek-vitalita-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules","softgels"],"goals":{"daily":100,"energy":55,"immunity":62,"focus":35},"priority":92,"vegan":false,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"3 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Každodenná kombinácia horčíka, vitamínov D3/K2 a omega-3.","keyIngredients":["Horčík bisglycinát + B6 P5P","Vitamín D3 + K2 MK-7","Omega 3 EPA + DHA"],"warnings":["Obsahuje rybí olej, preto nie je vegánsky.","Pri antikoagulačnej liečbe konzultujte zloženie s lekárom."],"facts":["zvýhodnený balíček","3 produkty"],"category":"Balíčky","goalLabels":["každodenný základ","imunita","energia a aktívny režim","sústredenie a mentálny výkon"],"formLabels":["kapsuly","softgely"],"audienceLabels":["dospelí"],"components":["magnesium-bisglycinate","vitamin-d3-k2","omega3-softgels"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]},{"id":"bundle-immunity-mixed","name":"Výhodný balíček Imunita – kapsuly + gummies","url":"/p/vyhodny-balicek-imunita-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","softgels","gummies"],"goals":{"immunity":100,"daily":78},"priority":99,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinácia produktov","package":"4 produkty v balíčku","dose":"podľa dávkovania jednotlivých produktov","supply":"podľa jednotlivých balení","summary":"Rozšírený imunitný balíček kombinujúci kapsuly, softgély a gummies.","keyIngredients":["Horčík bisglycinát + B6 P5P","Vitamín D3 + K2 MK-7","Omega 3 EPA + DHA","Gummies Silná imunita"],"warnings":["Obsahuje rybí olej, preto nie je vegánsky.","Vitamín K a omega-3 konzultujte pri liečbe ovplyvňujúcej zrážanlivosť krvi."],"facts":["zvýhodnený balíček","4 produkty"],"category":"Balíčky","goalLabels":["imunita","každodenný základ"],"formLabels":["kapsuly","softgely","gummies"],"audienceLabels":["dospelí"],"components":["magnesium-bisglycinate","vitamin-d3-k2","omega3-softgels","immunity-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[]}];
  const SUBSTANCES = {"vitamin_a":{"label":"Vitamín A","group":"Vitamíny","unit":"µg","nrv":800,"order":10,"note":"Kontrolná hranica sa vzťahuje na vopred vytvorený vitamín A; produkty MyBears tu používajú retinyl-palmitát."},"vitamin_d":{"label":"Vitamín D","group":"Vitamíny","unit":"µg","nrv":5,"order":20},"vitamin_e":{"label":"Vitamín E","group":"Vitamíny","unit":"mg","nrv":12,"order":30},"vitamin_k2":{"label":"Vitamín K2 (MK-7)","group":"Vitamíny","unit":"µg","nrv":75,"order":40},"vitamin_c":{"label":"Vitamín C","group":"Vitamíny","unit":"mg","nrv":80,"order":50},"b1":{"label":"Vitamín B1 (thiamin)","group":"Vitamíny","unit":"mg","nrv":1.1,"order":60},"b2":{"label":"Vitamín B2 (riboflavin)","group":"Vitamíny","unit":"mg","nrv":1.4,"order":70},"niacin":{"label":"Niacin (vitamín B3)","group":"Vitamíny","unit":"mg","nrv":16,"order":80,"note":"Horná hranica sa líši podľa použitej formy niacínu, preto ju nástroj nevyhodnocuje."},"b5":{"label":"Kyselina pantoténová (B5)","group":"Vitamíny","unit":"mg","nrv":6,"order":90},"b6":{"label":"Vitamín B6","group":"Vitamíny","unit":"mg","nrv":1.4,"order":100},"b12":{"label":"Vitamín B12","group":"Vitamíny","unit":"µg","nrv":2.5,"order":110},"folate":{"label":"Folát / kyselina listová","group":"Vitamíny","unit":"µg","nrv":200,"order":120},"biotin":{"label":"Biotin","group":"Vitamíny","unit":"µg","nrv":50,"order":130},"iodine":{"label":"Jód","group":"Minerálne látky","unit":"µg","nrv":150,"order":210},"potassium":{"label":"Draslík","group":"Minerálne látky","unit":"mg","nrv":2000,"order":220},"magnesium":{"label":"Horčík","group":"Minerálne látky","unit":"mg","nrv":375,"order":230},"iron":{"label":"Železo","group":"Minerálne látky","unit":"mg","nrv":14,"order":240},"zinc":{"label":"Zinok","group":"Minerálne látky","unit":"mg","nrv":10,"order":250},"copper":{"label":"Meď","group":"Minerálne látky","unit":"µg","nrv":1000,"order":260},"manganese":{"label":"Mangan","group":"Minerálne látky","unit":"mg","nrv":2,"order":270},"selenium":{"label":"Selen","group":"Minerálne látky","unit":"µg","nrv":55,"order":280},"chromium":{"label":"Chrom","group":"Minerálne látky","unit":"µg","nrv":40,"order":290},"omega3_plant":{"label":"Omega-3 z ľanového oleja","group":"Omega-3 a tuky","unit":"mg","order":310},"fish_oil":{"label":"Rybí olej","group":"Omega-3 a tuky","unit":"mg","order":320},"omega3":{"label":"Omega-3 celkovo","group":"Omega-3 a tuky","unit":"mg","order":330},"epa":{"label":"EPA","group":"Omega-3 a tuky","unit":"mg","order":340},"dha":{"label":"DHA","group":"Omega-3 a tuky","unit":"mg","order":350},"griffonia":{"label":"Extrakt z griffonie 25:1","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":410},"lemon_balm":{"label":"Extrakt z medovky","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":420},"chamomile":{"label":"Extrakt z harmančeka","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":430},"pine_bark":{"label":"Extrakt z borovicovej kôry 30:1","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":440},"grape_seed":{"label":"Extrakt z hroznových jadierok 20:1","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":450},"coq10":{"label":"Koenzym Q10","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":460},"lions_mane":{"label":"Hericium / Lion's Mane 5:1","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":470},"cordyceps":{"label":"Cordyceps 1:1","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":480},"ginseng":{"label":"Ženšen 4:1","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":490},"green_tea":{"label":"Extrakt zo zeleného čaju","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":500},"l_citrulline":{"label":"L-citrulin","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":510},"taurine":{"label":"Taurin","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":520},"caffeine":{"label":"Kofein","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":530},"apple_cider_vinegar":{"label":"Jablčný ocot v prášku","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":540},"l_theanine":{"label":"L-theanin","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":550},"ashwagandha":{"label":"Extrakt z ašvagandy 10:1","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":560},"rhodiola":{"label":"Extrakt z rozchodnice 6:1","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":570},"bacillus_coagulans":{"label":"Bacillus coagulans MTCC 5856","group":"Mikroorganizmy a vláknina","unit":"mld. CFU","order":610},"acacia_fiber":{"label":"Akáciová vláknina","group":"Mikroorganizmy a vláknina","unit":"mg","order":620},"inositol":{"label":"Inositol","group":"Rastlinné extrakty a ďalšie látky","unit":"µg","order":580,"note":"Hodnota je prevzatá z aktuálnej deklarácie produktu."},"spirulina":{"label":"Spirulina BIO","group":"Zelené zmesi","unit":"mg","order":710},"chlorella":{"label":"Chlorella BIO","group":"Zelené zmesi","unit":"mg","order":720},"green_barley":{"label":"Zelený jačmeň BIO","group":"Zelené zmesi","unit":"mg","order":730},"moringa":{"label":"Moringa BIO","group":"Zelené zmesi","unit":"mg","order":740},"bovine_collagen":{"label":"Hovädzie kolagénové peptidy","group":"Kolagény a kĺbové látky","unit":"mg","order":810},"fish_collagen":{"label":"Rybie kolagénové peptidy","group":"Kolagény a kĺbové látky","unit":"mg","order":820},"glucosamine":{"label":"Glukozamín sulfát","group":"Kolagény a kĺbové látky","unit":"mg","order":830},"msm":{"label":"MSM","group":"Kolagény a kĺbové látky","unit":"mg","order":840},"chondroitin":{"label":"Chondroitín sulfát","group":"Kolagény a kĺbové látky","unit":"mg","order":850},"acerola_extract":{"label":"Extrakt z aceroly","group":"Rastlinné extrakty a ďalšie látky","unit":"mg","order":590},"boswellia":{"label":"Extrakt z boswellie 10:1","group":"Kolagény a kĺbové látky","unit":"mg","order":860},"boswellic_acids":{"label":"Boswellové kyseliny","group":"Kolagény a kĺbové látky","unit":"mg","order":870},"hyaluronic_acid":{"label":"Kyselina hyaluronová","group":"Kolagény a kĺbové látky","unit":"mg","order":880},"turmeric":{"label":"Extrakt z kurkumy 4:1","group":"Kolagény a kĺbové látky","unit":"mg","order":890},"bioperine":{"label":"BioPerine®","group":"Kolagény a kĺbové látky","unit":"mg","order":900},"piperine":{"label":"Piperin","group":"Kolagény a kĺbové látky","unit":"mg","order":910},"keratin":{"label":"Keratin","group":"Kolagény a kĺbové látky","unit":"mg","order":920}};
  const PRESETS = [{"id":"magnesium","label":"Horčíky","products":["magnesium-bisglycinate","magnesium-malate-potassium"]},{"id":"collagens","label":"Kolagény","products":["beauty-collagen","joint-collagen"]},{"id":"sleep","label":"Spánok a relax","products":["sleep-gummies","relax-gummies","mood-gummies","magnesium-bisglycinate"]},{"id":"beauty","label":"Vlasy a pokožka","products":["hsn-gummies","biotin-gummies","skin-30-gummies","beauty-collagen"]},{"id":"immunity","label":"Imunita","products":["immunity-gummies","vitamin-d3-k2","zinc-bisglycinate","multivitamin-gummies"]},{"id":"focus","label":"Sústredenie a výkon","products":["active-brain-gummies","preworkout-gummies","magnesium-malate-potassium","omega3-softgels"]}];
  const GOAL_LABELS = {"sleep":"spánok a večerná rutina","calm":"pokoj a psychická pohoda","focus":"sústredenie a mentálny výkon","energy":"energia a aktívny režim","immunity":"imunita","beauty":"vlasy, pokožka a nechty","mature_skin":"starostlivosť o pleť 30+","digestion":"trávenie a mikroflóra","sport":"šport a fyzická výkonnosť","joints":"kĺby a pohybový aparát","daily":"každodenný základ","child_daily":"vitamíny a omega-3 pre dieťa"};
  const PRODUCT_MAP = new Map(PRODUCTS.map(function (p) { return [p.id, p]; }));
  const pageCache = new Map();
  let instanceCounter = 0;

  const DEFAULT_CONFIG = Object.freeze({
    siteOrigin: null,
    maxProducts: 4,
    enableLiveProductData: true,
    enableAddToCart: true,
    enableShareLink: true,
    analytics: false,
    initialProducts: [],
    scrollOffset: 24,
    debug: false
  });

  const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.MBPC_CONFIG || {});
  CONFIG.maxProducts = Math.max(2, Math.min(4, Number(CONFIG.maxProducts) || 4));

  const CSS_TEXT = `
.mbpc{--green:#2dc26b;--green-dark:#16994d;--green-soft:#f2fbf5;--yellow:#f5e694;--yellow-soft:#fffbed;--text:#202522;--muted:#657069;--line:#dce5df;--soft:#f7f9f8;--white:#fff;--danger:#a83d3d;--danger-soft:#fff3f3;--shadow:0 13px 35px rgba(22,70,42,.09);font-family:Arial,Helvetica,sans-serif;font-weight:400;color:var(--text);margin:20px 0 42px;line-height:1.48}.mbpc,.mbpc *{box-sizing:border-box}.mbpc h2,.mbpc h3,.mbpc h4,.mbpc p{font-family:Arial,Helvetica,sans-serif}.mbpc strong,.mbpc b{font-weight:700}.mbpc button,.mbpc input,.mbpc select{font:inherit}.mbpc__shell{background:var(--white);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:var(--shadow)}.mbpc__hero{padding:32px 28px;background:linear-gradient(135deg,var(--green-soft),#fff)}.mbpc__title{font-size:30px;line-height:1.15;margin:0 0 11px;font-weight:700;color:var(--text)}.mbpc__lead{max-width:920px;margin:0;color:var(--muted);font-size:16px;font-weight:400}.mbpc__privacy{display:inline-flex;align-items:center;gap:7px;margin-top:15px;padding:8px 11px;border-radius:9px;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:700;color:#445048}.mbpc__body{padding:26px}.mbpc__section{margin-bottom:28px}.mbpc__section:last-child{margin-bottom:0}.mbpc__section-title{margin:0 0 13px;font-size:21px;line-height:1.25;font-weight:700}.mbpc__section-note{margin:-5px 0 15px;color:var(--muted);font-size:14px}.mbpc__presets{display:flex;gap:9px;flex-wrap:wrap}.mbpc__preset{border:1px solid var(--line);background:#fff;border-radius:999px;padding:9px 13px;cursor:pointer;font-weight:700;color:var(--text);transition:.18s ease}.mbpc__preset:hover,.mbpc__preset:focus-visible{border-color:var(--green);background:var(--green-soft);outline:none}.mbpc__filters{display:grid;grid-template-columns:minmax(200px,1.6fr) repeat(3,minmax(145px,1fr));gap:10px;padding:16px;border:1px solid var(--line);border-radius:12px;background:var(--soft)}.mbpc__field label{display:block;margin:0 0 6px;font-size:13px;font-weight:700;color:#374139}.mbpc__input,.mbpc__select{width:100%;height:44px;border:1px solid #cbd7cf;border-radius:9px;background:#fff;color:var(--text);padding:0 12px;font-weight:400}.mbpc__input:focus,.mbpc__select:focus{border-color:var(--green);outline:3px solid rgba(45,194,107,.13)}.mbpc__catalog-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:18px 0 10px}.mbpc__count{font-size:14px;color:var(--muted)}.mbpc__clear-filters{border:0;background:transparent;color:var(--green-dark);cursor:pointer;font-weight:700;padding:5px}.mbpc__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.mbpc__card{position:relative;display:flex;flex-direction:column;min-height:230px;border:1px solid var(--line);border-radius:13px;background:#fff;padding:15px;transition:.18s ease}.mbpc__card:hover{border-color:#b9cbbf;box-shadow:0 8px 20px rgba(22,70,42,.07)}.mbpc__card--selected{border:2px solid var(--green);padding:14px;background:var(--green-soft)}.mbpc__card--disabled{opacity:.56}.mbpc__card-top{display:flex;gap:12px;align-items:flex-start}.mbpc__icon{flex:0 0 45px;width:45px;height:45px;border-radius:11px;display:grid;place-items:center;background:var(--yellow-soft);border:1px solid #eee3a5;font-size:22px}.mbpc__card-title{margin:0;font-size:16px;line-height:1.28;font-weight:700}.mbpc__card-category{margin-top:4px;font-size:12px;color:var(--muted);font-weight:400}.mbpc__card-summary{margin:12px 0 10px;font-size:13px;color:#505b54;font-weight:400}.mbpc__tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:auto}.mbpc__tag{font-size:11px;line-height:1.2;border-radius:999px;padding:5px 8px;background:var(--soft);border:1px solid var(--line);font-weight:700}.mbpc__tag--green{background:var(--green-soft);border-color:#bde7ca;color:#176c39}.mbpc__card-actions{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:13px}.mbpc__select-product{min-height:40px;border:1px solid var(--green);background:var(--green);color:#fff;border-radius:9px;padding:8px 10px;cursor:pointer;font-weight:700}.mbpc__select-product:hover,.mbpc__select-product:focus-visible{background:var(--green-dark);border-color:var(--green-dark);outline:none}.mbpc__select-product--remove{background:#fff;color:var(--green-dark)}.mbpc__detail-link{display:grid;place-items:center;min-width:40px;border:1px solid var(--line);border-radius:9px;text-decoration:none;color:var(--text);font-weight:700}.mbpc__detail-link:hover,.mbpc__detail-link:focus-visible{border-color:var(--green);background:var(--green-soft);outline:none}.mbpc__empty{padding:24px;border:1px dashed #bdc9c1;border-radius:12px;text-align:center;color:var(--muted);background:var(--soft)}.mbpc__tray{position:sticky;bottom:12px;z-index:6;margin-top:20px;border:1px solid #a8dabb;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 10px 28px rgba(22,70,42,.16);padding:13px;backdrop-filter:blur(7px)}.mbpc__tray-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.mbpc__tray-title{font-size:15px;font-weight:700}.mbpc__tray-items{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.mbpc__tray-item{display:inline-flex;align-items:center;gap:6px;padding:6px 8px;border-radius:8px;background:var(--green-soft);border:1px solid #bde7ca;font-size:12px;font-weight:700}.mbpc__tray-remove{border:0;background:transparent;color:var(--danger);font-size:16px;line-height:1;cursor:pointer;padding:0 2px}.mbpc__tray-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.mbpc__button{min-height:42px;border-radius:9px;padding:9px 14px;border:1px solid var(--line);background:#fff;color:var(--text);cursor:pointer;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:7px}.mbpc__button:hover,.mbpc__button:focus-visible{border-color:var(--green);background:var(--green-soft);outline:none}.mbpc__button--primary{background:var(--green);border-color:var(--green);color:#fff}.mbpc__button--primary:hover,.mbpc__button--primary:focus-visible{background:var(--green-dark);border-color:var(--green-dark)}.mbpc__button:disabled{opacity:.48;cursor:not-allowed}.mbpc__status{margin-top:10px;padding:10px 12px;border-radius:9px;background:var(--yellow-soft);border:1px solid #eadc86;color:#6b5a00;font-size:13px;font-weight:700}.mbpc__comparison{scroll-margin-top:24px}.mbpc__compare-tools{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}.mbpc__options{display:flex;gap:13px;flex-wrap:wrap}.mbpc__check{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700}.mbpc__check input{accent-color:var(--green);width:17px;height:17px}.mbpc__table-wrap{overflow:auto;border:1px solid var(--line);border-radius:12px;background:#fff}.mbpc__table{border-collapse:separate;border-spacing:0;width:100%;min-width:850px;font-size:13px}.mbpc__table th,.mbpc__table td{padding:11px 12px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);vertical-align:top;font-weight:400}.mbpc__table tr:last-child th,.mbpc__table tr:last-child td{border-bottom:0}.mbpc__table th:last-child,.mbpc__table td:last-child{border-right:0}.mbpc__row-label{position:sticky;left:0;z-index:2;width:190px;min-width:190px;background:#f8faf9;text-align:left;font-weight:700!important}.mbpc__product-head{min-width:205px;background:#fff;text-align:center}.mbpc__product-head-inner{display:flex;flex-direction:column;align-items:center;gap:8px}.mbpc__product-image{width:92px;height:92px;object-fit:contain;border-radius:10px;background:#fff;border:1px solid var(--line)}.mbpc__product-placeholder{width:92px;height:92px;display:grid;place-items:center;border-radius:10px;background:var(--yellow-soft);border:1px solid #eee3a5;font-size:36px}.mbpc__product-name{font-size:14px;line-height:1.3;font-weight:700}.mbpc__product-price{font-size:17px;font-weight:800;color:var(--green-dark)}.mbpc__availability{font-size:12px;font-weight:700;color:var(--muted)}.mbpc__availability--in{color:#17703a}.mbpc__availability--out{color:var(--danger)}.mbpc__head-actions{display:flex;flex-direction:column;gap:6px;width:100%}.mbpc__head-actions .mbpc__button{min-height:37px;padding:7px 9px;font-size:12px}.mbpc__difference{background:var(--yellow-soft)!important}.mbpc__yes{font-weight:700;color:#176c39}.mbpc__no{font-weight:700;color:#8a3434}.mbpc__unknown{color:var(--muted)}.mbpc__list{margin:0;padding-left:17px}.mbpc__list li{margin:0 0 4px}.mbpc__list li:last-child{margin-bottom:0}.mbpc__insights{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:15px}.mbpc__insight{padding:13px;border-radius:11px;background:var(--soft);border:1px solid var(--line);font-size:13px}.mbpc__insight strong{display:block;margin-bottom:4px}.mbpc__ingredient-title{margin:25px 0 10px;font-size:20px;font-weight:700}.mbpc__ingredient-note{margin:0 0 12px;color:var(--muted);font-size:13px}.mbpc__group-row th{background:var(--green-soft);font-weight:700!important;color:#225a35}.mbpc__amount{font-weight:700}.mbpc__nrv{display:block;margin-top:3px;color:var(--muted);font-size:11px}.mbpc__footnotes{margin-top:18px;padding:15px;border-radius:11px;background:var(--soft);color:var(--muted);font-size:13px}.mbpc__footnotes p{margin:0 0 7px}.mbpc__footnotes p:last-child{margin-bottom:0}.mbpc__sr{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}@media(max-width:960px){.mbpc__filters{grid-template-columns:repeat(2,minmax(0,1fr))}.mbpc__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.mbpc__insights{grid-template-columns:1fr}.mbpc__tray-head{align-items:flex-start;flex-direction:column}}@media(max-width:620px){.mbpc{margin:14px 0 28px}.mbpc__shell{border-radius:13px}.mbpc__hero{padding:24px 15px}.mbpc__title{font-size:25px}.mbpc__body{padding:17px 12px 25px}.mbpc__filters{grid-template-columns:1fr}.mbpc__grid{grid-template-columns:1fr}.mbpc__tray{bottom:7px}.mbpc__tray-actions{width:100%}.mbpc__tray-actions .mbpc__button{flex:1}.mbpc__compare-tools{align-items:flex-start;flex-direction:column}.mbpc__options{flex-direction:column;gap:8px}.mbpc__button{min-height:44px}.mbpc__product-head{min-width:185px}.mbpc__row-label{min-width:150px;width:150px}.mbpc__table{min-width:720px}}@media print{body *{visibility:hidden!important}.mbpc,.mbpc *{visibility:visible!important}.mbpc{position:absolute;inset:0;width:100%;margin:0}.mbpc__shell{border:0;box-shadow:none}.mbpc__hero,.mbpc__section--selector,.mbpc__tray,.mbpc__compare-tools,.mbpc__head-actions,.mbpc__footnotes .mbpc__screen-only{display:none!important}.mbpc__body{padding:0}.mbpc__comparison{display:block!important}.mbpc__table{min-width:0;font-size:9px}.mbpc__table th,.mbpc__table td{padding:5px}.mbpc__row-label{position:static;min-width:120px;width:120px}.mbpc__product-image,.mbpc__product-placeholder{width:55px;height:55px}.mbpc__insights{grid-template-columns:repeat(3,1fr)} }
`;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[char];
    });
  }

  function absoluteUrl(path) {
    try { return new URL(path, CONFIG.siteOrigin || window.location.origin).href; }
    catch (e) { return path; }
  }

  function iconFor(product) {
    if (product.kind === 'bundle') return '🎁';
    if (product.category === 'Gummies') return '●';
    if (product.category === 'Kolagény') return '✦';
    return '◆';
  }

  function boolLabel(value, negativeLabel) {
    if (value === true) return '<span class="mbpc__yes">Áno</span>';
    if (value === false) return '<span class="mbpc__no">' + escapeHtml(negativeLabel || 'Nie') + '</span>';
    return '<span class="mbpc__unknown">Nieuvedené</span>';
  }

  function textValue(value) {
    if (Array.isArray(value)) return value.join('|');
    if (value == null) return '';
    return String(value).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('sk-SK');
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS_TEXT;
    style.textContent += MYBEARS_UNIFIED_DESIGN_CSS;
    document.head.appendChild(style);
  }

  function formatPrice(value, currency) {
    if (!Number.isFinite(Number(value))) return '';
    return new Intl.NumberFormat('sk-SK', {style:'currency',currency:currency || 'CZK',maximumFractionDigits:0}).format(Number(value));
  }

  function formatNumber(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '';
    const digits = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : Math.abs(n) >= 1 ? 2 : 3;
    return new Intl.NumberFormat('sk-SK',{maximumFractionDigits:digits}).format(n);
  }

  function packageDays(product) {
    if (product.kind === 'bundle') return null;
    const packageMatch = String(product.package || '').match(/(\d+)/);
    if (!packageMatch) return null;
    const packageCount = Number(packageMatch[1]);
    const doseText = product.defaultDoseLabel || product.dose || '';
    const doseMatch = String(doseText).match(/(\d+(?:[.,]\d+)?)/);
    const dailyUnits = doseMatch ? Number(doseMatch[1].replace(',','.')) : 1;
    if (!packageCount || !dailyUnits) return null;
    return packageCount / dailyUnits;
  }

  function buildCartUrl(product) {
    try {
      const url = new URL(product.url, CONFIG.siteOrigin || window.location.origin);
      url.searchParams.set('addtocart','1');
      url.searchParams.set('quantity','1');
      url.searchParams.set('return','back');
      return url.href;
    } catch (e) { return product.url; }
  }

  function findJsonLdProduct(value) {
    if (!value) return null;
    if (Array.isArray(value)) {
      for (let i=0;i<value.length;i+=1) { const found=findJsonLdProduct(value[i]); if (found) return found; }
      return null;
    }
    if (typeof value !== 'object') return null;
    const type=value['@type'];
    if (type === 'Product' || (Array.isArray(type) && type.indexOf('Product') !== -1)) return value;
    if (value['@graph']) return findJsonLdProduct(value['@graph']);
    return null;
  }

  async function fetchProductMeta(product) {
    if (!CONFIG.enableLiveProductData) return {};
    const url = absoluteUrl(product.url);
    if (pageCache.has(url)) return pageCache.get(url);
    const promise = fetch(url, {credentials:'same-origin',headers:{'Accept':'text/html'}}).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.text();
    }).then(function (html) {
      const doc = new DOMParser().parseFromString(html,'text/html');
      let node = null;
      Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).some(function (script) {
        try { node = findJsonLdProduct(JSON.parse(script.textContent)); }
        catch (e) { node = null; }
        return !!node;
      });
      const offer = node && Array.isArray(node.offers) ? node.offers[0] : node && node.offers;
      let image = node && node.image;
      if (Array.isArray(image)) image=image[0];
      if (image && typeof image === 'object') image=image.url || image.contentUrl;
      if (!image) {
        const img=doc.querySelector('[itemprop="image"], .product-image img, .product-detail img, img[data-main-image]');
        image=img && (img.getAttribute('src') || img.getAttribute('data-src'));
      }
      let price = offer && (offer.price || offer.lowPrice);
      if (!price) {
        const el=doc.querySelector('[itemprop="price"], .price-final, .product-price, [data-price]');
        price=el && (el.getAttribute('content') || el.getAttribute('data-price') || (el.textContent || '').replace(/[^0-9,.-]/g,'').replace(',','.'));
      }
      const availabilityRaw = offer && offer.availability ? String(offer.availability) : '';
      let availability='';
      let inStock=null;
      if (/InStock|LimitedAvailability/i.test(availabilityRaw)) { availability='Skladem'; inStock=true; }
      else if (/OutOfStock|SoldOut/i.test(availabilityRaw)) { availability='Nie je skladom'; inStock=false; }
      else {
        const stockEl=doc.querySelector('.availability, [itemprop="availability"], .stock, .product-availability');
        availability=stockEl ? stockEl.textContent.trim().replace(/\s+/g,' ') : '';
        if (availability) inStock=!/nie je|vyprodáno|nedostup/i.test(availability);
      }
      const ratingNode=node && node.aggregateRating;
      return {
        name:node && node.name ? String(node.name) : product.name,
        image:image ? absoluteUrl(image) : '',
        price:Number(price),
        currency:offer && offer.priceCurrency ? offer.priceCurrency : 'CZK',
        availability:availability,
        inStock:inStock,
        rating:ratingNode && Number(ratingNode.ratingValue),
        reviewCount:ratingNode && Number(ratingNode.reviewCount || ratingNode.ratingCount)
      };
    }).catch(function (error) {
      if (CONFIG.debug && window.console) console.warn('[MBPC] Live product data failed', product.id, error);
      return {error:true};
    });
    pageCache.set(url,promise);
    return promise;
  }

  function selectionFromHash() {
    if (!CONFIG.enableShareLink) return [];
    const match=String(window.location.hash || '').match(/(?:^#|&)porovnat=([^&]+)/);
    if (!match) return [];
    return decodeURIComponent(match[1]).split(',').filter(function (id) { return PRODUCT_MAP.has(id); }).slice(0,CONFIG.maxProducts);
  }

  function updateHash(ids) {
    if (!CONFIG.enableShareLink) return;
    const base=window.location.href.split('#')[0];
    const hash=ids.length ? '#porovnat=' + encodeURIComponent(ids.join(',')) : '';
    try { history.replaceState(null,'',base+hash); } catch (e) {}
  }

  function emit(eventName) {
    if (!CONFIG.analytics || !window.dataLayer || !Array.isArray(window.dataLayer)) return;
    window.dataLayer.push({event:eventName,component:'mybears_product_comparison'});
  }

  function createApp(root) {
    instanceCounter+=1;
    const uid='mbpc-'+instanceCounter;
    const hashSelection=selectionFromHash();
    const initial=hashSelection.length ? hashSelection : (Array.isArray(CONFIG.initialProducts) ? CONFIG.initialProducts : []);
    const state={
      selected:initial.filter(function (id) { return PRODUCT_MAP.has(id); }).slice(0,CONFIG.maxProducts),
      query:'',category:'Všetko',goal:'Všetko',feature:'Všetko',
      hideSame:false,highlight:true,visibleCount:12,
      live:new Map(),status:'',comparisonVisible:initial.length>=2
    };

    root.classList.add('mbpc');
    root.setAttribute('data-mbpc-version',VERSION);
    root.innerHTML='<div class="mbpc__shell"><header class="mbpc__hero"><h2 class="mbpc__title">Porovnajte produkty MyBears vedľa seba</h2><p class="mbpc__lead">Vyberte dva až štyri produktov. Porovnanie ukáže formu, zameranie, dávkovanie, vlastnosti, aktuálnu cenu a pri samostatných produktoch aj deklarované množství účinných látok vo východiskovej dennej dávke.</p><div class="mbpc__privacy">Bez registrácie · výber sa neukladá</div></header><div class="mbpc__body" data-role="app"></div></div>';
    const app=root.querySelector('[data-role="app"]');

    function filteredProducts() {
      const q=state.query.trim().toLocaleLowerCase('sk-SK');
      return PRODUCTS.filter(function (p) {
        if (state.category!=='Všetko' && p.category!==state.category) return false;
        if (state.goal!=='Všetko' && !Object.prototype.hasOwnProperty.call(p.goals || {},state.goal)) return false;
        if (state.feature==='vegan' && p.vegan!==true) return false;
        if (state.feature==='sugarFree' && p.sugarFree!==true) return false;
        if (state.feature==='glutenFree' && p.glutenFree!==true) return false;
        if (state.feature==='halal' && p.halal!==true) return false;
        if (state.feature==='caffeineFree' && p.caffeine!==false) return false;
        if (!q) return true;
        const ingredientLabels=Object.keys(p.dailyAmounts || {}).map(function (id) { return SUBSTANCES[id] ? SUBSTANCES[id].label : id; });
        const hay=[p.name,p.summary,p.category,p.package,p.dose,p.flavor].concat(p.goalLabels || [],p.formLabels || [],p.keyIngredients || [],p.facts || [],ingredientLabels).join(' ').toLocaleLowerCase('sk-SK');
        return hay.indexOf(q)!==-1;
      });
    }

    function selectedProducts() { return state.selected.map(function (id) { return PRODUCT_MAP.get(id); }).filter(Boolean); }

    function setStatus(message) {
      state.status=message;
      renderTray();
      if (message) window.setTimeout(function () { if (state.status===message) { state.status=''; renderTray(); } },3500);
    }

    function toggleProduct(id) {
      const index=state.selected.indexOf(id);
      if (index!==-1) state.selected.splice(index,1);
      else {
        if (state.selected.length>=CONFIG.maxProducts) { setStatus('Môžete porovnať najviac '+CONFIG.maxProducts+' produktov.'); return; }
        state.selected.push(id);
        hydrate(id);
      }
      state.comparisonVisible=state.selected.length>=2 && state.comparisonVisible;
      updateHash(state.selected);
      render();
    }

    function loadPreset(id) {
      const preset=PRESETS.find(function (x) { return x.id===id; });
      if (!preset) return;
      state.selected=preset.products.slice(0,CONFIG.maxProducts);
      state.comparisonVisible=true;
      updateHash(state.selected);
      state.selected.forEach(hydrate);
      render();
      window.setTimeout(scrollToComparison,20);
      emit('mb_compare_preset');
    }

    function clearFilters() { state.query='';state.category='Všetko';state.goal='Všetko';state.feature='Všetko';state.visibleCount=12;render(); }
    function clearSelection() { state.selected=[];state.comparisonVisible=false;updateHash([]);render(); }

    function hydrate(id) {
      if (!CONFIG.enableLiveProductData || state.live.has(id)) return;
      const product=PRODUCT_MAP.get(id); if (!product) return;
      state.live.set(id,{loading:true});
      fetchProductMeta(product).then(function (meta) { state.live.set(id,meta || {}); renderComparison(); renderTray(); });
    }

    function scrollToComparison() {
      const el=root.querySelector('[data-role="comparison"]');
      if (!el) return;
      const top=el.getBoundingClientRect().top+window.pageYOffset-(Number(CONFIG.scrollOffset)||0);
      window.scrollTo({top:top,behavior:'smooth'});
    }

    function showComparison() {
      if (state.selected.length<2) { setStatus('Vyberte aspoň dva produktov.'); return; }
      state.comparisonVisible=true;
      state.selected.forEach(hydrate);
      renderComparison();
      window.setTimeout(scrollToComparison,20);
      emit('mb_compare_complete');
    }

    function productTags(p) {
      const tags=[];
      if (p.vegan===true) tags.push('vegan');
      if (p.sugarFree===true) tags.push('bez cukru');
      if (p.glutenFree===true) tags.push('bez lepku');
      if (p.halal===true) tags.push('halal');
      return tags.slice(0,3);
    }

    function renderSelector() {
      const list=filteredProducts();
      const visible=list.slice(0,state.visibleCount);
      const cards=visible.map(function (p) {
        const selected=state.selected.indexOf(p.id)!==-1;
        const disabled=!selected && state.selected.length>=CONFIG.maxProducts;
        const tags=productTags(p).map(function (t) { return '<span class="mbpc__tag mbpc__tag--green">'+escapeHtml(t)+'</span>'; }).join('');
        const topGoal=p.goalLabels && p.goalLabels[0] ? '<span class="mbpc__tag">'+escapeHtml(p.goalLabels[0])+'</span>' : '';
        return '<article class="mbpc__card '+(selected?'mbpc__card--selected ':'')+(disabled?'mbpc__card--disabled':'')+'" data-product-card="'+escapeHtml(p.id)+'"><div class="mbpc__card-top"><div class="mbpc__icon" aria-hidden="true">'+iconFor(p)+'</div><div><h4 class="mbpc__card-title">'+escapeHtml(p.name)+'</h4><div class="mbpc__card-category">'+escapeHtml(p.category)+' · '+escapeHtml(p.formLabels.join(', '))+'</div></div></div><p class="mbpc__card-summary">'+escapeHtml(p.summary)+'</p><div class="mbpc__tags">'+topGoal+tags+'</div><div class="mbpc__card-actions"><button type="button" class="mbpc__select-product '+(selected?'mbpc__select-product--remove':'')+'" data-action="toggle" data-id="'+escapeHtml(p.id)+'" '+(disabled?'disabled':'')+'>'+(selected?'Odobrať z porovnania':'Pridať na porovnanie')+'</button><a class="mbpc__detail-link" href="'+escapeHtml(absoluteUrl(p.url))+'" target="_blank" rel="noopener" aria-label="Otvoriť detail produktu '+escapeHtml(p.name)+'">↗</a></div></article>';
      }).join('');
      const goals=Object.keys(GOAL_LABELS).map(function (id) { return '<option value="'+escapeHtml(id)+'" '+(state.goal===id?'selected':'')+'>'+escapeHtml(GOAL_LABELS[id])+'</option>'; }).join('');
      const html='<section class="mbpc__section mbpc__section--selector"><h3 class="mbpc__section-title">Rýchle porovnania</h3><div class="mbpc__presets">'+PRESETS.map(function (p) { return '<button type="button" class="mbpc__preset" data-action="preset" data-id="'+p.id+'">'+escapeHtml(p.label)+'</button>'; }).join('')+'</div><h3 class="mbpc__section-title" style="margin-top:25px">Vyberte vlastné produkty</h3><p class="mbpc__section-note">Možno kombinovať rôzne kategórie. Pre prehľadné zobrazenie je limit nastavený na štyri produktov.</p><div class="mbpc__filters"><div class="mbpc__field"><label for="'+uid+'-search">Hľadať produkt alebo látku</label><input id="'+uid+'-search" class="mbpc__input" type="search" value="'+escapeHtml(state.query)+'" placeholder="Napr. horčík, biotin, spánok"></div><div class="mbpc__field"><label for="'+uid+'-category">Kategória</label><select id="'+uid+'-category" class="mbpc__select" data-filter="category"><option>Všetko</option>'+['Gummies','Kapsuly a softgély','Kolagény','Balíčky'].map(function (x) { return '<option '+(state.category===x?'selected':'')+'>'+escapeHtml(x)+'</option>'; }).join('')+'</select></div><div class="mbpc__field"><label for="'+uid+'-goal">Zameranie</label><select id="'+uid+'-goal" class="mbpc__select" data-filter="goal"><option value="Všetko">Všetko</option>'+goals+'</select></div><div class="mbpc__field"><label for="'+uid+'-feature">Vlastnosť</label><select id="'+uid+'-feature" class="mbpc__select" data-filter="feature"><option value="Všetko" '+(state.feature==='Všetko'?'selected':'')+'>Všetko</option><option value="vegan" '+(state.feature==='vegan'?'selected':'')+'>Vegan</option><option value="sugarFree" '+(state.feature==='sugarFree'?'selected':'')+'>Bez cukru</option><option value="glutenFree" '+(state.feature==='glutenFree'?'selected':'')+'>Bez lepku</option><option value="halal" '+(state.feature==='halal'?'selected':'')+'>Halal</option><option value="caffeineFree" '+(state.feature==='caffeineFree'?'selected':'')+'>Bez kofeínu</option></select></div></div><div class="mbpc__catalog-head"><div class="mbpc__count">Zobrazených '+visible.length+' z '+list.length+' produktov</div><button type="button" class="mbpc__clear-filters" data-action="clear-filters">Zrušiť filtre</button></div>'+(cards?'<div class="mbpc__grid">'+cards+'</div>':'<div class="mbpc__empty">Zadaným filtrom nezodpovedá žiadny produkt.</div>')+(visible.length<list.length?'<div style="display:flex;justify-content:center;margin-top:16px"><button type="button" class="mbpc__button" data-action="show-more">Zobraziť ďalšie produkty</button></div>':'')+'</section>';
      const old=app.querySelector('[data-role="selector"]');
      const wrap=document.createElement('div'); wrap.setAttribute('data-role','selector'); wrap.innerHTML=html;
      if (old) old.replaceWith(wrap); else app.prepend(wrap);
      const search=wrap.querySelector('#'+uid+'-search');
      if (search) search.addEventListener('input',function (e) { const position=e.target.selectionStart; state.query=e.target.value; state.visibleCount=12; renderSelector(); renderTray(); const next=root.querySelector('#'+uid+'-search'); if (next) { next.focus(); try { next.setSelectionRange(position,position); } catch (err) {} } });
    }

    function renderTray() {
      const items=selectedProducts();
      const html='<div class="mbpc__tray-head"><div><div class="mbpc__tray-title">Vybraných '+items.length+' z '+CONFIG.maxProducts+'</div>'+(items.length?'<div class="mbpc__tray-items">'+items.map(function (p) { return '<span class="mbpc__tray-item">'+escapeHtml(p.name)+'<button class="mbpc__tray-remove" type="button" data-action="toggle" data-id="'+p.id+'" aria-label="Odobrať '+escapeHtml(p.name)+'">×</button></span>'; }).join('')+'</div>':'')+'</div><div class="mbpc__tray-actions"><button type="button" class="mbpc__button" data-action="clear-selection" '+(!items.length?'disabled':'')+'>Vymazať</button><button type="button" class="mbpc__button mbpc__button--primary" data-action="compare" '+(items.length<2?'disabled':'')+'>Porovnať produkty</button></div></div>'+(state.status?'<div class="mbpc__status" role="status">'+escapeHtml(state.status)+'</div>':'');
      let tray=app.querySelector('[data-role="tray"]');
      if (!tray) { tray=document.createElement('div');tray.className='mbpc__tray';tray.setAttribute('data-role','tray');app.appendChild(tray); }
      tray.innerHTML=html;
    }

    function displayValue(value) { return value == null || value==='' ? '<span class="mbpc__unknown">—</span>' : value; }

    function liveFor(p) { return state.live.get(p.id) || {}; }

    function pricePerDay(p) {
      const live=liveFor(p); const days=packageDays(p);
      if (!Number.isFinite(live.price) || !days) return '<span class="mbpc__unknown">—</span>';
      return 'približne '+formatPrice(live.price/days,live.currency)+'/deň';
    }

    function listHtml(values) {
      const arr=(values || []).filter(Boolean);
      if (!arr.length) return '<span class="mbpc__unknown">—</span>';
      return '<ul class="mbpc__list">'+arr.map(function (x) { return '<li>'+escapeHtml(x)+'</li>'; }).join('')+'</ul>';
    }

    function comparisonRows(products) {
      return [
        {id:'price',label:'Aktuálna cena',get:function(p){const l=liveFor(p);return l.loading?'Načítavam…':Number.isFinite(l.price)?'<span class="mbpc__amount">'+formatPrice(l.price,l.currency)+'</span>':'V detaile produktu';},norm:function(p){const l=liveFor(p);return Number.isFinite(l.price)?String(l.price):'';}},
        {id:'perday',label:'Orientačná cena za deň',get:pricePerDay,norm:function(p){const l=liveFor(p),d=packageDays(p);return Number.isFinite(l.price)&&d?String(Math.round(l.price/d*100)/100):'';}},
        {id:'availability',label:'Dostupnosť',get:function(p){const l=liveFor(p);return escapeHtml(l.availability || (l.loading?'Načítavam…':'V detaile produktu'));},norm:function(p){return String(liveFor(p).availability || '');}},
        {id:'rating',label:'Hodnotenie zákazníkov',get:function(p){const l=liveFor(p);return Number.isFinite(l.rating)?escapeHtml(formatNumber(l.rating)+' / 5'+(l.reviewCount?' ('+l.reviewCount+' hodnotení)':'')):'—';},norm:function(p){return String(liveFor(p).rating || '');}},
        {id:'kind',label:'Typ riešenia',get:function(p){return p.kind==='bundle'?'Zvýhodnený balíček':'Samostatný produkt';},norm:function(p){return p.kind;}},
        {id:'form',label:'Forma',get:function(p){return escapeHtml(p.formLabels.join(', '));},norm:function(p){return p.formLabels.join('|');}},
        {id:'audience',label:'Určenie',get:function(p){return escapeHtml(p.audienceLabels.join(', '));},norm:function(p){return p.audienceLabels.join('|');}},
        {id:'goals',label:'Hlavné zameranie',get:function(p){return listHtml((p.goalLabels||[]).slice(0,4));},norm:function(p){return (p.goalLabels||[]).slice(0,4).join('|');}},
        {id:'package',label:'Balenie',get:function(p){return escapeHtml(p.package);},norm:function(p){return p.package;}},
        {id:'dose',label:'Odporúčané užívanie',get:function(p){return escapeHtml(p.dose);},norm:function(p){return p.dose;}},
        {id:'supply',label:'Výdrž balenia',get:function(p){return escapeHtml(p.supply);},norm:function(p){return p.supply;}},
        {id:'flavor',label:'Príchuť',get:function(p){return escapeHtml(p.flavor || 'bez príchute');},norm:function(p){return p.flavor || '';}},
        {id:'vegan',label:'Vegan',get:function(p){return boolLabel(p.vegan);},norm:function(p){return String(p.vegan);}},
        {id:'sugar',label:'Bez cukru',get:function(p){return boolLabel(p.sugarFree);},norm:function(p){return String(p.sugarFree);}},
        {id:'gluten',label:'Bez lepku',get:function(p){return boolLabel(p.glutenFree);},norm:function(p){return String(p.glutenFree);}},
        {id:'halal',label:'Halal',get:function(p){return boolLabel(p.halal);},norm:function(p){return String(p.halal);}},
        {id:'caffeine',label:'Obsahuje kofeín / stimulanty',get:function(p){return p.caffeine===true?'<span class="mbpc__no">Áno</span>':p.caffeine===false?'<span class="mbpc__yes">Nie</span>':'<span class="mbpc__unknown">Nieuvedené</span>';},norm:function(p){return String(p.caffeine);}},
        {id:'ingredients',label:pLabel('Kľúčové zložky / obsah balíčka'),get:function(p){return listHtml(p.keyIngredients);},norm:function(p){return (p.keyIngredients||[]).join('|');}},
        {id:'facts',label:'Dôležité vlastnosti',get:function(p){return listHtml(p.facts);},norm:function(p){return (p.facts||[]).join('|');}},
        {id:'warnings',label:'Upozornenie',get:function(p){return listHtml([].concat(p.warnings||[],p.compositionWarnings||[]));},norm:function(p){return [].concat(p.warnings||[],p.compositionWarnings||[]).join('|');}}
      ];
    }

    function pLabel(x){return x;}

    function productHeader(p) {
      const live=liveFor(p);
      const image=live.image?'<img class="mbpc__product-image" src="'+escapeHtml(live.image)+'" alt="'+escapeHtml(live.name || p.name)+'" loading="lazy">':'<div class="mbpc__product-placeholder" aria-hidden="true">'+iconFor(p)+'</div>';
      const price=Number.isFinite(live.price)?'<div class="mbpc__product-price">'+formatPrice(live.price,live.currency)+'</div>':'';
      const availability=live.availability?'<div class="mbpc__availability '+(live.inStock===true?'mbpc__availability--in':live.inStock===false?'mbpc__availability--out':'')+'">'+escapeHtml(live.availability)+'</div>':'';
      const add=CONFIG.enableAddToCart && live.inStock!==false?'<a class="mbpc__button mbpc__button--primary" href="'+escapeHtml(buildCartUrl(p))+'" data-action="add-cart" data-id="'+p.id+'">Do košíku</a>':'';
      return '<div class="mbpc__product-head-inner">'+image+'<div class="mbpc__product-name">'+escapeHtml(live.name || p.name)+'</div>'+price+availability+'<div class="mbpc__head-actions"><a class="mbpc__button" href="'+escapeHtml(absoluteUrl(p.url))+'" target="_blank" rel="noopener" data-action="product-link">Detail produktu</a>'+add+'<button type="button" class="mbpc__button" data-action="toggle" data-id="'+p.id+'">Odobrať</button></div></div>';
    }

    function insightCards(products) {
      const forms=Array.from(new Set(products.flatMap(function (p) { return p.formLabels; })));
      const common=[];
      if (products.every(function(p){return p.vegan===true;})) common.push('všetky sú vegánske');
      if (products.every(function(p){return p.sugarFree===true;})) common.push('všetky sú bez cukru');
      if (products.every(function(p){return p.glutenFree===true;})) common.push('všetky sú bez lepku');
      const activeSets=products.map(function(p){return new Set(Object.keys(p.dailyAmounts||{}));});
      let shared=[];
      if (activeSets.length && activeSets.every(function(s){return s.size;})) {
        shared=Array.from(activeSets[0]).filter(function(id){return activeSets.slice(1).every(function(s){return s.has(id);});});
      }
      const prices=products.map(function(p){return liveFor(p).price;}).filter(Number.isFinite);
      const priceText=prices.length>=2?'Rozdiel medzi najnižšou a najvyššou aktuálnou cenou je '+formatPrice(Math.max.apply(null,prices)-Math.min.apply(null,prices),liveFor(products[0]).currency || 'CZK')+'.':'Ceny sa načítajú z produktových stránok.';
      return '<div class="mbpc__insights"><div class="mbpc__insight"><strong>Formy</strong>'+escapeHtml(forms.length===1?'Všetky produkty majú formu '+forms[0]+'.':'Porovnávate '+forms.length+' rôzne formy: '+forms.join(', ')+'.')+'</div><div class="mbpc__insight"><strong>Spoločné vlastnosti</strong>'+escapeHtml(common.length?common.join(', ')+'.':'Vybrané produkty nemajú spoločnú stravovaciu vlastnosť potvrdenú pri všetkých položkách.')+'</div><div class="mbpc__insight"><strong>Účinné látky a cena</strong>'+escapeHtml(shared.length?'Spoločné deklarované látky: '+shared.slice(0,3).map(function(id){return SUBSTANCES[id]?SUBSTANCES[id].label:id;}).join(', ')+(shared.length>3?'…':'')+'. ': '')+escapeHtml(priceText)+'</div></div>';
    }

    function renderIngredientTable(products) {
      const ids=new Set();
      products.forEach(function(p){Object.keys(p.dailyAmounts||{}).forEach(function(id){ids.add(id);});});
      if (!ids.size) return '';
      const sorted=Array.from(ids).sort(function(a,b){return ((SUBSTANCES[a]&&SUBSTANCES[a].order)||9999)-((SUBSTANCES[b]&&SUBSTANCES[b].order)||9999);});
      let lastGroup=''; let rows='';
      sorted.forEach(function(id){
        const def=SUBSTANCES[id] || {label:id,group:'Ďalšie látky',unit:'',order:9999};
        if (def.group!==lastGroup) { lastGroup=def.group; rows+='<tr class="mbpc__group-row"><th colspan="'+(products.length+1)+'">'+escapeHtml(lastGroup)+'</th></tr>'; }
        const values=products.map(function(p){return p.dailyAmounts && Object.prototype.hasOwnProperty.call(p.dailyAmounts,id)?Number(p.dailyAmounts[id]):null;});
        const normalized=values.map(function(v){return v==null?'':String(v);});
        const differs=new Set(normalized).size>1;
        rows+='<tr><th class="mbpc__row-label">'+escapeHtml(def.label)+'</th>'+products.map(function(p,index){
          const value=values[index];
          if (value==null) return '<td '+(state.highlight&&differs?'class="mbpc__difference"':'')+'><span class="mbpc__unknown">—</span></td>';
          const nrv=def.nrv?'<span class="mbpc__nrv">'+formatNumber(value/def.nrv*100)+' % RHP</span>':'';
          return '<td '+(state.highlight&&differs?'class="mbpc__difference"':'')+'><span class="mbpc__amount">'+formatNumber(value)+' '+escapeHtml(def.unit || '')+'</span>'+nrv+'</td>';
        }).join('')+'</tr>';
      });
      return '<h3 class="mbpc__ingredient-title">Deklarované účinné látky</h3><p class="mbpc__ingredient-note">Množstvá sú prepočítané na východiskovú dennú dávku uvedenú v databáze nástroja. Pri zvýhodnených balíčkoch sa súčty z jednotlivých produktov zámerne nepočítajú; na to slúži samostatná Kontrola prekryvu účinných látok.</p><div class="mbpc__table-wrap"><table class="mbpc__table"><thead><tr><th class="mbpc__row-label">Účinná látka</th>'+products.map(function(p){return '<th class="mbpc__product-head">'+escapeHtml(p.name)+'</th>';}).join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div>';
    }

    function renderComparison() {
      let section=app.querySelector('[data-role="comparison"]');
      if (!state.comparisonVisible || state.selected.length<2) { if (section) section.remove(); return; }
      const products=selectedProducts();
      products.forEach(function(p){hydrate(p.id);});
      const rows=comparisonRows(products).filter(function(row){
        if (!state.hideSame) return true;
        const vals=products.map(row.norm);
        return new Set(vals).size>1;
      });
      const tableRows=rows.map(function(row){
        const vals=products.map(row.norm); const differs=new Set(vals).size>1;
        return '<tr><th class="mbpc__row-label">'+escapeHtml(row.label)+'</th>'+products.map(function(p){return '<td '+(state.highlight&&differs?'class="mbpc__difference"':'')+'>'+displayValue(row.get(p))+'</td>';}).join('')+'</tr>';
      }).join('');
      const html='<section class="mbpc__section mbpc__comparison"><div class="mbpc__compare-tools"><div><h3 class="mbpc__section-title" style="margin-bottom:4px">Výsledné porovnanie</h3><div class="mbpc__section-note" style="margin:0">Tabuľka nezvýhodňuje jeden produkt ako „lepší“. Ukazuje iba rozdiely v deklarovaných vlastnostiach.</div></div><div class="mbpc__options"><label class="mbpc__check"><input type="checkbox" data-option="highlight" '+(state.highlight?'checked':'')+'> Zvýrazniť rozdiely</label><label class="mbpc__check"><input type="checkbox" data-option="hideSame" '+(state.hideSame?'checked':'')+'> Skryť zhodné riadky</label><button type="button" class="mbpc__button" data-action="share">Kopírovať odkaz</button><button type="button" class="mbpc__button" data-action="print">Tlač / PDF</button></div></div>'+insightCards(products)+'<div class="mbpc__table-wrap"><table class="mbpc__table"><thead><tr><th class="mbpc__row-label">Parameter</th>'+products.map(function(p){return '<th class="mbpc__product-head">'+productHeader(p)+'</th>';}).join('')+'</tr></thead><tbody>'+tableRows+'</tbody></table></div>'+renderIngredientTable(products)+'<div class="mbpc__footnotes"><p><strong>Dôležité:</strong> Porovnanie má informačný charakter a nenahrádza etiketu ani individuálne odporúčanie lekára alebo lekárnika. Pred nákupom vždy otvorte detail produktu a overte aktuálne zloženie, dávkovanie a upozornenia.</p><p>RHP je referenčná hodnota príjmu, nie odporúčaná individuálna dávka ani maximálna bezpečná hranica.</p><p class="mbpc__screen-only">Produktová databáza bola naposledy overená '+DATA_VERIFIED_AT+'. Cena, dostupnosť, obrázok a hodnotenie sa pri otvorení porovnania načítavajú z aktuálnej produktovej stránky, ak je táto funkcia zapnutá.</p></div></section>';
      const wrapper=document.createElement('div');wrapper.setAttribute('data-role','comparison');wrapper.innerHTML=html;
      if (section) section.replaceWith(wrapper); else app.appendChild(wrapper);
      section=wrapper;
    }

    function copyShareLink() {
      updateHash(state.selected);
      const text=window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function(){setStatus('Odkaz na porovnanie bol skopírovaný.');}).catch(fallback);
      else fallback();
      function fallback(){
        const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();
        try { document.execCommand('copy'); setStatus('Odkaz na porovnanie bol skopírovaný.'); } catch(e) { setStatus('Odkaz sa nepodarilo zkopírovat.'); }
        area.remove();
      }
    }

    function render() { renderSelector(); renderTray(); renderComparison(); }

    app.addEventListener('click',function(e){
      const target=e.target.closest('[data-action]'); if (!target) return;
      const action=target.getAttribute('data-action');
      if (action==='toggle') { e.preventDefault(); toggleProduct(target.getAttribute('data-id')); }
      else if (action==='preset') { loadPreset(target.getAttribute('data-id')); }
      else if (action==='clear-filters') clearFilters();
      else if (action==='clear-selection') clearSelection();
      else if (action==='show-more') { state.visibleCount+=12; renderSelector(); }
      else if (action==='compare') showComparison();
      else if (action==='share') copyShareLink();
      else if (action==='print') window.print();
      else if (action==='add-cart') emit('mb_compare_add_to_cart');
      else if (action==='product-link') emit('mb_compare_product_click');
    });

    app.addEventListener('change',function(e){
      if (e.target.matches('[data-filter="category"]')) { state.category=e.target.value;state.visibleCount=12;renderSelector(); }
      else if (e.target.matches('[data-filter="goal"]')) { state.goal=e.target.value;state.visibleCount=12;renderSelector(); }
      else if (e.target.matches('[data-filter="feature"]')) { state.feature=e.target.value;state.visibleCount=12;renderSelector(); }
      else if (e.target.matches('[data-option="highlight"]')) { state.highlight=e.target.checked;renderComparison(); }
      else if (e.target.matches('[data-option="hideSame"]')) { state.hideSame=e.target.checked;renderComparison(); }
    });

    state.selected.forEach(hydrate);
    render();
  }

  function mount() {
    injectStyles();
    document.querySelectorAll(ROOT_SELECTOR).forEach(function(root){ if (!root.__mbpcMounted) { root.__mbpcMounted=true; createApp(root); } });
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();

  window.MyBearsProductComparison={version:VERSION,mount:mount,products:PRODUCTS.slice()};
})();
