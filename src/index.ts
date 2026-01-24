import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import { seedInitialProducts } from "./services/productService";
import productRoute from "./routes/productRoute";
import cartRoute from "./routes/cartRoute";

const app = express();
const port = 3001;

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log(err));

// seed the products in database
seedInitialProducts();

app.use("/user", userRoutes);
app.use("/products", productRoute);
app.use("/cart", cartRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
