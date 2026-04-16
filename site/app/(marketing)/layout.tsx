import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex-1">{children}</main>
      <Footer />
    </>
  )
}
