import { Leaf } from 'lucide-react'

export default function PageLeafLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-[#5F7A5B]/15 animate-ping" />
        <span className="absolute inset-2 rounded-full bg-[#5F7A5B]/10" />
        <Leaf size={26} className="relative text-[#5F7A5B] animate-spin" />
      </div>
      <p className="text-xs uppercase tracking-widest text-[#8A928E]">{label}</p>
    </div>
  )
}