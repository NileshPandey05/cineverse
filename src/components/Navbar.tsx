"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu
} from "@/components/ui/resizable-navbar";
import Image from "next/image";
import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { useRouter } from "next/navigation";

export function NavbarDemo() {
  const navItems = [
    { name: "TvShow", link: "/tvshow" },
    { name: "Movies", link: "/movie" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState(""); // search state
  const router = useRouter();

  // Handle search logic
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?query=${encodeURIComponent(search)}`);
    setSearch("");
    setIsMobileMenuOpen(false); // close mobile nav if open
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logo.png" width={70} height={70} alt="CineVerse Logo" />
            <p className="mt-2 font-bold">CineVerse</p>
          </div>

          {/* Nav Items */}
          <div className="flex items-center gap-8 ml-auto">
            <NavItems items={navItems} />
          </div>

          {/* Search Bar on Right */}
          <form onSubmit={handleSearch} className="flex items-center gap-6 ml-auto">
            <div className="relative w-full max-w-xs md:max-w-sm">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <ModeToggle />
              <NavbarButton variant="secondary">Login</NavbarButton>
              <NavbarButton variant="primary">SignUp</NavbarButton>
            </div>
          </form>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            {/* Logo */}
            <div className="flex items-center">
              <Image src="/logo.png" width={70} height={70} alt="CineVerse Logo" />
              <p className="mt-2 font-bold">CineVerse</p>
            </div>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative w-full mt-4">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            </form>

            {/* Auth Buttons */}
            <div className="flex w-full flex-col gap-4 mt-4">
              <ModeToggle />
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                SignUp
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
