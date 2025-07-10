import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SharedProps = {
  templateComponent: React.ReactNode;
  textAbove?: string;
  textBelow?: string;
};

type DisabledTemplateWrapper = SharedProps & {
  disabled: true;
  onTextAboveChange?: undefined;
  onTextBelowChange?: undefined;
  onSubmit?: undefined;
};

type ActiveTemplateWrapper = SharedProps & {
  disabled?: false;
  onTextAboveChange: (val: string) => void;
  onTextBelowChange: (val: string) => void;
  onSubmit: () => Promise<void>;
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
  } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="text-above">Messaggio sopra</Label>
        <Input
          disabled={disabled}
          id="text-above"
          value={textAbove}
          onChange={(e) => onTextAboveChange?.(e.target.value)}
        />
      </div>

      {templateComponent}

      <div className="flex flex-col space-y-2">
        <Label htmlFor="text-below">Messaggio sotto</Label>
        <Input
          disabled={disabled}
          id="text-below"
          value={textBelow}
          onChange={(e) => onTextBelowChange?.(e.target.value)}
        />
      </div>

      <Button onClick={onSubmit}>Salva</Button>
    </div>
  );
}
