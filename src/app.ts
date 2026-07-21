import "dotenv/config";
import express from "express";
import cors from "cors";
// Suppress TS warning for side-effect imports when type declarations are not present
// @ts-ignore: TS2882
import Category from './models/categoryModel';
// @ts-ignore: TS2882
import "./models/Product";
import { connectDB } from "./db";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import categoryRouter from './routes/categoryRoutes';
import orderRoutes from './routes/orderRoutes';
import { setupSwagger } from './config/swagger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
setupSwagger(app);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/categories", categoryRouter);
// Centralized error handler - must be registered last
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();