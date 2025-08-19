import useEngagementsLedgers from "@/app/(site)/hooks/engagement/history/useEngagementsLedgers";
import getTable from "@/app/(site)/lib/utils/global/getTable";
import columns from "./columns";
import Table from "@/app/(site)/components/table/Table";
import { EngagementLedgerStatus } from "@prisma/client";
import Loader from "@/app/(site)/components/ui/misc/loader/Loader";

interface EngagementHistoryProps {
  customerId: number;
  orderId: number
}

export type EngagementHistoryTableMeta = {
  updateLedgerStatus: (ledgerId: number, status: EngagementLedgerStatus) => void;
  orderId: number;
};

export default function EngagementHistory({ customerId, orderId }: EngagementHistoryProps) {
  const { ledgers, updateLedgerStatus, isLoading } = useEngagementsLedgers({ customerId });

  const table = getTable({ data: ledgers, columns, meta: { updateLedgerStatus, orderId } });

  return (
    <Loader isLoading={isLoading}>
      {ledgers.length > 0 ? (
        <Table table={table} tableClassName="max-h-[70vh]" />
      ) : (
        <p className="text-muted-foreground w-full flex justify-center">
          Nessuno storico disponibile
        </p>
      )}
    </Loader>
  );
}
