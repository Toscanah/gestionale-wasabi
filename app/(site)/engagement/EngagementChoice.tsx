import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EngagementType } from "@prisma/client";

const ENGAGEMENT_TYPES = [
  { value: EngagementType.QR_CODE, label: "QR Code" },
  { value: EngagementType.IMAGE, label: "Immagine" },
  { value: EngagementType.MESSAGE, label: "Messaggio" },
];

interface EngagementChoiceProps {
  choice: EngagementType;
  setChoice: React.Dispatch<React.SetStateAction<EngagementType>>;
}

export default function EngagementChoice({ choice, setChoice }: EngagementChoiceProps) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <RadioGroup
        value={choice}
        onValueChange={(val) => setChoice(val as EngagementType)}
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
