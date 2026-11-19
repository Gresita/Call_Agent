# Lista për ditën e nisjes (Java 3)

Ndiqe me radhë. Mos kalo në hapin tjetër pa e përfunduar të mëparshmin.

## A. Para se të fillojmë

- [ ] Vala ka konfirmuar: thirrje dalëse me username/password pa REGISTER, nga çdo IP, transporti/porti, Caller ID jashtë vendit.
- [ ] Kemi të dhënat e SIP: numri +383 38…, serveri, username, password (password vetëm në ElevenLabs, jo në chat).
- [ ] Konfirmim me shkrim nga **Dion** dhe **Genta** për zërat.
- [ ] Plani i ElevenLabs mjafton për volumin (kontrollo kreditet).
- [x] Pixxi e ka rregulluar Create Reminder API (19.11.2026).

## B. Lidhja e numrit (ElevenLabs)

- [ ] ElevenLabs → **Phone Numbers** → **Import number** → **SIP trunk**.
- [ ] Label: `Vala +383 38…`, numri në formatin +38338…
- [ ] Outbound: adresa e serverit, transporti, username/password nga Vala.
- [ ] Mos e lidh numrin me agjentin për thirrje **hyrëse** (ose cakto mesazhin e shkurtër).
- [ ] Kopjo **Phone number ID**.

## C. n8n

- [ ] Lead intake → **Përgatit thirrjen**: vendos `PHONE_NUMBER_ID`.
- [ ] Krijo **lead testi** në Pixxi me numrin tënd (BUY). Kujdes: v18 mund t'i dërgojë mesazh WhatsApp atij numri; njofto Dion-in që lead-i TEST është yti.

## D. Thirrja e parë testuese (vetëm te numri yt)

- [ ] ⚠️ **Para çdo testi:** në tabelë ndrysho `status` e të gjitha rreshtave të vërtetë në `hold`, që Lead intake të mos thërrasë klientë
      të vërtetë gjatë testit. Pas testeve ktheji në `pending`.
- [ ] Në tabelën `call_agent_leads` shto me dorë një rresht testi: pixxi_lead_id = ID e lead-it testi, phone = numri yt,
      country = XK, language = sq, call_type = new, status = pending, attempts = 0, next_call_at = tani, consent = true.
- [ ] Aktivizo vetëm: Shëno thirrjen → Përgatit thirrjen → Nis thirrjen → Ruaj ID-në e bisedës.
- [ ] Ekzekuto Lead intake me dorë (Execute workflow). Përgjigju telefonit, bëj bisedën.
- [ ] Kontrollo: zëri i Gentës nga fillimi, fjala e parë shqip, mbyllja.
- [ ] Post-call result: rreshti në tabelë u përditësua (status, conversation_id, summary).

## E. Pixxi me lead-in testi

- [ ] Aktivizo nyjet e Pixxi në Post-call result (Lexo lead-in, Përgatit Pixxi, Shëno në Pixxi, Ndrysho fazën).
- [ ] Bëj një thirrje tjetër testi. Kontrollo në Pixxi: shënimi, faza e re, dhe që **asnjë fushë tjetër nuk u fshi**.
- [ ] Nëse Pixxi e ka rregulluar API-në: aktivizo Ka detyrë? → Krijo detyrë dhe kontrollo detyrën.

## F. Rastet e tjera me telefon

- [ ] Mos u përgjigj fare → vjen "call_initiation_failure"? Rreshti → no_answer, riprovë nesër.
- [ ] Sekretaria (voicemail) → mbyllet pa mesazh.
- [ ] Thirr numrin +383 38… nga telefoni yt → thirrja hyrëse bllokohet / mesazh.

## G. Nisja e kontrolluar

- [ ] Fshi rreshtat e testit nga tabela.
- [ ] Publiko **Lead intake** (degët Çdo 2 minuta + Çdo ditë).
- [ ] Ditët e para: kufizo follow-up në 10/ditë (`DAILY_LIMIT`), dëgjo thirrjet, shiko Evaluation.
- [ ] Raporti javor: ndrysho `ONLY_TO = null` kur të funksionojë Pixxi.
