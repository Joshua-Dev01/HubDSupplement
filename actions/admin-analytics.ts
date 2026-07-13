'use server'

import { cookies } from 'next/headers'
import { getExpectedAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const expectedToken = await getExpectedAdminToken()
  return adminCookie === expectedToken
}

export async function getAnalytics() {
  if (!(await verifyAdmin())) return null

  const admin = createAdminClient()
  const { data: orders } = await admin
    .from('orders')
    .select('total, status, created_at')
    .order('created_at', { ascending: true })

  const paidStatuses = ['paid', 'shipped', 'delivered']

  // Revenue by day, last 30 days
  const revenueByDay = new Map<string, number>()
  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    revenueByDay.set(d.toISOString().slice(0, 10), 0)
  }

  orders?.forEach((o) => {
    if (!paidStatuses.includes(o.status)) return
    const day = o.created_at.slice(0, 10)
    if (revenueByDay.has(day)) {
      revenueByDay.set(day, (revenueByDay.get(day) ?? 0) + Number(o.total))
    }
  })

  const revenueChart = Array.from(revenueByDay.entries()).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
    revenue,
  }))

  // Order status breakdown
  const statusCounts: Record<string, number> = {}
  orders?.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] ?? 0) + 1
  })

  const totalRevenue = orders?.filter((o) => paidStatuses.includes(o.status)).reduce((sum, o) => sum + Number(o.total), 0) ?? 0

  return { revenueChart, statusCounts, totalRevenue, totalOrders: orders?.length ?? 0 }
}