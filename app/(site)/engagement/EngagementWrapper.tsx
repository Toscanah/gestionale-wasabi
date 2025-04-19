import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EngagementWrapperProps {
  children: React.ReactNode;
  textAbove: string;
  textBelow: string;
  onTextAboveChange: (val: string) => void;
  onTextBelowChange: (val: string) => void;
}

export default function EngagementWrapper({
  children,
  textAbove = "",
  textBelow = "",
  onTextAboveChange,
  onTextBelowChange,
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

      {children}

      <div className="flex flex-col space-y-2">
        <Label htmlFor="text-below">Messaggio sotto</Label>
        <Input
          id="text-below"
          value={textBelow}
          onChange={(e) => onTextBelowChange(e.target.value)}
        />
      </div>

      <Button>Crea marketing</Button>
    </div>
  );
}
