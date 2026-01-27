import { CustomerOrigin } from "@/prisma/generated/client/enums";

export const CUSTOMER_ORIGIN_LABELS: Record<CustomerOrigin, string> = {
  [CustomerOrigin.PHONE]: "Telefono",
  [CustomerOrigin.WEB]: "Web",
  [CustomerOrigin.REFERRAL]: "Passaparola",
  [CustomerOrigin.COUPON]: "Coupon",
  [CustomerOrigin.UNKNOWN]: "Sconosciuto",
};
