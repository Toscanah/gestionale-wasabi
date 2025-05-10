import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateWrapperProps {
  templateComponent: React.ReactNode;
  textAbove: string;
  textBelow: string;
  onTextAboveChange: (val: string) => void;
  onTextBelowChange: (val: string) => void;
  onSubmit: () => Promise<void>;
  disabled?: boolean;
}

export default function TemplateWrapper({
  templateComponent,
  textAbove = "",
  textBelow = "",
  onTextAboveChange,
  onTextBelowChange,
  onSubmit,
  disabled = false,
}: TemplateWrapperProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="text-above">Messaggio sopra</Label>
        <Input
          disabled={disabled}
          id="text-above"
          defaultValue={textAbove}
          onChange={(e) => onTextAboveChange(e.target.value)}
        />
      </div>

      {templateComponent}

      <div className="flex flex-col space-y-2">
        <Label htmlFor="text-below">Messaggio sotto</Label>
        <Input
          disabled={disabled}
          id="text-below"
          defaultValue={textBelow}
          onChange={(e) => onTextBelowChange(e.target.value)}
        />
      </div>

      <Button onClick={onSubmit}>Salva</Button>
    </div>
  );
}
