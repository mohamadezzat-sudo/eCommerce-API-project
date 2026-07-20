import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController';
import { validate } from '../utils/validate';
import { productSchema } from '../schemas/productSchema';

const router = express.Router();

// Routes for /api/products
router.route('/')
  .get(getProducts)
  .post(validate(productSchema), createProduct);

// Routes for /api/products/:id
router.route('/:id')
  .get(getProductById)
.put(validate(productSchema.partial()), updateProduct)
  .delete(deleteProduct);

export default router;