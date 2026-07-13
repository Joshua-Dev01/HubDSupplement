import { getAllProducts } from '@/actions/admin-products'
import ProductsAdminClient from './ProductsAdminClient'

export default async function AdminProductsPage() {
  const products = await getAllProducts()
  return <ProductsAdminClient initialProducts={products} />
}