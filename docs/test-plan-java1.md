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
- Ekipi bie dakord për zërin.
- Ndryshimet e prompt-it ruhen në këtë repo.

## Tabela e rezultateve

| Data | Testuesi | Gjuha | Skenari | Kaloi? | Shënime |
|---|---|---|---|---|---|
| | | | | | |
