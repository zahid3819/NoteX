import { z } from "zod";

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const listNotesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional(),
  tag: z.string().optional(),
  favorite: z.string().optional(),
  archived: z.string().optional(),
});

export const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(20000).optional(),
  tags: z.array(z.string().min(1).max(40)).max(20).optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export const updateNoteSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().max(20000).optional(),
    tags: z.array(z.string().min(1).max(40)).max(20).optional(),
    isFavorite: z.boolean().optional(),
    isArchived: z.boolean().optional(),
  })
  .refine((val) => Object.keys(val).length > 0, { message: "No update fields provided" });
