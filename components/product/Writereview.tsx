'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createCustomerReview } from '@/actions/reviews'
import LeafSpinner from '../ui/Leafspinner'

export default function WriteReview({
  productId,
  onSubmitted,
}: {
  productId: string
  onSubmitted?: () => void
}) {
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [hasExisting, setHasExisting] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      setLoggedIn(!!user)

      if (user) {
        const { data } = await supabase
          .from('reviews')
          .select('rating, body')
          .eq('product_id', productId)
          .eq('user_id', user.id)
          .maybeSingle()

        if (data) {
          setRating(data.rating)
          setBody(data.body)
          setHasExisting(true)
        }
      }

      setCheckingAuth(false)
    }

    init()
  }, [productId])

  async function handleSubmit() {
    setSubmitting(true)

    const result = await createCustomerReview({ productId, rating, body })

    setSubmitting(false)

    if (result.error === 'not_authenticated') {
      toast.error('Please log in to leave a review')
      return
    }
    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(result.updated ? 'Review updated' : 'Thanks for your review!')
    setHasExisting(true)
    setOpen(false)
    onSubmitted?.()
  }

  if (checkingAuth) return null

  if (!loggedIn) {
    return (
      <p className="text-sm text-[#8A928E] mb-10">
        <Link href="/login" className="text-[#5F7A5B] font-medium hover:text-[#4F6A4B]">
          Log in
        </Link>{' '}
        to write a review.
      </p>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-[#5F7A5B] hover:text-[#4F6A4B] transition-colors mb-10"
      >
        {hasExisting ? 'Edit your review' : 'Write a review'}
      </button>
    )
  }

  return (
    <div className="bg-[#F7F5F0] rounded-2xl p-6 mb-10 max-w-2xl">
      <p className="text-sm font-semibold text-[#1F2421] mb-3 cursor-pointer!">
        {hasExisting ? 'Edit your review' : 'Write a review'}
      </p>

      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1
          return (
            <button
              key={i}
              type="button"
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHoverRating(starValue)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-[#5F7A5B]"
            >
              <Star size={22} fill={starValue <= (hoverRating || rating) ? 'currentColor' : 'none'} />
            </button>
          )
        })}
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="What did you think of this product?"
        className="w-full bg-white border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#5F7A5B] transition-all resize-none mb-4"
      />

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting || rating === 0 || !body.trim()}
          className="flex items-center justify-center gap-2 bg-[#5F7A5B] hover:bg-[#4F6A4B] disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
        >
          {submitting && <LeafSpinner size={14} />}
          {submitting ? 'Submitting...' : hasExisting ? 'Update Review' : 'Submit Review'}
        </button>
        <button
          onClick={() => setOpen(false)}
          disabled={submitting}
          className="text-sm text-[#8A928E] hover:text-[#1F2421] transition-colors px-2"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}