import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";

import { connectDb } from "@/lib/db";
import { User } from "@/lib/models/User";
import { loginSchema } from "@/lib/validation/authSchemas";
import { getCookieOptions, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.parse(body);

    await connectDb();

    const user = await User.findOne({ email: parsed.email }).select("+passwordHash");
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken(user._id.toString());
    const res = NextResponse.json(
      { user: { id: user._id.toString(), name: user.name, email: user.email } },
      { status: 200 }
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
