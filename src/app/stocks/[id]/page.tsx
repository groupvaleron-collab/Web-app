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
        return <span className="badge-available">🟢 Available</span>
      case 'reserved':
        return <span className="badge-reserved">🟡 Reserved</span>
      case 'sold':
        return <span className="badge-sold">🔴 Sold</span>
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
    <div className="min-h-screen bg-background">
      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <img
            src={vehicle.images[currentImageIndex]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Stock
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                  </button>
                </>
              )}

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md"
              >
                <Expand className="w-5 h-5 text-gray-700" />
              </button>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                {getStatusBadge()}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {vehicle.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary-500 ring-2 ring-primary-200'
                        : 'border-transparent opacity-70 hover:opacity-100'
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
            <div className="flex gap-4">
              {vehicle.auctionSheet && (
                <a
                  href={vehicle.auctionSheet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-700">Auction Sheet</span>
                </a>
              )}
              {vehicle.conditionReport && (
                <a
                  href={vehicle.conditionReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-primary-300 transition-colors"
                >
                  <FileText className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-gray-700">Condition Report</span>
                </a>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            {/* Title & Actions */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-gray-600">{vehicle.year} • {vehicle.color} • {vehicle.engineCapacity}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    isLiked
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-red-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-200 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Received Status */}
            <div className={`flex items-center gap-3 p-4 rounded-xl ${receivedStatus?.color}`}>
              {receivedStatus?.icon}
              <div>
                <p className="font-semibold">{receivedStatus?.text}</p>
                {vehicle.estimatedArrival && (
                  <p className="text-sm opacity-80">
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
            <div className="bg-white rounded-2xl p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                      <spec.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{spec.label}</p>
                      <p className="font-semibold text-gray-900">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white rounded-2xl p-6 shadow-soft">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              {vehicle.importStatus === 'available' && (
                <>
                  {session ? (
                    <button className="btn-primary w-full text-lg py-4">
                      Reserve This Vehicle
                    </button>
                  ) : (
                    <Link href="/api/auth/signin" className="btn-primary w-full text-lg py-4 text-center block">
                      Sign In to Reserve
                    </Link>
                  )}
                </>
              )}

              <button
                onClick={() => setShowInquiryForm(!showInquiryForm)}
                className="btn-secondary w-full text-lg py-4"
              >
                Send Inquiry
              </button>

              <div className="flex gap-4">
                <a
                  href="tel:0370376789"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
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
              <div className="bg-white rounded-2xl p-6 shadow-soft animate-slide-down">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Inquiry</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" className="input-field" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="input-field" placeholder="Your email" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" className="input-field" placeholder="Your phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
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
