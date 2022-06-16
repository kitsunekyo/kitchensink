import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import { UserModel } from "./db/User";
import {
  authorization,
  CustomRequest,
  jwtSecret,
} from "./middleware/authorization";


const app = express();
const port = process.env.PORT || 8080;
const clientId = process.env.CLIENT_ID;
const connectionString = process.env.MONGODB_URI;

const client = new OAuth2Client(process.env.CLIENT_ID);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/api/v1/auth/google", async (req: Request, res: Response) => {
  const { token: idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await UserModel.findOneAndUpdate(
      { email: payload.email },
      { name: payload.name, picture: payload.picture },
      { upsert: true }
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const token = jwt.sign(
      {
        user: {
          name: user.name,
          email: user.email,
          picture: user.picture,
          _id: user._id,
        },
      },
      jwtSecret || ''
    );
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ message: "successfully logged in" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/v1/auth/logout", (req: Request, res: Response) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "successfully logged out" });
});

app.get("/api/v1/me", authorization, (req: CustomRequest, res: Response) => {
  return res.json(req.user);
});

async function main() {
  if (!clientId || !connectionString || !jwtSecret) {
    throw new Error("Missing required environment variables");
  }

  await mongoose.connect(connectionString);
  console.log(`⚡️[db]: connected to mongodb`);

  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

main().catch((err) => console.log(err));
