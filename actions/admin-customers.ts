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

export async function getAllCustomers() {
  if (!(await verifyAdmin())) return []

  const admin = createAdminClient()

  // Real signed-up users, from Supabase's own auth system
  const { data: usersData } = await admin.auth.admin.listUsers()

  // Their order totals, so we can show spend per customer
  const { data: orders } = await admin.from('orders').select('user_id, total, status')

  const spendByUser = new Map<string, { total: number; count: number }>()
  orders?.forEach((o) => {
    if (o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered') {
      const existing = spendByUser.get(o.user_id) ?? { total: 0, count: 0 }
      spendByUser.set(o.user_id, { total: existing.total + Number(o.total), count: existing.count + 1 })
    }
  })

  return (usersData?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? 'Unknown',
    name: u.user_metadata?.full_name || u.user_metadata?.name || null,
    created_at: u.created_at,
    total_spent: spendByUser.get(u.id)?.total ?? 0,
    order_count: spendByUser.get(u.id)?.count ?? 0,
  }))
}