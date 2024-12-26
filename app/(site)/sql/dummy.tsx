import { faker } from "@faker-js/faker";
import prisma from "./db";
import deleteEverything from "./deleteEverything";

export default async function dummy() {
  await deleteEverything();
  await prisma.phone.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();

  try {
    const customerData = [];

    for (let i = 0; i < 1000; i++) {
      const customer = {
        name: faker.person.fullName(),
        active: true,
      };

      customerData.push(customer);
    }

    await prisma.customer.createMany({ data: customerData, skipDuplicates: true });

    const customersNoAdd = await prisma.customer.findMany({
      select: { id: true, addresses: { select: { id: true } } },
    });

    customersNoAdd.forEach(async (c) => {
      await prisma.address.create({
        data: {
          street: faker.location.streetAddress(),
          civic: faker.location.zipCode(),
          doorbell: faker.location.secondaryAddress(),
          customer: {
            connect: {
              id: c.id,
            },
          },
        },
      });
    });

    const customers = await prisma.customer.findMany({
      select: { id: true, addresses: { select: { id: true } } },
    });

    if (customers.length === 0) {
      throw new Error("No active customers found.");
    }

    // Fetch all active products
    const products = await prisma.product.findMany({
      where: { active: true },
      select: { id: true, home_price: true },
    });

    if (products.length === 0) {
      throw new Error("No active products found.");
    }

    // Generate 20000 orders
    const n = 35000;
    const orders = [];

    for (let i = 0; i < n; i++) {
      // Pick a random customer
      const randomCustomer = faker.helpers.arrayElement(customers);

      // Pick a random address for the customer
      if (!randomCustomer.addresses.length) {
        throw new Error(`Customer with ID ${randomCustomer.id} does not have any addresses.`);
      }
      const randomAddress = faker.helpers.arrayElement(randomCustomer.addresses);

      // Generate a random date in 2023 or 2024
      const randomYear = faker.date.between({ from: "2024-01-01", to: "2024-12-31" });

      // Generate a random number of products (1 to 5)
      const numberOfProducts = Math.floor(Math.random() * 5) + 1;

      const productData = [];
      let totalOrderPrice = 0;

      for (let j = 0; j < numberOfProducts; j++) {
        // Pick a random product
        const randomProduct = faker.helpers.arrayElement(products);

        const quantity = Math.floor(Math.random() * 3) + 1;

        // Calculate the total price for this product
        const productTotal = (randomProduct.home_price || 0) * quantity;
        totalOrderPrice += productTotal;

        productData.push({
          product_id: randomProduct.id,
          quantity,
          total: productTotal,
        });
      }

      // Create a new home order
      const order = await prisma.order.create({
        data: {
          type: "HOME",
          state: "ACTIVE",
          total: totalOrderPrice,
          home_order: {
            create: {
              address_id: randomAddress.id,
              customer_id: randomCustomer.id,
            },
          },
          products: {
            create: productData,
          },
          created_at: randomYear,
          updated_at: randomYear,
        },
      });

      orders.push(order);
    }

    console.log(`${n} home orders created successfully.`);
    return orders;
  } catch (error) {
    console.error("Error generating data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
