import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET referral info for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user
    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get completed orders for this user
    const { data: completedOrders } = await supabase
      .from('orders')
      .select('id, referral_code')
      .eq('user_id', currentUser.id)
      .is('deleted_at', null)

    // Get referrals created by this user
    const { data: referrals } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_user_id', currentUser.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      completedOrders,
      referrals,
      referralLink: completedOrders?.[0]?.referral_code 
        ? `${process.env.NEXTAUTH_URL}?ref=${completedOrders[0].referral_code}`
        : null
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
