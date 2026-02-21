import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Valeron Automart - Premium Vehicle Import Services | Sri Lanka',
  description: 'Import your dream vehicle from Japan with Valeron Automart. Premium import services with transparent pricing, end-to-end handling, and verified suppliers.',
  keywords: 'vehicle import, car import Sri Lanka, Japan cars, vehicle auction, car shipping, Valeron Automart',
  openGraph: {
    title: 'Valeron Automart - Premium Vehicle Import Services',
    description: 'Import your dream vehicle from Japan with Valeron Automart. Premium import services with transparent pricing.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-800">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
