import { CustomerOrigin } from "@prisma/client";
import WasabiSelect from "../../wasabi/WasabiSelect";
import { CUSTOMER_ORIGIN_LABELS } from "@/app/(site)/lib/shared";
import { Globe } from "@phosphor-icons/react/dist/ssr";
import { Phone, QuestionMark, Signpost, Tag, UserSound } from "@phosphor-icons/react";

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
  console.log(origins);
  const allOrigins = Object.values(CustomerOrigin);

  const handleChange = (newValues: CustomerOrigin[]) => {
    console.log("newValues", newValues);

    if (newValues.length === 0 || newValues.length === allOrigins.length) {
      onOriginsChange(allOrigins);
    } else {
      onOriginsChange(newValues);
    }
  };

  return (
    <WasabiSelect
      title="Origini"
      mode="multi"
      disabled={disabled}
      triggerIcon={Signpost}
      inputPlaceholder="Cerca origine..."
      onChange={(updatedOrigins) => handleChange(updatedOrigins as CustomerOrigin[])}
      shouldClear={origins.length !== allOrigins.length}
      allLabel="Tutte"
      groups={[{ options: CUSTOMER_ORIGIN_OPTIONS }]}
      selectedValues={origins}
    />
  );
}
