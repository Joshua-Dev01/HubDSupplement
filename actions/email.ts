'use server'

import { adminNotificationHTML, customerReceiptHTML } from '@/lib/email/order-receipt'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

type OrderItem = {
  product_name: string
  product_image: string | null
  quantity: number
  price: number
}

type OrderDetails = {
  id: string
  full_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  subtotal: number
  shipping_fee: number
  tax: number
  total: number
  created_at: string
  items: OrderItem[]
}

export async function sendOrderEmails(order: OrderDetails) {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping order emails')
    return { skipped: true }
  }

  try {
    const customerResult = await resend.emails.send({
      from: 'HubDsupplement <onboarding@resend.dev>',
      to: order.email,
      subject: `Order Confirmed — #${order.id.slice(0, 8).toUpperCase()}`,
      html: customerReceiptHTML(order),
    })

    if (customerResult.error) {
      console.error('Customer receipt email failed:', customerResult.error)
    }

    if (process.env.ADMIN_EMAIL) {
      const adminResult = await resend.emails.send({
        from: 'HubDsupplement <onboarding@resend.dev>',
        to: process.env.ADMIN_EMAIL,
        subject: `New Order — #${order.id.slice(0, 8).toUpperCase()} (${order.full_name})`,
        html: adminNotificationHTML(order),
      })

      if (adminResult.error) {
        console.error('Admin notification email failed:', adminResult.error)
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Email sending failed:', error)
    return { error: 'Failed to send emails' }
  }
}