import { CustomerWithDetails } from "@/app/(site)/models";
import columns from "./columns";
import getTable from "@/app/(site)/util/functions/getTable";
import Table from "@/app/(site)/components/table/Table";
import { Dispatch, SetStateAction } from "react";

interface PossibleCustomersProps {
  possibleCustomers: CustomerWithDetails[];
  setPhone: Dispatch<SetStateAction<string>>;
}

export default function PossibleCustomers({ possibleCustomers, setPhone }: PossibleCustomersProps) {
  const table = getTable<CustomerWithDetails>({ data: possibleCustomers, columns: columns() });

  return (
    <Table
      table={table}
      tableClassName="*:text-2xl max-w-full"
      headerClassName="*:text-2xl"
      onRowClick={(customer) => setPhone(customer.phone?.phone ?? "")}
    />
  );
}
