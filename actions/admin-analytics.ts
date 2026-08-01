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

export async function getAnalytics(range: '30D' | '90D' | 'YTD' = '30D') {
  if (!(await verifyAdmin())) return null

  const admin = createAdminClient()
  const paidStatuses = ['paid', 'shipped', 'delivered']

  const { data: orders } = await admin
    .from('orders')
    .select('id, user_id, total, status, state, created_at')
    .order('created_at', { ascending: true })

  const now = new Date()
  let periodStart: Date
  if (range === '90D') {
    periodStart = new Date(now)
    periodStart.setDate(periodStart.getDate() - 90)
  } else if (range === 'YTD') {
    periodStart = new Date(now.getFullYear(), 0, 1)
  } else {
    periodStart = new Date(now)
    periodStart.setDate(periodStart.getDate() - 30)
  }

  const periodOrders = (orders ?? []).filter((o) => new Date(o.created_at) >= periodStart)
  const paidOrders = periodOrders.filter((o) => paidStatuses.includes(o.status))

  // Average Order Value
  const avgOrderValue = paidOrders.length > 0
    ? paidOrders.reduce((s, o) => s + Number(o.total), 0) / paidOrders.length
    : 0

  // AOV trend — daily average, across the period
  const daySpan = range === 'YTD' ? Math.ceil((now.getTime() - periodStart.getTime()) / 86400000) : range === '90D' ? 90 : 30
  const bucketCount = Math.min(daySpan, 30) // cap chart points at 30 for readability
  const bucketSizeDays = Math.max(1, Math.ceil(daySpan / bucketCount))

  const aovBuckets: { date: string; aov: number }[] = []
  for (let i = 0; i < bucketCount; i++) {
    const bucketStart = new Date(periodStart)
    bucketStart.setDate(bucketStart.getDate() + i * bucketSizeDays)
    const bucketEnd = new Date(bucketStart)
    bucketEnd.setDate(bucketEnd.getDate() + bucketSizeDays)

    const bucketOrders = paidOrders.filter((o) => {
      const d = new Date(o.created_at)
      return d >= bucketStart && d < bucketEnd
    })

    const bucketAOV = bucketOrders.length > 0
      ? bucketOrders.reduce((s, o) => s + Number(o.total), 0) / bucketOrders.length
      : 0

    aovBuckets.push({
      date: bucketStart.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
      aov: Math.round(bucketAOV),
    })
  }

  // Repeat Customer Rate — % of customers with more than 1 paid order, all-time
  const ordersByUser = new Map<string, number>()
  ;(orders ?? []).filter((o) => paidStatuses.includes(o.status)).forEach((o) => {
    ordersByUser.set(o.user_id, (ordersByUser.get(o.user_id) ?? 0) + 1)
  })
  const totalCustomers = ordersByUser.size
  const repeatCustomers = Array.from(ordersByUser.values()).filter((count) => count > 1).length
  const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0

  // Sales by State — real data from checkout delivery state
  const revenueByState = new Map<string, number>()
  paidOrders.forEach((o) => {
    if (!o.state) return
    revenueByState.set(o.state, (revenueByState.get(o.state) ?? 0) + Number(o.total))
  })
  const totalStateRevenue = Array.from(revenueByState.values()).reduce((s, v) => s + v, 0)
  const salesByState = Array.from(revenueByState.entries())
    .map(([state, revenue]) => ({
      state,
      revenue,
      pct: totalStateRevenue > 0 ? Math.round((revenue / totalStateRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  return {
    avgOrderValue,
    totalOrders: periodOrders.length,
    totalRevenue: paidOrders.reduce((s, o) => s + Number(o.total), 0),
    repeatRate,
    aovBuckets,
    salesByState,
  }
}