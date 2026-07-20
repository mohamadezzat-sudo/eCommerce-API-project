import "dotenv/config";
import express from "express";
import cors from "cors";
import "./models/Category";
import "./models/Product";
import { connectDB } from "./db";
import { errorHandler } from "./middleware/errorHandler";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Centralized error handler - must be registered last
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();