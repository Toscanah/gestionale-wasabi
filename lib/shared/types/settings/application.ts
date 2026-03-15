import { Printer } from "@/app/(site)/(domains)/settings/application/PrinterChoice";

export type WhatsappSettings = {
  active: boolean;
  sendOrderConf: boolean;
};

export type ApplicationSettings = {
  whenSelectorGap: number;
  selectedPrinter: Printer;
  whatsapp: WhatsappSettings;
};
