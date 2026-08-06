function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EFEDE6] rounded-2xl mb-3" />
      <div className="h-2.5 bg-black/10 rounded-full w-16 mb-2" />
      <div className="h-3.5 bg-black/10 rounded-full w-3/4 mb-2" />
      <div className="h-3.5 bg-black/10 rounded-full w-12" />
    </div>
  )
}

export default function ShopLoading() {
  return (
    <div className="pb-20 pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-black/10 pb-6 gap-6">
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 bg-black/10 rounded-full w-14 animate-pulse" />
            ))}
          </nav>
          <div className="flex items-center gap-4 shrink-0">
            <div className="h-3 bg-black/10 rounded-full w-14 animate-pulse" />
            <div className="h-8 bg-black/10 rounded-full w-20 animate-pulse" />
            <div className="h-8 bg-black/10 rounded-full w-28 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}