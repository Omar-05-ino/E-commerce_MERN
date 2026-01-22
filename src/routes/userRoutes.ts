import express from "express";
import { login, register } from "../services/userService";

const router = express.Router();

router.post("/register", async (req, res) => {
  const reqdata = req.body;
  const { status, data } = await register(reqdata);
  res.status(status).send(data);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { status, data } = await login({ email, password });
  res.status(status).send(data);
});

export default router;
