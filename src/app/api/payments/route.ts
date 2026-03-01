import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET payments for an order
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    let query = supabase
      .from('payments')
      .select(`
        *,
        order:orders(*),
        order_stage:order_stages(*, stage_master:stages_master(*))
      `)
      .order('payment_date', { ascending: false })

    if (orderId) {
      query = query.eq('order_id', orderId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching payments:', error)
      return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 })
    }

    return NextResponse.json({ payments: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// CREATE payment (Admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).role === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admin can add payments' }, { status: 403 })
    }

    const body = await request.json()
    const { order_id, order_stage_id, payment_type, amount, currency, notes } = body

    // Get admin user ID
    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!adminUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        order_id,
        order_stage_id,
        payment_type,
        amount,
        currency: currency || 'LKR',
        notes,
        created_by: adminUser.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating payment:', error)
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
    }

    // Update order balance
    const { data: order } = await supabase
      .from('orders')
      .select('advance_amount, total_price')
      .eq('id', order_id)
      .single()

    if (order) {
      const { data: allPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('order_id', order_id)

      const totalPaid = allPayments?.reduce((sum, p) => sum + p.amount, 0) || 0
      
      await supabase
        .from('orders')
        .update({
          advance_amount: totalPaid,
          balance_amount: order.total_price - totalPaid,
        })
        .eq('id', order_id)
    }

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
