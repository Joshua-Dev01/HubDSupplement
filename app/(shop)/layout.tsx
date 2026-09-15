import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/Announcementbar'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40">
        <AnnouncementBar />
        <Navbar />
      </header>
      {/* Reserves space for the fixed AnnouncementBar's height, so
          each page's existing top padding (calibrated to clear just
          the navbar) still lines up correctly underneath it. */}
      <div className="h-9" aria-hidden="true" />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}