import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EngagementType } from "@prisma/client";
import DialogWrapper from "../../components/ui/dialog/DialogWrapper";
import { ENGAGEMENT_TYPES } from "../types/EngagementTypes";
import React from "react";

interface EngagementFilterProps {
  activeTypes: EngagementType[];
  setActiveTypes: React.Dispatch<React.SetStateAction<EngagementType[]>>;
}

export default function EngagementFilter({ activeTypes, setActiveTypes }: EngagementFilterProps) {
  return (
    <DialogWrapper
      putSeparator
      size="small"
      title="Seleziona filtri marketing"
      trigger={
        <Button className="w-full">
          Filtri marketing
          {/* <span className="text-muted-foreground">{" "}({activeTypes.length + " attivi"})</span> */}
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        {ENGAGEMENT_TYPES.slice()
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((type) => (
            <div key={type.label} className="flex items-center gap-2">
              <Checkbox
                id={type.label}
                checked={activeTypes.some((t) => t === type.value)}
                onCheckedChange={(checked) =>
                  setActiveTypes((prev) =>
                    checked ? [...prev, type.value] : prev.filter((t) => t !== type.value)
                  )
                }
              />
              <Label className="whitespace-nowrap" htmlFor={type.label}>
                {type.label}
              </Label>
            </div>
          ))}
      </div>
    </DialogWrapper>
  );
}
