import { FlaskConical, CheckCircle, ShieldCheck, Award } from 'lucide-react'
import { TRUST_BADGES } from '@/lib/constants'

const ICONS = { flask: FlaskConical, 'check-circle': CheckCircle, 'shield-check': ShieldCheck, award: Award }

export default function Perks() {
  return (
    <section className="bg-[#EFEDE6] py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {TRUST_BADGES.map(({ title, sub, icon }) => {
          const Icon = ICONS[icon]
          return (
            <div key={title} className="text-center flex flex-col items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42]">
                <Icon size={18} />
              </div>
              <p className="text-sm font-semibold text-[#1F2421]">{title}</p>
              <p className="text-xs text-[#8A928E] max-w-[160px]">{sub}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}