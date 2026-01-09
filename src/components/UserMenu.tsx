"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, NotebookText, UserRound } from "lucide-react";
import type { User } from "@/lib/types";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/Spinner";

type Props = {
  user: User;
};

export const UserMenu = ({ user }: Props) => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = useMemo(() => {
    const parts = user.name.trim().split(/\s+/);
    return (parts[0]?.[0] || "U").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  }, [user.name]);

  const onLogout = async () => {
    try {
      setLoggingOut(true);
      await api.logout();
      router.replace("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
        >
          {loggingOut ? <Spinner className="h-4 w-4" /> : <span className="text-xs font-semibold">{initials}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white">
              <UserRound className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-zinc-900">{user.name}</div>
              <div className="truncate text-xs text-zinc-500">{user.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            router.push("/notes");
          }}
        >
          <NotebookText className="h-4 w-4" />
          Notes
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-rose-600 focus:text-rose-600"
          disabled={loggingOut}
          onSelect={() => {
            void onLogout();
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
