"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Archive, ArrowLeft, RefreshCcw, Save, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Spinner } from "@/components/Spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { Note } from "@/lib/types";
import { useDebouncedValue } from "@/lib/useDebouncedValue";

export default function NoteEditorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const noteId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleInvalid, setTitleInvalid] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const debouncedTitle = useDebouncedValue(title, 600);
  const debouncedContent = useDebouncedValue(content, 600);

  const statusText = useMemo(() => {
    if (saving) return "Saving...";
    if (savedAt) return `Saved ${savedAt}`;
    return "";
  }, [saving, savedAt]);

  const load = useCallback(async () => {
    setError(null);
    try {
      setLoading(true);
      const n = await api.getNote(noteId);
      setNote(n);
      setTitle(n.title);
      setContent(n.content || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load note");
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const run = async () => {
      if (!note) return;

      const trimmedTitle = debouncedTitle.trim();
      const titleChanged = trimmedTitle.length > 0 && trimmedTitle !== note.title;
      const contentChanged = debouncedContent !== (note.content || "");

      setTitleInvalid(debouncedTitle.length > 0 && trimmedTitle.length === 0);

      const payload: { title?: string; content?: string } = {};
      if (titleChanged) payload.title = trimmedTitle;
      if (contentChanged) payload.content = debouncedContent;

      if (Object.keys(payload).length === 0) return;

      try {
        setSaving(true);
        const updated = await api.updateNote(note._id, payload);
        setNote(updated);
        setSavedAt(new Date().toLocaleTimeString());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save");
      } finally {
        setSaving(false);
      }
    };

    void run();
  }, [debouncedTitle, debouncedContent, note]);

  const toggleFavorite = async () => {
    if (!note) return;
    const prev = note;
    const next = !note.isFavorite;
    setNote({ ...note, isFavorite: next });
    try {
      const updated = await api.updateNote(note._id, { isFavorite: next });
      setNote(updated);
    } catch {
      setNote(prev);
    }
  };

  const toggleArchived = async () => {
    if (!note) return;
    const prev = note;
    const next = !note.isArchived;
    setNote({ ...note, isArchived: next });
    try {
      const updated = await api.updateNote(note._id, { isArchived: next });
      setNote(updated);
    } catch {
      setNote(prev);
    }
  };

  const onDelete = async () => {
    if (!note) return;
    try {
      await api.deleteNote(note._id);
      router.replace("/notes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-200/70 bg-white/70 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-3 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[320px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-5 text-rose-700 backdrop-blur-sm">
        <div className="text-sm font-medium">Something went wrong</div>
        <div className="mt-1 text-sm">{error}</div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={() => router.push("/notes")}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="secondary" onClick={load}>
            <RefreshCcw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!note) {
    return <div className="text-sm text-zinc-600">Note not found.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-3xl border border-zinc-200/70 bg-white/75 p-5 shadow-sm backdrop-blur-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
            Editor
            {saving ? (
              <Spinner className="h-4 w-4 text-zinc-500" />
            ) : (
              <Save className="h-4 w-4 text-zinc-400" />
            )}
          </div>
          <div className="mt-1 text-xs text-zinc-500">{statusText}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => router.push("/notes")}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="secondary" onClick={toggleFavorite}>
            <Star className="h-4 w-4" />
            {note.isFavorite ? "Unfavorite" : "Favorite"}
          </Button>
          <Button variant="secondary" onClick={toggleArchived}>
            <Archive className="h-4 w-4" />
            {note.isArchived ? "Unarchive" : "Archive"}
          </Button>
          <Button variant="danger" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-700">Title</div>
          <Input
            value={title}
            onChange={(e) => {
              const next = e.target.value;
              setTitle(next);
              setTitleInvalid(next.length > 0 && next.trim().length === 0);
            }}
            placeholder="Note title"
            className={titleInvalid ? "border-rose-300 focus:ring-rose-500/20" : ""}
          />
          {titleInvalid ? <div className="mt-1 text-xs text-rose-600">Title can’t be only spaces.</div> : null}
        </div>

        <div>
          <div className="mb-1 text-xs font-medium text-zinc-700">Content</div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={14}
            className="min-h-[320px]"
          />
        </div>
      </div>
    </motion.div>
  );
}
