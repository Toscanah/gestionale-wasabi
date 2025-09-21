import { ColumnDef } from "@tanstack/react-table";
import { ComprehensiveCustomer } from "@/app/(site)/lib/shared";
import { FieldColumn, JoinColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import FullNameColumn from "@/app/(site)/components/table/common/FullNameColumn";
import AddressesColumn from "@/app/(site)/components/table/common/AddressesColumn";

const columns: ColumnDef<ComprehensiveCustomer>[] = [
  FullNameColumn({
    sortable: false,
  }),

  ValueColumn({
    header: "Telefono",
    value: (row) => row.original.phone?.phone || "",
    accessor: (customer) => customer.phone?.phone || "",
    sortable: false,
  }),

  FieldColumn({
    key: "email",
    header: "Email",
    sortable: false,
  }),

  AddressesColumn({
    sortable: false,
  }),
];

// if (isRightTable) {
//   columns.push(
//     TableColumn({
//       header: "Vecchie azioni",
//       cellContent: (row) => <PrevEngagement engagements={row.original.engagements} />,
//       sortable: false,
//     })
//   );
// }

export default columns;
