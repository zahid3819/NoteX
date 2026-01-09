import type { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import LinkedInProvider from "next-auth/providers/linkedin";
import TwitterProvider from "next-auth/providers/twitter";

import { connectDb } from "@/lib/db";
import { User } from "@/lib/models/User";

const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("NEXTAUTH_SECRET (or AUTH_SECRET) is required for NextAuth");
}

const providers = [
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })
    : null,
  process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
    ? FacebookProvider({ clientId: process.env.FACEBOOK_CLIENT_ID, clientSecret: process.env.FACEBOOK_CLIENT_SECRET })
    : null,
  process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
    ? LinkedInProvider({ clientId: process.env.LINKEDIN_CLIENT_ID, clientSecret: process.env.LINKEDIN_CLIENT_SECRET })
    : null,
  process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET
    ? TwitterProvider({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        version: "2.0",
      })
    : null,
].filter(Boolean) as NonNullable<NextAuthOptions["providers"]>[number][];

export const authOptions: NextAuthOptions = {
  secret,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      await connectDb();

      const name = user.name?.trim() || user.email.split("@")[0] || "User";
      await User.findOneAndUpdate(
        { email: user.email },
        { $setOnInsert: { email: user.email }, $set: { name } },
        { upsert: true }
      );

      return true;
    },

    async jwt({ token }) {
      if (!token?.email) return token;

      await connectDb();
      const dbUser = await User.findOne({ email: token.email }).select("_id name email").lean();
      if (!dbUser) return token;

      token.uid = dbUser._id.toString();
      token.name = dbUser.name;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (typeof token.uid === "string") {
          (session.user as { id?: string }).id = token.uid;
        }
        if (typeof token.name === "string") {
          session.user.name = token.name;
        }
      }
      return session;
    },
  },
};
