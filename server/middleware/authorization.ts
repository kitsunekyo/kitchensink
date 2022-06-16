import { User } from "@kitchensink/api-types";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export interface CustomRequest extends Request {
  user?: User;
}

export const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("Missing required environment variables");
}

export const authorization = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  try {
    const data = jwt.verify(token, jwtSecret) as {
      user: User & mongoose.Document;
    };
    req.user = data.user;
    return next();
  } catch {
    return res.status(403).json({ message: "Unauthorized" });
  }
};
