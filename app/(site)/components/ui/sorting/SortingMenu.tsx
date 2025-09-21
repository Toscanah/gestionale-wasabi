import { Button } from "@/components/ui/button";
import WasabiPopover from "../wasabi/WasabiPopover";
import { ArrowsDownUp, X } from "@phosphor-icons/react";
import WasabiSelect from "../filters/select/WasabiSelect";
import WasabiSingleSelect from "../wasabi/WasabiSingleSelect";
import SortDirectionSelector from "./SortDirectionSelector";
import { SortDirection } from "@/app/(site)/lib/shared/schemas/common/sorting";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type SortField = {
  index: number;
  field: string;
  direction: SortDirection;
};

interface SortingMenuProps {
  availableFields: string[];
  activeSorts: SortField[];
  onChange: (newSorts: SortField[]) => void;
  triggerClassName?: string;
}

export default function SortingMenu({
  activeSorts,
  availableFields,
  onChange,
  triggerClassName,
}: SortingMenuProps) {
  const usedFields = activeSorts.map((s) => s.field);
  const remainingFields = availableFields.filter((f) => !usedFields.includes(f));

  return (
    <WasabiPopover
      modal={false}
      trigger={
        <Button variant="outline" className={cn("h-10 flex gap-2 items-center", triggerClassName)}>
          <ArrowsDownUp className="h-4 w-4" />
          Ordina
          {activeSorts.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0.5" />
              <Badge variant="secondary" className="px-1 rounded-lg">
                {activeSorts.length}
              </Badge>
            </>
          )}
        </Button>
      }
      contentClassName="w-[500px] flex flex-col gap-4"
    >
      <span>Ordina per</span>

      <div className="w-full flex gap-4 flex-col">
        {activeSorts.length > 0 ? (
          activeSorts.map((activeField) => {
            const selectableFields = availableFields.filter(
              (field) => field === activeField.field || !usedFields.includes(field)
            );

            return (
              <div className="flex gap-4" key={activeField.field}>
                <WasabiSingleSelect
                  className="w-full"
                  onValueChange={(newField) => {
                    const updated = activeSorts.map((s) =>
                      s.index === activeField.index ? { ...s, field: newField } : s
                    );
                    onChange(updated);
                  }}
                  value={activeField.field}
                  groups={[
                    {
                      items: selectableFields.map((field) => ({
                        label: field,
                        value: field,
                      })),
                    },
                  ]}
                />

                <SortDirectionSelector
                  direction={activeField.direction}
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
            const newSort: SortField = {
              index: activeSorts.length,
              field: remainingFields[0], // pick the first available unused field
              direction: "desc",
            };
            onChange([...activeSorts, newSort]);
          }}
          className="w-full"
          disabled={remainingFields.length === 0} // disable if no fields left
        >
          Aggiungi ordinamento
        </Button>

        <Button variant="outline" onClick={() => onChange([])} className="w-full">
          Reimposta
        </Button>
      </div>
    </WasabiPopover>
  );
}
