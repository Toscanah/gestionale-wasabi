import { ShiftFilterValue } from "../../enums/shift";

export const SHIFT_LABELS: Record<ShiftFilterValue, string> = {
  [ShiftFilterValue.LUNCH]: "Pranzo",
  [ShiftFilterValue.DINNER]: "Cena",
  [ShiftFilterValue.ALL]: "Pranzo + cena",
};
