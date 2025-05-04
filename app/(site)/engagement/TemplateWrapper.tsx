import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateEngagement } from "../shared";

interface EngagementWrapperProps {
  templateComponent: React.ReactNode;
  textAbove: string;
  textBelow: string;
  onTextAboveChange: (val: string) => void;
  onTextBelowChange: (val: string) => void;
  onCreateEngagement: () => Promise<void>;
}

export default function TemplateWrapper({
  templateComponent,
  textAbove = "",
  textBelow = "",
  onTextAboveChange,
  onTextBelowChange,
  onCreateEngagement,
}: EngagementWrapperProps) {
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

      <Button onClick={onCreateEngagement}>Crea marketing</Button>
    </div>
  );
}
