# MyBears custom-tool analytics — implementation draft (CZ + SK)

This change instruments own MyBears UI only. It does **not** create GA4 ecommerce add_to_cart or purchase events, change Upgates checkout, or introduce any Google Ads conversion.

## Data flow and consent
- Each tool pushes anonymous `event` + `component` and a small event-specific payload to `window.dataLayer`. There is no GA4 network sender in these scripts.
- **Do not publish GTM GA4 event tags without analytics_storage consent checks.** Preview both granted and denied consent. A dataLayer event is not equivalent to permission to send it to GA4.
- Loader defaults to `analytics:true`; preexisting explicit `window.*_CONFIG.analytics=false` remains honored by the merge.
- The interactive Advisor strips free-text search queries before pushing to dataLayer. Calculator measurements do not include form fields, medical answers, measurements, calculations, or results.
- The existing Product Guide can pass product/result identifiers, but must not be extended with health answers or free-text responses. Only create approved GTM tags for the events required.
- CZ and SK GTM tags must route to their distinct GA4 measurement IDs; verify tag configuration before publishing.

## GTM Custom Event trigger inventory
| Event | Source | Payload | Meaning |
|---|---|---|---|
| mb_tool_view | CZ/SK loader, 13 calculators/converters per storefront | component, tool_id | Calculator mount point found |
| mb_tool_submit | CZ/SK loader | component, tool_id | Form submit attempted (not guaranteed valid calculation) |
| mbbb_loaded | CZ/SK bundle builder | component | Builder mounted |
| mbbb_start | Builder | component | First product selection/preset |
| mbbb_product_select | Builder | product_id, selected_count | Product selected |
| mbbb_product_remove | Builder | product_id, selected_count | Product removed |
| mbbb_minimum_reached | Builder | selected_count | Minimum selected-count reached/preset loaded; can recur |
| mbbb_preset_select | Builder | preset, selected_count | Preset chosen |
| mbbb_add_all_click | Builder | selected_count | Customer attempted to add entire bundle |
| mbbb_add_all | Builder (existing) | items | Existing event, occurs before final redirect-based add is confirmed |
| mb_compare_view | CZ/SK comparator | component | Comparator mounted |
| mb_compare_start | Comparator | component | First selection/preset |
| mb_compare_product_select / mb_compare_product_remove | Comparator | product_id, selected_count | Selection changed |
| mb_compare_preset | Comparator | preset_id, selected_count | Preset chosen |
| mb_compare_complete | Comparator | selected_count | Compare results displayed |
| mb_compare_add_to_cart | Comparator | product_id | Add-to-cart link clicked, NOT confirmed Upgates add_to_cart |
| mb_compare_product_click | Comparator | product_id | Product detail link clicked |
| mb_overlap_view | CZ/SK overlap checker | component | Checker mounted |
| mb_overlap_start | Checker | component | First product choice/preset |
| mb_overlap_product_toggle | Checker | product_id, selected_count | Selection changed |
| mb_overlap_preset | Checker | preset_id, selected_count | Preset chosen |
| mb_overlap_dose_change | Checker | product_id | Dose selection changed; dose value not collected |
| mbpg_start / mbpg_complete / mbpg_product_click / mbpg_add_to_cart | Product Guide (existing) | product/result IDs where already emitted | Own guide interactions; mbpg_add_to_cart is click, not verified commerce |
| mbia_search_submit / mbia_topic_select / mbia_series_open / mbia_article_click / mbia_hub_loaded / mbia_article_enhanced | Advisor (existing) | component; article_count only on hub_loaded | Content interactions, **no search query** |

## Implementation limitations
- Current bundle `mbbb_add_all` is not a guarantee all products have reached the Upgates cart: redirect adds final product asynchronously via navigation. Label it intent in reports.
- Loader records form submit attempts for calculators/converters, not successful computation. To measure successful result, instrument each calculator's own validation/result callback in a separate change.
- Product Guide core and homepage shell were not modified: existing Product Guide events are activated via CZ/SK loader `MBPG_CONFIG.analytics=true`.
- The alternate standalone guide files are not loaded by the examined conditional loaders, and are unchanged.
- No GTM or GA4 configuration is changed by this PR. Test source deployment, consent, event counts, product IDs, and browser behavior separately before merge/publish.
