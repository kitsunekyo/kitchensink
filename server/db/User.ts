import mongoose from "mongoose";

export interface User {
  _id: string;
  name: string;
  email: string;
  picture: string;
}

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  picture: String,
});

export const UserModel = mongoose.model<User & mongoose.Document>("User", userSchema);