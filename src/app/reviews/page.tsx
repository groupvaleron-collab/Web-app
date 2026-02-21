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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Read what our satisfied customers have to say about their vehicle import experience with us.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              {/* Average Rating */}
              <div className="text-center mb-6 pb-6 border-b border-gray-100">
                <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(Number(averageRating))
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Based on {totalReviews} reviews</p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3 mb-6">
                {ratingBreakdown.map((item) => (
                  <button
                    key={item.rating}
                    onClick={() => setFilterRating(filterRating === item.rating ? null : item.rating)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      filterRating === item.rating
                        ? 'bg-primary-50 border-2 border-primary-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium w-3">{item.rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-grow bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{item.count}</span>
                  </button>
                ))}
              </div>

              {filterRating && (
                <button
                  onClick={() => setFilterRating(null)}
                  className="w-full flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
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
                <p className="text-sm text-gray-500 text-center mt-6">
                  Sign in to leave a review
                </p>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Filter Info */}
            {filterRating && (
              <div className="mb-6 flex items-center gap-2 text-gray-600">
                <Filter className="w-5 h-5" />
                Showing {filteredReviews.length} reviews with {filterRating} stars
              </div>
            )}

            {/* Review Cards */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl shadow-soft p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      {review.customerImage ? (
                        <img
                          src={review.customerImage}
                          alt={review.customerName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-primary-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {review.customerName}
                            </h3>
                            {review.isVerified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-800 text-xs font-medium rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Verified Buyer
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Car className="w-4 h-4" />
                              {review.vehiclePurchased}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(review.purchaseDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-700 leading-relaxed">
                        "{review.reviewMessage}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews found with this filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Add Review Modal */}
        {showAddReview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
                <button
                  onClick={() => setShowAddReview(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= newReview.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicle Purchased */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Purchased
                  </label>
                  <input
                    type="text"
                    value={newReview.vehiclePurchased}
                    onChange={(e) => setNewReview(prev => ({ ...prev, vehiclePurchased: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., 2022 Toyota Prius"
                    required
                  />
                </div>

                {/* Review Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.message}
                    onChange={(e) => setNewReview(prev => ({ ...prev, message: e.target.value }))}
                    className="input-field resize-none"
                    rows={5}
                    placeholder="Share your experience with us..."
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddReview(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
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
