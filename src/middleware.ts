import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const isAdminRoute = pathname.startsWith("/admin");
    const isAthleteRoute = pathname.startsWith("/athlete");
    const isPublicAthleteRoute =
      pathname === "/athlete/inscription" || pathname.startsWith("/athlete/inscription/");
    const isPublicAdminRoute =
      pathname === "/admin/inscription" || pathname.startsWith("/admin/inscription/");
    const isLoginRoute = pathname === "/login" || pathname === "/athlete/login";

    // Les routes publiques sont accessibles sans authentification
    if (isPublicAthleteRoute || isPublicAdminRoute || isLoginRoute) {
      const response = NextResponse.next();
      // Ajouter un header pour que le layout puisse détecter la route
      response.headers.set("x-invoke-path", pathname);
      return response;
    }

    // Les autres routes athlète nécessitent une authentification
    if (isAthleteRoute && !token) {
      return NextResponse.redirect(new URL("/athlete/login", req.url));
    }

    // Vérifier que l'utilisateur connecté est bien un athlète pour les routes protégées
    if (isAthleteRoute && token) {
      const role = (token as { role?: string })?.role;
      if (role !== "ATHLETE") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    // Les routes admin nécessitent une authentification
    if (isAdminRoute && !isPublicAdminRoute) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      const role = (token as { role?: string })?.role;
      if (role === "ATHLETE") {
        return NextResponse.redirect(new URL("/athlete", req.url));
      }
    }

    return NextResponse.next();
  },
  {
      callbacks: {
        authorized: ({ token, req }) => {
          const pathname = req.nextUrl.pathname;
          const isAdminRoute = pathname.startsWith("/admin");
          const isAthleteRoute = pathname.startsWith("/athlete");
          const isPublicAthleteRoute =
            pathname === "/athlete/inscription" || pathname.startsWith("/athlete/inscription/");
          const isPublicAdminRoute =
            pathname === "/admin/inscription" || pathname.startsWith("/admin/inscription/");
          const isLoginRoute = pathname === "/login" || pathname === "/athlete/login";

          // Les routes publiques sont accessibles sans authentification
          if (isPublicAthleteRoute || isPublicAdminRoute || isLoginRoute) {
            return true;
          }

          // Les autres routes nécessitent une authentification
          if (isAdminRoute || isAthleteRoute) {
            return !!token;
          }

          return true;
        },
      },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/athlete/:path*", "/login"],
};

