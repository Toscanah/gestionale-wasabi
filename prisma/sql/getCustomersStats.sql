-- @param {DateTime} $1:from? Start date of the period (nullable)
-- @param {DateTime} $2:to? End date of the period (nullable)
-- @param {String} $3:query? Free-text search (nullable)
-- @param {Int} $4:offset Pagination offset
-- @param {Int} $5:limit? Pagination limit (nullable, no limit if null)

WITH
    customer_orders AS (
        SELECT
            ho.customer_id,
            o.id AS order_id,
            o.created_at
        FROM
            public."HomeOrder" ho
            JOIN public."Order" o ON o.id = ho.id
        UNION ALL
        SELECT
            po.customer_id,
            o.id AS order_id,
            o.created_at
        FROM
            public."PickupOrder" po
            JOIN public."Order" o ON o.id = po.id
    ),
    order_stats AS (
        SELECT
            co.customer_id,
            COUNT(DISTINCT co.order_id) AS total_orders,
            COALESCE(SUM(pio.quantity::double precision * pio.frozen_price::double precision), 0) AS total_spent,
            MIN(co.created_at) AS first_order_at,
            MAX(co.created_at) AS last_order_at
        FROM
            customer_orders co
            JOIN public."ProductInOrder" pio 
              ON pio.order_id = co.order_id
             AND pio.status = 'IN_ORDER'
        WHERE
            ($1::timestamptz IS NULL OR co.created_at >= $1)
            AND ($2::timestamptz IS NULL OR co.created_at <= $2)
        GROUP BY
            co.customer_id
    )
SELECT
    c.id AS "customerId",
    COALESCE(os.total_orders, 0)::int AS "totalOrders",
    COALESCE(os.total_spent, 0)::double precision AS "totalSpent",
    COALESCE(
        CASE
            WHEN os.total_orders > 0 THEN 
                (os.total_spent::double precision / os.total_orders::double precision)
        END,
        0
    ) AS "averageOrder",
    os.first_order_at AS "firstOrderAt",
    os.last_order_at AS "lastOrderAt",
    COALESCE(
        CASE
            WHEN os.last_order_at IS NOT NULL 
            THEN EXTRACT(DAY FROM (CURRENT_DATE - os.last_order_at))::int
        END,
        0
    ) AS "recency",
    COALESCE(os.total_orders, 0)::int AS "frequency",
    COALESCE(
        CASE
            WHEN os.total_orders > 0 THEN 
                (os.total_spent::double precision / os.total_orders::double precision)
        END,
        0
    ) AS "monetary"
FROM
    public."Customer" c
    LEFT JOIN order_stats os ON os.customer_id = c.id
    LEFT JOIN public."Phone" ph ON ph.id = c.phone_id
    LEFT JOIN public."Address" ad ON ad.customer_id = c.id
WHERE
    (
        $3::text IS NULL
        OR c.name ILIKE '%' || $3::text || '%'
        OR c.surname ILIKE '%' || $3::text || '%'
        OR c.email ILIKE '%' || $3::text || '%'
        OR ph.phone ILIKE '%' || $3::text || '%'
        OR ad.doorbell ILIKE '%' || $3::text || '%'
    )
GROUP BY
    c.id,
    c.name,
    c.surname,
    c.email,
    ph.phone,
    os.total_orders,
    os.total_spent,
    os.first_order_at,
    os.last_order_at
OFFSET $4
LIMIT $5;
