import Image from 'next/image'
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
      <section className="relative w-full pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 md:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-[380px] sm:h-[440px] md:h-[520px]">
          <Image
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&q=80"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 sm:from-black/40 via-black/15 sm:via-black/10 to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 max-w-md sm:max-w-lg md:max-w-xl text-white">
            <span className="inline-block w-fit bg-[#5F7A5B] text-[10px] sm:text-xs uppercase tracking-widest px-2.5 sm:px-3 py-1 rounded-full mb-3 sm:mb-4">
              Scientific Wellness
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-3 sm:mb-5">
              {SITE.tagline}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-5 sm:mb-8 max-w-md">
              {SITE.description}
            </p>
            <div className="flex  items-start xs:items-center gap-2.5 sm:gap-3">
              <Link
                href="/products"
                className="bg-[#5F7A5B] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:bg-[#4F6A4B] transition-colors"
              >
                Shop Best Sellers
              </Link>
              <Link
                href="/science"
                className="border border-white/60 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:bg-white hover:text-[#1F2421] transition-colors"
              >
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