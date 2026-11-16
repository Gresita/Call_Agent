# Konfigurimi i agjentit në ElevenLabs (Java 1)

Hapat në dashboard-in e ElevenLabs Agents. Emrat e menuve mund të ndryshojnë pak sipas versionit.

## 1. Krijo agjentin

- **Agents → Create agent → Blank agent**
- Emri: `END Call Agent`

## 2. Agent

| Fusha | Vlera |
|---|---|
| Default language | English |
| Additional languages | Albanian (shih shënimin poshtë) |
| First message | nga [first-messages.md](first-messages.md), versioni English |
| Language override (Albanian) | First message shqip nga i njëjti skedar |
| System prompt | nga [system-prompt.md](system-prompt.md) |
| LLM | një model i shpejtë me vonesë të ulët; e zgjedhim gjatë testit |
| Tools | aktivizo **End call** dhe **Language detection** |

**Dynamic variables** (n8n i dërgon me çdo thirrje):

| Variabla | Shembull testi |
|---|---|
| `project_name` | Sobha Hartland II |
| `language` | sq |
| `lead_name` | Test |
| `pixxi_lead_id` | test-001 |

## 3. Voice

- Zgjidh 2–3 zëra që tingëllojnë natyralë në **të dyja** gjuhët dhe krahasoji gjatë testit.
- Fillo me stability mesatare dhe shpejtësi normale.

## 4. Analysis

- **Data collection**: shto fushat nga [outcomes.md](outcomes.md).
- **Evaluation criteria**: shto 4 kriteret nga i njëjti skedar.

## 5. Advanced / Security

- Max call duration: **90 sekonda** (thirrja normale ~30 sek, kjo është mbrojtje).
- Silence timeout: rreth 10 sekonda, pastaj mbyll thirrjen.
- Lejo override vetëm për `first_message` dhe `language`, që n8n të zgjedhë gjuhën.
- Post-call webhook: e lidhim në Javën 2 me n8n.

## ⚠️ Për t'u kontrolluar ditën e parë: shqipja

Duhet konfirmuar që ElevenLabs Agents mbështet **shqipen** si në të folur (zërin), ashtu edhe në
dëgjim (njohjen e fjalës). Nëse nuk e mbështet mirë njërën prej tyre, kemi dy rrugë:

1. Fillojmë vetëm me anglisht, dhe lead-et shqiptarë i thërret agjenti njerëzor.
2. Provojmë një model tjetër zëri ose transkriptimi që e mbështet shqipen.

Kjo është gjëja e parë që testojmë, sepse ndikon në gjithë planin.
