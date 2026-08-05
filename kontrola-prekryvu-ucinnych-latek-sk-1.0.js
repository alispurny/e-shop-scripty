/**
 * MyBears — sjednotená grafická verzia 2.1 (SK)
 * Vizuální systém vychází z MyBears Product Guide v1.8.
 * Funkční logika, výpočty, interní ID, URL a veřejné API zůstávají zachované.
 */
/**
 * MyBears — Kontrola překryvu účinných látek
 * Version: 1.0.0
 * Product data verified: 2026-08-01
 *
 * Mount point:
 *   <div id="mybears-overlap-checker" data-mybears-overlap-checker></div>
 *
 * Optional config before loading:
 * window.MBOC_CONFIG = {
 *   siteOrigin: null,
 *   enableLiveProductData: true,
 *   initialProfile: 'adult',
 *   debug: false
 * };
 *
 * No external dependencies. No cookies. No localStorage. No health answers are sent anywhere.
 */
(function () {
  'use strict';

  const VERSION = '2.1.0-sk';
  const DATA_VERIFIED_AT = '2026-08-05';
  const ROOT_SELECTOR = '[data-mybears-overlap-checker], #mybears-overlap-checker';
  const STYLE_ID = 'mboc-styles-v21';
  const DEFAULT_CONFIG = Object.freeze({
    siteOrigin: null,
    enableLiveProductData: true,
    initialProfile: 'adult',
    debug: false,
    scrollOffset: 24
  });
  const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.MBOC_CONFIG || {});
  const SUBSTANCES = Object.freeze({"vitamin_a":{"label":"Vitamín A","group":"Vitamíny","unit":"µg","nrv":800,"limit":3000,"limitType":"UL","order":10,"note":"Kontrolní hranice se vztahuje na předem vytvořený vitamín A; produkty MyBears zde používají retinyl-palmitát."},"vitamin_d":{"label":"Vitamín D","group":"Vitamíny","unit":"µg","nrv":5,"limit":100,"limitType":"UL","order":20},"vitamin_e":{"label":"Vitamín E","group":"Vitamíny","unit":"mg","nrv":12,"order":30},"vitamin_k2":{"label":"Vitamín K2 (MK-7)","group":"Vitamíny","unit":"µg","nrv":75,"order":40,"special":"vitamin_k"},"vitamin_c":{"label":"Vitamín C","group":"Vitamíny","unit":"mg","nrv":80,"order":50},"b1":{"label":"Vitamín B1 (thiamin)","group":"Vitamíny","unit":"mg","nrv":1.1,"order":60},"b2":{"label":"Vitamín B2 (riboflavin)","group":"Vitamíny","unit":"mg","nrv":1.4,"order":70},"niacin":{"label":"Niacin (vitamín B3)","group":"Vitamíny","unit":"mg","nrv":16,"order":80,"note":"Horní hranice se liší podle použité formy niacinu, proto ji nástroj nevyhodnocuje."},"b5":{"label":"Kyselina pantothenová (B5)","group":"Vitamíny","unit":"mg","nrv":6,"order":90},"b6":{"label":"Vitamín B6","group":"Vitamíny","unit":"mg","nrv":1.4,"limit":12.5,"limitType":"UL","order":100},"b12":{"label":"Vitamín B12","group":"Vitamíny","unit":"µg","nrv":2.5,"order":110},"folate":{"label":"Folát / kyselina listová","group":"Vitamíny","unit":"µg","nrv":200,"limit":1000,"limitType":"UL","order":120},"biotin":{"label":"Biotin","group":"Vitamíny","unit":"µg","nrv":50,"order":130,"special":"biotin"},"iodine":{"label":"Jód","group":"Minerální látky","unit":"µg","nrv":150,"order":210},"potassium":{"label":"Draslík","group":"Minerální látky","unit":"mg","nrv":2000,"order":220,"special":"potassium"},"magnesium":{"label":"Hořčík","group":"Minerální látky","unit":"mg","nrv":375,"order":230},"iron":{"label":"Železo","group":"Minerální látky","unit":"mg","nrv":14,"limit":40,"limitType":"Bezpečná úroveň","order":240,"special":"iron"},"zinc":{"label":"Zinek","group":"Minerální látky","unit":"mg","nrv":10,"order":250,"special":"zinc"},"copper":{"label":"Měď","group":"Minerální látky","unit":"µg","nrv":1000,"order":260},"manganese":{"label":"Mangan","group":"Minerální látky","unit":"mg","nrv":2,"limit":8,"limitType":"Bezpečná úroveň","order":270},"selenium":{"label":"Selen","group":"Minerální látky","unit":"µg","nrv":55,"limit":255,"limitType":"UL","order":280},"chromium":{"label":"Chrom","group":"Minerální látky","unit":"µg","nrv":40,"order":290},"omega3_plant":{"label":"Omega-3 z lněného oleje","group":"Omega-3 a tuky","unit":"mg","order":310},"fish_oil":{"label":"Rybí olej","group":"Omega-3 a tuky","unit":"mg","order":320,"special":"omega3"},"omega3":{"label":"Omega-3 celkem","group":"Omega-3 a tuky","unit":"mg","order":330,"special":"omega3"},"epa":{"label":"EPA","group":"Omega-3 a tuky","unit":"mg","order":340,"special":"omega3"},"dha":{"label":"DHA","group":"Omega-3 a tuky","unit":"mg","order":350,"special":"omega3"},"griffonia":{"label":"Extrakt z griffonie 25:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":410,"special":"serotonin"},"lemon_balm":{"label":"Extrakt z meduňky","group":"Rostlinné extrakty a další látky","unit":"mg","order":420,"special":"sedative"},"chamomile":{"label":"Extrakt z heřmánku","group":"Rostlinné extrakty a další látky","unit":"mg","order":430,"special":"sedative"},"pine_bark":{"label":"Extrakt z borové kůry 30:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":440},"grape_seed":{"label":"Extrakt z hroznových jader 20:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":450},"coq10":{"label":"Koenzym Q10","group":"Rostlinné extrakty a další látky","unit":"mg","order":460},"lions_mane":{"label":"Hericium / Lion's Mane 5:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":470},"cordyceps":{"label":"Cordyceps 1:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":480},"ginseng":{"label":"Ženšen 4:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":490,"special":"stimulant"},"green_tea":{"label":"Extrakt ze zeleného čaje","group":"Rostlinné extrakty a další látky","unit":"mg","order":500,"special":"stimulant"},"l_citrulline":{"label":"L-citrulin","group":"Rostlinné extrakty a další látky","unit":"mg","order":510},"taurine":{"label":"Taurin","group":"Rostlinné extrakty a další látky","unit":"mg","order":520},"caffeine":{"label":"Kofein","group":"Rostlinné extrakty a další látky","unit":"mg","order":530,"special":"caffeine"},"apple_cider_vinegar":{"label":"Jablečný ocet v prášku","group":"Rostlinné extrakty a další látky","unit":"mg","order":540,"special":"glucose"},"l_theanine":{"label":"L-theanin","group":"Rostlinné extrakty a další látky","unit":"mg","order":550},"ashwagandha":{"label":"Extrakt z ašvagandy 10:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":560,"special":"ashwagandha"},"rhodiola":{"label":"Extrakt z rozchodnice 6:1","group":"Rostlinné extrakty a další látky","unit":"mg","order":570,"special":"stimulant"},"bacillus_coagulans":{"label":"Bacillus coagulans MTCC 5856","group":"Mikroorganismy a vláknina","unit":"mld. CFU","order":610},"acacia_fiber":{"label":"Akáciová vláknina","group":"Mikroorganismy a vláknina","unit":"mg","order":620},"inositol":{"label":"Inositol","group":"Rostlinné extrakty a další látky","unit":"µg","order":580,"note":"Hodnota je převzata z aktuální deklarace produktu."},"spirulina":{"label":"Spirulina BIO","group":"Zelené směsi","unit":"mg","order":710},"chlorella":{"label":"Chlorella BIO","group":"Zelené směsi","unit":"mg","order":720},"green_barley":{"label":"Zelený ječmen BIO","group":"Zelené směsi","unit":"mg","order":730},"moringa":{"label":"Moringa BIO","group":"Zelené směsi","unit":"mg","order":740},"bovine_collagen":{"label":"Hovězí kolagenní peptidy","group":"Kolageny a kloubní látky","unit":"mg","order":810},"fish_collagen":{"label":"Rybí kolagenní peptidy","group":"Kolageny a kloubní látky","unit":"mg","order":820},"glucosamine":{"label":"Glukosamin sulfát","group":"Kolageny a kloubní látky","unit":"mg","order":830,"special":"anticoagulant"},"msm":{"label":"MSM","group":"Kolageny a kloubní látky","unit":"mg","order":840},"chondroitin":{"label":"Chondroitin sulfát","group":"Kolageny a kloubní látky","unit":"mg","order":850,"special":"anticoagulant"},"acerola_extract":{"label":"Extrakt z aceroly","group":"Rostlinné extrakty a další látky","unit":"mg","order":590},"boswellia":{"label":"Extrakt z boswellie 10:1","group":"Kolageny a kloubní látky","unit":"mg","order":860},"boswellic_acids":{"label":"Kyseliny boswellové","group":"Kolageny a kloubní látky","unit":"mg","order":870},"hyaluronic_acid":{"label":"Kyselina hyaluronová","group":"Kolageny a kloubní látky","unit":"mg","order":880},"turmeric":{"label":"Extrakt z kurkumy 4:1","group":"Kolageny a kloubní látky","unit":"mg","order":890,"special":"anticoagulant"},"bioperine":{"label":"BioPerine®","group":"Kolageny a kloubní látky","unit":"mg","order":900,"special":"medication"},"piperine":{"label":"Piperin","group":"Kolageny a kloubní látky","unit":"mg","order":910,"special":"medication"},"keratin":{"label":"Keratin","group":"Kolageny a kloubní látky","unit":"mg","order":920}});
  const PRODUCTS = Object.freeze([{"id":"sleep-gummies","name":"Gumoví medvídci Kvalitní spánek","url":"/p/gumovi-medvidci-kvalitni-spanek","category":"Gummies","form":"gummies","summary":"Bezcukrové gummies pro večerní rutinu bez melatoninu.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":false},{"id":"2","label":"2 medvídci","multiplier":2,"default":true}],"amounts":{"griffonia":20,"zinc":5,"lemon_balm":15,"chamomile":15,"b6":0.35},"warnings":["Při užívání antidepresiv, léků ovlivňujících serotonin nebo sedativ konzultujte kombinaci s lékařem nebo lékárníkem."],"tags":["bez cukru","vegan"]},{"id":"skin-30-gummies","name":"Gumoví medvídci Krásná a zdravá pleť 30+","url":"/p/gumovi-medvidci-krasna-a-zdrava-plet-30","category":"Gummies","form":"gummies","summary":"Antioxidační a vitaminová kombinace zaměřená na pleť.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":false},{"id":"2","label":"2 medvídci","multiplier":2,"default":true}],"amounts":{"pine_bark":750,"grape_seed":650,"vitamin_c":40,"coq10":5,"b5":3,"selenium":27.5,"vitamin_d":5},"warnings":[],"tags":["vegan"]},{"id":"hsn-gummies","name":"Gumoví medvídci Zdravé vlasy, kůže a nehty","url":"/p/gumovi-medvidci-zdrave-vlasy-kuze-a-nehty","category":"Gummies","form":"gummies","summary":"Multivitaminové gummies se zinkem, selenem a biotinem.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":false},{"id":"2","label":"2 medvídci","multiplier":2,"default":true}],"amounts":{"vitamin_c":40,"zinc":5,"selenium":27.5,"vitamin_e":6,"vitamin_d":2.5,"vitamin_a":400,"b6":0.7,"biotin":75},"warnings":[],"tags":["vegan"]},{"id":"kids-omega-multi","name":"Gumoví medvídci Omega 3 & Multivitamin pro děti","url":"/p/gumovi-medvidci-omega-3-multivitamin-pro-deti","category":"Gummies","form":"gummies","summary":"Dětská kombinace omega-3 z lněného oleje a vitaminů od 3 let.","package":"30 medvídků","audience":"child","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":true},{"id":"2","label":"2 medvídci","multiplier":2,"default":false}],"amounts":{"omega3_plant":100,"vitamin_c":60,"niacin":8,"vitamin_e":6,"b5":6,"b12":2.5,"b6":1.4,"vitamin_a":400,"vitamin_d":2.5},"warnings":["Pro dítě vždy respektujte dávkování podle věku a další doplňky konzultujte s pediatrem."],"tags":["pro děti","bez cukru"]},{"id":"active-brain-gummies","name":"Gumoví medvídci Aktivní mozek","url":"/p/gumovi-medvidci-aktivni-mozek","category":"Gummies","form":"gummies","summary":"Gummies s vitaminy skupiny B, železem, houbami a zeleným čajem.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":false},{"id":"2","label":"2 medvídci","multiplier":2,"default":true}],"amounts":{"b1":0.55,"b5":2.5,"b6":0.7,"b12":1.25,"iron":3,"lions_mane":125,"cordyceps":50,"ginseng":40,"green_tea":25},"warnings":["Obsahuje extrakt ze zeleného čaje a ženšen; při citlivosti na stimulanty nebo užívání léků zkontrolujte vhodnost kombinace."],"tags":["vegan"]},{"id":"preworkout-gummies","name":"Gumoví medvídci Nakopávač – Pre-workout","url":"/p/gumovi-medvidci-nakopavac-preworkout","category":"Gummies","form":"gummies","summary":"Předtréninkové gummies s citrulinem, taurinem, zeleným čajem a kofeinem.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":false},{"id":"2","label":"2 medvídci","multiplier":2,"default":false},{"id":"3","label":"3 medvídci","multiplier":3,"default":true}],"amounts":{"l_citrulline":200,"taurine":100,"green_tea":20,"caffeine":5,"niacin":0.75,"b6":0.35},"warnings":["Obsahuje kofein. Započítejte také kávu, energetické nápoje, čaj a další zdroje kofeinu."],"tags":["obsahuje kofein"]},{"id":"acv-gummies","name":"Gumoví medvídci Jablečný ocet + chrom + vitamín C","url":"/p/gumovi-medvidci-na-hubnuti-traveni-detox","category":"Gummies","form":"gummies","summary":"Gummies s jablečným octem, vitaminem C a chromem.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":true}],"amounts":{"apple_cider_vinegar":500,"vitamin_c":20,"chromium":6},"warnings":["Při diabetu nebo užívání léků ovlivňujících glykemii konzultujte kombinaci s lékařem."],"tags":["vegan"]},{"id":"relax-gummies","name":"Gumoví medvídci Pohodička – Relax","url":"/p/gumovi-medvidci-pohodicka-relax","category":"Gummies","form":"gummies","summary":"Kombinace meduňky, L-theaninu, heřmánku, vitaminu E a B6.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":false},{"id":"2","label":"2 medvídci","multiplier":2,"default":true}],"amounts":{"lemon_balm":22.5,"l_theanine":15,"vitamin_e":6,"chamomile":5,"b6":0.7},"warnings":["Při současném užívání sedativ nebo léků na spánek konzultujte kombinaci s odborníkem."],"tags":["vegan"]},{"id":"mood-gummies","name":"Gumoví medvídci Dobrá náladička","url":"/p/gumovi-medvidci-dobra-naladicka","category":"Gummies","form":"gummies","summary":"Adaptogenní kombinace L-theaninu, ašvagandy, rozchodnice a vitaminů B.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":false},{"id":"2","label":"2 medvídci","multiplier":2,"default":true}],"amounts":{"l_theanine":44,"ashwagandha":50,"rhodiola":25,"niacin":4,"b6":0.43,"b2":0.37,"b1":0.3,"b12":0.3},"warnings":["Ašvagandu a rozchodnici konzultujte při onemocnění štítné žlázy, autoimunitním onemocnění, jaterních potížích, těhotenství, kojení nebo při užívání léků."],"tags":["vegan"]},{"id":"probiotic-gummies","name":"Gumoví medvídci Zdravá střevní mikroflóra","url":"/p/gumovi-medvidci-zdrava-strevni-mikroflora","category":"Gummies","form":"gummies","summary":"Probiotické gummies s Bacillus coagulans a vitaminem C.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":true}],"amounts":{"bacillus_coagulans":1,"vitamin_c":40},"warnings":[],"tags":["probiotika"]},{"id":"immunity-gummies","name":"Gumoví medvídci Silná imunita","url":"/p/gumovi-medvidci-silna-imunita","category":"Gummies","form":"gummies","summary":"Vitamin C, zinek, selen a vitamin B6 v gummies.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":false},{"id":"2","label":"2 medvídci","multiplier":2,"default":true}],"amounts":{"vitamin_c":80,"zinc":2,"selenium":11,"b6":0.3},"warnings":[],"tags":["vegan"]},{"id":"multivitamin-gummies","name":"Gumoví medvídci Multivitamin","url":"/p/gumovi-medvidci-multivitamin","category":"Gummies","form":"gummies","summary":"Široká kombinace vitaminů s jódem a biotinem.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":false},{"id":"2","label":"2 medvídci","multiplier":2,"default":true}],"amounts":{"vitamin_c":40,"vitamin_e":6.7,"b12":2,"b5":1.5,"b6":0.5,"vitamin_a":300,"folate":120,"biotin":30,"iodine":20,"inositol":10,"vitamin_d":5},"warnings":[],"tags":["vegan"]},{"id":"biotin-gummies","name":"Gumoví medvídci Biotin 5 mg","url":"/p/gumovi-medvidci-biotin","category":"Gummies","form":"gummies","summary":"Vysokodávkový biotin ve formě gummies.","package":"60 medvídků","audience":"adult","doses":[{"id":"1","label":"1 medvídek","multiplier":1,"default":true}],"amounts":{"biotin":5000},"warnings":["Vysoké dávky biotinu mohou zkreslit některé laboratorní testy. Informujte lékaře a laboratoř před odběrem."],"tags":["5 mg biotinu","obsahuje cukr"]},{"id":"magnesium-bisglycinate","name":"Hořčík bisglycinát + vitamín B6 P5P","url":"/p/horcik-chelat-bisglycinat-vitamin-b6-p5p-doplnek-stravy","category":"Kapsle a softgely","form":"capsules","summary":"Hořčík v bisglycinátové formě s aktivní formou vitaminu B6.","package":"90 kapslí","audience":"adult","doses":[{"id":"2","label":"2 kapsle","multiplier":2,"default":true},{"id":"3","label":"3 kapsle","multiplier":3,"default":false}],"amounts":{"magnesium":100,"b6":1.4,"acacia_fiber":95},"warnings":[],"tags":["vegan"]},{"id":"iron-c-b12-b9","name":"Vitamín C + železo + B12 + B9","url":"/p/vitamin-c-zelezo-b12-b9-kyselina-listova-doplnek-stravy","category":"Kapsle a softgely","form":"capsules","summary":"Koncentrovaná kapsle s železem, vitaminem C, B12 a folátem.","package":"60 kapslí","audience":"adult","doses":[{"id":"1","label":"1 kapsle","multiplier":1,"default":true}],"amounts":{"vitamin_c":100,"iron":20,"b12":50,"folate":200,"acacia_fiber":130},"warnings":["Železo neužívejte dlouhodobě bez znalosti potřeby nebo laboratorních hodnot. Při léčbě a v těhotenství konzultujte dávku s lékařem."],"tags":["vegan"]},{"id":"zinc-bisglycinate","name":"Zinek chelát 25 mg","url":"/p/zinek-chelat-15-mg-bisglycinat-doplnek-stravy","category":"Kapsle a softgely","form":"capsules","summary":"Jedna kapsle obsahuje 25 mg zinku v chelátové formě.","package":"60 kapslí","audience":"adult","doses":[{"id":"1","label":"1 kapsle","multiplier":1,"default":true}],"amounts":{"zinc":25,"acacia_fiber":240},"warnings":["Při kombinování s dalšími zdroji zinku nebo při dlouhodobém užívání zkontrolujte celkový příjem s odborníkem."],"tags":["vegan","25 mg zinku"]},{"id":"vitamin-d3-k2","name":"Vitamín D3 + K2 MK-7","url":"/p/vitamin-d3-2000-iu-doplnek-stravy","category":"Kapsle a softgely","form":"capsules","summary":"Vitamín D3 2000 IU a K2 MK-7 v jedné kapsli.","package":"60 kapslí","audience":"adult","doses":[{"id":"1","label":"1 kapsle","multiplier":1,"default":true}],"amounts":{"vitamin_d":50,"vitamin_k2":75,"acacia_fiber":260},"warnings":["Vitamín K může interagovat s warfarinem a dalšími antagonisty vitaminu K. Změnu příjmu konzultujte s ošetřujícím lékařem."],"tags":["vegan","2000 IU D3"]},{"id":"green-mix","name":"Zelený mix BIO 450 mg","url":"/p/zeleny-mix-450-mg-bio","category":"Kapsle a softgely","form":"capsules","summary":"BIO směs spiruliny, chlorelly, zeleného ječmene a moringy.","package":"90 kapslí","audience":"adult","doses":[{"id":"1","label":"1 kapsle","multiplier":1,"default":false},{"id":"2","label":"2 kapsle","multiplier":2,"default":true},{"id":"3","label":"3 kapsle","multiplier":3,"default":false}],"amounts":{"spirulina":112.5,"chlorella":112.5,"green_barley":112.5,"moringa":112.5,"acacia_fiber":150},"warnings":[],"tags":["BIO","vegan"]},{"id":"omega3-softgels","name":"Omega 3 – EPA + DHA","url":"/p/omega-3-mastne-kyseliny-300-mg-epa-220-mg-dha-doplnek-stravy","category":"Kapsle a softgely","form":"softgels","summary":"Rybí olej se standardizovaným obsahem EPA a DHA.","package":"60 softgelů","audience":"adult","doses":[{"id":"1","label":"1 softgel","multiplier":1,"default":false},{"id":"2","label":"2 softgely","multiplier":2,"default":true}],"amounts":{"fish_oil":1000,"omega3":550,"epa":330,"dha":220},"warnings":["Při léčbě ovlivňující srážlivost krve, před operací nebo při poruše srážlivosti konzultujte omega-3 s lékařem."],"tags":["rybí olej"]},{"id":"magnesium-malate-potassium","name":"Hořčík malát + draslík","url":"/p/horcik-malat-draslik","category":"Kapsle a softgely","form":"capsules","summary":"Kombinace hořčíku v malátové formě a draslíku.","package":"90 kapslí","audience":"adult","doses":[{"id":"2","label":"2 kapsle","multiplier":1,"default":true}],"amounts":{"magnesium":170,"potassium":200},"warnings":["Při onemocnění ledvin nebo při užívání léků zvyšujících draslík konzultujte kombinaci s lékařem."],"tags":["vegan"]},{"id":"joint-collagen","name":"Kolagen na klouby","url":"/p/kolagen-na-klouby","category":"Kolageny","form":"powder","summary":"Komplexní kloubní výživa s kolagenem, glukosaminem, MSM, chondroitinem, D3 a K2.","package":"30 dávek","audience":"adult","doses":[{"id":"1","label":"1 denní dávka","multiplier":1,"default":true}],"amounts":{"bovine_collagen":8000,"glucosamine":1500,"msm":1500,"chondroitin":1000,"acerola_extract":589,"vitamin_c":100,"boswellia":300,"boswellic_acids":210,"hyaluronic_acid":100,"turmeric":50,"vitamin_k2":75,"vitamin_d":50,"manganese":1,"copper":500,"bioperine":1.06,"piperine":1},"warnings":["Obsahuje vitamin K2, glukosamin, chondroitin, kurkumu a piperin. Při užívání léků, zejména na srážlivost krve, konzultujte kombinaci s lékařem."],"tags":["hovězí kolagen"]},{"id":"beauty-collagen","name":"Beauty kolagen","url":"/p/beauty-kolagen","category":"Kolageny","form":"powder","summary":"Rybí kolagen s MSM, vitaminem C, keratinem, kyselinou hyaluronovou a beauty mikronutrienty.","package":"30 dávek","audience":"adult","doses":[{"id":"1","label":"1 denní dávka","multiplier":1,"default":true}],"amounts":{"fish_collagen":5000,"msm":1000,"acerola_extract":589,"vitamin_c":100,"keratin":500,"hyaluronic_acid":200,"coq10":50,"zinc":10,"vitamin_e":12,"selenium":30,"biotin":150},"warnings":["Obsahuje rybí kolagen. Při alergii na ryby výrobek neužívejte."],"tags":["rybí kolagen"]}]);
  const PRESETS = Object.freeze([{"id":"bundle-sleep","name":"Balíček Kvalitní spánek","products":["magnesium-bisglycinate","sleep-gummies"]},{"id":"bundle-hsn","name":"Balíček Zdravé vlasy, nehty a pokožka – gummies","products":["hsn-gummies","biotin-gummies"]},{"id":"bundle-digestion","name":"Balíček Trávení & střevní mikroflóra","products":["acv-gummies","probiotic-gummies"]},{"id":"bundle-zinc-biotin","name":"Balíček Zinek + Biotin","products":["zinc-bisglycinate","biotin-gummies"]},{"id":"bundle-good-mood","name":"Balíček Dobrá náladička","products":["magnesium-bisglycinate","mood-gummies"]},{"id":"bundle-mental","name":"Balíček Mentální výkon 2.0","products":["active-brain-gummies","sleep-gummies","magnesium-bisglycinate"]},{"id":"bundle-sport","name":"Balíček Sport","products":["magnesium-bisglycinate","zinc-bisglycinate","omega3-softgels","preworkout-gummies"]},{"id":"bundle-immunity-capsules","name":"Balíček Imunita – kapsle","products":["vitamin-d3-k2","zinc-bisglycinate","magnesium-bisglycinate","omega3-softgels"]},{"id":"bundle-vitality","name":"Balíček Vitalita","products":["magnesium-bisglycinate","vitamin-d3-k2","omega3-softgels"]},{"id":"bundle-immunity-mixed","name":"Balíček Imunita – kapsle + gummies","products":["magnesium-bisglycinate","vitamin-d3-k2","omega3-softgels","immunity-gummies"]}]);
  const PRODUCT_MAP = new Map(PRODUCTS.map(function (p) { return [p.id, p]; }));
  const pageCache = new Map();
  let instanceNo = 0;

  const SPECIAL_WARNINGS = Object.freeze({
    vitamin_k: 'Vybraná kombinace obsahuje vitamin K2. Při užívání warfarinu nebo jiných antagonistů vitaminu K neměňte příjem bez domluvy s ošetřujícím lékařem.',
    biotin: 'Biotin, zejména ve vysokých dávkách, může zkreslit některé laboratorní testy. Před odběrem informujte lékaře a laboratoř o užívaných doplňcích.',
    potassium: 'Kombinace obsahuje draslík. Při onemocnění ledvin nebo užívání léků zvyšujících draslík je nutná konzultace s lékařem.',
    iron: 'Kombinace obsahuje železo. Dlouhodobé užívání koncentrovaného železa má vycházet ze skutečné potřeby a případně laboratorních hodnot.',
    zinc: 'Celková denní dávka zinku je nejméně 25 mg. Při dlouhodobém užívání nebo dalších zdrojích zinku zkontrolujte kombinaci s odborníkem.',
    omega3: 'Kombinace obsahuje rybí olej nebo omega-3. Při léčbě ovlivňující srážlivost krve, poruše srážlivosti nebo před operací konzultujte užívání s lékařem.',
    serotonin: 'Kombinace obsahuje griffonii jako zdroj 5-HTP. Nekombinujte ji bez odborné konzultace s antidepresivy nebo dalšími přípravky ovlivňujícími serotonin.',
    sedative: 'Kombinace obsahuje látky používané ve večerní nebo relaxační rutině. Při současném užívání sedativ či léků na spánek ověřte kombinaci s odborníkem.',
    stimulant: 'Kombinace obsahuje stimulující rostlinné extrakty. Zvažte také další zdroje stimulantů a užívané léky.',
    caffeine: 'Kombinace obsahuje kofein. Do celkového denního příjmu patří také káva, čaj, energetické nápoje a další zdroje.',
    glucose: 'Při diabetu nebo užívání léků ovlivňujících glykemii konzultujte přípravky s jablečným octem a chromem s lékařem.',
    ashwagandha: 'Ašvagandu konzultujte při onemocnění štítné žlázy, autoimunitním onemocnění, jaterních potížích, těhotenství, kojení nebo při užívání léků.',
    anticoagulant: 'Kombinace obsahuje látky, u kterých je vhodná zvýšená opatrnost při léčbě ovlivňující srážlivost krve.',
    medication: 'Kombinace obsahuje piperin/BioPerine®, který může ovlivňovat vstřebávání některých léčiv. Při pravidelné medikaci ověřte vhodnost s lékárníkem nebo lékařem.'
  });

  const CSS_TEXT = String.raw`
.mboc{--green:#2dc26b;--green-dark:#158849;--ink:#1f2933;--muted:#5f6b76;--soft:#f7fbf8;--line:#dce8e0;--yellow:#f5e694;--warn:#fff8df;--warn-border:#d7a600;--danger:#a63a36;--danger-soft:#fff1f0;--blue:#2367a8;--blue-soft:#eef6ff;font-family:Arial,Helvetica,sans-serif;color:var(--ink);font-size:16px;font-weight:400;line-height:1.5;margin:24px 0 42px}.mboc *,.mboc *:before,.mboc *:after{box-sizing:border-box}.mboc h2,.mboc h3,.mboc h4,.mboc strong,.mboc b{font-family:Arial,Helvetica,sans-serif;font-weight:700}.mboc button,.mboc input,.mboc select{font:inherit}.mboc__shell{max-width:1200px;margin:0 auto;border:1px solid var(--line);border-top:4px solid var(--green);border-radius:18px;background:#fff;box-shadow:0 10px 30px rgba(31,41,51,.07);overflow:hidden}.mboc__hero{padding:clamp(24px,4vw,44px);background:linear-gradient(135deg,#fff 0%,var(--soft) 100%);text-align:center}.mboc__title{margin:0 0 12px;font-size:clamp(28px,4vw,42px);line-height:1.18}.mboc__lead{max-width:850px;font-weight:400;margin:0 auto;color:var(--muted);font-size:clamp(15px,1.7vw,18px);line-height:1.65}.mboc__privacy{display:inline-flex;gap:8px;align-items:center;margin-top:18px;padding:8px 12px;border-radius:99px;background:#fff;border:1px solid var(--line);color:var(--muted);font-size:12px;font-weight:700}.mboc__body{padding:clamp(18px,3.5vw,38px)}.mboc__profile{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;padding:16px 18px;margin-bottom:20px;border:1px solid var(--line);border-radius:14px;background:var(--soft)}.mboc__profile-copy strong{display:block;margin-bottom:4px}.mboc__profile-copy small{color:var(--muted);line-height:1.45}.mboc__segmented{display:inline-flex;padding:4px;border-radius:10px;background:#fff;border:1px solid var(--line)}.mboc__segmented button{min-height:40px;padding:8px 14px;border:0;border-radius:7px;background:transparent;color:var(--muted);font-weight:700;cursor:pointer}.mboc__segmented button.is-active{background:var(--green);color:#fff}.mboc__notice{font-weight:400;padding:16px 18px;margin:0 0 20px;border-left:4px solid var(--green);border-radius:10px;background:var(--soft);line-height:1.55}.mboc__notice--warning{border-left-color:var(--warn-border);background:var(--warn)}.mboc__notice--danger{border-left-color:var(--danger);background:var(--danger-soft)}.mboc__notice p{margin:0}.mboc__presets{margin-bottom:24px}.mboc__section-title{margin:0 0 12px;font-size:22px;line-height:1.3}.mboc__section-intro{font-weight:400;margin:-5px 0 14px;color:var(--muted);line-height:1.55}.mboc__preset-list{display:flex;gap:9px;overflow-x:auto;padding:2px 2px 9px;scrollbar-width:thin}.mboc__preset{flex:0 0 auto;min-height:42px;padding:9px 13px;border:1px solid var(--line);border-radius:99px;background:#fff;color:var(--green-dark);font-weight:700;cursor:pointer}.mboc__preset:hover,.mboc__preset:focus-visible{border-color:var(--green);background:var(--soft)}.mboc__workspace{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(330px,.65fr);gap:22px;align-items:start}.mboc__catalog,.mboc__selection{min-width:0}.mboc__selection{position:sticky;top:20px}.mboc__toolbar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;margin-bottom:12px}.mboc__search{width:100%;min-height:46px;padding:10px 13px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink)}.mboc__search:focus{outline:3px solid rgba(45,194,107,.22);border-color:var(--green)}.mboc__tabs{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px}.mboc__tab{min-height:38px;padding:7px 11px;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--muted);font-weight:700;cursor:pointer}.mboc__tab.is-active{border-color:var(--green);background:var(--soft);color:var(--green-dark)}.mboc__product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.mboc__product{display:flex;min-width:0;flex-direction:column;padding:15px;border:1px solid var(--line);border-radius:14px;background:#fff;transition:border-color .18s ease,box-shadow .18s ease,transform .18s ease}.mboc__product:hover{border-color:#b7d9c3;transform:translateY(-1px)}.mboc__product.is-selected{border-color:var(--green);box-shadow:0 0 0 3px rgba(45,194,107,.12);background:var(--soft)}.mboc__product-head{display:flex;gap:11px;align-items:flex-start}.mboc__product-icon{display:grid;flex:0 0 44px;width:44px;height:44px;place-items:center;border-radius:11px;background:var(--yellow);font-size:21px;font-weight:700}.mboc__product-title{margin:0;font-size:16px;line-height:1.35}.mboc__product-meta{margin-top:3px;color:var(--muted);font-size:12px}.mboc__product-summary{font-weight:400;margin:11px 0 13px;color:var(--muted);font-size:13px;line-height:1.5}.mboc__tags{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px}.mboc__tags span{padding:4px 7px;border-radius:99px;background:#eef5f0;color:var(--green-dark);font-size:11px;font-weight:700}.mboc__product-actions{display:flex;gap:8px;align-items:center;margin-top:auto}.mboc__button{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 14px;border:2px solid transparent;border-radius:9px;font-weight:700;line-height:1.2;text-align:center;text-decoration:none!important;cursor:pointer}.mboc__button:focus-visible,.mboc button:focus-visible,.mboc a:focus-visible,.mboc summary:focus-visible{outline:3px solid rgba(45,194,107,.3);outline-offset:2px}.mboc__button--primary{background:var(--green);border-color:var(--green);color:#fff!important}.mboc__button--primary:hover{background:var(--green-dark);border-color:var(--green-dark)}.mboc__button--secondary{background:#fff;border-color:var(--green);color:var(--green-dark)!important}.mboc__button--ghost{background:#fff;border-color:var(--line);color:var(--muted)!important}.mboc__button[disabled]{opacity:.45;cursor:not-allowed}.mboc__product-actions .mboc__button{flex:1}.mboc__panel{padding:17px;border:1px solid var(--line);border-radius:14px;background:#fff;box-shadow:0 6px 22px rgba(31,41,51,.05)}.mboc__selection-head{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:12px}.mboc__selection-count{display:grid;min-width:34px;height:34px;place-items:center;border-radius:50%;background:var(--green);color:#fff;font-weight:700}.mboc__selected-list{display:grid;gap:10px;max-height:510px;overflow:auto;padding-right:3px}.mboc__selected{padding:12px;border:1px solid var(--line);border-radius:11px;background:var(--soft)}.mboc__selected-top{display:flex;justify-content:space-between;gap:10px}.mboc__selected-name{margin:0;font-size:14px;line-height:1.4}.mboc__remove{flex:0 0 auto;width:30px;height:30px;border:0;border-radius:7px;background:#fff;color:var(--danger);font-size:19px;font-weight:700;cursor:pointer}.mboc__dose-label{display:block;margin-top:10px;color:var(--muted);font-size:12px;font-weight:700}.mboc__dose{width:100%;min-height:40px;margin-top:5px;padding:7px 9px;border:1px solid var(--line);border-radius:8px;background:#fff;color:var(--ink)}.mboc__empty{padding:24px 12px;color:var(--muted);text-align:center;line-height:1.55}.mboc__selection-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.mboc__results{margin-top:32px;padding-top:30px;border-top:1px solid var(--line)}.mboc__summary-cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:16px 0 22px}.mboc__summary-card{padding:15px;border:1px solid var(--line);border-radius:12px;background:#fff}.mboc__summary-card strong{display:block;font-size:26px;line-height:1.1;color:var(--green-dark)}.mboc__summary-card span{display:block;margin-top:5px;color:var(--muted);font-size:12px;font-weight:700;line-height:1.4}.mboc__warnings{display:grid;gap:9px;margin-bottom:22px}.mboc__warning{padding:13px 15px;border-left:4px solid var(--warn-border);border-radius:9px;background:var(--warn);line-height:1.5}.mboc__warning.is-danger{border-left-color:var(--danger);background:var(--danger-soft)}.mboc__warning strong{display:block;margin-bottom:3px}.mboc__group{margin-top:24px}.mboc__group h3{margin:0 0 10px;font-size:20px}.mboc__table-scroll{overflow-x:auto;border:1px solid var(--line);border-radius:13px}.mboc__table{width:100%;min-width:780px;border-collapse:collapse;background:#fff}.mboc__table th,.mboc__table td{font-weight:400;padding:12px 13px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;line-height:1.45}.mboc__table thead th{font-weight:700;background:var(--soft);font-size:13px}.mboc__table tbody tr:last-child th,.mboc__table tbody tr:last-child td{border-bottom:0}.mboc__substance{font-weight:700}.mboc__amount{white-space:nowrap;font-weight:700}.mboc__nrv{white-space:nowrap}.mboc__sources{font-size:12px;color:var(--muted)}.mboc__sources details{margin-top:4px}.mboc__sources summary{color:var(--green-dark);font-weight:700;cursor:pointer}.mboc__sources ul{margin:6px 0 0;padding-left:18px}.mboc__status{display:inline-flex;padding:5px 8px;border-radius:99px;font-size:11px;font-weight:700;white-space:nowrap}.mboc__status--ok{background:#eaf8ef;color:var(--green-dark)}.mboc__status--overlap{background:var(--blue-soft);color:var(--blue)}.mboc__status--warning{background:var(--warn);color:#765800}.mboc__status--danger{background:var(--danger-soft);color:var(--danger)}.mboc__footnotes{margin-top:24px;padding:17px;border-radius:11px;background:var(--soft);color:var(--muted);font-size:13px;line-height:1.6}.mboc__footnotes p{margin:0 0 8px}.mboc__footnotes p:last-child{margin-bottom:0}.mboc__results-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:22px}.mboc__sr{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}@media(max-width:920px){.mboc__workspace{grid-template-columns:1fr}.mboc__selection{position:static}.mboc__summary-cards{grid-template-columns:repeat(2,minmax(0,1fr))}.mboc__selected-list{max-height:none}}@media(max-width:640px){.mboc{margin:14px 0 28px}.mboc__shell{border-radius:14px}.mboc__hero{padding:24px 15px}.mboc__body{padding:16px 12px 24px}.mboc__profile{align-items:stretch}.mboc__segmented{width:100%}.mboc__segmented button{flex:1}.mboc__toolbar{grid-template-columns:1fr}.mboc__product-grid{grid-template-columns:1fr}.mboc__summary-cards{grid-template-columns:1fr 1fr}.mboc__selection-actions{grid-template-columns:1fr}.mboc__results-actions{flex-direction:column}.mboc__results-actions .mboc__button{width:100%}}@media print{body *{visibility:hidden!important}.mboc,.mboc *{visibility:visible!important}.mboc{position:absolute;inset:0;width:100%;margin:0}.mboc__shell{border:0;box-shadow:none}.mboc__hero,.mboc__profile,.mboc__presets,.mboc__workspace,.mboc__results-actions{display:none!important}.mboc__results{margin:0;padding:0;border:0}.mboc__table{min-width:0;font-size:10px}.mboc__table th,.mboc__table td{font-weight:400;padding:6px}.mboc__group{break-inside:avoid}.mboc__warning{break-inside:avoid}}
`;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[char];
    });
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(String(value));
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function formatNumber(value) {
    const abs = Math.abs(value);
    const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : abs >= 1 ? 2 : 3;
    return new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: digits }).format(value);
  }

  function absoluteUrl(path) {
    try { return new URL(path, CONFIG.siteOrigin || window.location.origin).href; }
    catch (e) { return path; }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS_TEXT;
    document.head.appendChild(style);
  }

  function defaultDoseId(product) {
    const preferred = product.doses.find(function (d) { return d.default; });
    return (preferred || product.doses[0]).id;
  }

  function productIcon(product) {
    if (product.category === 'Gummies') return '●';
    if (product.category === 'Kolageny') return '✦';
    return '◆';
  }

  function mockupPalette(product) {
    if (product.category === 'Kolageny') return { top: '#DBC442', body: '#fff8dd', accent: '#f0d66b', text: '#000000' };
    if (product.category === 'Kapsle a softgely') return { top: '#DBC442', body: '#f5fbf6', accent: '#cfeeda', text: '#000000' };
    return { top: '#DBC442', body: '#fff9ea', accent: '#ffe9a7', text: '#000000' };
  }

  function shortProductTitle(product) {
    return String(product.name || '')
      .replace(/^Gumov[ií] medv[ií]dcis+/i, '')
      .replace(/^Vitam[ií]ns+/i, 'Vitamín ')
      .replace(/^Ho[rř][cč][ií]ks+/i, 'Hořčík ')
      .trim();
  }

  function wrapMockupText(text, maxLen, maxLines) {
    const words = String(text || '').split(/s+/).filter(Boolean);
    const lines = [];
    let current = '';
    words.forEach(function (word) {
      const next = current ? current + ' ' + word : word;
      if (next.length > maxLen && current) {
        lines.push(current);
        current = word;
      } else current = next;
    });
    if (current) lines.push(current);
    return lines.slice(0, maxLines || 3);
  }

  function makeProductMockup(product) {
    const palette = mockupPalette(product);
    const lines = wrapMockupText(shortProductTitle(product), 15, 3);
    const badge = product.category === 'Kolageny' ? 'Kolagen' : (product.category === 'Kapsle a softgely' ? 'Kapsle' : 'Gummies');
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240" role="img" aria-label="Mockup produktu">',
      '<rect width="240" height="240" rx="28" fill="#ffffff"/>',
      '<rect x="18" y="16" width="204" height="208" rx="24" fill="' + palette.body + '" stroke="#d9e3da" stroke-width="2"/>',
      '<rect x="18" y="16" width="204" height="24" rx="24" fill="' + palette.top + '"/>',
      '<rect x="34" y="58" width="172" height="122" rx="18" fill="#ffffff" stroke="#d9e3da" stroke-width="2"/>',
      '<rect x="58" y="73" width="124" height="24" rx="12" fill="' + palette.accent + '"/>',
      '<text x="120" y="30" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#000000">MyBears</text>',
      '<text x="120" y="89" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="700" fill="#000000">' + escapeHtml(badge) + '</text>'
    ];
    lines.forEach(function (line, index) {
      svg.push('<text x="120" y="' + (122 + index * 20) + '" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="' + palette.text + '">' + escapeHtml(line) + '</text>');
    });
    svg.push('<text x="120" y="196" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="11" fill="#000000">' + escapeHtml(product.package || '') + '</text>');
    svg.push('</svg>');
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg.join(''));
  }

  function productImageSrc(product, hydrated) {
    return hydrated && hydrated.image ? hydrated.image : makeProductMockup(product);
  }

  function updateHydratedProductUI(root, product, data) {
    if (!root || !product) return;
    if (data && data.price) {
      root.querySelectorAll('[data-role="live-price"][data-product-id="' + cssEscape(product.id) + '"]').forEach(function (node) {
        node.textContent = 'Aktuálna cena: ' + data.price;
      });
    }
    if (data && data.image) {
      root.querySelectorAll('img[data-product-image-id="' + cssEscape(product.id) + '"]').forEach(function (img) {
        img.src = data.image;
        img.classList.add('is-hydrated');
      });
    }
  }

  function getDose(product, doseId) {
    return product.doses.find(function (d) { return d.id === doseId; }) || product.doses[0];
  }

  function calculateSelection(selected, profile) {
    const totals = new Map();
    selected.forEach(function (doseId, productId) {
      const product = PRODUCT_MAP.get(productId);
      if (!product) return;
      const doseDef = getDose(product, doseId);
      Object.keys(product.amounts).forEach(function (substanceId) {
        const def = SUBSTANCES[substanceId];
        if (!def) return;
        const amount = Number(product.amounts[substanceId]) * Number(doseDef.multiplier || 1);
        if (!totals.has(substanceId)) totals.set(substanceId, { id: substanceId, def: def, total: 0, sources: [] });
        const row = totals.get(substanceId);
        row.total += amount;
        row.sources.push({ productId: product.id, productName: product.name, amount: amount, doseLabel: doseDef.label });
      });
    });

    const rows = Array.from(totals.values()).map(function (row) {
      row.overlap = row.sources.length > 1;
      row.nrvPercent = profile === 'adult' && row.def.nrv ? (row.total / row.def.nrv) * 100 : null;
      row.limitPercent = profile === 'adult' && row.def.limit ? (row.total / row.def.limit) * 100 : null;
      row.status = 'ok';
      row.statusText = row.overlap ? 'Překryv ve ' + row.sources.length + ' produktech' : 'Jeden zdroj';
      if (row.overlap) row.status = 'overlap';
      if (row.limitPercent != null && row.limitPercent >= 100) {
        row.status = 'danger';
        row.statusText = 'Na / nad kontrolní hranicí';
      } else if (row.limitPercent != null && row.limitPercent >= 80) {
        row.status = 'warning';
        row.statusText = 'Blízko kontrolní hranice';
      }
      if (row.id === 'zinc' && row.total >= 25 && row.status !== 'danger') {
        row.status = 'warning';
        row.statusText = 'Koncentrovaný součet';
      }
      return row;
    }).sort(function (a, b) {
      const severity = { danger: 4, warning: 3, overlap: 2, ok: 1 };
      if (severity[b.status] !== severity[a.status]) return severity[b.status] - severity[a.status];
      return (a.def.order || 9999) - (b.def.order || 9999);
    });

    const warnings = [];
    const warningKeys = new Set();
    function addWarning(key, title, text, danger) {
      if (warningKeys.has(key)) return;
      warningKeys.add(key);
      warnings.push({ key: key, title: title, text: text, danger: !!danger });
    }

    rows.forEach(function (row) {
      if (row.status === 'danger') addWarning('limit-' + row.id, row.def.label + ': dosažena kontrolní hranice', 'Součet z vybraných doplňků je ' + formatNumber(row.total) + ' ' + row.def.unit + ', což odpovídá ' + formatNumber(row.limitPercent) + ' % hodnoty „' + row.def.limitType + '“ ' + formatNumber(row.def.limit) + ' ' + row.def.unit + '. Nástroj nezapočítává stravu ani jiné přípravky.', true);
      else if (row.status === 'warning' && row.limitPercent != null) addWarning('near-' + row.id, row.def.label + ': blízko kontrolní hranice', 'Vybrané doplňky poskytují ' + formatNumber(row.limitPercent) + ' % kontrolní hranice. Započítejte také další doplňky a stravu.', false);
      if (row.def.special && SPECIAL_WARNINGS[row.def.special]) {
        const shouldShow = row.def.special !== 'zinc' || row.total >= 25;
        if (shouldShow) addWarning('special-' + row.def.special, 'Důležité upozornění', SPECIAL_WARNINGS[row.def.special], false);
      }
    });

    selected.forEach(function (doseId, productId) {
      const product = PRODUCT_MAP.get(productId);
      if (!product) return;
      product.warnings.forEach(function (text, index) {
        addWarning('product-' + product.id + '-' + index, product.name, text, false);
      });
    });

    if (profile === 'child' && selected.size) addWarning('child-profile', 'Dětský režim', 'U dětí nástroj záměrně neporovnává součty s dospělými referenčními hodnotami ani horními hranicemi. Kombinaci více doplňků vždy ověřte s pediatrem.', false);

    return {
      rows: rows,
      warnings: warnings,
      overlapCount: rows.filter(function (r) { return r.overlap; }).length,
      nrvOverCount: rows.filter(function (r) { return r.nrvPercent != null && r.nrvPercent >= 100; }).length,
      limitWarningCount: rows.filter(function (r) { return r.status === 'warning' || r.status === 'danger'; }).length
    };
  }

  function createApp(root) {
    instanceNo += 1;
    const uid = 'mboc-' + instanceNo;
    const state = {
      profile: CONFIG.initialProfile === 'child' ? 'child' : 'adult',
      query: '',
      category: 'Vše',
      selected: new Map(),
      hydrated: new Map()
    };

    root.classList.add('mboc');
    root.setAttribute('data-mboc-version', VERSION);
    root.innerHTML = '<div class="mboc__shell"><header class="mboc__hero"><h2 class="mboc__title">Skontrolujte svoju kombináciu doplnkov</h2><p class="mboc__lead">Vyberte produkty MyBears, ktoré chcete užívať v ten istý deň, a nastavte skutočnú dennú dávku. Nástroj spočíta deklarované účinné látky, ukáže ich zdroje a upozorní na prekryvy alebo vybrané kontrolné hranice.</p><div class="mboc__privacy">🔒 Výber sa neukladá ani neodosiela</div></header><div class="mboc__body" data-role="app"></div></div>';
    const app = root.querySelector('[data-role="app"]');

    function compatibleProducts() {
      return PRODUCTS.filter(function (p) { return p.audience === state.profile; });
    }

    function filteredProducts() {
      const q = state.query.trim().toLocaleLowerCase('cs-CZ');
      return compatibleProducts().filter(function (p) {
        if (state.category !== 'Vše' && p.category !== state.category) return false;
        if (!q) return true;
        const haystack = [p.name,p.summary,p.package,p.category,p.form].concat(p.tags || []).join(' ').toLocaleLowerCase('cs-CZ');
        return haystack.indexOf(q) !== -1;
      });
    }

    function setProfile(profile) {
      if (state.profile === profile) return;
      state.profile = profile;
      state.selected.clear();
      state.query = '';
      state.category = 'Vše';
      render();
    }

    function toggleProduct(id) {
      if (state.selected.has(id)) state.selected.delete(id);
      else {
        const product = PRODUCT_MAP.get(id);
        if (!product || product.audience !== state.profile) return;
        state.selected.set(id, defaultDoseId(product));
        hydrateProduct(product);
      }
      render();
    }

    function addPreset(id) {
      const preset = PRESETS.find(function (p) { return p.id === id; });
      if (!preset || state.profile !== 'adult') return;
      preset.products.forEach(function (pid) {
        const product = PRODUCT_MAP.get(pid);
        if (product) {
          state.selected.set(pid, defaultDoseId(product));
          hydrateProduct(product);
        }
      });
      render();
      const panel = root.querySelector('.mboc__selection');
      if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function setDose(productId, doseId) {
      if (!state.selected.has(productId)) return;
      state.selected.set(productId, doseId);
      renderResultsOnly();
    }

    function reset() {
      state.selected.clear();
      render();
    }

    async function hydrateProduct(product) {
      if (!CONFIG.enableLiveProductData || state.hydrated.has(product.id)) return;
      const url = absoluteUrl(product.url);
      try {
        let promise = pageCache.get(url);
        if (!promise) {
          promise = fetch(url, { credentials: 'same-origin' }).then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
          }).then(function (html) {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const image = doc.querySelector('meta[property="og:image"]') || doc.querySelector('meta[name="twitter:image"]');
            const price = doc.querySelector('meta[property="product:price:amount"]') || doc.querySelector('[itemprop="price"]');
            return {
              image: image ? image.content : '',
              price: price ? (price.content || price.getAttribute('content') || price.textContent || '').trim() : ''
            };
          });
          pageCache.set(url, promise);
        }
        const data = await promise;
        state.hydrated.set(product.id, data);
        updateHydratedProductUI(root, product, data);
      } catch (error) {
        if (CONFIG.debug) console.warn('[MBOC] Live product data failed', product.id, error);
      }
    }

    function productCard(p) {
      const selected = state.selected.has(p.id);
      const hydrated = state.hydrated.get(p.id);
      const imageSrc = productImageSrc(p, hydrated);
      return '<article class="mboc__product' + (selected ? ' is-selected' : '') + '"><div class="mboc__product-top"><div class="mboc__product-media"><img class="mboc__product-image' + (hydrated && hydrated.image ? ' is-hydrated' : '') + '" src="' + escapeHtml(imageSrc) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" data-product-image-id="' + escapeHtml(p.id) + '"><span class="mboc__product-badge">' + escapeHtml(p.category) + '</span></div><div class="mboc__product-head"><div class="mboc__product-icon" aria-hidden="true">' + productIcon(p) + '</div><div><h3 class="mboc__product-title">' + escapeHtml(p.name) + '</h3><div class="mboc__product-meta">' + escapeHtml(p.category) + ' · ' + escapeHtml(p.package) + '</div></div></div></div><p class="mboc__product-summary">' + escapeHtml(p.summary) + '</p>' + (p.tags.length ? '<div class="mboc__tags">' + p.tags.map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('') + '</div>' : '') + '<div class="mboc__product-actions"><button type="button" class="mboc__button ' + (selected ? 'mboc__button--secondary' : 'mboc__button--primary') + '" data-action="' + (selected ? 'scroll-selection' : 'toggle') + '" data-product-id="' + escapeHtml(p.id) + '" aria-pressed="' + String(selected) + '">' + (selected ? 'Nastaviť dávku' : 'Pridať do kontroly') + '</button><a class="mboc__button mboc__button--ghost" href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener">Detail</a></div></article>';
    }

    function selectedCard(p) {
      const doseId = state.selected.get(p.id);
      const hydration = state.hydrated.get(p.id);
      const imageSrc = productImageSrc(p, hydration);
      return '<div class="mboc__selected" data-selected-id="' + escapeHtml(p.id) + '"><div class="mboc__selected-top"><div class="mboc__selected-main"><div class="mboc__selected-visual"><img class="mboc__selected-image' + (hydration && hydration.image ? ' is-hydrated' : '') + '" src="' + escapeHtml(imageSrc) + '" alt="' + escapeHtml(p.name) + '" loading="lazy" data-product-image-id="' + escapeHtml(p.id) + '"></div><div><h3 class="mboc__selected-name">' + escapeHtml(p.name) + '</h3><div class="mboc__product-meta" data-role="live-price" data-product-id="' + escapeHtml(p.id) + '">' + (hydration && hydration.price ? 'Aktuálna cena: ' + escapeHtml(hydration.price) : escapeHtml(p.package)) + '</div></div></div><button type="button" class="mboc__remove" data-action="remove" data-product-id="' + escapeHtml(p.id) + '" aria-label="Odobrať ' + escapeHtml(p.name) + '">×</button></div><label class="mboc__dose-label" for="' + uid + '-dose-' + escapeHtml(p.id) + '">Denná dávka</label><select class="mboc__dose" id="' + uid + '-dose-' + escapeHtml(p.id) + '" data-action="dose" data-product-id="' + escapeHtml(p.id) + '">' + p.doses.map(function (d) { return '<option value="' + escapeHtml(d.id) + '"' + (d.id === doseId ? ' selected' : '') + '>' + escapeHtml(d.label) + '</option>'; }).join('') + '</select></div>';
    }

    function resultMarkup() {
      if (!state.selected.size) return '<section class="mboc__results" aria-live="polite"><div class="mboc__empty">Vyberte aspoň jeden produkt. Prekryvy sa zobrazia automaticky.</div></section>';
      const calc = calculateSelection(state.selected, state.profile);
      const groups = {};
      calc.rows.forEach(function (row) { (groups[row.def.group] || (groups[row.def.group] = [])).push(row); });
      const warnings = calc.warnings.length ? '<div class="mboc__warnings">' + calc.warnings.map(function (w) { return '<div class="mboc__warning' + (w.danger ? ' is-danger' : '') + '"><strong>' + escapeHtml(w.title) + '</strong>' + escapeHtml(w.text) + '</div>'; }).join('') + '</div>' : '';
      const tables = Object.keys(groups).map(function (group) {
        const rows = groups[group].map(function (row) {
          const nrv = row.nrvPercent == null ? '—' : formatNumber(row.nrvPercent) + ' %';
          const limit = row.def.limit && state.profile === 'adult' ? '<div class="mboc__product-meta">' + escapeHtml(row.def.limitType) + ': ' + formatNumber(row.def.limit) + ' ' + escapeHtml(row.def.unit) + '</div>' : '';
          const sources = row.sources.map(function (s) { return '<li><strong>' + escapeHtml(s.productName) + ':</strong> ' + formatNumber(s.amount) + ' ' + escapeHtml(row.def.unit) + ' (' + escapeHtml(s.doseLabel) + ')</li>'; }).join('');
          const note = row.def.note ? '<div class="mboc__product-meta">' + escapeHtml(row.def.note) + '</div>' : '';
          return '<tr><th scope="row"><span class="mboc__substance">' + escapeHtml(row.def.label) + '</span>' + note + '</th><td><span class="mboc__amount">' + formatNumber(row.total) + ' ' + escapeHtml(row.def.unit) + '</span>' + limit + '</td><td class="mboc__nrv">' + nrv + '</td><td class="mboc__sources"><span>' + row.sources.length + ' ' + (row.sources.length === 1 ? 'produkt' : row.sources.length < 5 ? 'produkty' : 'produktů') + '</span><details><summary>Zobrazit zdroje</summary><ul>' + sources + '</ul></details></td><td><span class="mboc__status mboc__status--' + escapeHtml(row.status) + '">' + escapeHtml(row.statusText) + '</span></td></tr>';
        }).join('');
        return '<section class="mboc__group"><h3>' + escapeHtml(group) + '</h3><div class="mboc__table-scroll"><table class="mboc__table"><thead><tr><th>Látka</th><th>Součet z doplňků</th><th>% RHP</th><th>Zdroje</th><th>Vyhodnocení</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>';
      }).join('');
      return '<section class="mboc__results" aria-live="polite"><h2 class="mboc__section-title">Výsledok kontroly</h2><p class="mboc__section-intro">Súčty zodpovedajú nastaveným denným dávkam vybraných produktov. Nejde o odporúčanie na zmenu dávkovania.</p><div class="mboc__summary-cards"><div class="mboc__summary-card"><strong>' + state.selected.size + '</strong><span>vybraných produktov</span></div><div class="mboc__summary-card"><strong>' + calc.overlapCount + '</strong><span>látok z viacerých produktov</span></div><div class="mboc__summary-card"><strong>' + (state.profile === 'adult' ? calc.nrvOverCount : '—') + '</strong><span>látok na 100 % RHP a viac</span></div><div class="mboc__summary-card"><strong>' + calc.limitWarningCount + '</strong><span>kontrolných upozornení</span></div></div>' + warnings + tables + '<div class="mboc__footnotes"><p><strong>Ako čítať výsledok:</strong> RHP je referenční hodnota příjmu pro označování potravin, nikoli maximální bezpečná dávka. Hodnota UL nebo „bezpečná úroveň“ je kontrolní orientační hranice pro dlouhodobý celkový příjem; nástroj však sčítá pouze vybrané doplňky a nezahrnuje stravu, léky ani jiné přípravky.</p><p>Nástroj je určený na orientačnú kontrolu deklarovaných látok pri produktoch MyBears. Nehodnotí diagnózu, laboratórne výsledky, interakcie všetkých liekov ani individuálnu potrebu. Tehotné a dojčiace ženy, deti a ľudia s ochorením alebo pravidelnou medikáciou majú kombináciu konzultovať s lekárom alebo lekárnikom.</p><p>Dáta produktov overené k ' + escapeHtml(DATA_VERIFIED_AT) + '. Pred použitím vždy skontrolujte aktuálnu etiketu konkrétneho balenia.</p></div><div class="mboc__results-actions"><button type="button" class="mboc__button mboc__button--secondary" data-action="print">Vytlačiť výsledok / uložiť ako PDF</button><button type="button" class="mboc__button mboc__button--ghost" data-action="reset">Vymazať výber</button></div></section>';
    }

    function renderResultsOnly() {
      const old = app.querySelector('.mboc__results');
      if (old) old.outerHTML = resultMarkup();
      const count = app.querySelector('.mboc__selection-count');
      if (count) count.textContent = String(state.selected.size);
    }

    function render() {
      const categories = ['Vše','Gummies','Kapsle a softgely','Kolageny'];
      const products = filteredProducts();
      const selectedProducts = Array.from(state.selected.keys()).map(function (id) { return PRODUCT_MAP.get(id); }).filter(Boolean);
      app.innerHTML = '<section class="mboc__profile"><div class="mboc__profile-copy"><strong>Pre koho kontrolujete súčet?</strong><small>Referenčné hodnoty a kontrolné hranice sa u detí a dospelých líšia.</small></div><div class="mboc__segmented" role="group" aria-label="Cílová skupina"><button type="button" data-action="profile" data-profile="adult" class="' + (state.profile === 'adult' ? 'is-active' : '') + '" aria-pressed="' + String(state.profile === 'adult') + '">Dospelý</button><button type="button" data-action="profile" data-profile="child" class="' + (state.profile === 'child' ? 'is-active' : '') + '" aria-pressed="' + String(state.profile === 'child') + '">Dieťa od 3 rokov</button></div></section>' + (state.profile === 'child' ? '<div class="mboc__notice mboc__notice--warning"><p><strong>Detský režim:</strong> nástroj zobrazí deklarované súčty, ale nebude ich porovnávať s dospelými RHP ani hornými hranicami. Kombináciu viacerých doplnkov overte s pediatrom.</p></div>' : '') + '<section class="mboc__presets"><h2 class="mboc__section-title">Rýchle načítanie balíčka</h2><p class="mboc__section-intro">Balíček sa rozloží na jednotlivé produkty, takže pri každom môžete upraviť skutočnú dennú dávku.</p>' + (state.profile === 'adult' ? '<div class="mboc__preset-list">' + PRESETS.map(function (p) { return '<button type="button" class="mboc__preset" data-action="preset" data-preset-id="' + escapeHtml(p.id) + '">' + escapeHtml(p.name) + '</button>'; }).join('') + '</div>' : '<div class="mboc__notice"><p>Pre detskú kategóriu v tejto verzii nie sú pripravené spoločné balíčky určené jednému dieťaťu.</p></div>') + '</section><div class="mboc__workspace"><section class="mboc__catalog"><h2 class="mboc__section-title">1. Vyberte produkty</h2><div class="mboc__toolbar"><label><span class="mboc__sr">Hľadať produkt</span><input class="mboc__search" type="search" placeholder="Hľadať podľa názvu alebo zloženia…" value="' + escapeHtml(state.query) + '" data-action="search"></label><button type="button" class="mboc__button mboc__button--ghost" data-action="clear-search">Vymazať hľadanie</button></div><div class="mboc__tabs" role="tablist" aria-label="Kategorie produktů">' + categories.map(function (c) { return '<button type="button" class="mboc__tab' + (state.category === c ? ' is-active' : '') + '" data-action="category" data-category="' + escapeHtml(c) + '" aria-selected="' + String(state.category === c) + '">' + escapeHtml(c) + '</button>'; }).join('') + '</div><div class="mboc__product-grid">' + (products.length ? products.map(productCard).join('') : '<div class="mboc__empty">Pre zadaný filter sa nenašiel žiadny produkt.</div>') + '</div></section><aside class="mboc__selection"><div class="mboc__panel"><div class="mboc__selection-head"><div><h2 class="mboc__section-title">2. Nastavte dávky</h2><div class="mboc__product-meta">Súčet sa prepočítava okamžite.</div></div><div class="mboc__selection-count" aria-label="Počet vybraných produktov">' + state.selected.size + '</div></div><div class="mboc__selected-list">' + (selectedProducts.length ? selectedProducts.map(selectedCard).join('') : '<div class="mboc__empty">Zatiaľ nemáte vybraný žiadny produkt.</div>') + '</div><div class="mboc__selection-actions"><button type="button" class="mboc__button mboc__button--ghost" data-action="reset"' + (state.selected.size ? '' : ' disabled') + '>Vymazať všetko</button><button type="button" class="mboc__button mboc__button--primary" data-action="scroll-results"' + (state.selected.size ? '' : ' disabled') + '>Prejsť na výsledok</button></div></div></aside></div>' + resultMarkup();
      products.forEach(function (product) { hydrateProduct(product); });
      selectedProducts.forEach(function (product) { hydrateProduct(product); });
    }

    app.addEventListener('click', function (event) {
      const control = event.target.closest('[data-action]');
      if (!control) return;
      const action = control.getAttribute('data-action');
      if (action === 'profile') setProfile(control.getAttribute('data-profile'));
      else if (action === 'toggle' || action === 'remove') toggleProduct(control.getAttribute('data-product-id'));
      else if (action === 'category') { state.category = control.getAttribute('data-category'); render(); }
      else if (action === 'clear-search') { state.query = ''; render(); }
      else if (action === 'preset') addPreset(control.getAttribute('data-preset-id'));
      else if (action === 'reset') reset();
      else if (action === 'print') window.print();
      else if (action === 'scroll-selection') { const selection = root.querySelector('.mboc__selection'); if (selection) selection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      else if (action === 'scroll-results') { const results = root.querySelector('.mboc__results'); if (results) results.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });

    app.addEventListener('input', function (event) {
      if (event.target.matches('[data-action="search"]')) {
        state.query = event.target.value;
        const grid = app.querySelector('.mboc__product-grid');
        if (grid) {
          const products = filteredProducts();
          grid.innerHTML = products.length ? products.map(productCard).join('') : '<div class="mboc__empty">Pre zadaný filter sa nenašiel žiadny produkt.</div>';
        }
      }
    });

    app.addEventListener('change', function (event) {
      if (event.target.matches('[data-action="dose"]')) setDose(event.target.getAttribute('data-product-id'), event.target.value);
    });

    render();
    return { state: state, calculate: function () { return calculateSelection(state.selected, state.profile); }, reset: reset };
  }

  function mount(root) {
    if (!root || root.getAttribute('data-mboc-mounted') === 'true') return null;
    root.setAttribute('data-mboc-mounted', 'true');
    injectStyles();
    return createApp(root);
  }

  function autoMount() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(mount);
  }

  window.MyBearsOverlapChecker = Object.freeze({
    version: VERSION,
    dataVerifiedAt: DATA_VERIFIED_AT,
    products: PRODUCTS,
    substances: SUBSTANCES,
    presets: PRESETS,
    calculate: function (selection, profile) {
      const map = selection instanceof Map ? selection : new Map(Object.entries(selection || {}));
      return calculateSelection(map, profile || 'adult');
    },
    mount: mount
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount, { once: true });
  else autoMount();
})();

/* MyBears sjednocená grafická vrstva 2.0 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || document.getElementById('mb-unified-kontrola-prekryvu-ucinnych-latek-styles')) return;
  var style = document.createElement('style');
  style.id = 'mb-unified-kontrola-prekryvu-ucinnych-latek-styles';
  style.textContent = String.raw`/* MyBears unified design layer — Product Guide v1.8 */
.mboc{--green:#2dc26b!important;--green-dark:#198d4b!important;--ink:#20221f!important;--muted:#626760!important;--soft:#faf7ef!important;--line:#e5e3dc!important;--yellow:#DBC442!important;--warn:#fff8df!important;--warn-border:#DBC442!important;max-width:1200px;margin:24px auto 42px!important;color:var(--ink)!important;font-family:Arial,Helvetica,sans-serif!important}
.mboc__shell{position:relative;border:1px solid var(--line)!important;border-top:0!important;border-radius:18px!important;background:#fff!important;box-shadow:0 12px 32px rgba(27,35,29,.07)!important}
.mboc__shell::before{content:"";position:absolute;z-index:5;top:0;left:0;right:0;height:4px;background:var(--yellow)}
.mboc__hero{padding:clamp(30px,4vw,46px)!important;background:var(--soft)!important;border-bottom:1px solid var(--line)!important;text-align:left!important}
.mboc__title,.mboc__section-title,.mboc__group h3{color:var(--green)!important;letter-spacing:-.01em}
.mboc__title{font-size:clamp(27px,4vw,38px)!important}
.mboc__lead{margin-left:0!important;color:#454a45!important}
.mboc__profile,.mboc__selected,.mboc__footnotes{background:var(--soft)!important;border-color:var(--line)!important}
.mboc__product,.mboc__panel,.mboc__summary-card,.mboc__table-scroll{border-color:var(--line)!important;border-radius:12px!important;box-shadow:none!important}
.mboc__product.is-selected{background:#f4f8f4!important;border-color:var(--green)!important}
.mboc__product-icon{background:var(--yellow)!important}
.mboc__segmented button.is-active,.mboc__selection-count{background:var(--green)!important;color:#fff!important}
.mboc__button{border-radius:8px!important}
.mboc__button--primary{background:var(--green)!important;border-color:var(--green)!important;color:#fff!important}.mboc__button--primary:hover{background:var(--green-dark)!important;border-color:var(--green-dark)!important}
.mboc__button--secondary{background:#fff!important;border-color:var(--green)!important;color:var(--green-dark)!important}
.mboc__preset,.mboc__tab{border-radius:8px!important}.mboc__tab.is-active{background:var(--green)!important;border-color:var(--green)!important;color:#fff!important}
.mboc input:focus,.mboc select:focus,.mboc button:focus-visible,.mboc a:focus-visible,.mboc summary:focus-visible{outline:3px solid rgba(219,196,66,.38)!important;outline-offset:2px!important}
.mboc__table thead th{background:#20231f!important;color:#fff!important;border-bottom:2px solid var(--yellow)!important}.mboc__table tbody tr:nth-child(even){background:#f4f8f4!important}
.mboc__warning,.mboc__notice--warning{border-left-color:var(--yellow)!important;background:var(--warn)!important}
@media(prefers-reduced-motion:reduce){.mboc *,.mboc *::before,.mboc *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}`;
  document.head.appendChild(style);
})();


/* MyBears mockup and final template override 2.1 */
(function () {
  'use strict';
  if (typeof document === 'undefined' || document.getElementById('mb-final-kontrola-prekryvu-ucinnych-latek-styles')) return;
  var style = document.createElement('style');
  style.id = 'mb-final-kontrola-prekryvu-ucinnych-latek-styles';
  style.textContent = String.raw`
.mboc,.mboc *,.mboc *::before,.mboc *::after{font-family:Arial,Helvetica,sans-serif!important}
.mboc{color:#000!important}
.mboc__hero{padding:32px 24px!important;background:#faf7ef!important;border-bottom:1px solid #e5e3dc!important;text-align:center!important}
.mboc__title,.mboc__section-title,.mboc__group h3,.mboc__product-title,.mboc__selected-name,.mboc__substance,.mboc__summary-card strong,.mboc__warning strong,.mboc__profile-copy strong{color:#000!important}
.mboc__lead,.mboc__section-intro,.mboc__product-summary,.mboc__product-meta,.mboc__profile-copy small,.mboc__empty,.mboc__footnotes,.mboc__sources,.mboc__dose-label{color:#000!important}
.mboc__title{margin:0 auto 12px!important;max-width:840px!important}
.mboc__lead{max-width:900px!important;margin:0 auto!important}
.mboc__privacy{color:#000!important;background:#fff!important}
.mboc__preset,.mboc__tab,.mboc__button--ghost,.mboc__button--secondary,.mboc__segmented button,.mboc__tags span,.mboc__sources summary{color:#000!important}
.mboc__tab.is-active,.mboc__segmented button.is-active{color:#fff!important}
.mboc__product-top{display:grid!important;grid-template-columns:96px minmax(0,1fr)!important;gap:14px!important;align-items:start!important;margin-bottom:10px!important}
.mboc__product-media{position:relative!important;display:block!important;width:96px!important;height:96px!important;border-radius:14px!important;background:#fff!important;border:1px solid #e5e3dc!important;overflow:hidden!important;box-shadow:0 5px 14px rgba(0,0,0,.06)!important}
.mboc__product-image,.mboc__selected-image{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#fff!important}
.mboc__product-image:not(.is-hydrated),.mboc__selected-image:not(.is-hydrated){object-fit:contain!important;padding:6px!important}
.mboc__product-badge{position:absolute!important;left:6px!important;right:6px!important;bottom:6px!important;padding:4px 6px!important;border-radius:999px!important;background:rgba(255,255,255,.92)!important;border:1px solid #e5e3dc!important;font-size:10px!important;font-weight:700!important;line-height:1.2!important;text-align:center!important;color:#000!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.mboc__product-head{display:flex!important;gap:10px!important;align-items:flex-start!important}
.mboc__product-head .mboc__product-icon{flex:0 0 38px!important;width:38px!important;height:38px!important;font-size:18px!important}
.mboc__selected-main{display:grid!important;grid-template-columns:54px minmax(0,1fr)!important;gap:10px!important;align-items:start!important}
.mboc__selected-visual{width:54px!important;height:54px!important;border-radius:10px!important;border:1px solid #e5e3dc!important;background:#fff!important;overflow:hidden!important;box-shadow:0 3px 10px rgba(0,0,0,.06)!important}
.mboc__summary-card strong,.mboc__status,.mboc__status--ok,.mboc__status--overlap,.mboc__status--warning,.mboc__status--danger{color:#000!important}
.mboc__table thead th{background:#20231f!important;color:#fff!important}
.mboc__notice,.mboc__warning,.mboc__footnotes,.mboc__selected,.mboc__profile,.mboc__summary-card,.mboc__product,.mboc__panel,.mboc__table-scroll{border-color:#e5e3dc!important}
.mboc__remove{color:#8b1e1e!important}
@media(max-width:640px){.mboc__product-top{grid-template-columns:80px minmax(0,1fr)!important}.mboc__product-media{width:80px!important;height:80px!important}}
`;
  document.head.appendChild(style);
})();

