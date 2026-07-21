import { Router } from 'express';
import { createOrderSchema } from '../schemas/orderSchema';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
} from '../controllers/orderController';
import { protect, admin } from '../middleware/authMiddleware';
import { validate } from '../middleware/validate';

const router = Router();

router.route('/')
  .post(protect, validate(createOrderSchema), addOrderItems);

router.route('/myorders')
  .get(protect, getMyOrders);

router.route('/:id/pay')
  .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
  .put(protect, admin, updateOrderToDelivered);

router.route('/:id')
  .get(protect, getOrderById);

export default router;