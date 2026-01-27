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
  LUNCH_TO = 15.0,
  DINNER_FROM = 15.0,
  DINNER_TO = 22.5,
}
