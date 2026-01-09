import { NextResponse } from "next/server";
import { getCookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });
  res.cookies.set("token", "", { ...getCookieOptions(), maxAge: 0 });
  return res;
}
