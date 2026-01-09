export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_10%_0%,rgba(99,102,241,0.18),transparent_40%),radial-gradient(900px_circle_at_90%_20%,rgba(236,72,153,0.14),transparent_45%),radial-gradient(900px_circle_at_40%_100%,rgba(34,197,94,0.10),transparent_45%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 sm:px-6">
        <div className="w-full rounded-[28px] border border-zinc-200/70 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
