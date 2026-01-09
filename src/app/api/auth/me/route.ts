import { NextResponse } from "next/server";
import { getAuthedUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthedUser();
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user }, { status: 200 });
}
