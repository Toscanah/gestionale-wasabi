import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import { FieldColumn, JoinColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import FullNameColumn from "@/app/(site)/components/table/common/FullNameColumn";

export default function columns({
  isRightTable,
}: {
  isRightTable: boolean;
}): ColumnDef<CustomerWithDetails>[] {
  const columns: ColumnDef<CustomerWithDetails>[] = [
    FullNameColumn({}),

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

    JoinColumn({
      options: { key: "addresses" },
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

  return columns;
}
