import { ColumnDef } from "@tanstack/react-table";
import {
  FieldColumn,
  JoinColumn,
  ValueColumn,
} from "../../../../../components/table/TableColumns";
import { ComprehensiveCustomer } from "@/lib/shared";
import { CUSTOMER_ORIGIN_LABELS } from "@/lib/shared";

const columns: ColumnDef<ComprehensiveCustomer>[] = [
  FieldColumn({
    key: "phone.phone",
    header: "Num. di telefono",
    sortable: false,
  }),

  JoinColumn({ options: { key: "doorbells" }, sortable: false }),

  FieldColumn({
    key: "name",
    header: "Nome",
    sortable: false,
  }),

  FieldColumn({
    key: "surname",
    header: "Cognome",
    sortable: false,
  }),

  FieldColumn({
    key: "email",
    header: "Email",
    sortable: false,
  }),

  FieldColumn({
    key: "preferences",
    header: "Preferenze",
    sortable: false,
  }),

  FieldColumn({
    key: "order_notes",
    header: "Note degli ordini",
    sortable: false,
  }),

  ValueColumn({
    header: "Origine",
    value: (row) => CUSTOMER_ORIGIN_LABELS[row.original.origin],
    accessor: (customer) => customer.origin,
    sortable: false,
  }),

  // ActionColumn({
  //   header: "Indirizzi",
  //   action: (row) => {
  //     const customerId = row.original.id;
  //     const customer = row.original;

  //     return (
  //       <WasabiDialog
  //         size="medium"
  //         title="Gestisci indirizzi"
  //         trigger={
  //           <Button type="button" variant={"outline"}>
  //             {customer?.addresses && customer?.addresses.length !== 0
  //               ? `Vedi indirizzi (${customer?.addresses.length})`
  //               : "Nessun indirizzo"}
  //           </Button>
  //         }
  //       >
  //         <CustomerAddresses addresses={customer?.addresses ?? []} customerId={customerId} />
  //       </WasabiDialog>
  //     );
  //   },
  // }),
];

export default columns;
