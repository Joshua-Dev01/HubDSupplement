import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#1F2421] antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}