import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import DialogWrapper from "../../components/dialog/DialogWrapper";
import { Button } from "@/components/ui/button";
import CustomerAddresses from "./addresses/CustomerAddresses";
import { Dispatch, SetStateAction } from "react";
import OrderHistory from "../../components/order-history/OrderHistory";
import { CustomerWithDetails } from "../../models";
import joinItemsWithComma from "../../functions/formatting-parsing/joinItemsWithComma";

const columns = (
  customers: CustomerWithDetails[],
  setCustomers: Dispatch<SetStateAction<CustomerWithDetails[]>>
): ColumnDef<CustomerWithDetails>[] => [
  TableColumn({
    accessorKey: "phone.phone",
    header: "Num. di telefono",
  }),

  TableColumn({ joinOptions: { key: "doorbells" } }),

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
    header: "Storico ordini",
    cellContent: (row) => {
      const customer = row.original;

      return (
        <DialogWrapper
          size="medium"
          title="Storico ordini"
          trigger={
            <Button type="button" variant={"outline"}>
              Vedi ordini precedenti
            </Button>
          }
        >
          <OrderHistory customer={customer} />
        </DialogWrapper>
      );
    },
  }),

  TableColumn({
    header: "Indirizzi",
    cellContent: (row) => {
      const customerId = row.original.id;
      const customer = customers.find((customer) => customer.id === customerId);

      return (
        <DialogWrapper
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
        </DialogWrapper>
      );
    },
  }),
];

export default columns;
