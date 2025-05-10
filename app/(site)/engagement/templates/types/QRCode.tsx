import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QRCodeProps {
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean
}

export default function QRCode({ onChange, value, disabled }: QRCodeProps) {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="link">Link</Label>
      <Input
        disabled={disabled}
        id="link"
        placeholder="https://esempio.com"
        className="w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
