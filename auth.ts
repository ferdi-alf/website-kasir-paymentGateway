import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./lib/zod";
import prisma from "./lib/prisma";
import { compareSync } from "bcrypt-ts";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: { signIn: "/" },
  session: { strategy: "jwt", maxAge: 6 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validateFields = LoginSchema.safeParse(credentials);
        if (!validateFields.success) {
          return null;
        }

        const { username, password } = validateFields.data;

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user || !user.password) {
          throw new Error("No User found");
        }

        const passwordMatch = compareSync(password, user.password);

        if (!passwordMatch) return null;

        return {
          ...user,
          username: user.username || "",
        };
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      // Hanya return true/false, bukan redirect
      return !!auth?.user;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username; // <-- ini kamu salah ketik, kamu isi 2x token.role
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.username = token.username;
      return session;
    },
  },
});
