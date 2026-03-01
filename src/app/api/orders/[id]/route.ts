import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET single order by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        user:users(*),
        vehicle:vehicles(*, images:vehicle_images(*)),
        stages:order_stages(*, stage_master:stages_master(*), payments:payments(*), expenses:expenses(*)),
        expenses(*),
        payments(*)
      `)
      .eq('id', params.id)
      .is('deleted_at', null)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const isAdmin = (session.user as any).role === 'admin'
    
    // Check if user has access to this order
    if (!isAdmin) {
      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!currentUser || order.user_id !== currentUser.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// UPDATE order (admin only for stage changes)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).role === 'admin'
    const body = await request.json()

    // Non-admin users can only update limited fields
    if (!isAdmin) {
      // Remove restricted fields
      delete body.current_stage_id
      delete body.status
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE order (soft delete, admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).role === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { error } = await supabase
      .from('orders')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting order:', error)
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
