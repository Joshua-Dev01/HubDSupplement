import { SITE } from '@/lib/constants'

export default function Newsletter() {
  return (
    <section className="mx-6 mb-20 rounded-3xl bg-[#2E3634] px-8 py-16 text-center max-w-7xl md:mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Join the {SITE.name} Circle</h2>
      <p className="text-sm text-white/70 max-w-md mx-auto mb-8">
        Receive expert-curated wellness insights, early access to clinical formulations, and 10% off your first order.
      </p>
      <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Your clinical email address"
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/50"
        />
        <button type="submit" className="bg-[#5F7A5B] text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-[#4F6A4B] transition-colors">
          Subscribe →
        </button>
      </form>
      <p className="text-[10px] text-white/30 uppercase tracking-widest mt-6">Scientific insights only, no spam</p>
    </section>
  )
}