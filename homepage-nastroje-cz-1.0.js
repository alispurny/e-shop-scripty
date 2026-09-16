(function () {
    'use strict';

    function initMyBearsHomepageTools() {
        // Pouze česká homepage
        if (
            window.location.pathname !== '/' ||
            !window.location.hostname.endsWith('mybears.cz')
        ) {
            return;
        }

        // Ochrana proti dvojímu vložení
        if (document.getElementById('mybears-smart-tools')) {
            return;
        }

        // Najdeme automatický H1 homepage
        const targetHeading = Array.from(document.querySelectorAll('h1')).find(function (heading) {
            return heading.textContent.trim() === 'Doplňky, které chceme sami užívat';
        });

        if (!targetHeading) {
            console.warn('MyBears: H1 pro vložení bloku nástrojů nebyl nalezen.');
            return;
        }

        // Styly vložíme jen jednou
        if (!document.getElementById('mybears-smart-tools-styles')) {
            const style = document.createElement('style');
            style.id = 'mybears-smart-tools-styles';
            style.textContent = `
                #mybears-smart-tools {
                    --mb-tools-green: #2dc26b;
                    --mb-tools-green-dark: #198d4b;
                    --mb-tools-ink: #20221f;
                    --mb-tools-muted: #626760;
                    --mb-tools-cream: #faf7ef;
                    --mb-tools-line: #e5e3dc;
                    --mb-tools-gold: #DBC442;
                    --mb-tools-white: #ffffff;

                    width: 100%;
                    max-width: 1120px;
                    margin: clamp(30px, 5vw, 58px) auto;
                    color: var(--mb-tools-ink);
                    font: inherit;
                    font-family: Arial, Helvetica, sans-serif;
                    line-height: 1.55;
                    box-sizing: border-box;
                }

                #mybears-smart-tools * {
                    box-sizing: border-box;
                    font-family: inherit;
                }

                #mybears-smart-tools .mb-tools-shell {
                    overflow: hidden;
                    border: 1px solid var(--mb-tools-line);
                    border-radius: 18px;
                    background: var(--mb-tools-white);
                    box-shadow: 0 12px 32px rgba(27, 35, 29, .07);
                }

                #mybears-smart-tools .mb-tools-topline {
                    height: 4px;
                    background: var(--mb-tools-gold);
                }

                #mybears-smart-tools .mb-tools-body {
                    padding: 34px 38px 36px;
                }

                #mybears-smart-tools .mb-tools-head {
                    max-width: 790px;
                    margin: 0 0 26px;
                }

                #mybears-smart-tools .mb-tools-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    margin: 0 0 9px;
                    color: var(--mb-tools-green-dark);
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
                    background: var(--mb-tools-gold);
                }

                #mybears-smart-tools .mb-tools-head h2 {
                    margin: 0 0 10px;
                    color: var(--mb-tools-green);
                    font-size: clamp(25px, 3.2vw, 30px);
                    font-weight: 700;
                    line-height: 1.16;
                }

                #mybears-smart-tools .mb-tools-head p {
                    max-width: 790px;
                    margin: 0;
                    color: #454a45;
                    font-size: 16px;
                    line-height: 1.58;
                }

                #mybears-smart-tools .mb-tools-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 16px;
                    margin-top: 24px;
                }

                #mybears-smart-tools .mb-tool-card {
                    display: flex;
                    flex-direction: column;
                    min-height: 270px;
                    padding: 22px 20px 20px;
                    border: 1px solid #e8e2d7;
                    border-radius: 14px;
                    background: var(--mb-tools-cream);
                }

                #mybears-smart-tools .mb-tool-card:nth-child(even) {
                    background: var(--mb-tools-white);
                }

                #mybears-smart-tools .mb-tool-icon {
                    display: grid;
                    width: 58px;
                    height: 58px;
                    place-items: center;
                    margin: 0 0 18px;
                    overflow: hidden;
                    border: 1px solid #dce8df;
                    border-radius: 16px;
                    color: #3c704d;
                    background: linear-gradient(145deg, #f4f7f4, #edf2ee);
                    box-shadow: 0 8px 20px rgba(36, 39, 35, .075);
                }

                #mybears-smart-tools .mb-tool-icon svg {
                    width: 32px;
                    height: 32px;
                    stroke: currentColor;
                }

                #mybears-smart-tools .mb-tool-card h3 {
                    margin: 0 0 8px;
                    color: var(--mb-tools-ink);
                    font-size: 15px;
                    font-weight: 700;
                    line-height: 1.35;
                }

                #mybears-smart-tools .mb-tool-card p {
                    margin: 0 0 20px;
                    color: #5f625e;
                    font-size: 14px;
                    line-height: 1.55;
                    flex-grow: 1;
                }

                #mybears-smart-tools .mb-tool-card .btn {
                    width: 100%;
                    min-height: 48px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px 18px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 1.15;
                    text-align: center;
                    text-decoration: none !important;
                    white-space: normal;
                }

                #mybears-smart-tools .mb-tools-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 18px;
                    margin-top: 24px;
                    padding: 18px 20px;
                    border: 1px solid #e8e2d7;
                    border-radius: 14px;
                    background: var(--mb-tools-cream);
                }

                #mybears-smart-tools .mb-tools-footer p {
                    margin: 0;
                    color: #5f5a4e;
                    font-size: 14px;
                    line-height: 1.45;
                }

                #mybears-smart-tools .mb-tools-footer p strong {
                    color: #292b28;
                    font-size: 14px;
                }

                #mybears-smart-tools .mb-tools-footer .btn {
                    flex: 0 0 auto;
                    min-height: 48px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    line-height: 1.15;
                    text-align: center;
                    text-decoration: none !important;
                    white-space: nowrap;
                }

                @media (max-width: 900px) {
                    #mybears-smart-tools {
                        padding: 0 15px;
                    }

                    #mybears-smart-tools .mb-tools-grid {
                        grid-template-columns: 1fr;
                    }

                    #mybears-smart-tools .mb-tool-card {
                        min-height: 0;
                    }
                }

                @media (max-width: 760px) {
                    #mybears-smart-tools .mb-tools-body {
                        padding: 26px 20px;
                    }

                    #mybears-smart-tools .mb-tools-footer {
                        align-items: stretch;
                        flex-direction: column;
                    }

                    #mybears-smart-tools .mb-tools-footer .btn {
                        width: 100%;
                    }
                }

                @media (max-width: 560px) {
                    #mybears-smart-tools {
                        margin: 16px 0 28px;
                        padding: 0 10px;
                    }

                    #mybears-smart-tools .mb-tools-shell {
                        border-radius: 14px;
                    }

                    #mybears-smart-tools .mb-tools-body {
                        padding: 24px 14px 26px;
                    }

                    #mybears-smart-tools .mb-tools-head h2 {
                        font-size: 24px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const toolsHtml = `
            <section id="mybears-smart-tools" aria-labelledby="mybears-smart-tools-title">
                <div class="mb-tools-shell">
                    <div class="mb-tools-topline"></div>

                    <div class="mb-tools-body">
                        <div class="mb-tools-head">
                            <span class="mb-tools-eyebrow">MyBears nástroje</span>
                            <h2 id="mybears-smart-tools-title">Vyberte si chytře</h2>
                            <p>
                                Porovnejte produkty, zkontrolujte jejich kombinaci nebo si sestavte vlastní balíček.
                                Naše nástroje vám pomohou udělat si ve výběru jasno.
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
                                <h3>Porovnat produkty</h3>
                                <p>
                                    Srovnejte složení, množství účinných látek a další vlastnosti produktů přehledně vedle sebe.
                                </p>
                                <a href="/interaktivni-porovnani-produktu"
                                   class="btn bg-se c-wh fw-b"
                                   title="Porovnat produkty"
                                   role="button">
                                    <span>Porovnat produkty →</span>
                                </a>
                            </article>

                            <article class="mb-tool-card">
                                <div class="mb-tool-icon" aria-hidden="true">
                                    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M12 3 4.5 6v5.5c0 4.6 3.2 7.7 7.5 9.5 4.3-1.8 7.5-4.9 7.5-9.5V6L12 3Z"></path>
                                        <path d="m8.5 12 2.2 2.2 4.8-5"></path>
                                    </svg>
                                </div>
                                <h3>Zkontrolovat kombinaci</h3>
                                <p>
                                    Zjistěte, které vitamíny, minerály a další účinné látky se ve vybraných produktech překrývají.
                                </p>
                                <a href="/kontrola-prekryvu-ucinnych-latek"
                                   class="btn bg-se c-wh fw-b"
                                   title="Zkontrolovat kombinaci"
                                   role="button">
                                    <span>Zkontrolovat kombinaci →</span>
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
                                <h3>Sestavit vlastní balíček</h3>
                                <p>
                                    Vyberte si více produktů MyBears na jednom místě a vytvořte si vlastní kombinaci podle svých potřeb.
                                </p>
                                <a href="/konfigurator-vlastniho-balicku"
                                   class="btn bg-se c-wh fw-b"
                                   title="Sestavit vlastní balíček"
                                   role="button">
                                    <span>Sestavit vlastní balíček →</span>
                                </a>
                            </article>
                        </div>

                        <div class="mb-tools-footer">
                            <p><strong>Raději hotové řešení?</strong> Vyberte si již sestavenou kombinaci za zvýhodněnou cenu.</p>
                            <a href="/vyhodna-baleni-doplnku-stravy"
                               class="btn bg-se c-wh fw-b"
                               title="Prohlédnout výhodná balení"
                               role="button">
                                <span>Výhodná balení →</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Vložíme celý blok bezprostředně PŘED automatický H1
        targetHeading.insertAdjacentHTML('beforebegin', toolsHtml);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMyBearsHomepageTools);
    } else {
        initMyBearsHomepageTools();
    }
})();
