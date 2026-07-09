import Image from 'next/image'

export default function Newsletter() {
  return (
    <section className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center gap-20">

        {/* Left — Image */}
        <div className="w-full lg:w-3/5 relative overflow-hidden aspect-video group">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80"
            alt="Newsletter"
            fill
            className="object-cover grayscale brightness-95 transition-all duration-[3000ms] group-hover:grayscale-0 group-hover:scale-105"
          />
        </div>

        {/* Right — Form */}
        <div className="w-full lg:w-2/5 space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase tracking-tight text-gray-900 leading-tight">
              The Inner Circle
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Gain priority access to limited edition drops, seasonal lookbooks, and private gallery installations.
            </p>
          </div>

          <form className="flex flex-col gap-8">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="w-full bg-transparent border-b border-gray-300 focus:border-black px-0 py-4 text-xs outline-none tracking-widest uppercase placeholder:text-gray-300 transition-all"
            />
            <button
              type="submit"
              className="w-fit px-12 py-5 bg-black text-white text-xs uppercase tracking-widest hover:opacity-80 transition-all"
            >
              Join Us
            </button>
          </form>
        </div>

      </div>
    </section>
  )
}