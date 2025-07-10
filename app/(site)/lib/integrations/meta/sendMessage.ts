import axios from "axios";
import prisma from "../../db/db";

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;
const API_URL = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

type SendMessageOptions = {
  templateName: string;
  params: string[];
  orderId: number;
};

export async function sendMessage(options: SendMessageOptions): Promise<void> {
  const { templateName, params, orderId } = options;

  const homeOrder = await prisma.homeOrder.findUnique({
    where: { order_id: orderId },
    include: {
      customer: {
        include: {
          phone: true,
        },
      },
      order: true,
      messages: true,
    },
  });

  if (!homeOrder) throw new Error("HomeOrder not found");
  const to = homeOrder.customer?.phone?.phone;
  if (!to) throw new Error("Missing customer's phone number");

  try {
    await axios.post(
      API_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "it_IT" }, // or "en_US" depending on your templates
          components: [
            {
              type: "body",
              parameters: params.map((text) => ({ type: "text", text })),
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    await prisma.metaMessageLog.create({
      data: {
        home_order_id: homeOrder.id,
        template_name: templateName,
      },
    });
  } catch (error: any) {
    console.error("❌ Failed to send WhatsApp message:", error.response?.data || error.message);
  }
}
