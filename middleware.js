import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Redirect logged-in users if they try to access /connecter or /inscription
    if (
      (req.nextUrl.pathname.startsWith("/connecter") ||
        req.nextUrl.pathname.startsWith("/inscription")) &&
      token
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect /mon-compte path when there is no session
    if (req.nextUrl.pathname.startsWith("/mon-compte") && !token) {
      return NextResponse.redirect(new URL("/connecter", req.url));
    }

    // Protect /dashboard path based on user's role
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      if (!token) {
        return NextResponse.redirect(new URL("/connecter", req.url));
      }

      // Allow non-admin users to access /dashboard (root page)
      if (req.nextUrl.pathname === "/dashboard") {
        return NextResponse.next();
      }

      // Restrict non-admin users from accessing any other /dashboard paths
      if (token.role !== "ADMIN" && token.role !== "STAFF") {
        // Allow /dashboard/commandes, restrict others
        if (!req.nextUrl.pathname.startsWith("/dashboard/vente")) {
          // Prevent redirect loop by checking if the user is already on the unauthorized page
          if (!req.nextUrl.pathname.startsWith("/dashboard/unauthorized")) {
            return NextResponse.redirect(
              new URL("/dashboard/unauthorized", req.url)
            );
          }
        }
      }
      if (token.role !== "ADMIN") {
        if (
          req.nextUrl.pathname.startsWith(
            "/dashboard/notre-staff/ajouter-admin"
          )
        ) {
          return NextResponse.redirect(
            new URL("/dashboard/unauthorized", req.url)
          );
        }
      }
    }

    // Allow the request to continue if no conditions are met
    return NextResponse.next();
  },
  {
    callbacks: {
      // Ensure only authorized users (with a token) can access protected routes
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*", // Protect all routes under /dashboard
    "/mon-compte/:path*", // Protect the user account page
    "/liste-denvies", // Example of other protected routes
    "/mes-commandes", // Example of other protected routes
    "/commander", // Example of other protected routes
  ],
};
