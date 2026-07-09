const reviews = [
  {
    id: 1,
    name: 'Amara O.',
    location: 'Lagos, Nigeria',
    review: 'The quality is unmatched. Every piece I have ordered has exceeded my expectations. This is the only brand I trust for elevated basics.',
    rating: 5,
  },
  {
    id: 2,
    name: 'James K.',
    location: 'London, UK',
    review: 'Minimal, clean, and incredibly well made. The attention to detail in every garment is something you rarely find at this price point.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sofia M.',
    location: 'Paris, France',
    review: 'I bought the linen shirt and the wool coat. Both are perfect. The sizing is accurate and the fabric feels premium.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-gray-400 mb-2">
            What They Say
          </p>
          <h2 className="text-3xl font-black uppercase tracking-wide text-gray-900">
            Customer Reviews
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(({ id, name, location, review, rating }) => (
            <div key={id} className="bg-white p-8 border border-gray-100">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <span key={i} className="text-black text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 italic">
                {review}
              </p>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-900">
                  {name}
                </p>
                <p className="text-xs text-gray-400 tracking-wide">{location}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}