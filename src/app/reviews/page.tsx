'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Star, Filter, CheckCircle, User, Calendar, Car, X } from 'lucide-react'
import { reviews as allReviews } from '@/data/mockData'

export default function ReviewsPage() {
  const { data: session } = useSession()
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showAddReview, setShowAddReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    message: '',
    vehiclePurchased: '',
  })

  // Calculate rating stats
  const totalReviews = allReviews.length
  const averageRating = (allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
  const ratingBreakdown = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: allReviews.filter(r => r.rating === rating).length,
    percentage: Math.round((allReviews.filter(r => r.rating === rating).length / totalReviews) * 100),
  }))

  // Filter reviews
  const filteredReviews = filterRating
    ? allReviews.filter(r => r.rating === filterRating)
    : allReviews

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send to API
    console.log('Submitting review:', newReview)
    setShowAddReview(false)
    setNewReview({ rating: 5, message: '', vehiclePurchased: '' })
  }

  return (
    <div className="min-h-screen bg-slate-50 sm:pt-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="text-center mb-5 md:mb-10">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-1 sm:mb-3">
            Customer <span className="text-gradient">Reviews</span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-500 max-w-2xl mx-auto">
            What our customers say about their experience
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 lg:gap-8">
          {/* Sidebar - Rating Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl lg:rounded-2xl border border-slate-200 p-3 sm:p-5 lg:sticky lg:top-24">
              {/* Mobile: Compact horizontal layout */}
              <div className="flex lg:hidden items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold text-slate-800">{averageRating}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(Number(averageRating))
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">({totalReviews})</span>
                </div>
                <div className="flex items-center gap-1 ml-auto">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                        filterRating === rating
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {rating}★
                    </button>
                  ))}
                </div>
                {filterRating && (
                  <button
                    onClick={() => setFilterRating(null)}
                    className="text-xs text-red-500 font-medium flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>

              {/* Desktop: Full vertical layout */}
              <div className="hidden lg:block">
                {/* Average Rating */}
                <div className="text-center mb-6 pb-6 border-b border-slate-100">
                  <div className="text-5xl font-bold text-slate-800 mb-2">{averageRating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.round(Number(averageRating))
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">Based on {totalReviews} reviews</p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2 mb-6">
                  {ratingBreakdown.map((item) => (
                    <button
                      key={item.rating}
                      onClick={() => setFilterRating(filterRating === item.rating ? null : item.rating)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                        filterRating === item.rating
                          ? 'bg-slate-100 ring-2 ring-slate-900/20'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium w-3">{item.rating}</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="flex-grow bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-500 w-8 text-right">{item.count}</span>
                    </button>
                  ))}
                </div>

                {filterRating && (
                  <button
                    onClick={() => setFilterRating(null)}
                    className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    <X className="w-4 h-4" />
                    Clear Filter
                  </button>
                )}

                {/* Add Review Button */}
                {session && (
                  <button
                    onClick={() => setShowAddReview(true)}
                    className="btn-primary w-full mt-6"
                  >
                    Write a Review
                  </button>
                )}
                {!session && (
                  <p className="text-sm text-slate-500 text-center mt-6">
                    Sign in to leave a review
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* Filter Info */}
            {filterRating && (
              <div className="mb-6 flex items-center gap-2 text-base text-slate-600">
                <Filter className="w-5 h-5" />
                Showing {filteredReviews.length} reviews with {filterRating} stars
              </div>
            )}

            {/* Review Cards */}
            <div className="space-y-3 sm:space-y-5">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-3 sm:p-5">
                  <div className="flex gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      {review.customerImage ? (
                        <img
                          src={review.customerImage}
                          alt={review.customerName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2 sm:gap-4 mb-1">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                              {review.customerName}
                            </h3>
                            {review.isVerified && (
                              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 text-xs font-medium rounded-full border border-slate-200">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-500 mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1 truncate">
                              <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">{review.vehiclePurchased}</span>
                            </span>
                            <span className="hidden sm:block">|</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                              {new Date(review.purchaseDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2">
                        "{review.reviewMessage}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-base text-slate-500">No reviews found with this filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg p-6 animate-slide-up-and-fade max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Write a Review</h2>
                <button
                  onClick={() => setShowAddReview(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none p-1"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= newReview.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-slate-300 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicle Purchased */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Vehicle Purchased
                  </label>
                  <input
                    type="text"
                    value={newReview.vehiclePurchased}
                    onChange={(e) => setNewReview(prev => ({ ...prev, vehiclePurchased: e.target.value }))}
                    className="input-field text-base"
                    placeholder="e.g., 2022 Toyota Prius"
                    required
                  />
                </div>

                {/* Review Message */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.message}
                    onChange={(e) => setNewReview(prev => ({ ...prev, message: e.target.value }))}
                    className="input-field resize-none text-base"
                    rows={4}
                    placeholder="Share your experience with us..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="btn-secondary flex-1 py-3 text-base"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1 py-3 text-base">
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
