import { ComprehensiveCustomer } from "@/app/(site)/lib/shared";
import columns from "./columns";
import useTable from "@/app/(site)/hooks/table/useTable";
import Table from "@/app/(site)/components/table/Table";
import { useCreateHomeOrder } from "@/app/(site)/context/CreateHomeOrderContext";

export default function PossibleCustomers() {
  const { setPhone, possibleCustomers } = useCreateHomeOrder();
  const table = useTable<ComprehensiveCustomer>({
    data: possibleCustomers.filter((customer) => customer.active),
    columns: columns,
  });

  return (
    <Table
      forceRowClick
      table={table}
      tableClassName="max-w-full overflow-y-auto max-h-full"
      headerClassName="" // *:text-2xl
      double
      onRowClick={(customer) => setPhone(customer.phone?.phone ?? "")}
    />
  );
}
