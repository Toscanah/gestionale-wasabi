import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type SharedProps = {
  templateComponent: React.ReactNode;
  textAbove?: string;
  textBelow?: string;
  isRedeemable?: boolean;
};

type DisabledTemplateWrapper = SharedProps & {
  disabled: true;
  onTextAboveChange?: undefined;
  onTextBelowChange?: undefined;
  onSubmit?: undefined;
  onRedeemableChange?: undefined;
};

type ActiveTemplateWrapper = SharedProps & {
  disabled?: false;
  onTextAboveChange: (val: string) => void;
  onTextBelowChange: (val: string) => void;
  onSubmit: () => Promise<void>;
  onRedeemableChange: (val: boolean) => void;
};

type TemplateWrapperProps = DisabledTemplateWrapper | ActiveTemplateWrapper;

export default function TemplateWrapper(props: TemplateWrapperProps) {
  const {
    templateComponent,
    textAbove = "",
    textBelow = "",
    disabled = false,
    onTextAboveChange,
    onTextBelowChange,
    onSubmit,
    onRedeemableChange,
    isRedeemable
  } = props;

  if (disabled) {
    return (
      <div className="flex flex-col gap-3 rounded-lg">
        <div>Riscattabile? <strong>{isRedeemable ? "Sì" : "No"}</strong></div>

        {textAbove && <p className="text-sm text-muted-foreground italic">{textAbove}</p>}

        <div className="p-2">{templateComponent}</div>

        {textBelow && <p className="text-sm text-muted-foreground italic">{textBelow}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox checked={isRedeemable} onCheckedChange={onRedeemableChange} />
        <Label>E' riscattabile?</Label>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="text-above">Messaggio sopra</Label>
        <Textarea
          id="text-above"
          value={textAbove}
          onChange={(e) => onTextAboveChange?.(e.target.value)}
        />
      </div>

      {templateComponent}

      <div className="flex flex-col space-y-2">
        <Label htmlFor="text-below">Messaggio sotto</Label>
        <Textarea
          id="text-below"
          value={textBelow}
          onChange={(e) => onTextBelowChange?.(e.target.value)}
        />
      </div>

      <Button onClick={onSubmit}>Salva</Button>
    </div>
  );
}
