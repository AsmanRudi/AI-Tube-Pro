import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/scripts/:path*",
    "/seo/:path*",
    "/thumbnail/:path*",
    "/voice/:path*",
    "/api-key/:path*",
    "/settings/:path*",
    "/billing/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};

