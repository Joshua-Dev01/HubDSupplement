export const SITE = {
  name: 'Vitalis',
  tagline: 'Precision Care For Your Wellbeing.',
  description:
    'Clinically formulated wellness essentials backed by science and sourced responsibly.',
}

export const CATEGORIES = [
  { label: 'Vitamins', href: '/products?category=vitamins', icon: 'droplet' },
  { label: 'Protein', href: '/products?category=protein', icon: 'trending-up' },
  { label: 'Herbal', href: '/products?category=herbal', icon: 'leaf' },
  { label: 'Sleep', href: '/products?category=sleep', icon: 'moon' },
  { label: 'Immunity', href: '/products?category=immunity', icon: 'shield' },
] as const

export const TRUST_BADGES = [
  { title: 'Lab Tested', sub: 'Every batch verified for purity and potency.', icon: 'flask' },
  { title: 'GMP Certified', sub: 'Manufactured in world-class facilities.', icon: 'check-circle' },
  { title: '3rd Party Verified', sub: 'Independent audits for total transparency.', icon: 'shield-check' },
  { title: 'Guarantee', sub: '60-day money-back wellness promise.', icon: 'award' },
] as const