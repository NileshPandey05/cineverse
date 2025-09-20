"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useAuthGuard = (redirectTo: string = "/signup") => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      toast.error("Please sign up to access this feature!", {
        icon: "🔒",
      });
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  return { session, status, isAuthenticated: !!session };
};
