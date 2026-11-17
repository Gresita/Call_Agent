// n8n Code node "Përgatit Pixxi" (Mode: Run Once for All Items)
// Workflow: END Call Agent - Post-call result
// Para tij: "Llogarit statusin" (Code), "Lexo rezultatin" (Code) dhe "Lexo lead-in në Pixxi"
// (HTTP, POST lead/list me searchKeywords = pixxi_lead_id).
// Kthen dy trupa kërkese: logBody (shënimi) dhe updateBody (faza).
//
// KUJDES: Update Lead i Pixxi-t fshin disa fusha nëse nuk dërgohen. Prandaj i kopjojmë
// të gjitha vlerat aktuale të lead-it dhe ndryshojmë vetëm tagId. Testohet në Javën 3
// me një lead testi para se të përdoret te lead-et e vërteta.

const STAGES = {
  interested: 2864,              // 4- Qualified/ Interested
  not_now: 2868,                 // Follow Up
  wrong_or_not_interested: 2865, // 1- Definitely Not Interested
  no_answer: 2863,               // No Answer
  no_contact: 2863,              // No Answer (pa kontakt pas 2 provave)
};

const s = $('Llogarit statusin').first().json;
const r = $('Lexo rezultatin').first().json;
const list = (($('Lexo lead-in në Pixxi').first().json.data) || {}).list || [];
const lead = list.find((l) => String(l.id) === String(s.pixxi_lead_id));

if (!lead) {
  // Lead-i nuk u gjet (p.sh. test-001): nuk shkruajmë asgjë në Pixxi.
  return [];
}

const LABELS = {
  interested: 'Interested',
  not_now: 'Not now',
  wrong_or_not_interested: 'Wrong person / not interested',
  no_answer: 'No answer (will retry)',
  no_contact: 'No contact after 2 attempts',
};

const lines = [
  `AI call result: ${LABELS[s.status] || s.status}`,
  s.preferred_channel ? `Preferred channel: ${s.preferred_channel === 'call' ? 'Call from agent' : 'WhatsApp'}` : null,
  s.next_call_at ? `Next AI call: ${new Date(s.next_call_at).toLocaleString('en-GB', { timeZone: 'Asia/Dubai' })} (Dubai)` : null,
  r.do_not_call ? 'Asked not to be called again.' : null,
  r.summary ? `Summary: ${r.summary}` : null,
  r.transcript ? `Transcript:\n${r.transcript}` : null,
  r.conversation_id ? `ElevenLabs conversation: ${r.conversation_id}` : null,
].filter(Boolean);

const logBody = { leadId: lead.id, message: lines.join('\n') };

// Kopjo vlerat aktuale, ndrysho vetëm fazën.
const KEEP = [
  'agentId', 'clientType', 'name', 'locationObj', 'houseType', 'phone', 'secondryPhone',
  'projectType', 'nationality', 'gender', 'rooms', 'budget', 'size', 'payMethod', 'email',
  'customClientSource', 'isFurniture', 'buyerType', 'birthdate', 'views', 'priceType',
  'moveInDate', 'minCheques', 'preferedDeveloperList', 'clientDocs', 'status',
];
const updateBody = { id: lead.id };
for (const k of KEEP) {
  if (lead[k] !== null && lead[k] !== undefined) updateBody[k] = lead[k];
}
if (Array.isArray(lead.speakers) && lead.speakers.length) updateBody.spokenLanguages = lead.speakers;
updateBody.tagId = STAGES[s.status] || lead.tagId;

return [{ json: { logBody, updateBody, stageChanged: updateBody.tagId !== lead.tagId } }];
