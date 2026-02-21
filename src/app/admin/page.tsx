'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Car,
  Users,
  Star,
  FileText,
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  TrendingUp,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  X,
  Upload,
  Save
} from 'lucide-react'
import { vehicles, reviews, mockOrders } from '@/data/mockData'

type AdminTab = 'dashboard' | 'vehicles' | 'orders' | 'reviews' | 'users' | 'settings'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    redirect('/api/auth/signin')
  }

  // In production, check for admin role
  // if ((session.user as any).role !== 'admin') {
  //   redirect('/dashboard')
  // }

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles' as AdminTab, label: 'Vehicles', icon: Car },
    { id: 'orders' as AdminTab, label: 'Orders', icon: Package },
    { id: 'reviews' as AdminTab, label: 'Reviews', icon: Star },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
  ]

  const stats = [
    { label: 'Total Vehicles', value: vehicles.length, icon: Car, color: 'bg-blue-500', change: '+12%' },
    { label: 'Active Orders', value: mockOrders.length, icon: Package, color: 'bg-slate-900', change: '+5%' },
    { label: 'Total Reviews', value: reviews.length, icon: Star, color: 'bg-yellow-500', change: '+8%' },
    { label: 'Revenue', value: 'LKR 15.2M', icon: DollarSign, color: 'bg-purple-500', change: '+23%' },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage your vehicle import business</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="font-medium text-gray-700">{session.user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-soft">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-slate-700 text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-gray-100">
                        <th className="pb-3 text-sm font-medium text-gray-500">Order ID</th>
                        <th className="pb-3 text-sm font-medium text-gray-500">Vehicle</th>
                        <th className="pb-3 text-sm font-medium text-gray-500">Customer</th>
                        <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                        <th className="pb-3 text-sm font-medium text-gray-500">Amount</th>
                        <th className="pb-3 text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-50">
                          <td className="py-4 text-sm font-medium text-gray-900">{order.orderId}</td>
                          <td className="py-4 text-sm text-gray-600">
                            {order.vehicle.year} {order.vehicle.brand} {order.vehicle.model}
                          </td>
                          <td className="py-4 text-sm text-gray-600">John Doe</td>
                          <td className="py-4">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {order.stages.find(s => s.active)?.label}
                            </span>
                          </td>
                          <td className="py-4 text-sm font-medium text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="py-4">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-soft p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Vehicle Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-slate-900" />
                        Available
                      </span>
                      <span className="font-medium">{vehicles.filter(v => v.importStatus === 'available').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        Reserved
                      </span>
                      <span className="font-medium">{vehicles.filter(v => v.importStatus === 'reserved').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Sold
                      </span>
                      <span className="font-medium">{vehicles.filter(v => v.importStatus === 'sold').length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Reviews</h3>
                  <div className="space-y-3">
                    {reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-500" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{review.customerName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveTab('vehicles')
                        setShowAddVehicle(true)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add New Vehicle
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      <FileText className="w-5 h-5" />
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Vehicle Inventory</h2>
                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Vehicle
                </button>
              </div>

              {/* Vehicle Table */}
              <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={vehicle.images[0]}
                              alt={`${vehicle.brand} ${vehicle.model}`}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{vehicle.brand} {vehicle.model}</p>
                              <p className="text-sm text-gray-500">{vehicle.color} • {vehicle.transmission}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{vehicle.year}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(vehicle.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            vehicle.importStatus === 'available'
                              ? 'bg-slate-200 text-slate-800'
                              : vehicle.importStatus === 'reserved'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {vehicle.importStatus.charAt(0).toUpperCase() + vehicle.importStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {vehicle.receivedStatus === 'received' && 'Sri Lanka'}
                          {vehicle.receivedStatus === 'shipping' && 'In Transit'}
                          {vehicle.receivedStatus === 'auction' && 'Japan'}
                          {vehicle.receivedStatus === 'customs' && 'Port'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Vehicle Modal */}
              {showAddVehicle && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Add New Vehicle</h2>
                      <button
                        onClick={() => setShowAddVehicle(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <form className="p-6 space-y-6">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Images</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-300 transition-colors cursor-pointer">
                          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                          <input type="text" className="input-field" placeholder="e.g., Toyota" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                          <input type="text" className="input-field" placeholder="e.g., Prius" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <input type="number" className="input-field" placeholder="e.g., 2023" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mileage (km)</label>
                          <input type="number" className="input-field" placeholder="e.g., 25000" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                          <select className="input-field">
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                          <select className="input-field">
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Electric">Electric</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)</label>
                          <input type="number" className="input-field" placeholder="e.g., 5000000" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Engine Capacity</label>
                          <input type="text" className="input-field" placeholder="e.g., 1.8L" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                          <input type="text" className="input-field" placeholder="e.g., Pearl White" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                          <input type="text" className="input-field" placeholder="e.g., 4.5" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Import Status</label>
                          <select className="input-field">
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="sold">Sold</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location Status</label>
                          <select className="input-field">
                            <option value="received">Received in Sri Lanka</option>
                            <option value="shipping">In Shipping</option>
                            <option value="auction">In Auction</option>
                            <option value="customs">Customs Clearance</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="input-field resize-none" rows={3} placeholder="Vehicle description..." />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                        <input type="text" className="input-field" placeholder="e.g., Cruise Control, Reverse Camera, Bluetooth" />
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setShowAddVehicle(false)}
                          className="btn-secondary flex-1"
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                          <Save className="w-5 h-5" />
                          Save Vehicle
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
              
              <div className="bg-white rounded-xl shadow-soft p-6">
                <p className="text-gray-600">Order management interface - update vehicle status, manage payments, and track deliveries.</p>
                {/* Similar table structure as vehicles */}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Review Management</h2>
              
              <div className="bg-white rounded-xl shadow-soft divide-y divide-gray-100">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{review.vehiclePurchased}</p>
                        <p className="text-gray-600">"{review.reviewMessage}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.isVerified && (
                        <span className="px-2 py-1 bg-slate-200 text-slate-800 text-xs font-medium rounded-full">
                          Verified
                        </span>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              
              <div className="bg-white rounded-xl shadow-soft p-6">
                <p className="text-gray-600">Manage registered users, view their orders, and handle support requests.</p>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Admin Settings</h2>
              
              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4 max-w-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                    <input type="text" className="input-field" defaultValue="Carz Vehicle Imports" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input type="email" className="input-field" defaultValue="info@carz.lk" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" className="input-field" defaultValue="037 037 6789" />
                  </div>
                  <button className="btn-primary">Save Settings</button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-soft p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded border-gray-300" />
                    <span className="text-gray-700">Send email notifications for new orders</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded border-gray-300" />
                    <span className="text-gray-700">Send SMS alerts for payment confirmations</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 text-primary-600 rounded border-gray-300" />
                    <span className="text-gray-700">Enable WhatsApp notifications</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
