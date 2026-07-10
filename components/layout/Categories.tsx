import Link from 'next/link'
import { Droplet, TrendingUp, Leaf, Moon, Shield, type LucideIcon } from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const ICONS: Record<string, LucideIcon> = {
  droplet: Droplet,
  'trending-up': TrendingUp,
  leaf: Leaf,
  moon: Moon,
  shield: Shield,
}

export default function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {CATEGORIES.map(({ label, href, icon }) => {
          const Icon = ICONS[icon]
          return (
            <Link
              key={label}
              href={href}
              className="bg-[#EFEDE6] hover:bg-[#E5E2D8] rounded-2xl p-6 flex flex-col gap-4 transition-colors"
            >
              <Icon size={20} className="text-[#5F7A5B]" />
              <span className="text-sm font-medium text-[#1F2421]">{label}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}