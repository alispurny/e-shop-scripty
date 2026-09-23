# MyBears — srozumitelné vlastní události pro GA4 (CZ a SK)

## Společné pravidlo GTM: Custom Event / Použít shodu podle regulárního výrazu

```text
^(konfigurator_|porovnavac_|prekryvy_|pruvodce_|poradna_|kalkulacka_)
```

Společná značka GA4 CZ: measurement ID `G-RLVCR7CN84`, název události `{{Event}}`.
Společná značka GA4 SK: measurement ID `G-W652R44EMM`, název události `{{Event}}` (pouze při prokazatelně správném směrování SK webu; nepouštět CZ značku na SK).

**Consent:** u každé značky GTM vyžadovat další souhlas `analytics_storage`. Samotný `dataLayer.push` neodesílá nic do GA4. Nejprve ověřit Preview při granted/denied; až poté publikovat a sloučit PR. Nepřidávat `add_to_cart` ani `purchase` — zajišťuje Upgates.

## Konfigurátor

| Událost GA4 | Význam |
|---|---|
| `konfigurator_otevreni` | Widget se načetl |
| `konfigurator_zahajeni` | První výběr produktu či kombinace |
| `konfigurator_pridani_produktu` | Výběr produktu |
| `konfigurator_odebrani_produktu` | Odebrání produktu |
| `konfigurator_minimum_produktu` | Dosažení minima nebo výběr předpřipravené kombinace (může se opakovat) |
| `konfigurator_vyber_kombinace` | Výběr předpřipravené kombinace |
| `konfigurator_vlozeni_pokus` | Kliknutí na vložení balíčku |
| `konfigurator_predani_do_kosiku` | Stávající událost před posledním přesměrováním; **není potvrzení dokončeného přidání** |

## Porovnávač
`porovnavac_otevreni`, `porovnavac_zahajeni`, `porovnavac_pridani_produktu`, `porovnavac_odebrani_produktu`, `porovnavac_vyber_kombinace`, `porovnavac_dokonceni`, `porovnavac_klik_vlozit_do_kosiku`, `porovnavac_klik_na_produkt`.

## Kontrola překryvů
`prekryvy_otevreni`, `prekryvy_zahajeni`, `prekryvy_zmena_vyberu`, `prekryvy_vyber_kombinace`, `prekryvy_zmena_davky`. Zaznamenává se jen ID produktu; nikoli zvolená dávka, kombinace látek nebo výsledek kontroly.

## Průvodce výběrem
`pruvodce_zahajeni`, `pruvodce_dokonceni`, `pruvodce_klik_na_produkt`, `pruvodce_klik_vlozit_do_kosiku`. Průvodce nedává GA4 odpovědi zákazníka; `pruvodce_klik_vlozit_do_kosiku` měří kliknutí, nikoli potvrzený stav košíku.

## Poradna / Advisor
`poradna_otevreni`, `poradna_hledani`, `poradna_vyber_tematu`, `poradna_otevreni_serie`, `poradna_klik_na_clanek`, `poradna_nacteni_clanku`. Vyhledávaný text není v dataLayer payloadu.

## Kalkulačky a převodníky
`kalkulacka_otevreni`, `kalkulacka_odeslani_pokus` s parametry `tool_id` a `tool_name`. Parametr `tool_name` je skutečně srozumitelný název nástroje, zvolený podle mount selectoru, např. „BMI kalkulačka“ nebo „Kalkulačka glykemické nálože“. `kalkulacka_odeslani_pokus` není potvrzený výpočet. Do dataLayer se neodesílají hodnoty formulářů, zdravotní informace ani výsledek.

## Doporučené parametry GTM
Pro první verzi není nutné posílat vlastní parametry. Poté lze vytvořit datové proměnné `tool_name`, `tool_id`, `product_id`, `selected_count`, `preset`, `preset_id`, `article_count` a předat jen relevantní parametry jako parametry událostí do GA4. Parametr `tool_name` lze registrovat jako vlastní dimenzi v GA4; historická data se nezpětně nedoplňují.

## Poznámky k nasazení
- Názvy událostí v CZ i SK jsou záměrně stejné v českém ASCII názvosloví; `tool_name` je lokalizovaný CZ/SK.
- Odstranit nebo pozastavit testovací značku `GA4 CZ – MyBears – Konfigurátor načten`, než se aktivuje společná značka, jinak by původní událost mohla být zdvojená.
- Původní pravidlo `^(mbbb_|mb_compare_|mb_overlap_|mbpg_|mbia_|mb_tool_)` již nová jména nezachytí. Je třeba ho přepsat.
- Při zamítnutí `analytics_storage` musí vlastní značky zůstat neaktivní; testovat při shodné události v náhledu.
- PR a GTM pracovní prostor nejsou publikované: merge do main a GTM Send provádět až po ověření funkčnosti; jsDelivr může změny cachovat.
