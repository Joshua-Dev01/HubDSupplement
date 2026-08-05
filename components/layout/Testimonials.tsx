'use client'

import { useEffect, useState } from 'react'
import { Star, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Review = {
  id: string
  customer_name: string
  customer_title: string | null
  rating: number
  body: string
}

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, customer_name, customer_title, rating, body')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(2)

      if (error) {
        console.error('Testimonials fetch error:', error.message)
        setLoading(false)
        return
      }

      setReviews((data ?? []) as Review[])
      setLoading(false)
    }

    fetchReviews()

    // Live updates — if admin features/unfeatures a review, or edits one,
    // this section reflects it immediately without a page refresh.
    const channel = supabase
      .channel('testimonials-reviews')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        () => {
          fetchReviews()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-20 flex justify-center text-[#8A928E]">
        <Loader2 size={20} className="animate-spin" />
      </section>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <h2 className="text-2xl font-bold text-[#1F2421] mb-3">Trusted by our customers.</h2>
        <p className="text-sm text-[#8A928E] mb-6">Real results from people who prioritize their physiological well-being as much as we do.</p>
      </div>

      {reviews.map((r) => (
        <div key={r.id} className="bg-[#EFEDE6] rounded-2xl p-6">
          <div className="flex gap-1 text-[#5F7A5B] mb-4">
            {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
          </div>
          <p className="text-sm text-[#1F2421] leading-relaxed mb-6">&ldquo;{r.body}&rdquo;</p>
          <p className="text-sm font-semibold text-[#1F2421]">{r.customer_name}</p>
          {r.customer_title && <p className="text-xs text-[#8A928E]">{r.customer_title}</p>}
        </div>
      ))}
    </section>
  )
}