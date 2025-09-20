"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  fallback = null, 
  redirectTo = "/signup" 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      toast.error("Please sign up to access this feature!", {
        icon: "🔒",
        style: {
          borderRadius: '10px',
          background: '#DC2626',
          color: '#fff',
        },
      });
      router.push(redirectTo);
    }
  }, [session, status, router, redirectTo]);

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // Show fallback if not authenticated
  if (!session) {
    return <>{fallback}</>;
  }

  // Render children if authenticated
  return <>{children}</>;
}
