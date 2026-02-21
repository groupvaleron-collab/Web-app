'use client'

import Link from 'next/link'
import { ArrowRight, Play, ChevronDown, Sparkles, Shield, Zap, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-9000 flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100/30">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Dynamic gradient that follows mouse */}
        <div 
          className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(148, 163, 184, 0.4) 0%, transparent 70%)',
            left: `${mousePosition.x - 20}%`,
            top: `${mousePosition.y - 20}%`,
          }}
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-60" />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white/50" />
        
        {/* Decorative orbs */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-slate-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-900/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-slate-600/10 rounded-full blur-[60px] animate-float" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-slate-900/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-200 border border-slate-300 text-slate-900 px-5 py-2.5 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span>Trusted by 1000+ Happy Customers</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-800 mb-6 leading-[1.1] tracking-tight animate-slide-up">
              Import Your
              <span className="block text-gradient">
                Dream Vehicle
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Premium vehicle imports from Japan with transparent pricing, end-to-end handling, and verified suppliers. Your journey starts here.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/stocks" className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-900 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg shadow-slate-800/20 hover:shadow-slate-800/30 transform hover:-translate-y-1">
                <span>Browse Stock</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/calculator" className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 px-8 rounded-2xl border border-slate-200 hover:border-slate-900/50 transition-all duration-300 shadow-sm">
                <Zap className="w-5 h-5 text-slate-800" />
                Get Quote
              </Link>
            </div>

            {/* Mini Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="w-5 h-5 text-slate-800" />
                <span>100% Verified</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Globe className="w-5 h-5 text-slate-800" />
                <span>Japan Direct</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Zap className="w-5 h-5 text-slate-800" />
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column - Stats Card */}
          <div className="relative animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {/* Main Stats Card */}
            <div className="relative p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-900/10 via-transparent to-slate-900/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="text-center mb-8">
                  <span className="inline-block px-4 py-1 rounded-full bg-slate-200 text-slate-900 text-sm font-medium mb-3">
                    Our Track Record
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800">Why Choose Us</h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:border-slate-900/30 transition-colors">
                    <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">1000+</div>
                    <div className="text-slate-600 text-sm">Vehicles Imported</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:border-slate-900/30 transition-colors">
                    <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">10+</div>
                    <div className="text-slate-600 text-sm">Years Experience</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:border-slate-900/30 transition-colors">
                    <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">98%</div>
                    <div className="text-slate-600 text-sm">Satisfaction Rate</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:border-slate-900/30 transition-colors">
                    <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">24/7</div>
                    <div className="text-slate-600 text-sm">Support Available</div>
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="mt-8 p-4 rounded-2xl bg-slate-100 border border-slate-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-700 font-medium">Need Help?</p>
                      <p className="text-slate-800 font-bold text-lg">077 037 6789</p>
                    </div>
                    <button
                      onClick={scrollToContact}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium transition-colors"
                    >
                      Call Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-slate-800 text-white text-sm font-medium shadow-lg shadow-slate-900/30 animate-bounce">
              🔥 Hot Deals
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-slate-300 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-slate-900 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
