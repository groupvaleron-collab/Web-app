import Link from 'next/link'
import { Car, Phone, Mail, MapPin, Facebook, Instagram, Youtube, MessageCircle, ArrowUpRight, Zap } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-slate-50 text-slate-800 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-slate-900/5 rounded-full blur-[120px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Top CTA Section */}
        <div className="relative mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-100 border border-slate-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/10 rounded-full blur-[80px]" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                Ready to Import Your Dream Car?
              </h3>
              <p className="text-slate-600">
                Get started today and experience premium vehicle imports from Japan.
              </p>
            </div>
            <Link href="/stocks" className="btn-primary flex items-center gap-2 whitespace-nowrap">
              <Zap className="w-5 h-5" />
              Browse Stock
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                  <Car className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gradient tracking-tight">
                  VALERON
                </span>
                <span className="text-[10px] font-medium text-slate-500 tracking-[0.2em] uppercase">
                  Automart
                </span>
              </div>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your trusted partner for premium vehicle imports from Japan. We handle everything from auction to your doorstep with complete transparency.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-900/50 flex items-center justify-center transition-all duration-300 group shadow-sm">
                <Facebook className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-900/50 flex items-center justify-center transition-all duration-300 group shadow-sm">
                <Instagram className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-900/50 flex items-center justify-center transition-all duration-300 group shadow-sm">
                <Youtube className="w-5 h-5 text-slate-500 group-hover:text-slate-800" />
              </a>
              <a href="https://wa.me/94770376789" className="w-10 h-10 rounded-xl bg-slate-200 hover:bg-slate-300 border border-slate-300 flex items-center justify-center transition-all duration-300 group shadow-sm">
                <MessageCircle className="w-5 h-5 text-slate-800" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-slate-900 to-transparent" />
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'Vehicle Stock', href: '/stocks' },
                { name: 'Import Calculator', href: '/calculator' },
                { name: 'Customer Reviews', href: '/reviews' },
                { name: 'Client Dashboard', href: '/dashboard' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-slate-900 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-slate-900 to-transparent" />
              Our Services
            </h3>
            <ul className="space-y-4">
              {[
                'Vehicle Import',
                'Auction Bidding',
                'Shipping & Logistics',
                'Customs Clearance',
                'Vehicle Registration',
              ].map((service) => (
                <li key={service} className="text-slate-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="w-8 h-px bg-gradient-to-r from-slate-900 to-transparent" />
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:0770376789" className="flex items-center gap-3 text-slate-600 hover:text-slate-800 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-slate-900/50 flex items-center justify-center transition-all shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="font-medium">077 037 6789</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@valeronautomart.lk" className="flex items-center gap-3 text-slate-600 hover:text-slate-800 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-slate-900/50 flex items-center justify-center transition-all shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span>info@valeronautomart.lk</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span>123 Main Street,<br />Colombo 03, Sri Lanka</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} Valeron Automart. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-slate-500 hover:text-slate-800 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-slate-800 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
