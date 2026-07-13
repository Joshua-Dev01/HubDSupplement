import Image from "next/image";
import Link from "next/link";
import {
  ScanLine,
  FlaskConical,
  ShieldCheck,
  Snowflake,
  CheckCircle2,
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

export default function AboutPage() {
  return (
    <div className="pt-32 pb-20 bg-[#F7F5F0]">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#5F7A5B] font-medium mb-3">
            Our Genesis
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2421] leading-tight mb-5">
            Trusted Medicine, Verified Care.
          </h1>
          <p className="text-sm text-[#3F4744] leading-relaxed mb-8 max-w-md">
            {SITE.name} was founded on a simple belief: getting medication
            shouldn&apos;t mean gambling on quality. We bridge licensed pharmacy
            standards with the convenience of online ordering, so every capsule,
            syrup, and tablet that reaches you has been verified, tested, and
            handled by people who take that responsibility seriously.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#5F7A5B] hover:bg-[#4F6A4B] text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
          >
            Shop Our Pharmacy
          </Link>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80"
              alt="Pharmacist preparing medication"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 left-6 bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#DCE5D3] flex items-center justify-center text-[#3F5C42] shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1F2421]">
                100% Verified
              </p>
              <p className="text-xs text-[#8A928E]">
                From manufacturer to doorstep
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance Process */}
      <section className="bg-[#EFEDE6] py-20 mb-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F2421] mb-3">
            Our Quality Assurance Process
          </h2>
          <p className="text-sm text-[#8A928E] max-w-lg mx-auto mb-12">
            Every medication we stock passes through a strict verification
            protocol before it&apos;s made available for order.
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
      <section className="max-w-6xl mx-auto px-6 mb-24">
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
      </section>

      {/* Commitments */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
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
      </section>

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
