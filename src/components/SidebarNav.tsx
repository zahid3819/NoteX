"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Archive, NotebookText, Star } from "lucide-react";

import { cn } from "@/lib/utils";

const itemClass = (isActive: boolean) =>
  cn(
    "flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 text-sm transition-colors",
    isActive
      ? "bg-zinc-900 text-white shadow-sm"
      : "text-zinc-700 hover:bg-zinc-100/70"
  );

const left = "flex items-center gap-2";

export const SidebarNav = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isNotes = pathname.startsWith("/notes");
  const favorite = searchParams.get("favorite");
  const archived = searchParams.get("archived");

  const active = !isNotes
    ? "all"
    : favorite === "true"
      ? "favorites"
      : archived === "true"
        ? "archived"
        : "all";

  return (
    <nav className="space-y-1">
      <Link className={itemClass(active === "all")} href="/notes">
        <span className={left}>
          <NotebookText className="h-4 w-4" />
          All Notes
        </span>
      </Link>
      <Link className={itemClass(active === "favorites")} href="/notes?favorite=true">
        <span className={left}>
          <Star className="h-4 w-4" />
          Favorites
        </span>
      </Link>
      <Link className={itemClass(active === "archived")} href="/notes?archived=true">
        <span className={left}>
          <Archive className="h-4 w-4" />
          Archived
        </span>
      </Link>
    </nav>
  );
};
