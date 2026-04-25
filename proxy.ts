import { withAuth as proxy } from "next-auth/middleware";

export default proxy({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: [
    "/((?!api/auth|api/dev-login|_next/static|_next/image|favicon.ico|signin).*)",
  ],
};
