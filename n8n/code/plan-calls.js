// n8n Code node "Planifiko thirrjet" (Mode: Run Once for All Items)
// Workflow: END Call Agent - Lead intake
// Para tij: "Merr lead-et nga Pixxi" (HTTP, lead/list) dhe "Lexo tabelën" (Data table → Get, Return All,
// Execute Once = ON, Always Output Data = ON).
// Kthen dy lloje rreshtash:
//   attempts = 0  → lead i ri nga Meta, shtohet në tabelë
//   attempts >= 1 → lead që thirret tani (kaloi të gjitha kontrollet)
//
// Qëllimi (17.11.2026): vetëm Meta, vetëm Kosovë / Francë / Gjermani.
// Kosova → shqip, Franca dhe Gjermania → anglisht.

const AD_SOURCE = /^META_ADS$/;     // vetëm Meta
const NOT_CONTACTED = 2529;         // faza "Not Contacted" në Pixxi
const MAX_AGE_HOURS = 48;           // lead-et e reja më të vjetra se kaq nuk merren këtu
const MAX_CALLS_PER_RUN = 3;        // sa thirrje njëkohësisht

// Vendet ku thërret AI. consent = a kërkohet pëlqimi nga formulari para thirrjes (vendim ligjor i kompanisë).
const COUNTRIES = {
  XK: { lang: 'sq', tz: 'Europe/Belgrade', consent: false, windows: { days: [1, 2, 3, 4, 5, 6], hours: [[9, 18]] } },
  FR: { lang: 'en', tz: 'Europe/Paris', consent: true, windows: { days: [1, 2, 3, 4, 5], hours: [[10, 13], [14, 20]] } },
  DE: { lang: 'en', tz: 'Europe/Berlin', consent: true, windows: { days: [1, 2, 3, 4, 5], hours: [[9, 19]] } },
};
const PROJECT_NAMES = { END: 'END Properties' }; // fushata të përgjithshme, pa projekt

const leads = (($('Merr lead-et nga Pixxi').first().json.data) || {}).list || [];
const rows = $('Lexo tabelën').all().map((i) => i.json).filter((r) => r && r.pixxi_lead_id);
const known = new Set(rows.map((r) => String(r.pixxi_lead_id)));
const now = new Date();

// Vendi sipas numrit të telefonit
const countryOf = (phone) => {
  const p = String(phone || '').replace(/[\s-]/g, '');
  if (/^\+383|^\+3774[3-9]|^\+3864[3-9]/.test(p)) return 'XK';
  if (/^\+33/.test(p)) return 'FR';
  if (/^\+49/.test(p)) return 'DE';
  return null; // vend tjetër: nuk thërrasim
};

const localNow = (tz) => {
  const o = {};
  new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false,
  }).formatToParts(now).forEach((x) => (o[x.type] = x.value));
  const wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
  return { date: `${o.year}-${o.month}-${o.day}`, hour: Number(o.hour) % 24, minute: Number(o.minute), wd };
};
const localDate = (d, tz) => new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d);
const inWindow = (c, ln) =>
  c.windows.days.includes(ln.wd) &&
  c.windows.hours.some(([a, b]) => ln.hour >= a && ln.hour < b);

// createTime vjen me orën e Dubait, p.sh. "2026-11-16 16:17:20"
const parseDubai = (s) => new Date(String(s).replace(' ', 'T') + '+04:00');

const campaignParts = (l) =>
  String(l.campaignName || l.adName || l.formName || '')
    .replace(/\\/g, '').split('|').map((s) => s.trim()).filter(Boolean);

const consentFrom = (l) => {
  try {
    const ext = JSON.parse(l.extend || '{}');
    for (const form of Object.values(ext)) {
      for (const [k, v] of Object.entries(form || {})) {
        if (/consent|agree|pëlqim|pelqim|permission/i.test(k)) {
          const val = String(Array.isArray(v) ? v[0] : v).toLowerCase();
          return /^(yes|true|po|1|oui|ja)/.test(val) || val.includes('agree');
        }
      }
    }
  } catch (e) {}
  return false;
};

const out = [];

// 1) Lead-et e reja nga Meta → shtohen në tabelë
for (const l of leads) {
  if (!AD_SOURCE.test(String(l.clientSource || ''))) continue;
  if (l.tagId !== NOT_CONTACTED) continue;
  if (now - parseDubai(l.createTime) > MAX_AGE_HOURS * 3600000) continue;
  if (known.has(String(l.id))) continue;

  const phone = String(l.phone || '').replace(/[\s-]/g, '');
  const country = countryOf(phone);
  if (!COUNTRIES[country]) continue;

  const parts = campaignParts(l);
  const agent = l.agentInfo || {};
  out.push({ json: {
    pixxi_lead_id: String(l.id),
    phone,
    country,
    call_type: 'new',
    lead_name: l.name || null,
    project_name: PROJECT_NAMES[String(parts[0] || '').toUpperCase()] || parts[0] || null,
    language: COUNTRIES[country].lang,
    lead_agent: agent.name || null,
    agent_phone: agent.phone || null,
    consent: consentFrom(l),
    status: 'pending',
    attempts: 0,
    next_call_at: now.toISOString(),
    do_not_call: false,
  }});
}

// 2) Lead-et që duhen thirrur tani (të reja dhe follow-up)
let calls = 0;
for (const r of rows) {
  if (calls >= MAX_CALLS_PER_RUN) break;
  if (r.do_not_call) continue;
  const retryStuck = r.status === 'calling' && (Number(r.attempts) || 0) < 2;
  if (!['pending', 'no_answer', 'not_now'].includes(r.status) && !retryStuck) continue;
  if (!r.next_call_at || new Date(r.next_call_at) > now) continue;

  const country = r.country || countryOf(r.phone);
  const c = COUNTRIES[country];
  if (!c) continue;
  if (c.consent && !r.consent) continue;

  const ln = localNow(c.tz);
  if (!inWindow(c, ln)) continue;
  if (r.last_call_at && localDate(new Date(r.last_call_at), c.tz) === ln.date) continue; // jo dy herë në ditë

  out.push({ json: { ...r, country, attempts: (Number(r.attempts) || 0) + 1, timezone: c.tz } });
  calls++;
}

return out;
