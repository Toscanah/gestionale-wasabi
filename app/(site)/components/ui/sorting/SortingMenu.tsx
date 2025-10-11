import { Button } from "@/components/ui/button";
import WasabiPopover from "../wasabi/WasabiPopover";
import { ArrowsDownUp, X } from "@phosphor-icons/react";
import WasabiSimpleSelect from "../wasabi/WasabiSimpleSelect";
import SortDirectionSelector from "./SortDirectionSelector";
import { SortDirection } from "@/app/(site)/lib/shared/schemas/common/sorting";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type SortableField = {
  label: string;
  value: string; // your external label/key (e.g. "Categoria")
  type?: "number" | "string" | "date" | "boolean" | "default";
};

export type SortField = {
  index: number;
  field: string; // matches SortableField.value
  direction: SortDirection;
};

// Default direction by type
const DEFAULT_DIRECTION_BY_TYPE: Record<NonNullable<SortableField["type"]>, SortDirection> = {
  number: "desc",
  string: "asc",
  date: "desc",
  boolean: "desc",
  default: "asc",
};

interface SortingMenuProps {
  availableFields: SortableField[];
  activeSorts: SortField[];
  onChange: (newSorts: SortField[]) => void;
  triggerClassName?: string;
  disabled?: boolean;
}

export default function SortingMenu({
  activeSorts,
  availableFields,
  onChange,
  triggerClassName,
  disabled,
}: SortingMenuProps) {
  const usedFields = activeSorts.map((s) => s.field);
  const remainingFields = availableFields.filter((f) => !usedFields.includes(f.value));

  const getType = (val?: string) => availableFields.find((f) => f.value === val)?.type ?? "default";

  const defaultDirFor = (val?: string): SortDirection => DEFAULT_DIRECTION_BY_TYPE[getType(val)];

  return (
    <WasabiPopover
      modal={false}
      trigger={
        <Button
          disabled={disabled}
          variant="outline"
          className={cn("h-10 flex gap-2 items-center", triggerClassName)}
        >
          <ArrowsDownUp className="h-4 w-4" />
          Ordina
          {activeSorts.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0.5" />
              {activeSorts.length <= 2 ? (
                activeSorts.map((sort) => {
                  const label =
                    availableFields.find((f) => f.value === sort.field)?.label ?? sort.field;
                  return (
                    <Badge key={sort.field} variant="secondary" className="px-1 rounded-lg mx-0.5">
                      {label}
                    </Badge>
                  );
                })
              ) : (
                <Badge variant="secondary" className="px-1 rounded-lg">
                  {activeSorts.length}
                </Badge>
              )}
            </>
          )}
        </Button>
      }
      contentClassName="w-[500px] flex flex-col gap-4"
    >
      <span>Ordina per</span>

      <div className="w-full flex gap-4 flex-col overflow-y-auto max-h-[300px] ">
        {activeSorts.length > 0 ? (
          activeSorts.map((activeField) => {
            const selectable = availableFields.filter(
              (f) => f.value === activeField.field || !usedFields.includes(f.value)
            );

            return (
              <div className="flex gap-4" key={activeField.field}>
                <WasabiSimpleSelect
                  triggerClassName="flex-1"
                  value={activeField.field}
                  onValueChange={(newField) => {
                    // If the user hasn't changed direction from the old field's default,
                    // adopt the new field's default. Otherwise, preserve their explicit choice.
                    const oldDefault = defaultDirFor(activeField.field);
                    const userChangedDir = activeField.direction !== oldDefault;
                    const nextDir = userChangedDir
                      ? activeField.direction
                      : defaultDirFor(newField);

                    const updated = activeSorts.map((s) =>
                      s.index === activeField.index
                        ? { ...s, field: newField, direction: nextDir }
                        : s
                    );
                    onChange(updated);
                  }}
                  groups={[
                    {
                      options: selectable.map((f) => ({
                        label: f.label,
                        value: f.value,
                      })),
                    },
                  ]}
                />

                <SortDirectionSelector
                  direction={activeField.direction}
                  fieldType={getType(activeField.field)}
                  onDirectionChange={(newDirection) => {
                    const updated = activeSorts.map((s) =>
                      s.index === activeField.index ? { ...s, direction: newDirection } : s
                    );
                    onChange(updated);
                  }}
                />

                <Button
                  variant="outline"
                  onClick={() => {
                    const updated = activeSorts.filter((s) => s.index !== activeField.index);
                    onChange(updated);
                  }}
                >
                  <X size={24} />
                </Button>
              </div>
            );
          })
        ) : (
          <span className="mx-auto text-muted-foreground">Nessun ordinamento attivo</span>
        )}
      </div>

      <div className="w-full items-center flex gap-4">
        <Button
          onClick={() => {
            const first = remainingFields[0];
            if (!first) return;

            const newSort: SortField = {
              index: activeSorts.length,
              field: first.value,
              direction: DEFAULT_DIRECTION_BY_TYPE[first.type ?? "default"],
            };
            onChange([...activeSorts, newSort]);
          }}
          className="flex-1"
          disabled={remainingFields.length === 0}
        >
          {remainingFields.length > 0
            ? "Aggiungi ordinamento"
            : "Nessun ordinamento disponibile"}
        </Button>

        {/* <Button variant="outline" onClick={() => onChange([])} className="flex-1">
          Reimposta
        </Button> */}
      </div>
    </WasabiPopover>
  );
}
