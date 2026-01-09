"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, NotebookPen } from "lucide-react";

import type { User } from "@/lib/types";
import { SidebarNav } from "@/components/SidebarNav";
import { UserMenu } from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function AppShell({ user, children }: { user: User; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_10%_0%,rgba(99,102,241,0.14),transparent_40%),radial-gradient(900px_circle_at_90%_20%,rgba(236,72,153,0.12),transparent_45%),radial-gradient(1000px_circle_at_40%_100%,rgba(34,197,94,0.08),transparent_45%)]">
      <div className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="md:hidden">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white">
                      <NotebookPen className="h-4 w-4" />
                    </span>
                    NoteX
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <SidebarNav />
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/notes" className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-sm">
                <NotebookPen className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold tracking-tight text-zinc-900">NoteX</span>
            </Link>
          </div>

          <UserMenu user={user} />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 md:grid-cols-[240px_1fr]">
        <aside className="hidden self-start rounded-3xl border border-zinc-200/70 bg-white/70 p-3 shadow-sm backdrop-blur md:sticky md:top-20 md:block md:h-[calc(100svh-5rem)] md:overflow-y-auto">
          <SidebarNav />
        </aside>

        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="min-w-0"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
