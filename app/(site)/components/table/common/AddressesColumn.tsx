import { ColumnDef } from "@tanstack/react-table";
import { BaseColumnProps, JoinColumn } from "../TableColumns";
import { AddressType } from "@/prisma/generated/schemas";

type AddressesColumnProps = Partial<BaseColumnProps> & {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

export default function AddressesColumn<T extends { addresses: AddressType[] }>({
  header = "Indirizzi",
  wrapper,
  sortable = true,
}: Partial<AddressesColumnProps> = {}): ColumnDef<T> {
  return JoinColumn<T>({
    sortable,
    header,
    options: {
      key: "addresses",
      wrapper: wrapper || (({ children }) => <div className="max-w-64 truncate">{children}</div>),
    },
  });
}
