import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET single vehicle by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        images:vehicle_images(*)
      `)
      .eq('id', params.id)
      .is('deleted_at', null)
      .single()

    if (error) {
      console.error('Error fetching vehicle:', error)
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// UPDATE vehicle (Admin only)
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
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating vehicle:', error)
      return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 })
    }

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE vehicle (Admin only, soft delete)
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
      .from('vehicles')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting vehicle:', error)
      return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
