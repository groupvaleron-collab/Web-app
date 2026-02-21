import HeroSection from '@/components/home/HeroSection'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import ImportProcess from '@/components/home/ImportProcess'
import FeaturedStock from '@/components/home/FeaturedStock'
import CustomerReviews from '@/components/home/CustomerReviews'
import FAQSection from '@/components/home/FAQSection'
import ContactSection from '@/components/home/ContactSection'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <ImportProcess />
      <WhyChooseUs />
     
      <FeaturedStock />
      <CustomerReviews />
      <FAQSection />
      <ContactSection />
    </main>
  )
}
