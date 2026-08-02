import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
// import { createAdminClient } from '@/lib/supabase/admin'
import { createOrderFromVerifiedPayment } from '@/actions/orders'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // Verify this request genuinely came from Paystack, not someone spoofing it
  const signature = req.headers.get('x-paystack-signature')
  const expectedSignature = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)

  if (event.event !== 'charge.success') {
    return NextResponse.json({ received: true })
  }

  const { reference, customer, metadata } = event.data

  if (!metadata?.user_id) {
    console.error('Webhook received charge.success with no user_id in metadata:', reference)
    return NextResponse.json({ received: true })
  }

  const result = await createOrderFromVerifiedPayment(metadata.user_id, {
    fullName: metadata.full_name ?? customer.email,
    email: customer.email,
    phone: metadata.phone ?? '',
    address: metadata.address ?? '',
    city: metadata.city ?? '',
    state: metadata.state ?? '',
    subtotal: metadata.subtotal ?? 0,
    shipping: metadata.shipping ?? 0,
    tax: metadata.tax ?? 0,
    total: event.data.amount / 100,
    paymentReference: reference,
  })

  if ('error' in result) {
    console.error('Webhook order creation failed:', result.error)
  }

  return NextResponse.json({ received: true })
}