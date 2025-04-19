import { CustomerWithDetails } from "@shared"
;

export default function filterInactiveProducts(customer: CustomerWithDetails): CustomerWithDetails {
  customer.home_orders.forEach((homeOrder) => {
    homeOrder.order.products = homeOrder.order.products.filter(
      (productInOrder) => productInOrder.product.active
    );
  });

  customer.pickup_orders.forEach((pickupOrder) => {
    pickupOrder.order.products = pickupOrder.order.products.filter(
      (productInOrder) => productInOrder.product.active
    );
  });

  return customer;
}
