import axios from "axios";
import { MetaTemplate } from "../../shared";

const WABA_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;

const API_URL = `https://graph.facebook.com/v18.0/${WABA_ID}/message_templates`;

export async function getMetaTemplates(): Promise<MetaTemplate[]> {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    return response.data.data as MetaTemplate[];
  } catch (error: any) {
    console.error("❌ Failed to fetch templates:", error.response?.data || error.message);
    throw new Error("Could not retrieve WhatsApp templates");
  }
}
