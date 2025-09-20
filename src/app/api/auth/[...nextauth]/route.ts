import NextAuth from "next-auth";
import { AuthOption } from "@/lib/auth"; // adjust path as needed

const handler = NextAuth(AuthOption);
export { handler as GET, handler as POST };