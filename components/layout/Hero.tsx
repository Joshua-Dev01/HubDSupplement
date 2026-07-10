import Link from 'next/link'
import Categories from './Categories'
import BestSellers from './BestSellers'
import Perks from './Perks'
import Testimonials from './Testimonials'
import Newsletter from './Newsletter'
import { SITE } from '@/lib/constants'

export default function Hero() {
  return (
    <>
      <section className="relative w-full pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden h-[520px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-16 max-w-xl text-white">
            <span className="inline-block w-fit bg-[#5F7A5B] text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Scientific Wellness
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              {SITE.tagline}
            </h1>
            <p className="text-sm text-white/80 leading-relaxed mb-8 max-w-md">
              {SITE.description}
            </p>
            <div className="flex items-center gap-3">
              <Link href="/products" className="bg-[#5F7A5B] px-6 py-3 rounded-full text-sm font-medium hover:bg-[#4F6A4B] transition-colors">
                Shop Best Sellers
              </Link>
              <Link href="/science" className="border border-white/60 px-6 py-3 rounded-full text-sm font-medium hover:bg-white hover:text-[#1F2421] transition-colors">
                Our Science
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Categories />
      <BestSellers />
      <Perks />
      <Testimonials />
      <Newsletter />
    </>
  )
}