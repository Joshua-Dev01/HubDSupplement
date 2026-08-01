'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  LogOut,
  Search,
  ShoppingCart,
  UserCircle,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { SITE } from '@/lib/constants'
import { adminLogout } from '@/actions/admin-auth'

const NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Customers', href: '/admin/customers', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false) // desktop icon-only mode

  async function handleLogout() {
    await adminLogout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex">
      {/* Desktop sidebar — fixed, collapsible between full and icon-only */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-black/5 flex-col shrink-0 z-40 transition-all duration-200 ${
          collapsed ? 'w-[72px]' : 'w-60'
        }`}
      >
        <div className={`p-6 border-b border-black/5 flex items-center ${collapsed ? 'justify-center px-3' : 'justify-between'}`}>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-[#1F2421] truncate">{SITE.name}</p>
              <p className="text-xs text-[#8A928E] uppercase tracking-widest truncate">Admin Intelligence</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="text-[#8A928E] hover:text-[#1F2421] transition-colors shrink-0"
          >
            {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          </button>
        </div>

        <nav className="flex flex-col p-3 gap-1 overflow-y-auto">
          {NAV.map(({ label, href, icon: Icon }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link
                key={label}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center rounded-lg text-sm transition-colors ${
                  collapsed ? 'justify-center py-2.5 px-0' : 'gap-3 px-4 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#DCE5D3] text-[#1F2421] font-medium'
                    : 'text-[#3F4744] hover:bg-[#F7F5F0] hover:text-[#1F2421]'
                }`}
              >
                <Icon size={16} className="text-[#5F7A5B] shrink-0" />
                {!collapsed && label}
              </Link>
            )
          })}
        </nav>

        <div className={`mt-auto p-4 border-t border-black/5 flex flex-col gap-3 ${collapsed ? 'items-center' : ''}`}>
          <button
            onClick={handleLogout}
            title={collapsed ? 'Log Out' : undefined}
            className="flex items-center gap-2 text-xs text-[#8A928E] hover:text-red-500 transition-colors"
          >
            <LogOut size={13} />
            {!collapsed && 'Log Out'}
          </button>
          <Link
            href="/"
            title={collapsed ? 'Back to Store' : undefined}
            className="text-xs text-[#8A928E] hover:text-[#1F2421] transition-colors"
          >
            {collapsed ? '←' : '← Back to Store'}
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar — slides in as an overlay, always full width/labels regardless of desktop collapse state */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed top-0 left-0 h-screen w-72 max-w-[80vw] bg-white flex flex-col z-50 md:hidden shadow-2xl">
            <div className="p-6 border-b border-black/5 flex items-center justify-between">
              <div>
                <p className="font-bold text-[#1F2421]">{SITE.name}</p>
                <p className="text-xs text-[#8A928E] uppercase tracking-widest">Admin Intelligence</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-[#8A928E] hover:text-[#1F2421] transition-colors">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col p-3 gap-1 overflow-y-auto">
              {NAV.map(({ label, href, icon: Icon }) => {
                const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[#DCE5D3] text-[#1F2421] font-medium'
                        : 'text-[#3F4744] hover:bg-[#F7F5F0] hover:text-[#1F2421]'
                    }`}
                  >
                    <Icon size={16} className="text-[#5F7A5B]" />
                    {label}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-auto p-4 border-t border-black/5 flex flex-col gap-3">
              <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-[#8A928E] hover:text-red-500 transition-colors">
                <LogOut size={13} />
                Log Out
              </button>
              <Link href="/" className="text-xs text-[#8A928E] hover:text-[#1F2421] transition-colors">
                ← Back to Store
              </Link>
            </div>
          </aside>
        </>
      )}

      {/* Spacer reserving the desktop sidebar's current width in normal flow */}
      <div className={`hidden md:block shrink-0 transition-all duration-200 ${collapsed ? 'w-[72px]' : 'w-60'}`} aria-hidden="true" />

      {/* Right column: sticky top bar + scrollable page content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 z-30 h-[64px] md:h-[73px] bg-[#F7F5F0]/95 backdrop-blur border-b border-black/5 flex items-center gap-3 md:gap-5 px-4 md:px-8 shrink-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-[#1F2421] hover:opacity-70 transition-opacity shrink-0"
          >
            <Menu size={22} />
          </button>

          {/* Search — full input on desktop, icon-toggle on mobile */}
          <div className="hidden md:block relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A928E]" />
            <input
              type="text"
              placeholder="Search orders, products..."
              className="w-full bg-white border border-black/5 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5F7A5B] transition-all placeholder:text-[#8A928E]"
            />
          </div>

          {searchOpen ? (
            <div className="md:hidden relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A928E]" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="w-full bg-white border border-black/5 rounded-full pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-[#5F7A5B] transition-all placeholder:text-[#8A928E]"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A928E]"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 md:hidden" />
              <button
                onClick={() => setSearchOpen(true)}
                className="md:hidden text-[#1F2421] hover:opacity-70 transition-opacity shrink-0"
              >
                <Search size={19} />
              </button>
            </>
          )}

          <Link href="/cart" className="text-[#1F2421] hover:opacity-70 transition-opacity shrink-0">
            <ShoppingCart size={19} />
          </Link>
          <Link href="/admin" className="text-[#1F2421] hover:opacity-70 transition-opacity shrink-0">
            <UserCircle size={20} />
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}