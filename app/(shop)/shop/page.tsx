import { createClient } from '@/lib/supabase/server'
import ProductsClient from './ProductsClient'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) console.error(error)

  return (
    <div className="pb-20 pt-32">
      <ProductsClient products={products ?? []} initialCategory={category ?? 'All'} />
    </div>
  )
}