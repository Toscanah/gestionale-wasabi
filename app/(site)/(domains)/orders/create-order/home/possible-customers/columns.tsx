import { ColumnDef } from "@tanstack/react-table";
import { ComprehensiveCustomer } from "@/app/(site)/lib/shared";
import { ActionColumn, FieldColumn, JoinColumn } from "@/app/(site)/components/table/TableColumns";
import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { trpc } from "@/lib/server/client";
import AddressesColumn from "@/app/(site)/components/table/common/AddressesColumn";

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
