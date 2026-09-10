'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Droplet,
  TrendingUp,
  Leaf,
  Moon,
  Shield,
  Venus,
  Dumbbell,
  HeartPulse,
  Baby,
  Sparkles,
  Mars,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'

const ICONS: Record<string, LucideIcon> = {
  droplet: Droplet,
  'trending-up': TrendingUp,
  leaf: Leaf,
  moon: Moon,
  shield: Shield,
  venus: Venus,
  dumbbell: Dumbbell,
  'heart-pulse': HeartPulse,
  baby: Baby,
  sparkles: Sparkles,
  mars: Mars,
}

const VISIBLE_COUNT = 4
const visibleCategories = CATEGORIES.slice(0, VISIBLE_COUNT)
const restCategories = CATEGORIES.slice(VISIBLE_COUNT)

export default function Categories() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-6 pt-12 sm:pt-16 pb-16">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {visibleCategories.map(({ label, value, icon }) => {
          const Icon = ICONS[icon]
          return (
            <Link
              key={value}
              href={`/shop?category=${value}`}
              className="flex items-center gap-2.5 bg-[#EFEDE6] hover:bg-[#E5E2D8] text-base font-medium text-[#1F2421] pl-5 pr-6 py-4 rounded-full transition-colors"
            >
              <Icon size={20} className="text-[#5F7A5B]" />
              {label}
            </Link>
          )
        })}

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2.5 bg-[#EFEDE6] hover:bg-[#E5E2D8] text-base font-medium text-[#1F2421] pl-5 pr-5 py-4 rounded-full transition-colors"
          >
            More
            <ChevronDown size={20} className={`text-[#5F7A5B] transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-black/10 rounded-2xl shadow-lg overflow-hidden z-50 w-64 py-2">
              {restCategories.map(({ label, value, icon }) => {
                const Icon = ICONS[icon]
                return (
                  <Link
                    key={value}
                    href={`/shop?category=${value}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#3F4744] hover:bg-[#F7F5F0] hover:text-[#1F2421] transition-colors"
                  >
                    <Icon size={16} className="text-[#5F7A5B] shrink-0" />
                    {label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}