# END Lead Verifier

Agjent AI që thërret çdo lead të ri të END Properties brenda pak minutash, bën 3 pyetje
(rreth 30 sekonda) dhe shkruan rezultatin në Pixxi si një nga 4 tag-et:
**I interesuar**, **Jo tani**, **Gabim / jo i interesuar**, **Nuk u përgjigj**.

Agjenti nuk shet dhe nuk jep çmime. Vetëm verifikon.

## Pjesët

| Pjesa | Roli |
|---|---|
| Pixxi | Ku hyn lead-i dhe ku shkruhet rezultati |
| n8n | Rrjedha: kontrollet, nisja e thirrjes, shkrimi i tag-ut |
| ElevenLabs Agents | Zëri dhe biseda |
| Twilio | Numri i kompanisë nga i cili bëhen thirrjet |

## Struktura

```
agent/
  system-prompt.md      Prompt-i i agjentit (për ElevenLabs)
  first-messages.md     Fjalia e parë, EN dhe SQ
  outcomes.md           Fushat që mbledh agjenti dhe tag-et në Pixxi
  elevenlabs-setup.md   Si konfigurohet agjenti në ElevenLabs
docs/
  test-plan-java1.md    Skenarët e testimit brenda ekipit
n8n/                    Workflow-et e n8n (Java 2)
```

## Plani

| Java | Puna | Statusi |
|---|---|---|
| 1 | Agjenti zënor në ElevenLabs, EN + SQ, testim brenda ekipit | në punë |
| 2 | Twilio + ElevenLabs, rrjedha në n8n, kutia e pëlqimit në Meta | |
| 3 | Test real me 20–30 lead-e me pëlqim | |
| 4 | Nisja për të gjitha lead-et, raport javor | |

## Rregullat e UAE (duhet të respektohen gjithmonë)

- Thirrje vetëm 9:00–18:00 me orën e UAE
- Leje telemarketingu dhe numër i regjistruar në emrin e kompanisë
- Kontroll i çdo numri në DNCR para thirrjes
- AI prezantohet si AI dhe kërkon pëlqim në fillim
- Njoftim që thirrja regjistrohet
- Asnjë thirrje e dytë të njëjtën ditë pas një "jo"
- Kutia e pëlqimit për thirrje në formularin e Meta-s

## Siguria

Asnjë çelës API, token apo numër telefoni real nuk ruhet në këtë repo.
Çelësat ruhen në n8n credentials ose në një skedar `.env` që nuk bëhet commit.
