"use client";
import Image from "next/image";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export function NavbarDemo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState(""); 
  const router = useRouter();
  const { data: session } = useSession();

  // Base nav items - only show if logged in
  const navItems = session?.user
    ? [
        { name: "TvShow", link: "/tvshow" },
        { name: "Movies", link: "/movie" },
        { name: "Favorites", link: "/favorites" },
        { name: "WatchList", link: "/watchlist" }
      ]
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated before allowing search
    if (!session?.user) {
      toast.error("Please sign up to search movies and shows!", {
        icon: "🔍",
        style: {
          borderRadius: '10px',
          background: '#DC2626',
          color: '#fff',
        },
      });
      router.push("/signup");
      return;
    }

    if (!search.trim()) {
      toast.error("Please enter something to search!");
      return;
    }

    router.push(`/search?query=${encodeURIComponent(search)}`);
    setSearch("");
    setIsMobileMenuOpen(false);
  };

  // Handle protected navigation
  // const handleProtectedNavigation = (link: string, e: React.MouseEvent) => {
  //   if (!session?.user) {
  //     e.preventDefault();
  //     toast.error("Please sign up to access this page!", {
  //       icon: "🔒",
  //       style: {
  //         borderRadius: '10px',
  //         background: '#DC2626',
  //         color: '#fff',
  //       },
  //     });
  //     router.push("/signup");
  //   }
  // };

  const AuthButtons = () => (
    session?.user ? (
      <div className="flex items-center gap-4">
        <ModeToggle />
        <button
          onClick={() => {
            signOut();
            toast.success("Signed out successfully!", {
              icon: "👋",
            });
          }}
          className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-500 transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    ) : (
      <Link href={"/signup"}>
        <button className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-pink-600 text-white font-medium hover:from-blue-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
          Sign Up
        </button>
      </Link>
    )
  );

  return (
    <div className="relative w-full">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image src="/logo.png" width={70} height={70} alt="CineVerse Logo" />
              <p className="mt-2 font-bold text-gray-900 dark:text-white">CineVerse</p>
            </Link>

            {/* Navigation Items - Only show if authenticated */}
            {session?.user && (
              <div className="flex items-center space-x-8">
                {navItems.map((item, idx) => (
                  <Link
                    key={`nav-item-${idx}`}
                    href={item.link}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Search and Auth */}
            <div className="flex items-center gap-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={session?.user ? "Search..." : "Sign up to search"}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!session?.user}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </form>
              <AuthButtons />
            </div>
          </div>

          {/* Mobile Navigation Header */}
          <div className="md:hidden flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" width={60} height={60} alt="CineVerse Logo" />
              <p className="mt-2 font-bold text-gray-900 dark:text-white text-sm">CineVerse</p>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900">
              {/* Mobile Navigation Links - Only show if authenticated */}
              {session?.user ? (
                navItems.map((item, idx) => (
                  <Link
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                  Sign up to access navigation
                </div>
              )}

              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={session?.user ? "Search..." : "Sign up to search"}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!session?.user}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                </form>
              </div>

              <div className="px-3 py-2">
                <AuthButtons />
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}