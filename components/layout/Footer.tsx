import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#EFEDE6]">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-bold text-[#1F2421] mb-3">{SITE.name}</h3>
          <p className="text-xs text-[#8A928E] leading-relaxed">
            Elevating the standard of nutritional science through transparency
            and nature-identical formulations.
          </p>
        </div>
        {[
          {
            title: "Navigation",
            links: [
              ["Shop All", "/products"],
              ["Bundles", "/bundles"],
              ["Subscription Info", "/subscriptions"],
              ["Gifting", "/gifting"],
            ],
          },
          {
            title: "Resources",
            links: [
              ["Lab Results", "/lab-results"],
              ["Clinical Studies", "/studies"],
              ["Ingredient Glossary", "/glossary"],
              ["Blog", "/blog"],
            ],
          },
          {
            title: "Company",
            links: [
              ["Sitemap", "/sitemap"],
              ["Privacy Policy", "/privacy"],
              ["Terms of Service", "/terms"],
              ["Contact Us", "/contact"],
            ],
          },
        ].map(({ title, links }) => (
          <div key={title}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1F2421] mb-4">
              {title}
            </h4>
            <ul className="space-y-3">
              {links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-[#8A928E] hover:text-[#1F2421] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-black/5 px-6 py-6 max-w-7xl mx-auto">
        <p className="text-[10px] text-[#8A928E] text-center max-w-2xl mx-auto leading-relaxed">
          © 2026 {SITE.name}. All Rights Reserved. These statements have not
          been evaluated by the FDA / NAFDAC. These products are not intended to
          diagnose, treat, cure, or prevent any disease. Consult a physician
          before starting any supplement regimen.
        </p>
        <p className="text-[9px] text-[#8A928E] text-center uppercase tracking-widest mt-3">
          GMP Certified · Non-GMO · 3rd Party Tested
        </p>
      </div>
    </footer>
  );
}
