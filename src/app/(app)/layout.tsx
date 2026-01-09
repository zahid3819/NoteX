import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getServerUser } from "@/lib/serverAuth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerUser();
  if (!user) {
    redirect("/login");
  }

  return <AppShell user={user}>{children}</AppShell>;
}
