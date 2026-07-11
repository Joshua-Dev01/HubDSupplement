'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updatePassword } from '@/actions/auth'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await updatePassword(formData)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
    // on success, updatePassword() redirects to /login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#1F2421] text-center mb-2">Set New Password</h1>
        <p className="text-sm text-[#8A928E] text-center mb-8">
          Choose a new password for your account.
        </p>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#8A928E]">New Password</label>
            <input
              name="password"
              type="password"
              placeholder="Min. 6 characters"
              required
              className="border border-black/10 rounded-full px-4 py-3 text-sm outline-none focus:border-[#5F7A5B] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase tracking-widest text-[#8A928E]">Confirm New Password</label>
            <input
              name="confirm"
              type="password"
              placeholder="Repeat your password"
              required
              className="border border-black/10 rounded-full px-4 py-3 text-sm outline-none focus:border-[#5F7A5B] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#5F7A5B] text-white py-3 rounded-full text-sm font-medium hover:bg-[#4F6A4B] transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}