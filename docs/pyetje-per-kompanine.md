# Pyetje të hapura për kompaninë

Përditësuar më 16.11.2026. Pa këto nuk mund ta përfundojmë Javën 2.

## Çfarë zbuluam vetë

- Brightcall te Pixxi është bosh. Callgear ka vetëm username/password (ndoshta nga autofill i shfletuesit), pa token.
- Pixxi i dërgon lead-et me webhook te workflow-i WhatsApp v18 (`end-pixxi-...`).
- v18 dërgon WhatsApp përmes Meta Cloud API me credential-in "WhatsApp Real Token".
- v18 nuk përdor API të Pixxi-t për të shkruar në Pixxi. Dokumentacion publik i Pixxi API nuk u gjet.

## Pyetjet

1. **Numri**: cili numër u regjistrua me lejen e telemarketingut, dhe te cili operator? A ka kompania llogari Callgear me numër UAE?
2. **Webhook-u i Pixxi-t**: kush e vendosi webhook-un që i dërgon lead-et te n8n? A mund të shtohet një adresë e dytë për agjentin e thirrjeve?
3. **Pixxi API**: a mund të përditësojmë një lead (tag/status, shënim)? Kush e jep çelësin dhe dokumentacionin? (Nëse s'dihet → Pixxi support.)
4. **WhatsApp**: klienti merr sot mesazh nga v18. Thirrja vjen bashkë me mesazhin apo në vend të tij? A mund ta përdorim "WhatsApp Real Token" për t'i njoftuar agjentët, dhe a ka template të miratuar për njoftimin e agjentit?
5. **Error alert**: a mund ta zgjedhim "END automation - error alert" si Error Workflow për workflow-in tonë (vetëm referencë)?
6. **Çelësat e portaleve** u shfaqën në një screenshot më 16.11.2026: a duhen ndërruar?
