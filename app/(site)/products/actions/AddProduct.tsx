import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "@phosphor-icons/react";
import getProductForm, { FormValues } from "../getProductForm";
import FormField from "../../components/FormField";
import { Textarea } from "@/components/ui/textarea";
import fetchRequest from "../../util/fetchRequest";
import { ProductWithInfo } from "../../types/ProductWithInfo";
import { toast } from "sonner";
import { ProductCategory } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField as BaseFormField } from "@/components/ui/form";
import { useEffect, useRef, useState } from "react";
import { useFocusCycle } from "../../components/hooks/useFocusCycle";

export default function AddProduct() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const form = getProductForm();

  const codeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const riceRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const sitePriceRef = useRef<HTMLInputElement>(null);
  const homePriceRef = useRef<HTMLInputElement>(null);

  const { handleKeyDown } = useFocusCycle([
    codeRef,
    nameRef,
    riceRef,
    descRef,
    sitePriceRef,
    homePriceRef,
  ]);

  useEffect(() => {
    fetchRequest<ProductCategory[]>(
      "GET",
      "/api/categories/?action=getCategories"
    ).then((categories) => setCategories(categories));
  }, []);

  function onSubmit(values: FormValues) {
    fetchRequest<ProductWithInfo>(
      "POST",
      "/api/products/",
      "createProduct",
      values
    ).then((product) => {
      if (product) {
        toast.success("Successo", {
          description: "Il prodotto è stato aggiunto correttamente",
        });
      } else {
        toast.error("Errore", {
          description: "Il prodotto esiste già",
        });
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <Plus size={32} className="hover:cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen w-[50vw]">
        <DialogHeader>
          <DialogTitle className="mb-4">Aggiungi prodotto</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  label="Codice"
                  ref={codeRef}
                  handleKeyDown={handleKeyDown}
                />
                <FormField
                  control={form.control}
                  name="name"
                  label="Nome"
                  ref={nameRef}
                  handleKeyDown={handleKeyDown}
                />
                <FormField
                  control={form.control}
                  name="rice"
                  label="Riso"
                  type="number"
                  ref={riceRef}
                  handleKeyDown={handleKeyDown}
                />
              </div>

              <FormField
                control={form.control}
                name="desc"
                label="Descrizione"
                handleKeyDown={handleKeyDown}
                ref={descRef}
              >
                <Textarea className="resize-none" />
              </FormField>

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="site_price"
                  label="Prezzo sito"
                  type="number"
                  ref={sitePriceRef}
                  handleKeyDown={handleKeyDown}
                />
                <FormField
                  control={form.control}
                  handleKeyDown={handleKeyDown}
                  name="home_price"
                  label="Prezzo casa"
                  type="number"
                  ref={homePriceRef}
                />

                <BaseFormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Email</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              value={category.id.toString()}
                              key={category.id}
                            >
                              {category.category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <DialogFooter>
                  <Button type="submit">Aggiungi</Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
