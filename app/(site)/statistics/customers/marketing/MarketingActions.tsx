import DialogWrapper from "@/app/(site)/components/dialog/DialogWrapper";
import fetchRequest from "@/app/(site)/functions/api/fetchRequest";
import { Product, Promotion } from "@/app/(site)/models";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

interface MarketingActionsProps {
  customerId: number;
}

export default function MarketingActions({ customerId }: MarketingActionsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number | "">("");
  const [discountPercentage, setDiscountPercentage] = useState<number | "">("");

  const fetchProducts = () =>
    fetchRequest<Product[]>("GET", "/api/products", "getProducts").then((products) =>
      setProducts(products.filter((p) => p.active))
    );

  const fetchPromotions = () =>
    fetchRequest<Promotion[]>("GET", "/api/promotions", "getPromotionsByCustomer", {
      customerId,
    }).then(setPromotions);

  useEffect(() => {
    fetchProducts();
  }, []);

  const removePromotion = async (promotionId: number) => {
    await fetchRequest("DELETE", "/api/promotions", "deletePromotion", { promotionId });
    setPromotions(promotions.filter((p) => p.id !== promotionId)); // Remove from UI
  };

  const addPromotion = async () => {
    if (!selectedProduct && !discountAmount && !discountPercentage) return;

    // const newPromotion = await fetchRequest<Promotion>("POST", "/api/promotions", "addPromotion", {
    //   customerId,
    //   extra_product_id: selectedProduct || null,
    //   discount_amount: discountAmount || null,
    //   discount_percentage: discountPercentage || null,
    // });

    // setPromotions([...promotions, newPromotion]); // Update UI
    // setSelectedProduct(null);
    // setDiscountAmount("");
    // setDiscountPercentage("");
  };

  return (
    <DialogWrapper trigger={<Button>Azioni marketing</Button>} title="Azioni marketing">
      {/* <div className="flex items-center gap-2">
        <Checkbox />
        <Label>QR code per recensioni Maps?</Label>
      </div> */}

      <div className="flex gap-2 items-center w-full">
        <div className="flex flex-col gap-2 w-full h-96">
          <h3>Sconti</h3>
          <Separator orientation="horizontal" />

          {promotions.length > 0 ? (
            promotions.map((promotion) => (
              <div key={promotion.id} className="flex justify-between items-center">
                <div>
                  {!promotion.extra_product && (
                    <span>
                      💰 Sconto: {promotion.discount_percentage || promotion.discount_amount}%
                    </span>
                  )}
                </div>
                <Button variant="destructive" onClick={() => removePromotion(promotion.id)}>
                  Rimuovi
                </Button>
              </div>
            ))
          ) : (
            <p className="">Nessun sconto attivo per questo cliente</p>
          )}
        </div>

        <Separator orientation="vertical" />

        <div className="flex flex-col gap-2 w-full h-96">
          <h3>Prodotti bonus</h3>
          <Separator orientation="horizontal" />
        </div>
      </div>

      {/* <div className="mt-4">
        <h3 className="text-lg font-semibold">Promozioni attive:</h3>
        {promotions.length > 0 ? (
          promotions.map((promotion) => (
            <div key={promotion.id} className="flex justify-between items-center border p-2 mt-2">
              <div>
                {promotion.extra_product ? (
                  <span>🎁 Extra: {promotion.extra_product.desc}</span>
                ) : (
                  <span>
                    💰 Sconto: {promotion.discount_percentage || promotion.discount_amount}%
                  </span>
                )}
              </div>
              <Button variant="destructive" onClick={() => removePromotion(promotion.id)}>
                Rimuovi
              </Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">Nessuna promozione attiva.</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Aggiungi una promozione:</h3>
        <div className="flex flex-col gap-2 mt-2">
          <Select
            value={selectedProduct || ""}
            onChange={(e) => setSelectedProduct(Number(e.target.value) || null)}
          >
            <option value="">Seleziona un prodotto extra</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.desc}
              </option>
            ))}
          </Select>


          <input
            type="number"
            placeholder="Sconto in €"
            className="border p-2 rounded"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value ? Number(e.target.value) : "")}
          />


          <input
            type="number"
            placeholder="Sconto in %"
            className="border p-2 rounded"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value ? Number(e.target.value) : "")}
          />

          <Button onClick={addPromotion} className="mt-2">
            Aggiungi promozione
          </Button>
        </div>
      </div> */}
    </DialogWrapper>
  );
}
