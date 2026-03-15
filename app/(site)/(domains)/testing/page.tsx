"use client";

import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/api/client";
import { useState } from "react";
import { toast } from "sonner";

export default function TestingPage() {
  const [jsonData, setJsonData] = useState<string | null>(null);

  // Kitchen capacity query
  const {
    data: capacityData,
    isLoading: capacityLoading,
    refetch: refetchCapacity,
  } = trpc.orders.computeKitchenCapacity.useQuery();

  // Export mutation
  const exportMutation = trpc.orders.exportToday.useMutation({
    onSuccess: (data) => {
      const jsonString = JSON.stringify(data, null, 2);
      setJsonData(jsonString);

      // Download as JSON file
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `today-orders-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Exported ${data.metadata.total_orders} orders`);
    },
    onError: (error) => {
      toast.error(`Export failed: ${error.message}`);
    },
  });

  const handleExport = () => {
    exportMutation.mutate();
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">Order Analysis Tools</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Export orders and analyze kitchen capacity metrics
        </p>
      </div>

      {/* Kitchen Capacity Card */}
      <div className="w-full max-w-2xl bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Kitchen Capacity Analysis</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchCapacity()}
            disabled={capacityLoading}
          >
            {capacityLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {capacityData && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Safe Capacity</div>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {capacityData.safeCapacity}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  orders/slot (low delay)
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Collapse Point</div>
                <div className="text-4xl font-bold text-red-600 dark:text-red-400">
                  {capacityData.collapsePoint ?? 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  orders/slot (high delay)
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Average</div>
                <div className="text-4xl font-bold">
                  {capacityData.averageOrdersPerSlot.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  orders/slot (overall)
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dinner Period:</span>
                <span className="font-medium">{capacityData.metadata.dinnerPeriod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slot Duration:</span>
                <span className="font-medium">{capacityData.metadata.slotDuration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Days Analyzed:</span>
                <span className="font-medium">{capacityData.metadata.totalDatesAnalyzed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Slot Instances:</span>
                <span className="font-medium">{capacityData.metadata.totalInstancesAnalyzed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Orders:</span>
                <span className="font-medium">{capacityData.metadata.totalOrdersAnalyzed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Safe Threshold:</span>
                <span className="font-medium">{capacityData.metadata.safeThreshold}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Collapse Threshold:</span>
                <span className="font-medium">{capacityData.metadata.collapseThreshold}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Excluded Days:</span>
                <span className="font-medium">{capacityData.metadata.excludedDays.join(", ")}</span>
              </div>
            </div>

            {/* Slot Summaries (averaged across dates) */}
            {capacityData.slotSummaries.length > 0 && (
              <details className="pt-4 border-t">
                <summary className="cursor-pointer font-medium text-sm hover:text-primary">
                  Slot Averages ({capacityData.slotSummaries.length} time slots)
                </summary>
                <div className="mt-3 max-h-48 overflow-auto space-y-2">
                  {capacityData.slotSummaries.map((slot) => {
                    const delayPercent = (slot.avgDelayRate * 100).toFixed(1);
                    const isSafe = slot.avgDelayRate < 0.15;
                    const isCollapse = slot.avgDelayRate > 0.40;

                    return (
                      <div
                        key={slot.slotTime}
                        className={`flex justify-between items-center text-sm p-2 rounded ${
                          isCollapse
                            ? "bg-red-500/10 border border-red-500/20"
                            : isSafe
                              ? "bg-green-500/10 border border-green-500/20"
                              : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold">{slot.slotTime}</span>
                          <span className="text-muted-foreground text-xs">
                            ({slot.instances} day{slot.instances !== 1 ? "s" : ""})
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">~{slot.avgOrders} orders</span>
                          <span
                            className={`text-xs font-medium ${
                              isCollapse
                                ? "text-red-600 dark:text-red-400"
                                : isSafe
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {delayPercent}% delay
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            )}

            {/* Per-date slot instances */}
            {capacityData.slotInstances.length > 0 && (
              <details className="pt-4 border-t">
                <summary className="cursor-pointer font-medium text-sm hover:text-primary">
                  All Slot Instances ({capacityData.slotInstances.length} total)
                </summary>
                <div className="mt-3 max-h-64 overflow-auto space-y-2">
                  {capacityData.slotInstances.map((inst) => {
                    const delayPercent = (inst.delayRate * 100).toFixed(1);
                    const isSafe = inst.delayRate < 0.15;
                    const isCollapse = inst.delayRate > 0.40;

                    return (
                      <div
                        key={`${inst.date}-${inst.slotTime}`}
                        className={`flex justify-between items-center text-sm p-2 rounded ${
                          isCollapse
                            ? "bg-red-500/10 border border-red-500/20"
                            : isSafe
                              ? "bg-green-500/10 border border-green-500/20"
                              : "bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono">{inst.date}</span>
                          <span className="font-mono font-bold">{inst.slotTime}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{inst.totalOrders} orders</span>
                          <span className="text-xs text-muted-foreground">
                            ({inst.ordersWithDiscount} discounted)
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              isCollapse
                                ? "text-red-600 dark:text-red-400"
                                : isSafe
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {delayPercent}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>
            )}
          </div>
        )}

        {capacityLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading capacity data...</div>
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="w-full max-w-2xl bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Export Today's Orders</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Export all orders created today with comprehensive data for AI analysis of capacity,
          latency, and discount patterns.
        </p>

        <Button
          className="w-full h-12 text-lg font-bold"
          onClick={handleExport}
          disabled={exportMutation.isPending}
        >
          {exportMutation.isPending ? "Exporting..." : "Export Today's Orders"}
        </Button>
      </div>

      {jsonData && (
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Export Preview</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(jsonData);
                toast.success("Copied to clipboard");
              }}
            >
              Copy JSON
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-xs">{jsonData}</pre>
        </div>
      )}
    </div>
  );
}
