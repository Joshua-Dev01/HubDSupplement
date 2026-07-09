import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    label: 'Men',
    href: '/products?category=men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
  },
  {
    label: 'Women',
    href: '/products?category=women',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
  },
  {
    label: 'Accessories',
    href: '/products?category=accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
  },
]

export default function Categories() {
  return (
    <section className="grid grid-cols-3 gap-1 w-full">
      {categories.map(({ label, href, image }) => (
        <Link
          key={label}
          href={href}
          className="relative overflow-hidden group h-125"
        >
          {/* Image */}
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />

          {/* subtle dark overlay on hover */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />

          {/* Label bottom left */}
          <div className="absolute bottom-5 left-5 z-10">
            <span className="text-white text-sm font-semibold tracking-widest uppercase drop-shadow-md">
              {label}
            </span>
          </div>

        </Link>
      ))}
    </section>
  )
}