import FullNameColumn from "@/components/table/common/FullNameColumn";
import Table from "@/components/table/Table";
import { FieldColumn, IndexColumn, ValueColumn } from "@/components/table/TableColumns";
import WasabiDialog from "@/components/shared/wasabi/WasabiDialog";
import { CustomerContracts, ComprehensiveCustomer } from "@/lib/shared";
import useTable from "@/hooks/table/useTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Loader from "@/components/shared/misc/loader/Loader";
import { customersAPI } from "@/lib/trpc/api";
import AddressesColumn from "@/components/table/common/AddressesColumn";
import useSkeletonTable from "@/hooks/table/useSkeletonTable";
import RandomSpinner from "@/components/shared/misc/loader/RandomSpinner";
import React from "react";
import { EnDash } from "@/components/shared/misc/Placeholders";

export interface TopCustomersProps {
  product: { id: number; name: string; hasTopCustomers: boolean };
  filters?: NonNullable<CustomerContracts.GetAllComprehensive.Input>["filters"];
}

type TopCustomer = ComprehensiveCustomer & { productCount: number };

const columns: ColumnDef<TopCustomer>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Telefono",
    value: (row) => row.original.phone?.phone ?? <EnDash />,
    accessor: (customer) => customer.phone?.phone ?? "–",
  }),

  FullNameColumn(),

  AddressesColumn(),

  FieldColumn({
    key: "productCount",
    header: "Quantità acquistata",
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
