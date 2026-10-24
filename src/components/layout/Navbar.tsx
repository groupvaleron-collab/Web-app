'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Car, User, LogOut, Gavel, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const userMenu = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // The account menu closes on a click or tap anywhere outside it, on Escape,
  // and when the page changes.
  useEffect(() => {
    if (!isUserMenuOpen) return
    const away = (e: PointerEvent) => { if (!userMenu.current?.contains(e.target as Node)) setIsUserMenuOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsUserMenuOpen(false) }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [isUserMenuOpen])
  useEffect(() => { setIsUserMenuOpen(false); setIsMenuOpen(false) }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reviews is hidden while that page is being finished. Auction only means
  // something with a sign-in link, so it appears only once signed in.
  const navigation = [
    { name: 'Home', href: '/' },
    ...(session ? [{ name: 'Auction', href: '/auctions' }] : []),
    { name: 'Stock', href: '/stocks' },
    { name: 'Contact', href: '/#contact' },
  ]
  const displayName = session?.user?.name?.trim() || ''

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg shadow-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg shadow-slate-900/20">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-900 rounded-full animate-pulse" />
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
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium transition-all duration-300 group"
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute inset-0 rounded-lg bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-slate-900 to-slate-700 group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Phone Number */}
            <a href="tel:0770376789" className="hidden lg:flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors">
              <span className="text-sm font-medium">077 037 6789</span>
            </a>
            
            {status === 'loading' ? (
              <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
            ) : session ? (
              <div className="relative" ref={userMenu}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen} aria-haspopup="menu"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-900/50 transition-all duration-300"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-lg border-2 border-slate-900/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-800" />
                    </div>
                  )}
                  <span className="font-medium text-slate-700 max-w-[100px] truncate text-sm">
                    {displayName.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl border border-slate-200 p-1.5 animate-scale-in shadow-xl shadow-slate-900/10">
                    <div className="px-3 py-2.5 mb-1 border-b border-slate-100">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Signed in as</p>
                      <p className="font-semibold text-slate-900 truncate">{displayName || 'Your account'}</p>
                    </div>
                    <div>
                      <Link
                        href="/auctions"
                        role="menuitem" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Gavel className="w-4 h-4 text-slate-400" />
                        <span>Auctions</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          signOut({ callbackUrl: '/' })
                        }}
                        role="menuitem" className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-slate-400" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="btn-primary flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-slate-200 animate-slide-down">
          <div className="px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-all border border-transparent hover:border-slate-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Phone */}
            <a href="tel:0770376789" className="block px-4 py-4 rounded-xl text-slate-800 font-semibold">
              📞 077 037 6789
            </a>

            <div className="pt-4 border-t border-slate-200">
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="w-10 h-10 rounded-xl border-2 border-slate-900/50"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-800" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">{displayName || 'Your account'}</p>
                    </div>
                  </div>
                  <Link
                    href="/auctions"
                    className="block px-4 py-4 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Gavel className="inline w-5 h-5 mr-3" />
                    Auction
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="block w-full text-left px-4 py-4 rounded-xl text-red-600 hover:bg-slate-50 font-medium transition-colors"
                  >
                    <LogOut className="inline w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
