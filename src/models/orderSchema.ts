import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// 1. Zod Validation Schema for incoming checkout requests
export const createOrderSchema = z.object({
  body: z.object({
    orderItems: z.array(
      z.object({
        product: z.string({ required_error: 'Product ID is required' }),
        name: z.string(),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        price: z.number().min(0, 'Price cannot be negative'),
      })
    ).min(1, 'No order items provided'),
    shippingAddress: z.object({
      address: z.string({ required_error: 'Address is required' }),
      city: z.string({ required_error: 'City is required' }),
      postalCode: z.string({ required_error: 'Postal code is required' }),
      country: z.string({ required_error: 'Country is required' }),
    }),
    paymentMethod: z.string({ required_error: 'Payment method is required' }),
    itemsPrice: z.number().min(0),
    taxPrice: z.number().min(0),
    shippingPrice: z.number().min(0),
    totalPrice: z.number().min(0),
  }),
});

// 2. TypeScript interface for the Order Document
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: {
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 3. Mongoose Schema definition
const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Optional: Apply your standard toJSON transform if you want consistent id mapping
orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete (ret as any)._id; // <-- Add 'as any' cast here
  },
});

export const Order = mongoose.model<IOrder>('Order', orderSchema);