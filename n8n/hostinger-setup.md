# n8n në Hostinger VPS

Vendosur më 16.11.2026: n8n hostohet në një **VPS të Hostinger-it**, jo në kompjuter lokal,
sepse duhet të punojë 24/7 dhe të ketë adresë publike për webhook-et e ElevenLabs dhe Pixxi.

## Hapja

1. Hyr në Hostinger → **VPS**.
2. Plani: KVM 1 mjafton për ~500 lead-e/muaj. KVM 2 nëse duam më shumë hapësirë.
3. Gjatë konfigurimit: **Application → n8n**.
4. Datacenter: më i afërti me UAE nga lista.
5. Fjalëkalimi root: i fortë, ruhet në password manager-in e kompanisë. **Kurrë në GitHub ose në chat.**
6. Pas instalimit: **Manage App** hap n8n. Krijo llogarinë e pronarit (owner) me email-in e kompanisë.

## Pas hapjes

- [ ] Aktivizo **backup** automatik të VPS-it te Hostinger
- [ ] (Opsionale) subdomain `n8n.end-properties.com` në vend të adresës së Hostinger-it
- [ ] Workflow për njoftim kur një workflow dështon
- [ ] Përditësim i n8n një herë në muaj

## Të dhënat e qasjes

Nuk ruhen këtu. Adresa e n8n dhe llogaritë ruhen në password manager-in e kompanisë.
