import express from "express";
import { getActiveCartForUser } from "../services/cartService";

const router = express.Router();

router.get("/", async (req, res) => {
  //TODO : get userId form the jwt ,after valaidation middleware is implemented
  const cart = await getActiveCartForUser({ userId: "xxx" });
  res.status(200).send(cart);
});

export default router;
