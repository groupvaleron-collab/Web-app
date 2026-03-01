import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET expenses for an order
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    let query = supabase
      .from('expenses')
      .select(`
        *,
        order:orders(*),
        order_stage:order_stages(*, stage_master:stages_master(*))
      `)
      .order('created_at', { ascending: false })

    if (orderId) {
      query = query.eq('order_id', orderId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching expenses:', error)
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 })
    }

    return NextResponse.json({ expenses: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// CREATE expense (Admin or order owner)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).role === 'admin'
    const body = await request.json()
    const { order_id, order_stage_id, category, description, amount, currency } = body

    // Get current user
    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // If not admin, verify user owns the order
    if (!isAdmin) {
      const { data: order } = await supabase
        .from('orders')
        .select('user_id')
        .eq('id', order_id)
        .single()
      
      if (!order || order.user_id !== currentUser.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    const { data: expense, error } = await supabase
      .from('expenses')
      .insert({
        order_id,
        order_stage_id,
        category,
        description,
        amount,
        currency: currency || 'LKR',
        created_by: currentUser.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating expense:', error)
      return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 })
    }

    return NextResponse.json({ expense }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
