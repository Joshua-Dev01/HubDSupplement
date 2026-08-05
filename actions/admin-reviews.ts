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

export async function getAllReviews() {
  const admin = createAdminClient()
  const { data } = await admin.from('reviews').select('*').order('created_at', { ascending: false })
  return data ?? []
}

export async function createReview(input: {
  customer_name: string
  customer_title?: string
  product_id?: string | null
  rating: number
  body: string
  is_featured: boolean
}) {
  if (!(await verifyAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('reviews').insert(input)

  if (error) return { error: error.message }
  revalidatePath('/admin/reviews')
  revalidatePath('/') // homepage Testimonials reads featured reviews
  return { success: true }
}

export async function updateReview(id: string, input: {
  customer_name: string
  customer_title?: string
  product_id?: string | null
  rating: number
  body: string
  is_featured: boolean
}) {
  if (!(await verifyAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('reviews').update(input).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/reviews')
  revalidatePath('/')
  return { success: true }
}

export async function deleteReview(id: string) {
  if (!(await verifyAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin.from('reviews').delete().eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/reviews')
  revalidatePath('/')
  return { success: true }
}