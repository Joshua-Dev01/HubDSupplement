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
  rating?: number
  review_count?: number
  supply_days?: number
  subscription_discount_pct?: number
  created_at?: string
}