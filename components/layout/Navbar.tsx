'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, ShoppingBag, User, X, LayoutGrid, Target, Package, FlaskConical, Info, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/actions/auth'
import type { User as SupaUser } from '@supabase/supabase-js'
import { SITE } from '@/lib/constants'

const DRAWER_LINKS = [
  { label: 'Shop All', href: '/products', icon: LayoutGrid },
  { label: 'Health Goals', href: '/health-goals', icon: Target },
  { label: 'Bundles', href: '/bundles', icon: Package },
  { label: 'Science', href: '/science', icon: FlaskConical },
  { label: 'About', href: '/about', icon: Info },
]

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [user, setUser] = useState<SupaUser | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-[#F7F5F0]/95 backdrop-blur border-b border-black/5 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
          <Link href="/" className="text-lg font-bold tracking-tight text-[#1F2421] shrink-0">
            {SITE.name}
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-[#3F4744]">
            <Link href="/" className="font-medium text-[#1F2421]">Home</Link>
            <Link href="/products" className="hover:text-[#1F2421] transition-colors">Shop All</Link>
            <Link href="/science" className="hover:text-[#1F2421] transition-colors">Science</Link>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xs">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A928E]" />
              <input
                placeholder="Search wellness..."
                className="w-full bg-white border border-black/10 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:border-[#5F7A5B] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Link href="/cart" className="relative text-[#1F2421] hover:opacity-70 transition-opacity">
              <ShoppingBag size={19} />
              <span className="absolute -top-2 -right-2 bg-[#5F7A5B] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">0</span>
            </Link>
            <button onClick={() => setDrawerOpen(true)} className="text-[#1F2421] hover:opacity-70 transition-opacity">
              <User size={19} />
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-out drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">
            <div className="flex items-start justify-between px-6 py-6 border-b border-black/5">
              <div>
                <p className="font-bold text-[#1F2421]">Welcome</p>
                <p className="text-xs text-[#8A928E] mt-1">Manage your subscriptions</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="text-[#8A928E] hover:text-[#1F2421]">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col px-2 py-4">
              {DRAWER_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#1F2421] hover:bg-[#F7F5F0] rounded-lg transition-colors"
                >
                  <Icon size={16} className="text-[#5F7A5B]" />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto p-5 border-t border-black/5 space-y-3">
              {user ? (
                <form action={signOut}>
                  <button type="submit" className="text-xs uppercase tracking-widest text-red-500">Sign Out</button>
                </form>
              ) : (
                <div className="flex gap-4 mb-2">
                  <Link href="/login" onClick={() => setDrawerOpen(false)} className="text-sm font-medium text-[#1F2421]">Login</Link>
                  <Link href="/signup" onClick={() => setDrawerOpen(false)} className="text-sm text-[#8A928E]">Sign Up</Link>
                </div>
              )}

              <div className="bg-[#5F7A5B] rounded-xl p-4 flex items-center justify-between text-white">
                <div>
                  <p className="text-sm font-semibold">Subscribed?</p>
                  <p className="text-xs opacity-80">Save 15% on monthly refills</p>
                </div>
                <RefreshCw size={16} />
              </div>

              <Link
                href="/products"
                onClick={() => setDrawerOpen(false)}
                className="block text-center bg-[#1F2421] text-white rounded-xl py-3 text-sm font-medium"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}