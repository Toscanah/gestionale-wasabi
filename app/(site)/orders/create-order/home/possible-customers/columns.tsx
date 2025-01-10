import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithDetails } from "@/app/(site)/models";
import TableColumn from "@/app/(site)/components/table/TableColumn";
import joinItemsWithComma from "@/app/(site)/functions/formatting-parsing/joinItemsWithComma";
import DialogWrapper from "@/app/(site)/components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { Dispatch, SetStateAction } from "react";

const columns = (
  setPossibleCustomers: Dispatch<SetStateAction<CustomerWithDetails[]>>
): ColumnDef<CustomerWithDetails>[] => [
  TableColumn({
    accessorKey: "phone.phone",
    header: "Num. di telefono",
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Campanelli",
    cellContent: (row) => joinItemsWithComma(row.original, "doorbells"),
  }),

  TableColumn({
    accessorKey: "addresses",
    header: "Indirizzi",
    cellContent: (row) => (
      <div className="max-w-64">{joinItemsWithComma(row.original, "addresses")}</div>
    ),
  }),

  // TableColumn({
  //   accessorKey: "name",
  //   header: "Nome",
  // }),

  // TableColumn({
  //   accessorKey: "surname",
  //   header: "Cognome",
  // }),

  // TableColumn({
  //   accessorKey: "email",
  //   header: "Email",
  // }),

  TableColumn({
    accessorKey: "preferences",
    header: "Preferenze",
  }),

  TableColumn({
    accessorKey: "delete",
    header: "Azioni",
    cellContent: (row) => (
      <DialogWrapper
        variant="delete"
        trigger={<Button variant={"destructive"}>Elimina</Button>}
        onDelete={() =>
          fetchRequest<boolean>("POST", "/api/customers", "deleteCustomerById", {
            id: row.original.id,
          }).then((success) =>
            setPossibleCustomers((prev) =>
              prev.filter((customer) => customer.id !== row.original.id)
            )
          )
        }
      >
        Stai per eliminare il seguenti con tutti i suoi dati correlati. Questa azione è definitiva e
        irriversibile
      </DialogWrapper>
    ),
  }),
];

export default columns;
