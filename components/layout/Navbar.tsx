"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/actions/auth";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient()

    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Get first letter of email
  const userInitial = user?.email?.charAt(0).toUpperCase()

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white border-b border-gray-200 shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Left — Brand Name */}
        <Link
          href="/"
          className={`text-lg font-black tracking-widest uppercase transition-colors duration-500 ${
            scrolled ? "text-gray-900" : "text-white"
          }`}
        >
          Cloth Brand
        </Link>

        {/* Center — Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Shop", "New Arrivals", "Sale"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              className={`text-xs tracking-widest uppercase transition-colors duration-500 hover:opacity-60 ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right — Icons */}
        <div className="flex items-center gap-5">
          <button
            className={`transition-colors duration-500 hover:opacity-60 ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            <Search size={18} />
          </button>

          <Link
            href="/cart"
            className={`relative transition-colors duration-500 hover:opacity-60 ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            <ShoppingBag size={18} />
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              0
            </span>
          </Link>

          {/* User Avatar or Icon */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold tracking-widest transition-all ${
                  scrolled
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {userInitial}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-44 bg-white border border-gray-200 shadow-lg z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-xs tracking-widest uppercase text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-3 text-xs tracking-widest uppercase text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    My Orders
                  </Link>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="w-full text-left px-4 py-3 text-xs tracking-widest uppercase text-red-500 hover:bg-gray-50 transition-colors border-t border-gray-100"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={`text-xs tracking-widest uppercase transition-colors duration-500 hover:opacity-60 ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Login
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className={`md:hidden transition-colors duration-500 ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className={`md:hidden px-6 pt-4 pb-6 flex flex-col gap-4 border-t mt-3 ${
            scrolled ? "bg-white border-gray-200" : "bg-black/80 border-white/10"
          }`}
        >
          {["Categories", "New Arrivals", "Sale"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(" ", "-")}`}
              onClick={() => setMenuOpen(false)}
              className={`text-xs tracking-widest uppercase ${
                scrolled ? "text-gray-900" : "text-white"
              }`}
            >
              {item}
            </Link>
          ))}
          <div className={`border-t pt-4 flex gap-6 ${scrolled ? "border-gray-200" : "border-white/10"}`}>
            {user ? (
              <form action={signOut}>
                <button
                  type="submit"
                  className={`text-xs tracking-widest uppercase ${
                    scrolled ? "text-red-500" : "text-red-400"
                  }`}
                >
                  Sign Out
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className={`text-xs tracking-widest uppercase ${
                    scrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className={`text-xs tracking-widest uppercase ${
                    scrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}