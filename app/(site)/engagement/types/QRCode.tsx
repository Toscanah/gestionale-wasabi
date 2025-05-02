import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QRCodeProps {
  onChange: (value: string) => void;
}

export default function QRCode({ onChange }: QRCodeProps) {
  return (
    <div className="w-full flex flex-col space-y-2">
      <Label htmlFor="link">Link</Label>
      <Input
        id="link"
        placeholder="https://esempio.com"
        className="w-full"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
