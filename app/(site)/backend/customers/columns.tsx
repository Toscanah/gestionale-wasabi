import { ColumnDef } from "@tanstack/react-table";
import TableColumn from "../../components/table/TableColumn";
import { OptionWithCategories } from "../../types/OptionWithCategories";
import { CustomerWithDetails } from "../../types/CustomerWithDetails";

const columns: ColumnDef<CustomerWithDetails>[] = [
  TableColumn({
    accessorKey: "name",
    header: "Nome",
  }),

  TableColumn({
    accessorKey: "surname",
    header: "Cognome",
  }),

  TableColumn({
    accessorKey: "phone",
    header: "Num. di telefono",
  }),

  TableColumn({
    accessorKey: "email",
    header: "Email",
  }),

  TableColumn({
    accessorKey: "preferences",
    header: "Prefernze",
  }),
];

export default columns;
