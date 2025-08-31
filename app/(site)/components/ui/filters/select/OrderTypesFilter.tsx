import { OrderType } from "@prisma/client";
import SelectFilter from "./SelectFilter";
import { ORDER_TYPE_LABELS } from "@/app/(site)/lib/shared/constants/order-labels";

interface OrderTypeFilterProps {
  selectedTypes: OrderType[];
  onTypesChange: (updatedTypes: OrderType[]) => void;
  disabled?: boolean;
}

const ALL_ORDER_TYPES = Object.values(OrderType);

export default function OrderTypesFilter({ selectedTypes, onTypesChange, disabled }: OrderTypeFilterProps) {
  const handleChange = (newValues: string[]) => {
    if (newValues.length === 0 || newValues.length === ALL_ORDER_TYPES.length) {
      onTypesChange(ALL_ORDER_TYPES);
    } else {
      onTypesChange(newValues as OrderType[]);
    }
  };

  return (
    <SelectFilter
      allLabel="Tutti"
      disabled={disabled}
      groups={[
        {
          options: Object.values(OrderType).map((type) => ({
            value: type,
            label: ORDER_TYPE_LABELS[type],
          })),
        },
      ]}
      mode="multi"
      selectedValues={selectedTypes}
      title="Tipo di ordine"
      onChange={handleChange}
      shouldClear={selectedTypes.length !== ALL_ORDER_TYPES.length}
    />
  );
}
