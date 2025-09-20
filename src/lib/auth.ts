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
        name: { label: "Name", placeholder: "Username" },
        email: { label: "Email", placeholder: "xyz@gmail.com" },
        password: { label: "Password" },
      },
      async authorize(credentials) {
        try {
          console.log("Auth attempt with credentials:", { 
            email: credentials?.email, 
            hasPassword: !!credentials?.password 
          });

          // Validate input using zod schema
          const parsed = CredentialSchema.safeParse(credentials);
          if (!parsed.success) {
            console.error("Validation failed:", parsed.error);
            throw new Error("Invalid credentials format");
          }

          const { name, email, password } = parsed.data;

          // Check if user already exists
          const user = await prisma.user.findUnique({
            where: { email },
          });

          // If user not found → create new one
          if (!user) {
            console.log("Creating new user for email:", email);
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
              data: { name, email, password: hashedPassword },
            });

            return { 
              id: String(newUser.id), 
              name: newUser.name, 
              email: newUser.email 
            };
          }

          // If user exists → check password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.error("Invalid password for user:", email);
            throw new Error("Invalid email or password");
          }

          console.log("User authenticated successfully:", email);
          return { 
            id: String(user.id), 
            name: user.name, 
            email: user.email 
          };
        } catch (err) {
          console.error("Auth Error:", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/signup",
    error: "/auth/error", // Add error page
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
      if (session?.user && token) {
        session.user.id = String(token.id);
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },

  // Add these important production settings
  secret: process.env.NEXTAUTH_SECRET,
  
  // Enable debug in development only
  debug: process.env.NODE_ENV === "development",
  
  // Configure cookies for production
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" 
        ? "__Secure-next-auth.session-token" 
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};