import mongoose, { Schema } from "mongoose";

export type UserDoc = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: false, select: false },
  },
  { timestamps: true }
);

export const User = (mongoose.models.User as mongoose.Model<UserDoc>) || mongoose.model<UserDoc>("User", userSchema);
