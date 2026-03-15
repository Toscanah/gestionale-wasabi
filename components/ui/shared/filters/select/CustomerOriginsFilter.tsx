import { CustomerOrigin } from "@/prisma/generated/client/enums";
import { CUSTOMER_ORIGIN_LABELS } from "@/lib/shared";
import { Globe } from "@phosphor-icons/react/dist/ssr";
import { Phone, QuestionMark, Signpost, SignpostIcon, Tag, UserSound } from "@phosphor-icons/react";
import WasabiSelect from "../../wasabi/WasabiSelect";

interface CustomerOriginsFilterProps {
  origins: CustomerOrigin[];
  onOriginsChange: (updatedOrigins: CustomerOrigin[]) => void;
  disabled?: boolean;
}

export const CUSTOMER_ORIGIN_OPTIONS = [
  {
    label: CUSTOMER_ORIGIN_LABELS.WEB,
    value: CustomerOrigin.WEB,
    icon: Globe,
  },
  {
    label: CUSTOMER_ORIGIN_LABELS.PHONE,
    value: CustomerOrigin.PHONE,
    icon: Phone,
  },
  {
    label: CUSTOMER_ORIGIN_LABELS.REFERRAL,
    value: CustomerOrigin.REFERRAL,
    icon: UserSound,
  },
  {
    label: CUSTOMER_ORIGIN_LABELS.COUPON,
    value: CustomerOrigin.COUPON,
    icon: Tag,
  },
  {
    label: CUSTOMER_ORIGIN_LABELS.UNKNOWN,
    value: CustomerOrigin.UNKNOWN,
    icon: QuestionMark,
  },
];

export default function CustomerOriginsFilter({
  origins,
  onOriginsChange,
  disabled,
}: CustomerOriginsFilterProps) {
  const allOrigins = Object.values(CustomerOrigin);

  const handleChange = (newValues: CustomerOrigin[]) => {
    if (newValues.length === 0 || newValues.length === allOrigins.length) {
      onOriginsChange(allOrigins);
    } else {
      onOriginsChange(newValues);
    }
  };

  return (
    <WasabiSelect
      appearance="filter"
      title="Origini"
      mode="multi"
      shouldSort={false}
      disabled={disabled}
      triggerIcon={SignpostIcon}
      searchPlaceholder="Cerca origine..."
      onChange={(updatedOrigins) => handleChange(updatedOrigins as CustomerOrigin[])}
      shouldClear={origins.length !== allOrigins.length}
      allLabel="Tutte"
      groups={[{ options: CUSTOMER_ORIGIN_OPTIONS }]}
      selectedValues={origins}
    />
  );
}
