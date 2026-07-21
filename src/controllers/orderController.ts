import { NextFunction, Request, Response } from 'express';
import Order from '../models/orderModel';
import { Product } from '../models/Product';
import asyncHandler from 'express-async-handler';
import { AppError } from '../middleware/errorHandler';
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req: Request, res: Response) => {
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        taxPrice = 0, 
        shippingPrice = 0 
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        throw new AppError('No order items provided', 400);
    }

    // Verify products and calculate itemsPrice server-side (FR017/FR018)
    let itemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new AppError(`Product not found: ${item.product}`, 404);
        }

        itemsPrice += product.price * item.quantity;
        verifiedOrderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price // Lock in current server price
        });
    }

    const totalPrice = itemsPrice + Number(taxPrice) + Number(shippingPrice);

    const order = new Order({
        orderItems: verifiedOrderItems,
        user: req.user._id, // Assumes your 'protect' middleware attaches the user object to req
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json({
        success: true,
        data: createdOrder,
    });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    res.status(200).json({
        success: true,
        data: order,
    });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        data: orders,
    });
});
// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order: any = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
export const updateOrderToDelivered = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order: any = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = 'Completed'; // Optional: update general status as well

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};