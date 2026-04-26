import { NextRequest, NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { seedDevLoginData } from "./seed";

const getCookieName = (request: NextRequest) =>
  request.nextUrl.protocol === "https:"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

export async function POST(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing auth secret" }, { status: 500 });
  }

  await seedDevLoginData();

  const token = await encode({
    token: {
      sub: process.env.PLAYWRIGHT_AUTH_USER_ID ?? "user-1",
      name: "Dev User",
      email: "dev@example.com",
    },
    secret,
  });

  const referer = request.headers.get("referer") ?? "";
  const refererLocale = referer.match(/\/(en|fr)(?:\/|$)/)?.[1];
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const locale =
    refererLocale === "fr" || refererLocale === "en"
      ? refererLocale
      : cookieLocale === "fr" || cookieLocale === "en"
        ? cookieLocale
        : "en";

  const response = NextResponse.redirect(new URL(`/${locale}`, request.url));
  response.cookies.set({
    name: getCookieName(request),
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: request.nextUrl.protocol === "https:",
  });

  return response;
}
