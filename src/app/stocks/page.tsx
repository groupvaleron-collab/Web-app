'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown, Grid, List, Sparkles } from 'lucide-react'
import { vehicles, filterOptions, Vehicle } from '@/data/mockData'
import VehicleCard from '@/components/vehicles/VehicleCard'

export default function StocksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  
  const [filters, setFilters] = useState({
    brand: '',
    yearMin: '',
    yearMax: '',
    transmission: '',
    fuelType: '',
    importStatus: '',
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      brand: '',
      yearMin: '',
      yearMax: '',
      transmission: '',
      fuelType: '',
      importStatus: '',
    })
    setSearchQuery('')
  }

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(v => 
        v.brand.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.color.toLowerCase().includes(query)
      )
    }

    if (filters.brand) {
      result = result.filter(v => v.brand === filters.brand)
    }

    if (filters.yearMin) {
      result = result.filter(v => v.year >= parseInt(filters.yearMin))
    }
    if (filters.yearMax) {
      result = result.filter(v => v.year <= parseInt(filters.yearMax))
    }

    if (filters.transmission) {
      result = result.filter(v => v.transmission === filters.transmission)
    }

    if (filters.fuelType) {
      result = result.filter(v => v.fuelType === filters.fuelType)
    }

    if (filters.importStatus) {
      result = result.filter(v => v.importStatus === filters.importStatus)
    }

    switch (sortBy) {
      case 'year-new':
        result.sort((a, b) => b.year - a.year)
        break
      case 'year-old':
        result.sort((a, b) => a.year - b.year)
        break
      case 'mileage-low':
        result.sort((a, b) => a.mileage - b.mileage)
        break
      default:
        break
    }

    return result
  }, [searchQuery, filters, sortBy])

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed top-1/4 left-0 w-[600px] h-[600px] bg-slate-900/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-0 w-[600px] h-[600px] bg-slate-900/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-slate-800 font-medium text-sm uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            Premium Collection
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-3">
            Vehicle <span className="text-gradient">Stock</span>
          </h1>
          <p className="text-slate-500 text-lg">
            Browse our collection of premium imported vehicles from Japan
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-2xl bg-white backdrop-blur-xl border border-slate-200 p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by brand, model, or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 outline-none transition-all"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border transition-all ${
                isFilterOpen || activeFiltersCount > 0
                  ? 'bg-slate-100 border-slate-900 text-slate-800'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="font-medium">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-6 h-6 bg-slate-900 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full md:w-48 px-4 py-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 outline-none transition-all font-medium"
              >
                <option value="newest">Newest First</option>
                <option value="year-new">Year: Newest</option>
                <option value="year-old">Year: Oldest</option>
                <option value="mileage-low">Mileage: Lowest</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-5 pt-5 border-t border-slate-200 animate-slide-down">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">All Brands</option>
                    {filterOptions.brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Year From</label>
                  <select
                    value={filters.yearMin}
                    onChange={(e) => handleFilterChange('yearMin', e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">Any</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Year To</label>
                  <select
                    value={filters.yearMax}
                    onChange={(e) => handleFilterChange('yearMax', e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">Any</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">Any</option>
                    {filterOptions.transmissions.map(trans => (
                      <option key={trans} value={trans}>{trans}</option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Fuel Type</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">Any</option>
                    {filterOptions.fuelTypes.map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
                  <select
                    value={filters.importStatus}
                    onChange={(e) => handleFilterChange('importStatus', e.target.value)}
                    className="input-field py-2.5 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-500">
            Showing <span className="font-semibold text-slate-800">{filteredVehicles.length}</span> vehicles
          </p>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-3">No vehicles found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="btn-outline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
