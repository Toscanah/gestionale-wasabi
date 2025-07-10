export enum DatePreset {
  TODAY = "today",
  YESTERDAY = "yesterday",
  LAST7 = "last7",
  LAST30 = "last30",
  THIS_MONTH = "thisMonth",
  THIS_YEAR = "thisYear",
}

const presetsName = [
  "Oggi",
  "Ieri",
  "Ultimi 7 giorni",
  "Ultimi 30 giorni",
  "Questo mese",
  "Questo anno",
] as const;

export const DATE_PRESETS: { name: (typeof presetsName)[number]; value: DatePreset }[] =
  presetsName.map((name, index) => ({
    name,
    value: Object.values(DatePreset)[index] as DatePreset,
  }));
