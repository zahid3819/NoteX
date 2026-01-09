import { NextResponse } from "next/server";
import type { FilterQuery } from "mongoose";
import { ZodError } from "zod";

import { connectDb } from "@/lib/db";
import { getAuthedUser } from "@/lib/auth";
import { Note } from "@/lib/models/Note";
import type { NoteDoc } from "@/lib/models/Note";
import { createNoteSchema, listNotesQuerySchema } from "@/lib/validation/noteSchemas";

export async function GET(req: Request) {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const queryObj = Object.fromEntries(url.searchParams.entries());
    const query = listNotesQuerySchema.parse(queryObj);

    const pageNum = Math.max(parseInt(query.page || "1", 10), 1);
    const limitNum = Math.min(Math.max(parseInt(query.limit || "20", 10), 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const filter: FilterQuery<NoteDoc> = { userId: user.id as unknown as NoteDoc["userId"] };

    if (typeof query.favorite === "string") {
      if (query.favorite === "true") filter.isFavorite = true;
      if (query.favorite === "false") filter.isFavorite = false;
    }

    if (typeof query.archived === "string") {
      if (query.archived === "true") filter.isArchived = true;
      if (query.archived === "false") filter.isArchived = false;
    }

    if (query.tag) filter.tags = query.tag;

    if (query.q) {
      filter.$or = [
        { title: { $regex: query.q, $options: "i" } },
        { content: { $regex: query.q, $options: "i" } },
      ];
    }

    await connectDb();

    const [items, total] = await Promise.all([
      Note.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limitNum).lean(),
      Note.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        items,
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      { status: 200 }
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", issues: err.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getAuthedUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = createNoteSchema.parse(body);

    await connectDb();

    const note = await Note.create({
      userId: user.id,
      title: parsed.title,
      content: parsed.content || "",
      tags: parsed.tags || [],
      isFavorite: Boolean(parsed.isFavorite),
      isArchived: Boolean(parsed.isArchived),
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ message: "Validation error", issues: err.issues }, { status: 400 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
