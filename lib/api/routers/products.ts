import { ProductContracts } from "@/lib/shared";
import { createTRPCRouter, publicProcedure } from "../trpc";
import getProducts from "@/lib/database/products/getProducts";
import getProductsWithStats from "@/lib/database/products/computeProductsStats";
import createNewProduct from "@/lib/database/products/createNewProduct";
import updateProduct from "@/lib/database/products/updateProduct";
import addProductToOrder from "@/lib/database/products/addProductToOrder";
import updateProductInOrder from "@/lib/database/products/product-in-order/updateProductInOrder";
import addProductsToOrder from "@/lib/database/products/addProductsToOrder";
import toggleProductOptionInOrder from "@/lib/database/products/toggleProductOptionInOrder";
import updateProductVariationInOrder from "@/lib/database/products/updateProductVariationInOrder";
import toggleProduct from "@/lib/database/products/toggleProduct";
import updatePrintedProducts from "@/lib/database/products/updatePrintedProducts";
import deleteProductsFromOrder from "@/lib/database/products/deleteProductsFromOrder";

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(ProductContracts.GetAll.Input)
    .output(ProductContracts.GetAll.Output)
    .query(({ input }) => getProducts(input)),

  computeStats: publicProcedure
    .input(ProductContracts.ComputeStats.Input)
    .output(ProductContracts.ComputeStats.Output)
    .query(({ input }) => getProductsWithStats(input)),

  create: publicProcedure
    .input(ProductContracts.Create.Input)
    .output(ProductContracts.Create.Output)
    .mutation(({ input }) => createNewProduct(input)),

  update: publicProcedure
    .input(ProductContracts.Update.Input)
    .output(ProductContracts.Update.Output)
    .mutation(({ input }) => updateProduct(input)),

  addToOrder: publicProcedure
    .input(ProductContracts.AddToOrder.Input)
    .output(ProductContracts.AddToOrder.Output)
    .mutation(({ input }) => addProductToOrder(input)),

  updateInOrder: publicProcedure
    .input(ProductContracts.UpdateInOrder.Input)
    .output(ProductContracts.UpdateInOrder.Output)
    .mutation(({ input }) => updateProductInOrder(input)),

  addMultipleToOrder: publicProcedure
    .input(ProductContracts.AddMultipleToOrder.Input)
    .output(ProductContracts.AddMultipleToOrder.Output)
    .mutation(({ input }) => addProductsToOrder(input)),

  updateOptionInOrder: publicProcedure
    .input(ProductContracts.ToggleOptionInOrder.Input)
    .output(ProductContracts.ToggleOptionInOrder.Output)
    .mutation(({ input }) => toggleProductOptionInOrder(input)),

  updateVariationInOrder: publicProcedure
    .input(ProductContracts.UpdateVariationInOrder.Input)
    .output(ProductContracts.UpdateVariationInOrder.Output)
    .mutation(({ input }) => updateProductVariationInOrder(input)),

  toggle: publicProcedure
    .input(ProductContracts.Toggle.Input)
    .output(ProductContracts.Toggle.Output)
    .mutation(({ input }) => toggleProduct(input)),

  updatePrinted: publicProcedure
    .input(ProductContracts.UpdatePrinted.Input)
    .output(ProductContracts.UpdatePrinted.Output)
    .mutation(({ input }) => updatePrintedProducts(input)),

  deleteFromOrder: publicProcedure
    .input(ProductContracts.DeleteFromOrder.Input)
    .output(ProductContracts.DeleteFromOrder.Output)
    .mutation(({ input }) => deleteProductsFromOrder(input)),
});
