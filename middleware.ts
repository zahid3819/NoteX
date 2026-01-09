import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/notes/:path*", "/login", "/register"],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const isAuthed = Boolean(token);
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (!isAuthed && pathname.startsWith("/notes")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthed && isAuthRoute) {
    const url = req.nextUrl.clone();
    url.pathname = "/notes";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
