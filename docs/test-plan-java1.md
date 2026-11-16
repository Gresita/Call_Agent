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

- Të 12 skenarët kalojnë në anglisht, dhe në shqip nëse ElevenLabs e mbështet shqipen.
- ~~Ekipi bie dakord për zërin.~~ ✅ Dion's VO, i qetë (16.11.2026)
- Ndryshimet e prompt-it ruhen në këtë repo.

## Tabela e rezultateve

| Data | Testuesi | Gjuha | Skenari | Kaloi? | Shënime |
|---|---|---|---|---|---|
| 2026-11-16 | Ekipi | EN | Tingulli i zërit (Dion's VO) | Jo | Tingëllonte shumë "happy". U rregullua: seksioni Tone në prompt + Stability ~70–80% |
| 2026-11-16 | Ekipi | EN | Tingulli i zërit, pas rregullimit | Po | I qetë dhe natyral, i miratuar nga ekipi |
| 2026-11-16 | Ekipi | EN | Rrjedha e plotë | Jo | Thoshte "thank you" pas çdo përgjigjeje. U rregullua: rregull i ri te Tone, "thank you" vetëm një herë në fund |
| 2026-11-16 | Ekipi | EN | Mbyllja e thirrjes | Jo | Thoshte "I'll end the call now" dhe vazhdonte me "Goodbye" pa e mbyllur. Rregullim: aktivizo tool-in End call + rregull më i qartë në prompt |
| 2026-11-16 | Ekipi | SQ | Klienti flet shqip që në fillim | Po | E kuptoi dhe kaloi në shqip. Por nuk e përsëriti "kjo thirrje regjistrohet", u rregullua në prompt |
| 2026-11-16 | Ekipi | SQ | Zëri shqip (Additional voice) | Po | Të dy zërat tingëllojnë mirë |
| | | | | | |
