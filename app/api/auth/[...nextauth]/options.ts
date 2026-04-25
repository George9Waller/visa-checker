import { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Dev account",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === (process.env.PLAYWRIGHT_AUTH_USER ?? "dev") &&
          credentials?.password === (process.env.PLAYWRIGHT_AUTH_PASSWORD ?? "dev")
        ) {
          return {
            id: process.env.PLAYWRIGHT_AUTH_USER_ID ?? "user-1",
            name: "Dev User",
            email: "dev@example.com",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, account, profile }: any) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile.id;
      }
      return token;
    },
    async session({ session, token, user }: any) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.id = token.sub;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};
