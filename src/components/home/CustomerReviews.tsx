'use client'

import Link from 'next/link'
import { Star, ArrowRight, Quote } from 'lucide-react'
import { reviews } from '@/data/mockData'

export default function CustomerReviews() {
  const featuredReviews = reviews.slice(0, 3)

  return (
    <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Decorative elements - hidden on mobile */}
      <div className="hidden sm:block absolute top-1/2 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-slate-900/5 rounded-full blur-[100px] md:blur-[150px] -translate-y-1/2" />
      <div className="hidden sm:block absolute top-1/2 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-slate-900/5 rounded-full blur-[100px] md:blur-[150px] -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
            <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-slate-900" />
            Customer Reviews
            <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-slate-900" />
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            What Our <span className="text-gradient">Customers</span> Say
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Join thousands of satisfied customers who trusted us with their vehicle imports.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-12">
          {featuredReviews.map((review, index) => (
            <div
              key={review.id}
              className="group relative p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-slate-900/30 transition-all duration-500 hover:shadow-lg md:hover:shadow-xl hover:shadow-slate-200/50"
            >
              {/* Quote icon */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800/50" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < review.rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-slate-600 mb-4 sm:mb-6 leading-relaxed line-clamp-3 sm:line-clamp-4 text-sm sm:text-base">
                "{review.reviewMessage}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={review.customerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName)}&background=10b981&color=fff`}
                  alt={review.customerName}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover border-2 border-slate-300"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">{review.customerName}</p>
                  <p className="text-xs sm:text-sm text-slate-500 truncate">{review.vehiclePurchased}</p>
                </div>
              </div>

              {/* Date badge */}
              <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                <span className="text-[10px] sm:text-xs text-slate-400">
                  {new Date(review.purchaseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/reviews"
            className="group inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-slate-200 hover:border-slate-900/50 text-slate-700 font-medium text-sm sm:text-base transition-all duration-300 hover:bg-slate-50 shadow-sm"
          >
            View All Reviews
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="mt-10 sm:mt-12 md:mt-16 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-100 to-slate-100 border border-slate-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-0.5 sm:mb-1">1000+</div>
              <p className="text-slate-600 text-xs sm:text-sm">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-0.5 sm:mb-1">4.9</div>
              <p className="text-slate-600 text-xs sm:text-sm">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-0.5 sm:mb-1">98%</div>
              <p className="text-slate-600 text-xs sm:text-sm">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-0.5 sm:mb-1">10+</div>
              <p className="text-slate-600 text-xs sm:text-sm">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
