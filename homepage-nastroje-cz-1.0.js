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
                    max-width: 1040px;
                    margin: 28px auto 42px;
                    padding: 34px;
                    background: #f7fbf8;
                    border: 1px solid #e2eee6;
                    border-radius: 20px;
                    font-family: inherit;
                    box-sizing: border-box;
                }

                #mybears-smart-tools * {
                    box-sizing: border-box;
                }

                #mybears-smart-tools .mb-tools-head {
                    max-width: 680px;
                    margin: 0 auto 28px;
                    text-align: center;
                }

                #mybears-smart-tools .mb-tools-head h2 {
                    margin: 0 0 9px;
                    color: #2dc26b;
                    font-size: 28px;
                    line-height: 1.2;
                    font-weight: 800;
                }

                #mybears-smart-tools .mb-tools-head p {
                    margin: 0;
                    color: #5f665f;
                    font-size: 15px;
                    line-height: 1.55;
                }

                #mybears-smart-tools .mb-tools-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 16px;
                }

                #mybears-smart-tools .mb-tool-card {
                    display: flex;
                    flex-direction: column;
                    min-height: 275px;
                    padding: 24px 22px 22px;
                    background: #ffffff;
                    border: 1px solid #e5ebe7;
                    border-radius: 16px;
                    box-shadow: 0 8px 24px rgba(35, 63, 44, 0.06);
                    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
                }

                #mybears-smart-tools .mb-tool-card:hover {
                    transform: translateY(-2px);
                    border-color: #d6e6da;
                    box-shadow: 0 12px 30px rgba(35, 63, 44, 0.10);
                }

                #mybears-smart-tools .mb-tool-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 46px;
                    height: 46px;
                    margin: 0 0 18px;
                    color: #2dc26b;
                    background: #eef9f2;
                    border-radius: 50%;
                }

                #mybears-smart-tools .mb-tool-icon svg {
                    width: 22px;
                    height: 22px;
                    stroke: currentColor;
                }

                #mybears-smart-tools .mb-tool-card h3 {
                    margin: 0 0 10px;
                    color: #151515;
                    font-size: 18px;
                    line-height: 1.3;
                    font-weight: 800;
                }

                #mybears-smart-tools .mb-tool-card p {
                    margin: 0 0 20px;
                    color: #666d68;
                    font-size: 14px;
                    line-height: 1.55;
                    flex-grow: 1;
                }

                #mybears-smart-tools .mb-tool-card .btn {
                    width: 100%;
                    min-height: 42px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    border-radius: 999px;
                    white-space: normal;
                }

                #mybears-smart-tools .mb-tools-footer {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 14px;
                    margin-top: 24px;
                    padding-top: 22px;
                    border-top: 1px solid #dfe9e2;
                }

                #mybears-smart-tools .mb-tools-footer p {
                    margin: 0;
                    color: #424842;
                    font-size: 14px;
                    line-height: 1.45;
                }

                #mybears-smart-tools .mb-tools-footer .btn {
                    flex: 0 0 auto;
                    border-radius: 999px;
                }

                @media (max-width: 900px) {
                    #mybears-smart-tools {
                        margin: 24px 15px 36px;
                        padding: 28px 22px;
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
                        border-radius: 16px;
                    }

                    #mybears-smart-tools .mb-tools-head {
                        margin-bottom: 22px;
                    }

                    #mybears-smart-tools .mb-tools-head h2 {
                        font-size: 24px;
                    }

                    #mybears-smart-tools .mb-tool-card {
                        padding: 21px 18px 18px;
                    }

                    #mybears-smart-tools .mb-tools-footer {
                        flex-direction: column;
                        text-align: center;
                        gap: 12px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        const toolsHtml = `
            <section id="mybears-smart-tools" aria-labelledby="mybears-smart-tools-title">
                <div class="mb-tools-head">
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
