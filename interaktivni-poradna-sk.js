/**
 * MyBears — zjednotená grafická verzia 2.0 (SK)
 * Vizuálny systém vychádza z MyBears Product Guide v1.8.
 * Funkčná logika pôvodného nástroja zostáva zachovaná.
 */
/**
 * MyBears – Interaktivní poradna a vylepšení blogu
 * Version: 2.0.1-sk
 * Verified against MyBears.sk /advisor structure: 2026-08-04
 *
 * Hub mount point:
 *   <div id="mybears-interactive-advice" data-mybears-interactive-advice></div>
 *
 * Optional configuration before loading:
 * window.MBIA_CONFIG = {
 *   siteOrigin: 'https://www.mybears.sk',
 *   advisorIndexUrl: 'https://www.mybears.sk/advisor',
 *   articlesPerPage: 12,
 *   enableMetadataHydration: true,
 *   metadataConcurrency: 3,
 *   enableShareState: true,
 *   enableArticleEnhancements: true,
 *   enableReadingProgress: true,
 *   enableTableOfContents: true,
 *   enableRelatedArticles: true,
 *   enableReadingPosition: false,
 *   analytics: false,
 *   debug: false
 * };
 *
 * No external dependencies. Cookies are not used.
 * localStorage/sessionStorage are not used unless enableReadingPosition is true.
 */
(function () {
  'use strict';

  var MYBEARS_UNIFIED_DESIGN_CSS = String.raw`
/* MyBears unified design layer — based on Product Guide v1.8 */
.mbia__shell {
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
.mbia__shell::before { content:""; position:absolute; z-index:5; top:0; left:0; right:0; height:4px; background:#DBC442; }
.mbia__shell *, .mbia__shell *::before, .mbia__shell *::after { box-sizing:border-box; }
.mbia__hero { padding:34px 38px 28px !important; border-bottom:1px solid #e5e3dc !important; background:#faf7ef !important; }
.mbia__body { padding:30px 38px 36px !important; }
.mbia__title, .mbia__section-title, .mbia__card-title, .mbia__panel-head h2, .mbia__panel-head h3, .mbia__ingredient-title { color:#2dc26b !important; font-weight:700 !important; letter-spacing:-.01em; }
.mbia__title { margin:0 0 10px !important; font-size:clamp(25px,3.2vw,30px) !important; line-height:1.16 !important; }
.mbia__lead { max-width:820px; color:#454a45 !important; font-size:16px !important; line-height:1.58 !important; }
.mbia__privacy, .mbia__meta, .mbia__section-intro, .mbia__section-note, .mbia__section-help, .mbia__description, .mbia__footnotes, .mbia__note { color:#626760 !important; }
.mbia__button, .mbia__btn { min-height:46px !important; padding:11px 20px !important; border:2px solid transparent !important; border-radius:8px !important; font-weight:700 !important; text-decoration:none !important; transition:background .15s ease,border-color .15s ease,transform .15s ease; }
.mbia__button:hover, .mbia__btn:hover { transform:translateY(-1px); }
.mbia__button:focus-visible, .mbia__btn:focus-visible, .mbia__shell a:focus-visible, .mbia__shell input:focus-visible, .mbia__shell select:focus-visible { outline:3px solid rgba(219,196,66,.38) !important; outline-offset:2px !important; }
.mbia__button--primary, .mbia__btn--primary { color:#fff !important; background:#2dc26b !important; border-color:#2dc26b !important; }
.mbia__button--primary:hover, .mbia__btn--primary:hover { background:#198d4b !important; border-color:#198d4b !important; }
.mbia__button--secondary, .mbia__btn--secondary { color:#198d4b !important; background:#fff !important; border-color:#2dc26b !important; }
.mbia__button--ghost { color:#5e625e !important; background:#fff !important; border-color:#d7d8d4 !important; }
.mbia__input, .mbia__select { min-height:48px !important; border:1px solid #d4d6d1 !important; border-radius:8px !important; background:#fff !important; color:#20221f !important; }
.mbia__input:focus, .mbia__select:focus { outline:3px solid rgba(219,196,66,.30) !important; border-color:#198d4b !important; }
.mbia__search-panel, .mbia__filters, .mbia__profile, .mbia__panel, .mbia__catalog-head { border-color:#e5e3dc !important; border-radius:14px !important; background:#faf7ef !important; box-shadow:none !important; }
.mbia__card, .mbia__analysis-card, .mbia__preset, .mbia__series-btn, .mbia__tray-item, .mbia__selected { border:1px solid #e5e3dc !important; border-radius:14px !important; background:#fff !important; box-shadow:0 4px 14px rgba(31,34,31,.04) !important; }
.mbia__card:hover, .mbia__preset:hover, .mbia__series-btn:hover { border-color:#b8d8c2 !important; box-shadow:0 7px 20px rgba(31,34,31,.06) !important; }
.mbia__card.is-selected, .mbia__preset.is-active, .mbia__topic[aria-pressed="true"] { border-color:#198d4b !important; box-shadow:0 0 0 3px rgba(45,194,107,.075) !important; }
.mbia__tag, .mbia__chip, .mbia__hero-chip { border:1px solid #e5dfd1 !important; background:#faf7ef !important; color:#5f5a4e !important; }
.mbia__notice, .mbia__insight, .mbia__discount-note { border:1px solid #eadfc8 !important; border-left:4px solid #DBC442 !important; border-radius:12px !important; background:#faf7ef !important; color:#4f4b43 !important; }
.mbia__table-wrap { overflow-x:auto; border:1px solid #e5e3dc !important; border-radius:12px !important; }
.mbia__table { width:100%; border-collapse:collapse; background:#fff; }
.mbia__table thead th { border-bottom:2px solid #DBC442 !important; background:#20231f !important; color:#fff !important; }
.mbia__table tbody tr:nth-child(even) { background:#f4f8f4 !important; }
.mbia__difference { background:#fff8df !important; }
.mbia__price, .mbia__product-price, .mbia__selected-price, .mbia__total-row--main strong { color:#198d4b !important; }
.mbia__empty, .mbia__error { border:1px solid #e5e3dc !important; border-radius:14px !important; background:#faf7ef !important; }
@media(max-width:760px) {
  .mbia__shell { margin:18px auto 30px !important; border-radius:15px !important; }
  .mbia__hero { padding:28px 20px 22px !important; }
  .mbia__body { padding:24px 20px 28px !important; }
  .mbia__button, .mbia__btn { max-width:100%; }
}
@media(prefers-reduced-motion:reduce) {
  .mbia__shell *, .mbia__shell *::before, .mbia__shell *::after { scroll-behavior:auto !important; transition:none !important; animation:none !important; }
}
`;


  const VERSION = '2.0.1-sk';
  const VERIFIED_AT = '2026-08-04';
  const ROOT_SELECTOR = '[data-mybears-interactive-advice], #mybears-interactive-advice';
  const STYLE_ID = 'mbia-styles-v1';
  const ARTICLE_PATH_RE = /^\/advisor\/[^/?#]+\/?$/i;
  const DEFAULT_CONFIG = {
    siteOrigin: 'https://www.mybears.sk',
    advisorIndexUrl: 'https://www.mybears.sk/advisor',
    articlesPerPage: 12,
    enableMetadataHydration: true,
    metadataConcurrency: 3,
    enableShareState: true,
    enableArticleEnhancements: true,
    currentArticleUrl: null,
    enableReadingProgress: true,
    enableTableOfContents: true,
    enableRelatedArticles: true,
    enableReadingPosition: false,
    analytics: false,
    debug: false,
    articleContentSelectors: [
      'main .article-detail',
      'main .advisor-detail',
      'main .article-content',
      'main .content-inner',
      'main .content',
      'main'
    ]
  };
  const CONFIG = Object.assign({}, DEFAULT_CONFIG, window.MBIA_CONFIG || {});

  const TOPICS = [
    {
      id: 'glykemie', label: 'Glykémia a metabolizmus', icon: '◒',
      keywords: ['glykem', 'cukr v krvi', 'hba1c', 'prediabet', 'diabet', 'inzulin', 'insulin', 'homa-ir', 'glykemický index', 'glykemická nálož', 'metabolický syndrom', 'triglycerid', 'obvod pása']
    },
    {
      id: 'cholesterol', label: 'Cholesterol a srdce', icon: '♡',
      keywords: ['cholesterol', 'ldl', 'hdl', 'triglycerid', 'kardiovask', 'srdce', 'krvný tlak', 'omega 3', 'omega-3']
    },
    {
      id: 'traveni', label: 'Trávenie a mikroflóra', icon: '◌',
      keywords: ['tráven', 'nadým', 'nafoukl', 'zácp', 'hnačka', 'črev', 'mikroflór', 'probiotik', 'prebiotik', 'vláknin', 'jablečný ocet', 'bruch']
    },
    {
      id: 'spanek-stres', label: 'Spánok, stres a psychika', icon: '☾',
      keywords: ['spánok', 'spaní', 'nespav', 'kortizol', 'stres', 'relax', 'psychik', 'úzkost', 'nálad', 'meduňk', '5-htp', 'serotonin', 'noční budenie']
    },
    {
      id: 'klouby-kosti', label: 'Kĺby, kosti a pohyb', icon: '◇',
      keywords: ['kloub', 'chrupav', 'osteoartr', 'osteopor', 'koleno', 'šlach', 'vaz', 'kost', 'glukosamin', 'chondroitin', 'msm', 'boswell', 'kurkumin', 'pohybový aparát']
    },
    {
      id: 'krasa-pokozka', label: 'Pokožka, vlasy a krása', icon: '✦',
      keywords: ['pokož', 'pleť', 'kož', 'kožní', 'akné', 'kolagen', 'vlasy', 'nechty', 'beauty', 'hyaluron', 'hydratace pleti', 'spfn', 'spf']
    },
    {
      id: 'vitaminy-mineraly', label: 'Vitamíny a minerály', icon: '＋',
      keywords: ['vitamín', 'vitamin', 'minerál', 'horčík', 'zinok', 'železo', 'selen', 'biotin', 'b12', 'b6', 'd3', 'k2', 'folát', 'kyselina listová', 'cholin', 'koenzym q10']
    },
    {
      id: 'sport-vykon', label: 'Šport, energia a výkon', icon: '△',
      keywords: ['sport', 'beh', 'behanie', 'trénink', 'výkon', 'regenerac', 'sval', 'pre-workout', 'preworkout', 'kofein', 'energie', 'e-sport', 'gamer', 'sústredenie']
    },
    {
      id: 'imunita', label: 'Imunita', icon: '✚',
      keywords: ['imunit', 'obranyschop', 'nachlaz', 'infekc', 'vitamín c', 'vitamin c', 'vitamín d', 'vitamin d']
    },
    {
      id: 'deti-rodina', label: 'Deti a rodina', icon: '●',
      keywords: ['deti', 'dieťa', 'detsk', 'rodina', 'škol', 'pediatr']
    },
    {
      id: 'zivotni-styl', label: 'Životný štýl a prevencia', icon: '○',
      keywords: ['pitný režim', 'dehydrat', 'longevity', 'dlhovekosť', 'prevencia', 'chudnutie', 'hmotnost', 'jedálniček', 'strava', 'kancelária', 'únava', 'režim', 'zdravý životný štýl']
    },
    {
      id: 'slozeni-doplnku', label: 'Zloženie a výber doplnkov', icon: '≡',
      keywords: ['ako vybrať', 'rozdiel medzi', 'zloženie', 'etiket', 'doplň', 'gummies', 'bez cukru', 'sladid', 'maltitol', 'erytritol', 'protihrudkuj', 'stearan', 'e551', 'vstrebateľ', 'forma látky']
    }
  ];

  const INTENTS = [
    { id: 'all', label: 'Všetky články', keywords: [] },
    { id: 'understand', label: 'Chcem porozumieť hodnotám a pojmom', keywords: ['hodnot', 'čo je', 'čo znamená', 'rozdiel', 'príznaky', 'diagnost', 'vyšetren', 'test', 'hba1c', 'ldl', 'hdl', 'homa-ir'] },
    { id: 'problem', label: 'Riešim konkrétnu ťažkosť', keywords: ['bolesť', 'únava', 'nadým', 'zápcha', 'nespav', 'budenie', 'suchá', 'dehydrat', 'akné', 'začervenanie', 'chuť na sladké', 'mozgová hmla'] },
    { id: 'choose', label: 'Chcem si lepšie vybrať doplnok', keywords: ['ako vybrať', 'zloženie', 'dávkovanie', 'forma', 'porovn', 'vs.', 'rozdiel medzi', 'kedy užívať', 'ako užívať', 'doplň'] },
    { id: 'routine', label: 'Chcem zlepšiť každodennú rutinu', keywords: ['tipy', 'rutina', 'prevencia', 'jedálniček', 'pohyb', 'pitný režim', 'spánok', 'regenerácia', 'ako často', 'čo pomáha'] }
  ];

  const PILLAR_PATTERNS = {
    'glykemie': ['glykemie-cukr-v-krvi', 'metabolicky-syndrom', 'prediabetes'],
    'cholesterol': ['cholesterol', 'jak-snizit-cholesterol'],
    'traveni': ['nadymani-a-nafoukle-bricho', 'traveni', 'probiotika'],
    'spanek-stres': ['spanek', 'kortizol-a-spanek'],
    'klouby-kosti': ['kloubni-vyziva', 'bolesť-kloubu', 'osteoartroza'],
    'krasa-pokozka': ['typy-pokozky', 'kolagen-na-pokozku', 'jak-vybrat-beauty'],
    'vitaminy-mineraly': ['vitaminy-a-mineraly', 'vitamin-b12'],
    'sport-vykon': ['sport', 'behani'],
    'imunita': ['imunita'],
    'deti-rodina': ['deti'],
    'zivotni-styl': ['longevity', 'pitny-rezim'],
    'slozeni-doplnku': ['jak-vybrat', 'slozeni']
  };

  const FALLBACK_ARTICLES = [
    {
      title: 'Glykémia a cukor v krvi: normálne hodnoty nalačno, po jedle a HbA1c',
      url: '/advisor/glykemia-cukor-v-krvi-hodnoty-nalacno-po-jedle-hba1c',
      description: 'Prehľad hodnôt glykémie nalačno, po jedle, pri OGTT a HbA1c vrátane vysvetlenia domáceho a laboratórneho merania.'
    },
    {
      title: 'Prediabetes: hodnoty cukru v krvi, príznaky a čo sa dá zmeniť',
      url: '/advisor/prediabetes-hodnoty-priznaky-co-robit',
      description: 'Čo znamená prediabetes, ako sa vyšetruje a ktoré zmeny životného štýlu majú zmysel.'
    },
    {
      title: 'Inzulínová rezistencia: príznaky, vyšetrenie, HOMA-IR a liečba',
      url: '/advisor/inzulinova-rezistencia-priznaky-homa-ir-liecba',
      description: 'Vysvetlenie inzulínovej rezistencie, HOMA-IR a súvislostí s pohybom, stravou, spánkom a hmotnosťou.'
    },
    {
      title: 'Kĺbová výživa: ktoré zložky fungujú a prečo ich kombinovať',
      url: '/advisor/klbova-vyziva-ktore-zlozky-funguju-a-preco-ich-kombinovat',
      description: 'Prehľad kolagénu, glukozamínu, chondroitínu, MSM, kyseliny hyalurónovej a rastlinných extraktov.'
    },
    {
      title: 'Bolesť kĺbov: najčastejšie príčiny a kedy spozornieť',
      url: '/advisor/bolest-klbov-priciny-kedy-k-lekarovi',
      description: 'Najčastejšie príčiny bolesťi kĺbov, varovné signály a praktická starostlivosť pri miernych ťažkostiach.'
    },
    {
      title: 'Kolagén na pokožku: kedy má zmysel a čo od neho čakať',
      url: '/advisor/kolagen-na-pokozku-kedy-ma-zmysel',
      description: 'Realistický pohľad na kolagén, SPF, hydratáciu a dlhodobú beauty rutinu.'
    },
    {
      title: 'Pitný režim: koľko piť a ako spoznať dehydratáciu',
      url: '/advisor/pitny-rezim-kolko-pit-ako-spoznat-dehydrataciu',
      description: 'Koľko tekutín potrebujete, čo sa počíta do pitného režimu a ako rozpoznať prvé príznaky dehydratácie.'
    },
    {
      title: 'Vitamín B12: príznaky nedostatku, testy a ako dopĺňať',
      url: '/advisor/vitamin-b12-priznaky-nedostatku-testy-a-ako-doplnat',
      description: 'Rizikové skupiny, laboratórne vyšetrenia, zdroje B12 a praktické možnosti dopĺňania.'
    },
    {
      title: 'Kortizol a spánok: prečo sa v noci budíte a ráno ste bez energie',
      url: '/advisor/kortizol-a-spanok-preco-sa-v-noci-budite',
      description: 'Súvislosti stresu, večerného prebudenia, nočného budenia a rannej únavy.'
    },
    {
      title: 'Gummies bez cukru: maltitol, erytritol a ako fungujú',
      url: '/advisor/vitaminy-bez-cukru-co-znamena-bez-cukru-u-gummies',
      description: 'Ako čítať označenie bez cukru, ako sa líšia sladidlá a ktoré informácie na etikete sledovať.'
    },
    {
      title: 'Longevity: 5 pilierov, ako žiť dlhšie a zdravšie',
      url: '/advisor/longevity-ako-znizit-riziko-civilizacnych-chorob-a-zit-dlhsie',
      description: 'Pohyb, spánok, strava, prevencia a realistická úloha doplnkov v dlhodobej rutine.'
    }
  ];

  const CSS_TEXT = `
.mbia{--mb-green:#2dc26b;--mb-green-dark:#178d4a;--mb-green-soft:#f7fbf8;--mb-green-pale:#ecfaf2;--mb-yellow:#f5e694;--mb-yellow-soft:#fffbed;--mb-text:#1f2933;--mb-muted:#59636e;--mb-border:#d9e5dd;--mb-danger:#b42318;--mb-white:#fff;font-family:Arial,Helvetica,sans-serif;color:var(--mb-text);margin:24px 0;font-weight:400}
.mbia,.mbia *{box-sizing:border-box}
.mbia strong,.mbia b{font-weight:700}
.mbia button,.mbia input,.mbia select{font-family:Arial,Helvetica,sans-serif}
.mbia__shell{max-width:1180px;margin:0 auto;background:#fff;border:1px solid var(--mb-border);border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(31,41,51,.07)}
.mbia__hero{padding:30px;background:linear-gradient(135deg,#f7fbf8 0%,#fff 72%);border-bottom:1px solid var(--mb-border)}
.mbia__title{margin:0 0 10px;font-size:30px;line-height:1.18;font-weight:700;letter-spacing:-.02em}
.mbia__lead{max-width:830px;margin:0;color:var(--mb-muted);font-size:16px;line-height:1.65;font-weight:400}
.mbia__hero-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.mbia__hero-chip{display:inline-flex;align-items:center;min-height:32px;padding:6px 10px;border:1px solid #cfe3d6;border-radius:999px;background:#fff;font-size:13px;font-weight:700;color:#294b37}
.mbia__body{padding:24px 30px 32px}
.mbia__section-title{margin:0 0 12px;font-size:18px;line-height:1.3;font-weight:700}
.mbia__section-help{margin:-4px 0 14px;color:var(--mb-muted);font-size:14px;line-height:1.5}
.mbia__search-panel{display:grid;grid-template-columns:minmax(230px,1.5fr) minmax(180px,.8fr) minmax(180px,.8fr) minmax(150px,.55fr);gap:10px;padding:14px;border:1px solid var(--mb-border);border-radius:12px;background:#fbfdfb}
.mbia__field{min-width:0}
.mbia__label{display:block;margin:0 0 6px;font-size:13px;font-weight:700}
.mbia__input,.mbia__select{width:100%;min-height:44px;padding:10px 12px;border:1px solid #bdcbc2;border-radius:8px;background:#fff;color:var(--mb-text);font-size:15px;font-weight:400;outline:none}
.mbia__input:focus,.mbia__select:focus{border-color:var(--mb-green-dark);box-shadow:0 0 0 3px rgba(45,194,107,.15)}
.mbia__topic-row{display:flex;flex-wrap:wrap;gap:8px;padding:3px 1px 8px;margin:18px 0 4px}
.mbia__topic{flex:0 0 auto;display:inline-flex;align-items:center;gap:7px;min-height:38px;padding:8px 12px;border:1px solid var(--mb-border);border-radius:999px;background:#fff;color:var(--mb-text);font-size:13px;font-weight:700;cursor:pointer}
.mbia__topic:hover{border-color:#9ecfb0;background:var(--mb-green-soft)}
.mbia__topic[aria-pressed="true"]{border-color:var(--mb-green-dark);background:var(--mb-green-pale);color:#126d3a}
.mbia__topic-count{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;padding:0 6px;border-radius:999px;background:#eef3ef;color:#4b5d51;font-size:12px;font-weight:700}
.mbia__topic[aria-pressed="true"] .mbia__topic-count{background:#fff}
.mbia__series{margin:22px 0;padding:18px;border:1px solid #d7eadf;border-radius:12px;background:var(--mb-green-soft)}
.mbia__series-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.mbia__series-btn{display:block;width:100%;padding:13px;border:1px solid #cfe1d4;border-radius:10px;background:#fff;text-align:left;color:var(--mb-text);cursor:pointer}
.mbia__series-btn:hover{border-color:var(--mb-green-dark);transform:translateY(-1px)}
.mbia__series-name{display:block;margin:0 0 4px;font-size:14px;font-weight:700}
.mbia__series-info{display:block;color:var(--mb-muted);font-size:12px;font-weight:400}
.mbia__toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:22px 0 12px}
.mbia__result-count{font-size:14px;color:var(--mb-muted);font-weight:400}
.mbia__result-count strong{color:var(--mb-text)}
.mbia__clear{border:0;background:transparent;color:var(--mb-green-dark);font-size:14px;font-weight:700;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.mbia__featured{display:grid;grid-template-columns:1.3fr .7fr;grid-template-rows:1fr 1fr;gap:12px;margin-bottom:18px}
.mbia__featured .mbia__card:first-child{grid-row:span 2}
.mbia__featured .mbia__card:first-child .mbia__image-wrap{aspect-ratio:16/9}
.mbia__featured .mbia__card:not(:first-child){display:grid;grid-template-columns:140px 1fr}
.mbia__featured .mbia__card:not(:first-child) .mbia__image-wrap{aspect-ratio:auto;height:100%;min-height:135px;border-radius:10px 0 0 10px}
.mbia__featured .mbia__card:not(:first-child) .mbia__card-body{padding:13px}
.mbia__featured .mbia__card:not(:first-child) .mbia__description{display:none}
.mbia__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.mbia__card{position:relative;display:flex;flex-direction:column;min-width:0;border:1px solid var(--mb-border);border-radius:11px;background:#fff;overflow:hidden;transition:transform .15s ease,border-color .15s ease,box-shadow .15s ease}
.mbia__card:hover{transform:translateY(-2px);border-color:#a8d5b8;box-shadow:0 8px 20px rgba(31,41,51,.08)}
.mbia__image-wrap{position:relative;aspect-ratio:16/9;background:#f2f5f3;overflow:hidden}
.mbia__image{display:block;width:100%;height:100%;object-fit:cover}
.mbia__image-placeholder{display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:linear-gradient(135deg,#eff8f2,#fff9d8);font-size:32px;color:#39704e;font-weight:700}
.mbia__new{position:absolute;top:9px;left:9px;padding:5px 8px;border-radius:999px;background:#fff;color:#126d3a;border:1px solid #c9e4d3;font-size:11px;font-weight:700;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.mbia__card-body{display:flex;flex-direction:column;flex:1;padding:16px}
.mbia__card-topics{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px}
.mbia__tag{display:inline-flex;align-items:center;min-height:24px;padding:4px 7px;border-radius:999px;background:#f2f7f4;color:#446051;font-size:11px;font-weight:700}
.mbia__card-title{margin:0 0 8px;font-size:17px;line-height:1.35;font-weight:700}
.mbia__card-title a{color:var(--mb-text);text-decoration:none}
.mbia__card-title a:hover{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:3px}
.mbia__description{margin:0 0 12px;color:var(--mb-muted);font-size:14px;line-height:1.55;font-weight:400;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.mbia__card-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:10px;color:var(--mb-muted);font-size:12px;font-weight:400}
.mbia__card-meta span{display:inline-flex;align-items:center;gap:4px}
.mbia__card-actions{display:flex;gap:8px;margin-top:12px}
.mbia__btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 14px;border-radius:8px;border:1px solid transparent;font-size:14px;font-weight:700;text-decoration:none;cursor:pointer}
.mbia__btn--primary{flex:1;background:var(--mb-green);color:#fff}
.mbia__btn--primary:hover{background:var(--mb-green-dark);color:#fff}
.mbia__btn--secondary{background:#fff;border-color:#bdcbc2;color:var(--mb-text)}
.mbia__btn--secondary:hover{border-color:var(--mb-green-dark);background:var(--mb-green-soft)}
.mbia__load-more-wrap{text-align:center;margin-top:20px}
.mbia__empty,.mbia__error{padding:26px;border:1px solid var(--mb-border);border-radius:12px;background:#fbfdfb;text-align:center}
.mbia__empty-title,.mbia__error-title{margin:0 0 7px;font-size:18px;font-weight:700}
.mbia__empty p,.mbia__error p{margin:0;color:var(--mb-muted);line-height:1.55}
.mbia__skeleton{height:360px;border-radius:12px;background:linear-gradient(90deg,#f2f5f3 25%,#f8faf9 37%,#f2f5f3 63%);background-size:400% 100%;animation:mbia-shimmer 1.4s ease infinite}
@keyframes mbia-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}
.mbia__note{margin-top:22px;padding:14px 16px;border-radius:10px;background:#f5f7f6;color:var(--mb-muted);font-size:13px;line-height:1.55;font-weight:400}
.mbia__progress{position:fixed;z-index:9999;left:0;top:0;width:100%;height:4px;background:transparent;pointer-events:none}
.mbia__progress-bar{height:100%;width:0;background:var(--mb-green,#2dc26b);transition:width .08s linear}
.mbia-article-tools{max-width:920px;margin:20px auto;font-family:Arial,Helvetica,sans-serif;color:#1f2933;font-weight:400}
.mbia-article-tools *{box-sizing:border-box}
.mbia-toc{margin:22px 0;padding:18px;border:1px solid #d9e5dd;border-radius:12px;background:#f7fbf8}
.mbia-toc__title{margin:0 0 10px;font-size:17px;line-height:1.3;font-weight:700}
.mbia-toc__list{margin:0;padding-left:20px}
.mbia-toc__list li{margin:6px 0}
.mbia-toc__list li.mbia-toc__sub{margin-left:18px;font-size:14px}
.mbia-toc__list a{color:#176d3d;text-decoration:none;font-weight:400}
.mbia-toc__list a:hover{text-decoration:underline}
.mbia-related{margin:30px 0;padding:20px;border:1px solid #d9e5dd;border-radius:12px;background:#fff}
.mbia-related__title{margin:0 0 6px;font-size:20px;font-weight:700}
.mbia-related__lead{margin:0 0 14px;color:#59636e;font-size:14px;line-height:1.5}
.mbia-related__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.mbia-related__item{display:block;padding:13px;border:1px solid #d9e5dd;border-radius:9px;color:#1f2933;text-decoration:none;background:#fff}
.mbia-related__item:hover{border-color:#2dc26b;background:#f7fbf8}
.mbia-related__item strong{display:block;margin-bottom:5px;font-size:14px;line-height:1.4;font-weight:700}
.mbia-related__item span{display:block;color:#59636e;font-size:12px;font-weight:400}
@media (max-width:980px){.mbia__search-panel{grid-template-columns:1fr 1fr}.mbia__series-grid{grid-template-columns:repeat(2,1fr)}.mbia__featured{grid-template-columns:1fr 1fr}.mbia__featured .mbia__card:first-child{grid-column:1/-1;grid-row:auto}.mbia__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:650px){.mbia{margin:14px 0}.mbia__topic-row{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:thin}.mbia__shell{border-radius:10px}.mbia__hero{padding:22px 18px}.mbia__title{font-size:25px}.mbia__lead{font-size:15px}.mbia__body{padding:18px}.mbia__search-panel{grid-template-columns:1fr;padding:12px}.mbia__series-grid,.mbia__featured,.mbia__grid,.mbia-related__grid{grid-template-columns:1fr}.mbia__featured .mbia__card:not(:first-child){display:flex}.mbia__featured .mbia__card:not(:first-child) .mbia__image-wrap{height:auto;min-height:0;aspect-ratio:16/9;border-radius:0}.mbia__featured .mbia__card:not(:first-child) .mbia__description{display:-webkit-box}.mbia__toolbar{align-items:flex-start}.mbia__card-actions{flex-direction:column}.mbia__btn{width:100%}.mbia-toc{padding:15px}}
@media (prefers-reduced-motion:reduce){.mbia__card,.mbia__series-btn,.mbia__progress-bar{transition:none}.mbia__skeleton{animation:none}}
@media print{.mbia__search-panel,.mbia__topic-row,.mbia__series,.mbia__toolbar,.mbia__load-more-wrap,.mbia__card-actions,.mbia__note{display:none!important}.mbia__shell{border:0;box-shadow:none}.mbia__grid,.mbia__featured{grid-template-columns:repeat(2,1fr)}.mbia__card{break-inside:avoid}.mbia__progress{display:none}}
`;

  const indexCache = new Map();
  const metadataCache = new Map();
  let metadataActive = 0;
  const metadataQueue = [];
  let instanceCounter = 0;

  function log() {
    if (CONFIG.debug && window.console) console.log.apply(console, ['[MBIA]'].concat(Array.prototype.slice.call(arguments)));
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char];
    });
  }

  function normalizeText(value) {
    return String(value == null ? '' : value)
      .replace(/\s+/g, ' ')
      .trim();
  }

  function searchText(value) {
    return normalizeText(value)
      .toLocaleLowerCase('sk-SK')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function slugify(value) {
    return searchText(value)
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80);
  }

  function absoluteUrl(path) {
    try { return new URL(path, CONFIG.siteOrigin || window.location.origin).href; }
    catch (error) { return path; }
  }

  function relativeUrl(path) {
    try {
      const url = new URL(path, CONFIG.siteOrigin || window.location.origin);
      return url.pathname + url.search + url.hash;
    } catch (error) { return path; }
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS_TEXT;
    style.textContent += MYBEARS_UNIFIED_DESIGN_CSS;
    document.head.appendChild(style);
  }

  function emit(eventName, data) {
    if (!CONFIG.analytics || !window.dataLayer || !Array.isArray(window.dataLayer)) return;
    window.dataLayer.push(Object.assign({ event: eventName, component: 'mybears_interactive_advice' }, data || {}));
  }

  function safeImageUrl(img) {
    if (!img) return '';
    const attrs = ['src', 'data-src', 'data-lazy-src', 'data-original'];
    for (let i = 0; i < attrs.length; i += 1) {
      const value = img.getAttribute(attrs[i]);
      if (value && !/^data:image\/svg/i.test(value)) return absoluteUrl(value);
    }
    const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset');
    if (srcset) {
      const candidate = srcset.split(',').pop().trim().split(/\s+/)[0];
      if (candidate) return absoluteUrl(candidate);
    }
    return '';
  }

  function findCardContainer(link) {
    let node = link.closest('article, li, .article, .article-item, .item, .list-item, .post, .blog-item');
    if (node) return node;
    node = link.parentElement;
    for (let depth = 0; node && depth < 6; depth += 1, node = node.parentElement) {
      const articleLinks = node.querySelectorAll ? node.querySelectorAll('h2 a[href*="/advisor/"],h3 a[href*="/advisor/"]') : [];
      const textLength = normalizeText(node.textContent).length;
      if (articleLinks.length <= 1 && textLength >= 80 && textLength <= 1800) return node;
    }
    return link.parentElement;
  }

  function findDescription(container, title) {
    if (!container) return '';
    const paragraphs = Array.from(container.querySelectorAll('p'))
      .map(function (p) { return normalizeText(p.textContent); })
      .filter(function (text) {
        return text.length >= 55 && text.length <= 900 &&
          searchText(text).indexOf('pokracovat na cely clanek') === -1 &&
          searchText(text) !== searchText(title);
      })
      .sort(function (a, b) { return b.length - a.length; });
    if (paragraphs.length) return paragraphs[0];
    const raw = normalizeText(container.textContent)
      .replace(normalizeText(title), '')
      .replace(/Pokračovat na celý článok/gi, '')
      .trim();
    return raw.length > 55 ? raw.slice(0, 700) : '';
  }

  function classifyTopics(article) {
    const haystack = searchText([article.title, article.description, article.slug].join(' '));
    const scored = TOPICS.map(function (topic) {
      let score = 0;
      topic.keywords.forEach(function (keyword) {
        const needle = searchText(keyword);
        if (!needle) return;
        if (haystack.indexOf(needle) !== -1) score += needle.length > 10 ? 3 : 2;
        if (searchText(article.title).indexOf(needle) !== -1) score += 2;
      });
      return { id: topic.id, score: score };
    }).filter(function (item) { return item.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });
    if (!scored.length) return ['zivotni-styl'];
    const best = scored[0].score;
    return scored.filter(function (item, index) { return index < 3 && item.score >= Math.max(2, best - 2); })
      .map(function (item) { return item.id; });
  }

  function classifyIntents(article) {
    const haystack = searchText([article.title, article.description, article.slug].join(' '));
    const result = INTENTS.filter(function (intent) {
      if (intent.id === 'all') return false;
      return intent.keywords.some(function (keyword) { return haystack.indexOf(searchText(keyword)) !== -1; });
    }).map(function (intent) { return intent.id; });
    return result.length ? result : ['routine'];
  }

  function enrichArticle(article, index) {
    const url = new URL(article.url, CONFIG.siteOrigin || window.location.origin);
    const result = Object.assign({}, article, {
      url: relativeUrl(url.href),
      absoluteUrl: url.href,
      slug: url.pathname.split('/').filter(Boolean).pop() || slugify(article.title),
      order: Number.isFinite(index) ? index : 9999,
      image: article.image || '',
      publishedAt: article.publishedAt || '',
      readingMinutes: article.readingMinutes || null,
      wordCount: article.wordCount || null
    });
    result.topics = classifyTopics(result);
    result.intents = classifyIntents(result);
    return result;
  }

  function parseAdvisorIndex(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const selectors = [
      'main h2 a[href*="/advisor/"]',
      'main h3 a[href*="/advisor/"]',
      'h2 a[href*="/advisor/"]',
      'h3 a[href*="/advisor/"]'
    ];
    const links = Array.from(doc.querySelectorAll(selectors.join(',')));
    const seen = new Set();
    const articles = [];
    links.forEach(function (link) {
      let url;
      try { url = new URL(link.getAttribute('href'), CONFIG.siteOrigin || window.location.origin); }
      catch (error) { return; }
      if (!ARTICLE_PATH_RE.test(url.pathname)) return;
      if (seen.has(url.pathname)) return;
      const title = normalizeText(link.textContent);
      if (title.length < 8 || /pokračovat|celý článok/i.test(title)) return;
      const container = findCardContainer(link);
      const imageNode = container && container.querySelector('img');
      let image = safeImageUrl(imageNode);
      if (!image && container && container.previousElementSibling) image = safeImageUrl(container.previousElementSibling.querySelector && container.previousElementSibling.querySelector('img'));
      const description = findDescription(container, title);
      seen.add(url.pathname);
      articles.push(enrichArticle({ title: title, url: url.href, description: description, image: image }, articles.length));
    });
    return articles;
  }

  function fetchAdvisorIndex() {
    const url = absoluteUrl(CONFIG.advisorIndexUrl);
    if (indexCache.has(url)) return indexCache.get(url);
    const promise = fetch(url, { credentials: 'same-origin', headers: { Accept: 'text/html' } })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.text();
      })
      .then(function (html) {
        const articles = parseAdvisorIndex(html);
        if (articles.length < 3) throw new Error('Na stránce blogu nebyl nalezen dostatečný počet článkov.');
        return articles;
      })
      .catch(function (error) {
        log('Index fetch failed; using fallback data.', error);
        return FALLBACK_ARTICLES.map(function (article, index) { return enrichArticle(article, index); });
      });
    indexCache.set(url, promise);
    return promise;
  }

  function findJsonLdArticle(value) {
    if (!value) return null;
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i += 1) {
        const found = findJsonLdArticle(value[i]);
        if (found) return found;
      }
      return null;
    }
    if (typeof value !== 'object') return null;
    const type = value['@type'];
    const types = Array.isArray(type) ? type : [type];
    if (types.some(function (item) { return /Article|BlogPosting|NewsArticle/i.test(String(item)); })) return value;
    if (value['@graph']) return findJsonLdArticle(value['@graph']);
    return null;
  }

  function extractReadableText(doc) {
    const clone = doc.cloneNode(true);
    clone.querySelectorAll('script,style,noscript,nav,header,footer,form,.recommended-products,.products,.cookie,.breadcrumb').forEach(function (node) { node.remove(); });
    const selector = CONFIG.articleContentSelectors.find(function (item) { return clone.querySelector(item); });
    const root = selector ? clone.querySelector(selector) : clone.body;
    return normalizeText(root ? root.textContent : '');
  }

  function fetchArticleMetadata(article) {
    if (!CONFIG.enableMetadataHydration) return Promise.resolve(article);
    const url = absoluteUrl(article.url);
    if (metadataCache.has(url)) return metadataCache.get(url);
    const promise = new Promise(function (resolve) {
      metadataQueue.push({ article: article, resolve: resolve });
      drainMetadataQueue();
    });
    metadataCache.set(url, promise);
    return promise;
  }

  function drainMetadataQueue() {
    const limit = Math.max(1, Number(CONFIG.metadataConcurrency) || 3);
    while (metadataActive < limit && metadataQueue.length) {
      const task = metadataQueue.shift();
      metadataActive += 1;
      fetch(absoluteUrl(task.article.url), { credentials: 'same-origin', headers: { Accept: 'text/html' } })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.text();
        })
        .then(function (html) {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          let jsonLd = null;
          Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).some(function (script) {
            try { jsonLd = findJsonLdArticle(JSON.parse(script.textContent)); }
            catch (error) { jsonLd = null; }
            return !!jsonLd;
          });
          const metaPublished = doc.querySelector('meta[property="article:published_time"],meta[name="date"],meta[itemprop="datePublished"]');
          const publishedAt = (jsonLd && (jsonLd.datePublished || jsonLd.dateCreated)) || (metaPublished && metaPublished.getAttribute('content')) || '';
          let image = task.article.image;
          if (!image && jsonLd && jsonLd.image) {
            const imageValue = Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image;
            image = typeof imageValue === 'object' ? imageValue.url || imageValue.contentUrl : imageValue;
          }
          if (!image) {
            const ogImage = doc.querySelector('meta[property="og:image"]');
            image = ogImage && ogImage.getAttribute('content');
          }
          const text = extractReadableText(doc);
          const wordCount = text ? text.split(/\s+/).filter(Boolean).length : null;
          const readingMinutes = wordCount ? Math.max(2, Math.round(wordCount / 210)) : null;
          task.resolve(Object.assign({}, task.article, {
            image: image ? absoluteUrl(image) : task.article.image,
            publishedAt: publishedAt,
            wordCount: wordCount,
            readingMinutes: readingMinutes
          }));
        })
        .catch(function (error) {
          log('Article metadata failed', task.article.url, error);
          task.resolve(task.article);
        })
        .finally(function () {
          metadataActive -= 1;
          drainMetadataQueue();
        });
    }
  }

  function topicById(id) {
    return TOPICS.find(function (topic) { return topic.id === id; });
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  }

  function pillarScore(article, topicId) {
    const patterns = PILLAR_PATTERNS[topicId] || [];
    const slug = searchText(article.slug);
    for (let i = 0; i < patterns.length; i += 1) {
      if (slug.indexOf(searchText(patterns[i])) !== -1) return 100 - i * 5;
    }
    return 0;
  }

  function readStateFromHash() {
    if (!CONFIG.enableShareState) return {};
    const hash = String(window.location.hash || '').replace(/^#/, '');
    const params = new URLSearchParams(hash);
    return {
      query: params.get('hledat') || '',
      topic: params.get('tema') || 'all',
      intent: params.get('zamer') || 'all',
      sort: params.get('razeni') || 'newest'
    };
  }

  function updateStateHash(state) {
    if (!CONFIG.enableShareState) return;
    const params = new URLSearchParams();
    if (state.query) params.set('hledat', state.query);
    if (state.topic !== 'all') params.set('tema', state.topic);
    if (state.intent !== 'all') params.set('zamer', state.intent);
    if (state.sort !== 'newest') params.set('razeni', state.sort);
    const next = params.toString();
    try { history.replaceState(null, '', window.location.pathname + window.location.search + (next ? '#' + next : '')); }
    catch (error) { /* no-op */ }
  }

  function createHub(root) {
    instanceCounter += 1;
    const uid = 'mbia-' + instanceCounter;
    const initial = readStateFromHash();
    const state = {
      articles: [],
      query: initial.query || '',
      topic: initial.topic || 'all',
      intent: initial.intent || 'all',
      sort: (initial.sort === 'series' && (initial.topic || 'all') === 'all') ? 'newest' : (initial.sort || 'newest'),
      visible: Math.max(6, Number(CONFIG.articlesPerPage) || 12),
      loading: true,
      metadata: new Map(),
      observer: null
    };

    root.classList.add('mbia');
    root.setAttribute('data-mbia-version', VERSION);
    root.innerHTML = '<div class="mbia__shell"><header class="mbia__hero"><h2 class="mbia__title">Nájdite článok podľa toho, čo práve riešite</h2><p class="mbia__lead">Prehľadajte poradňu MyBears podľa témy, konkrétnej otázky alebo cieľa. Nové články sa do prehľadu načítavajú automaticky z blogu.</p><div class="mbia__hero-meta"><span class="mbia__hero-chip">Aktuálne články z poradne</span><span class="mbia__hero-chip">Tematické série</span><span class="mbia__hero-chip">Bez registrácie</span></div></header><div class="mbia__body" data-role="body"><div class="mbia__skeleton" aria-label="Načítanie článkov"></div></div></div>';
    const body = root.querySelector('[data-role="body"]');

    function topicCounts() {
      const counts = new Map();
      TOPICS.forEach(function (topic) { counts.set(topic.id, 0); });
      state.articles.forEach(function (article) {
        article.topics.forEach(function (topicId) { counts.set(topicId, (counts.get(topicId) || 0) + 1); });
      });
      return counts;
    }

    function filteredArticles() {
      const query = searchText(state.query);
      let result = state.articles.filter(function (article) {
        if (state.topic !== 'all' && article.topics.indexOf(state.topic) === -1) return false;
        if (state.intent !== 'all' && article.intents.indexOf(state.intent) === -1) return false;
        if (query) {
          const topicNames = article.topics.map(function (id) { const topic = topicById(id); return topic ? topic.label : ''; });
          const haystack = searchText([article.title, article.description, article.slug].concat(topicNames).join(' '));
          const words = query.split(/\s+/).filter(Boolean);
          if (!words.every(function (word) { return haystack.indexOf(word) !== -1; })) return false;
        }
        return true;
      });
      result = result.slice();
      if (state.sort === 'az') result.sort(function (a, b) { return a.title.localeCompare(b.title, 'sk-SK'); });
      else if (state.sort === 'reading') result.sort(function (a, b) {
        const am = (state.metadata.get(a.url) || a).readingMinutes || 999;
        const bm = (state.metadata.get(b.url) || b).readingMinutes || 999;
        return am - bm || a.order - b.order;
      });
      else if (state.sort === 'series' && state.topic !== 'all') result.sort(function (a, b) {
        return pillarScore(b, state.topic) - pillarScore(a, state.topic) || a.order - b.order;
      });
      else result.sort(function (a, b) {
        const ad = new Date((state.metadata.get(a.url) || a).publishedAt || 0).getTime();
        const bd = new Date((state.metadata.get(b.url) || b).publishedAt || 0).getTime();
        if (ad && bd && ad !== bd) return bd - ad;
        return a.order - b.order;
      });
      return result;
    }

    function articleView(article) {
      return state.metadata.get(article.url) || article;
    }

    function cardHtml(article, featured) {
      const view = articleView(article);
      const topics = article.topics.slice(0, 2).map(function (id) {
        const topic = topicById(id);
        return topic ? '<span class="mbia__tag">' + escapeHtml(topic.label) + '</span>' : '';
      }).join('');
      const image = view.image ? '<img class="mbia__image" src="' + escapeHtml(view.image) + '" alt="" loading="lazy" decoding="async">' : '<div class="mbia__image-placeholder" aria-hidden="true">' + escapeHtml((topicById(article.topics[0]) || {}).icon || '○') + '</div>';
      const date = formatDate(view.publishedAt);
      const reading = view.readingMinutes ? view.readingMinutes + ' min čítania' : '';
      const isNew = article.order < 4 && !state.query && state.topic === 'all' && state.intent === 'all';
      return '<article class="mbia__card" data-article-url="' + escapeHtml(article.url) + '"><div class="mbia__image-wrap">' + image + (isNew ? '<span class="mbia__new">Novinky v poradni</span>' : '') + '</div><div class="mbia__card-body"><div class="mbia__card-topics">' + topics + '</div><h3 class="mbia__card-title"><a href="' + escapeHtml(article.url) + '">' + escapeHtml(article.title) + '</a></h3>' + (article.description ? '<p class="mbia__description">' + escapeHtml(article.description) + '</p>' : '') + '<div class="mbia__card-meta">' + (date ? '<span>Publikované ' + escapeHtml(date) + '</span>' : '') + (reading ? '<span>' + escapeHtml(reading) + '</span>' : '') + '</div><div class="mbia__card-actions"><a class="mbia__btn mbia__btn--primary" href="' + escapeHtml(article.url) + '">Prečítať článok</a></div></div></article>';
    }

    function seriesHtml() {
      const counts = topicCounts();
      const series = TOPICS.map(function (topic) { return { topic: topic, count: counts.get(topic.id) || 0 }; })
        .filter(function (item) { return item.count >= 3; })
        .sort(function (a, b) { return b.count - a.count; })
        .slice(0, 8);
      if (!series.length) return '';
      return '<section class="mbia__series" aria-labelledby="' + uid + '-series"><h3 class="mbia__section-title" id="' + uid + '-series">Prejdite si celé tematické série</h3><p class="mbia__section-help">Začnite základným článkem a pokračujte do väčšieho detailu.</p><div class="mbia__series-grid">' + series.map(function (item) {
        return '<button type="button" class="mbia__series-btn" data-series="' + escapeHtml(item.topic.id) + '"><span class="mbia__series-name">' + escapeHtml(item.topic.icon + ' ' + item.topic.label) + '</span><span class="mbia__series-info">' + item.count + ' článkov v tématu</span></button>';
      }).join('') + '</div></section>';
    }

    function renderControls() {
      const counts = topicCounts();
      body.innerHTML = '<section aria-labelledby="' + uid + '-search"><h3 class="mbia__section-title" id="' + uid + '-search">Čo hľadáte?</h3><div class="mbia__search-panel"><div class="mbia__field"><label class="mbia__label" for="' + uid + '-query">Hľadať v článkoch</label><input class="mbia__input" id="' + uid + '-query" type="search" value="' + escapeHtml(state.query) + '" placeholder="Napr. glykémia, horčík, nadúvanie, kĺby…" autocomplete="off"></div><div class="mbia__field"><label class="mbia__label" for="' + uid + '-intent">Podľa zámeru</label><select class="mbia__select" id="' + uid + '-intent">' + INTENTS.map(function (intent) { return '<option value="' + escapeHtml(intent.id) + '"' + (state.intent === intent.id ? ' selected' : '') + '>' + escapeHtml(intent.label) + '</option>'; }).join('') + '</select></div><div class="mbia__field"><label class="mbia__label" for="' + uid + '-sort">Zoradenie</label><select class="mbia__select" id="' + uid + '-sort"><option value="newest"' + (state.sort === 'newest' ? ' selected' : '') + '>Najnovšie</option><option value="az"' + (state.sort === 'az' ? ' selected' : '') + '>Názov A–Z</option><option value="reading"' + (state.sort === 'reading' ? ' selected' : '') + '>Najkratšie čítanie</option><option value="series"' + (state.sort === 'series' ? ' selected' : '') + (state.topic === 'all' ? ' disabled' : '') + '>Od základov do detailu</option></select></div><div class="mbia__field"><label class="mbia__label">Filtre</label><button type="button" class="mbia__btn mbia__btn--secondary" data-clear style="width:100%">Vymazať výber</button></div></div><div class="mbia__topic-row" role="group" aria-label="Témy článkov"><button type="button" class="mbia__topic" data-topic="all" aria-pressed="' + (state.topic === 'all') + '">Všetky témy <span class="mbia__topic-count">' + state.articles.length + '</span></button>' + TOPICS.map(function (topic) {
        const count = counts.get(topic.id) || 0;
        if (!count) return '';
        return '<button type="button" class="mbia__topic" data-topic="' + escapeHtml(topic.id) + '" aria-pressed="' + (state.topic === topic.id) + '">' + escapeHtml(topic.icon + ' ' + topic.label) + ' <span class="mbia__topic-count">' + count + '</span></button>';
      }).join('') + '</div></section>' + seriesHtml() + '<div data-role="results"></div><div class="mbia__note">Interaktívny prehľad načítava články z hlavného blogu MyBears. Informácie v článkoch majú vzdelávací charakter a nenahrádzajú individuálne vyšetrenie ani odporúčanie lekára.</div>';
      bindControls();
      renderResults();
    }

    function bindControls() {
      const query = body.querySelector('#' + uid + '-query');
      let timer = null;
      query.addEventListener('input', function () {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          state.query = query.value.trim();
          state.visible = Math.max(6, Number(CONFIG.articlesPerPage) || 12);
          updateStateHash(state);
          renderResults();
        }, 180);
      });
      body.querySelector('#' + uid + '-intent').addEventListener('change', function (event) {
        state.intent = event.target.value;
        state.visible = Math.max(6, Number(CONFIG.articlesPerPage) || 12);
        updateStateHash(state);
        renderResults();
      });
      body.querySelector('#' + uid + '-sort').addEventListener('change', function (event) {
        state.sort = event.target.value;
        updateStateHash(state);
        renderResults();
      });
      body.querySelector('[data-clear]').addEventListener('click', function () {
        state.query = '';
        state.topic = 'all';
        state.intent = 'all';
        state.sort = 'newest';
        state.visible = Math.max(6, Number(CONFIG.articlesPerPage) || 12);
        updateStateHash(state);
        renderControls();
      });
      body.querySelectorAll('[data-topic]').forEach(function (button) {
        button.addEventListener('click', function () {
          state.topic = button.getAttribute('data-topic') || 'all';
          if (state.topic === 'all' && state.sort === 'series') state.sort = 'newest';
          state.visible = Math.max(6, Number(CONFIG.articlesPerPage) || 12);
          updateStateHash(state);
          renderControls();
          emit('mbia_topic_select');
        });
      });
      body.querySelectorAll('[data-series]').forEach(function (button) {
        button.addEventListener('click', function () {
          state.topic = button.getAttribute('data-series') || 'all';
          state.intent = 'all';
          state.sort = 'series';
          state.visible = Math.max(6, Number(CONFIG.articlesPerPage) || 12);
          updateStateHash(state);
          renderControls();
          body.querySelector('[data-role="results"]').scrollIntoView({ behavior: 'smooth', block: 'start' });
          emit('mbia_series_open');
        });
      });
    }

    function setupMetadataHydration(articles) {
      if (!CONFIG.enableMetadataHydration) return;
      if (state.observer) state.observer.disconnect();
      state.observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const url = entry.target.getAttribute('data-article-url');
          const article = state.articles.find(function (item) { return item.url === url; });
          if (!article || state.metadata.has(url)) return;
          state.observer.unobserve(entry.target);
          fetchArticleMetadata(article).then(function (hydrated) {
            state.metadata.set(url, hydrated);
            const currentCards = body.querySelectorAll('[data-article-url="' + (window.CSS && CSS.escape ? CSS.escape(url) : url.replace(/"/g, '\\"')) + '"]');
            currentCards.forEach(function (card) {
              const wrapper = document.createElement('div');
              wrapper.innerHTML = cardHtml(article, false);
              card.replaceWith(wrapper.firstElementChild);
            });
          });
        });
      }, { rootMargin: '350px 0px' });
      body.querySelectorAll('[data-article-url]').forEach(function (card) { state.observer.observe(card); });
    }

    function renderResults() {
      const container = body.querySelector('[data-role="results"]');
      if (!container) return;
      const result = filteredArticles();
      const visible = result.slice(0, state.visible);
      const defaultView = !state.query && state.topic === 'all' && state.intent === 'all' && state.sort === 'newest';
      const featured = defaultView ? visible.slice(0, Math.min(3, visible.length)) : [];
      const regular = defaultView ? visible.slice(featured.length) : visible;
      const activeTopic = topicById(state.topic);
      const heading = activeTopic ? activeTopic.label : state.query ? 'Výsledky vyhľadávania' : 'Všetky články';
      let html = '<div class="mbia__toolbar"><div><h3 class="mbia__section-title" style="margin-bottom:3px">' + escapeHtml(heading) + '</h3><div class="mbia__result-count">Nájdených <strong>' + result.length + '</strong> článkov</div></div>' + ((state.query || state.topic !== 'all' || state.intent !== 'all') ? '<button type="button" class="mbia__clear" data-results-clear>Zrušiť filtre</button>' : '') + '</div>';
      if (!result.length) {
        html += '<div class="mbia__empty"><h4 class="mbia__empty-title">Pre túto kombináciu sme článok nenašli</h4><p>Skúste všeobecnejší výraz alebo zrušte niektorý filter. Môžete aj prejsť na kompletný <a href="' + escapeHtml(CONFIG.advisorIndexUrl) + '">blog MyBears</a>.</p></div>';
      } else {
        if (featured.length) html += '<div class="mbia__featured">' + featured.map(function (article) { return cardHtml(article, true); }).join('') + '</div>';
        if (regular.length) html += '<div class="mbia__grid">' + regular.map(function (article) { return cardHtml(article, false); }).join('') + '</div>';
        if (state.visible < result.length) html += '<div class="mbia__load-more-wrap"><button type="button" class="mbia__btn mbia__btn--secondary" data-load-more>Zobraziť ďalšie články (' + Math.min(Number(CONFIG.articlesPerPage) || 12, result.length - state.visible) + ')</button></div>';
      }
      container.innerHTML = html;
      const clear = container.querySelector('[data-results-clear]');
      if (clear) clear.addEventListener('click', function () {
        state.query = '';
        state.topic = 'all';
        state.intent = 'all';
        state.visible = Math.max(6, Number(CONFIG.articlesPerPage) || 12);
        updateStateHash(state);
        renderControls();
      });
      const more = container.querySelector('[data-load-more]');
      if (more) more.addEventListener('click', function () {
        state.visible += Math.max(6, Number(CONFIG.articlesPerPage) || 12);
        renderResults();
      });
      container.querySelectorAll('.mbia__card-title a,.mbia__btn--primary').forEach(function (link) {
        link.addEventListener('click', function () { emit('mbia_article_click'); });
      });
      setupMetadataHydration(visible);
    }

    fetchAdvisorIndex().then(function (articles) {
      state.articles = articles;
      state.loading = false;
      renderControls();
      emit('mbia_hub_loaded', { article_count: articles.length });
    }).catch(function (error) {
      log(error);
      body.innerHTML = '<div class="mbia__error"><h3 class="mbia__error-title">Články sa nepodarilo načítať</h3><p>Otvorte prosím priamo <a href="' + escapeHtml(CONFIG.advisorIndexUrl) + '">blog MyBears</a>.</p></div>';
    });
  }

  function uniqueHeadingId(heading, used) {
    const base = heading.id || slugify(heading.textContent) || 'cast-clanku';
    let id = base;
    let index = 2;
    while (used.has(id) || document.getElementById(id)) {
      if (heading.id === id && !used.has(id)) break;
      id = base + '-' + index;
      index += 1;
    }
    used.add(id);
    heading.id = id;
    return id;
  }

  function findArticleContent() {
    for (let i = 0; i < CONFIG.articleContentSelectors.length; i += 1) {
      const node = document.querySelector(CONFIG.articleContentSelectors[i]);
      if (node && node.querySelectorAll('h2,h3').length >= 2) return node;
    }
    return null;
  }

  function installReadingProgress(content) {
    if (!CONFIG.enableReadingProgress || document.querySelector('.mbia__progress')) return;
    const progress = document.createElement('div');
    progress.className = 'mbia__progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<div class="mbia__progress-bar"></div>';
    document.body.appendChild(progress);
    const bar = progress.firstElementChild;
    let ticking = false;
    function update() {
      ticking = false;
      const rect = content.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const end = start + content.offsetHeight - window.innerHeight;
      const ratio = end > start ? Math.max(0, Math.min(1, (window.scrollY - start) / (end - start))) : 0;
      bar.style.width = (ratio * 100).toFixed(2) + '%';
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function hasExistingTableOfContents(content) {
    const headings = Array.from(content.querySelectorAll('h2,h3,h4,strong,b')).slice(0, 20);
    if (headings.some(function (node) {
      const text = searchText(node.textContent);
      return text === 'obsah clanku' || text === 'obsah';
    })) return true;
    const candidates = Array.from(content.querySelectorAll('nav,[class*=\"toc\" i],[id*=\"toc\" i],ol,ul')).slice(0, 20);
    return candidates.some(function (node) {
      return node.querySelectorAll('a[href^=\"#\"]').length >= 3;
    });
  }

  function installTableOfContents(content) {
    if (!CONFIG.enableTableOfContents || document.querySelector('.mbia-toc') || hasExistingTableOfContents(content)) return;
    const headings = Array.from(content.querySelectorAll('h2,h3')).filter(function (heading) {
      return normalizeText(heading.textContent).length > 2 && !heading.closest('.cta-box,.recommended-products,.products,.mbia-related,.mbia-toc');
    });
    if (headings.length < 3) return;
    const used = new Set();
    const items = headings.map(function (heading) {
      const id = uniqueHeadingId(heading, used);
      return '<li class="' + (heading.tagName === 'H3' ? 'mbia-toc__sub' : '') + '"><a href="#' + escapeHtml(id) + '">' + escapeHtml(normalizeText(heading.textContent)) + '</a></li>';
    }).join('');
    const toc = document.createElement('nav');
    toc.className = 'mbia-toc mbia-article-tools';
    toc.setAttribute('aria-label', 'Obsah článku');
    toc.innerHTML = '<h2 class="mbia-toc__title">Obsah článku</h2><ol class="mbia-toc__list">' + items + '</ol>';
    const firstHeading = headings[0];
    firstHeading.parentNode.insertBefore(toc, firstHeading);
    toc.addEventListener('click', function (event) {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const target = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1)));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      try { history.replaceState(null, '', link.getAttribute('href')); } catch (error) { /* no-op */ }
    });
  }

  function installReadingPosition(content) {
    if (!CONFIG.enableReadingPosition || !window.sessionStorage) return;
    const key = 'mbia-scroll:' + window.location.pathname;
    const saved = Number(sessionStorage.getItem(key));
    if (saved > 100 && saved < content.offsetHeight) {
      window.setTimeout(function () { window.scrollTo({ top: saved, behavior: 'auto' }); }, 80);
    }
    let timer = null;
    window.addEventListener('scroll', function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { sessionStorage.setItem(key, String(Math.round(window.scrollY))); }, 250);
    }, { passive: true });
  }

  function installRelatedArticles(content) {
    if (!CONFIG.enableRelatedArticles || document.querySelector('.mbia-related')) return;
    const existingRelated = Array.from(content.querySelectorAll('h2,h3,h4')).some(function (heading) {
      const text = searchText(heading.textContent);
      return text.indexOf('pokracujte v tematu') !== -1 || text.indexOf('doporucene clanky') !== -1 || text.indexOf('souvisejici clanky') !== -1;
    });
    if (existingRelated) return;
    fetchAdvisorIndex().then(function (articles) {
      const currentPath = (CONFIG.currentArticleUrl ? new URL(CONFIG.currentArticleUrl, CONFIG.siteOrigin || window.location.origin).pathname : window.location.pathname).replace(/\/$/, '');
      const current = articles.find(function (article) { return article.url.replace(/\/$/, '') === currentPath; });
      if (!current) return;
      const related = articles.filter(function (article) {
        return article.url.replace(/\/$/, '') !== currentPath && article.topics.some(function (topic) { return current.topics.indexOf(topic) !== -1; });
      }).sort(function (a, b) {
        const sharedA = a.topics.filter(function (topic) { return current.topics.indexOf(topic) !== -1; }).length;
        const sharedB = b.topics.filter(function (topic) { return current.topics.indexOf(topic) !== -1; }).length;
        return sharedB - sharedA || pillarScore(b, current.topics[0]) - pillarScore(a, current.topics[0]) || a.order - b.order;
      }).slice(0, 3);
      if (!related.length) return;
      const section = document.createElement('section');
      section.className = 'mbia-related mbia-article-tools';
      section.innerHTML = '<h2 class="mbia-related__title">Pokračujte v téme</h2><p class="mbia-related__lead">Vybrali sme ďalšie články, ktoré prirodzene nadväzujú na práve prečítanú tému.</p><div class="mbia-related__grid">' + related.map(function (article) {
        const topic = topicById(article.topics[0]);
        return '<a class="mbia-related__item" href="' + escapeHtml(article.url) + '"><strong>' + escapeHtml(article.title) + '</strong><span>' + escapeHtml(topic ? topic.label : 'Poradňa MyBears') + '</span></a>';
      }).join('') + '</div>';
      content.appendChild(section);
    });
  }

  function enhanceArticlePage() {
    const articlePath = CONFIG.currentArticleUrl ? new URL(CONFIG.currentArticleUrl, CONFIG.siteOrigin || window.location.origin).pathname : window.location.pathname;
    if (!CONFIG.enableArticleEnhancements || !ARTICLE_PATH_RE.test(articlePath)) return;
    const content = findArticleContent();
    if (!content) return;
    installReadingProgress(content);
    installTableOfContents(content);
    installReadingPosition(content);
    installRelatedArticles(content);
    emit('mbia_article_enhanced');
  }

  function init() {
    injectStyles();
    document.querySelectorAll(ROOT_SELECTOR).forEach(function (root) {
      if (root.getAttribute('data-mbia-mounted') === 'true') return;
      root.setAttribute('data-mbia-mounted', 'true');
      createHub(root);
    });
    enhanceArticlePage();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();

  window.MyBearsInteractiveAdvice = Object.freeze({
    version: VERSION,
    verifiedAt: VERIFIED_AT,
    refresh: init,
    parseAdvisorIndex: parseAdvisorIndex,
    classifyTopics: classifyTopics
  });
}());
