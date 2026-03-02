'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Car, FileText, Bell, Settings, User, Package, CreditCard,
  Check, Ship, Anchor, ShieldCheck, Truck, ChevronRight, ChevronLeft, DollarSign, Plus, X,
  Clock, Clipboard, Target, FileCheck, Receipt, History, Loader2, Share2, Copy, CheckCircle2,
  TrendingUp, Calendar, ArrowUpRight, Sparkles, LogOut, Wallet, PieChart, Eye, Menu, Navigation, MapPin
} from 'lucide-react';
import { signOut } from 'next-auth/react';

type DashboardTab = 'dashboard' | 'tracking' | 'live' | 'payments' | 'budget' | 'documents' | 'notifications' | 'settings';

interface OrderData {
  id: string;
  total_price: number;
  advance_amount: number;
  balance_amount: number;
  referral_code: string;
  created_at: string;
  vehicle?: { title: string; brand: string; model: string; year: number };
  stages?: StageData[];
  expenses?: ExpenseData[];
  payments?: PaymentData[];
}

interface StageData {
  id: string;
  stage_id: string;
  status: 'pending' | 'completed';
  completed_date: string | null;
  estimated_date?: string | null;
  notes: string | null;
  stage_master?: { id: string; stage_name: string; stage_order: number; description: string };
}

interface ExpenseData {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  created_at: string;
}

interface PaymentData {
  id: string;
  payment_type: string;
  amount: number;
  currency: string;
  payment_date: string;
  notes: string | null;
}

const STAGE_ORDER = [
  { 
    name: 'Requirement Identification', 
    icon: Clipboard, 
    description: 'Identify customer requirements',
    instructions: [
      'Share your vehicle preferences with our team (brand, model, year, budget)',
      'Provide any specific features or requirements you need',
      'Our team will search for matching vehicles in Japan auctions',
      'You will receive vehicle options to choose from'
    ],
    customerAction: 'Please provide your vehicle requirements to our sales team via WhatsApp or email.',
    estimatedDuration: '1-3 days'
  },
  { 
    name: 'Estimate Price & Advance Payment', 
    icon: DollarSign, 
    description: 'Calculate price & collect advance',
    instructions: [
      'Review the detailed price breakdown provided by our team',
      'Price includes: vehicle cost, shipping, customs, and our service fee',
      'Pay the advance amount (typically 10-20% of total price)',
      'Advance payment secures your vehicle purchase'
    ],
    customerAction: 'Review the price estimate and make the advance payment to proceed.',
    estimatedDuration: '1-2 days'
  },
  { 
    name: 'Auction Bidding & Purchasing', 
    icon: Target, 
    description: 'Participate in auction',
    instructions: [
      'Our team will bid on your chosen vehicle at Japan auctions',
      'We monitor multiple auctions to get the best price',
      'You will be notified once the vehicle is successfully purchased',
      'Auction results are typically available within 24-48 hours'
    ],
    customerAction: 'No action required. Our team is actively bidding on your vehicle.',
    estimatedDuration: '1-7 days'
  },
  { 
    name: 'Open LC', 
    icon: FileCheck, 
    description: 'Open Letter of Credit',
    instructions: [
      'Letter of Credit (LC) is required for international vehicle purchase',
      'You may need to visit your bank to complete LC documentation',
      'Provide necessary documents: NIC, bank statements, etc.',
      'LC guarantees payment to the Japanese seller'
    ],
    customerAction: 'Complete the LC documentation at your bank. Contact us if you need assistance.',
    estimatedDuration: '3-7 days'
  },
  { 
    name: 'Balance Paid', 
    icon: CreditCard, 
    description: 'Complete balance payment',
    instructions: [
      'Pay the remaining balance amount before shipment',
      'Balance = Total Price - Advance Payment',
      'Payment can be made via bank transfer or LC',
      'Vehicle will be prepared for shipping after payment confirmation'
    ],
    customerAction: 'Complete the balance payment to proceed with shipping.',
    estimatedDuration: '1-3 days'
  },
  { 
    name: 'Arrange Shipment', 
    icon: Package, 
    description: 'Arrange shipping logistics',
    instructions: [
      'Vehicle is being prepared for container loading in Japan',
      'Shipping documents are being prepared (BL, Invoice, etc.)',
      'Container booking is being arranged with shipping line',
      'You will receive shipping schedule and vessel details'
    ],
    customerAction: 'No action required. We are arranging the shipment logistics.',
    estimatedDuration: '5-10 days'
  },
  { 
    name: 'Shipped', 
    icon: Ship, 
    description: 'Vehicle shipped from origin',
    instructions: [
      'Your vehicle is now on a ship heading to Sri Lanka',
      'Typical shipping duration: 14-21 days from Japan',
      'You can track the vessel using the provided tracking information',
      'We will notify you when the ship approaches Sri Lanka'
    ],
    customerAction: 'Track your shipment. Prepare documents for customs clearance.',
    estimatedDuration: '14-21 days'
  },
  { 
    name: 'Shipping & Arrived', 
    icon: Anchor, 
    description: 'Arrived at destination port',
    instructions: [
      'Your vehicle has arrived at Colombo/Hambantota port',
      'Container is being offloaded and moved to customs area',
      'Customs inspection may be conducted',
      'Prepare for customs clearance process'
    ],
    customerAction: 'Ensure all payments are cleared. Customs clearance will begin shortly.',
    estimatedDuration: '2-5 days'
  },
  { 
    name: 'Custom Clearance', 
    icon: ShieldCheck, 
    description: 'Customs clearance process',
    instructions: [
      'Customs duties and taxes are being calculated',
      'Required documents: Import permit, LC documents, Bill of Lading',
      'Vehicle inspection by customs officers may be required',
      'Payment of duties and taxes to Sri Lanka Customs'
    ],
    customerAction: 'Pay customs duties and taxes. Provide any additional documents if requested.',
    estimatedDuration: '3-7 days'
  },
  { 
    name: 'Vehicle Delivery', 
    icon: Truck, 
    description: 'Vehicle delivered to customer',
    instructions: [
      'Vehicle has cleared customs and is ready for delivery',
      'Final inspection and preparation of the vehicle',
      'RMV registration process (if included in service)',
      'Delivery to your specified location'
    ],
    customerAction: 'Arrange to receive your vehicle. Complete RMV registration if needed.',
    estimatedDuration: '1-3 days'
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [stagesMaster, setStagesMaster] = useState<{id: string; stage_name: string; stage_order: number; description: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ category: '', description: '', amount: '' });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewingStageIndex, setViewingStageIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
      fetchStagesMaster();
    }
  }, [status]);

  // Sync viewing stage with current stage when order changes
  useEffect(() => {
    if (selectedOrder && stagesMaster.length > 0) {
      // Calculate stages with master data
      let stages: StageData[] = [];
      if (!selectedOrder.stages || selectedOrder.stages.length === 0) {
        stages = stagesMaster.map(sm => ({
          id: sm.id,
          stage_id: sm.id,
          status: 'pending' as const,
          completed_date: null,
          estimated_date: null,
          notes: null,
          stage_master: sm
        }));
      } else {
        stages = selectedOrder.stages.map(stage => {
          if (stage.stage_master) return stage;
          const master = stagesMaster.find(sm => sm.id === stage.stage_id);
          return { ...stage, stage_master: master || undefined };
        }).sort((a, b) => (a.stage_master?.stage_order || 0) - (b.stage_master?.stage_order || 0));
      }
      
      const pendingIndex = stages.findIndex(s => s.status === 'pending');
      const currentIdx = pendingIndex === -1 ? stages.length : pendingIndex;
      setViewingStageIndex(Math.min(currentIdx, 9));
    }
  }, [selectedOrder?.id, stagesMaster]);

  const fetchStagesMaster = async () => {
    try {
      const res = await fetch('/api/stages');
      const data = await res.json();
      setStagesMaster(data.stages || []);
    } catch (error) {
      console.error('Error fetching stages master:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
      if (data.orders?.length > 0) {
        // Preserve selected order if it still exists, otherwise select first
        const currentOrderId = selectedOrder?.id;
        const updatedOrder = currentOrderId 
          ? data.orders.find((o: OrderData) => o.id === currentOrderId) 
          : null;
        setSelectedOrder(updatedOrder || data.orders[0]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          category: paymentForm.category,
          description: paymentForm.description,
          amount: parseFloat(paymentForm.amount),
          currency: 'LKR'
        })
      });
      if (res.ok) {
        setShowPaymentModal(false);
        setPaymentForm({ category: '', description: '', amount: '' });
        fetchOrders();
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const copyReferralCode = () => {
    if (selectedOrder?.referral_code) {
      navigator.clipboard.writeText(`${window.location.origin}/ref/${selectedOrder.referral_code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-100 rounded-full animate-pulse" />
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-sm text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    redirect('/auth/signin');
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(value);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const tabs = [
    { id: 'dashboard' as DashboardTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracking' as DashboardTab, label: 'Vehicle Tracking', icon: Car },
    { id: 'live' as DashboardTab, label: 'Live Tracking', icon: Navigation },
    { id: 'payments' as DashboardTab, label: 'Payments', icon: Wallet },
    { id: 'budget' as DashboardTab, label: 'Budget Summary', icon: PieChart },
    { id: 'documents' as DashboardTab, label: 'Documents', icon: FileText },
    { id: 'notifications' as DashboardTab, label: 'Notifications', icon: Bell },
    { id: 'settings' as DashboardTab, label: 'Settings', icon: Settings },
  ];

  // Helper function to merge stage_master data if missing
  const getOrderStagesWithMaster = (): StageData[] => {
    if (!selectedOrder?.stages || selectedOrder.stages.length === 0) {
      // If no stages exist, create virtual stages from stagesMaster
      return stagesMaster.map(sm => ({
        id: sm.id,
        stage_id: sm.id,
        status: 'pending' as const,
        completed_date: null,
        estimated_date: null,
        notes: null,
        stage_master: sm
      }));
    }
    
    // Merge stage_master data from stagesMaster if missing
    return selectedOrder.stages.map(stage => {
      if (stage.stage_master) return stage;
      const master = stagesMaster.find(sm => sm.id === stage.stage_id);
      return {
        ...stage,
        stage_master: master || undefined
      };
    }).sort((a, b) => (a.stage_master?.stage_order || 0) - (b.stage_master?.stage_order || 0));
  };

  const getOrderStages = () => {
    return getOrderStagesWithMaster();
  };

  const getCurrentStageIndex = () => {
    const stages = getOrderStages();
    const pendingIndex = stages.findIndex(s => s.status === 'pending');
    return pendingIndex === -1 ? stages.length : pendingIndex;
  };

  const totalPaid = selectedOrder?.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const isOrderCompleted = getCurrentStageIndex() >= 10;
  const progressPercentage = Math.min((totalPaid / (selectedOrder?.total_price || 1)) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="font-bold text-lg text-gray-900">{tabs.find(t => t.id === activeTab)?.label}</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Professional Sidebar - Desktop & Mobile */}
        <aside className={`
          w-72 min-h-screen bg-white border-r border-gray-100 fixed left-0 top-0 pt-20 shadow-sm z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:pt-20
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="p-6 pt-4 lg:pt-6">
            {/* User Profile Card */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-600/5 rounded-2xl" />
              <div className="relative flex items-center gap-4 p-4">
                {session.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || 'User'} className="w-14 h-14 rounded-2xl border-2 border-white shadow-md object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                    <User className="w-7 h-7 text-white" />
                  </div>
                )}
                <div className="overflow-hidden flex-1">
                  <p className="font-semibold text-gray-900 truncate text-lg">{session.user?.name}</p>
                  <p className="text-sm text-gray-500 truncate">{session.user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Menu</p>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 transition-transform duration-200 ${activeTab === tab.id ? '' : 'group-hover:scale-110'}`} />
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Stats in Sidebar */}
            {selectedOrder && (
              <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Stats</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-bold text-primary-600">{getCurrentStageIndex()}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-full h-2 transition-all duration-500" style={{ width: `${(getCurrentStageIndex() / 10) * 100}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* Sign Out Button */}
            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 pt-20 lg:pt-20 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          {/* Welcome Header */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {getGreeting()}, <span className="text-primary-600">{session.user?.name?.split(' ')[0]}</span>
                </h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm sm:text-base">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              {selectedOrder && (
                <div className="flex items-center gap-3">
                  <div className="px-3 sm:px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    {isOrderCompleted ? 'Order Complete' : 'In Progress'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards - Only show on Dashboard tab */}
          {activeTab === 'dashboard' && orders.length > 0 && selectedOrder && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
              <div className="group bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-100 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Active Orders</p>
                    <p className="text-2xl sm:text-4xl font-bold text-gray-900">{orders.length}</p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      Active imports
                    </p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-green-500/5 hover:border-green-100 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Paid</p>
                    <p className="text-2xl sm:text-4xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {progressPercentage.toFixed(0)}% of estimate
                    </p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="group bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-100 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Price Estimate</p>
                    <p className="text-2xl sm:text-4xl font-bold text-gray-900">{formatCurrency(selectedOrder.total_price)}</p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 text-orange-500" />
                      Total investment
                    </p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6 lg:space-y-8">
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-16 text-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
                    <Car className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Active Orders Yet</h3>
                  <p className="text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">Start your vehicle import journey by exploring our premium stock collection from Japan.</p>
                  <a href="/stocks" className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl sm:rounded-2xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25 font-semibold text-sm sm:text-base">
                    Browse Vehicle Stock
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              ) : (
                <>
                  {/* Order Selector */}
                  {orders.length > 1 && (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Select Order</label>
                      <select
                        value={selectedOrder?.id || ''}
                        onChange={(e) => setSelectedOrder(orders.find(o => o.id === e.target.value) || null)}
                        className="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors font-medium text-sm sm:text-base"
                      >
                        {orders.map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.vehicle?.title || `Order ${order.id.substring(0, 8).toUpperCase()}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedOrder && (
                    <>
                      {/* Payment and Budget Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        {/* Payments Card */}
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Payments</h3>
                              <p className="text-gray-500 text-xs sm:text-sm mt-1">Track your payment records</p>
                            </div>
                            <button onClick={() => setShowPaymentModal(true)} className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/20">
                              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              Add Payment
                            </button>
                          </div>
                          <div className="space-y-2 sm:space-y-3 max-h-60 sm:max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                            {!selectedOrder.expenses?.length ? (
                              <div className="text-center py-8 sm:py-12">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                  <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium text-sm sm:text-base">No payments recorded yet</p>
                                <p className="text-gray-400 text-xs sm:text-sm mt-1">Add your first payment above</p>
                              </div>
                            ) : (
                              selectedOrder.expenses?.map((expense, idx) => (
                                <div key={expense.id} className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl hover:from-gray-100 hover:to-gray-100 transition-all group">
                                  <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                                      <span className="text-xs sm:text-sm font-bold text-gray-400">{idx + 1}</span>
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{expense.category}</p>
                                      <p className="text-xs sm:text-sm text-gray-500 truncate">{expense.description}</p>
                                    </div>
                                  </div>
                                  <p className="font-bold text-gray-900 text-sm sm:text-lg whitespace-nowrap ml-2">{formatCurrency(expense.amount)}</p>
                                </div>
                              ))
                            )}
                          </div>
                          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 flex justify-between items-center">
                            <span className="font-medium text-gray-600 text-sm sm:text-base">Total Paid</span>
                            <span className="font-bold text-xl sm:text-2xl text-gray-900">{formatCurrency(totalPaid)}</span>
                          </div>
                        </div>

                        {/* Budget Summary or Referral Card */}
                        {isOrderCompleted ? (
                          <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-xl shadow-purple-500/20">
                            <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                            <div className="relative">
                              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                                  <Share2 className="w-5 h-5 sm:w-7 sm:h-7" />
                                </div>
                                <div>
                                  <h3 className="text-xl sm:text-2xl font-bold">Refer & Earn</h3>
                                  <p className="text-purple-200 text-sm sm:text-base">Share with friends</p>
                                </div>
                              </div>
                              <p className="text-purple-100 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">Share your referral link and earn rewards when your friends make their first vehicle purchase!</p>
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                                <input 
                                  type="text" 
                                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/ref/${selectedOrder.referral_code}`} 
                                  readOnly 
                                  className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-xs sm:text-sm text-white placeholder-purple-200 backdrop-blur-sm" 
                                />
                                <button 
                                  onClick={copyReferralCode} 
                                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-purple-700 rounded-lg sm:rounded-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg text-sm sm:text-base"
                                >
                                  {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                                  {copied ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
                            <div className="mb-4 sm:mb-6">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Budget Summary</h3>
                              <p className="text-gray-500 text-xs sm:text-sm mt-1">Financial overview of your order</p>
                            </div>
                            <div className="space-y-3 sm:space-y-6">
                              <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                  </div>
                                  <span className="text-gray-600 font-medium text-sm sm:text-base">Total Price</span>
                                </div>
                                <span className="font-bold text-base sm:text-xl">{formatCurrency(selectedOrder.total_price)}</span>
                              </div>
                              <div className="flex justify-between items-center p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                  </div>
                                  <span className="text-gray-600 font-medium text-sm sm:text-base">Total Paid</span>
                                </div>
                                <span className="font-bold text-base sm:text-xl text-green-600">{formatCurrency(totalPaid)}</span>
                              </div>
                              <div className="pt-3 sm:pt-4 border-t-2 border-dashed border-gray-200">
                                <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg sm:rounded-xl border border-red-100">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                    </div>
                                    <span className="text-gray-900 font-semibold text-sm sm:text-base">Balance Due</span>
                                  </div>
                                  <span className="font-bold text-lg sm:text-2xl text-red-600">{formatCurrency(selectedOrder.total_price - totalPaid)}</span>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="mt-3 sm:mt-4">
                                <div className="flex justify-between text-xs sm:text-sm mb-2">
                                  <span className="text-gray-500">Payment Progress</span>
                                  <span className="font-semibold text-gray-700">{progressPercentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                                  <div 
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full h-2 sm:h-3 transition-all duration-500" 
                                    style={{ width: `${progressPercentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Live Vehicle Tracking Preview */}
                      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 sm:p-5 border-b border-gray-100">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Live Vehicle Tracking</h3>
                              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Track your vehicle's journey</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                Live
                              </span>
                              <button 
                                onClick={() => setActiveTab('tracking')}
                                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                              >
                                View Details
                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 sm:p-5">
                          {/* Compact Map Preview */}
                          <div className="relative w-full h-32 sm:h-44 bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-100/30 rounded-xl flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute top-4 left-4 w-16 h-16 bg-blue-200 rounded-full blur-2xl" />
                              <div className="absolute bottom-4 right-4 w-20 h-20 bg-indigo-200 rounded-full blur-2xl" />
                            </div>
                            
                            {/* Route Line */}
                            <div className="absolute inset-x-8 sm:inset-x-12 top-1/2 h-0.5 bg-gradient-to-r from-green-400 via-blue-400 to-primary-400 rounded-full opacity-60" />
                            
                            {/* Ship Icon */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Ship className="w-5 h-5 sm:w-7 sm:h-7 text-blue-500" />
                              </div>
                            </div>

                            {/* Origin & Destination */}
                            <div className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            </div>
                            <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary-500 rounded-full flex items-center justify-center shadow">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
                            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg text-center">
                              <p className="text-[10px] sm:text-xs text-gray-500">Status</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">In Transit</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg text-center">
                              <p className="text-[10px] sm:text-xs text-gray-500">Route</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">Japan → SL</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg text-center">
                              <p className="text-[10px] sm:text-xs text-gray-500">ETA</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">~14 Days</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-6 lg:space-y-8">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl sm:rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-16 text-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
                    <Car className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Active Orders</h3>
                  <p className="text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">You need an active order to track your vehicle.</p>
                  <a href="/stocks" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25 font-semibold text-sm sm:text-base">
                    Browse Vehicle Stock
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              ) : (
                <>
                  {/* Order Selector */}
                  {orders.length > 1 && (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Select Order</label>
                      <select
                        value={selectedOrder?.id || ''}
                        onChange={(e) => setSelectedOrder(orders.find(o => o.id === e.target.value) || null)}
                        className="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors font-medium text-sm sm:text-base"
                      >
                        {orders.map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.vehicle?.title || `Order ${order.id.substring(0, 8).toUpperCase()}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedOrder && (
                    <>
                      {/* Stage Tracker */}
                      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Simple Timeline Header */}
                        <div className="p-4 sm:p-5 border-b border-gray-100">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Order Progress</h3>
                            <span className="text-xs sm:text-sm text-gray-500">{getCurrentStageIndex()} of 10 completed</span>
                          </div>
                          
                          {/* Simple Progress Dots */}
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            {STAGE_ORDER.map((stage, idx) => {
                              const orderStage = getOrderStages()[idx];
                              const isCompleted = orderStage?.status === 'completed';
                              const isCurrent = idx === getCurrentStageIndex();
                              const isViewing = idx === viewingStageIndex;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setViewingStageIndex(idx)}
                                  className={`flex-1 h-1.5 sm:h-2 rounded-full transition-all ${
                                    isCompleted 
                                      ? 'bg-green-500' 
                                      : isCurrent 
                                        ? 'bg-blue-500' 
                                        : 'bg-gray-200'
                                  } ${isViewing ? 'ring-2 ring-offset-1 ring-gray-400' : 'hover:opacity-80'}`}
                                  title={stage.name}
                                />
                              );
                            })}
                          </div>
                        </div>

                        {/* Navigation */}
                        <div className="px-3 sm:px-5 py-3 sm:py-4 bg-gray-50 flex items-center justify-between">
                          <button
                            onClick={() => setViewingStageIndex(Math.max(0, viewingStageIndex - 1))}
                            disabled={viewingStageIndex === 0}
                            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                              viewingStageIndex === 0 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Previous</span>
                          </button>
                          
                          <div className="text-center flex-1 min-w-0 px-2">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium mb-1 ${
                              getOrderStages()[viewingStageIndex]?.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : viewingStageIndex === getCurrentStageIndex()
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-600'
                            }`}>
                              {getOrderStages()[viewingStageIndex]?.status === 'completed'
                                ? 'Done'
                                : viewingStageIndex === getCurrentStageIndex()
                                  ? 'Current'
                                  : 'Upcoming'}
                            </span>
                            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{STAGE_ORDER[viewingStageIndex]?.name}</p>
                            <p className="text-[10px] sm:text-xs text-gray-500">Stage {viewingStageIndex + 1}</p>
                          </div>
                          
                          <button
                            onClick={() => setViewingStageIndex(Math.min(9, viewingStageIndex + 1))}
                            disabled={viewingStageIndex === 9}
                            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                              viewingStageIndex === 9 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <span className="hidden xs:inline">Next</span>
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        {/* Single Stage Display */}
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                          {(() => {
                            const stage = STAGE_ORDER[viewingStageIndex];
                            const orderStage = getOrderStages()[viewingStageIndex];
                            const isCompleted = orderStage?.status === 'completed';
                            const isCurrent = viewingStageIndex === getCurrentStageIndex();
                            const isPending = !isCompleted && !isCurrent;
                            const Icon = stage?.icon || Package;
                            
                            return (
                              <>
                                {/* Stage Card */}
                                <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden ${
                                  isCompleted 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                                    : isCurrent 
                                      ? 'bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white' 
                                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700'
                                }`}>
                                  <div className="absolute top-0 right-0 w-24 sm:w-40 h-24 sm:h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                  <div className="relative flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-5">
                                    <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                      isCompleted || isCurrent ? 'bg-white/20 backdrop-blur-sm' : 'bg-white'
                                    }`}>
                                      {isCompleted ? (
                                        <Check className="w-7 h-7 sm:w-10 sm:h-10" strokeWidth={3} />
                                      ) : (
                                        <Icon className={`w-7 h-7 sm:w-10 sm:h-10 ${isPending ? 'text-gray-400' : ''}`} />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                        <h4 className="text-lg sm:text-2xl font-bold">Stage {viewingStageIndex + 1}: {stage?.name}</h4>
                                        <span className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-full flex items-center gap-1 sm:gap-1.5 ${
                                          isCompleted 
                                            ? 'bg-white/20 backdrop-blur-sm text-white' 
                                            : isCurrent 
                                              ? 'bg-white/20 backdrop-blur-sm text-white' 
                                              : 'bg-gray-300 text-gray-600'
                                        }`}>
                                          {isCompleted ? (
                                            <>
                                              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                              Completed
                                            </>
                                          ) : isCurrent ? (
                                            <>
                                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
                                              In Progress
                                            </>
                                          ) : (
                                            <>
                                              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                              Pending
                                            </>
                                          )}
                                        </span>
                                      </div>
                                      <p className={`text-sm sm:text-lg ${isCompleted || isCurrent ? 'text-white/90' : 'text-gray-600'}`}>
                                        {stage?.description}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-4">
                                        <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${
                                          isCompleted || isCurrent ? 'bg-white/10' : 'bg-white'
                                        }`}>
                                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                          <span>{stage?.estimatedDuration}</span>
                                        </div>
                                        {isCompleted && orderStage?.completed_date && (
                                          <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10`}>
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>{formatDate(orderStage.completed_date)}</span>
                                          </div>
                                        )}
                                        {isCurrent && orderStage?.estimated_date && (
                                          <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/10`}>
                                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>Est: {formatDate(orderStage.estimated_date)}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Required Card - Only for current stage */}
                                {isCurrent && (
                                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/25">
                                        <Bell className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <h5 className="font-bold text-amber-900 text-base sm:text-lg mb-1">Action Required</h5>
                                        <p className="text-amber-800 font-medium text-sm sm:text-lg">{stage?.customerAction}</p>
                                      </div>
                                    </div>
                                    
                                  </div>
                                )}

                                {/* Stage Information for completed/pending stages */}
                                {!isCurrent && (
                                  <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border ${
                                    isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                  }`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${
                                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                                      }`}>
                                        {isCompleted ? <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7" /> : <Clock className="w-5 h-5 sm:w-7 sm:h-7" />}
                                      </div>
                                      <div className="flex-1">
                                        <h5 className={`font-bold text-base sm:text-lg mb-1 ${isCompleted ? 'text-green-900' : 'text-gray-700'}`}>
                                          {isCompleted ? 'Stage Completed' : 'Upcoming Stage'}
                                        </h5>
                                        <p className={`font-medium text-sm sm:text-base ${isCompleted ? 'text-green-800' : 'text-gray-600'}`}>
                                          {isCompleted 
                                            ? 'This stage has been successfully completed.' 
                                            : stage?.customerAction}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* What's Happening Section */}
                                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                                  <h5 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
                                    <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                                    What Happens in This Stage
                                  </h5>
                                  <div className="grid gap-2 sm:gap-3">
                                    {stage?.instructions.map((instruction, idx) => (
                                      <div key={idx} className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                                        <div className="w-5 h-5 sm:w-7 sm:h-7 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                          <span className="text-xs sm:text-sm font-bold text-primary-700">{idx + 1}</span>
                                        </div>
                                        <p className="text-gray-700 flex-1 text-sm sm:text-base">{instruction}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Admin Notes (if any) */}
                                {orderStage?.notes && (
                                  <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-200">
                                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                      </div>
                                      <div>
                                        <h5 className="font-bold text-blue-900 mb-1 text-sm sm:text-base">Note from Team</h5>
                                        <p className="text-blue-800 text-sm sm:text-base">{orderStage.notes}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Quick Jump to Current Stage */}
                                {!isCurrent && (
                                  <button
                                    onClick={() => setViewingStageIndex(getCurrentStageIndex())}
                                    className="w-full flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium rounded-lg sm:rounded-xl transition-colors border border-primary-200 text-sm sm:text-base"
                                  >
                                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Jump to Current Stage (Stage {getCurrentStageIndex() + 1})
                                  </button>
                                )}

                                {/* Contact Support - Only show for current stage */}
                                {isCurrent && (
                                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center">
                                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900 text-sm sm:text-base">Need help with this stage?</p>
                                          <p className="text-xs sm:text-sm text-gray-600">Our team is ready to assist you</p>
                                        </div>
                                      </div>
                                      <a 
                                        href="https://wa.me/94XXXXXXXXX" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg sm:rounded-xl transition-colors shadow-lg shadow-green-500/25 text-sm sm:text-base"
                                      >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                        </svg>
                                        WhatsApp Support
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>

                        {/* Completed Banner */}
                        {isOrderCompleted && (
                          <div className="px-6 pb-6">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                  <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <div>
                                  <h4 className="text-xl font-bold">Order Complete!</h4>
                                  <p className="text-green-100">Your vehicle has been successfully delivered. Thank you for choosing us!</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Footer Actions */}
                        <div className="px-6 pb-6 flex justify-end">
                          <button onClick={() => setShowPaymentHistory(true)} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
                            <History className="w-4 h-4" />
                            View Payment History
                          </button>
                        </div>
                      </div>

                      {/* Vehicle Live Tracking */}
                      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-gray-100">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Live Vehicle Tracking</h3>
                              <p className="text-xs sm:text-sm text-gray-500 mt-1">Track your vehicle's journey in real-time</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                Live
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle Info Card */}
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                              <Car className="w-7 h-7 sm:w-10 sm:h-10 text-gray-400" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                              <h4 className="font-bold text-sm sm:text-lg text-gray-900">{selectedOrder.vehicle?.title || 'Your Vehicle'}</h4>
                              <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">{selectedOrder.vehicle?.year} {selectedOrder.vehicle?.brand} {selectedOrder.vehicle?.model}</p>
                              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2 flex-wrap">
                                <span className="px-2 py-0.5 bg-white text-gray-600 text-[10px] sm:text-xs font-medium rounded-md shadow-sm">
                                  ID: {selectedOrder.id.substring(0, 8).toUpperCase()}
                                </span>
                                <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] sm:text-xs font-medium rounded-md">
                                  Stage {getCurrentStageIndex()}/10
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Map Placeholder */}
                          <div className="relative w-full h-56 sm:h-80 bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-100/30 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 opacity-30">
                              <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-blue-200 rounded-full blur-3xl" />
                              <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-24 sm:w-40 h-24 sm:h-40 bg-indigo-200 rounded-full blur-3xl" />
                              <div className="absolute top-1/2 left-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-cyan-200 rounded-full blur-2xl" />
                            </div>
                            
                            {/* Animated Route Line */}
                            <div className="absolute inset-x-8 sm:inset-x-16 top-1/2 h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 rounded-full opacity-40">
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
                            </div>
                            
                            {/* Ship Icon Moving */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <div className="relative">
                                <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping" />
                                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/20 relative z-10">
                                  <Ship className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
                                </div>
                              </div>
                            </div>

                            {/* Origin & Destination Markers */}
                            <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <span className="mt-1 text-[10px] sm:text-xs font-semibold text-gray-700 bg-white/80 px-1.5 py-0.5 rounded">Japan</span>
                            </div>
                            <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col items-center">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <span className="mt-1 text-[10px] sm:text-xs font-semibold text-gray-700 bg-white/80 px-1.5 py-0.5 rounded">Sri Lanka</span>
                            </div>

                            {/* Coming Soon Overlay */}
                            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
                              <p className="text-blue-700 font-semibold text-xs sm:text-sm">GPS Updates Coming Soon</p>
                            </div>
                          </div>

                          {/* Tracking Info Cards */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6">
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl text-center">
                              <Ship className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mx-auto mb-1.5" />
                              <p className="text-[10px] sm:text-xs text-gray-500">Status</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">In Transit</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl text-center">
                              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mx-auto mb-1.5" />
                              <p className="text-[10px] sm:text-xs text-gray-500">Origin</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">Japan</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl text-center">
                              <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 mx-auto mb-1.5" />
                              <p className="text-[10px] sm:text-xs text-gray-500">Destination</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">Colombo</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl text-center">
                              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 mx-auto mb-1.5" />
                              <p className="text-[10px] sm:text-xs text-gray-500">ETA</p>
                              <p className="text-xs sm:text-sm font-semibold text-gray-900">~14 Days</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Live Tracking Tab */}
          {activeTab === 'live' && (
            <div className="space-y-6 lg:space-y-8">
              {orders.length === 0 ? (
                <div className="bg-white rounded-xl sm:rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-16 text-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
                    <Navigation className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Active Orders</h3>
                  <p className="text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">You need an active order to track your vehicle live.</p>
                  <a href="/stocks" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25 font-semibold text-sm sm:text-base">
                    Browse Vehicle Stock
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                </div>
              ) : (
                <>
                  {/* Order Selector */}
                  {orders.length > 1 && (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Select Order</label>
                      <select
                        value={selectedOrder?.id || ''}
                        onChange={(e) => setSelectedOrder(orders.find(o => o.id === e.target.value) || null)}
                        className="w-full px-4 sm:px-5 py-3 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors font-medium text-sm sm:text-base"
                      >
                        {orders.map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.vehicle?.title || `Order ${order.id.substring(0, 8).toUpperCase()}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedOrder && (
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="p-4 sm:p-6 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Live Vehicle Tracking</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">Real-time GPS tracking of your vehicle</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs sm:text-sm font-medium rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              Live
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Info */}
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
                            <Car className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <h4 className="font-bold text-base sm:text-lg text-gray-900">{selectedOrder.vehicle?.title || 'Your Vehicle'}</h4>
                            <p className="text-gray-500 mt-0.5 text-sm">{selectedOrder.vehicle?.year} {selectedOrder.vehicle?.brand} {selectedOrder.vehicle?.model}</p>
                            <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2 flex-wrap">
                              <span className="px-2 py-0.5 bg-white text-gray-600 text-xs font-medium rounded-md shadow-sm">
                                ID: {selectedOrder.id.substring(0, 8).toUpperCase()}
                              </span>
                              <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-md">
                                Stage {getCurrentStageIndex()}/10
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Large Map */}
                        <div className="relative w-full h-64 sm:h-96 bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden">
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-8 left-8 w-32 h-32 bg-blue-200 rounded-full blur-3xl" />
                            <div className="absolute bottom-8 right-8 w-40 h-40 bg-indigo-200 rounded-full blur-3xl" />
                            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-cyan-200 rounded-full blur-2xl" />
                            <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-teal-200 rounded-full blur-2xl" />
                          </div>
                          
                          {/* Animated Route Line */}
                          <div className="absolute inset-x-12 sm:inset-x-20 top-1/2 h-1 bg-gradient-to-r from-green-400 via-blue-500 to-primary-500 rounded-full opacity-50">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
                          </div>
                          
                          {/* Ship Icon Moving */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                              <div className="absolute -inset-6 bg-blue-500/20 rounded-full animate-ping" />
                              <div className="absolute -inset-3 bg-blue-500/30 rounded-full animate-pulse" />
                              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 relative z-10">
                                <Ship className="w-10 h-10 sm:w-14 sm:h-14 text-blue-500" />
                              </div>
                            </div>
                          </div>

                          {/* Origin Marker */}
                          <div className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <span className="mt-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white/90 px-2 py-1 rounded-lg shadow">Japan</span>
                          </div>
                          
                          {/* Destination Marker */}
                          <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">
                              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <span className="mt-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white/90 px-2 py-1 rounded-lg shadow">Sri Lanka</span>
                          </div>

                          {/* GPS Coming Soon Badge */}
                          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                                <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-blue-700 font-bold text-sm sm:text-base">GPS Tracking Coming Soon</p>
                                <p className="text-blue-500 text-xs sm:text-sm">Real-time updates will be available shortly</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tracking Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                          <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl sm:rounded-2xl text-center">
                            <Ship className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-500">Status</p>
                            <p className="text-sm sm:text-base font-bold text-gray-900">In Transit</p>
                          </div>
                          <div className="p-4 sm:p-5 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl sm:rounded-2xl text-center">
                            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-500">Origin</p>
                            <p className="text-sm sm:text-base font-bold text-gray-900">Yokohama, Japan</p>
                          </div>
                          <div className="p-4 sm:p-5 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl sm:rounded-2xl text-center">
                            <Navigation className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-500">Destination</p>
                            <p className="text-sm sm:text-base font-bold text-gray-900">Colombo, SL</p>
                          </div>
                          <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl sm:rounded-2xl text-center">
                            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 mx-auto mb-2" />
                            <p className="text-xs sm:text-sm text-gray-500">ETA</p>
                            <p className="text-sm sm:text-base font-bold text-gray-900">~14 Days</p>
                          </div>
                        </div>

                        {/* Journey Timeline */}
                        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gray-50 rounded-xl sm:rounded-2xl">
                          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-600" />
                            Journey Timeline
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-green-500 rounded-full" />
                              <div className="flex-1 h-0.5 bg-green-500" />
                              <span className="text-xs sm:text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Departed</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                              <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-500 to-gray-200" />
                              <span className="text-xs sm:text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">At Sea</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-gray-300 rounded-full" />
                              <div className="flex-1 h-0.5 bg-gray-200" />
                              <span className="text-xs sm:text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Arrival</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-4 sm:space-y-6">
              {!selectedOrder ? (
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-16 text-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
                    <Wallet className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Active Orders</h3>
                  <p className="text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">You need an active order to view payment details.</p>
                </div>
              ) : (
                <>
                  {/* Payment Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-3xl p-4 sm:p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-xs sm:text-sm font-medium">Total Paid</p>
                          <p className="text-2xl sm:text-3xl font-bold mt-1">{formatCurrency(totalPaid)}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                          <Check className="w-5 h-5 sm:w-7 sm:h-7" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-3xl p-4 sm:p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-xs sm:text-sm font-medium">Balance Due</p>
                          <p className="text-2xl sm:text-3xl font-bold mt-1">{formatCurrency(selectedOrder.total_price - totalPaid)}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                          <Clock className="w-5 h-5 sm:w-7 sm:h-7" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl sm:rounded-3xl p-4 sm:p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-primary-100 text-xs sm:text-sm font-medium">Total Transactions</p>
                          <p className="text-2xl sm:text-3xl font-bold mt-1">{selectedOrder.expenses?.length || 0}</p>
                        </div>
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                          <Receipt className="w-5 h-5 sm:w-7 sm:h-7" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Payment & Payment List */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                      <div>
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Payment Records</h2>
                        <p className="text-gray-500 mt-1 text-xs sm:text-base">Track all your payment transactions</p>
                      </div>
                      <button onClick={() => setShowPaymentModal(true)} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg sm:rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/20 text-sm sm:text-base">
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        Add Payment
                      </button>
                    </div>
                    <div className="p-4 sm:p-6">
                      {!selectedOrder.expenses?.length ? (
                        <div className="text-center py-10 sm:py-16">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
                            <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Payments Yet</h3>
                          <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">Start by adding your first payment record above.</p>
                        </div>
                      ) : (
                        <div className="space-y-3 sm:space-y-4">
                          {selectedOrder.expenses?.map((expense, idx) => (
                            <div key={expense.id} className="flex items-center justify-between p-3 sm:p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl hover:from-gray-100 hover:to-gray-100 transition-all group">
                              <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                  <span className="text-sm sm:text-lg font-bold text-gray-400">{idx + 1}</span>
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                    <p className="font-bold text-gray-900 text-sm sm:text-base">{expense.category}</p>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] sm:text-xs font-medium rounded-full">Paid</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{expense.description}</p>
                                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{formatDate(expense.created_at)}</p>
                                </div>
                              </div>
                              <p className="font-bold text-lg sm:text-2xl text-gray-900 ml-2 whitespace-nowrap">{formatCurrency(expense.amount)}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedOrder.expenses?.length ? (
                      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-semibold text-gray-600 text-sm sm:text-base">Total Amount Paid</span>
                        <span className="font-bold text-xl sm:text-3xl text-green-600">{formatCurrency(totalPaid)}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Payment History from System */}
                  {selectedOrder.payments?.length ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="p-4 sm:p-6 border-b border-gray-100">
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">System Payment History</h2>
                        <p className="text-gray-500 mt-1 text-xs sm:text-base">Official payment records from our system</p>
                      </div>
                      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                        {selectedOrder.payments.map((payment, idx) => (
                          <div key={payment.id} className="flex items-center justify-between p-3 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-xl sm:rounded-2xl border border-green-100">
                            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 text-sm sm:text-base">{payment.payment_type}</p>
                                {payment.notes && <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{payment.notes}</p>}
                                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">{formatDate(payment.payment_date)}</p>
                              </div>
                            </div>
                            <p className="font-bold text-lg sm:text-2xl text-green-600 ml-2 whitespace-nowrap">{formatCurrency(payment.amount)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          )}

          {/* Budget Summary Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-4 sm:space-y-6">
              {!selectedOrder ? (
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-16 text-center">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-inner">
                    <PieChart className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">No Active Orders</h3>
                  <p className="text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">You need an active order to view budget summary.</p>
                </div>
              ) : (
                <>
                  {/* Budget Overview Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-white rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <DollarSign className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-sm text-gray-500">Estimated Price</p>
                          <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(selectedOrder.total_price)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
                          <Check className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-sm text-gray-500">Amount Paid</p>
                          <p className="text-lg sm:text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                          <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-sm text-gray-500">Balance Due</p>
                          <p className="text-lg sm:text-2xl font-bold text-red-600">{formatCurrency(selectedOrder.total_price - totalPaid)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-sm border border-gray-100">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                          <TrendingUp className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-sm text-gray-500">Progress</p>
                          <p className="text-lg sm:text-2xl font-bold text-purple-600">{progressPercentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-8">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Payment Progress</h2>
                    <p className="text-gray-500 mb-4 sm:mb-8 text-sm sm:text-base">Visual breakdown of your payment status</p>
                    
                    <div className="mb-6 sm:mb-8">
                      <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-3">
                        <span className="font-medium text-gray-600">Overall Progress</span>
                        <span className="font-bold text-gray-900">{progressPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-4 sm:h-6 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full h-4 sm:h-6 transition-all duration-700 flex items-center justify-end pr-2 sm:pr-3"
                          style={{ width: `${Math.max(progressPercentage, 5)}%` }}
                        >
                          {progressPercentage > 20 && (
                            <span className="text-[10px] sm:text-xs font-bold text-white">{formatCurrency(totalPaid)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Amount Breakdown Visual */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-100">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <span className="font-semibold text-green-800 text-sm sm:text-base">Paid Amount</span>
                        </div>
                        <p className="text-2xl sm:text-4xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                        <p className="text-xs sm:text-sm text-green-600 mt-1 sm:mt-2">{progressPercentage.toFixed(1)}% of total</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-100">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <span className="font-semibold text-red-800 text-sm sm:text-base">Remaining Balance</span>
                        </div>
                        <p className="text-2xl sm:text-4xl font-bold text-red-600">{formatCurrency(selectedOrder.total_price - totalPaid)}</p>
                        <p className="text-xs sm:text-sm text-red-600 mt-1 sm:mt-2">{(100 - progressPercentage).toFixed(1)}% remaining</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Breakdown by Category */}
                  {selectedOrder.expenses?.length ? (
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-8">
                      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Payment Breakdown</h2>
                      <p className="text-gray-500 mb-4 sm:mb-8 text-sm sm:text-base">Categorized view of all payments</p>
                      
                      <div className="space-y-3 sm:space-y-4">
                        {Object.entries(
                          selectedOrder.expenses.reduce((acc, expense) => {
                            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([category, amount], idx) => {
                          const percentage = (amount / totalPaid) * 100;
                          const colors = [
                            'from-blue-500 to-blue-600',
                            'from-green-500 to-emerald-600',
                            'from-purple-500 to-indigo-600',
                            'from-orange-500 to-amber-600',
                            'from-pink-500 to-rose-600',
                            'from-cyan-500 to-teal-600',
                          ];
                          return (
                            <div key={category} className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r ${colors[idx % colors.length]}`} />
                                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{category}</span>
                                </div>
                                <span className="font-bold text-gray-900 text-sm sm:text-base">{formatCurrency(amount)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                                <div 
                                  className={`bg-gradient-to-r ${colors[idx % colors.length]} rounded-full h-1.5 sm:h-2 transition-all duration-500`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total paid</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* Referral Card (if completed) */}
                  {isOrderCompleted && (
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-purple-500/20">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                      <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <Share2 className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">Refer & Earn</h3>
                            <p className="text-purple-200">Share with friends</p>
                          </div>
                        </div>
                        <p className="text-purple-100 mb-6 leading-relaxed">Share your referral link and earn rewards when your friends make their first vehicle purchase!</p>
                        <div className="flex items-center gap-3">
                          <input 
                            type="text" 
                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/ref/${selectedOrder.referral_code}`} 
                            readOnly 
                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-purple-200 backdrop-blur-sm" 
                          />
                          <button 
                            onClick={copyReferralCode} 
                            className="px-6 py-3 bg-white text-purple-700 rounded-xl hover:bg-purple-50 transition-all flex items-center gap-2 font-semibold shadow-lg"
                          >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-8 border-b border-gray-100">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Documents</h2>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Access all your import documentation</p>
              </div>
              <div className="p-4 sm:p-8">
                <div className="text-center py-10 sm:py-16">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
                    <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Documents Yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">Your import documents will appear here once they are processed and ready for download.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-8 border-b border-gray-100">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Notifications</h2>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Stay updated with your order progress</p>
              </div>
              <div className="p-4 sm:p-8">
                <div className="text-center py-10 sm:py-16">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-inner">
                    <Bell className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                  <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base">You don't have any notifications at the moment. We'll notify you when there are updates to your order.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-8 border-b border-gray-100">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Settings</h2>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your preferences and notifications</p>
              </div>
              <div className="p-4 sm:p-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl hover:from-gray-100 hover:to-gray-100 transition-all">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">Email Notifications</p>
                        <p className="text-xs sm:text-sm text-gray-500">Receive updates about your orders via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 sm:w-14 sm:h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl hover:from-gray-100 hover:to-gray-100 transition-all">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">SMS Notifications</p>
                        <p className="text-xs sm:text-sm text-gray-500">Get SMS alerts for important updates</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 sm:w-14 sm:h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl hover:from-gray-100 hover:to-gray-100 transition-all">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base">WhatsApp Updates</p>
                        <p className="text-xs sm:text-sm text-gray-500">Receive order updates via WhatsApp</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 sm:w-14 sm:h-7 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {[
            { id: 'dashboard' as DashboardTab, icon: LayoutDashboard, label: 'Home' },
            { id: 'tracking' as DashboardTab, icon: Car, label: 'Active' },
            { id: 'live' as DashboardTab, icon: Navigation, label: 'Live' },
            { id: 'budget' as DashboardTab, icon: PieChart, label: 'Paid' },
            { id: 'payments' as DashboardTab, icon: Wallet, label: 'Payments' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-2 sm:px-4 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[9px] sm:text-[10px] font-medium mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Professional Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md p-5 sm:p-8 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 sm:mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Add Payment</h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Record a new payment transaction</p>
              </div>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Payment Category</label>
                <select
                  value={paymentForm.category}
                  onChange={(e) => setPaymentForm({ ...paymentForm, category: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors font-medium text-sm sm:text-base"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Advance">Advance Payment</option>
                  <option value="LC">Letter of Credit (LC)</option>
                  <option value="LC Commission">LC Commission</option>
                  <option value="Clearing + Logistic">Clearing + Logistics</option>
                  <option value="TAX">Tax Payment</option>
                  <option value="Damage">Damage Assessment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Description</label>
                <input
                  type="text"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-sm sm:text-base"
                  placeholder="Enter payment description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Amount (LKR)</label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm sm:text-base">Rs.</span>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors text-sm sm:text-base"
                    placeholder="0.00"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg sm:rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-primary-500/20 text-sm sm:text-base">
                  {submitting ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Professional Payment History Modal */}
      {showPaymentHistory && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg p-5 sm:p-8 max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Payment History</h3>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Complete record of all payments</p>
              </div>
              <button onClick={() => setShowPaymentHistory(false)} className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-2">
              {!selectedOrder.payments?.length ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-inner">
                    <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">No Payments Yet</h4>
                  <p className="text-gray-500 text-xs sm:text-sm">Payment records will appear here once processed</p>
                </div>
              ) : (
                selectedOrder.payments?.map((payment, idx) => (
                  <div key={payment.id} className="p-3 sm:p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl sm:rounded-2xl hover:from-gray-100 hover:to-gray-100 transition-all">
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <span className="text-xs sm:text-sm font-bold text-gray-400">{idx + 1}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm sm:text-base">{payment.payment_type}</p>
                          {payment.notes && <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{payment.notes}</p>}
                          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-2 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(payment.payment_date)}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-base sm:text-lg text-green-600 whitespace-nowrap">{formatCurrency(payment.amount)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-gray-600 text-sm sm:text-base">Total Amount Paid</span>
              <span className="font-bold text-xl sm:text-2xl text-green-600">{formatCurrency(selectedOrder.payments?.reduce((sum, p) => sum + p.amount, 0) || 0)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
