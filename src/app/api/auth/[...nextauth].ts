import NextAuth from "next-auth";
import { AuthOption } from "@/lib/auth"; // adjust path as needed

export default NextAuth(AuthOption);