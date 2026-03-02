'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Fuel,
  Gauge,
  Settings,
  Calendar,
  Palette,
  Award,
  Clock,
  CheckCircle,
  Ship,
  Factory,
  ShieldCheck,
  FileText,
  Phone,
  MessageCircle,
  ArrowLeft,
  Expand
} from 'lucide-react'
import { vehicles } from '@/data/mockData'

export default function VehicleDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const vehicle = vehicles.find(v => v.id === params.id)

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
          <Link href="/stocks" className="btn-primary">
            Back to Stock
          </Link>
        </div>
      </div>
    )
  }

  const getStatusBadge = () => {
    switch (vehicle.importStatus) {
      case 'available':
        return <span className="badge-available text-xs sm:text-sm">🟢 Available</span>
      case 'reserved':
        return <span className="badge-reserved text-xs sm:text-sm">🟡 Reserved</span>
      case 'sold':
        return <span className="badge-sold text-xs sm:text-sm">🔴 Sold</span>
    }
  }

  const getReceivedStatusDisplay = () => {
    switch (vehicle.receivedStatus) {
      case 'received':
        return {
          icon: <CheckCircle className="w-5 h-5 text-slate-700" />,
          text: 'Vehicle Received in Sri Lanka',
          color: 'text-slate-800 bg-slate-100',
        }
      case 'shipping':
        return {
          icon: <Ship className="w-5 h-5 text-blue-600" />,
          text: 'Currently In Shipping',
          color: 'text-blue-700 bg-blue-50',
        }
      case 'auction':
        return {
          icon: <Factory className="w-5 h-5 text-purple-600" />,
          text: 'In Auction',
          color: 'text-purple-700 bg-purple-50',
        }
      case 'customs':
        return {
          icon: <ShieldCheck className="w-5 h-5 text-orange-600" />,
          text: 'In Customs Clearance',
          color: 'text-orange-700 bg-orange-50',
        }
    }
  }

  const receivedStatus = getReceivedStatusDisplay()

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
  }

  const specs = [
    { label: 'Year', value: vehicle.year, icon: Calendar },
    { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} km`, icon: Gauge },
    { label: 'Transmission', value: vehicle.transmission, icon: Settings },
    { label: 'Fuel Type', value: vehicle.fuelType, icon: Fuel },
    { label: 'Engine', value: vehicle.engineCapacity, icon: Settings },
    { label: 'Color', value: vehicle.color, icon: Palette },
    { label: 'Grade', value: vehicle.grade || 'N/A', icon: Award },
  ]

  return (
    <div className="min-h-screen bg-slate-50 pt-20 sm:pt-24">
      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-fade-in">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl"
          >
            &times;
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </button>
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={vehicle.images[currentImageIndex]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            />
          </div>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Stock
        </button>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="lg:col-span-3 space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] shadow-sm border border-slate-200">
              <img
                src={vehicle.images[currentImageIndex]}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />

              {/* Image Controls */}
              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
                  </button>
                </>
              )}

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-3 right-3 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all"
              >
                <Expand className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              </button>

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                {getStatusBadge()}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {vehicle.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-slate-900 ring-2 ring-slate-900/20'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Auction Sheet & Condition Report */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              {vehicle.auctionSheet && (
                <a
                  href={vehicle.auctionSheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-slate-400 transition-colors"
                >
                  <FileText className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-700">Auction Sheet</span>
                </a>
              )}
              {vehicle.conditionReport && (
                <a
                  href={vehicle.conditionReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-xl border border-slate-200 hover:border-slate-400 transition-colors"
                >
                  <FileText className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-700">Condition Report</span>
                </a>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Actions */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">{vehicle.year} • {vehicle.color} • {vehicle.engineCapacity}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    isLiked
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-red-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:border-slate-400 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Received Status */}
            <div className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl ${receivedStatus?.color}`}>
              {receivedStatus?.icon}
              <div>
                <p className="font-semibold text-sm sm:text-base">{receivedStatus?.text}</p>
                {vehicle.estimatedArrival && (
                  <p className="text-xs sm:text-sm opacity-80">
                    Est. Arrival: {new Date(vehicle.estimatedArrival).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                      <spec.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-slate-500">{spec.label}</p>
                      <p className="font-semibold text-slate-900 text-sm sm:text-base">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs sm:text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3">Description</h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{vehicle.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4 sticky bottom-4">
              {vehicle.importStatus === 'available' && (
                <>
                  {session ? (
                    <button className="btn-primary w-full text-base sm:text-lg py-3 sm:py-4">
                      Reserve This Vehicle
                    </button>
                  ) : (
                    <Link href="/api/auth/signin" className="btn-primary w-full text-base sm:text-lg py-3 sm:py-4 text-center block">
                      Sign In to Reserve
                    </Link>
                  )}
                </>
              )}

              <button
                onClick={() => setShowInquiryForm(!showInquiryForm)}
                className="btn-secondary w-full text-base sm:text-lg py-3 sm:py-4"
              >
                Send Inquiry
              </button>

              <div className="flex gap-3 sm:gap-4">
                <a
                  href="tel:0370376789"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-200/80 hover:bg-slate-200 backdrop-blur-sm rounded-xl text-slate-700 font-medium transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call Us
                </a>
                <a
                  href="https://wa.me/94370376789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-700 rounded-xl text-white font-medium transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Inquiry Form */}
            {showInquiryForm && (
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 animate-slide-down">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Send Inquiry</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input type="text" className="input-field" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" className="input-field" placeholder="Your email" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input type="tel" className="input-field" placeholder="Your phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea
                      className="input-field resize-none"
                      rows={4}
                      placeholder={`I'm interested in the ${vehicle.year} ${vehicle.brand} ${vehicle.model}...`}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Send Inquiry
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
