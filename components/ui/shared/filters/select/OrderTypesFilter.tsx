import { OrderType } from "@/prisma/generated/client/enums";
import { ORDER_TYPE_LABELS, ORDER_TYPE_COLORS } from "@/lib/shared";
import { PackageIcon } from "@phosphor-icons/react";
import WasabiSelect from "../../wasabi/WasabiSelect";
import { Badge } from "@/components/ui/badge";

interface OrderTypeFilterProps {
  selectedTypes: OrderType[];
  onTypesChange: (updatedTypes: OrderType[]) => void;
  disabled?: boolean;
  orderCounts?: Record<OrderType, number>;
}

export const ALL_ORDER_TYPES = Object.values(OrderType);

export default function OrderTypesFilter({
  selectedTypes,
  onTypesChange,
  disabled,
  orderCounts,
}: OrderTypeFilterProps) {
  const handleChange = (newValues: string[]) => {
    if (newValues.length === 0 || newValues.length === ALL_ORDER_TYPES.length) {
      onTypesChange(ALL_ORDER_TYPES);
    } else {
      onTypesChange(newValues as OrderType[]);
    }
  };

  return (
    <WasabiSelect
      searchPlaceholder="Cerca turno"
      appearance="filter"
      triggerIcon={PackageIcon}
      allLabel="Tutti"
      disabled={disabled}
      groups={[
        {
          options: Object.values(OrderType).map((type) => ({
            value: type,
            label: ORDER_TYPE_LABELS[type],
            customLabel: (
              <Badge className={ORDER_TYPE_COLORS[type]}>
                {ORDER_TYPE_LABELS[type]}
              </Badge>
            ),
            count: orderCounts ? orderCounts[type] : undefined,
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
