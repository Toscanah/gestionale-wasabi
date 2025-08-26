import FullNameColumn from "@/app/(site)/components/table/common/FullNameColumn";
import Table from "@/app/(site)/components/table/Table";
import {
  FieldColumn,
  IndexColumn,
  JoinColumn,
  ValueColumn,
} from "@/app/(site)/components/table/TableColumns";
import DialogWrapper from "@/app/(site)/components/ui/dialog/DialogWrapper";
import RandomSpinner from "@/app/(site)/components/ui/misc/loader/RandomSpinner";
import fetchRequest from "@/app/(site)/lib/api/fetchRequest";
import { CustomerWithDetails } from "@/app/(site)/lib/shared";
import useTable from "@/app/(site)/hooks/table/useTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface TopCustomersProps {
  product: { id: number; name: string };
}

type TopCustomer = CustomerWithDetails & { productCount: number };

const columns: ColumnDef<TopCustomer>[] = [
  IndexColumn({}),

  ValueColumn({
    header: "Telefono",
    value: (row) => row.original.phone?.phone ?? "–",
    accessor: (customer) => customer.phone?.phone ?? "–",
  }),

  FullNameColumn({}),

  JoinColumn({
    options: { key: "addresses" },
    header: "Indirizzi",
  }),

  FieldColumn({
    key: "productCount",
    header: "Qtà",
  }),
];

export default function TopCustomers({ product }: TopCustomersProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<TopCustomer[]>([]);

  const table = useTable({ data: customers, columns });

  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      const allCustomers = await fetchRequest<CustomerWithDetails[]>(
        "GET",
        "/api/customers/",
        "getCustomersWithDetails"
      );

      const ranked = allCustomers
        .map((customer) => {
          let productCount = 0;

          // Count from home orders
          customer.home_orders?.forEach((order) => {
            order.order?.products?.forEach((p) => {
              if (p.product_id === product.id) {
                productCount += p.quantity;
              }
            });
          });

          // Count from pickup orders
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
        .slice(0, 50);

      setCustomers(ranked);
      setLoading(false);
    };

    loadData();
  }, [open, product.id]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      title="Top clienti"
      size="mediumPlus"
      trigger={<Button className="w-40">Mostra top clienti</Button>}
      desc={"I 50 clienti che hanno acquistato di più [" + product.name + "]"}
    >
      {loading ? (
        <RandomSpinner isLoading={loading} />
      ) : (
        <Table table={table} tableClassName="max-h-[500px] overflow-y-auto" />
        // <div className="max-h-[500px] overflow-y-auto">
        //   <table className="min-w-full text-sm">
        //     <thead>
        //       <tr className="text-left font-semibold border-b">
        //         <th className="p-2">#</th>
        //         <th className="p-2">Telefono</th>
        //         <th className="p-2">Nome</th>
        //         <th className="p-2">Indirizzi</th>
        //         <th className="p-2">Qtà</th>
        //       </tr>
        //     </thead>
        //     <tbody>
        //       {customers.map((customer, index) => (
        //         <tr key={customer.id} className="border-b">
        //           <td className="p-2">{index + 1}</td>
        //           <td className="p-2">{customer.phone?.phone ?? "–"}</td>
        //           <td className="p-2">
        //             {customer.name ?? ""} {customer.surname ?? ""}
        //           </td>
        //           <td className="p-2">
        //             {joinItemsWithComma(customer as any, "addresses", { sort: true, maxChar: 30 })}
        //           </td>
        //           <td className="p-2">{customer.productCount}</td>
        //         </tr>
        //       ))}
        //     </tbody>
        //   </table>
        // </div>
      )}
    </DialogWrapper>
  );
}
