import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoryRoutes from "./routes/category.routes.js";
import authRoutes from "./routes/auth.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import productRoutes from "./routes/product.routes.js"
import orderRoutes from "./routes/order.routes.js"
import addressRouter from "./routes/address.routes.js"
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/categories", categoryRoutes);

// Auth Routes
app.use("/api/auth",authRoutes)

// Category Routes
app.use("/api/category",categoryRoutes)

//Cart Routes
app.use("/api/cart",cartRoutes)

//Product Routes
app.use("/api/product",productRoutes)

//Order Routes
app.use("/api/order",orderRoutes)

// Address Router
app.use("/api/address",addressRouter)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});