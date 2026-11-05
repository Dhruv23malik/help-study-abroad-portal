import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const PORTAL_DEMO_EMAIL = "admin@helpstudyabroad.in";
const PORTAL_DEMO_PASSWORD = "StudyAbroad@123";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "DummyJSON",
      credentials: {
        email: { label: "Admin email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (
          typeof email !== "string" ||
          typeof password !== "string" ||
          email.trim().toLowerCase() !== PORTAL_DEMO_EMAIL ||
          password !== PORTAL_DEMO_PASSWORD
        ) {
          return null;
        }

        try {
          const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // The portal alias is checked above; DummyJSON requires its own seeded username/password.
            body: JSON.stringify({ username: "emilys", password: "emilyspass", expiresInMins: 60 }),
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
            name: "Help Study Abroad Admin",
            email: PORTAL_DEMO_EMAIL,
            image: "",
            username: "admin",
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
