// n8n Code node "Llogarit statusin" (Mode: Run Once for All Items)
// Workflow: END Call Agent - Post-call result
// Para tij: "Lexo rezultatin" (Code) dhe "Gjej lead-in" (Data table → Get row, Always Output Data = ON).
// Vendos statusin dhe kur thirret prapë lead-i, sipas rregullave të planit.

const r = $('Lexo rezultatin').first().json;
const existing = $('Gjej lead-in').first().json || {};

const attempts = Number(existing.attempts) || 1; // thirrja aktuale numërohet te workflow-i para thirrjes
const now = new Date();
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);

let status;
let next = null;

if (r.do_not_call || r.outcome === 'wrong_or_not_interested') {
  status = 'wrong_or_not_interested'; // nuk thirret më
} else if (r.outcome === 'interested') {
  status = 'interested'; // i kalon agjentit
} else if (r.outcome === 'not_now') {
  status = 'not_now';
  const cb = r.callback_time ? new Date(r.callback_time) : null;
  next = cb && !isNaN(cb) && cb > now ? cb : addDays(now, 7); // koha që tha klienti, ose pas 7 ditësh
} else if (attempts < 2) {
  status = 'no_answer'; // pa rezultat: provo nesër
  next = addDays(now, 1);
} else {
  status = 'no_contact'; // dy herë pa përgjigje: i kalon agjentit si "pa kontakt"
}

return [
  {
    json: {
      pixxi_lead_id: r.pixxi_lead_id,
      status,
      attempts,
      last_call_at: existing.last_call_at || now.toISOString(),
      next_call_at: next ? next.toISOString() : null,
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
