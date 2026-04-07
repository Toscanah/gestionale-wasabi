import { CustomerDiscountTypeSchema } from "../../models";
import { CustomerDiscountType } from "../../types";

const E = CustomerDiscountTypeSchema.enum;

export const CUSTOMER_DISCOUNT_LABELS: Record<CustomerDiscountType, string> = {
  [E.NONE]: "Nessuno",
  [E.FIXED]: "Sconto Fisso (€)",
  [E.PERCENTAGE]: "Sconto Percentuale (%)",
};
