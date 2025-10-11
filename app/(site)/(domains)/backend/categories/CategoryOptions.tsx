"use client";

import React, { useState } from "react";
import { Option } from "@prisma/client";
import WasabiUniversalSelect from "@/app/(site)/components/ui/wasabi/WasabiUniversalSelect ";

interface CategoryOptionsProps {
  onChange: (value: Option[]) => void;
  options: Option[];
  allOptions: Option[];
}

export default function CategoryOptions({ allOptions, onChange, options }: CategoryOptionsProps) {
  const [currentOptions, setCurrentOptions] = useState<Option[]>(options ?? []);

  return (
    <WasabiUniversalSelect
      appearance="form"
      mode="multi"
      triggerClassName="max-w-full"
      placeholder="Seleziona opzioni..."
      selectedValues={currentOptions.map((opt) => opt.id.toString())}
      onChange={(selected) => {
        const selectedIds = selected.map((s) => Number(s));
        const newOptions = allOptions.filter((opt) => selectedIds.includes(opt.id));
        setCurrentOptions(newOptions);
        onChange(newOptions);
      }}
      groups={[
        {
          options: allOptions.map((opt) => ({
            value: opt.id.toString(),
            label: opt.option_name,
          })),
        },
      ]}
    />
  );
}
