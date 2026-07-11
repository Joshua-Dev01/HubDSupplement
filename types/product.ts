export type Product = {
  id: string
  name: string
  slug: string
  price: number
  category: 'vitamins' | 'protein' | 'herbal' | 'sleep' | 'immunity'
  images: string[]
  description: string | null
  is_new: boolean
  in_stock: boolean
  created_at?: string
}