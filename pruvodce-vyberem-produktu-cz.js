/**
 * MyBears Product Guide — kompletní samostatná verze CZ
 * Version: 1.8.1-cz
 * Product data verified against mybears.cz: 2026-07-31
 *
 * INSTALLATION — HOMEPAGE BUILD
 * Load this file once, ideally before </body>. On the Czech homepage it creates
 * its own container and inserts it before the first product-list module:
 *      <script defer src="https://cdn.jsdelivr.net/gh/USER/REPO@v1.1.0/pruvodce-vyberem-produktu-cz.js"></script>
 *
 * A manually placed element is still supported and takes priority:
 *      <div id="mybears-product-guide" data-mybears-product-guide></div>
 *
 * OPTIONAL CONFIGURATION — define before loading this file:
 * window.MBPG_CONFIG = {
 *   analytics: false,
 *   maxResults: 3,
 *   enableLiveHydration: true,
 *   enableAddToCart: true,
 *   minimumGoalScore: 30,
 *   enableComparison: true,
 *   allProductsUrl: '/',
 *   siteOrigin: null,
 *   autoMountHomepage: true,
 *   homepagePathnames: ['/'],
 *   homepageInsertBeforeSelector: '',
 *   homepageInsertAfterSelector: ''
 * };
 *
 * No external dependencies. No cookies. No localStorage. No answer values are sent anywhere.
 */
(function () {
  'use strict';

  const VERSION = '1.8.1-cz';
  const DATA_VERIFIED_AT = '2026-07-31';
  const ROOT_SELECTOR = '[data-mybears-product-guide], [data-mb-product-guide], #mybears-product-guide';
  const STYLE_ID = 'mbpg-complete-styles-v181-cz';
  const instances = new Map();
  const pageCache = new Map();
  let instanceCounter = 0;

  const DEFAULT_CONFIG = Object.freeze({
    analytics: false,
    maxResults: 3,
    minimumGoalScore: 30,
    enableLiveHydration: true,
    enableAddToCart: true,
    enableComparison: true,
    allProductsUrl: '/',
    siteOrigin: null,
    scrollOffset: 24,
    debug: false,
    autoMountHomepage: true,
    homepagePathnames: ['/'],
    homepageMountId: 'mybears-product-guide-homepage',
    homepageInsertBeforeSelector: '',
    homepageInsertAfterSelector: '',
    homepageMainSelector: 'main, [role="main"], #content, .content, .main' 
  });

  let runtimeConfig = mergeConfig(DEFAULT_CONFIG, window.MBPG_CONFIG || {});

  const GOAL_LABELS = Object.freeze({
    sleep: 'spánek a večerní rutina',
    calm: 'klid a psychická pohoda',
    focus: 'soustředění a mentální výkon',
    energy: 'energie a aktivní režim',
    immunity: 'imunita',
    beauty: 'vlasy, pokožka a nehty',
    mature_skin: 'péče o pleť 30+',
    digestion: 'trávení a mikroflóra',
    sport: 'sport a fyzická výkonnost',
    joints: 'klouby a pohybový aparát',
    daily: 'každodenní základ',
    child_daily: 'vitamíny a omega-3 pro dítě'
  });

  const FORM_LABELS = Object.freeze({
    gummies: 'gummies',
    capsules: 'kapsle',
    softgels: 'softgely',
    powder: 'prášek',
    mixed: 'kombinace forem'
  });


  /**
   * MyBears illustrated icon system — version 1.8.
   * Compact multi-colour SVG mini-illustrations created specifically for the guide.
   * They remain embedded in this one JavaScript file and do not load external assets.
   */
  const ICON_ILLUSTRATIONS = Object.freeze({
    'user': '<circle class="mbpg__art-fill2" cx="32" cy="20" r="11"/><path class="mbpg__art-fill" d="M14 54c1.8-15 9-23 18-23s16.2 8 18 23z"/><path class="mbpg__art-line" d="M22 19c2.5-7 16.5-7 20 0M16 53c2-14 8-21 16-21s14 7 16 21"/><circle class="mbpg__art-accent" cx="45" cy="16" r="4"/>',
    'bear': '<circle class="mbpg__art-fill2" cx="19" cy="18" r="9"/><circle class="mbpg__art-fill2" cx="45" cy="18" r="9"/><rect class="mbpg__art-fill" x="13" y="14" width="38" height="39" rx="18"/><ellipse class="mbpg__art-paper" cx="32" cy="38" rx="12" ry="9"/><circle class="mbpg__art-line-fill" cx="25" cy="30" r="2.2"/><circle class="mbpg__art-line-fill" cx="39" cy="30" r="2.2"/><path class="mbpg__art-line" d="M28 42c2.5 2 5.5 2 8 0"/><circle class="mbpg__art-accent" cx="32" cy="37" r="2.7"/>',
    'family': '<circle class="mbpg__art-fill" cx="25" cy="20" r="10"/><circle class="mbpg__art-fill2" cx="44" cy="24" r="8"/><path class="mbpg__art-line" d="M8 54c1-13 8-21 18-21s17 8 18 21M37 54c.8-10 5-16 12-16 4 0 7 2 9 5"/><path class="mbpg__art-accent-fill" d="M9 44c4-5 9-8 15-9-4 4-6 10-6 18H8z"/>',
    'moon': '<path class="mbpg__art-fill" d="M42 43c-17 3-29-11-23-27 2-5 6-9 11-11-2 15 10 27 25 23-2 7-7 12-13 15z"/><ellipse class="mbpg__art-fill2" cx="28" cy="49" rx="18" ry="6"/><path class="mbpg__art-accent-fill" d="m49 11 2 5 5 2-5 2-2 5-2-5-5-2 5-2zM43 28l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/><path class="mbpg__art-line" d="M30 5c-2 15 10 27 25 23"/>',
    'leaf-heart': '<path class="mbpg__art-fill2" d="M32 53C17 49 10 40 9 27c10-1 18 3 23 13 5-10 13-14 23-13-1 13-8 22-23 26z"/><path class="mbpg__art-fill" d="M32 40c-10-8-11-18 0-30 11 12 10 22 0 30z"/><circle class="mbpg__art-accent" cx="32" cy="28" r="4"/><path class="mbpg__art-line" d="M32 39V53M12 29c8 2 14 7 20 14M52 29c-8 2-14 7-20 14"/>',
    'brain': '<path class="mbpg__art-fill2" d="M27 10c-8-4-15 3-13 10-8 2-9 13-2 17-4 8 4 16 12 13 2 8 13 8 16 1V14c-2-5-8-7-13-4z"/><path class="mbpg__art-fill" d="M37 10c8-4 15 3 13 10 8 2 9 13 2 17 4 8-4 16-12 13-2 8-13 8-16 1V14c2-5 8-7 13-4z"/><path class="mbpg__art-line" d="M32 12v40M16 23c5-2 9 0 12 4M48 23c-5-2-9 0-12 4M17 39c4-3 8-3 11-1M47 39c-4-3-8-3-11-1"/><circle class="mbpg__art-accent" cx="22" cy="31" r="3"/><circle class="mbpg__art-accent" cx="43" cy="31" r="3"/>',
    'bolt': '<circle class="mbpg__art-fill2" cx="42" cy="13" r="7"/><path class="mbpg__art-fill" d="M28 22 40 31l10-1 2 7-14 2-8-5-5 10 11 6-4 7-16-9 7-17-9 6-4-6z"/><path class="mbpg__art-accent-line" d="M8 18h16M5 25h12M8 47h9"/><path class="mbpg__art-line" d="m29 21 11 10 10-1M23 32 14 37M30 34l-5 10 11 6"/>',
    'shield': '<path class="mbpg__art-fill" d="M32 6 53 14v15c0 14-9 23-21 29C20 52 11 43 11 29V14z"/><path class="mbpg__art-fill2" d="M32 12v38c9-5 15-11 15-21V18z"/><rect class="mbpg__art-paper" x="28" y="20" width="8" height="24" rx="3"/><rect class="mbpg__art-paper" x="20" y="28" width="24" height="8" rx="3"/><path class="mbpg__art-accent-fill" d="m48 8 2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
    'sparkles': '<circle class="mbpg__art-fill2" cx="31" cy="33" r="17"/><path class="mbpg__art-fill" d="m28 8 4 11 11 4-11 4-4 11-4-11-11-4 11-4z"/><path class="mbpg__art-accent-fill" d="m48 31 3 8 8 3-8 3-3 8-3-8-8-3 8-3zM16 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
    'flower': '<circle class="mbpg__art-accent" cx="32" cy="32" r="7"/><ellipse class="mbpg__art-fill" cx="32" cy="15" rx="8" ry="13"/><ellipse class="mbpg__art-fill2" cx="49" cy="32" rx="13" ry="8"/><ellipse class="mbpg__art-fill" cx="32" cy="49" rx="8" ry="13"/><ellipse class="mbpg__art-fill2" cx="15" cy="32" rx="13" ry="8"/><path class="mbpg__art-line" d="M32 22v20M22 32h20"/>',
    'digestion': '<path class="mbpg__art-fill" d="M24 7v14c0 6 3 10 9 10 4 0 7-3 7-7V14c0-5 4-8 9-8h3v25c0 16-10 27-25 27C12 58 5 47 8 35c2-7 7-12 13-14"/><path class="mbpg__art-fill2" d="M16 42c8-3 17-1 23 5-5 6-13 8-21 5z"/><path class="mbpg__art-accent-line" d="M18 46c7 0 13 2 18 6"/><path class="mbpg__art-line" d="M24 7v14c0 6 3 10 9 10 4 0 7-3 7-7"/>',
    'dumbbell': '<rect class="mbpg__art-accent" x="18" y="27" width="28" height="10" rx="5"/><rect class="mbpg__art-fill" x="9" y="18" width="11" height="28" rx="5"/><rect class="mbpg__art-fill2" x="44" y="18" width="11" height="28" rx="5"/><rect class="mbpg__art-fill2" x="4" y="24" width="7" height="16" rx="3"/><rect class="mbpg__art-fill" x="53" y="24" width="7" height="16" rx="3"/><path class="mbpg__art-line" d="M20 32h24"/>',
    'bone': '<path class="mbpg__art-fill2" d="M20 12c-6-6-15 3-9 9l7 7 9-9zM44 52c6 6 15-3 9-9l-7-7-9 9z"/><path class="mbpg__art-fill" d="m23 20 21 21-8 8-21-21z"/><circle class="mbpg__art-accent" cx="32" cy="32" r="8"/><circle class="mbpg__art-paper" cx="32" cy="32" r="3"/><path class="mbpg__art-line" d="m23 20 21 21"/>',
    'sun': '<circle class="mbpg__art-fill" cx="32" cy="32" r="15"/><circle class="mbpg__art-accent" cx="32" cy="32" r="7"/><path class="mbpg__art-accent-line" d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M12 52l6-6M46 18l6-6"/>',
    'citrus': '<circle class="mbpg__art-fill" cx="31" cy="33" r="23"/><circle class="mbpg__art-paper" cx="31" cy="33" r="17"/><path class="mbpg__art-accent-line" d="M31 16v17l15 9M31 33 16-9M31 33l-15 9M31 33 16-9"/><path class="mbpg__art-fill2" d="M40 9c7-6 14-4 18 2-6 5-12 5-18-2z"/>',
    'check-circle': '<circle class="mbpg__art-fill" cx="32" cy="32" r="25"/><path class="mbpg__art-paper-line" d="m19 32 9 9 18-20"/><path class="mbpg__art-accent-fill" d="m50 8 2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
    'pill': '<path class="mbpg__art-fill" d="M14 17c7-7 18-7 25 0l8 8-25 25-8-8c-7-7-7-18 0-25z"/><path class="mbpg__art-fill2" d="m39 17 11 11c7 7 7 18 0 25s-18 7-25 0l-3-3 25-25z"/><path class="mbpg__art-paper" d="m24 28 12 12-5 5-12-12z"/><path class="mbpg__art-line" d="m22 50 25-25"/>',
    'spoon': '<ellipse class="mbpg__art-fill" cx="20" cy="20" rx="13" ry="16"/><path class="mbpg__art-fill2" d="M26 32 52 58c3 3 8-2 5-5L31 27z"/><ellipse class="mbpg__art-paper" cx="20" cy="18" rx="8" ry="6"/><circle class="mbpg__art-accent" cx="18" cy="17" r="2"/><circle class="mbpg__art-accent" cx="24" cy="20" r="2"/>',
    'layers': '<path class="mbpg__art-fill" d="m32 6 25 13-25 13L7 19z"/><path class="mbpg__art-fill2" d="m7 31 25 13 25-13v10L32 54 7 41z"/><path class="mbpg__art-accent-fill" d="m7 23 25 13 25-13v7L32 43 7 30z"/><path class="mbpg__art-line" d="m7 19 25 13 25-13"/>',
    'shuffle': '<path class="mbpg__art-fill" d="M8 15h10c14 0 13 34 28 34h8l-6-6 4-4 12 12-12 12-4-4 6-6h-8C27 53 28 19 18 19H8z"/><path class="mbpg__art-fill2" d="M8 49h10c7 0 10-8 13-16l6 7c-4 8-9 13-19 13H8zM40 15h14l-6-6 4-4 12 12-12 12-4-4 6-6H40z"/><circle class="mbpg__art-accent" cx="11" cy="17" r="4"/>',
    'package': '<path class="mbpg__art-fill" d="m8 20 24-12 24 12-24 13z"/><path class="mbpg__art-fill2" d="M8 20v28l24 12V33z"/><path class="mbpg__art-accent-fill" d="M56 20v28L32 60V33z"/><path class="mbpg__art-paper" d="m27 11 8-4 8 4-8 4z"/><path class="mbpg__art-line" d="M32 33v27"/>',
    'packages': '<path class="mbpg__art-fill" d="m7 19 17-9 17 9-17 9z"/><path class="mbpg__art-fill2" d="M7 19v21l17 9V28z"/><path class="mbpg__art-accent-fill" d="M41 19v21l-17 9V28z"/><path class="mbpg__art-fill" d="m32 39 12-6 13 7-13 7z"/><path class="mbpg__art-fill2" d="M32 39v14l12 6V47z"/><path class="mbpg__art-accent-fill" d="M57 40v13l-13 6V47z"/>',
    'circle': '<circle class="mbpg__art-fill2" cx="32" cy="32" r="24"/><circle class="mbpg__art-paper" cx="32" cy="32" r="13"/><circle class="mbpg__art-fill" cx="25" cy="29" r="5"/><circle class="mbpg__art-accent" cx="39" cy="29" r="5"/><rect class="mbpg__art-line-fill" x="25" y="39" width="14" height="4" rx="2"/>',
    'leaf': '<path class="mbpg__art-fill" d="M56 8C34 8 16 19 11 41c15 5 34-1 45-18z"/><path class="mbpg__art-fill2" d="M12 44c13-12 25-20 38-26-9 10-18 21-25 35z"/><path class="mbpg__art-line" d="M8 57c11-19 25-32 42-39"/>',
    'sugar-off': '<path class="mbpg__art-paper" d="m14 19 18-9 18 9-18 10z"/><path class="mbpg__art-fill2" d="M14 19v23l18 9V29z"/><path class="mbpg__art-fill" d="M50 19v23l-18 9V29z"/><path class="mbpg__art-accent-line" d="M9 9 55 55"/><path class="mbpg__art-line" d="M32 29v22"/>',
    'wheat-off': '<path class="mbpg__art-accent-line" d="M10 9 54 55"/><path class="mbpg__art-line" d="M32 8v48M24 14c6 0 8 5 8 10-6 0-8-5-8-10M40 21c-6 0-8 5-8 10 6 0 8-5 8-10M24 29c6 0 8 5 8 10-6 0-8-5-8-10M40 37c-6 0-8 5-8 10 6 0 8-5 8-10"/><path class="mbpg__art-fill" d="M24 14c6 0 8 5 8 10-6 0-8-5-8-10M40 21c-6 0-8 5-8 10 6 0 8-5 8-10M24 29c6 0 8 5 8 10-6 0-8-5-8-10M40 37c-6 0-8 5-8 10 6 0 8-5 8-10"/>',
    'crescent-star': '<path class="mbpg__art-fill" d="M43 46C26 50 13 36 18 20c2-7 7-12 14-15-2 17 11 30 28 27-3 7-9 12-17 14z"/><path class="mbpg__art-accent-fill" d="m48 8 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><circle class="mbpg__art-fill2" cx="17" cy="45" r="6"/>',
    'coffee': '<path class="mbpg__art-fill" d="M12 23h34v13c0 12-7 19-17 19S12 48 12 36z"/><path class="mbpg__art-fill2" d="M46 28h5c8 0 8 15 0 15h-6"/><ellipse class="mbpg__art-accent" cx="29" cy="24" rx="17" ry="5"/><path class="mbpg__art-line" d="M20 6c-5 6 5 7 0 13M30 6c-5 6 5 7 0 13M40 6c-5 6 5 7 0 13"/><rect class="mbpg__art-line-fill" x="8" y="57" width="44" height="4" rx="2"/>',
    'coffee-off': '<path class="mbpg__art-fill" d="M12 23h34v13c0 12-7 19-17 19S12 48 12 36z"/><path class="mbpg__art-fill2" d="M46 28h5c8 0 8 15 0 15h-6"/><ellipse class="mbpg__art-accent" cx="29" cy="24" rx="17" ry="5"/><path class="mbpg__art-line" d="M20 6c-5 6 5 7 0 13M30 6c-5 6 5 7 0 13M40 6c-5 6 5 7 0 13"/><path class="mbpg__art-danger-line" d="M8 8 56 56"/>',
    'clipboard-check': '<rect class="mbpg__art-fill2" x="12" y="10" width="40" height="47" rx="8"/><rect class="mbpg__art-fill" x="22" y="5" width="20" height="12" rx="5"/><path class="mbpg__art-line" d="M22 27h20M22 36h12M22 45h9"/><path class="mbpg__art-accent-line" d="m38 43 5 5 10-12"/>',
    'sliders': '<rect class="mbpg__art-fill2" x="8" y="13" width="48" height="8" rx="4"/><rect class="mbpg__art-fill" x="8" y="28" width="48" height="8" rx="4"/><rect class="mbpg__art-fill2" x="8" y="43" width="48" height="8" rx="4"/><circle class="mbpg__art-accent" cx="42" cy="17" r="8"/><circle class="mbpg__art-accent" cx="22" cy="32" r="8"/><circle class="mbpg__art-accent" cx="38" cy="47" r="8"/><circle class="mbpg__art-paper" cx="42" cy="17" r="3"/><circle class="mbpg__art-paper" cx="22" cy="32" r="3"/><circle class="mbpg__art-paper" cx="38" cy="47" r="3"/>',
    'package-check': '<path class="mbpg__art-fill" d="m8 20 24-12 24 12-24 13z"/><path class="mbpg__art-fill2" d="M8 20v28l24 12V33z"/><path class="mbpg__art-accent-fill" d="M56 20v28L32 60V33z"/><circle class="mbpg__art-paper" cx="45" cy="42" r="11"/><path class="mbpg__art-success-line" d="m39 42 4 4 8-9"/>',
    'info': '<circle class="mbpg__art-fill" cx="32" cy="32" r="25"/><circle class="mbpg__art-paper" cx="32" cy="20" r="4"/><rect class="mbpg__art-paper" x="28" y="28" width="8" height="21" rx="4"/>',
    'check': '<circle class="mbpg__art-fill" cx="32" cy="32" r="25"/><path class="mbpg__art-paper-line" d="m18 32 9 9 20-22"/>',
    'gift': '<rect class="mbpg__art-fill" x="8" y="24" width="48" height="34" rx="5"/><rect class="mbpg__art-fill2" x="6" y="19" width="52" height="12" rx="5"/><rect class="mbpg__art-accent" x="28" y="19" width="8" height="39"/><path class="mbpg__art-accent-fill" d="M31 19C17 20 12 13 16 8c5-6 15 3 16 11zM33 19c14 1 19-6 15-11-5-6-15 3-15 11z"/>'
  });

  const ICON_THEMES = Object.freeze({
    'clipboard-check': { bg:'#F4F7FC', bg2:'#EAF0FA', line:'#3F64A3', fill:'#7FA2D8', fill2:'#C8D8F0', accent:'#2DC26B', ring:'#D8E3F3', strong:'#3F64A3' },
    'sliders': { bg:'#FFF9EC', bg2:'#FFF1CF', line:'#8A6A13', fill:'#EACB68', fill2:'#F5E7B4', accent:'#DBC442', ring:'#EEE0B3', strong:'#987000' },
    'package-check': { bg:'#F1F8F3', bg2:'#E6F3E9', line:'#247B4D', fill:'#65B482', fill2:'#BFE0C9', accent:'#DBC442', ring:'#D1E7D7', strong:'#247B4D' },
    'user': { bg:'#F3F7FC', bg2:'#E9F0FA', line:'#3F64A3', fill:'#7FA2D8', fill2:'#C8D8F0', accent:'#DBC442', ring:'#D9E4F3', strong:'#3F64A3' },
    'bear': { bg:'#FFF9EC', bg2:'#FFF0C8', line:'#8C6810', fill:'#D9B63F', fill2:'#F0D981', accent:'#8A5A25', ring:'#EEDFAE', strong:'#987000' },
    'family': { bg:'#F7F3FC', bg2:'#EEE8F8', line:'#65509F', fill:'#9C87CE', fill2:'#D3C8EC', accent:'#DBC442', ring:'#E1D8F1', strong:'#65509F' },
    'moon': { bg:'#F7F3FD', bg2:'#EEE8FA', line:'#6548A8', fill:'#876CC4', fill2:'#D8CCF1', accent:'#DBC442', ring:'#E0D7F1', strong:'#6548A8' },
    'leaf-heart': { bg:'#F2F8F3', bg2:'#E8F3EA', line:'#46825D', fill:'#71A984', fill2:'#BEDBC5', accent:'#DBC442', ring:'#D5E7D8', strong:'#46825D' },
    'brain': { bg:'#F1F5FB', bg2:'#E8EEF8', line:'#3D65A6', fill:'#87A9D9', fill2:'#C9D8F0', accent:'#DBC442', ring:'#D8E1F1', strong:'#3D65A6' },
    'bolt': { bg:'#FFF9E9', bg2:'#FFF0C8', line:'#9F7300', fill:'#F0B91F', fill2:'#FFE18B', accent:'#2DC26B', ring:'#EFDBA8', strong:'#B87E00' },
    'shield': { bg:'#F1F8F3', bg2:'#E8F3EB', line:'#227C4C', fill:'#50A771', fill2:'#BDE0C8', accent:'#DBC442', ring:'#D4E6D8', strong:'#227C4C' },
    'sparkles': { bg:'#FFF3F7', bg2:'#FBE9F0', line:'#A94E6F', fill:'#D77F9D', fill2:'#F2C6D5', accent:'#DBC442', ring:'#F0D2DD', strong:'#A94E6F' },
    'flower': { bg:'#FFF3F7', bg2:'#FBE9F0', line:'#A94E6F', fill:'#D77F9D', fill2:'#F2C6D5', accent:'#DBC442', ring:'#F0D2DD', strong:'#A94E6F' },
    'digestion': { bg:'#F6F9ED', bg2:'#EEF3E2', line:'#647D35', fill:'#A2BB6B', fill2:'#D6E2B3', accent:'#2DC26B', ring:'#E0E8CA', strong:'#647D35' },
    'dumbbell': { bg:'#F1F5FB', bg2:'#E8EEF8', line:'#3F659E', fill:'#7196CB', fill2:'#C5D5EC', accent:'#DBC442', ring:'#D8E1F1', strong:'#3F659E' },
    'bone': { bg:'#F9F5F0', bg2:'#F1E9E1', line:'#89654D', fill:'#D8B89F', fill2:'#F1DED0', accent:'#2DC26B', ring:'#E7DAD0', strong:'#89654D' },
    'sun': { bg:'#FFF9EA', bg2:'#FFF1CF', line:'#A97300', fill:'#F0BE2F', fill2:'#FFE49A', accent:'#E89327', ring:'#EFE0B4', strong:'#A97300' },
    'citrus': { bg:'#FFF9E8', bg2:'#FFF0C8', line:'#A66D00', fill:'#F3BA2B', fill2:'#76AE68', accent:'#E68821', ring:'#EFDAA5', strong:'#A66D00' },
    'check-circle': { bg:'#F1F8F3', bg2:'#E8F4EB', line:'#247B4D', fill:'#4FAE73', fill2:'#BFE1C9', accent:'#DBC442', ring:'#D5E8DA', strong:'#247B4D' },
    'pill': { bg:'#F2F5FB', bg2:'#E9EFF8', line:'#4165A6', fill:'#7C9FD5', fill2:'#E39AB2', accent:'#FFFFFF', ring:'#D8E1F1', strong:'#4165A6' },
    'spoon': { bg:'#FFF9EC', bg2:'#FFF2D3', line:'#8F6800', fill:'#D9B44B', fill2:'#75A7B8', accent:'#F7E6A7', ring:'#EFE0B7', strong:'#8F6800' },
    'layers': { bg:'#F7F3FC', bg2:'#EEE8F8', line:'#6650A4', fill:'#8D78C4', fill2:'#B6A7DD', accent:'#DBC442', ring:'#E2D8F2', strong:'#6650A4' },
    'shuffle': { bg:'#F5F7F5', bg2:'#EDF1EE', line:'#57615B', fill:'#6DA782', fill2:'#8BA0C8', accent:'#DBC442', ring:'#DEE2DF', strong:'#57615B' },
    'package': { bg:'#FFF9EC', bg2:'#FFF2D3', line:'#8F6800', fill:'#D9B44B', fill2:'#F0D98A', accent:'#76A76D', ring:'#EFE0B7', strong:'#8F6800' },
    'packages': { bg:'#FFF5EC', bg2:'#FCEADC', line:'#9B5F1A', fill:'#D99043', fill2:'#F2C48F', accent:'#8BB28A', ring:'#EFD3BC', strong:'#9B5F1A' },
    'circle': { bg:'#F4F8F5', bg2:'#ECF2ED', line:'#457456', fill:'#72A884', fill2:'#C6DDCC', accent:'#DBC442', ring:'#D9E5DB', strong:'#457456' },
    'leaf': { bg:'#F1F8F3', bg2:'#E8F3EB', line:'#2D7C50', fill:'#57A474', fill2:'#B9DCC4', accent:'#DBC442', ring:'#D4E6D8', strong:'#2D7C50' },
    'sugar-off': { bg:'#FFF4F4', bg2:'#FBEAEA', line:'#8E6B52', fill:'#D5B18F', fill2:'#F1DED0', accent:'#DBC442', danger:'#C94F4F', ring:'#EFD3D3', strong:'#AA4A4A' },
    'wheat-off': { bg:'#FAF6ED', bg2:'#F2EADC', line:'#936B34', fill:'#D4A85B', fill2:'#EFD59E', accent:'#DBC442', danger:'#C94F4F', ring:'#E7D8BE', strong:'#936B34' },
    'crescent-star': { bg:'#F7F3FD', bg2:'#EEE8FA', line:'#6548A8', fill:'#876CC4', fill2:'#D8CCF1', accent:'#DBC442', ring:'#E0D7F1', strong:'#6548A8' },
    'coffee': { bg:'#F9F3EE', bg2:'#F0E7E0', line:'#795640', fill:'#A87858', fill2:'#D8B79E', accent:'#6C3D24', ring:'#E3D5CB', strong:'#795640' },
    'coffee-off': { bg:'#F9F3EE', bg2:'#F0E7E0', line:'#795640', fill:'#A87858', fill2:'#D8B79E', accent:'#6C3D24', danger:'#C94F4F', ring:'#E3D5CB', strong:'#795640' },
    'info': { bg:'#FFF9EC', bg2:'#FFF2D3', line:'#8F6800', fill:'#DBC442', fill2:'#F2E49A', accent:'#FFFFFF', ring:'#EFE0B7', strong:'#8F6800' },
    'check': { bg:'#F1F8F3', bg2:'#E8F4EB', line:'#247B4D', fill:'#4FAE73', fill2:'#BFE1C9', accent:'#FFFFFF', ring:'#D5E8DA', strong:'#247B4D' },
    'gift': { bg:'#FFF3F7', bg2:'#FBE9F0', line:'#A94E6F', fill:'#D77F9D', fill2:'#F2C6D5', accent:'#DBC442', ring:'#F0D2DD', strong:'#A94E6F' }
  });

  function iconTheme(name) {
    return ICON_THEMES[name] || { bg:'#F2F7F3', bg2:'#EBF2ED', line:'#3C704D', fill:'#73A785', fill2:'#C8DDCE', accent:'#DBC442', ring:'#D7E4DA', strong:'#3C704D' };
  }

  function iconStyleVars(name) {
    const theme = iconTheme(name);
    return [
      `--mbpg-icon-bg:${theme.bg}`,
      `--mbpg-icon-bg2:${theme.bg2}`,
      `--mbpg-icon-line:${theme.line}`,
      `--mbpg-icon-fill:${theme.fill}`,
      `--mbpg-icon-fill2:${theme.fill2}`,
      `--mbpg-icon-accent:${theme.accent}`,
      `--mbpg-icon-danger:${theme.danger || '#C94F4F'}`,
      `--mbpg-icon-ring:${theme.ring}`,
      `--mbpg-icon-strong:${theme.strong}`
    ].join(';') + ';';
  }

  function iconSvg(name) {
    const art = ICON_ILLUSTRATIONS[name] || ICON_ILLUSTRATIONS.circle;
    return `<svg class="mbpg__svg-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${art}</svg>`;
  }

  const CATALOG = [
  {
    "id": "sleep-gummies",
    "name": "Gumoví medvídci Kvalitní spánek",
    "url": "/p/gumovi-medvidci-kvalitni-spanek",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "sleep": 100,
      "calm": 35
    },
    "priority": 95,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": true,
    "caffeine": false,
    "flavor": "lesní ovoce",
    "package": "60 gumových medvídků",
    "dose": "1–2 medvídci přibližně 60 minut před spaním",
    "supply": "30–60 dní",
    "summary": "Bezcukrové veganské gummies pro večerní rutinu bez melatoninu.",
    "keyIngredients": [
      "griffonie 25:1 (zdroj 5-HTP)",
      "meduňka 10:1",
      "heřmánek 5:1",
      "zinek",
      "vitamín B6"
    ],
    "warnings": [
      "Nekombinovat bez konzultace s léky nebo doplňky ovlivňujícími serotonin.",
      "Při užívání sedativ či léčbě se poraďte s lékařem nebo lékárníkem."
    ],
    "facts": [
      "bez melatoninu",
      "večerní užívání"
    ]
  },
  {
    "id": "skin-30-gummies",
    "name": "Gumoví medvídci Krásná a zdravá pleť 30+",
    "url": "/p/gumovi-medvidci-krasna-a-zdrava-plet-30",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "mature_skin": 100,
      "beauty": 68,
      "daily": 12
    },
    "priority": 80,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "lesní ovoce",
    "package": "60 gumových medvídků",
    "dose": "1–2 medvídci denně",
    "supply": "30–60 dní",
    "summary": "Antioxidačně zaměřené gummies pro péči o pleť po třicítce.",
    "keyIngredients": [
      "extrakt z borové kůry 30:1",
      "extrakt z hroznových jader 20:1",
      "koenzym Q10",
      "vitamín C",
      "selen",
      "vitamín B5"
    ],
    "warnings": [],
    "facts": [
      "zaměření na pleť 30+",
      "antioxidační složky"
    ]
  },
  {
    "id": "hsn-gummies",
    "name": "Gumoví medvídci Zdravé vlasy, kůže a nehty",
    "url": "/p/gumovi-medvidci-zdrave-vlasy-kuze-a-nehty",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "beauty": 100,
      "mature_skin": 45,
      "daily": 18
    },
    "priority": 92,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": true,
    "caffeine": false,
    "flavor": "jahoda",
    "package": "60 gumových medvídků",
    "dose": "1–2 medvídci denně",
    "supply": "30–60 dní",
    "summary": "Komplex vitamínů a minerálů zaměřený na vlasy, pokožku a nehty.",
    "keyIngredients": [
      "biotin",
      "zinek",
      "selen",
      "vitamíny C a E",
      "vitamín A",
      "vitamín D3",
      "vitamín B6"
    ],
    "warnings": [],
    "facts": [
      "komplex pro vlasy, pokožku a nehty"
    ]
  },
  {
    "id": "kids-omega-multi",
    "name": "Gumoví medvídci Omega 3 & Multivitamín pro děti",
    "url": "/p/gumovi-medvidci-omega-3-multivitamin-pro-deti",
    "kind": "single",
    "audiences": [
      "child"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "child_daily": 100,
      "immunity": 56,
      "daily": 55
    },
    "priority": 100,
    "vegan": false,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "pomeranč",
    "package": "30 gumových medvídků",
    "dose": "1–2 medvídci denně pro děti od 3 let",
    "supply": "15–30 dní",
    "summary": "Dětské multivitamínové gummies s rostlinným omega-3 z lněného oleje.",
    "keyIngredients": [
      "omega-3 z lněného oleje",
      "vitamíny A, C, D3 a E",
      "vitamíny B3, B5, B6 a B12"
    ],
    "warnings": [
      "Určeno pro děti od 3 let.",
      "Obsahuje želatinu, proto není vhodný pro vegany ani vegetariány.",
      "Rostlinné omega-3 není zdrojem EPA a DHA jako rybí olej."
    ],
    "facts": [
      "pro děti od 3 let",
      "rostlinný zdroj omega-3"
    ]
  },
  {
    "id": "active-brain-gummies",
    "name": "Gumoví medvídci Aktivní mozek",
    "url": "/p/gumovi-medvidci-aktivni-mozek",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "focus": 100,
      "energy": 62,
      "daily": 18
    },
    "priority": 88,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": true,
    "flavor": "krvavý pomeranč",
    "package": "60 gumových medvídků",
    "dose": "1–2 medvídci denně, ideálně ráno",
    "supply": "30–60 dní",
    "summary": "Ranní gummies zaměřené na soustředění a mentální výkon.",
    "keyIngredients": [
      "Lion’s Mane 5:1",
      "Cordyceps 1:1",
      "ženšen 4:1",
      "zelený čaj 10:1",
      "vitamíny B1, B5, B6 a B12",
      "železo"
    ],
    "warnings": [
      "Obsahuje extrakt ze zeleného čaje; při citlivosti na stimulační látky zvolte jiný produkt."
    ],
    "facts": [
      "doporučené ranní užívání",
      "obsahuje zelený čaj"
    ]
  },
  {
    "id": "preworkout-gummies",
    "name": "Gumoví medvídci Nakopávač – pre-workout",
    "url": "/p/gumovi-medvidci-nakopavac-preworkout",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "sport": 100,
      "energy": 78
    },
    "priority": 89,
    "vegan": false,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": true,
    "flavor": "borůvka",
    "package": "60 gumových medvídků",
    "dose": "1–3 medvídci 20–30 minut před fyzickou aktivitou",
    "supply": "20–60 dávek",
    "summary": "Pre-workout gummies pro užití před fyzickou aktivitou.",
    "keyIngredients": [
      "L-citrulin",
      "taurin",
      "kofein ze zeleného čaje",
      "vitamín B6",
      "niacin"
    ],
    "warnings": [
      "Obsahuje kofein; není vhodné pro děti, těhotné a kojící ženy ani osoby citlivé na kofein.",
      "Obsahuje želatinu, proto není veganský."
    ],
    "facts": [
      "3 gummies obsahují 15 mg kofeinu",
      "užití před aktivitou"
    ]
  },
  {
    "id": "acv-gummies",
    "name": "Gumoví medvídci Jablečný ocet + chrom + vitamín C",
    "url": "/p/gumovi-medvidci-na-hubnuti-traveni-detox",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "digestion": 82,
      "daily": 25,
      "energy": 12
    },
    "priority": 70,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": true,
    "caffeine": false,
    "flavor": "jablko",
    "package": "60 gumových medvídků",
    "dose": "1 medvídek denně",
    "supply": "60 dní",
    "summary": "Gummies s jablečným octem, chromem a vitamínem C pro každodenní rutinu.",
    "keyIngredients": [
      "500 mg prášku z jablečného octa",
      "vitamín C",
      "chrom"
    ],
    "warnings": [
      "Průvodce nepřisuzuje produktu účinek na hubnutí; doporučení vychází pouze ze složení a preferované oblasti."
    ],
    "facts": [
      "1 medvídek denně"
    ]
  },
  {
    "id": "relax-gummies",
    "name": "Gumoví medvídci Pohodička & Relax",
    "url": "/p/gumovi-medvidci-pohodicka-relax",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "calm": 100,
      "sleep": 30,
      "daily": 10
    },
    "priority": 91,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": true,
    "caffeine": false,
    "flavor": "černý rybíz a lesní ovoce",
    "package": "60 gumových medvídků",
    "dose": "1–2 medvídci denně",
    "supply": "30–60 dní",
    "summary": "Gummies pro klidnější denní nebo večerní rutinu.",
    "keyIngredients": [
      "meduňka",
      "L-theanin",
      "heřmánek",
      "vitamín E",
      "vitamín B6"
    ],
    "warnings": [],
    "facts": [
      "bez kofeinu"
    ]
  },
  {
    "id": "mood-gummies",
    "name": "Gumoví medvídci Dobrá náladička",
    "url": "/p/gumovi-medvidci-dobra-naladicka",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "calm": 88,
      "energy": 28,
      "daily": 15
    },
    "priority": 84,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": true,
    "caffeine": false,
    "flavor": "pomeranč",
    "package": "60 gumových medvídků",
    "dose": "1–2 medvídci denně",
    "supply": "30–60 dní",
    "summary": "Adaptogenně zaměřené gummies s L-theaninem a vitamíny skupiny B.",
    "keyIngredients": [
      "L-theanin",
      "ashwagandha 10:1",
      "rozchodnice růžová 6:1",
      "vitamíny skupiny B"
    ],
    "warnings": [
      "Při léčbě, těhotenství nebo kojení konzultujte užívání adaptogenů s lékařem."
    ],
    "facts": [
      "adaptogenní rostlinné extrakty"
    ]
  },
  {
    "id": "probiotic-gummies",
    "name": "Gumoví medvídci Zdravá střevní mikroflóra – probiotika",
    "url": "/p/gumovi-medvidci-zdrava-strevni-mikroflora",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "digestion": 100,
      "immunity": 28,
      "daily": 18
    },
    "priority": 96,
    "vegan": false,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "jahoda",
    "package": "60 gumových medvídků",
    "dose": "1 medvídek denně",
    "supply": "60 dní",
    "summary": "Bezcukrové probiotické gummies s jednou miliardou kultur v denní dávce.",
    "keyIngredients": [
      "Bacillus coagulans MTCC 5856",
      "1 miliarda CFU v denní dávce",
      "vitamín C"
    ],
    "warnings": [
      "Obsahuje želatinu, proto není veganský."
    ],
    "facts": [
      "bez cukru",
      "1 medvídek denně"
    ]
  },
  {
    "id": "immunity-gummies",
    "name": "Gumoví medvídci Silná imunita",
    "url": "/p/gumovi-medvidci-silna-imunita",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "immunity": 100,
      "daily": 28
    },
    "priority": 94,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": true,
    "caffeine": false,
    "flavor": "malina",
    "package": "60 gumových medvídků",
    "dose": "1–2 medvídci denně",
    "supply": "30–60 dní",
    "summary": "Gummies s vitamínem C, zinkem, selenem a vitamínem B6.",
    "keyIngredients": [
      "vitamín C",
      "zinek",
      "selen",
      "vitamín B6"
    ],
    "warnings": [],
    "facts": [
      "2 gummies obsahují 160 mg vitamínu C"
    ]
  },
  {
    "id": "multivitamin-gummies",
    "name": "Gumoví medvídci Multivitamín",
    "url": "/p/gumovi-medvidci-multivitamin",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "daily": 100,
      "immunity": 42,
      "energy": 32,
      "beauty": 20
    },
    "priority": 86,
    "vegan": false,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "jahoda",
    "package": "60 gumových medvídků",
    "dose": "1–2 medvídci denně",
    "supply": "30–60 dní",
    "summary": "Multivitamínové gummies pro jednoduchou každodenní rutinu.",
    "keyIngredients": [
      "vitamíny A, C, D3 a E",
      "vitamíny B5, B6, B7, B9 a B12",
      "jód",
      "inositol",
      "zinek ve složení"
    ],
    "warnings": [
      "Obsahuje želatinu, proto není veganský.",
      "Při onemocnění štítné žlázy nebo užívání léků ovlivňujících její funkci konzultujte obsah jódu s lékařem nebo lékárníkem.",
      "Při kombinaci s dalšími multivitamíny zkontrolujte celkový příjem vitamínů A a D."
    ],
    "facts": [
      "9 vitamínů a jód",
      "1–2 medvídci denně"
    ]
  },
  {
    "id": "biotin-gummies",
    "name": "Gumoví medvídci Biotin 5 mg",
    "url": "/p/gumovi-medvidci-biotin",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "beauty": 100,
      "mature_skin": 38
    },
    "priority": 89,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": true,
    "caffeine": false,
    "flavor": "vodní meloun",
    "package": "60 gumových medvídků",
    "dose": "1 medvídek denně",
    "supply": "60 dní",
    "summary": "Vysokodávkový biotin v jedné denní gummy.",
    "keyIngredients": [
      "biotin 5 mg (5 000 µg)"
    ],
    "warnings": [
      "Vysoké dávky biotinu mohou zkreslit některá laboratorní vyšetření; před odběrem informujte zdravotníky."
    ],
    "facts": [
      "1 medvídek denně",
      "5 000 µg biotinu"
    ]
  },
  {
    "id": "magnesium-bisglycinate",
    "name": "Hořčík chelát 100 mg (bisglycinát) + B6 P5P",
    "url": "/p/horcik-chelat-bisglycinat-vitamin-b6-p5p-doplnek-stravy",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules"
    ],
    "goals": {
      "calm": 70,
      "sleep": 58,
      "daily": 48,
      "sport": 38,
      "energy": 30
    },
    "priority": 99,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "bez příchuti",
    "package": "90 veganských kapslí",
    "dose": "2–3 kapsle denně",
    "supply": "30–45 dní",
    "summary": "Chelátová forma hořčíku s aktivní formou vitamínu B6 P5P.",
    "keyIngredients": [
      "100 mg hořčíku v 1 kapsli",
      "1,4 mg vitamínu B6 P5P v 1 kapsli"
    ],
    "warnings": [
      "Doplňky s hořčíkem mohou ovlivnit vstřebávání některých léků; dodržujte doporučený odstup podle lékaře nebo lékárníka."
    ],
    "facts": [
      "bisglycinát hořečnatý",
      "aktivní B6 P5P"
    ]
  },
  {
    "id": "iron-c-b12-b9",
    "name": "Vitamín C + Železo + B12 + B9",
    "url": "/p/vitamin-c-zelezo-b12-b9-kyselina-listova-doplnek-stravy",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules"
    ],
    "goals": {
      "energy": 82,
      "daily": 48,
      "immunity": 32
    },
    "priority": 72,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "bez příchuti",
    "package": "60 veganských kapslí",
    "dose": "1 kapsle denně",
    "supply": "60 dní",
    "summary": "Komplex železa, vitamínu C, B12 a kyseliny listové v jedné kapsli.",
    "keyIngredients": [
      "vitamín C z aceroly 100 mg",
      "železo AB Fortis® 20 mg",
      "vitamín B12 50 µg (methylkobalamin)",
      "folát 200 µg (L-methylfolát vápenatý)"
    ],
    "warnings": [
      "Železo není vhodné užívat preventivně bez znalosti potřeby; při léčbě nebo zdravotních potížích se poraďte s lékařem."
    ],
    "facts": [
      "1 kapsle denně",
      "železo AB Fortis®"
    ]
  },
  {
    "id": "zinc-bisglycinate",
    "name": "Zinek chelát 25 mg (bisglycinát)",
    "url": "/p/zinek-chelat-15-mg-bisglycinat-doplnek-stravy",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules"
    ],
    "goals": {
      "immunity": 82,
      "beauty": 55,
      "daily": 40
    },
    "priority": 90,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "bez příchuti",
    "package": "60 veganských kapslí",
    "dose": "1 kapsle denně",
    "supply": "60 dní",
    "summary": "Chelátová forma zinku v denní dávce 25 mg.",
    "keyIngredients": [
      "zinek bisglycinát 25 mg"
    ],
    "warnings": [
      "Dlouhodobé užívání vysoké dávky zinku konzultujte s odborníkem, zejména kvůli rovnováze mědi."
    ],
    "facts": [
      "1 kapsle denně",
      "chelátová forma"
    ]
  },
  {
    "id": "vitamin-d3-k2",
    "name": "Vitamín D3 2000 IU + K2 MK-7",
    "url": "/p/vitamin-d3-2000-iu-doplnek-stravy",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules"
    ],
    "goals": {
      "daily": 78,
      "immunity": 75,
      "joints": 18
    },
    "priority": 91,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "bez příchuti",
    "package": "60 veganských kapslí",
    "dose": "1 kapsle denně",
    "supply": "60 dní",
    "summary": "Kombinace vitamínu D3 2000 IU a vitamínu K2 ve formě MK-7.",
    "keyIngredients": [
      "vitamín D3 50 µg / 2 000 IU",
      "vitamín K2 MK-7"
    ],
    "warnings": [
      "Vitamín K může ovlivnit léčbu warfarinem a dalšími antikoagulancii; užívání konzultujte s lékařem."
    ],
    "facts": [
      "D3 + K2 MK-7",
      "veganská kapsle"
    ]
  },
  {
    "id": "green-mix",
    "name": "Zelený Mix BIO 450 mg",
    "url": "/p/zeleny-mix-450-mg-bio",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules"
    ],
    "goals": {
      "daily": 65,
      "energy": 45,
      "digestion": 28
    },
    "priority": 75,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "bez příchuti",
    "package": "60 veganských kapslí",
    "dose": "2–3 kapsle denně",
    "supply": "20–30 dní",
    "summary": "BIO směs čtyř zelených superpotravin v kapslích.",
    "keyIngredients": [
      "spirulina 25 %",
      "chlorella 25 %",
      "zelený ječmen 25 %",
      "moringa 25 %",
      "450 mg směsi v kapsli"
    ],
    "warnings": [],
    "facts": [
      "BIO směs",
      "4 zelené složky"
    ]
  },
  {
    "id": "omega3-softgels",
    "name": "Omega 3 – 330 mg EPA + 220 mg DHA",
    "url": "/p/omega-3-mastne-kyseliny-300-mg-epa-220-mg-dha-doplnek-stravy",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "softgels"
    ],
    "goals": {
      "daily": 84,
      "focus": 55,
      "immunity": 20
    },
    "priority": 93,
    "vegan": false,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "bez příchuti",
    "package": "60 softgelových kapslí",
    "dose": "1–2 kapsle denně s jídlem",
    "supply": "30–60 dní",
    "summary": "Koncentrovaný rybí olej s EPA a DHA v softgel kapsli.",
    "keyIngredients": [
      "omega-3 celkem 550 mg",
      "EPA 330 mg",
      "DHA 220 mg"
    ],
    "warnings": [
      "Při užívání léků na srážlivost krve nebo před zákrokem konzultujte omega-3 s lékařem."
    ],
    "facts": [
      "rybí olej",
      "EPA + DHA"
    ]
  },
  {
    "id": "magnesium-malate-potassium",
    "name": "Hořčík malát 170 mg + draslík 200 mg",
    "url": "/p/horcik-malat-draslik",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules"
    ],
    "goals": {
      "energy": 94,
      "sport": 76,
      "daily": 44
    },
    "priority": 97,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "bez příchuti",
    "package": "90 veganských kapslí",
    "dose": "2 kapsle denně",
    "supply": "45 dní",
    "summary": "Kombinace hořčíku ve formě malátu a draslíku pro denní a sportovní rutinu.",
    "keyIngredients": [
      "hořčík 170 mg v denní dávce",
      "draslík 200 mg v denní dávce"
    ],
    "warnings": [
      "Při onemocnění ledvin nebo užívání léků ovlivňujících draslík konzultujte užívání s lékařem."
    ],
    "facts": [
      "2 kapsle denně",
      "45 denních dávek"
    ]
  },
  {
    "id": "joint-collagen",
    "name": "Kolagen na klouby",
    "url": "/p/kolagen-na-klouby",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "powder"
    ],
    "goals": {
      "joints": 100,
      "sport": 45,
      "daily": 12
    },
    "priority": 100,
    "vegan": false,
    "sugarFree": null,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "broskev",
    "package": "423 g (30 dávek)",
    "dose": "14,10 g (1 vrchovatá odměrka) denně",
    "supply": "30 dní",
    "summary": "Komplexní prášková směs s hovězím kolagenem pro kloubní rutinu.",
    "keyIngredients": [
      "hovězí kolagenní peptidy 8 000 mg",
      "glukosamin 1 500 mg",
      "MSM 1 500 mg",
      "chondroitin 1 000 mg",
      "kyselina hyaluronová 100 mg",
      "boswellia 300 mg",
      "vitamíny C, D3 a K2",
      "kurkuma a BioPerine®"
    ],
    "warnings": [
      "Při užívání antikoagulancií, alergii na korýše, těhotenství, kojení nebo před zákrokem konzultujte složení s lékařem."
    ],
    "facts": [
      "30 dávek",
      "hovězí kolagen"
    ]
  },
  {
    "id": "beauty-collagen",
    "name": "Beauty kolagen",
    "url": "/p/beauty-kolagen",
    "kind": "single",
    "audiences": [
      "adult"
    ],
    "forms": [
      "powder"
    ],
    "goals": {
      "beauty": 100,
      "mature_skin": 82,
      "daily": 20
    },
    "priority": 99,
    "vegan": false,
    "sugarFree": null,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "mango",
    "package": "265 g (30 dávek)",
    "dose": "8,84 g (3/4 odměrky) denně",
    "supply": "30 dní",
    "summary": "Práškový rybí kolagen s beauty komplexem a lyofilizovaným mangem.",
    "keyIngredients": [
      "rybí kolagenní peptidy 5 000 mg",
      "vitamín C z aceroly",
      "keratin",
      "MSM",
      "kyselina hyaluronová",
      "koenzym Q10",
      "zinek, selen a biotin",
      "lyofilizované mango"
    ],
    "warnings": [
      "Nevhodné při alergii na ryby."
    ],
    "facts": [
      "30 dávek",
      "rybí kolagen"
    ]
  },
  {
    "id": "bundle-hsn-gummies",
    "name": "Výhodný balíček Zdravé vlasy, nehty a pokožka – gummies",
    "url": "/p/vyhodny-balicek-zdrave-vlasy-nehty-a-pokozka-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "beauty": 100,
      "mature_skin": 48
    },
    "priority": 94,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": true,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Dvojice beauty gummies pro komplexní péči o vlasy, pokožku a nehty.",
    "keyIngredients": [
      "Gummies Zdravé vlasy, kůže a nehty",
      "Gummies Biotin 5 mg"
    ],
    "warnings": [
      "Vysoké dávky biotinu mohou ovlivnit laboratorní testy."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-digestion",
    "name": "Výhodný balíček Trávení & střevní mikroflóra",
    "url": "/p/vyhodny-balicek-traveni-strevni-mikroflora-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "digestion": 100,
      "daily": 22
    },
    "priority": 90,
    "vegan": false,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Kombinace gummies s jablečným octem a probiotickými kulturami.",
    "keyIngredients": [
      "Gummies Jablečný ocet + chrom + vitamín C",
      "Probiotické gummies Zdravá střevní mikroflóra"
    ],
    "warnings": [
      "Probiotické gummies obsahují želatinu; celý balíček proto není veganský."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-sleep",
    "name": "Výhodný balíček Kvalitní spánek",
    "url": "/p/vyhodny-balicek-kvalitni-spanek-veganske-kapsle-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "gummies"
    ],
    "goals": {
      "sleep": 100,
      "calm": 72,
      "daily": 25
    },
    "priority": 100,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Večerní kombinace hořčíku a bezcukrových gummies bez melatoninu.",
    "keyIngredients": [
      "Hořčík bisglycinát + B6 P5P",
      "Bezcukrové gummies Kvalitní spánek"
    ],
    "warnings": [
      "Při užívání léků ovlivňujících serotonin nebo sedativ konzultujte gummies s odborníkem."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-zinc-biotin",
    "name": "Výhodný balíček Zinek + Biotin gummies",
    "url": "/p/vyhodny-balicek-zdrave-vlasy-nehty-a-pokozka-veganske-kapsle-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "gummies"
    ],
    "goals": {
      "beauty": 100,
      "immunity": 45
    },
    "priority": 93,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Kombinace zinku a vysokodávkového biotinu pro beauty rutinu.",
    "keyIngredients": [
      "Zinek chelát 25 mg",
      "Gummies Biotin 5 mg"
    ],
    "warnings": [
      "Vysoké dávky biotinu mohou ovlivnit laboratorní testy.",
      "Dlouhodobé užívání 25 mg zinku konzultujte s odborníkem."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-good-mood",
    "name": "Výhodný balíček Dobrá náladička",
    "url": "/p/vyhodny-balicek-dobra-naladicka-veganske-kapsle-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "gummies"
    ],
    "goals": {
      "calm": 100,
      "sleep": 42,
      "daily": 25
    },
    "priority": 91,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Kombinace hořčíku, adaptogenů a L-theaninu pro klidnější rutinu.",
    "keyIngredients": [
      "Hořčík bisglycinát + B6 P5P",
      "Gummies Dobrá náladička"
    ],
    "warnings": [
      "Při léčbě, těhotenství nebo kojení konzultujte adaptogeny s lékařem."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-mental-2",
    "name": "Výhodný balíček Mentální výkon 2.0",
    "url": "/p/vyhodny-balicek-uspesne-uceni-mentalni-vykon-pri-narocnem-povolani-2-0-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "gummies"
    ],
    "goals": {
      "focus": 100,
      "sleep": 72,
      "energy": 68,
      "calm": 45
    },
    "priority": 96,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": true,
    "flavor": "kombinace produktů",
    "package": "3 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Tříproduktová denní a večerní rutina pro soustředění a regeneraci.",
    "keyIngredients": [
      "Gummies Aktivní mozek",
      "Bezcukrové gummies Kvalitní spánek",
      "Hořčík bisglycinát + B6 P5P"
    ],
    "warnings": [
      "Obsahuje zelený čaj.",
      "Při léčbě ovlivňující serotonin konzultujte večerní gummies s odborníkem."
    ],
    "facts": [
      "zvýhodněný balíček",
      "3 produkty"
    ]
  },
  {
    "id": "bundle-beauty-iron",
    "name": "Výhodný balíček Krása – železo + biotin",
    "url": "/p/vyhodny-balicek-krasa-veganske-kapsle-a-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "gummies"
    ],
    "goals": {
      "beauty": 94,
      "energy": 70,
      "daily": 35
    },
    "priority": 82,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Beauty balíček spojující biotin s komplexem obsahujícím železo.",
    "keyIngredients": [
      "Vitamín C + Železo + B12 + B9",
      "Gummies Biotin 5 mg"
    ],
    "warnings": [
      "Železo užívejte pouze při odůvodněné potřebě.",
      "Biotin může ovlivnit laboratorní testy."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-detox-energy",
    "name": "Výhodný balíček Zelený restart & energie",
    "url": "/p/vyhodny-balicek-detox-energie-veganske-kapsle",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules"
    ],
    "goals": {
      "energy": 85,
      "daily": 72,
      "digestion": 30
    },
    "priority": 88,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Veganská kapslová kombinace hořčíku a zeleného BIO mixu.",
    "keyIngredients": [
      "Hořčík bisglycinát + B6 P5P",
      "Zelený Mix BIO"
    ],
    "warnings": [],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-harmony",
    "name": "Výhodný balíček Harmonie",
    "url": "/p/vyhodny-balicek-harmonie-veganske-kapsle",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules"
    ],
    "goals": {
      "daily": 82,
      "immunity": 67,
      "calm": 42
    },
    "priority": 76,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Kombinace hořčíku a vitamínů D3 + K2 pro každodenní rutinu.",
    "keyIngredients": [
      "Hořčík bisglycinát + B6 P5P",
      "Vitamín D3 + K2 MK-7"
    ],
    "warnings": [
      "Vitamín K může ovlivnit léčbu warfarinem."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-energy",
    "name": "Výhodný balíček Energie",
    "url": "/p/vyhodny-balicek-energii-veganske-kapsle",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules"
    ],
    "goals": {
      "energy": 88,
      "daily": 65,
      "immunity": 45
    },
    "priority": 91,
    "vegan": true,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Veganská kapslová kombinace hořčíku a zinku.",
    "keyIngredients": [
      "Hořčík bisglycinát + B6 P5P",
      "Zinek chelát 25 mg"
    ],
    "warnings": [
      "Dlouhodobé užívání 25 mg zinku konzultujte s odborníkem."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-performance",
    "name": "Výhodný balíček Fyzická výkonnost",
    "url": "/p/vyhodny-balicek-fyzicka-vykonnost-veganske-kapsle-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "gummies"
    ],
    "goals": {
      "sport": 100,
      "energy": 92
    },
    "priority": 93,
    "vegan": false,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": true,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Kombinace hořčíku a pre-workout gummies pro sportovní rutinu.",
    "keyIngredients": [
      "Hořčík bisglycinát + B6 P5P",
      "Gummies Nakopávač – pre-workout"
    ],
    "warnings": [
      "Obsahuje kofein.",
      "Pre-workout gummies obsahují želatinu, proto celý balíček není veganský."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-mental",
    "name": "Výhodný balíček Úspěšné učení & mentální výkon",
    "url": "/p/vyhodny-balicek-uspesne-uceni-mentalni-vykon-pri-narocnem-povolani-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "gummies"
    ],
    "goals": {
      "focus": 100,
      "calm": 74,
      "energy": 70
    },
    "priority": 92,
    "vegan": true,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": true,
    "flavor": "kombinace produktů",
    "package": "3 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Denní kombinace pro soustředění doplněná relaxační rutinou.",
    "keyIngredients": [
      "Gummies Aktivní mozek",
      "Gummies Pohodička & Relax",
      "Hořčík bisglycinát + B6 P5P"
    ],
    "warnings": [
      "Obsahuje zelený čaj."
    ],
    "facts": [
      "zvýhodněný balíček",
      "3 produkty"
    ]
  },
  {
    "id": "bundle-family-immunity",
    "name": "Výhodný balíček Silná imunita pro celou rodinu",
    "url": "/p/vyhodny-balicek-silna-imunita-pro-celou-rodinu",
    "kind": "bundle",
    "audiences": [
      "family",
      "adult",
      "child"
    ],
    "forms": [
      "gummies"
    ],
    "goals": {
      "immunity": 100,
      "child_daily": 68,
      "daily": 40
    },
    "priority": 96,
    "vegan": false,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "2 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Rodinný balíček s oddělenými gummies pro dospělé a děti od 3 let.",
    "keyIngredients": [
      "Gummies Silná imunita pro dospělé",
      "Gummies Omega 3 & Multivitamín pro děti"
    ],
    "warnings": [
      "Dětský produkt je určen od 3 let.",
      "Veganský status celého balíčku není jednoznačně potvrzen."
    ],
    "facts": [
      "zvýhodněný balíček",
      "2 produkty"
    ]
  },
  {
    "id": "bundle-sport",
    "name": "Výhodný balíček Sport",
    "url": "/p/vyhodny-balicek-sport-veganske-kapsle-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "softgels",
      "gummies"
    ],
    "goals": {
      "sport": 100,
      "energy": 86,
      "daily": 42,
      "immunity": 30
    },
    "priority": 98,
    "vegan": false,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": true,
    "flavor": "kombinace produktů",
    "package": "4 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Čtyřproduktový sportovní balíček s hořčíkem, zinkem, omega-3 a pre-workout gummies.",
    "keyIngredients": [
      "Hořčík bisglycinát + B6 P5P",
      "Zinek chelát 25 mg",
      "Omega 3 EPA + DHA",
      "Gummies Nakopávač – pre-workout"
    ],
    "warnings": [
      "Obsahuje kofein a rybí olej; balíček není veganský.",
      "Při antikoagulační léčbě konzultujte omega-3 s lékařem."
    ],
    "facts": [
      "zvýhodněný balíček",
      "4 produkty"
    ]
  },
  {
    "id": "bundle-immunity-capsules",
    "name": "Výhodný balíček Imunita – kapsle",
    "url": "/p/vyhodny-balicek-imunita-veganske-kapsle",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "softgels"
    ],
    "goals": {
      "immunity": 100,
      "daily": 72
    },
    "priority": 96,
    "vegan": false,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "4 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Komplexní kapslový balíček pro každodenní rutinu a imunitní oblast.",
    "keyIngredients": [
      "Vitamín D3 + K2 MK-7",
      "Zinek chelát 25 mg",
      "Hořčík bisglycinát + B6 P5P",
      "Omega 3 EPA + DHA"
    ],
    "warnings": [
      "Obsahuje rybí olej, proto není veganský.",
      "Vitamín K a omega-3 konzultujte při léčbě ovlivňující srážlivost krve."
    ],
    "facts": [
      "zvýhodněný balíček",
      "4 produkty"
    ]
  },
  {
    "id": "bundle-vitality",
    "name": "Výhodný balíček Vitalita",
    "url": "/p/vyhodny-balicek-vitalita-veganske-kapsle",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "softgels"
    ],
    "goals": {
      "daily": 100,
      "energy": 55,
      "immunity": 62,
      "focus": 35
    },
    "priority": 92,
    "vegan": false,
    "sugarFree": true,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "3 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Každodenní kombinace hořčíku, vitamínů D3/K2 a omega-3.",
    "keyIngredients": [
      "Hořčík bisglycinát + B6 P5P",
      "Vitamín D3 + K2 MK-7",
      "Omega 3 EPA + DHA"
    ],
    "warnings": [
      "Obsahuje rybí olej, proto není veganský.",
      "Při antikoagulační léčbě konzultujte složení s lékařem."
    ],
    "facts": [
      "zvýhodněný balíček",
      "3 produkty"
    ]
  },
  {
    "id": "bundle-immunity-mixed",
    "name": "Výhodný balíček Imunita – kapsle + gummies",
    "url": "/p/vyhodny-balicek-imunita-veganske-kapsle-gumovi-medvidci",
    "kind": "bundle",
    "audiences": [
      "adult"
    ],
    "forms": [
      "capsules",
      "softgels",
      "gummies"
    ],
    "goals": {
      "immunity": 100,
      "daily": 78
    },
    "priority": 99,
    "vegan": false,
    "sugarFree": false,
    "glutenFree": true,
    "halal": null,
    "caffeine": false,
    "flavor": "kombinace produktů",
    "package": "4 produkty v balíčku",
    "dose": "dle dávkování jednotlivých produktů",
    "supply": "dle jednotlivých balení",
    "summary": "Rozšířený imunitní balíček kombinující kapsle, softgely a gummies.",
    "keyIngredients": [
      "Hořčík bisglycinát + B6 P5P",
      "Vitamín D3 + K2 MK-7",
      "Omega 3 EPA + DHA",
      "Gummies Silná imunita"
    ],
    "warnings": [
      "Obsahuje rybí olej, proto není veganský.",
      "Vitamín K a omega-3 konzultujte při léčbě ovlivňující srážlivost krve."
    ],
    "facts": [
      "zvýhodněný balíček",
      "4 produkty"
    ]
  }
];
  const QUESTIONS = [
  {
    "id": "audience",
    "title": "Pro koho produkt vybíráte?",
    "description": "",
    "options": [
      {
        "value": "adult",
        "label": "Pro dospělého",
        "description": "Samostatný produkt nebo rutina pro dospělé",
        "icon": "user"
      },
      {
        "value": "child",
        "label": "Pro dítě od 3 let",
        "description": "Pouze produkty výslovně určené dětem",
        "icon": "bear"
      },
      {
        "value": "family",
        "label": "Pro celou rodinu",
        "description": "Rodinné kombinace s oddělenými produkty",
        "icon": "family"
      }
    ]
  },
  {
    "id": "goal",
    "title": "Na jakou oblast se chcete zaměřit?",
    "description": "",
    "options": [
      {
        "value": "sleep",
        "label": "Spánek a večerní rutina",
        "description": "Produkty vhodné pro večerní režim",
        "icon": "moon",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "calm",
        "label": "Klid a psychická pohoda",
        "description": "Relaxační a adaptogenně zaměřené produkty",
        "icon": "leaf-heart",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "focus",
        "label": "Soustředění a mentální výkon",
        "description": "Produkty pro pracovní nebo studijní rutinu",
        "icon": "brain",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "energy",
        "label": "Energie a únava",
        "description": "Denní rutina a produkty pro aktivní režim",
        "icon": "bolt",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "immunity",
        "label": "Imunita",
        "description": "Vitamíny, minerály a rodinné varianty",
        "icon": "shield",
        "audiences": [
          "adult",
          "child",
          "family"
        ]
      },
      {
        "value": "beauty",
        "label": "Vlasy, pokožka a nehty",
        "description": "Beauty gummies, minerály a kolagen",
        "icon": "sparkles",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "mature_skin",
        "label": "Péče o pleť 30+",
        "description": "Kolagen a antioxidačně zaměřené složení",
        "icon": "flower",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "digestion",
        "label": "Trávení a mikroflóra",
        "description": "Probiotika a související rutiny",
        "icon": "digestion",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "sport",
        "label": "Sport a fyzická výkonnost",
        "description": "Hořčík, pre-workout a sportovní balíčky",
        "icon": "dumbbell",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "joints",
        "label": "Klouby a pohybový aparát",
        "description": "Komplexní prášková kloubní výživa",
        "icon": "bone",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "daily",
        "label": "Každodenní základ",
        "description": "Multivitamíny, omega-3 a univerzální rutina",
        "icon": "sun",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "child_daily",
        "label": "Vitamíny a omega-3 pro dítě",
        "description": "Denní gummies pro děti od 3 let",
        "icon": "citrus",
        "audiences": [
          "child"
        ]
      }
    ]
  },
  {
    "id": "form",
    "title": "Jaká forma vám vyhovuje?",
    "description": "",
    "options": [
      {
        "value": "any",
        "label": "Je mi to jedno",
        "description": "Rozhodne hlavně oblast a složení",
        "icon": "check-circle"
      },
      {
        "value": "gummies",
        "label": "Gumoví medvídci",
        "description": "Pohodlná a chuťově výrazná forma",
        "icon": "bear"
      },
      {
        "value": "capsules",
        "label": "Kapsle nebo softgely",
        "description": "Klasická forma bez ochucení",
        "icon": "pill",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "powder",
        "label": "Rozpustný prášek",
        "description": "Kolagenové směsi s odměrkou",
        "icon": "spoon",
        "audiences": [
          "adult"
        ]
      },
      {
        "value": "mixed",
        "label": "Kombinovaný balíček",
        "description": "Různé formy v jedné rutině",
        "icon": "layers",
        "audiences": [
          "adult",
          "family"
        ]
      }
    ]
  },
  {
    "id": "solution",
    "title": "Hledáte jeden produkt, nebo hotovou rutinu?",
    "description": "",
    "options": [
      {
        "value": "any",
        "label": "Obě možnosti",
        "description": "Zobrazit nejlepší shodu bez omezení",
        "icon": "shuffle"
      },
      {
        "value": "single",
        "label": "Jeden produkt",
        "description": "Jednoduché zařazení do rutiny",
        "icon": "package",
        "audiences": [
          "adult",
          "child"
        ]
      },
      {
        "value": "bundle",
        "label": "Zvýhodněný balíček",
        "description": "Více produktů, které se doplňují",
        "icon": "packages",
        "audiences": [
          "adult",
          "family"
        ]
      }
    ]
  },
  {
    "id": "diet",
    "title": "Máte požadavek na provedení produktu?",
    "description": "",
    "options": [
      {
        "value": "any",
        "label": "Bez zvláštního požadavku",
        "description": "Neomezovat nabídku podle těchto vlastností",
        "icon": "circle"
      },
      {
        "value": "vegan",
        "label": "Pouze veganské",
        "description": "Jen produkty s potvrzeným veganským složením",
        "icon": "leaf"
      },
      {
        "value": "sugarFree",
        "label": "Pouze bez cukru",
        "description": "Jen produkty jednoznačně označené jako bez cukru",
        "icon": "sugar-off"
      },
      {
        "value": "glutenFree",
        "label": "Pouze bez lepku",
        "description": "Jen produkty s potvrzeným bezlepkovým provedením",
        "icon": "wheat-off"
      },
      {
        "value": "halal",
        "label": "Pouze halal",
        "description": "Jen produkty s jednoznačně potvrzeným halal označením",
        "icon": "crescent-star"
      }
    ]
  },
  {
    "id": "stimulants",
    "title": "Chcete se vyhnout kofeinu a stimulačním extraktům?",
    "description": "",
    "audiences": [
      "adult"
    ],
    "options": [
      {
        "value": "any",
        "label": "Nevadí mi",
        "description": "Mohou se zobrazit i produkty se zeleným čajem nebo kofeinem",
        "icon": "coffee"
      },
      {
        "value": "avoid",
        "label": "Chci variantu bez kofeinu",
        "description": "Produkty s kofeinem nebo zeleným čajem budou vyřazeny",
        "icon": "coffee-off"
      }
    ]
  }
];

  const STYLE_CSS = String.raw`
.mbpg{
  --mbpg-green:#2dc26b;
  --mbpg-green-dark:#198d4b;
  --mbpg-ink:#20221f;
  --mbpg-muted:#626760;
  --mbpg-cream:#faf7ef;
  --mbpg-cream-2:#f7f3ea;
  --mbpg-soft-green:#f4f8f4;
  --mbpg-line:#e5e3dc;
  --mbpg-gold:#DBC442;
  --mbpg-warning:#fff8df;
  --mbpg-danger:#a63a36;
  --mbpg-white:#fff;
  color:var(--mbpg-ink);
  font:inherit;
  font-family:Arial,Helvetica,sans-serif;
  line-height:1.55;
  margin:24px 0 40px;
}
.mbpg *,.mbpg *::before,.mbpg *::after{box-sizing:border-box}
.mbpg button,.mbpg a,.mbpg input,.mbpg summary{font:inherit}
.mbpg *{font-family:inherit}
.mbpg__shell{
  max-width:1120px;
  margin:0 auto;
  overflow:hidden;
  border:1px solid var(--mbpg-line);
  border-radius:18px;
  background:var(--mbpg-white);
  box-shadow:0 12px 32px rgba(27,35,29,.07);
}
.mbpg__topline{height:4px;background:var(--mbpg-gold)}
.mbpg__body{padding:34px 38px 36px}
.mbpg__intro-head{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  align-items:start;
  gap:26px;
  margin-bottom:26px;
}
.mbpg__title,.mbpg__question-title{
  margin:0 0 10px;
  color:var(--mbpg-green);
  font-weight:700;
  line-height:1.16;
  outline:none;
}
.mbpg__title{font-size:clamp(25px,3.2vw,30px)}
.mbpg__question-title{font-size:clamp(24px,3vw,28px)}
.mbpg__lead,.mbpg__question-description{
  max-width:790px;
  margin:0;
  color:#454a45;
  font-size:16px;
  line-height:1.58;
}
.mbpg__mini{
  min-width:190px;
  padding:13px 16px;
  border:1px solid #e5dfd1;
  border-radius:12px;
  background:var(--mbpg-cream);
  color:#5f5a4e;
  font-size:13px;
  line-height:1.45;
}
.mbpg__mini strong{display:block;color:#292b28;font-size:14px;font-weight:700}
.mbpg__steps{
  margin:24px 0 28px;
  overflow:hidden;
  border:1px solid #e8e2d7;
  border-radius:14px;
  background:#fff;
}
.mbpg__step-row{
  display:grid;
  grid-template-columns:54px 1fr;
  align-items:center;
  gap:16px;
  min-height:84px;
  padding:14px 17px;
  border-bottom:1px solid #e8e2d7;
  background:var(--mbpg-cream);
}
.mbpg__step-row:nth-child(even){background:#fff}
.mbpg__step-row:last-child{border-bottom:0}
.mbpg__icon{
  position:relative;
  display:grid;
  width:68px;
  height:68px;
  flex:0 0 68px;
  place-items:center;
  overflow:hidden;
  border:1px solid var(--mbpg-icon-ring,#dde5df);
  border-radius:18px;
  background:
    radial-gradient(circle at 24% 18%,rgba(255,255,255,.96) 0 9%,rgba(255,255,255,.35) 33%,transparent 58%),
    linear-gradient(145deg,var(--mbpg-icon-bg,#f4f7f4),var(--mbpg-icon-bg2,#edf2ee));
  color:var(--mbpg-icon-fg,var(--mbpg-green-dark));
  box-shadow:0 8px 20px rgba(36,39,35,.075),inset 0 1px 0 rgba(255,255,255,.96);
  transition:border-color .16s ease,box-shadow .16s ease,transform .16s ease;
}
.mbpg__icon::after{
  content:"";
  position:absolute;
  inset:3px;
  pointer-events:none;
  border:1px solid rgba(255,255,255,.38);
  border-radius:14px;
}
.mbpg__svg-icon{
  position:relative;
  z-index:1;
  display:block;
  width:45px;
  height:45px;
  overflow:visible;
}
.mbpg__art-fill{fill:var(--mbpg-icon-fill,#73a785);stroke:var(--mbpg-icon-line,#3c704d);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.mbpg__art-fill2{fill:var(--mbpg-icon-fill2,#c8ddce);stroke:var(--mbpg-icon-line,#3c704d);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}
.mbpg__art-accent{fill:var(--mbpg-icon-accent,#DBC442);stroke:var(--mbpg-icon-line,#3c704d);stroke-width:1.2}
.mbpg__art-accent-fill{fill:var(--mbpg-icon-accent,#DBC442)}
.mbpg__art-paper{fill:#fff;opacity:.92}
.mbpg__art-line{fill:none;stroke:var(--mbpg-icon-line,#3c704d);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.mbpg__art-line-fill{fill:var(--mbpg-icon-line,#3c704d)}
.mbpg__art-accent-line{fill:none;stroke:var(--mbpg-icon-accent,#DBC442);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.mbpg__art-danger-line{fill:none;stroke:var(--mbpg-icon-danger,#C94F4F);stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
.mbpg__art-success-line{fill:none;stroke:#198d4b;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
.mbpg__art-paper-line{fill:none;stroke:#fff;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
.mbpg__step-icon{width:58px;height:58px;flex-basis:58px;border-radius:16px}.mbpg__step-icon .mbpg__svg-icon{width:39px;height:39px}
.mbpg__option-icon{width:68px;height:68px;flex-basis:68px;border-radius:18px}
.mbpg__step-copy strong{display:block;font-size:15px;font-weight:700}
.mbpg__step-copy span{color:#5f625e;font-size:14px}
.mbpg__actions{
  display:flex;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
}
.mbpg__intro .mbpg__actions{justify-content:center}
.mbpg__actions--between{justify-content:space-between;margin-top:28px}
.mbpg__actions--results{justify-content:flex-start;margin-top:20px}
.mbpg__button{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:48px;
  padding:12px 24px;
  border:2px solid transparent;
  border-radius:8px;
  font-weight:700;
  line-height:1.15;
  text-align:center;
  text-decoration:none!important;
  cursor:pointer;
  transition:background .15s ease,border-color .15s ease,transform .15s ease;
}
.mbpg__button:hover{transform:translateY(-1px)}
.mbpg__button:focus-visible,.mbpg a:focus-visible,.mbpg summary:focus-visible{
  outline:3px solid rgba(219,196,66,.38);
  outline-offset:2px;
}
.mbpg__button[disabled]{opacity:.45;cursor:not-allowed;transform:none}
.mbpg__button--primary{color:#fff!important;background:var(--mbpg-green);border-color:var(--mbpg-green);min-width:220px}
.mbpg__button--primary:hover{background:var(--mbpg-green-dark);border-color:var(--mbpg-green-dark)}
.mbpg__button--secondary{color:var(--mbpg-green-dark)!important;background:#fff;border-color:var(--mbpg-green)}
.mbpg__button--ghost{color:#5e625e!important;background:#fff;border-color:#d7d8d4}
.mbpg__notice,.mbpg__result-summary{
  display:grid;
  grid-template-columns:28px 1fr;
  gap:12px;
  padding:15px 17px;
  border:1px solid #eadfc8;
  border-radius:12px;
  background:var(--mbpg-cream);
  color:#4f4b43;
  font-size:14px;
}
.mbpg__notice{margin-top:24px}
.mbpg__notice-icon{
  display:grid;
  width:24px;
  height:24px;
  place-items:center;
  border-radius:50%;
  background:var(--mbpg-gold);
  color:#fff;
}
.mbpg__notice-icon .mbpg__svg-icon{width:15px;height:15px;stroke-width:2.2}
.mbpg__notice strong,.mbpg__result-summary strong{display:block;margin-bottom:2px;color:#292b28}
.mbpg .tldr-box{margin:24px 0}.mbpg .tldr-box p{margin:0}
.mbpg__progress{margin-bottom:28px}
.mbpg__progress-meta{
  display:flex;
  justify-content:space-between;
  gap:16px;
  margin-bottom:8px;
  color:#61665f;
  font-size:13px;
  font-weight:700;
}
.mbpg__progress-track{
  height:7px;
  overflow:hidden;
  border-radius:99px;
  background:#e9eee9;
}
.mbpg__progress-track span{
  display:block;
  height:100%;
  border-radius:inherit;
  background:linear-gradient(90deg,var(--mbpg-gold),#efdd7e);
  transition:width .25s ease;
}
.mbpg__question-description{margin:0 0 8px;color:#555b55}
.mbpg__options{display:grid;gap:10px;margin:0}
.mbpg__option{
  position:relative;
  display:grid;
  grid-template-columns:68px minmax(0,1fr) 30px;
  align-items:center;
  gap:18px;
  min-height:104px;
  padding:16px 18px;
  border:1px solid #e6e1d7;
  border-radius:16px;
  background:#fff;
  box-shadow:0 4px 14px rgba(31,34,31,.04);
  cursor:pointer;
  transition:border-color .16s ease,box-shadow .16s ease,background .16s ease,transform .16s ease;
}
.mbpg__option:nth-child(even){background:#fff}
.mbpg__option:hover{border-color:#b8d8c2;box-shadow:0 7px 20px rgba(31,34,31,.06)}
.mbpg__option:hover .mbpg__option-icon{border-color:var(--mbpg-icon-strong,var(--mbpg-green));box-shadow:0 6px 16px rgba(36,39,35,.075),inset 0 1px 0 rgba(255,255,255,.92)}
.mbpg__option.is-selected{
  border:1.5px solid var(--mbpg-green-dark);
  background:#fff;
  box-shadow:0 0 0 3px rgba(45,194,107,.075),0 8px 22px rgba(31,34,31,.06);
}
.mbpg__option.is-selected .mbpg__option-icon{
  border-color:var(--mbpg-icon-strong,var(--mbpg-green));
  background:
    radial-gradient(circle at 24% 18%,rgba(255,255,255,.96) 0 9%,rgba(255,255,255,.35) 33%,transparent 58%),
    linear-gradient(145deg,var(--mbpg-icon-bg,#f4f7f4),var(--mbpg-icon-bg2,#edf2ee));
  color:var(--mbpg-icon-fg,var(--mbpg-green-dark));
  box-shadow:0 7px 18px rgba(36,39,35,.085),inset 0 1px 0 rgba(255,255,255,.94)
}
.mbpg__option input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.mbpg__option:focus-within{outline:3px solid rgba(219,196,66,.30);outline-offset:2px}
.mbpg__option-copy strong{display:block;font-size:17px;line-height:1.3;font-weight:700;letter-spacing:-.01em}
.mbpg__option-copy small{display:block;margin-top:5px;color:#636861;font-size:14px;line-height:1.45}
.mbpg__radio{
  display:grid;
  width:24px;
  height:24px;
  place-items:center;
  border:2px solid #c7cac5;
  border-radius:50%;
  background:#fff;
}
.mbpg__option.is-selected .mbpg__radio{border-color:var(--mbpg-green)}
.mbpg__option.is-selected .mbpg__radio::after{content:"";width:12px;height:12px;border-radius:50%;background:var(--mbpg-green)}
.mbpg__results-head{margin-bottom:20px}
.mbpg__result-summary{margin:0 0 24px}
.mbpg__featured-product{
  display:grid;
  grid-template-columns:290px minmax(0,1fr);
  overflow:hidden;
  border:1px solid var(--mbpg-line);
  border-radius:16px;
  background:#fff;
}
.mbpg__product-media{
  display:grid;
  min-height:390px;
  place-items:center;
  padding:24px;
  border-right:1px solid var(--mbpg-line);
  background:var(--mbpg-soft-green);
}
.mbpg__product-media img{display:block;width:100%;max-width:280px;max-height:340px;object-fit:contain}
.mbpg__product-placeholder{
  display:grid;
  width:112px;
  height:112px;
  place-items:center;
  border-radius:50%;
  background:#f5e694;
  color:var(--mbpg-green-dark);
}
.mbpg__product-placeholder .mbpg__svg-icon{width:54px;height:54px;stroke-width:1.55}
.mbpg__product-copy{padding:26px 28px 28px}
.mbpg__match-label{
  display:block;
  margin:0 0 6px;
  color:#807760;
  font-size:12px;
  font-weight:700;
  letter-spacing:.05em;
  text-transform:uppercase;
}
.mbpg__product-title{margin:0 0 8px;font-size:25px;line-height:1.22;font-weight:700;letter-spacing:0}
.mbpg__product-title a{color:var(--mbpg-ink)!important;text-decoration:none!important}
.mbpg__product-title a:hover{color:var(--mbpg-green-dark)!important}
.mbpg__price-line{min-height:30px;margin:0 0 14px;color:var(--mbpg-green-dark);font-size:20px;font-weight:800}
.mbpg__availability{margin-left:10px;color:#696e68;font-size:13px;font-weight:700}
.mbpg__availability.is-in{color:var(--mbpg-green-dark)}
.mbpg__availability.is-out{color:var(--mbpg-danger)}
.mbpg__product-summary{margin:0 0 16px;color:#4f544e;line-height:1.55}
.mbpg__why{
  margin:0 0 18px;
  padding:13px 15px;
  border-left:4px solid var(--mbpg-gold);
  border-radius:8px;
  background:linear-gradient(90deg,rgba(219,196,66,.15),rgba(244,248,244,.9));
  font-size:14px;
  line-height:1.5;
}
.mbpg__facts-table{
  width:100%;
  margin:0 0 18px;
  overflow:hidden;
  border:1px solid var(--mbpg-line);
  border-collapse:separate;
  border-spacing:0;
  border-radius:12px;
  font-size:14px;
}
.mbpg__facts-table thead th{
  padding:10px 12px;
  border-bottom:2px solid var(--mbpg-gold);
  background:#20231f;
  color:#fff;
  text-align:left;
  font-size:12px;
  text-transform:uppercase;
}
.mbpg__facts-table tbody th,.mbpg__facts-table tbody td{padding:10px 12px;border-bottom:1px solid var(--mbpg-line);text-align:left;vertical-align:top}
.mbpg__facts-table tbody tr:nth-child(even){background:var(--mbpg-soft-green)}
.mbpg__facts-table tbody tr:last-child th,.mbpg__facts-table tbody tr:last-child td{border-bottom:0}
.mbpg__facts-table tbody th{width:34%;font-weight:700}
.mbpg__details{margin:0 0 18px;border-top:1px solid var(--mbpg-line);border-bottom:1px solid var(--mbpg-line)}
.mbpg__details summary{padding:14px 0;color:var(--mbpg-green-dark);font-weight:700;font-size:15px;cursor:pointer}
.mbpg__details-content{padding:0 0 14px;color:var(--mbpg-muted);font-size:13px;line-height:1.55}
.mbpg__details-content h4{margin:10px 0 6px;color:var(--mbpg-ink);font-size:15px;font-weight:700;line-height:1.35}
.mbpg__details-content ul{margin:0;padding-left:19px}
.mbpg__warning-list{color:#704f00}
.mbpg__alternative-title{margin:28px 0 12px;color:var(--mbpg-green);font-size:23px;line-height:1.25}
.mbpg__alternatives{overflow:hidden;border:1px solid var(--mbpg-line);border-radius:14px}
.mbpg__alternative{
  display:grid;
  grid-template-columns:44px minmax(0,1fr) minmax(150px,auto) auto;
  align-items:center;
  gap:14px;
  padding:14px 16px;
  border-bottom:1px solid var(--mbpg-line);
  background:#fff;
}
.mbpg__alternative:nth-child(even){background:var(--mbpg-cream)}
.mbpg__alternative:last-child{border-bottom:0}
.mbpg__rank{
  display:grid;
  width:34px;
  height:34px;
  place-items:center;
  border:1px solid #d7ceb8;
  border-radius:50%;
  color:#75633d;
  font-weight:700;
}
.mbpg__alternative-copy strong{display:block;font-size:15px;line-height:1.35;font-weight:700}
.mbpg__alternative-copy a{color:var(--mbpg-ink)!important;text-decoration:none!important}
.mbpg__alternative-copy a:hover{color:var(--mbpg-green-dark)!important}
.mbpg__alternative-copy small{display:block;margin-top:2px;color:#656a64;line-height:1.45}
.mbpg__alternative .mbpg__price-line{min-height:0;margin:0;font-size:15px;text-align:right}
.mbpg__alternative .mbpg__availability{display:block;margin:1px 0 0;font-size:12px}
.mbpg__alternative-link{color:var(--mbpg-green-dark)!important;font-weight:700;text-decoration:none!important;white-space:nowrap}
.mbpg__compare{margin-top:24px}
.mbpg__compare>summary{padding:13px 16px;border:1px solid var(--mbpg-line);border-radius:10px;background:#fff;color:var(--mbpg-green-dark);font-weight:700;cursor:pointer}
.mbpg__compare[open]>summary{border-radius:10px 10px 0 0}
.mbpg__table-scroll{overflow-x:auto;border:1px solid var(--mbpg-line);border-top:0;border-radius:0 0 12px 12px}
.mbpg__compare table{width:100%;min-width:720px;border-collapse:collapse;background:#fff}
.mbpg__compare th,.mbpg__compare td{padding:12px 14px;border-bottom:1px solid var(--mbpg-line);text-align:left;vertical-align:top;line-height:1.45}
.mbpg__compare thead th{border-bottom:2px solid var(--mbpg-gold);background:#20231f;color:#fff;font-size:13px}
.mbpg__compare tbody tr:nth-child(even){background:var(--mbpg-soft-green)}
.mbpg__compare tbody th{width:170px}
.mbpg__compare tr:last-child th,.mbpg__compare tr:last-child td{border-bottom:0}
.mbpg__empty,.mbpg__error,.mbpg__loading{padding:28px;text-align:left}
.mbpg__meta{display:none}
.mbpg__sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.mbpg[data-mbpg-auto="homepage"]{width:100%;clear:both;margin:clamp(30px,5vw,58px) auto}
@media(max-width:900px){
  .mbpg__featured-product{grid-template-columns:240px minmax(0,1fr)}
  .mbpg__product-media{min-height:360px}
  .mbpg__alternative{grid-template-columns:42px minmax(0,1fr) auto}
  .mbpg__alternative .mbpg__price-line{grid-column:2;text-align:left}
  .mbpg__alternative-link{grid-column:3;grid-row:1/3}
}
@media(max-width:760px){
  .mbpg__body{padding:26px 20px}
  .mbpg__intro-head{grid-template-columns:1fr}
  .mbpg__mini{min-width:0}
  .mbpg__featured-product{grid-template-columns:1fr}
  .mbpg__product-media{min-height:280px;border-right:0;border-bottom:1px solid var(--mbpg-line)}
  .mbpg__product-media img{max-height:250px}
  .mbpg__actions--between{flex-direction:column-reverse}
  .mbpg__actions--between .mbpg__button,.mbpg__actions--results .mbpg__button{width:100%}
}
@media(max-width:560px){
  .mbpg{margin:16px 0 28px}
  .mbpg__shell{border-radius:14px}
  .mbpg__body{padding:24px 14px 26px}
  .mbpg__title,.mbpg__question-title{font-size:24px}
  .mbpg__option{grid-template-columns:58px minmax(0,1fr) 26px;gap:13px;min-height:88px;padding:13px}
  .mbpg__option-icon{width:62px;height:62px;flex-basis:62px;border-radius:17px}
  .mbpg__option-icon .mbpg__svg-icon{width:41px;height:41px}
  .mbpg__option-copy strong{font-size:15px}
  .mbpg__option-copy small{font-size:13px}
  .mbpg__product-copy{padding:22px 16px}
  .mbpg__product-title{font-size:22px}
  .mbpg__alternative{grid-template-columns:38px 1fr;padding:13px 12px}
  .mbpg__alternative .mbpg__price-line{grid-column:2}
  .mbpg__alternative-link{grid-column:2;grid-row:auto}
  .mbpg__facts-table{font-size:13px}
}
@media(prefers-reduced-motion:reduce){.mbpg *,.mbpg *::before,.mbpg *::after{scroll-behavior:auto!important;transition:none!important}}
`;

  function mergeConfig(base, override) {
    return Object.assign({}, base, override || {});
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function unique(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
  }

  function selectorEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(String(value));
    return String(value).replace(/[^a-zA-Z0-9_-]/g, (character) => `\\${character}`);
  }

  function fullUrl(path) {
    try { return new URL(path, runtimeConfig.siteOrigin || window.location.origin).href; }
    catch (_) { return path; }
  }

  function productIconKey(product) {
    if (product.kind === 'bundle') return 'gift';
    if (product.forms.includes('gummies')) return 'bear';
    if (product.forms.includes('powder')) return 'spoon';
    if (product.forms.includes('softgels') || product.forms.includes('capsules')) return 'pill';
    return 'package';
  }

  function formatBooleanLabel(value, trueLabel) {
    return value === true ? trueLabel : null;
  }

  function productBadges(product) {
    return unique([
      product.kind === 'bundle' ? 'výhodný balíček' : null,
      ...product.forms.map((form) => FORM_LABELS[form]),
      formatBooleanLabel(product.vegan, 'vegan'),
      formatBooleanLabel(product.sugarFree, 'bez cukru'),
      formatBooleanLabel(product.glutenFree, 'bez lepku'),
      formatBooleanLabel(product.halal, 'halal'),
      product.caffeine ? 'obsahuje kofein / zelený čaj' : null
    ]);
  }

  function findOption(questionId, value) {
    const question = QUESTIONS.find((item) => item.id === questionId);
    return question?.options.find((item) => item.value === value) || null;
  }

  function isAllowedForAudience(item, audience) {
    return !Array.isArray(item.audiences) || item.audiences.includes(audience);
  }

  function productMatchesSelectedForm(product, selectedForm) {
    if (!selectedForm || selectedForm === 'any') return true;
    const forms = unique(product.forms || []);
    if (!forms.length) return false;

    if (selectedForm === 'capsules') {
      return forms.every((form) => form === 'capsules' || form === 'softgels');
    }
    if (selectedForm === 'gummies') return forms.length === 1 && forms[0] === 'gummies';
    if (selectedForm === 'powder') return forms.length === 1 && forms[0] === 'powder';
    if (selectedForm === 'mixed') return product.kind === 'bundle' && forms.length > 1;
    return forms.includes(selectedForm);
  }

  function matchesProductFilters(product, answers, includeGoalThreshold = true) {
    const audience = answers.audience;
    if (audience && !product.audiences.includes(audience)) return false;

    if (includeGoalThreshold && answers.goal) {
      const goalScore = Number(product.goals?.[answers.goal] || 0);
      if (goalScore < Number(runtimeConfig.minimumGoalScore || 30)) return false;
    }

    if (!productMatchesSelectedForm(product, answers.form)) return false;
    if (answers.solution === 'single' && product.kind !== 'single') return false;
    if (answers.solution === 'bundle' && product.kind !== 'bundle') return false;
    if (answers.diet && answers.diet !== 'any' && product[answers.diet] !== true) return false;
    if (answers.stimulants === 'avoid' && product.caffeine === true) return false;

    return true;
  }

  function candidateProducts(answers, includeGoalThreshold = true) {
    return CATALOG.filter((product) => matchesProductFilters(product, answers || {}, includeGoalThreshold));
  }

  function candidateCount(answers, includeGoalThreshold = true) {
    return candidateProducts(answers, includeGoalThreshold).length;
  }

  function hasCandidate(answers, includeGoalThreshold = true) {
    return candidateCount(answers, includeGoalThreshold) > 0;
  }

  function strictMatch(product, answers) {
    return matchesProductFilters(product, answers, true);
  }

  function scoreProduct(product, answers) {
    let score = Number(product.priority || 0) / 10;
    const reasons = [];
    const goalScore = Number(product.goals?.[answers.goal] || 0);
    score += goalScore;
    if (goalScore > 0) reasons.push(`odpovídá oblasti „${GOAL_LABELS[answers.goal] || answers.goal}“`);

    if (answers.form && answers.form !== 'any' && productMatchesSelectedForm(product, answers.form)) {
      score += 24;
      if (answers.form === 'capsules') reasons.push('vyhovuje zvolená kapslová nebo softgelová forma');
      else if (answers.form === 'mixed') reasons.push('jde o kombinaci více forem');
      else reasons.push(`vyhovuje forma ${FORM_LABELS[answers.form] || answers.form}`);
    }

    if (answers.solution === 'single' && product.kind === 'single') {
      score += 12;
      reasons.push('jde o jeden samostatný produkt');
    }
    if (answers.solution === 'bundle' && product.kind === 'bundle') {
      score += 14;
      reasons.push('jde o hotovou zvýhodněnou rutinu');
    }
    if (answers.solution === 'any' && product.kind === 'single') score += 2;

    if (answers.diet && answers.diet !== 'any' && product[answers.diet] === true) {
      score += 10;
      const dietLabels = { vegan: 'splňuje veganské provedení', sugarFree: 'je bez cukru', glutenFree: 'je bez lepku', halal: 'má potvrzené označení halal' };
      reasons.push(dietLabels[answers.diet]);
    }

    if (answers.stimulants === 'avoid' && product.caffeine === false) {
      score += 4;
      reasons.push('neobsahuje kofein ani zelený čaj');
    }

    return { product, score, reasons: unique(reasons).slice(0, 3) };
  }

  function rankProducts(answers, maxResults) {
    const ranked = CATALOG
      .filter((product) => strictMatch(product, answers))
      .map((product) => scoreProduct(product, answers))
      .sort((a, b) => b.score - a.score || b.product.priority - a.product.priority || a.product.name.localeCompare(b.product.name, 'cs'));

    return ranked.slice(0, Math.max(1, Number(maxResults) || 3));
  }

  function rankProductsWithSafetyFallback(answers, maxResults) {
    const strict = rankProducts(answers, maxResults);
    if (strict.length) return { entries: strict, fallbackUsed: false, relaxed: [] };

    // This branch should not be reached because every displayed answer option is
    // checked against the remaining catalog. It is retained as a defensive guard
    // for a stale browser state or an externally modified configuration.
    const relaxedAnswers = Object.assign({}, answers, {
      form: 'any',
      solution: 'any',
      stimulants: 'any'
    });
    const fallback = rankProducts(relaxedAnswers, maxResults);
    return { entries: fallback, fallbackUsed: fallback.length > 0, relaxed: fallback.length ? ['forma', 'typ řešení', 'kofein'] : [] };
  }

  function buildCartUrl(product) {
    const url = new URL(product.url, runtimeConfig.siteOrigin || window.location.origin);
    url.searchParams.set('addtocart', '1');
    url.searchParams.set('quantity', '1');
    url.searchParams.set('return', 'back');
    return url.href;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = STYLE_CSS;
    document.head.appendChild(style);
  }

  function collectJsonLd(value, output) {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((item) => collectJsonLd(item, output));
      return;
    }
    if (typeof value !== 'object') return;
    output.push(value);
    if (value['@graph']) collectJsonLd(value['@graph'], output);
  }

  function parseProductPage(html, product) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const nodes = [];
    doc.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      try { collectJsonLd(JSON.parse(script.textContent), nodes); }
      catch (_) { /* malformed third-party JSON-LD is ignored */ }
    });

    const schemaProduct = nodes.find((node) => {
      const type = node?.['@type'];
      return type === 'Product' || (Array.isArray(type) && type.includes('Product'));
    });
    const offer = Array.isArray(schemaProduct?.offers) ? schemaProduct.offers[0] : schemaProduct?.offers;

    const schemaImage = Array.isArray(schemaProduct?.image) ? schemaProduct.image[0] : schemaProduct?.image;
    const metaImage = doc.querySelector('meta[property="og:image"]')?.content || doc.querySelector('link[itemprop="image"]')?.href;
    const rawPrice = offer?.price || doc.querySelector('meta[property="product:price:amount"]')?.content || doc.querySelector('[itemprop="price"]')?.getAttribute('content');
    const currency = offer?.priceCurrency || doc.querySelector('meta[property="product:price:currency"]')?.content || 'CZK';
    const availabilityRaw = String(offer?.availability || doc.querySelector('link[itemprop="availability"]')?.href || '');
    let availability = 'unknown';
    if (/InStock|LimitedAvailability|PreOrder/i.test(availabilityRaw)) availability = 'in';
    if (/OutOfStock|Discontinued|SoldOut/i.test(availabilityRaw)) availability = 'out';

    const priceNumber = Number(String(rawPrice || '').replace(/\s/g, '').replace(',', '.'));
    let price = null;
    if (Number.isFinite(priceNumber) && priceNumber > 0) {
      try {
        price = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency, maximumFractionDigits: 0 }).format(priceNumber);
      } catch (_) {
        price = `${priceNumber} ${currency}`;
      }
    }

    return {
      image: schemaImage || metaImage || null,
      price,
      availability,
      sku: schemaProduct?.sku || null,
      liveName: schemaProduct?.name || product.name
    };
  }

  async function hydrateProduct(product) {
    if (pageCache.has(product.id)) return pageCache.get(product.id);
    const promise = fetch(fullUrl(product.url), {
      credentials: 'same-origin',
      headers: { Accept: 'text/html' },
      cache: 'default'
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((html) => parseProductPage(html, product))
      .catch((error) => {
        if (runtimeConfig.debug) console.warn('[MyBears Product Guide] Live product data failed:', product.id, error);
        return { image: null, price: null, availability: 'unknown', sku: null, liveName: product.name };
      });
    pageCache.set(product.id, promise);
    return promise;
  }

  function sendEvent(root, name, detail) {
    const safeDetail = Object.assign({ version: VERSION }, detail || {});
    root.dispatchEvent(new CustomEvent(`mbpg:${name}`, { bubbles: true, detail: safeDetail }));
    if (runtimeConfig.analytics && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: `mbpg_${name}`, mbpg_version: VERSION }, safeDetail));
    }
  }

  class ProductGuide {
    constructor(root) {
      this.root = root;
      this.uid = `mbpg-${++instanceCounter}`;
      this.answers = {};
      this.stepIndex = -1;
      this.visibleQuestions = [];
      this.results = [];
      this.boundClick = this.onClick.bind(this);
      this.boundChange = this.onChange.bind(this);
      this.root.addEventListener('click', this.boundClick);
      this.root.addEventListener('change', this.boundChange);
      this.root.classList.add('mbpg');
      this.root.setAttribute('data-mbpg-ready', VERSION);
      this.root.setAttribute('aria-live', 'polite');
      this.renderIntro();
    }

    destroy() {
      this.root.removeEventListener('click', this.boundClick);
      this.root.removeEventListener('change', this.boundChange);
      this.root.removeAttribute('data-mbpg-ready');
      this.root.innerHTML = '';
    }

    currentAudience() {
      return this.answers.audience || null;
    }

    getVisibleQuestions() {
      const audience = this.currentAudience();
      const visible = [];
      const priorAnswers = {};

      for (const question of QUESTIONS) {
        if (question.audiences && audience && !question.audiences.includes(audience)) continue;

        let options = question.options
          .filter((option) => !option.audiences || !audience || option.audiences.includes(audience))
          .map((option) => {
            const proposedAnswers = Object.assign({}, priorAnswers, { [question.id]: option.value });
            return Object.assign({}, option, { candidateCount: candidateCount(proposedAnswers, true) });
          })
          .filter((option) => option.candidateCount > 0);

        // A question with only the neutral answer would not refine the result.
        // The stimulant question is also omitted unless the customer has a real choice.
        if (!options.length) continue;
        if (question.id === 'stimulants' && options.length < 2) continue;
        if (options.length === 1 && options[0].value === 'any') continue;

        visible.push(Object.assign({}, question, { options }));

        const storedValue = this.answers[question.id];
        if (storedValue && options.some((option) => option.value === storedValue)) {
          priorAnswers[question.id] = storedValue;
        }
      }

      return visible;
    }

    scrollIntoView() {
      const rect = this.root.getBoundingClientRect();
      const top = window.scrollY + rect.top - Number(runtimeConfig.scrollOffset || 0);
      if (rect.top < 0 || rect.top > window.innerHeight * 0.75) {
        window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      }
    }

    renderIntro() {
      this.root.innerHTML = `
        <section class="mbpg__shell mbpg__intro" aria-labelledby="${this.uid}-title">
          <div class="mbpg__topline"></div>
          <div class="mbpg__body">
            <div class="mbpg__intro-head">
              <div>
                <h2 class="mbpg__title" id="${this.uid}-title">Pomůžeme vám vybrat vhodný produkt MyBears</h2>
                <p class="mbpg__lead">Stačí odpovědět na několik krátkých otázek. V průběhu zobrazujeme jen takové možnosti, které skutečně vedou k odpovídajícímu doporučení v katalogu MyBears.</p>
              </div>
              <div class="mbpg__mini"><strong>Rychlý průvodce</strong>3 přehledné kroky<br>Přibližně 1–2 minuty</div>
            </div>

            <div class="mbpg__steps" aria-label="Průběh průvodce">
              <div class="mbpg__step-row"><span class="mbpg__icon mbpg__step-icon" style="${iconStyleVars('clipboard-check')}" aria-hidden="true">${iconSvg('clipboard-check')}</span><span class="mbpg__step-copy"><strong>Vyberete, pro koho produkt hledáte</strong><span>Pro sebe, dítě nebo vícečlennou domácnost.</span></span></div>
              <div class="mbpg__step-row"><span class="mbpg__icon mbpg__step-icon" style="${iconStyleVars('sliders')}" aria-hidden="true">${iconSvg('sliders')}</span><span class="mbpg__step-copy"><strong>Upřesníte oblast a důležité preference</strong><span>Kombinace bez odpovídajícího výsledku průvodce automaticky skryje.</span></span></div>
              <div class="mbpg__step-row"><span class="mbpg__icon mbpg__step-icon" style="${iconStyleVars('package-check')}" aria-hidden="true">${iconSvg('package-check')}</span><span class="mbpg__step-copy"><strong>Získáte doporučení s jasným vysvětlením</strong><span>Včetně ceny, dávkování a základních parametrů.</span></span></div>
            </div>

            <div class="mbpg__actions"><button class="mbpg__button mbpg__button--primary" type="button" data-mbpg-action="start">Spustit průvodce</button></div>

            <div class="tldr-box"><p><strong>Vaše odpovědi zůstávají pouze v tomto průvodci.</strong> Doporučení slouží jako orientační pomoc při výběru a nenahrazuje individuální konzultaci s lékařem nebo lékárníkem.</p></div>
          </div>
        </section>`;
    }

    start() {
      this.answers = {};
      this.stepIndex = 0;
      this.visibleQuestions = this.getVisibleQuestions();
      sendEvent(this.root, 'start', {});
      this.renderQuestion();
      this.scrollIntoView();
    }

    renderQuestion() {
      this.visibleQuestions = this.getVisibleQuestions();
      if (this.stepIndex >= this.visibleQuestions.length) this.stepIndex = this.visibleQuestions.length - 1;
      const question = this.visibleQuestions[this.stepIndex];
      if (!question) return this.renderResults();

      if (this.answers[question.id] && !question.options.some((option) => option.value === this.answers[question.id])) {
        delete this.answers[question.id];
      }

      const selected = this.answers[question.id];
      const current = this.stepIndex + 1;
      const total = this.visibleQuestions.length;
      const titleId = `${this.uid}-question-${question.id}`;

      this.root.innerHTML = `
        <section class="mbpg__shell" aria-labelledby="${titleId}">
          <div class="mbpg__topline"></div>
          <div class="mbpg__body">
            <div class="mbpg__progress" aria-label="Krok ${current} z ${total}">
              <div class="mbpg__progress-meta"><span>Krok ${current} z ${total}</span><span>${Math.round((current / total) * 100)} %</span></div>
              <div class="mbpg__progress-track"><span style="width:${(current / total) * 100}%"></span></div>
            </div>

            <h2 class="mbpg__question-title" id="${titleId}" tabindex="-1">${escapeHtml(question.title)}</h2>
            ${question.description ? `<p class="mbpg__question-description">${escapeHtml(question.description)}</p>` : ''}

            <div class="mbpg__options" role="radiogroup" aria-labelledby="${titleId}">
              ${question.options.map((option, index) => `
                <label class="mbpg__option${selected === option.value ? ' is-selected' : ''}">
                  <input type="radio" name="${this.uid}-${escapeHtml(question.id)}" value="${escapeHtml(option.value)}" ${selected === option.value ? 'checked' : ''}>
                  <span class="mbpg__icon mbpg__option-icon" style="${iconStyleVars(option.icon || 'circle')}" aria-hidden="true">${iconSvg(option.icon || 'circle')}</span>
                  <span class="mbpg__option-copy"><strong>${escapeHtml(option.label)}</strong><small>${escapeHtml(option.description || '')}</small></span>
                  <span class="mbpg__radio" aria-hidden="true"></span>
                </label>`).join('')}
            </div>

            <div class="mbpg__actions mbpg__actions--between">
              <button class="mbpg__button mbpg__button--secondary" type="button" data-mbpg-action="back">${this.stepIndex === 0 ? 'Zrušit' : 'Zpět'}</button>
              <button class="mbpg__button mbpg__button--primary" type="button" data-mbpg-action="next" ${selected ? '' : 'disabled'}>${current === total ? 'Zobrazit doporučení' : 'Pokračovat'}</button>
            </div>
          </div>
        </section>`;

      requestAnimationFrame(() => this.root.querySelector('.mbpg__question-title')?.focus({ preventScroll: true }));
    }

    selectAnswer(input) {
      const question = this.visibleQuestions[this.stepIndex];
      if (!question) return;
      this.answers[question.id] = input.value;

      const questionIndex = QUESTIONS.findIndex((item) => item.id === question.id);
      QUESTIONS.slice(questionIndex + 1).forEach((item) => delete this.answers[item.id]);

      const allowedQuestions = this.getVisibleQuestions();
      const allowedQuestionIds = new Set(allowedQuestions.map((item) => item.id));
      Object.keys(this.answers).forEach((key) => {
        if (!allowedQuestionIds.has(key)) delete this.answers[key];
      });
      allowedQuestions.forEach((item) => {
        if (this.answers[item.id] && !item.options.some((option) => option.value === this.answers[item.id])) delete this.answers[item.id];
      });

      this.root.querySelectorAll('.mbpg__option').forEach((item) => item.classList.remove('is-selected'));
      input.closest('.mbpg__option')?.classList.add('is-selected');
      const next = this.root.querySelector('[data-mbpg-action="next"]');
      if (next) next.disabled = false;
    }

    next() {
      const question = this.visibleQuestions[this.stepIndex];
      if (!question || !this.answers[question.id]) return;

      // Defensive invariant: an accepted answer must always leave at least one product.
      if (!hasCandidate(this.answers, true)) {
        delete this.answers[question.id];
        this.renderQuestion();
        return;
      }

      this.visibleQuestions = this.getVisibleQuestions();
      if (this.stepIndex >= this.visibleQuestions.length - 1) return this.renderResults();
      this.stepIndex += 1;
      this.renderQuestion();
      this.scrollIntoView();
    }

    back() {
      if (this.stepIndex <= 0) {
        this.renderIntro();
        return;
      }
      this.stepIndex -= 1;
      this.renderQuestion();
      this.scrollIntoView();
    }

    answerSummary() {
      return this.visibleQuestions
        .map((question) => findOption(question.id, this.answers[question.id])?.label)
        .filter(Boolean);
    }

    featuredProductCard(entry) {
      const product = entry.product;
      const detailUrl = fullUrl(product.url);
      const warnings = product.warnings || [];
      const specialBadges = productBadges(product)
        .filter((tag) => !['gummies', 'kapsle', 'softgely', 'prášek', 'kombinace forem', 'výhodný balíček'].includes(tag));

      return `
        <article class="mbpg__featured-product" data-mbpg-product-id="${escapeHtml(product.id)}" id="${this.uid}-product-${escapeHtml(product.id)}">
          <div class="mbpg__product-media" data-mbpg-media>
            <div class="mbpg__product-placeholder" style="${iconStyleVars(productIconKey(product))}" aria-hidden="true">${iconSvg(productIconKey(product))}</div>
          </div>
          <div class="mbpg__product-copy">
            <span class="mbpg__match-label">Nejbližší shoda</span>
            <h3 class="mbpg__product-title"><a href="${escapeHtml(detailUrl)}" data-mbpg-product-link="${escapeHtml(product.id)}">${escapeHtml(product.name)}</a></h3>
            <div class="mbpg__price-line" data-mbpg-price><span>Načítáme cenu a dostupnost…</span></div>
            <p class="mbpg__product-summary">${escapeHtml(product.summary)}</p>
            <div class="tldr-box"><p><strong>Proč doporučujeme právě tento produkt:</strong> ${escapeHtml(entry.reasons.join(', ') || 'nejlépe odpovídá zadaným preferencím')}.</p></div>

            <table class="mbpg__facts-table">
              <thead><tr><th scope="col">Parametr</th><th scope="col">Informace</th></tr></thead>
              <tbody>
                <tr><th scope="row">Balení</th><td>${escapeHtml(product.package)}</td></tr>
                <tr><th scope="row">Dávkování</th><td>${escapeHtml(product.dose)}</td></tr>
                <tr><th scope="row">Vystačí</th><td>${escapeHtml(product.supply)}</td></tr>
                ${product.flavor ? `<tr><th scope="row">Příchuť</th><td>${escapeHtml(product.flavor)}</td></tr>` : ''}
                <tr><th scope="row">Provedení</th><td>${escapeHtml(specialBadges.join(' · ') || 'bez potvrzeného zvláštního označení')}</td></tr>
              </tbody>
            </table>

            <details class="mbpg__details">
              <summary>Podrobnosti o složení a použití</summary>
              <div class="mbpg__details-content">
                <h4>${product.kind === 'bundle' ? 'Obsah balíčku' : 'Hlavní složky'}</h4>
                <ul>${(product.keyIngredients || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
                ${warnings.length ? `<h4>Upozornění před užíváním</h4><ul class="mbpg__warning-list">${warnings.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
              </div>
            </details>

            <div class="mbpg__actions">
              <a class="mbpg__button mbpg__button--secondary" href="${escapeHtml(detailUrl)}" data-mbpg-product-link="${escapeHtml(product.id)}">Zobrazit produkt</a>
              ${runtimeConfig.enableAddToCart ? `<a class="mbpg__button mbpg__button--primary" href="${escapeHtml(buildCartUrl(product))}" data-mbpg-add="${escapeHtml(product.id)}">Do košíku</a>` : ''}
            </div>
          </div>
        </article>`;
    }

    alternativeProductRow(entry, index) {
      const product = entry.product;
      const detailUrl = fullUrl(product.url);
      const compactInfo = unique([
        product.forms.map((form) => FORM_LABELS[form] || form).join(', '),
        product.kind === 'bundle' ? 'zvýhodněný balíček' : null,
        product.vegan === true ? 'vegan' : null,
        product.sugarFree === true ? 'bez cukru' : null
      ]).join(' · ');

      return `
        <article class="mbpg__alternative" data-mbpg-product-id="${escapeHtml(product.id)}" id="${this.uid}-product-${escapeHtml(product.id)}">
          <span class="mbpg__rank" aria-hidden="true">${index + 1}</span>
          <span class="mbpg__alternative-copy">
            <strong><a href="${escapeHtml(detailUrl)}" data-mbpg-product-link="${escapeHtml(product.id)}">${escapeHtml(product.name)}</a></strong>
            <small>${escapeHtml(compactInfo || product.summary)}</small>
          </span>
          <span class="mbpg__price-line" data-mbpg-price><span>Načítá se…</span></span>
          <a class="mbpg__alternative-link" href="${escapeHtml(detailUrl)}" data-mbpg-product-link="${escapeHtml(product.id)}">Zobrazit</a>
        </article>`;
    }

    comparisonTable(entries) {
      if (!runtimeConfig.enableComparison || entries.length < 2) return '';
      const rows = [
        ['Forma', (p) => p.forms.map((form) => FORM_LABELS[form] || form).join(', ')],
        ['Typ', (p) => p.kind === 'bundle' ? 'zvýhodněný balíček' : 'samostatný produkt'],
        ['Balení', (p) => p.package],
        ['Dávkování', (p) => p.dose],
        ['Vystačí', (p) => p.supply],
        ['Provedení', (p) => productBadges(p).filter((tag) => !['gummies','kapsle','softgely','prášek','kombinace forem','výhodný balíček'].includes(tag)).join(', ') || 'bez potvrzeného zvláštního označení'],
        ['Hlavní obsah', (p) => (p.keyIngredients || []).slice(0, 4).join('; ')]
      ];
      return `
        <details class="mbpg__compare">
          <summary>Porovnat doporučené produkty</summary>
          <div class="mbpg__table-scroll">
            <table>
              <thead><tr><th scope="col">Parametr</th>${entries.map((entry) => `<th scope="col">${escapeHtml(entry.product.name)}</th>`).join('')}</tr></thead>
              <tbody>${rows.map(([label, getter]) => `<tr><th scope="row">${escapeHtml(label)}</th>${entries.map((entry) => `<td>${escapeHtml(getter(entry.product))}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
          </div>
        </details>`;
    }

    renderResults() {
      this.visibleQuestions = this.getVisibleQuestions();
      const ranking = rankProductsWithSafetyFallback(this.answers, runtimeConfig.maxResults);
      this.results = ranking.entries;
      const answerSummary = this.answerSummary();
      const resultIds = this.results.map((entry) => entry.product.id);
      sendEvent(this.root, 'complete', { result_count: this.results.length, result_ids: resultIds, fallback_used: ranking.fallbackUsed });

      if (!this.results.length) {
        // This can only happen if the catalog itself contains no product for the
        // selected audience/goal or was modified outside this script.
        this.root.innerHTML = `
          <section class="mbpg__shell" aria-labelledby="${this.uid}-no-result">
            <div class="mbpg__topline"></div>
            <div class="mbpg__body mbpg__empty">
              <h2 class="mbpg__title" id="${this.uid}-no-result">Doporučení se nepodařilo zobrazit</h2>
              <p class="mbpg__lead">Katalog se pravděpodobně mezitím změnil. Spusťte průvodce znovu a my znovu ověříme, které kombinace vedou k odpovídajícímu produktu.</p>
              <div class="mbpg__actions mbpg__actions--results">
                <button class="mbpg__button mbpg__button--primary" type="button" data-mbpg-action="restart">Spustit znovu</button>
                <a class="mbpg__button mbpg__button--secondary" href="${escapeHtml(fullUrl(runtimeConfig.allProductsUrl))}">Zobrazit všechny produkty</a>
              </div>
            </div>
          </section>`;
        this.scrollIntoView();
        return;
      }

      const featured = this.results[0];
      const alternatives = this.results.slice(1);
      const fallbackMessage = ranking.fallbackUsed
        ? `<div class="mbpg__notice"><span class="mbpg__notice-icon" aria-hidden="true">${iconSvg('info')}</span><div><strong>Zobrazili jsme nejbližší dostupnou variantu.</strong> Kvůli technické změně katalogu jsme uvolnili pouze vedlejší preference: ${escapeHtml(ranking.relaxed.join(', '))}. Cílová skupina, hlavní oblast i zvolené provedení zůstaly zachované.</div></div>`
        : '';

      this.root.innerHTML = `
        <section class="mbpg__shell" aria-labelledby="${this.uid}-results-title">
          <div class="mbpg__topline"></div>
          <div class="mbpg__body">
            <div class="mbpg__results-head">
              <h2 class="mbpg__title" id="${this.uid}-results-title" tabindex="-1">Doporučení podle vašich odpovědí</h2>
              <p class="mbpg__lead">Vybrali jsme nejbližší shodu podle cílové skupiny, oblasti zájmu, formy produktu a zvolených preferencí.</p>
            </div>

            <div class="mbpg__result-summary"><span class="mbpg__notice-icon" aria-hidden="true">${iconSvg('check')}</span><div><strong>Zadané preference</strong>${escapeHtml(answerSummary.join(' · '))}</div></div>

            ${this.featuredProductCard(featured)}

            ${alternatives.length ? `
              <h3 class="mbpg__alternative-title">Další vhodné varianty</h3>
              <div class="mbpg__alternatives">${alternatives.map((entry, index) => this.alternativeProductRow(entry, index + 1)).join('')}</div>` : ''}

            ${this.comparisonTable(this.results)}
            ${fallbackMessage}

            <div class="tldr-box"><p><strong>Důležité upozornění:</strong> Průvodce posuzuje pouze produktové parametry a zvolené preference. Nevyhodnocuje zdravotní stav, diagnózy, léčbu, těhotenství ani možné interakce. Před použitím vždy zkontrolujte aktuální etiketu a upozornění na detailu produktu.</p></div>

            <div class="mbpg__actions mbpg__actions--results">
              <button class="mbpg__button mbpg__button--secondary" type="button" data-mbpg-action="edit">Upravit poslední odpověď</button>
              <button class="mbpg__button mbpg__button--ghost" type="button" data-mbpg-action="restart">Začít znovu</button>
            </div>
          </div>
        </section>`;

      requestAnimationFrame(() => this.root.querySelector('.mbpg__title')?.focus({ preventScroll: true }));
      if (runtimeConfig.enableLiveHydration) this.hydrateResults();
      this.scrollIntoView();
    }

    async hydrateResults() {
      const entries = this.results.slice();
      await Promise.all(entries.map(async (entry) => {
        const product = entry.product;
        const live = await hydrateProduct(product);
        const card = this.root.querySelector(`[data-mbpg-product-id="${selectorEscape(product.id)}"]`);
        if (!card || !this.root.isConnected) return;

        if (live.image) {
          const media = card.querySelector('[data-mbpg-media]');
          if (media) media.innerHTML = `<img src="${escapeHtml(fullUrl(live.image))}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async">`;
        }

        const priceLine = card.querySelector('[data-mbpg-price]');
        if (priceLine) {
          const availabilityText = live.availability === 'in' ? 'Skladem' : live.availability === 'out' ? 'Momentálně nedostupné' : 'Dostupnost na detailu';
          const availabilityClass = live.availability === 'in' ? ' is-in' : live.availability === 'out' ? ' is-out' : '';
          priceLine.innerHTML = `${live.price ? `<span>${escapeHtml(live.price)}</span>` : '<span>Cena na detailu produktu</span>'}<span class="mbpg__availability${availabilityClass}">${availabilityText}</span>`;
        }

        if (live.availability === 'out') {
          const add = card.querySelector('[data-mbpg-add]');
          if (add) {
            add.textContent = 'Momentálně nedostupné';
            add.removeAttribute('href');
            add.setAttribute('aria-disabled', 'true');
            add.classList.remove('mbpg__button--primary');
            add.classList.add('mbpg__button--ghost');
          }
        }
      }));
    }

    edit() {
      this.visibleQuestions = this.getVisibleQuestions();
      this.stepIndex = Math.max(0, this.visibleQuestions.length - 1);
      this.renderQuestion();
      this.scrollIntoView();
    }

    onChange(event) {
      const input = event.target.closest('input[type="radio"]');
      if (input && this.root.contains(input)) this.selectAnswer(input);
    }

    onClick(event) {
      const actionElement = event.target.closest('[data-mbpg-action]');
      if (actionElement && this.root.contains(actionElement)) {
        const action = actionElement.dataset.mbpgAction;
        if (action === 'start') this.start();
        if (action === 'next') this.next();
        if (action === 'back') this.back();
        if (action === 'edit') this.edit();
        if (action === 'restart') this.start();
        return;
      }

      const productLink = event.target.closest('[data-mbpg-product-link]');
      if (productLink && this.root.contains(productLink)) {
        sendEvent(this.root, 'product_click', { product_id: productLink.dataset.mbpgProductLink });
      }

      const addLink = event.target.closest('[data-mbpg-add]');
      if (addLink && this.root.contains(addLink) && addLink.getAttribute('aria-disabled') !== 'true') {
        sendEvent(this.root, 'add_to_cart', { product_id: addLink.dataset.mbpgAdd });
      }
    }
  }

  function normalizePathname(pathname) {
    const value = String(pathname || '/').split('?')[0].split('#')[0];
    if (value === '/') return '/';
    return `/${value.replace(/^\/+|\/+$/g, '')}/`;
  }

  function isConfiguredHomepage() {
    if (!runtimeConfig.autoMountHomepage) return false;
    const current = normalizePathname(window.location.pathname);
    const paths = Array.isArray(runtimeConfig.homepagePathnames) && runtimeConfig.homepagePathnames.length
      ? runtimeConfig.homepagePathnames
      : ['/'];
    if (paths.some((path) => normalizePathname(path) === current)) return true;

    const body = document.body;
    if (!body) return false;
    return ['homepage', 'page-homepage', 'category-homepage', 'home-page']
      .some((className) => body.classList.contains(className));
  }

  function safeQuery(selector, scope) {
    if (!selector || typeof selector !== 'string') return null;
    try { return (scope || document).querySelector(selector); }
    catch (error) {
      if (runtimeConfig.debug) console.warn('[MyBears Product Guide] Invalid placement selector:', selector, error);
      return null;
    }
  }

  function uniqueProductLinks(node) {
    if (!node?.querySelectorAll) return [];
    return unique(Array.from(node.querySelectorAll('a[href*="/p/"]'))
      .filter((link) => !link.closest('header, nav, footer, [role="navigation"], [class*="cart" i], [id*="cart" i], [class*="menu" i], [id*="menu" i]'))
      .map((link) => {
        try { return new URL(link.getAttribute('href'), window.location.origin).pathname; }
        catch (_) { return link.getAttribute('href'); }
      }));
  }

  function findFirstProductModule(scope) {
    if (!scope?.querySelectorAll) return null;
    const links = Array.from(scope.querySelectorAll('a[href*="/p/"]'))
      .filter((link) => !link.closest('header, nav, footer, [role="navigation"], [class*="cart" i], [id*="cart" i], [class*="menu" i], [id*="menu" i]'));

    for (const link of links) {
      let node = link.parentElement;
      while (node && node !== scope && node !== document.body) {
        const productLinks = uniqueProductLinks(node);
        if (productLinks.length >= 2) return node;
        node = node.parentElement;
      }
    }
    return null;
  }

  function findBenefitGroup(scope) {
    if (!scope?.querySelectorAll) return null;
    const headings = Array.from(scope.querySelectorAll('h1, h2, h3, h4, strong'));
    const marker = headings.find((element) => /mybears\s*klub/i.test(element.textContent || ''));
    if (!marker) return null;

    let node = marker.parentElement;
    while (node && node !== scope && node !== document.body) {
      const text = (node.textContent || '').replace(/\s+/g, ' ').toLowerCase();
      if (text.includes('doprava zdarma') && (text.includes('bio') || text.includes('vegan'))) return node;
      node = node.parentElement;
    }
    return marker.closest('section, article, div');
  }

  function createHomepageRoot() {
    if (!isConfiguredHomepage()) return null;
    if (document.querySelector(ROOT_SELECTOR)) return null;

    const root = document.createElement('section');
    root.id = runtimeConfig.homepageMountId || 'mybears-product-guide-homepage';
    root.setAttribute('data-mybears-product-guide', '');
    root.setAttribute('data-mbpg-auto', 'homepage');
    root.setAttribute('aria-label', 'Průvodce výběrem produktů MyBears');

    const customBefore = safeQuery(runtimeConfig.homepageInsertBeforeSelector);
    if (customBefore?.parentNode) {
      customBefore.parentNode.insertBefore(root, customBefore);
      return root;
    }

    const customAfter = safeQuery(runtimeConfig.homepageInsertAfterSelector);
    if (customAfter?.parentNode) {
      customAfter.parentNode.insertBefore(root, customAfter.nextSibling);
      return root;
    }

    const main = safeQuery(runtimeConfig.homepageMainSelector) || document.body;
    const productModule = findFirstProductModule(main);
    if (productModule?.parentNode) {
      productModule.parentNode.insertBefore(root, productModule);
      return root;
    }

    const benefitGroup = findBenefitGroup(main);
    if (benefitGroup?.parentNode) {
      benefitGroup.parentNode.insertBefore(root, benefitGroup.nextSibling);
      return root;
    }

    if (main) {
      const firstMeaningful = Array.from(main.children || []).find((element) =>
        !element.matches('script, style, link, noscript')
      );
      if (firstMeaningful?.nextSibling) main.insertBefore(root, firstMeaningful.nextSibling);
      else main.appendChild(root);
      return root;
    }
    return null;
  }

  function mount(root) {
    if (!root || instances.has(root) || root.getAttribute('data-mbpg-ready')) return instances.get(root) || null;
    const guide = new ProductGuide(root);
    instances.set(root, guide);
    return guide;
  }

  function boot(scope) {
    const base = scope?.querySelectorAll ? scope : document;
    if (base === document || base === document.documentElement || base === document.body) createHomepageRoot();

    const roots = [];
    if (base.matches?.(ROOT_SELECTOR)) roots.push(base);
    base.querySelectorAll?.(ROOT_SELECTOR).forEach((root) => roots.push(root));
    if (!roots.length) return Array.from(instances.values());

    injectStyles();
    roots.forEach(mount);
    return Array.from(instances.values());
  }

  function destroyAll() {
    instances.forEach((guide) => guide.destroy());
    instances.clear();
  }

  function configure(nextConfig) {
    runtimeConfig = mergeConfig(runtimeConfig, nextConfig || {});
    return Object.assign({}, runtimeConfig);
  }

  window.MyBearsProductGuide = Object.freeze({
    version: VERSION,
    dataVerifiedAt: DATA_VERIFIED_AT,
    catalog: CATALOG,
    questions: QUESTIONS,
    boot,
    autoMountHomepage: createHomepageRoot,
    configure,
    destroyAll,
    rank: (answers, maxResults) => rankProducts(answers, maxResults || runtimeConfig.maxResults),
    candidateCount: (answers) => candidateCount(answers || {}, true)
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => boot(document), { once: true });
  } else {
    boot(document);
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) boot(node);
    }));
  });
  if (document.documentElement) observer.observe(document.documentElement, { childList: true, subtree: true });
})();
