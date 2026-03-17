import { PREDEFINED_PRINTERS } from "@/app/(site)/(domains)/settings/application/PrinterChoice";
import { GlobalSettings } from "../../types";

export const DEFAULT_SETTINGS: GlobalSettings = {
  profile: {
    address: { cap: "34135", city: "Trieste", civic: "2/b", street: "Scala al Belvedere" },
    name: "Wasabi Sushi",
    slogan: "",
    cellNumber: "338 1278651",
    telNumber: "040 4702081",
    pIva: "01152790323",
  },
  operational: {
    kitchen: { offset: 20, maxCapacity: 12, safeCapacity: 10 },
    businessHours: {
      lunch: { opening: "12:00", closing: "14:30" },
      dinner: { opening: "18:30", closing: "22:30" },
    },
    timings: {
      standardPrepTime: 20,
      standardDeliveryTime: 15,
    },
    riders: {
      avgPerHour: 3,
      count: 5,
    },
  },
  application: {
    whenSelectorGap: 5,
    selectedPrinter: PREDEFINED_PRINTERS[0],
    whatsapp: {
      active: false,
      sendOrderConf: false,
    },
  },
};
