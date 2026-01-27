import { TemplateFormat } from "@/lib/shared";

export default function getStaticHeaderDescription(format: TemplateFormat): string {
  switch (format) {
    case TemplateFormat.IMAGE:
      return "Questo messaggio ha un'immagine nell'intestazione.";
    case TemplateFormat.VIDEO:
      return "Questo messaggio ha un video nell'intestazione.";
    case TemplateFormat.DOCUMENT:
      return "Questo messaggio ha un documento nell'intestazione.";
    case TemplateFormat.LOCATION:
      return "Questo messaggio include una posizione.";
    default:
      return "";
  }
}
