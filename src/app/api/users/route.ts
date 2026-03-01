import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET all users (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = (session.user as any).role === 'admin'
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        orders:orders(
          *,
          vehicle:vehicles(*),
          stages:order_stages(*, stage_master:stages_master(*)),
          payments(*),
          expenses(*)
        )
      `)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json({ users: data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
