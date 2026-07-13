'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return false
  }
  return true
}

export async function getAllOrders() {
  if (!(await verifyAdmin())) return []

  const admin = createAdminClient()
  const { data } = await admin
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (!(await verifyAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('orders').update({ status }).eq('id', orderId)

  if (error) return { error: error.message }
  revalidatePath('/admin/orders')
  return { success: true }
}

export async function getDashboardStats() {
  if (!(await verifyAdmin())) return null

  const admin = createAdminClient()
  const { data: orders } = await admin.from('orders').select('status, total')
  const { count: productCount } = await admin.from('products').select('*', { count: 'exact', head: true })

  const paidOrders = orders?.filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered') ?? []
  const pendingCount = orders?.filter((o) => o.status === 'pending').length ?? 0
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0)

  return {
    totalOrders: orders?.length ?? 0,
    pendingOrders: pendingCount,
    totalRevenue,
    totalProducts: productCount ?? 0,
  }
}