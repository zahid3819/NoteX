import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";

import { connectDb } from "@/lib/db";
import { User } from "@/lib/models/User";
import { registerSchema } from "@/lib/validation/authSchemas";
import { getCookieOptions, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    await connectDb();

    const existing = await User.findOne({ email: parsed.email }).select("+passwordHash");
    if (existing) {
      if (existing.passwordHash) {
        return NextResponse.json({ message: "Email already in use" }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(parsed.password, 12);
      existing.name = parsed.name;
      existing.passwordHash = passwordHash;
      await existing.save();

      const token = signToken(existing._id.toString());
      const res = NextResponse.json(
        { user: { id: existing._id.toString(), name: existing.name, email: existing.email } },
        { status: 200 }
      );

      res.cookies.set("token", token, getCookieOptions());
      return res;
    }

    const passwordHash = await bcrypt.hash(parsed.password, 12);
    const user = await User.create({ name: parsed.name, email: parsed.email, passwordHash });

    const token = signToken(user._id.toString());
    const res = NextResponse.json(
      { user: { id: user._id.toString(), name: user.name, email: user.email } },
      { status: 201 }
    );

    res.cookies.set("token", token, getCookieOptions());
    return res;
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", issues: err.issues }, { status: 400 });
    }

    console.error(err);

    if (process.env.NODE_ENV !== "production" && err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
