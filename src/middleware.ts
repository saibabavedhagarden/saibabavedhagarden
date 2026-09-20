import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Automatically redirect any *.vercel.app domain to custom domain www.saibabavedhagarden.com
  if (host.includes(".vercel.app")) {
    const url = request.nextUrl.clone();
    url.host = "www.saibabavedhagarden.com";
    url.protocol = "https";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, _next, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
