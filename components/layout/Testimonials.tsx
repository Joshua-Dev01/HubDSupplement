import { Star } from 'lucide-react'

const reviews = [
  { text: "Finally a brand that treats supplements like actual science. I've noticed a significant shift in my focus during work hours.", name: 'Dr. Elena Rodriguez', role: 'Functional Medicine Specialist' },
  { text: "The transparency is what sold me. Being able to see the batch results for every single bottle is unheard of in this industry.", name: 'Marcus Chen', role: 'Athletic Trainer' },
]

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <h2 className="text-2xl font-bold text-[#1F2421] mb-3">Trusted by over 30,000 health seekers.</h2>
        <p className="text-sm text-[#8A928E] mb-6">Real results from people who prioritize their physiological well-being as much as we do.</p>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['#F2D6A2', '#A2C9E0', '#B7D8A8'].map((c) => (
              <div key={c} className="w-8 h-8 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="text-sm font-medium text-[#1F2421]">4.9/5 Average Rating</span>
        </div>
      </div>

      {reviews.map((r) => (
        <div key={r.name} className="bg-[#EFEDE6] rounded-2xl p-6">
          <div className="flex gap-1 text-[#5F7A5B] mb-4">
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
          </div>
          <p className="text-sm text-[#1F2421] leading-relaxed mb-6">&ldquo;{r.text}&rdquo;</p>
          <p className="text-sm font-semibold text-[#1F2421]">{r.name}</p>
          <p className="text-xs text-[#8A928E]">{r.role}</p>
        </div>
      ))}
    </section>
  )
}