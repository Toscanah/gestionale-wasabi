import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditOptions from "../options/EditOptions";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import fetchRequest from "../../util/functions/fetchRequest";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function CategoryDialog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Gestisci Categorie</Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen w-[40vw]">
        <DialogHeader>
          <DialogTitle className="mb-4">Aggiungi prodotto</DialogTitle>

          <Select onValueChange={(e) => setSelectedCategory(JSON.parse(e) as Category)}>
            <SelectTrigger className="h-12 flex-1 min-w-40">
              <SelectValue placeholder="Seleziona una categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={JSON.stringify(cat)}>
                    {cat.category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <EditOptions selectedCategory={selectedCategory}/>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
