import { cn } from "@/lib/utils";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { MagnifyingGlassIcon, XCircleIcon } from "@phosphor-icons/react";

interface SearchBarProps {
  query: string;
  onChange: (query: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function SearchBar({ query, onChange, disabled, className }: SearchBarProps) {
  const handleReset = () => {
    onChange("");
  };

  return (
    <InputGroup className={cn("w-72 border-dashed", className)}>
      <InputGroupInput
        placeholder="Cerca..."
        disabled={disabled}
        value={query ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <MagnifyingGlassIcon className="text-muted-foreground size-4" />
      </InputGroupAddon>
      {query.trim() !== "" && (
        <InputGroupAddon align="inline-end" className="hover:cursor-pointer">
          <XCircleIcon onClick={handleReset} className="h-4 w-4" />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
