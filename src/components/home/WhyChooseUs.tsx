'use client'

import { Award, Receipt, Workflow, BadgeCheck, Lock, Headphones } from 'lucide-react'
import { features } from '@/data/mockData'

const iconMap: Record<string, React.ReactNode> = {
  Award: <Award className="w-7 h-7" />,
  Receipt: <Receipt className="w-7 h-7" />,
  Workflow: <Workflow className="w-7 h-7" />,
  BadgeCheck: <BadgeCheck className="w-7 h-7" />,
  Lock: <Lock className="w-7 h-7" />,
  Headphones: <Headphones className="w-7 h-7" />,
}

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-slate-900/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-slate-900/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-slate-800 font-semibold text-sm uppercase tracking-wider mb-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-slate-900" />
            Why Choose Us
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-slate-900" />
          </span>
          <h2 className="section-title">
            Your Trusted <span className="text-gradient">Vehicle Import</span> Partner
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            We make importing vehicles from Japan simple, transparent, and hassle-free. Here's why thousands trust us.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-900/30 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 cursor-default overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/0 to-slate-900/0 group-hover:from-slate-900/5 group-hover:to-slate-900/5 transition-all duration-500" />
              
              {/* Icon */}
              <div className="relative w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-100 rounded-xl flex items-center justify-center text-slate-800 mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-slate-900/10 transition-all duration-300 border border-slate-300">
                {iconMap[feature.icon]}
              </div>
              
              {/* Content */}
              <h3 className="relative text-xl font-semibold text-slate-800 mb-3 group-hover:text-slate-800 transition-colors">
                {feature.title}
              </h3>
              <p className="relative text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                {feature.description}
              </p>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-900/5 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 pt-12 border-t border-slate-200">
          <p className="text-center text-slate-500 mb-10 text-sm uppercase tracking-wider">Certified & Partnered With</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['USS Japan', 'TAA', 'JAA', 'JEVIC', 'JAAI'].map((partner) => (
              <div 
                key={partner}
                className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-lg hover:border-slate-900/30 hover:text-slate-800 transition-all cursor-default shadow-sm"
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
