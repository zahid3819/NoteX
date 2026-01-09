import { NextResponse } from "next/server";

const allowed = new Set(["google", "facebook", "linkedin", "twitter"]);

export async function GET(req: Request, ctx: { params: Promise<{ provider: string }> }) {
  const { provider } = await ctx.params;

  if (!allowed.has(provider)) {
    return NextResponse.json({ message: "Unsupported provider" }, { status: 400 });
  }

  const referer = req.headers.get("referer") || "";
  const basePath = referer.includes("/register") ? "/register" : "/login";

  const url = new URL(basePath, req.url);
  url.searchParams.set("oauth", "not_configured");
  url.searchParams.set("provider", provider);

  return NextResponse.redirect(url);
}
