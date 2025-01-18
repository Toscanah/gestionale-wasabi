import { Button } from "@/components/ui/button";
import Table from "../../components/table/Table";
import getTable from "../../functions/util/getTable";
import { ProductInOrder } from "../../models";
import getColumns from "./getColumns";
import { OrderType } from "@prisma/client";
import calculateOrderTotal from "../../functions/order-management/calculateOrderTotal";
import generateEmptyOrder from "../../functions/order-management/generateEmptyOrder";
import roundToTwo from "../../functions/formatting-parsing/roundToTwo";

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
          TOTALE: € {roundToTwo(calculateOrderTotal({ type: orderType, products }))}
        </span>
      </div>
    </div>
  );
}
