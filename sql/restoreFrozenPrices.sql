UPDATE public."ProductInOrder"
SET frozen_price = CASE
    WHEN o.type = 'TABLE' THEN p.site_price
    ELSE p.home_price
END
FROM public."Order" o, public."Product" p
WHERE public."ProductInOrder".order_id = o.id
  AND public."ProductInOrder".product_id = p.id;
