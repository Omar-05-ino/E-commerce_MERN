import { Request } from "express";

export interface extendedRequest extends Request {
  user?: any;
}
