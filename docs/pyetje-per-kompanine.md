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
- ✅ ElevenLabs → agjenti → Security: override vetëm për **First message**, **Enable authentication** aktiv (17.11.2026).
- Testohet në Javën 3: thirrje te një numër që nuk përgjigjet → a vjen **call_initiation_failure** te n8n.
- Te "Përgatit thirrjen": vendos `PHONE_NUMBER_ID` pasi të lidhet numri nga Callgear.

Pret të tjerët: SIP nga Callgear, kutia e pëlqimit në Meta, DNCR, konfirmimi i Dion-it për zërin, plani i ElevenLabs.

- **17.11.2026:** Kompania **nuk ka llogari në Callgear** (fushat te Pixxi ishin bosh/autofill). Numri për thirrjet mbetet i hapur:
  duhet ditur cili numër është i regjistruar me lejen e telemarketingut dhe te cili operator (du / e&).
  Për testet e brendshme mund të përdoret Twilio (lidhje direkte me ElevenLabs); për lead-et e vërteta duhet numri i kompanisë.

- **17.11.2026, vendim për linjën e telefonit (plan afatgjatë):**
  1. **Tani: Twilio.** Lidhje zyrtare me ElevenLabs, gati brenda ditës. Përdoret për testet e brendshme dhe për lead-et jashtë UAE
     (sot pothuajse të gjitha nga Kosova).
  2. **Më vonë: numri i kompanisë te du / e& (SIP trunk)** për lead-et me numër të UAE, sepse rregullat e UAE kërkojnë
     numër të regjistruar në emër të kompanisë me lejen e telemarketingut. n8n e zgjedh linjën sipas vendit të numrit.

## Ndryshim i qëllimit (17.11.2026)

- Vetëm lead-et nga **Meta**.
- Vetëm vendet: **Kosovë** (agjenti shqip), **Francë** dhe **Gjermani** (agjenti anglisht). UAE nuk përfshihet tani,
  prandaj DNCR dhe numri i UAE nuk na duhen për fazën e parë.
- AI merret kryesisht me lead-et ekzistuese në fazat **Follow Up**, **No Answer** dhe **3- Future Prospect**.
- Për t'u konfirmuar: a vazhdon AI edhe me lead-et e reja; sa ditë pa aktivitet nga agjenti; sa thirrje në ditë.
- Për t'u kontrolluar ligjërisht: Franca (orari i thirrjeve dhe pëlqimi), Gjermania (pëlqimi i shprehur për thirrje
  dhe pëlqimi për regjistrimin e thirrjes), EU AI Act (njoftimi që është AI).

- **17.11.2026:** Me kërkesë të kompanisë, agjenti **nuk thotë më vetë në fillim që është AI** ("I'm calling from END Properties").
  Mbetet rregulli: **nuk pretendon kurrë të jetë njeri** dhe, kur pyetet, thotë të vërtetën ("I am a virtual assistant").
  ⚠️ Rrezik ligjor: për Francën dhe Gjermaninë (BE), neni 50 i AI Act (në fuqi nga gushti 2026) kërkon njoftim që personi
  flet me AI. Rekomandimi ynë: kompania ta konfirmojë me avokat; ndryshimi kthehet lehtë te `n8n/code/prepare-call.js`.
- **17.11.2026:** Kompania do të marrë një **numër nga IPKO** (Kosovë) për thirrjet. Duhet kërkuar si **numër biznesi me SIP trunk**
  (jo kartë SIM), me: adresë serveri SIP, username, password, transport (UDP/TCP/TLS), dhe tarifat drejt celularëve në
  Kosovë, Francë dhe Gjermani. Thirrjet hyrëse: mesazh i shkurtër ose bllokim.

## Sqarim nga Dion (mesazh zanor, 17.11.2026)

1. **Agjenti për lead-et në Evropë**: vetëm thirrje e shkurtër për rikonfirmim interesi, pa bisedë të sofistikuar
   dhe pa broshura → prompt v3.
2. **Agjent i dytë, i ri: thirrje te pronarët (cold call)**, p.sh. të gjithë pronarët në "Marigona Residences" (Prishtinë),
   për të pyetur nëse prona e tyre është në dispozicion për shitje ose qira. Skenari vjen nga Dion.
   Për t'u diskutuar: nga vjen lista e pronarëve (Pixxi Owners API ka listë dhe log aktiviteti), pëlqimi/ligji për
   thirrje te pronarët në Kosovë, dhe prezantimi: agjenti **nuk** mund të thotë "This is Dion" (do të pretendonte se
   është njeri real); propozim: "I'm calling on behalf of Dion from E N D Properties".

## Statusi (18.11.2026)

- Agjenti 1 (lead-et e Evropës) v3 me **Claude Haiku 4.5**: testet kalojnë, Evaluation 100%. 5 kritere vlerësimi aktive.
- Ora e callback ruhet sipas vendit të klientit.
- Raporti javor: degë "Çdo të hënë" në Lead intake (test vetëm për Marketing).
- ⚠️ **Pixxi Create Reminder API ka defekt** (500: "Field 'title' doesn't have a default value"). Raportuar te Pixxi support
  më 18.11.2026. Deri në rregullim: raporti dhe detyrat për agjentët në Pixxi janë të ndalura; faza dhe shënimi nuk preken.
- Numri: email te Vala/Telekomi (business@kosovotelecom.com) për SIP trunk; pritet përgjigjja.
- Agjenti 2 (pronarët, cold call): pret skenarin nga Dion.

## Oferta e Valës / Telekomit të Kosovës për SIP (18.11.2026)

- Numri celular ekzistues **nuk** mund të bëhet SIP. Ofrojnë **numër të ri biznesi** (+383 38 …) me SIP trunk.
- Konfigurimi "Dynamic PBX": host `dpbx.ims.telekomi.net`, username/password, kodekë G.711 (ulaw/alaw), DTMF inband.
- 2–30 kanale njëkohësisht sipas paketës (LTK10, LTK30), kontratë minimum 1 vit, mirëmbajtje 3.43 €/muaj.
- Tarifat pa TVSH (peak 08–22 / off-peak 22–08): celularë në Kosovë 0.09 €/min; Gjermania = Zona 1 (celular 0.328 / 0.224 €/min);
  Franca sipas listës së zonave (për t'u konfirmuar).
- Për t'u konfirmuar me Valën: a funksionon nga interneti (ElevenLabs është cloud, pa IP fikse), transporti/porti,
  a kërkohet REGISTER për thirrje dalëse, Caller ID për thirrjet jashtë vendit, bllokimi i thirrjeve hyrëse, çmimi i LTK10/LTK30.
