import Image from 'next/image'
import Link from 'next/link'

const bestsellers = [
  {
    id: 1,
    category: 'Outerwear',
    name: 'Wool Overcoat',
    price: 420,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    slug: 'wool-overcoat',
  },
  {
    id: 2,
    category: 'Shirts',
    name: 'Linen Button-Up',
    price: 120,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80',
    slug: 'linen-button-up',
  },
  {
    id: 3,
    category: 'Trousers',
    name: 'Tapered Wool Trouser',
    price: 210,
    badge: 'Fan Favourite',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
    slug: 'tapered-wool-trouser',
  },
]

export default function BestSellers() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">
              Most Loved
            </p>
            <h2 className="text-2xl font-black tracking-wide uppercase text-gray-900">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs tracking-widest uppercase text-gray-900 underline underline-offset-4 hover:text-gray-500 transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestsellers.map(({ id, category, name, price, badge, image, slug }) => (
            <Link key={id} href={`/products/${slug}`} className="group">
              <div className="relative h-96 overflow-hidden bg-gray-100 mb-4">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                {/* Badge */}
                <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 tracking-widest uppercase">
                  {badge}
                </span>
              </div>
              <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">{category}</p>
              <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-gray-500 transition-colors">
                {name}
              </h3>
              <p className="text-sm text-gray-900">${price.toFixed(2)}</p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}