'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

import { cookies } from 'next/headers'
import { getExpectedAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'

async function verifyAdmin() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value
  const expectedToken = await getExpectedAdminToken()
  return adminCookie === expectedToken
}

export async function getAllProducts() {
  const admin = createAdminClient()
  const { data } = await admin.from('products').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function createProduct(input: {
  name: string
  slug: string
  price: number
  category: string
  images: string[]
  description: string
  is_new: boolean
  in_stock: boolean
}) {
  if (!(await verifyAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('products').insert(input)

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}

export async function updateProduct(id: string, input: {
  name: string
  slug: string
  price: number
  category: string
  images: string[]
  description: string
  is_new: boolean
  in_stock: boolean
}) {
  if (!(await verifyAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('products').update(input).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}

export async function deleteProduct(id: string) {
  if (!(await verifyAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('products').delete().eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}