import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-lg font-black tracking-widest uppercase text-gray-900 mb-3">
            Cloth Brand
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-wide">
            A destination for curated minimalist fashion and editorial inspiration.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-4">
            Shop
          </h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">About</Link></li>
            <li><Link href="/new-arrivals" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">New Arrivals</Link></li>
            <li><Link href="/products" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">Collections</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-4">
            Support
          </h4>
          <ul className="space-y-3">
            <li><Link href="/faq" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">FAQ</Link></li>
            <li><Link href="/shipping" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">Shipping</Link></li>
            <li><Link href="/returns" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">Returns</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-4">
            Social
          </h4>
          <ul className="space-y-3">
            <li><a href="https://instagram.com" target="_blank" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">Instagram</a></li>
            <li><a href="https://pinterest.com" target="_blank" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">Pinterest</a></li>
            <li><a href="https://twitter.com" target="_blank" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">Twitter</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 max-w-7xl mx-auto">
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          © 2026 Cloth Brand. All Rights Reserved.
        </p>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-xs text-gray-400 uppercase tracking-wide hover:text-black transition-colors">Terms of Use</Link>
        </div>
      </div>

    </footer>
  )
}