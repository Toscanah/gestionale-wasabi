import { format } from "date-fns";
import { it } from "date-fns/locale";
import capitalizeFirstLetter from "../utils/global/string/capitalizeFirstLetter";
// import capitalizeFirstLetter from "@/lib/utils/global/string/capitalizeFirstLetter";

export const ITALIAN_MONTHS = Array.from({ length: 12 }, (_, i) =>
  capitalizeFirstLetter(format(new Date(2025, i, 1), "LLLL", { locale: it }))
);
