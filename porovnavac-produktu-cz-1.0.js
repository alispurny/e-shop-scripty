/**
 * MyBears — sjednocená grafická verze 3.0 (CZ)
 * Vizuální systém vychází z MyBears Product Guide v1.8.
 * Funkční logika původního nástroje zůstává zachována.
 */
/**
 * MyBears – Interaktivní porovnání produktů
 * Version: 2.0.0-cz
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

/* Final MyBears comparator design derived from overlap checker templates */
.mbpc,.mbpc *,.mbpc *::before,.mbpc *::after{box-sizing:border-box!important;font-family:Arial,Helvetica,sans-serif!important}
.mbpc{--green:#2dc26b!important;--green-dark:#198d4b!important;--soft:#faf7ef!important;--green-soft:#f4f8f4!important;--line:#e5e3dc!important;--yellow:#DBC442!important;--yellow-soft:#fff8df!important;max-width:1120px!important;margin:24px auto 42px!important;color:#000!important;font-size:16px!important;line-height:1.5!important}
.mbpc__shell{position:relative!important;border:1px solid var(--line)!important;border-top:0!important;border-radius:18px!important;background:#fff!important;box-shadow:0 12px 32px rgba(27,35,29,.07)!important;overflow:hidden!important}
.mbpc__shell::before{content:""!important;position:absolute!important;z-index:5!important;top:0!important;left:0!important;right:0!important;height:4px!important;background:var(--yellow)!important}
.mbpc__hero{padding:32px 24px!important;background:var(--soft)!important;border-bottom:1px solid var(--line)!important;text-align:center!important}
.mbpc__title,.mbpc__section-title,.mbpc__card-title,.mbpc__panel-head h2,.mbpc__panel-head h3,.mbpc__ingredient-title,.mbpc__product-name,.mbpc__row-label,.mbpc__insight strong{color:#000!important}
.mbpc__lead,.mbpc__privacy,.mbpc__meta,.mbpc__section-intro,.mbpc__section-note,.mbpc__section-help,.mbpc__description,.mbpc__footnotes,.mbpc__note,.mbpc__card-summary,.mbpc__card-category,.mbpc__count,.mbpc__ingredient-note{color:#000!important}
.mbpc__title{max-width:850px!important;margin:0 auto 12px!important;font-size:clamp(27px,4vw,38px)!important;line-height:1.18!important}
.mbpc__lead{max-width:900px!important;margin:0 auto!important}
.mbpc__privacy{background:#fff!important}
.mbpc__body{padding:clamp(18px,3.5vw,38px)!important}
.mbpc button,.mbpc input,.mbpc select,.mbpc textarea{font-family:Arial,Helvetica,sans-serif!important;color:#000!important;-webkit-text-fill-color:currentColor!important}
.mbpc__filters,.mbpc__catalog-head,.mbpc__panel,.mbpc__profile{border-color:var(--line)!important;background:var(--soft)!important;box-shadow:none!important}
.mbpc__card,.mbpc__analysis-card,.mbpc__preset,.mbpc__series-btn,.mbpc__tray-item,.mbpc__selected,.mbpc__insight,.mbpc__table-wrap{border-color:var(--line)!important;border-radius:12px!important;box-shadow:none!important}
.mbpc__card.is-selected,.mbpc__card--selected{background:var(--green-soft)!important;border-color:var(--green)!important}
.mbpc__preset,.mbpc__button,.mbpc__select-product,.mbpc__detail-link{border-radius:8px!important;color:#000!important}
.mbpc__button--primary,.mbpc__select-product:not(.mbpc__select-product--remove){background:var(--green)!important;border-color:var(--green)!important;color:#000!important;-webkit-text-fill-color:#000!important}
.mbpc__button--primary:hover,.mbpc__select-product:not(.mbpc__select-product--remove):hover{background:var(--green-dark)!important;border-color:var(--green-dark)!important;color:#000!important}
.mbpc__button--secondary,.mbpc__select-product--remove{background:#fff!important;border-color:var(--green)!important;color:#000!important}
.mbpc__button--ghost,.mbpc__detail-link,.mbpc__preset{background:#fff!important;color:#000!important}
.mbpc__tag,.mbpc__chip,.mbpc__hero-chip{background:var(--soft)!important;border-color:#e5dfd1!important;color:#000!important}
.mbpc__tag--green{background:var(--green-soft)!important;border-color:#bde7ca!important;color:#000!important}
.mbpc__card-top{display:grid!important;grid-template-columns:96px minmax(0,1fr)!important;gap:14px!important;align-items:start!important}
.mbpc__card-media{position:relative!important;width:96px!important;height:96px!important;border:1px solid var(--line)!important;border-radius:14px!important;background:#fff!important;overflow:hidden!important;box-shadow:0 5px 14px rgba(0,0,0,.06)!important}
.mbpc__card-image{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#fff!important}
.mbpc__card-image:not(.is-live){object-fit:contain!important;padding:6px!important}
.mbpc__card-badge{position:absolute!important;left:6px!important;right:6px!important;bottom:6px!important;padding:4px 6px!important;border:1px solid var(--line)!important;border-radius:999px!important;background:rgba(255,255,255,.94)!important;color:#000!important;font-size:10px!important;font-weight:700!important;line-height:1.2!important;text-align:center!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.mbpc__card-copy{min-width:0!important}
.mbpc__product-image,.mbpc__product-placeholder{width:150px!important;height:150px!important;object-fit:contain!important;border:1px solid var(--line)!important;border-radius:14px!important;background:#fff!important;padding:6px!important}
.mbpc__product-image.is-live{object-fit:cover!important;padding:0!important}
.mbpc__table thead th{background:#20231f!important;color:#fff!important;-webkit-text-fill-color:#fff!important;border-bottom:2px solid var(--yellow)!important}
.mbpc__table tbody tr:nth-child(even){background:var(--green-soft)!important}
.mbpc__difference{background:var(--yellow-soft)!important}
.mbpc__price,.mbpc__product-price,.mbpc__selected-price,.mbpc__total-row--main strong,.mbpc__amount,.mbpc__nrv,.mbpc__yes,.mbpc__no,.mbpc__unknown{color:#000!important}
.mbpc__notice,.mbpc__insight,.mbpc__discount-note,.mbpc__footnotes{border-color:#eadfc8!important;border-left-color:var(--yellow)!important;background:var(--soft)!important;color:#000!important}
.mbpc__button:focus-visible,.mbpc__select-product:focus-visible,.mbpc__detail-link:focus-visible,.mbpc__preset:focus-visible,.mbpc input:focus-visible,.mbpc select:focus-visible,.mbpc a:focus-visible{outline:3px solid rgba(219,196,66,.38)!important;outline-offset:2px!important}
@media(max-width:760px){.mbpc__shell{margin:18px auto 30px!important;border-radius:15px!important}.mbpc__hero{padding:28px 20px 22px!important}.mbpc__body{padding:24px 20px 28px!important}.mbpc__card-top{grid-template-columns:80px minmax(0,1fr)!important}.mbpc__card-media{width:80px!important;height:80px!important}}
@media(prefers-reduced-motion:reduce){.mbpc *,.mbpc *::before,.mbpc *::after{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
`;


  const VERSION = '3.0.0-cz';
  const DATA_VERIFIED_AT = '2026-08-05';
  const ROOT_SELECTOR = '[data-mybears-product-comparison], #mybears-product-comparison';
  const STYLE_ID = 'mbpc-styles-v3-cz';
  const PRODUCTS = [{"id":"sleep-gummies","name":"Gumoví medvídci Kvalitní spánek","url":"/p/gumovi-medvidci-kvalitni-spanek","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"sleep":100,"calm":35},"priority":95,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"lesní ovoce","package":"60 medvídků","dose":"1–2 medvídci přibližně 60 minut před spaním","supply":"30–60 dní","summary":"Bezcukrové gummies pro večerní rutinu bez melatoninu.","keyIngredients":["griffonie 25:1 (zdroj 5-HTP)","meduňka 10:1","heřmánek 5:1","zinek","vitamín B6"],"warnings":["Nekombinovat bez konzultace s léky nebo doplňky ovlivňujícími serotonin.","Při užívání sedativ či léčbě se poraďte s lékařem nebo lékárníkem."],"facts":["bez melatoninu","večerní užívání"],"category":"Gummies","goalLabels":["spánek a večerní rutina","klid a psychická pohoda"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 medvídci","dailyAmounts":{"griffonia":40.0,"zinc":10.0,"lemon_balm":30.0,"chamomile":30.0,"b6":0.7},"compositionWarnings":["Při užívání antidepresiv, léků ovlivňujících serotonin nebo sedativ konzultujte kombinaci s lékařem nebo lékárníkem."],"detailTags":["Vegan","Halal","Bez cukru","Bez lepku"],"msgFree":false},{"id":"skin-30-gummies","name":"Gumoví medvídci Krásná a zdravá pleť 30+","url":"/p/gumovi-medvidci-krasna-a-zdrava-plet-30","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"mature_skin":100,"beauty":68,"daily":12},"priority":80,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"lesní ovoce","package":"60 medvídků","dose":"1–2 medvídci denně","supply":"30–60 dní","summary":"Antioxidační a vitaminová kombinace zaměřená na pleť.","keyIngredients":["extrakt z borové kůry 30:1","extrakt z hroznových jader 20:1","koenzym Q10","vitamín C","selen","vitamín B5"],"warnings":[],"facts":["zaměření na pleť 30+","antioxidační složky"],"category":"Gummies","goalLabels":["péče o pleť 30+","vlasy, pokožka a nehty","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 medvídci","dailyAmounts":{"pine_bark":1500.0,"grape_seed":1300.0,"vitamin_c":80.0,"coq10":10.0,"b5":6.0,"selenium":55.0,"vitamin_d":10.0},"compositionWarnings":[],"detailTags":["Vegan","Bez lepku"],"msgFree":false},{"id":"hsn-gummies","name":"Gumoví medvídci Zdravé vlasy, kůže a nehty","url":"/p/gumovi-medvidci-zdrave-vlasy-kuze-a-nehty","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"beauty":100,"mature_skin":45,"daily":18},"priority":92,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"jahoda","package":"60 medvídků","dose":"1–2 medvídci denně","supply":"30–60 dní","summary":"Multivitaminové gummies se zinkem, selenem a biotinem.","keyIngredients":["biotin","zinek","selen","vitamíny C a E","vitamín A","vitamín D3","vitamín B6"],"warnings":[],"facts":["komplex pro vlasy, pokožku a nehty"],"category":"Gummies","goalLabels":["vlasy, pokožka a nehty","péče o pleť 30+","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 medvídci","dailyAmounts":{"vitamin_c":80.0,"zinc":10.0,"selenium":55.0,"vitamin_e":12.0,"vitamin_d":5.0,"vitamin_a":800.0,"b6":1.4,"biotin":150.0},"compositionWarnings":[],"detailTags":["Vegan","Halal","Bez lepku"],"msgFree":false},{"id":"kids-omega-multi","name":"Gumoví medvídci Omega 3 & Multivitamin pro děti","url":"/p/gumovi-medvidci-omega-3-multivitamin-pro-deti","kind":"single","audiences":["child"],"forms":["gummies"],"goals":{"child_daily":100,"immunity":56,"daily":55},"priority":100,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"pomeranč","package":"30 medvídků","dose":"1–2 medvídci denně pro děti od 3 let","supply":"15–30 dní","summary":"Dětská kombinace omega-3 z lněného oleje a vitaminů od 3 let.","keyIngredients":["omega-3 z lněného oleje","vitamíny A, C, D3 a E","vitamíny B3, B5, B6 a B12"],"warnings":["Určeno pro děti od 3 let.","Obsahuje želatinu, proto není vhodný pro vegany ani vegetariány.","Rostlinné omega-3 není zdrojem EPA a DHA jako rybí olej."],"facts":["pro děti od 3 let","rostlinný zdroj omega-3"],"category":"Gummies","goalLabels":["vitamíny a omega-3 pro dítě","imunita","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["děti od 3 let"],"components":[],"defaultDoseLabel":"1 medvídek","dailyAmounts":{"omega3_plant":100.0,"vitamin_c":60.0,"niacin":8.0,"vitamin_e":6.0,"b5":6.0,"b12":2.5,"b6":1.4,"vitamin_a":400.0,"vitamin_d":2.5},"compositionWarnings":["Pro dítě vždy respektujte dávkování podle věku a další doplňky konzultujte s pediatrem."],"detailTags":["Bez lepku"],"msgFree":false},{"id":"active-brain-gummies","name":"Gumoví medvídci Aktivní mozek","url":"/p/gumovi-medvidci-aktivni-mozek","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"focus":100,"energy":62,"daily":18},"priority":88,"vegan":true,"sugarFree":false,"glutenFree":false,"halal":false,"caffeine":true,"flavor":"krvavý pomeranč","package":"60 medvídků","dose":"1–2 medvídci denně, ideálně ráno","supply":"30–60 dní","summary":"Gummies s vitaminy skupiny B, železem, houbami a zeleným čajem.","keyIngredients":["Lion’s Mane 5:1","Cordyceps 1:1","ženšen 4:1","zelený čaj 10:1","vitamíny B1, B5, B6 a B12","železo"],"warnings":["Obsahuje extrakt ze zeleného čaje; při citlivosti na stimulační látky zvolte jiný produkt."],"facts":["doporučené ranní užívání","obsahuje zelený čaj"],"category":"Gummies","goalLabels":["soustředění a mentální výkon","energie a aktivní režim","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 medvídci","dailyAmounts":{"b1":1.1,"b5":5.0,"b6":1.4,"b12":2.5,"iron":6.0,"lions_mane":250.0,"cordyceps":100.0,"ginseng":80.0,"green_tea":50.0},"compositionWarnings":["Obsahuje extrakt ze zeleného čaje a ženšen; při citlivosti na stimulanty nebo užívání léků zkontrolujte vhodnost kombinace."],"detailTags":["Vegan"],"msgFree":false},{"id":"preworkout-gummies","name":"Gumoví medvídci Nakopávač – Pre-workout","url":"/p/gumovi-medvidci-nakopavac-preworkout","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"sport":100,"energy":78},"priority":89,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":true,"flavor":"borůvka","package":"60 medvídků","dose":"1–3 medvídci 20–30 minut před fyzickou aktivitou","supply":"20–60 dávek","summary":"Předtréninkové gummies s citrulinem, taurinem, zeleným čajem a kofeinem.","keyIngredients":["L-citrulin","taurin","kofein ze zeleného čaje","vitamín B6","niacin"],"warnings":["Obsahuje kofein; není vhodné pro děti, těhotné a kojící ženy ani osoby citlivé na kofein.","Obsahuje želatinu, proto není veganský."],"facts":["3 gummies obsahují 15 mg kofeinu","užití před aktivitou"],"category":"Gummies","goalLabels":["sport a fyzická výkonnost","energie a aktivní režim"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"3 medvídci","dailyAmounts":{"l_citrulline":600.0,"taurine":300.0,"green_tea":60.0,"caffeine":15.0,"niacin":2.25,"b6":1.0499999999999998},"compositionWarnings":["Obsahuje kofein. Započítejte také kávu, energetické nápoje, čaj a další zdroje kofeinu."],"detailTags":["Bez lepku"],"msgFree":false},{"id":"acv-gummies","name":"Gumoví medvídci Jablečný ocet + chrom + vitamín C","url":"/p/gumovi-medvidci-na-hubnuti-traveni-detox","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"digestion":82,"daily":25,"energy":12},"priority":70,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"jablko","package":"60 medvídků","dose":"1 medvídek denně","supply":"60 dní","summary":"Gummies s jablečným octem, vitaminem C a chromem.","keyIngredients":["500 mg prášku z jablečného octa","vitamín C","chrom"],"warnings":["Průvodce nepřisuzuje produktu účinek na hubnutí; doporučení vychází pouze ze složení a preferované oblasti."],"facts":["1 medvídek denně"],"category":"Gummies","goalLabels":["trávení a mikroflóra","každodenní základ","energie a aktivní režim"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"1 medvídek","dailyAmounts":{"apple_cider_vinegar":500.0,"vitamin_c":20.0,"chromium":6.0},"compositionWarnings":["Při diabetu nebo užívání léků ovlivňujících glykemii konzultujte kombinaci s lékařem."],"detailTags":["Vegan","Halal","Bez lepku"],"msgFree":false},{"id":"relax-gummies","name":"Gumoví medvídci Pohodička – Relax","url":"/p/gumovi-medvidci-pohodicka-relax","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"calm":100,"sleep":30,"daily":10},"priority":91,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"černý rybíz a lesní ovoce","package":"60 medvídků","dose":"1–2 medvídci denně","supply":"30–60 dní","summary":"Kombinace meduňky, L-theaninu, heřmánku, vitaminu E a B6.","keyIngredients":["meduňka","L-theanin","heřmánek","vitamín E","vitamín B6"],"warnings":[],"facts":["bez kofeinu"],"category":"Gummies","goalLabels":["klid a psychická pohoda","spánek a večerní rutina","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 medvídci","dailyAmounts":{"lemon_balm":45.0,"l_theanine":30.0,"vitamin_e":12.0,"chamomile":10.0,"b6":1.4},"compositionWarnings":["Při současném užívání sedativ nebo léků na spánek konzultujte kombinaci s odborníkem."],"detailTags":["Vegan","Halal","Bez lepku"],"msgFree":false},{"id":"mood-gummies","name":"Gumoví medvídci Dobrá náladička","url":"/p/gumovi-medvidci-dobra-naladicka","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"calm":88,"energy":28,"daily":15},"priority":84,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"pomeranč","package":"60 medvídků","dose":"1–2 medvídci denně","supply":"30–60 dní","summary":"Adaptogenní kombinace L-theaninu, ašvagandy, rozchodnice a vitaminů B.","keyIngredients":["L-theanin","ashwagandha 10:1","rozchodnice růžová 6:1","vitamíny skupiny B"],"warnings":["Při léčbě, těhotenství nebo kojení konzultujte užívání adaptogenů s lékařem."],"facts":["adaptogenní rostlinné extrakty"],"category":"Gummies","goalLabels":["klid a psychická pohoda","energie a aktivní režim","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 medvídci","dailyAmounts":{"l_theanine":88.0,"ashwagandha":100.0,"rhodiola":50.0,"niacin":8.0,"b6":0.86,"b2":0.74,"b1":0.6,"b12":0.6},"compositionWarnings":["Ašvagandu a rozchodnici konzultujte při onemocnění štítné žlázy, autoimunitním onemocnění, jaterních potížích, těhotenství, kojení nebo při užívání léků."],"detailTags":["Vegan","Halal","Bez lepku"],"msgFree":false},{"id":"probiotic-gummies","name":"Gumoví medvídci Zdravá střevní mikroflóra","url":"/p/gumovi-medvidci-zdrava-strevni-mikroflora","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"digestion":100,"immunity":28,"daily":18},"priority":96,"vegan":false,"sugarFree":true,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"jahoda","package":"60 medvídků","dose":"1 medvídek denně","supply":"60 dní","summary":"Probiotické gummies s Bacillus coagulans a vitaminem C.","keyIngredients":["Bacillus coagulans MTCC 5856","1 miliarda CFU v denní dávce","vitamín C"],"warnings":["Obsahuje želatinu, proto není veganský."],"facts":["bez cukru","1 medvídek denně"],"category":"Gummies","goalLabels":["trávení a mikroflóra","imunita","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"1 medvídek","dailyAmounts":{"bacillus_coagulans":1.0,"vitamin_c":40.0},"compositionWarnings":[],"detailTags":["Bez cukru","Bez lepku"],"msgFree":false},{"id":"immunity-gummies","name":"Gumoví medvídci Silná imunita","url":"/p/gumovi-medvidci-silna-imunita","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"immunity":100,"daily":28},"priority":94,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"malina","package":"60 medvídků","dose":"1–2 medvídci denně","supply":"30–60 dní","summary":"Vitamin C, zinek, selen a vitamin B6 v gummies.","keyIngredients":["vitamín C","zinek","selen","vitamín B6"],"warnings":[],"facts":["2 gummies obsahují 160 mg vitamínu C"],"category":"Gummies","goalLabels":["imunita","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 medvídci","dailyAmounts":{"vitamin_c":160.0,"zinc":4.0,"selenium":22.0,"b6":0.6},"compositionWarnings":[],"detailTags":["Vegan","Halal","Bez lepku"],"msgFree":false},{"id":"multivitamin-gummies","name":"Gumoví medvídci Multivitamin","url":"/p/gumovi-medvidci-multivitamin","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"daily":100,"immunity":42,"energy":32,"beauty":20},"priority":86,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"jahoda","package":"60 medvídků","dose":"1–2 medvídci denně","supply":"30–60 dní","summary":"Široká kombinace vitaminů s jódem a biotinem.","keyIngredients":["vitamíny A, C, D3 a E","vitamíny B5, B6, B7, B9 a B12","jód","inositol","zinek ve složení"],"warnings":["Obsahuje želatinu, proto není veganský.","Při onemocnění štítné žlázy nebo užívání léků ovlivňujících její funkci konzultujte obsah jódu s lékařem nebo lékárníkem.","Při kombinaci s dalšími multivitamíny zkontrolujte celkový příjem vitamínů A a D."],"facts":["9 vitamínů a jód","1–2 medvídci denně"],"category":"Gummies","goalLabels":["každodenní základ","imunita","energie a aktivní režim","vlasy, pokožka a nehty"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 medvídci","dailyAmounts":{"vitamin_c":80.0,"vitamin_e":13.4,"b12":4.0,"b5":3.0,"b6":1.0,"vitamin_a":600.0,"folate":240.0,"biotin":60.0,"iodine":40.0,"inositol":20.0,"vitamin_d":10.0},"compositionWarnings":[],"detailTags":["Bez lepku"],"msgFree":false},{"id":"biotin-gummies","name":"Gumoví medvídci Biotin 5 mg","url":"/p/gumovi-medvidci-biotin","kind":"single","audiences":["adult"],"forms":["gummies"],"goals":{"beauty":100,"mature_skin":38},"priority":89,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"vodní meloun","package":"60 medvídků","dose":"1 medvídek denně","supply":"60 dní","summary":"Vysokodávkový biotin ve formě gummies.","keyIngredients":["biotin 5 mg (5 000 µg)"],"warnings":["Vysoké dávky biotinu mohou zkreslit některá laboratorní vyšetření; před odběrem informujte zdravotníky."],"facts":["1 medvídek denně","5 000 µg biotinu"],"category":"Gummies","goalLabels":["vlasy, pokožka a nehty","péče o pleť 30+"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"1 medvídek","dailyAmounts":{"biotin":5000.0},"compositionWarnings":["Vysoké dávky biotinu mohou zkreslit některé laboratorní testy. Informujte lékaře a laboratoř před odběrem."],"detailTags":["Vegan","Halal","Bez lepku"],"msgFree":false},{"id":"magnesium-bisglycinate","name":"Hořčík bisglycinát + vitamín B6 P5P","url":"/p/horcik-chelat-bisglycinat-vitamin-b6-p5p-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"calm":70,"sleep":58,"daily":48,"sport":38,"energy":30},"priority":99,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"bez příchuti","package":"90 kapslí","dose":"2–3 kapsle denně","supply":"30–45 dní","summary":"Hořčík v bisglycinátové formě s aktivní formou vitaminu B6.","keyIngredients":["100 mg hořčíku v 1 kapsli","1,4 mg vitamínu B6 P5P v 1 kapsli"],"warnings":["Doplňky s hořčíkem mohou ovlivnit vstřebávání některých léků; dodržujte doporučený odstup podle lékaře nebo lékárníka."],"facts":["bisglycinát hořečnatý","aktivní B6 P5P"],"category":"Kapsle a softgely","goalLabels":["klid a psychická pohoda","spánek a večerní rutina","každodenní základ","sport a fyzická výkonnost","energie a aktivní režim"],"formLabels":["kapsle"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 kapsle","dailyAmounts":{"magnesium":200.0,"b6":2.8,"acacia_fiber":190.0},"compositionWarnings":[],"detailTags":["Vegan","Bez lepku","Bez přidaných glutamátů"],"msgFree":true},{"id":"iron-c-b12-b9","name":"Vitamín C + železo + B12 + B9","url":"/p/vitamin-c-zelezo-b12-b9-kyselina-listova-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"energy":82,"daily":48,"immunity":32},"priority":72,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"bez příchuti","package":"60 kapslí","dose":"1 kapsle denně","supply":"60 dní","summary":"Koncentrovaná kapsle s železem, vitaminem C, B12 a folátem.","keyIngredients":["vitamín C z aceroly 100 mg","železo AB Fortis® 20 mg","vitamín B12 50 µg (methylkobalamin)","folát 200 µg (L-methylfolát vápenatý)"],"warnings":["Železo není vhodné užívat preventivně bez znalosti potřeby; při léčbě nebo zdravotních potížích se poraďte s lékařem."],"facts":["1 kapsle denně","železo AB Fortis®"],"category":"Kapsle a softgely","goalLabels":["energie a aktivní režim","každodenní základ","imunita"],"formLabels":["kapsle"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"1 kapsle","dailyAmounts":{"vitamin_c":100.0,"iron":20.0,"b12":50.0,"folate":200.0,"acacia_fiber":130.0},"compositionWarnings":["Železo neužívejte dlouhodobě bez znalosti potřeby nebo laboratorních hodnot. Při léčbě a v těhotenství konzultujte dávku s lékařem."],"detailTags":["Vegan","Bez lepku","Bez přidaných glutamátů"],"msgFree":true},{"id":"zinc-bisglycinate","name":"Zinek chelát 25 mg","url":"/p/zinek-chelat-15-mg-bisglycinat-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"immunity":82,"beauty":55,"daily":40},"priority":90,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"bez příchuti","package":"60 kapslí","dose":"1 kapsle denně","supply":"60 dní","summary":"Jedna kapsle obsahuje 25 mg zinku v chelátové formě.","keyIngredients":["zinek bisglycinát 25 mg"],"warnings":["Dlouhodobé užívání vysoké dávky zinku konzultujte s odborníkem, zejména kvůli rovnováze mědi."],"facts":["1 kapsle denně","chelátová forma"],"category":"Kapsle a softgely","goalLabels":["imunita","vlasy, pokožka a nehty","každodenní základ"],"formLabels":["kapsle"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"1 kapsle","dailyAmounts":{"zinc":25.0,"acacia_fiber":240.0},"compositionWarnings":["Při kombinování s dalšími zdroji zinku nebo při dlouhodobém užívání zkontrolujte celkový příjem s odborníkem."],"detailTags":["Vegan","Bez lepku","Bez přidaných glutamátů"],"msgFree":true},{"id":"vitamin-d3-k2","name":"Vitamín D3 + K2 MK-7","url":"/p/vitamin-d3-2000-iu-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"daily":78,"immunity":75,"joints":18},"priority":91,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"bez příchuti","package":"60 kapslí","dose":"1 kapsle denně","supply":"60 dní","summary":"Vitamín D3 2000 IU a K2 MK-7 v jedné kapsli.","keyIngredients":["vitamín D3 50 µg / 2 000 IU","vitamín K2 MK-7"],"warnings":["Vitamín K může ovlivnit léčbu warfarinem a dalšími antikoagulancii; užívání konzultujte s lékařem."],"facts":["D3 + K2 MK-7","veganská kapsle"],"category":"Kapsle a softgely","goalLabels":["každodenní základ","imunita","klouby a pohybový aparát"],"formLabels":["kapsle"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"1 kapsle","dailyAmounts":{"vitamin_d":50.0,"vitamin_k2":75.0,"acacia_fiber":260.0},"compositionWarnings":["Vitamín K může interagovat s warfarinem a dalšími antagonisty vitaminu K. Změnu příjmu konzultujte s ošetřujícím lékařem."],"detailTags":["Vegan","Bez lepku","Bez přidaných glutamátů"],"msgFree":true},{"id":"green-mix","name":"Zelený mix 450 mg","url":"/p/zeleny-mix-450-mg-bio","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"daily":65,"energy":45,"digestion":28},"priority":75,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"bez příchuti","package":"90 kapslí","dose":"2–3 kapsle denně","supply":"20–30 dní","summary":"Směs spiruliny, chlorelly, zeleného ječmene a moringy.","keyIngredients":["spirulina 25 %","chlorella 25 %","zelený ječmen 25 %","moringa 25 %","450 mg směsi v kapsli"],"warnings":[],"facts":["směs čtyř zelených složek","4 zelené složky"],"category":"Kapsle a softgely","goalLabels":["každodenní základ","energie a aktivní režim","trávení a mikroflóra"],"formLabels":["kapsle"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 kapsle","dailyAmounts":{"spirulina":225.0,"chlorella":225.0,"green_barley":225.0,"moringa":225.0,"acacia_fiber":300.0},"compositionWarnings":[],"detailTags":["Vegan","Bez lepku","Bez přidaných glutamátů"],"msgFree":true},{"id":"omega3-softgels","name":"Omega 3 – EPA + DHA","url":"/p/omega-3-mastne-kyseliny-300-mg-epa-220-mg-dha-doplnek-stravy","kind":"single","audiences":["adult"],"forms":["softgels"],"goals":{"daily":84,"focus":55,"immunity":20},"priority":93,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"bez příchuti","package":"60 softgelů","dose":"1–2 kapsle denně s jídlem","supply":"30–60 dní","summary":"Rybí olej se standardizovaným obsahem EPA a DHA.","keyIngredients":["omega-3 celkem 550 mg","EPA 330 mg","DHA 220 mg"],"warnings":["Při užívání léků na srážlivost krve nebo před zákrokem konzultujte omega-3 s lékařem."],"facts":["rybí olej","EPA + DHA"],"category":"Kapsle a softgely","goalLabels":["každodenní základ","soustředění a mentální výkon","imunita"],"formLabels":["softgely"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 softgely","dailyAmounts":{"fish_oil":2000.0,"omega3":1100.0,"epa":660.0,"dha":440.0},"compositionWarnings":["Při léčbě ovlivňující srážlivost krve, před operací nebo při poruše srážlivosti konzultujte omega-3 s lékařem."],"detailTags":["Bez lepku"],"msgFree":false},{"id":"magnesium-malate-potassium","name":"Hořčík malát + draslík","url":"/p/horcik-malat-draslik","kind":"single","audiences":["adult"],"forms":["capsules"],"goals":{"energy":94,"sport":76,"daily":44},"priority":97,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"bez příchuti","package":"90 kapslí","dose":"2 kapsle denně","supply":"45 dní","summary":"Kombinace hořčíku v malátové formě a draslíku.","keyIngredients":["hořčík 170 mg v denní dávce","draslík 200 mg v denní dávce"],"warnings":["Při onemocnění ledvin nebo užívání léků ovlivňujících draslík konzultujte užívání s lékařem."],"facts":["2 kapsle denně","45 denních dávek"],"category":"Kapsle a softgely","goalLabels":["energie a aktivní režim","sport a fyzická výkonnost","každodenní základ"],"formLabels":["kapsle"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"2 kapsle","dailyAmounts":{"magnesium":170.0,"potassium":200.0},"compositionWarnings":["Při onemocnění ledvin nebo při užívání léků zvyšujících draslík konzultujte kombinaci s lékařem."],"detailTags":["Vegan","Bez lepku","Bez přidaných glutamátů"],"msgFree":true},{"id":"joint-collagen","name":"Kolagen na klouby","url":"/p/kolagen-na-klouby","kind":"single","audiences":["adult"],"forms":["powder"],"goals":{"joints":100,"sport":45,"daily":12},"priority":100,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"broskev","package":"30 dávek","dose":"14,10 g (1 vrchovatá odměrka) denně","supply":"30 dní","summary":"Komplexní kloubní výživa s kolagenem, glukosaminem, MSM, chondroitinem, D3 a K2.","keyIngredients":["hovězí kolagenní peptidy 8 000 mg","glukosamin 1 500 mg","MSM 1 500 mg","chondroitin 1 000 mg","kyselina hyaluronová 100 mg","boswellia 300 mg","vitamíny C, D3 a K2","kurkuma a BioPerine®"],"warnings":["Při užívání antikoagulancií, alergii na korýše, těhotenství, kojení nebo před zákrokem konzultujte složení s lékařem."],"facts":["30 dávek","hovězí kolagen"],"category":"Kolageny","goalLabels":["klouby a pohybový aparát","sport a fyzická výkonnost","každodenní základ"],"formLabels":["prášek"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"1 denní dávka","dailyAmounts":{"bovine_collagen":8000.0,"glucosamine":1500.0,"msm":1500.0,"chondroitin":1000.0,"acerola_extract":589.0,"vitamin_c":100.0,"boswellia":300.0,"boswellic_acids":210.0,"hyaluronic_acid":100.0,"turmeric":50.0,"vitamin_k2":75.0,"vitamin_d":50.0,"manganese":1.0,"copper":500.0,"bioperine":1.06,"piperine":1.0},"compositionWarnings":["Obsahuje vitamin K2, glukosamin, chondroitin, kurkumu a piperin. Při užívání léků, zejména na srážlivost krve, konzultujte kombinaci s lékařem."],"detailTags":["Bez lepku","Bez přidaných glutamátů"],"msgFree":true},{"id":"beauty-collagen","name":"Beauty kolagen","url":"/p/beauty-kolagen","kind":"single","audiences":["adult"],"forms":["powder"],"goals":{"beauty":100,"mature_skin":82,"daily":20},"priority":99,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":false,"caffeine":false,"flavor":"mango","package":"30 dávek","dose":"8,84 g (3/4 odměrky) denně","supply":"30 dní","summary":"Rybí kolagen s MSM, vitaminem C, keratinem, kyselinou hyaluronovou a beauty mikronutrienty.","keyIngredients":["rybí kolagenní peptidy 5 000 mg","vitamín C z aceroly","keratin","MSM","kyselina hyaluronová","koenzym Q10","zinek, selen a biotin","lyofilizované mango"],"warnings":["Nevhodné při alergii na ryby."],"facts":["30 dávek","rybí kolagen"],"category":"Kolageny","goalLabels":["vlasy, pokožka a nehty","péče o pleť 30+","každodenní základ"],"formLabels":["prášek"],"audienceLabels":["dospělí"],"components":[],"defaultDoseLabel":"1 denní dávka","dailyAmounts":{"fish_collagen":5000.0,"msm":1000.0,"acerola_extract":589.0,"vitamin_c":100.0,"keratin":500.0,"hyaluronic_acid":200.0,"coq10":50.0,"zinc":10.0,"vitamin_e":12.0,"selenium":30.0,"biotin":150.0},"compositionWarnings":["Obsahuje rybí kolagen. Při alergii na ryby výrobek neužívejte."],"detailTags":["Bez lepku","Bez přidaných glutamátů"],"msgFree":true},{"id":"bundle-hsn-gummies","name":"Výhodný balíček Zdravé vlasy, nehty a pokožka – gummies","url":"/p/vyhodny-balicek-zdrave-vlasy-nehty-a-pokozka-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["gummies"],"goals":{"beauty":100,"mature_skin":48},"priority":94,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":true,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Dvojice beauty gummies pro komplexní péči o vlasy, pokožku a nehty.","keyIngredients":["Gummies Zdravé vlasy, kůže a nehty","Gummies Biotin 5 mg"],"warnings":["Vysoké dávky biotinu mohou ovlivnit laboratorní testy."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["vlasy, pokožka a nehty","péče o pleť 30+"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":["hsn-gummies","biotin-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-digestion","name":"Výhodný balíček Trávení & střevní mikroflóra","url":"/p/vyhodny-balicek-traveni-strevni-mikroflora-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["gummies"],"goals":{"digestion":100,"daily":22},"priority":90,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Kombinace gummies s jablečným octem a probiotickými kulturami.","keyIngredients":["Gummies Jablečný ocet + chrom + vitamín C","Probiotické gummies Zdravá střevní mikroflóra"],"warnings":["Probiotické gummies obsahují želatinu; celý balíček proto není veganský."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["trávení a mikroflóra","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["dospělí"],"components":["acv-gummies","probiotic-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-sleep","name":"Výhodný balíček Kvalitní spánek","url":"/p/vyhodny-balicek-kvalitni-spanek-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"sleep":100,"calm":72,"daily":25},"priority":100,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Večerní kombinace hořčíku a bezcukrových gummies bez melatoninu.","keyIngredients":["Hořčík bisglycinát + B6 P5P","Bezcukrové gummies Kvalitní spánek"],"warnings":["Při užívání léků ovlivňujících serotonin nebo sedativ konzultujte gummies s odborníkem."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["spánek a večerní rutina","klid a psychická pohoda","každodenní základ"],"formLabels":["kapsle","gummies"],"audienceLabels":["dospělí"],"components":["magnesium-bisglycinate","sleep-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-zinc-biotin","name":"Výhodný balíček Zinek + Biotin gummies","url":"/p/vyhodny-balicek-zdrave-vlasy-nehty-a-pokozka-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"beauty":100,"immunity":45},"priority":93,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Kombinace zinku a vysokodávkového biotinu pro beauty rutinu.","keyIngredients":["Zinek chelát 25 mg","Gummies Biotin 5 mg"],"warnings":["Vysoké dávky biotinu mohou ovlivnit laboratorní testy.","Dlouhodobé užívání 25 mg zinku konzultujte s odborníkem."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["vlasy, pokožka a nehty","imunita"],"formLabels":["kapsle","gummies"],"audienceLabels":["dospělí"],"components":["zinc-bisglycinate","biotin-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-good-mood","name":"Výhodný balíček Dobrá náladička","url":"/p/vyhodny-balicek-dobra-naladicka-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"calm":100,"sleep":42,"daily":25},"priority":91,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Kombinace hořčíku, adaptogenů a L-theaninu pro klidnější rutinu.","keyIngredients":["Hořčík bisglycinát + B6 P5P","Gummies Dobrá náladička"],"warnings":["Při léčbě, těhotenství nebo kojení konzultujte adaptogeny s lékařem."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["klid a psychická pohoda","spánek a večerní rutina","každodenní základ"],"formLabels":["kapsle","gummies"],"audienceLabels":["dospělí"],"components":["magnesium-bisglycinate","mood-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-mental-2","name":"Výhodný balíček Mentální výkon 2.0","url":"/p/vyhodny-balicek-uspesne-uceni-mentalni-vykon-pri-narocnem-povolani-2-0-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"focus":100,"sleep":72,"energy":68,"calm":45},"priority":96,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"kombinace produktů","package":"3 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Tříproduktová denní a večerní rutina pro soustředění a regeneraci.","keyIngredients":["Gummies Aktivní mozek","Bezcukrové gummies Kvalitní spánek","Hořčík bisglycinát + B6 P5P"],"warnings":["Obsahuje zelený čaj.","Při léčbě ovlivňující serotonin konzultujte večerní gummies s odborníkem."],"facts":["zvýhodněný balíček","3 produkty"],"category":"Balíčky","goalLabels":["soustředění a mentální výkon","spánek a večerní rutina","energie a aktivní režim","klid a psychická pohoda"],"formLabels":["kapsle","gummies"],"audienceLabels":["dospělí"],"components":["active-brain-gummies","sleep-gummies","magnesium-bisglycinate"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-beauty-iron","name":"Výhodný balíček Krása – železo + biotin","url":"/p/vyhodny-balicek-krasa-veganske-kapsle-a-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"beauty":94,"energy":70,"daily":35},"priority":82,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Beauty balíček spojující biotin s komplexem obsahujícím železo.","keyIngredients":["Vitamín C + Železo + B12 + B9","Gummies Biotin 5 mg"],"warnings":["Železo užívejte pouze při odůvodněné potřebě.","Biotin může ovlivnit laboratorní testy."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["vlasy, pokožka a nehty","energie a aktivní režim","každodenní základ"],"formLabels":["kapsle","gummies"],"audienceLabels":["dospělí"],"components":["iron-c-b12-b9","biotin-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-detox-energy","name":"Výhodný balíček Zelený restart & energie","url":"/p/vyhodny-balicek-detox-energie-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules"],"goals":{"energy":85,"daily":72,"digestion":30},"priority":88,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Veganská kapslová kombinace hořčíku a zeleného mixu.","keyIngredients":["Hořčík bisglycinát + B6 P5P","Zelený Mix"],"warnings":[],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["energie a aktivní režim","každodenní základ","trávení a mikroflóra"],"formLabels":["kapsle"],"audienceLabels":["dospělí"],"components":["magnesium-bisglycinate","green-mix"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":true},{"id":"bundle-harmony","name":"Výhodný balíček Harmonie","url":"/p/vyhodny-balicek-harmonie-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules"],"goals":{"daily":82,"immunity":67,"calm":42},"priority":76,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Kombinace hořčíku a vitamínů D3 + K2 pro každodenní rutinu.","keyIngredients":["Hořčík bisglycinát + B6 P5P","Vitamín D3 + K2 MK-7"],"warnings":["Vitamín K může ovlivnit léčbu warfarinem."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["každodenní základ","imunita","klid a psychická pohoda"],"formLabels":["kapsle"],"audienceLabels":["dospělí"],"components":["magnesium-bisglycinate","vitamin-d3-k2"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":true},{"id":"bundle-energy","name":"Výhodný balíček Energie","url":"/p/vyhodny-balicek-energii-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules"],"goals":{"energy":88,"daily":65,"immunity":45},"priority":91,"vegan":true,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Veganská kapslová kombinace hořčíku a zinku.","keyIngredients":["Hořčík bisglycinát + B6 P5P","Zinek chelát 25 mg"],"warnings":["Dlouhodobé užívání 25 mg zinku konzultujte s odborníkem."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["energie a aktivní režim","každodenní základ","imunita"],"formLabels":["kapsle"],"audienceLabels":["dospělí"],"components":["magnesium-bisglycinate","zinc-bisglycinate"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":true},{"id":"bundle-performance","name":"Výhodný balíček Fyzická výkonnost","url":"/p/vyhodny-balicek-fyzicka-vykonnost-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"sport":100,"energy":92},"priority":93,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Kombinace hořčíku a pre-workout gummies pro sportovní rutinu.","keyIngredients":["Hořčík bisglycinát + B6 P5P","Gummies Nakopávač – pre-workout"],"warnings":["Obsahuje kofein.","Pre-workout gummies obsahují želatinu, proto celý balíček není veganský."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["sport a fyzická výkonnost","energie a aktivní režim"],"formLabels":["kapsle","gummies"],"audienceLabels":["dospělí"],"components":["magnesium-bisglycinate","preworkout-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-mental","name":"Výhodný balíček Úspěšné učení & mentální výkon","url":"/p/vyhodny-balicek-uspesne-uceni-mentalni-vykon-pri-narocnem-povolani-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","gummies"],"goals":{"focus":100,"calm":74,"energy":70},"priority":92,"vegan":true,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"kombinace produktů","package":"3 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Denní kombinace pro soustředění doplněná relaxační rutinou.","keyIngredients":["Gummies Aktivní mozek","Gummies Pohodička & Relax","Hořčík bisglycinát + B6 P5P"],"warnings":["Obsahuje zelený čaj."],"facts":["zvýhodněný balíček","3 produkty"],"category":"Balíčky","goalLabels":["soustředění a mentální výkon","klid a psychická pohoda","energie a aktivní režim"],"formLabels":["kapsle","gummies"],"audienceLabels":["dospělí"],"components":["active-brain-gummies","relax-gummies","magnesium-bisglycinate"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-family-immunity","name":"Výhodný balíček Silná imunita pro celou rodinu","url":"/p/vyhodny-balicek-silna-imunita-pro-celou-rodinu","kind":"bundle","audiences":["family","adult","child"],"forms":["gummies"],"goals":{"immunity":100,"child_daily":68,"daily":40},"priority":96,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"2 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Rodinný balíček s oddělenými gummies pro dospělé a děti od 3 let.","keyIngredients":["Gummies Silná imunita pro dospělé","Gummies Omega 3 & Multivitamín pro děti"],"warnings":["Dětský produkt je určen od 3 let.","Veganský status celého balíčku není jednoznačně potvrzen."],"facts":["zvýhodněný balíček","2 produkty"],"category":"Balíčky","goalLabels":["imunita","vitamíny a omega-3 pro dítě","každodenní základ"],"formLabels":["gummies"],"audienceLabels":["rodina","dospělí","děti od 3 let"],"components":["immunity-gummies","kids-omega-multi"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-sport","name":"Výhodný balíček Sport","url":"/p/vyhodny-balicek-sport-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","softgels","gummies"],"goals":{"sport":100,"energy":86,"daily":42,"immunity":30},"priority":98,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":true,"flavor":"kombinace produktů","package":"4 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Čtyřproduktový sportovní balíček s hořčíkem, zinkem, omega-3 a pre-workout gummies.","keyIngredients":["Hořčík bisglycinát + B6 P5P","Zinek chelát 25 mg","Omega 3 EPA + DHA","Gummies Nakopávač – pre-workout"],"warnings":["Obsahuje kofein a rybí olej; balíček není veganský.","Při antikoagulační léčbě konzultujte omega-3 s lékařem."],"facts":["zvýhodněný balíček","4 produkty"],"category":"Balíčky","goalLabels":["sport a fyzická výkonnost","energie a aktivní režim","každodenní základ","imunita"],"formLabels":["kapsle","softgely","gummies"],"audienceLabels":["dospělí"],"components":["magnesium-bisglycinate","zinc-bisglycinate","omega3-softgels","preworkout-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-immunity-capsules","name":"Výhodný balíček Imunita – kapsle","url":"/p/vyhodny-balicek-imunita-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules","softgels"],"goals":{"immunity":100,"daily":72},"priority":96,"vegan":false,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"4 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Komplexní kapslový balíček pro každodenní rutinu a imunitní oblast.","keyIngredients":["Vitamín D3 + K2 MK-7","Zinek chelát 25 mg","Hořčík bisglycinát + B6 P5P","Omega 3 EPA + DHA"],"warnings":["Obsahuje rybí olej, proto není veganský.","Vitamín K a omega-3 konzultujte při léčbě ovlivňující srážlivost krve."],"facts":["zvýhodněný balíček","4 produkty"],"category":"Balíčky","goalLabels":["imunita","každodenní základ"],"formLabels":["kapsle","softgely"],"audienceLabels":["dospělí"],"components":["vitamin-d3-k2","zinc-bisglycinate","magnesium-bisglycinate","omega3-softgels"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-vitality","name":"Výhodný balíček Vitalita","url":"/p/vyhodny-balicek-vitalita-veganske-kapsle","kind":"bundle","audiences":["adult"],"forms":["capsules","softgels"],"goals":{"daily":100,"energy":55,"immunity":62,"focus":35},"priority":92,"vegan":false,"sugarFree":true,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"3 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Každodenní kombinace hořčíku, vitamínů D3/K2 a omega-3.","keyIngredients":["Hořčík bisglycinát + B6 P5P","Vitamín D3 + K2 MK-7","Omega 3 EPA + DHA"],"warnings":["Obsahuje rybí olej, proto není veganský.","Při antikoagulační léčbě konzultujte složení s lékařem."],"facts":["zvýhodněný balíček","3 produkty"],"category":"Balíčky","goalLabels":["každodenní základ","imunita","energie a aktivní režim","soustředění a mentální výkon"],"formLabels":["kapsle","softgely"],"audienceLabels":["dospělí"],"components":["magnesium-bisglycinate","vitamin-d3-k2","omega3-softgels"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false},{"id":"bundle-immunity-mixed","name":"Výhodný balíček Imunita – kapsle + gummies","url":"/p/vyhodny-balicek-imunita-veganske-kapsle-gumovi-medvidci","kind":"bundle","audiences":["adult"],"forms":["capsules","softgels","gummies"],"goals":{"immunity":100,"daily":78},"priority":99,"vegan":false,"sugarFree":false,"glutenFree":true,"halal":null,"caffeine":false,"flavor":"kombinace produktů","package":"4 produkty v balíčku","dose":"dle dávkování jednotlivých produktů","supply":"dle jednotlivých balení","summary":"Rozšířený imunitní balíček kombinující kapsle, softgely a gummies.","keyIngredients":["Hořčík bisglycinát + B6 P5P","Vitamín D3 + K2 MK-7","Omega 3 EPA + DHA","Gummies Silná imunita"],"warnings":["Obsahuje rybí olej, proto není veganský.","Vitamín K a omega-3 konzultujte při léčbě ovlivňující srážlivost krve."],"facts":["zvýhodněný balíček","4 produkty"],"category":"Balíčky","goalLabels":["imunita","každodenní základ"],"formLabels":["kapsle","softgely","gummies"],"audienceLabels":["dospělí"],"components":["magnesium-bisglycinate","vitamin-d3-k2","omega3-softgels","immunity-gummies"],"defaultDoseLabel":null,"dailyAmounts":{},"compositionWarnings":[],"detailTags":[],"msgFree":false}];
  const SUBSTANCES = {"vitamin_a":{"label":"Vitamín A","group":"Vitamíny","unit":"µg","nrv":800,"limit":3000,"limitType":"UL","order":10,"note":"Kontrolní hranice se vztahuje na předem vytvořený vitamín A; produkty MyBears zde používají retinyl-palmitát."},"vitamin_d":{"label":"Vitamín D","group":"Vitamíny","unit":"µg","nrv":5,"limit":100,"limitType":"UL","order":20},"vitamin_e":{"label":"Vitamín E","group":"Vitamíny","unit":"mg","nrv":12,"order":30},"vitamin_k2":{"label":"Vitamín K2 (MK-7)","group":"Vitamíny","unit":"µg","nrv":75,"order":40,"special":"vitamin_k"},"vitamin_c":{"label":"Vitamín C","group":"Vitamíny","unit":"mg","nrv":80,"order":50},"b1":{"label":"Vitamín B1 (thiamin)","group":"Vitamíny","unit":"mg","nrv":1.1,"order":60},"b2":{"label":"Vitamín B2 (riboflavin)","group":"Vitamíny","unit":"mg","nrv":1.4,"order":70},"niacin":{"label":"Niacin (vitamín B3)","group":"Vitamíny","unit":"mg","nrv":16,"order":80,"note":"Horní hranice se liší podle použité formy niacinu, proto ji nástroj nevyhodnocuje."},"b5":{"label":"Kyselina pantothenová (B5)","group":"Vitamíny","unit":"mg","nrv":6,"order":90},"b6":{"label":"Vitamín B6","group":"Vitamíny","unit":"mg","nrv":1.4,"limit":12.5,"limitType":"UL","order":100},"b12":{"label":"Vitamín B12","group":"Vitamíny","unit":"µg","nrv":2.5,"order":110},"folate":{"label":"Folát / kyselina listová","group":"Vitamíny","unit":"µg","nrv":200,"limit":1000,"limitType":"UL","order":120},"biotin":{"label":"Biotin","group":"Vitamíny","unit":"µg","nrv":50,"order":130,"special":"biotin"},"iodine":{"label":"Jód","group":"Minerální látky","unit":"µg","nrv":150,"order":210},"potassium":{"label":"Draslík","group":"Minerální látky","unit":"mg","nrv":2000,"order":220,"special":"potassium"},"magnesium":{"label":"Hořčík","group":"Minerální látky","unit":"mg","nrv":375,"order":230},"iron":{"label":"Železo","group":"Minerální látky","unit":"mg","nrv":14,"limit":40,"limitType":"Bezpečná úroveň","order":240,"special":"iron"},"zinc":{"label":"Zinek","group":"Minerální látky","unit":"mg","nrv":10,"order":250,"special":"zinc"},"copper":{"label":"Měď","group":"Minerální látky","unit":"µg","nrv":1000,"order":260},"manganese":{"label":"Mangan","group":"Minerální látky","unit":"mg","nrv":2,"limit":8,"limitType":"Bezpečná úroveň","order":270},"selenium":{"label":"Selen","group":"Minerální látky","unit":"µg","nrv":55,"limit":255,"limitType":"UL","order":280},"chromium":{"label":"Chrom","group":"Minerální látky","unit":"µg","nrv":40,"order":290},"omega3_plant":{"label":"Omega-3 z lněného oleje","group":"Omega-3 a tuky","unit":"mg","order":310},"fish_oil":{"label":"Rybí olej","group":"Omega-3 a tuky","unit":"mg","order":320,"special":"omega3"},"omega3":{"label":"Omega-3 celkem","group":"Omega-3 a tuky","unit":"mg","order":330,"special":"omega3"},"epa":{"label":"EPA","group":"Omega-3 a tuky","unit":"mg","order":340,"special":"omega3"},"dha":{"label":"DHA","group":"Omega-3 a tuky","unit":"mg","order":350,"special":"omega3"},"griffonia":{"label":"Extrakt z griffonie 25:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":410,"special":"serotonin"},"lemon_balm":{"label":"Extrakt z meduňky","group":"Rostlinné extrakty a další látky","unit":"mg","order":420,"special":"sedative"},"chamomile":{"label":"Extrakt z heřmánku","group":"Rostlinné extrakty a další látky","unit":"mg","order":430,"special":"sedative"},"pine_bark":{"label":"Extrakt z borové kůry 30:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":440},"grape_seed":{"label":"Extrakt z hroznových jader 20:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":450},"coq10":{"label":"Koenzym Q10","group":"Rostlinné extrakty a další látky","unit":"mg","order":460},"lions_mane":{"label":"Hericium / Lion's Mane 5:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":470},"cordyceps":{"label":"Cordyceps 1:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":480},"ginseng":{"label":"Ženšen 4:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":490,"special":"stimulant"},"green_tea":{"label":"Extrakt ze zeleného čaje","group":"Rostlinné extrakty a další látky","unit":"mg","order":500,"special":"stimulant"},"l_citrulline":{"label":"L-citrulin","group":"Rostlinné extrakty a další látky","unit":"mg","order":510},"taurine":{"label":"Taurin","group":"Rostlinné extrakty a další látky","unit":"mg","order":520},"caffeine":{"label":"Kofein","group":"Rostlinné extrakty a další látky","unit":"mg","order":530,"special":"caffeine"},"apple_cider_vinegar":{"label":"Jablečný ocet v prášku","group":"Rostlinné extrakty a další látky","unit":"mg","order":540,"special":"glucose"},"l_theanine":{"label":"L-theanin","group":"Rostlinné extrakty a další látky","unit":"mg","order":550},"ashwagandha":{"label":"Extrakt z ašvagandy 10:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":560,"special":"ashwagandha"},"rhodiola":{"label":"Extrakt z rozchodnice 6:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":570,"special":"stimulant"},"bacillus_coagulans":{"label":"Bacillus coagulans MTCC 5856","group":"Mikroorganismy a vláknina","unit":"mld. CFU","order":610},"acacia_fiber":{"label":"Akáciová vláknina","group":"Mikroorganismy a vláknina","unit":"mg","order":620},"inositol":{"label":"Inositol","group":"Rostlinné extrakty a další látky","unit":"µg","order":580,"note":"Hodnota je převzata z aktuální deklarace produktu."},"spirulina":{"label":"Spirulina","group":"Zelené směsi","unit":"mg","order":710},"chlorella":{"label":"Chlorella","group":"Zelené směsi","unit":"mg","order":720},"green_barley":{"label":"Zelený ječmen","group":"Zelené směsi","unit":"mg","order":730},"moringa":{"label":"Moringa","group":"Zelené směsi","unit":"mg","order":740},"bovine_collagen":{"label":"Hovězí kolagenní peptidy","group":"Kolageny a kloubní látky","unit":"mg","order":810},"fish_collagen":{"label":"Rybí kolagenní peptidy","group":"Kolageny a kloubní látky","unit":"mg","order":820},"glucosamine":{"label":"Glukosamin sulfát","group":"Kolageny a kloubní látky","unit":"mg","order":830,"special":"anticoagulant"},"msm":{"label":"MSM","group":"Kolageny a kloubní látky","unit":"mg","order":840},"chondroitin":{"label":"Chondroitin sulfát","group":"Kolageny a kloubní látky","unit":"mg","order":850,"special":"anticoagulant"},"acerola_extract":{"label":"Extrakt z aceroly","group":"Rostlinné extrakty a další látky","unit":"mg","order":590},"boswellia":{"label":"Extrakt z boswellie 10:1","group":"Kolageny a kloubní látky","unit":"mg","order":860},"boswellic_acids":{"label":"Kyseliny boswellové","group":"Kolageny a kloubní látky","unit":"mg","order":870},"hyaluronic_acid":{"label":"Kyselina hyaluronová","group":"Kolageny a kloubní látky","unit":"mg","order":880},"turmeric":{"label":"Extrakt z kurkumy 4:1","group":"Kolageny a kloubní látky","unit":"mg","order":890,"special":"anticoagulant"},"bioperine":{"label":"BioPerine®","group":"Kolageny a kloubní látky","unit":"mg","order":900,"special":"medication"},"piperine":{"label":"Piperin","group":"Kolageny a kloubní látky","unit":"mg","order":910,"special":"medication"},"keratin":{"label":"Keratin","group":"Kolageny a kloubní látky","unit":"mg","order":920}};
  const PRESETS = [{"id":"magnesium","label":"Hořčíky","products":["magnesium-bisglycinate","magnesium-malate-potassium"]},{"id":"collagens","label":"Kolageny","products":["beauty-collagen","joint-collagen"]},{"id":"sleep","label":"Spánek a relax","products":["sleep-gummies","relax-gummies","mood-gummies","magnesium-bisglycinate"]},{"id":"beauty","label":"Vlasy a pokožka","products":["hsn-gummies","biotin-gummies","skin-30-gummies","beauty-collagen"]},{"id":"immunity","label":"Imunita","products":["immunity-gummies","vitamin-d3-k2","zinc-bisglycinate","multivitamin-gummies"]},{"id":"focus","label":"Soustředění a výkon","products":["active-brain-gummies","preworkout-gummies","magnesium-malate-potassium","omega3-softgels"]}];
  const GOAL_LABELS = {"sleep":"spánek a večerní rutina","calm":"klid a psychická pohoda","focus":"soustředění a mentální výkon","energy":"energie a aktivní režim","immunity":"imunita","beauty":"vlasy, pokožka a nehty","mature_skin":"péče o pleť 30+","digestion":"trávení a mikroflóra","sport":"sport a fyzická výkonnost","joints":"klouby a pohybový aparát","daily":"každodenní základ","child_daily":"vitamíny a omega-3 pro dítě"};
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
.mbpc{--green:#2dc26b;--green-dark:#16994d;--green-soft:#f2fbf5;--yellow:#f5e694;--yellow-soft:#fffbed;--text:#202522;--muted:#657069;--line:#dce5df;--soft:#f7f9f8;--white:#fff;--danger:#a83d3d;--danger-soft:#fff3f3;--shadow:0 13px 35px rgba(22,70,42,.09);font-family:Arial,Helvetica,sans-serif;font-weight:400;color:var(--text);margin:20px 0 42px;line-height:1.48}.mbpc,.mbpc *{box-sizing:border-box}.mbpc h2,.mbpc h3,.mbpc h4,.mbpc p{font-family:Arial,Helvetica,sans-serif}.mbpc strong,.mbpc b{font-weight:700}.mbpc button,.mbpc input,.mbpc select{font-family:Arial,Helvetica,sans-serif!important}.mbpc__shell{background:var(--white);border:1px solid var(--line);border-radius:16px;overflow:hidden;box-shadow:var(--shadow)}.mbpc__hero{padding:32px 28px;background:linear-gradient(135deg,var(--green-soft),#fff)}.mbpc__title{font-size:30px;line-height:1.15;margin:0 0 11px;font-weight:700;color:var(--text)}.mbpc__lead{max-width:920px;margin:0;color:var(--muted);font-size:16px;font-weight:400}.mbpc__privacy{display:inline-flex;align-items:center;gap:7px;margin-top:15px;padding:8px 11px;border-radius:9px;background:#fff;border:1px solid var(--line);font-size:13px;font-weight:700;color:#445048}.mbpc__body{padding:26px}.mbpc__section{margin-bottom:28px}.mbpc__section:last-child{margin-bottom:0}.mbpc__section-title{margin:0 0 13px;font-size:21px;line-height:1.25;font-weight:700}.mbpc__section-note{margin:-5px 0 15px;color:var(--muted);font-size:14px}.mbpc__presets{display:flex;gap:9px;flex-wrap:wrap}.mbpc__preset{border:1px solid var(--line);background:#fff;border-radius:999px;padding:9px 13px;cursor:pointer;font-weight:700;color:var(--text);transition:.18s ease}.mbpc__preset:hover,.mbpc__preset:focus-visible{border-color:var(--green);background:var(--green-soft);outline:none}.mbpc__filters{display:grid;grid-template-columns:minmax(200px,1.6fr) repeat(3,minmax(145px,1fr));gap:10px;padding:16px;border:1px solid var(--line);border-radius:12px;background:var(--soft)}.mbpc__field label{display:block;margin:0 0 6px;font-size:13px;font-weight:700;color:#374139}.mbpc__input,.mbpc__select{width:100%;height:44px;border:1px solid #cbd7cf;border-radius:9px;background:#fff;color:var(--text);padding:0 12px;font-weight:400}.mbpc__input:focus,.mbpc__select:focus{border-color:var(--green);outline:3px solid rgba(45,194,107,.13)}.mbpc__catalog-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:18px 0 10px}.mbpc__count{font-size:14px;color:var(--muted)}.mbpc__clear-filters{border:0;background:transparent;color:var(--green-dark);cursor:pointer;font-weight:700;padding:5px}.mbpc__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.mbpc__card{position:relative;display:flex;flex-direction:column;min-height:230px;border:1px solid var(--line);border-radius:13px;background:#fff;padding:15px;transition:.18s ease}.mbpc__card:hover{border-color:#b9cbbf;box-shadow:0 8px 20px rgba(22,70,42,.07)}.mbpc__card--selected{border:2px solid var(--green);padding:14px;background:var(--green-soft)}.mbpc__card--disabled{opacity:.56}.mbpc__card-top{display:flex;gap:12px;align-items:flex-start}.mbpc__icon{flex:0 0 45px;width:45px;height:45px;border-radius:11px;display:grid;place-items:center;background:var(--yellow-soft);border:1px solid #eee3a5;font-size:22px}.mbpc__card-title{margin:0;font-size:16px;line-height:1.28;font-weight:700}.mbpc__card-category{margin-top:4px;font-size:12px;color:var(--muted);font-weight:400}.mbpc__card-summary{margin:12px 0 10px;font-size:13px;color:#505b54;font-weight:400}.mbpc__tags{display:flex;flex-wrap:wrap;gap:5px;margin-top:auto}.mbpc__tag{font-size:11px;line-height:1.2;border-radius:999px;padding:5px 8px;background:var(--soft);border:1px solid var(--line);font-weight:700}.mbpc__tag--green{background:var(--green-soft);border-color:#bde7ca;color:#176c39}.mbpc__card-actions{display:grid;grid-template-columns:1fr auto;gap:8px;margin-top:13px}.mbpc__select-product{min-height:40px;border:1px solid var(--green);background:var(--green);color:#fff;border-radius:9px;padding:8px 10px;cursor:pointer;font-weight:700}.mbpc__select-product:hover,.mbpc__select-product:focus-visible{background:var(--green-dark);border-color:var(--green-dark);outline:none}.mbpc__select-product--remove{background:#fff;color:var(--green-dark)}.mbpc__detail-link{display:grid;place-items:center;min-width:40px;border:1px solid var(--line);border-radius:9px;text-decoration:none;color:var(--text);font-weight:700}.mbpc__detail-link:hover,.mbpc__detail-link:focus-visible{border-color:var(--green);background:var(--green-soft);outline:none}.mbpc__empty{padding:24px;border:1px dashed #bdc9c1;border-radius:12px;text-align:center;color:var(--muted);background:var(--soft)}.mbpc__tray{position:sticky;bottom:12px;z-index:6;margin-top:20px;border:1px solid #a8dabb;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 10px 28px rgba(22,70,42,.16);padding:13px;backdrop-filter:blur(7px)}.mbpc__tray-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.mbpc__tray-title{font-size:15px;font-weight:700}.mbpc__tray-items{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}.mbpc__tray-item{display:inline-flex;align-items:center;gap:6px;padding:6px 8px;border-radius:8px;background:var(--green-soft);border:1px solid #bde7ca;font-size:12px;font-weight:700}.mbpc__tray-remove{border:0;background:transparent;color:var(--danger);font-size:16px;line-height:1;cursor:pointer;padding:0 2px}.mbpc__tray-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.mbpc__button{min-height:42px;border-radius:9px;padding:9px 14px;border:1px solid var(--line);background:#fff;color:var(--text);cursor:pointer;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:7px}.mbpc__button:hover,.mbpc__button:focus-visible{border-color:var(--green);background:var(--green-soft);outline:none}.mbpc__button--primary{background:var(--green);border-color:var(--green);color:#fff}.mbpc__button--primary:hover,.mbpc__button--primary:focus-visible{background:var(--green-dark);border-color:var(--green-dark)}.mbpc__button:disabled{opacity:.48;cursor:not-allowed}.mbpc__status{margin-top:10px;padding:10px 12px;border-radius:9px;background:var(--yellow-soft);border:1px solid #eadc86;color:#6b5a00;font-size:13px;font-weight:700}.mbpc__comparison{scroll-margin-top:24px}.mbpc__compare-tools{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px}.mbpc__options{display:flex;gap:13px;flex-wrap:wrap}.mbpc__check{display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700}.mbpc__check input{accent-color:var(--green);width:17px;height:17px}.mbpc__table-wrap{overflow:auto;border:1px solid var(--line);border-radius:12px;background:#fff}.mbpc__table{border-collapse:separate;border-spacing:0;width:100%;min-width:850px;font-size:13px}.mbpc__table th,.mbpc__table td{padding:11px 12px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);vertical-align:top;font-weight:400}.mbpc__table tr:last-child th,.mbpc__table tr:last-child td{border-bottom:0}.mbpc__table th:last-child,.mbpc__table td:last-child{border-right:0}.mbpc__row-label{position:sticky;left:0;z-index:2;width:190px;min-width:190px;background:#f8faf9;text-align:left;font-weight:700!important}.mbpc__product-head{min-width:205px;background:#fff;text-align:center}.mbpc__product-head-inner{display:flex;flex-direction:column;align-items:center;gap:8px}.mbpc__product-image{width:92px;height:92px;object-fit:contain;border-radius:10px;background:#fff;border:1px solid var(--line)}.mbpc__product-placeholder{width:92px;height:92px;display:grid;place-items:center;border-radius:10px;background:var(--yellow-soft);border:1px solid #eee3a5;font-size:36px}.mbpc__product-name{font-size:14px;line-height:1.3;font-weight:700}.mbpc__product-price{font-size:17px;font-weight:800;color:var(--green-dark)}.mbpc__availability{font-size:12px;font-weight:700;color:var(--muted)}.mbpc__availability--in{color:#17703a}.mbpc__availability--out{color:var(--danger)}.mbpc__head-actions{display:flex;flex-direction:column;gap:6px;width:100%}.mbpc__head-actions .mbpc__button{min-height:37px;padding:7px 9px;font-size:12px}.mbpc__difference{background:var(--yellow-soft)!important}.mbpc__yes{font-weight:700;color:#176c39}.mbpc__no{font-weight:700;color:#8a3434}.mbpc__unknown{color:var(--muted)}.mbpc__list{margin:0;padding-left:17px}.mbpc__list li{margin:0 0 4px}.mbpc__list li:last-child{margin-bottom:0}.mbpc__insights{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-bottom:15px}.mbpc__insight{padding:13px;border-radius:11px;background:var(--soft);border:1px solid var(--line);font-size:13px}.mbpc__insight strong{display:block;margin-bottom:4px}.mbpc__ingredient-title{margin:25px 0 10px;font-size:20px;font-weight:700}.mbpc__ingredient-note{margin:0 0 12px;color:var(--muted);font-size:13px}.mbpc__group-row th{background:var(--green-soft);font-weight:700!important;color:#225a35}.mbpc__amount{font-weight:700}.mbpc__nrv{display:block;margin-top:3px;color:var(--muted);font-size:11px}.mbpc__footnotes{margin-top:18px;padding:15px;border-radius:11px;background:var(--soft);color:var(--muted);font-size:13px}.mbpc__footnotes p{margin:0 0 7px}.mbpc__footnotes p:last-child{margin-bottom:0}.mbpc__sr{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}@media(max-width:960px){.mbpc__filters{grid-template-columns:repeat(2,minmax(0,1fr))}.mbpc__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.mbpc__insights{grid-template-columns:1fr}.mbpc__tray-head{align-items:flex-start;flex-direction:column}}@media(max-width:620px){.mbpc{margin:14px 0 28px}.mbpc__shell{border-radius:13px}.mbpc__hero{padding:24px 15px}.mbpc__title{font-size:25px}.mbpc__body{padding:17px 12px 25px}.mbpc__filters{grid-template-columns:1fr}.mbpc__grid{grid-template-columns:1fr}.mbpc__tray{bottom:7px}.mbpc__tray-actions{width:100%}.mbpc__tray-actions .mbpc__button{flex:1}.mbpc__compare-tools{align-items:flex-start;flex-direction:column}.mbpc__options{flex-direction:column;gap:8px}.mbpc__button{min-height:44px}.mbpc__product-head{min-width:185px}.mbpc__row-label{min-width:150px;width:150px}.mbpc__table{min-width:720px}}@media print{body *{visibility:hidden!important}.mbpc,.mbpc *{visibility:visible!important}.mbpc{position:absolute;inset:0;width:100%;margin:0}.mbpc__shell{border:0;box-shadow:none}.mbpc__hero,.mbpc__section--selector,.mbpc__tray,.mbpc__compare-tools,.mbpc__head-actions,.mbpc__footnotes .mbpc__screen-only{display:none!important}.mbpc__body{padding:0}.mbpc__comparison{display:block!important}.mbpc__table{min-width:0;font-size:9px}.mbpc__table th,.mbpc__table td{padding:5px}.mbpc__row-label{position:static;min-width:120px;width:120px}.mbpc__product-image,.mbpc__product-placeholder{width:55px;height:55px}.mbpc__insights{grid-template-columns:repeat(3,1fr)} }
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
    if (product.category === 'Kolageny') return '✦';
    return '◆';
  }


  function mockupPalette(product) {
    if (product.kind === 'bundle') return {top:'#DBC442',body:'#fff8dd',accent:'#f0d66b'};
    if (product.category === 'Kolageny' || product.category === 'Kolagény') return {top:'#DBC442',body:'#fff8dd',accent:'#f0d66b'};
    if (/Kapsle|Kapsuly|softgel/i.test(product.category)) return {top:'#DBC442',body:'#f5fbf6',accent:'#cfeeda'};
    return {top:'#DBC442',body:'#fff9ea',accent:'#ffe9a7'};
  }

  function shortMockupTitle(product) {
    return String(product.name || '').replace(/^Gumov[ií] medv[ií]dci\s+/i,'').replace(/^Gumen[eé] medved[ií]ky\s+/i,'').replace(/^Výhodn[yý] bal[ií][cč]ek\s+/i,'').trim();
  }

  function wrapMockupText(text,maxLen,maxLines) {
    const words=String(text||'').split(/\s+/).filter(Boolean),lines=[];let current='';
    words.forEach(function(word){const next=current?current+' '+word:word;if(next.length>maxLen&&current){lines.push(current);current=word;}else current=next;});
    if(current) lines.push(current);return lines.slice(0,maxLines||3);
  }

  function makeProductMockup(product) {
    const palette=mockupPalette(product),lines=wrapMockupText(shortMockupTitle(product),16,3);
    const badge=product.kind==='bundle'?'MyBears SET':(/Kolagen/i.test(product.category)?'Kolagen':(/Kaps/i.test(product.category)?'Kapsle':'Gummies'));
    const svg=['<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">','<rect width="240" height="240" rx="28" fill="#ffffff"/>','<rect x="18" y="16" width="204" height="208" rx="24" fill="'+palette.body+'" stroke="#d9e3da" stroke-width="2"/>','<rect x="18" y="16" width="204" height="24" rx="24" fill="'+palette.top+'"/>','<rect x="34" y="58" width="172" height="122" rx="18" fill="#ffffff" stroke="#d9e3da" stroke-width="2"/>','<rect x="58" y="73" width="124" height="24" rx="12" fill="'+palette.accent+'"/>','<text x="120" y="30" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#000">MyBears</text>','<text x="120" y="89" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#000">'+escapeHtml(badge)+'</text>'];
    lines.forEach(function(line,index){svg.push('<text x="120" y="'+(122+index*20)+'" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="#000">'+escapeHtml(line)+'</text>');});
    svg.push('<text x="120" y="196" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#000">'+escapeHtml(product.package||'')+'</text>','</svg>');
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg.join(''));
  }

  function productImage(product,live) {
    return live && live.image ? live.image : makeProductMockup(product);
  }

  function boolLabel(value, negativeLabel) {
    if (value === true) return '<span class="mbpc__yes">Ano</span>';
    if (value === false) return '<span class="mbpc__no">' + escapeHtml(negativeLabel || 'Ne') + '</span>';
    return '<span class="mbpc__unknown">Neuvedeno</span>';
  }

  function textValue(value) {
    if (Array.isArray(value)) return value.join('|');
    if (value == null) return '';
    return String(value).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLocaleLowerCase('cs-CZ');
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
    return new Intl.NumberFormat('cs-CZ', {style:'currency',currency:currency || 'CZK',maximumFractionDigits:0}).format(Number(value));
  }

  function formatNumber(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '';
    const digits = Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 10 ? 1 : Math.abs(n) >= 1 ? 2 : 3;
    return new Intl.NumberFormat('cs-CZ',{maximumFractionDigits:digits}).format(n);
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
      else if (/OutOfStock|SoldOut/i.test(availabilityRaw)) { availability='Není skladem'; inStock=false; }
      else {
        const stockEl=doc.querySelector('.availability, [itemprop="availability"], .stock, .product-availability');
        availability=stockEl ? stockEl.textContent.trim().replace(/\s+/g,' ') : '';
        if (availability) inStock=!/není|vyprodáno|nedostup/i.test(availability);
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
      query:'',category:'Vše',goal:'Vše',feature:'Vše',
      hideSame:false,highlight:true,visibleCount:12,
      live:new Map(),status:'',comparisonVisible:initial.length>=2
    };

    root.classList.add('mbpc');
    root.setAttribute('data-mbpc-version',VERSION);
    root.innerHTML='<div class="mbpc__shell"><header class="mbpc__hero"><h2 class="mbpc__title">Porovnejte produkty MyBears vedle sebe</h2><p class="mbpc__lead">Vyberte dva až čtyři produkty. Porovnání ukáže formu, zaměření, dávkování, vlastnosti, aktuální cenu a u samostatných produktů také deklarované množství účinných látek ve výchozí denní dávce.</p><div class="mbpc__privacy">Bez registrace · výběr se neukládá</div></header><div class="mbpc__body" data-role="app"></div></div>';
    const app=root.querySelector('[data-role="app"]');

    function filteredProducts() {
      const q=state.query.trim().toLocaleLowerCase('cs-CZ');
      return PRODUCTS.filter(function (p) {
        if (state.category!=='Vše' && p.category!==state.category) return false;
        if (state.goal!=='Vše' && !Object.prototype.hasOwnProperty.call(p.goals || {},state.goal)) return false;
        if (state.feature==='vegan' && p.vegan!==true) return false;
        if (state.feature==='sugarFree' && p.sugarFree!==true) return false;
        if (state.feature==='glutenFree' && p.glutenFree!==true) return false;
        if (state.feature==='halal' && p.halal!==true) return false;
        if (state.feature==='caffeineFree' && p.caffeine!==false) return false;
        if (state.feature==='msgFree' && p.msgFree!==true) return false;
        if (!q) return true;
        const ingredientLabels=Object.keys(p.dailyAmounts || {}).map(function (id) { return SUBSTANCES[id] ? SUBSTANCES[id].label : id; });
        const hay=[p.name,p.summary,p.category,p.package,p.dose,p.flavor].concat(p.goalLabels || [],p.formLabels || [],p.keyIngredients || [],p.facts || [],ingredientLabels).join(' ').toLocaleLowerCase('cs-CZ');
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
        if (state.selected.length>=CONFIG.maxProducts) { setStatus('Můžete porovnat nejvýše '+CONFIG.maxProducts+' produkty.'); return; }
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

    function clearFilters() { state.query='';state.category='Vše';state.goal='Vše';state.feature='Vše';state.visibleCount=12;render(); }
    function clearSelection() { state.selected=[];state.comparisonVisible=false;updateHash([]);render(); }

    function hydrate(id) {
      if (!CONFIG.enableLiveProductData || state.live.has(id)) return;
      const product=PRODUCT_MAP.get(id); if (!product) return;
      state.live.set(id,{loading:true});
      fetchProductMeta(product).then(function (meta) {
        state.live.set(id,meta || {});
        if (meta && meta.image) {
          root.querySelectorAll('img[data-product-image-id="'+id+'"]').forEach(function(img){img.src=meta.image;img.classList.add('is-live');});
        }
        renderComparison(); renderTray();
      });
    }

    function scrollToComparison() {
      const el=root.querySelector('[data-role="comparison"]');
      if (!el) return;
      const top=el.getBoundingClientRect().top+window.pageYOffset-(Number(CONFIG.scrollOffset)||0);
      window.scrollTo({top:top,behavior:'smooth'});
    }

    function showComparison() {
      if (state.selected.length<2) { setStatus('Vyberte alespoň dva produkty.'); return; }
      state.comparisonVisible=true;
      state.selected.forEach(hydrate);
      renderComparison();
      window.setTimeout(scrollToComparison,20);
      emit('mb_compare_complete');
    }

    function productTags(p) {
      if (Array.isArray(p.detailTags) && p.detailTags.length) return p.detailTags.slice(0,5);
      const tags=[];
      if (p.vegan===true) tags.push('Vegan');
      if (p.sugarFree===true) tags.push('Bez cukru');
      if (p.glutenFree===true) tags.push('Bez lepku');
      if (p.halal===true) tags.push('Halal');
      return tags.slice(0,4);
    }

    function renderSelector() {
      const list=filteredProducts();
      const visible=list.slice(0,state.visibleCount);
      const cards=visible.map(function (p) {
        const selected=state.selected.indexOf(p.id)!==-1;
        const disabled=!selected && state.selected.length>=CONFIG.maxProducts;
        const tags=productTags(p).map(function (t) { return '<span class="mbpc__tag mbpc__tag--green">'+escapeHtml(t)+'</span>'; }).join('');
        const topGoal=p.goalLabels && p.goalLabels[0] ? '<span class="mbpc__tag">'+escapeHtml(p.goalLabels[0])+'</span>' : '';
        const live=liveFor(p),imageSrc=productImage(p,live); return '<article class="mbpc__card '+(selected?'mbpc__card--selected ':'')+(disabled?'mbpc__card--disabled':'')+'" data-product-card="'+escapeHtml(p.id)+'"><div class="mbpc__card-top"><div class="mbpc__card-media"><img class="mbpc__card-image'+(live.image?' is-live':'')+'" src="'+escapeHtml(imageSrc)+'" alt="'+escapeHtml(p.name)+'" loading="lazy" data-product-image-id="'+escapeHtml(p.id)+'"><span class="mbpc__card-badge">'+escapeHtml(p.category)+'</span></div><div class="mbpc__card-copy"><h4 class="mbpc__card-title">'+escapeHtml(p.name)+'</h4><div class="mbpc__card-category">'+escapeHtml(p.category)+' · '+escapeHtml(p.formLabels.join(', '))+'</div><p class="mbpc__card-summary">'+escapeHtml(p.summary)+'</p><div class="mbpc__tags">'+topGoal+tags+'</div></div></div><div class="mbpc__card-actions"><button type="button" class="mbpc__select-product '+(selected?'mbpc__select-product--remove':'')+'" data-action="toggle" data-id="'+escapeHtml(p.id)+'" '+(disabled?'disabled':'')+'>'+(selected?'Odebrat z porovnání':'Přidat k porovnání')+'</button><a class="mbpc__detail-link" href="'+escapeHtml(absoluteUrl(p.url))+'" target="_blank" rel="noopener" aria-label="Otevřít detail produktu '+escapeHtml(p.name)+'">↗</a></div></article>';
      }).join('');
      const goals=Object.keys(GOAL_LABELS).map(function (id) { return '<option value="'+escapeHtml(id)+'" '+(state.goal===id?'selected':'')+'>'+escapeHtml(GOAL_LABELS[id])+'</option>'; }).join('');
      const html='<section class="mbpc__section mbpc__section--selector"><h3 class="mbpc__section-title">Rychlá porovnání</h3><div class="mbpc__presets">'+PRESETS.map(function (p) { return '<button type="button" class="mbpc__preset" data-action="preset" data-id="'+p.id+'">'+escapeHtml(p.label)+'</button>'; }).join('')+'</div><h3 class="mbpc__section-title" style="margin-top:25px">Vyberte vlastní produkty</h3><p class="mbpc__section-note">Lze kombinovat různé kategorie. Pro přehledné zobrazení je limit nastaven na čtyři produkty.</p><div class="mbpc__filters"><div class="mbpc__field"><label for="'+uid+'-search">Hledat produkt nebo látku</label><input id="'+uid+'-search" class="mbpc__input" type="search" value="'+escapeHtml(state.query)+'" placeholder="Např. hořčík, biotin, spánek"></div><div class="mbpc__field"><label for="'+uid+'-category">Kategorie</label><select id="'+uid+'-category" class="mbpc__select" data-filter="category"><option>Vše</option>'+['Gummies','Kapsle a softgely','Kolageny','Balíčky'].map(function (x) { return '<option '+(state.category===x?'selected':'')+'>'+escapeHtml(x)+'</option>'; }).join('')+'</select></div><div class="mbpc__field"><label for="'+uid+'-goal">Zaměření</label><select id="'+uid+'-goal" class="mbpc__select" data-filter="goal"><option value="Vše">Vše</option>'+goals+'</select></div><div class="mbpc__field"><label for="'+uid+'-feature">Vlastnost</label><select id="'+uid+'-feature" class="mbpc__select" data-filter="feature"><option value="Vše" '+(state.feature==='Vše'?'selected':'')+'>Vše</option><option value="vegan" '+(state.feature==='vegan'?'selected':'')+'>Vegan</option><option value="sugarFree" '+(state.feature==='sugarFree'?'selected':'')+'>Bez cukru</option><option value="glutenFree" '+(state.feature==='glutenFree'?'selected':'')+'>Bez lepku</option><option value="halal" '+(state.feature==='halal'?'selected':'')+'>Halal</option><option value="caffeineFree" '+(state.feature==='caffeineFree'?'selected':'')+'>Bez kofeinu</option><option value="msgFree" '+(state.feature==='msgFree'?'selected':'')+'>Bez přidaných glutamátů</option></select></div></div><div class="mbpc__catalog-head"><div class="mbpc__count">Zobrazeno '+visible.length+' z '+list.length+' produktů</div><button type="button" class="mbpc__clear-filters" data-action="clear-filters">Zrušit filtry</button></div>'+(cards?'<div class="mbpc__grid">'+cards+'</div>':'<div class="mbpc__empty">Zadaným filtrům neodpovídá žádný produkt.</div>')+(visible.length<list.length?'<div style="display:flex;justify-content:center;margin-top:16px"><button type="button" class="mbpc__button" data-action="show-more">Zobrazit další produkty</button></div>':'')+'</section>';
      const old=app.querySelector('[data-role="selector"]');
      const wrap=document.createElement('div'); wrap.setAttribute('data-role','selector'); wrap.innerHTML=html;
      if (old) old.replaceWith(wrap); else app.prepend(wrap);
      visible.forEach(function(p){hydrate(p.id);});
      const search=wrap.querySelector('#'+uid+'-search');
      if (search) search.addEventListener('input',function (e) { const position=e.target.selectionStart; state.query=e.target.value; state.visibleCount=12; renderSelector(); renderTray(); const next=root.querySelector('#'+uid+'-search'); if (next) { next.focus(); try { next.setSelectionRange(position,position); } catch (err) {} } });
    }

    function renderTray() {
      const items=selectedProducts();
      const html='<div class="mbpc__tray-head"><div><div class="mbpc__tray-title">Vybráno '+items.length+' z '+CONFIG.maxProducts+'</div>'+(items.length?'<div class="mbpc__tray-items">'+items.map(function (p) { return '<span class="mbpc__tray-item">'+escapeHtml(p.name)+'<button class="mbpc__tray-remove" type="button" data-action="toggle" data-id="'+p.id+'" aria-label="Odebrat '+escapeHtml(p.name)+'">×</button></span>'; }).join('')+'</div>':'')+'</div><div class="mbpc__tray-actions"><button type="button" class="mbpc__button" data-action="clear-selection" '+(!items.length?'disabled':'')+'>Vymazat</button><button type="button" class="mbpc__button mbpc__button--primary" data-action="compare" '+(items.length<2?'disabled':'')+'>Porovnat produkty</button></div></div>'+(state.status?'<div class="mbpc__status" role="status">'+escapeHtml(state.status)+'</div>':'');
      let tray=app.querySelector('[data-role="tray"]');
      if (!tray) { tray=document.createElement('div');tray.className='mbpc__tray';tray.setAttribute('data-role','tray');app.appendChild(tray); }
      tray.innerHTML=html;
    }

    function displayValue(value) { return value == null || value==='' ? '<span class="mbpc__unknown">—</span>' : value; }

    function liveFor(p) { return state.live.get(p.id) || {}; }

    function pricePerDay(p) {
      const live=liveFor(p); const days=packageDays(p);
      if (!Number.isFinite(live.price) || !days) return '<span class="mbpc__unknown">—</span>';
      return 'přibližně '+formatPrice(live.price/days,live.currency)+'/den';
    }

    function listHtml(values) {
      const arr=(values || []).filter(Boolean);
      if (!arr.length) return '<span class="mbpc__unknown">—</span>';
      return '<ul class="mbpc__list">'+arr.map(function (x) { return '<li>'+escapeHtml(x)+'</li>'; }).join('')+'</ul>';
    }

    function comparisonRows(products) {
      return [
        {id:'price',label:'Aktuální cena',get:function(p){const l=liveFor(p);return l.loading?'Načítám…':Number.isFinite(l.price)?'<span class="mbpc__amount">'+formatPrice(l.price,l.currency)+'</span>':'Na detailu produktu';},norm:function(p){const l=liveFor(p);return Number.isFinite(l.price)?String(l.price):'';}},
        {id:'perday',label:'Orientační cena za den',get:pricePerDay,norm:function(p){const l=liveFor(p),d=packageDays(p);return Number.isFinite(l.price)&&d?String(Math.round(l.price/d*100)/100):'';}},
        {id:'availability',label:'Dostupnost',get:function(p){const l=liveFor(p);return escapeHtml(l.availability || (l.loading?'Načítám…':'Na detailu produktu'));},norm:function(p){return String(liveFor(p).availability || '');}},
        {id:'rating',label:'Hodnocení zákazníků',get:function(p){const l=liveFor(p);return Number.isFinite(l.rating)?escapeHtml(formatNumber(l.rating)+' / 5'+(l.reviewCount?' ('+l.reviewCount+' hodnocení)':'')):'—';},norm:function(p){return String(liveFor(p).rating || '');}},
        {id:'kind',label:'Typ řešení',get:function(p){return p.kind==='bundle'?'Zvýhodněný balíček':'Samostatný produkt';},norm:function(p){return p.kind;}},
        {id:'form',label:'Forma',get:function(p){return escapeHtml(p.formLabels.join(', '));},norm:function(p){return p.formLabels.join('|');}},
        {id:'audience',label:'Určení',get:function(p){return escapeHtml(p.audienceLabels.join(', '));},norm:function(p){return p.audienceLabels.join('|');}},
        {id:'goals',label:'Hlavní zaměření',get:function(p){return listHtml((p.goalLabels||[]).slice(0,4));},norm:function(p){return (p.goalLabels||[]).slice(0,4).join('|');}},
        {id:'package',label:'Balení',get:function(p){return escapeHtml(p.package);},norm:function(p){return p.package;}},
        {id:'dose',label:'Doporučené užívání',get:function(p){return escapeHtml(p.dose);},norm:function(p){return p.dose;}},
        {id:'supply',label:'Výdrž balení',get:function(p){return escapeHtml(p.supply);},norm:function(p){return p.supply;}},
        {id:'flavor',label:'Příchuť',get:function(p){return escapeHtml(p.flavor || 'bez příchuti');},norm:function(p){return p.flavor || '';}},
        {id:'vegan',label:'Vegan',get:function(p){return boolLabel(p.vegan);},norm:function(p){return String(p.vegan);}},
        {id:'sugar',label:'Bez cukru',get:function(p){return boolLabel(p.sugarFree);},norm:function(p){return String(p.sugarFree);}},
        {id:'gluten',label:'Bez lepku',get:function(p){return boolLabel(p.glutenFree);},norm:function(p){return String(p.glutenFree);}},
        {id:'halal',label:'Halal',get:function(p){return boolLabel(p.halal);},norm:function(p){return String(p.halal);}},
        {id:'msgFree',label:'Bez přidaných glutamátů',get:function(p){return boolLabel(p.msgFree);},norm:function(p){return String(p.msgFree);}},
        {id:'caffeine',label:'Obsahuje kofein / stimulanty',get:function(p){return p.caffeine===true?'<span class="mbpc__no">Ano</span>':p.caffeine===false?'<span class="mbpc__yes">Ne</span>':'<span class="mbpc__unknown">Neuvedeno</span>';},norm:function(p){return String(p.caffeine);}},
        {id:'ingredients',label:pLabel('Klíčové složky / obsah balíčku'),get:function(p){return listHtml(p.keyIngredients);},norm:function(p){return (p.keyIngredients||[]).join('|');}},
        {id:'facts',label:'Důležité vlastnosti',get:function(p){return listHtml(p.facts);},norm:function(p){return (p.facts||[]).join('|');}},
        {id:'warnings',label:'Upozornění',get:function(p){return listHtml([].concat(p.warnings||[],p.compositionWarnings||[]));},norm:function(p){return [].concat(p.warnings||[],p.compositionWarnings||[]).join('|');}}
      ];
    }

    function pLabel(x){return x;}

    function productHeader(p) {
      const live=liveFor(p);
      const imageSrc=productImage(p,live);
      const image='<img class="mbpc__product-image'+(live.image?' is-live':'')+'" src="'+escapeHtml(imageSrc)+'" alt="'+escapeHtml(live.name || p.name)+'" loading="lazy" data-product-image-id="'+escapeHtml(p.id)+'">';
      const price=Number.isFinite(live.price)?'<div class="mbpc__product-price">'+formatPrice(live.price,live.currency)+'</div>':'';
      const availability=live.availability?'<div class="mbpc__availability '+(live.inStock===true?'mbpc__availability--in':live.inStock===false?'mbpc__availability--out':'')+'">'+escapeHtml(live.availability)+'</div>':'';
      const add=CONFIG.enableAddToCart && live.inStock!==false?'<a class="mbpc__button mbpc__button--primary" href="'+escapeHtml(buildCartUrl(p))+'" data-action="add-cart" data-id="'+p.id+'">Do košíku</a>':'';
      return '<div class="mbpc__product-head-inner">'+image+'<div class="mbpc__product-name">'+escapeHtml(live.name || p.name)+'</div>'+price+availability+'<div class="mbpc__head-actions"><a class="mbpc__button" href="'+escapeHtml(absoluteUrl(p.url))+'" target="_blank" rel="noopener" data-action="product-link">Detail produktu</a>'+add+'<button type="button" class="mbpc__button" data-action="toggle" data-id="'+p.id+'">Odebrat</button></div></div>';
    }

    function insightCards(products) {
      const forms=Array.from(new Set(products.flatMap(function (p) { return p.formLabels; })));
      const common=[];
      if (products.every(function(p){return p.vegan===true;})) common.push('všechny jsou veganské');
      if (products.every(function(p){return p.sugarFree===true;})) common.push('všechny jsou bez cukru');
      if (products.every(function(p){return p.glutenFree===true;})) common.push('všechny jsou bez lepku');
      if (products.every(function(p){return p.msgFree===true;})) common.push('všechny jsou bez přidaných glutamátů');
      const activeSets=products.map(function(p){return new Set(Object.keys(p.dailyAmounts||{}));});
      let shared=[];
      if (activeSets.length && activeSets.every(function(s){return s.size;})) {
        shared=Array.from(activeSets[0]).filter(function(id){return activeSets.slice(1).every(function(s){return s.has(id);});});
      }
      const prices=products.map(function(p){return liveFor(p).price;}).filter(Number.isFinite);
      const priceText=prices.length>=2?'Rozdíl mezi nejnižší a nejvyšší aktuální cenou je '+formatPrice(Math.max.apply(null,prices)-Math.min.apply(null,prices),liveFor(products[0]).currency || 'CZK')+'.':'Ceny se načtou z produktových stránek.';
      return '<div class="mbpc__insights"><div class="mbpc__insight"><strong>Formy</strong>'+escapeHtml(forms.length===1?'Všechny produkty mají formu '+forms[0]+'.':'Porovnáváte '+forms.length+' různé formy: '+forms.join(', ')+'.')+'</div><div class="mbpc__insight"><strong>Společné vlastnosti</strong>'+escapeHtml(common.length?common.join(', ')+'.':'Vybrané produkty nemají společnou dietní vlastnost potvrzenou u všech položek.')+'</div><div class="mbpc__insight"><strong>Aktivní látky a cena</strong>'+escapeHtml(shared.length?'Společné deklarované látky: '+shared.slice(0,3).map(function(id){return SUBSTANCES[id]?SUBSTANCES[id].label:id;}).join(', ')+(shared.length>3?'…':'')+'. ': '')+escapeHtml(priceText)+'</div></div>';
    }

    function renderIngredientTable(products) {
      const ids=new Set();
      products.forEach(function(p){Object.keys(p.dailyAmounts||{}).forEach(function(id){ids.add(id);});});
      if (!ids.size) return '';
      const sorted=Array.from(ids).sort(function(a,b){return ((SUBSTANCES[a]&&SUBSTANCES[a].order)||9999)-((SUBSTANCES[b]&&SUBSTANCES[b].order)||9999);});
      let lastGroup=''; let rows='';
      sorted.forEach(function(id){
        const def=SUBSTANCES[id] || {label:id,group:'Další látky',unit:'',order:9999};
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
      return '<h3 class="mbpc__ingredient-title">Deklarované účinné látky</h3><p class="mbpc__ingredient-note">Množství jsou přepočtena na výchozí denní dávku uvedenou v databázi nástroje. U zvýhodněných balíčků se součty z jednotlivých produktů záměrně nepočítají; k tomu slouží samostatná Kontrola překryvu účinných látek.</p><div class="mbpc__table-wrap"><table class="mbpc__table"><thead><tr><th class="mbpc__row-label">Účinná látka</th>'+products.map(function(p){return '<th class="mbpc__product-head">'+escapeHtml(p.name)+'</th>';}).join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div>';
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
      const html='<section class="mbpc__section mbpc__comparison"><div class="mbpc__compare-tools"><div><h3 class="mbpc__section-title" style="margin-bottom:4px">Výsledné porovnání</h3><div class="mbpc__section-note" style="margin:0">Tabulka nezvýhodňuje jeden produkt jako „lepší“. Ukazuje pouze rozdíly v deklarovaných vlastnostech.</div></div><div class="mbpc__options"><label class="mbpc__check"><input type="checkbox" data-option="highlight" '+(state.highlight?'checked':'')+'> Zvýraznit rozdíly</label><label class="mbpc__check"><input type="checkbox" data-option="hideSame" '+(state.hideSame?'checked':'')+'> Skrýt shodné řádky</label><button type="button" class="mbpc__button" data-action="share">Kopírovat odkaz</button><button type="button" class="mbpc__button" data-action="print">Tisk / PDF</button></div></div>'+insightCards(products)+'<div class="mbpc__table-wrap"><table class="mbpc__table"><thead><tr><th class="mbpc__row-label">Parametr</th>'+products.map(function(p){return '<th class="mbpc__product-head">'+productHeader(p)+'</th>';}).join('')+'</tr></thead><tbody>'+tableRows+'</tbody></table></div>'+renderIngredientTable(products)+'<div class="mbpc__footnotes"><p><strong>Důležité:</strong> Srovnání má informační charakter a nenahrazuje etiketu ani individuální doporučení lékaře či lékárníka. Před nákupem vždy otevřete detail produktu a ověřte aktuální složení, dávkování a upozornění.</p><p>RHP je referenční hodnota příjmu, nikoli doporučená individuální dávka nebo maximální bezpečná hranice.</p><p class="mbpc__screen-only">Produktová databáze byla naposledy ověřena '+DATA_VERIFIED_AT+'. Cena, dostupnost, obrázek a hodnocení se při otevření porovnání načítají z aktuální produktové stránky, pokud je tato funkce zapnutá.</p></div></section>';
      const wrapper=document.createElement('div');wrapper.setAttribute('data-role','comparison');wrapper.innerHTML=html;
      if (section) section.replaceWith(wrapper); else app.appendChild(wrapper);
      section=wrapper;
    }

    function copyShareLink() {
      updateHash(state.selected);
      const text=window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function(){setStatus('Odkaz na porovnání byl zkopírován.');}).catch(fallback);
      else fallback();
      function fallback(){
        const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();
        try { document.execCommand('copy'); setStatus('Odkaz na porovnání byl zkopírován.'); } catch(e) { setStatus('Odkaz se nepodařilo zkopírovat.'); }
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
