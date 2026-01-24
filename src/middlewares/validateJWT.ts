import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";

export interface extendedRequest extends Request {
  user?: any;
}

const valaidataJwt = (
  req: extendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.get("authorization");
  if (!authorizationHeader) {
    return res.status(403).send({ message: "Unauthorized: No token provided" });
  }
  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "Unauthorized: Invalid token" });
  }

  jwt.verify(token, "8b18e2a1d7f8a0b83d7265d7", async (err, payload) => {
    if (err) {
      return res.status(403).send({ message: "Unauthorized: Invalid token" });
    }

    if (!payload) {
      return res.status(403).send({ message: "Unauthorized: Invalid token" });
    }
    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };
    //fatch user from database based on the payload
    const user = await UserModel.findOne({ email: userPayload.email });
    req.user = user;
    next();
  });
};

export default valaidataJwt;
