'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import { adminLogin } from '@/actions/admin-auth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const result = await adminLogin(email, password)

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success('Welcome back')
    router.push('/admin')
    router.refresh()
  }

  const inputClass = "w-full bg-[#EFEDE6] border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5F7A5B] transition-all"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1F2421] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8">
        <div className="w-12 h-12 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42] mb-6 mx-auto">
          <Lock size={18} />
        </div>
        <h1 className="text-xl font-bold text-[#1F2421] text-center mb-6">Admin Access</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            autoFocus
            className={inputClass}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className={inputClass}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center cursor-pointer! justify-center gap-2 bg-[#5F7A5B] hover:bg-[#4F6A4B] disabled:opacity-50 text-white font-medium py-3 rounded-full transition-colors"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? 'Verifying...' : 'Enter Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  )
}