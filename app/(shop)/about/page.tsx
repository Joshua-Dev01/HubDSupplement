import Image from "next/image";
import Link from "next/link";
import {
  ScanLine,
  FlaskConical,
  ShieldCheck,
  Snowflake,
  CheckCircle2,
  Leaf,
  TestTube2,
  BadgeCheck,
  Thermometer,
  SprayCan,
  Phone,
} from "lucide-react";
import { SITE } from "@/lib/constants";

const QUALITY_STEPS = [
  {
    icon: ScanLine,
    title: "Source Verification",
    desc: "Every medication is traced back to a licensed, regulator-approved manufacturer before it reaches our shelves.",
  },
  {
    icon: FlaskConical,
    title: "Batch Testing",
    desc: "Independent lab checks confirm potency, purity, and correct dosage on every batch we stock.",
  },
  {
    icon: Snowflake,
    title: "Cold Chain Integrity",
    desc: "Temperature-sensitive medications are monitored from warehouse to doorstep, never left to degrade in transit.",
  },
  {
    icon: ShieldCheck,
    title: "Expiry Monitoring",
    desc: "Automated tracking keeps expired or soon-to-expire stock off our shelves before it ever reaches a customer.",
  },
];

const TEAM = [
  {
    name: "Dr. Elena Thorne",
    role: "Chief Pharmacist",
    quote:
      "Every prescription we fill gets the same scrutiny I would want for my own family.",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
  },
  {
    name: "Prof. Julian Vane",
    role: "Clinical Safety Advisor",
    quote:
      "Drug interaction checks aren\u2019t a formality here \u2014 they\u2019re the first thing we run on every order.",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
  },
  {
    name: "Dr. Sarah Chen",
    role: "Regulatory & Compliance Lead",
    quote:
      "We hold ourselves to NAFDAC standards on every single product, not just the ones that get inspected.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
];

const COMMITMENTS = [
  "NAFDAC-Registered Pharmacy",
  "Licensed Pharmacists on Every Order",
  "Tamper-Evident Packaging",
  "Verified Cold-Chain Delivery",
];

const SAFETY_STANDARDS = [
  {
    number: "01",
    icon: Leaf,
    title: "Premium & Authentic Sourcing",
    desc: "We partner exclusively with certified manufacturers and verified global suppliers. Every raw ingredient is selected for maximum bioavailability, purity, and potency, ensuring you receive authentic products free from unverified additives.",
  },
  {
    number: "02",
    icon: TestTube2,
    title: "Rigorous Testing & Quality Control",
    desc: "All our products undergo strict batch testing to guarantee heavy metal safety, microbiological purity, and label accuracy. What is listed on our label is exactly what is inside the bottle — nothing more, nothing less.",
  },
  {
    number: "03",
    icon: BadgeCheck,
    title: "Regulatory Compliance & Certification",
    desc: "We operate in strict alignment with regulatory guidelines, including NAFDAC and Good Manufacturing Practice (GMP) standards. Our partner facilities maintain international certifications to uphold the highest hygienic and industrial protocols.",
  },
  {
    number: "04",
    icon: Thermometer,
    title: "Optimal Storage & Shelf-Life Management",
    desc: "Active nutrients degrade if exposed to improper heat, humidity, or light. Our inventory is stored in climate-controlled environments and continually audited for freshness so you always receive products at peak potency.",
  },
  {
    number: "05",
    icon: SprayCan,
    title: "Clean & Transparent Formulations",
    desc: "We prioritize clean wellness. Our product selection focuses on formulations free from unnecessary fillers, harmful synthetic preservatives, and banned substances.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 bg-[#F7F5F0]">
      {/* Page title banner — background image */}
      <section className="relative w-full h-56 sm:h-72 md:h-80 flex items-center justify-center overflow-hidden mb-16">
        <img
          src="./images/aboutPage.jpg"
          alt="HubDsupplement — About Us"
        />
        <div className="absolute inset-0 bg-black/50 text-center" />
        <div className="relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white ">
            About Us
          </h1>
          <p className="text-xs sm:text-sm text-white/70 mt-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">About Us</span>
          </p>
        </div>
      </section>

      {/* Hero — Our Genesis */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-24">
        <p className="text-xs uppercase tracking-widest text-[#5F7A5B] font-medium mb-3">
          Our Genesis
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2421] leading-tight mb-6">
          Wellness Made Simple, Verified Care.
        </h2>
        <p className="text-sm text-[#3F4744] leading-relaxed mb-4 max-w-2xl mx-auto">
          Welcome to {SITE.name}, your partner in everyday vitality. We know
          that modern life is demanding, and staying on top of your health
          can feel overwhelming. That&apos;s why we curated a range of
          high-quality dietary supplements designed to seamlessly fit into
          your daily routine — from essential vitamins and targeted wellness
          solutions, to skin care, sexual health, and child nutrition, we
          make feeling your best effortless.
        </p>
        <p className="text-sm text-[#3F4744] leading-relaxed mb-8 max-w-2xl mx-auto">
          We don&apos;t believe in shortcuts or quick fixes. We believe in
          sustainable, science-backed nutrition that fuels your lifestyle
          from the inside out.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-[#5F7A5B] hover:bg-[#4F6A4B] text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
        >
          Shop Our Wellness Range
        </Link>
      </section>

      {/* Quality Assurance Process */}
      <section className="bg-[#EFEDE6] py-20 mb-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F2421] mb-3">
            Why Choose {SITE.name}?
          </h2>
          <p className="text-sm text-[#8A928E] max-w-lg mx-auto mb-12">
            We believe in authentic, high-potency ingredients, sourced from
            trusted, certified manufacturers and formulated for real and
            visible results.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {QUALITY_STEPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 text-left">
                <div className="w-10 h-10 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42] mb-4">
                  <Icon size={17} />
                </div>
                <h3 className="font-semibold text-[#1F2421] mb-2">{title}</h3>
                <p className="text-xs text-[#8A928E] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {/* <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5F7A5B] font-medium mb-2">
              Pharmacist Led
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F2421] max-w-md">
              Guided by Our Clinical & Compliance Team
            </h2>
          </div>
          <Link
            href="/science"
            className="hidden md:block text-xs uppercase tracking-widest text-[#5F7A5B] hover:text-[#1F2421] transition-colors underline underline-offset-4"
          >
            View Our Standards
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEAM.map((member) => (
            <div key={member.name}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 grayscale">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold text-[#1F2421]">{member.name}</h3>
              <p className="text-xs text-[#8A928E] mb-2">{member.role}</p>
              <p className="text-sm text-[#3F4744] italic leading-relaxed">
                &ldquo;{member.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Safety & Quality Standards */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-[#5F7A5B] font-medium mb-3">
            Our Promise
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F2421] mb-4">
            Our Safety &amp; Quality Standards
          </h2>
          <p className="text-sm text-[#8A928E] leading-relaxed">
            At {SITE.name}, your health and safety are our highest priorities.
            We know that what you put into your body matters, which is why we
            enforce strict quality control protocols at every stage — from
            ingredient selection to your doorstep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SAFETY_STANDARDS.map(({ number, icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className={`bg-white rounded-2xl p-7 flex gap-5 border border-black/5 ${
                i === SAFETY_STANDARDS.length - 1 ? "md:col-span-2" : ""
              }`}
            >
              <div className="shrink-0 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42]">
                  <Icon size={20} />
                </div>
                <span className="text-[11px] font-bold text-[#B8C4B4] mt-2">
                  {number}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-[#1F2421] mb-2">{title}</h3>
                <p className="text-sm text-[#8A928E] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-[#2E3634] rounded-2xl px-7 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h3 className="font-semibold text-white mb-1.5">
              Have questions about a specific batch or product?
            </h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-md">
              Our team is dedicated to complete transparency. Contact our
              customer care team for product verification or safety
              inquiries.
            </p>
          </div>
          <a
            href="tel:08103867139"
            className="inline-flex items-center gap-2 bg-[#5F7A5B] hover:bg-[#4F6A4B] text-white text-sm font-medium px-6 py-3 rounded-full transition-colors shrink-0 whitespace-nowrap"
          >
            <Phone size={15} />
            0810 386 7139
          </a>
        </div>
      </section>

      {/* Commitments */}
      {/* <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white rounded-3xl overflow-hidden">
          <div className="p-8 md:p-12">
            <p className="text-xs uppercase tracking-widest text-[#5F7A5B] font-medium mb-3">
              Compliance First
            </p>
            <h2 className="text-2xl font-bold text-[#1F2421] mb-4">
              Held to Pharmacy Standards, Not Just E-Commerce Ones
            </h2>
            <p className="text-sm text-[#3F4744] leading-relaxed mb-6">
              We operate as a licensed pharmacy first, and an online store
              second. That means every order is reviewed against the same
              regulatory standards you&apos;d expect walking into a physical
              pharmacy.
            </p>
            <ul className="flex flex-col gap-3">
              {COMMITMENTS.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-[#1F2421]"
                >
                  <CheckCircle2 size={16} className="text-[#5F7A5B] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-64 md:h-full">
            <Image
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80"
              alt="Pharmacy shelves"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-[#2E3634] rounded-3xl px-8 py-16 text-center relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Your Health, Verified Every Step of the Way.
          </h2>
          <p className="text-sm text-white/70 max-w-md mx-auto mb-8">
            Join thousands who trust {SITE.name} for medication they can rely
            on, delivered by people who take quality seriously.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/shop"
              className="bg-white text-[#1F2421] px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Shop All Medications
            </Link>
            <Link
              href="/science"
              className="border border-white/40 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Our Safety Standards
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}