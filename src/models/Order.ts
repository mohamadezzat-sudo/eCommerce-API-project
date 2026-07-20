import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: { productId: mongoose.Types.ObjectId; quantity: number }[];
  total: number;
}

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
  }],
  total: { type: Number, required: true }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', orderSchema);