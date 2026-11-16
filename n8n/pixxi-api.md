# Pixxi Data API (për Call Agent)

Burimi: https://api-docs.pixxicrm.com (dërguar nga Pixxi support më 16.11.2026).

- Server: `https://dataapi.pixxicrm.ae`
- Autentikimi: header `X-PIXXI-TOKEN`. Token-i merret te Pixxi → Admin → Integrations → **Pixxi Forms**.
  Ruhet vetëm te n8n credentials (Header Auth), kurrë në GitHub ose në chat.
- Limite: 2 000 kërkesa/orë për token, 2 sekonda mes kërkesave leximi (nuk vlen për shkrim).

## Endpoint-et që na duhen

| Qëllimi | Endpoint |
|---|---|
| Lead-et e reja te ne (webhook i dytë) | `POST /pixxiapi/webhook/v1/subscribe` me `event: ADD_LEADS` dhe `callbackUrl` tonin |
| Shiko webhook-et ekzistuese (vetëm lexim) | `GET /pixxiapi/webhook/v1/subscription/list` |
| Fazat e lead-eve dhe ID-të e tyre | `POST /pixxiapi/v1/lead/tags` |
| Ndrysho fazën | `PUT /pixxiapi/v1/lead/update/{AppName}` me `id` dhe `tagId` |
| Shënim + link i regjistrimit | `POST /pixxiapi/v1/lead/addLog/{AppName}` me `leadId`, `message`, `callRecordingUrl` |
| Agjentët | `GET /pixxiapi/v1/agent/list` |
| Lead-et (p.sh. për të lexuar vlerat aktuale) | `POST /pixxiapi/v1/lead/list` |

`AppName` = `END Call Agent` (emri që shfaqet si burim i log-ut).

## Kujdes

- **Update Lead fshin disa fusha nëse nuk dërgohen** (p.sh. gender, data e lindjes, move-in date, cheques).
  Para se ta përdorim: ose lexojmë lead-in dhe i ridërgojmë vlerat aktuale, ose konfirmojmë me Pixxi
  që `id` + `tagId` vetëm nuk fshin asgjë. Testohet vetëm me një lead testi.
- Webhook-un e v18 **nuk e çregjistrojmë kurrë** (`unsubscribe` nuk përdoret).
- Subscribe është ndryshim në Pixxi-n e kompanisë: bëhet vetëm pasi ta kemi parë listën ekzistuese.

## Testuar më 16.11.2026

- Token-i funksionon (credential `Call Agent · Pixxi` në n8n).
- `webhook/v1/subscription/list` → "No permission to access webhooks". Leja duhet aktivizuar nga Pixxi support.
- `agent/list` → kthen `id`, `name`, `email`, `phone`, `deptId`. **Numri i agjentit vjen nga API.**
  Disa llogari (p.sh. Marketing) nuk kanë numër: atëherë njoftimi shkon te një numër rezervë.
