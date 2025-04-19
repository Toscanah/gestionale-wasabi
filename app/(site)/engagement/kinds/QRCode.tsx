import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function QRCode() {
  return <div className="w-full flex flex-col space-y-2">
    <Label htmlFor="link">Link</Label>
    <Input id="link" placeholder="https://exempio.com" className="w-full" />
  </div> 
}