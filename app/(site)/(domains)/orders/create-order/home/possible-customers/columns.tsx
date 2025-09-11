import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import {
  ActionColumn,
  FieldColumn,
  JoinColumn,
} from "@/app/(site)/components/table/TableColumns";
import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { Button } from "@/components/ui/button";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { Dispatch, SetStateAction } from "react";

const columns = (
  setPossibleCustomers: Dispatch<SetStateAction<CustomerWithDetails[]>>
): ColumnDef<CustomerWithDetails>[] => [
  FieldColumn({
    key: "phone.phone",
    header: "Num. di telefono",
  }),

  JoinColumn({ options: { key: "doorbells" } }),

  JoinColumn({
    options: {
      key: "addresses",
      wrapper: ({ children }) => <div className="max-w-64">{children}</div>,
    },
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

  FieldColumn({
    key: "preferences",
    header: "Preferenze",
  }),

  ActionColumn({
    header: "Azioni",
    action: (row) => (
      <WasabiDialog
        variant="delete"
        size="small"
        trigger={<Button variant={"destructive"}>Elimina</Button>}
        onDelete={() =>
          fetchRequest<boolean>("DELETE", "/api/customers", "deleteCustomerById", {
            id: row.original.id,
          }).then((success) =>
            setPossibleCustomers((prev) =>
              prev.filter((customer) => customer.id !== row.original.id)
            )
          )
        }
      >
        Stai per eliminare il seguente cliente con tutti i suoi dati correlati. Questa azione è
        definitiva e irriversibile
      </WasabiDialog>
    ),
  }),
];

export default columns;
