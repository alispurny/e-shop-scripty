/**
 * MyBears homepage layout normalizer
 * Version: 1.0.0
 *
 * Keeps custom homepage blocks in the intended order on CZ and SK even if
 * Upgates changes wrapper structure around native homepage sections.
 */
(function () {
  'use strict';

  const host = String(window.location.hostname || '').toLowerCase();
  const path = (String(window.location.pathname || '/').replace(/\/+$/, '') || '/');

  if (path !== '/' || (!host.endsWith('mybears.cz') && !host.endsWith('mybears.sk'))) {
    return;
  }

  const OBSERVE_FOR_MS = 5000;

  function normalizeSmartToolsMarkup() {
    let tools = document.getElementById('mybears-smart-tools');
    if (!tools) return null;

    // CZ previously rendered this block as <section>, while the visually correct
    // SK production state uses a Bootstrap container <div>. Normalize both sites.
    if (tools.tagName.toLowerCase() !== 'div') {
      const replacement = document.createElement('div');

      Array.from(tools.attributes).forEach(function (attribute) {
        replacement.setAttribute(attribute.name, attribute.value);
      });

      while (tools.firstChild) {
        replacement.appendChild(tools.firstChild);
      }

      tools.replaceWith(replacement);
      tools = replacement;
    }

    tools.classList.add('container', 'pt-3', 'pt-md-5');

    const head = tools.querySelector('.mb-tools-head');
    if (head) {
      head.classList.add('text-center', 'mb-4', 'mb-md-5');
    }

    const footer = tools.querySelector('.mb-tools-footer');
    if (footer) {
      footer.classList.add('text-center', 'mt-4', 'mt-md-5');
    }

    return tools;
  }

  function normalizeHomepageLayout() {
    const recommended = document.querySelector('.section.lrs.bic-topoffer, .bic-topoffer');
    const productGuide = document.getElementById('mybears-product-guide-homepage');

    // Product guide must always be immediately after the whole Recommended block.
    // Do not anchor to #recommended because that is only an inner tab panel.
    if (
      recommended &&
      productGuide &&
      recommended.nextElementSibling !== productGuide
    ) {
      recommended.insertAdjacentElement('afterend', productGuide);
    }

    const philosophy = document.querySelector('.section.lrs.bic-hptxt, .bic-hptxt');
    const smartTools = normalizeSmartToolsMarkup();

    // Smart Tools must always be immediately after the philosophy/about block.
    if (
      philosophy &&
      smartTools &&
      philosophy.nextElementSibling !== smartTools
    ) {
      philosophy.insertAdjacentElement('afterend', smartTools);
    }
  }

  function start() {
    normalizeHomepageLayout();

    // One extra pass after the current rendering frame handles late synchronous
    // DOM work from the Upgates homepage scripts.
    window.requestAnimationFrame(function () {
      normalizeHomepageLayout();
    });

    // Observe only briefly; this is a startup guard, not a permanent observer.
    if (!document.body || typeof MutationObserver === 'undefined') return;

    const observer = new MutationObserver(function () {
      normalizeHomepageLayout();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    window.setTimeout(function () {
      normalizeHomepageLayout();
      observer.disconnect();
    }, OBSERVE_FOR_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
