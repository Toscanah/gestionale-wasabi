import {
  FlattenedAPIFilters,
  FlattenedAPIFiltersSchema,
} from "../../shared/schemas/common/filters/filters";
import normalizePeriod from "../../utils/global/date/normalizePeriod";
import {
  CUSTOMER_ORIGIN_LABELS,
  ENGAGEMENT_TYPES_LABELS,
  ORDER_TYPE_LABELS,
  Period,
  SHIFT_LABELS,
  WEEKDAY_LABELS,
  Weekday,
} from "../../shared";
import { FiltersMeta } from "../../../hooks/csv-export/useCsvExport";
import { format, formatDate } from "date-fns";
import { it } from "date-fns/locale";

/* -------------------------------------------- */
/* Utilities                                    */
/* -------------------------------------------- */

function escapeCsvValue(value: unknown): string {
  if (value == null) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function formatPeriod(period: Period["period"]): string {
  const normalized = normalizePeriod(period);
  if (!normalized) return "";
  return `${format(normalized.from, "dd/MM/yyyy", { locale: it })} → ${format(
    normalized.to,
    "dd/MM/yyyy",
    { locale: it }
  )}`;
}

type FormattedFilters = Array<[string, string]>;
type Formatter<T> = (filters: T, meta?: FiltersMeta) => FormattedFilters;

/* -------------------------------------------- */
/* Domain-specific formatters                   */
/* -------------------------------------------- */

const orderBaseFormatter: Formatter<FlattenedAPIFilters["orderBase"]> = (f) => {
  const out: FormattedFilters = [];
  const push = (label: string, value?: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    out.push([label, Array.isArray(value) ? value.join(", ") : value]);
  };

  if (f.period) push("Periodo ordini", formatPeriod(f.period));
  if (f.orderTypes?.length)
    push(
      "Tipi di ordine",
      f.orderTypes.map((t) => ORDER_TYPE_LABELS[t])
    );
  if (f.shift) push("Turno", SHIFT_LABELS[f.shift]);
  if (f.weekdays?.length)
    push(
      "Giorni della settimana",
      f.weekdays.map((w) => WEEKDAY_LABELS[w as Weekday])
    );
  if (f.timeWindow) push("Fascia oraria", `${f.timeWindow.from} - ${f.timeWindow.to}`);
  return out;
};

const orderPaymentsFormatter: Formatter<FlattenedAPIFilters["orderPayments"]> = (f) => {
  const out: FormattedFilters = [];
  const push = (label: string, value?: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    out.push([label, Array.isArray(value) ? value.join(", ") : value]);
  };

  if (f.shift) push("Turno (pagamenti)", SHIFT_LABELS[f.shift]);
  if (f.orderTypes?.length)
    push(
      "Tipi di ordine (pagamenti)",
      f.orderTypes.map((t) => ORDER_TYPE_LABELS[t])
    );
  if (f.period) push("Periodo pagamenti", formatPeriod(f.period));
  if (f.query?.trim()) push("Query pagamento", f.query.trim());
  return out;
};

const customerBaseFormatter: Formatter<FlattenedAPIFilters["customerBase"]> = (f) => {
  const out: FormattedFilters = [];
  const push = (label: string, value?: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    out.push([label, Array.isArray(value) ? value.join(", ") : value]);
  };

  if (f.query?.trim()) push("Query cliente", f.query.trim());
  if (f.customerOrigins?.length)
    push(
      "Origini cliente",
      f.customerOrigins.map((o) => CUSTOMER_ORIGIN_LABELS[o])
    );
  if (f.engagementTypes?.length)
    push(
      "Tipi di marketing",
      f.engagementTypes.map((t) => ENGAGEMENT_TYPES_LABELS[t])
    );

  if (f.orders) {
    const o = f.orders;
    if (o.period) push("Periodo ordini cliente", formatPeriod(o.period));
    if (o.shift) push("Turno ordini cliente", SHIFT_LABELS[o.shift]);
  }

  return out;
};

const customerStatsFormatter: Formatter<FlattenedAPIFilters["customerStats"]> = (f) => {
  const out: FormattedFilters = [];
  const push = (label: string, value?: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    out.push([label, Array.isArray(value) ? value.join(", ") : value]);
  };

  if (f.period) push("Periodo statistiche clienti", formatPeriod(f.period));
  if (f.ranks?.length) push("Ranghi clienti", f.ranks.map(String));
  if (f.customerOrigins?.length)
    push(
      "Origini cliente",
      f.customerOrigins.map((o) => CUSTOMER_ORIGIN_LABELS[o])
    );
  if (f.query?.trim()) push("Query cliente", f.query.trim());
  return out;
};

const productBaseFormatter: Formatter<FlattenedAPIFilters["productBase"]> = (f, meta) => {
  const out: FormattedFilters = [];
  const push = (label: string, value?: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    out.push([label, Array.isArray(value) ? value.join(", ") : value]);
  };

  if (f.query?.trim()) push("Query prodotto", f.query.trim());
  if (f.categoryIds?.length) {
    const { categories } = meta || {};
    push(
      "Categorie prodotto",
      f.categoryIds.map((id) => categories?.[id] ?? String(id))
    );
  }
  if (f.onlyActive !== undefined) push("Solo attivi", f.onlyActive ? "Sì" : "No");
  return out;
};

const productStatsFormatter: Formatter<FlattenedAPIFilters["productStats"]> = (f) => {
  const out: FormattedFilters = [];
  const push = (label: string, value?: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    out.push([label, Array.isArray(value) ? value.join(", ") : value]);
  };

  if (f.period) push("Periodo statistiche prodotti", formatPeriod(f.period));
  if (f.shift) push("Turno statistiche prodotti", SHIFT_LABELS[f.shift]);
  return out;
};

const promotionFormatter: Formatter<FlattenedAPIFilters["promotion"]> = (f) => {
  const out: FormattedFilters = [];
  const push = (label: string, value?: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    out.push([label, Array.isArray(value) ? value.join(", ") : value]);
  };

  if (f.promotionTypes?.length) push("Tipi di promozione", f.promotionTypes.join(", "));
  return out;
};

const paymentFormatter: Formatter<FlattenedAPIFilters["payment"]> = (f) => {
  const out: FormattedFilters = [];
  const push = (label: string, value?: string | string[]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return;
    out.push([label, Array.isArray(value) ? value.join(", ") : value]);
  };

  if (f.query?.trim()) push("Query pagamento", f.query.trim());
  if (f.period) push("Periodo pagamento", formatPeriod(f.period));
  if (f.shift) push("Turno pagamento", SHIFT_LABELS[f.shift]);
  if (f.orderTypes?.length)
    push(
      "Tipi di ordine (pagamento)",
      f.orderTypes.map((t) => ORDER_TYPE_LABELS[t])
    );
  return out;
};

const FILTER_FORMATTERS: {
  [K in keyof FlattenedAPIFilters]: Formatter<FlattenedAPIFilters[K]>;
} = {
  orderBase: orderBaseFormatter,
  orderPayments: orderPaymentsFormatter,
  customerBase: customerBaseFormatter,
  customerStats: customerStatsFormatter,
  productBase: productBaseFormatter,
  productStats: productStatsFormatter,
  payment: paymentFormatter,
  promotion: promotionFormatter,
};

export function formatCsvFilters(
  filters?: Partial<FlattenedAPIFilters>,
  filtersMeta?: FiltersMeta
): FormattedFilters {
  if (!filters) return [];
  const formatted: FormattedFilters = [];

  for (const key of Object.keys(filters) as (keyof FlattenedAPIFilters)[]) {
    const f = filters[key];
    if (f && FILTER_FORMATTERS[key]) {
      formatted.push(...FILTER_FORMATTERS[key](f as any, filtersMeta));
    }
  }

  return formatted;
}

export function csvFilterRows(formatted: FormattedFilters): string[] {
  if (formatted.length === 0) return [];
  const lines = [];
  formatted.forEach(([label, value]) => {
    lines.push(`${escapeCsvValue(label)},${escapeCsvValue(value)}`);
  });
  lines.push("");
  return lines;
}
