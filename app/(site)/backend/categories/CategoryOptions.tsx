import React, { useEffect, useImperativeHandle, useState, forwardRef, useCallback } from "react";
import { ControllerRenderProps } from "react-hook-form";
import SelectWrapper from "../../components/select/SelectWrapper";
import { Button } from "@/components/ui/button";
import { X } from "@phosphor-icons/react";
import { Option } from "../../types/Option";
import { debounce } from "lodash";

interface CategoryOptionsProps {
  field: ControllerRenderProps;
  options: Option[];
  selectedOptions: Option[];
}

export default function CategoryOptions({ field, options }: CategoryOptionsProps) {
  const [allOptions, setAllOptions] = useState<Option[]>(options);
  const [currentOptions, setCurrentOptions] = useState<Option[]>(field.value ?? []);

  const handleAddOption = (optionId: number) => {
    const optionToAdd = allOptions.find((option) => option.option.id === optionId);

    if (optionToAdd) {
      const newOptions = [...currentOptions, optionToAdd];
      setCurrentOptions(newOptions);
      field.onChange(newOptions);
    }
  };

  const handleRemoveOption = (optionId: number) => {
    const newOptions = currentOptions.filter((option) => option.option.id !== optionId);
    setCurrentOptions(newOptions);
    field.onChange(newOptions);
  };

  return (
    <div className="max-w-[30vw] w-[30vw] flex flex-col gap-4">
      <div className="flex flex-wrap gap-4 justify-between items-center max-w-[30vw] w-[30vw]">
        {currentOptions.length > 0 ? (
          currentOptions.map((option) => (
            <Button
              variant={"outline"}
              className="flex gap-2 items-center justify-center grow h-20 text-xl group"
              key={option.option.id}
              type="button"
              onClick={() => handleRemoveOption(option.option.id)}
            >
              <X
                size={42}
                className="transform transition-transform duration-300 
                        group-hover:rotate-[360deg] hover:font-bold hover:drop-shadow-2xl"
              />
              {option.option.option_name}
            </Button>
          ))
        ) : (
          <div className="border rounded-md w-full h-20 grow flex justify-center items-center text-xl">
            Nessuna opzione
          </div>
        )}
      </div>

      <SelectWrapper
        className="h-10"
        placeholder="Aggiungi una opzione"
        onValueChange={(e) => handleAddOption(Number(e))}
        fixedValue
        groups={[
          {
            items: allOptions
              .filter(
                (option) =>
                  !currentOptions.some(
                    (currentOption) => currentOption.option.id === option.option.id
                  )
              )
              .map((option) => ({
                value: option.option.id.toString(),
                name: option.option.option_name,
              })),
          },
        ]}
      />
    </div>
  );
}
