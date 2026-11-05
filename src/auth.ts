import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "DummyJSON",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;

        if (typeof username !== "string" || typeof password !== "string") {
          return null;
        }

        try {
          const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, expiresInMins: 60 }),
            cache: "no-store",
          });

          if (!response.ok) {
            return null;
          }

          const result = (await response.json()) as {
            id: number;
            username: string;
            firstName: string;
            lastName: string;
            email: string;
            image: string;
            accessToken: string;
          };

          if (!result.accessToken) {
            return null;
          }

          const user = {
            id: String(result.id),
            name: `${result.firstName} ${result.lastName}`,
            email: result.email,
            image: result.image,
            username: result.username,
            accessToken: result.accessToken,
          };

          return user;
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : "";
      session.user.id = typeof token.sub === "string" ? token.sub : "";
      session.user.username = typeof token.username === "string" ? token.username : "";
      return session;
    },
  },
});
