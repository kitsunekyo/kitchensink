import { User } from "@kitchensink/api-types";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  picture: String,
});

export const UserModel = mongoose.model<User & mongoose.Document>("User", userSchema);