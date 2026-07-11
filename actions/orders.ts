'use server'

import { createClient } from '@/lib/supabase/server'

export async function createPendingOrder({
  fullName,
  email,
  phone,
  address,
  city,
  state,
  subtotal,
  shipping,
  tax,
  total,
}: {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  subtotal: number
  shipping: number
  tax: number
  total: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'not_authenticated' }

  const reference = `order_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      full_name: fullName,
      email,
      phone,
      address,
      city,
      state,
      subtotal,
      shipping,
      tax,
      total,
      paystack_reference: reference,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  return { orderId: data.id as string, reference }
}

export async function verifyPaystackPayment(reference: string, orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'not_authenticated' }

  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  })
  const verifyData = await verifyRes.json()

  if (!verifyRes.ok || verifyData?.data?.status !== 'success') {
    await supabase.from('orders').update({ status: 'failed' }).eq('id', orderId)
    return { error: 'Payment verification failed' }
  }

  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select('product_id, quantity, product:products(id, name, price, images)')
    .eq('user_id', user.id)

  if (cartError) return { error: cartError.message }

  const orderItems = (cartItems ?? []).map((item: any) => ({
    order_id: orderId,
    product_id: item.product_id,
    product_name: item.product.name,
    product_image: item.product.images?.[0] ?? null,
    price: item.product.price,
    quantity: item.quantity,
  }))

  if (orderItems.length > 0) {
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
    if (itemsError) return { error: itemsError.message }
  }

  await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId)
  await supabase.from('cart_items').delete().eq('user_id', user.id)

  return { success: true }
}

export async function getOrders() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return data ?? []
}