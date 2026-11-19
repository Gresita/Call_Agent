# Asterisk në VPS (Hostinger KVM 1, Frankfurt, IP 2.24.145.176)

Lidhja ElevenLabs ⇄ Vala. ElevenLabs lidhet me TCP 5060 (username `elevenlabs`, fjalëkalimi në `/root/.el_sip_pass` në server);
Asterisk regjistrohet te Vala me UDP 5060 nga IP-ja statike.

- Siguria: SSH vetëm me çelës (`~/.ssh/call_agent_vps`), ufw (22/tcp, 5060/tcp, 5060/udp vetëm nga Vala 185.47.191.0/24, RTP 10000–20000/udp),
  fail2ban për sshd dhe asterisk, chan_sip/IAX/AMI të çaktivizuara.
- Dialplan: lejohen vetëm +383, +33, +49; maks 5 thirrje njëkohësisht; thirrjet hyrëse refuzohen.
- `pjsip_vala.conf`: krijohet kur Vala dërgon të dhënat e numrit testues.
- Kopja e konfigurimit origjinal: `/root/asterisk-sample` në server.
