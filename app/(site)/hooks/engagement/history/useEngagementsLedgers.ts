import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { EngagementLedgerWithDetails } from "@/app/(site)/lib/shared";
import { EngagementLedger, EngagementLedgerStatus } from "@prisma/client";
import { useEffect, useState } from "react";

interface UseEngagementsLedgersParams {
  customerId: number;
}

export default function useEngagementsLedgers({ customerId }: UseEngagementsLedgersParams) {
  const [ledgers, setLedgers] = useState<EngagementLedgerWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateLedgerStatus = (ledgerId: number, status: EngagementLedgerStatus) => {
    fetchRequest<EngagementLedger>("PATCH", "/api/engagements/", "updateLedgerStatus", {
      ledgerId,
      status,
    }).then((updatedLedger) => {
      setLedgers((prev) =>
        prev.map((ledger) => (ledger.id === ledgerId ? { ...ledger, ...updatedLedger } : ledger))
      );
    });
  };

  useEffect(() => {
    fetchRequest<EngagementLedgerWithDetails[]>(
      "GET",
      "/api/engagements/",
      "getEngagementsLedgersByCustomer",
      { customerId }
    )
      .then(setLedgers)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { ledgers, updateLedgerStatus, isLoading };
}
