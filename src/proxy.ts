import { NextResponse, type NextRequest } from "next/server";
import { experiments, experimentsEnabled } from "@/config/experiments";

const MAX_AGE = 60 * 60 * 24 * 60; // 60 days — longer than any single test

/**
 * Assigns each visitor a sticky A/B variant per experiment. The cookie is set on
 * both the incoming request (so this very render uses it) and the response.
 */
export function proxy(request: NextRequest) {
  if (!experimentsEnabled) return NextResponse.next();

  const assigned: [string, string][] = [];
  for (const exp of Object.values(experiments)) {
    const forced = request.nextUrl.searchParams.get(exp.query);
    const current = request.cookies.get(exp.cookie)?.value;
    const valid = (v?: string | null): v is string => !!v && (exp.variants as readonly string[]).includes(v);
    if (valid(forced) && forced !== current) assigned.push([exp.cookie, forced]);
    else if (!valid(current)) assigned.push([exp.cookie, Math.random() < 0.5 ? "A" : "B"]);
  }
  if (!assigned.length) return NextResponse.next();

  for (const [name, value] of assigned) request.cookies.set(name, value);
  const response = NextResponse.next({ request });
  for (const [name, value] of assigned) {
    response.cookies.set(name, value, { maxAge: MAX_AGE, sameSite: "lax", path: "/", httpOnly: false });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)"],
};
