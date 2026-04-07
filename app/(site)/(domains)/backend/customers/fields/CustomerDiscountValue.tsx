import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import WasabiSelect from "@/components/ui/shared/wasabi/WasabiSelect";
import { CustomerDiscountType } from "@/lib/shared";
import { CUSTOMER_DISCOUNT_LABELS } from "@/lib/shared/constants/enum-labels/customer-discount";
import { Control, ControllerRenderProps, FieldValues, useWatch } from "react-hook-form";
import { CustomerFormData } from "../form";
import { useEffect } from "react";

interface CustomerDiscountProps {
  field: ControllerRenderProps;
  control: Control<any, any, any>;
}

export default function CustomerDiscountValue({ field, control }: CustomerDiscountProps) {
  const discountType = useWatch({
    control,
    name: "fixed_discount_type",
  });

  const isDisabled = discountType === "NONE" || !discountType;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") return field.onChange("");
    let num = Number(val);

    if (discountType === "PERCENTAGE") {
      num = Math.min(Math.max(Number.isNaN(num) ? 0 : num, 0), 100);
    } else {
      num = Math.max(Number.isNaN(num) ? 0 : num, 0);
    }

    field.onChange(num);
  };

  useEffect(() => {
    if (discountType === "NONE") {
      // Reset to 0 if the type is NONE
      if (field.value !== 0) {
        field.onChange(0);
      }
    } else if (discountType === "PERCENTAGE") {
      // Clamp value to 100 if user switches from FIXED to PERCENTAGE
      if (Number(field.value) > 100) {
        field.onChange(100);
      }
    }
  }, [discountType, field.value, field.onChange]);

  const inputProps: React.ComponentProps<typeof InputGroupInput> & {
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  } = {
    type: "number",
    min: 0,
    max: discountType === "PERCENTAGE" ? 100 : undefined,
    step: discountType === "PERCENTAGE" ? 1 : 0.01,
    value: field.value as any,
    onChange: handleChange,
    disabled: isDisabled,
    id: "fixed-discount-value",
    placeholder: isDisabled ? "Seleziona un tipo..." : discountType === "PERCENTAGE" ? "0" : "0.00",
    className: "w-full",
  };

  return (
    <InputGroup>
      <InputGroupInput {...(inputProps as any)} />
      <InputGroupAddon align="inline-end">
        <InputGroupText className="text-sm font-medium">
          {discountType === "PERCENTAGE" ? "%" : discountType === "FIXED" ? "€" : ""}
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
