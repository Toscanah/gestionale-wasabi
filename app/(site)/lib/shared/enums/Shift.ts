export enum ShiftFilterValue {
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  ALL = "ALL",
}

export const SHIFT_LABELS: Record<ShiftFilterValue, string> = {
  [ShiftFilterValue.LUNCH]: "Pranzo",
  [ShiftFilterValue.DINNER]: "Cena",
  [ShiftFilterValue.ALL]: "Pranzo + cena",
};

export enum ShiftBoundaries {
  LUNCH_FROM = 8.0,
  LUNCH_TO = 14.5,
  DINNER_FROM = 14.5,
  DINNER_TO = 22.5,
}
