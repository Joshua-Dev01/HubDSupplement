export const SITE = {
  name: 'HubDsupplement',
  tagline: 'Precision Care For Your Wellbeing.',
  description:
    'Clinically formulated wellness essentials backed by science and sourced responsibly.',
}

export const CATEGORIES = [
  { label: 'Vitamins', value: 'vitamins', icon: 'droplet' },
  { label: 'Protein', value: 'protein', icon: 'trending-up' },
  { label: 'Herbal', value: 'herbal', icon: 'leaf' },
  { label: 'Sleep', value: 'sleep', icon: 'moon' },
  { label: 'Immunity', value: 'immunity', icon: 'shield' },
  { label: "Women's Health", value: 'womens-health', icon: 'venus' },
  { label: 'Fitness', value: 'fitness', icon: 'dumbbell' },
  { label: 'Sexual Health', value: 'sexual-health', icon: 'heart-pulse' },
  { label: 'Children', value: 'children', icon: 'baby' },
  { label: 'Beauty & Skincare', value: 'beauty-skincare', icon: 'sparkles' },
  { label: "Men's Health", value: 'mens-health', icon: 'mars' },
] as const

export const TRUST_BADGES = [
  { title: 'Lab Tested', sub: 'Every batch verified for purity and potency.', icon: 'flask' },
  { title: 'GMP Certified', sub: 'Manufactured in world-class facilities.', icon: 'check-circle' },
  { title: '3rd Party Verified', sub: 'Independent audits for total transparency.', icon: 'shield-check' },
  { title: 'Guarantee', sub: '60-day money-back wellness promise.', icon: 'award' },
] as const