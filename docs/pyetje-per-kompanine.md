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

## Vendime të marra

- **16.11.2026 (Dion):** AI thërret **vetëm lead-et nga reklamat** (Meta, X, etj.), **jo lead-et nga portalet**
  (Bayut, Property Finder, Dubizzle). n8n filtron sipas fushës "Source of Lead" në Pixxi.
- Kontakti me Pixxi support: grupi në WhatsApp ku Dion na shtoi.

## Ku mbetëm (16.11.2026, mbrëmje)

Gati: agjenti zanor; workflow "Post-call result" (lexon rezultatin, llogarit statusin, ruan në tabelë, publikuar);
tabela `call_agent_leads`; credential `Call Agent · Pixxi`; kodi `n8n/code/plan-calls.js`.

Nesër: workflow "END Call Agent - Lead intake" (Çdo 2 minuta → Merr lead-et nga Pixxi → Lexo tabelën →
Planifiko thirrjet → shto lead-et e reja / shëno thirrjen), pastaj shkrimi në Pixxi (fazë + shënim)
dhe njoftimi në WhatsApp.

Pret të tjerët: SIP nga Callgear (numri +971), kutia e pëlqimit në formularin e Meta-s, procesi i DNCR për numrat e UAE.
- **17.11.2026:** Njoftimi i agjentit bëhet **brenda Pixxi-t** (faza + shënim + detyrë/Reminder për agjentin),
  jo me WhatsApp. Nuk preket v18 dhe nuk duhet template i ri. WhatsApp mund të shtohet më vonë nëse agjentët i humbin lead-et.

## Ku mbetëm (17.11.2026)

Gati në n8n:
- **Post-call result** (publikuar): lexon rezultatin dhe thirrjet që s'lidhen, llogarit statusin, ruan në tabelë.
  Nyjet e Pixxi-t (lexo lead-in, shënim, fazë, detyrë për agjentin) janë gati por **të çaktivizuara** deri në Javën 3.
- **Lead intake** (i ruajtur, jo i publikuar): merr lead-et nga reklamat, i shton në tabelë, vendos kë të thërrasë.
  Nisja e thirrjes (Shëno thirrjen → Përgatit thirrjen → Nis thirrjen → Ruaj ID-në) është gati por **e çaktivizuar**.
- Credentials: `Call Agent · Pixxi`, `Call Agent · ElevenLabs`.

Për t'u kontrolluar para testit të parë:
- ElevenLabs → agjenti → Security: lejo override për **First message** (n8n dërgon fjalinë e parë shqip/anglisht).
- ElevenLabs → webhook: që të dërgohen edhe ngjarjet **call_initiation_failure**.
- Te "Përgatit thirrjen": vendos `PHONE_NUMBER_ID` pasi të lidhet numri nga Callgear.

Pret të tjerët: SIP nga Callgear, kutia e pëlqimit në Meta, DNCR, konfirmimi i Dion-it për zërin, plani i ElevenLabs.
