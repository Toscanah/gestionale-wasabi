-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('FIXED_DISCOUNT', 'PERCENTAGE_DISCOUNT', 'GIFT_CARD');

-- CreateEnum
CREATE TYPE "WorkingShift" AS ENUM ('UNSPECIFIED', 'LUNCH', 'DINNER');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('TABLE', 'HOME', 'PICKUP');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'CARD', 'VOUCH', 'CREDIT', 'PROMOTION');

-- CreateEnum
CREATE TYPE "KitchenType" AS ENUM ('HOT', 'COLD', 'HOT_AND_COLD', 'NONE', 'OTHER');

-- CreateEnum
CREATE TYPE "EngagementType" AS ENUM ('QR_CODE', 'IMAGE', 'MESSAGE');

-- CreateEnum
CREATE TYPE "EngagementLedgerStatus" AS ENUM ('ISSUED', 'REDEEMED', 'VOID');

-- CreateEnum
CREATE TYPE "RiceLogType" AS ENUM ('MANUAL', 'BATCH', 'RESET');

-- CreateEnum
CREATE TYPE "PaymentScope" AS ENUM ('UNKNOWN', 'FULL', 'PARTIAL', 'ROMAN');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ACTIVE', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PlannedPayment" AS ENUM ('CASH', 'CARD', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ProductInOrderStatus" AS ENUM ('IN_ORDER', 'DELETED_COOKED', 'DELETED_UNCOOKED');

-- CreateEnum
CREATE TYPE "CustomerOrigin" AS ENUM ('UNKNOWN', 'PHONE', 'WEB', 'COUPON', 'REFERRAL');

-- CreateTable
CREATE TABLE "Rider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "nickname" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Rider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "type" "OrderType" NOT NULL,
    "is_receipt_printed" BOOLEAN NOT NULL DEFAULT false,
    "suborder_of" INTEGER,
    "rices" INTEGER,
    "salads" INTEGER,
    "soups" INTEGER,
    "shift" "WorkingShift" NOT NULL DEFAULT 'UNSPECIFIED',
    "status" "OrderStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableOrder" (
    "table" TEXT NOT NULL,
    "res_name" TEXT,
    "people" INTEGER NOT NULL,
    "id" INTEGER NOT NULL,

    CONSTRAINT "TableOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeOrder" (
    "address_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "when" TEXT NOT NULL DEFAULT 'immediate',
    "contact_phone" TEXT,
    "last_reply_at" TIMESTAMPTZ(3),
    "reply_seen_at" TIMESTAMPTZ(3),
    "planned_payment" "PlannedPayment" NOT NULL DEFAULT 'UNKNOWN',
    "id" INTEGER NOT NULL,
    "prepaid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HomeOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickupOrder" (
    "customer_id" INTEGER,
    "when" TEXT NOT NULL DEFAULT 'immediate',
    "name" TEXT NOT NULL,
    "id" INTEGER NOT NULL,
    "prepaid" BOOLEAN NOT NULL DEFAULT false,
    "planned_payment" "PlannedPayment" NOT NULL DEFAULT 'UNKNOWN',

    CONSTRAINT "PickupOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "civic" TEXT NOT NULL,
    "doorbell" TEXT NOT NULL,
    "floor" TEXT,
    "stair" TEXT,
    "street_info" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "temporary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngagementTemplate" (
    "id" SERIAL NOT NULL,
    "label" TEXT,
    "type" "EngagementType" NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EngagementTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Engagement" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" INTEGER,
    "order_id" INTEGER,
    "template_id" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EngagementLedger" (
    "id" SERIAL NOT NULL,
    "engagement_id" INTEGER NOT NULL,
    "issued_on_order_id" INTEGER NOT NULL,
    "issued_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemed_on_order_id" INTEGER,
    "redeemed_at" TIMESTAMPTZ(3),
    "voided_on_order_id" INTEGER,
    "voided_at" TIMESTAMPTZ(3),
    "status" "EngagementLedgerStatus" NOT NULL DEFAULT 'ISSUED',

    CONSTRAINT "EngagementLedger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "surname" TEXT,
    "email" TEXT,
    "preferences" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "phone_id" INTEGER NOT NULL,
    "order_notes" TEXT,
    "origin" "CustomerOrigin" NOT NULL DEFAULT 'UNKNOWN',

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerStats" (
    "customer_id" INTEGER NOT NULL,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "total_spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "average_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rfm" JSONB NOT NULL DEFAULT '{}',
    "last_order_at" TIMESTAMPTZ(3),
    "first_order_at" TIMESTAMPTZ(3),

    CONSTRAINT "CustomerStats_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Phone" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "PaymentType" NOT NULL,
    "scope" "PaymentScope" NOT NULL DEFAULT 'UNKNOWN',
    "payment_group_code" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiceLog" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rice_batch_id" INTEGER,
    "manual_value" DOUBLE PRECISION,
    "type" "RiceLogType" NOT NULL,

    CONSTRAINT "RiceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiceBatch" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "label" TEXT,

    CONSTRAINT "RiceBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER,
    "code" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "site_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "home_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "kitchen" "KitchenType" NOT NULL DEFAULT 'NONE',
    "rices" INTEGER NOT NULL DEFAULT 0,
    "salads" INTEGER NOT NULL DEFAULT 0,
    "soups" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductInOrder" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "paid_quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "frozen_price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "ProductInOrderStatus" NOT NULL DEFAULT 'IN_ORDER',
    "variation" TEXT,
    "last_printed_quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductInOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryOnOption" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,

    CONSTRAINT "CategoryOnOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "option_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionInProductOrder" (
    "id" SERIAL NOT NULL,
    "product_in_order_id" INTEGER NOT NULL,
    "option_id" INTEGER NOT NULL,

    CONSTRAINT "OptionInProductOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaMessageLog" (
    "id" SERIAL NOT NULL,
    "home_order_id" INTEGER NOT NULL,
    "template_name" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "direction" "MessageDirection" NOT NULL,

    CONSTRAINT "MetaMessageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT,
    "type" "PromotionType" NOT NULL,
    "percentage_value" DOUBLE PRECISION DEFAULT 0,
    "fixed_amount" DOUBLE PRECISION DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(3),
    "never_expires" BOOLEAN NOT NULL DEFAULT false,
    "reusable" BOOLEAN NOT NULL DEFAULT false,
    "max_usages" INTEGER,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionUsage" (
    "id" SERIAL NOT NULL,
    "promotion_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Order_created_at_idx" ON "Order"("created_at");

-- CreateIndex
CREATE INDEX "Order_status_created_at_idx" ON "Order"("status", "created_at");

-- CreateIndex
CREATE INDEX "Order_type_created_at_idx" ON "Order"("type", "created_at");

-- CreateIndex
CREATE INDEX "Order_shift_created_at_idx" ON "Order"("shift", "created_at");

-- CreateIndex
CREATE INDEX "Order_suborder_of_idx" ON "Order"("suborder_of");

-- CreateIndex
CREATE INDEX "Order_is_receipt_printed_idx" ON "Order"("is_receipt_printed");

-- CreateIndex
CREATE INDEX "TableOrder_table_idx" ON "TableOrder"("table");

-- CreateIndex
CREATE INDEX "TableOrder_res_name_idx" ON "TableOrder"("res_name");

-- CreateIndex
CREATE INDEX "HomeOrder_customer_id_idx" ON "HomeOrder"("customer_id");

-- CreateIndex
CREATE INDEX "HomeOrder_address_id_idx" ON "HomeOrder"("address_id");

-- CreateIndex
CREATE INDEX "HomeOrder_last_reply_at_idx" ON "HomeOrder"("last_reply_at");

-- CreateIndex
CREATE INDEX "HomeOrder_reply_seen_at_idx" ON "HomeOrder"("reply_seen_at");

-- CreateIndex
CREATE INDEX "HomeOrder_planned_payment_idx" ON "HomeOrder"("planned_payment");

-- CreateIndex
CREATE INDEX "HomeOrder_prepaid_idx" ON "HomeOrder"("prepaid");

-- CreateIndex
CREATE INDEX "PickupOrder_customer_id_idx" ON "PickupOrder"("customer_id");

-- CreateIndex
CREATE INDEX "PickupOrder_planned_payment_idx" ON "PickupOrder"("planned_payment");

-- CreateIndex
CREATE INDEX "PickupOrder_prepaid_idx" ON "PickupOrder"("prepaid");

-- CreateIndex
CREATE INDEX "Address_customer_id_idx" ON "Address"("customer_id");

-- CreateIndex
CREATE INDEX "Address_active_temporary_idx" ON "Address"("active", "temporary");

-- CreateIndex
CREATE INDEX "EngagementTemplate_type_idx" ON "EngagementTemplate"("type");

-- CreateIndex
CREATE INDEX "EngagementTemplate_redeemable_idx" ON "EngagementTemplate"("redeemable");

-- CreateIndex
CREATE INDEX "Engagement_customer_id_idx" ON "Engagement"("customer_id");

-- CreateIndex
CREATE INDEX "Engagement_order_id_idx" ON "Engagement"("order_id");

-- CreateIndex
CREATE INDEX "Engagement_template_id_idx" ON "Engagement"("template_id");

-- CreateIndex
CREATE INDEX "Engagement_enabled_idx" ON "Engagement"("enabled");

-- CreateIndex
CREATE INDEX "Engagement_order_id_enabled_idx" ON "Engagement"("order_id", "enabled");

-- CreateIndex
CREATE INDEX "Engagement_customer_id_enabled_idx" ON "Engagement"("customer_id", "enabled");

-- CreateIndex
CREATE INDEX "EngagementLedger_engagement_id_idx" ON "EngagementLedger"("engagement_id");

-- CreateIndex
CREATE INDEX "EngagementLedger_issued_on_order_id_idx" ON "EngagementLedger"("issued_on_order_id");

-- CreateIndex
CREATE INDEX "EngagementLedger_redeemed_on_order_id_idx" ON "EngagementLedger"("redeemed_on_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_id_key" ON "Customer"("phone_id");

-- CreateIndex
CREATE INDEX "Customer_active_idx" ON "Customer"("active");

-- CreateIndex
CREATE INDEX "Customer_origin_idx" ON "Customer"("origin");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE INDEX "CustomerStats_total_orders_idx" ON "CustomerStats"("total_orders");

-- CreateIndex
CREATE INDEX "CustomerStats_total_spent_idx" ON "CustomerStats"("total_spent");

-- CreateIndex
CREATE INDEX "CustomerStats_average_order_idx" ON "CustomerStats"("average_order");

-- CreateIndex
CREATE INDEX "CustomerStats_last_order_at_idx" ON "CustomerStats"("last_order_at");

-- CreateIndex
CREATE UNIQUE INDEX "Phone_phone_key" ON "Phone"("phone");

-- CreateIndex
CREATE INDEX "Payment_order_id_idx" ON "Payment"("order_id");

-- CreateIndex
CREATE INDEX "Payment_created_at_idx" ON "Payment"("created_at");

-- CreateIndex
CREATE INDEX "Payment_payment_group_code_idx" ON "Payment"("payment_group_code");

-- CreateIndex
CREATE INDEX "Payment_type_idx" ON "Payment"("type");

-- CreateIndex
CREATE INDEX "Payment_scope_idx" ON "Payment"("scope");

-- CreateIndex
CREATE INDEX "Payment_order_id_created_at_idx" ON "Payment"("order_id", "created_at");

-- CreateIndex
CREATE INDEX "RiceLog_rice_batch_id_idx" ON "RiceLog"("rice_batch_id");

-- CreateIndex
CREATE INDEX "RiceLog_created_at_idx" ON "RiceLog"("created_at");

-- CreateIndex
CREATE INDEX "RiceLog_type_idx" ON "RiceLog"("type");

-- CreateIndex
CREATE INDEX "RiceBatch_label_idx" ON "RiceBatch"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- CreateIndex
CREATE INDEX "Product_category_id_idx" ON "Product"("category_id");

-- CreateIndex
CREATE INDEX "Product_active_idx" ON "Product"("active");

-- CreateIndex
CREATE INDEX "Product_kitchen_idx" ON "Product"("kitchen");

-- CreateIndex
CREATE INDEX "Product_code_idx" ON "Product"("code");

-- CreateIndex
CREATE INDEX "Product_desc_idx" ON "Product"("desc");

-- CreateIndex
CREATE INDEX "ProductInOrder_order_id_idx" ON "ProductInOrder"("order_id");

-- CreateIndex
CREATE INDEX "ProductInOrder_product_id_idx" ON "ProductInOrder"("product_id");

-- CreateIndex
CREATE INDEX "ProductInOrder_status_idx" ON "ProductInOrder"("status");

-- CreateIndex
CREATE INDEX "ProductInOrder_created_at_idx" ON "ProductInOrder"("created_at");

-- CreateIndex
CREATE INDEX "ProductInOrder_order_id_status_idx" ON "ProductInOrder"("order_id", "status");

-- CreateIndex
CREATE INDEX "ProductInOrder_order_id_created_at_idx" ON "ProductInOrder"("order_id", "created_at");

-- CreateIndex
CREATE INDEX "Category_active_idx" ON "Category"("active");

-- CreateIndex
CREATE INDEX "CategoryOnOption_category_id_idx" ON "CategoryOnOption"("category_id");

-- CreateIndex
CREATE INDEX "CategoryOnOption_option_id_idx" ON "CategoryOnOption"("option_id");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryOnOption_category_id_option_id_key" ON "CategoryOnOption"("category_id", "option_id");

-- CreateIndex
CREATE INDEX "OptionInProductOrder_product_in_order_id_idx" ON "OptionInProductOrder"("product_in_order_id");

-- CreateIndex
CREATE INDEX "OptionInProductOrder_option_id_idx" ON "OptionInProductOrder"("option_id");

-- CreateIndex
CREATE INDEX "MetaMessageLog_home_order_id_idx" ON "MetaMessageLog"("home_order_id");

-- CreateIndex
CREATE INDEX "MetaMessageLog_created_at_idx" ON "MetaMessageLog"("created_at");

-- CreateIndex
CREATE INDEX "MetaMessageLog_home_order_id_created_at_idx" ON "MetaMessageLog"("home_order_id", "created_at");

-- CreateIndex
CREATE INDEX "MetaMessageLog_home_order_id_direction_created_at_idx" ON "MetaMessageLog"("home_order_id", "direction", "created_at");

-- AddForeignKey
ALTER TABLE "TableOrder" ADD CONSTRAINT "TableOrder_id_fkey" FOREIGN KEY ("id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeOrder" ADD CONSTRAINT "HomeOrder_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeOrder" ADD CONSTRAINT "HomeOrder_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeOrder" ADD CONSTRAINT "HomeOrder_id_fkey" FOREIGN KEY ("id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickupOrder" ADD CONSTRAINT "PickupOrder_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickupOrder" ADD CONSTRAINT "PickupOrder_id_fkey" FOREIGN KEY ("id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "EngagementTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementLedger" ADD CONSTRAINT "EngagementLedger_engagement_id_fkey" FOREIGN KEY ("engagement_id") REFERENCES "Engagement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementLedger" ADD CONSTRAINT "EngagementLedger_issued_on_order_id_fkey" FOREIGN KEY ("issued_on_order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementLedger" ADD CONSTRAINT "EngagementLedger_redeemed_on_order_id_fkey" FOREIGN KEY ("redeemed_on_order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EngagementLedger" ADD CONSTRAINT "EngagementLedger_voided_on_order_id_fkey" FOREIGN KEY ("voided_on_order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_phone_id_fkey" FOREIGN KEY ("phone_id") REFERENCES "Phone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerStats" ADD CONSTRAINT "CustomerStats_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiceLog" ADD CONSTRAINT "RiceLog_rice_batch_id_fkey" FOREIGN KEY ("rice_batch_id") REFERENCES "RiceBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInOrder" ADD CONSTRAINT "ProductInOrder_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInOrder" ADD CONSTRAINT "ProductInOrder_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnOption" ADD CONSTRAINT "CategoryOnOption_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryOnOption" ADD CONSTRAINT "CategoryOnOption_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionInProductOrder" ADD CONSTRAINT "OptionInProductOrder_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionInProductOrder" ADD CONSTRAINT "OptionInProductOrder_product_in_order_id_fkey" FOREIGN KEY ("product_in_order_id") REFERENCES "ProductInOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaMessageLog" ADD CONSTRAINT "MetaMessageLog_home_order_id_fkey" FOREIGN KEY ("home_order_id") REFERENCES "HomeOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionUsage" ADD CONSTRAINT "PromotionUsage_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionUsage" ADD CONSTRAINT "PromotionUsage_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
