import axios from "axios";
import prisma from "../../db/db";
import { MetaContracts } from "../../shared";
import { MessageDirection } from "@prisma/client";
import getMetaSecrets from "../../services/meta/getMetaSecrets";
import { getOrderById } from "../../db/orders/getOrderById";

export default async function sendMetaMessage({
  template,
  params,
  orderId,
}: MetaContracts.SendMessage.Input): Promise<MetaContracts.SendMessage.Output> {
  const { WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN } = getMetaSecrets();
  const API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const homeOrder = await prisma.homeOrder.findUnique({
    where: { id: orderId },
    include: {
      customer: {
        include: { phone: true },
      },
      order: true,
      messages: true,
    },
  });

  if (!homeOrder) throw new Error("HomeOrder not found");

  const phone = homeOrder.customer.phone.phone;
  if (!phone) throw new Error("Missing customer's phone number");

  if (phone.startsWith("040")) {
    return await getOrderById({ orderId });
  }

  // const tempAllowedPhones = ["3342954184", "3339998542"];

  // if (!tempAllowedPhones.includes(phone)) {
  //   throw new Error("Phone number not allowed");
  // }

  const to = "39" + phone;

  // Helper: convert { "0": "abc", "1": "def" } to ordered array of WhatsApp params
  const toParams = (record?: Record<string, string>) => {
    return Object.entries(record ?? {})
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([, value]) => ({ type: "text", text: value }));
  };

  const components: any[] = [];

  if (params.header_text && Object.keys(params.header_text).length > 0) {
    components.push({
      type: "header",
      parameters: toParams(params.header_text),
    });
  }

  if (params.body_text && Object.keys(params.body_text).length > 0) {
    components.push({
      type: "body",
      parameters: toParams(params.body_text),
    });
  }

  if (params.button_url && Object.keys(params.button_url).length > 0) {
    Object.entries(params.button_url).forEach(([index, value]) => {
      components.push({
        type: "button",
        sub_type: "url", // adjust if needed (e.g., QUICK_REPLY or PHONE_NUMBER not supported with `sub_type`)
        index, // must be string: "0", "1", etc.
        parameters: [{ type: "text", text: value }],
      });
    });
  }

  try {
    await axios.post<MetaContracts.SendMessage.Output>(
      API_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: template.name,
          language: { code: "it" }, // or "en_US"
          components,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    await prisma.metaMessageLog.create({
      data: {
        home_order_id: homeOrder.id,
        template_name: template.name,
        template_id: template.id,
        direction: MessageDirection.OUTBOUND,
      },
    });

    return await getOrderById({ orderId });
  } catch (error: any) {
    console.error("❌ Failed to send WhatsApp message:", error.response?.data || error.message);
    throw error;
  }
}
