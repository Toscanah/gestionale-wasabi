import { ColumnDef } from "@tanstack/react-table";
import { BaseColumnProps, ValueColumn } from "../TableColumns";
import { EnDash } from "../../shared/misc/Placeholders";

type NameInfo = { name?: string | null; surname?: string | null };

const fullName = <T extends NameInfo>(r: T): string => {
  const combined = [r.name, r.surname]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .join(" ");

  return combined || "–";
};

type FullNameColumnProps = BaseColumnProps;

export default function FullNameColumn<T extends NameInfo>({
  header = "Chi",
  sortable = true,
}: FullNameColumnProps = {}): ColumnDef<T> {
  return ValueColumn<T>({
    header,
    accessor: (r) => {
      const combined = [r.name, r.surname]
        .filter(Boolean)
        .map((s) => String(s).trim())
        .join(" ");
      return combined || ""; // accessor should be clean string (no JSX)
    },
    value: (row) => {
      const display = fullName(row.original);
      return display.trim() ? display : <EnDash />; // ✅ show EnDash in UI
    },
    sortable,
  });
}
