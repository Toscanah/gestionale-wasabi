import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import columns from "./columns";
import getTable from "@/app/(site)/lib/utils/global/getTable";
import Table from "@/app/(site)/components/table/Table";
import { Dispatch, SetStateAction } from "react";
import { useCreateHomeOrder } from "@/app/(site)/context/CreateHomeOrderContext";

export default function PossibleCustomers() {
  const { setPhone, possibleCustomers, setPossibleCustomers } = useCreateHomeOrder();
  const table = getTable<CustomerWithDetails>({
    data: possibleCustomers.filter((customer) => customer.active),
    columns: columns(setPossibleCustomers),
  });

  return (
    <Table
      forceRowClick
      table={table}
      tableClassName="max-w-full "
      headerClassName="" // *:text-2xl
      double
      onRowClick={(customer) => setPhone(customer.phone?.phone ?? "")}
    />
  );
}
