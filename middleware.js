import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Protect /mon-compte path when there is no session
    if (req.nextUrl.pathname.startsWith("/mon-compte") && !token) {
      return NextResponse.redirect(new URL("/connecter", req.url));
    }

    // Protect /dashboard path based on user's role
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/connecter", req.url));
      }
      if (token.role !== "ADMIN" && token.role !== "STAFF") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ["/dashboard/:path*", "/mon-compte/:path*"] };
