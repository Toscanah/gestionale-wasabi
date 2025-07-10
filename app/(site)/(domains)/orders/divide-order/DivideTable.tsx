import { Button } from "@/components/ui/button";
import Table from "../../../components/table/Table";
import getTable from "../../../lib/utils/getTable";
import { ProductInOrder } from "@/app/(site)/lib/shared";
import getColumns from "./getColumns";
import { OrderType } from "@prisma/client";
import roundToTwo from "../../../lib/formatting-parsing/roundToTwo";
import { getOrderTotal } from "../../../lib/services/order-management/getOrderTotal";

interface DivideTableProps {
  products: ProductInOrder[];
  onPayClick: (products: ProductInOrder[]) => void;
  orderType: OrderType;
  onRowClick: (product: ProductInOrder) => void;
  disabled: boolean;
}

export default function DivideTable({
  products,
  onPayClick,
  orderType,
  onRowClick,
  disabled,
}: DivideTableProps) {
  const columns = getColumns(orderType);
  const table = getTable({ data: products, columns });

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      <Table<ProductInOrder>
        tableClassName="max-w-full overflow-x-scroll select-none max-h-full h-full"
        table={table}
        onRowClick={onRowClick}
        forceRowClick
      />
      <div className="flex gap-8">
        <Button
          className="bg-green-500 text-black h-14 text-xl w-[70%]"
          disabled={disabled}
          onClick={() => onPayClick(products)}
        >
          INCASSA 收钱
        </Button>
        <span className="h-14 text-xl flex items-center justify-center border rounded-md w-[30%]">
          TOTALE: € {getOrderTotal({ order: { type: orderType, products }, round: true })}
        </span>
      </div>
    </div>
  );
}
