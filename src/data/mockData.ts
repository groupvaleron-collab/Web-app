// Import JSON data
import data from './data.json'

// Types
export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  mileage: number
  transmission: 'Automatic' | 'Manual'
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'
  price: number
  currency: 'USD' | 'LKR'
  images: string[]
  importStatus: 'available' | 'reserved' | 'sold'
  receivedStatus: 'received' | 'shipping' | 'auction' | 'customs'
  engineCapacity: string
  color: string
  grade?: string
  auctionSheet?: string
  conditionReport?: string
  estimatedArrival?: string
  costBreakdown?: CostBreakdown
  features?: string[]
  description?: string
}

export interface CostBreakdown {
  auctionPrice: number
  freightCost: number
  insurance: number
  clearingCharges: number
  registrationCost: number
  tax: number
  otherCharges: number
  totalCost: number
}

export interface Review {
  id: string
  customerName: string
  customerImage?: string
  vehiclePurchased: string
  rating: number
  reviewMessage: string
  purchaseDate: string
  isVerified: boolean
}

export interface Order {
  id: string
  orderId: string
  vehicleId: string
  vehicle: Vehicle
  userId: string
  currentStage: OrderStage
  stages: OrderStageInfo[]
  estimatedDelivery: string
  paymentStatus: 'pending' | 'partial' | 'completed'
  totalAmount: number
  paidAmount: number
  outstandingBalance: number
  documents: Document[]
  notifications: Notification[]
}

export type OrderStage = 
  | 'ordered'
  | 'payment_confirmed'
  | 'shipped'
  | 'arrived_port'
  | 'customs_clearance'
  | 'ready_delivery'
  | 'delivered'

export interface OrderStageInfo {
  stage: OrderStage
  label: string
  date?: string
  completed: boolean
  active: boolean
}

export interface Document {
  id: string
  name: string
  type: 'invoice' | 'shipping_bill' | 'clearance' | 'registration'
  url?: string
  uploadDate?: string
}

export interface Notification {
  id: string
  type: 'status_update' | 'payment_reminder' | 'document_upload'
  message: string
  date: string
  read: boolean
}

// Export data from JSON file
export const vehicles: Vehicle[] = data.vehicles as Vehicle[]
export const reviews: Review[] = data.reviews as Review[]
export const faqs = data.faqs
export const processSteps = data.processSteps
export const features = data.features
export const filterOptions = {
  ...data.filterOptions,
  priceRanges: data.filterOptions.priceRanges.map(range => ({
    ...range,
    max: range.max === 999999999 ? Infinity : range.max
  }))
}

// Mock Orders Data (for dashboard demo - kept here as it references vehicles)
export const mockOrders: Order[] = [
  {
    id: '1',
    orderId: 'ORD-2026-001',
    vehicleId: '2',
    vehicle: vehicles[1],
    userId: 'user123',
    currentStage: 'shipped',
    stages: [
      { stage: 'ordered', label: 'Ordered', date: '2026-01-15', completed: true, active: false },
      { stage: 'payment_confirmed', label: 'Payment Confirmed', date: '2026-01-18', completed: true, active: false },
      { stage: 'shipped', label: 'Shipped', date: '2026-02-01', completed: true, active: true },
      { stage: 'arrived_port', label: 'Arrived at Port', completed: false, active: false },
      { stage: 'customs_clearance', label: 'Customs Clearance', completed: false, active: false },
      { stage: 'ready_delivery', label: 'Ready for Delivery', completed: false, active: false },
      { stage: 'delivered', label: 'Delivered', completed: false, active: false },
    ],
    estimatedDelivery: '2026-03-15',
    paymentStatus: 'partial',
    totalAmount: 5200000,
    paidAmount: 2600000,
    outstandingBalance: 2600000,
    documents: [
      { id: '1', name: 'Invoice', type: 'invoice', url: '#', uploadDate: '2026-01-15' },
      { id: '2', name: 'Shipping Bill', type: 'shipping_bill', url: '#', uploadDate: '2026-02-01' },
    ],
    notifications: [
      { id: '1', type: 'status_update', message: 'Your vehicle has been shipped from Japan!', date: '2026-02-01', read: true },
      { id: '2', type: 'payment_reminder', message: 'Outstanding balance of LKR 2,600,000 due before delivery.', date: '2026-02-15', read: false },
    ],
  },
]
