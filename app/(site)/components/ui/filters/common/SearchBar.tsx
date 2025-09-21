import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  filter: string;
  onChange: (filter: string) => void;
  disabled: boolean;
  className?: string;
}

export default function SearchBar({ filter, onChange, disabled, className }: SearchBarProps) {
  return (
    <Input
      placeholder="Cerca..."
      disabled={disabled}
      value={filter ?? ""}
      className={cn("w-60 h-10", className)}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
