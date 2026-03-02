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
    <div className="min-h-screen bg-slate-50 pt-0 sm:pt-4">
      
      {/* Background effects */}
      <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="fixed top-1/4 left-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-slate-900/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-slate-900/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
              Vehicle <span className="text-gradient">Stock</span>
            </h1>
            <Sparkles className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="rounded-xl bg-white/80 backdrop-blur-xl border border-slate-200 p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
          <div className="grid grid-cols-2 md:flex md:flex-row gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="flex-grow relative col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-11 pr-3 py-2.5 sm:py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 outline-none transition-all text-sm"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all ${
                isFilterOpen || activeFiltersCount > 0
                  ? 'bg-slate-100 border-slate-900 text-slate-800'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="font-medium text-sm">Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-slate-900 text-white text-[10px] rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none w-full h-full md:w-44 px-3 py-2.5 sm:py-3 pr-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/20 outline-none transition-all font-medium text-sm"
              >
                <option value="newest">Sort By</option>
                <option value="year-new">Year: Newest</option>
                <option value="year-old">Year: Oldest</option>
                <option value="mileage-low">Mileage: Lowest</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${
                  viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-3 pt-3 border-t border-slate-200 animate-slide-down">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                {/* Brand */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="input-field py-1.5 text-xs sm:py-2 sm:text-sm"
                  >
                    <option value="">All Brands</option>
                    {filterOptions.brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Year From</label>
                  <select
                    value={filters.yearMin}
                    onChange={(e) => handleFilterChange('yearMin', e.target.value)}
                    className="input-field py-1.5 text-xs sm:py-2 sm:text-sm"
                  >
                    <option value="">Any</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Year To</label>
                  <select
                    value={filters.yearMax}
                    onChange={(e) => handleFilterChange('yearMax', e.target.value)}
                    className="input-field py-1.5 text-xs sm:py-2 sm:text-sm"
                  >
                    <option value="">Any</option>
                    {filterOptions.years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Transmission</label>
                  <select
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                    className="input-field py-1.5 text-xs sm:py-2 sm:text-sm"
                  >
                    <option value="">Any</option>
                    {filterOptions.transmissions.map(trans => (
                      <option key={trans} value={trans}>{trans}</option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Fuel</label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="input-field py-1.5 text-xs sm:py-2 sm:text-sm"
                  >
                    <option value="">Any</option>
                    {filterOptions.fuelTypes.map(fuel => (
                      <option key={fuel} value={fuel}>{fuel}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                  <select
                    value={filters.importStatus}
                    onChange={(e) => handleFilterChange('importStatus', e.target.value)}
                    className="input-field py-1.5 text-xs sm:py-2 sm:text-sm"
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
                <div className="mt-3 flex justify-end">
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

        {/* Results Count & View Toggle (Mobile) */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <p className="text-xs sm:text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filteredVehicles.length}</span> vehicles
          </p>
          <div className="flex md:hidden items-center gap-1 p-0.5 bg-white border border-slate-200 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-400'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vehicle Grid */}
        {filteredVehicles.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5'
              : 'space-y-3'
          }>
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No vehicles found</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-xs mx-auto">Try adjusting your filters or search query</p>
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