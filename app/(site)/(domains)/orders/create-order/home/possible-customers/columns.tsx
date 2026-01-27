import { ColumnDef } from "@tanstack/react-table";
import { ComprehensiveCustomer } from "@/lib/shared";
import { ActionColumn, FieldColumn, JoinColumn } from "@/components/table/TableColumns";
import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { trpc } from "@/lib/trpc/client";
import AddressesColumn from "@/components/table/common/AddressesColumn";

const columns: ColumnDef<ComprehensiveCustomer>[] = [
  FieldColumn({
    key: "phone.phone",
    header: "Num. di telefono",
  }),

  JoinColumn({ options: { key: "doorbells" } }),

  AddressesColumn(),
  
  FieldColumn({
    key: "preferences",
    header: "Preferenze",
  }),
];

export default columns;
