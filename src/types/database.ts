// Database Types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          password: string | null
          google_id: string | null
          phone: string | null
          address: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          password?: string | null
          google_id?: string | null
          phone?: string | null
          address?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password?: string | null
          google_id?: string | null
          phone?: string | null
          address?: string | null
          role?: 'user' | 'admin'
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          id: string
          title: string
          brand: string
          model: string
          year: number
          description: string | null
          status: 'available' | 'ordered' | 'sold'
          price: number
          currency: string
          mileage: number | null
          transmission: string | null
          fuel_type: string | null
          engine_capacity: string | null
          color: string | null
          grade: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          title: string
          brand: string
          model: string
          year: number
          description?: string | null
          status?: 'available' | 'ordered' | 'sold'
          price: number
          currency?: string
          mileage?: number | null
          transmission?: string | null
          fuel_type?: string | null
          engine_capacity?: string | null
          color?: string | null
          grade?: string | null
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          brand?: string
          model?: string
          year?: number
          description?: string | null
          status?: 'available' | 'ordered' | 'sold'
          price?: number
          currency?: string
          mileage?: number | null
          transmission?: string | null
          fuel_type?: string | null
          engine_capacity?: string | null
          color?: string | null
          grade?: string | null
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      vehicle_images: {
        Row: {
          id: string
          vehicle_id: string
          image_url: string
          image_type: 'general' | 'special'
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          image_url: string
          image_type?: 'general' | 'special'
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          image_url?: string
          image_type?: 'general' | 'special'
        }
        Relationships: []
      }
      stages_master: {
        Row: {
          id: string
          stage_name: string
          stage_order: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          stage_name: string
          stage_order: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          stage_name?: string
          stage_order?: number
          description?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          user_id: string
          vehicle_id: string
          total_price: number
          advance_amount: number
          balance_amount: number
          current_stage_id: string | null
          referral_code: string
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          vehicle_id: string
          total_price: number
          advance_amount?: number
          balance_amount?: number
          current_stage_id?: string | null
          referral_code?: string
          created_at?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          vehicle_id?: string
          total_price?: number
          advance_amount?: number
          balance_amount?: number
          current_stage_id?: string | null
          referral_code?: string
          updated_at?: string
          deleted_at?: string | null
        }
        Relationships: []
      }
      order_stages: {
        Row: {
          id: string
          order_id: string
          stage_id: string
          status: 'pending' | 'completed'
          completed_date: string | null
          estimated_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          stage_id: string
          status?: 'pending' | 'completed'
          completed_date?: string | null
          estimated_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          stage_id?: string
          status?: 'pending' | 'completed'
          completed_date?: string | null
          estimated_date?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          id: string
          order_id: string
          order_stage_id: string | null
          category: string
          description: string
          amount: number
          currency: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          order_stage_id?: string | null
          category: string
          description: string
          amount: number
          currency?: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          order_stage_id?: string | null
          category?: string
          description?: string
          amount?: number
          currency?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          order_id: string
          order_stage_id: string | null
          payment_type: string
          amount: number
          currency: string
          payment_date: string
          notes: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          order_stage_id?: string | null
          payment_type: string
          amount: number
          currency?: string
          payment_date?: string
          notes?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          order_stage_id?: string | null
          payment_type?: string
          amount?: number
          currency?: string
          payment_date?: string
          notes?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          id: string
          referrer_user_id: string
          referred_user_id: string | null
          referral_code: string
          status: 'pending' | 'completed'
          reward_amount: number | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          referrer_user_id: string
          referred_user_id?: string | null
          referral_code: string
          status?: 'pending' | 'completed'
          reward_amount?: number | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          referrer_user_id?: string
          referred_user_id?: string | null
          referral_code?: string
          status?: 'pending' | 'completed'
          reward_amount?: number | null
          completed_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Extended types for frontend use
export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  address: string | null
  role: 'user' | 'admin'
  created_at: string
  image?: string
}

export interface Vehicle {
  id: string
  title: string
  brand: string
  model: string
  year: number
  description: string | null
  status: 'available' | 'ordered' | 'sold'
  price: number
  currency: string
  mileage: number | null
  transmission: string | null
  fuel_type: string | null
  engine_capacity: string | null
  color: string | null
  grade: string | null
  images?: VehicleImage[]
}

export interface VehicleImage {
  id: string
  vehicle_id: string
  image_url: string
  image_type: 'general' | 'special'
}

export interface StageMaster {
  id: string
  stage_name: string
  stage_order: number
  description: string | null
}

export interface Order {
  id: string
  user_id: string
  vehicle_id: string
  total_price: number
  advance_amount: number
  balance_amount: number
  current_stage_id: string | null
  referral_code: string
  created_at: string
  updated_at: string
  user?: User
  vehicle?: Vehicle
  stages?: OrderStage[]
  expenses?: Expense[]
  payments?: Payment[]
  current_stage?: StageMaster
}

export interface OrderStage {
  id: string
  order_id: string
  stage_id: string
  status: 'pending' | 'completed'
  completed_date: string | null
  notes: string | null
  stage_master?: StageMaster
  payments?: Payment[]
  expenses?: Expense[]
}

export interface Expense {
  id: string
  order_id: string
  order_stage_id: string | null
  category: string
  description: string
  amount: number
  currency: string
  created_by: string
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  order_stage_id: string | null
  payment_type: string
  amount: number
  currency: string
  payment_date: string
  notes: string | null
  created_by: string
}

export interface Referral {
  id: string
  referrer_user_id: string
  referred_user_id: string | null
  referral_code: string
  status: 'pending' | 'completed'
  reward_amount: number | null
  created_at: string
  completed_at: string | null
}

// Default stages
export const DEFAULT_STAGES = [
  { stage_name: 'Requirement Identification', stage_order: 1, description: 'Identify customer requirements and preferences' },
  { stage_name: 'Estimate Price & Advance Payment', stage_order: 2, description: 'Calculate estimated price and collect advance payment' },
  { stage_name: 'Auction Bidding & Purchasing', stage_order: 3, description: 'Participate in auction and purchase vehicle' },
  { stage_name: 'Open LC', stage_order: 4, description: 'Open Letter of Credit for payment' },
  { stage_name: 'Balance Paid', stage_order: 5, description: 'Complete balance payment' },
  { stage_name: 'Arrange Shipment', stage_order: 6, description: 'Arrange shipping logistics' },
  { stage_name: 'Shipped', stage_order: 7, description: 'Vehicle shipped from origin' },
  { stage_name: 'Shipping & Arrived', stage_order: 8, description: 'Vehicle arrived at destination port' },
  { stage_name: 'Custom Clearance', stage_order: 9, description: 'Complete customs clearance process' },
  { stage_name: 'Vehicle Delivery', stage_order: 10, description: 'Vehicle delivered to customer' },
]
