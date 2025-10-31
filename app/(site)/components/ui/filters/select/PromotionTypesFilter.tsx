import { PromotionType } from "@prisma/client";
import WasabiSelect from "../../wasabi/WasabiSelect";
import { StarIcon, WalletIcon } from "@phosphor-icons/react";
import { PROMOTION_TYPE_LABELS } from "../../../../lib/shared/constants/promotion-labels";
import { ALL_ORDER_TYPES } from "./OrderTypesFilter";
import { PromotionContracts } from "@/app/(site)/lib/shared";

interface PromotionTypesFilterProps {
  selectedTypes: PromotionType[];
  typeCounts?: PromotionContracts.CountsByType.Output;
  onTypesChange: (updatedTypes: PromotionType[]) => void;
  disabled?: boolean;
}

export const ALL_PROMOTION_TYPES = Object.values(PromotionType);

export default function PromotionTypesFilter({
  selectedTypes,
  onTypesChange,
  disabled,
  typeCounts,
}: PromotionTypesFilterProps) {
  const handleChange = (newValues: string[]) => {
    if (newValues.length === 0 || newValues.length === ALL_PROMOTION_TYPES.length) {
      onTypesChange(newValues as PromotionType[]);
    } else {
      onTypesChange(newValues as PromotionType[]);
    }
  };

  return (
    <WasabiSelect
      searchPlaceholder="Cerca promozione"
      appearance="filter"
      triggerIcon={WalletIcon}
      allLabel="Tutte"
      disabled={disabled}
      groups={[
        {
          options: Object.values(PromotionType).map((type) => ({
            value: type,
            label: PROMOTION_TYPE_LABELS[type],
            count: typeCounts?.[type] ?? 0,
          })),
        },
      ]}
      mode="multi"
      selectedValues={selectedTypes}
      title="Tipo di promozione"
      onChange={handleChange}
      shouldClear={selectedTypes.length !== ALL_PROMOTION_TYPES.length}
    />
  );
}
