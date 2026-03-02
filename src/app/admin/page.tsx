'use client';

import { useSession } from 'next-auth/react';
import { redirect, notFound } from 'next/navigation';

const ADMIN_EMAIL = 'groupvaleron@gmail.com';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Car,
  Users,
  Star,
  Package,
  Settings,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  X,
  Upload,
  Save,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
  Check,
  Circle,
  Menu
} from 'lucide-react';
import { vehicles, reviews } from '@/data/mockData';

type AdminTab = 'dashboard' | 'vehicles' | 'orders' | 'reviews' | 'users' | 'settings';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  created_at: string;
  orders?: Order[];
}

interface Order {
  id: string;
  vehicle_id: string | null;
  vehicle_name: string | null;
  total_price: number;
  advance_amount: number;
  balance_amount: number;
  referral_code: string;
  status: string;
  created_at: string;
  vehicle?: any;
  stages?: OrderStage[];
  payments?: Payment[];
  expenses?: Expense[];
}

interface OrderStage {
  id: string;
  order_id: string;
  stage_id: string;
  status: string;
  notes: string | null;
  estimated_date: string | null;
  completed_date: string | null;
  stage_master: {
    id: string;
    name: string;
    stage_order: number;
    description: string;
  };
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  payment_type: string;
  payment_date: string;
  notes: string | null;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  created_at: string;
}

interface StageMaster {
  id: string;
  name: string;
  stage_order: number;
  description: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [stagesMaster, setStagesMaster] = useState<StageMaster[]>([]);
  
  // Modals
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showStageEdit, setShowStageEdit] = useState<OrderStage | null>(null);
  
  // Form states
  const [orderForm, setOrderForm] = useState({
    vehicle_name: '',
    total_price: '',
    advance_amount: ''
  });
  const [expenseForm, setExpenseForm] = useState({
    category: '',
    description: '',
    amount: ''
  });
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_type: 'advance',
    notes: ''
  });
  const [stageForm, setStageForm] = useState({
    estimated_date: '',
    notes: ''
  });

  // Fetch users when on users tab
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  // Fetch stages master
  useEffect(() => {
    fetchStages();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStages = async () => {
    try {
      const res = await fetch('/api/stages');
      const data = await res.json();
      if (data.stages) {
        setStagesMaster(data.stages);
      }
    } catch (error) {
      console.error('Error fetching stages:', error);
    }
  };

  const fetchOrders = async (userId?: string) => {
    try {
      const url = userId ? `/api/orders?userId=${userId}` : '/api/orders?all=true';
      const res = await fetch(url);
      const data = await res.json();
      return data.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedUser) return;
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser.id,
          vehicle_name: orderForm.vehicle_name,
          total_price: parseFloat(orderForm.total_price),
          advance_amount: parseFloat(orderForm.advance_amount) || 0
        })
      });
      
      if (res.ok) {
        setShowCreateOrder(false);
        setOrderForm({ vehicle_name: '', total_price: '', advance_amount: '' });
        // Refresh user data
        await fetchUsers();
        // Update selected user
        const updatedUsers = await fetch('/api/users').then(r => r.json());
        const updatedUser = updatedUsers.users?.find((u: User) => u.id === selectedUser.id);
        if (updatedUser) setSelectedUser(updatedUser);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleAddPayment = async () => {
    if (!selectedOrder) return;
    
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          amount: parseFloat(paymentForm.amount),
          payment_type: paymentForm.payment_type,
          notes: paymentForm.notes
        })
      });
      
      if (res.ok) {
        setShowAddPayment(false);
        setPaymentForm({ amount: '', payment_type: 'advance', notes: '' });
        // Refresh data
        await fetchUsers();
        if (selectedUser) {
          const updatedUsers = await fetch('/api/users').then(r => r.json());
          const updatedUser = updatedUsers.users?.find((u: User) => u.id === selectedUser.id);
          if (updatedUser) {
            setSelectedUser(updatedUser);
            const updatedOrder = updatedUser.orders?.find((o: Order) => o.id === selectedOrder.id);
            if (updatedOrder) setSelectedOrder(updatedOrder);
          }
        }
      }
    } catch (error) {
      console.error('Error adding payment:', error);
    }
  };

  const handleAddExpense = async () => {
    if (!selectedOrder) return;
    
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: selectedOrder.id,
          category: expenseForm.category,
          description: expenseForm.description,
          amount: parseFloat(expenseForm.amount)
        })
      });
      
      if (res.ok) {
        setShowAddExpense(false);
        setExpenseForm({ category: '', description: '', amount: '' });
        // Refresh data
        await fetchUsers();
        if (selectedUser) {
          const updatedUsers = await fetch('/api/users').then(r => r.json());
          const updatedUser = updatedUsers.users?.find((u: User) => u.id === selectedUser.id);
          if (updatedUser) {
            setSelectedUser(updatedUser);
            const updatedOrder = updatedUser.orders?.find((o: Order) => o.id === selectedOrder.id);
            if (updatedOrder) setSelectedOrder(updatedOrder);
          }
        }
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleStageUpdate = async (stageId: string, status: string) => {
    if (!selectedOrder) return;
    
    try {
      const body: any = { status };
      if (showStageEdit && stageForm.estimated_date) {
        body.estimated_date = stageForm.estimated_date;
      }
      if (showStageEdit && stageForm.notes) {
        body.notes = stageForm.notes;
      }
      
      const res = await fetch(`/api/orders/${selectedOrder.id}/stages/${stageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        setShowStageEdit(null);
        setStageForm({ estimated_date: '', notes: '' });
        // Refresh data
        await fetchUsers();
        if (selectedUser) {
          const updatedUsers = await fetch('/api/users').then(r => r.json());
          const updatedUser = updatedUsers.users?.find((u: User) => u.id === selectedUser.id);
          if (updatedUser) {
            setSelectedUser(updatedUser);
            const updatedOrder = updatedUser.orders?.find((o: Order) => o.id === selectedOrder.id);
            if (updatedOrder) setSelectedOrder(updatedOrder);
          }
        }
      }
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    redirect('/api/auth/signin');
  }

  // Only allow admin access
  if (session.user?.email !== ADMIN_EMAIL) {
    notFound();
  }

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles' as AdminTab, label: 'Vehicles', icon: Car },
    { id: 'orders' as AdminTab, label: 'Orders', icon: Package },
    { id: 'reviews' as AdminTab, label: 'Reviews', icon: Star },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Vehicles', value: vehicles.length, icon: Car, color: 'bg-blue-500', change: '+12%' },
    { label: 'Active Orders', value: users.reduce((acc, u) => acc + (u.orders?.length || 0), 0), icon: Package, color: 'bg-slate-900', change: '+5%' },
    { label: 'Total Reviews', value: reviews.length, icon: Star, color: 'bg-yellow-500', change: '+8%' },
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-purple-500', change: '+15%' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Manage your vehicle import business</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none w-48 lg:w-64"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={session.user?.image || '/default-avatar.png'}
                alt="Profile"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile search bar */}
        <div className="mt-3 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 lg:z-0 w-64 bg-white min-h-[calc(100vh-73px)] border-r border-gray-200 p-4 transition-transform duration-300 ease-in-out`}>
          <div className="flex items-center justify-between lg:hidden mb-4">
            <span className="font-semibold text-gray-900">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedUser(null);
                  setSelectedOrder(null);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 text-primary-600'
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
        <div className="flex-1 p-3 sm:p-4 lg:p-6 w-full min-w-0">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-soft p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-green-600">{stat.change}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {users.slice(0, 5).flatMap(user => 
                    user.orders?.slice(0, 2).map(order => (
                      <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{order.vehicle_name || 'Vehicle Order'}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{formatCurrency(order.total_price)}</p>
                          <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && !selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{filteredUsers.length} users</span>
                </div>
              </div>

              {loadingUsers ? (
                <div className="bg-white rounded-xl shadow-soft p-12 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden hidden md:block">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-primary-600 font-medium">
                                      {user.name?.charAt(0) || user.email?.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{user.name || 'No Name'}</p>
                                    <p className="text-sm text-gray-500">{user.role}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {user.orders?.length || 0} orders
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                  >
                                    <Eye className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                                    <Edit className="w-4 h-4 text-gray-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card List */}
                  <div className="space-y-3 md:hidden">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className="bg-white rounded-xl shadow-soft p-4 cursor-pointer active:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-primary-600 font-medium">
                              {user.name?.charAt(0) || user.email?.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{user.name || 'No Name'}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {user.orders?.length || 0}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Selected User Detail View */}
          {activeTab === 'users' && selectedUser && !selectedOrder && (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Users
              </button>

              {/* User Info Card */}
              <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-xl sm:text-2xl text-primary-600 font-bold">
                        {selectedUser.name?.charAt(0) || selectedUser.email?.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedUser.name || 'No Name'}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 sm:mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-4 h-4 shrink-0" />
                          <span className="truncate">{selectedUser.email}</span>
                        </span>
                        {selectedUser.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4 shrink-0" />
                            {selectedUser.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateOrder(true)}
                    className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Create Order
                  </button>
                </div>
              </div>

              {/* User Orders */}
              <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Orders ({selectedUser.orders?.length || 0})</h3>
                </div>
                
                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {selectedUser.orders.map((order) => {
                      const totalPaid = order.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
                      const balanceDue = order.total_price - totalPaid;
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{order.vehicle_name || 'Vehicle Order'}</p>
                              <p className="text-sm text-gray-500 truncate">Ref: {order.referral_code}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-gray-900 text-sm sm:text-base">{formatCurrency(order.total_price)}</p>
                              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                <span className="text-xs text-green-600">Paid: {formatCurrency(totalPaid)}</span>
                                <span className="text-xs text-orange-600">Due: {formatCurrency(balanceDue)}</span>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 hidden sm:block" />
                          </div>
                        
                        {/* Stage Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center gap-1">
                            {order.stages?.sort((a, b) => a.stage_master.stage_order - b.stage_master.stage_order).map((stage, idx) => (
                              <div
                                key={stage.id}
                                className={`h-2 flex-1 rounded-full ${
                                  stage.status === 'completed' ? 'bg-green-500' :
                                  stage.status === 'in_progress' ? 'bg-blue-500' :
                                  'bg-gray-200'
                                }`}
                                title={stage.stage_master.name}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {order.stages?.filter(s => s.status === 'completed').length || 0} of {order.stages?.length || 10} stages completed
                          </p>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No orders yet</p>
                    <button
                      onClick={() => setShowCreateOrder(true)}
                      className="btn-primary mt-4"
                    >
                      Create First Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Order Detail View */}
          {activeTab === 'users' && selectedUser && selectedOrder && (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {selectedUser.name}&apos;s Orders
              </button>

              {/* Order Overview */}
              <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedOrder.vehicle_name || 'Vehicle Order'}</h2>
                    <p className="text-sm text-gray-500 truncate">Reference: {selectedOrder.referral_code}</p>
                  </div>
                  <button
                    onClick={() => setShowAddExpense(true)}
                    className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="w-5 h-5" />
                    Add Expense
                  </button>
                </div>
                
                {(() => {
                  const totalPaid = (selectedOrder.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0);
                  const balanceDue = selectedOrder.total_price - totalPaid;
                  
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-gray-500">Total Price</p>
                        <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatCurrency(selectedOrder.total_price)}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-green-600">Total Paid</p>
                        <p className="text-lg sm:text-2xl font-bold text-green-700">{formatCurrency(totalPaid)}</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-orange-600">Balance Due</p>
                        <p className="text-lg sm:text-2xl font-bold text-orange-700">{formatCurrency(balanceDue)}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Stages Management */}
              <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Order Stages</h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {selectedOrder.stages?.sort((a, b) => a.stage_master.stage_order - b.stage_master.stage_order).map((stage) => (
                    <div key={stage.id} className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                            stage.status === 'completed' ? 'bg-green-100' :
                            stage.status === 'in_progress' ? 'bg-blue-100' :
                            'bg-gray-100'
                          }`}>
                            {stage.status === 'completed' ? (
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                            ) : stage.status === 'in_progress' ? (
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                            ) : (
                              <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              {stage.stage_master.stage_order}. {stage.stage_master.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">{stage.stage_master.description}</p>
                            {stage.estimated_date && (
                              <p className="text-xs text-blue-600 mt-1">
                                Est: {formatDate(stage.estimated_date)}
                              </p>
                            )}
                            {stage.completed_date && (
                              <p className="text-xs text-green-600 mt-1">
                                Completed: {formatDate(stage.completed_date)}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-11 sm:ml-0 shrink-0">
                          <button
                            onClick={() => {
                              setShowStageEdit(stage);
                              setStageForm({
                                estimated_date: stage.estimated_date || '',
                                notes: stage.notes || ''
                              });
                            }}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          {stage.status !== 'completed' ? (
                            <button
                              onClick={() => handleStageUpdate(stage.stage_id, 'completed')}
                              className="px-3 py-1.5 text-xs sm:text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                            >
                              Complete
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStageUpdate(stage.stage_id, 'pending')}
                              className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              Uncomplete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expenses / Payments */}
              <div className="bg-white rounded-xl shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Expenses / Payments</h3>
                </div>
                
                {selectedOrder.expenses && selectedOrder.expenses.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {selectedOrder.expenses.map((expense) => (
                      <div key={expense.id} className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{expense.category}</p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{expense.description}</p>
                          <p className="text-xs text-gray-400">{formatDate(expense.created_at)}</p>
                        </div>
                        <p className="font-bold text-green-600 shrink-0 text-sm sm:text-base">+ {formatCurrency(expense.amount)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No expenses recorded yet
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Vehicle Inventory</h2>
                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="btn-primary flex items-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-5 h-5" />
                  Add Vehicle
                </button>
              </div>

              {/* Desktop Vehicle Table */}
              <div className="bg-white rounded-xl shadow-soft overflow-hidden hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
                                <p className="text-sm text-gray-500">{vehicle.color}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{vehicle.year}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(vehicle.price)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              vehicle.importStatus === 'available'
                                ? 'bg-green-100 text-green-700'
                                : vehicle.importStatus === 'reserved'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {vehicle.importStatus}
                            </span>
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
              </div>

              {/* Mobile Vehicle Cards */}
              <div className="space-y-3 md:hidden">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="bg-white rounded-xl shadow-soft p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 truncate">{vehicle.brand} {vehicle.model}</p>
                        <p className="text-sm text-gray-500">{vehicle.year} &middot; {vehicle.color}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(vehicle.price)}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            vehicle.importStatus === 'available'
                              ? 'bg-green-100 text-green-700'
                              : vehicle.importStatus === 'reserved'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {vehicle.importStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
              <div className="bg-white rounded-xl shadow-soft p-6">
                <p className="text-gray-600">View all orders in the Users tab by clicking on a user.</p>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Review Management</h2>
              <div className="bg-white rounded-xl shadow-soft divide-y divide-gray-100">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 sm:p-6 flex items-start justify-between">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">{review.customerName}</h4>
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
                        <p className="text-gray-600">&quot;{review.reviewMessage}&quot;</p>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <button className="btn-primary">Save Settings</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Create Order for {selectedUser?.name}</h2>
              <button onClick={() => setShowCreateOrder(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Toyota Prius 2023"
                  value={orderForm.vehicle_name}
                  onChange={(e) => setOrderForm({...orderForm, vehicle_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price (LKR)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g., 5000000"
                  value={orderForm.total_price}
                  onChange={(e) => setOrderForm({...orderForm, total_price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount (LKR)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g., 1000000"
                  value={orderForm.advance_amount}
                  onChange={(e) => setOrderForm({...orderForm, advance_amount: e.target.value})}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowCreateOrder(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleCreateOrder} className="btn-primary flex-1">
                  Create Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add Payment</h2>
              <button onClick={() => setShowAddPayment(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (LKR)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g., 500000"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select
                  className="input-field"
                  value={paymentForm.payment_type}
                  onChange={(e) => setPaymentForm({...paymentForm, payment_type: e.target.value})}
                >
                  <option value="advance">Advance</option>
                  <option value="partial">Partial Payment</option>
                  <option value="final">Final Payment</option>
                  <option value="refund">Refund</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Payment notes..."
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddPayment(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleAddPayment} className="btn-primary flex-1">
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add Expense</h2>
              <button onClick={() => setShowAddExpense(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="input-field"
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="Advance">Advance</option>
                  <option value="LC">LC</option>
                  <option value="LC Commission">LC Commission</option>
                  <option value="Clearing + Logistic">Clearing + Logistic</option>
                  <option value="TAX">TAX</option>
                  <option value="Damage">Damage</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Port handling charges"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (LKR)</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="e.g., 50000"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddExpense(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button onClick={handleAddExpense} className="btn-primary flex-1">
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Stage Modal */}
      {showStageEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit Stage</h2>
              <button onClick={() => setShowStageEdit(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="font-medium text-gray-900">{showStageEdit.stage_master.name}</p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={stageForm.estimated_date}
                  onChange={(e) => setStageForm({...stageForm, estimated_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Stage notes..."
                  value={stageForm.notes}
                  onChange={(e) => setStageForm({...stageForm, notes: e.target.value})}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowStageEdit(null)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button 
                  onClick={() => handleStageUpdate(showStageEdit.stage_id, showStageEdit.status)}
                  className="btn-primary flex-1"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
