import { CustomerWithDetails } from "@/app/(site)/models";
import columns from "./columns";
import getTable from "@/app/(site)/functions/util/getTable";
import Table from "@/app/(site)/components/table/Table";
import { Dispatch, SetStateAction } from "react";

interface PossibleCustomersProps {
  possibleCustomers: CustomerWithDetails[];
  setPhone: Dispatch<SetStateAction<string>>;
  setPossibleCustomers: Dispatch<SetStateAction<CustomerWithDetails[]>>;
}

export default function PossibleCustomers({
  possibleCustomers,
  setPhone,
  setPossibleCustomers,
}: PossibleCustomersProps) {
  const table = getTable<CustomerWithDetails>({
    data: possibleCustomers,
    columns: columns(setPossibleCustomers),
  });

  return (
    <Table
      table={table}
      tableClassName="max-w-full "
      headerClassName="" // *:text-2xl
      double
      onRowClick={(customer) => setPhone(customer.phone?.phone ?? "")}
    />
  );
}
