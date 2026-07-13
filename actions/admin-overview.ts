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

function pctChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export async function getOverviewData(range: '7D' | '30D' | '1Y' = '30D') {
  if (!(await verifyAdmin())) return null

  const admin = createAdminClient()
  const paidStatuses = ['paid', 'shipped', 'delivered']

  const { data: orders } = await admin
    .from('orders')
    .select('id, status, total, full_name, email, created_at, order_items(product_name, product_image, quantity, price)')
    .order('created_at', { ascending: false })

  const { data: usersData } = await admin.auth.admin.listUsers()
  const users = usersData?.users ?? []

  const days = range === '7D' ? 7 : range === '1Y' ? 365 : 30
  const now = new Date()
  const periodStart = new Date(now)
  periodStart.setDate(periodStart.getDate() - days)
  const prevPeriodStart = new Date(periodStart)
  prevPeriodStart.setDate(prevPeriodStart.getDate() - days)

  const inRange = (dateStr: string, start: Date, end: Date) => {
    const d = new Date(dateStr)
    return d >= start && d < end
  }

  const currentOrders = (orders ?? []).filter((o) => inRange(o.created_at, periodStart, now))
  const prevOrders = (orders ?? []).filter((o) => inRange(o.created_at, prevPeriodStart, periodStart))

  const currentRevenue = currentOrders.filter((o) => paidStatuses.includes(o.status)).reduce((s, o) => s + Number(o.total), 0)
  const prevRevenue = prevOrders.filter((o) => paidStatuses.includes(o.status)).reduce((s, o) => s + Number(o.total), 0)

  const currentUsers = users.filter((u) => inRange(u.created_at, periodStart, now))
  const prevUsers = users.filter((u) => inRange(u.created_at, prevPeriodStart, periodStart))

  const currentPending = currentOrders.filter((o) => o.status === 'pending').length
  const prevPending = prevOrders.filter((o) => o.status === 'pending').length

  // Revenue chart — daily buckets across the selected range
  const revenueByDay = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    revenueByDay.set(d.toISOString().slice(0, 10), 0)
  }
  currentOrders.forEach((o) => {
    if (!paidStatuses.includes(o.status)) return
    const day = o.created_at.slice(0, 10)
    if (revenueByDay.has(day)) revenueByDay.set(day, (revenueByDay.get(day) ?? 0) + Number(o.total))
  })
  const revenueChart = Array.from(revenueByDay.entries()).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' }),
    revenue,
  }))

  // Sparklines — simplified 10-point trend per card, from the same daily data
  const sparklineFrom = (values: number[]) => values.slice(-10).map((v) => ({ v }))

  // Top selling products — aggregated from real order_items across all orders
  const productMap = new Map<string, { name: string; image: string | null; qty: number; revenue: number; category: string }>()
  ;(orders ?? []).forEach((o) => {
    if (!paidStatuses.includes(o.status)) return
    o.order_items?.forEach((item: any) => {
      const existing = productMap.get(item.product_name) ?? { name: item.product_name, image: item.product_image, qty: 0, revenue: 0, category: '' }
      existing.qty += item.quantity
      existing.revenue += item.price * item.quantity
      productMap.set(item.product_name, existing)
    })
  })
  const topProducts = Array.from(productMap.values()).sort((a, b) => b.qty - a.qty).slice(0, 4)

  // Recent orders — latest 6, regardless of range
  const recentOrders = (orders ?? []).slice(0, 6).map((o) => ({
    id: o.id,
    customerName: o.full_name,
    email: o.email,
    itemSummary: o.order_items?.length
      ? `${o.order_items[0].product_name}${o.order_items.length > 1 ? ` +${o.order_items.length - 1} more` : ''}`
      : '—',
    amount: Number(o.total),
    status: o.status,
  }))

  return {
    revenue: { value: currentRevenue, pct: pctChange(currentRevenue, prevRevenue) },
    orders: { value: currentOrders.length, pct: pctChange(currentOrders.length, prevOrders.length) },
    newCustomers: { value: currentUsers.length, pct: pctChange(currentUsers.length, prevUsers.length) },
    pendingOrders: { value: currentPending, pct: pctChange(currentPending, prevPending) },
    revenueChart,
    topProducts,
    recentOrders,
    sparklines: {
      revenue: sparklineFrom(revenueChart.map((r) => r.revenue)),
    },
  }
}