// n8n Code node "Zgjidh follow-up" (Mode: Run Once for All Items)
// Workflow: END Call Agent - Lead intake, dega "Çdo ditë" (follow-up)
// Para tij: "Merr të gjitha lead-et" (HTTP lead/list me pagination, një item për faqe)
// dhe "Lexo tabelën FU" (Data table → Get, Return All, Execute Once, Always Output Data).
// Shton në tabelë lead-et e vjetra nga Meta në fazat Follow Up / No Answer / 3- Future Prospect,
// që agjenti nuk i ka prekur në 7 ditët e fundit. Deri në DAILY_LIMIT në ditë.

const FOLLOWUP_STAGES = { 2868: 'Follow Up', 2863: 'No Answer', 6839: '3- Future Prospect' };
const AD_SOURCE = /^META_ADS$/;
const QUIET_DAYS = 7;      // agjenti nuk e ka prekur lead-in kaq ditë
const DAILY_LIMIT = 30;    // sa lead-e të vjetra shtohen në ditë
const COUNTRY_LANG = { XK: 'sq', FR: 'en', DE: 'en' };
const GENERIC = ['END', 'END PROPERTIES']; // fushata të përgjithshme, pa projekt

const pages = $('Merr të gjitha lead-et').all().map((i) => i.json);
const leads = pages.flatMap((p) => (p.data && p.data.list) || []);
const rows = $('Lexo tabelën FU').all().map((i) => i.json).filter((r) => r && r.pixxi_lead_id);
const known = new Set(rows.map((r) => String(r.pixxi_lead_id)));
const now = new Date();

const countryOf = (phone) => {
  const p = String(phone || '').replace(/[\s-]/g, '');
  if (/^\+383|^\+3774[3-9]|^\+3864[3-9]/.test(p)) return 'XK';
  if (/^\+33/.test(p)) return 'FR';
  if (/^\+49/.test(p)) return 'DE';
  return null;
};
const parseDubai = (s) => (s ? new Date(String(s).replace(' ', 'T') + '+04:00') : null);
const lastActivity = (l) => {
  const ds = [parseDubai(l.updateTime), parseDubai(l.lastFollowTime)].filter(Boolean);
  return ds.length ? new Date(Math.max(...ds)) : parseDubai(l.createTime);
};
// Projekti = pjesa e parë e emrit të fushatës "Projekt | Lead Gen | KOS | Nov26".
// Nëse fushata nuk ka këtë formë (p.sh. "Meet our real estate expert Greg in Paris."), projekti mbetet bosh
// dhe agjenti thotë "pronat tona në Dubai" / "our properties in Dubai".
const projectOf = (parts) => {
  const p = String(parts[0] || '').trim();
  if (parts.length < 2 || !p || GENERIC.includes(p.toUpperCase()) || p.split(/\s+/).length > 4) return null;
  return p;
};
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

// Sa follow-up janë shtuar sot (ora e Dubait)
const dubaiDay = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai' }).format(d);
const today = dubaiDay(now);
const addedToday = rows.filter((r) => r.call_type === 'followup' && r.createdAt && dubaiDay(new Date(r.createdAt)) === today).length;
let room = Math.max(0, DAILY_LIMIT - addedToday);

const candidates = leads
  .filter((l) => AD_SOURCE.test(String(l.clientSource || '')))
  .filter((l) => FOLLOWUP_STAGES[l.tagId])
  .filter((l) => !known.has(String(l.id)))
  .filter((l) => COUNTRY_LANG[countryOf(l.phone)])
  .filter((l) => now - lastActivity(l) > QUIET_DAYS * 86400000)
  .sort((a, b) => lastActivity(b) - lastActivity(a)); // më të freskëtit para

const out = [];
for (const l of candidates) {
  if (room <= 0) break;
  const phone = String(l.phone || '').replace(/[\s-]/g, '');
  const country = countryOf(phone);
  const parts = campaignParts(l);
  const agent = l.agentInfo || {};
  out.push({ json: {
    pixxi_lead_id: String(l.id),
    phone,
    country,
    call_type: 'followup',
    lead_name: l.name || null,
    project_name: projectOf(parts),
    language: COUNTRY_LANG[country],
    lead_agent: agent.name || null,
    agent_phone: agent.phone || null,
    consent: consentFrom(l),
    status: 'pending',
    attempts: 0,
    next_call_at: now.toISOString(),
    do_not_call: false,
  }});
  room--;
}

return out;
