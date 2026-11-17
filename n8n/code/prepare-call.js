// n8n Code node "Përgatit thirrjen" (Mode: Run Once for Each Item)
// Workflow: END Call Agent - Lead intake
// Para tij: "Shëno thirrjen" (Data table → Update, kthen rreshtin e përditësuar).
// Ndërton trupin e kërkesës për ElevenLabs: POST /v1/convai/sip-trunk/outbound-call

const AGENT_ID = 'agent_8201m7htqaqsfxht7r924r64vfjk';  // END Call Agent
const PHONE_NUMBER_ID = 'VENDOSE_PAS_CALLGEAR';          // ID e numrit në ElevenLabs (Phone Numbers), pasi të lidhet Callgear

const r = $json;
const project = r.project_name || 'END Properties';

const FIRST = {
  en: `Hello, this is the AI assistant of END Properties. You filled in a form about ${project}. This call is recorded. Do you have a minute?`,
  sq: `Përshëndetje, jam asistenti AI i END Properties. Keni plotësuar një formular për ${project}. Kjo thirrje regjistrohet. A keni një minutë?`,
};
const lang = r.language === 'sq' ? 'sq' : 'en';

return {
  json: {
    callBody: {
      agent_id: AGENT_ID,
      agent_phone_number_id: PHONE_NUMBER_ID,
      to_number: r.phone,
      conversation_initiation_client_data: {
        dynamic_variables: {
          project_name: project,
          language: lang,
          lead_name: r.lead_name || '',
          pixxi_lead_id: String(r.pixxi_lead_id),
        },
        conversation_config_override: {
          agent: { first_message: FIRST[lang] },
        },
      },
      telephony_call_config: { ringing_timeout_secs: 30 },
    },
    row_id: r.id,
  },
};
