'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types/product'

export default function SearchBar({ className = '' }: { className?: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (value.trim().length < 2) {
      setResults([])
      setOpen(false)
    }
  }

  // debounce: wait 300ms after the user stops typing before hitting Supabase
  useEffect(() => {
    if (query.trim().length < 2) return

    const timer = setTimeout(async () => {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, price, images, category')
        .ilike('name', `%${query}%`)
        .limit(6)

      if (!error) {
        setResults((data as Product[]) ?? [])
        setOpen(true)
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        {loading ? (
          <Loader2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A928E] animate-spin" />
        ) : (
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A928E]" />
        )}
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search wellness..."
          className="w-full bg-white border border-black/10 rounded-full pl-9 pr-4 py-2 text-sm outline-none focus:border-[#5F7A5B] transition-colors"
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/10 rounded-2xl shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-xs text-[#8A928E] text-center py-6">No products found</p>
          ) : (
            results.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                onClick={() => { setOpen(false); setQuery('') }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#F7F5F0] transition-colors"
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#EFEDE6] shrink-0">
                  {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-[#1F2421] truncate">{p.name}</p>
                  <p className="text-xs text-[#8A928E]">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}