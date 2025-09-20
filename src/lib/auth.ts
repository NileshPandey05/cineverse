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
        email: { label: "Email", type: "email", placeholder: "xyz@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 Authorization started");
        
        try {
          // Check if credentials exist
          if (!credentials) {
            console.log("❌ No credentials provided");
            throw new Error("No credentials provided");
          }

          console.log("📝 Credentials received:", {
            name: credentials.name,
            email: credentials.email,
            hasPassword: !!credentials.password
          });

          // Validate input using zod schema
          const parsed = CredentialSchema.safeParse(credentials);
          if (!parsed.success) {
            console.log("❌ Schema validation failed:", parsed.error.issues);
            throw new Error("Invalid credentials format");
          }

          const { name, email, password } = parsed.data;
          console.log("✅ Schema validation passed");

          // Test database connection
          try {
            await prisma.$connect();
            console.log("✅ Database connected successfully");
          } catch (dbError) {
            console.error("❌ Database connection failed:", dbError);
            throw new Error("Database connection failed");
          }

          // Check if user already exists
          console.log("🔍 Searching for user with email:", email);
          const existingUser = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true
            }
          });

          if (!existingUser) {
            // Create new user
            console.log("🔍 User not found, creating new user...");
            try {
              const hashedPassword = await bcrypt.hash(password, 12);
              const newUser = await prisma.user.create({
                data: { 
                  name, 
                  email, 
                  password: hashedPassword 
                },
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              });
              
              console.log("✅ New user created successfully:", newUser.id);
              return {
                id: String(newUser.id), // Ensure string type
                name: newUser.name,
                email: newUser.email,
              };
            } catch (createError) {
              console.error("❌ User creation failed:", createError);
              throw new Error("Failed to create user");
            }
          }

          // User exists, validate password
          console.log("🔍 User found, validating password...");
          const isPasswordValid = await bcrypt.compare(password, existingUser.password);
          
          if (!isPasswordValid) {
            console.log("❌ Password validation failed");
            throw new Error("Invalid email or password");
          }

          console.log("✅ Password validated successfully");
          return {
            id: String(existingUser.id), // Ensure string type
            name: existingUser.name,
            email: existingUser.email,
          };

        } catch (error) {
          console.error("❌ Authorization error:", error);
          
          // Return null to indicate auth failure (don't throw)
          return null;
        } finally {
          // Always disconnect from database
          try {
            await prisma.$disconnect();
            console.log("🔌 Database disconnected");
          } catch (disconnectError) {
            console.error("⚠️ Database disconnect error:", disconnectError);
          }
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/signup",
    error: "/signup", // Redirect errors to signup page
  },

  callbacks: {
    async jwt({ token, user }) {
      console.log("🔍 JWT callback triggered");
      if (user) {
        console.log("✅ User data added to token");
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    
    async session({ session, token }) {
      console.log("🔍 Session callback triggered");
      if (session?.user && token) {
        console.log("✅ Session updated with token data");
        session.user.id = String(token.id) || "";
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  
  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
  
  // Add custom error handling
  events: {
    async signIn({ user, isNewUser }) {
      console.log(`✅ User signed in: ${user.email} ${isNewUser ? '(new user)' : '(existing user)'}`);
    },
  },
};