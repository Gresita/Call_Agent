# Rezultatet dhe të dhënat që mbledh agjenti

Në fund të thirrjes ElevenLabs nxjerr këto fusha (**Analysis → Data collection**).
n8n i lexon nga webhook-u post-call dhe i shkruan në Pixxi.

## Fushat (data collection)

| Fusha | Tipi | Përshkrimi për ElevenLabs |
|---|---|---|
| `outcome` | string | One of: `interested`, `not_now`, `wrong_or_not_interested`. Based on how the call ended according to the call flow. |
| `preferred_channel` | string | `whatsapp` or `call`. Only when outcome is `interested`, otherwise empty. |
| **Callback time** (Built-in) | string | Fushë e gatshme e ElevenLabs. Jep orën si datë ISO 8601 me zonë kohore (p.sh. `2026-11-17T15:00:00+04:00`), bosh nëse s'u kërkua orë e caktuar. |
| **Do not call** (Built-in) | boolean | Fushë e gatshme e ElevenLabs. True nëse lead-i kërkoi të mos thirret më. |
| `language` | string | Language the conversation ended in: `en` or `sq`. |

Fushat `outcome`, `preferred_channel` dhe `language` janë tonat (custom), me enum values dhe
Analysis scope = Conversation. **Callback time** dhe **Do not call** janë Built-in, pra nuk ndryshohen.
Emrin e tyre teknik (çelësi në JSON) e konfirmojmë nga rezultati i thirrjes së parë prove,
para se ta ndërtojmë n8n.

Përmbledhja e shkurtër (`transcript_summary`) dhe transkripti vijnë automatikisht nga ElevenLabs.

## Nga fusha te tag-u në Pixxi (e bën n8n)

| Burimi | Tag-u në Pixxi | Hapi tjetër |
|---|---|---|
| `outcome = interested` | **I interesuar** | Njoftim te agjenti me `preferred_channel` |
| `outcome = not_now` | **Jo tani** | Follow-up automatik pas 7 ditësh |
| `outcome = wrong_or_not_interested` | **Gabim / jo i interesuar** | Mbyllet, nuk thirret më |
| Twilio: `no-answer`, `busy`, `failed`, ose u kap voicemail | **Nuk u përgjigj** | Një provë tjetër nesër, pastaj te agjenti si "pa kontakt" |
| Do not call = true | **Gabim / jo i interesuar** + shënim DNC | Nuk thirret më asnjëherë |

"Nuk u përgjigj" nuk e vendos agjenti, sepse në atë rast biseda nuk ndodh fare. E vendos n8n
nga statusi i thirrjes në Twilio/ElevenLabs.

## Kriteret e vlerësimit (evaluation criteria)

I përdorim në Javën 3 për të parë cilat thirrje duhen dëgjuar:

1. `disclosed_ai`: Agent said it is an AI assistant at the start.
2. `mentioned_recording`: Agent said the call is recorded.
3. `no_prices`: Agent did not give prices, payment plans or project details.
4. `followed_flow`: Agent asked only the questions in the call flow, in order.
