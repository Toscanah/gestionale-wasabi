import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function SearchBar({ query, onChange, disabled, className }: SearchBarProps) {
  return (
    <Input
      placeholder="Cerca..."
      disabled={disabled}
      value={query ?? ""}
      className={cn("w-60 h-10", className)}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
