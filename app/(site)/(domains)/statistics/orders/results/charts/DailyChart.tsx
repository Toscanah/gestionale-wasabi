import { OrderContracts, OrdersStats } from "@/app/(site)/lib/shared";
import { ChartMode, ChartType, Metric, SelectableTypes } from "./ChartSection";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
  Label,
} from "recharts";
import formatRice from "@/app/(site)/lib/utils/domains/rice/formatRice";
import { TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react/dist/ssr";
import { EqualIcon } from "lucide-react";
import { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// ----------------- TYPES -----------------
type DailyChartProps = {
  data: OrderContracts.ComputeDailyStats.Output;
  title: string;
  metric: Metric;
  label: string;
  mode: ChartMode; // "esplicito" | "andamento"
  type?: ChartType;
  description?: ReactNode;
  isLoading?: boolean;
  id?: string;
  visibleTypes: SelectableTypes[];
};

// ----------------- CONFIG -----------------
const CHART_CONFIG = {
  home: { label: "Domicilio", color: "var(--chart-1)" },
  pickup: { label: "Asporto", color: "var(--chart-2)" },
  table: { label: "Tavoli", color: "var(--chart-3)" },
  total: { label: "Totale", color: "var(--chart-4)" },
} satisfies ChartConfig;

const dayKey = (d: Date | string) => {
  const dt = typeof d === "string" ? new Date(d) : d;
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d2 = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d2}`;
};

const FORMATTERS: Record<Metric, (value: number) => any> = {
  orders: (v) => v.toLocaleString("it-IT"),
  revenue: (v) => `€ ${v.toLocaleString("it-IT", { minimumFractionDigits: 2 })}`,
  products: (v) => v.toLocaleString("it-IT"),
  soups: (v) => v.toLocaleString("it-IT"),
  rices: (v) => `${v.toLocaleString("it-IT")}`,
  salads: (v) => v.toLocaleString("it-IT"),
  rice: (v) => formatRice(v),
  revenuePerOrder: (v) => `€ ${v.toLocaleString("it-IT", { minimumFractionDigits: 2 })}`,
  day: (v) => v,
};

// ----------------- UTILS -----------------
function linearRegression(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n === 0) return { a: 0, b: 0 };

  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  for (let i = 0; i < n; i++) {
    const x = xs[i];
    const y = ys[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return { a: 0, b: sumY / n || 0 };
  const a = (n * sumXY - sumX * sumY) / denom;
  const b = (sumY - a * sumX) / n;
  return { a, b };
}

// ----------------- COMPONENT -----------------
export default function DailyChart({
  data,
  title,
  metric,
  mode,
  type = "line",
  description,
  isLoading,
  id,
  visibleTypes,
}: DailyChartProps) {
  // --- Collect all worked days (days where at least one type has >0 orders)
  const workedDayKeys = new Set<string>();
  Object.values(data).forEach((rows) =>
    rows.forEach((r) => {
      if ((r.orders ?? 0) > 0) workedDayKeys.add(dayKey(r.day));
    })
  );
  const orderedDays = Array.from(workedDayKeys).sort();

  // --- Build per-type series maps
  const seriesMaps: Record<OrdersStats.LowerOrderTypeEnum, Record<string, number | null>> = {
    home: {},
    pickup: {},
    table: {},
  };

  (Object.keys(seriesMaps) as OrdersStats.LowerOrderTypeEnum[]).forEach((type) => {
    const rows = data[type] ?? [];
    rows.forEach((r) => {
      const k = dayKey(r.day);
      const v = (r as any)[metric];
      if (workedDayKeys.has(k)) {
        seriesMaps[type][k] = typeof v === "number" ? v : null;
      }
    });
  });

  const chartData = orderedDays.map((k, idx) => {
    const home = seriesMaps.home[k] ?? 0;
    const pickup = seriesMaps.pickup[k] ?? 0;
    const table = seriesMaps.table[k] ?? 0;
    return {
      index: idx,
      day: k,
      home,
      pickup,
      table,
      total: home + pickup + table,
    };
  });

  // --- TREND DATA ---
  const makeTrend = (key: "home" | "pickup" | "table" | "total") => {
    const xs: number[] = [];
    const ys: number[] = [];
    chartData.forEach((row) => {
      const y = row[key];
      if (typeof y === "number") {
        xs.push(row.index);
        ys.push(y);
      }
    });
    const { a, b } = linearRegression(xs, ys);
    const preds: Record<string, number | null> = {};
    chartData.forEach((row) => {
      preds[row.day] = a * row.index + b;
    });
    return { preds, slope: a };
  };

  const homeTrend = makeTrend("home");
  const pickupTrend = makeTrend("pickup");
  const tableTrend = makeTrend("table");
  const totalTrend = makeTrend("total");

  const trendData = chartData.map((row) => ({
    ...row,
    homeTrend: homeTrend.preds[row.day],
    pickupTrend: pickupTrend.preds[row.day],
    tableTrend: tableTrend.preds[row.day],
    totalTrend: totalTrend.preds[row.day],
  }));

  // --- STATS SUMMARY ---
  const stats =
    mode === "andamento" && type === "line"
      ? (() => {
          const totals = chartData
            .map((d) => d.total)
            .filter((v) => typeof v === "number" && v > 0);
          if (!totals.length) return null;

          const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
          const min = Math.min(...totals);
          const max = Math.max(...totals);

          const { slope } = totalTrend;
          const trendPct = (slope / avg) * 100;
          return { avg, min, max, trendPct };
        })()
      : null;

  let pieData: {
    name: string;
    key: string;
    value: number;
    color: string;
  }[] = [];

  const homeValue = chartData.reduce((s, d) => s + (d.home ?? 0), 0);
  const pickupValue = chartData.reduce((s, d) => s + (d.pickup ?? 0), 0);
  const tableValue = chartData.reduce((s, d) => s + (d.table ?? 0), 0);
  const totalValue = homeValue + pickupValue + tableValue;

  if (
    visibleTypes.includes("total") &&
    !visibleTypes.some((t) => ["home", "pickup", "table"].includes(t))
  ) {
    pieData = [
      {
        name: CHART_CONFIG.total.label,
        key: "total",
        value: totalValue,
        color: CHART_CONFIG.total.color,
      },
    ];
  } else {
    pieData = [
      {
        name: CHART_CONFIG.home.label,
        key: "home",
        value: homeValue,
        color: CHART_CONFIG.home.color,
      },
      {
        name: CHART_CONFIG.pickup.label,
        key: "pickup",
        value: pickupValue,
        color: CHART_CONFIG.pickup.color,
      },
      {
        name: CHART_CONFIG.table.label,
        key: "table",
        value: tableValue,
        color: CHART_CONFIG.table.color,
      },
    ].filter((entry) => visibleTypes.includes(entry.key as SelectableTypes));
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="h-9 w-full">
          <Skeleton className="h-9 w-full rounded-lg" />
        </CardHeader>

        <CardContent className="w-full">
          <Skeleton className="h-72 w-full rounded-lg" />
        </CardContent>

        <CardFooter className="h-9 w-full">
          <Skeleton className="h-9 w-full rounded-lg" />
        </CardFooter>
      </Card>
    );
  }

  // ----------------- RENDER -----------------
  return (
    <Card
      className="
    transition-all duration-75 ease-out
    hover:shadow-xl hover:shadow-muted-foreground/10
    hover:-translate-y-[1px]
    hover:ring-1 hover:ring-muted-foreground/50
    bg-card/80 backdrop-blur-sm
  "
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="text-sm text-muted-foreground leading-relaxed space-y-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="w-full">
        <ChartContainer config={CHART_CONFIG} className="h-72 w-full overflow-hidden">
          {type === "line" ? (
            <LineChart
              data={mode === "esplicito" ? chartData : trendData}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                interval="preserveStartEnd"
                tickFormatter={(k) =>
                  new Date(k).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })
                }
              />

              {mode === "andamento" ? null : (
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={4} />
              )}

              {mode === "andamento" ? null : (
                <ChartTooltip
                  cursor
                  content={
                    <ChartTooltipContent
                      className="w-[110%]"
                      valueFormatter={(v) => FORMATTERS[metric]?.(Number(v)) ?? v}
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("it-IT", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      }
                      indicator={mode === "esplicito" ? "dot" : "line"}
                    />
                  }
                />
              )}

              <Legend verticalAlign="top" height={36} />

              {(
                [
                  ["home", "homeTrend", "Domicilio"],
                  ["pickup", "pickupTrend", "Asporto"],
                  ["table", "tableTrend", "Tavoli"],
                  ["total", "totalTrend", "Totale"],
                ] as const
              )
                // Show only selected lines; show "total" only if user selected it explicitly
                .filter(([key]) => visibleTypes.includes(key as SelectableTypes))
                .map(([baseKey, trendKey, label]) => (
                  <Line
                    key={baseKey}
                    name={label}
                    dataKey={mode === "esplicito" ? baseKey : trendKey}
                    type="linear"
                    dot={false}
                    connectNulls
                    stroke={`var(--color-${baseKey})`}
                    strokeWidth={mode === "esplicito" ? 2 : 3}
                    strokeOpacity={mode === "esplicito" ? 0.8 : 1}
                  />
                ))}
            </LineChart>
          ) : (
            <PieChart syncId={"cake"}>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="w-[110%]"
                    valueFormatter={(v) => FORMATTERS[metric]?.(Number(v)) ?? v}
                    hideLabel
                  />
                }
              />
              <Pie
                data={pieData}
                label={(entry) =>
                  FORMATTERS[metric]
                    ? FORMATTERS[metric](entry.value)
                    : entry.value.toLocaleString("it-IT")
                }
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={2}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
                      const formatted = FORMATTERS[metric]
                        ? FORMATTERS[metric](total)
                        : total.toLocaleString("it-IT");
                      const fontSize = `${Math.max(1, 3 - formatted.length * 0.2)}rem`;

                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground font-bold"
                            style={{ fontSize }}
                          >
                            {formatted}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="top" height={36} />
            </PieChart>
          )}
        </ChartContainer>
      </CardContent>

      {stats && (
        <CardFooter className="flex flex-col items-center justify-center gap-1 text-sm text-muted-foreground">
          <div>
            Minimo: {FORMATTERS[metric](stats.min)} | Massimo: {FORMATTERS[metric](stats.max)}
          </div>
          <div
            className={`font-medium flex gap-2 ${
              stats.trendPct > 0 ? "text-green-500" : stats.trendPct < 0 ? "text-red-500" : ""
            }`}
          >
            {stats.trendPct > 0 ? (
              <TrendUpIcon />
            ) : stats.trendPct < 0 ? (
              <TrendDownIcon />
            ) : (
              <EqualIcon />
            )}{" "}
            {Math.abs(stats.trendPct).toFixed(3)}% rispetto alla media
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
