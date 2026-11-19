# Arkitektura e telefonisë (kontrolluar 19.11.2026)

```
n8n (Hostinger, i menaxhuar)  --API-->  ElevenLabs  --SIP TCP/TLS + digest-->  Asterisk (VPS Hostinger, IP statike)
                                                                                   --SIP UDP 5060 + REGISTER-->  Vala (+383 38…)  -->  klienti
ElevenLabs  --post-call webhook-->  n8n  --API-->  Pixxi
```

| Lidhja | Çfarë kërkon njëra anë | Çfarë ofron tjetra | Statusi |
|---|---|---|---|
| n8n → ElevenLabs | API `sip-trunk/outbound-call` me xi-api-key | Credential `Call Agent · ElevenLabs` | ✅ gati (nyjet joaktive) |
| ElevenLabs → n8n | Post-call webhook (HMAC) | Webhook `call-agent-postcall` | ✅ testuar |
| n8n → Pixxi | X-PIXXI-TOKEN, lead/list, addLog, update, reminder | Credential `Call Agent · Pixxi` | ✅ testuar (reminder 19.11) |
| ElevenLabs → Asterisk | Vetëm INVITE (pa REGISTER), digest auth, **TCP ose TLS** (UDP vetëm eksperimental), G.711/G.722, IP që ndryshojnë | Asterisk pranon TCP 5060 / TLS 5061 me username/password, G.711 | ✅ i përputhshëm |
| Asterisk → Vala | REGISTER nga IP statike e autorizuar, UDP 5060, G.711 ulaw/alaw | Asterisk regjistrohet me UDP nga IP-ja e VPS-së | ✅ i përputhshëm (konfirmohet me numrin testues) |
| Zëri (RTP) | ElevenLabs: UDP 10000–60000; Vala: portat e tyre | Firewall i VPS-së hap portat RTP | ⚠️ konfigurim i kujdesshëm (NAT/IP publike) |
| Caller ID | Vala shfaq numrin e regjistruar | — | ✅ konfirmuar nga Vala |

## Kujdes

- **Siguria e Asterisk-ut:** pranon lidhje nga IP të ndryshme të ElevenLabs → fjalëkalim i fortë, fail2ban, lejo vetëm thirrje drejt +383/+33/+49,
  asnjë thirrje hyrëse nga interneti përveç ElevenLabs. (ElevenLabs ka IP statike vetëm në planin Enterprise.)
- **TLS** kërkon certifikatë të vlefshme me emër domain-i (p.sh. `sip.end-properties.com` + Let's Encrypt). Për fillim mjafton **TCP**.
- **Thirrje njëkohësisht:** kufiri varet nga plani i ElevenLabs dhe paketa e Valës (2–30 kanale).
- Burimi: https://elevenlabs.io/docs/eleven-agents/phone-numbers/sip-trunking
