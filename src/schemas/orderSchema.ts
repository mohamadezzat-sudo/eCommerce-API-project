import { z } from "zod";

export const createOrderSchema = z.object({
  orderItems: z.array(
    z.object({
      product: z.string().min(1, "Product ID is required"),
      name: z.string().min(1, "Product name is required"),
      quantity: z.number().int().positive("Quantity must be at least 1"),
      price: z.number().positive("Price must be a positive number"),
    })
  ).nonempty("Order items cannot be empty"),
  shippingAddress: z.object({
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  paymentMethod: z.string().min(1, "Payment method is required"),
  itemsPrice: z.number().positive("Items price must be positive"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;