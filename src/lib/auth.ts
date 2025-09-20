import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { CredentialSchema } from "./types";
import { NextAuthOptions } from "next-auth";

export const AuthOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Username" },
        email: { label: "Email", type: "text", placeholder: "xyz@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate input using zod schema
          const parsed = CredentialSchema.safeParse(credentials);
          if (!parsed.success) throw new Error("Invalid credentials format");

          const { name, email, password } = parsed.data;

          // Check if user already exists
          const user = await prisma.user.findUnique({
            where: { email },
          });

          // If user not found → create new one
          if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
              data: { name, email, password: hashedPassword },
            });

            return { id: newUser.id, name: newUser.name, email: newUser.email };
          }

          // If user exists → check password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) throw new Error("Invalid email or password");

          return { id: user.id, name: user.name, email: user.email };
        } catch (err) {
          console.error("Auth Error:", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signup",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.email = token.email as string | undefined;
        session.user.name = token.name as string | undefined;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
