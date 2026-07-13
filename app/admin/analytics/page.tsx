'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getAnalytics } from '@/actions/admin-analytics'
import { formatNaira } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  failed: 'Failed',
  cancelled: 'Cancelled',
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getAnalytics>>>(null)

  useEffect(() => {
    getAnalytics().then(setData)
  }, [])

  if (!data) return <p className="text-sm text-[#8A928E]">Loading analytics...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1F2421] mb-8">Analytics</h1>

      <div className="bg-white rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-[#1F2421] mb-1">Revenue Over Time</h2>
        <p className="text-xs text-[#8A928E] mb-6">Last 30 days</p>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.revenueChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFEDE6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8A928E' }} interval={4} />
            <YAxis tick={{ fontSize: 11, fill: '#8A928E' }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => formatNaira(value)} />
            <Line type="monotone" dataKey="revenue" stroke="#5F7A5B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-semibold text-[#1F2421] mb-4">Order Status Breakdown</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(data.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-[#3F4744]">{STATUS_LABELS[status] ?? status}</span>
                <span className="text-sm font-medium text-[#1F2421]">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-widest text-[#8A928E] mb-2">Total Revenue (All Time)</p>
          <p className="text-3xl font-bold text-[#1F2421]">{formatNaira(data.totalRevenue)}</p>
          <p className="text-xs text-[#8A928E] mt-2">Across {data.totalOrders} total orders</p>
        </div>
      </div>
    </div>
  )
}