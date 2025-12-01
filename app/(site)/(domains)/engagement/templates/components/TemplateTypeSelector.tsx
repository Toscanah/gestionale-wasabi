import { ENGAGEMENT_TYPES_LABELS } from "@/app/(site)/lib/shared";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EngagementType } from "@/prisma/generated/client/enums";

interface EngagementChoiceProps {
  selectedType: EngagementType;
  onChange: (newType: EngagementType) => void;
  disabled?: boolean;
}

export default function TemplateTypeSelector({
  selectedType,
  onChange,
  disabled = false,
}: EngagementChoiceProps) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <RadioGroup
        disabled={disabled}
        value={selectedType}
        onValueChange={(val: EngagementType) => onChange(val)}
        className="flex gap-4"
      >
        {Object.entries(ENGAGEMENT_TYPES_LABELS).map(([value, label]) => (
          <div className="flex items-center space-x-2" key={value}>
            <RadioGroupItem value={value as EngagementType} id={value} />
            <Label htmlFor={value}>{label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
