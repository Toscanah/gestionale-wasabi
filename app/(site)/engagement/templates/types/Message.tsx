import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MessageProps {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
}

export default function Message({ onChange, value, disabled }: MessageProps) {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="msg">Messaggio</Label>
      <Input
        disabled={disabled}
        id="msg"
        className="w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
