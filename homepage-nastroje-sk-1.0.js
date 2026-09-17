(function () {
    'use strict';

    function isSlovakHomepage() {
        return (
            window.location.pathname === '/' &&
            window.location.hostname.endsWith('mybears.sk')
        );
    }

    function findMain() {
        return document.querySelector('main.lrs.bic-hp.bg') ||
            document.querySelector('main, [role="main"], #content, .content, .main') ||
            document.body;
    }

    function arrangeHomepageSections() {
        if (!isSlovakHomepage()) return false;

        const main = findMain();
        if (!main) return false;

        const benefitsSection = main.querySelector('.section.lrs.bic-hdln, .bic-hdln');
        const recommendedSection = main.querySelector('.section.lrs.bic-topoffer, .bic-topoffer');

        if (
            benefitsSection &&
            recommendedSection &&
            benefitsSection.parentNode === main &&
            recommendedSection.parentNode === main &&
            benefitsSection.nextElementSibling !== recommendedSection
        ) {
            main.insertBefore(recommendedSection, benefitsSection.nextSibling);
        }

        const guide = document.getElementById('mybears-product-guide-homepage') ||
            document.querySelector('[data-mybears-product-guide][data-mbpg-auto="homepage"]');

        if (
            guide &&
            recommendedSection &&
            recommendedSection.parentNode === main &&
            guide !== recommendedSection.nextElementSibling
        ) {
            main.insertBefore(guide, recommendedSection.nextSibling);
        }

        return Boolean(
            benefitsSection &&
            recommendedSection &&
            benefitsSection.nextElementSibling === recommendedSection &&
            guide &&
            recommendedSection.nextElementSibling === guide
        );
    }

    function initMyBearsHomepageTools() {
        if (!isSlovakHomepage()) return;

        if (document.getElementById('mybears-smart-tools')) {
            return;
        }

        const targetHeading = Array.from(document.querySelectorAll('h1')).find(function (heading) {
            return heading.textContent.trim() === 'Doplnky, ktoré chceme sami užívať';
        });

        if (!targetHeading) {
            console.warn('MyBears SK: H1 pre vloženie bloku nástrojov nebol nájdený.');
            return;
        }

        const philosophySection = targetHeading.closest('.bic-hptxt');

        if (!philosophySection) {
            console.warn('MyBears SK: Sekcia filozofie .bic-hptxt nebola nájdená.');
            return;
        }

        if (!document.getElementById('mybears-smart-tools-styles')) {
            const style = document.createElement('style');
            style.id = 'mybears-smart-tools-styles';
            style.textContent = `
                #mybears-smart-tools {
                    --mb-green: #2dc26b;
                    --mb-green-dark: #198d4b;
                    --mb-gold: #DBC442;
                    --mb-gold-dark: #bfa91f;
                    --mb-ink: #20221f;
                    --mb-muted: #626760;
                    --mb-line: #e5e3dc;
                    --mb-blue-soft: #f4f7fc;
                    --mb-gold-soft: #fff9ec;
                    --mb-green-soft: #f1f8f3;

                    position: relative;
                    overflow: hidden;
                    max-width: 1120px;
                    margin: clamp(30px, 5vw, 58px) auto;
                    padding: 34px 38px 32px;
                    background: #ffffff;
                    border: 1px solid var(--mb-line);
                    border-radius: 18px;
                    box-shadow: 0 12px 32px rgba(27, 35, 29, .07);
                    color: var(--mb-ink);
                    font: inherit;
                    font-family: Arial, Helvetica, sans-serif;
                    line-height: 1.55;
                    box-sizing: border-box;
                }

                #mybears-smart-tools::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--mb-gold);
                }

                #mybears-smart-tools * {
                    box-sizing: border-box;
                    font-family: inherit;
                }

                #mybears-smart-tools .mb-tools-head {
                    max-width: 790px;
                    margin: 0 auto 28px;
                    text-align: center;
                }

                #mybears-smart-tools .mb-tools-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    margin: 0 0 9px;
                    color: var(--mb-green-dark);
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                }

                #mybears-smart-tools .mb-tools-eyebrow::before {
                    content: '';
                    width: 22px;
                    height: 3px;
                    border-radius: 999px;
                    background: var(--mb-gold);
                }

                #mybears-smart-tools .mb-tools-head h2 {
                    margin: 0 0 10px;
                    color: var(--mb-green);
                    font-size: clamp(25px, 3.2vw, 30px);
                    font-weight: 700;
                    line-height: 1.16;
                }

                #mybears-smart-tools .mb-tools-head p {
                    margin: 0;
                    color: #454a45;
                    font-size: 16px;
                    line-height: 1.58;
                }

                #mybears-smart-tools .mb-tools-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 18px;
                    align-items: stretch;
                }

                #mybears-smart-tools .mb-tool-card {
                    display: flex;
                    flex-direction: column;
                    min-height: 280px;
                    padding: 24px 22px 22px;
                    border: 1px solid var(--mb-line);
                    border-radius: 14px;
                    box-shadow: 0 8px 20px rgba(36, 39, 35, .055);
                    text-align: center;
                    transition: transform .2s ease, box-shadow .2s ease;
                }

                #mybears-smart-tools .mb-tool-card:nth-child(1) {
                    background: var(--mb-blue-soft);
                }

                #mybears-smart-tools .mb-tool-card:nth-child(2) {
                    background: var(--mb-gold-soft);
                }

                #mybears-smart-tools .mb-tool-card:nth-child(3) {
                    background: var(--mb-green-soft);
                }

                #mybears-smart-tools .mb-tool-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 26px rgba(36, 39, 35, .09);
                }

                #mybears-smart-tools .mb-tool-icon {
                    display: grid;
                    width: 58px;
                    height: 58px;
                    place-items: center;
                    margin: 0 auto 18px;
                    overflow: hidden;
                    border: 1px solid #dce8df;
                    border-radius: 16px;
                    color: #3c704d;
                    background: #ffffff;
                    box-shadow: 0 8px 20px rgba(36, 39, 35, .075);
                }

                #mybears-smart-tools .mb-tool-icon svg {
                    width: 34px;
                    height: 34px;
                    stroke: currentColor;
                }

                #mybears-smart-tools .mb-tool-card h3 {
                    margin: 0 0 9px;
                    color: var(--mb-ink);
                    font-size: 18px;
                    font-weight: 700;
                    line-height: 1.3;
                }

                #mybears-smart-tools .mb-tool-card p {
                    margin: 0 0 22px;
                    color: #5f625e;
                    font-size: 15px;
                    line-height: 1.55;
                    flex-grow: 1;
                }

                #mybears-smart-tools .mb-tools-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    align-self: center;
                    width: auto;
                    min-height: 40px;
                    padding: 10px 20px;
                    border: 0;
                    border-radius: 999px;
                    background: var(--mb-gold);
                    color: #111111 !important;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 1.15;
                    text-align: center;
                    text-decoration: none !important;
                    transition: background .2s ease, transform .2s ease;
                }

                #mybears-smart-tools .mb-tools-button:hover {
                    background: var(--mb-gold-dark);
                    color: #111111 !important;
                    transform: translateY(-1px);
                }

                #mybears-smart-tools .mb-tools-footer {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                    margin-top: 24px;
                    padding: 18px 20px;
                    border: 1px solid #e3eadf;
                    border-radius: 14px;
                    background: #f7fbf8;
                }

                #mybears-smart-tools .mb-tools-footer p {
                    margin: 0;
                    color: #454a45;
                    font-size: 15px;
                    line-height: 1.5;
                }

                #mybears-smart-tools .mb-tools-footer .mb-tools-button {
                    align-self: auto;
                    flex: 0 0 auto;
                    width: auto;
                    min-width: 0;
                    background: var(--mb-green);
                    color: #111111 !important;
                }

                #mybears-smart-tools .mb-tools-footer .mb-tools-button:hover {
                    background: var(--mb-green-dark);
                    color: #111111 !important;
                }

                @media (max-width: 900px) {
                    #mybears-smart-tools {
                        margin: 30px 15px 40px;
                        padding: 30px 24px;
                    }

                    #mybears-smart-tools .mb-tools-grid {
                        grid-template-columns: 1fr;
                    }

                    #mybears-smart-tools .mb-tool-card {
                        min-height: 0;
                    }
                }

                @media (max-width: 560px) {
                    #mybears-smart-tools {
                        margin: 20px 10px 32px;
                        padding: 24px 16px;
                        border-radius: 14px;
                    }

                    #mybears-smart-tools .mb-tools-head {
                        margin-bottom: 22px;
                    }

                    #mybears-smart-tools .mb-tools-head h2 {
                        font-size: 24px;
                    }

                    #mybears-smart-tools .mb-tools-head p {
                        font-size: 15px;
                    }

                    #mybears-smart-tools .mb-tool-card {
                        padding: 22px 18px 18px;
                    }

                    #mybears-smart-tools .mb-tools-footer {
                        flex-direction: column;
                        text-align: center;
                    }

                    #mybears-smart-tools .mb-tools-footer .mb-tools-button {
                        align-self: center;
                        width: auto;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const toolsHtml = `
            <section id="mybears-smart-tools" aria-labelledby="mybears-smart-tools-title">
                <div class="mb-tools-head">
                    <span class="mb-tools-eyebrow">MyBears nástroje</span>
                    <h2 id="mybears-smart-tools-title">Vyberte si rozumne</h2>
                    <p>
                        Porovnajte produkty, skontrolujte ich kombináciu alebo si zostavte vlastný balíček.
                        Naše nástroje vám pomôžu urobiť si vo výbere jasno.
                    </p>
                </div>

                <div class="mb-tools-grid">
                    <article class="mb-tool-card">
                        <div class="mb-tool-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M8 7h11"></path>
                                <path d="m16 4 3 3-3 3"></path>
                                <path d="M16 17H5"></path>
                                <path d="m8 14-3 3 3 3"></path>
                            </svg>
                        </div>
                        <h3>Porovnať produkty</h3>
                        <p>Porovnajte zloženie, množstvo účinných látok a ďalšie vlastnosti produktov prehľadne vedľa seba.</p>
                        <a href="/interaktivne-porovnanie-produktov"
                           class="mb-tools-button"
                           title="Porovnať produkty">
                            <span>Porovnať produkty →</span>
                        </a>
                    </article>

                    <article class="mb-tool-card">
                        <div class="mb-tool-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3 4.5 6v5.5c0 4.6 3.2 7.7 7.5 9.5 4.3-1.8 7.5-4.9 7.5-9.5V6L12 3Z"></path>
                                <path d="m8.5 12 2.2 2.2 4.8-5"></path>
                            </svg>
                        </div>
                        <h3>Skontrolovať kombináciu</h3>
                        <p>Zistite, ktoré vitamíny, minerály a ďalšie účinné látky sa vo vybraných produktoch prekrývajú.</p>
                        <a href="/kontrola-prekrytia-ucinnych-latok"
                           class="mb-tools-button"
                           title="Skontrolovať kombináciu">
                            <span>Skontrolovať kombináciu →</span>
                        </a>
                    </article>

                    <article class="mb-tool-card">
                        <div class="mb-tool-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m4 7 8-4 8 4-8 4-8-4Z"></path>
                                <path d="M4 7v10l8 4 8-4V7"></path>
                                <path d="M12 11v10"></path>
                            </svg>
                        </div>
                        <h3>Zostaviť vlastný balíček</h3>
                        <p>Vyberte si viac produktov MyBears na jednom mieste a vytvorte si vlastnú kombináciu podľa svojich potrieb.</p>
                        <a href="/konfigurator-vlastneho-balicka"
                           class="mb-tools-button"
                           title="Zostaviť vlastný balíček">
                            <span>Zostaviť vlastný balíček →</span>
                        </a>
                    </article>
                </div>

                <div class="mb-tools-footer">
                    <p><strong>Radšej hotové riešenie?</strong> Vyberte si už zostavenú kombináciu za zvýhodnenú cenu.</p>
                    <a href="/vyhodne-balenia-doplnkov-stravy"
                       class="mb-tools-button"
                       title="Prehliadnuť výhodné balenia">
                        <span>Výhodné balenia →</span>
                    </a>
                </div>
            </section>
        `;

        philosophySection.insertAdjacentHTML('afterend', toolsHtml);
    }

    function initHomepage() {
        if (!isSlovakHomepage()) return;

        arrangeHomepageSections();
        initMyBearsHomepageTools();

        const observer = new MutationObserver(function () {
            const layoutReady = arrangeHomepageSections();
            initMyBearsHomepageTools();

            if (layoutReady && document.getElementById('mybears-smart-tools')) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.setTimeout(function () {
            observer.disconnect();
        }, 20000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHomepage, { once: true });
    } else {
        initHomepage();
    }
})();
