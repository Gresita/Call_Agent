# Data table: `call_agent_leads`

"Kujtesa" e Call Agent-it në n8n. Një rresht për çdo lead. Është tabelë e veçantë dhe nuk ka lidhje me v18.

| Kolona | Lloji | Çfarë mban |
|---|---|---|
| `pixxi_lead_id` | String | ID e lead-it në Pixxi (çelësi) |
| `phone` | String | Numri, në formatin +971..., +383... |
| `lead_name` | String | Emri |
| `project_name` | String | Projekti (nga Campaign/Form Name) |
| `language` | String | `en` ose `sq` |
| `lead_agent` | String | Agjenti i lead-it në Pixxi |
| `agent_phone` | String | Numri i agjentit (për WhatsApp) |
| `consent` | Boolean | Pëlqimi nga formulari i Meta-s |
| `status` | String | `pending`, `calling`, `interested`, `not_now`, `wrong_or_not_interested`, `no_answer`, `no_contact` |
| `attempts` | Number | Sa herë është thirrur |
| `last_call_at` | Date | Thirrja e fundit |
| `next_call_at` | Date | Kur thirret prapë (bosh = jo më) |
| `preferred_channel` | String | `whatsapp` ose `call` |
| `do_not_call` | Boolean | Kërkoi të mos thirret më |
| `conversation_id` | String | ID e bisedës në ElevenLabs |
| `summary` | String | Përmbledhja e thirrjes së fundit |

## Rregullat që mbështeten te kjo tabelë

- Asnjë thirrje e dytë të njëjtën ditë: krahasohet `last_call_at` me datën e sotme.
- `not_now`: `next_call_at` = callback time nëse e tha, përndryshe +7 ditë.
- Nuk u përgjigj: herën e parë `next_call_at` = nesër, `status = no_answer`. Herën e dytë `status = no_contact`, `next_call_at` bosh, dhe i kalon agjentit.
- `do_not_call = true` ose `wrong_or_not_interested`: `next_call_at` bosh, nuk thirret më.
