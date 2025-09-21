import { trpc } from "./client";

type Hooks<T> = {
  [K in keyof T]: T[K];
};

export const ordersAPI: Hooks<typeof trpc.orders> = {
  getById: trpc.orders.getById,
  getHomeOrders: trpc.orders.getHomeOrders,
  getPickupOrders: trpc.orders.getPickupOrders,
  getTableOrders: trpc.orders.getTableOrders,
  getWithPayments: trpc.orders.getWithPayments,
  createTable: trpc.orders.createTable,
  createPickup: trpc.orders.createPickup,
  createHome: trpc.orders.createHome,
  createSub: trpc.orders.createSub,
  updateDiscount: trpc.orders.updateDiscount,
  updatePaymentStatus: trpc.orders.updatePaymentStatus,
  updateTime: trpc.orders.updateTime,
  updatePrintedFlag: trpc.orders.updatePrintedFlag,
  updateTable: trpc.orders.updateTable,
  updateExtraItems: trpc.orders.updateExtraItems,
  updateTablePpl: trpc.orders.updateTablePpl,
  cancel: trpc.orders.cancel,
  cancelInBulk: trpc.orders.cancelInBulk,
  joinTables: trpc.orders.joinTables,
  updateOrdersShift: trpc.orders.updateOrdersShift,
  computeStats: trpc.orders.computeStats,
};

export const addressesAPI: Hooks<typeof trpc.addresses> = {
  create: trpc.addresses.create,
  update: trpc.addresses.update,
  getByCustomer: trpc.addresses.getByCustomer,
  getLastOfCustomer: trpc.addresses.getLastOfCustomer,
};

export const categoriesAPI: Hooks<typeof trpc.categories> = {
  create: trpc.categories.create,
  update: trpc.categories.update,
  toggle: trpc.categories.toggle,
  getAll: trpc.categories.getAll,
};

export const customersAPI: Hooks<typeof trpc.customers> = {
  getByPhone: trpc.customers.getByPhone,
  getWithDetails: trpc.customers.getWithDetails,
  getAllWithDetails: trpc.customers.getAllWithDetails,
  getByDoorbell: trpc.customers.getByDoorbell,
  updateFromAdmin: trpc.customers.updateFromAdmin,
  updateFromOrder: trpc.customers.updateFromOrder,
  create: trpc.customers.create,
  updateAddresses: trpc.customers.updateAddresses,
  updateOrderNotes: trpc.customers.updateOrderNotes,
  toggle: trpc.customers.toggle,
  deleteById: trpc.customers.deleteById,
  computeStats: trpc.customers.computeStats,
};

export const engagementsAPI: Hooks<typeof trpc.engagements> = {
  getTemplates: trpc.engagements.getTemplates,
  createTemplate: trpc.engagements.createTemplate,
  updateTemplate: trpc.engagements.updateTemplate,
  create: trpc.engagements.create,
  deleteEngagementById: trpc.engagements.deleteEngagementById,
  toggleById: trpc.engagements.toggleById,
  issueLedgers: trpc.engagements.issueLedgers,
  updateLedgerStatus: trpc.engagements.updateLedgerStatus,
  getByCustomer: trpc.engagements.getByCustomer,
  getLedgersByCustomer: trpc.engagements.getLedgersByCustomer,
  deleteTemplateById: trpc.engagements.deleteTemplateById,
};

export const metaAPI: Hooks<typeof trpc.meta> = {
  getTemplates: trpc.meta.getTemplates,
  sendMessage: trpc.meta.sendMessage,
};

export const optionsAPI: Hooks<typeof trpc.options> = {
  getAll: trpc.options.getAll,
  getAllWithCategories: trpc.options.getAllWithCategories,
  updateOptionsOfCategory: trpc.options.updateOptionsOfCategory,
  update: trpc.options.update,
  create: trpc.options.create,
  toggle: trpc.options.toggle,
};

export const riceAPI: Hooks<typeof trpc.rice> = {
  getDailyUsage: trpc.rice.getDailyUsage,
  getBatches: trpc.rice.getBatches,
  getLogs: trpc.rice.getLogs,
  addBatch: trpc.rice.addBatch,
  updateBatch: trpc.rice.updateBatch,
  addLog: trpc.rice.addLog,
  deleteBatch: trpc.rice.deleteBatch,
};

export const productsAPI: Hooks<typeof trpc.products> = {
  getAll: trpc.products.getAll,
  computeStats: trpc.products.computeStats,
  create: trpc.products.create,
  update: trpc.products.update,
  addToOrder: trpc.products.addToOrder,
  updateInOrder: trpc.products.updateInOrder,
  addMultipleToOrder: trpc.products.addMultipleToOrder,
  updateOptionInOrder: trpc.products.updateOptionInOrder,
  updateVariationInOrder: trpc.products.updateVariationInOrder,
  toggle: trpc.products.toggle,
  updatePrinted: trpc.products.updatePrinted,
  deleteFromOrder: trpc.products.deleteFromOrder,
};

export const paymentsAPI: Hooks<typeof trpc.payments> = {
  payOrder: trpc.payments.payOrder,
  getRomanPaymentsByOrder: trpc.payments.getRomanPaymentsByOrder,
  getSummary: trpc.payments.getSummary,
};
