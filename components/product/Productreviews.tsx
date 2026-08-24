'use client'

import { Star, MessageSquareText } from 'lucide-react'
import WriteReview from './Writereview'

type Review = {
  id: string
  customer_name: string
  customer_title: string | null
  rating: number
  body: string
  created_at: string
}

function ReviewSkeleton() {
  return (
    <div className="border-b border-black/5 py-6 last:border-0">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-3.5 h-3.5 rounded-sm bg-black/10 animate-pulse" />
        ))}
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-3 bg-black/10 rounded-full w-full animate-pulse" />
        <div className="h-3 bg-black/10 rounded-full w-2/3 animate-pulse" />
      </div>
      <div className="h-3 bg-black/10 rounded-full w-32 animate-pulse" />
    </div>
  )
}

export default function ProductReviews({
  productId,
  reviews,
  loading,
  onReviewSubmitted,
}: {
  productId: string
  reviews: Review[]
  loading: boolean
  onReviewSubmitted?: () => void
}) {
  const count = reviews.length
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0

  return (
    <section className="max-w-6xl mx-auto px-6 mt-20 pt-16 border-t border-black/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-2xl font-bold text-[#1F2421] mb-2 ">Customer Reviews</p>
          {!loading && count > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex text-[#5F7A5B]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill={i < Math.round(average) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-sm font-medium text-[#1F2421]">{average.toFixed(1)}</span>
              <span className="text-sm text-[#8A928E]">
                ({count.toLocaleString()} {count === 1 ? 'Review' : 'Reviews'})
              </span>
            </div>
          )}
        </div>
      </div>

      <WriteReview productId={productId} onSubmitted={onReviewSubmitted} />

      {loading && (
        <div className="max-w-2xl">
          <ReviewSkeleton />
          <ReviewSkeleton />
        </div>
      )}

      {!loading && count === 0 && (
        <div className="flex flex-col items-center text-center py-12 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#EFEDE6] flex items-center justify-center text-[#8A928E] mb-4">
            <MessageSquareText size={20} />
          </div>
          <p className="text-sm font-medium text-[#1F2421] mb-1">No reviews yet</p>
          <p className="text-sm text-[#8A928E]">Be the first to share how this product worked for you.</p>
        </div>
      )}

      {!loading && count > 0 && (
        <div className="max-w-2xl">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-black/5 py-6 last:border-0">
              <div className="flex text-[#5F7A5B] mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill={i < r.rating ? 'currentColor' : 'none'} />
                ))}
              </div>
              <p className="text-sm text-[#3F4744] leading-relaxed mb-3">&ldquo;{r.body}&rdquo;</p>
              <p className="text-sm font-semibold text-[#1F2421]">{r.customer_name}</p>
              {r.customer_title && <p className="text-xs text-[#8A928E]">{r.customer_title}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}