import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const OrderScalarFieldEnumSchema = z.enum(['id','created_at','updated_at','total','discount','is_receipt_printed','suborder_of','state','type']);

export const TableOrderScalarFieldEnumSchema = z.enum(['id','order_id','table','res_name','people']);

export const HomeOrderScalarFieldEnumSchema = z.enum(['id','order_id','address_id','customer_id','when','notes','contact_phone']);

export const PickupOrderScalarFieldEnumSchema = z.enum(['id','order_id','customer_id','when','name']);

export const AddressScalarFieldEnumSchema = z.enum(['id','customer_id','street','civic','doorbell','floor','stair','street_info','active','temporary']);

export const CustomerScalarFieldEnumSchema = z.enum(['id','name','surname','email','preferences','score','active','phone_id']);

export const PhoneScalarFieldEnumSchema = z.enum(['id','phone']);

export const PaymentScalarFieldEnumSchema = z.enum(['id','amount','order_id','created_at','type']);

export const RiceScalarFieldEnumSchema = z.enum(['id','amount','threshold']);

export const ProductScalarFieldEnumSchema = z.enum(['id','category_id','code','desc','site_price','home_price','rice','active','kitchen']);

export const ProductInOrderScalarFieldEnumSchema = z.enum(['id','product_id','order_id','quantity','total','is_paid_fully','paid_quantity','rice_quantity','printed_amount','state']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','category','active']);

export const CategoryOnOptionScalarFieldEnumSchema = z.enum(['id','category_id','option_id']);

export const OptionScalarFieldEnumSchema = z.enum(['id','option_name','active']);

export const OptionInProductOrderScalarFieldEnumSchema = z.enum(['id','product_in_order_id','option_id']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const OrderTypeSchema = z.enum(['TABLE','HOME','PICKUP']);

export type OrderTypeType = `${z.infer<typeof OrderTypeSchema>}`

export const OrderStateSchema = z.enum(['ACTIVE','PAID','CANCELLED']);

export type OrderStateType = `${z.infer<typeof OrderStateSchema>}`

export const ProductInOrderStateSchema = z.enum(['IN_ORDER','DELETED_COOKED','DELETED_UNCOOKED']);

export type ProductInOrderStateType = `${z.infer<typeof ProductInOrderStateSchema>}`

export const PaymentTypeSchema = z.enum(['CASH','CARD','VOUCH','CREDIT']);

export type PaymentTypeType = `${z.infer<typeof PaymentTypeSchema>}`

export const KitchenTypeSchema = z.enum(['HOT','COLD','HOT_AND_COLD','OTHER','NONE']);

export type KitchenTypeType = `${z.infer<typeof KitchenTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  state: OrderStateSchema,
  type: OrderTypeSchema,
  id: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  total: z.number(),
  discount: z.number(),
  is_receipt_printed: z.boolean(),
  suborder_of: z.number().int().nullable(),
})

export type Order = z.infer<typeof OrderSchema>

/////////////////////////////////////////
// TABLE ORDER SCHEMA
/////////////////////////////////////////

export const TableOrderSchema = z.object({
  id: z.number().int(),
  order_id: z.number().int(),
  table: z.string(),
  res_name: z.string().nullable(),
  people: z.number().int(),
})

export type TableOrder = z.infer<typeof TableOrderSchema>

/////////////////////////////////////////
// HOME ORDER SCHEMA
/////////////////////////////////////////

export const HomeOrderSchema = z.object({
  id: z.number().int(),
  order_id: z.number().int(),
  address_id: z.number().int(),
  customer_id: z.number().int(),
  when: z.string(),
  notes: z.string().nullable(),
  contact_phone: z.string().nullable(),
})

export type HomeOrder = z.infer<typeof HomeOrderSchema>

/////////////////////////////////////////
// PICKUP ORDER SCHEMA
/////////////////////////////////////////

export const PickupOrderSchema = z.object({
  id: z.number().int(),
  order_id: z.number().int(),
  customer_id: z.number().int().nullable(),
  when: z.string().nullable(),
  name: z.string(),
})

export type PickupOrder = z.infer<typeof PickupOrderSchema>

/////////////////////////////////////////
// ADDRESS SCHEMA
/////////////////////////////////////////

export const AddressSchema = z.object({
  id: z.number().int(),
  customer_id: z.number().int(),
  street: z.string(),
  civic: z.string(),
  doorbell: z.string(),
  floor: z.string().nullable(),
  stair: z.string().nullable(),
  street_info: z.string().nullable(),
  active: z.boolean(),
  temporary: z.boolean(),
})

export type Address = z.infer<typeof AddressSchema>

/////////////////////////////////////////
// CUSTOMER SCHEMA
/////////////////////////////////////////

export const CustomerSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  surname: z.string().nullable(),
  email: z.string().nullable(),
  preferences: z.string().nullable(),
  score: z.number().nullable(),
  active: z.boolean(),
  phone_id: z.number().int().nullable(),
})

export type Customer = z.infer<typeof CustomerSchema>

/////////////////////////////////////////
// PHONE SCHEMA
/////////////////////////////////////////

export const PhoneSchema = z.object({
  id: z.number().int(),
  phone: z.string(),
})

export type Phone = z.infer<typeof PhoneSchema>

/////////////////////////////////////////
// PAYMENT SCHEMA
/////////////////////////////////////////

export const PaymentSchema = z.object({
  type: PaymentTypeSchema,
  id: z.number().int(),
  amount: z.number(),
  order_id: z.number().int(),
  created_at: z.coerce.date(),
})

export type Payment = z.infer<typeof PaymentSchema>

/////////////////////////////////////////
// RICE SCHEMA
/////////////////////////////////////////

export const RiceSchema = z.object({
  id: z.number().int(),
  amount: z.number(),
  threshold: z.number(),
})

export type Rice = z.infer<typeof RiceSchema>

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  kitchen: KitchenTypeSchema,
  id: z.number().int(),
  category_id: z.number().int().nullable(),
  code: z.string(),
  desc: z.string(),
  site_price: z.number().nullable(),
  home_price: z.number().nullable(),
  rice: z.number(),
  active: z.boolean(),
})

export type Product = z.infer<typeof ProductSchema>

/////////////////////////////////////////
// PRODUCT IN ORDER SCHEMA
/////////////////////////////////////////

export const ProductInOrderSchema = z.object({
  state: ProductInOrderStateSchema,
  id: z.number().int(),
  product_id: z.number().int(),
  order_id: z.number().int(),
  quantity: z.number().int(),
  total: z.number(),
  is_paid_fully: z.boolean(),
  paid_quantity: z.number().int(),
  rice_quantity: z.number(),
  printed_amount: z.number().int(),
})

export type ProductInOrder = z.infer<typeof ProductInOrderSchema>

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.number().int(),
  category: z.string(),
  active: z.boolean(),
})

export type Category = z.infer<typeof CategorySchema>

/////////////////////////////////////////
// CATEGORY ON OPTION SCHEMA
/////////////////////////////////////////

export const CategoryOnOptionSchema = z.object({
  id: z.number().int(),
  category_id: z.number().int(),
  option_id: z.number().int(),
})

export type CategoryOnOption = z.infer<typeof CategoryOnOptionSchema>

/////////////////////////////////////////
// OPTION SCHEMA
/////////////////////////////////////////

export const OptionSchema = z.object({
  id: z.number().int(),
  option_name: z.string(),
  active: z.boolean(),
})

export type Option = z.infer<typeof OptionSchema>

/////////////////////////////////////////
// OPTION IN PRODUCT ORDER SCHEMA
/////////////////////////////////////////

export const OptionInProductOrderSchema = z.object({
  id: z.number().int(),
  product_in_order_id: z.number().int(),
  option_id: z.number().int(),
})

export type OptionInProductOrder = z.infer<typeof OptionInProductOrderSchema>
