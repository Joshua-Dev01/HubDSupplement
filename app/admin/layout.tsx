'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Users, LogOut } from 'lucide-react'
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

  async function handleLogout() {
    await adminLogout()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex">
      <aside className="w-60 bg-white border-r border-black/5 flex flex-col shrink-0">
        <div className="p-6 border-b border-black/5">
          <p className="font-bold text-[#1F2421]">{SITE.name}</p>
          <p className="text-xs text-[#8A928E] uppercase tracking-widest">Admin Intelligence</p>
        </div>

        <nav className="flex flex-col p-3 gap-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link
                key={label}
                href={href}
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

      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}