'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderEmails } from '@/actions/email'

type CheckoutData = {
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
  paymentReference: string
}

export async function verifyPayment(reference: string) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  )
  return response.json()
}

// Shared by both the client-side callback path and the webhook path,
// so an order is only ever created once per reference, from one place.
async function createOrderFromVerifiedPayment(userId: string, data: CheckoutData) {
  const admin = createAdminClient()

  // Guard against duplicate creation if both the browser callback and
  // the webhook fire for the same payment.
  const { data: existing } = await admin
    .from('orders')
    .select('id')
    .eq('payment_reference', data.paymentReference)
    .maybeSingle()

  if (existing) return { success: true, orderId: existing.id as string }

  const { data: cartItems, error: cartError } = await admin
    .from('cart_items')
    .select('product_id, quantity, product:products(id, name, price, images)')
    .eq('user_id', userId)

  if (cartError) return { error: cartError.message }
  if (!cartItems || cartItems.length === 0) return { error: 'Cart was empty at time of order creation' }

  const { data: order, error } = await admin
    .from('orders')
    .insert({
      user_id: userId,
      email: data.email,
      full_name: data.fullName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      status: 'paid',
      payment_reference: data.paymentReference,
      subtotal: data.subtotal,
      shipping_fee: data.shipping,
      tax: data.tax,
      total: data.total,
    })
    .select()
    .single()

  if (error || !order) return { error: error?.message ?? 'Failed to create order' }

  const orderItems = cartItems.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.product.name,
    product_image: item.product.images?.[0] ?? null,
    price: item.product.price,
    quantity: item.quantity,
  }))

  const { error: itemsError } = await admin.from('order_items').insert(orderItems)
  if (itemsError) return { error: itemsError.message }

  await sendOrderEmails({
    id: order.id,
    full_name: order.full_name,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    state: order.state,
    subtotal: order.subtotal,
    shipping_fee: order.shipping_fee,
    tax: order.tax,
    total: order.total,
    created_at: order.created_at,
    items: cartItems.map((item: any) => ({
      product_name: item.product.name,
      product_image: item.product.images?.[0] ?? null,
      quantity: item.quantity,
      price: item.product.price,
    })),
  })

  await admin.from('cart_items').delete().eq('user_id', userId)

  return { success: true, orderId: order.id as string }
}

// Called from the checkout page after Paystack's popup callback fires.
export async function createOrder(data: CheckoutData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not logged in' }

  const verification = await verifyPayment(data.paymentReference)
  if (verification?.data?.status !== 'success') {
    return { error: 'Payment verification failed' }
  }

  return createOrderFromVerifiedPayment(user.id, data)
}

// Called from the webhook route — same logic, reused, exported for that route to use.
export { createOrderFromVerifiedPayment }

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