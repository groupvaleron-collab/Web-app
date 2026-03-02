'use client'

import { Award, Receipt, Workflow, BadgeCheck, Lock, Headphones } from 'lucide-react'
import { features } from '@/data/mockData'

const iconMap: Record<string, React.ReactNode> = {
  Award: <Award className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
  Receipt: <Receipt className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
  Workflow: <Workflow className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
  BadgeCheck: <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
  Lock: <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
  Headphones: <Headphones className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />,
}

export default function WhyChooseUs() {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Decorative elements - hidden on mobile */}
      <div className="hidden sm:block absolute top-1/4 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-slate-900/5 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="hidden sm:block absolute bottom-1/4 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-slate-900/5 rounded-full blur-[80px] md:blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
            <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-slate-900" />
            Why Choose Us
            <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-slate-900" />
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            Your Trusted <span className="text-gradient">Vehicle Import</span> Partner
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            We make importing vehicles from Japan simple, transparent, and hassle-free.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-slate-900/30 transition-all duration-500 hover:shadow-lg md:hover:shadow-xl hover:shadow-slate-200/50 cursor-default overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/0 to-slate-900/0 group-hover:from-slate-900/5 group-hover:to-slate-900/5 transition-all duration-500" />
              
              {/* Icon */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-slate-200 to-slate-100 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-800 mb-4 sm:mb-5 md:mb-6 group-hover:scale-105 md:group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-slate-900/10 transition-all duration-300 border border-slate-300">
                {iconMap[feature.icon]}
              </div>
              
              {/* Content */}
              <h3 className="relative text-base sm:text-lg md:text-xl font-semibold text-slate-800 mb-2 sm:mb-3 group-hover:text-slate-800 transition-colors">
                {feature.title}
              </h3>
              <p className="relative text-sm sm:text-base text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors line-clamp-3 sm:line-clamp-none">
                {feature.description}
              </p>

              {/* Corner accent - hidden on mobile */}
              <div className="hidden sm:block absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-slate-900/5 to-transparent rounded-bl-[80px] md:rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 md:pt-12 border-t border-slate-200">
          <p className="text-center text-slate-500 mb-6 sm:mb-8 md:mb-10 text-xs sm:text-sm uppercase tracking-wider">Certified & Partnered With</p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 md:gap-8 lg:gap-16">
            {['USS Japan', 'TAA', 'JAA', 'JEVIC', 'JAAI'].map((partner) => (
              <div 
                key={partner}
                className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm md:text-lg hover:border-slate-900/30 hover:text-slate-800 transition-all cursor-default shadow-sm"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
