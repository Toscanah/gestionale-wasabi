import { ColumnDef } from "@tanstack/react-table";
import {
  ActionColumn,
  FieldColumn,
  JoinColumn,
  ValueColumn,
} from "../../../components/table/TableColumns";
import WasabiDialog from "../../../components/ui/dialog/WasabiDialog";
import { Button } from "@/components/ui/button";
import CustomerAddresses from "./addresses/CustomerAddresses";
import { Dispatch, SetStateAction } from "react";
import OrderHistory from "../../../components/order-history/OrderHistory";
import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import { CUSTOMER_ORIGIN_LABELS } from "@/app/(site)/lib/shared";

const columns = (
  customers: CustomerWithDetails[],
  setCustomers: Dispatch<SetStateAction<CustomerWithDetails[]>>
): ColumnDef<CustomerWithDetails>[] => [
  FieldColumn({
    key: "phone.phone",
    header: "Num. di telefono",
  }),

  JoinColumn({ options: { key: "doorbells" } }),

  FieldColumn({
    key: "name",
    header: "Nome",
  }),

  FieldColumn({
    key: "surname",
    header: "Cognome",
  }),

  FieldColumn({
    key: "email",
    header: "Email",
  }),

  FieldColumn({
    key: "preferences",
    header: "Preferenze",
  }),

  FieldColumn({
    key: "order_notes",
    header: "Note degli ordini",
  }),

  ValueColumn({
    header: "Origine",
    value: (row) => CUSTOMER_ORIGIN_LABELS[row.original.origin],
    accessor: (customer) => customer.origin,
  }),

  // ActionColumn({
  //   header: "Storico ordini",
  //   action: (row) => {
  //     const customer = row.original;

  //     return (
  //       <DialogWrapper
  //         size="mediumPlus"
  //         title="Storico ordini"
  //         trigger={
  //           <Button type="button" variant={"outline"}>
  //             Vedi ordini precedenti
  //           </Button>
  //         }
  //       >
  //         <OrderHistory customer={customer} />
  //       </DialogWrapper>
  //     );
  //   },
  // }),

  ActionColumn({
    header: "Indirizzi",
    action: (row) => {
      const customerId = row.original.id;
      const customer = customers.find((customer) => customer.id === customerId);

      return (
        <WasabiDialog
          size="medium"
          title="Gestisci indirizzi"
          trigger={
            <Button type="button" variant={"outline"}>
              {customer?.addresses && customer?.addresses.length !== 0
                ? `Vedi indirizzi (${customer?.addresses.length})`
                : "Nessun indirizzo"}
            </Button>
          }
        >
          <CustomerAddresses
            addresses={customer?.addresses ?? []}
            customerId={customerId}
            setCustomers={setCustomers}
          />
        </WasabiDialog>
      );
    },
  }),
];

export default columns;
