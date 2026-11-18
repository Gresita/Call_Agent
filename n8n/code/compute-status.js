// n8n Code node "Llogarit statusin" (Mode: Run Once for All Items)
// Workflow: END Call Agent - Post-call result
// Para tij: "Lexo rezultatin" (Code) dhe "Gjej lead-in" (Data table → Get row, Always Output Data = ON).
// Vendos statusin dhe kur thirret prapë lead-i, sipas rregullave të planit.

const r = $('Lexo rezultatin').first().json;
const existing = $('Gjej lead-in').first().json || {};

const attempts = Number(existing.attempts) || 1; // thirrja aktuale numërohet te workflow-i para thirrjes
const now = new Date();
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

// Agjenti në ElevenLabs e ka zonën kohore Asia/Dubai, ndaj "nesër në 15:00" vjen si 15:00+04:00.
// Klienti e tha me orën e vendit të vet, prandaj e mbajmë orën 15:00 dhe e vendosim në zonën e klientit.
const TZ = { XK: 'Europe/Belgrade', FR: 'Europe/Paris', DE: 'Europe/Berlin' };
const leadTz = TZ[existing.country] || 'Asia/Dubai';
const tzOffsetMin = (date, tz) => {
  const o = {};
  new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    .formatToParts(date).forEach((x) => (o[x.type] = x.value));
  const asUtc = Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour % 24, +o.minute, +o.second);
  return (asUtc - date.getTime()) / 60000;
};
const toLeadTime = (iso) => {
  if (!iso) return null;
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  const wallUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  let d = new Date(wallUtc - tzOffsetMin(new Date(wallUtc), leadTz) * 60000);
  d = new Date(wallUtc - tzOffsetMin(d, leadTz) * 60000); // korrigjim për ndërrimin e orës
  return isNaN(d) ? null : d;
};
const callback = toLeadTime(r.callback_time);

let status;
let next = null;

if (r.do_not_call || r.outcome === 'wrong_or_not_interested') {
  status = 'wrong_or_not_interested'; // nuk thirret më
} else if (r.outcome === 'interested') {
  status = 'interested'; // i kalon agjentit
} else if (r.outcome === 'not_now') {
  status = 'not_now';
  next = callback && callback > now ? callback : addDays(now, 7); // koha që tha klienti, ose pas 7 ditësh
} else if (attempts < 2) {
  status = 'no_answer'; // pa rezultat: provo nesër
  next = addDays(now, 1);
} else {
  status = 'no_contact'; // dy herë pa përgjigje: i kalon agjentit si "pa kontakt"
}

return [
  {
    json: {
      pixxi_lead_id: r.pixxi_lead_id || existing.pixxi_lead_id,
      status,
      attempts,
      last_call_at: existing.last_call_at || now.toISOString(),
      next_call_at: next ? next.toISOString() : null,
      callback_time: callback ? callback.toISOString() : null,
      preferred_channel: r.preferred_channel,
      do_not_call: r.do_not_call,
      conversation_id: r.conversation_id,
      summary: r.summary,
      language: r.language,
      project_name: r.project_name,
      lead_name: r.lead_name,
    },
  },
];
