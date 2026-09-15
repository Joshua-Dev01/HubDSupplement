import { ShieldCheck, Truck, BadgeCheck, Leaf } from 'lucide-react'

const MESSAGES = [
  { icon: Truck, text: 'Free Delivery on Orders Above ₦20,000' },
  { icon: ShieldCheck, text: '100% Authentic, Verified Products' },
  { icon: BadgeCheck, text: 'NAFDAC-Compliant Quality Standards' },
  { icon: Leaf, text: 'Sustainable, Science-Backed Nutrition' },
]

function TickerContent() {
  return (
    <>
      {MESSAGES.map(({ icon: Icon, text }, i) => (
        <span key={i} className="flex items-center gap-2 mx-6 shrink-0">
          <Icon size={14} className="text-white/70 shrink-0" />
          <span className="text-xs font-medium tracking-wide">{text}</span>
        </span>
      ))}
    </>
  )
}

export default function AnnouncementBar() {
  return (
    <div className="w-full h-9 bg-[#1F2421] text-white overflow-hidden flex items-center">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex shrink-0">
          <TickerContent />
        </div>
        {/* Duplicate — creates the seamless infinite-loop illusion */}
        <div className="flex shrink-0" aria-hidden="true">
          <TickerContent />
        </div>
      </div>
    </div>
  )
}