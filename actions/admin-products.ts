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

// Uploads a single image file to the 'product-images' storage bucket
// and returns its public URL. Uses the service-role client since the
// admin panel's auth is a custom cookie, not a Supabase auth session,
// so RLS-based storage policies wouldn't recognize it as authorized.
export async function uploadProductImage(formData: FormData) {
  if (!(await verifyAdmin())) return { error: 'Unauthorized' }

  const file = formData.get('file') as File | null
  if (!file) return { error: 'No file provided' }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Only JPEG, PNG, WebP, or GIF images are allowed' }
  }

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_SIZE) {
    return { error: 'Image must be under 5MB' }
  }

  const admin = createAdminClient()

  const ext = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { error } = await admin.storage
    .from('product-images')
    .upload(fileName, file, { contentType: file.type, upsert: false })

  if (error) return { error: error.message }

  const { data: publicUrlData } = admin.storage
    .from('product-images')
    .getPublicUrl(fileName)

  return { success: true, url: publicUrlData.publicUrl }
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