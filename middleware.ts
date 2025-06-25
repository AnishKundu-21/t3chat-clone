import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

/* -------------------------------------------------------------
   1.  Any path under /settings/** requires an authenticated user.
   2.  If a signed-in user hits /login or /signup, bounce them home.
   3.  Preserve the original URL in callbackUrl so we can return after login.
-------------------------------------------------------------- */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  const token = await getToken({ req })

  /* ───── protected area (/settings/**) ───── */
  if (pathname.startsWith("/settings")) {
    if (!token) {
      const loginUrl = new URL("/login", req.url)
      /* where to come back after successful login */
      loginUrl.searchParams.set("callbackUrl", pathname + search)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  /* ───── auth pages (/login, /signup) ───── */
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
}

/* Only run on these routes */
export const config = {
  matcher: ["/settings/:path*", "/login", "/signup"],
}
