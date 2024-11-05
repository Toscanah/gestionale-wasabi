import { ColumnDef } from "@tanstack/react-table";

import { Buildings, Pencil } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

import { Dispatch, SetStateAction } from "react";
import { CustomerWithDetails } from "@/app/(site)/types/CustomerWithDetails";
import TableColumn from "@/app/(site)/components/table/TableColumn";
import { Customer } from "@prisma/client";

const columns = (): ColumnDef<CustomerWithDetails>[] => [
  TableColumn({
    accessorKey: "phone.phone",
    header: "Num. di telefono",
  }),

  TableColumn({
    accessorKey: "name",
    header: "Nome",
  }),

  TableColumn({
    accessorKey: "surname",
    header: "Cognome",
  }),

  TableColumn({
    accessorKey: "email",
    header: "Email",
  }),

  TableColumn({
    accessorKey: "preferences",
    header: "Preferenze",
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Indirizzi",
    cellContent: (row) =>
      row.original.addresses
        .map((address) => address.doorbell.charAt(0).toUpperCase() + address.doorbell.slice(1))
        .join(", "),
  }),
];

export default columns;
