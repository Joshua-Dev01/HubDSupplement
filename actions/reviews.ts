'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

// Customer-facing review submission. Unlike actions/admin-reviews.ts,
// this only requires the visitor to be a logged-in customer (not an
// admin) — we verify that with the regular cookie-based client, then
// write with the service-role client since the reviews table's RLS
// only allows admin/service-role inserts.
export async function createCustomerReview(input: {
  productId: string
  rating: number
  body: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'not_authenticated' }

  if (input.rating < 1 || input.rating > 5) {
    return { error: 'Please choose a star rating' }
  }
  if (!input.body.trim()) {
    return { error: 'Please write a few words about the product' }
  }

  const admin = createAdminClient()

  // One review per customer per product — resubmitting updates
  // their existing review instead of creating a duplicate.
  const { data: existing } = await admin
    .from('reviews')
    .select('id')
    .eq('product_id', input.productId)
    .eq('user_id', user.id)
    .maybeSingle()

  const customerName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'Anonymous'

  const payload = {
    product_id: input.productId,
    user_id: user.id,
    customer_name: customerName,
    rating: input.rating,
    body: input.body.trim(),
    is_featured: false,
  }

  const { error } = existing
    ? await admin.from('reviews').update(payload).eq('id', existing.id)
    : await admin.from('reviews').insert(payload)

  if (error) return { error: error.message }

  revalidatePath('/products/[slug]', 'page')
  return { success: true, updated: !!existing }
}