import useEngagementsLedgers from "@/app/(site)/hooks/engagement/history/useEngagementsLedgers";
import useTable from "@/app/(site)/hooks/table/useTable";
import columns from "./columns";
import Table from "@/app/(site)/components/table/Table";
import { EngagementLedgerStatus } from "@prisma/client";
import Loader from "@/app/(site)/components/ui/misc/loader/Loader";

interface EngagementHistoryProps {
  customerId: number;
  orderId: number;
}

export type EngagementHistoryTableMeta = {
  updateLedgerStatus: (ledgerId: number, status: EngagementLedgerStatus) => void;
  orderId: number;
};

export default function EngagementHistory({ customerId, orderId }: EngagementHistoryProps) {
  const { ledgers, updateLedgerStatus, isLoading } = useEngagementsLedgers({ customerId });

  const sortedLedgers = [...ledgers].sort(
    (a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime()
  );
  const table = useTable({
    data: sortedLedgers,
    columns,
    meta: {
      updateLedgerStatus: (ledgerId: number, status: EngagementLedgerStatus) =>
        updateLedgerStatus(ledgerId, orderId, status),
      orderId,
    },
  });

  return (
    <Loader isLoading={isLoading}>
      {ledgers.length > 0 ? (
        <Table
          table={table}
          tableClassName="max-h-[70vh]"
          cellClassName={(i) => (i == 3 ? "w-[35rem] max-w-[35rem]" : "")}
        />
      ) : (
        <p className="text-muted-foreground w-full flex justify-center">
          Nessuno storico disponibile
        </p>
      )}
    </Loader>
  );
}
