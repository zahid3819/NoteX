import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDb } from "./db";
import { User } from "./models/User";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required");
  return secret;
};

export const signToken = (userId: string) => {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: "7d" });
};

export const getCookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  };
};

export const getAuthedUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      const payload = jwt.verify(token, getJwtSecret()) as { sub?: string };
      if (!payload?.sub) return null;

      await connectDb();
      const user = await User.findById(payload.sub).select("_id name email").lean();
      if (!user) return null;

      return { id: user._id.toString(), name: user.name, email: user.email };
    } catch {
      return null;
    }
  }
  return null;
};
