// n8n Code node "Ndërto raportin" (Mode: Run Once for All Items)
// Workflow: END Call Agent - Lead intake, dega "Çdo të hënë" (raporti javor)
// Para tij: "Lexo tabelën R" (Data table → Get, Return All, Execute Once, Always Output Data)
// dhe "Merr agjentët" (HTTP GET /pixxiapi/v1/agent/list).
// Kthen një detyrë të vetme (Pixxi reminder) me përmbledhjen e javës, për Dion-in dhe Marketing.

const MANAGERS = ['Dion Humolli', 'Marketing'];   // emrat si në Pixxi
const DAYS = 7;
const ONLY_TO = ['Marketing'];  // TEST: vetëm për Marketing. Për raportin e vërtetë: null

const rows = $('Lexo tabelën R').all().map((i) => i.json).filter((r) => r && r.pixxi_lead_id && !String(r.pixxi_lead_id).startsWith('test'));
const agentsRaw = $('Merr agjentët').first().json;
const agents = Array.isArray(agentsRaw.data) ? agentsRaw.data : (agentsRaw.data && agentsRaw.data.list) || [];
const idByName = {};
for (const a of agents) if (a && a.name) idByName[a.name.trim().toLowerCase()] = a.id;

const now = new Date();
const since = new Date(now.getTime() - DAYS * 86400000);
const inWeek = (d) => d && new Date(d) >= since;

const LABEL = {
  interested: 'Interested',
  not_now: 'Not now',
  wrong_or_not_interested: 'Not interested / wrong person',
  no_answer: 'No answer (retrying)',
  no_contact: 'No contact after 2 tries',
  calling: 'Call in progress',
  pending: 'Waiting',
};

const newLeads = rows.filter((r) => inWeek(r.createdAt));
const called = rows.filter((r) => inWeek(r.last_call_at));
const count = (list, s) => list.filter((r) => r.status === s).length;
const pct = (a, b) => (b ? Math.round((a / b) * 100) + '%' : '-');

const fmt = (d) => d.toLocaleDateString('en-GB', { timeZone: 'Asia/Dubai', day: '2-digit', month: 'short' });
const period = `${fmt(since)} - ${fmt(now)}`;

const summary = [
  `AI calling agent - weekly report (${period})`,
  '',
  `New Meta leads: ${newLeads.filter((r) => r.call_type !== 'followup').length}`,
  `Old leads added for follow-up: ${newLeads.filter((r) => r.call_type === 'followup').length}`,
  `Leads called: ${called.length}`,
  `Interested: ${count(called, 'interested')} (${pct(count(called, 'interested'), called.length)})`,
  `Not now: ${count(called, 'not_now')}`,
  `Not interested / wrong person: ${count(called, 'wrong_or_not_interested')}`,
  `No answer, retrying: ${count(called, 'no_answer')}`,
  `No contact after 2 tries: ${count(called, 'no_contact')}`,
  `Asked not to be called: ${called.filter((r) => r.do_not_call).length}`,
  `Not called yet (no consent / outside hours): ${newLeads.filter((r) => r.status === 'pending').length}`,
];

// Për çdo agjent
const byAgent = {};
for (const r of called) {
  const name = (r.lead_agent || 'Unassigned').trim();
  (byAgent[name] = byAgent[name] || []).push(r);
}
summary.push('', 'By agent:');
for (const [name, list] of Object.entries(byAgent)) {
  summary.push(`- ${name}: ${list.length} called, ${count(list, 'interested')} interested, ${count(list, 'not_now')} not now`);
}

const dubaiNow = new Date(now.getTime() + 4 * 3600000).toISOString().slice(0, 19).replace('T', ' ');
const task = (participants, title, description) => ({
  json: {
    reminderBody: {
      participants,
      reminderType: 'TASK',
      object_type: 'CALENDAR_REMINDER',
      title,
      description,
      reminder_start_time: dubaiNow,
      send_notification_before: 0,
      status: 'INIT',
      operationPermission: 'COMPLETE_ONLY',
    },
  },
});

const allowed = (name) => !ONLY_TO || ONLY_TO.map((n) => n.toLowerCase()).includes(name.toLowerCase());
const out = [];

const managerIds = MANAGERS.filter(allowed).map((n) => idByName[n.toLowerCase()]).filter(Boolean);
if (managerIds.length) {
  out.push(task(managerIds, `AI calls weekly report: ${called.length} called, ${count(called, 'interested')} interested`, summary.join('\n')));
}

return out;
