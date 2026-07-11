'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'

const products = [
  { id: '1', slug: 'luminate-nootropic', badge: 'Top Rated', category: 'Focus & Clarity', name: 'Luminate Nootropic', desc: 'Advanced cognitive support for mental energy and sustained focus.', price: 58, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=80' },
  { id: '2', slug: 'pure-isolates-whey', badge: 'Clean Label', category: 'Muscle Health', name: 'Pure Isolates Whey', desc: 'Grass-fed, cold-processed isolate for optimal muscle recovery.', price: 74, image: 'https://images.unsplash.com/photo-1579722820776-1b4d8f9e0b62?w=600&q=80' },
  { id: '3', slug: 'foundation-multivitamin', badge: null, category: 'Daily Vitality', name: 'Foundation Multivitamin', desc: 'Bioavailable essential nutrients tailored for active modern lifestyles.', price: 45, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&q=80' },
]

export default function BestSellers() {
  const [added, setAdded] = useState<string | null>(null)

  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2421]">Patient Favorites</h2>
          <p className="text-sm text-[#8A928E] mt-1">The most trusted foundations for your daily ritual.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#EFEDE6] transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:bg-[#EFEDE6] transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-black/5">
            <Link href={`/products/${p.slug}`} className="relative block aspect-[4/3] bg-[#EFEDE6]">
              <Image src={p.image} alt={p.name} fill className="object-cover" />
              {p.badge && (
                <span className="absolute top-3 left-3 bg-[#1F2421] text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
            </Link>
            <div className="p-5">
              <p className="text-[11px] uppercase tracking-widest text-[#8A928E] mb-1">{p.category}</p>
              <h3 className="font-semibold text-[#1F2421] mb-1">{p.name}</h3>
              <p className="text-xs text-[#8A928E] leading-relaxed mb-4">{p.desc}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1F2421]">${p.price.toFixed(2)}</span>
                <button
                  onClick={() => { setAdded(p.id); setTimeout(() => setAdded(null), 1500) }}
                  className="w-9 h-9 rounded-full bg-[#F7F5F0] flex items-center justify-center hover:bg-[#5F7A5B] hover:text-white transition-colors"
                >
                  <ShoppingBag size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}