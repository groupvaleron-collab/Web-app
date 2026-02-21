'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import { vehicles } from '@/data/mockData'
import VehicleCard from '@/components/vehicles/VehicleCard'

export default function FeaturedStock() {
  const featuredVehicles = vehicles.filter(v => v.importStatus !== 'sold').slice(0, 6)

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-900/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-900/5 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center gap-2 text-slate-800 font-semibold text-sm uppercase tracking-wider mb-4">
              <TrendingUp className="w-4 h-4" />
              Featured Stock
            </span>
            <h2 className="section-title mb-0">
              Latest <span className="text-gradient">Vehicles</span> Available
            </h2>
            <p className="text-slate-600 mt-3 max-w-xl">
              Premium imported vehicles ready for your inspection. Each vehicle comes with complete documentation and inspection reports.
            </p>
          </div>
          <Link
            href="/stocks"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-900/50 text-slate-700 font-medium transition-all duration-300 hover:bg-slate-50 self-start md:self-auto shadow-sm"
          >
            View All Stock
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-100 border border-slate-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-800 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Can't find what you're looking for?</span>
              </div>
              <p className="text-slate-600">
                Request a specific vehicle from Japanese auctions and we'll find it for you.
              </p>
            </div>
            <Link 
              href="/calculator" 
              className="btn-primary whitespace-nowrap"
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
