import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET single user by ID (Admin only)
export async function GET(
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

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        *,
        orders:orders(
          *,
          vehicle:vehicles(*, images:vehicle_images(*)),
          stages:order_stages(*, stage_master:stages_master(*)),
          expenses(*),
          payments(*)
        )
      `)
      .eq('id', params.id)
      .is('deleted_at', null)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
