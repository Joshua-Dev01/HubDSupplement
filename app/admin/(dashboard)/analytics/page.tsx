'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react'
import { getAnalytics } from '@/actions/admin-analytics'
import { formatNaira } from '@/lib/utils'

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState<'30D' | '90D' | 'YTD'>('30D')
  const [data, setData] = useState<Awaited<ReturnType<typeof getAnalytics>>>(null)

  useEffect(() => {
    getAnalytics(range).then(setData)
  }, [range])

  if (!data) return <p className="text-sm text-[#8A928E]">Loading analytics...</p>

  const cards = [
    { label: 'Avg. Order Value', value: formatNaira(data.avgOrderValue), icon: DollarSign },
    { label: 'Total Orders', value: data.totalOrders.toLocaleString(), icon: ShoppingBag },
    { label: 'Total Revenue', value: formatNaira(data.totalRevenue), icon: TrendingUp },
    { label: 'Repeat Customer Rate', value: `${data.repeatRate}%`, icon: Users },
  ]

  const maxStateRevenue = data.salesByState[0]?.revenue ?? 1

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2421]">Performance Overview</h1>
          <p className="text-xs text-[#8A928E] mt-1">Real business insights, computed from real orders.</p>
        </div>

        <div className="flex gap-1 bg-white rounded-full p-1">
          {(['30D', '90D', 'YTD'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-xs font-medium px-4 py-2 rounded-full transition-colors ${
                range === r ? 'bg-[#5F7A5B] text-white' : 'text-[#8A928E] hover:text-[#1F2421]'
              }`}
            >
              {r === '30D' ? 'Last 30 Days' : r === '90D' ? '90 Days' : 'Year to Date'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-6">
            <div className="w-9 h-9 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42] mb-6">
              <Icon size={16} />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#8A928E] mb-1">{label}</p>
            <p className="text-2xl font-bold text-[#1F2421]">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-[#1F2421] mb-1">Average Order Value Trend</h2>
        <p className="text-xs text-[#8A928E] mb-6">Daily average across all orders in this period.</p>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.aovBuckets}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8A928E' }} interval={Math.floor(data.aovBuckets.length / 6)} />
            <YAxis tick={{ fontSize: 11, fill: '#8A928E' }} tickFormatter={(v) => `₦${v}`} />
            <Tooltip formatter={(value) => formatNaira(Number(value))} />
            <Line
              type="monotone"
              dataKey="aov"
              stroke="#5F7A5B"
              strokeWidth={2}
              dot={{ r: 3, fill: '#5F7A5B' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-6">
        <h2 className="font-semibold text-[#1F2421] mb-1">Sales by State</h2>
        <p className="text-xs text-[#8A928E] mb-6">Revenue by delivery destination, real data from checkout.</p>

        {data.salesByState.length === 0 ? (
          <p className="text-sm text-[#8A928E]">No orders with delivery data yet</p>
        ) : (
          <div className="flex flex-col gap-4">
            {data.salesByState.map(({ state, revenue, pct }) => (
              <div key={state}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#1F2421]">{state}</span>
                  <span className="text-[#8A928E]">{formatNaira(revenue)} ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-[#EFEDE6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5F7A5B] rounded-full"
                    style={{ width: `${(revenue / maxStateRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}