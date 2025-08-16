import { ColumnDef } from "@tanstack/react-table";
import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import { FieldColumn, JoinColumn, ValueColumn } from "@/app/(site)/components/table/tableColumns";

export default function columns({
  isRightTable,
}: {
  isRightTable: boolean;
}): ColumnDef<CustomerWithDetails>[] {
  const columns: ColumnDef<CustomerWithDetails>[] = [
    ValueColumn({
      header: "Chi",
      value: (row) => {
        const name = row.original.name?.trim();
        const surname = row.original.surname?.trim();

        if (name && surname) {
          return `${name} ${surname}`;
        } else if (name) {
          return name;
        } else if (surname) {
          return surname;
        } else {
          return "";
        }
      },
      sort: false,
      accessor: (customer) => `${customer.name || ""} ${customer.surname || ""}`.trim(),
    }),

    ValueColumn({
      header: "Telefono",
      value: (row) => row.original.phone?.phone || "",
      accessor: (customer) => customer.phone?.phone || "",
      sort: false,
    }),

    FieldColumn({
      key: "email",
      header: "Email",
      sort: false,
    }),

    JoinColumn({
      options: { key: "addresses" },
      sort: false,
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
