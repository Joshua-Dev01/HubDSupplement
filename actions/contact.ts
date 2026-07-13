'use server'

import { Resend } from 'resend'
import { contactNotificationHTML } from '@/lib/email/contact-message'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendContactMessage({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject: string
  message: string
}) {
  if (!name.trim() || !email.trim() || !message.trim()) {
    return { error: 'Please fill in all required fields' }
  }
  if (!email.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }

  if (!resend || !process.env.ADMIN_EMAIL) {
    console.warn('RESEND_API_KEY or ADMIN_EMAIL not set — skipping contact email')
    return { error: 'Message could not be sent right now. Please try again later.' }
  }

  try {
    const result = await resend.emails.send({
      from: 'HubDsupplement <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject || 'New message'}`,
      html: contactNotificationHTML({ name, email, subject, message }),
    })

    if (result.error) {
      console.error('Contact email failed:', result.error)
      return { error: 'Failed to send your message. Please try again.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Contact form exception:', err)
    return { error: 'Something went wrong. Please try again.' }
  }
}