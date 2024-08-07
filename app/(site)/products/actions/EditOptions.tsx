import { DotsThree, X } from "@phosphor-icons/react";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Option } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import fetchRequest from "../../util/functions/fetchRequest";
import { Button } from "@/components/ui/button";

export default function EditOptions({ product }: { product: ProductWithInfo }) {
  const [allOptions, setAllOptions] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    product.category.options.map((opt) => opt.option)
  );

  const fetchOptions = () => {
    fetchRequest<Option[]>("GET", "/api/options/", "getAllOptions").then((options) =>
      setAllOptions(options)
    );
  };

  const handleAddOption = (optionId: string) => {
    const optionToAdd = allOptions.find((option) => option.id.toString() === optionId);
    if (optionToAdd) {
      setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, optionToAdd]);
    }

    fetchRequest("POST", "/api/options/", "addOptionToCategory")
  };

  const handleRemoveOption = (optionId: number) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.filter((option) => option.id !== optionId)
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DotsThree size={24} className="hover:cursor-pointer" onClick={() => fetchOptions()} />
      </DialogTrigger>
      <DialogContent className="max-w-screen w-[50vw]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="mb-4">Modifica opzioni</DialogTitle>
          <div className="flex gap-2 flex-wrap justify-between">
            {selectedOptions.map((option) => (
                <Button key={option.id} variant="outline" className="text-lg p-2 gap-2 h-12">
                  <X
                    size={18}
                    onClick={() => {
                      handleRemoveOption(option.id);
                    }}
                  />
                  {option.option_name}
                </Button>
              ))}

            <Select onValueChange={handleAddOption} value={""}>
              <SelectTrigger className="h-12 flex-1 min-w-40">
                <SelectValue placeholder="Aggiungi un'opzione" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {allOptions
                      .filter(
                        (option) =>
                          !selectedOptions.some((selectedOption) => selectedOption.id === option.id)
                      )
                      .map((option) => (
                        <SelectItem key={option.id} value={option.id.toString()}>
                          {option.option_name}
                        </SelectItem>
                      ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
