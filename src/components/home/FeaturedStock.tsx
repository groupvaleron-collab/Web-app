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
        <div className="mt-10 sm:mt-12 md:mt-16 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-100 to-slate-100 border border-slate-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-800 mb-1 sm:mb-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">Can't find what you're looking for?</span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base">
                Request a specific vehicle from Japanese auctions and we'll find it for you.
              </p>
            </div>
            <Link 
              href="/calculator" 
              className="btn-primary whitespace-nowrap text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6"
            >
              Request Vehicle
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
