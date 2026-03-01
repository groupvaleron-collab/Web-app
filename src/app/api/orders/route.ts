import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

// GET all orders for current user (or all orders for admin)
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const all = searchParams.get('all') === 'true'
    const isAdmin = (session.user as any).role === 'admin'

    let query = supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        vehicle:vehicles(*),
        stages:order_stages(*, stage_master:stages_master!stage_id(*)),
        expenses(*),
        payments(*)
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    // If admin with 'all' flag, get all orders
    if (isAdmin && all) {
      // No filter - get all orders
    } else if (isAdmin && userId) {
      query = query.eq('user_id', userId)
    } else if (!isAdmin) {
      // Regular user can only see their own orders
      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (currentUser) {
        query = query.eq('user_id', currentUser.id)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({ orders: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// CREATE a new order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { user_id, vehicle_id, vehicle_name, total_price, advance_amount } = body
    const isAdmin = (session.user as any).role === 'admin'

    let targetUserId: string

    // Admin can create orders for any user
    if (isAdmin && user_id) {
      targetUserId = user_id
    } else {
      // Get current user
      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      targetUserId = currentUser.id
    }

    // Generate referral code
    const referralCode = `CARZ-${uuidv4().substring(0, 8).toUpperCase()}`

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: targetUserId,
        vehicle_id: vehicle_id || null,
        vehicle_name: vehicle_name || null,
        total_price,
        advance_amount: advance_amount || 0,
        balance_amount: total_price - (advance_amount || 0),
        referral_code: referralCode,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating order:', error)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Update vehicle status if vehicle_id provided
    if (vehicle_id) {
      await supabase
        .from('vehicles')
        .update({ status: 'ordered' })
        .eq('id', vehicle_id)
    }

    // Create expense for advance payment if provided
    if (advance_amount && advance_amount > 0) {
      // Get admin user id for created_by
      const { data: adminUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      await supabase
        .from('expenses')
        .insert({
          order_id: order.id,
          category: 'Advance',
          description: 'Initial advance payment',
          amount: advance_amount,
          currency: 'LKR',
          created_by: adminUser?.id || targetUserId,
        })
    }

    // Note: Order stages are automatically created by database trigger (create_order_stages)

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
