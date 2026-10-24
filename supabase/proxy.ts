import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseConfig } from "@/lib/supabase/env";

const PROTECTED_ROUTES = ["/dashboard", "/groups", "/wallet", "/activity"];

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/change-password",
];

export async function updateSupabaseSession(request: NextRequest) {
  const { url, publishableKey } = getSupabaseConfig();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },

      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({ request });

        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Validate the JWT and refresh the session if necessary.
  const { data, error } = await supabase.auth.getClaims();

  const isAuthenticated = !error && Boolean(data?.claims?.sub);
  const pathname = request.nextUrl.pathname;

  const matchesRoute = (routes: string[]) =>
    routes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

  const isProtectedRoute = matchesRoute(PROTECTED_ROUTES);
  const isAuthRoute = matchesRoute(AUTH_ROUTES);

  // Root route: choose the welcome page or dashboard.
  if (pathname === "/") {
    const destination = request.nextUrl.clone();

    destination.pathname = isAuthenticated ? "/dashboard" : "/welcome";
    destination.search = "";

    return NextResponse.redirect(destination);
  }

  // Signed-out visitors cannot access protected pages.
  if (isProtectedRoute && !isAuthenticated) {
    const destination = request.nextUrl.clone();

    destination.pathname = "/login";
    destination.search = "";
    destination.searchParams.set(
      "next",
      `${pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(destination);
  }

  // Signed-in users should not need to revisit auth pages.
  if (isAuthRoute && isAuthenticated) {
    const destination = request.nextUrl.clone();

    destination.pathname = "/dashboard";
    destination.search = "";

    return NextResponse.redirect(destination);
  }

  return response;
}
