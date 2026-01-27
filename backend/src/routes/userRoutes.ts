import express from "express";
import { login, register } from "../services/userService";

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

export default router;
