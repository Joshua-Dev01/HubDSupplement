'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useGlobalLoading } from '@/store/Globalloadingstore'
import PageLeafLoader from './Pageleafloader'

export default function GlobalLoadingOverlay() {
  const { isLoading, label, hide } = useGlobalLoading()
  const pathname = usePathname()
  const previousPathname = useRef(pathname)

  // Once the new route has actually mounted, pathname changes — that's
  // our signal the navigation finished, so we can drop the overlay.
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      hide()
      previousPathname.current = pathname
    }
  }, [pathname, hide])

  // Safety net: never let the overlay get stuck forever if something
  // (a failed request, a cancelled navigation) never calls hide().
  useEffect(() => {
    if (!isLoading) return
    const timeout = setTimeout(() => hide(), 8000)
    return () => clearTimeout(timeout)
  }, [isLoading, hide])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[999] bg-[#F7F5F0]/90 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          >
            <PageLeafLoader label={label} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}