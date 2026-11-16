# n8n i kompanisë

Përditësuar më 16.11.2026: END Properties ka tashmë n8n-in e vet në `n8n.end-properties.com`.
Nuk hapim VPS të ri. Call Agent ndërtohet në këtë instancë.

## Rregull strikt: mos prek workflow-et e kompanisë

Këto workflow janë live dhe i përkasin kompanisë. **Nuk hapen për editim, nuk ruhen, nuk
çaktivizohen, nuk fshihen dhe nuk kopjohen mbi to:**

- `END WhatsApp lead automation (live) v18 - hardened`
- `END automation - error alert`
- (edhe versionet e vjetra v14–v16 lihen siç janë)

## Si punojmë

- Çdo gjë e Call Agent-it shkon në **workflow të reja, të veçanta**, me emër që fillon me
  `END Call Agent`.
- Credentials të reja (ElevenLabs, Twilio, Pixxi) krijohen me emra të qartë, p.sh.
  `Call Agent · ElevenLabs`. Credentials ekzistuese nuk ndryshohen.
- Duhet kujdes që lead-i i njëjtë mos të trajtohet keq nga dy workflow-e njëkohësisht
  (WhatsApp v18 dhe Call Agent). Këtë e sqarojmë para se të aktivizojmë trigger-in.
- Si Error Workflow mund ta zgjedhim `END automation - error alert` te Settings e workflow-it
  tonë (vetëm referencë, pa e ndryshuar), nëse kompania pajtohet.

## Të dhënat e qasjes

Nuk ruhen këtu. Llogaritë dhe çelësat ruhen në password manager-in e kompanisë ose te n8n credentials.
