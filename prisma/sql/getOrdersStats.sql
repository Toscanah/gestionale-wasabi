-- @param {DateTime} $1:from? Start date of the period (nullable)
-- @param {DateTime} $2:to? End date of the period (nullable)
-- @param {String}   $3:weekdays? Allowed weekdays as comma-separated string (nullable, e.g. '2,5')
-- @param {WorkingShift} $4:shift? Working shift filter (nullable, 'ALL' means ignore)
-- @param {String}   $5:from_time? Start time of day "HH:mm" (nullable)
-- @param {String}   $6:to_time? End time of day "HH:mm" (nullable)
-- @param {String}   $7:orderTypes? Allowed order types as comma-separated string (nullable, e.g. 'TABLE,PICKUP')

WITH
    days AS (
        SELECT generate_series(
            COALESCE(
                timezone('Europe/Rome', $1)::date,
                (SELECT MIN(timezone('Europe/Rome', created_at))::date FROM "Order")
            ),
            COALESCE(
                timezone('Europe/Rome', $2)::date,
                timezone('Europe/Rome', now())::date
            ),
            interval '1 day'
        )::date AS day
    ),

    worked_days AS (
        SELECT d.day
        FROM days d
        WHERE EXTRACT(DOW FROM d.day) <> 1
          AND (
            $3::text IS NULL
            OR EXTRACT(DOW FROM d.day)::int = ANY (string_to_array($3::text, ',')::int[])
          )
    ),

    num_days AS (
        SELECT GREATEST(COUNT(*), 1)::int AS cnt
        FROM worked_days
    ),

    -- ✅ Orders: parents + suborders
    filtered_orders AS (
        SELECT o.*
        FROM "Order" o
        WHERE o.status = 'PAID'

          AND ($1::timestamptz IS NULL OR o.created_at >= $1::timestamptz)
          AND ($2::timestamptz IS NULL OR o.created_at <= $2::timestamptz)

          AND EXTRACT(DOW FROM timezone('Europe/Rome', o.created_at)) <> 1
          AND (
            $3::text IS NULL
            OR EXTRACT(DOW FROM timezone('Europe/Rome', o.created_at))::int =
               ANY (string_to_array($3::text, ',')::int[])
          )

          AND ($4::"WorkingShift" IS NULL OR o.shift = $4::"WorkingShift")

          AND (
            $5::text IS NULL OR $6::text IS NULL
            OR timezone('Europe/Rome', o.created_at)::time
               BETWEEN $5::time AND $6::time
          )

          AND (
            $7::text IS NULL
            OR o.type = ANY (string_to_array($7::text, ',')::"OrderType"[])
          )
    ),

    -- ✅ Product lines: ONE ROW PER ORDER
    product_lines AS (
        SELECT
            o.id AS order_id,

            SUM(pio.paid_quantity::double precision)                                       AS total_products,
            SUM(pio.paid_quantity::double precision * pio.frozen_price::double precision) AS line_revenue,

            SUM(
              CASE
                WHEN pio.status IN ('IN_ORDER','DELETED_COOKED')
                THEN pio.paid_quantity::double precision * pr.rice::double precision
                ELSE 0::double precision
              END
            ) AS rice_mass,

            SUM(pr.soups::double precision  * pio.paid_quantity::double precision)  AS soups,
            SUM(pr.rices::double precision  * pio.paid_quantity::double precision)  AS rices,
            SUM(pr.salads::double precision * pio.paid_quantity::double precision)  AS salads

        FROM "ProductInOrder" pio
        JOIN "Order" o    ON o.id = pio.order_id
        JOIN "Product" pr ON pr.id = pio.product_id
        GROUP BY o.id
    ),

    order_stats AS (
        SELECT
            fo.type,
            COUNT(DISTINCT fo.id)::int                            AS orders,
            COALESCE(SUM(pl.line_revenue), 0)::double precision   AS revenue,
            COALESCE(SUM(pl.total_products), 0)::double precision AS products,

            SUM(
              CASE WHEN fo.soups IS NOT NULL AND fo.soups <> 0
                   THEN fo.soups::double precision
                   ELSE pl.soups
              END
            ) AS soups,

            SUM(
              CASE WHEN fo.rices IS NOT NULL AND fo.rices <> 0
                   THEN fo.rices::double precision
                   ELSE pl.rices
              END
            ) AS rices,

            SUM(
              CASE WHEN fo.salads IS NOT NULL AND fo.salads <> 0
                   THEN fo.salads::double precision
                   ELSE pl.salads
              END
            ) AS salads,

            SUM(pl.rice_mass) AS rice

        FROM filtered_orders fo
        LEFT JOIN product_lines pl ON pl.order_id = fo.id
        GROUP BY fo.type
    )

SELECT
    os.type,
    os.orders,
    os.revenue,
    os.products,
    os.soups,
    os.rices,
    os.salads,
    os.rice,

    nd.cnt AS num_days,

    (os.revenue / NULLIF(os.orders,0))      AS "revenuePerOrder",
    (os.orders::double precision / nd.cnt)  AS "ordersPerDay",
    (os.revenue / nd.cnt)                   AS "revenuePerDay",
    (os.products / nd.cnt)                  AS "productsPerDay",
    (os.soups / nd.cnt)                     AS "soupsPerDay",
    (os.rices / nd.cnt)                     AS "ricesPerDay",
    (os.salads / nd.cnt)                    AS "saladsPerDay",
    (os.rice / nd.cnt)                      AS "ricePerDay"

FROM order_stats os
CROSS JOIN num_days nd;
