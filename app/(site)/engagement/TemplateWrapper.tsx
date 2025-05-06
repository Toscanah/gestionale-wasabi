import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateWrapperProps {
  templateComponent: React.ReactNode;
  textAbove: string;
  textBelow: string;
  onTextAboveChange: (val: string) => void;
  onTextBelowChange: (val: string) => void;
  onSave: () => Promise<void>; // now used for both create or update
}

export default function TemplateWrapper({
  templateComponent,
  textAbove = "",
  textBelow = "",
  onTextAboveChange,
  onTextBelowChange,
  onSave,
}: TemplateWrapperProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="text-above">Messaggio sopra</Label>
        <Input
          id="text-above"
          value={textAbove}
          onChange={(e) => onTextAboveChange(e.target.value)}
        />
      </div>

      {templateComponent}

      <div className="flex flex-col space-y-2">
        <Label htmlFor="text-below">Messaggio sotto</Label>
        <Input
          id="text-below"
          value={textBelow}
          onChange={(e) => onTextBelowChange(e.target.value)}
        />
      </div>

      <Button onClick={onSave}>Salva</Button>
    </div>
  );
}
