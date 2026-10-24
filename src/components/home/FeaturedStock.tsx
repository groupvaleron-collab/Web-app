'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { vehicles } from '@/data/mockData'
import VehicleCard from '@/components/vehicles/VehicleCard'

export default function FeaturedStock() {
  const featuredVehicles = vehicles.filter(v => v.importStatus !== 'sold').slice(0, 6)

  return (
    <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Decorative elements - hidden on mobile */}
      <div className="hidden sm:block absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-slate-900/5 rounded-full blur-[100px] md:blur-[150px]" />
      <div className="hidden sm:block absolute bottom-0 left-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-slate-900/5 rounded-full blur-[100px] md:blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-4">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Featured Stock
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-0">
              Latest <span className="text-gradient">Vehicles</span> Available
            </h2>
            <p className="text-slate-600 mt-2 sm:mt-3 max-w-xl text-sm sm:text-base">
              Premium imported vehicles ready for your inspection with complete documentation.
            </p>
          </div>
          <Link
            href="/stocks"
            className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-slate-200 hover:border-slate-900/50 text-slate-700 font-medium transition-all duration-300 hover:bg-slate-50 self-start md:self-auto shadow-sm text-sm sm:text-base"
          >
            View All Stock
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-12 md:mt-16 p-5 sm:p-6 md:px-8 rounded-2xl bg-slate-50 border border-slate-200">
          {/* Phone: stacked, the button full width. Tablet and up: one row, the button on the right. */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <span className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200 grid place-items-center text-slate-800">
                <Sparkles className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-base">Can&apos;t find what you&apos;re looking for?</p>
                <p className="text-slate-600 text-sm sm:text-base mt-0.5">
                  Request a specific vehicle from Japanese auctions and we&apos;ll find it for you.
                </p>
              </div>
            </div>
            <Link
              href="/#contact"
              className="btn-primary shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base py-3 px-5 sm:px-6"
            >
              Request Vehicle
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
