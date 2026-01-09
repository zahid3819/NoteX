import Link from "next/link";
import { motion } from "framer-motion";
import { Archive, Star } from "lucide-react";
import type { Note } from "@/lib/types";

import { Badge } from "@/components/ui/badge";

type Props = {
  note: Note;
};

export const NoteCard = ({ note }: Props) => {
  return (
    <Link
      href={`/notes/${note._id}`}
      className="group block cursor-pointer"
    >
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="cursor-pointer rounded-3xl border border-zinc-200/70 bg-white/80 p-4 shadow-sm backdrop-blur-sm hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-900">{note.title}</div>
            <div className="mt-1 text-sm text-zinc-600 [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
              {note.content || ""}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {note.isFavorite ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700">
                <Star className="h-4 w-4" />
              </span>
            ) : null}
            {note.isArchived ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-zinc-900/5 text-zinc-700">
                <Archive className="h-4 w-4" />
              </span>
            ) : null}
          </div>
        </div>

        {note.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {note.tags.slice(0, 4).map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </motion.div>
    </Link>
  );
};
