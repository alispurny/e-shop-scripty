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

        const toolsHtml = `
            <section id="mybears-smart-tools"
                     style="max-width: 1200px; margin: 50px auto; padding: 0 15px; font-family: Arial, Helvetica, sans-serif;">

                <div style="text-align: center; margin-bottom: 28px;">
                    <h2 style="margin: 0 0 10px; font-size: 26px; line-height: 1.25;">
                        Vyberte si chytře
                    </h2>

                    <p style="margin: 0 auto; max-width: 720px; font-size: 12pt; line-height: 1.5; color: #666666;">
                        Máte už některé produkty vybrané? Porovnejte je, zkontrolujte jejich kombinaci
                        nebo si sestavte vlastní balíček.
                    </p>
                </div>

                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 18px;
                    align-items: stretch;
                ">

                    <div style="
                        padding: 24px;
                        border: 1px solid #e5e5e5;
                        border-radius: 12px;
                        background: #ffffff;
                        display: flex;
                        flex-direction: column;
                    ">
                        <h3 style="margin: 0 0 10px; font-size: 17px; line-height: 1.3;">
                            Porovnat produkty
                        </h3>

                        <p style="margin: 0 0 20px; line-height: 1.5; color: #666666; flex-grow: 1;">
                            Porovnejte vybrané produkty vedle sebe a podívejte se na jejich složení,
                            množství účinných látek a další vlastnosti.
                        </p>

                        <div>
                            <a href="/interaktivni-porovnani-produktu"
                               class="btn bg-se c-wh fw-b"
                               title="Porovnat produkty"
                               role="button">
                                <span>Porovnat produkty →</span>
                            </a>
                        </div>
                    </div>

                    <div style="
                        padding: 24px;
                        border: 1px solid #e5e5e5;
                        border-radius: 12px;
                        background: #ffffff;
                        display: flex;
                        flex-direction: column;
                    ">
                        <h3 style="margin: 0 0 10px; font-size: 17px; line-height: 1.3;">
                            Zkontrolovat kombinaci
                        </h3>

                        <p style="margin: 0 0 20px; line-height: 1.5; color: #666666; flex-grow: 1;">
                            Vyberte produkty, které chcete užívat společně, a zkontrolujte,
                            které vitamíny, minerály a další účinné látky se v nich překrývají.
                        </p>

                        <div>
                            <a href="/kontrola-prekryvu-ucinnych-latek"
                               class="btn bg-se c-wh fw-b"
                               title="Zkontrolovat kombinaci"
                               role="button">
                                <span>Zkontrolovat kombinaci →</span>
                            </a>
                        </div>
                    </div>

                    <div style="
                        padding: 24px;
                        border: 1px solid #e5e5e5;
                        border-radius: 12px;
                        background: #ffffff;
                        display: flex;
                        flex-direction: column;
                    ">
                        <h3 style="margin: 0 0 10px; font-size: 17px; line-height: 1.3;">
                            Sestavit vlastní balíček
                        </h3>

                        <p style="margin: 0 0 20px; line-height: 1.5; color: #666666; flex-grow: 1;">
                            Vyberte si více produktů MyBears na jednom místě a vytvořte si
                            vlastní kombinaci podle svých potřeb.
                        </p>

                        <div>
                            <a href="/konfigurator-vlastniho-balicku"
                               class="btn bg-se c-wh fw-b"
                               title="Sestavit vlastní balíček"
                               role="button">
                                <span>Sestavit vlastní balíček →</span>
                            </a>
                        </div>
                    </div>

                </div>

                <div style="
                    margin-top: 22px;
                    padding: 20px 22px;
                    background: #f7f7f7;
                    border-radius: 12px;
                    text-align: center;
                ">
                    <p style="margin: 0 0 12px; font-size: 12pt; line-height: 1.5;">
                        <strong>Nechcete produkty vybírat sami?</strong>
                        Prohlédněte si naše již sestavené kombinace produktů se zvýhodněnou cenou.
                    </p>

                    <a href="/vyhodna-baleni-doplnku-stravy"
                       class="btn bg-se c-wh fw-b"
                       title="Prohlédnout výhodná balení"
                       role="button">
                        <span>Prohlédnout výhodná balení →</span>
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
