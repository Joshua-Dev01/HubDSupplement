'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Clock, Loader2, AlertTriangle } from 'lucide-react'
import { sendContactMessage } from '@/actions/contact'
import { SITE } from '@/lib/constants'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    const result = await sendContactMessage(form)

    if (result.error) {
      toast.error(result.error)
    } else {
      setSent(true)
      toast.success('Message sent — we\u2019ll get back to you shortly')
      setForm({ name: '', email: '', subject: '', message: '' })
    }

    setSending(false)
  }

  const inputClass = "w-full bg-[#EFEDE6] border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5F7A5B] transition-all"

  return (
    <div className="pt-32 pb-20 bg-[#F7F5F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12 max-w-lg">
          <p className="text-xs uppercase tracking-widest text-[#5F7A5B] font-medium mb-3">Get in Touch</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1F2421] mb-4">We&apos;re Here to Help</h1>
          <p className="text-sm text-[#3F4744] leading-relaxed">
            Questions about an order, a medication, or your prescription? Our licensed pharmacy team is
            ready to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42] shrink-0">
                <Phone size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F2421] mb-1">Call Us</p>
                <p className="text-sm text-[#8A928E]">+234 800 000 0000</p>
                <p className="text-xs text-[#8A928E] mt-1">Mon \u2013 Sat, 8am \u2013 8pm</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42] shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F2421] mb-1">Email Us</p>
                <p className="text-sm text-[#8A928E]">support@hubdsupplement.com</p>
                <p className="text-xs text-[#8A928E] mt-1">We reply within 24 hours</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42] shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F2421] mb-1">Visit Our Pharmacy</p>
                <p className="text-sm text-[#8A928E]">123 Wellness Avenue, Lagos, Nigeria</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42] shrink-0">
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1F2421] mb-1">Pharmacy Hours</p>
                <p className="text-xs text-[#8A928E]">Mon \u2013 Fri: 8am \u2013 8pm</p>
                <p className="text-xs text-[#8A928E]">Sat: 9am \u2013 6pm \u00b7 Sun: Closed</p>
              </div>
            </div>

            <div className="bg-[#2E3634] rounded-2xl p-5 flex items-start gap-3">
              <AlertTriangle size={16} className="text-white/70 shrink-0 mt-0.5" />
              <p className="text-xs text-white/80 leading-relaxed">
                For medical emergencies, please call your local emergency services immediately \u2014
                do not wait for a response from us.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl p-8">
              {sent ? (
                <div className="text-center py-12">
                  <p className="text-lg font-semibold text-[#1F2421] mb-2">Message Sent</p>
                  <p className="text-sm text-[#8A928E]">
                    Thanks for reaching out \u2014 our team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Full Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Subject</label>
                    <input
                      value={form.subject}
                      onChange={(e) => update('subject', e.target.value)}
                      placeholder="What's this about?"
                      className={inputClass}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-[#8A928E] mb-1.5 block">Message</label>
                    <textarea
                      required
                      value={form.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="How can we help?"
                      rows={6}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex items-center justify-center gap-2 bg-[#5F7A5B] hover:bg-[#4F6A4B] disabled:opacity-50 text-white font-medium px-8 py-3 rounded-full transition-colors"
                    >
                      {sending && <Loader2 size={15} className="animate-spin" />}
                      {sending ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}