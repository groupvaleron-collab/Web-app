'use client'

import { useSession } from 'next-auth/react'
import { redirect, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  ArrowLeft,
  Car,
  Package,
  Clock,
  TrendingUp,
  Receipt,
  Check,
  Calendar,
  User,
  Loader2,
  CreditCard,
  FileText,
  DollarSign,
  Ship,
  Anchor,
  ShieldCheck,
  Truck,
  Target,
  Clipboard
} from 'lucide-react'
import Link from 'next/link'

const ADMIN_EMAIL = 'groupvaleron@gmail.com'

interface UserData {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  created_at: string
  orders?: any[]
}

interface StageMaster {
  id: string
  stage_name: string
  stage_order: number
  description: string
}

export default function UserDashboardView() {
  const { data: session, status } = useSession()
  const params = useParams()
  const userId = params.id as string
  
  const [user, setUser] = useState<UserData | null>(null)
  const [stages, setStages] = useState<StageMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      const userEmail = session?.user?.email
      if (userEmail !== ADMIN_EMAIL) {
        redirect('/dashboard')
      }
      fetchUserData()
    }
  }, [status, session, userId])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [userRes, stagesRes] = await Promise.all([
        fetch(`/api/users/${userId}`),
        fetch('/api/stages')
      ])

      const userData = await userRes.json()
      const stagesData = await stagesRes.json()

      setUser(userData.user)
      setStages(stagesData.stages || [])
      
      if (userData.user?.orders?.length > 0) {
        setSelectedOrder(userData.user.orders[0])
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStageIcon = (stageName: string) => {
    const stageIcons: Record<string, any> = {
      'Requirement Identification': Clipboard,
      'Estimate Price & Advance Payment': CreditCard,
      'Auction Bidding & Purchasing': Target,
      'Open LC': FileText,
      'Balance Paid': DollarSign,
      'Arrange Shipment': Package,
      'Shipped': Ship,
      'Shipping & Arrived': Anchor,
      'Custom Clearance': ShieldCheck,
      'Vehicle Delivery': Truck,
    }
    return stageIcons[stageName] || Package
  }

  const getCompletedStages = (orderStages: any[]) => {
    return orderStages?.filter(s => s.status === 'completed').length || 0
  }

  const getCurrentStage = (orderStages: any[]) => {
    const sorted = [...(orderStages || [])].sort((a, b) => 
      (a.stage_master?.stage_order || 0) - (b.stage_master?.stage_order || 0)
    )
    return sorted.find(s => s.status === 'pending')?.stage_master?.stage_name || 'Completed'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!session || session.user?.email !== ADMIN_EMAIL) {
    redirect('/auth/signin')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">User not found</p>
          <Link href="/admin" className="text-primary-600 hover:text-primary-700">
            Back to Admin
          </Link>
        </div>
      </div>
    )
  }

  const orders = user.orders || []
  const totalSpent = orders.reduce((sum, o) => sum + (o.advance_amount || 0), 0)
  const totalPending = orders.reduce((sum, o) => sum + (o.balance_amount || 0), 0)
  const totalExpenses = orders.reduce((sum, o) => 
    sum + (o.expenses?.reduce((s: number, e: any) => s + e.amount, 0) || 0), 0
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.name}'s Dashboard</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            Admin View
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Balance</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Orders</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <div className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No orders for this user</p>
                  </div>
                ) : (
                  orders.map((order: any) => (
                    <div
                      key={order.id}
                      className={`p-6 cursor-pointer transition-colors ${
                        selectedOrder?.id === order.id ? 'bg-slate-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Car className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {order.vehicle?.title || 'Vehicle Order'}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Order ID: {order.id.substring(0, 8).toUpperCase()}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                {getCurrentStage(order.stages)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {getCompletedStages(order.stages)}/{stages.length} stages
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(order.total_price)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Selected Order Details */}
          <div className="space-y-6">
            {selectedOrder && (
              <>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Order Progress</h2>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                    <div className="space-y-4">
                      {selectedOrder.stages
                        ?.sort((a: any, b: any) => (a.stage_master?.stage_order || 0) - (b.stage_master?.stage_order || 0))
                        .slice(0, 5)
                        .map((stage: any) => {
                          const Icon = getStageIcon(stage.stage_master?.stage_name)
                          return (
                            <div key={stage.id} className="relative flex items-start gap-4 pl-2">
                              <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                                stage.status === 'completed' 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-400'
                              }`}>
                                {stage.status === 'completed' ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <span className="w-2 h-2 bg-current rounded-full" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  stage.status === 'completed' ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {stage.stage_master?.stage_name}
                                </p>
                                {stage.completed_date && (
                                  <p className="text-xs text-gray-400">
                                    {formatDate(stage.completed_date)}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Payment Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Amount</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.total_price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Paid Amount</span>
                      <span className="font-medium text-green-600">{formatCurrency(selectedOrder.advance_amount)}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                      <span className="font-medium text-gray-900">Balance Due</span>
                      <span className="font-bold text-orange-600">{formatCurrency(selectedOrder.balance_amount)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/admin?order=${selectedOrder.id}`}
                  className="block w-full py-3 bg-slate-900 text-white text-center rounded-xl hover:bg-slate-800 transition-colors font-medium"
                >
                  Manage This Order
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
