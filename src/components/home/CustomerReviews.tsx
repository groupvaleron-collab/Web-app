'use client'

import Link from 'next/link'
import { Star, ArrowRight, Quote } from 'lucide-react'
import { reviews } from '@/data/mockData'

export default function CustomerReviews() {
  const featuredReviews = reviews.slice(0, 3)

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-slate-900/5 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-slate-900/5 rounded-full blur-[150px] -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-slate-800 font-semibold text-sm uppercase tracking-wider mb-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-slate-900" />
            Customer Reviews
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-slate-900" />
          </span>
          <h2 className="section-title">
            What Our <span className="text-gradient">Customers</span> Say
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Join thousands of satisfied customers who trusted us with their vehicle imports.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredReviews.map((review, index) => (
            <div
              key={review.id}
              className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-900/30 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                <Quote className="w-5 h-5 text-slate-800/50" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-slate-600 mb-6 leading-relaxed line-clamp-4">
                "{review.reviewMessage}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={review.customerImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName)}&background=10b981&color=fff`}
                  alt={review.customerName}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-slate-300"
                />
                <div>
                  <p className="font-semibold text-slate-800">{review.customerName}</p>
                  <p className="text-sm text-slate-500">{review.vehiclePurchased}</p>
                </div>
              </div>

              {/* Date badge */}
              <div className="absolute bottom-4 right-4">
                <span className="text-xs text-slate-400">
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
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-900/50 text-slate-700 font-medium transition-all duration-300 hover:bg-slate-50 shadow-sm"
          >
            View All Reviews
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-100 border border-slate-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">1000+</div>
              <p className="text-slate-600 text-sm">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">4.9</div>
              <p className="text-slate-600 text-sm">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">98%</div>
              <p className="text-slate-600 text-sm">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">10+</div>
              <p className="text-slate-600 text-sm">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
