import { OrderByType, ProductInOrder } from "@/app/(site)/lib/shared";
import { productsAPI } from "@/lib/server/api";
import { UpdateProductsListFunction } from "../useProductsManager";
import { toastError } from "@/app/(site)/lib/utils/global/toast"; // for helpful UX

type UseProductModsParans = {
  order: OrderByType;
  updateProductsList: UpdateProductsListFunction;
};

export default function useProductMods({ order, updateProductsList }: UseProductModsParans) {
  // -----------------------------
  // Update (toggle) OPTION in product (true optimistic)
  // -----------------------------
  const updateProductOptionMutation = productsAPI.updateOptionInOrder.useMutation({
    onMutate: async ({ productInOrderId, optionId }) => {
      // Block editing on optimistic (unsaved) rows
      const prevProduct = order.products.find((p) => p.id === productInOrderId);
      if (!prevProduct) {
        throw new Error("Product not found in current order state");
      }
      if (prevProduct.id < 0) {
        toastError("Attendi il salvataggio del prodotto prima di modificarlo.");
        throw new Error("Cannot modify optimistic product");
      }

      // Build optimistic product: toggle the presence of the option locally
      const hasOption = prevProduct.options.some((o) => o.option.id === optionId);

      const optimisticProduct: ProductInOrder = {
        ...prevProduct,
        options: hasOption
          ? prevProduct.options.filter((o) => o.option.id !== optionId)
          : [
              ...prevProduct.options,
              // Minimal placeholder; server will return the authoritative object on success
              {
                ...({} as any),
                product_in_order_id: prevProduct.id,
                option: { ...({} as any), id: optionId },
              },
            ],
      };

      // Apply optimistic change (UI only)
      updateProductsList({ updatedProducts: [optimisticProduct], isDummyUpdate: true });

      // Keep previous product for rollback
      return { prevProduct };
    },

    onSuccess: ({ deleted, optionInProductOrder }) => {
      // Apply authoritative result from server
      updateProductsList({
        updatedProducts: order.products.map((product) => {
          if (product.id !== optionInProductOrder.product_in_order_id) return product;

          return {
            ...product,
            options: deleted
              ? product.options.filter((o) => o.option.id !== optionInProductOrder.option.id)
              : [...product.options, optionInProductOrder],
          };
        }),
      });
    },

    onError: (_err, _vars, ctx) => {
      // Rollback to previous product if the mutation failed
      if (ctx?.prevProduct) {
        updateProductsList({ updatedProducts: [ctx.prevProduct], isDummyUpdate: true });
      }
    },
  });

  const updateProductOption = (productInOrderId: number, optionId: number) => {
    return updateProductOptionMutation.mutateAsync({ productInOrderId, optionId });
  };

  // -----------------------------
  // Update VARIATION in product (true optimistic)
  // -----------------------------
  const updateProductVariationMutation = productsAPI.updateVariationInOrder.useMutation({
    onMutate: async ({ variation, productInOrderId }) => {
      const prevProduct = order.products.find((p) => p.id === productInOrderId);
      if (!prevProduct) {
        throw new Error("Product not found in current order state");
      }
      if (prevProduct.id < 0) {
        toastError("Attendi il salvataggio del prodotto prima di modificarlo.");
        throw new Error("Cannot modify optimistic product");
      }

      // Assuming your ProductInOrder has a 'variation' field
      const optimisticProduct: ProductInOrder = {
        ...prevProduct,
        variation,
      };

      // Apply optimistic change immediately (UI only)
      updateProductsList({ updatedProducts: [optimisticProduct], isDummyUpdate: true });

      return { prevProduct };
    },

    onSuccess: (updatedProduct) => {
      // Replace with server-confirmed product
      updateProductsList({ updatedProducts: [updatedProduct] });
    },

    onError: (_err, _vars, ctx) => {
      // Rollback to previous product
      if (ctx?.prevProduct) {
        updateProductsList({ updatedProducts: [ctx.prevProduct], isDummyUpdate: true });
      }
    },
  });

  const updateProductVariation = (variation: string, productInOrderId: number) => {
    return updateProductVariationMutation.mutateAsync({ variation, productInOrderId });
  };

  return {
    updateProductOption,
    updateProductVariation,
  };
}
