import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ message: "Not found" }, { status: 404 });
}

export async function POST() {
  return NextResponse.json({ message: "Not found" }, { status: 404 });
}
