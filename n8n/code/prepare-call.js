// n8n Code node "Përgatit thirrjen" (Mode: Run Once for Each Item)
// Workflow: END Call Agent - Lead intake
// Para tij: "Shëno thirrjen" (Data table → Update, kthen rreshtin e përditësuar).
// Ndërton trupin e kërkesës për ElevenLabs.
// Tani (Twilio): POST /v1/convai/twilio/outbound-call
// Më vonë (numri i kompanisë te du/e&, SIP): POST /v1/convai/sip-trunk/outbound-call

const AGENT_ID = 'agent_8201m7htqaqsfxht7r924r64vfjk';  // END Call Agent
const PHONE_NUMBER_ID = 'VENDOSE_PAS_TWILIO';            // ID e numrit në ElevenLabs (Phone Numbers), pasi të importohet numri i Twilio-s

const r = $json;
const lang0 = r.language === 'sq' ? 'sq' : 'en';
const GENERIC_PROJECT = { en: 'our properties in Dubai', sq: 'pronat tona në Dubai' };
const project = r.project_name && r.project_name !== 'END Properties' ? r.project_name : GENERIC_PROJECT[lang0];

// Fjalia e parë: lead i ri (plotësoi formularin tani) ose follow-up (lead i vjetër).
const followup = r.call_type === 'followup';
const FIRST = followup
  ? {
      en: `Hello, this is the AI assistant of END Properties. Some time ago you asked us about ${project}. This call is recorded, is that okay with you?`,
      sq: `Përshëndetje, jam asistenti AI i END Properties. Pak kohë më parë na keni kontaktuar për ${project}. Kjo thirrje regjistrohet, a jeni dakord?`,
    }
  : {
      en: `Hello, this is the AI assistant of END Properties. You filled in a form about ${project}. This call is recorded, is that okay with you?`,
      sq: `Përshëndetje, jam asistenti AI i END Properties. Keni plotësuar një formular për ${project}. Kjo thirrje regjistrohet, a jeni dakord?`,
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
          call_type: followup ? 'followup' : 'new',
        },
        conversation_config_override: {
          agent: { first_message: FIRST[lang] },
        },
      },
    },
    row_id: r.id,
  },
};
