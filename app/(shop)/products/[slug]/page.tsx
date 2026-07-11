import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  return (
    <div className="pt-32 pb-20 bg-[#F7F5F0] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-xs text-[#8A928E] mb-8">
          <Link href="/shop" className="hover:text-[#1F2421] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#1F2421] capitalize">{product.category}</span>
        </nav>

        <ProductDetailClient product={product} />
      </div>
    </div>
  )
}