import { Category } from "@prisma/client";
import WasabiSelect from "./WasabiSelect";
import capitalizeFirstLetter from "@/app/(site)/lib/utils/global/string/capitalizeFirstLetter";

interface CategoryFilterProps {
  selectedCategoryIds: number[];
  onCategoryIdsChange: (updatedCategories: number[]) => void;
  allCategories: Category[];
  disabled?: boolean;
}

export default function CategoryFilter({
  selectedCategoryIds,
  onCategoryIdsChange,
  allCategories,
  disabled = false,
}: CategoryFilterProps) {
  const handleChange = (newValues: string[]) => {
    if (newValues.length === 0 || newValues.length === allCategories.length) {
      onCategoryIdsChange(allCategories.map((c) => c.id));
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
      shouldClear={selectedCategoryIds.length!== allCategories.length}
      groups={[
        {
          options: allCategories.map((c) => ({
            label: capitalizeFirstLetter(c.category),
            value: c.id.toString(),
          })),
        },
      ]}
      selectedValues={selectedCategoryIds.map(String)}
      onChange={handleChange}
    />
  );
}
