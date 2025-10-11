import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function SearchBar({ query, onChange, disabled, className }: SearchBarProps) {
  return (
    <InputGroup className={cn("w-96", className)}>
      <InputGroupInput
        placeholder="Cerca..."
        disabled={disabled}
        value={query ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <MagnifyingGlassIcon className="text-muted-foreground size-4" />
      </InputGroupAddon>
    </InputGroup>
  );
}
