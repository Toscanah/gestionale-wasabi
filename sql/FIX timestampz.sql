BEGIN;

UPDATE "Order"
SET
    created_at = created_at + INTERVAL '2 hours'
WHERE
    created_at < '2025-10-19 00:00:00+02';

UPDATE "Payment"
SET
    created_at = created_at + INTERVAL '2 hours'
WHERE
    created_at < '2025-10-19 00:00:00+02';

UPDATE "ProductInOrder"
SET
    created_at = created_at + INTERVAL '2 hours'
WHERE
    created_at < '2025-10-19 00:00:00+02';

UPDATE "Engagement"
SET
    created_at = created_at + INTERVAL '2 hours'
WHERE
    created_at < '2025-10-19 00:00:00+02';

UPDATE "EngagementLedger"
SET
    issued_at = issued_at + INTERVAL '2 hours'
WHERE
    issued_at < '2025-10-19 00:00:00+02';

UPDATE "EngagementLedger"
SET
    redeemed_at = redeemed_at + INTERVAL '2 hours'
WHERE
    redeemed_at IS NOT NULL
    AND redeemed_at < '2025-10-19 00:00:00+02';

UPDATE "EngagementLedger"
SET
    voided_at = voided_at + INTERVAL '2 hours'
WHERE
    voided_at IS NOT NULL
    AND voided_at < '2025-10-19 00:00:00+02';

UPDATE "MetaMessageLog"
SET
    created_at = created_at + INTERVAL '2 hours'
WHERE
    created_at < '2025-10-19 00:00:00+02';

UPDATE "RiceLog"
SET
    created_at = created_at + INTERVAL '2 hours'
WHERE
    created_at < '2025-10-19 00:00:00+02';

COMMIT;