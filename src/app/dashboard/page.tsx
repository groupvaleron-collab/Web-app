'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Car,
  FileText,
  Bell,
  Settings,
  User,
  Package,
  Clock,
  CreditCard,
  Download,
  Upload,
  Check,
  Ship,
  Anchor,
  ShieldCheck,
  Truck,
  Home,
  ChevronRight,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react'
import { mockOrders, Order, OrderStage } from '@/data/mockData'

type DashboardTab = 'overview' | 'tracking' | 'documents' | 'notifications' | 'settings'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    redirect('/auth/signin')
  }

  // For demo, using mock data
  const orders = mockOrders

  const tabs = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'tracking' as DashboardTab, label: 'Vehicle Tracking', icon: Car },
    { id: 'documents' as DashboardTab, label: 'Documents', icon: FileText },
    { id: 'notifications' as DashboardTab, label: 'Notifications', icon: Bell },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStageIcon = (stage: OrderStage) => {
    switch (stage) {
      case 'ordered': return Package
      case 'payment_confirmed': return CreditCard
      case 'shipped': return Ship
      case 'arrived_port': return Anchor
      case 'customs_clearance': return ShieldCheck
      case 'ready_delivery': return Truck
      case 'delivered': return Home
    }
  }

  const unreadNotifications = orders.reduce(
    (acc, order) => acc + order.notifications.filter(n => !n.read).length,
    0
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-16 h-16 rounded-full border-4 border-primary-100"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {session.user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-gray-600">Manage your vehicle imports and track orders</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Orders</p>
                  <p className="text-xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Ship className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">In Transit</p>
                  <p className="text-xl font-bold text-gray-900">
                    {orders.filter(o => ['shipped', 'arrived_port'].includes(o.currentStage)).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Outstanding</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(orders.reduce((acc, o) => acc + o.outstandingBalance, 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Notifications</p>
                  <p className="text-xl font-bold text-gray-900">{unreadNotifications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-soft p-2 space-y-1">
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
                  {tab.id === 'notifications' && unreadNotifications > 0 && (
                    <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
                
                {orders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-soft p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Car className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Orders</h3>
                    <p className="text-gray-600 mb-4">Browse our stock to find your perfect vehicle</p>
                    <a href="/stocks" className="btn-primary inline-block">
                      View Stock
                    </a>
                  </div>
                ) : (
                  orders.map((order) => (
                    <OrderCard key={order.id} order={order} formatCurrency={formatCurrency} />
                  ))
                )}
              </div>
            )}

            {/* Tracking Tab */}
            {activeTab === 'tracking' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Vehicle Tracking</h2>
                
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-soft p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={order.vehicle.images[0]}
                        alt={`${order.vehicle.brand} ${order.vehicle.model}`}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.vehicle.year} {order.vehicle.brand} {order.vehicle.model}
                        </p>
                        <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="relative">
                      <div className="absolute top-5 left-5 h-full w-0.5 bg-gray-200" />
                      <div className="space-y-8">
                        {order.stages.map((stage, index) => {
                          const Icon = getStageIcon(stage.stage)
                          return (
                            <div key={stage.stage} className="relative flex items-start gap-4">
                              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                stage.completed
                                  ? 'bg-primary-600 text-white'
                                  : stage.active
                                  ? 'bg-primary-100 text-primary-600 ring-4 ring-primary-50'
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {stage.completed ? (
                                  <Check className="w-5 h-5" />
                                ) : (
                                  <Icon className="w-5 h-5" />
                                )}
                              </div>
                              <div className="flex-grow pt-1">
                                <p className={`font-medium ${
                                  stage.completed || stage.active ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                  {stage.label}
                                </p>
                                {stage.date && (
                                  <p className="text-sm text-gray-500">
                                    {new Date(stage.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                )}
                                {stage.active && (
                                  <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                                    Current Stage
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Estimated Delivery */}
                    <div className="mt-6 p-4 bg-primary-50 rounded-xl flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-primary-600">Estimated Delivery</p>
                        <p className="font-semibold text-primary-700">
                          {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
                
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-soft p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      {order.vehicle.brand} {order.vehicle.model} - {order.orderId}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              {doc.uploadDate && (
                                <p className="text-sm text-gray-500">
                                  {new Date(doc.uploadDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <Download className="w-5 h-5 text-gray-600" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium">
                      <Upload className="w-5 h-5" />
                      Upload Document
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                
                <div className="bg-white rounded-xl shadow-soft divide-y divide-gray-100">
                  {orders.flatMap(o => o.notifications).length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    orders.flatMap(o => o.notifications).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 flex items-start gap-4 ${!notification.read ? 'bg-primary-50/50' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          notification.type === 'status_update'
                            ? 'bg-blue-100 text-blue-600'
                            : notification.type === 'payment_reminder'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {notification.type === 'status_update' && <Car className="w-5 h-5" />}
                          {notification.type === 'payment_reminder' && <CreditCard className="w-5 h-5" />}
                          {notification.type === 'document_upload' && <FileText className="w-5 h-5" />}
                        </div>
                        <div className="flex-grow">
                          <p className={`${!notification.read ? 'font-medium' : ''} text-gray-900`}>
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(notification.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
                
                <div className="bg-white rounded-xl shadow-soft p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue={session.user?.name || ''}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue={session.user?.email || ''}
                        className="input-field"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+94 77 123 4567"
                        className="input-field"
                      />
                    </div>
                    <button className="btn-primary">Save Changes</button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-soft p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded border-gray-300" />
                      <span className="text-gray-700">Email notifications for status updates</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded border-gray-300" />
                      <span className="text-gray-700">SMS notifications for important updates</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 text-primary-600 rounded border-gray-300" />
                      <span className="text-gray-700">WhatsApp notifications</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Order Card Component
function OrderCard({ order, formatCurrency }: { order: Order; formatCurrency: (value: number) => string }) {
  const currentStageIndex = order.stages.findIndex(s => s.active)
  const progressPercentage = ((currentStageIndex + 1) / order.stages.length) * 100

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Vehicle Image */}
        <img
          src={order.vehicle.images[0]}
          alt={`${order.vehicle.brand} ${order.vehicle.model}`}
          className="w-full md:w-40 h-32 rounded-xl object-cover"
        />

        {/* Order Details */}
        <div className="flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {order.vehicle.year} {order.vehicle.brand} {order.vehicle.model}
              </h3>
              <p className="text-sm text-gray-500">Order ID: {order.orderId}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.paymentStatus === 'completed'
                ? 'bg-slate-200 text-slate-800'
                : order.paymentStatus === 'partial'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {order.paymentStatus === 'completed' ? 'Paid' : order.paymentStatus === 'partial' ? 'Partial Payment' : 'Pending'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-primary-600">
                {order.stages.find(s => s.active)?.label}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="font-semibold text-slate-700">{formatCurrency(order.paidAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Outstanding</p>
              <p className="font-semibold text-yellow-600">{formatCurrency(order.outstandingBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Est. Delivery</p>
              <p className="font-semibold text-gray-900">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
