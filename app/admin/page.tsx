import { getDashboardStats } from '@/actions/admin-orders'
import { formatNaira } from '@/lib/utils'
import { ShoppingBag, Clock, DollarSign, Package } from 'lucide-react'

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  if (!stats) return <p className="text-sm text-[#8A928E]">Unable to load dashboard</p>

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock },
    { label: 'Total Revenue', value: formatNaira(stats.totalRevenue), icon: DollarSign },
    { label: 'Products Listed', value: stats.totalProducts, icon: Package },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2421] mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-6">
            <div className="w-9 h-9 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42] mb-4">
              <Icon size={16} />
            </div>
            <p className="text-2xl font-bold text-[#1F2421]">{value}</p>
            <p className="text-xs text-[#8A928E] mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}