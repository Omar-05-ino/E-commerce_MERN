import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";
import { extendedRequest } from "../types/extendedRequest";

const valaidataJwt = (
  req: extendedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.get("authorization");
  if (!authorizationHeader) {
    return res.status(403).send({ data: "Unauthorized: No token provided" });
  }
  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({ data: "Unauthorized: Invalid token" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "", async (err, payload) => {
    if (err) {
      return res.status(403).send({ data: "Unauthorized: Invalid token" });
    }

    if (!payload) {
      return res.status(403).send({ data: "Unauthorized: Invalid token" });
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
