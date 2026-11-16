// n8n Code node "Planifiko thirrjet" (Mode: Run Once for All Items)
// Workflow: END Call Agent - Lead intake
// Para tij: "Merr lead-et nga Pixxi" (HTTP, lead/list) dhe "Lexo tabelën" (Data table → Get, Return All,
// Execute Once = ON, Always Output Data = ON).
// Kthen dy lloje rreshtash:
//   attempts = 0  → lead i ri nga reklamat, shtohet në tabelë
//   attempts >= 1 → lead që thirret tani (kaloi të gjitha kontrollet)

const AD_SOURCE = /_ADS$/;          // vetëm reklamat (META_ADS etj.), jo portalet
const NOT_CONTACTED = 2529;         // faza "Not Contacted" në Pixxi
const MAX_AGE_HOURS = 48;           // lead-et më të vjetra se kaq nuk merren
const MAX_CALLS_PER_RUN = 3;        // sa thirrje njëkohësisht
const REQUIRE_CONSENT = true;       // pa pëlqim nga formulari i Meta-s nuk thërrasim
const CALL_FROM = 9;                // ora lokale e klientit
const CALL_TO = 18;
const SQ_COUNTRIES = ['KOS', 'XK', 'ALB', 'AL', 'MKD', 'MK'];

const leads = (($('Merr lead-et nga Pixxi').first().json.data) || {}).list || [];
const rows = $('Lexo tabelën').all().map((i) => i.json).filter((r) => r && r.pixxi_lead_id);
const known = new Set(rows.map((r) => String(r.pixxi_lead_id)));
const now = new Date();

// Zona kohore sipas numrit të telefonit
const tzFor = (phone) => {
  const p = String(phone || '').replace(/[\s-]/g, '');
  if (/^\+971/.test(p)) return 'Asia/Dubai';
  if (/^\+383|^\+3774[45]|^\+3864[3459]/.test(p)) return 'Europe/Belgrade'; // Kosovë
  if (/^\+355/.test(p)) return 'Europe/Tirane';
  if (/^\+389/.test(p)) return 'Europe/Skopje';
  if (/^\+44/.test(p)) return 'Europe/London';
  if (/^\+49/.test(p)) return 'Europe/Berlin';
  if (/^\+41/.test(p)) return 'Europe/Zurich';
  if (/^\+43/.test(p)) return 'Europe/Vienna';
  return null; // vend i panjohur: nuk thërrasim
};

const localNow = (tz) => {
  const o = {};
  new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false,
  }).formatToParts(now).forEach((x) => (o[x.type] = x.value));
  return { date: `${o.year}-${o.month}-${o.day}`, hour: Number(o.hour) % 24 };
};
const localDate = (d, tz) => new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d);

// createTime vjen me orën e Dubait, p.sh. "2026-11-16 16:17:20"
const parseDubai = (s) => new Date(String(s).replace(' ', 'T') + '+04:00');

const campaignParts = (l) =>
  String(l.campaignName || l.adName || l.formName || '')
    .replace(/\\/g, '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

const consentFrom = (l) => {
  try {
    const ext = JSON.parse(l.extend || '{}');
    for (const form of Object.values(ext)) {
      for (const [k, v] of Object.entries(form || {})) {
        if (/consent|agree|pëlqim|pelqim|permission/i.test(k)) {
          const val = String(Array.isArray(v) ? v[0] : v).toLowerCase();
          return /^(yes|true|po|1)/.test(val) || val.includes('agree');
        }
      }
    }
  } catch (e) {}
  return false;
};

const out = [];

// 1) Lead-et e reja nga reklamat → shtohen në tabelë
for (const l of leads) {
  if (!AD_SOURCE.test(String(l.clientSource || ''))) continue;
  if (l.tagId !== NOT_CONTACTED) continue;
  if (now - parseDubai(l.createTime) > MAX_AGE_HOURS * 3600000) continue;
  if (known.has(String(l.id))) continue;

  const parts = campaignParts(l);
  const country = parts.find((p) => /^[A-Z]{2,3}$/.test(p)) || null;
  const phone = String(l.phone || '').replace(/[\s-]/g, '');
  const sq = SQ_COUNTRIES.includes(country) || /^\+(383|355|389|3774[45])/.test(phone);
  const agent = l.agentInfo || {};

  out.push({
    json: {
      pixxi_lead_id: String(l.id),
      phone,
      lead_name: l.name || null,
      project_name: parts[0] || null,
      language: sq ? 'sq' : 'en',
      lead_agent: agent.name || null,
      agent_phone: agent.phone || null,
      consent: consentFrom(l),
      status: 'pending',
      attempts: 0,
      next_call_at: now.toISOString(),
      do_not_call: false,
    },
  });
}

// 2) Lead-et që duhen thirrur tani
let calls = 0;
for (const r of rows) {
  if (calls >= MAX_CALLS_PER_RUN) break;
  if (r.do_not_call) continue;
  if (!['pending', 'no_answer', 'not_now'].includes(r.status)) continue;
  if (!r.next_call_at || new Date(r.next_call_at) > now) continue;
  if (REQUIRE_CONSENT && !r.consent) continue;

  const tz = tzFor(r.phone);
  if (!tz) continue;
  if (/^\+971/.test(r.phone) && !r.dncr_ok) continue; // numrat e UAE kërkojnë kontroll DNCR

  const ln = localNow(tz);
  if (ln.hour < CALL_FROM || ln.hour >= CALL_TO) continue;
  if (r.last_call_at && localDate(new Date(r.last_call_at), tz) === ln.date) continue; // jo dy herë në ditë

  out.push({ json: { ...r, attempts: (Number(r.attempts) || 0) + 1, timezone: tz } });
  calls++;
}

return out;
