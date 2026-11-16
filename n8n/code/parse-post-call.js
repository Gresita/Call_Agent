// n8n Code node "Parse result" (Mode: Run Once for All Items)
// Workflow: END Call Agent - Post-call result
// Merr payload-in post_call_transcription të ElevenLabs dhe e kthen në një rresht të pastër.

const AGENT_ID = 'agent_8201m7htqaqsfxht7r924r64vfjk'; // END Call Agent

const body = $input.first().json.body || {};
const data = body.data || {};

// Vetëm bisedat e agjentit tonë. Të tjerat injorohen.
if (body.type !== 'post_call_transcription' || data.agent_id !== AGENT_ID) {
  return [];
}

// data_collection_results është i indeksuar me ID (aitem_...), jo me emër.
// Prandaj i lexojmë sipas fushës "name".
const results = (data.analysis && data.analysis.data_collection_results) || {};
const fields = {};
for (const item of Object.values(results)) {
  if (!item || !item.name) continue;
  const key = String(item.name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  fields[key] = item.value;
}

const vars =
  (data.conversation_initiation_client_data &&
    data.conversation_initiation_client_data.dynamic_variables) ||
  {};

const transcript = (data.transcript || [])
  .filter((t) => t && t.message)
  .map((t) => (t.role === 'agent' ? 'Agjenti' : 'Klienti') + ': ' + t.message)
  .join('\n');

const toBool = (v) => v === true || String(v).toLowerCase() === 'true';

return [
  {
    json: {
      conversation_id: data.conversation_id || null,
      pixxi_lead_id: vars.pixxi_lead_id || null,
      lead_name: vars.lead_name || null,
      project_name: vars.project_name || null,
      outcome: fields.outcome || null,
      preferred_channel: fields.preferred_channel || null,
      language: fields.language || vars.language || null,
      callback_time: fields.callback_time || null,
      do_not_call: toBool(fields.do_not_call),
      summary: (data.analysis && data.analysis.transcript_summary) || '',
      transcript,
      call_duration_secs: (data.metadata && data.metadata.call_duration_secs) || 0,
      all_fields: fields, // për kontroll gjatë testimit
    },
  },
];
