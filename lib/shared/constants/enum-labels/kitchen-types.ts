import { KitchenType } from "@/prisma/generated/client/enums";

export const KITCHEN_TYPE_LABELS: Record<KitchenType, string> = {
  [KitchenType.NONE]: "Nessuna",
  [KitchenType.HOT_AND_COLD]: "Cucina calda e fredda",
  [KitchenType.COLD]: "Cucina fredda",
  [KitchenType.HOT]: "Cucina calda",
  [KitchenType.OTHER]: "Altro",
};
