"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FilePlus2, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { NoteCard } from "@/components/NoteCard";
import { Spinner } from "@/components/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Note } from "@/lib/types";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

export default function NotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const favorite = searchParams.get("favorite") === "true";
  const archived = searchParams.get("archived") === "true";

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const title = useMemo(() => {
    if (favorite) return "Favorites";
    if (archived) return "Archived";
    return "All Notes";
  }, [favorite, archived]);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        setLoading(true);
        const data = await api.listNotes({
          page: 1,
          limit: 50,
          q: debouncedQuery || undefined,
          favorite: favorite ? true : undefined,
          archived: archived ? true : undefined,
        });
        setItems(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [debouncedQuery, favorite, archived]);

  const onCreate = async () => {
    try {
      setCreating(true);
      const note = await api.createNote({ title: "Untitled" });
      router.push(`/notes/${note._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create note");
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xl font-semibold text-zinc-900">{title}</div>
          <div className="mt-1 text-sm text-zinc-600">Search, create, and manage your notes.</div>
        </div>
        <Button onClick={onCreate} disabled={creating}>
          {creating ? (
            <>
              <Spinner className="h-4 w-4" />
              Creating...
            </>
          ) : (
            <>
              <FilePlus2 className="h-4 w-4" />
              New note
            </>
          )}
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or content..."
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setQuery("");
            router.refresh();
          }}
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-zinc-200/70 bg-white/70 p-4"
            >
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-5/6" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-zinc-200/70 bg-white/70 p-10 text-center backdrop-blur-sm">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-zinc-900 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="mt-4 text-sm font-medium text-zinc-900">No notes yet</div>
          <div className="mt-1 text-sm text-zinc-600">Create your first note to get started.</div>
          <div className="mt-6">
            <Button onClick={onCreate} disabled={creating}>
              <FilePlus2 className="h-4 w-4" />
              Create a note
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((n) => (
            <NoteCard key={n._id} note={n} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
