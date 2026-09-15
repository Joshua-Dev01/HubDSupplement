import { Leaf } from 'lucide-react'

export default function LeafSpinner({
  size = 16,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return <Leaf size={size} className={`animate-spin ${className}`} />
}