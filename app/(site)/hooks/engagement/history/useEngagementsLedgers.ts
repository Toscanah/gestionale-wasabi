import { trpc } from "@/lib/server/client";
import { EngagementLedgerStatus } from "@/prisma/generated/client/enums";

interface UseEngagementsLedgersParams {
  customerId: number;
}

export default function useEngagementsLedgers({ customerId }: UseEngagementsLedgersParams) {
  const { data: ledgers = [], isLoading } = trpc.engagements.getLedgersByCustomer.useQuery(
    { customerId },
    { enabled: !!customerId }
  );

  const utils = trpc.useUtils();
  const updateLedgerStatusMutation = trpc.engagements.updateLedgerStatus.useMutation({
    onSuccess: (updatedLedger) => {
      utils.engagements.getLedgersByCustomer.setData({ customerId }, (prev) =>
        prev
          ? prev.map((ledger) =>
              ledger.id === updatedLedger.id ? { ...ledger, ...updatedLedger } : ledger
            )
          : []
      );
    },
    onError: (error) => {
      console.error("Failed to update ledger status:", error);
    },
  });

  const updateLedgerStatus = (
    ledgerId: number,
    orderId: number,
    status: EngagementLedgerStatus
  ) => {
    updateLedgerStatusMutation.mutate({ ledgerId, orderId, status });
  };

  return { ledgers, updateLedgerStatus, isLoading };
}
