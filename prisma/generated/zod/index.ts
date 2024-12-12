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

export const CustomerScalarFieldEnumSchema = z.enum(['id','name','surname','email','preferences','active','phone_id']);

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

// ORDER RELATION SCHEMA
//------------------------------------------------------

export type OrderRelations = {
  products: ProductInOrderWithRelations[];
  payments: PaymentWithRelations[];
  table_order?: TableOrderWithRelations | null;
  home_order?: HomeOrderWithRelations | null;
  pickup_order?: PickupOrderWithRelations | null;
};

export type OrderWithRelations = z.infer<typeof OrderSchema> & OrderRelations

export const OrderWithRelationsSchema: z.ZodType<OrderWithRelations> = OrderSchema.merge(z.object({
  products: z.lazy(() => ProductInOrderWithRelationsSchema).array(),
  payments: z.lazy(() => PaymentWithRelationsSchema).array(),
  table_order: z.lazy(() => TableOrderWithRelationsSchema).nullable(),
  home_order: z.lazy(() => HomeOrderWithRelationsSchema).nullable(),
  pickup_order: z.lazy(() => PickupOrderWithRelationsSchema).nullable(),
}))

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

// TABLE ORDER RELATION SCHEMA
//------------------------------------------------------

export type TableOrderRelations = {
  order: OrderWithRelations;
};

export type TableOrderWithRelations = z.infer<typeof TableOrderSchema> & TableOrderRelations

export const TableOrderWithRelationsSchema: z.ZodType<TableOrderWithRelations> = TableOrderSchema.merge(z.object({
  order: z.lazy(() => OrderWithRelationsSchema),
}))

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

// HOME ORDER RELATION SCHEMA
//------------------------------------------------------

export type HomeOrderRelations = {
  order: OrderWithRelations;
  address: AddressWithRelations;
  customer: CustomerWithRelations;
};

export type HomeOrderWithRelations = z.infer<typeof HomeOrderSchema> & HomeOrderRelations

export const HomeOrderWithRelationsSchema: z.ZodType<HomeOrderWithRelations> = HomeOrderSchema.merge(z.object({
  order: z.lazy(() => OrderWithRelationsSchema),
  address: z.lazy(() => AddressWithRelationsSchema),
  customer: z.lazy(() => CustomerWithRelationsSchema),
}))

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

// PICKUP ORDER RELATION SCHEMA
//------------------------------------------------------

export type PickupOrderRelations = {
  customer?: CustomerWithRelations | null;
  order: OrderWithRelations;
};

export type PickupOrderWithRelations = z.infer<typeof PickupOrderSchema> & PickupOrderRelations

export const PickupOrderWithRelationsSchema: z.ZodType<PickupOrderWithRelations> = PickupOrderSchema.merge(z.object({
  customer: z.lazy(() => CustomerWithRelationsSchema).nullable(),
  order: z.lazy(() => OrderWithRelationsSchema),
}))

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

// ADDRESS RELATION SCHEMA
//------------------------------------------------------

export type AddressRelations = {
  customer: CustomerWithRelations;
  home_orders: HomeOrderWithRelations[];
};

export type AddressWithRelations = z.infer<typeof AddressSchema> & AddressRelations

export const AddressWithRelationsSchema: z.ZodType<AddressWithRelations> = AddressSchema.merge(z.object({
  customer: z.lazy(() => CustomerWithRelationsSchema),
  home_orders: z.lazy(() => HomeOrderWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CUSTOMER SCHEMA
/////////////////////////////////////////

export const CustomerSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  surname: z.string().nullable(),
  email: z.string().nullable(),
  preferences: z.string().nullable(),
  active: z.boolean(),
  phone_id: z.number().int().nullable(),
})

export type Customer = z.infer<typeof CustomerSchema>

// CUSTOMER RELATION SCHEMA
//------------------------------------------------------

export type CustomerRelations = {
  phone?: PhoneWithRelations | null;
  addresses: AddressWithRelations[];
  home_orders: HomeOrderWithRelations[];
  pickup_orders: PickupOrderWithRelations[];
};

export type CustomerWithRelations = z.infer<typeof CustomerSchema> & CustomerRelations

export const CustomerWithRelationsSchema: z.ZodType<CustomerWithRelations> = CustomerSchema.merge(z.object({
  phone: z.lazy(() => PhoneWithRelationsSchema).nullable(),
  addresses: z.lazy(() => AddressWithRelationsSchema).array(),
  home_orders: z.lazy(() => HomeOrderWithRelationsSchema).array(),
  pickup_orders: z.lazy(() => PickupOrderWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PHONE SCHEMA
/////////////////////////////////////////

export const PhoneSchema = z.object({
  id: z.number().int(),
  phone: z.string(),
})

export type Phone = z.infer<typeof PhoneSchema>

// PHONE RELATION SCHEMA
//------------------------------------------------------

export type PhoneRelations = {
  customer?: CustomerWithRelations | null;
};

export type PhoneWithRelations = z.infer<typeof PhoneSchema> & PhoneRelations

export const PhoneWithRelationsSchema: z.ZodType<PhoneWithRelations> = PhoneSchema.merge(z.object({
  customer: z.lazy(() => CustomerWithRelationsSchema).nullable(),
}))

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

// PAYMENT RELATION SCHEMA
//------------------------------------------------------

export type PaymentRelations = {
  order: OrderWithRelations;
};

export type PaymentWithRelations = z.infer<typeof PaymentSchema> & PaymentRelations

export const PaymentWithRelationsSchema: z.ZodType<PaymentWithRelations> = PaymentSchema.merge(z.object({
  order: z.lazy(() => OrderWithRelationsSchema),
}))

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

// PRODUCT RELATION SCHEMA
//------------------------------------------------------

export type ProductRelations = {
  orders: ProductInOrderWithRelations[];
  category?: CategoryWithRelations | null;
};

export type ProductWithRelations = z.infer<typeof ProductSchema> & ProductRelations

export const ProductWithRelationsSchema: z.ZodType<ProductWithRelations> = ProductSchema.merge(z.object({
  orders: z.lazy(() => ProductInOrderWithRelationsSchema).array(),
  category: z.lazy(() => CategoryWithRelationsSchema).nullable(),
}))

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

// PRODUCT IN ORDER RELATION SCHEMA
//------------------------------------------------------

export type ProductInOrderRelations = {
  options: OptionInProductOrderWithRelations[];
  product: ProductWithRelations;
  order: OrderWithRelations;
};

export type ProductInOrderWithRelations = z.infer<typeof ProductInOrderSchema> & ProductInOrderRelations

export const ProductInOrderWithRelationsSchema: z.ZodType<ProductInOrderWithRelations> = ProductInOrderSchema.merge(z.object({
  options: z.lazy(() => OptionInProductOrderWithRelationsSchema).array(),
  product: z.lazy(() => ProductWithRelationsSchema),
  order: z.lazy(() => OrderWithRelationsSchema),
}))

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.number().int(),
  category: z.string(),
  active: z.boolean(),
})

export type Category = z.infer<typeof CategorySchema>

// CATEGORY RELATION SCHEMA
//------------------------------------------------------

export type CategoryRelations = {
  products: ProductWithRelations[];
  options: CategoryOnOptionWithRelations[];
};

export type CategoryWithRelations = z.infer<typeof CategorySchema> & CategoryRelations

export const CategoryWithRelationsSchema: z.ZodType<CategoryWithRelations> = CategorySchema.merge(z.object({
  products: z.lazy(() => ProductWithRelationsSchema).array(),
  options: z.lazy(() => CategoryOnOptionWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CATEGORY ON OPTION SCHEMA
/////////////////////////////////////////

export const CategoryOnOptionSchema = z.object({
  id: z.number().int(),
  category_id: z.number().int(),
  option_id: z.number().int(),
})

export type CategoryOnOption = z.infer<typeof CategoryOnOptionSchema>

// CATEGORY ON OPTION RELATION SCHEMA
//------------------------------------------------------

export type CategoryOnOptionRelations = {
  category: CategoryWithRelations;
  option: OptionWithRelations;
};

export type CategoryOnOptionWithRelations = z.infer<typeof CategoryOnOptionSchema> & CategoryOnOptionRelations

export const CategoryOnOptionWithRelationsSchema: z.ZodType<CategoryOnOptionWithRelations> = CategoryOnOptionSchema.merge(z.object({
  category: z.lazy(() => CategoryWithRelationsSchema),
  option: z.lazy(() => OptionWithRelationsSchema),
}))

/////////////////////////////////////////
// OPTION SCHEMA
/////////////////////////////////////////

export const OptionSchema = z.object({
  id: z.number().int(),
  option_name: z.string(),
  active: z.boolean(),
})

export type Option = z.infer<typeof OptionSchema>

// OPTION RELATION SCHEMA
//------------------------------------------------------

export type OptionRelations = {
  categories: CategoryOnOptionWithRelations[];
  products: OptionInProductOrderWithRelations[];
};

export type OptionWithRelations = z.infer<typeof OptionSchema> & OptionRelations

export const OptionWithRelationsSchema: z.ZodType<OptionWithRelations> = OptionSchema.merge(z.object({
  categories: z.lazy(() => CategoryOnOptionWithRelationsSchema).array(),
  products: z.lazy(() => OptionInProductOrderWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// OPTION IN PRODUCT ORDER SCHEMA
/////////////////////////////////////////

export const OptionInProductOrderSchema = z.object({
  id: z.number().int(),
  product_in_order_id: z.number().int(),
  option_id: z.number().int(),
})

export type OptionInProductOrder = z.infer<typeof OptionInProductOrderSchema>

// OPTION IN PRODUCT ORDER RELATION SCHEMA
//------------------------------------------------------

export type OptionInProductOrderRelations = {
  product_in_order: ProductInOrderWithRelations;
  option: OptionWithRelations;
};

export type OptionInProductOrderWithRelations = z.infer<typeof OptionInProductOrderSchema> & OptionInProductOrderRelations

export const OptionInProductOrderWithRelationsSchema: z.ZodType<OptionInProductOrderWithRelations> = OptionInProductOrderSchema.merge(z.object({
  product_in_order: z.lazy(() => ProductInOrderWithRelationsSchema),
  option: z.lazy(() => OptionWithRelationsSchema),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ORDER
//------------------------------------------------------

export const OrderIncludeSchema: z.ZodType<Prisma.OrderInclude> = z.object({
  products: z.union([z.boolean(),z.lazy(() => ProductInOrderFindManyArgsSchema)]).optional(),
  payments: z.union([z.boolean(),z.lazy(() => PaymentFindManyArgsSchema)]).optional(),
  table_order: z.union([z.boolean(),z.lazy(() => TableOrderArgsSchema)]).optional(),
  home_order: z.union([z.boolean(),z.lazy(() => HomeOrderArgsSchema)]).optional(),
  pickup_order: z.union([z.boolean(),z.lazy(() => PickupOrderArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OrderArgsSchema: z.ZodType<Prisma.OrderDefaultArgs> = z.object({
  select: z.lazy(() => OrderSelectSchema).optional(),
  include: z.lazy(() => OrderIncludeSchema).optional(),
}).strict();

export const OrderCountOutputTypeArgsSchema: z.ZodType<Prisma.OrderCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrderCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrderCountOutputTypeSelectSchema: z.ZodType<Prisma.OrderCountOutputTypeSelect> = z.object({
  products: z.boolean().optional(),
  payments: z.boolean().optional(),
}).strict();

export const OrderSelectSchema: z.ZodType<Prisma.OrderSelect> = z.object({
  id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  total: z.boolean().optional(),
  discount: z.boolean().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.boolean().optional(),
  state: z.boolean().optional(),
  type: z.boolean().optional(),
  products: z.union([z.boolean(),z.lazy(() => ProductInOrderFindManyArgsSchema)]).optional(),
  payments: z.union([z.boolean(),z.lazy(() => PaymentFindManyArgsSchema)]).optional(),
  table_order: z.union([z.boolean(),z.lazy(() => TableOrderArgsSchema)]).optional(),
  home_order: z.union([z.boolean(),z.lazy(() => HomeOrderArgsSchema)]).optional(),
  pickup_order: z.union([z.boolean(),z.lazy(() => PickupOrderArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TABLE ORDER
//------------------------------------------------------

export const TableOrderIncludeSchema: z.ZodType<Prisma.TableOrderInclude> = z.object({
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

export const TableOrderArgsSchema: z.ZodType<Prisma.TableOrderDefaultArgs> = z.object({
  select: z.lazy(() => TableOrderSelectSchema).optional(),
  include: z.lazy(() => TableOrderIncludeSchema).optional(),
}).strict();

export const TableOrderSelectSchema: z.ZodType<Prisma.TableOrderSelect> = z.object({
  id: z.boolean().optional(),
  order_id: z.boolean().optional(),
  table: z.boolean().optional(),
  res_name: z.boolean().optional(),
  people: z.boolean().optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

// HOME ORDER
//------------------------------------------------------

export const HomeOrderIncludeSchema: z.ZodType<Prisma.HomeOrderInclude> = z.object({
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
}).strict()

export const HomeOrderArgsSchema: z.ZodType<Prisma.HomeOrderDefaultArgs> = z.object({
  select: z.lazy(() => HomeOrderSelectSchema).optional(),
  include: z.lazy(() => HomeOrderIncludeSchema).optional(),
}).strict();

export const HomeOrderSelectSchema: z.ZodType<Prisma.HomeOrderSelect> = z.object({
  id: z.boolean().optional(),
  order_id: z.boolean().optional(),
  address_id: z.boolean().optional(),
  customer_id: z.boolean().optional(),
  when: z.boolean().optional(),
  notes: z.boolean().optional(),
  contact_phone: z.boolean().optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
}).strict()

// PICKUP ORDER
//------------------------------------------------------

export const PickupOrderIncludeSchema: z.ZodType<Prisma.PickupOrderInclude> = z.object({
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

export const PickupOrderArgsSchema: z.ZodType<Prisma.PickupOrderDefaultArgs> = z.object({
  select: z.lazy(() => PickupOrderSelectSchema).optional(),
  include: z.lazy(() => PickupOrderIncludeSchema).optional(),
}).strict();

export const PickupOrderSelectSchema: z.ZodType<Prisma.PickupOrderSelect> = z.object({
  id: z.boolean().optional(),
  order_id: z.boolean().optional(),
  customer_id: z.boolean().optional(),
  when: z.boolean().optional(),
  name: z.boolean().optional(),
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

// ADDRESS
//------------------------------------------------------

export const AddressIncludeSchema: z.ZodType<Prisma.AddressInclude> = z.object({
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
  home_orders: z.union([z.boolean(),z.lazy(() => HomeOrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AddressCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AddressArgsSchema: z.ZodType<Prisma.AddressDefaultArgs> = z.object({
  select: z.lazy(() => AddressSelectSchema).optional(),
  include: z.lazy(() => AddressIncludeSchema).optional(),
}).strict();

export const AddressCountOutputTypeArgsSchema: z.ZodType<Prisma.AddressCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => AddressCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AddressCountOutputTypeSelectSchema: z.ZodType<Prisma.AddressCountOutputTypeSelect> = z.object({
  home_orders: z.boolean().optional(),
}).strict();

export const AddressSelectSchema: z.ZodType<Prisma.AddressSelect> = z.object({
  id: z.boolean().optional(),
  customer_id: z.boolean().optional(),
  street: z.boolean().optional(),
  civic: z.boolean().optional(),
  doorbell: z.boolean().optional(),
  floor: z.boolean().optional(),
  stair: z.boolean().optional(),
  street_info: z.boolean().optional(),
  active: z.boolean().optional(),
  temporary: z.boolean().optional(),
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
  home_orders: z.union([z.boolean(),z.lazy(() => HomeOrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AddressCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CUSTOMER
//------------------------------------------------------

export const CustomerIncludeSchema: z.ZodType<Prisma.CustomerInclude> = z.object({
  phone: z.union([z.boolean(),z.lazy(() => PhoneArgsSchema)]).optional(),
  addresses: z.union([z.boolean(),z.lazy(() => AddressFindManyArgsSchema)]).optional(),
  home_orders: z.union([z.boolean(),z.lazy(() => HomeOrderFindManyArgsSchema)]).optional(),
  pickup_orders: z.union([z.boolean(),z.lazy(() => PickupOrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CustomerCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CustomerArgsSchema: z.ZodType<Prisma.CustomerDefaultArgs> = z.object({
  select: z.lazy(() => CustomerSelectSchema).optional(),
  include: z.lazy(() => CustomerIncludeSchema).optional(),
}).strict();

export const CustomerCountOutputTypeArgsSchema: z.ZodType<Prisma.CustomerCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CustomerCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CustomerCountOutputTypeSelectSchema: z.ZodType<Prisma.CustomerCountOutputTypeSelect> = z.object({
  addresses: z.boolean().optional(),
  home_orders: z.boolean().optional(),
  pickup_orders: z.boolean().optional(),
}).strict();

export const CustomerSelectSchema: z.ZodType<Prisma.CustomerSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  surname: z.boolean().optional(),
  email: z.boolean().optional(),
  preferences: z.boolean().optional(),
  active: z.boolean().optional(),
  phone_id: z.boolean().optional(),
  phone: z.union([z.boolean(),z.lazy(() => PhoneArgsSchema)]).optional(),
  addresses: z.union([z.boolean(),z.lazy(() => AddressFindManyArgsSchema)]).optional(),
  home_orders: z.union([z.boolean(),z.lazy(() => HomeOrderFindManyArgsSchema)]).optional(),
  pickup_orders: z.union([z.boolean(),z.lazy(() => PickupOrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CustomerCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PHONE
//------------------------------------------------------

export const PhoneIncludeSchema: z.ZodType<Prisma.PhoneInclude> = z.object({
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
}).strict()

export const PhoneArgsSchema: z.ZodType<Prisma.PhoneDefaultArgs> = z.object({
  select: z.lazy(() => PhoneSelectSchema).optional(),
  include: z.lazy(() => PhoneIncludeSchema).optional(),
}).strict();

export const PhoneSelectSchema: z.ZodType<Prisma.PhoneSelect> = z.object({
  id: z.boolean().optional(),
  phone: z.boolean().optional(),
  customer: z.union([z.boolean(),z.lazy(() => CustomerArgsSchema)]).optional(),
}).strict()

// PAYMENT
//------------------------------------------------------

export const PaymentIncludeSchema: z.ZodType<Prisma.PaymentInclude> = z.object({
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

export const PaymentArgsSchema: z.ZodType<Prisma.PaymentDefaultArgs> = z.object({
  select: z.lazy(() => PaymentSelectSchema).optional(),
  include: z.lazy(() => PaymentIncludeSchema).optional(),
}).strict();

export const PaymentSelectSchema: z.ZodType<Prisma.PaymentSelect> = z.object({
  id: z.boolean().optional(),
  amount: z.boolean().optional(),
  order_id: z.boolean().optional(),
  created_at: z.boolean().optional(),
  type: z.boolean().optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

// RICE
//------------------------------------------------------

export const RiceSelectSchema: z.ZodType<Prisma.RiceSelect> = z.object({
  id: z.boolean().optional(),
  amount: z.boolean().optional(),
  threshold: z.boolean().optional(),
}).strict()

// PRODUCT
//------------------------------------------------------

export const ProductIncludeSchema: z.ZodType<Prisma.ProductInclude> = z.object({
  orders: z.union([z.boolean(),z.lazy(() => ProductInOrderFindManyArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProductArgsSchema: z.ZodType<Prisma.ProductDefaultArgs> = z.object({
  select: z.lazy(() => ProductSelectSchema).optional(),
  include: z.lazy(() => ProductIncludeSchema).optional(),
}).strict();

export const ProductCountOutputTypeArgsSchema: z.ZodType<Prisma.ProductCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProductCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProductCountOutputTypeSelectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = z.object({
  orders: z.boolean().optional(),
}).strict();

export const ProductSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
  id: z.boolean().optional(),
  category_id: z.boolean().optional(),
  code: z.boolean().optional(),
  desc: z.boolean().optional(),
  site_price: z.boolean().optional(),
  home_price: z.boolean().optional(),
  rice: z.boolean().optional(),
  active: z.boolean().optional(),
  kitchen: z.boolean().optional(),
  orders: z.union([z.boolean(),z.lazy(() => ProductInOrderFindManyArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PRODUCT IN ORDER
//------------------------------------------------------

export const ProductInOrderIncludeSchema: z.ZodType<Prisma.ProductInOrderInclude> = z.object({
  options: z.union([z.boolean(),z.lazy(() => OptionInProductOrderFindManyArgsSchema)]).optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductInOrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ProductInOrderArgsSchema: z.ZodType<Prisma.ProductInOrderDefaultArgs> = z.object({
  select: z.lazy(() => ProductInOrderSelectSchema).optional(),
  include: z.lazy(() => ProductInOrderIncludeSchema).optional(),
}).strict();

export const ProductInOrderCountOutputTypeArgsSchema: z.ZodType<Prisma.ProductInOrderCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProductInOrderCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProductInOrderCountOutputTypeSelectSchema: z.ZodType<Prisma.ProductInOrderCountOutputTypeSelect> = z.object({
  options: z.boolean().optional(),
}).strict();

export const ProductInOrderSelectSchema: z.ZodType<Prisma.ProductInOrderSelect> = z.object({
  id: z.boolean().optional(),
  product_id: z.boolean().optional(),
  order_id: z.boolean().optional(),
  quantity: z.boolean().optional(),
  total: z.boolean().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.boolean().optional(),
  rice_quantity: z.boolean().optional(),
  printed_amount: z.boolean().optional(),
  state: z.boolean().optional(),
  options: z.union([z.boolean(),z.lazy(() => OptionInProductOrderFindManyArgsSchema)]).optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductInOrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z.object({
  products: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  options: z.union([z.boolean(),z.lazy(() => CategoryOnOptionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z.object({
  select: z.lazy(() => CategorySelectSchema).optional(),
  include: z.lazy(() => CategoryIncludeSchema).optional(),
}).strict();

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> = z.object({
  products: z.boolean().optional(),
  options: z.boolean().optional(),
}).strict();

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
  id: z.boolean().optional(),
  category: z.boolean().optional(),
  active: z.boolean().optional(),
  products: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  options: z.union([z.boolean(),z.lazy(() => CategoryOnOptionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CATEGORY ON OPTION
//------------------------------------------------------

export const CategoryOnOptionIncludeSchema: z.ZodType<Prisma.CategoryOnOptionInclude> = z.object({
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  option: z.union([z.boolean(),z.lazy(() => OptionArgsSchema)]).optional(),
}).strict()

export const CategoryOnOptionArgsSchema: z.ZodType<Prisma.CategoryOnOptionDefaultArgs> = z.object({
  select: z.lazy(() => CategoryOnOptionSelectSchema).optional(),
  include: z.lazy(() => CategoryOnOptionIncludeSchema).optional(),
}).strict();

export const CategoryOnOptionSelectSchema: z.ZodType<Prisma.CategoryOnOptionSelect> = z.object({
  id: z.boolean().optional(),
  category_id: z.boolean().optional(),
  option_id: z.boolean().optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  option: z.union([z.boolean(),z.lazy(() => OptionArgsSchema)]).optional(),
}).strict()

// OPTION
//------------------------------------------------------

export const OptionIncludeSchema: z.ZodType<Prisma.OptionInclude> = z.object({
  categories: z.union([z.boolean(),z.lazy(() => CategoryOnOptionFindManyArgsSchema)]).optional(),
  products: z.union([z.boolean(),z.lazy(() => OptionInProductOrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OptionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const OptionArgsSchema: z.ZodType<Prisma.OptionDefaultArgs> = z.object({
  select: z.lazy(() => OptionSelectSchema).optional(),
  include: z.lazy(() => OptionIncludeSchema).optional(),
}).strict();

export const OptionCountOutputTypeArgsSchema: z.ZodType<Prisma.OptionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OptionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OptionCountOutputTypeSelectSchema: z.ZodType<Prisma.OptionCountOutputTypeSelect> = z.object({
  categories: z.boolean().optional(),
  products: z.boolean().optional(),
}).strict();

export const OptionSelectSchema: z.ZodType<Prisma.OptionSelect> = z.object({
  id: z.boolean().optional(),
  option_name: z.boolean().optional(),
  active: z.boolean().optional(),
  categories: z.union([z.boolean(),z.lazy(() => CategoryOnOptionFindManyArgsSchema)]).optional(),
  products: z.union([z.boolean(),z.lazy(() => OptionInProductOrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OptionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// OPTION IN PRODUCT ORDER
//------------------------------------------------------

export const OptionInProductOrderIncludeSchema: z.ZodType<Prisma.OptionInProductOrderInclude> = z.object({
  product_in_order: z.union([z.boolean(),z.lazy(() => ProductInOrderArgsSchema)]).optional(),
  option: z.union([z.boolean(),z.lazy(() => OptionArgsSchema)]).optional(),
}).strict()

export const OptionInProductOrderArgsSchema: z.ZodType<Prisma.OptionInProductOrderDefaultArgs> = z.object({
  select: z.lazy(() => OptionInProductOrderSelectSchema).optional(),
  include: z.lazy(() => OptionInProductOrderIncludeSchema).optional(),
}).strict();

export const OptionInProductOrderSelectSchema: z.ZodType<Prisma.OptionInProductOrderSelect> = z.object({
  id: z.boolean().optional(),
  product_in_order_id: z.boolean().optional(),
  option_id: z.boolean().optional(),
  product_in_order: z.union([z.boolean(),z.lazy(() => ProductInOrderArgsSchema)]).optional(),
  option: z.union([z.boolean(),z.lazy(() => OptionArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const OrderWhereInputSchema: z.ZodType<Prisma.OrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  total: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  discount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  is_receipt_printed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  suborder_of: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  state: z.union([ z.lazy(() => EnumOrderStateFilterSchema),z.lazy(() => OrderStateSchema) ]).optional(),
  type: z.union([ z.lazy(() => EnumOrderTypeFilterSchema),z.lazy(() => OrderTypeSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderListRelationFilterSchema).optional(),
  payments: z.lazy(() => PaymentListRelationFilterSchema).optional(),
  table_order: z.union([ z.lazy(() => TableOrderNullableRelationFilterSchema),z.lazy(() => TableOrderWhereInputSchema) ]).optional().nullable(),
  home_order: z.union([ z.lazy(() => HomeOrderNullableRelationFilterSchema),z.lazy(() => HomeOrderWhereInputSchema) ]).optional().nullable(),
  pickup_order: z.union([ z.lazy(() => PickupOrderNullableRelationFilterSchema),z.lazy(() => PickupOrderWhereInputSchema) ]).optional().nullable(),
}).strict();

export const OrderOrderByWithRelationInputSchema: z.ZodType<Prisma.OrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  discount: z.lazy(() => SortOrderSchema).optional(),
  is_receipt_printed: z.lazy(() => SortOrderSchema).optional(),
  suborder_of: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  products: z.lazy(() => ProductInOrderOrderByRelationAggregateInputSchema).optional(),
  payments: z.lazy(() => PaymentOrderByRelationAggregateInputSchema).optional(),
  table_order: z.lazy(() => TableOrderOrderByWithRelationInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderOrderByWithRelationInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderOrderByWithRelationInputSchema).optional()
}).strict();

export const OrderWhereUniqueInputSchema: z.ZodType<Prisma.OrderWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema),z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  total: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  discount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  is_receipt_printed: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  suborder_of: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  state: z.union([ z.lazy(() => EnumOrderStateFilterSchema),z.lazy(() => OrderStateSchema) ]).optional(),
  type: z.union([ z.lazy(() => EnumOrderTypeFilterSchema),z.lazy(() => OrderTypeSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderListRelationFilterSchema).optional(),
  payments: z.lazy(() => PaymentListRelationFilterSchema).optional(),
  table_order: z.union([ z.lazy(() => TableOrderNullableRelationFilterSchema),z.lazy(() => TableOrderWhereInputSchema) ]).optional().nullable(),
  home_order: z.union([ z.lazy(() => HomeOrderNullableRelationFilterSchema),z.lazy(() => HomeOrderWhereInputSchema) ]).optional().nullable(),
  pickup_order: z.union([ z.lazy(() => PickupOrderNullableRelationFilterSchema),z.lazy(() => PickupOrderWhereInputSchema) ]).optional().nullable(),
}).strict());

export const OrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  discount: z.lazy(() => SortOrderSchema).optional(),
  is_receipt_printed: z.lazy(() => SortOrderSchema).optional(),
  suborder_of: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const OrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema),z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema),z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  total: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  discount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  is_receipt_printed: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  suborder_of: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  state: z.union([ z.lazy(() => EnumOrderStateWithAggregatesFilterSchema),z.lazy(() => OrderStateSchema) ]).optional(),
  type: z.union([ z.lazy(() => EnumOrderTypeWithAggregatesFilterSchema),z.lazy(() => OrderTypeSchema) ]).optional(),
}).strict();

export const TableOrderWhereInputSchema: z.ZodType<Prisma.TableOrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TableOrderWhereInputSchema),z.lazy(() => TableOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TableOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TableOrderWhereInputSchema),z.lazy(() => TableOrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  table: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  res_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  people: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
}).strict();

export const TableOrderOrderByWithRelationInputSchema: z.ZodType<Prisma.TableOrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  res_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  people: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional()
}).strict();

export const TableOrderWhereUniqueInputSchema: z.ZodType<Prisma.TableOrderWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    order_id: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    order_id: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  order_id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => TableOrderWhereInputSchema),z.lazy(() => TableOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TableOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TableOrderWhereInputSchema),z.lazy(() => TableOrderWhereInputSchema).array() ]).optional(),
  table: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  res_name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  people: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
}).strict());

export const TableOrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.TableOrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  res_name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  people: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TableOrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TableOrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TableOrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TableOrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TableOrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const TableOrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TableOrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TableOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => TableOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TableOrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TableOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => TableOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  table: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  res_name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  people: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const HomeOrderWhereInputSchema: z.ZodType<Prisma.HomeOrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => HomeOrderWhereInputSchema),z.lazy(() => HomeOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HomeOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HomeOrderWhereInputSchema),z.lazy(() => HomeOrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  address_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  when: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contact_phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => AddressRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  customer: z.union([ z.lazy(() => CustomerRelationFilterSchema),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
}).strict();

export const HomeOrderOrderByWithRelationInputSchema: z.ZodType<Prisma.HomeOrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  address_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  when: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  contact_phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional(),
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional(),
  customer: z.lazy(() => CustomerOrderByWithRelationInputSchema).optional()
}).strict();

export const HomeOrderWhereUniqueInputSchema: z.ZodType<Prisma.HomeOrderWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    order_id: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    order_id: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  order_id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => HomeOrderWhereInputSchema),z.lazy(() => HomeOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HomeOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HomeOrderWhereInputSchema),z.lazy(() => HomeOrderWhereInputSchema).array() ]).optional(),
  address_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  when: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contact_phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
  address: z.union([ z.lazy(() => AddressRelationFilterSchema),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  customer: z.union([ z.lazy(() => CustomerRelationFilterSchema),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
}).strict());

export const HomeOrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.HomeOrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  address_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  when: z.lazy(() => SortOrderSchema).optional(),
  notes: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  contact_phone: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => HomeOrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => HomeOrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => HomeOrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => HomeOrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => HomeOrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const HomeOrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.HomeOrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => HomeOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => HomeOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => HomeOrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HomeOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => HomeOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  address_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  when: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  contact_phone: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const PickupOrderWhereInputSchema: z.ZodType<Prisma.PickupOrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PickupOrderWhereInputSchema),z.lazy(() => PickupOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickupOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickupOrderWhereInputSchema),z.lazy(() => PickupOrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  when: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customer: z.union([ z.lazy(() => CustomerNullableRelationFilterSchema),z.lazy(() => CustomerWhereInputSchema) ]).optional().nullable(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
}).strict();

export const PickupOrderOrderByWithRelationInputSchema: z.ZodType<Prisma.PickupOrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  when: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  customer: z.lazy(() => CustomerOrderByWithRelationInputSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional()
}).strict();

export const PickupOrderWhereUniqueInputSchema: z.ZodType<Prisma.PickupOrderWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    order_id: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    order_id: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  order_id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PickupOrderWhereInputSchema),z.lazy(() => PickupOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickupOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickupOrderWhereInputSchema),z.lazy(() => PickupOrderWhereInputSchema).array() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  when: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customer: z.union([ z.lazy(() => CustomerNullableRelationFilterSchema),z.lazy(() => CustomerWhereInputSchema) ]).optional().nullable(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
}).strict());

export const PickupOrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.PickupOrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  when: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PickupOrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PickupOrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PickupOrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PickupOrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PickupOrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const PickupOrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PickupOrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PickupOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => PickupOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickupOrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickupOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => PickupOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  when: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const AddressWhereInputSchema: z.ZodType<Prisma.AddressWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  civic: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  doorbell: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  floor: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stair: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  street_info: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  temporary: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  customer: z.union([ z.lazy(() => CustomerRelationFilterSchema),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  home_orders: z.lazy(() => HomeOrderListRelationFilterSchema).optional()
}).strict();

export const AddressOrderByWithRelationInputSchema: z.ZodType<Prisma.AddressOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  civic: z.lazy(() => SortOrderSchema).optional(),
  doorbell: z.lazy(() => SortOrderSchema).optional(),
  floor: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stair: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  street_info: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  temporary: z.lazy(() => SortOrderSchema).optional(),
  customer: z.lazy(() => CustomerOrderByWithRelationInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderOrderByRelationAggregateInputSchema).optional()
}).strict();

export const AddressWhereUniqueInputSchema: z.ZodType<Prisma.AddressWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema),z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  civic: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  doorbell: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  floor: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stair: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  street_info: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  temporary: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  customer: z.union([ z.lazy(() => CustomerRelationFilterSchema),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  home_orders: z.lazy(() => HomeOrderListRelationFilterSchema).optional()
}).strict());

export const AddressOrderByWithAggregationInputSchema: z.ZodType<Prisma.AddressOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  civic: z.lazy(() => SortOrderSchema).optional(),
  doorbell: z.lazy(() => SortOrderSchema).optional(),
  floor: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  stair: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  street_info: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  temporary: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AddressCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AddressAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AddressMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AddressMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AddressSumOrderByAggregateInputSchema).optional()
}).strict();

export const AddressScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AddressScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema),z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema),z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  street: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  civic: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  doorbell: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  floor: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  stair: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  street_info: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  temporary: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const CustomerWhereInputSchema: z.ZodType<Prisma.CustomerWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CustomerWhereInputSchema),z.lazy(() => CustomerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CustomerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CustomerWhereInputSchema),z.lazy(() => CustomerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  surname: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  preferences: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  phone_id: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  phone: z.union([ z.lazy(() => PhoneNullableRelationFilterSchema),z.lazy(() => PhoneWhereInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressListRelationFilterSchema).optional(),
  home_orders: z.lazy(() => HomeOrderListRelationFilterSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderListRelationFilterSchema).optional()
}).strict();

export const CustomerOrderByWithRelationInputSchema: z.ZodType<Prisma.CustomerOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  surname: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  preferences: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  phone_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  phone: z.lazy(() => PhoneOrderByWithRelationInputSchema).optional(),
  addresses: z.lazy(() => AddressOrderByRelationAggregateInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderOrderByRelationAggregateInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CustomerWhereUniqueInputSchema: z.ZodType<Prisma.CustomerWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    phone_id: z.number().int()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    phone_id: z.number().int(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  phone_id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CustomerWhereInputSchema),z.lazy(() => CustomerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CustomerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CustomerWhereInputSchema),z.lazy(() => CustomerWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  surname: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  preferences: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  phone: z.union([ z.lazy(() => PhoneNullableRelationFilterSchema),z.lazy(() => PhoneWhereInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressListRelationFilterSchema).optional(),
  home_orders: z.lazy(() => HomeOrderListRelationFilterSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderListRelationFilterSchema).optional()
}).strict());

export const CustomerOrderByWithAggregationInputSchema: z.ZodType<Prisma.CustomerOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  surname: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  preferences: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  phone_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CustomerCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CustomerAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CustomerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CustomerMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CustomerSumOrderByAggregateInputSchema).optional()
}).strict();

export const CustomerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CustomerScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema),z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema),z.lazy(() => CustomerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  surname: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  preferences: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  phone_id: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
}).strict();

export const PhoneWhereInputSchema: z.ZodType<Prisma.PhoneWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PhoneWhereInputSchema),z.lazy(() => PhoneWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PhoneWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PhoneWhereInputSchema),z.lazy(() => PhoneWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customer: z.union([ z.lazy(() => CustomerNullableRelationFilterSchema),z.lazy(() => CustomerWhereInputSchema) ]).optional().nullable(),
}).strict();

export const PhoneOrderByWithRelationInputSchema: z.ZodType<Prisma.PhoneOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  customer: z.lazy(() => CustomerOrderByWithRelationInputSchema).optional()
}).strict();

export const PhoneWhereUniqueInputSchema: z.ZodType<Prisma.PhoneWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PhoneWhereInputSchema),z.lazy(() => PhoneWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PhoneWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PhoneWhereInputSchema),z.lazy(() => PhoneWhereInputSchema).array() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  customer: z.union([ z.lazy(() => CustomerNullableRelationFilterSchema),z.lazy(() => CustomerWhereInputSchema) ]).optional().nullable(),
}).strict());

export const PhoneOrderByWithAggregationInputSchema: z.ZodType<Prisma.PhoneOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PhoneCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PhoneAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PhoneMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PhoneMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PhoneSumOrderByAggregateInputSchema).optional()
}).strict();

export const PhoneScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PhoneScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema),z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema),z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PaymentWhereInputSchema: z.ZodType<Prisma.PaymentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentWhereInputSchema),z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentWhereInputSchema),z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumPaymentTypeFilterSchema),z.lazy(() => PaymentTypeSchema) ]).optional(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
}).strict();

export const PaymentOrderByWithRelationInputSchema: z.ZodType<Prisma.PaymentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional()
}).strict();

export const PaymentWhereUniqueInputSchema: z.ZodType<Prisma.PaymentWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PaymentWhereInputSchema),z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentWhereInputSchema),z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumPaymentTypeFilterSchema),z.lazy(() => PaymentTypeSchema) ]).optional(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
}).strict());

export const PaymentOrderByWithAggregationInputSchema: z.ZodType<Prisma.PaymentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PaymentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PaymentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PaymentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PaymentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PaymentSumOrderByAggregateInputSchema).optional()
}).strict();

export const PaymentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PaymentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema),z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema),z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumPaymentTypeWithAggregatesFilterSchema),z.lazy(() => PaymentTypeSchema) ]).optional(),
}).strict();

export const RiceWhereInputSchema: z.ZodType<Prisma.RiceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RiceWhereInputSchema),z.lazy(() => RiceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RiceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RiceWhereInputSchema),z.lazy(() => RiceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  threshold: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
}).strict();

export const RiceOrderByWithRelationInputSchema: z.ZodType<Prisma.RiceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  threshold: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RiceWhereUniqueInputSchema: z.ZodType<Prisma.RiceWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => RiceWhereInputSchema),z.lazy(() => RiceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RiceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RiceWhereInputSchema),z.lazy(() => RiceWhereInputSchema).array() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  threshold: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
}).strict());

export const RiceOrderByWithAggregationInputSchema: z.ZodType<Prisma.RiceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  threshold: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RiceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RiceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RiceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RiceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RiceSumOrderByAggregateInputSchema).optional()
}).strict();

export const RiceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RiceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RiceScalarWhereWithAggregatesInputSchema),z.lazy(() => RiceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RiceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RiceScalarWhereWithAggregatesInputSchema),z.lazy(() => RiceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  threshold: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const ProductWhereInputSchema: z.ZodType<Prisma.ProductWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  category_id: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  desc: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  site_price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  home_price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  rice: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  kitchen: z.union([ z.lazy(() => EnumKitchenTypeFilterSchema),z.lazy(() => KitchenTypeSchema) ]).optional(),
  orders: z.lazy(() => ProductInOrderListRelationFilterSchema).optional(),
  category: z.union([ z.lazy(() => CategoryNullableRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ProductOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  desc: z.lazy(() => SortOrderSchema).optional(),
  site_price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  home_price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rice: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  kitchen: z.lazy(() => SortOrderSchema).optional(),
  orders: z.lazy(() => ProductInOrderOrderByRelationAggregateInputSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional()
}).strict();

export const ProductWhereUniqueInputSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema),z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  category_id: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  desc: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  site_price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  home_price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  rice: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  kitchen: z.union([ z.lazy(() => EnumKitchenTypeFilterSchema),z.lazy(() => KitchenTypeSchema) ]).optional(),
  orders: z.lazy(() => ProductInOrderListRelationFilterSchema).optional(),
  category: z.union([ z.lazy(() => CategoryNullableRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ProductOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  desc: z.lazy(() => SortOrderSchema).optional(),
  site_price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  home_price: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  rice: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  kitchen: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProductCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProductScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  category_id: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  code: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  desc: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  site_price: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  home_price: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  rice: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  kitchen: z.union([ z.lazy(() => EnumKitchenTypeWithAggregatesFilterSchema),z.lazy(() => KitchenTypeSchema) ]).optional(),
}).strict();

export const ProductInOrderWhereInputSchema: z.ZodType<Prisma.ProductInOrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductInOrderWhereInputSchema),z.lazy(() => ProductInOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductInOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductInOrderWhereInputSchema),z.lazy(() => ProductInOrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  product_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  total: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  is_paid_fully: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  paid_quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  rice_quantity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  printed_amount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  state: z.union([ z.lazy(() => EnumProductInOrderStateFilterSchema),z.lazy(() => ProductInOrderStateSchema) ]).optional(),
  options: z.lazy(() => OptionInProductOrderListRelationFilterSchema).optional(),
  product: z.union([ z.lazy(() => ProductRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
}).strict();

export const ProductInOrderOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductInOrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  is_paid_fully: z.lazy(() => SortOrderSchema).optional(),
  paid_quantity: z.lazy(() => SortOrderSchema).optional(),
  rice_quantity: z.lazy(() => SortOrderSchema).optional(),
  printed_amount: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  options: z.lazy(() => OptionInProductOrderOrderByRelationAggregateInputSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional()
}).strict();

export const ProductInOrderWhereUniqueInputSchema: z.ZodType<Prisma.ProductInOrderWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProductInOrderWhereInputSchema),z.lazy(() => ProductInOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductInOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductInOrderWhereInputSchema),z.lazy(() => ProductInOrderWhereInputSchema).array() ]).optional(),
  product_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  total: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  is_paid_fully: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  paid_quantity: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  rice_quantity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  printed_amount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  state: z.union([ z.lazy(() => EnumProductInOrderStateFilterSchema),z.lazy(() => ProductInOrderStateSchema) ]).optional(),
  options: z.lazy(() => OptionInProductOrderListRelationFilterSchema).optional(),
  product: z.union([ z.lazy(() => ProductRelationFilterSchema),z.lazy(() => ProductWhereInputSchema) ]).optional(),
  order: z.union([ z.lazy(() => OrderRelationFilterSchema),z.lazy(() => OrderWhereInputSchema) ]).optional(),
}).strict());

export const ProductInOrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductInOrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  is_paid_fully: z.lazy(() => SortOrderSchema).optional(),
  paid_quantity: z.lazy(() => SortOrderSchema).optional(),
  rice_quantity: z.lazy(() => SortOrderSchema).optional(),
  printed_amount: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProductInOrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductInOrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductInOrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductInOrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductInOrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const ProductInOrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductInOrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProductInOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductInOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductInOrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductInOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => ProductInOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  product_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  total: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  is_paid_fully: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  paid_quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  rice_quantity: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  printed_amount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  state: z.union([ z.lazy(() => EnumProductInOrderStateWithAggregatesFilterSchema),z.lazy(() => ProductInOrderStateSchema) ]).optional(),
}).strict();

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  category: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  products: z.lazy(() => ProductListRelationFilterSchema).optional(),
  options: z.lazy(() => CategoryOnOptionListRelationFilterSchema).optional()
}).strict();

export const CategoryOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputSchema).optional(),
  options: z.lazy(() => CategoryOnOptionOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CategoryWhereUniqueInputSchema: z.ZodType<Prisma.CategoryWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  category: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  products: z.lazy(() => ProductListRelationFilterSchema).optional(),
  options: z.lazy(() => CategoryOnOptionListRelationFilterSchema).optional()
}).strict());

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CategoryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CategorySumOrderByAggregateInputSchema).optional()
}).strict();

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  category: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const CategoryOnOptionWhereInputSchema: z.ZodType<Prisma.CategoryOnOptionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryOnOptionWhereInputSchema),z.lazy(() => CategoryOnOptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryOnOptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryOnOptionWhereInputSchema),z.lazy(() => CategoryOnOptionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  category_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  option_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  category: z.union([ z.lazy(() => CategoryRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  option: z.union([ z.lazy(() => OptionRelationFilterSchema),z.lazy(() => OptionWhereInputSchema) ]).optional(),
}).strict();

export const CategoryOnOptionOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOnOptionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional(),
  option: z.lazy(() => OptionOrderByWithRelationInputSchema).optional()
}).strict();

export const CategoryOnOptionWhereUniqueInputSchema: z.ZodType<Prisma.CategoryOnOptionWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CategoryOnOptionWhereInputSchema),z.lazy(() => CategoryOnOptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryOnOptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryOnOptionWhereInputSchema),z.lazy(() => CategoryOnOptionWhereInputSchema).array() ]).optional(),
  category_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  option_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  category: z.union([ z.lazy(() => CategoryRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  option: z.union([ z.lazy(() => OptionRelationFilterSchema),z.lazy(() => OptionWhereInputSchema) ]).optional(),
}).strict());

export const CategoryOnOptionOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOnOptionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CategoryOnOptionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CategoryOnOptionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryOnOptionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryOnOptionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CategoryOnOptionSumOrderByAggregateInputSchema).optional()
}).strict();

export const CategoryOnOptionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryOnOptionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryOnOptionScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryOnOptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryOnOptionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryOnOptionScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryOnOptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  category_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  option_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const OptionWhereInputSchema: z.ZodType<Prisma.OptionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OptionWhereInputSchema),z.lazy(() => OptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OptionWhereInputSchema),z.lazy(() => OptionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  option_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  categories: z.lazy(() => CategoryOnOptionListRelationFilterSchema).optional(),
  products: z.lazy(() => OptionInProductOrderListRelationFilterSchema).optional()
}).strict();

export const OptionOrderByWithRelationInputSchema: z.ZodType<Prisma.OptionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  option_name: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  categories: z.lazy(() => CategoryOnOptionOrderByRelationAggregateInputSchema).optional(),
  products: z.lazy(() => OptionInProductOrderOrderByRelationAggregateInputSchema).optional()
}).strict();

export const OptionWhereUniqueInputSchema: z.ZodType<Prisma.OptionWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => OptionWhereInputSchema),z.lazy(() => OptionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OptionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OptionWhereInputSchema),z.lazy(() => OptionWhereInputSchema).array() ]).optional(),
  option_name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  categories: z.lazy(() => CategoryOnOptionListRelationFilterSchema).optional(),
  products: z.lazy(() => OptionInProductOrderListRelationFilterSchema).optional()
}).strict());

export const OptionOrderByWithAggregationInputSchema: z.ZodType<Prisma.OptionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  option_name: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OptionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OptionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OptionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OptionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OptionSumOrderByAggregateInputSchema).optional()
}).strict();

export const OptionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OptionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OptionScalarWhereWithAggregatesInputSchema),z.lazy(() => OptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OptionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OptionScalarWhereWithAggregatesInputSchema),z.lazy(() => OptionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  option_name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  active: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict();

export const OptionInProductOrderWhereInputSchema: z.ZodType<Prisma.OptionInProductOrderWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OptionInProductOrderWhereInputSchema),z.lazy(() => OptionInProductOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OptionInProductOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OptionInProductOrderWhereInputSchema),z.lazy(() => OptionInProductOrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  product_in_order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  option_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  product_in_order: z.union([ z.lazy(() => ProductInOrderRelationFilterSchema),z.lazy(() => ProductInOrderWhereInputSchema) ]).optional(),
  option: z.union([ z.lazy(() => OptionRelationFilterSchema),z.lazy(() => OptionWhereInputSchema) ]).optional(),
}).strict();

export const OptionInProductOrderOrderByWithRelationInputSchema: z.ZodType<Prisma.OptionInProductOrderOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_in_order_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional(),
  product_in_order: z.lazy(() => ProductInOrderOrderByWithRelationInputSchema).optional(),
  option: z.lazy(() => OptionOrderByWithRelationInputSchema).optional()
}).strict();

export const OptionInProductOrderWhereUniqueInputSchema: z.ZodType<Prisma.OptionInProductOrderWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => OptionInProductOrderWhereInputSchema),z.lazy(() => OptionInProductOrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OptionInProductOrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OptionInProductOrderWhereInputSchema),z.lazy(() => OptionInProductOrderWhereInputSchema).array() ]).optional(),
  product_in_order_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  option_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  product_in_order: z.union([ z.lazy(() => ProductInOrderRelationFilterSchema),z.lazy(() => ProductInOrderWhereInputSchema) ]).optional(),
  option: z.union([ z.lazy(() => OptionRelationFilterSchema),z.lazy(() => OptionWhereInputSchema) ]).optional(),
}).strict());

export const OptionInProductOrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.OptionInProductOrderOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_in_order_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OptionInProductOrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OptionInProductOrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OptionInProductOrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OptionInProductOrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OptionInProductOrderSumOrderByAggregateInputSchema).optional()
}).strict();

export const OptionInProductOrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OptionInProductOrderScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => OptionInProductOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => OptionInProductOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OptionInProductOrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OptionInProductOrderScalarWhereWithAggregatesInputSchema),z.lazy(() => OptionInProductOrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  product_in_order_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  option_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const OrderCreateInputSchema: z.ZodType<Prisma.OrderCreateInput> = z.object({
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderCreateNestedManyWithoutOrderInputSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderCreateNestedOneWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderUncheckedCreateInputSchema: z.ZodType<Prisma.OrderUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderUpdateInputSchema: z.ZodType<Prisma.OrderUpdateInput> = z.object({
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUpdateManyWithoutOrderNestedInputSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUpdateOneWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderCreateManyInputSchema: z.ZodType<Prisma.OrderCreateManyInput> = z.object({
  id: z.number().int().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema)
}).strict();

export const OrderUpdateManyMutationInputSchema: z.ZodType<Prisma.OrderUpdateManyMutationInput> = z.object({
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TableOrderCreateInputSchema: z.ZodType<Prisma.TableOrderCreateInput> = z.object({
  table: z.string(),
  res_name: z.string().optional().nullable(),
  people: z.number().int(),
  order: z.lazy(() => OrderCreateNestedOneWithoutTable_orderInputSchema)
}).strict();

export const TableOrderUncheckedCreateInputSchema: z.ZodType<Prisma.TableOrderUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  table: z.string(),
  res_name: z.string().optional().nullable(),
  people: z.number().int()
}).strict();

export const TableOrderUpdateInputSchema: z.ZodType<Prisma.TableOrderUpdateInput> = z.object({
  table: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  res_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  people: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutTable_orderNestedInputSchema).optional()
}).strict();

export const TableOrderUncheckedUpdateInputSchema: z.ZodType<Prisma.TableOrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  table: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  res_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  people: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TableOrderCreateManyInputSchema: z.ZodType<Prisma.TableOrderCreateManyInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  table: z.string(),
  res_name: z.string().optional().nullable(),
  people: z.number().int()
}).strict();

export const TableOrderUpdateManyMutationInputSchema: z.ZodType<Prisma.TableOrderUpdateManyMutationInput> = z.object({
  table: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  res_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  people: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TableOrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TableOrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  table: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  res_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  people: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HomeOrderCreateInputSchema: z.ZodType<Prisma.HomeOrderCreateInput> = z.object({
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  order: z.lazy(() => OrderCreateNestedOneWithoutHome_orderInputSchema),
  address: z.lazy(() => AddressCreateNestedOneWithoutHome_ordersInputSchema),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutHome_ordersInputSchema)
}).strict();

export const HomeOrderUncheckedCreateInputSchema: z.ZodType<Prisma.HomeOrderUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  address_id: z.number().int(),
  customer_id: z.number().int(),
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable()
}).strict();

export const HomeOrderUpdateInputSchema: z.ZodType<Prisma.HomeOrderUpdateInput> = z.object({
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutHome_orderNestedInputSchema).optional(),
  address: z.lazy(() => AddressUpdateOneRequiredWithoutHome_ordersNestedInputSchema).optional(),
  customer: z.lazy(() => CustomerUpdateOneRequiredWithoutHome_ordersNestedInputSchema).optional()
}).strict();

export const HomeOrderUncheckedUpdateInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  address_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const HomeOrderCreateManyInputSchema: z.ZodType<Prisma.HomeOrderCreateManyInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  address_id: z.number().int(),
  customer_id: z.number().int(),
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable()
}).strict();

export const HomeOrderUpdateManyMutationInputSchema: z.ZodType<Prisma.HomeOrderUpdateManyMutationInput> = z.object({
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const HomeOrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  address_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickupOrderCreateInputSchema: z.ZodType<Prisma.PickupOrderCreateInput> = z.object({
  when: z.string().optional().nullable(),
  name: z.string(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutPickup_ordersInputSchema).optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutPickup_orderInputSchema)
}).strict();

export const PickupOrderUncheckedCreateInputSchema: z.ZodType<Prisma.PickupOrderUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  customer_id: z.number().int().optional().nullable(),
  when: z.string().optional().nullable(),
  name: z.string()
}).strict();

export const PickupOrderUpdateInputSchema: z.ZodType<Prisma.PickupOrderUpdateInput> = z.object({
  when: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutPickup_ordersNestedInputSchema).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutPickup_orderNestedInputSchema).optional()
}).strict();

export const PickupOrderUncheckedUpdateInputSchema: z.ZodType<Prisma.PickupOrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  when: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PickupOrderCreateManyInputSchema: z.ZodType<Prisma.PickupOrderCreateManyInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  customer_id: z.number().int().optional().nullable(),
  when: z.string().optional().nullable(),
  name: z.string()
}).strict();

export const PickupOrderUpdateManyMutationInputSchema: z.ZodType<Prisma.PickupOrderUpdateManyMutationInput> = z.object({
  when: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PickupOrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PickupOrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  when: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressCreateInputSchema: z.ZodType<Prisma.AddressCreateInput> = z.object({
  street: z.string(),
  civic: z.string(),
  doorbell: z.string(),
  floor: z.string().optional().nullable(),
  stair: z.string().optional().nullable(),
  street_info: z.string().optional().nullable(),
  active: z.boolean().optional(),
  temporary: z.boolean().optional(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutAddressesInputSchema),
  home_orders: z.lazy(() => HomeOrderCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateInputSchema: z.ZodType<Prisma.AddressUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  customer_id: z.number().int(),
  street: z.string(),
  civic: z.string(),
  doorbell: z.string(),
  floor: z.string().optional().nullable(),
  stair: z.string().optional().nullable(),
  street_info: z.string().optional().nullable(),
  active: z.boolean().optional(),
  temporary: z.boolean().optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUpdateInputSchema: z.ZodType<Prisma.AddressUpdateInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  civic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doorbell: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  street_info: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  temporary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => CustomerUpdateOneRequiredWithoutAddressesNestedInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  civic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doorbell: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  street_info: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  temporary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressCreateManyInputSchema: z.ZodType<Prisma.AddressCreateManyInput> = z.object({
  id: z.number().int().optional(),
  customer_id: z.number().int(),
  street: z.string(),
  civic: z.string(),
  doorbell: z.string(),
  floor: z.string().optional().nullable(),
  stair: z.string().optional().nullable(),
  street_info: z.string().optional().nullable(),
  active: z.boolean().optional(),
  temporary: z.boolean().optional()
}).strict();

export const AddressUpdateManyMutationInputSchema: z.ZodType<Prisma.AddressUpdateManyMutationInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  civic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doorbell: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  street_info: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  temporary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  civic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doorbell: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  street_info: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  temporary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CustomerCreateInputSchema: z.ZodType<Prisma.CustomerCreateInput> = z.object({
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  phone: z.lazy(() => PhoneCreateNestedOneWithoutCustomerInputSchema).optional(),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutCustomerInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderCreateNestedManyWithoutCustomerInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerUncheckedCreateInputSchema: z.ZodType<Prisma.CustomerUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  phone_id: z.number().int().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUncheckedCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerUpdateInputSchema: z.ZodType<Prisma.CustomerUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.lazy(() => PhoneUpdateOneWithoutCustomerNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutCustomerNestedInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUpdateManyWithoutCustomerNestedInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const CustomerUncheckedUpdateInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  phone_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const CustomerCreateManyInputSchema: z.ZodType<Prisma.CustomerCreateManyInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  phone_id: z.number().int().optional().nullable()
}).strict();

export const CustomerUpdateManyMutationInputSchema: z.ZodType<Prisma.CustomerUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CustomerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  phone_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PhoneCreateInputSchema: z.ZodType<Prisma.PhoneCreateInput> = z.object({
  phone: z.string(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutPhoneInputSchema).optional()
}).strict();

export const PhoneUncheckedCreateInputSchema: z.ZodType<Prisma.PhoneUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  phone: z.string(),
  customer: z.lazy(() => CustomerUncheckedCreateNestedOneWithoutPhoneInputSchema).optional()
}).strict();

export const PhoneUpdateInputSchema: z.ZodType<Prisma.PhoneUpdateInput> = z.object({
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutPhoneNestedInputSchema).optional()
}).strict();

export const PhoneUncheckedUpdateInputSchema: z.ZodType<Prisma.PhoneUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => CustomerUncheckedUpdateOneWithoutPhoneNestedInputSchema).optional()
}).strict();

export const PhoneCreateManyInputSchema: z.ZodType<Prisma.PhoneCreateManyInput> = z.object({
  id: z.number().int().optional(),
  phone: z.string()
}).strict();

export const PhoneUpdateManyMutationInputSchema: z.ZodType<Prisma.PhoneUpdateManyMutationInput> = z.object({
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PhoneUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PhoneUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentCreateInputSchema: z.ZodType<Prisma.PaymentCreateInput> = z.object({
  amount: z.number().optional(),
  created_at: z.coerce.date().optional(),
  type: z.lazy(() => PaymentTypeSchema),
  order: z.lazy(() => OrderCreateNestedOneWithoutPaymentsInputSchema)
}).strict();

export const PaymentUncheckedCreateInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  amount: z.number().optional(),
  order_id: z.number().int(),
  created_at: z.coerce.date().optional(),
  type: z.lazy(() => PaymentTypeSchema)
}).strict();

export const PaymentUpdateInputSchema: z.ZodType<Prisma.PaymentUpdateInput> = z.object({
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => EnumPaymentTypeFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutPaymentsNestedInputSchema).optional()
}).strict();

export const PaymentUncheckedUpdateInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => EnumPaymentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentCreateManyInputSchema: z.ZodType<Prisma.PaymentCreateManyInput> = z.object({
  id: z.number().int().optional(),
  amount: z.number().optional(),
  order_id: z.number().int(),
  created_at: z.coerce.date().optional(),
  type: z.lazy(() => PaymentTypeSchema)
}).strict();

export const PaymentUpdateManyMutationInputSchema: z.ZodType<Prisma.PaymentUpdateManyMutationInput> = z.object({
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => EnumPaymentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => EnumPaymentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RiceCreateInputSchema: z.ZodType<Prisma.RiceCreateInput> = z.object({
  amount: z.number(),
  threshold: z.number()
}).strict();

export const RiceUncheckedCreateInputSchema: z.ZodType<Prisma.RiceUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  amount: z.number(),
  threshold: z.number()
}).strict();

export const RiceUpdateInputSchema: z.ZodType<Prisma.RiceUpdateInput> = z.object({
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  threshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RiceUncheckedUpdateInputSchema: z.ZodType<Prisma.RiceUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  threshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RiceCreateManyInputSchema: z.ZodType<Prisma.RiceCreateManyInput> = z.object({
  id: z.number().int().optional(),
  amount: z.number(),
  threshold: z.number()
}).strict();

export const RiceUpdateManyMutationInputSchema: z.ZodType<Prisma.RiceUpdateManyMutationInput> = z.object({
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  threshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RiceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RiceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  threshold: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductCreateInputSchema: z.ZodType<Prisma.ProductCreateInput> = z.object({
  code: z.string(),
  desc: z.string(),
  site_price: z.number().optional().nullable(),
  home_price: z.number().optional().nullable(),
  rice: z.number().optional(),
  active: z.boolean().optional(),
  kitchen: z.lazy(() => KitchenTypeSchema).optional(),
  orders: z.lazy(() => ProductInOrderCreateNestedManyWithoutProductInputSchema).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutProductsInputSchema).optional()
}).strict();

export const ProductUncheckedCreateInputSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  category_id: z.number().int().optional().nullable(),
  code: z.string(),
  desc: z.string(),
  site_price: z.number().optional().nullable(),
  home_price: z.number().optional().nullable(),
  rice: z.number().optional(),
  active: z.boolean().optional(),
  kitchen: z.lazy(() => KitchenTypeSchema).optional(),
  orders: z.lazy(() => ProductInOrderUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUpdateInputSchema: z.ZodType<Prisma.ProductUpdateInput> = z.object({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  desc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  site_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  kitchen: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => EnumKitchenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  orders: z.lazy(() => ProductInOrderUpdateManyWithoutProductNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneWithoutProductsNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  desc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  site_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  kitchen: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => EnumKitchenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  orders: z.lazy(() => ProductInOrderUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductCreateManyInputSchema: z.ZodType<Prisma.ProductCreateManyInput> = z.object({
  id: z.number().int().optional(),
  category_id: z.number().int().optional().nullable(),
  code: z.string(),
  desc: z.string(),
  site_price: z.number().optional().nullable(),
  home_price: z.number().optional().nullable(),
  rice: z.number().optional(),
  active: z.boolean().optional(),
  kitchen: z.lazy(() => KitchenTypeSchema).optional()
}).strict();

export const ProductUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductUpdateManyMutationInput> = z.object({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  desc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  site_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  kitchen: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => EnumKitchenTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  desc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  site_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  kitchen: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => EnumKitchenTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductInOrderCreateInputSchema: z.ZodType<Prisma.ProductInOrderCreateInput> = z.object({
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional(),
  options: z.lazy(() => OptionInProductOrderCreateNestedManyWithoutProduct_in_orderInputSchema).optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutOrdersInputSchema),
  order: z.lazy(() => OrderCreateNestedOneWithoutProductsInputSchema)
}).strict();

export const ProductInOrderUncheckedCreateInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  product_id: z.number().int(),
  order_id: z.number().int(),
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional(),
  options: z.lazy(() => OptionInProductOrderUncheckedCreateNestedManyWithoutProduct_in_orderInputSchema).optional()
}).strict();

export const ProductInOrderUpdateInputSchema: z.ZodType<Prisma.ProductInOrderUpdateInput> = z.object({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.lazy(() => OptionInProductOrderUpdateManyWithoutProduct_in_orderNestedInputSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutProductsNestedInputSchema).optional()
}).strict();

export const ProductInOrderUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.lazy(() => OptionInProductOrderUncheckedUpdateManyWithoutProduct_in_orderNestedInputSchema).optional()
}).strict();

export const ProductInOrderCreateManyInputSchema: z.ZodType<Prisma.ProductInOrderCreateManyInput> = z.object({
  id: z.number().int().optional(),
  product_id: z.number().int(),
  order_id: z.number().int(),
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional()
}).strict();

export const ProductInOrderUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductInOrderUpdateManyMutationInput> = z.object({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductInOrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryCreateInputSchema: z.ZodType<Prisma.CategoryCreateInput> = z.object({
  category: z.string(),
  active: z.boolean().optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutCategoryInputSchema).optional(),
  options: z.lazy(() => CategoryOnOptionCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  category: z.string(),
  active: z.boolean().optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutCategoryInputSchema).optional(),
  options: z.lazy(() => CategoryOnOptionUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUpdateInputSchema: z.ZodType<Prisma.CategoryUpdateInput> = z.object({
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutCategoryNestedInputSchema).optional(),
  options: z.lazy(() => CategoryOnOptionUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional(),
  options: z.lazy(() => CategoryOnOptionUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryCreateManyInputSchema: z.ZodType<Prisma.CategoryCreateManyInput> = z.object({
  id: z.number().int().optional(),
  category: z.string(),
  active: z.boolean().optional()
}).strict();

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryUpdateManyMutationInput> = z.object({
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryOnOptionCreateInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateInput> = z.object({
  category: z.lazy(() => CategoryCreateNestedOneWithoutOptionsInputSchema),
  option: z.lazy(() => OptionCreateNestedOneWithoutCategoriesInputSchema)
}).strict();

export const CategoryOnOptionUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  category_id: z.number().int(),
  option_id: z.number().int()
}).strict();

export const CategoryOnOptionUpdateInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateInput> = z.object({
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutOptionsNestedInputSchema).optional(),
  option: z.lazy(() => OptionUpdateOneRequiredWithoutCategoriesNestedInputSchema).optional()
}).strict();

export const CategoryOnOptionUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryOnOptionCreateManyInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateManyInput> = z.object({
  id: z.number().int().optional(),
  category_id: z.number().int(),
  option_id: z.number().int()
}).strict();

export const CategoryOnOptionUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateManyMutationInput> = z.object({
}).strict();

export const CategoryOnOptionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OptionCreateInputSchema: z.ZodType<Prisma.OptionCreateInput> = z.object({
  option_name: z.string(),
  active: z.boolean().optional(),
  categories: z.lazy(() => CategoryOnOptionCreateNestedManyWithoutOptionInputSchema).optional(),
  products: z.lazy(() => OptionInProductOrderCreateNestedManyWithoutOptionInputSchema).optional()
}).strict();

export const OptionUncheckedCreateInputSchema: z.ZodType<Prisma.OptionUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  option_name: z.string(),
  active: z.boolean().optional(),
  categories: z.lazy(() => CategoryOnOptionUncheckedCreateNestedManyWithoutOptionInputSchema).optional(),
  products: z.lazy(() => OptionInProductOrderUncheckedCreateNestedManyWithoutOptionInputSchema).optional()
}).strict();

export const OptionUpdateInputSchema: z.ZodType<Prisma.OptionUpdateInput> = z.object({
  option_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.lazy(() => CategoryOnOptionUpdateManyWithoutOptionNestedInputSchema).optional(),
  products: z.lazy(() => OptionInProductOrderUpdateManyWithoutOptionNestedInputSchema).optional()
}).strict();

export const OptionUncheckedUpdateInputSchema: z.ZodType<Prisma.OptionUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.lazy(() => CategoryOnOptionUncheckedUpdateManyWithoutOptionNestedInputSchema).optional(),
  products: z.lazy(() => OptionInProductOrderUncheckedUpdateManyWithoutOptionNestedInputSchema).optional()
}).strict();

export const OptionCreateManyInputSchema: z.ZodType<Prisma.OptionCreateManyInput> = z.object({
  id: z.number().int().optional(),
  option_name: z.string(),
  active: z.boolean().optional()
}).strict();

export const OptionUpdateManyMutationInputSchema: z.ZodType<Prisma.OptionUpdateManyMutationInput> = z.object({
  option_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OptionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OptionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OptionInProductOrderCreateInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateInput> = z.object({
  product_in_order: z.lazy(() => ProductInOrderCreateNestedOneWithoutOptionsInputSchema),
  option: z.lazy(() => OptionCreateNestedOneWithoutProductsInputSchema)
}).strict();

export const OptionInProductOrderUncheckedCreateInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  product_in_order_id: z.number().int(),
  option_id: z.number().int()
}).strict();

export const OptionInProductOrderUpdateInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateInput> = z.object({
  product_in_order: z.lazy(() => ProductInOrderUpdateOneRequiredWithoutOptionsNestedInputSchema).optional(),
  option: z.lazy(() => OptionUpdateOneRequiredWithoutProductsNestedInputSchema).optional()
}).strict();

export const OptionInProductOrderUncheckedUpdateInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product_in_order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OptionInProductOrderCreateManyInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateManyInput> = z.object({
  id: z.number().int().optional(),
  product_in_order_id: z.number().int(),
  option_id: z.number().int()
}).strict();

export const OptionInProductOrderUpdateManyMutationInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateManyMutationInput> = z.object({
}).strict();

export const OptionInProductOrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product_in_order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumOrderStateFilterSchema: z.ZodType<Prisma.EnumOrderStateFilter> = z.object({
  equals: z.lazy(() => OrderStateSchema).optional(),
  in: z.lazy(() => OrderStateSchema).array().optional(),
  notIn: z.lazy(() => OrderStateSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => NestedEnumOrderStateFilterSchema) ]).optional(),
}).strict();

export const EnumOrderTypeFilterSchema: z.ZodType<Prisma.EnumOrderTypeFilter> = z.object({
  equals: z.lazy(() => OrderTypeSchema).optional(),
  in: z.lazy(() => OrderTypeSchema).array().optional(),
  notIn: z.lazy(() => OrderTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => NestedEnumOrderTypeFilterSchema) ]).optional(),
}).strict();

export const ProductInOrderListRelationFilterSchema: z.ZodType<Prisma.ProductInOrderListRelationFilter> = z.object({
  every: z.lazy(() => ProductInOrderWhereInputSchema).optional(),
  some: z.lazy(() => ProductInOrderWhereInputSchema).optional(),
  none: z.lazy(() => ProductInOrderWhereInputSchema).optional()
}).strict();

export const PaymentListRelationFilterSchema: z.ZodType<Prisma.PaymentListRelationFilter> = z.object({
  every: z.lazy(() => PaymentWhereInputSchema).optional(),
  some: z.lazy(() => PaymentWhereInputSchema).optional(),
  none: z.lazy(() => PaymentWhereInputSchema).optional()
}).strict();

export const TableOrderNullableRelationFilterSchema: z.ZodType<Prisma.TableOrderNullableRelationFilter> = z.object({
  is: z.lazy(() => TableOrderWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => TableOrderWhereInputSchema).optional().nullable()
}).strict();

export const HomeOrderNullableRelationFilterSchema: z.ZodType<Prisma.HomeOrderNullableRelationFilter> = z.object({
  is: z.lazy(() => HomeOrderWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => HomeOrderWhereInputSchema).optional().nullable()
}).strict();

export const PickupOrderNullableRelationFilterSchema: z.ZodType<Prisma.PickupOrderNullableRelationFilter> = z.object({
  is: z.lazy(() => PickupOrderWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PickupOrderWhereInputSchema).optional().nullable()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ProductInOrderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductInOrderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PaymentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  discount: z.lazy(() => SortOrderSchema).optional(),
  is_receipt_printed: z.lazy(() => SortOrderSchema).optional(),
  suborder_of: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrderAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  discount: z.lazy(() => SortOrderSchema).optional(),
  suborder_of: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  discount: z.lazy(() => SortOrderSchema).optional(),
  is_receipt_printed: z.lazy(() => SortOrderSchema).optional(),
  suborder_of: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  discount: z.lazy(() => SortOrderSchema).optional(),
  is_receipt_printed: z.lazy(() => SortOrderSchema).optional(),
  suborder_of: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrderSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  discount: z.lazy(() => SortOrderSchema).optional(),
  suborder_of: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const EnumOrderStateWithAggregatesFilterSchema: z.ZodType<Prisma.EnumOrderStateWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrderStateSchema).optional(),
  in: z.lazy(() => OrderStateSchema).array().optional(),
  notIn: z.lazy(() => OrderStateSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => NestedEnumOrderStateWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderStateFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderStateFilterSchema).optional()
}).strict();

export const EnumOrderTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumOrderTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrderTypeSchema).optional(),
  in: z.lazy(() => OrderTypeSchema).array().optional(),
  notIn: z.lazy(() => OrderTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => NestedEnumOrderTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderTypeFilterSchema).optional()
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const OrderRelationFilterSchema: z.ZodType<Prisma.OrderRelationFilter> = z.object({
  is: z.lazy(() => OrderWhereInputSchema).optional(),
  isNot: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const TableOrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.TableOrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  res_name: z.lazy(() => SortOrderSchema).optional(),
  people: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TableOrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TableOrderAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  people: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TableOrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TableOrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  res_name: z.lazy(() => SortOrderSchema).optional(),
  people: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TableOrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.TableOrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => SortOrderSchema).optional(),
  res_name: z.lazy(() => SortOrderSchema).optional(),
  people: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TableOrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.TableOrderSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  people: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const AddressRelationFilterSchema: z.ZodType<Prisma.AddressRelationFilter> = z.object({
  is: z.lazy(() => AddressWhereInputSchema).optional(),
  isNot: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const CustomerRelationFilterSchema: z.ZodType<Prisma.CustomerRelationFilter> = z.object({
  is: z.lazy(() => CustomerWhereInputSchema).optional(),
  isNot: z.lazy(() => CustomerWhereInputSchema).optional()
}).strict();

export const HomeOrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.HomeOrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  address_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  when: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  contact_phone: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HomeOrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.HomeOrderAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  address_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HomeOrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.HomeOrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  address_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  when: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  contact_phone: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HomeOrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.HomeOrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  address_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  when: z.lazy(() => SortOrderSchema).optional(),
  notes: z.lazy(() => SortOrderSchema).optional(),
  contact_phone: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HomeOrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.HomeOrderSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  address_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CustomerNullableRelationFilterSchema: z.ZodType<Prisma.CustomerNullableRelationFilter> = z.object({
  is: z.lazy(() => CustomerWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CustomerWhereInputSchema).optional().nullable()
}).strict();

export const PickupOrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.PickupOrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  when: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickupOrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PickupOrderAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickupOrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PickupOrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  when: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickupOrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.PickupOrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  when: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickupOrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.PickupOrderSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const HomeOrderListRelationFilterSchema: z.ZodType<Prisma.HomeOrderListRelationFilter> = z.object({
  every: z.lazy(() => HomeOrderWhereInputSchema).optional(),
  some: z.lazy(() => HomeOrderWhereInputSchema).optional(),
  none: z.lazy(() => HomeOrderWhereInputSchema).optional()
}).strict();

export const HomeOrderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.HomeOrderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressCountOrderByAggregateInputSchema: z.ZodType<Prisma.AddressCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  civic: z.lazy(() => SortOrderSchema).optional(),
  doorbell: z.lazy(() => SortOrderSchema).optional(),
  floor: z.lazy(() => SortOrderSchema).optional(),
  stair: z.lazy(() => SortOrderSchema).optional(),
  street_info: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  temporary: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AddressAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  civic: z.lazy(() => SortOrderSchema).optional(),
  doorbell: z.lazy(() => SortOrderSchema).optional(),
  floor: z.lazy(() => SortOrderSchema).optional(),
  stair: z.lazy(() => SortOrderSchema).optional(),
  street_info: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  temporary: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressMinOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  civic: z.lazy(() => SortOrderSchema).optional(),
  doorbell: z.lazy(() => SortOrderSchema).optional(),
  floor: z.lazy(() => SortOrderSchema).optional(),
  stair: z.lazy(() => SortOrderSchema).optional(),
  street_info: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  temporary: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AddressSumOrderByAggregateInputSchema: z.ZodType<Prisma.AddressSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customer_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneNullableRelationFilterSchema: z.ZodType<Prisma.PhoneNullableRelationFilter> = z.object({
  is: z.lazy(() => PhoneWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PhoneWhereInputSchema).optional().nullable()
}).strict();

export const AddressListRelationFilterSchema: z.ZodType<Prisma.AddressListRelationFilter> = z.object({
  every: z.lazy(() => AddressWhereInputSchema).optional(),
  some: z.lazy(() => AddressWhereInputSchema).optional(),
  none: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const PickupOrderListRelationFilterSchema: z.ZodType<Prisma.PickupOrderListRelationFilter> = z.object({
  every: z.lazy(() => PickupOrderWhereInputSchema).optional(),
  some: z.lazy(() => PickupOrderWhereInputSchema).optional(),
  none: z.lazy(() => PickupOrderWhereInputSchema).optional()
}).strict();

export const AddressOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AddressOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PickupOrderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PickupOrderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CustomerCountOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  preferences: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  phone_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CustomerAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phone_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CustomerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  preferences: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  phone_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CustomerMinOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  surname: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  preferences: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  phone_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CustomerSumOrderByAggregateInputSchema: z.ZodType<Prisma.CustomerSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phone_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneCountOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneMinOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneSumOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPaymentTypeFilterSchema: z.ZodType<Prisma.EnumPaymentTypeFilter> = z.object({
  equals: z.lazy(() => PaymentTypeSchema).optional(),
  in: z.lazy(() => PaymentTypeSchema).array().optional(),
  notIn: z.lazy(() => PaymentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => NestedEnumPaymentTypeFilterSchema) ]).optional(),
}).strict();

export const PaymentCountOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentMinOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PaymentSumOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumPaymentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPaymentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PaymentTypeSchema).optional(),
  in: z.lazy(() => PaymentTypeSchema).array().optional(),
  notIn: z.lazy(() => PaymentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => NestedEnumPaymentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentTypeFilterSchema).optional()
}).strict();

export const RiceCountOrderByAggregateInputSchema: z.ZodType<Prisma.RiceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  threshold: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RiceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RiceAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  threshold: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RiceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RiceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  threshold: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RiceMinOrderByAggregateInputSchema: z.ZodType<Prisma.RiceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  threshold: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RiceSumOrderByAggregateInputSchema: z.ZodType<Prisma.RiceSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  threshold: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const EnumKitchenTypeFilterSchema: z.ZodType<Prisma.EnumKitchenTypeFilter> = z.object({
  equals: z.lazy(() => KitchenTypeSchema).optional(),
  in: z.lazy(() => KitchenTypeSchema).array().optional(),
  notIn: z.lazy(() => KitchenTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => NestedEnumKitchenTypeFilterSchema) ]).optional(),
}).strict();

export const CategoryNullableRelationFilterSchema: z.ZodType<Prisma.CategoryNullableRelationFilter> = z.object({
  is: z.lazy(() => CategoryWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional().nullable()
}).strict();

export const ProductCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  desc: z.lazy(() => SortOrderSchema).optional(),
  site_price: z.lazy(() => SortOrderSchema).optional(),
  home_price: z.lazy(() => SortOrderSchema).optional(),
  rice: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  kitchen: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  site_price: z.lazy(() => SortOrderSchema).optional(),
  home_price: z.lazy(() => SortOrderSchema).optional(),
  rice: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  desc: z.lazy(() => SortOrderSchema).optional(),
  site_price: z.lazy(() => SortOrderSchema).optional(),
  home_price: z.lazy(() => SortOrderSchema).optional(),
  rice: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  kitchen: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  code: z.lazy(() => SortOrderSchema).optional(),
  desc: z.lazy(() => SortOrderSchema).optional(),
  site_price: z.lazy(() => SortOrderSchema).optional(),
  home_price: z.lazy(() => SortOrderSchema).optional(),
  rice: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional(),
  kitchen: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  site_price: z.lazy(() => SortOrderSchema).optional(),
  home_price: z.lazy(() => SortOrderSchema).optional(),
  rice: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const EnumKitchenTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumKitchenTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => KitchenTypeSchema).optional(),
  in: z.lazy(() => KitchenTypeSchema).array().optional(),
  notIn: z.lazy(() => KitchenTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => NestedEnumKitchenTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumKitchenTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumKitchenTypeFilterSchema).optional()
}).strict();

export const EnumProductInOrderStateFilterSchema: z.ZodType<Prisma.EnumProductInOrderStateFilter> = z.object({
  equals: z.lazy(() => ProductInOrderStateSchema).optional(),
  in: z.lazy(() => ProductInOrderStateSchema).array().optional(),
  notIn: z.lazy(() => ProductInOrderStateSchema).array().optional(),
  not: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => NestedEnumProductInOrderStateFilterSchema) ]).optional(),
}).strict();

export const OptionInProductOrderListRelationFilterSchema: z.ZodType<Prisma.OptionInProductOrderListRelationFilter> = z.object({
  every: z.lazy(() => OptionInProductOrderWhereInputSchema).optional(),
  some: z.lazy(() => OptionInProductOrderWhereInputSchema).optional(),
  none: z.lazy(() => OptionInProductOrderWhereInputSchema).optional()
}).strict();

export const ProductRelationFilterSchema: z.ZodType<Prisma.ProductRelationFilter> = z.object({
  is: z.lazy(() => ProductWhereInputSchema).optional(),
  isNot: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const OptionInProductOrderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OptionInProductOrderOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductInOrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductInOrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  is_paid_fully: z.lazy(() => SortOrderSchema).optional(),
  paid_quantity: z.lazy(() => SortOrderSchema).optional(),
  rice_quantity: z.lazy(() => SortOrderSchema).optional(),
  printed_amount: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductInOrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductInOrderAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  paid_quantity: z.lazy(() => SortOrderSchema).optional(),
  rice_quantity: z.lazy(() => SortOrderSchema).optional(),
  printed_amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductInOrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductInOrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  is_paid_fully: z.lazy(() => SortOrderSchema).optional(),
  paid_quantity: z.lazy(() => SortOrderSchema).optional(),
  rice_quantity: z.lazy(() => SortOrderSchema).optional(),
  printed_amount: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductInOrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductInOrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  is_paid_fully: z.lazy(() => SortOrderSchema).optional(),
  paid_quantity: z.lazy(() => SortOrderSchema).optional(),
  rice_quantity: z.lazy(() => SortOrderSchema).optional(),
  printed_amount: z.lazy(() => SortOrderSchema).optional(),
  state: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductInOrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductInOrderSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_id: z.lazy(() => SortOrderSchema).optional(),
  order_id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  total: z.lazy(() => SortOrderSchema).optional(),
  paid_quantity: z.lazy(() => SortOrderSchema).optional(),
  rice_quantity: z.lazy(() => SortOrderSchema).optional(),
  printed_amount: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumProductInOrderStateWithAggregatesFilterSchema: z.ZodType<Prisma.EnumProductInOrderStateWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ProductInOrderStateSchema).optional(),
  in: z.lazy(() => ProductInOrderStateSchema).array().optional(),
  notIn: z.lazy(() => ProductInOrderStateSchema).array().optional(),
  not: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => NestedEnumProductInOrderStateWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProductInOrderStateFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProductInOrderStateFilterSchema).optional()
}).strict();

export const ProductListRelationFilterSchema: z.ZodType<Prisma.ProductListRelationFilter> = z.object({
  every: z.lazy(() => ProductWhereInputSchema).optional(),
  some: z.lazy(() => ProductWhereInputSchema).optional(),
  none: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const CategoryOnOptionListRelationFilterSchema: z.ZodType<Prisma.CategoryOnOptionListRelationFilter> = z.object({
  every: z.lazy(() => CategoryOnOptionWhereInputSchema).optional(),
  some: z.lazy(() => CategoryOnOptionWhereInputSchema).optional(),
  none: z.lazy(() => CategoryOnOptionWhereInputSchema).optional()
}).strict();

export const ProductOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryOnOptionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CategoryOnOptionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategorySumOrderByAggregateInputSchema: z.ZodType<Prisma.CategorySumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryRelationFilterSchema: z.ZodType<Prisma.CategoryRelationFilter> = z.object({
  is: z.lazy(() => CategoryWhereInputSchema).optional(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const OptionRelationFilterSchema: z.ZodType<Prisma.OptionRelationFilter> = z.object({
  is: z.lazy(() => OptionWhereInputSchema).optional(),
  isNot: z.lazy(() => OptionWhereInputSchema).optional()
}).strict();

export const CategoryOnOptionCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryOnOptionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryOnOptionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryOnOptionAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryOnOptionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryOnOptionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryOnOptionMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryOnOptionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryOnOptionSumOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryOnOptionSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  category_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OptionCountOrderByAggregateInputSchema: z.ZodType<Prisma.OptionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  option_name: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OptionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OptionAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OptionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OptionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  option_name: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OptionMinOrderByAggregateInputSchema: z.ZodType<Prisma.OptionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  option_name: z.lazy(() => SortOrderSchema).optional(),
  active: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OptionSumOrderByAggregateInputSchema: z.ZodType<Prisma.OptionSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductInOrderRelationFilterSchema: z.ZodType<Prisma.ProductInOrderRelationFilter> = z.object({
  is: z.lazy(() => ProductInOrderWhereInputSchema).optional(),
  isNot: z.lazy(() => ProductInOrderWhereInputSchema).optional()
}).strict();

export const OptionInProductOrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.OptionInProductOrderCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_in_order_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OptionInProductOrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OptionInProductOrderAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_in_order_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OptionInProductOrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OptionInProductOrderMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_in_order_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OptionInProductOrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.OptionInProductOrderMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_in_order_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const OptionInProductOrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.OptionInProductOrderSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  product_in_order_id: z.lazy(() => SortOrderSchema).optional(),
  option_id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ProductInOrderCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderCreateNestedManyWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema).array(),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductInOrderCreateOrConnectWithoutOrderInputSchema),z.lazy(() => ProductInOrderCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductInOrderCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PaymentCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.PaymentCreateNestedManyWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema),z.lazy(() => PaymentCreateWithoutOrderInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TableOrderCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.TableOrderCreateNestedOneWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => TableOrderCreateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TableOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => TableOrderWhereUniqueInputSchema).optional()
}).strict();

export const HomeOrderCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.HomeOrderCreateNestedOneWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HomeOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => HomeOrderWhereUniqueInputSchema).optional()
}).strict();

export const PickupOrderCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.PickupOrderCreateNestedOneWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PickupOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => PickupOrderWhereUniqueInputSchema).optional()
}).strict();

export const ProductInOrderUncheckedCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedCreateNestedManyWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema).array(),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductInOrderCreateOrConnectWithoutOrderInputSchema),z.lazy(() => ProductInOrderCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductInOrderCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PaymentUncheckedCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateNestedManyWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema),z.lazy(() => PaymentCreateWithoutOrderInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TableOrderUncheckedCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.TableOrderUncheckedCreateNestedOneWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => TableOrderCreateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TableOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => TableOrderWhereUniqueInputSchema).optional()
}).strict();

export const HomeOrderUncheckedCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.HomeOrderUncheckedCreateNestedOneWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HomeOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => HomeOrderWhereUniqueInputSchema).optional()
}).strict();

export const PickupOrderUncheckedCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.PickupOrderUncheckedCreateNestedOneWithoutOrderInput> = z.object({
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PickupOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => PickupOrderWhereUniqueInputSchema).optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumOrderStateFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumOrderStateFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => OrderStateSchema).optional()
}).strict();

export const EnumOrderTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumOrderTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => OrderTypeSchema).optional()
}).strict();

export const ProductInOrderUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.ProductInOrderUpdateManyWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema).array(),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductInOrderCreateOrConnectWithoutOrderInputSchema),z.lazy(() => ProductInOrderCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductInOrderUpsertWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => ProductInOrderUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductInOrderCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductInOrderUpdateWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => ProductInOrderUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductInOrderUpdateManyWithWhereWithoutOrderInputSchema),z.lazy(() => ProductInOrderUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductInOrderScalarWhereInputSchema),z.lazy(() => ProductInOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PaymentUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.PaymentUpdateManyWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema),z.lazy(() => PaymentCreateWithoutOrderInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentUpsertWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => PaymentUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => PaymentUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentUpdateManyWithWhereWithoutOrderInputSchema),z.lazy(() => PaymentUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TableOrderUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.TableOrderUpdateOneWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => TableOrderCreateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TableOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => TableOrderUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TableOrderWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TableOrderWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TableOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TableOrderUpdateToOneWithWhereWithoutOrderInputSchema),z.lazy(() => TableOrderUpdateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
}).strict();

export const HomeOrderUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.HomeOrderUpdateOneWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HomeOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => HomeOrderUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => HomeOrderWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => HomeOrderWhereInputSchema) ]).optional(),
  connect: z.lazy(() => HomeOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HomeOrderUpdateToOneWithWhereWithoutOrderInputSchema),z.lazy(() => HomeOrderUpdateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
}).strict();

export const PickupOrderUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.PickupOrderUpdateOneWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PickupOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => PickupOrderUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PickupOrderWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PickupOrderWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PickupOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PickupOrderUpdateToOneWithWhereWithoutOrderInputSchema),z.lazy(() => PickupOrderUpdateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ProductInOrderUncheckedUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedUpdateManyWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema).array(),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductInOrderCreateOrConnectWithoutOrderInputSchema),z.lazy(() => ProductInOrderCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductInOrderUpsertWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => ProductInOrderUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductInOrderCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductInOrderUpdateWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => ProductInOrderUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductInOrderUpdateManyWithWhereWithoutOrderInputSchema),z.lazy(() => ProductInOrderUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductInOrderScalarWhereInputSchema),z.lazy(() => ProductInOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PaymentUncheckedUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema),z.lazy(() => PaymentCreateWithoutOrderInputSchema).array(),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema),z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PaymentUpsertWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => PaymentUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PaymentCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PaymentWhereUniqueInputSchema),z.lazy(() => PaymentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateWithWhereUniqueWithoutOrderInputSchema),z.lazy(() => PaymentUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PaymentUpdateManyWithWhereWithoutOrderInputSchema),z.lazy(() => PaymentUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TableOrderUncheckedUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.TableOrderUncheckedUpdateOneWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => TableOrderCreateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TableOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => TableOrderUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => TableOrderWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => TableOrderWhereInputSchema) ]).optional(),
  connect: z.lazy(() => TableOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TableOrderUpdateToOneWithWhereWithoutOrderInputSchema),z.lazy(() => TableOrderUpdateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
}).strict();

export const HomeOrderUncheckedUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateOneWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => HomeOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => HomeOrderUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => HomeOrderWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => HomeOrderWhereInputSchema) ]).optional(),
  connect: z.lazy(() => HomeOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => HomeOrderUpdateToOneWithWhereWithoutOrderInputSchema),z.lazy(() => HomeOrderUpdateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
}).strict();

export const PickupOrderUncheckedUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.PickupOrderUncheckedUpdateOneWithoutOrderNestedInput> = z.object({
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PickupOrderCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => PickupOrderUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PickupOrderWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PickupOrderWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PickupOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PickupOrderUpdateToOneWithWhereWithoutOrderInputSchema),z.lazy(() => PickupOrderUpdateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
}).strict();

export const OrderCreateNestedOneWithoutTable_orderInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutTable_orderInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTable_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTable_orderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutTable_orderInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const OrderUpdateOneRequiredWithoutTable_orderNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutTable_orderNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutTable_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTable_orderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutTable_orderInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutTable_orderInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutTable_orderInputSchema),z.lazy(() => OrderUpdateWithoutTable_orderInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutTable_orderInputSchema) ]).optional(),
}).strict();

export const OrderCreateNestedOneWithoutHome_orderInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutHome_orderInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutHome_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutHome_orderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutHome_orderInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional()
}).strict();

export const AddressCreateNestedOneWithoutHome_ordersInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutHome_ordersInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutHome_ordersInputSchema),z.lazy(() => AddressUncheckedCreateWithoutHome_ordersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutHome_ordersInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional()
}).strict();

export const CustomerCreateNestedOneWithoutHome_ordersInputSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutHome_ordersInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutHome_ordersInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutHome_ordersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutHome_ordersInputSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional()
}).strict();

export const OrderUpdateOneRequiredWithoutHome_orderNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutHome_orderNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutHome_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutHome_orderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutHome_orderInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutHome_orderInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutHome_orderInputSchema),z.lazy(() => OrderUpdateWithoutHome_orderInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutHome_orderInputSchema) ]).optional(),
}).strict();

export const AddressUpdateOneRequiredWithoutHome_ordersNestedInputSchema: z.ZodType<Prisma.AddressUpdateOneRequiredWithoutHome_ordersNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutHome_ordersInputSchema),z.lazy(() => AddressUncheckedCreateWithoutHome_ordersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutHome_ordersInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutHome_ordersInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutHome_ordersInputSchema),z.lazy(() => AddressUpdateWithoutHome_ordersInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutHome_ordersInputSchema) ]).optional(),
}).strict();

export const CustomerUpdateOneRequiredWithoutHome_ordersNestedInputSchema: z.ZodType<Prisma.CustomerUpdateOneRequiredWithoutHome_ordersNestedInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutHome_ordersInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutHome_ordersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutHome_ordersInputSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutHome_ordersInputSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CustomerUpdateToOneWithWhereWithoutHome_ordersInputSchema),z.lazy(() => CustomerUpdateWithoutHome_ordersInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutHome_ordersInputSchema) ]).optional(),
}).strict();

export const CustomerCreateNestedOneWithoutPickup_ordersInputSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutPickup_ordersInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutPickup_ordersInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPickup_ordersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutPickup_ordersInputSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional()
}).strict();

export const OrderCreateNestedOneWithoutPickup_orderInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutPickup_orderInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutPickup_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPickup_orderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutPickup_orderInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional()
}).strict();

export const CustomerUpdateOneWithoutPickup_ordersNestedInputSchema: z.ZodType<Prisma.CustomerUpdateOneWithoutPickup_ordersNestedInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutPickup_ordersInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPickup_ordersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutPickup_ordersInputSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutPickup_ordersInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CustomerUpdateToOneWithWhereWithoutPickup_ordersInputSchema),z.lazy(() => CustomerUpdateWithoutPickup_ordersInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutPickup_ordersInputSchema) ]).optional(),
}).strict();

export const OrderUpdateOneRequiredWithoutPickup_orderNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutPickup_orderNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutPickup_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPickup_orderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutPickup_orderInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutPickup_orderInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutPickup_orderInputSchema),z.lazy(() => OrderUpdateWithoutPickup_orderInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutPickup_orderInputSchema) ]).optional(),
}).strict();

export const CustomerCreateNestedOneWithoutAddressesInputSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutAddressesInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutAddressesInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutAddressesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutAddressesInputSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional()
}).strict();

export const HomeOrderCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderCreateWithoutAddressInputSchema).array(),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HomeOrderCreateOrConnectWithoutAddressInputSchema),z.lazy(() => HomeOrderCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HomeOrderCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HomeOrderUncheckedCreateNestedManyWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderUncheckedCreateNestedManyWithoutAddressInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderCreateWithoutAddressInputSchema).array(),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HomeOrderCreateOrConnectWithoutAddressInputSchema),z.lazy(() => HomeOrderCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HomeOrderCreateManyAddressInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CustomerUpdateOneRequiredWithoutAddressesNestedInputSchema: z.ZodType<Prisma.CustomerUpdateOneRequiredWithoutAddressesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutAddressesInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutAddressesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutAddressesInputSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutAddressesInputSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CustomerUpdateToOneWithWhereWithoutAddressesInputSchema),z.lazy(() => CustomerUpdateWithoutAddressesInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutAddressesInputSchema) ]).optional(),
}).strict();

export const HomeOrderUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.HomeOrderUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderCreateWithoutAddressInputSchema).array(),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HomeOrderCreateOrConnectWithoutAddressInputSchema),z.lazy(() => HomeOrderCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HomeOrderUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => HomeOrderUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HomeOrderCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HomeOrderUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => HomeOrderUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HomeOrderUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => HomeOrderUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HomeOrderScalarWhereInputSchema),z.lazy(() => HomeOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HomeOrderUncheckedUpdateManyWithoutAddressNestedInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateManyWithoutAddressNestedInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderCreateWithoutAddressInputSchema).array(),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HomeOrderCreateOrConnectWithoutAddressInputSchema),z.lazy(() => HomeOrderCreateOrConnectWithoutAddressInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HomeOrderUpsertWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => HomeOrderUpsertWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HomeOrderCreateManyAddressInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HomeOrderUpdateWithWhereUniqueWithoutAddressInputSchema),z.lazy(() => HomeOrderUpdateWithWhereUniqueWithoutAddressInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HomeOrderUpdateManyWithWhereWithoutAddressInputSchema),z.lazy(() => HomeOrderUpdateManyWithWhereWithoutAddressInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HomeOrderScalarWhereInputSchema),z.lazy(() => HomeOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PhoneCreateNestedOneWithoutCustomerInputSchema: z.ZodType<Prisma.PhoneCreateNestedOneWithoutCustomerInput> = z.object({
  create: z.union([ z.lazy(() => PhoneCreateWithoutCustomerInputSchema),z.lazy(() => PhoneUncheckedCreateWithoutCustomerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PhoneCreateOrConnectWithoutCustomerInputSchema).optional(),
  connect: z.lazy(() => PhoneWhereUniqueInputSchema).optional()
}).strict();

export const AddressCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.AddressCreateNestedManyWithoutCustomerInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutCustomerInputSchema),z.lazy(() => AddressCreateWithoutCustomerInputSchema).array(),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AddressCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => AddressCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AddressCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HomeOrderCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderCreateNestedManyWithoutCustomerInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema).array(),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HomeOrderCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => HomeOrderCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HomeOrderCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PickupOrderCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderCreateNestedManyWithoutCustomerInput> = z.object({
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema).array(),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PickupOrderCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => PickupOrderCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PickupOrderCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AddressUncheckedCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.AddressUncheckedCreateNestedManyWithoutCustomerInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutCustomerInputSchema),z.lazy(() => AddressCreateWithoutCustomerInputSchema).array(),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AddressCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => AddressCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AddressCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const HomeOrderUncheckedCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderUncheckedCreateNestedManyWithoutCustomerInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema).array(),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HomeOrderCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => HomeOrderCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HomeOrderCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PickupOrderUncheckedCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderUncheckedCreateNestedManyWithoutCustomerInput> = z.object({
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema).array(),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PickupOrderCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => PickupOrderCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PickupOrderCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PhoneUpdateOneWithoutCustomerNestedInputSchema: z.ZodType<Prisma.PhoneUpdateOneWithoutCustomerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PhoneCreateWithoutCustomerInputSchema),z.lazy(() => PhoneUncheckedCreateWithoutCustomerInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PhoneCreateOrConnectWithoutCustomerInputSchema).optional(),
  upsert: z.lazy(() => PhoneUpsertWithoutCustomerInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PhoneWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PhoneWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PhoneWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PhoneUpdateToOneWithWhereWithoutCustomerInputSchema),z.lazy(() => PhoneUpdateWithoutCustomerInputSchema),z.lazy(() => PhoneUncheckedUpdateWithoutCustomerInputSchema) ]).optional(),
}).strict();

export const AddressUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.AddressUpdateManyWithoutCustomerNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutCustomerInputSchema),z.lazy(() => AddressCreateWithoutCustomerInputSchema).array(),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AddressCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => AddressCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AddressUpsertWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => AddressUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AddressCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AddressUpdateWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => AddressUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AddressUpdateManyWithWhereWithoutCustomerInputSchema),z.lazy(() => AddressUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AddressScalarWhereInputSchema),z.lazy(() => AddressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HomeOrderUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.HomeOrderUpdateManyWithoutCustomerNestedInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema).array(),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HomeOrderCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => HomeOrderCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HomeOrderUpsertWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => HomeOrderUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HomeOrderCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HomeOrderUpdateWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => HomeOrderUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HomeOrderUpdateManyWithWhereWithoutCustomerInputSchema),z.lazy(() => HomeOrderUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HomeOrderScalarWhereInputSchema),z.lazy(() => HomeOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PickupOrderUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.PickupOrderUpdateManyWithoutCustomerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema).array(),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PickupOrderCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => PickupOrderCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PickupOrderUpsertWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => PickupOrderUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PickupOrderCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PickupOrderUpdateWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => PickupOrderUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PickupOrderUpdateManyWithWhereWithoutCustomerInputSchema),z.lazy(() => PickupOrderUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PickupOrderScalarWhereInputSchema),z.lazy(() => PickupOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AddressUncheckedUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyWithoutCustomerNestedInput> = z.object({
  create: z.union([ z.lazy(() => AddressCreateWithoutCustomerInputSchema),z.lazy(() => AddressCreateWithoutCustomerInputSchema).array(),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AddressCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => AddressCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AddressUpsertWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => AddressUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AddressCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AddressWhereUniqueInputSchema),z.lazy(() => AddressWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AddressUpdateWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => AddressUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AddressUpdateManyWithWhereWithoutCustomerInputSchema),z.lazy(() => AddressUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AddressScalarWhereInputSchema),z.lazy(() => AddressScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const HomeOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateManyWithoutCustomerNestedInput> = z.object({
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema).array(),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => HomeOrderCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => HomeOrderCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => HomeOrderUpsertWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => HomeOrderUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => HomeOrderCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => HomeOrderWhereUniqueInputSchema),z.lazy(() => HomeOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => HomeOrderUpdateWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => HomeOrderUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => HomeOrderUpdateManyWithWhereWithoutCustomerInputSchema),z.lazy(() => HomeOrderUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => HomeOrderScalarWhereInputSchema),z.lazy(() => HomeOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PickupOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.PickupOrderUncheckedUpdateManyWithoutCustomerNestedInput> = z.object({
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema).array(),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PickupOrderCreateOrConnectWithoutCustomerInputSchema),z.lazy(() => PickupOrderCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PickupOrderUpsertWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => PickupOrderUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PickupOrderCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PickupOrderWhereUniqueInputSchema),z.lazy(() => PickupOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PickupOrderUpdateWithWhereUniqueWithoutCustomerInputSchema),z.lazy(() => PickupOrderUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PickupOrderUpdateManyWithWhereWithoutCustomerInputSchema),z.lazy(() => PickupOrderUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PickupOrderScalarWhereInputSchema),z.lazy(() => PickupOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CustomerCreateNestedOneWithoutPhoneInputSchema: z.ZodType<Prisma.CustomerCreateNestedOneWithoutPhoneInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPhoneInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutPhoneInputSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional()
}).strict();

export const CustomerUncheckedCreateNestedOneWithoutPhoneInputSchema: z.ZodType<Prisma.CustomerUncheckedCreateNestedOneWithoutPhoneInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPhoneInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutPhoneInputSchema).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional()
}).strict();

export const CustomerUpdateOneWithoutPhoneNestedInputSchema: z.ZodType<Prisma.CustomerUpdateOneWithoutPhoneNestedInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPhoneInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutPhoneInputSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutPhoneInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CustomerUpdateToOneWithWhereWithoutPhoneInputSchema),z.lazy(() => CustomerUpdateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutPhoneInputSchema) ]).optional(),
}).strict();

export const CustomerUncheckedUpdateOneWithoutPhoneNestedInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateOneWithoutPhoneNestedInput> = z.object({
  create: z.union([ z.lazy(() => CustomerCreateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPhoneInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CustomerCreateOrConnectWithoutPhoneInputSchema).optional(),
  upsert: z.lazy(() => CustomerUpsertWithoutPhoneInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CustomerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CustomerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CustomerUpdateToOneWithWhereWithoutPhoneInputSchema),z.lazy(() => CustomerUpdateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutPhoneInputSchema) ]).optional(),
}).strict();

export const OrderCreateNestedOneWithoutPaymentsInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutPaymentsInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutPaymentsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPaymentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutPaymentsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional()
}).strict();

export const EnumPaymentTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPaymentTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => PaymentTypeSchema).optional()
}).strict();

export const OrderUpdateOneRequiredWithoutPaymentsNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutPaymentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutPaymentsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPaymentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutPaymentsInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutPaymentsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutPaymentsInputSchema),z.lazy(() => OrderUpdateWithoutPaymentsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutPaymentsInputSchema) ]).optional(),
}).strict();

export const ProductInOrderCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderCreateWithoutProductInputSchema).array(),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductInOrderCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductInOrderCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductInOrderCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryCreateNestedOneWithoutProductsInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutProductsInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional()
}).strict();

export const ProductInOrderUncheckedCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedCreateNestedManyWithoutProductInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderCreateWithoutProductInputSchema).array(),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductInOrderCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductInOrderCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductInOrderCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumKitchenTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumKitchenTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => KitchenTypeSchema).optional()
}).strict();

export const ProductInOrderUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.ProductInOrderUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderCreateWithoutProductInputSchema).array(),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductInOrderCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductInOrderCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductInOrderUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductInOrderUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductInOrderCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductInOrderUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductInOrderUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductInOrderUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => ProductInOrderUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductInOrderScalarWhereInputSchema),z.lazy(() => ProductInOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryUpdateOneWithoutProductsNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneWithoutProductsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutProductsInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutProductsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutProductsInputSchema),z.lazy(() => CategoryUpdateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutProductsInputSchema) ]).optional(),
}).strict();

export const ProductInOrderUncheckedUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedUpdateManyWithoutProductNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderCreateWithoutProductInputSchema).array(),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductInOrderCreateOrConnectWithoutProductInputSchema),z.lazy(() => ProductInOrderCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductInOrderUpsertWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductInOrderUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductInOrderCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductInOrderWhereUniqueInputSchema),z.lazy(() => ProductInOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductInOrderUpdateWithWhereUniqueWithoutProductInputSchema),z.lazy(() => ProductInOrderUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductInOrderUpdateManyWithWhereWithoutProductInputSchema),z.lazy(() => ProductInOrderUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductInOrderScalarWhereInputSchema),z.lazy(() => ProductInOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OptionInProductOrderCreateNestedManyWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateNestedManyWithoutProduct_in_orderInput> = z.object({
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema).array(),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OptionInProductOrderCreateManyProduct_in_orderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductCreateNestedOneWithoutOrdersInputSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutOrdersInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutOrdersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional()
}).strict();

export const OrderCreateNestedOneWithoutProductsInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutProductsInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutProductsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional()
}).strict();

export const OptionInProductOrderUncheckedCreateNestedManyWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedCreateNestedManyWithoutProduct_in_orderInput> = z.object({
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema).array(),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OptionInProductOrderCreateManyProduct_in_orderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumProductInOrderStateFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumProductInOrderStateFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => ProductInOrderStateSchema).optional()
}).strict();

export const OptionInProductOrderUpdateManyWithoutProduct_in_orderNestedInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateManyWithoutProduct_in_orderNestedInput> = z.object({
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema).array(),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OptionInProductOrderUpsertWithWhereUniqueWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUpsertWithWhereUniqueWithoutProduct_in_orderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OptionInProductOrderCreateManyProduct_in_orderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OptionInProductOrderUpdateWithWhereUniqueWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUpdateWithWhereUniqueWithoutProduct_in_orderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OptionInProductOrderUpdateManyWithWhereWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUpdateManyWithWhereWithoutProduct_in_orderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OptionInProductOrderScalarWhereInputSchema),z.lazy(() => OptionInProductOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductUpdateOneRequiredWithoutOrdersNestedInputSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutOrdersNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutOrdersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrdersInputSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductUpdateToOneWithWhereWithoutOrdersInputSchema),z.lazy(() => ProductUpdateWithoutOrdersInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutOrdersInputSchema) ]).optional(),
}).strict();

export const OrderUpdateOneRequiredWithoutProductsNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutProductsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OrderCreateWithoutProductsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutProductsInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutProductsInputSchema),z.lazy(() => OrderUpdateWithoutProductsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutProductsInputSchema) ]).optional(),
}).strict();

export const OptionInProductOrderUncheckedUpdateManyWithoutProduct_in_orderNestedInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedUpdateManyWithoutProduct_in_orderNestedInput> = z.object({
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema).array(),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OptionInProductOrderUpsertWithWhereUniqueWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUpsertWithWhereUniqueWithoutProduct_in_orderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OptionInProductOrderCreateManyProduct_in_orderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OptionInProductOrderUpdateWithWhereUniqueWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUpdateWithWhereUniqueWithoutProduct_in_orderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OptionInProductOrderUpdateManyWithWhereWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUpdateManyWithWhereWithoutProduct_in_orderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OptionInProductOrderScalarWhereInputSchema),z.lazy(() => OptionInProductOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductCreateWithoutCategoryInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryOnOptionCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema).array(),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryOnOptionCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryOnOptionCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductCreateWithoutCategoryInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryOnOptionUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema).array(),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryOnOptionCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryOnOptionCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProductUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ProductUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductCreateWithoutCategoryInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryOnOptionUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema).array(),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryOnOptionCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryOnOptionUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryOnOptionCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryOnOptionUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryOnOptionUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryOnOptionScalarWhereInputSchema),z.lazy(() => CategoryOnOptionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductCreateWithoutCategoryInputSchema).array(),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ProductCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ProductUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema),z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ProductUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => ProductUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryOnOptionUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema).array(),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryOnOptionCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryOnOptionUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryOnOptionCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryOnOptionUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryOnOptionUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryOnOptionScalarWhereInputSchema),z.lazy(() => CategoryOnOptionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryCreateNestedOneWithoutOptionsInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutOptionsInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutOptionsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutOptionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutOptionsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional()
}).strict();

export const OptionCreateNestedOneWithoutCategoriesInputSchema: z.ZodType<Prisma.OptionCreateNestedOneWithoutCategoriesInput> = z.object({
  create: z.union([ z.lazy(() => OptionCreateWithoutCategoriesInputSchema),z.lazy(() => OptionUncheckedCreateWithoutCategoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OptionCreateOrConnectWithoutCategoriesInputSchema).optional(),
  connect: z.lazy(() => OptionWhereUniqueInputSchema).optional()
}).strict();

export const CategoryUpdateOneRequiredWithoutOptionsNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneRequiredWithoutOptionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutOptionsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutOptionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutOptionsInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutOptionsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutOptionsInputSchema),z.lazy(() => CategoryUpdateWithoutOptionsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutOptionsInputSchema) ]).optional(),
}).strict();

export const OptionUpdateOneRequiredWithoutCategoriesNestedInputSchema: z.ZodType<Prisma.OptionUpdateOneRequiredWithoutCategoriesNestedInput> = z.object({
  create: z.union([ z.lazy(() => OptionCreateWithoutCategoriesInputSchema),z.lazy(() => OptionUncheckedCreateWithoutCategoriesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OptionCreateOrConnectWithoutCategoriesInputSchema).optional(),
  upsert: z.lazy(() => OptionUpsertWithoutCategoriesInputSchema).optional(),
  connect: z.lazy(() => OptionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OptionUpdateToOneWithWhereWithoutCategoriesInputSchema),z.lazy(() => OptionUpdateWithoutCategoriesInputSchema),z.lazy(() => OptionUncheckedUpdateWithoutCategoriesInputSchema) ]).optional(),
}).strict();

export const CategoryOnOptionCreateNestedManyWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateNestedManyWithoutOptionInput> = z.object({
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema).array(),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryOnOptionCreateOrConnectWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionCreateOrConnectWithoutOptionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryOnOptionCreateManyOptionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OptionInProductOrderCreateNestedManyWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateNestedManyWithoutOptionInput> = z.object({
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema).array(),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OptionInProductOrderCreateOrConnectWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderCreateOrConnectWithoutOptionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OptionInProductOrderCreateManyOptionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryOnOptionUncheckedCreateNestedManyWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedCreateNestedManyWithoutOptionInput> = z.object({
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema).array(),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryOnOptionCreateOrConnectWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionCreateOrConnectWithoutOptionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryOnOptionCreateManyOptionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const OptionInProductOrderUncheckedCreateNestedManyWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedCreateNestedManyWithoutOptionInput> = z.object({
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema).array(),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OptionInProductOrderCreateOrConnectWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderCreateOrConnectWithoutOptionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OptionInProductOrderCreateManyOptionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryOnOptionUpdateManyWithoutOptionNestedInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateManyWithoutOptionNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema).array(),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryOnOptionCreateOrConnectWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionCreateOrConnectWithoutOptionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryOnOptionUpsertWithWhereUniqueWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUpsertWithWhereUniqueWithoutOptionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryOnOptionCreateManyOptionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryOnOptionUpdateWithWhereUniqueWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUpdateWithWhereUniqueWithoutOptionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryOnOptionUpdateManyWithWhereWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUpdateManyWithWhereWithoutOptionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryOnOptionScalarWhereInputSchema),z.lazy(() => CategoryOnOptionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OptionInProductOrderUpdateManyWithoutOptionNestedInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateManyWithoutOptionNestedInput> = z.object({
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema).array(),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OptionInProductOrderCreateOrConnectWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderCreateOrConnectWithoutOptionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OptionInProductOrderUpsertWithWhereUniqueWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUpsertWithWhereUniqueWithoutOptionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OptionInProductOrderCreateManyOptionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OptionInProductOrderUpdateWithWhereUniqueWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUpdateWithWhereUniqueWithoutOptionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OptionInProductOrderUpdateManyWithWhereWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUpdateManyWithWhereWithoutOptionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OptionInProductOrderScalarWhereInputSchema),z.lazy(() => OptionInProductOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryOnOptionUncheckedUpdateManyWithoutOptionNestedInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedUpdateManyWithoutOptionNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema).array(),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryOnOptionCreateOrConnectWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionCreateOrConnectWithoutOptionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryOnOptionUpsertWithWhereUniqueWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUpsertWithWhereUniqueWithoutOptionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryOnOptionCreateManyOptionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),z.lazy(() => CategoryOnOptionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryOnOptionUpdateWithWhereUniqueWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUpdateWithWhereUniqueWithoutOptionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryOnOptionUpdateManyWithWhereWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUpdateManyWithWhereWithoutOptionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryOnOptionScalarWhereInputSchema),z.lazy(() => CategoryOnOptionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const OptionInProductOrderUncheckedUpdateManyWithoutOptionNestedInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedUpdateManyWithoutOptionNestedInput> = z.object({
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema).array(),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OptionInProductOrderCreateOrConnectWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderCreateOrConnectWithoutOptionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OptionInProductOrderUpsertWithWhereUniqueWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUpsertWithWhereUniqueWithoutOptionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OptionInProductOrderCreateManyOptionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),z.lazy(() => OptionInProductOrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OptionInProductOrderUpdateWithWhereUniqueWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUpdateWithWhereUniqueWithoutOptionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OptionInProductOrderUpdateManyWithWhereWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUpdateManyWithWhereWithoutOptionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OptionInProductOrderScalarWhereInputSchema),z.lazy(() => OptionInProductOrderScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProductInOrderCreateNestedOneWithoutOptionsInputSchema: z.ZodType<Prisma.ProductInOrderCreateNestedOneWithoutOptionsInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOptionsInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOptionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductInOrderCreateOrConnectWithoutOptionsInputSchema).optional(),
  connect: z.lazy(() => ProductInOrderWhereUniqueInputSchema).optional()
}).strict();

export const OptionCreateNestedOneWithoutProductsInputSchema: z.ZodType<Prisma.OptionCreateNestedOneWithoutProductsInput> = z.object({
  create: z.union([ z.lazy(() => OptionCreateWithoutProductsInputSchema),z.lazy(() => OptionUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OptionCreateOrConnectWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => OptionWhereUniqueInputSchema).optional()
}).strict();

export const ProductInOrderUpdateOneRequiredWithoutOptionsNestedInputSchema: z.ZodType<Prisma.ProductInOrderUpdateOneRequiredWithoutOptionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOptionsInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOptionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductInOrderCreateOrConnectWithoutOptionsInputSchema).optional(),
  upsert: z.lazy(() => ProductInOrderUpsertWithoutOptionsInputSchema).optional(),
  connect: z.lazy(() => ProductInOrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductInOrderUpdateToOneWithWhereWithoutOptionsInputSchema),z.lazy(() => ProductInOrderUpdateWithoutOptionsInputSchema),z.lazy(() => ProductInOrderUncheckedUpdateWithoutOptionsInputSchema) ]).optional(),
}).strict();

export const OptionUpdateOneRequiredWithoutProductsNestedInputSchema: z.ZodType<Prisma.OptionUpdateOneRequiredWithoutProductsNestedInput> = z.object({
  create: z.union([ z.lazy(() => OptionCreateWithoutProductsInputSchema),z.lazy(() => OptionUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OptionCreateOrConnectWithoutProductsInputSchema).optional(),
  upsert: z.lazy(() => OptionUpsertWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => OptionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OptionUpdateToOneWithWhereWithoutProductsInputSchema),z.lazy(() => OptionUpdateWithoutProductsInputSchema),z.lazy(() => OptionUncheckedUpdateWithoutProductsInputSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumOrderStateFilterSchema: z.ZodType<Prisma.NestedEnumOrderStateFilter> = z.object({
  equals: z.lazy(() => OrderStateSchema).optional(),
  in: z.lazy(() => OrderStateSchema).array().optional(),
  notIn: z.lazy(() => OrderStateSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => NestedEnumOrderStateFilterSchema) ]).optional(),
}).strict();

export const NestedEnumOrderTypeFilterSchema: z.ZodType<Prisma.NestedEnumOrderTypeFilter> = z.object({
  equals: z.lazy(() => OrderTypeSchema).optional(),
  in: z.lazy(() => OrderTypeSchema).array().optional(),
  notIn: z.lazy(() => OrderTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => NestedEnumOrderTypeFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumOrderStateWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumOrderStateWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrderStateSchema).optional(),
  in: z.lazy(() => OrderStateSchema).array().optional(),
  notIn: z.lazy(() => OrderStateSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => NestedEnumOrderStateWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderStateFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderStateFilterSchema).optional()
}).strict();

export const NestedEnumOrderTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumOrderTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => OrderTypeSchema).optional(),
  in: z.lazy(() => OrderTypeSchema).array().optional(),
  notIn: z.lazy(() => OrderTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => NestedEnumOrderTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderTypeFilterSchema).optional()
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedEnumPaymentTypeFilterSchema: z.ZodType<Prisma.NestedEnumPaymentTypeFilter> = z.object({
  equals: z.lazy(() => PaymentTypeSchema).optional(),
  in: z.lazy(() => PaymentTypeSchema).array().optional(),
  notIn: z.lazy(() => PaymentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => NestedEnumPaymentTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumPaymentTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPaymentTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => PaymentTypeSchema).optional(),
  in: z.lazy(() => PaymentTypeSchema).array().optional(),
  notIn: z.lazy(() => PaymentTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => NestedEnumPaymentTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentTypeFilterSchema).optional()
}).strict();

export const NestedEnumKitchenTypeFilterSchema: z.ZodType<Prisma.NestedEnumKitchenTypeFilter> = z.object({
  equals: z.lazy(() => KitchenTypeSchema).optional(),
  in: z.lazy(() => KitchenTypeSchema).array().optional(),
  notIn: z.lazy(() => KitchenTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => NestedEnumKitchenTypeFilterSchema) ]).optional(),
}).strict();

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional()
}).strict();

export const NestedEnumKitchenTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumKitchenTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => KitchenTypeSchema).optional(),
  in: z.lazy(() => KitchenTypeSchema).array().optional(),
  notIn: z.lazy(() => KitchenTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => NestedEnumKitchenTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumKitchenTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumKitchenTypeFilterSchema).optional()
}).strict();

export const NestedEnumProductInOrderStateFilterSchema: z.ZodType<Prisma.NestedEnumProductInOrderStateFilter> = z.object({
  equals: z.lazy(() => ProductInOrderStateSchema).optional(),
  in: z.lazy(() => ProductInOrderStateSchema).array().optional(),
  notIn: z.lazy(() => ProductInOrderStateSchema).array().optional(),
  not: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => NestedEnumProductInOrderStateFilterSchema) ]).optional(),
}).strict();

export const NestedEnumProductInOrderStateWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumProductInOrderStateWithAggregatesFilter> = z.object({
  equals: z.lazy(() => ProductInOrderStateSchema).optional(),
  in: z.lazy(() => ProductInOrderStateSchema).array().optional(),
  notIn: z.lazy(() => ProductInOrderStateSchema).array().optional(),
  not: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => NestedEnumProductInOrderStateWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProductInOrderStateFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProductInOrderStateFilterSchema).optional()
}).strict();

export const ProductInOrderCreateWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderCreateWithoutOrderInput> = z.object({
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional(),
  options: z.lazy(() => OptionInProductOrderCreateNestedManyWithoutProduct_in_orderInputSchema).optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutOrdersInputSchema)
}).strict();

export const ProductInOrderUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedCreateWithoutOrderInput> = z.object({
  id: z.number().int().optional(),
  product_id: z.number().int(),
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional(),
  options: z.lazy(() => OptionInProductOrderUncheckedCreateNestedManyWithoutProduct_in_orderInputSchema).optional()
}).strict();

export const ProductInOrderCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderCreateOrConnectWithoutOrderInput> = z.object({
  where: z.lazy(() => ProductInOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const ProductInOrderCreateManyOrderInputEnvelopeSchema: z.ZodType<Prisma.ProductInOrderCreateManyOrderInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductInOrderCreateManyOrderInputSchema),z.lazy(() => ProductInOrderCreateManyOrderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PaymentCreateWithoutOrderInputSchema: z.ZodType<Prisma.PaymentCreateWithoutOrderInput> = z.object({
  amount: z.number().optional(),
  created_at: z.coerce.date().optional(),
  type: z.lazy(() => PaymentTypeSchema)
}).strict();

export const PaymentUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutOrderInput> = z.object({
  id: z.number().int().optional(),
  amount: z.number().optional(),
  created_at: z.coerce.date().optional(),
  type: z.lazy(() => PaymentTypeSchema)
}).strict();

export const PaymentCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutOrderInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const PaymentCreateManyOrderInputEnvelopeSchema: z.ZodType<Prisma.PaymentCreateManyOrderInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PaymentCreateManyOrderInputSchema),z.lazy(() => PaymentCreateManyOrderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const TableOrderCreateWithoutOrderInputSchema: z.ZodType<Prisma.TableOrderCreateWithoutOrderInput> = z.object({
  table: z.string(),
  res_name: z.string().optional().nullable(),
  people: z.number().int()
}).strict();

export const TableOrderUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.TableOrderUncheckedCreateWithoutOrderInput> = z.object({
  id: z.number().int().optional(),
  table: z.string(),
  res_name: z.string().optional().nullable(),
  people: z.number().int()
}).strict();

export const TableOrderCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.TableOrderCreateOrConnectWithoutOrderInput> = z.object({
  where: z.lazy(() => TableOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TableOrderCreateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const HomeOrderCreateWithoutOrderInputSchema: z.ZodType<Prisma.HomeOrderCreateWithoutOrderInput> = z.object({
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  address: z.lazy(() => AddressCreateNestedOneWithoutHome_ordersInputSchema),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutHome_ordersInputSchema)
}).strict();

export const HomeOrderUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.HomeOrderUncheckedCreateWithoutOrderInput> = z.object({
  id: z.number().int().optional(),
  address_id: z.number().int(),
  customer_id: z.number().int(),
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable()
}).strict();

export const HomeOrderCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.HomeOrderCreateOrConnectWithoutOrderInput> = z.object({
  where: z.lazy(() => HomeOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const PickupOrderCreateWithoutOrderInputSchema: z.ZodType<Prisma.PickupOrderCreateWithoutOrderInput> = z.object({
  when: z.string().optional().nullable(),
  name: z.string(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutPickup_ordersInputSchema).optional()
}).strict();

export const PickupOrderUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.PickupOrderUncheckedCreateWithoutOrderInput> = z.object({
  id: z.number().int().optional(),
  customer_id: z.number().int().optional().nullable(),
  when: z.string().optional().nullable(),
  name: z.string()
}).strict();

export const PickupOrderCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.PickupOrderCreateOrConnectWithoutOrderInput> = z.object({
  where: z.lazy(() => PickupOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const ProductInOrderUpsertWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderUpsertWithWhereUniqueWithoutOrderInput> = z.object({
  where: z.lazy(() => ProductInOrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductInOrderUpdateWithoutOrderInputSchema),z.lazy(() => ProductInOrderUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOrderInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const ProductInOrderUpdateWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderUpdateWithWhereUniqueWithoutOrderInput> = z.object({
  where: z.lazy(() => ProductInOrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductInOrderUpdateWithoutOrderInputSchema),z.lazy(() => ProductInOrderUncheckedUpdateWithoutOrderInputSchema) ]),
}).strict();

export const ProductInOrderUpdateManyWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderUpdateManyWithWhereWithoutOrderInput> = z.object({
  where: z.lazy(() => ProductInOrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductInOrderUpdateManyMutationInputSchema),z.lazy(() => ProductInOrderUncheckedUpdateManyWithoutOrderInputSchema) ]),
}).strict();

export const ProductInOrderScalarWhereInputSchema: z.ZodType<Prisma.ProductInOrderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductInOrderScalarWhereInputSchema),z.lazy(() => ProductInOrderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductInOrderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductInOrderScalarWhereInputSchema),z.lazy(() => ProductInOrderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  product_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  total: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  is_paid_fully: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  paid_quantity: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  rice_quantity: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  printed_amount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  state: z.union([ z.lazy(() => EnumProductInOrderStateFilterSchema),z.lazy(() => ProductInOrderStateSchema) ]).optional(),
}).strict();

export const PaymentUpsertWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUpsertWithWhereUniqueWithoutOrderInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PaymentUpdateWithoutOrderInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema),z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema) ]),
}).strict();

export const PaymentUpdateWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUpdateWithWhereUniqueWithoutOrderInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PaymentUpdateWithoutOrderInputSchema),z.lazy(() => PaymentUncheckedUpdateWithoutOrderInputSchema) ]),
}).strict();

export const PaymentUpdateManyWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUpdateManyWithWhereWithoutOrderInput> = z.object({
  where: z.lazy(() => PaymentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PaymentUpdateManyMutationInputSchema),z.lazy(() => PaymentUncheckedUpdateManyWithoutOrderInputSchema) ]),
}).strict();

export const PaymentScalarWhereInputSchema: z.ZodType<Prisma.PaymentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentScalarWhereInputSchema),z.lazy(() => PaymentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  amount: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  type: z.union([ z.lazy(() => EnumPaymentTypeFilterSchema),z.lazy(() => PaymentTypeSchema) ]).optional(),
}).strict();

export const TableOrderUpsertWithoutOrderInputSchema: z.ZodType<Prisma.TableOrderUpsertWithoutOrderInput> = z.object({
  update: z.union([ z.lazy(() => TableOrderUpdateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => TableOrderCreateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedCreateWithoutOrderInputSchema) ]),
  where: z.lazy(() => TableOrderWhereInputSchema).optional()
}).strict();

export const TableOrderUpdateToOneWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.TableOrderUpdateToOneWithWhereWithoutOrderInput> = z.object({
  where: z.lazy(() => TableOrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TableOrderUpdateWithoutOrderInputSchema),z.lazy(() => TableOrderUncheckedUpdateWithoutOrderInputSchema) ]),
}).strict();

export const TableOrderUpdateWithoutOrderInputSchema: z.ZodType<Prisma.TableOrderUpdateWithoutOrderInput> = z.object({
  table: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  res_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  people: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TableOrderUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.TableOrderUncheckedUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  table: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  res_name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  people: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HomeOrderUpsertWithoutOrderInputSchema: z.ZodType<Prisma.HomeOrderUpsertWithoutOrderInput> = z.object({
  update: z.union([ z.lazy(() => HomeOrderUpdateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutOrderInputSchema) ]),
  where: z.lazy(() => HomeOrderWhereInputSchema).optional()
}).strict();

export const HomeOrderUpdateToOneWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.HomeOrderUpdateToOneWithWhereWithoutOrderInput> = z.object({
  where: z.lazy(() => HomeOrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => HomeOrderUpdateWithoutOrderInputSchema),z.lazy(() => HomeOrderUncheckedUpdateWithoutOrderInputSchema) ]),
}).strict();

export const HomeOrderUpdateWithoutOrderInputSchema: z.ZodType<Prisma.HomeOrderUpdateWithoutOrderInput> = z.object({
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  address: z.lazy(() => AddressUpdateOneRequiredWithoutHome_ordersNestedInputSchema).optional(),
  customer: z.lazy(() => CustomerUpdateOneRequiredWithoutHome_ordersNestedInputSchema).optional()
}).strict();

export const HomeOrderUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  address_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickupOrderUpsertWithoutOrderInputSchema: z.ZodType<Prisma.PickupOrderUpsertWithoutOrderInput> = z.object({
  update: z.union([ z.lazy(() => PickupOrderUpdateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutOrderInputSchema) ]),
  where: z.lazy(() => PickupOrderWhereInputSchema).optional()
}).strict();

export const PickupOrderUpdateToOneWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.PickupOrderUpdateToOneWithWhereWithoutOrderInput> = z.object({
  where: z.lazy(() => PickupOrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PickupOrderUpdateWithoutOrderInputSchema),z.lazy(() => PickupOrderUncheckedUpdateWithoutOrderInputSchema) ]),
}).strict();

export const PickupOrderUpdateWithoutOrderInputSchema: z.ZodType<Prisma.PickupOrderUpdateWithoutOrderInput> = z.object({
  when: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => CustomerUpdateOneWithoutPickup_ordersNestedInputSchema).optional()
}).strict();

export const PickupOrderUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.PickupOrderUncheckedUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  when: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderCreateWithoutTable_orderInputSchema: z.ZodType<Prisma.OrderCreateWithoutTable_orderInput> = z.object({
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderCreateNestedManyWithoutOrderInputSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderUncheckedCreateWithoutTable_orderInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutTable_orderInput> = z.object({
  id: z.number().int().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutTable_orderInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutTable_orderInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutTable_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTable_orderInputSchema) ]),
}).strict();

export const OrderUpsertWithoutTable_orderInputSchema: z.ZodType<Prisma.OrderUpsertWithoutTable_orderInput> = z.object({
  update: z.union([ z.lazy(() => OrderUpdateWithoutTable_orderInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutTable_orderInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutTable_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutTable_orderInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const OrderUpdateToOneWithWhereWithoutTable_orderInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutTable_orderInput> = z.object({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutTable_orderInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutTable_orderInputSchema) ]),
}).strict();

export const OrderUpdateWithoutTable_orderInputSchema: z.ZodType<Prisma.OrderUpdateWithoutTable_orderInput> = z.object({
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUpdateManyWithoutOrderNestedInputSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutTable_orderInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutTable_orderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderCreateWithoutHome_orderInputSchema: z.ZodType<Prisma.OrderCreateWithoutHome_orderInput> = z.object({
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderCreateNestedManyWithoutOrderInputSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderUncheckedCreateWithoutHome_orderInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutHome_orderInput> = z.object({
  id: z.number().int().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutHome_orderInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutHome_orderInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutHome_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutHome_orderInputSchema) ]),
}).strict();

export const AddressCreateWithoutHome_ordersInputSchema: z.ZodType<Prisma.AddressCreateWithoutHome_ordersInput> = z.object({
  street: z.string(),
  civic: z.string(),
  doorbell: z.string(),
  floor: z.string().optional().nullable(),
  stair: z.string().optional().nullable(),
  street_info: z.string().optional().nullable(),
  active: z.boolean().optional(),
  temporary: z.boolean().optional(),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutAddressesInputSchema)
}).strict();

export const AddressUncheckedCreateWithoutHome_ordersInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutHome_ordersInput> = z.object({
  id: z.number().int().optional(),
  customer_id: z.number().int(),
  street: z.string(),
  civic: z.string(),
  doorbell: z.string(),
  floor: z.string().optional().nullable(),
  stair: z.string().optional().nullable(),
  street_info: z.string().optional().nullable(),
  active: z.boolean().optional(),
  temporary: z.boolean().optional()
}).strict();

export const AddressCreateOrConnectWithoutHome_ordersInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutHome_ordersInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutHome_ordersInputSchema),z.lazy(() => AddressUncheckedCreateWithoutHome_ordersInputSchema) ]),
}).strict();

export const CustomerCreateWithoutHome_ordersInputSchema: z.ZodType<Prisma.CustomerCreateWithoutHome_ordersInput> = z.object({
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  phone: z.lazy(() => PhoneCreateNestedOneWithoutCustomerInputSchema).optional(),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutCustomerInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerUncheckedCreateWithoutHome_ordersInputSchema: z.ZodType<Prisma.CustomerUncheckedCreateWithoutHome_ordersInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  phone_id: z.number().int().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUncheckedCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerCreateOrConnectWithoutHome_ordersInputSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutHome_ordersInput> = z.object({
  where: z.lazy(() => CustomerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CustomerCreateWithoutHome_ordersInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutHome_ordersInputSchema) ]),
}).strict();

export const OrderUpsertWithoutHome_orderInputSchema: z.ZodType<Prisma.OrderUpsertWithoutHome_orderInput> = z.object({
  update: z.union([ z.lazy(() => OrderUpdateWithoutHome_orderInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutHome_orderInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutHome_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutHome_orderInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const OrderUpdateToOneWithWhereWithoutHome_orderInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutHome_orderInput> = z.object({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutHome_orderInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutHome_orderInputSchema) ]),
}).strict();

export const OrderUpdateWithoutHome_orderInputSchema: z.ZodType<Prisma.OrderUpdateWithoutHome_orderInput> = z.object({
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUpdateManyWithoutOrderNestedInputSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutHome_orderInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutHome_orderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const AddressUpsertWithoutHome_ordersInputSchema: z.ZodType<Prisma.AddressUpsertWithoutHome_ordersInput> = z.object({
  update: z.union([ z.lazy(() => AddressUpdateWithoutHome_ordersInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutHome_ordersInputSchema) ]),
  create: z.union([ z.lazy(() => AddressCreateWithoutHome_ordersInputSchema),z.lazy(() => AddressUncheckedCreateWithoutHome_ordersInputSchema) ]),
  where: z.lazy(() => AddressWhereInputSchema).optional()
}).strict();

export const AddressUpdateToOneWithWhereWithoutHome_ordersInputSchema: z.ZodType<Prisma.AddressUpdateToOneWithWhereWithoutHome_ordersInput> = z.object({
  where: z.lazy(() => AddressWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AddressUpdateWithoutHome_ordersInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutHome_ordersInputSchema) ]),
}).strict();

export const AddressUpdateWithoutHome_ordersInputSchema: z.ZodType<Prisma.AddressUpdateWithoutHome_ordersInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  civic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doorbell: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  street_info: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  temporary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => CustomerUpdateOneRequiredWithoutAddressesNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutHome_ordersInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutHome_ordersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  civic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doorbell: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  street_info: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  temporary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CustomerUpsertWithoutHome_ordersInputSchema: z.ZodType<Prisma.CustomerUpsertWithoutHome_ordersInput> = z.object({
  update: z.union([ z.lazy(() => CustomerUpdateWithoutHome_ordersInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutHome_ordersInputSchema) ]),
  create: z.union([ z.lazy(() => CustomerCreateWithoutHome_ordersInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutHome_ordersInputSchema) ]),
  where: z.lazy(() => CustomerWhereInputSchema).optional()
}).strict();

export const CustomerUpdateToOneWithWhereWithoutHome_ordersInputSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutHome_ordersInput> = z.object({
  where: z.lazy(() => CustomerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CustomerUpdateWithoutHome_ordersInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutHome_ordersInputSchema) ]),
}).strict();

export const CustomerUpdateWithoutHome_ordersInputSchema: z.ZodType<Prisma.CustomerUpdateWithoutHome_ordersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.lazy(() => PhoneUpdateOneWithoutCustomerNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutCustomerNestedInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const CustomerUncheckedUpdateWithoutHome_ordersInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateWithoutHome_ordersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  phone_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const CustomerCreateWithoutPickup_ordersInputSchema: z.ZodType<Prisma.CustomerCreateWithoutPickup_ordersInput> = z.object({
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  phone: z.lazy(() => PhoneCreateNestedOneWithoutCustomerInputSchema).optional(),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutCustomerInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerUncheckedCreateWithoutPickup_ordersInputSchema: z.ZodType<Prisma.CustomerUncheckedCreateWithoutPickup_ordersInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  phone_id: z.number().int().optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerCreateOrConnectWithoutPickup_ordersInputSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutPickup_ordersInput> = z.object({
  where: z.lazy(() => CustomerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CustomerCreateWithoutPickup_ordersInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPickup_ordersInputSchema) ]),
}).strict();

export const OrderCreateWithoutPickup_orderInputSchema: z.ZodType<Prisma.OrderCreateWithoutPickup_orderInput> = z.object({
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderCreateNestedManyWithoutOrderInputSchema).optional(),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderCreateNestedOneWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderUncheckedCreateWithoutPickup_orderInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutPickup_orderInput> = z.object({
  id: z.number().int().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutPickup_orderInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutPickup_orderInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutPickup_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPickup_orderInputSchema) ]),
}).strict();

export const CustomerUpsertWithoutPickup_ordersInputSchema: z.ZodType<Prisma.CustomerUpsertWithoutPickup_ordersInput> = z.object({
  update: z.union([ z.lazy(() => CustomerUpdateWithoutPickup_ordersInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutPickup_ordersInputSchema) ]),
  create: z.union([ z.lazy(() => CustomerCreateWithoutPickup_ordersInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPickup_ordersInputSchema) ]),
  where: z.lazy(() => CustomerWhereInputSchema).optional()
}).strict();

export const CustomerUpdateToOneWithWhereWithoutPickup_ordersInputSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutPickup_ordersInput> = z.object({
  where: z.lazy(() => CustomerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CustomerUpdateWithoutPickup_ordersInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutPickup_ordersInputSchema) ]),
}).strict();

export const CustomerUpdateWithoutPickup_ordersInputSchema: z.ZodType<Prisma.CustomerUpdateWithoutPickup_ordersInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.lazy(() => PhoneUpdateOneWithoutCustomerNestedInputSchema).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutCustomerNestedInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const CustomerUncheckedUpdateWithoutPickup_ordersInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateWithoutPickup_ordersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  phone_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const OrderUpsertWithoutPickup_orderInputSchema: z.ZodType<Prisma.OrderUpsertWithoutPickup_orderInput> = z.object({
  update: z.union([ z.lazy(() => OrderUpdateWithoutPickup_orderInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutPickup_orderInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutPickup_orderInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPickup_orderInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const OrderUpdateToOneWithWhereWithoutPickup_orderInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutPickup_orderInput> = z.object({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutPickup_orderInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutPickup_orderInputSchema) ]),
}).strict();

export const OrderUpdateWithoutPickup_orderInputSchema: z.ZodType<Prisma.OrderUpdateWithoutPickup_orderInput> = z.object({
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUpdateManyWithoutOrderNestedInputSchema).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUpdateOneWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutPickup_orderInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutPickup_orderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const CustomerCreateWithoutAddressesInputSchema: z.ZodType<Prisma.CustomerCreateWithoutAddressesInput> = z.object({
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  phone: z.lazy(() => PhoneCreateNestedOneWithoutCustomerInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderCreateNestedManyWithoutCustomerInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerUncheckedCreateWithoutAddressesInputSchema: z.ZodType<Prisma.CustomerUncheckedCreateWithoutAddressesInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  phone_id: z.number().int().optional().nullable(),
  home_orders: z.lazy(() => HomeOrderUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUncheckedCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerCreateOrConnectWithoutAddressesInputSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutAddressesInput> = z.object({
  where: z.lazy(() => CustomerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CustomerCreateWithoutAddressesInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutAddressesInputSchema) ]),
}).strict();

export const HomeOrderCreateWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderCreateWithoutAddressInput> = z.object({
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  order: z.lazy(() => OrderCreateNestedOneWithoutHome_orderInputSchema),
  customer: z.lazy(() => CustomerCreateNestedOneWithoutHome_ordersInputSchema)
}).strict();

export const HomeOrderUncheckedCreateWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderUncheckedCreateWithoutAddressInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  customer_id: z.number().int(),
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable()
}).strict();

export const HomeOrderCreateOrConnectWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderCreateOrConnectWithoutAddressInput> = z.object({
  where: z.lazy(() => HomeOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const HomeOrderCreateManyAddressInputEnvelopeSchema: z.ZodType<Prisma.HomeOrderCreateManyAddressInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => HomeOrderCreateManyAddressInputSchema),z.lazy(() => HomeOrderCreateManyAddressInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CustomerUpsertWithoutAddressesInputSchema: z.ZodType<Prisma.CustomerUpsertWithoutAddressesInput> = z.object({
  update: z.union([ z.lazy(() => CustomerUpdateWithoutAddressesInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutAddressesInputSchema) ]),
  create: z.union([ z.lazy(() => CustomerCreateWithoutAddressesInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutAddressesInputSchema) ]),
  where: z.lazy(() => CustomerWhereInputSchema).optional()
}).strict();

export const CustomerUpdateToOneWithWhereWithoutAddressesInputSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutAddressesInput> = z.object({
  where: z.lazy(() => CustomerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CustomerUpdateWithoutAddressesInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutAddressesInputSchema) ]),
}).strict();

export const CustomerUpdateWithoutAddressesInputSchema: z.ZodType<Prisma.CustomerUpdateWithoutAddressesInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.lazy(() => PhoneUpdateOneWithoutCustomerNestedInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUpdateManyWithoutCustomerNestedInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const CustomerUncheckedUpdateWithoutAddressesInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateWithoutAddressesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  phone_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_orders: z.lazy(() => HomeOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const HomeOrderUpsertWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderUpsertWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => HomeOrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => HomeOrderUpdateWithoutAddressInputSchema),z.lazy(() => HomeOrderUncheckedUpdateWithoutAddressInputSchema) ]),
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutAddressInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutAddressInputSchema) ]),
}).strict();

export const HomeOrderUpdateWithWhereUniqueWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderUpdateWithWhereUniqueWithoutAddressInput> = z.object({
  where: z.lazy(() => HomeOrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => HomeOrderUpdateWithoutAddressInputSchema),z.lazy(() => HomeOrderUncheckedUpdateWithoutAddressInputSchema) ]),
}).strict();

export const HomeOrderUpdateManyWithWhereWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderUpdateManyWithWhereWithoutAddressInput> = z.object({
  where: z.lazy(() => HomeOrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => HomeOrderUpdateManyMutationInputSchema),z.lazy(() => HomeOrderUncheckedUpdateManyWithoutAddressInputSchema) ]),
}).strict();

export const HomeOrderScalarWhereInputSchema: z.ZodType<Prisma.HomeOrderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => HomeOrderScalarWhereInputSchema),z.lazy(() => HomeOrderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => HomeOrderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => HomeOrderScalarWhereInputSchema),z.lazy(() => HomeOrderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  address_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  when: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  notes: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  contact_phone: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const PhoneCreateWithoutCustomerInputSchema: z.ZodType<Prisma.PhoneCreateWithoutCustomerInput> = z.object({
  phone: z.string()
}).strict();

export const PhoneUncheckedCreateWithoutCustomerInputSchema: z.ZodType<Prisma.PhoneUncheckedCreateWithoutCustomerInput> = z.object({
  id: z.number().int().optional(),
  phone: z.string()
}).strict();

export const PhoneCreateOrConnectWithoutCustomerInputSchema: z.ZodType<Prisma.PhoneCreateOrConnectWithoutCustomerInput> = z.object({
  where: z.lazy(() => PhoneWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PhoneCreateWithoutCustomerInputSchema),z.lazy(() => PhoneUncheckedCreateWithoutCustomerInputSchema) ]),
}).strict();

export const AddressCreateWithoutCustomerInputSchema: z.ZodType<Prisma.AddressCreateWithoutCustomerInput> = z.object({
  street: z.string(),
  civic: z.string(),
  doorbell: z.string(),
  floor: z.string().optional().nullable(),
  stair: z.string().optional().nullable(),
  street_info: z.string().optional().nullable(),
  active: z.boolean().optional(),
  temporary: z.boolean().optional(),
  home_orders: z.lazy(() => HomeOrderCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressUncheckedCreateWithoutCustomerInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutCustomerInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  civic: z.string(),
  doorbell: z.string(),
  floor: z.string().optional().nullable(),
  stair: z.string().optional().nullable(),
  street_info: z.string().optional().nullable(),
  active: z.boolean().optional(),
  temporary: z.boolean().optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedCreateNestedManyWithoutAddressInputSchema).optional()
}).strict();

export const AddressCreateOrConnectWithoutCustomerInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutCustomerInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutCustomerInputSchema),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema) ]),
}).strict();

export const AddressCreateManyCustomerInputEnvelopeSchema: z.ZodType<Prisma.AddressCreateManyCustomerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AddressCreateManyCustomerInputSchema),z.lazy(() => AddressCreateManyCustomerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const HomeOrderCreateWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderCreateWithoutCustomerInput> = z.object({
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  order: z.lazy(() => OrderCreateNestedOneWithoutHome_orderInputSchema),
  address: z.lazy(() => AddressCreateNestedOneWithoutHome_ordersInputSchema)
}).strict();

export const HomeOrderUncheckedCreateWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderUncheckedCreateWithoutCustomerInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  address_id: z.number().int(),
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable()
}).strict();

export const HomeOrderCreateOrConnectWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderCreateOrConnectWithoutCustomerInput> = z.object({
  where: z.lazy(() => HomeOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema) ]),
}).strict();

export const HomeOrderCreateManyCustomerInputEnvelopeSchema: z.ZodType<Prisma.HomeOrderCreateManyCustomerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => HomeOrderCreateManyCustomerInputSchema),z.lazy(() => HomeOrderCreateManyCustomerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PickupOrderCreateWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderCreateWithoutCustomerInput> = z.object({
  when: z.string().optional().nullable(),
  name: z.string(),
  order: z.lazy(() => OrderCreateNestedOneWithoutPickup_orderInputSchema)
}).strict();

export const PickupOrderUncheckedCreateWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderUncheckedCreateWithoutCustomerInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  when: z.string().optional().nullable(),
  name: z.string()
}).strict();

export const PickupOrderCreateOrConnectWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderCreateOrConnectWithoutCustomerInput> = z.object({
  where: z.lazy(() => PickupOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema) ]),
}).strict();

export const PickupOrderCreateManyCustomerInputEnvelopeSchema: z.ZodType<Prisma.PickupOrderCreateManyCustomerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PickupOrderCreateManyCustomerInputSchema),z.lazy(() => PickupOrderCreateManyCustomerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PhoneUpsertWithoutCustomerInputSchema: z.ZodType<Prisma.PhoneUpsertWithoutCustomerInput> = z.object({
  update: z.union([ z.lazy(() => PhoneUpdateWithoutCustomerInputSchema),z.lazy(() => PhoneUncheckedUpdateWithoutCustomerInputSchema) ]),
  create: z.union([ z.lazy(() => PhoneCreateWithoutCustomerInputSchema),z.lazy(() => PhoneUncheckedCreateWithoutCustomerInputSchema) ]),
  where: z.lazy(() => PhoneWhereInputSchema).optional()
}).strict();

export const PhoneUpdateToOneWithWhereWithoutCustomerInputSchema: z.ZodType<Prisma.PhoneUpdateToOneWithWhereWithoutCustomerInput> = z.object({
  where: z.lazy(() => PhoneWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PhoneUpdateWithoutCustomerInputSchema),z.lazy(() => PhoneUncheckedUpdateWithoutCustomerInputSchema) ]),
}).strict();

export const PhoneUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.PhoneUpdateWithoutCustomerInput> = z.object({
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PhoneUncheckedUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.PhoneUncheckedUpdateWithoutCustomerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AddressUpsertWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.AddressUpsertWithWhereUniqueWithoutCustomerInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AddressUpdateWithoutCustomerInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutCustomerInputSchema) ]),
  create: z.union([ z.lazy(() => AddressCreateWithoutCustomerInputSchema),z.lazy(() => AddressUncheckedCreateWithoutCustomerInputSchema) ]),
}).strict();

export const AddressUpdateWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.AddressUpdateWithWhereUniqueWithoutCustomerInput> = z.object({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AddressUpdateWithoutCustomerInputSchema),z.lazy(() => AddressUncheckedUpdateWithoutCustomerInputSchema) ]),
}).strict();

export const AddressUpdateManyWithWhereWithoutCustomerInputSchema: z.ZodType<Prisma.AddressUpdateManyWithWhereWithoutCustomerInput> = z.object({
  where: z.lazy(() => AddressScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AddressUpdateManyMutationInputSchema),z.lazy(() => AddressUncheckedUpdateManyWithoutCustomerInputSchema) ]),
}).strict();

export const AddressScalarWhereInputSchema: z.ZodType<Prisma.AddressScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AddressScalarWhereInputSchema),z.lazy(() => AddressScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressScalarWhereInputSchema),z.lazy(() => AddressScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  civic: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  doorbell: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  floor: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  stair: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  street_info: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  temporary: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
}).strict();

export const HomeOrderUpsertWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderUpsertWithWhereUniqueWithoutCustomerInput> = z.object({
  where: z.lazy(() => HomeOrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => HomeOrderUpdateWithoutCustomerInputSchema),z.lazy(() => HomeOrderUncheckedUpdateWithoutCustomerInputSchema) ]),
  create: z.union([ z.lazy(() => HomeOrderCreateWithoutCustomerInputSchema),z.lazy(() => HomeOrderUncheckedCreateWithoutCustomerInputSchema) ]),
}).strict();

export const HomeOrderUpdateWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderUpdateWithWhereUniqueWithoutCustomerInput> = z.object({
  where: z.lazy(() => HomeOrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => HomeOrderUpdateWithoutCustomerInputSchema),z.lazy(() => HomeOrderUncheckedUpdateWithoutCustomerInputSchema) ]),
}).strict();

export const HomeOrderUpdateManyWithWhereWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderUpdateManyWithWhereWithoutCustomerInput> = z.object({
  where: z.lazy(() => HomeOrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => HomeOrderUpdateManyMutationInputSchema),z.lazy(() => HomeOrderUncheckedUpdateManyWithoutCustomerInputSchema) ]),
}).strict();

export const PickupOrderUpsertWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderUpsertWithWhereUniqueWithoutCustomerInput> = z.object({
  where: z.lazy(() => PickupOrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PickupOrderUpdateWithoutCustomerInputSchema),z.lazy(() => PickupOrderUncheckedUpdateWithoutCustomerInputSchema) ]),
  create: z.union([ z.lazy(() => PickupOrderCreateWithoutCustomerInputSchema),z.lazy(() => PickupOrderUncheckedCreateWithoutCustomerInputSchema) ]),
}).strict();

export const PickupOrderUpdateWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderUpdateWithWhereUniqueWithoutCustomerInput> = z.object({
  where: z.lazy(() => PickupOrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PickupOrderUpdateWithoutCustomerInputSchema),z.lazy(() => PickupOrderUncheckedUpdateWithoutCustomerInputSchema) ]),
}).strict();

export const PickupOrderUpdateManyWithWhereWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderUpdateManyWithWhereWithoutCustomerInput> = z.object({
  where: z.lazy(() => PickupOrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PickupOrderUpdateManyMutationInputSchema),z.lazy(() => PickupOrderUncheckedUpdateManyWithoutCustomerInputSchema) ]),
}).strict();

export const PickupOrderScalarWhereInputSchema: z.ZodType<Prisma.PickupOrderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PickupOrderScalarWhereInputSchema),z.lazy(() => PickupOrderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PickupOrderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PickupOrderScalarWhereInputSchema),z.lazy(() => PickupOrderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  customer_id: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  when: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CustomerCreateWithoutPhoneInputSchema: z.ZodType<Prisma.CustomerCreateWithoutPhoneInput> = z.object({
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  addresses: z.lazy(() => AddressCreateNestedManyWithoutCustomerInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderCreateNestedManyWithoutCustomerInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerUncheckedCreateWithoutPhoneInputSchema: z.ZodType<Prisma.CustomerUncheckedCreateWithoutPhoneInput> = z.object({
  id: z.number().int().optional(),
  name: z.string().optional().nullable(),
  surname: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  preferences: z.string().optional().nullable(),
  active: z.boolean().optional(),
  addresses: z.lazy(() => AddressUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUncheckedCreateNestedManyWithoutCustomerInputSchema).optional()
}).strict();

export const CustomerCreateOrConnectWithoutPhoneInputSchema: z.ZodType<Prisma.CustomerCreateOrConnectWithoutPhoneInput> = z.object({
  where: z.lazy(() => CustomerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CustomerCreateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPhoneInputSchema) ]),
}).strict();

export const CustomerUpsertWithoutPhoneInputSchema: z.ZodType<Prisma.CustomerUpsertWithoutPhoneInput> = z.object({
  update: z.union([ z.lazy(() => CustomerUpdateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutPhoneInputSchema) ]),
  create: z.union([ z.lazy(() => CustomerCreateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedCreateWithoutPhoneInputSchema) ]),
  where: z.lazy(() => CustomerWhereInputSchema).optional()
}).strict();

export const CustomerUpdateToOneWithWhereWithoutPhoneInputSchema: z.ZodType<Prisma.CustomerUpdateToOneWithWhereWithoutPhoneInput> = z.object({
  where: z.lazy(() => CustomerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CustomerUpdateWithoutPhoneInputSchema),z.lazy(() => CustomerUncheckedUpdateWithoutPhoneInputSchema) ]),
}).strict();

export const CustomerUpdateWithoutPhoneInputSchema: z.ZodType<Prisma.CustomerUpdateWithoutPhoneInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  addresses: z.lazy(() => AddressUpdateManyWithoutCustomerNestedInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUpdateManyWithoutCustomerNestedInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const CustomerUncheckedUpdateWithoutPhoneInputSchema: z.ZodType<Prisma.CustomerUncheckedUpdateWithoutPhoneInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  surname: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  preferences: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  addresses: z.lazy(() => AddressUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  pickup_orders: z.lazy(() => PickupOrderUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional()
}).strict();

export const OrderCreateWithoutPaymentsInputSchema: z.ZodType<Prisma.OrderCreateWithoutPaymentsInput> = z.object({
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderCreateNestedOneWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderUncheckedCreateWithoutPaymentsInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutPaymentsInput> = z.object({
  id: z.number().int().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  products: z.lazy(() => ProductInOrderUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutPaymentsInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutPaymentsInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutPaymentsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPaymentsInputSchema) ]),
}).strict();

export const OrderUpsertWithoutPaymentsInputSchema: z.ZodType<Prisma.OrderUpsertWithoutPaymentsInput> = z.object({
  update: z.union([ z.lazy(() => OrderUpdateWithoutPaymentsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutPaymentsInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutPaymentsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutPaymentsInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const OrderUpdateToOneWithWhereWithoutPaymentsInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutPaymentsInput> = z.object({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutPaymentsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutPaymentsInputSchema) ]),
}).strict();

export const OrderUpdateWithoutPaymentsInputSchema: z.ZodType<Prisma.OrderUpdateWithoutPaymentsInput> = z.object({
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUpdateOneWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutPaymentsInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutPaymentsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductInOrderUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const ProductInOrderCreateWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderCreateWithoutProductInput> = z.object({
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional(),
  options: z.lazy(() => OptionInProductOrderCreateNestedManyWithoutProduct_in_orderInputSchema).optional(),
  order: z.lazy(() => OrderCreateNestedOneWithoutProductsInputSchema)
}).strict();

export const ProductInOrderUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedCreateWithoutProductInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional(),
  options: z.lazy(() => OptionInProductOrderUncheckedCreateNestedManyWithoutProduct_in_orderInputSchema).optional()
}).strict();

export const ProductInOrderCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderCreateOrConnectWithoutProductInput> = z.object({
  where: z.lazy(() => ProductInOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const ProductInOrderCreateManyProductInputEnvelopeSchema: z.ZodType<Prisma.ProductInOrderCreateManyProductInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductInOrderCreateManyProductInputSchema),z.lazy(() => ProductInOrderCreateManyProductInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CategoryCreateWithoutProductsInputSchema: z.ZodType<Prisma.CategoryCreateWithoutProductsInput> = z.object({
  category: z.string(),
  active: z.boolean().optional(),
  options: z.lazy(() => CategoryOnOptionCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutProductsInput> = z.object({
  id: z.number().int().optional(),
  category: z.string(),
  active: z.boolean().optional(),
  options: z.lazy(() => CategoryOnOptionUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryCreateOrConnectWithoutProductsInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutProductsInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutProductsInputSchema) ]),
}).strict();

export const ProductInOrderUpsertWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderUpsertWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => ProductInOrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductInOrderUpdateWithoutProductInputSchema),z.lazy(() => ProductInOrderUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutProductInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutProductInputSchema) ]),
}).strict();

export const ProductInOrderUpdateWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderUpdateWithWhereUniqueWithoutProductInput> = z.object({
  where: z.lazy(() => ProductInOrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductInOrderUpdateWithoutProductInputSchema),z.lazy(() => ProductInOrderUncheckedUpdateWithoutProductInputSchema) ]),
}).strict();

export const ProductInOrderUpdateManyWithWhereWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderUpdateManyWithWhereWithoutProductInput> = z.object({
  where: z.lazy(() => ProductInOrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductInOrderUpdateManyMutationInputSchema),z.lazy(() => ProductInOrderUncheckedUpdateManyWithoutProductInputSchema) ]),
}).strict();

export const CategoryUpsertWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutProductsInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutProductsInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutProductsInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const CategoryUpdateToOneWithWhereWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutProductsInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutProductsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutProductsInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutProductsInput> = z.object({
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.lazy(() => CategoryOnOptionUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateWithoutProductsInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutProductsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.lazy(() => CategoryOnOptionUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const OptionInProductOrderCreateWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateWithoutProduct_in_orderInput> = z.object({
  option: z.lazy(() => OptionCreateNestedOneWithoutProductsInputSchema)
}).strict();

export const OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInput> = z.object({
  id: z.number().int().optional(),
  option_id: z.number().int()
}).strict();

export const OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateOrConnectWithoutProduct_in_orderInput> = z.object({
  where: z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema) ]),
}).strict();

export const OptionInProductOrderCreateManyProduct_in_orderInputEnvelopeSchema: z.ZodType<Prisma.OptionInProductOrderCreateManyProduct_in_orderInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OptionInProductOrderCreateManyProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderCreateManyProduct_in_orderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductCreateWithoutOrdersInputSchema: z.ZodType<Prisma.ProductCreateWithoutOrdersInput> = z.object({
  code: z.string(),
  desc: z.string(),
  site_price: z.number().optional().nullable(),
  home_price: z.number().optional().nullable(),
  rice: z.number().optional(),
  active: z.boolean().optional(),
  kitchen: z.lazy(() => KitchenTypeSchema).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutProductsInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutOrdersInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutOrdersInput> = z.object({
  id: z.number().int().optional(),
  category_id: z.number().int().optional().nullable(),
  code: z.string(),
  desc: z.string(),
  site_price: z.number().optional().nullable(),
  home_price: z.number().optional().nullable(),
  rice: z.number().optional(),
  active: z.boolean().optional(),
  kitchen: z.lazy(() => KitchenTypeSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutOrdersInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutOrdersInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutOrdersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutOrdersInputSchema) ]),
}).strict();

export const OrderCreateWithoutProductsInputSchema: z.ZodType<Prisma.OrderCreateWithoutProductsInput> = z.object({
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  payments: z.lazy(() => PaymentCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderCreateNestedOneWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderUncheckedCreateWithoutProductsInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutProductsInput> = z.object({
  id: z.number().int().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  total: z.number().optional(),
  discount: z.number().optional(),
  is_receipt_printed: z.boolean().optional(),
  suborder_of: z.number().int().optional().nullable(),
  state: z.lazy(() => OrderStateSchema).optional(),
  type: z.lazy(() => OrderTypeSchema),
  payments: z.lazy(() => PaymentUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedCreateNestedOneWithoutOrderInputSchema).optional()
}).strict();

export const OrderCreateOrConnectWithoutProductsInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutProductsInput> = z.object({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutProductsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProductsInputSchema) ]),
}).strict();

export const OptionInProductOrderUpsertWithWhereUniqueWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderUpsertWithWhereUniqueWithoutProduct_in_orderInput> = z.object({
  where: z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OptionInProductOrderUpdateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUncheckedUpdateWithoutProduct_in_orderInputSchema) ]),
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutProduct_in_orderInputSchema) ]),
}).strict();

export const OptionInProductOrderUpdateWithWhereUniqueWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateWithWhereUniqueWithoutProduct_in_orderInput> = z.object({
  where: z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OptionInProductOrderUpdateWithoutProduct_in_orderInputSchema),z.lazy(() => OptionInProductOrderUncheckedUpdateWithoutProduct_in_orderInputSchema) ]),
}).strict();

export const OptionInProductOrderUpdateManyWithWhereWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateManyWithWhereWithoutProduct_in_orderInput> = z.object({
  where: z.lazy(() => OptionInProductOrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OptionInProductOrderUpdateManyMutationInputSchema),z.lazy(() => OptionInProductOrderUncheckedUpdateManyWithoutProduct_in_orderInputSchema) ]),
}).strict();

export const OptionInProductOrderScalarWhereInputSchema: z.ZodType<Prisma.OptionInProductOrderScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => OptionInProductOrderScalarWhereInputSchema),z.lazy(() => OptionInProductOrderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OptionInProductOrderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OptionInProductOrderScalarWhereInputSchema),z.lazy(() => OptionInProductOrderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  product_in_order_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  option_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const ProductUpsertWithoutOrdersInputSchema: z.ZodType<Prisma.ProductUpsertWithoutOrdersInput> = z.object({
  update: z.union([ z.lazy(() => ProductUpdateWithoutOrdersInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutOrdersInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutOrdersInputSchema),z.lazy(() => ProductUncheckedCreateWithoutOrdersInputSchema) ]),
  where: z.lazy(() => ProductWhereInputSchema).optional()
}).strict();

export const ProductUpdateToOneWithWhereWithoutOrdersInputSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutOrdersInput> = z.object({
  where: z.lazy(() => ProductWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductUpdateWithoutOrdersInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutOrdersInputSchema) ]),
}).strict();

export const ProductUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.ProductUpdateWithoutOrdersInput> = z.object({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  desc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  site_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  kitchen: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => EnumKitchenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.lazy(() => CategoryUpdateOneWithoutProductsNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutOrdersInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category_id: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  desc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  site_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  kitchen: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => EnumKitchenTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OrderUpsertWithoutProductsInputSchema: z.ZodType<Prisma.OrderUpsertWithoutProductsInput> = z.object({
  update: z.union([ z.lazy(() => OrderUpdateWithoutProductsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutProductsInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutProductsInputSchema),z.lazy(() => OrderUncheckedCreateWithoutProductsInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional()
}).strict();

export const OrderUpdateToOneWithWhereWithoutProductsInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutProductsInput> = z.object({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutProductsInputSchema),z.lazy(() => OrderUncheckedUpdateWithoutProductsInputSchema) ]),
}).strict();

export const OrderUpdateWithoutProductsInputSchema: z.ZodType<Prisma.OrderUpdateWithoutProductsInput> = z.object({
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.lazy(() => PaymentUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUpdateOneWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const OrderUncheckedUpdateWithoutProductsInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutProductsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  discount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_receipt_printed: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  suborder_of: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  state: z.union([ z.lazy(() => OrderStateSchema),z.lazy(() => EnumOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => OrderTypeSchema),z.lazy(() => EnumOrderTypeFieldUpdateOperationsInputSchema) ]).optional(),
  payments: z.lazy(() => PaymentUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  table_order: z.lazy(() => TableOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  home_order: z.lazy(() => HomeOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  pickup_order: z.lazy(() => PickupOrderUncheckedUpdateOneWithoutOrderNestedInputSchema).optional()
}).strict();

export const ProductCreateWithoutCategoryInputSchema: z.ZodType<Prisma.ProductCreateWithoutCategoryInput> = z.object({
  code: z.string(),
  desc: z.string(),
  site_price: z.number().optional().nullable(),
  home_price: z.number().optional().nullable(),
  rice: z.number().optional(),
  active: z.boolean().optional(),
  kitchen: z.lazy(() => KitchenTypeSchema).optional(),
  orders: z.lazy(() => ProductInOrderCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutCategoryInput> = z.object({
  id: z.number().int().optional(),
  code: z.string(),
  desc: z.string(),
  site_price: z.number().optional().nullable(),
  home_price: z.number().optional().nullable(),
  rice: z.number().optional(),
  active: z.boolean().optional(),
  kitchen: z.lazy(() => KitchenTypeSchema).optional(),
  orders: z.lazy(() => ProductInOrderUncheckedCreateNestedManyWithoutProductInputSchema).optional()
}).strict();

export const ProductCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutCategoryInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ProductCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.ProductCreateManyCategoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ProductCreateManyCategoryInputSchema),z.lazy(() => ProductCreateManyCategoryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CategoryOnOptionCreateWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateWithoutCategoryInput> = z.object({
  option: z.lazy(() => OptionCreateNestedOneWithoutCategoriesInputSchema)
}).strict();

export const CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedCreateWithoutCategoryInput> = z.object({
  id: z.number().int().optional(),
  option_id: z.number().int()
}).strict();

export const CategoryOnOptionCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateOrConnectWithoutCategoryInput> = z.object({
  where: z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const CategoryOnOptionCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.CategoryOnOptionCreateManyCategoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CategoryOnOptionCreateManyCategoryInputSchema),z.lazy(() => CategoryOnOptionCreateManyCategoryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ProductUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductUpdateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ProductUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateWithoutCategoryInputSchema),z.lazy(() => ProductUncheckedUpdateWithoutCategoryInputSchema) ]),
}).strict();

export const ProductUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutCategoryInput> = z.object({
  where: z.lazy(() => ProductScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateManyMutationInputSchema),z.lazy(() => ProductUncheckedUpdateManyWithoutCategoryInputSchema) ]),
}).strict();

export const ProductScalarWhereInputSchema: z.ZodType<Prisma.ProductScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereInputSchema),z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  category_id: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  code: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  desc: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  site_price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  home_price: z.union([ z.lazy(() => FloatNullableFilterSchema),z.number() ]).optional().nullable(),
  rice: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  active: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  kitchen: z.union([ z.lazy(() => EnumKitchenTypeFilterSchema),z.lazy(() => KitchenTypeSchema) ]).optional(),
}).strict();

export const CategoryOnOptionUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionUpsertWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CategoryOnOptionUpdateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const CategoryOnOptionUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CategoryOnOptionUpdateWithoutCategoryInputSchema),z.lazy(() => CategoryOnOptionUncheckedUpdateWithoutCategoryInputSchema) ]),
}).strict();

export const CategoryOnOptionUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateManyWithWhereWithoutCategoryInput> = z.object({
  where: z.lazy(() => CategoryOnOptionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CategoryOnOptionUpdateManyMutationInputSchema),z.lazy(() => CategoryOnOptionUncheckedUpdateManyWithoutCategoryInputSchema) ]),
}).strict();

export const CategoryOnOptionScalarWhereInputSchema: z.ZodType<Prisma.CategoryOnOptionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryOnOptionScalarWhereInputSchema),z.lazy(() => CategoryOnOptionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryOnOptionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryOnOptionScalarWhereInputSchema),z.lazy(() => CategoryOnOptionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  category_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  option_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const CategoryCreateWithoutOptionsInputSchema: z.ZodType<Prisma.CategoryCreateWithoutOptionsInput> = z.object({
  category: z.string(),
  active: z.boolean().optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateWithoutOptionsInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutOptionsInput> = z.object({
  id: z.number().int().optional(),
  category: z.string(),
  active: z.boolean().optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryCreateOrConnectWithoutOptionsInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutOptionsInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutOptionsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutOptionsInputSchema) ]),
}).strict();

export const OptionCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.OptionCreateWithoutCategoriesInput> = z.object({
  option_name: z.string(),
  active: z.boolean().optional(),
  products: z.lazy(() => OptionInProductOrderCreateNestedManyWithoutOptionInputSchema).optional()
}).strict();

export const OptionUncheckedCreateWithoutCategoriesInputSchema: z.ZodType<Prisma.OptionUncheckedCreateWithoutCategoriesInput> = z.object({
  id: z.number().int().optional(),
  option_name: z.string(),
  active: z.boolean().optional(),
  products: z.lazy(() => OptionInProductOrderUncheckedCreateNestedManyWithoutOptionInputSchema).optional()
}).strict();

export const OptionCreateOrConnectWithoutCategoriesInputSchema: z.ZodType<Prisma.OptionCreateOrConnectWithoutCategoriesInput> = z.object({
  where: z.lazy(() => OptionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OptionCreateWithoutCategoriesInputSchema),z.lazy(() => OptionUncheckedCreateWithoutCategoriesInputSchema) ]),
}).strict();

export const CategoryUpsertWithoutOptionsInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutOptionsInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutOptionsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutOptionsInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutOptionsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutOptionsInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const CategoryUpdateToOneWithWhereWithoutOptionsInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutOptionsInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutOptionsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutOptionsInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutOptionsInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutOptionsInput> = z.object({
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateWithoutOptionsInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutOptionsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const OptionUpsertWithoutCategoriesInputSchema: z.ZodType<Prisma.OptionUpsertWithoutCategoriesInput> = z.object({
  update: z.union([ z.lazy(() => OptionUpdateWithoutCategoriesInputSchema),z.lazy(() => OptionUncheckedUpdateWithoutCategoriesInputSchema) ]),
  create: z.union([ z.lazy(() => OptionCreateWithoutCategoriesInputSchema),z.lazy(() => OptionUncheckedCreateWithoutCategoriesInputSchema) ]),
  where: z.lazy(() => OptionWhereInputSchema).optional()
}).strict();

export const OptionUpdateToOneWithWhereWithoutCategoriesInputSchema: z.ZodType<Prisma.OptionUpdateToOneWithWhereWithoutCategoriesInput> = z.object({
  where: z.lazy(() => OptionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OptionUpdateWithoutCategoriesInputSchema),z.lazy(() => OptionUncheckedUpdateWithoutCategoriesInputSchema) ]),
}).strict();

export const OptionUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.OptionUpdateWithoutCategoriesInput> = z.object({
  option_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => OptionInProductOrderUpdateManyWithoutOptionNestedInputSchema).optional()
}).strict();

export const OptionUncheckedUpdateWithoutCategoriesInputSchema: z.ZodType<Prisma.OptionUncheckedUpdateWithoutCategoriesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  products: z.lazy(() => OptionInProductOrderUncheckedUpdateManyWithoutOptionNestedInputSchema).optional()
}).strict();

export const CategoryOnOptionCreateWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateWithoutOptionInput> = z.object({
  category: z.lazy(() => CategoryCreateNestedOneWithoutOptionsInputSchema)
}).strict();

export const CategoryOnOptionUncheckedCreateWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedCreateWithoutOptionInput> = z.object({
  id: z.number().int().optional(),
  category_id: z.number().int()
}).strict();

export const CategoryOnOptionCreateOrConnectWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateOrConnectWithoutOptionInput> = z.object({
  where: z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema) ]),
}).strict();

export const CategoryOnOptionCreateManyOptionInputEnvelopeSchema: z.ZodType<Prisma.CategoryOnOptionCreateManyOptionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CategoryOnOptionCreateManyOptionInputSchema),z.lazy(() => CategoryOnOptionCreateManyOptionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const OptionInProductOrderCreateWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateWithoutOptionInput> = z.object({
  product_in_order: z.lazy(() => ProductInOrderCreateNestedOneWithoutOptionsInputSchema)
}).strict();

export const OptionInProductOrderUncheckedCreateWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedCreateWithoutOptionInput> = z.object({
  id: z.number().int().optional(),
  product_in_order_id: z.number().int()
}).strict();

export const OptionInProductOrderCreateOrConnectWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateOrConnectWithoutOptionInput> = z.object({
  where: z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema) ]),
}).strict();

export const OptionInProductOrderCreateManyOptionInputEnvelopeSchema: z.ZodType<Prisma.OptionInProductOrderCreateManyOptionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => OptionInProductOrderCreateManyOptionInputSchema),z.lazy(() => OptionInProductOrderCreateManyOptionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CategoryOnOptionUpsertWithWhereUniqueWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionUpsertWithWhereUniqueWithoutOptionInput> = z.object({
  where: z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CategoryOnOptionUpdateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUncheckedUpdateWithoutOptionInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryOnOptionCreateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUncheckedCreateWithoutOptionInputSchema) ]),
}).strict();

export const CategoryOnOptionUpdateWithWhereUniqueWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateWithWhereUniqueWithoutOptionInput> = z.object({
  where: z.lazy(() => CategoryOnOptionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CategoryOnOptionUpdateWithoutOptionInputSchema),z.lazy(() => CategoryOnOptionUncheckedUpdateWithoutOptionInputSchema) ]),
}).strict();

export const CategoryOnOptionUpdateManyWithWhereWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateManyWithWhereWithoutOptionInput> = z.object({
  where: z.lazy(() => CategoryOnOptionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CategoryOnOptionUpdateManyMutationInputSchema),z.lazy(() => CategoryOnOptionUncheckedUpdateManyWithoutOptionInputSchema) ]),
}).strict();

export const OptionInProductOrderUpsertWithWhereUniqueWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderUpsertWithWhereUniqueWithoutOptionInput> = z.object({
  where: z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OptionInProductOrderUpdateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUncheckedUpdateWithoutOptionInputSchema) ]),
  create: z.union([ z.lazy(() => OptionInProductOrderCreateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUncheckedCreateWithoutOptionInputSchema) ]),
}).strict();

export const OptionInProductOrderUpdateWithWhereUniqueWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateWithWhereUniqueWithoutOptionInput> = z.object({
  where: z.lazy(() => OptionInProductOrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OptionInProductOrderUpdateWithoutOptionInputSchema),z.lazy(() => OptionInProductOrderUncheckedUpdateWithoutOptionInputSchema) ]),
}).strict();

export const OptionInProductOrderUpdateManyWithWhereWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateManyWithWhereWithoutOptionInput> = z.object({
  where: z.lazy(() => OptionInProductOrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OptionInProductOrderUpdateManyMutationInputSchema),z.lazy(() => OptionInProductOrderUncheckedUpdateManyWithoutOptionInputSchema) ]),
}).strict();

export const ProductInOrderCreateWithoutOptionsInputSchema: z.ZodType<Prisma.ProductInOrderCreateWithoutOptionsInput> = z.object({
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutOrdersInputSchema),
  order: z.lazy(() => OrderCreateNestedOneWithoutProductsInputSchema)
}).strict();

export const ProductInOrderUncheckedCreateWithoutOptionsInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedCreateWithoutOptionsInput> = z.object({
  id: z.number().int().optional(),
  product_id: z.number().int(),
  order_id: z.number().int(),
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional()
}).strict();

export const ProductInOrderCreateOrConnectWithoutOptionsInputSchema: z.ZodType<Prisma.ProductInOrderCreateOrConnectWithoutOptionsInput> = z.object({
  where: z.lazy(() => ProductInOrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOptionsInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOptionsInputSchema) ]),
}).strict();

export const OptionCreateWithoutProductsInputSchema: z.ZodType<Prisma.OptionCreateWithoutProductsInput> = z.object({
  option_name: z.string(),
  active: z.boolean().optional(),
  categories: z.lazy(() => CategoryOnOptionCreateNestedManyWithoutOptionInputSchema).optional()
}).strict();

export const OptionUncheckedCreateWithoutProductsInputSchema: z.ZodType<Prisma.OptionUncheckedCreateWithoutProductsInput> = z.object({
  id: z.number().int().optional(),
  option_name: z.string(),
  active: z.boolean().optional(),
  categories: z.lazy(() => CategoryOnOptionUncheckedCreateNestedManyWithoutOptionInputSchema).optional()
}).strict();

export const OptionCreateOrConnectWithoutProductsInputSchema: z.ZodType<Prisma.OptionCreateOrConnectWithoutProductsInput> = z.object({
  where: z.lazy(() => OptionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OptionCreateWithoutProductsInputSchema),z.lazy(() => OptionUncheckedCreateWithoutProductsInputSchema) ]),
}).strict();

export const ProductInOrderUpsertWithoutOptionsInputSchema: z.ZodType<Prisma.ProductInOrderUpsertWithoutOptionsInput> = z.object({
  update: z.union([ z.lazy(() => ProductInOrderUpdateWithoutOptionsInputSchema),z.lazy(() => ProductInOrderUncheckedUpdateWithoutOptionsInputSchema) ]),
  create: z.union([ z.lazy(() => ProductInOrderCreateWithoutOptionsInputSchema),z.lazy(() => ProductInOrderUncheckedCreateWithoutOptionsInputSchema) ]),
  where: z.lazy(() => ProductInOrderWhereInputSchema).optional()
}).strict();

export const ProductInOrderUpdateToOneWithWhereWithoutOptionsInputSchema: z.ZodType<Prisma.ProductInOrderUpdateToOneWithWhereWithoutOptionsInput> = z.object({
  where: z.lazy(() => ProductInOrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductInOrderUpdateWithoutOptionsInputSchema),z.lazy(() => ProductInOrderUncheckedUpdateWithoutOptionsInputSchema) ]),
}).strict();

export const ProductInOrderUpdateWithoutOptionsInputSchema: z.ZodType<Prisma.ProductInOrderUpdateWithoutOptionsInput> = z.object({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutProductsNestedInputSchema).optional()
}).strict();

export const ProductInOrderUncheckedUpdateWithoutOptionsInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedUpdateWithoutOptionsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OptionUpsertWithoutProductsInputSchema: z.ZodType<Prisma.OptionUpsertWithoutProductsInput> = z.object({
  update: z.union([ z.lazy(() => OptionUpdateWithoutProductsInputSchema),z.lazy(() => OptionUncheckedUpdateWithoutProductsInputSchema) ]),
  create: z.union([ z.lazy(() => OptionCreateWithoutProductsInputSchema),z.lazy(() => OptionUncheckedCreateWithoutProductsInputSchema) ]),
  where: z.lazy(() => OptionWhereInputSchema).optional()
}).strict();

export const OptionUpdateToOneWithWhereWithoutProductsInputSchema: z.ZodType<Prisma.OptionUpdateToOneWithWhereWithoutProductsInput> = z.object({
  where: z.lazy(() => OptionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OptionUpdateWithoutProductsInputSchema),z.lazy(() => OptionUncheckedUpdateWithoutProductsInputSchema) ]),
}).strict();

export const OptionUpdateWithoutProductsInputSchema: z.ZodType<Prisma.OptionUpdateWithoutProductsInput> = z.object({
  option_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.lazy(() => CategoryOnOptionUpdateManyWithoutOptionNestedInputSchema).optional()
}).strict();

export const OptionUncheckedUpdateWithoutProductsInputSchema: z.ZodType<Prisma.OptionUncheckedUpdateWithoutProductsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  categories: z.lazy(() => CategoryOnOptionUncheckedUpdateManyWithoutOptionNestedInputSchema).optional()
}).strict();

export const ProductInOrderCreateManyOrderInputSchema: z.ZodType<Prisma.ProductInOrderCreateManyOrderInput> = z.object({
  id: z.number().int().optional(),
  product_id: z.number().int(),
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional()
}).strict();

export const PaymentCreateManyOrderInputSchema: z.ZodType<Prisma.PaymentCreateManyOrderInput> = z.object({
  id: z.number().int().optional(),
  amount: z.number().optional(),
  created_at: z.coerce.date().optional(),
  type: z.lazy(() => PaymentTypeSchema)
}).strict();

export const ProductInOrderUpdateWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderUpdateWithoutOrderInput> = z.object({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.lazy(() => OptionInProductOrderUpdateManyWithoutProduct_in_orderNestedInputSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutOrdersNestedInputSchema).optional()
}).strict();

export const ProductInOrderUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.lazy(() => OptionInProductOrderUncheckedUpdateManyWithoutProduct_in_orderNestedInputSchema).optional()
}).strict();

export const ProductInOrderUncheckedUpdateManyWithoutOrderInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedUpdateManyWithoutOrderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUpdateWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUpdateWithoutOrderInput> = z.object({
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => EnumPaymentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateWithoutOrderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => EnumPaymentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUncheckedUpdateManyWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyWithoutOrderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => PaymentTypeSchema),z.lazy(() => EnumPaymentTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HomeOrderCreateManyAddressInputSchema: z.ZodType<Prisma.HomeOrderCreateManyAddressInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  customer_id: z.number().int(),
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable()
}).strict();

export const HomeOrderUpdateWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderUpdateWithoutAddressInput> = z.object({
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutHome_orderNestedInputSchema).optional(),
  customer: z.lazy(() => CustomerUpdateOneRequiredWithoutHome_ordersNestedInputSchema).optional()
}).strict();

export const HomeOrderUncheckedUpdateWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const HomeOrderUncheckedUpdateManyWithoutAddressInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateManyWithoutAddressInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  customer_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AddressCreateManyCustomerInputSchema: z.ZodType<Prisma.AddressCreateManyCustomerInput> = z.object({
  id: z.number().int().optional(),
  street: z.string(),
  civic: z.string(),
  doorbell: z.string(),
  floor: z.string().optional().nullable(),
  stair: z.string().optional().nullable(),
  street_info: z.string().optional().nullable(),
  active: z.boolean().optional(),
  temporary: z.boolean().optional()
}).strict();

export const HomeOrderCreateManyCustomerInputSchema: z.ZodType<Prisma.HomeOrderCreateManyCustomerInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  address_id: z.number().int(),
  when: z.string().optional(),
  notes: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable()
}).strict();

export const PickupOrderCreateManyCustomerInputSchema: z.ZodType<Prisma.PickupOrderCreateManyCustomerInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  when: z.string().optional().nullable(),
  name: z.string()
}).strict();

export const AddressUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.AddressUpdateWithoutCustomerInput> = z.object({
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  civic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doorbell: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  street_info: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  temporary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  home_orders: z.lazy(() => HomeOrderUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutCustomerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  civic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doorbell: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  street_info: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  temporary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  home_orders: z.lazy(() => HomeOrderUncheckedUpdateManyWithoutAddressNestedInputSchema).optional()
}).strict();

export const AddressUncheckedUpdateManyWithoutCustomerInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyWithoutCustomerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  civic: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  doorbell: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  floor: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  stair: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  street_info: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  temporary: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const HomeOrderUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderUpdateWithoutCustomerInput> = z.object({
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutHome_orderNestedInputSchema).optional(),
  address: z.lazy(() => AddressUpdateOneRequiredWithoutHome_ordersNestedInputSchema).optional()
}).strict();

export const HomeOrderUncheckedUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateWithoutCustomerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  address_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const HomeOrderUncheckedUpdateManyWithoutCustomerInputSchema: z.ZodType<Prisma.HomeOrderUncheckedUpdateManyWithoutCustomerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  address_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  when: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  notes: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  contact_phone: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const PickupOrderUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderUpdateWithoutCustomerInput> = z.object({
  when: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutPickup_orderNestedInputSchema).optional()
}).strict();

export const PickupOrderUncheckedUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderUncheckedUpdateWithoutCustomerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  when: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PickupOrderUncheckedUpdateManyWithoutCustomerInputSchema: z.ZodType<Prisma.PickupOrderUncheckedUpdateManyWithoutCustomerInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  when: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductInOrderCreateManyProductInputSchema: z.ZodType<Prisma.ProductInOrderCreateManyProductInput> = z.object({
  id: z.number().int().optional(),
  order_id: z.number().int(),
  quantity: z.number().int().optional(),
  total: z.number().optional(),
  is_paid_fully: z.boolean().optional(),
  paid_quantity: z.number().int().optional(),
  rice_quantity: z.number().optional(),
  printed_amount: z.number().int().optional(),
  state: z.lazy(() => ProductInOrderStateSchema).optional()
}).strict();

export const ProductInOrderUpdateWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderUpdateWithoutProductInput> = z.object({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.lazy(() => OptionInProductOrderUpdateManyWithoutProduct_in_orderNestedInputSchema).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutProductsNestedInputSchema).optional()
}).strict();

export const ProductInOrderUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedUpdateWithoutProductInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
  options: z.lazy(() => OptionInProductOrderUncheckedUpdateManyWithoutProduct_in_orderNestedInputSchema).optional()
}).strict();

export const ProductInOrderUncheckedUpdateManyWithoutProductInputSchema: z.ZodType<Prisma.ProductInOrderUncheckedUpdateManyWithoutProductInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  total: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  is_paid_fully: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paid_quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  rice_quantity: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  printed_amount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  state: z.union([ z.lazy(() => ProductInOrderStateSchema),z.lazy(() => EnumProductInOrderStateFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OptionInProductOrderCreateManyProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateManyProduct_in_orderInput> = z.object({
  id: z.number().int().optional(),
  option_id: z.number().int()
}).strict();

export const OptionInProductOrderUpdateWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateWithoutProduct_in_orderInput> = z.object({
  option: z.lazy(() => OptionUpdateOneRequiredWithoutProductsNestedInputSchema).optional()
}).strict();

export const OptionInProductOrderUncheckedUpdateWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedUpdateWithoutProduct_in_orderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OptionInProductOrderUncheckedUpdateManyWithoutProduct_in_orderInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedUpdateManyWithoutProduct_in_orderInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProductCreateManyCategoryInputSchema: z.ZodType<Prisma.ProductCreateManyCategoryInput> = z.object({
  id: z.number().int().optional(),
  code: z.string(),
  desc: z.string(),
  site_price: z.number().optional().nullable(),
  home_price: z.number().optional().nullable(),
  rice: z.number().optional(),
  active: z.boolean().optional(),
  kitchen: z.lazy(() => KitchenTypeSchema).optional()
}).strict();

export const CategoryOnOptionCreateManyCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateManyCategoryInput> = z.object({
  id: z.number().int().optional(),
  option_id: z.number().int()
}).strict();

export const ProductUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUpdateWithoutCategoryInput> = z.object({
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  desc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  site_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  kitchen: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => EnumKitchenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  orders: z.lazy(() => ProductInOrderUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  desc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  site_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  kitchen: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => EnumKitchenTypeFieldUpdateOperationsInputSchema) ]).optional(),
  orders: z.lazy(() => ProductInOrderUncheckedUpdateManyWithoutProductNestedInputSchema).optional()
}).strict();

export const ProductUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutCategoryInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  code: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  desc: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  site_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  home_price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  rice: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  active: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  kitchen: z.union([ z.lazy(() => KitchenTypeSchema),z.lazy(() => EnumKitchenTypeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryOnOptionUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateWithoutCategoryInput> = z.object({
  option: z.lazy(() => OptionUpdateOneRequiredWithoutCategoriesNestedInputSchema).optional()
}).strict();

export const CategoryOnOptionUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryOnOptionUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedUpdateManyWithoutCategoryInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  option_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryOnOptionCreateManyOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionCreateManyOptionInput> = z.object({
  id: z.number().int().optional(),
  category_id: z.number().int()
}).strict();

export const OptionInProductOrderCreateManyOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderCreateManyOptionInput> = z.object({
  id: z.number().int().optional(),
  product_in_order_id: z.number().int()
}).strict();

export const CategoryOnOptionUpdateWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionUpdateWithoutOptionInput> = z.object({
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutOptionsNestedInputSchema).optional()
}).strict();

export const CategoryOnOptionUncheckedUpdateWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedUpdateWithoutOptionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryOnOptionUncheckedUpdateManyWithoutOptionInputSchema: z.ZodType<Prisma.CategoryOnOptionUncheckedUpdateManyWithoutOptionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OptionInProductOrderUpdateWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderUpdateWithoutOptionInput> = z.object({
  product_in_order: z.lazy(() => ProductInOrderUpdateOneRequiredWithoutOptionsNestedInputSchema).optional()
}).strict();

export const OptionInProductOrderUncheckedUpdateWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedUpdateWithoutOptionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product_in_order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const OptionInProductOrderUncheckedUpdateManyWithoutOptionInputSchema: z.ZodType<Prisma.OptionInProductOrderUncheckedUpdateManyWithoutOptionInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product_in_order_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const OrderFindFirstArgsSchema: z.ZodType<Prisma.OrderFindFirstArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema,OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OrderFindFirstOrThrowArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema,OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderFindManyArgsSchema: z.ZodType<Prisma.OrderFindManyArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema,OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OrderAggregateArgsSchema: z.ZodType<Prisma.OrderAggregateArgs> = z.object({
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(),OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrderGroupByArgsSchema: z.ZodType<Prisma.OrderGroupByArgs> = z.object({
  where: OrderWhereInputSchema.optional(),
  orderBy: z.union([ OrderOrderByWithAggregationInputSchema.array(),OrderOrderByWithAggregationInputSchema ]).optional(),
  by: OrderScalarFieldEnumSchema.array(),
  having: OrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OrderFindUniqueArgsSchema: z.ZodType<Prisma.OrderFindUniqueArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OrderFindUniqueOrThrowArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const TableOrderFindFirstArgsSchema: z.ZodType<Prisma.TableOrderFindFirstArgs> = z.object({
  select: TableOrderSelectSchema.optional(),
  include: TableOrderIncludeSchema.optional(),
  where: TableOrderWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderOrderByWithRelationInputSchema.array(),TableOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: TableOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TableOrderScalarFieldEnumSchema,TableOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TableOrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TableOrderFindFirstOrThrowArgs> = z.object({
  select: TableOrderSelectSchema.optional(),
  include: TableOrderIncludeSchema.optional(),
  where: TableOrderWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderOrderByWithRelationInputSchema.array(),TableOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: TableOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TableOrderScalarFieldEnumSchema,TableOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TableOrderFindManyArgsSchema: z.ZodType<Prisma.TableOrderFindManyArgs> = z.object({
  select: TableOrderSelectSchema.optional(),
  include: TableOrderIncludeSchema.optional(),
  where: TableOrderWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderOrderByWithRelationInputSchema.array(),TableOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: TableOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TableOrderScalarFieldEnumSchema,TableOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TableOrderAggregateArgsSchema: z.ZodType<Prisma.TableOrderAggregateArgs> = z.object({
  where: TableOrderWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderOrderByWithRelationInputSchema.array(),TableOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: TableOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TableOrderGroupByArgsSchema: z.ZodType<Prisma.TableOrderGroupByArgs> = z.object({
  where: TableOrderWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderOrderByWithAggregationInputSchema.array(),TableOrderOrderByWithAggregationInputSchema ]).optional(),
  by: TableOrderScalarFieldEnumSchema.array(),
  having: TableOrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TableOrderFindUniqueArgsSchema: z.ZodType<Prisma.TableOrderFindUniqueArgs> = z.object({
  select: TableOrderSelectSchema.optional(),
  include: TableOrderIncludeSchema.optional(),
  where: TableOrderWhereUniqueInputSchema,
}).strict() ;

export const TableOrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TableOrderFindUniqueOrThrowArgs> = z.object({
  select: TableOrderSelectSchema.optional(),
  include: TableOrderIncludeSchema.optional(),
  where: TableOrderWhereUniqueInputSchema,
}).strict() ;

export const HomeOrderFindFirstArgsSchema: z.ZodType<Prisma.HomeOrderFindFirstArgs> = z.object({
  select: HomeOrderSelectSchema.optional(),
  include: HomeOrderIncludeSchema.optional(),
  where: HomeOrderWhereInputSchema.optional(),
  orderBy: z.union([ HomeOrderOrderByWithRelationInputSchema.array(),HomeOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: HomeOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HomeOrderScalarFieldEnumSchema,HomeOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HomeOrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.HomeOrderFindFirstOrThrowArgs> = z.object({
  select: HomeOrderSelectSchema.optional(),
  include: HomeOrderIncludeSchema.optional(),
  where: HomeOrderWhereInputSchema.optional(),
  orderBy: z.union([ HomeOrderOrderByWithRelationInputSchema.array(),HomeOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: HomeOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HomeOrderScalarFieldEnumSchema,HomeOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HomeOrderFindManyArgsSchema: z.ZodType<Prisma.HomeOrderFindManyArgs> = z.object({
  select: HomeOrderSelectSchema.optional(),
  include: HomeOrderIncludeSchema.optional(),
  where: HomeOrderWhereInputSchema.optional(),
  orderBy: z.union([ HomeOrderOrderByWithRelationInputSchema.array(),HomeOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: HomeOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ HomeOrderScalarFieldEnumSchema,HomeOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const HomeOrderAggregateArgsSchema: z.ZodType<Prisma.HomeOrderAggregateArgs> = z.object({
  where: HomeOrderWhereInputSchema.optional(),
  orderBy: z.union([ HomeOrderOrderByWithRelationInputSchema.array(),HomeOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: HomeOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const HomeOrderGroupByArgsSchema: z.ZodType<Prisma.HomeOrderGroupByArgs> = z.object({
  where: HomeOrderWhereInputSchema.optional(),
  orderBy: z.union([ HomeOrderOrderByWithAggregationInputSchema.array(),HomeOrderOrderByWithAggregationInputSchema ]).optional(),
  by: HomeOrderScalarFieldEnumSchema.array(),
  having: HomeOrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const HomeOrderFindUniqueArgsSchema: z.ZodType<Prisma.HomeOrderFindUniqueArgs> = z.object({
  select: HomeOrderSelectSchema.optional(),
  include: HomeOrderIncludeSchema.optional(),
  where: HomeOrderWhereUniqueInputSchema,
}).strict() ;

export const HomeOrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.HomeOrderFindUniqueOrThrowArgs> = z.object({
  select: HomeOrderSelectSchema.optional(),
  include: HomeOrderIncludeSchema.optional(),
  where: HomeOrderWhereUniqueInputSchema,
}).strict() ;

export const PickupOrderFindFirstArgsSchema: z.ZodType<Prisma.PickupOrderFindFirstArgs> = z.object({
  select: PickupOrderSelectSchema.optional(),
  include: PickupOrderIncludeSchema.optional(),
  where: PickupOrderWhereInputSchema.optional(),
  orderBy: z.union([ PickupOrderOrderByWithRelationInputSchema.array(),PickupOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PickupOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PickupOrderScalarFieldEnumSchema,PickupOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PickupOrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PickupOrderFindFirstOrThrowArgs> = z.object({
  select: PickupOrderSelectSchema.optional(),
  include: PickupOrderIncludeSchema.optional(),
  where: PickupOrderWhereInputSchema.optional(),
  orderBy: z.union([ PickupOrderOrderByWithRelationInputSchema.array(),PickupOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PickupOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PickupOrderScalarFieldEnumSchema,PickupOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PickupOrderFindManyArgsSchema: z.ZodType<Prisma.PickupOrderFindManyArgs> = z.object({
  select: PickupOrderSelectSchema.optional(),
  include: PickupOrderIncludeSchema.optional(),
  where: PickupOrderWhereInputSchema.optional(),
  orderBy: z.union([ PickupOrderOrderByWithRelationInputSchema.array(),PickupOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PickupOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PickupOrderScalarFieldEnumSchema,PickupOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PickupOrderAggregateArgsSchema: z.ZodType<Prisma.PickupOrderAggregateArgs> = z.object({
  where: PickupOrderWhereInputSchema.optional(),
  orderBy: z.union([ PickupOrderOrderByWithRelationInputSchema.array(),PickupOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: PickupOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PickupOrderGroupByArgsSchema: z.ZodType<Prisma.PickupOrderGroupByArgs> = z.object({
  where: PickupOrderWhereInputSchema.optional(),
  orderBy: z.union([ PickupOrderOrderByWithAggregationInputSchema.array(),PickupOrderOrderByWithAggregationInputSchema ]).optional(),
  by: PickupOrderScalarFieldEnumSchema.array(),
  having: PickupOrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PickupOrderFindUniqueArgsSchema: z.ZodType<Prisma.PickupOrderFindUniqueArgs> = z.object({
  select: PickupOrderSelectSchema.optional(),
  include: PickupOrderIncludeSchema.optional(),
  where: PickupOrderWhereUniqueInputSchema,
}).strict() ;

export const PickupOrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PickupOrderFindUniqueOrThrowArgs> = z.object({
  select: PickupOrderSelectSchema.optional(),
  include: PickupOrderIncludeSchema.optional(),
  where: PickupOrderWhereUniqueInputSchema,
}).strict() ;

export const AddressFindFirstArgsSchema: z.ZodType<Prisma.AddressFindFirstArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema,AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AddressFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AddressFindFirstOrThrowArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema,AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AddressFindManyArgsSchema: z.ZodType<Prisma.AddressFindManyArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema,AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AddressAggregateArgsSchema: z.ZodType<Prisma.AddressAggregateArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(),AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AddressGroupByArgsSchema: z.ZodType<Prisma.AddressGroupByArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
  orderBy: z.union([ AddressOrderByWithAggregationInputSchema.array(),AddressOrderByWithAggregationInputSchema ]).optional(),
  by: AddressScalarFieldEnumSchema.array(),
  having: AddressScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AddressFindUniqueArgsSchema: z.ZodType<Prisma.AddressFindUniqueArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const AddressFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AddressFindUniqueOrThrowArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const CustomerFindFirstArgsSchema: z.ZodType<Prisma.CustomerFindFirstArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereInputSchema.optional(),
  orderBy: z.union([ CustomerOrderByWithRelationInputSchema.array(),CustomerOrderByWithRelationInputSchema ]).optional(),
  cursor: CustomerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CustomerScalarFieldEnumSchema,CustomerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CustomerFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CustomerFindFirstOrThrowArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereInputSchema.optional(),
  orderBy: z.union([ CustomerOrderByWithRelationInputSchema.array(),CustomerOrderByWithRelationInputSchema ]).optional(),
  cursor: CustomerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CustomerScalarFieldEnumSchema,CustomerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CustomerFindManyArgsSchema: z.ZodType<Prisma.CustomerFindManyArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereInputSchema.optional(),
  orderBy: z.union([ CustomerOrderByWithRelationInputSchema.array(),CustomerOrderByWithRelationInputSchema ]).optional(),
  cursor: CustomerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CustomerScalarFieldEnumSchema,CustomerScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CustomerAggregateArgsSchema: z.ZodType<Prisma.CustomerAggregateArgs> = z.object({
  where: CustomerWhereInputSchema.optional(),
  orderBy: z.union([ CustomerOrderByWithRelationInputSchema.array(),CustomerOrderByWithRelationInputSchema ]).optional(),
  cursor: CustomerWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CustomerGroupByArgsSchema: z.ZodType<Prisma.CustomerGroupByArgs> = z.object({
  where: CustomerWhereInputSchema.optional(),
  orderBy: z.union([ CustomerOrderByWithAggregationInputSchema.array(),CustomerOrderByWithAggregationInputSchema ]).optional(),
  by: CustomerScalarFieldEnumSchema.array(),
  having: CustomerScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CustomerFindUniqueArgsSchema: z.ZodType<Prisma.CustomerFindUniqueArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereUniqueInputSchema,
}).strict() ;

export const CustomerFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CustomerFindUniqueOrThrowArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereUniqueInputSchema,
}).strict() ;

export const PhoneFindFirstArgsSchema: z.ZodType<Prisma.PhoneFindFirstArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithRelationInputSchema.array(),PhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PhoneScalarFieldEnumSchema,PhoneScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PhoneFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PhoneFindFirstOrThrowArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithRelationInputSchema.array(),PhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PhoneScalarFieldEnumSchema,PhoneScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PhoneFindManyArgsSchema: z.ZodType<Prisma.PhoneFindManyArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithRelationInputSchema.array(),PhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PhoneScalarFieldEnumSchema,PhoneScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PhoneAggregateArgsSchema: z.ZodType<Prisma.PhoneAggregateArgs> = z.object({
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithRelationInputSchema.array(),PhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PhoneGroupByArgsSchema: z.ZodType<Prisma.PhoneGroupByArgs> = z.object({
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithAggregationInputSchema.array(),PhoneOrderByWithAggregationInputSchema ]).optional(),
  by: PhoneScalarFieldEnumSchema.array(),
  having: PhoneScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PhoneFindUniqueArgsSchema: z.ZodType<Prisma.PhoneFindUniqueArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereUniqueInputSchema,
}).strict() ;

export const PhoneFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PhoneFindUniqueOrThrowArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereUniqueInputSchema,
}).strict() ;

export const PaymentFindFirstArgsSchema: z.ZodType<Prisma.PaymentFindFirstArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(),PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema,PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaymentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PaymentFindFirstOrThrowArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(),PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema,PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaymentFindManyArgsSchema: z.ZodType<Prisma.PaymentFindManyArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(),PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema,PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PaymentAggregateArgsSchema: z.ZodType<Prisma.PaymentAggregateArgs> = z.object({
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(),PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PaymentGroupByArgsSchema: z.ZodType<Prisma.PaymentGroupByArgs> = z.object({
  where: PaymentWhereInputSchema.optional(),
  orderBy: z.union([ PaymentOrderByWithAggregationInputSchema.array(),PaymentOrderByWithAggregationInputSchema ]).optional(),
  by: PaymentScalarFieldEnumSchema.array(),
  having: PaymentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PaymentFindUniqueArgsSchema: z.ZodType<Prisma.PaymentFindUniqueArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema,
}).strict() ;

export const PaymentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PaymentFindUniqueOrThrowArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema,
}).strict() ;

export const RiceFindFirstArgsSchema: z.ZodType<Prisma.RiceFindFirstArgs> = z.object({
  select: RiceSelectSchema.optional(),
  where: RiceWhereInputSchema.optional(),
  orderBy: z.union([ RiceOrderByWithRelationInputSchema.array(),RiceOrderByWithRelationInputSchema ]).optional(),
  cursor: RiceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RiceScalarFieldEnumSchema,RiceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RiceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RiceFindFirstOrThrowArgs> = z.object({
  select: RiceSelectSchema.optional(),
  where: RiceWhereInputSchema.optional(),
  orderBy: z.union([ RiceOrderByWithRelationInputSchema.array(),RiceOrderByWithRelationInputSchema ]).optional(),
  cursor: RiceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RiceScalarFieldEnumSchema,RiceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RiceFindManyArgsSchema: z.ZodType<Prisma.RiceFindManyArgs> = z.object({
  select: RiceSelectSchema.optional(),
  where: RiceWhereInputSchema.optional(),
  orderBy: z.union([ RiceOrderByWithRelationInputSchema.array(),RiceOrderByWithRelationInputSchema ]).optional(),
  cursor: RiceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RiceScalarFieldEnumSchema,RiceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RiceAggregateArgsSchema: z.ZodType<Prisma.RiceAggregateArgs> = z.object({
  where: RiceWhereInputSchema.optional(),
  orderBy: z.union([ RiceOrderByWithRelationInputSchema.array(),RiceOrderByWithRelationInputSchema ]).optional(),
  cursor: RiceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RiceGroupByArgsSchema: z.ZodType<Prisma.RiceGroupByArgs> = z.object({
  where: RiceWhereInputSchema.optional(),
  orderBy: z.union([ RiceOrderByWithAggregationInputSchema.array(),RiceOrderByWithAggregationInputSchema ]).optional(),
  by: RiceScalarFieldEnumSchema.array(),
  having: RiceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RiceFindUniqueArgsSchema: z.ZodType<Prisma.RiceFindUniqueArgs> = z.object({
  select: RiceSelectSchema.optional(),
  where: RiceWhereUniqueInputSchema,
}).strict() ;

export const RiceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RiceFindUniqueOrThrowArgs> = z.object({
  select: RiceSelectSchema.optional(),
  where: RiceWhereUniqueInputSchema,
}).strict() ;

export const ProductFindFirstArgsSchema: z.ZodType<Prisma.ProductFindFirstArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductFindFirstOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductFindManyArgsSchema: z.ZodType<Prisma.ProductFindManyArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema,ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductAggregateArgsSchema: z.ZodType<Prisma.ProductAggregateArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(),ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductGroupByArgsSchema: z.ZodType<Prisma.ProductGroupByArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
  orderBy: z.union([ ProductOrderByWithAggregationInputSchema.array(),ProductOrderByWithAggregationInputSchema ]).optional(),
  by: ProductScalarFieldEnumSchema.array(),
  having: ProductScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductFindUniqueArgsSchema: z.ZodType<Prisma.ProductFindUniqueArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductFindUniqueOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductInOrderFindFirstArgsSchema: z.ZodType<Prisma.ProductInOrderFindFirstArgs> = z.object({
  select: ProductInOrderSelectSchema.optional(),
  include: ProductInOrderIncludeSchema.optional(),
  where: ProductInOrderWhereInputSchema.optional(),
  orderBy: z.union([ ProductInOrderOrderByWithRelationInputSchema.array(),ProductInOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductInOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductInOrderScalarFieldEnumSchema,ProductInOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductInOrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductInOrderFindFirstOrThrowArgs> = z.object({
  select: ProductInOrderSelectSchema.optional(),
  include: ProductInOrderIncludeSchema.optional(),
  where: ProductInOrderWhereInputSchema.optional(),
  orderBy: z.union([ ProductInOrderOrderByWithRelationInputSchema.array(),ProductInOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductInOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductInOrderScalarFieldEnumSchema,ProductInOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductInOrderFindManyArgsSchema: z.ZodType<Prisma.ProductInOrderFindManyArgs> = z.object({
  select: ProductInOrderSelectSchema.optional(),
  include: ProductInOrderIncludeSchema.optional(),
  where: ProductInOrderWhereInputSchema.optional(),
  orderBy: z.union([ ProductInOrderOrderByWithRelationInputSchema.array(),ProductInOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductInOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductInOrderScalarFieldEnumSchema,ProductInOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ProductInOrderAggregateArgsSchema: z.ZodType<Prisma.ProductInOrderAggregateArgs> = z.object({
  where: ProductInOrderWhereInputSchema.optional(),
  orderBy: z.union([ ProductInOrderOrderByWithRelationInputSchema.array(),ProductInOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductInOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductInOrderGroupByArgsSchema: z.ZodType<Prisma.ProductInOrderGroupByArgs> = z.object({
  where: ProductInOrderWhereInputSchema.optional(),
  orderBy: z.union([ ProductInOrderOrderByWithAggregationInputSchema.array(),ProductInOrderOrderByWithAggregationInputSchema ]).optional(),
  by: ProductInOrderScalarFieldEnumSchema.array(),
  having: ProductInOrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ProductInOrderFindUniqueArgsSchema: z.ZodType<Prisma.ProductInOrderFindUniqueArgs> = z.object({
  select: ProductInOrderSelectSchema.optional(),
  include: ProductInOrderIncludeSchema.optional(),
  where: ProductInOrderWhereUniqueInputSchema,
}).strict() ;

export const ProductInOrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductInOrderFindUniqueOrThrowArgs> = z.object({
  select: ProductInOrderSelectSchema.optional(),
  include: ProductInOrderIncludeSchema.optional(),
  where: ProductInOrderWhereUniqueInputSchema,
}).strict() ;

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithAggregationInputSchema.array(),CategoryOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryScalarFieldEnumSchema.array(),
  having: CategoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryOnOptionFindFirstArgsSchema: z.ZodType<Prisma.CategoryOnOptionFindFirstArgs> = z.object({
  select: CategoryOnOptionSelectSchema.optional(),
  include: CategoryOnOptionIncludeSchema.optional(),
  where: CategoryOnOptionWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOnOptionOrderByWithRelationInputSchema.array(),CategoryOnOptionOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryOnOptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryOnOptionScalarFieldEnumSchema,CategoryOnOptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryOnOptionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryOnOptionFindFirstOrThrowArgs> = z.object({
  select: CategoryOnOptionSelectSchema.optional(),
  include: CategoryOnOptionIncludeSchema.optional(),
  where: CategoryOnOptionWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOnOptionOrderByWithRelationInputSchema.array(),CategoryOnOptionOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryOnOptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryOnOptionScalarFieldEnumSchema,CategoryOnOptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryOnOptionFindManyArgsSchema: z.ZodType<Prisma.CategoryOnOptionFindManyArgs> = z.object({
  select: CategoryOnOptionSelectSchema.optional(),
  include: CategoryOnOptionIncludeSchema.optional(),
  where: CategoryOnOptionWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOnOptionOrderByWithRelationInputSchema.array(),CategoryOnOptionOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryOnOptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryOnOptionScalarFieldEnumSchema,CategoryOnOptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryOnOptionAggregateArgsSchema: z.ZodType<Prisma.CategoryOnOptionAggregateArgs> = z.object({
  where: CategoryOnOptionWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOnOptionOrderByWithRelationInputSchema.array(),CategoryOnOptionOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryOnOptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryOnOptionGroupByArgsSchema: z.ZodType<Prisma.CategoryOnOptionGroupByArgs> = z.object({
  where: CategoryOnOptionWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOnOptionOrderByWithAggregationInputSchema.array(),CategoryOnOptionOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryOnOptionScalarFieldEnumSchema.array(),
  having: CategoryOnOptionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryOnOptionFindUniqueArgsSchema: z.ZodType<Prisma.CategoryOnOptionFindUniqueArgs> = z.object({
  select: CategoryOnOptionSelectSchema.optional(),
  include: CategoryOnOptionIncludeSchema.optional(),
  where: CategoryOnOptionWhereUniqueInputSchema,
}).strict() ;

export const CategoryOnOptionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryOnOptionFindUniqueOrThrowArgs> = z.object({
  select: CategoryOnOptionSelectSchema.optional(),
  include: CategoryOnOptionIncludeSchema.optional(),
  where: CategoryOnOptionWhereUniqueInputSchema,
}).strict() ;

export const OptionFindFirstArgsSchema: z.ZodType<Prisma.OptionFindFirstArgs> = z.object({
  select: OptionSelectSchema.optional(),
  include: OptionIncludeSchema.optional(),
  where: OptionWhereInputSchema.optional(),
  orderBy: z.union([ OptionOrderByWithRelationInputSchema.array(),OptionOrderByWithRelationInputSchema ]).optional(),
  cursor: OptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OptionScalarFieldEnumSchema,OptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OptionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OptionFindFirstOrThrowArgs> = z.object({
  select: OptionSelectSchema.optional(),
  include: OptionIncludeSchema.optional(),
  where: OptionWhereInputSchema.optional(),
  orderBy: z.union([ OptionOrderByWithRelationInputSchema.array(),OptionOrderByWithRelationInputSchema ]).optional(),
  cursor: OptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OptionScalarFieldEnumSchema,OptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OptionFindManyArgsSchema: z.ZodType<Prisma.OptionFindManyArgs> = z.object({
  select: OptionSelectSchema.optional(),
  include: OptionIncludeSchema.optional(),
  where: OptionWhereInputSchema.optional(),
  orderBy: z.union([ OptionOrderByWithRelationInputSchema.array(),OptionOrderByWithRelationInputSchema ]).optional(),
  cursor: OptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OptionScalarFieldEnumSchema,OptionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OptionAggregateArgsSchema: z.ZodType<Prisma.OptionAggregateArgs> = z.object({
  where: OptionWhereInputSchema.optional(),
  orderBy: z.union([ OptionOrderByWithRelationInputSchema.array(),OptionOrderByWithRelationInputSchema ]).optional(),
  cursor: OptionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OptionGroupByArgsSchema: z.ZodType<Prisma.OptionGroupByArgs> = z.object({
  where: OptionWhereInputSchema.optional(),
  orderBy: z.union([ OptionOrderByWithAggregationInputSchema.array(),OptionOrderByWithAggregationInputSchema ]).optional(),
  by: OptionScalarFieldEnumSchema.array(),
  having: OptionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OptionFindUniqueArgsSchema: z.ZodType<Prisma.OptionFindUniqueArgs> = z.object({
  select: OptionSelectSchema.optional(),
  include: OptionIncludeSchema.optional(),
  where: OptionWhereUniqueInputSchema,
}).strict() ;

export const OptionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OptionFindUniqueOrThrowArgs> = z.object({
  select: OptionSelectSchema.optional(),
  include: OptionIncludeSchema.optional(),
  where: OptionWhereUniqueInputSchema,
}).strict() ;

export const OptionInProductOrderFindFirstArgsSchema: z.ZodType<Prisma.OptionInProductOrderFindFirstArgs> = z.object({
  select: OptionInProductOrderSelectSchema.optional(),
  include: OptionInProductOrderIncludeSchema.optional(),
  where: OptionInProductOrderWhereInputSchema.optional(),
  orderBy: z.union([ OptionInProductOrderOrderByWithRelationInputSchema.array(),OptionInProductOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OptionInProductOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OptionInProductOrderScalarFieldEnumSchema,OptionInProductOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OptionInProductOrderFindFirstOrThrowArgsSchema: z.ZodType<Prisma.OptionInProductOrderFindFirstOrThrowArgs> = z.object({
  select: OptionInProductOrderSelectSchema.optional(),
  include: OptionInProductOrderIncludeSchema.optional(),
  where: OptionInProductOrderWhereInputSchema.optional(),
  orderBy: z.union([ OptionInProductOrderOrderByWithRelationInputSchema.array(),OptionInProductOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OptionInProductOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OptionInProductOrderScalarFieldEnumSchema,OptionInProductOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OptionInProductOrderFindManyArgsSchema: z.ZodType<Prisma.OptionInProductOrderFindManyArgs> = z.object({
  select: OptionInProductOrderSelectSchema.optional(),
  include: OptionInProductOrderIncludeSchema.optional(),
  where: OptionInProductOrderWhereInputSchema.optional(),
  orderBy: z.union([ OptionInProductOrderOrderByWithRelationInputSchema.array(),OptionInProductOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OptionInProductOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OptionInProductOrderScalarFieldEnumSchema,OptionInProductOrderScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const OptionInProductOrderAggregateArgsSchema: z.ZodType<Prisma.OptionInProductOrderAggregateArgs> = z.object({
  where: OptionInProductOrderWhereInputSchema.optional(),
  orderBy: z.union([ OptionInProductOrderOrderByWithRelationInputSchema.array(),OptionInProductOrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OptionInProductOrderWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OptionInProductOrderGroupByArgsSchema: z.ZodType<Prisma.OptionInProductOrderGroupByArgs> = z.object({
  where: OptionInProductOrderWhereInputSchema.optional(),
  orderBy: z.union([ OptionInProductOrderOrderByWithAggregationInputSchema.array(),OptionInProductOrderOrderByWithAggregationInputSchema ]).optional(),
  by: OptionInProductOrderScalarFieldEnumSchema.array(),
  having: OptionInProductOrderScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const OptionInProductOrderFindUniqueArgsSchema: z.ZodType<Prisma.OptionInProductOrderFindUniqueArgs> = z.object({
  select: OptionInProductOrderSelectSchema.optional(),
  include: OptionInProductOrderIncludeSchema.optional(),
  where: OptionInProductOrderWhereUniqueInputSchema,
}).strict() ;

export const OptionInProductOrderFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.OptionInProductOrderFindUniqueOrThrowArgs> = z.object({
  select: OptionInProductOrderSelectSchema.optional(),
  include: OptionInProductOrderIncludeSchema.optional(),
  where: OptionInProductOrderWhereUniqueInputSchema,
}).strict() ;

export const OrderCreateArgsSchema: z.ZodType<Prisma.OrderCreateArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  data: z.union([ OrderCreateInputSchema,OrderUncheckedCreateInputSchema ]),
}).strict() ;

export const OrderUpsertArgsSchema: z.ZodType<Prisma.OrderUpsertArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
  create: z.union([ OrderCreateInputSchema,OrderUncheckedCreateInputSchema ]),
  update: z.union([ OrderUpdateInputSchema,OrderUncheckedUpdateInputSchema ]),
}).strict() ;

export const OrderCreateManyArgsSchema: z.ZodType<Prisma.OrderCreateManyArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema,OrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema,OrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OrderDeleteArgsSchema: z.ZodType<Prisma.OrderDeleteArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderUpdateArgsSchema: z.ZodType<Prisma.OrderUpdateArgs> = z.object({
  select: OrderSelectSchema.optional(),
  include: OrderIncludeSchema.optional(),
  data: z.union([ OrderUpdateInputSchema,OrderUncheckedUpdateInputSchema ]),
  where: OrderWhereUniqueInputSchema,
}).strict() ;

export const OrderUpdateManyArgsSchema: z.ZodType<Prisma.OrderUpdateManyArgs> = z.object({
  data: z.union([ OrderUpdateManyMutationInputSchema,OrderUncheckedUpdateManyInputSchema ]),
  where: OrderWhereInputSchema.optional(),
}).strict() ;

export const OrderDeleteManyArgsSchema: z.ZodType<Prisma.OrderDeleteManyArgs> = z.object({
  where: OrderWhereInputSchema.optional(),
}).strict() ;

export const TableOrderCreateArgsSchema: z.ZodType<Prisma.TableOrderCreateArgs> = z.object({
  select: TableOrderSelectSchema.optional(),
  include: TableOrderIncludeSchema.optional(),
  data: z.union([ TableOrderCreateInputSchema,TableOrderUncheckedCreateInputSchema ]),
}).strict() ;

export const TableOrderUpsertArgsSchema: z.ZodType<Prisma.TableOrderUpsertArgs> = z.object({
  select: TableOrderSelectSchema.optional(),
  include: TableOrderIncludeSchema.optional(),
  where: TableOrderWhereUniqueInputSchema,
  create: z.union([ TableOrderCreateInputSchema,TableOrderUncheckedCreateInputSchema ]),
  update: z.union([ TableOrderUpdateInputSchema,TableOrderUncheckedUpdateInputSchema ]),
}).strict() ;

export const TableOrderCreateManyArgsSchema: z.ZodType<Prisma.TableOrderCreateManyArgs> = z.object({
  data: z.union([ TableOrderCreateManyInputSchema,TableOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TableOrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TableOrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ TableOrderCreateManyInputSchema,TableOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const TableOrderDeleteArgsSchema: z.ZodType<Prisma.TableOrderDeleteArgs> = z.object({
  select: TableOrderSelectSchema.optional(),
  include: TableOrderIncludeSchema.optional(),
  where: TableOrderWhereUniqueInputSchema,
}).strict() ;

export const TableOrderUpdateArgsSchema: z.ZodType<Prisma.TableOrderUpdateArgs> = z.object({
  select: TableOrderSelectSchema.optional(),
  include: TableOrderIncludeSchema.optional(),
  data: z.union([ TableOrderUpdateInputSchema,TableOrderUncheckedUpdateInputSchema ]),
  where: TableOrderWhereUniqueInputSchema,
}).strict() ;

export const TableOrderUpdateManyArgsSchema: z.ZodType<Prisma.TableOrderUpdateManyArgs> = z.object({
  data: z.union([ TableOrderUpdateManyMutationInputSchema,TableOrderUncheckedUpdateManyInputSchema ]),
  where: TableOrderWhereInputSchema.optional(),
}).strict() ;

export const TableOrderDeleteManyArgsSchema: z.ZodType<Prisma.TableOrderDeleteManyArgs> = z.object({
  where: TableOrderWhereInputSchema.optional(),
}).strict() ;

export const HomeOrderCreateArgsSchema: z.ZodType<Prisma.HomeOrderCreateArgs> = z.object({
  select: HomeOrderSelectSchema.optional(),
  include: HomeOrderIncludeSchema.optional(),
  data: z.union([ HomeOrderCreateInputSchema,HomeOrderUncheckedCreateInputSchema ]),
}).strict() ;

export const HomeOrderUpsertArgsSchema: z.ZodType<Prisma.HomeOrderUpsertArgs> = z.object({
  select: HomeOrderSelectSchema.optional(),
  include: HomeOrderIncludeSchema.optional(),
  where: HomeOrderWhereUniqueInputSchema,
  create: z.union([ HomeOrderCreateInputSchema,HomeOrderUncheckedCreateInputSchema ]),
  update: z.union([ HomeOrderUpdateInputSchema,HomeOrderUncheckedUpdateInputSchema ]),
}).strict() ;

export const HomeOrderCreateManyArgsSchema: z.ZodType<Prisma.HomeOrderCreateManyArgs> = z.object({
  data: z.union([ HomeOrderCreateManyInputSchema,HomeOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const HomeOrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.HomeOrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ HomeOrderCreateManyInputSchema,HomeOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const HomeOrderDeleteArgsSchema: z.ZodType<Prisma.HomeOrderDeleteArgs> = z.object({
  select: HomeOrderSelectSchema.optional(),
  include: HomeOrderIncludeSchema.optional(),
  where: HomeOrderWhereUniqueInputSchema,
}).strict() ;

export const HomeOrderUpdateArgsSchema: z.ZodType<Prisma.HomeOrderUpdateArgs> = z.object({
  select: HomeOrderSelectSchema.optional(),
  include: HomeOrderIncludeSchema.optional(),
  data: z.union([ HomeOrderUpdateInputSchema,HomeOrderUncheckedUpdateInputSchema ]),
  where: HomeOrderWhereUniqueInputSchema,
}).strict() ;

export const HomeOrderUpdateManyArgsSchema: z.ZodType<Prisma.HomeOrderUpdateManyArgs> = z.object({
  data: z.union([ HomeOrderUpdateManyMutationInputSchema,HomeOrderUncheckedUpdateManyInputSchema ]),
  where: HomeOrderWhereInputSchema.optional(),
}).strict() ;

export const HomeOrderDeleteManyArgsSchema: z.ZodType<Prisma.HomeOrderDeleteManyArgs> = z.object({
  where: HomeOrderWhereInputSchema.optional(),
}).strict() ;

export const PickupOrderCreateArgsSchema: z.ZodType<Prisma.PickupOrderCreateArgs> = z.object({
  select: PickupOrderSelectSchema.optional(),
  include: PickupOrderIncludeSchema.optional(),
  data: z.union([ PickupOrderCreateInputSchema,PickupOrderUncheckedCreateInputSchema ]),
}).strict() ;

export const PickupOrderUpsertArgsSchema: z.ZodType<Prisma.PickupOrderUpsertArgs> = z.object({
  select: PickupOrderSelectSchema.optional(),
  include: PickupOrderIncludeSchema.optional(),
  where: PickupOrderWhereUniqueInputSchema,
  create: z.union([ PickupOrderCreateInputSchema,PickupOrderUncheckedCreateInputSchema ]),
  update: z.union([ PickupOrderUpdateInputSchema,PickupOrderUncheckedUpdateInputSchema ]),
}).strict() ;

export const PickupOrderCreateManyArgsSchema: z.ZodType<Prisma.PickupOrderCreateManyArgs> = z.object({
  data: z.union([ PickupOrderCreateManyInputSchema,PickupOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PickupOrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PickupOrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ PickupOrderCreateManyInputSchema,PickupOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PickupOrderDeleteArgsSchema: z.ZodType<Prisma.PickupOrderDeleteArgs> = z.object({
  select: PickupOrderSelectSchema.optional(),
  include: PickupOrderIncludeSchema.optional(),
  where: PickupOrderWhereUniqueInputSchema,
}).strict() ;

export const PickupOrderUpdateArgsSchema: z.ZodType<Prisma.PickupOrderUpdateArgs> = z.object({
  select: PickupOrderSelectSchema.optional(),
  include: PickupOrderIncludeSchema.optional(),
  data: z.union([ PickupOrderUpdateInputSchema,PickupOrderUncheckedUpdateInputSchema ]),
  where: PickupOrderWhereUniqueInputSchema,
}).strict() ;

export const PickupOrderUpdateManyArgsSchema: z.ZodType<Prisma.PickupOrderUpdateManyArgs> = z.object({
  data: z.union([ PickupOrderUpdateManyMutationInputSchema,PickupOrderUncheckedUpdateManyInputSchema ]),
  where: PickupOrderWhereInputSchema.optional(),
}).strict() ;

export const PickupOrderDeleteManyArgsSchema: z.ZodType<Prisma.PickupOrderDeleteManyArgs> = z.object({
  where: PickupOrderWhereInputSchema.optional(),
}).strict() ;

export const AddressCreateArgsSchema: z.ZodType<Prisma.AddressCreateArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  data: z.union([ AddressCreateInputSchema,AddressUncheckedCreateInputSchema ]),
}).strict() ;

export const AddressUpsertArgsSchema: z.ZodType<Prisma.AddressUpsertArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
  create: z.union([ AddressCreateInputSchema,AddressUncheckedCreateInputSchema ]),
  update: z.union([ AddressUpdateInputSchema,AddressUncheckedUpdateInputSchema ]),
}).strict() ;

export const AddressCreateManyArgsSchema: z.ZodType<Prisma.AddressCreateManyArgs> = z.object({
  data: z.union([ AddressCreateManyInputSchema,AddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AddressCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AddressCreateManyAndReturnArgs> = z.object({
  data: z.union([ AddressCreateManyInputSchema,AddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AddressDeleteArgsSchema: z.ZodType<Prisma.AddressDeleteArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const AddressUpdateArgsSchema: z.ZodType<Prisma.AddressUpdateArgs> = z.object({
  select: AddressSelectSchema.optional(),
  include: AddressIncludeSchema.optional(),
  data: z.union([ AddressUpdateInputSchema,AddressUncheckedUpdateInputSchema ]),
  where: AddressWhereUniqueInputSchema,
}).strict() ;

export const AddressUpdateManyArgsSchema: z.ZodType<Prisma.AddressUpdateManyArgs> = z.object({
  data: z.union([ AddressUpdateManyMutationInputSchema,AddressUncheckedUpdateManyInputSchema ]),
  where: AddressWhereInputSchema.optional(),
}).strict() ;

export const AddressDeleteManyArgsSchema: z.ZodType<Prisma.AddressDeleteManyArgs> = z.object({
  where: AddressWhereInputSchema.optional(),
}).strict() ;

export const CustomerCreateArgsSchema: z.ZodType<Prisma.CustomerCreateArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  data: z.union([ CustomerCreateInputSchema,CustomerUncheckedCreateInputSchema ]).optional(),
}).strict() ;

export const CustomerUpsertArgsSchema: z.ZodType<Prisma.CustomerUpsertArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereUniqueInputSchema,
  create: z.union([ CustomerCreateInputSchema,CustomerUncheckedCreateInputSchema ]),
  update: z.union([ CustomerUpdateInputSchema,CustomerUncheckedUpdateInputSchema ]),
}).strict() ;

export const CustomerCreateManyArgsSchema: z.ZodType<Prisma.CustomerCreateManyArgs> = z.object({
  data: z.union([ CustomerCreateManyInputSchema,CustomerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CustomerCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CustomerCreateManyAndReturnArgs> = z.object({
  data: z.union([ CustomerCreateManyInputSchema,CustomerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CustomerDeleteArgsSchema: z.ZodType<Prisma.CustomerDeleteArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  where: CustomerWhereUniqueInputSchema,
}).strict() ;

export const CustomerUpdateArgsSchema: z.ZodType<Prisma.CustomerUpdateArgs> = z.object({
  select: CustomerSelectSchema.optional(),
  include: CustomerIncludeSchema.optional(),
  data: z.union([ CustomerUpdateInputSchema,CustomerUncheckedUpdateInputSchema ]),
  where: CustomerWhereUniqueInputSchema,
}).strict() ;

export const CustomerUpdateManyArgsSchema: z.ZodType<Prisma.CustomerUpdateManyArgs> = z.object({
  data: z.union([ CustomerUpdateManyMutationInputSchema,CustomerUncheckedUpdateManyInputSchema ]),
  where: CustomerWhereInputSchema.optional(),
}).strict() ;

export const CustomerDeleteManyArgsSchema: z.ZodType<Prisma.CustomerDeleteManyArgs> = z.object({
  where: CustomerWhereInputSchema.optional(),
}).strict() ;

export const PhoneCreateArgsSchema: z.ZodType<Prisma.PhoneCreateArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  data: z.union([ PhoneCreateInputSchema,PhoneUncheckedCreateInputSchema ]),
}).strict() ;

export const PhoneUpsertArgsSchema: z.ZodType<Prisma.PhoneUpsertArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereUniqueInputSchema,
  create: z.union([ PhoneCreateInputSchema,PhoneUncheckedCreateInputSchema ]),
  update: z.union([ PhoneUpdateInputSchema,PhoneUncheckedUpdateInputSchema ]),
}).strict() ;

export const PhoneCreateManyArgsSchema: z.ZodType<Prisma.PhoneCreateManyArgs> = z.object({
  data: z.union([ PhoneCreateManyInputSchema,PhoneCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PhoneCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PhoneCreateManyAndReturnArgs> = z.object({
  data: z.union([ PhoneCreateManyInputSchema,PhoneCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PhoneDeleteArgsSchema: z.ZodType<Prisma.PhoneDeleteArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereUniqueInputSchema,
}).strict() ;

export const PhoneUpdateArgsSchema: z.ZodType<Prisma.PhoneUpdateArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  data: z.union([ PhoneUpdateInputSchema,PhoneUncheckedUpdateInputSchema ]),
  where: PhoneWhereUniqueInputSchema,
}).strict() ;

export const PhoneUpdateManyArgsSchema: z.ZodType<Prisma.PhoneUpdateManyArgs> = z.object({
  data: z.union([ PhoneUpdateManyMutationInputSchema,PhoneUncheckedUpdateManyInputSchema ]),
  where: PhoneWhereInputSchema.optional(),
}).strict() ;

export const PhoneDeleteManyArgsSchema: z.ZodType<Prisma.PhoneDeleteManyArgs> = z.object({
  where: PhoneWhereInputSchema.optional(),
}).strict() ;

export const PaymentCreateArgsSchema: z.ZodType<Prisma.PaymentCreateArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  data: z.union([ PaymentCreateInputSchema,PaymentUncheckedCreateInputSchema ]),
}).strict() ;

export const PaymentUpsertArgsSchema: z.ZodType<Prisma.PaymentUpsertArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema,
  create: z.union([ PaymentCreateInputSchema,PaymentUncheckedCreateInputSchema ]),
  update: z.union([ PaymentUpdateInputSchema,PaymentUncheckedUpdateInputSchema ]),
}).strict() ;

export const PaymentCreateManyArgsSchema: z.ZodType<Prisma.PaymentCreateManyArgs> = z.object({
  data: z.union([ PaymentCreateManyInputSchema,PaymentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PaymentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PaymentCreateManyAndReturnArgs> = z.object({
  data: z.union([ PaymentCreateManyInputSchema,PaymentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PaymentDeleteArgsSchema: z.ZodType<Prisma.PaymentDeleteArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema,
}).strict() ;

export const PaymentUpdateArgsSchema: z.ZodType<Prisma.PaymentUpdateArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  data: z.union([ PaymentUpdateInputSchema,PaymentUncheckedUpdateInputSchema ]),
  where: PaymentWhereUniqueInputSchema,
}).strict() ;

export const PaymentUpdateManyArgsSchema: z.ZodType<Prisma.PaymentUpdateManyArgs> = z.object({
  data: z.union([ PaymentUpdateManyMutationInputSchema,PaymentUncheckedUpdateManyInputSchema ]),
  where: PaymentWhereInputSchema.optional(),
}).strict() ;

export const PaymentDeleteManyArgsSchema: z.ZodType<Prisma.PaymentDeleteManyArgs> = z.object({
  where: PaymentWhereInputSchema.optional(),
}).strict() ;

export const RiceCreateArgsSchema: z.ZodType<Prisma.RiceCreateArgs> = z.object({
  select: RiceSelectSchema.optional(),
  data: z.union([ RiceCreateInputSchema,RiceUncheckedCreateInputSchema ]),
}).strict() ;

export const RiceUpsertArgsSchema: z.ZodType<Prisma.RiceUpsertArgs> = z.object({
  select: RiceSelectSchema.optional(),
  where: RiceWhereUniqueInputSchema,
  create: z.union([ RiceCreateInputSchema,RiceUncheckedCreateInputSchema ]),
  update: z.union([ RiceUpdateInputSchema,RiceUncheckedUpdateInputSchema ]),
}).strict() ;

export const RiceCreateManyArgsSchema: z.ZodType<Prisma.RiceCreateManyArgs> = z.object({
  data: z.union([ RiceCreateManyInputSchema,RiceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RiceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RiceCreateManyAndReturnArgs> = z.object({
  data: z.union([ RiceCreateManyInputSchema,RiceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RiceDeleteArgsSchema: z.ZodType<Prisma.RiceDeleteArgs> = z.object({
  select: RiceSelectSchema.optional(),
  where: RiceWhereUniqueInputSchema,
}).strict() ;

export const RiceUpdateArgsSchema: z.ZodType<Prisma.RiceUpdateArgs> = z.object({
  select: RiceSelectSchema.optional(),
  data: z.union([ RiceUpdateInputSchema,RiceUncheckedUpdateInputSchema ]),
  where: RiceWhereUniqueInputSchema,
}).strict() ;

export const RiceUpdateManyArgsSchema: z.ZodType<Prisma.RiceUpdateManyArgs> = z.object({
  data: z.union([ RiceUpdateManyMutationInputSchema,RiceUncheckedUpdateManyInputSchema ]),
  where: RiceWhereInputSchema.optional(),
}).strict() ;

export const RiceDeleteManyArgsSchema: z.ZodType<Prisma.RiceDeleteManyArgs> = z.object({
  where: RiceWhereInputSchema.optional(),
}).strict() ;

export const ProductCreateArgsSchema: z.ZodType<Prisma.ProductCreateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
}).strict() ;

export const ProductUpsertArgsSchema: z.ZodType<Prisma.ProductUpsertArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
  create: z.union([ ProductCreateInputSchema,ProductUncheckedCreateInputSchema ]),
  update: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProductCreateManyArgsSchema: z.ZodType<Prisma.ProductCreateManyArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema,ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductDeleteArgsSchema: z.ZodType<Prisma.ProductDeleteArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductUpdateArgsSchema: z.ZodType<Prisma.ProductUpdateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductUpdateInputSchema,ProductUncheckedUpdateInputSchema ]),
  where: ProductWhereUniqueInputSchema,
}).strict() ;

export const ProductUpdateManyArgsSchema: z.ZodType<Prisma.ProductUpdateManyArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema,ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(),
}).strict() ;

export const ProductDeleteManyArgsSchema: z.ZodType<Prisma.ProductDeleteManyArgs> = z.object({
  where: ProductWhereInputSchema.optional(),
}).strict() ;

export const ProductInOrderCreateArgsSchema: z.ZodType<Prisma.ProductInOrderCreateArgs> = z.object({
  select: ProductInOrderSelectSchema.optional(),
  include: ProductInOrderIncludeSchema.optional(),
  data: z.union([ ProductInOrderCreateInputSchema,ProductInOrderUncheckedCreateInputSchema ]),
}).strict() ;

export const ProductInOrderUpsertArgsSchema: z.ZodType<Prisma.ProductInOrderUpsertArgs> = z.object({
  select: ProductInOrderSelectSchema.optional(),
  include: ProductInOrderIncludeSchema.optional(),
  where: ProductInOrderWhereUniqueInputSchema,
  create: z.union([ ProductInOrderCreateInputSchema,ProductInOrderUncheckedCreateInputSchema ]),
  update: z.union([ ProductInOrderUpdateInputSchema,ProductInOrderUncheckedUpdateInputSchema ]),
}).strict() ;

export const ProductInOrderCreateManyArgsSchema: z.ZodType<Prisma.ProductInOrderCreateManyArgs> = z.object({
  data: z.union([ ProductInOrderCreateManyInputSchema,ProductInOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductInOrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductInOrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductInOrderCreateManyInputSchema,ProductInOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ProductInOrderDeleteArgsSchema: z.ZodType<Prisma.ProductInOrderDeleteArgs> = z.object({
  select: ProductInOrderSelectSchema.optional(),
  include: ProductInOrderIncludeSchema.optional(),
  where: ProductInOrderWhereUniqueInputSchema,
}).strict() ;

export const ProductInOrderUpdateArgsSchema: z.ZodType<Prisma.ProductInOrderUpdateArgs> = z.object({
  select: ProductInOrderSelectSchema.optional(),
  include: ProductInOrderIncludeSchema.optional(),
  data: z.union([ ProductInOrderUpdateInputSchema,ProductInOrderUncheckedUpdateInputSchema ]),
  where: ProductInOrderWhereUniqueInputSchema,
}).strict() ;

export const ProductInOrderUpdateManyArgsSchema: z.ZodType<Prisma.ProductInOrderUpdateManyArgs> = z.object({
  data: z.union([ ProductInOrderUpdateManyMutationInputSchema,ProductInOrderUncheckedUpdateManyInputSchema ]),
  where: ProductInOrderWhereInputSchema.optional(),
}).strict() ;

export const ProductInOrderDeleteManyArgsSchema: z.ZodType<Prisma.ProductInOrderDeleteManyArgs> = z.object({
  where: ProductInOrderWhereInputSchema.optional(),
}).strict() ;

export const CategoryCreateArgsSchema: z.ZodType<Prisma.CategoryCreateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
}).strict() ;

export const CategoryUpsertArgsSchema: z.ZodType<Prisma.CategoryUpsertArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
  create: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
  update: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const CategoryCreateManyArgsSchema: z.ZodType<Prisma.CategoryCreateManyArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema,CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CategoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema,CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateArgsSchema: z.ZodType<Prisma.CategoryUpdateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateManyArgsSchema: z.ZodType<Prisma.CategoryUpdateManyArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema,CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(),
}).strict() ;

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
}).strict() ;

export const CategoryOnOptionCreateArgsSchema: z.ZodType<Prisma.CategoryOnOptionCreateArgs> = z.object({
  select: CategoryOnOptionSelectSchema.optional(),
  include: CategoryOnOptionIncludeSchema.optional(),
  data: z.union([ CategoryOnOptionCreateInputSchema,CategoryOnOptionUncheckedCreateInputSchema ]),
}).strict() ;

export const CategoryOnOptionUpsertArgsSchema: z.ZodType<Prisma.CategoryOnOptionUpsertArgs> = z.object({
  select: CategoryOnOptionSelectSchema.optional(),
  include: CategoryOnOptionIncludeSchema.optional(),
  where: CategoryOnOptionWhereUniqueInputSchema,
  create: z.union([ CategoryOnOptionCreateInputSchema,CategoryOnOptionUncheckedCreateInputSchema ]),
  update: z.union([ CategoryOnOptionUpdateInputSchema,CategoryOnOptionUncheckedUpdateInputSchema ]),
}).strict() ;

export const CategoryOnOptionCreateManyArgsSchema: z.ZodType<Prisma.CategoryOnOptionCreateManyArgs> = z.object({
  data: z.union([ CategoryOnOptionCreateManyInputSchema,CategoryOnOptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CategoryOnOptionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryOnOptionCreateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryOnOptionCreateManyInputSchema,CategoryOnOptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CategoryOnOptionDeleteArgsSchema: z.ZodType<Prisma.CategoryOnOptionDeleteArgs> = z.object({
  select: CategoryOnOptionSelectSchema.optional(),
  include: CategoryOnOptionIncludeSchema.optional(),
  where: CategoryOnOptionWhereUniqueInputSchema,
}).strict() ;

export const CategoryOnOptionUpdateArgsSchema: z.ZodType<Prisma.CategoryOnOptionUpdateArgs> = z.object({
  select: CategoryOnOptionSelectSchema.optional(),
  include: CategoryOnOptionIncludeSchema.optional(),
  data: z.union([ CategoryOnOptionUpdateInputSchema,CategoryOnOptionUncheckedUpdateInputSchema ]),
  where: CategoryOnOptionWhereUniqueInputSchema,
}).strict() ;

export const CategoryOnOptionUpdateManyArgsSchema: z.ZodType<Prisma.CategoryOnOptionUpdateManyArgs> = z.object({
  data: z.union([ CategoryOnOptionUpdateManyMutationInputSchema,CategoryOnOptionUncheckedUpdateManyInputSchema ]),
  where: CategoryOnOptionWhereInputSchema.optional(),
}).strict() ;

export const CategoryOnOptionDeleteManyArgsSchema: z.ZodType<Prisma.CategoryOnOptionDeleteManyArgs> = z.object({
  where: CategoryOnOptionWhereInputSchema.optional(),
}).strict() ;

export const OptionCreateArgsSchema: z.ZodType<Prisma.OptionCreateArgs> = z.object({
  select: OptionSelectSchema.optional(),
  include: OptionIncludeSchema.optional(),
  data: z.union([ OptionCreateInputSchema,OptionUncheckedCreateInputSchema ]),
}).strict() ;

export const OptionUpsertArgsSchema: z.ZodType<Prisma.OptionUpsertArgs> = z.object({
  select: OptionSelectSchema.optional(),
  include: OptionIncludeSchema.optional(),
  where: OptionWhereUniqueInputSchema,
  create: z.union([ OptionCreateInputSchema,OptionUncheckedCreateInputSchema ]),
  update: z.union([ OptionUpdateInputSchema,OptionUncheckedUpdateInputSchema ]),
}).strict() ;

export const OptionCreateManyArgsSchema: z.ZodType<Prisma.OptionCreateManyArgs> = z.object({
  data: z.union([ OptionCreateManyInputSchema,OptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OptionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OptionCreateManyAndReturnArgs> = z.object({
  data: z.union([ OptionCreateManyInputSchema,OptionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OptionDeleteArgsSchema: z.ZodType<Prisma.OptionDeleteArgs> = z.object({
  select: OptionSelectSchema.optional(),
  include: OptionIncludeSchema.optional(),
  where: OptionWhereUniqueInputSchema,
}).strict() ;

export const OptionUpdateArgsSchema: z.ZodType<Prisma.OptionUpdateArgs> = z.object({
  select: OptionSelectSchema.optional(),
  include: OptionIncludeSchema.optional(),
  data: z.union([ OptionUpdateInputSchema,OptionUncheckedUpdateInputSchema ]),
  where: OptionWhereUniqueInputSchema,
}).strict() ;

export const OptionUpdateManyArgsSchema: z.ZodType<Prisma.OptionUpdateManyArgs> = z.object({
  data: z.union([ OptionUpdateManyMutationInputSchema,OptionUncheckedUpdateManyInputSchema ]),
  where: OptionWhereInputSchema.optional(),
}).strict() ;

export const OptionDeleteManyArgsSchema: z.ZodType<Prisma.OptionDeleteManyArgs> = z.object({
  where: OptionWhereInputSchema.optional(),
}).strict() ;

export const OptionInProductOrderCreateArgsSchema: z.ZodType<Prisma.OptionInProductOrderCreateArgs> = z.object({
  select: OptionInProductOrderSelectSchema.optional(),
  include: OptionInProductOrderIncludeSchema.optional(),
  data: z.union([ OptionInProductOrderCreateInputSchema,OptionInProductOrderUncheckedCreateInputSchema ]),
}).strict() ;

export const OptionInProductOrderUpsertArgsSchema: z.ZodType<Prisma.OptionInProductOrderUpsertArgs> = z.object({
  select: OptionInProductOrderSelectSchema.optional(),
  include: OptionInProductOrderIncludeSchema.optional(),
  where: OptionInProductOrderWhereUniqueInputSchema,
  create: z.union([ OptionInProductOrderCreateInputSchema,OptionInProductOrderUncheckedCreateInputSchema ]),
  update: z.union([ OptionInProductOrderUpdateInputSchema,OptionInProductOrderUncheckedUpdateInputSchema ]),
}).strict() ;

export const OptionInProductOrderCreateManyArgsSchema: z.ZodType<Prisma.OptionInProductOrderCreateManyArgs> = z.object({
  data: z.union([ OptionInProductOrderCreateManyInputSchema,OptionInProductOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OptionInProductOrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OptionInProductOrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ OptionInProductOrderCreateManyInputSchema,OptionInProductOrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const OptionInProductOrderDeleteArgsSchema: z.ZodType<Prisma.OptionInProductOrderDeleteArgs> = z.object({
  select: OptionInProductOrderSelectSchema.optional(),
  include: OptionInProductOrderIncludeSchema.optional(),
  where: OptionInProductOrderWhereUniqueInputSchema,
}).strict() ;

export const OptionInProductOrderUpdateArgsSchema: z.ZodType<Prisma.OptionInProductOrderUpdateArgs> = z.object({
  select: OptionInProductOrderSelectSchema.optional(),
  include: OptionInProductOrderIncludeSchema.optional(),
  data: z.union([ OptionInProductOrderUpdateInputSchema,OptionInProductOrderUncheckedUpdateInputSchema ]),
  where: OptionInProductOrderWhereUniqueInputSchema,
}).strict() ;

export const OptionInProductOrderUpdateManyArgsSchema: z.ZodType<Prisma.OptionInProductOrderUpdateManyArgs> = z.object({
  data: z.union([ OptionInProductOrderUpdateManyMutationInputSchema,OptionInProductOrderUncheckedUpdateManyInputSchema ]),
  where: OptionInProductOrderWhereInputSchema.optional(),
}).strict() ;

export const OptionInProductOrderDeleteManyArgsSchema: z.ZodType<Prisma.OptionInProductOrderDeleteManyArgs> = z.object({
  where: OptionInProductOrderWhereInputSchema.optional(),
}).strict() ;