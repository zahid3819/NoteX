import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { connectDb } from "@/lib/db";
import { getAuthedUser } from "@/lib/auth";
import { Note } from "@/lib/models/Note";
import { objectId, updateNoteSchema } from "@/lib/validation/noteSchemas";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await ctx.params;
    objectId.parse(id);

    await connectDb();

    const note = await Note.findOne({ _id: id, userId: user.id }).lean();
    if (!note) return NextResponse.json({ message: "Note not found" }, { status: 404 });

    return NextResponse.json({ note }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", issues: err.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await ctx.params;
    objectId.parse(id);

    const body = await req.json();
    const updates = updateNoteSchema.parse(body);

    await connectDb();

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: user.id },
      { $set: updates },
      { new: true }
    ).lean();

    if (!note) return NextResponse.json({ message: "Note not found" }, { status: 404 });

    return NextResponse.json({ note }, { status: 200 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", issues: err.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await ctx.params;
    objectId.parse(id);

    await connectDb();

    const note = await Note.findOneAndDelete({ _id: id, userId: user.id }).lean();
    if (!note) return NextResponse.json({ message: "Note not found" }, { status: 404 });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", issues: err.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
