'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { forgotPassword } from '@/actions/auth'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(formData: FormData) {
    const email = formData.get('email') as string
    if (!email.includes('@')) {
      toast.error('Enter a valid email address')
      return
    }

    setLoading(true)
    const result = await forgotPassword(formData)
    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      setSent(true)
      toast.success('Reset link sent — check your inbox')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1F2421] text-center mb-2">Forgot Password</h1>
        <p className="text-sm text-[#8A928E] text-center mb-8">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="text-center py-6">
            <p className="text-sm text-[#1F2421]">
              Check your inbox for a password reset link. It may take a minute to arrive.
            </p>
          </div>
        ) : (
          <form action={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest text-[#8A928E]">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="border border-black/10 rounded-full px-4 py-3 text-sm outline-none focus:border-[#5F7A5B] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#5F7A5B] text-white py-3 rounded-full text-sm font-medium hover:bg-[#4F6A4B] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-[#8A928E] mt-6">
          Remembered it?{' '}
          <Link href="/login" className="text-[#1F2421] font-medium underline">Back to Login</Link>
        </p>
      </div>
    </div>
  )
}