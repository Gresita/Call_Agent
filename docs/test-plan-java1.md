# Plani i testimit: Java 1 (brenda ekipit)

Testojmë me butonin **Test AI agent** në ElevenLabs, me zë, jo vetëm me tekst.
Çdo skenar testohet në anglisht dhe në shqip. Rezultatin e shënojmë në tabelë.

## Skenarët

| # | Çfarë thotë "lead-i" | Rezultati i pritur (`outcome`) | Fushat e tjera |
|---|---|---|---|
| 1 | Po → Po → Po → "WhatsApp" | `interested` | `preferred_channel = whatsapp` |
| 2 | Po → Po → Po → "Më thirrni" | `interested` | `preferred_channel = call` |
| 3 | "Nuk kam kohë, nesër pas orës 5" | `not_now` | `callback_time` e plotësuar |
| 4 | Po → "Jo, s'e plotësova unë" | `wrong_or_not_interested` | |
| 5 | Po → Po → "Jo, s'jam i interesuar" | `wrong_or_not_interested` | |
| 6 | Po → Po → "Më vonë, javën tjetër" | `not_now` | `callback_time` e plotësuar |
| 7 | "Sa kushton apartamenti?" | agjenti nuk jep çmim, vazhdon skriptën | |
| 8 | "Mos më thirrni më" | `wrong_or_not_interested` | `do_not_call = true` |
| 9 | Fillon në anglisht, kalon në shqip | agjenti kalon në shqip | `language = sq` |
| 10 | "A je robot?" | thotë që është asistent AI | |
| 11 | Hesht 10+ sekonda | mbyll thirrjen me mirësjellje | |
| 12 | Flet me zhurmë rreth (rrugë, makinë) | e kupton dhe vazhdon | |

## Çfarë dëgjojmë

- A tingëllon natyrale? A ka vonesë të madh mes përgjigjes dhe pyetjes tjetër?
- A e shqipton mirë emrin e projektit dhe "END Properties"?
- A zgjat thirrja rreth 30 sekonda?
- A e thotë gjithmonë që është AI dhe që thirrja regjistrohet?

## Kur e mbyllim Javën 1

- ~~Të 12 skenarët kalojnë në anglisht dhe në shqip.~~ ✅
- ~~Ekipi bie dakord për zërin.~~ ✅ Dion's VO, i qetë (16.11.2026)
- ~~Ndryshimet e prompt-it ruhen në këtë repo.~~ ✅

## Tabela e rezultateve

| Data | Testuesi | Gjuha | Skenari | Kaloi? | Shënime |
|---|---|---|---|---|---|
| 2026-11-16 | Ekipi | EN | Tingulli i zërit (Dion's VO) | Jo | Tingëllonte shumë "happy". U rregullua: seksioni Tone në prompt + Stability ~70–80% |
| 2026-11-16 | Ekipi | EN | Tingulli i zërit, pas rregullimit | Po | I qetë dhe natyral, i miratuar nga ekipi |
| 2026-11-16 | Ekipi | EN | Rrjedha e plotë | Jo | Thoshte "thank you" pas çdo përgjigjeje. U rregullua: rregull i ri te Tone, "thank you" vetëm një herë në fund |
| 2026-11-16 | Ekipi | EN | Mbyllja e thirrjes | Jo | Thoshte "I'll end the call now" dhe vazhdonte me "Goodbye" pa e mbyllur. Rregullim: aktivizo tool-in End call + rregull më i qartë në prompt |
| 2026-11-16 | Ekipi | SQ | Klienti flet shqip që në fillim | Po | E kuptoi dhe kaloi në shqip. Por nuk e përsëriti "kjo thirrje regjistrohet", u rregullua në prompt |
| 2026-11-16 | Ekipi | SQ | Zëri shqip (Additional voice) | Po | Të dy zërat tingëllojnë mirë |
| 2026-11-16 | Ekipi | EN/SQ | Mbyllja e thirrjes, pas rregullimit | Po | E mbyll thirrjen vetë pas fjalisë së fundit |
| 2026-11-16 | Ekipi | EN | #1 Rrjedha e plotë, WhatsApp | Po | 17 sek. Analysis: outcome=interested, preferred_channel=whatsapp (e kuptoi edhe "wa") |
| 2026-11-16 | Ekipi | EN | #3 Nuk ka kohë, "nesër pas 5" | Jo | E pyeti prapë kur, edhe pse klienti e kishte thënë. Rregull i ri: mos pyet për diçka të thënë |
| 2026-11-16 | Ekipi | EN | #4 Nuk e plotësoi vetë | Po | Kërkoi falje dhe e mbylli |
| 2026-11-16 | Ekipi | EN | #7 Pyetje për çmim | Po | Nuk dha çmim, e ktheu te pyetja |
| 2026-11-16 | Ekipi | EN | #8 Mos më thirrni | Jo | Nuk e mbylli thirrjen, e përsëriti fjalinë 3 herë. Rregull i ri "Ending the call" në krye të prompt-it |
| 2026-11-16 | Ekipi | EN | #10 A je robot? | Po | Tha që është AI |
| 2026-11-16 | Ekipi | EN | #8 Mos më thirrni (pas rregullimit) | Po | E mbyll thirrjen menjëherë |
| 2026-11-16 | Ekipi | EN | #3 Nuk ka kohë (pas rregullimit) | Po | Nuk e pyet prapë për orën |
| 2026-11-16 | Ekipi | EN/SQ | #2, 5, 6, 9, 11, 12 | Po | Të gjitha kaluan |
| 2026-11-16 | Ekipi | EN | Shqiptimi i "END Properties" me zë | Po | Shqiptohet mirë (në tekst del "E N D", me zë është në rregull) |
| 2026-11-16 | Ekipi | EN/SQ | Shenja [calm] me zë | Po | Nuk lexohet me zë, vetëm e bën zërin të qetë |

**Java 1 u mbyll më 16.11.2026: të 12 skenarët kaluan.**

## Testet e agjentit v3 (18.11.2026, me tekst, DeepSeek Flash 4.1)

| Testi | Rezultati |
|---|---|
| Pyetje për çmimin ("how much does it cost?") | ✅ Pa çmim, "Our agent will share all the details", kthehet te pyetja |
| Pyetje e dyfishtë për regjistrimin | ❌ me prompt-in e vjetër → ✅ pas rregullit në krye të prompt-it |
| Follow-up pa pyetjen për formularin | ❌ me prompt-in e vjetër → ✅ pas rregullit në krye të prompt-it |
| Follow-up përdor "still interested" | ⚠️ përdori Q2 të zakonshëm; e pranueshme |
| Klienti i interesuar kërkon thirrje në orë të caktuar | rregulluar në prompt, për t'u testuar |
| Shqip, zëri i Gentës gjatë gjithë bisedës (Primary = Genta's vo 2) | ✅ Rrjedha e saktë, "I eN Di Properties", mbyllje e saktë me "thirrje" |
| Shqip me Dion Primary + albanian additional | ❌ zëri shqip vetëm në fund → zgjidhja: n8n dërgon `tts.voice_id` për çdo thirrje |

## Testet e rasteve të vështira me Claude Haiku 4.5 (18.11.2026)

| Testi | Rezultati |
|---|---|
| "Mos më thirrni më" (shqip) | ✅ Linja DNC dhe mbyllje menjëherë |
| call_type new kapërceu Q1 | ❌ → rregull i qartë në krye të prompt-it |
| Kalim anglisht → shqip | ⚠️ e bëri, por e njoftoi me zë ("Let me switch…") → rregull: kalim në heshtje |
| "Jo" te Q1 (s'jam unë) | ✅ "Na falni për shqetësimin. Ditë të mbarë." dhe mbyllje |
| "A je robot?" | ✅ "I am a virtual assistant of E N D Properties." + përsërit pyetjen; ⚠️ nuk kaloi në shqip me përgjigje të shkurtra shqip → rregull i shtuar |
