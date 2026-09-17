/**
 * MyBears CZ — cache-safe loader wrapper
 * Version: 1.1.0
 *
 * Purpose:
 * - force Product Guide to mount after the complete Recommended block
 * - protect against older cached Product Guide shell versions (e.g. 2.0.2)
 * - reuse the existing mybears-cz-loader-1.0.js for all other tools
 */
(function () {
  'use strict';

  const host = String(window.location.hostname || '').toLowerCase();
  if (!host.endsWith('mybears.cz')) return;

  const currentScript = document.currentScript;
  const fallbackBase = 'https://cdn.jsdelivr.net/gh/alispurny/e-shop-scripty@main/';
  const baseUrl = currentScript && currentScript.src
    ? currentScript.src.split('#')[0].split('?')[0].replace(/[^/]+$/, '')
    : fallbackBase;

  // Configure the lazy Product Guide BEFORE the legacy loader can load it.
  window.MBPG_LAZY_CONFIG = Object.assign(
    {},
    window.MBPG_LAZY_CONFIG || {},
    {
      homepageInsertAfterSelector: '.bic-topoffer'
    }
  );

  function normalizeProductGuidePosition() {
    const guide = document.getElementById('mybears-product-guide-homepage');
    const recommended = document.querySelector('.section.lrs.bic-topoffer, .bic-topoffer');

    if (!guide || !recommended) return false;

    if (recommended.nextElementSibling !== guide) {
      recommended.insertAdjacentElement('afterend', guide);
    }

    return recommended.nextElementSibling === guide;
  }

  function startPositionGuard() {
    normalizeProductGuidePosition();

    if (!document.body || typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver(function () {
      if (normalizeProductGuidePosition()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Safety stop: do not leave the observer running indefinitely.
    window.setTimeout(function () {
      normalizeProductGuidePosition();
      observer.disconnect();
    }, 10000);
  }

  function loadLegacyLoader() {
    const existing = Array.from(document.scripts || []).find(function (script) {
      return String(script.src || '').includes('mybears-cz-loader-1.0.js');
    });

    if (existing) {
      startPositionGuard();
      return;
    }

    const script = document.createElement('script');
    script.src = baseUrl + 'mybears-cz-loader-1.0.js?v=1.1.0-20260917';
    script.defer = true;
    script.setAttribute('data-mybears-loader-wrapper', '1.1.0');
    script.onload = startPositionGuard;
    script.onerror = function () {
      console.error('[MyBears Loader CZ 1.1] Nepodařilo se načíst mybears-cz-loader-1.0.js');
      startPositionGuard();
    };
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      loadLegacyLoader();
      startPositionGuard();
    }, { once: true });
  } else {
    loadLegacyLoader();
    startPositionGuard();
  }
})();
