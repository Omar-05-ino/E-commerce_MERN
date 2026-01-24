import express from "express";
import { addItemToCart, clearCart, deleteItemFromCart, getActiveCartForUser, updateItemInCart } from "../services/cartService";
import valaidataJwt from "../middlewares/validateJWT";
import { extendedRequest } from "../types/extendedRequest";

const router = express.Router();

router.get("/", valaidataJwt, async (req: extendedRequest, res) => {
  const userId = req.user._id;
  const cart = await getActiveCartForUser({ userId });
  res.status(200).send(cart);
});

router.post("/items", valaidataJwt, async (req: extendedRequest, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const response = await addItemToCart({ userId, productId, quantity });
  res.status(response.status).send(response.data);
});

router.put("/items", valaidataJwt, async (req: extendedRequest, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const response = await updateItemInCart({ userId, productId, quantity });
  res.status(response.status).send(response.data);
});

router.delete("/items/:productId", valaidataJwt, async (req: extendedRequest, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const response = await deleteItemFromCart({ userId, productId });
    res.status(response.status).send(response.data);
});


router.delete("/", valaidataJwt, async (req: extendedRequest, res) => {
    const userId = req.user._id;
    const response = await clearCart({ userId });
    res.status(response.status).send(response.data);
});

export default router;
