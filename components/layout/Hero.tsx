import Link from "next/link";
import Categories from "./Categories";
import NewArrivals from "./NewArrivals";
import Philosophy from "./Philosophy";
import Newsletter from "./Newsletter";
// import FeaturedProduct from "./FeaturedProduct";
import BestSellers from "./BestSellers";
import BrandStoryBanner from "./BrandStoryBanner";
import Testimonials from "./Testimonials";
import InstagramGrid from "./InstagramGrid";

export default function Hero() {
  return (
    <>
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
       <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80')",
    backgroundColor: 'rgba(0,0,0,0.55)',
    backgroundBlendMode: 'darken',
    backgroundAttachment: 'fixed',
  }}
/>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <p className="text-5xl md:text-5xl font-bold tracking-tight leading-tight mb-8 max-w-3xl">
            Dressed For Those Who Lead.
          </p>
          <p className="text-sm text-white/70 max-w-md mx-auto mb-10 tracking-wide leading-relaxed">
            Premium clothing crafted for the modern individual. Timeless
            silhouettes, refined fabrics, uncompromising quality.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="bg-white text-black px-8 py-3 text-xs tracking-widest uppercase hover:bg-gray-100 transition-colors font-medium"
            >
              Shop Now
            </Link>
            <Link
              href="/new-arrivals"
              className="border border-white text-white px-8 py-3 text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-colors font-medium"
            >
              New Arrivals
            </Link>
          </div>
          
        </div>
      </section>
       <Categories />
      <NewArrivals />
      {/* <FeaturedProduct /> */}
      <BestSellers />
      <Philosophy />
      <BrandStoryBanner />
      <Testimonials />
      <InstagramGrid />
      <Newsletter />
      
    </>
  );
}
