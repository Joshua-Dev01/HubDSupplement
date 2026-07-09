import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductsClient from './ProductsClient'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error(error)

  return (
    <div className="pb-20">

      {/* Hero Header */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=80')",
            backgroundColor: 'rgba(0,0,0,0.55)',
            backgroundBlendMode: 'darken',
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Products</span>
          </nav>
          <p className="text-xs tracking-[0.3em] uppercase text-white/60 mb-3">
            Our Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-widest uppercase leading-none">
            All Products
          </h1>
        </div>
      </div>

      {/* Products Client Component */}
      <ProductsClient products={products ?? []} />

    </div>
  )
}