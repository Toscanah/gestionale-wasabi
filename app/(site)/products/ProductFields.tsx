import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormField from "../components/FormField";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField as BaseFormField } from "@/components/ui/form";
import { useFocusCycle } from "../components/hooks/useFocusCycle";
import { useEffect, useRef, useState } from "react";
import getProductForm, { FormValues } from "../components/forms/getProductForm";
import { ProductCategory } from "@prisma/client";
import fetchRequest from "../util/functions/fetchRequest";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ProductFields({
  onSubmit,
  footerName,
  productValues,
}: {
  onSubmit: (values: FormValues) => void;
  footerName: string;
  productValues?: FormValues;
}) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const form = getProductForm(productValues);

  useEffect(() => {
    fetchRequest<ProductCategory[]>(
      "GET",
      "/api/categories/",
      "getCategories"
    ).then((categories) => setCategories(categories));
  }, []);

  const codeRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const riceRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const sitePriceRef = useRef<HTMLInputElement>(null);
  const homePriceRef = useRef<HTMLInputElement>(null);
  const catRef = useRef<HTMLButtonElement>(null);

  const { handleKeyDown } = useFocusCycle([
    nameRef,
    codeRef,
    riceRef,
    descRef,
    sitePriceRef,
    homePriceRef,
    catRef,
  ]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            label="Nome"
            ref={nameRef}
            handleKeyDown={handleKeyDown}
          />
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
              label="Prezzo in loco"
              type="number"
              ref={sitePriceRef}
              handleKeyDown={handleKeyDown}
            />
            <FormField
              control={form.control}
              handleKeyDown={handleKeyDown}
              name="home_price"
              label="Prezzo asporto"
              type="number"
              ref={homePriceRef}
            />

            <BaseFormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        ref={catRef}
                        onKeyDown={(e) => handleKeyDown(e)}
                      >
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

          <div className="flex w-full">
            <DialogFooter className="w-full">
              <Button type="submit" className="w-full">
                {footerName}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </Form>
    </div>
  );
}
