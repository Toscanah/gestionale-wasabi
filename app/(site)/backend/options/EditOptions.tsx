import { X } from "@phosphor-icons/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Category, Option } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import fetchRequest from "../../util/functions/fetchRequest";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function EditOptions({
  selectedCategory,
}: {
  selectedCategory: Category | undefined;
}) {
  const [allOptions, setAllOptions] = useState<Option[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      fetchOptionsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => fetchAllOptions(), []);

  // const updateOptions = () => {
  //   fetchRequest("POST", "/api/options/", "editOptionsOfCategory", {
  //     category: product.category,
  //     options: selectedOptions,
  //   }).then(() => {

  //   });
  // };

  const fetchOptionsByCategory = (selectedCategory: Category) => {
    fetchRequest<Option[]>("GET", "/api/options/", "getOptionsByCategory", {
      categoryId: selectedCategory.id,
    }).then((categoryOptions) => {
      setCategoryOptions(categoryOptions);
    });
  };

  const fetchAllOptions = () => {
    fetchRequest<Option[]>("GET", "/api/options/", "getAllOptions").then((allOptions) => {
      setAllOptions(allOptions);
    });
  };

  // const handleAddOption = (optionId: string) => {
  //   const optionToAdd = allOptions.find((option) => option.id.toString() === optionId);
  //   if (optionToAdd) {
  //     setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, optionToAdd]);
  //   }
  // };

  // const handleRemoveOption = (optionId: number) => {
  //   setSelectedOptions((prevSelectedOptions) =>
  //     prevSelectedOptions.filter((option) => option.id !== optionId)
  //   );
  // };

  return (
    <div>
      <Label>Opzioni della categoria</Label>
      <div className="flex gap-2 flex-wrap justify-between">
        {categoryOptions.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            className="text-lg p-2 gap-2 h-12"
            type="button"
          >
            <X
              size={18}
              onClick={() => {
                //handleRemoveOption(option.id);
              }}
            />
            {option.option_name}
          </Button>
        ))}
      </div>
    </div>
  );
}
