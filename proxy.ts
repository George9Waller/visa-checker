import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

function getLocaleFromPath(pathname: string) {
  const match = pathname.match(/^\/(en|fr)(?:\/|$)/);
  return (match?.[1] as (typeof routing.locales)[number] | undefined) ?? routing.defaultLocale;
}

function isPublicPath(pathname: string, locale: string) {
  return (
    pathname === `/${locale}/signin` ||
    pathname.startsWith(`/${locale}/signin/`) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/dev-login")
  );
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  const i18nResponse = handleI18n(request);
  if (i18nResponse.status >= 300 && i18nResponse.status < 400) {
    return i18nResponse;
  }

  const locale = getLocaleFromPath(request.nextUrl.pathname);
  if (isPublicPath(pathname, locale)) {
    return i18nResponse;
  }

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  const token = secret
    ? await getToken({ req: request, secret })
    : null;

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/signin`, request.url));
  }

  return i18nResponse;
}

export const config = {
  matcher: [
    "/((?!api/auth|api/dev-login|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
