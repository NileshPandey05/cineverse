"use client"

import Banner from "@/components/Banner"
import { NavbarDemo } from "@/components/Navbar"

export default function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh]">
      {/* Banner with Movies */}
      <Banner />

      {/* Overlay Navbar */}
      <div className="absolute top-0 left-0 w-full z-20">
        <NavbarDemo />
      </div>
    </section>
  )
}
