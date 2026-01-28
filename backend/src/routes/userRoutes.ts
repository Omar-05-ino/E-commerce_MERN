import express from "express";
import { getMyOrders, login, register } from "../services/userService";
import valaidataJwt from "../middlewares/validateJWT";
import { extendedRequest } from "../types/extendedRequest";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const reqdata = req.body;
    const { status, data } = await register(reqdata);
    res.status(status).json(data);
  } catch (error) {
    res.status(500).send({ data: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const reqdata = req.body;
    const { status, data } = await login(reqdata);
    res.status(status).json(data);
  } catch (error) {
    res.status(500).send({ data: "Internal Server Error" });
  }
});

router.get("/order", valaidataJwt, async (req: extendedRequest, res) => {
  try {
    const userId = req.user._id;
    const { status, data } = await getMyOrders({ userId });
    res.status(status).send(data);
  } catch (error) {
    res.status(500).send({ data: "Internal Server Error" });
  }
});

export default router;
