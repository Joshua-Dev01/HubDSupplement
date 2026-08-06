'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Review = {
  id: string
  customer_name: string
  customer_title: string | null
  rating: number
  body: string
}

function TestimonialSkeleton() {
  return (
    <div className="bg-[#EFEDE6] rounded-2xl p-6 animate-pulse">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 rounded-sm bg-black/10" />
        ))}
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-3 bg-black/10 rounded-full w-full" />
        <div className="h-3 bg-black/10 rounded-full w-full" />
        <div className="h-3 bg-black/10 rounded-full w-2/3" />
      </div>
      <div className="h-3.5 bg-black/10 rounded-full w-24 mb-2" />
      <div className="h-3 bg-black/10 rounded-full w-32" />
    </div>
  )
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
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="h-7 bg-black/10 rounded-full w-3/4 mb-3 animate-pulse" />
          <div className="h-3 bg-black/10 rounded-full w-full mb-2 animate-pulse" />
          <div className="h-3 bg-black/10 rounded-full w-5/6 animate-pulse" />
        </div>
        <TestimonialSkeleton />
        <TestimonialSkeleton />
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