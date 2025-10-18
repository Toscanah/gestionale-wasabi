import FullNameColumn from "@/app/(site)/components/table/common/FullNameColumn";
import Table from "@/app/(site)/components/table/Table";
import { FieldColumn, IndexColumn, ValueColumn } from "@/app/(site)/components/table/TableColumns";
import WasabiDialog from "@/app/(site)/components/ui/wasabi/WasabiDialog";
import { CustomerContracts, ComprehensiveCustomer } from "@/app/(site)/lib/shared";
import useTable from "@/app/(site)/hooks/table/useTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Loader from "@/app/(site)/components/ui/misc/loader/Loader";
import { customersAPI } from "@/lib/server/api";
import AddressesColumn from "@/app/(site)/components/table/common/AddressesColumn";
import useSkeletonTable from "@/app/(site)/hooks/table/useSkeletonTable";
import RandomSpinner from "@/app/(site)/components/ui/misc/loader/RandomSpinner";
import React from "react";

export interface TopCustomersProps {
  product: { id: number; name: string; hasTopCustomers: boolean };
  filters?: NonNullable<CustomerContracts.GetAllComprehensive.Input>["filters"];
}

type TopCustomer = ComprehensiveCustomer & { productCount: number };

const columns: ColumnDef<TopCustomer>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Telefono",
    value: (row) => row.original.phone?.phone ?? "–",
    accessor: (customer) => customer.phone?.phone ?? "–",
  }),

  FullNameColumn(),

  AddressesColumn(),

  FieldColumn({
    key: "productCount",
    header: "Qtà",
  }),
];

export default function TopCustomers({ product, filters }: TopCustomersProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isFetching } = customersAPI.getAllComprehensive.useQuery(
    { filters },
    {
      enabled: open && product.hasTopCustomers,
      select: (allCustomers) =>
        (allCustomers.customers ?? [])
          .map((customer) => {
            let productCount = 0;

            customer.home_orders?.forEach((order) => {
              order.order?.products?.forEach((p) => {
                if (p.product_id === product.id) {
                  productCount += p.quantity;
                }
              });
            });

            customer.pickup_orders?.forEach((order) => {
              order.order?.products?.forEach((p) => {
                if (p.product_id === product.id) {
                  productCount += p.quantity;
                }
              });
            });

            return { ...customer, productCount };
          })
          .filter((c) => c.productCount > 0)
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, 50),
    }
  );

  const { tableData, tableColumns } = useSkeletonTable({
    isLoading: isFetching,
    data: data ?? [],
    columns,
    pageSize: 50,
  });

  const table = useTable({ data: tableData, columns: tableColumns });

  if (isFetching) {
    // <Butt
  }

  return (
    <WasabiDialog
      open={open}
      onOpenChange={setOpen}
      title="Top clienti"
      size="mediumPlus"
      trigger={
        <Button className="w-full" variant="outline" disabled={!product.hasTopCustomers}>
          {product.hasTopCustomers ? "Vedi clienti migliori" : "Nessun cliente trovato"}
        </Button>
      }
      desc={`I 50 clienti che hanno acquistato di più [${product.name.trim()}]`}
    >
      <Table table={table} maxRows={10} scrollAdjustment={1} tableClassName="max-h-[410px]" />
    </WasabiDialog>
  );
}
