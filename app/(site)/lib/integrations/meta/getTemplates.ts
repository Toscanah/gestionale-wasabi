import axios from "axios";
import { MetaContracts } from "../../shared";
import getMetaSecrets from "../../services/meta/getMetaSecrets";

export async function getTemplates(
  input: MetaContracts.GetTemplates.Input
): Promise<MetaContracts.GetTemplates.Output> {
  const { WHATSAPP_BUSINESS_ACCOUNT_ID, WHATSAPP_ACCESS_TOKEN } = getMetaSecrets();
  const API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`;

  return []

  try {
    const response = await axios.get<MetaContracts.GetTemplates.Output>(API_URL, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to fetch templates:", error.response?.data || error.message);
    throw new Error("Could not retrieve WhatsApp templates");
  }
}
