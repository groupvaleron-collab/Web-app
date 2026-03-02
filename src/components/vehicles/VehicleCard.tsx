'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Fuel, 
  Gauge, 
  Settings, 
  Calendar,
  Check,
  Ship,
  Factory,
  ShieldCheck,
  Heart,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Vehicle } from '@/data/mockData'

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
}

export default function VehicleCard({ vehicle, viewMode = 'grid' }: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length)
  }

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const getStatusBadge = () => {
    switch (vehicle.importStatus) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-900 border border-slate-300">
            <span className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" />
            Available
          </span>
        )
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            Reserved
          </span>
        )
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Sold
          </span>
        )
      default:
        return null
    }
  }

  const getReceivedStatus = () => {
    switch (vehicle.receivedStatus) {
      case 'received':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium bg-slate-200 text-slate-900 border border-slate-300">
            <Check className="w-3 h-3" />
            In Sri Lanka
          </span>
        )
      case 'shipping':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
            <Ship className="w-3 h-3" />
            Shipping
          </span>
        )
      case 'auction':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
            <Factory className="w-3 h-3" />
            Auction
          </span>
        )
      case 'customs':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
            <ShieldCheck className="w-3 h-3" />
            Customs
          </span>
        )
      default:
        return null
    }
  }
  
  if (viewMode === 'list') {
    return (
      <Link href={`/stocks/${vehicle.id}`}>
        <div className="group relative grid grid-cols-1 sm:grid-cols-3 gap-4 items-center rounded-2xl bg-white border border-slate-200 hover:border-slate-900/30 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-slate-200/50 p-4">
          {/* Image */}
          <div className="relative h-40 sm:h-full rounded-lg overflow-hidden">
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 left-2 z-20">
              {getStatusBadge()}
            </div>
          </div>
          
          {/* Content */}
          <div className="sm:col-span-2">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <p className="text-sm text-slate-500">{vehicle.year} • {vehicle.color}</p>
              </div>
              <div className="flex-shrink-0">
                {getReceivedStatus()}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Gauge className="w-4 h-4 text-slate-500" />
                <span>{vehicle.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>{vehicle.transmission}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Fuel className="w-4 h-4 text-slate-500" />
                <span>{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{vehicle.engineCapacity}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {vehicle.grade && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-md border border-slate-200">
                  <Sparkles className="w-3 h-3" />
                  Grade: {vehicle.grade}
                </span>
              )}
              <button className="group/btn flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all font-medium text-sm">
                View Details
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/stocks/${vehicle.id}`}>
      <div className="group relative rounded-2xl bg-white border border-slate-200 hover:border-slate-900/30 transition-all duration-500 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-slate-200/50">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/0 to-slate-900/0 group-hover:from-slate-900/5 group-hover:to-slate-900/5 transition-all duration-500 pointer-events-none z-10" />
        
        {/* Image Carousel */}
        <div className="relative h-48 sm:h-52 overflow-hidden">
          <img
            src={vehicle.images[currentImageIndex]}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          
          {/* Image Navigation */}
          {vehicle.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-xl rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-200 shadow-lg"
              >
                <ChevronLeft className="w-4 h-4 text-slate-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-xl rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-slate-200 shadow-lg"
              >
                <ChevronRight className="w-4 h-4 text-slate-700" />
              </button>
              
              {/* Image Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {vehicle.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-slate-900 w-5' : 'bg-white/60 w-1.5'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Like Button */}
          <button
            onClick={toggleLike}
            className="absolute top-3 right-3 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 hover:bg-white backdrop-blur-xl rounded-xl flex items-center justify-center transition-all border border-slate-200 shadow-lg z-20"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-slate-600'
              }`}
            />
          </button>

          {/* Status Badge */}
          <div className="absolute top-3 left-3 z-20">
            {getStatusBadge()}
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4 sm:p-5 z-10">
          {/* Title & Received Status */}
          <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-slate-800 transition-colors">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-slate-500">{vehicle.year} • {vehicle.color}</p>
            </div>
            <div className="flex-shrink-0">
              {getReceivedStatus()}
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-slate-800" />
              </div>
              <span>{vehicle.mileage.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Settings className="w-4 h-4 text-slate-800" />
              </div>
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Fuel className="w-4 h-4 text-slate-800" />
              </div>
              <span>{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-slate-800" />
              </div>
              <span>{vehicle.engineCapacity}</span>
            </div>
          </div>

          {/* Grade Badge */}
          {vehicle.grade && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-900 text-xs font-medium rounded-lg border border-slate-300">
                <Sparkles className="w-3 h-3" />
                Grade: {vehicle.grade}
              </span>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-end pt-3 sm:pt-4 border-t border-slate-100">
            <button className="group/btn flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-100 hover:bg-slate-800 text-slate-900 hover:text-white rounded-xl border border-slate-300 hover:border-slate-800 transition-all font-medium text-sm">
              View Details
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}