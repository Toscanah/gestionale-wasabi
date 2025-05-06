import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EngagementType } from "@prisma/client";
import { ENGAGEMENT_TYPES } from "../types/EngagementTypes";

interface EngagementChoiceProps {
  selectedType: EngagementType;
  onChange: (newType: EngagementType) => void;
  disabled: boolean;
}

export default function TemplateTypeSelector({
  selectedType,
  onChange,
  disabled,
}: EngagementChoiceProps) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <RadioGroup
        disabled={disabled}
        value={selectedType}
        onValueChange={(val: EngagementType) => onChange(val)}
        className="flex gap-4"
      >
        {ENGAGEMENT_TYPES.map(({ value, label }) => (
          <div className="flex items-center space-x-2">
            <RadioGroupItem key={value} value={value} id={value} />
            <Label htmlFor={value}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
