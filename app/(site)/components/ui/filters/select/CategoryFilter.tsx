import { Category } from "@prisma/client";
import WasabiSelect from "../../wasabi/WasabiSelect";
import capitalizeFirstLetter from "@/app/(site)/lib/utils/global/string/capitalizeFirstLetter";
import { useMemo } from "react";

interface CategoryFilterProps {
  selectedCategoryIds: number[];
  onCategoryIdsChange: (updatedCategories: number[]) => void;
  allCategories: Category[];
  disabled?: boolean;
  categoryCounts?: Record<number, number>;
  triggerClassName?: string;
}

export default function CategoryFilter({
  selectedCategoryIds,
  onCategoryIdsChange,
  allCategories,
  disabled = false,
  categoryCounts = {},
  triggerClassName,
}: CategoryFilterProps) {
  const extendedCategories = useMemo<Category[]>(
    () => [{ id: -1, category: "Senza categoria", active: true }, ...allCategories],
    [allCategories]
  );

  const handleChange = (newValues: string[]) => {
    if (newValues.length === 0 || newValues.length === extendedCategories.length) {
      onCategoryIdsChange(extendedCategories.map((c) => c.id));
    } else {
      onCategoryIdsChange(newValues.map(Number));
    }
  };

  return (
    <WasabiSelect
      disabled={disabled}
      allLabel="Tutte"
      title="Categorie"
      mode="multi"
      inputPlaceholder="Cerca categoria..."
      triggerClassName={triggerClassName}
      shouldClear={selectedCategoryIds.length !== extendedCategories.length}
      groups={[
        {
          options: extendedCategories.map((c) => ({
            label: c.id === -1 ? "Senza categoria" : capitalizeFirstLetter(c.category),
            value: c.id.toString(),
            count: categoryCounts[c.id] ?? undefined,
          })),
        },
      ]}
      selectedValues={selectedCategoryIds.map(String)}
      onChange={handleChange}
    />
  );
}
