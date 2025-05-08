export const engagementsInclude = {
  engagements: {
    include: {
      template: true,
    },
  },
};

export const optionsInclude = {
  options: {
    include: {
      option: true,
    },
  },
};

export const categoryInclude = {
  category: {
    include: optionsInclude,
  },
};

export const categoriesInclude = {
  categories: {
    include: {
      category: true,
    },
  },
};

export const productInclude = {
  product: {
    include: categoryInclude,
  },
};

export const productInOrderInclude = {
  ...productInclude,
  ...optionsInclude,
};

export const productsInOrderInclude = {
  products: {
    include: productInOrderInclude,
  },
};

export const orderInclude = {
  order: {
    include: {
      ...productsInOrderInclude,
      ...engagementsInclude,
    },
  },
};

export const homeOrderInclude = {
  home_order: {
    include: { address: true, customer: { include: { phone: true, ...engagementsInclude } } },
  },
};

export const pickupOrderInclude = {
  pickup_order: {
    include: { customer: { include: { phone: true, ...engagementsInclude } } },
  },
};

export const homeAndPickupOrdersInclude = {
  home_orders: {
    include: orderInclude,
  },
  pickup_orders: {
    include: orderInclude,
  },
};
