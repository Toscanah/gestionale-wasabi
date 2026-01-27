export default function getMetaSecrets() {
  const { WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN, WHATSAPP_BUSINESS_ACCOUNT_ID } =
    process.env;

  if (!WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error("Missing WHATSAPP_PHONE_NUMBER_ID in environment");
  }

  if (!WHATSAPP_ACCESS_TOKEN) {
    throw new Error("Missing WHATSAPP_ACCESS_TOKEN in environment");
  }

  if (!WHATSAPP_BUSINESS_ACCOUNT_ID) {
    throw new Error("Missing WHATSAPP_BUSINESS_ACCOUNT_ID in environment");
  }

  return {
    WHATSAPP_PHONE_NUMBER_ID,
    WHATSAPP_ACCESS_TOKEN,
    WHATSAPP_BUSINESS_ACCOUNT_ID,
  };
}
