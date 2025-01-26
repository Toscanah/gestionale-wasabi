--- per resettare gli id quando trasferisco i dati
SELECT
    setval (
        pg_get_serial_sequence ('"Order"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "Order";

SELECT
    setval (
        pg_get_serial_sequence ('"TableOrder"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "TableOrder";

SELECT
    setval (
        pg_get_serial_sequence ('"HomeOrder"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "HomeOrder";

SELECT
    setval (
        pg_get_serial_sequence ('"PickupOrder"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "PickupOrder";

SELECT
    setval (
        pg_get_serial_sequence ('"Address"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "Address";

SELECT
    setval (
        pg_get_serial_sequence ('"Customer"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "Customer";

SELECT
    setval (
        pg_get_serial_sequence ('"Phone"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "Phone";

SELECT
    setval (
        pg_get_serial_sequence ('"Payment"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "Payment";

SELECT
    setval (
        pg_get_serial_sequence ('"Rice"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "Rice";

SELECT
    setval (
        pg_get_serial_sequence ('"RiceBatchLog"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "RiceBatchLog";

SELECT
    setval (
        pg_get_serial_sequence ('"RiceBatch"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "RiceBatch";

SELECT
    setval (
        pg_get_serial_sequence ('"Product"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "Product";

SELECT
    setval (
        pg_get_serial_sequence ('"ProductInOrder"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "ProductInOrder";

SELECT
    setval (
        pg_get_serial_sequence ('"Category"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "Category";

SELECT
    setval (
        pg_get_serial_sequence ('"CategoryOnOption"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "CategoryOnOption";

SELECT
    setval (
        pg_get_serial_sequence ('"Option"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "Option";

SELECT
    setval (
        pg_get_serial_sequence ('"OptionInProductOrder"', 'id'),
        coalesce(max(id) + 1, 1),
        false
    )
FROM
    "OptionInProductOrder";