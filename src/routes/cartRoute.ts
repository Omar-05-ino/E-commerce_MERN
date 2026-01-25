import express from "express";
import {
  addItemToCart,
  checkout,
  clearCart,
  deleteItemFromCart,
  getActiveCartForUser,
  updateItemInCart,
} from "../services/cartService";
import valaidataJwt from "../middlewares/validateJWT";
import { extendedRequest } from "../types/extendedRequest";

const router = express.Router();

router.get("/", valaidataJwt, async (req: extendedRequest, res) => {
  try {
    const userId = req.user._id;
    const cart = await getActiveCartForUser({ userId });
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ data: "Internal Server Error" });
  }
});

router.post("/items", valaidataJwt, async (req: extendedRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const response = await addItemToCart({ userId, productId, quantity });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send({ data: "Internal Server Error" });
  }
});

router.put("/items", valaidataJwt, async (req: extendedRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const response = await updateItemInCart({ userId, productId, quantity });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send({ data: "Internal Server Error" });
  }
});

router.delete(
  "/items/:productId",
  valaidataJwt,
  async (req: extendedRequest, res) => {
    try {
      const userId = req.user._id;
      const { productId } = req.params;
      const response = await deleteItemFromCart({ userId, productId });
      res.status(response.status).send(response.data);
    } catch (error) {
      res.status(500).send({ data: "Internal Server Error" });
    }
  },
);

router.delete("/", valaidataJwt, async (req: extendedRequest, res) => {
  try {
    const userId = req.user._id;
    const response = await clearCart({ userId });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send({ data: "Internal Server Error" });
  }
});

router.post("/checkout", valaidataJwt, async (req: extendedRequest, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;
    const response = await checkout({ userId, address });
    res.status(response.status).send(response.data);
  } catch (error) {
    res.status(500).send({ data: "Internal Server Error" });
  }
});

export default router;
