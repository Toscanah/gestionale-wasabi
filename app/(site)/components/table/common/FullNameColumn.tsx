import { BaseColumnProps, ValueColumn } from "../TableColumns";

type NameInfo = { name?: string | null; surname?: string | null };

const fullName = <T extends NameInfo>(r: T) =>
  [r.name, r.surname]
    .filter(Boolean)
    .map((s) => String(s).trim())
    .join(" ");

type FullNameColumnProps = BaseColumnProps;

export default function FullNameColumn<T extends NameInfo>({
  header = "Chi",
  sortable = true,
}: FullNameColumnProps) {
  return ValueColumn<T>({
    header,
    accessor: fullName,
    value: (row) => fullName(row.original),
    sortable,
  });
}
