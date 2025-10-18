-- @param {DateTime} $1:from? Start date of the period (nullable)
-- @param {DateTime} $2:to? End date of the period (nullable)
-- @param {String}  $3:categoryIds? Comma-separated list of category IDs (nullable)
-- @param {WorkingShift} $4:shift? Filter by working shift (nullable, ALL if null)
-- @param {String} $5:query? Free-text search for products (nullable)

WITH
    category_filter AS (
        SELECT unnest(string_to_array($3::text, ','))::int AS category_id
    ),

    base_products AS (
        SELECT
            p.id,
            p.desc,
            p.code,
            p.rice,
            p.site_price,
            p.home_price,
            p.category_id
        FROM public."Product" p
        WHERE p.active = true
          AND (
              $3::text IS NULL
              OR p.category_id IN (SELECT category_id FROM category_filter)
          )
          AND (
              $5::text IS NULL
              OR p.desc ILIKE '%' || $5::text || '%'
              OR p.code ILIKE '%' || $5::text || '%'
              OR p.site_price::text ILIKE '%' || $5::text || '%'
              OR p.home_price::text ILIKE '%' || $5::text || '%'
          )
    ),

    -- -----------------------------------------------
    -- Pull all paid ProductInOrder rows + customer info
    -- -----------------------------------------------
    pio_orders AS (
        SELECT
            pio.id AS pio_id,
            pio.product_id,
            pio.quantity,
            pio.paid_quantity,
            pio.frozen_price,
            o.shift,
            o.created_at,
            COALESCE(ho.customer_id, po.customer_id) AS customer_id  -- 👈 either Home or Pickup
        FROM public."ProductInOrder" pio
        JOIN public."Order" o ON o.id = pio.order_id
        LEFT JOIN public."HomeOrder" ho ON ho.id = o.id
        LEFT JOIN public."PickupOrder" po ON po.id = o.id
        WHERE pio.status = 'IN_ORDER'
          AND o.status = 'PAID'
          AND ($4::text IS NULL OR o.shift = $4::text::"WorkingShift")
          AND ($1::timestamptz IS NULL OR o.created_at >= $1)
          AND ($2::timestamptz IS NULL OR o.created_at <= $2)
    ),

    -- -----------------------------------------------
    -- Aggregate stats per product
    -- -----------------------------------------------
    product_stats AS (
        SELECT
            po.product_id,
            SUM(LEAST(po.paid_quantity::double precision, po.quantity::double precision)) AS units_sold,
            SUM(LEAST(po.paid_quantity::double precision, po.quantity::double precision) * po.frozen_price::double precision) AS revenue,
            SUM(LEAST(po.paid_quantity::double precision, po.quantity::double precision) * bp.rice::double precision) AS total_rice,
            BOOL_OR(po.customer_id IS NOT NULL) AS has_top_customers -- 👈 efficient boolean flag
        FROM pio_orders po
        JOIN base_products bp ON bp.id = po.product_id
        GROUP BY po.product_id
    ),

    option_stats AS (
        SELECT
            po.product_id,
            oio.option_id,
            opt.option_name,
            SUM(LEAST(po.paid_quantity::double precision, po.quantity::double precision)) AS option_qty
        FROM pio_orders po
        JOIN public."OptionInProductOrder" oio ON oio.product_in_order_id = po.pio_id
        JOIN public."Option" opt ON opt.id = oio.option_id
        GROUP BY po.product_id, oio.option_id, opt.option_name
    )

-- -----------------------------------------------
-- Final result
-- -----------------------------------------------
SELECT
    bp.id AS "productId",
    COALESCE(ps.units_sold, 0)::int AS "unitsSold",
    COALESCE(ps.revenue, 0)::double precision AS "revenue",
    COALESCE(ps.total_rice, 0)::double precision AS "totalRice",
    COALESCE(ps.has_top_customers, false) AS "hasTopCustomers",  -- 👈 NEW FIELD
    json_agg(
        json_build_object(
            'option', os.option_name,
            'count', os.option_qty
        )
        ORDER BY os.option_qty DESC
    ) FILTER (WHERE os.option_id IS NOT NULL) AS "options"
FROM base_products bp
LEFT JOIN product_stats ps ON ps.product_id = bp.id
LEFT JOIN option_stats os ON os.product_id = bp.id
GROUP BY
    bp.id, ps.units_sold, ps.revenue, ps.total_rice, ps.has_top_customers;
